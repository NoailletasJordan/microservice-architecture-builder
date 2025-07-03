import { expect } from '@playwright/test'
import {
  getBoardsSubMenuLocator,
  getConfirmationDeleteButtonLocator,
  getDeleteButtonLocator,
  getDeletionNotificationLocator,
  getLoadButtonLocator,
  getLoginPushWorkNotificationLocator,
  getLogoutButtonLocator,
  getLogoutNotificationLocator,
  getNewBoardButtonLocator,
  getNodesLocator,
  getSettingsButtonLocator,
  initialTwoNodesSetup,
  logInActions,
} from './helpers'
import { testWithBackend as base } from './setupTeardown'

const test = base.extend<{ other: void }>({
  other: [
    async ({ page }, use) => {
      await page.goto('/')
      await logInActions({ page })
      use()
    },
    { scope: 'test', auto: true },
  ],
})

test('should prevent user from deleting his only board', async ({ page }) => {
  await getSettingsButtonLocator({ page }).click()
  await expect(page.getByRole('menuitem', { name: 'Delete' })).toBeDisabled()
})

test('should start with exactly 1 board on login', async ({ page }) => {
  await getSettingsButtonLocator({ page }).click()

  const loadButton = getLoadButtonLocator({ page })
  await expect(loadButton).not.toBeDisabled()
  await loadButton.hover()
  await expect(getBoardsSubMenuLocator({ page })).toHaveCount(1)
})

test('should be able to create a new board empty', async ({ page }) => {
  await initialTwoNodesSetup({ page })
  await getSettingsButtonLocator({ page }).click()

  const newBoardButton = getNewBoardButtonLocator({ page })
  await expect(newBoardButton).not.toBeDisabled()
  await newBoardButton.hover()
  await page
    .getByRole('menuitem', {
      name: 'Empty board',
    })
    .click()

  await expect(getNodesLocator({ page })).toHaveCount(0)
})

test('should be able to create a new board as duplicate', async ({ page }) => {
  await initialTwoNodesSetup({ page })
  await getSettingsButtonLocator({ page }).click()

  const newBoardButton = getNewBoardButtonLocator({ page })
  await expect(newBoardButton).not.toBeDisabled()
  await newBoardButton.hover()
  await page
    .getByRole('menuitem', {
      name: 'Duplicate current board',
    })
    .click()

  await expect(getNodesLocator({ page })).toHaveCount(2)
})

test('should be able to delete a board', async ({ page }) => {
  const settingsButton = getSettingsButtonLocator({ page })
  await settingsButton.click()

  const newBoardButton = getNewBoardButtonLocator({ page })
  await newBoardButton.hover()
  await page
    .getByRole('menuitem', {
      name: 'Duplicate current board',
    })
    .click()

  await settingsButton.click()
  await getDeleteButtonLocator({ page }).click()
  await getConfirmationDeleteButtonLocator({ page }).click()
  await expect(getDeletionNotificationLocator({ page })).toBeVisible()
})

test('should clear the board on logout', async ({ page }) => {
  await initialTwoNodesSetup({ page })
  const settingsButton = getSettingsButtonLocator({ page })
  await settingsButton.click()

  const newBoardButton = getNewBoardButtonLocator({ page })
  await newBoardButton.hover()
  await page
    .getByRole('menuitem', {
      name: 'Empty board',
    })
    .click()

  await settingsButton.click()
  await getLogoutButtonLocator({ page }).click()
  await expect(getNodesLocator({ page })).toHaveCount(0)
})

test.skip('should maintain cursor position when typing', async ({
  page,
  browserName,
}) => {
  test.skip(browserName === 'webkit', 'Failing on CI')
  const boardTitleInput = page.getByTestId('board-title')
  await boardTitleInput.fill('')
  await boardTitleInput.focus()
  for (const letter of 'test') {
    await boardTitleInput.press(letter)
  }

  await boardTitleInput.press('ArrowLeft')
  await boardTitleInput.press('o')
  await page.waitForTimeout(100)
  await boardTitleInput.press('o')

  expect(boardTitleInput).toHaveValue('tesoot')
})

base('should push unlogged board to login page', async ({ page }) => {
  await page.goto('/')
  await initialTwoNodesSetup({ page })
  await logInActions({ page })

  await expect(getLoginPushWorkNotificationLocator({ page })).toBeVisible()
  await expect(getNodesLocator({ page })).toHaveCount(2)
})

base(
  'should login, create nodes, logout, then login the same user',
  async ({ page, startTestContainers: { apiUrl } }) => {
    await page.goto('/')
    const { reLogSameUser } = await logInActions({ page })
    await initialTwoNodesSetup({ page })

    await getSettingsButtonLocator({ page }).click()
    await getLogoutButtonLocator({ page }).click()
    await expect(getLogoutNotificationLocator({ page })).toBeVisible()

    await reLogSameUser({ apiUrl, page })
    await test.step('should load the previous board', async () => {
      await expect(getNodesLocator({ page })).toHaveCount(2)
    })

    await test.step('should not have created a second board', async () => {
      await getSettingsButtonLocator({ page }).click()
      await getLoadButtonLocator({ page }).hover()
      await expect(getBoardsSubMenuLocator({ page })).toHaveCount(1)
    })
  },
)
