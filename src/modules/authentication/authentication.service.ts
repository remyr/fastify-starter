import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../../constants';

import prisma from '../../utils/prisma';
import { DecodedToken } from './authentication.types';

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function getOrCreateProvider(name: string) {
  return prisma.provider.upsert({
    where: {
      name,
    },
    update: {},
    create: {
      name,
    },
  });
}

export async function getAccount(userId: string, providerId: string) {
  return prisma.account.findUnique({
    where: {
      userProvider: {
        userId,
        providerId,
      },
    },
  });
}

interface CreateAccountInput {
  providerId: string;
  userId: string;
  password?: string;
  externalId?: string;
}
export async function createAccount(data: CreateAccountInput) {
  return prisma.account.create({ data });
}

interface CreateUserInput {
  email: string;
  accounts?: { providerId: string; password?: string; externalId?: string }[];
}
export async function createUser({ accounts = [], ...data }: CreateUserInput) {
  return prisma.user.create({
    data: {
      ...data,
      accounts: {
        create: accounts,
      },
    },
  });
}

export async function generateTokens(user: { id: string; email: string }) {
  const accessToken = jwt.sign({ user }, JWT_CONFIG.accessTokenSecret, {
    expiresIn: JWT_CONFIG.accessTokenExpireIn,
  });
  const refreshToken = jwt.sign({ user }, JWT_CONFIG.refreshTokenSecret, {
    expiresIn: JWT_CONFIG.refreshTokenExpireIn,
  });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      refreshToken,
    },
  });

  return { accessToken, refreshToken };
}

export async function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT_CONFIG.refreshTokenSecret) as DecodedToken;
}

export async function getUserRefreshToken(userId: string, refreshToken: string) {
  return prisma.refreshToken.findUnique({
    where: {
      userId_refreshToken: {
        userId,
        refreshToken,
      },
    },
    select: {
      user: true,
    },
  });
}

export async function removeAllRefreshTokenFromUser(userId: string) {
  return prisma.refreshToken.deleteMany({
    where: {
      userId,
    },
  });
}

export async function removeRefreshToken(userId: string, refreshToken: string) {
  return prisma.refreshToken.delete({
    where: {
      userId_refreshToken: {
        userId,
        refreshToken,
      },
    },
  });
}
