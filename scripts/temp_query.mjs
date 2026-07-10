import dotenv from 'dotenv';
import path from 'path';
import { neon } from '@neondatabase/serverless';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function run() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    const { rows } = await sql.query('SELECT html_content FROM custom_pages LIMIT 10');
    for (const page of rows) {
      if (page.html_content && page.html_content.includes('Top')) {
        const match = page.html_content.match(/<h[1-6][^>]*>[\s\S]*?Top[\s\S]*?(?:Lawyers|Advocates) in[\s\S]*?<\/h[1-6]>/i);
        if (match) {
          console.log('Heading match:', match[0]);
          return;
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}
run();
