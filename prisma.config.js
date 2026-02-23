
import 'dotenv/config';
import { defineConfig } from '@prisma/config';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

let connectionString = process.env.DATABASE_URL;

// Add libpqcompat flag for dev to allow rejectUnauthorized: false with sslmode=require
if (process.env.NODE_ENV !== 'production' && connectionString && !connectionString.includes('uselibpqcompat')) {
  connectionString = connectionString + (connectionString.includes('?') ? '&' : '?') + 'uselibpqcompat=true';
}

const pool = new pg.Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? true : { rejectUnauthorized: false },
});

export default defineConfig({
  datasource: {
    url: connectionString,
  },
  adapter: new PrismaPg(pool),
});