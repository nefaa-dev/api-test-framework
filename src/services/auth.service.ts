import { APIResponse } from "@playwright/test";
import { BaseService } from "@services/base.service";
import { HttpClient } from "@clients/http-client";
import { AuthRequest } from "@models";

export class AuthService extends BaseService {
    constructor(client: HttpClient){
        super(client, '/auth');
    }

    async generateToken(credentials: AuthRequest): Promise<APIResponse> {
        return this.client.post(this.url(), { data: credentials });
    }
}