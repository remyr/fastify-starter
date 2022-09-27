import { FastifyInstance } from 'fastify';
import { defaultErrorSchemas } from '../shared/schemas';
import { login, refreshToken, register } from './authentication.controller';
import { $authRef } from './schemas';

async function authenticationRoutes(server: FastifyInstance) {
  server.post(
    '/register',
    {
      schema: {
        description: 'Register user',
        tags: ['Auth'],
        body: $authRef('registerBodySchema'),
        response: {
          200: $authRef({ key: 'registerSuccessSchema', description: 'Register Response' }),
          ...defaultErrorSchemas,
        },
      },
    },
    register,
  );
  server.post(
    '/login',
    {
      schema: {
        description: 'Login user',
        tags: ['Auth'],
        body: $authRef('loginBodySchema'),
        response: {
          200: $authRef('tokensResponseSchema'),
          ...defaultErrorSchemas,
        },
      },
    },
    login,
  );
  server.post(
    '/refresh-token',
    {
      schema: {
        description: 'Refresh token',
        tags: ['Auth'],
        body: $authRef('refreshBodySchema'),
        response: {
          200: $authRef('tokensResponseSchema'),
          ...defaultErrorSchemas,
        },
      },
    },
    refreshToken,
  );

  // server.post(
  //   '/login/google',
  //   {
  //     schema: {
  //       description: 'Login user with provider [google]',
  //       tags: ['Auth'],
  //       body: $authRef('googleLoginSchema'),
  //       response: {
  //         200: $authRef('tokensResponseSchema'),
  //         ...defaultErrorSchemas,
  //       },
  //     },
  //   },
  //   loginGoogle,
  // );

  // server.get('/me', { onRequest: [server.authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
  //   const id = req.userId;

  //   reply.send({ id });
  // });
}

export default authenticationRoutes;
