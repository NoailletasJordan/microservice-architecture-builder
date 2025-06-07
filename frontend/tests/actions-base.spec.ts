import { expect, test } from '@playwright/test'
import { parse } from 'dotenv'
import { readFileSync } from 'fs'
import { GenericContainer, Network, Wait } from 'testcontainers'
import { v4 as uuid } from 'uuid'

test('should display and navigate through onboarding modal', async ({
  page,
}) => {
  const envFileContent = readFileSync('../.env', 'utf-8')
  const envVars = parse(envFileContent)

  const network = await new Network({ nextUuid: uuid }).start()

  const postgresContainer = await new GenericContainer('postgres:latest')
    .withExposedPorts(5432)
    .withEnvironment(envVars)
    .withWaitStrategy(
      Wait.forLogMessage('database system is ready to accept connections'),
    )
    .withNetwork(network)
    .start()

  const stram = await postgresContainer.logs()

  stram.on('data', (chunk) => {
    console.log('postgres', chunk.toString())
  })
  stram.on('error', (err) => {
    console.error('postgres', err)
  })
  stram.on('close', () => {
    console.log('postgres Stream closed')
  })

  const backendContainer = await GenericContainer.fromDockerfile(
    '../backend/',
    'Dockerfile',
  ).build()

  backendContainer.withLogConsumer((stream) => {
    stream.on('data', (chunk) => {
      console.log('backend', chunk.toString())
    })
    stream.on('error', (err) => {
      console.error('backend', err)
    })
    stream.on('close', () => {
      console.log('backend Stream closed')
    })
  })

  try {
    const startedBackendContainer = await backendContainer
      .withEnvironment({ ...envVars })
      .withExposedPorts(8080)
      .withWaitStrategy(Wait.forLogMessage('Server starting on port :8080'))
      .withNetwork(network)
      .start()

    // await startedBackendContainer.stop()
  } catch (e) {
    console.error('❌ Container failed to start:', e)
  }

  await page.goto('/')

  const demoButton = page.getByLabel(/watch demo/i)
  await demoButton.click()

  const modal = page.getByLabel(/onboarding-modal/i)
  expect(await modal.count()).toBeTruthy()

  const nextButton = modal.getByLabel(/primary-action/i)
  await expect(nextButton).toBeVisible()
})

test('should load a sharable link', async ({ page }) => {
  await page.goto(
    '/#json=%7B%22nodes%22%3A%5B%7B%22id%22%3A%221200e09f-e529-424d-9aa3-6ad13a86eeb2%22%2C%22type%22%3A%22service%22%2C%22position%22%3A%7B%22x%22%3A477.9453125%2C%22y%22%3A253.3125%7D%2C%22data%22%3A%7B%22id%22%3A%221200e09f-e529-424d-9aa3-6ad13a86eeb2%22%2C%22serviceIdType%22%3A%22frontend%22%2C%22title%22%3A%22Frontend%22%2C%22subServices%22%3A%5B%5D%2C%22note%22%3A%22%22%7D%2C%22width%22%3A210%2C%22height%22%3A72%2C%22positionAbsolute%22%3A%7B%22x%22%3A477.9453125%2C%22y%22%3A253.3125%7D%2C%22selected%22%3Atrue%2C%22dragging%22%3Afalse%7D%2C%7B%22id%22%3A%22481d0ebf-d0ed-4bd4-8970-b92bf585b22b%22%2C%22type%22%3A%22service%22%2C%22position%22%3A%7B%22x%22%3A986.4296875%2C%22y%22%3A254.0625%7D%2C%22data%22%3A%7B%22id%22%3A%22481d0ebf-d0ed-4bd4-8970-b92bf585b22b%22%2C%22serviceIdType%22%3A%22server%22%2C%22title%22%3A%22Server%22%2C%22subServices%22%3A%5B%5D%2C%22note%22%3A%22%22%7D%2C%22width%22%3A210%2C%22height%22%3A72%2C%22selected%22%3Afalse%2C%22positionAbsolute%22%3A%7B%22x%22%3A986.4296875%2C%22y%22%3A254.0625%7D%2C%22dragging%22%3Afalse%7D%5D%2C%22edges%22%3A%5B%7B%22id%22%3A%22713472e7-2f41-4e52-9bf9-2868d03345c3%22%2C%22source%22%3A%221200e09f-e529-424d-9aa3-6ad13a86eeb2%22%2C%22target%22%3A%22481d0ebf-d0ed-4bd4-8970-b92bf585b22b%22%2C%22sourceHandle%22%3A%22r%22%2C%22targetHandle%22%3A%22l%22%2C%22type%22%3A%22custom%22%2C%22data%22%3A%7B%22id%22%3A%22713472e7-2f41-4e52-9bf9-2868d03345c3%22%2C%22direction%22%3A%22duplex%22%2C%22note%22%3A%22%22%7D%2C%22selected%22%3Afalse%7D%5D%7D',
  )
  await page.waitForTimeout(2000)
  const lineInbetween = page.getByLabel('edge').first()
  await expect(lineInbetween).toBeVisible()
})

test('should warn user trying to share an empty board', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Share' }).click()
  await expect(page.getByText('Empty Board')).toBeVisible()
})
