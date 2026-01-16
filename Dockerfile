
FROM node:20.13.1-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --no-cache

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20.13.1-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/dist ./dist



RUN addgroup --system app && adduser --system --ingroup app app
USER app



ENV HOST=0.0.0.0
EXPOSE 5000


CMD ["node", "dist/server.js"]
