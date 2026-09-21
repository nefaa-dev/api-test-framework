import { test, expect } from '@fixtures';

test.describe('Performance', { tag: '@performance' }, () => {
  test('GET /booking responds within its SLA', async ({ bookingService }) => {
    // Warm-up call: the first request after idle can hit a cold start on the
    // shared host. We don't want to measure that, so we throw it away.
    await bookingService.getAll();

    const response = await bookingService.getAll();

    await expect(response).toHaveStatus(200);
    expect(response).toRespondWithin(2000);
  });
});