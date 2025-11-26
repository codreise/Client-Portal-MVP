import pkg from 'pg';
const { Pool } = pkg;

// Пул підключень до Postgres
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // у Docker Postgres SSL не потрібен
});

// Перевірка з’єднання з базою
export async function ping() {
  try {
    const res = await pool.query('SELECT NOW()');
    return res.rows[0].now;
  } catch (err) {
    console.error('❌ DB ping error:', err);
    throw err;
  }
}

export default pool;