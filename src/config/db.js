import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

// Remote cloud hosts (Supabase, Neon, Render, Railway) require SSL
const isRemote =
  env.DATABASE_URL.includes('supabase.co') ||
  env.DATABASE_URL.includes('neon.tech') ||
  env.DATABASE_URL.includes('render.com') ||
  env.DATABASE_URL.includes('railway.app') ||
  env.NODE_ENV === 'production';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: isRemote ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
  process.exit(-1);
});

/**
 * Execute a parameterized query against PostgreSQL.
 * @param {string} text - SQL query string
 * @param {Array} [params] - Query parameters
 * @returns {Promise<pg.QueryResult>}
 */
export const query = (text, params) => pool.query(text, params);
