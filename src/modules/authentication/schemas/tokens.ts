import { z } from 'zod';

import * as Common from './common';

export const refreshBodySchema = z.object({
  refreshToken: Common.TokenType,
});
export type RefreshBody = z.infer<typeof refreshBodySchema>;

export const tokensResponseSchema = z.object({
  accessToken: Common.TokenType,
  refreshToken: Common.TokenType,
  user: Common.UserType,
});
