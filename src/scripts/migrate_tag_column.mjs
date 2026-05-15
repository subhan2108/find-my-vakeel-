import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  console.log('Starting migration...');
  try {
    await sql`ALTER TABLE custom_pages ADD COLUMN IF NOT EXISTS tag TEXT`;
    console.log('Successfully added tag column to custom_pages');
  } catch (err) {
    console.error('Migration failed:', err.message);
  }
}

migrate();
