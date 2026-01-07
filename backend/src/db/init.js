import { query } from "./postgres.js";

let initialized = false;

export async function initDb() {
  if (initialized) return;
  
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        brand TEXT DEFAULT '',
        category TEXT DEFAULT '',
        country TEXT DEFAULT '',
        "isBoycotted" BOOLEAN NOT NULL DEFAULT FALSE,
        reason TEXT DEFAULT '',
        "tunisianAlternative" TEXT DEFAULT '',
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    
    // Create indexes for better search performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_products_name ON products(LOWER(name));
    `);
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_products_brand ON products(LOWER(brand));
    `);
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_products_boycotted ON products("isBoycotted");
    `);
    
    initialized = true;
    console.log("✅ Database initialized with PostgreSQL");
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    throw err;
  }
}

