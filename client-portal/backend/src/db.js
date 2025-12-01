import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

export async function ping() {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    return rows[0].now;
  } catch (err) {
    console.error("❌ DB ping error:", err);
    throw err;
  }
}