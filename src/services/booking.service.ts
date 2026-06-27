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


}