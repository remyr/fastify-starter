import { buildOpenapiSchema } from '../utils/openAPISchema';

import { errorSchema } from './error';
import { successSchema } from './success';

export const { schemas: commonSchemas, $ref: $commonRef } = buildOpenapiSchema({
  errorSchema,
  successSchema,
});

export const defaultErrorSchemas = {
  '4xx': $commonRef({ key: 'errorSchema', description: 'Client Error Response' }),
  '5xx': $commonRef({ key: 'errorSchema', description: 'Server Error Response' }),
};
