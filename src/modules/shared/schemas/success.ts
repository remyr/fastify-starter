import { z } from 'zod';

export const successSchema = z.object({
  message: z.string(),
});
