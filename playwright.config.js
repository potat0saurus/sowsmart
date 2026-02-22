import { defineConfig, devices } from '@playwright/test'

const STAGING_URL = process.env.STAGING_URL

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // Fail fast in CI — no accidental committed `.only`
  forbidOnly: !!process.env.CI,
  // Retry once on CI to account for flakiness
  retries: process.env.CI ? 1 : 0,
  reporter: [['html'], ['list']],
  use: {
    baseURL: STAGING_URL ?? 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  // When no STAGING_URL is set (local dev), auto-start Vite
  webServer: STAGING_URL ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
