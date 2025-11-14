import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Render requires this for SSL
  },
});

export async function ping() {
  const result = await pool.query('SELECT NOW()');
  return result.rows[0];
}

export default pool;