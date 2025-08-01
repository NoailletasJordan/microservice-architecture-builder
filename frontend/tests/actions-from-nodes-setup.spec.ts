import { test as base, expect } from '@playwright/test'
import { primaryActionText as clearActionText } from '../src/pages/BoardPage/components/Board/components/ClearCurrentBoardModal/index'
import { itemLabel as clearItemLabel } from '../src/pages/BoardPage/components/Board/components/Settings/components/Dropdown/components/ClearBoard'
import {
  checkInitialSetup,
  createNewNode,
  getNodeDatabaseLocator,
  getNodeFrontendLocator,
  getNodeServerLocator,
  getNodesLocator,
  getSubserviceLocator,
  grabElementTo,
  initialTwoNodesSetup,
} from './helpers'

const testWithNodes = base.extend<{ setup: void }>({
  setup: [
    async ({ page }, use_) => {
      await page.goto('/')
      await initialTwoNodesSetup({ page })
      use_()
    },
    { auto: true },
  ],
})

testWithNodes(
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

testWithNodes('should delete a node', async ({ page }) => {
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

  await expect(getNodesLocator({ page })).toHaveCount(1)
})

testWithNodes('should delete an edge', async ({ page }) => {
  const edge = page.getByTestId(/rf__edge/)
  await edge.click({ force: true })

  const deleteEdgeButton = page.getByTestId(/delete-edge/)
  await deleteEdgeButton.waitFor({ state: 'visible' })
  await deleteEdgeButton.click()

  await expect(page.getByLabel('edge')).toHaveCount(0)
})

testWithNodes('should reset board', async ({ page }) => {
  await page.getByTestId('button-settings').click()
  await page.getByText(clearItemLabel).click()
  await page
    .getByRole('button', { name: clearActionText, includeHidden: true })
    .click()
  await page.waitForTimeout(100)
  await expect(getNodesLocator({ page })).toHaveCount(0)
})

testWithNodes('should write a note on NODE', async ({ page }) => {
  const someNode = getNodesLocator({ page }).first()
  await someNode.hover()
  await page.waitForTimeout(700)
  await page.getByLabel('Add a note').first().click()
  const noteInput = page.locator('[data-placeholder]').last()
  await expect(noteInput).toBeVisible()
  const noteValue = 'This is a custom note !'
  await noteInput.fill(noteValue)
  await expect(page.getByText(noteValue)).toBeVisible()
})

testWithNodes('should write a note on EDGE', async ({ page }) => {
  const someEdge = page.getByLabel('edge').first()
  await someEdge.click({ force: true })
  const connextionMenu = page.getByLabel(/connexion-menu/)
  const noteInput = connextionMenu.locator('[data-placeholder]')
  await expect(noteInput).toBeVisible()
  const noteValue = 'This is a custom note !'
  await noteInput.fill(noteValue)
  await expect(page.getByText(noteValue)).toBeVisible()
})

const testWithNodesAndSubservice = testWithNodes.extend<{
  createSubservice: void
}>({
  createSubservice: [
    async ({ page }, use) => {
      await createNewNode({
        page,
        coordonate: [900, 300],
        serviceType: 'database',
      })

      await page.waitForTimeout(700)
      const databaseNode = getNodeDatabaseLocator({ page })
      const serverNode = getNodeServerLocator({ page })

      await grabElementTo(page, {
        moveTarget: databaseNode,
        destinationTarget: serverNode,
      })
      await expect(
        getSubserviceLocator({ page, serviceType: 'database' }),
      ).toHaveCount(1)

      use()
    },
    { auto: true },
  ],
})

testWithNodesAndSubservice(
  'should move subservice to another node',
  async ({ page }) => {
    const frontendNode = getNodeFrontendLocator({ page })
    const databaseIconLocator = getSubserviceLocator({
      page,
      serviceType: 'database',
    })
    await databaseIconLocator.nth(0).hover()
    await page.mouse.down()
    await frontendNode.hover()
    await page.mouse.up()
    await expect(databaseIconLocator).toHaveCount(1)
  },
)

testWithNodesAndSubservice(
  'should convert subservice into a service, by dragging it into the board',
  async ({ page }) => {
    const databaseIconLocator = getSubserviceLocator({
      page,
      serviceType: 'database',
    })
    await databaseIconLocator.nth(0).hover()
    await page.mouse.down()
    await page.mouse.move(200, 200, { steps: 5 })
    await page.mouse.up()
    await expect(databaseIconLocator).toHaveCount(0)
    const serverLocator = getNodeServerLocator({ page })
    await expect(serverLocator).toHaveCount(1)
  },
)

testWithNodesAndSubservice(
  'should delete a subservice',
  async ({ page, browserName }) => {
    testWithNodesAndSubservice.skip(
      browserName === 'webkit',
      "Couldn't make it work consistently",
    )
    const databaseIconLocator = getSubserviceLocator({
      page,
      serviceType: 'database',
    })
    const deleteServiceIcon = page.getByTestId('delete-service')

    await grabElementTo(page, {
      moveTarget: databaseIconLocator,
      destinationTarget: deleteServiceIcon,
    })

    await expect(databaseIconLocator).toHaveCount(0)
  },
)
