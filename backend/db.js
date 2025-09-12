import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

const needsSSL = /supabase\.co|supabase\.com/i.test(connectionString || '');

export const pool = new Pool({
  connectionString,
  ssl: needsSSL ? { rejectUnauthorized: false } : undefined,
});

// No-op: schema is managed in Supabase. This exists for backward compatibility.
export async function initTables() {
  return;
}
