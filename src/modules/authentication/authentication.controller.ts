import { FastifyReply, FastifyRequest } from 'fastify';
import * as bcrypt from 'bcrypt';
import httpErrors from 'http-errors';
import { OAuth2Client } from 'google-auth-library';

import {
  createAccount,
  createUser,
  generateTokens,
  getAccount,
  getOrCreateProvider,
  getUserByEmail,
  getUserRefreshToken,
  removeAllRefreshTokenFromUser,
  removeRefreshToken,
  verifyRefreshToken,
} from './authentication.service';
import { ProviderTypes } from './authentication.types';
import logger from '../../utils/logger';
import { GoogleLoginBody, LoginBody } from './schemas/login';
import { RegisterBody } from './schemas/register';
import { RefreshBody } from './schemas/tokens';

export async function login(req: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      throw new httpErrors.Unauthorized('Failed to login');
    }

    const provider = await getOrCreateProvider(ProviderTypes.Local);
    const account = await getAccount(user.id, provider.id);

    if (!account || !account.password) {
      throw new httpErrors.Unauthorized('Failed to login');
    }

    const match = await bcrypt.compare(password, account.password);
    if (!match) {
      throw new httpErrors.Unauthorized('Failed to login');
    }

    const data = { id: user.id, email: user.email };
    const tokens = await generateTokens(data);

    reply.send({ ...tokens, user: data });
  } catch (error) {
    throw new httpErrors.Unauthorized('Failed to login');
  }
}

export async function register(req: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    const provider = await getOrCreateProvider(ProviderTypes.Local);

    if (user) {
      const account = await getAccount(user.id, provider.id);

      if (account) {
        reply.status(200);
        // reply.send({ message: 'Email sent' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await createAccount({
        providerId: provider.id,
        userId: user.id,
        password: hashedPassword,
      });

      reply.send({ message: 'Email sent' });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await createUser({
        email,
        accounts: [{ providerId: provider.id, password: hashedPassword }],
      });
      reply.send({ message: 'Email sent' });
    }
  } catch (error) {
    logger.error(error);
    throw new httpErrors.BadRequest('Unable to register');
  }
}

export async function refreshToken(req: FastifyRequest<{ Body: RefreshBody }>, reply: FastifyReply) {
  const { refreshToken } = req.body;

  try {
    const { user } = await verifyRefreshToken(refreshToken);

    // find a user with this refreshToken
    const userRefreshToken = await getUserRefreshToken(user.id, refreshToken);

    // if no user with this refresh token, its mean the token is reused
    if (!userRefreshToken) {
      // remove all refresh token from the user, to force a new signin
      await removeAllRefreshTokenFromUser(user.id);
      throw new httpErrors.Unauthorized();
    }

    if (user.email !== userRefreshToken?.user.email) {
      throw new httpErrors.Unauthorized();
    }

    await removeRefreshToken(user.id, refreshToken);

    const data = { id: user.id, email: user.email };
    const tokens = await generateTokens(data);

    reply.send({ ...tokens, data });
  } catch (error) {
    logger.debug(error);
    throw new httpErrors.Unauthorized();
  }
}

export async function loginGoogle(req: FastifyRequest<{ Body: GoogleLoginBody }>, reply: FastifyReply) {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({ idToken: req.body.idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();

    const email = payload?.email;

    if (!email) {
      throw new httpErrors.Unauthorized();
    }

    const user = await getUserByEmail(email);
    const provider = await getOrCreateProvider(ProviderTypes.Google);

    if (user) {
      const account = await getAccount(user.id, provider.id);

      if (account) {
        const data = { id: user.id, email };
        const tokens = await generateTokens(data);

        reply.send({ ...tokens, user: data });
      } else {
        await createAccount({ userId: user.id, providerId: provider.id, externalId: payload.sub });

        const data = { id: user.id, email: user.email };
        const tokens = await generateTokens(data);

        reply.send({ ...tokens, user: data });
      }
    } else {
      const newUser = await createUser({
        email,
        accounts: [{ providerId: provider.id, externalId: payload.sub }],
      });

      const data = { id: newUser.id, email };
      const tokens = await generateTokens(data);

      reply.send({ ...tokens, user: data });
    }
  } catch (error) {
    logger.error(error);
    throw new httpErrors.Unauthorized('Invalid token');
  }
}
