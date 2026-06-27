import { aBooking } from '@builders';
import { test, expect } from '@fixtures';
import { BookingRequest, CreateBookingResponse } from '@models';

test.describe('Booking - create', () => {
  test('POST /booking creates a booking and returns it with an id', async ({ bookingService }) => {
    const newBooking = aBooking().withFirstName('Jim').withPrice(111).build();

    const response = await bookingService.create(newBooking);

    expect(response.status()).toBe(200);
    const created = (await response.json()) as CreateBookingResponse;
    expect(created.bookingid).toBeGreaterThan(0);
    expect(created.booking.firstname).toBe(newBooking.firstname);
  });
});