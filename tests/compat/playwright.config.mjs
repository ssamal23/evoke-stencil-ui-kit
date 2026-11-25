import { defineConfig } from '@playwright/test';

// BASE_URL and APP are set by scripts/run-compat.mjs (the address and the name of the app under test).
// The checks for each app live in specs/<app>/.
export default defineConfig({
  testDir: `specs/${process.env.APP || 'html'}`,
  timeout: 20_000,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: process.env.RESULTS_JSON || 'results/last.json' }]],
  use: {
    baseURL: process.env.BASE_URL,
    browserName: 'chromium',
    screenshot: 'only-on-failure',
  },
  outputDir: 'test-results',
});
