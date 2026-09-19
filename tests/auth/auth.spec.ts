import { test, expect } from '@fixtures';
import { config } from '@config';
import { AuthResponse, authResponseSchema } from '@models';
import { validateSchema } from '@utils/schema-validator';

test.describe('Auth', () => {
  test('POST /auth returns a token for valid credentials', async ({ authService }) => {
    const response = await authService.generateToken(config.credentials);

    await expect(response).toHaveStatus(200);
    const body = validateSchema(authResponseSchema, await response.json());
    expect(body.token).toBeTruthy();
  });
});
