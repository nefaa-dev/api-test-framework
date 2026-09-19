import { HttpClient } from '@clients/http-client';

export abstract class BaseService {
  protected constructor(
    protected readonly client: HttpClient,
    protected readonly basePath: string,
  ) {}

  protected url(path = ''): string {
    return `${this.basePath}${path}`;
  }
}
