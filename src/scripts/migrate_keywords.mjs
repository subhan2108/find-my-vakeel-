import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function migrate() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    console.log('Adding keywords column to posts, static_seo, and custom_pages...');
    await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS keywords TEXT`;
    await sql`ALTER TABLE static_seo ADD COLUMN IF NOT EXISTS keywords TEXT`;
    await sql`ALTER TABLE custom_pages ADD COLUMN IF NOT EXISTS keywords TEXT`;
    console.log('Keywords columns added successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}
migrate();
