import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function migrate() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is missing in .env.local');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log('Starting SEO database migration...');

    // Add SEO columns to posts table
    // We use DO logic to avoid errors if columns already exist
    await sql`
      DO $$ 
      BEGIN 
        BEGIN
          ALTER TABLE posts ADD COLUMN meta_title TEXT;
        EXCEPTION WHEN duplicate_column THEN END;
        
        BEGIN
          ALTER TABLE posts ADD COLUMN meta_description TEXT;
        EXCEPTION WHEN duplicate_column THEN END;
        
        BEGIN
          ALTER TABLE posts ADD COLUMN canonical_url TEXT;
        EXCEPTION WHEN duplicate_column THEN END;
        
        BEGIN
          ALTER TABLE posts ADD COLUMN schema_markup TEXT;
        EXCEPTION WHEN duplicate_column THEN END;
      END $$;
    `;
    console.log('Added SEO columns to posts table.');

    // Create static_seo table
    await sql`
      CREATE TABLE IF NOT EXISTS static_seo (
        route VARCHAR(255) PRIMARY KEY,
        meta_title TEXT,
        meta_description TEXT,
        canonical_url TEXT,
        schema_markup TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Created static_seo table.');

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

migrate();
