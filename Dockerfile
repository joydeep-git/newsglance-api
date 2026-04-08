FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

RUN corepack enable

WORKDIR /app


# Stage 2: Dependencies
FROM base AS deps

COPY pnpm-lock.yaml package.json ./

RUN pnpm install --frozen-lockfile


# Stage 3: Builder
FROM base AS builder

# Required for Prisma client generation (reads schema, no live DB needed)
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY --from=deps /app/node_modules ./node_modules

COPY . .

# Generate Prisma client (schema only — no DB connection required)
RUN pnpm prisma generate

# Compile TypeScript
RUN pnpm build


# Stage 4: Runner (lean production image)
FROM base AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/dist             ./dist
COPY --from=builder /app/node_modules     ./node_modules
COPY --from=builder /app/package.json     ./package.json
COPY --from=builder /app/prisma           ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Entrypoint: runs prisma migrations then starts the app
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 5000

CMD ["./entrypoint.sh"]