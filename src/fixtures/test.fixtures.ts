import { test as base } from '@playwright/test';
import { HttpClient } from '@clients/http-client';
import { AuthService, BookingService } from '@services';

export interface ServiceFixtures {
    httpClient: HttpClient;
    authService: AuthService;
    bookingService: BookingService;
}

export const test = base.extend<ServiceFixtures>({
    httpClient: async ({ request }, use) => {
        await use(new HttpClient(request));
    },
    authService: async ({ httpClient }, use) => {
        await use(new AuthService(httpClient));
    },
    bookingService: async ({ httpClient }, use) => {
        await use(new BookingService(httpClient));
    },
});

export { expect } from '@playwright/test';