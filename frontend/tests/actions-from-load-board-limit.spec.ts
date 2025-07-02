import { expect, Page } from '@playwright/test'
import { USER_MAX_BOARD_AMOUNT } from '../src/contants'
import {
  getBoardsSubMenuLocator,
  getLoadButtonLocator,
  getLogoutButtonLocator,
  getNewBoardButtonLocator,
  getNodesLocator,
  getSettingsButtonLocator,
  initialTwoNodesSetup,
  logInActions,
} from './helpers'
import { testWithBackend } from './setupTeardown'

const loadURL =
  '/#json=%7B%22nodes%22%3A%5B%7B%22id%22%3A%221200e09f-e529-424d-9aa3-6ad13a86eeb2%22%2C%22type%22%3A%22service%22%2C%22position%22%3A%7B%22x%22%3A477.9453125%2C%22y%22%3A253.3125%7D%2C%22data%22%3A%7B%22id%22%3A%221200e09f-e529-424d-9aa3-6ad13a86eeb2%22%2C%22serviceIdType%22%3A%22frontend%22%2C%22title%22%3A%22Frontend%22%2C%22subServices%22%3A%5B%5D%2C%22note%22%3A%22%22%7D%2C%22width%22%3A210%2C%22height%22%3A72%2C%22positionAbsolute%22%3A%7B%22x%22%3A477.9453125%2C%22y%22%3A253.3125%7D%2C%22selected%22%3Atrue%2C%22dragging%22%3Afalse%7D%2C%7B%22id%22%3A%22481d0ebf-d0ed-4bd4-8970-b92bf585b22b%22%2C%22type%22%3A%22service%22%2C%22position%22%3A%7B%22x%22%3A986.4296875%2C%22y%22%3A254.0625%7D%2C%22data%22%3A%7B%22id%22%3A%22481d0ebf-d0ed-4bd4-8970-b92bf585b22b%22%2C%22serviceIdType%22%3A%22server%22%2C%22title%22%3A%22Server%22%2C%22subServices%22%3A%5B%5D%2C%22note%22%3A%22%22%7D%2C%22width%22%3A210%2C%22height%22%3A72%2C%22selected%22%3Afalse%2C%22positionAbsolute%22%3A%7B%22x%22%3A986.4296875%2C%22y%22%3A254.0625%7D%2C%22dragging%22%3Afalse%7D%5D%2C%22edges%22%3A%5B%7B%22id%22%3A%22713472e7-2f41-4e52-9bf9-2868d03345c3%22%2C%22source%22%3A%221200e09f-e529-424d-9aa3-6ad13a86eeb2%22%2C%22target%22%3A%22481d0ebf-d0ed-4bd4-8970-b92bf585b22b%22%2C%22sourceHandle%22%3A%22r%22%2C%22targetHandle%22%3A%22l%22%2C%22type%22%3A%22custom%22%2C%22data%22%3A%7B%22id%22%3A%22713472e7-2f41-4e52-9bf9-2868d03345c3%22%2C%22direction%22%3A%22duplex%22%2C%22note%22%3A%22%22%7D%2C%22selected%22%3Afalse%7D%5D%7D'

const getWarningModalLocator = ({ page }: { page: Page }) =>
  page.getByText(/delete one of your current/i)

testWithBackend(
  'should disable menuitem to add board when user reach the limit ',
  async ({ page, context, startTestContainers: { apiUrl } }) => {
    await page.goto('/')
    const { reLogSameUser } = await logInActions({ page })

    for (let i = 0; i < USER_MAX_BOARD_AMOUNT - 1; i++) {
      await getSettingsButtonLocator({ page }).click()
      await getNewBoardButtonLocator({ page }).hover()
      await page.getByRole('menuitem', { name: 'Empty board' }).click()
    }

    await testWithBackend.step(
      'should disable menuitem New board',
      async () => {
        await getSettingsButtonLocator({ page }).click()
        await expect(getNewBoardButtonLocator({ page })).toBeDisabled()
        await getSettingsButtonLocator({ page }).click()
      },
    )

    await testWithBackend.step(
      'should warn user loading load from active page',
      async () => {
        await page.goto(loadURL)
        await expect(getWarningModalLocator({ page })).toHaveCount(1)
      },
    )

    await testWithBackend.step('Close modal and not load board', async () => {
      await page.getByRole('button', { name: 'Close' }).click()
      await expect(getWarningModalLocator({ page })).toHaveCount(0)
      await expect(getNodesLocator({ page })).toHaveCount(0)
    })

    await testWithBackend.step('Have not have added any board', async () => {
      await getSettingsButtonLocator({ page }).click()
      await getLoadButtonLocator({ page }).hover()
      await expect(getBoardsSubMenuLocator({ page })).toHaveCount(
        USER_MAX_BOARD_AMOUNT,
      )
      await getSettingsButtonLocator({ page }).click()
    })

    await testWithBackend.step(
      'Should show max board warning even with localboard conflict',
      async () => {
        await initialTwoNodesSetup({ page })

        await expect(getNodesLocator({ page })).toHaveCount(2)
        await page.goto(loadURL)
        await expect(getWarningModalLocator({ page })).toHaveCount(1)
        await page.getByRole('button', { name: 'Close' }).click()
      },
    )

    await page.close()
    const page2 = await context.newPage()

    await testWithBackend.step(
      'Should load new page and show warning',
      async () => {
        await page2.goto('/')
        await expect(getWarningModalLocator({ page: page2 })).toHaveCount(1)
        await page2.getByRole('button', { name: 'Close' }).click()
      },
    )

    await testWithBackend.step(
      'Should show warning when relogging from a active board',
      async () => {
        await getSettingsButtonLocator({ page: page2 }).click()
        await getLogoutButtonLocator({ page: page2 }).click()
        await initialTwoNodesSetup({ page: page2 })

        await reLogSameUser({ apiUrl })

        await expect(getWarningModalLocator({ page: page2 })).toHaveCount(1)
      },
    )
  },
)
