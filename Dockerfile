# FROM node:20.13.1-alpine AS builder

# RUN apk update && apk add --no-cache \
#   build-base \
#   python3 \
#   git \
#   bash \
#   && rm -rf /var/cache/apk/*

# WORKDIR /app

# # Copy package files
# COPY package*.json ./

# # Install dependencies
# RUN npm ci

# # Copy source code
# COPY . .

# # Generate Prisma client
# RUN npx prisma generate

# # Build TypeScript (matches your "build" script)
# RUN npm run build

# # Expose port
# EXPOSE 5000

# # Start command (matches your "start" script)
# CMD ["npm", "start"]


# Stage 1: Build dependencies and the application
FROM node:20.13.1-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker's build cache.
# `npm ci` is more deterministic than `npm install` and faster for builds.
COPY package*.json ./
RUN npm ci --no-cache

# Copy all application files and build
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Create the final, lean production image
# Start from a minimal, production-focused base image
FROM node:20.13.1-alpine

WORKDIR /app

# Copy only production dependencies from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
# Copy only the built application code, excluding development files
COPY --from=builder /app/dist ./dist

# It's recommended to run as a non-root user for security.
RUN addgroup --system app && adduser --system --ingroup app app
USER app

# Bind to 0.0.0.0 for external access within a containerized environment
ENV HOST=0.0.0.0
EXPOSE 5000

# Use `node` directly instead of `npm start` to manage signals properly.
CMD ["node", "dist/main.js"]
