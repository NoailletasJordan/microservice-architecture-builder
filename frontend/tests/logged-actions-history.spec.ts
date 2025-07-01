import {
  expect,
  PlaywrightTestArgs,
  test as testNonLogged,
} from '@playwright/test'
import {
  getBoardsSubMenuLocator,
  getButtonRedoLocator,
  getButtonUndoLocator,
  getIconFrontendLocator,
  getLoadButtonLocator,
  getLogoutButtonLocator,
  getNewBoardButtonLocator,
  getNodesLocator,
  getSettingsButtonLocator,
  grabElementTo,
  logInActions,
} from './helpers'
import { testWithBackend as base } from './setupTeardown'

const testLogged = base.extend<{ other: void }>({
  other: [
    async ({ page }, use) => {
      await page.goto('/')
      await logInActions({ page })
      use()
    },
    { scope: 'test', auto: true },
  ],
})

const debounceActionMS = 500

const toDoTwice: [string, (arg: PlaywrightTestArgs) => Promise<void>][] = [
  [
    'should disable undo and redo buttons',
    async ({ page }) => {
      await page.goto('/')

      const undoButton = getButtonUndoLocator({ page })
      const redoButton = getButtonRedoLocator({ page })

      await expect(undoButton).toBeDisabled()
      await expect(redoButton).toBeDisabled()
    },
  ],
  [
    'should revert to previous state, then rego to next state',
    async ({ page }) => {
      await page.goto('/')
      const undoButton = getButtonUndoLocator({ page })
      const redoButton = getButtonRedoLocator({ page })

      const frontendIcon = getIconFrontendLocator({ page })
      await frontendIcon.waitFor({ state: 'visible' })
      await grabElementTo(page, {
        coordonate: [300, 300],
        locator: frontendIcon,
      })

      await page.waitForTimeout(debounceActionMS)

      await expect(getNodesLocator({ page })).toHaveCount(1)
      await expect(undoButton).not.toBeDisabled()
      await expect(redoButton).toBeDisabled()

      await undoButton.click()
      await expect(getNodesLocator({ page })).toHaveCount(0)

      await expect(redoButton).not.toBeDisabled()
      await redoButton.click()
      await expect(getNodesLocator({ page })).toHaveCount(1)
    },
  ],
  [
    'should overwrite history forward, after going back and making a new action',
    async ({ page }) => {
      page.goto('/')
      const frontendIcon = getIconFrontendLocator({ page })
      await frontendIcon.waitFor({ state: 'visible' })
      await grabElementTo(page, {
        coordonate: [300, 300],
        locator: frontendIcon,
      })

      await page.waitForTimeout(debounceActionMS)

      await grabElementTo(page, {
        coordonate: [600, 300],
        locator: frontendIcon,
      })
      await page.waitForTimeout(debounceActionMS)

      const undoButton = getButtonUndoLocator({ page })
      const redoButton = getButtonRedoLocator({ page })

      await expect(undoButton).not.toBeDisabled()

      await undoButton.click()
      await expect(redoButton).not.toBeDisabled()
      await expect(undoButton).not.toBeDisabled()

      await grabElementTo(page, {
        coordonate: [600, 600],
        locator: frontendIcon,
      })

      await page.waitForTimeout(debounceActionMS)
      await expect(redoButton).toBeDisabled()
    },
  ],
]

toDoTwice.forEach(([testName, testFn]) => {
  testLogged(`logged-logged: ${testName}`, testFn)
  testNonLogged(`not-logged: ${testName}`, testFn)
})

testLogged(
  'should disable history buttons when switching to other boards',
  async ({ page }) => {
    const frontendIcon = getIconFrontendLocator({ page })
    await frontendIcon.waitFor({ state: 'visible' })
    await grabElementTo(page, {
      coordonate: [300, 300],
      locator: frontendIcon,
    })

    await page.waitForTimeout(debounceActionMS)

    const undoButton = getButtonUndoLocator({ page })
    const redoButton = getButtonRedoLocator({ page })
    await expect(undoButton).not.toBeDisabled()

    await testLogged.step('on new empty board', async () => {
      await getSettingsButtonLocator({ page }).click()
      await getNewBoardButtonLocator({ page }).hover()
      await page.getByRole('menuitem', { name: 'Empty board' }).click()

      await expect(undoButton).toBeDisabled()
      await expect(redoButton).toBeDisabled()
    })

    await testLogged.step('on new duplicate board', async () => {
      await getSettingsButtonLocator({ page }).click()
      await getNewBoardButtonLocator({ page }).hover()
      await page
        .getByRole('menuitem', { name: 'Duplicate current board' })
        .click()

      await expect(undoButton).toBeDisabled()
      await expect(redoButton).toBeDisabled()
    })

    await testLogged.step('on new load previous board', async () => {
      await grabElementTo(page, {
        coordonate: [300, 300],
        locator: frontendIcon,
      })
      await page.waitForTimeout(debounceActionMS)
      await getSettingsButtonLocator({ page }).click()
      await getLoadButtonLocator({ page }).hover()
      await getBoardsSubMenuLocator({ page }).nth(2).click()

      await expect(undoButton).toBeDisabled()
      await expect(redoButton).toBeDisabled()
    })
  },
)

testLogged('should erase history on logout', async ({ page }) => {
  const frontendIcon = getIconFrontendLocator({ page })
  await frontendIcon.waitFor({ state: 'visible' })
  await grabElementTo(page, {
    coordonate: [300, 300],
    locator: frontendIcon,
  })

  await page.waitForTimeout(debounceActionMS)

  await getSettingsButtonLocator({ page }).click()
  await getLogoutButtonLocator({ page }).click()
  const undoButton = getButtonUndoLocator({ page })

  await expect(undoButton).toBeDisabled()
})
