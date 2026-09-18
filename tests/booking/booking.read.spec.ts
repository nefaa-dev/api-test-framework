import { aBooking } from '@builders';
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

    test('GET /booking/:id returns a single booking', async ({ 
        bookingService,
        bookingFactory,
     }) => {
        const created = await bookingFactory.create(aBooking().withFirstName('Marie').build());
        
        const response = await bookingService.getById(created.bookingid);

        await expect(response).toHaveStatus(200);
        const booking = validateSchema(bookingRequestSchema, await response.json());
        expect(booking.firstname).toBe('Marie');

  });
})