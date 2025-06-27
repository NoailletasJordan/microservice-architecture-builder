import { test as base, BrowserContext } from '@playwright/test'
import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { parse } from 'dotenv'
import { readFileSync } from 'fs'
import path from 'path'
import {
  GenericContainer,
  Network,
  StartedNetwork,
  StartedTestContainer,
  Wait,
} from 'testcontainers'
import { fileURLToPath } from 'url'
import { v4 as uuid } from 'uuid'

// Global setup / teardown for all test
// Injecting the testcontainer's api url through the window object
export const testWithBackend = base.extend<{
  startTestContainers: { apiUrl: string }
  injectApiUrl: void
}>({
  // @ts-expect-error not sure how
  startTestContainers: [
    // https://github.com/microsoft/playwright/issues/14590
    // eslint-disable-next-line
    async ({}, use) => {
      // Load environment variables
      const envFileContent = readFileSync('../.env', 'utf-8')
      const envVars = parse(envFileContent)

      const network = await new Network({ nextUuid: uuid }).start()
      const { postgresContainer, isError: postgresIsError } =
        await startPostgresContainer({ network })

      if (postgresIsError || !postgresContainer) {
        await closeConnections({
          network,
          postgresContainer,
        })
        throw new Error('setupTeardown ❌ abort')
      }

      const {
        isError: mockOauthIsError,
        mockOauthInDockerUrl,
        mockOauthExposedUrl,
        startedMockOauthContainer,
      } = await startMockOauthContainer({
        network,
        envVars,
      })

      if (mockOauthIsError || !startedMockOauthContainer) {
        await closeConnections({
          network,
          postgresContainer,
          startedMockOauthContainer,
        })
        throw new Error('setupTeardown ❌ abort')
      }

      const {
        apiUrl,
        startedBackendContainer,
        isError: backendIsError,
      } = await startBackendContainer({
        network,
        postgresContainer,
        envVars,
        mockOauthInDockerUrl,
        mockOauthExposedUrl,
      })
      if (backendIsError) {
        await closeConnections({
          network,
          startedBackendContainer,
          postgresContainer,
          startedMockOauthContainer,
        })
        throw new Error('setupTeardown ❌ abort')
      }

      await use({ apiUrl })
      await closeConnections({
        network,
        startedBackendContainer,
        postgresContainer,
        startedMockOauthContainer,
      })
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

async function startMockOauthContainer({
  network,
  envVars,
}: {
  network: StartedNetwork
  envVars: Record<string, string>
}) {
  // Start mock oauth container
  const mockOauthContainer = await GenericContainer.fromDockerfile(
    '../mock-oauth/',
    'Dockerfile',
  ).build()

  // Start mock oauth logs
  mockOauthContainer.withLogConsumer((stream) => {
    stream.on('data', (chunk) => console.log('mock-oauth', chunk.toString()))
    stream.on('error', (err) => console.error('mock-oauth', err))
    stream.on('close', () => {
      console.log('mock-oauth Stream closed')
    })
  })

  let mockOauthInDockerUrl = ''
  let mockOauthExposedUrl = ''
  let startedMockOauthContainer: StartedTestContainer | undefined
  let isError = false
  try {
    // Override mock oauth url to use the started container
    startedMockOauthContainer = await mockOauthContainer
      .withNetwork(network)
      .withExposedPorts(6008)
      .withWaitStrategy(Wait.forLogMessage(/Server starting on port/))
      .withEnvironment({
        ...envVars,
        VITE_API_URL: 'http://backend:6006',
      })
      .start()

    const mockOauthContainerName = startedMockOauthContainer
      .getName()
      .replace(/^\//, '')
    mockOauthInDockerUrl = `http://${mockOauthContainerName}:6008`
    mockOauthExposedUrl = `http://localhost:${startedMockOauthContainer.getMappedPort(
      6008,
    )}`
    console.log('mockOauthExposedUrl', mockOauthExposedUrl)
    console.log('mockOauthInDockerUrl', mockOauthInDockerUrl)
    // TODO - separate url for front and api
  } catch (e) {
    console.error('❌ Mock oauth container failed to start:', e)
    isError = true
  }

  return {
    mockOauthInDockerUrl,
    mockOauthExposedUrl,
    startedMockOauthContainer,
    isError,
  }
}

async function startPostgresContainer({
  network,
}: {
  network: StartedNetwork
}) {
  let isError = false
  let postgresContainer: StartedTestContainer | undefined
  try {
    // Start postgres container
    postgresContainer = await new PostgreSqlContainer('postgres:latest')
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
    if (!initFileIsPresentInContainer) throw new Error('Init file not present')
  } catch (e) {
    console.error('❌ Postgres container failed to start:', e)
    isError = true
  }

  return { postgresContainer, isError }
}

async function startBackendContainer({
  network,
  postgresContainer,
  envVars,
  mockOauthInDockerUrl,
  mockOauthExposedUrl,
}: {
  network: StartedNetwork
  postgresContainer: StartedTestContainer
  envVars: Record<string, string>
  mockOauthInDockerUrl: string
  mockOauthExposedUrl: string
}) {
  // Start postgres logs
  const postgresLogs = await postgresContainer.logs()
  postgresLogs.on('data', (chunk) => console.log('postgres', chunk.toString()))
  postgresLogs.on('error', (err) => console.error('postgres', err))
  postgresLogs.on('close', () => console.log('postgres Stream closed'))

  // Start api container
  const apiContainer = await GenericContainer.fromDockerfile(
    '../backend/',
    'Dockerfile.dev',
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
  let isError = false
  try {
    // Override postgres dsn to use the started container
    const postGresContainerName = postgresContainer.getName().replace(/^\//, '')
    const postgresDSN = `postgres://test:test@${postGresContainerName}:5432/test?sslmode=disable`

    startedBackendContainer = await apiContainer
      .withEnvironment({
        ...envVars,
        POSTGRES_DSN: postgresDSN,
        OAUTH_GOOGLE_BASE_URL: mockOauthInDockerUrl,
        OAUTH_GOOGLE_ACCOUNT_BASE_URL: mockOauthExposedUrl,
      })
      .withExposedPorts(6006)
      .withWaitStrategy(Wait.forLogMessage('Server starting on port :6006'))
      .withNetwork(network)
      .start()

    // overwrite api url
    apiUrl = `http://${startedBackendContainer.getHost()}:${startedBackendContainer.getMappedPort(
      6006,
    )}`
  } catch (e) {
    console.error('❌ Backend container failed to start:', e)
    isError = true
  }

  return { apiUrl, startedBackendContainer, isError }
}

async function closeConnections({
  network,
  startedBackendContainer,
  postgresContainer,
  startedMockOauthContainer,
}: {
  network?: StartedNetwork
  startedBackendContainer?: StartedTestContainer
  postgresContainer?: StartedTestContainer
  startedMockOauthContainer?: StartedTestContainer
}) {
  await startedBackendContainer?.stop()
  await postgresContainer?.stop()
  await startedMockOauthContainer?.stop()
  await network?.stop()
}
