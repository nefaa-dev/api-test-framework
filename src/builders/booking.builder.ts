import { faker } from '@faker-js/faker';
import { BookingRequest } from '@models';

export class BookingBuilder {
    private booking: BookingRequest;

    constructor() {
        const checkin = faker.date.soon({ days: 30 });
        const checkout = faker.date.soon({ days: 30, refDate: checkin });

        this.booking = {
            firstname: faker.person.firstName(),
            lastname: faker.person.lastName(),
            totalprice: faker.number.int({ min: 50, max: 2000}),
            depositpaid: faker.datatype.boolean(),
            bookingdates: {
                checkin: checkin.toISOString().split('T')[0],
                checkout: checkout.toISOString().split('T')[0],
            },
            additionalneeds: faker.helpers.arrayElement(['Breakfast', 'Lunch', 'Dinner', 'Parking']),
        };
    }

    withFirstName(firstname: string): this {
          this.booking.firstname = firstname;
          return this;  
    }
    
    withLastName(lastname: string): this {
        this.booking.lastname = lastname;
        return this;
    }

    withPrice(totalprice: number): this {
        this.booking.totalprice = totalprice;
        return this;
    }

    withDepositPaid(depositpaid: boolean): this {
        this.booking.depositpaid = depositpaid;
        return this;
    }

    withDates(checkin: string, checkout: string): this {
        this.booking.bookingdates = { checkin, checkout };
        return this;
    }

    withAdditionalNeeds(additionalneeds: string): this {
        this.booking.additionalneeds = additionalneeds;
        return this;
    }

    build(): BookingRequest {
        return { ...this.booking };
    }
}

export const aBooking = (): BookingBuilder => new BookingBuilder();