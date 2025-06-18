import { Locator, Page, expect } from '@playwright/test'
import { testIdLogged } from './../src/pages/BoardPage/components/Board/components/Settings/components/BoardTitle/index'

interface DragParameters {
  coordonate: [number, number]
  locator: Locator
}

export const grabElementTo = async (
  page: Page,
  { coordonate, locator }: DragParameters,
) => {
  await locator.hover()
  await page.mouse.down()
  await page.mouse.move(...coordonate)
  await page.mouse.up()
}

interface NodeSetupOptions {
  page: Page
}

export const initialTwoNodesSetup = async ({ page }: NodeSetupOptions) => {
  // Create 'frontend' node
  const frontendIcon = page.locator('#icon-draggable-frontend')
  await expect(frontendIcon).toBeVisible()
  await grabElementTo(page, {
    coordonate: [300, 300],
    locator: frontendIcon,
  })

  // Create 'server' node
  const serverIcon = page.locator('#icon-draggable-server')
  await expect(serverIcon).toBeVisible()
  await grabElementTo(page, {
    coordonate: [600, 300],
    locator: serverIcon,
  })

  await page.waitForTimeout(1000)

  // Get node elements and their handles
  const frontendNode = page.getByLabel('node-type-frontend')
  const serverNode = page.getByLabel('node-type-server')

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
  // const validTokenOauth =
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwNjg1NTgwNzQxMDU0NzE2NTMwMSJ9.sMqtrZQ0dYbSd3x1isUPywg2hawbYZqmwHLBXJVWNyc'
  // await page.goto(`/#auth-token=${validTokenOauth}`)
  // await page.goto(`${apiUrl}/auth/google/callback?code=mock_code`)
  // await page.goto(
  //   `${apiUrl}/auth/google/callback?code=4/0AUJR-x4ZviF6qPoJqf920eFjhWfmishmb6bIESO1Zf2WDtqi5xZkVfM78ZdcFhCoHbNeqA`,
  // )
  await page.getByTestId('button-settings').click()
  await page.getByRole('menuitem', { name: 'Log in with Google' }).click()
  // /auth/google/callback?code=4%2F0AUJR-x4ZviF6qPoJqf920eFjhWfmishmb6bIESO1Zf2WDtqi5xZkVfM78ZdcFhCoHbNeqA&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&authuser=1&prompt=consent
  await expect(page.getByTestId(testIdLogged)).toBeVisible()
}
