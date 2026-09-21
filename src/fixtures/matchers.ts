import { expect as baseExpect, APIResponse } from '@playwright/test';
import { getTiming } from '@utils/response-timing';

export const expect = baseExpect.extend({
  async toHaveStatus(response: APIResponse, expected: number) {
    const actual = response.status();
    const pass = actual === expected;
    if (pass) {
      return { pass, message: () => `Expected status not to be ${expected}` };
    }
    const body = await response.text();
    return {
      pass,
      message: () => `Expected status ${expected} but received ${actual}\nResponse body:\n${body}`,
    };
  },

  toRespondWithin(response: APIResponse, maxMs: number) {
    const actual = getTiming(response);
    if (actual === undefined) {
      return {
        pass: false,
        message: () => 'No timing recorded for this response — was it sent via HttpClient?',
      };
    }
    const pass = actual <= maxMs;
    return {
      pass,
      message: () =>
        pass
          ? `Expected response NOT to complete within ${maxMs}ms (took ${actual}ms)`
          : `Expected response within ${maxMs}ms but it took ${actual}ms`,
    };
  },
});

declare module '@playwright/test' {
  interface Matchers<R> {
    toHaveStatus(expected: number): Promise<R>;
    toRespondWithin(maxMs: number): R;
  }
}
