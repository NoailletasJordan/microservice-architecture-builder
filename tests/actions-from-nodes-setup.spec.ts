import { test as base, expect } from '@playwright/test'
import { checkInitialSetup, initialTwoNodesSetup } from './helpers'

const testWithNodesSetup = base.extend({
  page: async ({ page }, use) => {
    await page.goto('/')
    await initialTwoNodesSetup({ page })
    use(page)
  },
})

testWithNodesSetup(
  'should persist board state after page reload',
  async ({ page, browser }) => {
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
  },
)

testWithNodesSetup('should delete a node', async ({ page }) => {
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

testWithNodesSetup('should delete an edge', async ({ page }) => {
  const edge = page.getByTestId(/rf__edge/)
  await edge.click({ force: true })

  const deleteEdgeButton = page.getByTestId(/delete-edge/)
  await deleteEdgeButton.waitFor({ state: 'visible' })
  await deleteEdgeButton.click()

  await expect(page.getByLabel('edge')).toHaveCount(0)
})

testWithNodesSetup('should reset board', async ({ page }) => {
  await page.getByTestId('button-settings').click()
  await page.getByText('Reset the board').click()
  await page.getByRole('button', { name: 'Yes, reset the board' }).click()
  await page.waitForTimeout(100)
  await expect(page.getByTestId(/node-type-/)).toHaveCount(0)
})

testWithNodesSetup('should write a note on NODE', async ({ page }) => {
  const someNode = page.getByLabel(/node-type-/).first()
  await someNode.hover()
  await page.waitForTimeout(700)
  await page.getByLabel('Add a note').first().click()
  const noteInput = page.locator('[data-placeholder]').last()
  await expect(noteInput).toBeVisible()
  const noteValue = 'This is a custom note !'
  await noteInput.fill(noteValue)
  await expect(page.getByText(noteValue)).toBeVisible()
})

testWithNodesSetup('should write a note on EDGE', async ({ page }) => {
  const someEdge = page.getByLabel('edge').first()
  await someEdge.click({ force: true })
  const connextionMenu = page.getByLabel(/connexion-menu/)
  const noteInput = connextionMenu.locator('[data-placeholder]')
  await expect(noteInput).toBeVisible()
  const noteValue = 'This is a custom note !'
  await noteInput.fill(noteValue)
  await expect(page.getByText(noteValue)).toBeVisible()
})
