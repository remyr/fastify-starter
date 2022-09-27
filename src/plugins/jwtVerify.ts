import fp from 'fastify-plugin';
import fastifyJWT from '@fastify/jwt';
import { FastifyInstance, FastifyRequest } from 'fastify';
import httpErrors from 'http-errors';
import { JWT_CONFIG } from '../constants';
import { DecodedToken } from '../modules/authentication/authentication.types';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: unknown) => void;
  }

  interface FastifyRequest {
    userId: string;
  }
}

async function fastifyVerifyJWT(fastify: FastifyInstance) {
  fastify.register(fastifyJWT, {
    secret: JWT_CONFIG.accessTokenSecret,
  });

  fastify.decorate('authenticate', async function (request: FastifyRequest) {
    try {
      const decodedData = await request.jwtVerify<DecodedToken>();
      request.userId = decodedData.user.id;
    } catch (err) {
      throw new httpErrors.Unauthorized();
    }
  });
}

export default fp(fastifyVerifyJWT, { name: 'fastify-verify-jwt' });
