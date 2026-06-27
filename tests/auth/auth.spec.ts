import { test, expect } from '@fixtures';
import { config } from '@config';
import { AuthResponse } from '@models';

test.describe('Auth', () => {
    test('POST /auth returns a token for valid credentials', async ({ authService }) => {
        const response = await authService.generateToken(config.credentials);

        expect(response.status()).toBe(200);
        const body = (await response.json()) as AuthResponse;
        expect(body.token).toBeTruthy();
        expect(typeof body.token).toBe('string');
    })
})