import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv'
dotenv.config({ path: new URL('../.env', import.meta.url) })

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: 'http://localhost:6005',
    launchOptions: {
      /* Necessary to avoid flakyness */
      slowMo: 100,
    },
    /* Collect trace on failure. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
  },

  timeout: 120 * 1000,
  /* Configure projects for major browsers */
  projects: [
    ...(process.env.CI
      ? []
      : [
          {
            // Chromium causes flaky net::ERR_NETWORK_CHANGED in CI
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
          },
        ]),
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:6005',
    reuseExistingServer: true,
  },
})
