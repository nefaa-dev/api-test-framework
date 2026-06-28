import { test, expect } from '@fixtures';
import { bookingListSchema, bookingRequestSchema } from '@models';
import { validateSchema } from '@utils/schema-validator';

test.describe('Booking - read', () => {
    test('GET /booking returns a list of booking ids', async ({ bookingService }) => {
        const response = await bookingService.getAll();

        expect(response.status()).toBe(200);
        const ids = validateSchema(bookingListSchema, await response.json());
        expect(ids.length).toBeGreaterThan(0);
    });

    test('GET /booking/:id returns a single booking', async ({ bookingService }) => {
        const ids = validateSchema(bookingListSchema, await (await bookingService.getAll()).json());
        
        const response = await bookingService.getById(ids[0].bookingid);

        expect(response.status()).toBe(200);
        const booking = validateSchema(bookingRequestSchema, await response.json());
        expect(booking.firstname).toBeTruthy();

  });
})