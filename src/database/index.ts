import { Pool } from 'pg';

// Parse the DATABASE_URL
const client = new Pool({
  connectionString: process.env.DATABASE_URL, // Use the DATABASE_URL directly
  ssl: {
    rejectUnauthorized: false, // Required for NeonDB
  },
  max: 100,
  connectionTimeoutMillis: 1000000
});

export default client;