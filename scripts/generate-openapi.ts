import { z } from 'zod';
import { writeFileSync, mkdirSync } from 'node:fs';
import SwaggerParser from '@apidevtools/swagger-parser';
import {
  authRequestSchema,
  authResponseSchema,
  bookingRequestSchema,
  bookingIdSchema,
  createBookingResponseSchema,
} from '../src/models';

function toSchema(schema: z.ZodType): Record<string, unknown> {
  const jsonSchema = z.toJSONSchema(schema) as Record<string, unknown>;
  delete jsonSchema.$schema; // OpenAPI component schemas must not carry $schema
  return jsonSchema;
}

const jsonBody = (ref: string) => ({
  content: { 'application/json': { schema: { $ref: `#/components/schemas/${ref}` } } },
});

const spec = {
  openapi: '3.1.0',
  info: {
    title: 'Restful Booker — consumer contract',
    version: '1.0.0',
    description: 'Generated from the zod schemas in src/models. Do not edit by hand.',
  },
  servers: [{ url: 'https://restful-booker.herokuapp.com' }],
  components: {
    schemas: {
      AuthRequest: toSchema(authRequestSchema),
      AuthResponse: toSchema(authResponseSchema),
      BookingRequest: toSchema(bookingRequestSchema),
      BookingId: toSchema(bookingIdSchema),
      CreateBookingResponse: toSchema(createBookingResponseSchema),
    },
  },
  paths: {
    '/auth': {
      post: {
        summary: 'Create an auth token',
        requestBody: { required: true, ...jsonBody('AuthRequest') },
        responses: { '200': { description: 'Token issued', ...jsonBody('AuthResponse') } },
      },
    },
    '/booking': {
      get: {
        summary: 'List booking ids',
        responses: {
          '200': {
            description: 'Array of booking ids',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/BookingId' } },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a booking',
        requestBody: { required: true, ...jsonBody('BookingRequest') },
        responses: { '200': { description: 'Booking created', ...jsonBody('CreateBookingResponse') } },
      },
    },
    '/booking/{id}': {
      get: {
        summary: 'Get a booking by id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'The booking', ...jsonBody('BookingRequest') },
          '404': { description: 'Booking not found' },
        },
      },
    },
  },
};

async function main(): Promise<void> {
  mkdirSync('generated', { recursive: true });
  const outPath = 'generated/openapi.json';
  writeFileSync(outPath, JSON.stringify(spec, null, 2));
  await SwaggerParser.validate(outPath);
  console.log(`✓ Wrote and validated ${outPath} (OpenAPI ${spec.openapi})`);
}

main().catch((error) => {
  console.error('Failed to generate OpenAPI spec:', error);
  process.exit(1);
});