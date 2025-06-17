import { expect } from '@playwright/test'
import { logInActions } from './helpers'
import { testWithBackend as test } from './setupTeardown'

test('Load button should be disabled', async ({ page }) => {
  await page.goto('/')

  await page.getByTestId('button-settings').click()
  await expect(page.getByRole('menuitem', { name: 'Load' })).toBeDisabled()
})

test('Create New board button should be disabled', async ({ page }) => {
  await page.goto('/')

  await page.getByTestId('button-settings').click()
  await expect(
    page.getByRole('menuitem', { name: 'Create new' }),
  ).toBeDisabled()
})

test('Delete board button should be disabled', async ({ page }) => {
  await page.goto('/')

  await page.getByTestId('button-settings').click()
  await expect(page.getByRole('menuitem', { name: 'Delete' })).toBeDisabled()
})

test('temp', async ({ page, startTestContainers: { apiUrl } }) => {
  await page.goto('/')
  await logInActions({ apiUrl, page })

  await page.getByTestId('button-settings').click()

  const loadButton = page.getByRole('menuitem', { name: 'Load' })
  await expect(loadButton).not.toBeDisabled()
  await loadButton.hover()
  await page.waitForTimeout(100000)
})
