import { z } from 'zod';

export const errorSchema = z.object({
  statusCode: z.number(),
  error: z.string({ description: 'ErrorType' }),
  message: z.string({ description: 'Error message' }),
});
