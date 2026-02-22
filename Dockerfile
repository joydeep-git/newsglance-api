# --- Stage 1: Build ---
FROM node:24-alpine AS builder

# Install build essentials for native modules like argon2
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
# Note: --no-cache is not a valid npm ci flag; use --quiet or omit
RUN npm ci

COPY . .

# Generate Prisma Client (Ensure it targets debian-openssl or musl)
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# --- Stage 2: Production ---
FROM node:24-alpine

# Prisma needs openssl to run on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Copy only production dependencies to keep the image small
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the generated Prisma client and built source
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/dist ./dist

# Security: Run as non-root
RUN addgroup --system app && adduser --system --ingroup app app
USER app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
EXPOSE 5000

CMD ["node", "dist/server.js"]