import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function ping() {
  try {
    const result = await pool.query('SELECT NOW()');
    return result.rows[0];
  } catch (err) {
    console.error('❌ DB ping error:', err);
    throw err;
  }
}

export default pool;