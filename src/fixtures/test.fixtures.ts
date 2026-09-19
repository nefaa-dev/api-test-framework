import { test as base } from '@playwright/test';
import { HttpClient } from '@clients/http-client';
import { AuthService, BookingService } from '@services';
import { aBooking } from '@builders';
import { config } from '@config';
import {
  authResponseSchema,
  createBookingResponseSchema,
  BookingRequest,
  CreateBookingResponse,
} from '@models';
import { validateSchema } from '@utils/schema-validator';

export interface BookingFactory {
  create: (booking?: BookingRequest) => Promise<CreateBookingResponse>;
}

export interface ServiceFixtures {
  httpClient: HttpClient;
  authService: AuthService;
  bookingService: BookingService;
  authToken: string;
  bookingFactory: BookingFactory;
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

  authToken: async ({ authService }, use) => {
    const response = await authService.generateToken(config.credentials);
    const { token } = validateSchema(authResponseSchema, await response.json());
    await use(token);
  },

  bookingFactory: async ({ bookingService, authToken }, use) => {
    const createdIds: number[] = [];

    const create = async (
      booking: BookingRequest = aBooking().build(),
    ): Promise<CreateBookingResponse> => {
      const response = await bookingService.create(booking);
      const created = validateSchema(createBookingResponseSchema, await response.json());
      createdIds.push(created.bookingid);
      return created;
    };

    await use({ create });

    // teardown: delete everything this test created, newest first
    for (const id of createdIds.reverse()) {
      await bookingService.delete(id, authToken);
    }
  },
});
