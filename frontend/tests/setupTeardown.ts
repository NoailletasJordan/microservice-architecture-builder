import { test as base, expect } from '@playwright/test'
import { parse } from 'dotenv'
import { readFileSync } from 'fs'
import {
  GenericContainer,
  Network,
  StartedTestContainer,
  Wait,
} from 'testcontainers'
import { v4 as uuid } from 'uuid'

// Global setup / teardown for all test
// https://playwright.dev/docs/test-fixtures#adding-global-beforeallafterall-hookss
export const testWithBackend = base.extend<any, { forEachWorker: void }>({
  forEachWorker: [
    async (_, use) => {
      // Load environment variables
      const envFileContent = readFileSync('../.env', 'utf-8')
      const envVars = parse(envFileContent)

      // Start postgres container
      const network = await new Network({ nextUuid: uuid }).start()
      const postgresContainer = await new GenericContainer('postgres:latest')
        .withExposedPorts(5432)
        .withEnvironment(envVars)
        .withWaitStrategy(
          Wait.forLogMessage('database system is ready to accept connections'),
        )
        .withNetwork(network)
        .withNetworkAliases('db_local')
        .start()

      // Start postgres logs
      const postgresLogs = await postgresContainer.logs()
      postgresLogs.on('data', (chunk) =>
        console.log('postgres', chunk.toString()),
      )
      postgresLogs.on('error', (err) => console.error('postgres', err))
      postgresLogs.on('close', () => console.log('postgres Stream closed'))

      // Start api container
      const apiContainer = await GenericContainer.fromDockerfile(
        '../backend/',
        'Dockerfile',
      ).build()

      // Start api logs
      apiContainer.withLogConsumer((stream) => {
        stream.on('data', (chunk) => console.log('backend', chunk.toString()))
        stream.on('error', (err) => console.error('backend', err))
        stream.on('close', () => {
          console.log('backend Stream closed')
        })
      })

      let startedBackendContainer: StartedTestContainer | undefined
      try {
        startedBackendContainer = await apiContainer
          .withEnvironment({ ...envVars, MOCK_OAUTH: 'true' })
          .withExposedPorts(8080)
          .withWaitStrategy(Wait.forLogMessage('Server starting on port :8080'))
          .withNetwork(network)
          .start()

        // overwrite api url
        process.env.VITE_API_URL = `http://${startedBackendContainer.getHost()}:${startedBackendContainer.getMappedPort(
          8080,
        )}`
      } catch (e) {
        console.error('❌ Backend container failed to start:', e)
      }

      // healthCheck
      const res = await fetch(`${process.env.VITE_API_URL}/ping`)
      expect(res.ok).toBeTruthy()

      await use()
      await startedBackendContainer?.stop()
      await postgresContainer.stop()
    },
    { scope: 'worker', auto: true },
  ], // automatically starts for every worker.
})
