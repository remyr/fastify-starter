# build container
FROM node:16-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn run build

# Production container
FROM node:16-alpine AS server

ENV NODE_ENV production

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY prisma ./prisma/
COPY .env ./.env

RUN yarn install --production

COPY --from=builder ./app/dist/ ./dist/

RUN npx prisma generate

EXPOSE 4000

CMD ["node",  "dist/main.js"]