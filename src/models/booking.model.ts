export interface BookingDates {
    checkin: string;
    checkout: string;
}

/** The payload we SEND to create or replace a booking. */
export interface BookingRequest {
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: BookingDates;
    additionalneeds?: string;
}

/** A single id entry returned by GET /booking (the list endpoint). */
export interface BookingId {
    bookingid: number;
}

/** The response from POST /booking - the server wraps our booking and adds an id. */
export interface CreateBookingResponse {
    bookingid: number;
    booking: BookingRequest;
}