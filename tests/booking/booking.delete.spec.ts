import { test, expect } from '@fixtures';
import { aBooking } from '@builders';
import { createBookingResponseSchema } from '@models';
import { validateSchema } from '@utils/schema-validator';

test.describe('Booking - delete', () => {
  test('DELETE /booking/:id removes the booking', async ({ bookingService, authToken }) => {
    // Created directly (not via the factory) because this test deletes it itself —
    // routing it through the factory would make teardown delete an already-gone booking.
    const created = validateSchema(
      createBookingResponseSchema,
      await (await bookingService.create(aBooking().build())).json(),
    );

    const deleteResponse = await bookingService.delete(created.bookingid, authToken);
    expect(deleteResponse.status()).toBe(201); // restful-booker's quirky delete status

    const getResponse = await bookingService.getById(created.bookingid);
    await expect(getResponse).toHaveStatus(404);
  });
});
