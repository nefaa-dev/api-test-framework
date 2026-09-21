import { APIResponse } from '@playwright/test';

const timings = new WeakMap<APIResponse, number>();

export function recordTiming(response: APIResponse, ms: number): void {
  timings.set(response, ms);
}

export function getTiming(response: APIResponse): number | undefined {
  return timings.get(response);
}