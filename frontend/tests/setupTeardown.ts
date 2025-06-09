import { test as base, expect } from '@playwright/test'
import { PostgreSqlContainer } from '@testcontainers/postgresql'
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
    // https://github.com/microsoft/playwright/issues/14590
    // eslint-disable-next-line
    async ({}, use) => {
      // Load environment variables
      const envFileContent = readFileSync('../.env', 'utf-8')
      const envVars = parse(envFileContent)

      // Start postgres container
      const network = await new Network({ nextUuid: uuid }).start()
      const postgresContainer = await new PostgreSqlContainer('postgres:latest')
        .withCopyFilesToContainer([
          {
            source: '../../postgres/init-db.sh',
            target: '/docker-entrypoint-initdb.d/init-db.sh',
          },
        ])
        // .withUser('postgres')
        // .withPassword('postgres')
        .withNetwork(network)
        .withDatabase('test')
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
        // Override postgres dsn to use the started container
        const containerName = postgresContainer.getName().replace(/^\//, '')
        const postgresDSN = `postgres://test:test@${containerName}:5432/test?sslmode=disable`

        startedBackendContainer = await apiContainer
          .withEnvironment({
            ...envVars,
            MOCK_OAUTH: 'true',
            POSTGRES_DSN: postgresDSN,
          })
          .withExposedPorts(8080)
          .withWaitStrategy(Wait.forLogMessage('Server starting on port :8080'))
          .withNetwork(network)
          .start()

        // overwrite api url
        process.env.VITE_API_URL = `http://${startedBackendContainer.getHost()}:${startedBackendContainer.getMappedPort(
          8080,
        )}`
        /** Temp */
        console.log('hit:', process.env.VITE_API_URL)
      } catch (e) {
        console.error('❌ Backend container failed to start:', e)
      }

      /** Temp */
      // console.log('env:', process.env)

      // healthCheck
      const res = await fetch(`${process.env.VITE_API_URL}/ping`)
      expect(res.ok).toBeTruthy()

      await use()
      await startedBackendContainer?.stop()
      await postgresContainer.stop()
    },
    { scope: 'worker', auto: true },
  ],
})
