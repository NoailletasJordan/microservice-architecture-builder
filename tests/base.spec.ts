import { expect, test } from '@playwright/test'
import { checkInitialSetup, initialTwoNodesSetup } from './helpers'

test.describe('Onboarding', () => {
  test('should display and navigate through onboarding modal', async ({
    page,
  }) => {
    await page.goto('/')

    const demoButton = page.getByLabel(/watch demo/i)
    await demoButton.click()

    const modal = page.getByLabel(/onboarding-modal/i)
    expect(await modal.count()).toBeTruthy()

    const nextButton = modal.getByLabel(/primary-action/i)
    await expect(nextButton).toBeVisible()

    await nextButton.click()
    const updatedNextButton = modal.getByLabel(/primary-action/i)
    await expect(updatedNextButton).toContainText('Next')
  })
})

test.describe('Board State - Basic', () => {
  test('should display empty board message when sharing', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Share' }).click()
    await expect(page.getByText('Empty Board')).toBeVisible()
  })
})

test.describe('Board State - With Nodes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await initialTwoNodesSetup({ page })
  })

  test('should persist board state after page reload', async ({
    page,
    browser,
  }) => {
    await page.close()
    const context = await browser.newContext()
    const initialPage = await context.newPage()
    await initialPage.goto('/')
    await initialTwoNodesSetup({ page: initialPage })
    // In-app debounce Timeout to save in localStorage
    await initialPage.waitForTimeout(1000)
    await initialPage.close()

    const reloadedPage = await context.newPage()
    await reloadedPage.goto('/')
    await checkInitialSetup({ page: reloadedPage })

    await reloadedPage.close()
    await context.close()
  })

  test('should delete a node', async ({ page }) => {
    const nodeToDelete = page.getByLabel('node-type-server')
    await expect(nodeToDelete).toBeVisible()
    await nodeToDelete.hover()

    await page.waitForTimeout(1500)

    const deleteButton = page
      .getByTestId(/node-delete/)
      .filter({ visible: true })
      .first()
    await expect(deleteButton).toBeVisible()

    await deleteButton.hover()
    await deleteButton.click()

    await expect(page.getByLabel(/node-type-/)).toHaveCount(1)
  })

  test('should delete an edge', async ({ page }) => {
    const edge = page.getByTestId(/rf__edge/)
    await edge.click({ force: true })

    const deleteEdgeButton = page.getByTestId(/delete-edge/)
    await deleteEdgeButton.waitFor({ state: 'visible' })
    await deleteEdgeButton.click()

    await expect(page.getByLabel('edge')).toHaveCount(0)
  })

  test('should reset board', async ({ page }) => {
    await page.getByTestId('button-settings').click()
    await page.getByText('Reset the board').click()
    await page.getByRole('button', { name: 'Yes, reset the board' }).click()
    await page.getByRole('button', { name: 'Share' }).click()
    await page.waitForTimeout(400)
    await expect(page.getByText(/Please add services/i)).toBeVisible()
  })
})

test('should load a sharable link', async ({ page }) => {
  await page.goto(
    '/#json=%7B%22nodes%22%3A%5B%7B%22id%22%3A%221200e09f-e529-424d-9aa3-6ad13a86eeb2%22%2C%22type%22%3A%22service%22%2C%22position%22%3A%7B%22x%22%3A477.9453125%2C%22y%22%3A253.3125%7D%2C%22data%22%3A%7B%22id%22%3A%221200e09f-e529-424d-9aa3-6ad13a86eeb2%22%2C%22serviceIdType%22%3A%22frontend%22%2C%22title%22%3A%22Frontend%22%2C%22subServices%22%3A%5B%5D%2C%22note%22%3A%22%22%7D%2C%22width%22%3A210%2C%22height%22%3A72%2C%22positionAbsolute%22%3A%7B%22x%22%3A477.9453125%2C%22y%22%3A253.3125%7D%2C%22selected%22%3Atrue%2C%22dragging%22%3Afalse%7D%2C%7B%22id%22%3A%22481d0ebf-d0ed-4bd4-8970-b92bf585b22b%22%2C%22type%22%3A%22service%22%2C%22position%22%3A%7B%22x%22%3A986.4296875%2C%22y%22%3A254.0625%7D%2C%22data%22%3A%7B%22id%22%3A%22481d0ebf-d0ed-4bd4-8970-b92bf585b22b%22%2C%22serviceIdType%22%3A%22server%22%2C%22title%22%3A%22Server%22%2C%22subServices%22%3A%5B%5D%2C%22note%22%3A%22%22%7D%2C%22width%22%3A210%2C%22height%22%3A72%2C%22selected%22%3Afalse%2C%22positionAbsolute%22%3A%7B%22x%22%3A986.4296875%2C%22y%22%3A254.0625%7D%2C%22dragging%22%3Afalse%7D%5D%2C%22edges%22%3A%5B%7B%22id%22%3A%22713472e7-2f41-4e52-9bf9-2868d03345c3%22%2C%22source%22%3A%221200e09f-e529-424d-9aa3-6ad13a86eeb2%22%2C%22target%22%3A%22481d0ebf-d0ed-4bd4-8970-b92bf585b22b%22%2C%22sourceHandle%22%3A%22r%22%2C%22targetHandle%22%3A%22l%22%2C%22type%22%3A%22custom%22%2C%22data%22%3A%7B%22id%22%3A%22713472e7-2f41-4e52-9bf9-2868d03345c3%22%2C%22direction%22%3A%22duplex%22%2C%22note%22%3A%22%22%7D%2C%22selected%22%3Afalse%7D%5D%7D',
  )
  await page.waitForTimeout(2000)
  const lineInbetween = page.getByLabel('edge').first()
  await expect(lineInbetween).toBeVisible()
})
