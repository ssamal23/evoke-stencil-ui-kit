import { defineConfig } from '@playwright/test';

// BASE_URL is set by scripts/run-compat.mjs (the address of the app under test).
export default defineConfig({
  testDir: 'specs',
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
