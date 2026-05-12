import { neon } from '@neondatabase/serverless';

const getSql = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing. Please add it to .env.local');
  }
  return neon(process.env.DATABASE_URL);
};

export async function getPosts() {
  const sql = getSql();
  return await sql`SELECT * FROM posts ORDER BY date DESC`;
}

export async function getPostById(id) {
  const sql = getSql();
  const posts = await sql`SELECT * FROM posts WHERE id = ${id}`;
  return posts[0];
}

export async function createPost(post) {
  const sql = getSql();
  return await sql`
    INSERT INTO posts (title, content, image, type, category, date, author, meta_title, meta_description, canonical_url, schema_markup, keywords)
    VALUES (${post.title}, ${post.content}, ${post.image}, ${post.type}, ${post.category}, ${post.date}, ${post.author || 'Editorial Team'}, ${post.meta_title || null}, ${post.meta_description || null}, ${post.canonical_url || null}, ${post.schema_markup || null}, ${post.keywords || null})
    RETURNING *
  `;
}

export async function deletePost(id) {
  const sql = getSql();
  return await sql`DELETE FROM posts WHERE id = ${id}`;
}

export async function updatePost(id, post) {
  const sql = getSql();
  return await sql`
    UPDATE posts 
    SET title = ${post.title}, 
        content = ${post.content}, 
        image = ${post.image}, 
        type = ${post.type}, 
        category = ${post.category},
        author = ${post.author || 'Editorial Team'},
        meta_title = ${post.meta_title || null},
        meta_description = ${post.meta_description || null},
        canonical_url = ${post.canonical_url || null},
        schema_markup = ${post.schema_markup || null},
        keywords = ${post.keywords || null}
    WHERE id = ${id}
    RETURNING *
  `;
}

export async function getSections() {
  const sql = getSql();
  // Create table if it doesn't exist
  await sql`
    CREATE TABLE IF NOT EXISTS homepage_sections (
      id VARCHAR(50) PRIMARY KEY,
      name TEXT NOT NULL,
      is_visible BOOLEAN DEFAULT true,
      content JSONB
    )
  `;
  return await sql`SELECT * FROM homepage_sections ORDER BY id ASC`;
}

export async function getSectionById(id) {
  const sql = getSql();
  const res = await sql`SELECT * FROM homepage_sections WHERE id = ${id}`;
  return res[0] || null;
}

export async function updateSection(id, data) {
  const sql = getSql();
  return await sql`
    INSERT INTO homepage_sections (id, name, is_visible, content)
    VALUES (${id}, ${data.name}, ${data.is_visible}, ${data.content})
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      is_visible = EXCLUDED.is_visible,
      content = EXCLUDED.content
    RETURNING *
  `;
}

export async function getStaticSeo(route) {
  const sql = getSql();
  const res = await sql`SELECT * FROM static_seo WHERE route = ${route}`;
  return res[0] || null;
}

export async function updateStaticSeo(route, data) {
  const sql = getSql();
  return await sql`
    INSERT INTO static_seo (route, meta_title, meta_description, canonical_url, schema_markup, keywords)
    VALUES (${route}, ${data.meta_title || null}, ${data.meta_description || null}, ${data.canonical_url || null}, ${data.schema_markup || null}, ${data.keywords || null})
    ON CONFLICT (route) DO UPDATE SET
      meta_title = EXCLUDED.meta_title,
      meta_description = EXCLUDED.meta_description,
      canonical_url = EXCLUDED.canonical_url,
      schema_markup = EXCLUDED.schema_markup,
      keywords = EXCLUDED.keywords,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;
}

// Custom Pages API
export async function getCustomPages() {
  const sql = getSql();
  return await sql`SELECT slug, title, updated_at FROM custom_pages ORDER BY updated_at DESC`;
}

export async function getCustomPage(slug) {
  const sql = getSql();
  const res = await sql`SELECT * FROM custom_pages WHERE slug = ${slug}`;
  return res[0] || null;
}

export async function updateCustomPage(slug, data) {
  const sql = getSql();
  return await sql`
    INSERT INTO custom_pages (slug, title, html_content, css_content, js_content, meta_description, canonical_url, schema_markup, keywords)
    VALUES (${slug}, ${data.title}, ${data.html_content}, ${data.css_content}, ${data.js_content}, ${data.meta_description}, ${data.canonical_url}, ${data.schema_markup}, ${data.keywords})
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      html_content = EXCLUDED.html_content,
      css_content = EXCLUDED.css_content,
      js_content = EXCLUDED.js_content,
      meta_description = EXCLUDED.meta_description,
      canonical_url = EXCLUDED.canonical_url,
      schema_markup = EXCLUDED.schema_markup,
      keywords = EXCLUDED.keywords,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;
}

export async function deleteCustomPage(slug) {
  const sql = getSql();
  return await sql`DELETE FROM custom_pages WHERE slug = ${slug}`;
}

// Export raw sql for migrations/setup
export const sql = (strings, ...values) => {
  const s = getSql();
  return s(strings, ...values);
};
