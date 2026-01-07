import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Connection pool configuration
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  
  // Log slow queries for monitoring
  if (duration > 100) {
    console.log(`[SLOW QUERY] ${duration}ms: ${text}`);
  }
  
  return res;
}

export async function closePool() {
  await pool.end();
  console.log('✅ Database pool closed');
}

// Graceful shutdown
process.on('SIGTERM', () => {
  pool.end(() => {
    console.log('Database pool has ended');
  });
});
