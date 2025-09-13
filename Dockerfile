FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript (matches your "build" script)
RUN npm run build

# Expose port
EXPOSE 5000

# Start command (matches your "start" script)
CMD ["npm", "start"]
