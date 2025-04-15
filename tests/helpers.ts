import { Locator, Page, expect } from '@playwright/test'

export const grabElementTo = async (
  page: Page,
  {
    coordonate,
    locator,
  }: {
    coordonate: [number, number]
    locator: Locator
  },
) => {
  await locator.hover()
  await page.mouse.down()
  await page.mouse.move(...coordonate)
  await page.mouse.up()
}

export const initialTwoNodesSetup = async ({ page }: { page: Page }) => {
  const iconDraggableFrontend = await page.locator('#icon-draggable-frontend')
  expect(iconDraggableFrontend).toBeVisible()
  await grabElementTo(page, {
    coordonate: [300, 300],
    locator: iconDraggableFrontend,
  })

  const iconDraggableServer = await page.locator('#icon-draggable-server')

  await grabElementTo(page, {
    coordonate: [600, 300],
    locator: iconDraggableServer,
  })

  const nodeFrontend = await page.getByLabel('node-type-frontend')
  const handleFrontend = await nodeFrontend.getByTestId('r')

  const nodeServer = await page.getByLabel('node-type-server')
  const handleServer = await nodeServer.getByTestId('l')

  await expect(handleFrontend).toBeVisible()

  await handleFrontend.hover()
  await page.mouse.down()
  await handleServer.hover()
  await page.mouse.up()
  await checkInitialSetup({ page })
}

export const checkInitialSetup = async ({ page }: { page: Page }) => {
  return await expect(await page.getByLabel('edge').count()).toBeTruthy()
}
