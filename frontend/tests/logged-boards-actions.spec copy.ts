import { expect } from '@playwright/test'
import { logInActions } from './helpers'
import { testWithBackend as test } from './setupTeardown'

test('should prevent user from deleting his only board', async ({ page }) => {
  await page.goto('/')
  await logInActions(page)

  await page.getByTestId('button-settings').click()
  await expect(page.getByRole('menuitem', { name: 'Delete' })).toBeDisabled()
})
