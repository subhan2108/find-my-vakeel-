import dotenv from 'dotenv';
import path from 'path';
import { neon } from '@neondatabase/serverless';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function run() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    const { rows } = await sql.query('SELECT html_content FROM custom_pages');
    const pages = rows;
    for (const page of pages) {
      if (page.html_content && (page.html_content.includes('Lawyers in') || page.html_content.includes('Advocates in'))) {
        const match = page.html_content.match(/<h[1-6][^>]*>.*?(?:Lawyers|Advocates) in.*?<\/h[1-6]>/i);
        if (match) {
          console.log('Heading match:', match[0]);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}
run();
