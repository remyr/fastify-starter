import { registerBodySchema, registerSuccessSchema } from './register';
import { loginBodySchema, googleLoginSchema } from './login';
import { refreshBodySchema, tokensResponseSchema } from './tokens';
import { buildOpenapiSchema } from '../../shared/utils/openAPISchema';

export const { schemas: authSchemas, $ref: $authRef } = buildOpenapiSchema(
  {
    registerBodySchema,
    registerSuccessSchema,
    loginBodySchema,
    refreshBodySchema,
    tokensResponseSchema,
    googleLoginSchema,
  },
  { $id: 'auth' },
);
