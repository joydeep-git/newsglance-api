# Stage 1: Base
FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"

ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app



# Stage 2: Dependencies
FROM base AS deps

COPY pnpm-lock.yaml package.json ./

RUN pnpm install --frozen-lockfile

# Stage 3: Builder
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN pnpm prisma migrate deploy

RUN pnpm prisma generate

RUN pnpm build



# Stage 4: Runner
FROM base AS runner

ENV NODE_ENV=production


COPY --from=builder /app/dist ./dist

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/prisma ./prisma

EXPOSE 5000
CMD ["node", "dist/server.js"]