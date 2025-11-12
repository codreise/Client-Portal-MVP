// backend/src/db.js
import dotenv from 'dotenv';
import pkg from 'pg';
dotenv.config();

const { Pool } = pkg;
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

export async function ping() {
  const res = await pool.query('SELECT NOW() as now');
  return res.rows[0].now;
}