import { expect as baseExpect, APIResponse } from '@playwright/test';

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
});

declare module '@playwright/test' {
  interface Matchers<R> {
    toHaveStatus(expected: number): Promise<R>;
  }
}
