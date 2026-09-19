import { HttpClient } from '@clients/http-client';
import { test, expect } from '@fixtures';

test.describe('Health check', () => {
  test('GET /ping should return 201 Created', { tag: '@smoke' }, async ({ request }) => {
    const client = new HttpClient(request);
    const response = await client.get('/ping');

    expect(response.status()).toBe(201);
    expect(await response.text()).toContain('Created');
  });
});
