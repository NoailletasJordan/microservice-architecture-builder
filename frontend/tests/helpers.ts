import { Locator, Page, expect } from '@playwright/test'
import { testIdLogged } from './../src/pages/BoardPage/components/Board/components/Settings/components/BoardTitle/index'

export const grabElementTo = async (
  page: Page,
  {
    moveTarget,
    destinationTarget,
  }: { moveTarget: Locator; destinationTarget: Locator },
) => {
  await moveTarget.hover()
  await page.mouse.down()

  const destinationTargetBox = await destinationTarget.boundingBox()
  await page.mouse.move(
    destinationTargetBox!.x + destinationTargetBox!.width / 2,
    destinationTargetBox!.y + destinationTargetBox!.height / 2,
    { steps: 5 },
  )
  await page.mouse.up()
}

interface NodeSetupOptions {
  page: Page
}

export const getSettingsButtonLocator = ({ page }: { page: Page }) =>
  page.getByTestId('button-settings')
export const getNodesLocator = ({ page }: { page: Page }) =>
  page.getByLabel(/node-type-/)
export const getNewBoardButtonLocator = ({ page }: { page: Page }) =>
  page.getByRole('menuitem', { name: 'Create new' })
export const getDeleteButtonLocator = ({ page }: { page: Page }) =>
  page.getByRole('menuitem', { name: 'Delete' })
export const getLoadButtonLocator = ({ page }: { page: Page }) =>
  page.getByRole('menuitem', { name: 'Load' })
export const getConfirmationDeleteButtonLocator = ({ page }: { page: Page }) =>
  page.getByRole('button', { name: 'Yes, delete the board' })
export const getLogoutButtonLocator = ({ page }: { page: Page }) =>
  page.getByRole('menuitem', { name: 'Log out', includeHidden: true })
export const getLoginPushWorkNotificationLocator = ({ page }: { page: Page }) =>
  page.getByText(/created a new board for your active work/)
export const getDeletionNotificationLocator = ({ page }: { page: Page }) =>
  page.getByText(/Successfully deleted/i)
export const getLogoutNotificationLocator = ({ page }: { page: Page }) =>
  page.getByText("You're logged out")
export const getBoardsSubMenuLocator = ({ page }: { page: Page }) =>
  page.getByTestId(/load-board-board/)
export const getNodeServerLocator = ({ page }: { page: Page }) =>
  page.getByLabel(/node-type-server/)
export const getNodeFrontendLocator = ({ page }: { page: Page }) =>
  page.getByLabel(/node-type-frontend/)
export const getNodeDatabaseLocator = ({ page }: { page: Page }) =>
  page.getByLabel(/node-type-database/)
export const getToolbarMenuItemLocator = ({
  page,
  serviceType,
}: {
  page: Page
  serviceType: string
}) => page.getByTestId(`button-menu-item-${serviceType}`)
export const getButtonUndoLocator = ({ page }: { page: Page }) =>
  page.getByRole('button', { name: 'Undo' })
export const getButtonRedoLocator = ({ page }: { page: Page }) =>
  page.getByRole('button', { name: 'Redo' })
export const getBoardLocator = ({ page }: { page: Page }) =>
  page.getByTestId('rf__wrapper')
export const getSubserviceLocator = ({
  page,
  serviceType,
}: {
  serviceType: string
  page: Page
}) => page.getByTestId(`icon-draggable-${serviceType}`)

export const initialTwoNodesSetup = async ({ page }: NodeSetupOptions) => {
  await createNewNode({ page, serviceType: 'frontend', coordonate: [300, 300] })

  await page.waitForTimeout(1000)

  await createNewNode({ page, serviceType: 'server', coordonate: [600, 300] })

  await page.waitForTimeout(1000)

  // Get node elements and their handles
  const frontendNode = getNodeFrontendLocator({ page })
  const serverNode = getNodeServerLocator({ page })

  await frontendNode.waitFor({ state: 'visible', timeout: 10000 })
  await serverNode.waitFor({ state: 'visible', timeout: 10000 })

  const frontendHandle = frontendNode.getByTestId('r')
  const serverHandle = serverNode.getByTestId('l')

  await frontendHandle.waitFor({ state: 'visible', timeout: 10000 })
  await serverHandle.waitFor({ state: 'visible', timeout: 10000 })

  // Create connection between nodes
  await frontendHandle.hover()
  await page.mouse.down()
  await serverHandle.hover()
  await page.mouse.up()

  await checkInitialSetup({ page })
}

export const checkInitialSetup = async ({ page }: NodeSetupOptions) => {
  const edge = page.getByLabel('edge').first()
  await expect(edge).toHaveCount(1)
}

export async function logInActions({ page }: { page: Page }) {
  const listenForCodePromise = new Promise<string>((resolve) => {
    let code: string | null = null
    page.on('response', (response) => {
      const url = response.url()
      if (!code && url.includes('auth/google/callback?code=')) {
        code = url.split('code=')[1]
        resolve(code)
      }
    })
  })

  await getSettingsButtonLocator({ page }).click()
  await page.getByRole('menuitem', { name: 'Log in with Google' }).click()
  await expect(page.getByTestId(testIdLogged)).toBeVisible()

  const code = await listenForCodePromise
  const reLogSameUser = ({ apiUrl, page }: { apiUrl: string; page: Page }) =>
    page.goto(`${apiUrl}/auth/google/callback?code=${code}`)

  return { reLogSameUser }
}

export async function createNewNode({
  page,
  coordonate,
  serviceType,
}: {
  page: Page
  coordonate: [number, number]
  serviceType: string
}) {
  await page.mouse.move(...coordonate)
  await page.mouse.down({ button: 'right' })
  await page.mouse.up({ button: 'right' })
  await getToolbarMenuItemLocator({ page, serviceType }).click()
}
