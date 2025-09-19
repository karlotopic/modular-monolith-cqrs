FROM node:18.15-slim AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18.15-slim AS install
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY package*.json .
RUN npm ci --only=production

FROM node:18.15-slim AS configure
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=build /usr/src/app/entrypoint.sh ./entrypoint.sh
COPY --chown=node:node --from=install /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --chown=node:node --from=build /usr/src/app/.env ./.env

FROM configure AS run
ENV NODE_ENV production
USER node
ENTRYPOINT ["sh", "/usr/src/app/entrypoint.sh"]