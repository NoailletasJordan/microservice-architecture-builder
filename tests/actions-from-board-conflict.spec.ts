import { test as base, BrowserContext, expect } from '@playwright/test'
import { initialTwoNodesSetup } from './helpers'

const loadURL =
  '/#json=%7B%22nodes%22%3A%5B%7B%22id%22%3A%221200e09f-e529-424d-9aa3-6ad13a86eeb2%22%2C%22type%22%3A%22service%22%2C%22position%22%3A%7B%22x%22%3A477.9453125%2C%22y%22%3A253.3125%7D%2C%22data%22%3A%7B%22id%22%3A%221200e09f-e529-424d-9aa3-6ad13a86eeb2%22%2C%22serviceIdType%22%3A%22frontend%22%2C%22title%22%3A%22Frontend%22%2C%22subServices%22%3A%5B%5D%2C%22note%22%3A%22%22%7D%2C%22width%22%3A210%2C%22height%22%3A72%2C%22positionAbsolute%22%3A%7B%22x%22%3A477.9453125%2C%22y%22%3A253.3125%7D%2C%22selected%22%3Atrue%2C%22dragging%22%3Afalse%7D%2C%7B%22id%22%3A%22481d0ebf-d0ed-4bd4-8970-b92bf585b22b%22%2C%22type%22%3A%22service%22%2C%22position%22%3A%7B%22x%22%3A986.4296875%2C%22y%22%3A254.0625%7D%2C%22data%22%3A%7B%22id%22%3A%22481d0ebf-d0ed-4bd4-8970-b92bf585b22b%22%2C%22serviceIdType%22%3A%22server%22%2C%22title%22%3A%22Server%22%2C%22subServices%22%3A%5B%5D%2C%22note%22%3A%22%22%7D%2C%22width%22%3A210%2C%22height%22%3A72%2C%22selected%22%3Afalse%2C%22positionAbsolute%22%3A%7B%22x%22%3A986.4296875%2C%22y%22%3A254.0625%7D%2C%22dragging%22%3Afalse%7D%5D%2C%22edges%22%3A%5B%7B%22id%22%3A%22713472e7-2f41-4e52-9bf9-2868d03345c3%22%2C%22source%22%3A%221200e09f-e529-424d-9aa3-6ad13a86eeb2%22%2C%22target%22%3A%22481d0ebf-d0ed-4bd4-8970-b92bf585b22b%22%2C%22sourceHandle%22%3A%22r%22%2C%22targetHandle%22%3A%22l%22%2C%22type%22%3A%22custom%22%2C%22data%22%3A%7B%22id%22%3A%22713472e7-2f41-4e52-9bf9-2868d03345c3%22%2C%22direction%22%3A%22duplex%22%2C%22note%22%3A%22%22%7D%2C%22selected%22%3Afalse%7D%5D%7D'

const testWithFixture = base.extend<{
  page: () => BrowserContext
}>({
  page: async ({ context }, use) => {
    const page1 = await context.newPage()
    await page1.goto('/')
    await initialTwoNodesSetup({ page: page1 })
    await page1.waitForTimeout(1000) // Debounce save wait
    await page1.close()

    const page2 = await context.newPage()
    await page2.goto(loadURL)
    await use(page2)
    await page2.close()
    await context.close()
  },
})

testWithFixture(
  'board Conflict when loading with shareable url',
  async ({ page }) => {
    const warningLabel = page.getByText(/Warning/i)
    await expect(warningLabel).toBeVisible()
  },
)

testWithFixture('load new board scenario', async ({ page }) => {
  await page.getByText(/Load external/i).click()
  await expect(page.getByText(/Warning/i)).toHaveCount(0)

  await page.getByText('Share').click()
  const shareableLinkInput = page.getByTestId('share-link-input')
  await expect(shareableLinkInput).toBeVisible()
  await expect(shareableLinkInput).toHaveValue(new RegExp(loadURL, 'i'))

  const successNotification = page.getByText(/Board loaded successfully/i)
  await expect(successNotification).toBeVisible()
})

testWithFixture('cancel load scenario', async ({ page }) => {
  await page.getByRole('button', { name: 'Cancel' }).click()
  await expect(page.getByText(/Warning/i)).toHaveCount(0)

  // Should NOT print success notification
  await expect(page.getByText(/Board loaded successfully/i)).toHaveCount(0)
})

testWithFixture('on invalid url, should warn and abort', async ({ page }) => {
  const faultyUrl = '/#json=%7B%22nodes%22%3A%5B%7B%22id%22%3A%229d2f99'
  await page.goto(faultyUrl)
  await page.waitForTimeout(700)

  await page.getByRole('button', { name: /Load external/i }).click()
  await expect(page.getByText(/Warning/i)).toHaveCount(0)

  // Should print error notification
  const errorNotification = page.getByText(/Error loading url content/i)
  await expect(errorNotification).toBeVisible()
})
