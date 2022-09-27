import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

import * as Common from './common';

export const registerBodySchema = z.object({
  email: Common.EmailType,
  password: Common.PasswordType,
  firstName: Common.FirstNameType,
  lastName: Common.LastNameType,
});
export type RegisterBody = z.infer<typeof registerBodySchema>;

export const registerSuccessSchema = z.object({
  message: extendApi(z.string(), { example: 'registred' }),
});
