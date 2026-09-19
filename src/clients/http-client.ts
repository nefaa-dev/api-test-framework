import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger } from '@utils/logger';

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  data?: unknown;
}

export class HttpClient {
  constructor(private readonly request: APIRequestContext) {}

  async get(endpoint: string, options: RequestOptions = {}): Promise<APIResponse> {
    return this.send('GET', endpoint, () => this.request.get(endpoint, options));
  }

  async post(endpoint: string, options: RequestOptions = {}): Promise<APIResponse> {
    return this.send('POST', endpoint, () => this.request.post(endpoint, options));
  }

  async put(endpoint: string, options: RequestOptions = {}): Promise<APIResponse> {
    return this.send('PUT', endpoint, () => this.request.put(endpoint, options));
  }

  async patch(endpoint: string, options: RequestOptions = {}): Promise<APIResponse> {
    return this.send('PATCH', endpoint, () => this.request.patch(endpoint, options));
  }

  async delete(endpoint: string, options: RequestOptions = {}): Promise<APIResponse> {
    return this.send('DELETE', endpoint, () => this.request.delete(endpoint, options));
  }

  private async send(
    method: string,
    endpoint: string,
    call: () => Promise<APIResponse>,
  ): Promise<APIResponse> {
    const start = Date.now();
    logger.debug(`→ ${method} ${endpoint}`);
    const response = await call();
    const elapsed = Date.now() - start;
    logger.info(`${method} ${endpoint} → ${response.status()} (${elapsed}ms)`);
    return response;
  }
}
