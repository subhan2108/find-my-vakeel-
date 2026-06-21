import dotenv from 'dotenv';
import path from 'path';
import { neon } from '@neondatabase/serverless';

// Load .env.local from the project root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function migrate() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is missing in .env.local');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log('Adding slug column to posts table if it does not exist...');
    await sql`
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS slug TEXT;
    `;
    console.log('Successfully added slug column!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();
