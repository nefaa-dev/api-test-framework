import { defineConfig } from '@playwright/test';
import { config } from './src/config';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  timeout: config.apiTimeout,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['allure-playwright', { resultsDir: 'allure-results', detail: true }],
  ],
  use: {
    baseURL: config.baseURL,
    extraHTTPHeaders: {
     'Content-Type': 'application/json',
      Accept: 'application/json',
  },
    trace: 'retain-on-failure',
  },
});
