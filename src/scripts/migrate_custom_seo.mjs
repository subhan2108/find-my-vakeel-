import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function migrate() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    console.log('Adding SEO columns to custom_pages...');
    await sql`ALTER TABLE custom_pages ADD COLUMN IF NOT EXISTS meta_description TEXT`;
    await sql`ALTER TABLE custom_pages ADD COLUMN IF NOT EXISTS canonical_url TEXT`;
    await sql`ALTER TABLE custom_pages ADD COLUMN IF NOT EXISTS schema_markup TEXT`;
    console.log('SEO columns added successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}
migrate();
