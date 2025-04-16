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

  test('should persist board state after page reload', async ({ context }) => {
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
})
