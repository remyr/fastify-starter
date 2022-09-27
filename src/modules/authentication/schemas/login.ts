import { z } from 'zod';

import * as Common from './common';

export const loginBodySchema = z.object({
  email: Common.EmailType,
  password: Common.PasswordType,
});
export type LoginBody = z.infer<typeof loginBodySchema>;

export const googleLoginSchema = z.object({
  idToken: Common.TokenType,
});
export type GoogleLoginBody = z.infer<typeof googleLoginSchema>;
