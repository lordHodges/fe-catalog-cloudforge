import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if test.only was accidentally left in code */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter configuration */
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  /* Shared settings for all projects */
  use: {
    /* Base URL for relative page.goto navigation */
    baseURL: process.env.BASE_URL || "http://localhost:4200",
    /* Collect trace when retrying failed tests */
    trace: "on-first-retry",
    /* Capture screenshot on failure */
    screenshot: "only-on-failure",
    /* Capture video on failure */
    video: "retain-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Dev server configuration (starts Angular server if not already running) */
  webServer: process.env.SKIP_WEBSERVER
    ? undefined
    : {
        command: "npm start",
        url: "http://localhost:4200",
        reuseExistingServer: true,
        timeout: 120 * 1000,
      },
});
