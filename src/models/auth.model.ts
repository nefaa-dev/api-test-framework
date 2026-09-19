import { z } from 'zod';

export const authRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const authResponseSchema = z.object({
  token: z.string(),
});

export type AuthRequest = z.infer<typeof authRequestSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
