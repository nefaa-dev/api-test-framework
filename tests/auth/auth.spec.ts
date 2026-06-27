import { test, expect } from '@playwright/test';
import { HttpClient } from '@clients/http-client';
import { AuthService } from '@services';
import { config } from '@config';
import { AuthResponse } from '@models';

test.describe('Auth', () => {
    test('POST /auth returns a token for valid credentials', async ({ request }) => {
        const authService = new AuthService(new HttpClient(request));

        const response = await authService.generateToken(config.credentials);

        expect(response.status()).toBe(200);
        const body = (await response.json()) as AuthResponse;
        expect(body.token).toBeTruthy();
        expect(typeof body.token).toBe('string');
    })
})