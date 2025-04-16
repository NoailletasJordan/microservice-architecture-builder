import { Locator, Page, expect } from '@playwright/test'

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

  // Get node elements and their handles
  const frontendNode = page.getByLabel('node-type-frontend')
  const serverNode = page.getByLabel('node-type-server')

  await expect(frontendNode).toBeVisible()
  await expect(serverNode).toBeVisible()

  const frontendHandle = frontendNode.getByTestId('r')
  const serverHandle = serverNode.getByTestId('l')

  await expect(frontendHandle).toBeVisible()
  await expect(serverHandle).toBeVisible()

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
