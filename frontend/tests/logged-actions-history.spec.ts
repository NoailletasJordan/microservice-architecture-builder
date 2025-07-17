import {
  expect,
  PlaywrightTestArgs,
  test as testNonLogged,
} from '@playwright/test'
import { isMacOs } from 'react-device-detect'
import {
  createNewNode,
  getBoardsSubMenuLocator,
  getButtonRedoLocator,
  getButtonUndoLocator,
  getLoadButtonLocator,
  getLogoutButtonLocator,
  getNewBoardButtonLocator,
  getNodesLocator,
  getSettingsButtonLocator,
  initialTwoNodesSetup,
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

      await expectToBeTrueFor2s(async () => {
        return (
          (await undoButton.isDisabled()) && (await redoButton.isDisabled())
        )
      })
    },
  ],
  [
    'should revert to previous state, then rego to next state',
    async ({ page }) => {
      await page.goto('/')
      const undoButton = getButtonUndoLocator({ page })
      const redoButton = getButtonRedoLocator({ page })

      await createNewNode({
        page,
        coordonate: [300, 300],
        serviceType: 'frontend',
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
      await page.goto('/')
      await createNewNode({
        page,
        coordonate: [300, 300],
        serviceType: 'frontend',
      })

      await page.waitForTimeout(debounceActionMS)

      await createNewNode({
        page,
        coordonate: [600, 300],
        serviceType: 'frontend',
      })
      await page.waitForTimeout(debounceActionMS)

      const undoButton = getButtonUndoLocator({ page })
      const redoButton = getButtonRedoLocator({ page })

      await expect(undoButton).not.toBeDisabled()

      await undoButton.click()
      await expect(redoButton).not.toBeDisabled()
      await expect(undoButton).not.toBeDisabled()

      await createNewNode({
        page,
        coordonate: [600, 600],
        serviceType: 'frontend',
      })

      await page.waitForTimeout(debounceActionMS)
      await expect(redoButton).toBeDisabled()
    },
  ],
]

toDoTwice.forEach(([testName, testFn]) => {
  testLogged(`logged: ${testName}`, testFn)
  testNonLogged(`not-logged: ${testName}`, testFn)
})

testLogged(
  'logged: should disable history buttons when switching to other boards',
  async ({ page }) => {
    await createNewNode({
      page,
      coordonate: [300, 300],
      serviceType: 'frontend',
    })

    await page.waitForTimeout(debounceActionMS)

    const undoButton = getButtonUndoLocator({ page })
    const redoButton = getButtonRedoLocator({ page })
    await expect(undoButton).not.toBeDisabled()

    await testLogged.step('on new empty board', async () => {
      await getSettingsButtonLocator({ page }).click()
      await getNewBoardButtonLocator({ page }).hover()
      await page.getByRole('menuitem', { name: 'Empty board' }).click()

      await expectToBeTrueFor2s(async () => {
        return (
          (await undoButton.isDisabled()) && (await redoButton.isDisabled())
        )
      })
    })

    await initialTwoNodesSetup({ page })
    await page.waitForTimeout(debounceActionMS)

    await testLogged.step('on new duplicate board', async () => {
      await getSettingsButtonLocator({ page }).click()
      await getNewBoardButtonLocator({ page }).hover()
      await page
        .getByRole('menuitem', { name: 'Duplicate current board' })
        .click()

      await expectToBeTrueFor2s(async () => {
        return (
          (await undoButton.isDisabled()) && (await redoButton.isDisabled())
        )
      })
    })

    await testLogged.step('on new load previous board', async () => {
      await createNewNode({
        page,
        coordonate: [300, 300],
        serviceType: 'frontend',
      })
      await page.waitForTimeout(debounceActionMS)
      await getSettingsButtonLocator({ page }).click()
      await getLoadButtonLocator({ page }).hover()
      await getBoardsSubMenuLocator({ page }).nth(2).click()

      await expectToBeTrueFor2s(async () => {
        return (
          (await undoButton.isDisabled()) && (await redoButton.isDisabled())
        )
      })
    })
  },
)

testLogged('logged: should erase history on logout', async ({ page }) => {
  await createNewNode({
    page,
    coordonate: [300, 300],
    serviceType: 'frontend',
  })

  await page.waitForTimeout(debounceActionMS)

  await getSettingsButtonLocator({ page }).click()
  await getLogoutButtonLocator({ page }).click()
  const undoButton = getButtonUndoLocator({ page })

  await expect(undoButton).toBeDisabled()
})

testNonLogged(
  'not-logged: should undo and redo using keyboard shortcuts',
  async ({ page, browserName }) => {
    testNonLogged.skip(browserName === 'webkit', 'Failing on tests')

    await page.goto('/')
    await createNewNode({
      page,
      coordonate: [300, 300],
      serviceType: 'frontend',
    })

    await page.waitForTimeout(debounceActionMS)

    await expect(getButtonUndoLocator({ page })).not.toBeDisabled()
    await expect(getButtonRedoLocator({ page })).toBeDisabled()
    const nodes = getNodesLocator({ page })
    await page.keyboard.press(isMacOs ? 'Command+z' : 'Control+z')
    await expect(nodes).toHaveCount(0)

    await page.keyboard.press(isMacOs ? 'Command+Shift+z' : 'Control+y')
    await expect(nodes).toHaveCount(1)
  },
)

async function expectToBeTrueFor2s(callback: () => Promise<boolean>) {
  return new Promise((resolve) => {
    let passed = true
    const interval = setInterval(async () => {
      if (!(await callback())) {
        passed = false
      }
    }, 100)

    setTimeout(() => {
      clearInterval(interval)
      expect(passed).toBe(true)
      resolve(null)
    }, 2000)
  })
}
