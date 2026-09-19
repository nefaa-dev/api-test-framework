import { z } from 'zod';

export const bookingDatesSchema = z.object({
  checkin: z.string(),
  checkout: z.string(),
});

export const bookingRequestSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number(),
  depositpaid: z.boolean(),
  bookingdates: bookingDatesSchema,
  additionalneeds: z.string().optional(),
});

export const bookingIdSchema = z.object({
  bookingid: z.number(),
});

export const bookingListSchema = z.array(bookingIdSchema);

export const createBookingResponseSchema = z.object({
  bookingid: z.number(),
  booking: bookingRequestSchema,
});

export type BookingDates = z.infer<typeof bookingDatesSchema>;
export type BookingRequest = z.infer<typeof bookingRequestSchema>;
export type BookingId = z.infer<typeof bookingIdSchema>;
export type CreateBookingResponse = z.infer<typeof createBookingResponseSchema>;
