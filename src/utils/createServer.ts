import fastify from 'fastify';
import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import { withRefResolver } from 'fastify-zod';

import { CORS_ORIGIN } from '../constants';
import fastifyVerifyJWT from '../plugins/jwtVerify';
import authenticationRoutes from '../modules/authentication/authentication.route';
import { authSchemas } from '../modules/authentication/schemas';
import { commonSchemas } from '../modules/shared/schemas';
import openapi from './openapi';

function createServer() {
  const server = fastify({
    ajv: {
      customOptions: {
        keywords: ['example'],
      },
    },
  });

  for (const schema of [...commonSchemas, ...authSchemas]) {
    server.addSchema(schema);
  }

  server.register(cors, {
    origin: CORS_ORIGIN,
  });

  server.register(fastifyVerifyJWT);

  server.register(
    fastifySwagger,
    withRefResolver({
      routePrefix: '/docs',
      exposeRoute: true,
      staticCSP: true,
      openapi: openapi,
    }),
  );

  server.get('/healthcheck', async () => {
    return { message: 'ok' };
  });

  server.register(authenticationRoutes, { prefix: 'v1/auth' });

  return server;
}

export default createServer;
