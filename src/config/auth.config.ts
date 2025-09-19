import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const authSchema = z.object({});

export default registerAs('auth', () => {
  const config = authSchema.parse({});
  return config;
});
