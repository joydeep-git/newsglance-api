#!/bin/sh
# entrypoint.sh
# Runs Prisma migrations against the live DB, then starts the app.
# This file runs INSIDE the final production container at startup time,
# so DATABASE_URL is already injected by docker-compose.

set -e

echo "==> DATABASE_URL host: $(echo $DATABASE_URL | sed 's/:[^@]*@/@/g')"
echo "==> REDIS_URL: $REDIS_URL"
echo "==> Running Prisma migrations..."

# prisma v7 picks up prisma.config.ts automatically if the file is present.
# Using node_modules/.bin/prisma ensures we use the version from package.json.
node_modules/.bin/prisma migrate deploy

echo "==> Migrations done. Starting NewsGlance API..."
exec node dist/server.js

