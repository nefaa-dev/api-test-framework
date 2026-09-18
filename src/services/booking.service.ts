import { APIResponse } from "@playwright/test";
import { BaseService } from "./base.service";
import { HttpClient } from "@clients/http-client";
import { BookingRequest } from "@models";

export class BookingService extends BaseService {
    constructor(client: HttpClient) {
        super(client, '/booking');
    }

    async getAll(): Promise<APIResponse> {
        return this.client.get(this.url());
    }

    async getById(id: number): Promise<APIResponse> {
        return this.client.get(this.url(`/${id}`));
    }

    async create(booking: BookingRequest): Promise<APIResponse> {
        return this.client.post(this.url(), { data: booking});
    }

    async update(id: number, booking: BookingRequest, token: string): Promise<APIResponse> {
        return this.client.put((this.url(`/${id}`)), {
            data: booking,
            headers: { Cookie: `token=${token}`},
        });
    }

    async partialUpdate(
        id: number,
        changes: Partial<BookingRequest>,
        token: string,
    ): Promise<APIResponse>{
        return this.client.patch((this.url(`/${id}`)), {
             data: changes,
             headers: { Cookie: `token=${token}`},
        });
    }

    async delete(id: number, token: string): Promise<APIResponse> {
        return this.client.delete((this.url(`/${id}`)), {
            headers: { Cookie: `token=${token}`},
        });
    }


}