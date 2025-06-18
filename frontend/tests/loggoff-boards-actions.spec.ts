import { expect } from '@playwright/test'
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
