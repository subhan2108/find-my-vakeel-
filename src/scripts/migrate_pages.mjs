import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function migrate() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is missing in .env.local');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log('Starting custom_pages database migration...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS custom_pages (
        slug VARCHAR(255) PRIMARY KEY,
        title TEXT,
        html_content TEXT,
        css_content TEXT,
        js_content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Created custom_pages table.');

  } catch (err) {
    console.error('Migration failed:', err);
  }
}

migrate();
