import { z } from 'zod';

export const envSchema = z.object({
  APP_NAME: z.string(),
  HOST: z.string(),
  PORT: z.string(),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DATABASE_URL: z.string().url(),
  PUBLIC_DOMAIN: z.string(),
});
