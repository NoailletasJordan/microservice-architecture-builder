import { expect, test } from '@playwright/test'
import { checkInitialSetup, initialTwoNodesSetup } from './helpers'

test('has viewable onboarding', async ({ page }) => {
  await page.goto('/')

  const watchDemoButton = await page.getByLabel(/watch demo/i)
  await watchDemoButton.click()

  const onboardingModal = await page.getByLabel(/onboarding-modal/i)
  await expect(await onboardingModal.count()).toBeTruthy()

  const primaryAction = await onboardingModal.getByLabel(/primary-action/i)
  await expect(primaryAction).toBeVisible()

  await primaryAction.click()
  const newPrimaryAction = await onboardingModal.getByLabel(/primary-action/i)

  expect(await newPrimaryAction.textContent()).toContain('Next')
})

test('show empty board on share', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Share' }).click()
  expect(await page.getByText('Empty Board')).toBeDefined()
})

test('can create two linked nodes', async ({ page }) => {
  await page.goto('/')
  await initialTwoNodesSetup({ page })
})

test('can persist board on reload', async ({ context }) => {
  const page = await context.newPage()

  await page.goto('/')

  await initialTwoNodesSetup({ page })
  // In-app debounce Timeout to save in localStorage
  await page.waitForTimeout(1000)
  await page.close()

  const pageFromReload = await context.newPage()
  await pageFromReload.goto('/')

  await checkInitialSetup({ page: pageFromReload })

  await pageFromReload.close()
  await context.close()
})
