import { test, expect} from '@playwright/test';

test.describe('Health check', () => {
  test('GET /ping should return 201 Created', async ({ request }) => {
    const response = await request.get('/ping');

    expect(response.status()).toBe(201);
    expect(await response.text()).toContain('Created');
  })


})