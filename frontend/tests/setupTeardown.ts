import { test as base, BrowserContext, expect } from '@playwright/test'
import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { parse } from 'dotenv'
import { readFileSync } from 'fs'
import path from 'path'
import {
  GenericContainer,
  Network,
  StartedTestContainer,
  Wait,
} from 'testcontainers'
import { fileURLToPath } from 'url'
import { v4 as uuid } from 'uuid'

// Global setup / teardown for all test
// Injecting the testcontainer's api url through the window object
export const testWithBackend = base.extend<
  any,
  { startTestContainers: { apiUrl: string } }
>({
  startTestContainers: [
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
            source: path.join(
              path.dirname(fileURLToPath(import.meta.url)),
              '../../postgres/init-db.sh',
            ),
            target: '/docker-entrypoint-initdb.d/init-db.sh',
          },
        ])
        .withNetwork(network)
        .withDatabase('test')
        .start()

      const checkFile = await postgresContainer.exec([
        'test',
        '-f',
        '/docker-entrypoint-initdb.d/init-db.sh',
      ])
      const initFileIsPresentInContainer = checkFile.exitCode === 0
      expect(initFileIsPresentInContainer).toBeTruthy()

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
      let apiUrl = ''
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
        apiUrl = `http://${startedBackendContainer.getHost()}:${startedBackendContainer.getMappedPort(
          8080,
        )}`
      } catch (e) {
        console.error('❌ Backend container failed to start:', e)
      }

      // healthCheck
      const res = await fetch(`${apiUrl}/ping`)
      expect(res.ok).toBeTruthy()

      await use({ apiUrl })
      await startedBackendContainer?.stop()
      await postgresContainer.stop()
    },
    { scope: 'worker', auto: true },
  ],
  injectApiUrl: [
    ({ context, startTestContainers: { apiUrl } }, use) => {
      ;(context as BrowserContext).addInitScript((apiUrl: string) => {
        ;(window as any).__TEST_ENV__ = { VITE_API_URL: apiUrl }
      }, apiUrl)
      use()
    },
    { scope: 'test', auto: true },
  ],
})
