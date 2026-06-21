import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// We have to import dynamically or just copy the Neon connection logic here
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function generate() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://findmyvakeel.com';
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  const addUrl = (url, date, freq, prio) => {
    xml += `  <url>\n    <loc>${url}</loc>\n    <lastmod>${date.toISOString()}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${prio}</priority>\n  </url>\n`;
  };

  addUrl(baseUrl, new Date(), 'daily', 1.0);
  addUrl(`${baseUrl}/areas`, new Date(), 'weekly', 0.8);
  addUrl(`${baseUrl}/blog`, new Date(), 'weekly', 0.8);

  try {
    const posts = await sql`SELECT * FROM posts ORDER BY date DESC`;
    for (const post of posts) {
      addUrl(`${baseUrl}/blog/${post.slug || post.id}`, new Date(post.date || new Date()), 'weekly', 0.7);
    }
  } catch(e) { console.log('No posts', e.message); }

  try {
    const pages = await sql`SELECT slug, title, updated_at FROM custom_pages ORDER BY updated_at DESC`;
    for (const page of pages) {
      addUrl(`${baseUrl}/${page.slug}`, new Date(page.updated_at || new Date()), 'weekly', 0.8);
    }
  } catch(e) { console.log('No custom pages', e.message); }

  xml += `</urlset>`;
  
  fs.writeFileSync('./public/sitemap.xml', xml);
  console.log('Sitemap generated at public/sitemap.xml');
}

generate().catch(console.error);
