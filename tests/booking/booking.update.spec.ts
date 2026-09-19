import { test, expect } from '@fixtures';
import { aBooking } from '@builders';
import { bookingRequestSchema } from '@models';
import { validateSchema } from '@utils/schema-validator';

test.describe('Booking - update', () => {
  test('PUT /booking/:id fully updates an existing booking', async ({
    bookingService,
    bookingFactory,
    authToken,
  }) => {
    const { bookingid } = await bookingFactory.create();

    const changes = aBooking().withFirstName('Ada').withLastName('Lovelace').withPrice(999).build();
    const response = await bookingService.update(bookingid, changes, authToken);

    expect(response.status()).toBe(200);
    const body = validateSchema(bookingRequestSchema, await response.json());
    expect(body.firstname).toBe('Ada');
    expect(body.lastname).toBe('Lovelace');
    expect(body.totalprice).toBe(999);
  });

  test('PATCH /booking/:id changes only the supplied fields', async ({
    bookingService,
    bookingFactory,
    authToken,
  }) => {
    const { bookingid, booking } = await bookingFactory.create();

    const response = await bookingService.partialUpdate(
      bookingid,
      { firstname: 'Grace' },
      authToken,
    );

    await expect(response).toHaveStatus(200);
    const body = validateSchema(bookingRequestSchema, await response.json());
    expect(body.firstname).toBe('Grace');
    expect(body.lastname).toBe(booking.lastname); // untouched field preserved
  });

  test('PUT /booking/:id without a valid token is forbidden', async ({
    bookingService,
    bookingFactory,
  }) => {
    const { bookingid } = await bookingFactory.create();

    const response = await bookingService.update(bookingid, aBooking().build(), 'not-a-real-token');

    await expect(response).toHaveStatus(403);
  });
});
