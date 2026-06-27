import { test, expect } from '@fixtures';
import { BookingId, BookingRequest } from '@models';

test.describe('Booking - read', () => {
    test('GET /booking returns a list of booking ids', async ({ bookingService }) => {
        const response = await bookingService.getAll();

        expect(response.status()).toBe(200);
        const ids = (await response.json()) as BookingId[];
        expect(Array.isArray(ids)).toBe(true);
        expect(ids.length).toBeGreaterThan(0);
        expect(ids[0]).toHaveProperty('bookingid');
    });

    test('GET /booking/:id returns a single booking', async ({ bookingService }) => {
    const ids = (await (await bookingService.getAll()).json()) as BookingId[];
    const response = await bookingService.getById(ids[0].bookingid);

    expect(response.status()).toBe(200);
    const booking = (await response.json()) as BookingRequest;
    expect(booking).toHaveProperty('firstname');
    expect(booking).toHaveProperty('bookingdates');
  });
})