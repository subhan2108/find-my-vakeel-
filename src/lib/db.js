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
  // Check if id is an integer or string slug
  const isNumeric = /^\d+$/.test(id);
  if (isNumeric) {
    const posts = await sql`SELECT * FROM posts WHERE id = ${parseInt(id, 10)} OR slug = ${id}`;
    return posts[0];
  } else {
    const posts = await sql`SELECT * FROM posts WHERE slug = ${id}`;
    return posts[0];
  }
}

export async function createPost(post) {
  const sql = getSql();
  return await sql`
    INSERT INTO posts (title, content, image, type, category, date, author, meta_title, meta_description, canonical_url, schema_markup, keywords, slug)
    VALUES (${post.title}, ${post.content}, ${post.image}, ${post.type}, ${post.category}, ${post.date}, ${post.author || 'Editorial Team'}, ${post.meta_title || null}, ${post.meta_description || null}, ${post.canonical_url || null}, ${post.schema_markup || null}, ${post.keywords || null}, ${post.slug || null})
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
        keywords = ${post.keywords || null},
        slug = ${post.slug || null}
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
  await sql`
    CREATE TABLE IF NOT EXISTS custom_pages (
      slug TEXT PRIMARY KEY,
      title TEXT,
      html_content TEXT,
      css_content TEXT,
      js_content TEXT,
      meta_description TEXT,
      canonical_url TEXT,
      schema_markup TEXT,
      keywords TEXT,
      tag TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  return await sql`SELECT slug, title, tag, updated_at FROM custom_pages ORDER BY updated_at DESC`;
}

export async function getCustomPage(slug) {
  const sql = getSql();
  // Ensure table exists
  await sql`
    CREATE TABLE IF NOT EXISTS custom_pages (
      slug TEXT PRIMARY KEY,
      title TEXT,
      html_content TEXT,
      css_content TEXT,
      js_content TEXT,
      meta_description TEXT,
      canonical_url TEXT,
      schema_markup TEXT,
      keywords TEXT,
      tag TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  const res = await sql`SELECT * FROM custom_pages WHERE slug = ${slug}`;
  return res[0] || null;
}

export async function updateCustomPage(slug, data) {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS custom_pages (
      slug TEXT PRIMARY KEY,
      title TEXT,
      html_content TEXT,
      css_content TEXT,
      js_content TEXT,
      meta_description TEXT,
      canonical_url TEXT,
      schema_markup TEXT,
      keywords TEXT,
      tag TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  return await sql`
    INSERT INTO custom_pages (slug, title, html_content, css_content, js_content, meta_description, canonical_url, schema_markup, keywords, tag)
    VALUES (${slug}, ${data.title}, ${data.html_content}, ${data.css_content}, ${data.js_content}, ${data.meta_description}, ${data.canonical_url}, ${data.schema_markup}, ${data.keywords}, ${data.tag || null})
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      html_content = EXCLUDED.html_content,
      css_content = EXCLUDED.css_content,
      js_content = EXCLUDED.js_content,
      meta_description = EXCLUDED.meta_description,
      canonical_url = EXCLUDED.canonical_url,
      schema_markup = EXCLUDED.schema_markup,
      keywords = EXCLUDED.keywords,
      tag = EXCLUDED.tag,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;
}

export async function getCustomPagesByTag(tag) {
  const sql = getSql();
  return await sql`SELECT slug, title, updated_at FROM custom_pages WHERE tag = ${tag} ORDER BY title ASC`;
}

export async function deleteCustomPage(slug) {
  const sql = getSql();
  return await sql`DELETE FROM custom_pages WHERE slug = ${slug} RETURNING slug`;
}

// Storage Usage API
export async function getDatabaseSize() {
  const sql = getSql();
  const res = await sql`SELECT pg_database_size(current_database()) as size_bytes`;
  return res[0]?.size_bytes || 0;
}

// Legal Services API
export async function getLegalCategories() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS legal_service_categories (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      icon TEXT,
      bg_color TEXT,
      icon_color TEXT,
      card_bg_from TEXT,
      card_bg_to TEXT,
      description TEXT
    )
  `;
  
  const countRes = await sql`SELECT COUNT(*) FROM legal_service_categories`;
  if (parseInt(countRes[0].count) === 0) {
    const seed = [
      { id: 'family', label: 'Family Law', icon: 'fa-users', description: 'Matrimonial disputes, custody, divorce & family settlements', bg_color: 'bg-blue-100', icon_color: 'text-blue-600', card_bg_from: 'from-blue-50', card_bg_to: 'to-blue-100' },
      { id: 'criminal', label: 'Criminal Law', icon: 'fa-gavel', description: 'Bail, FIR, criminal defense, cyber crime & white collar cases', bg_color: 'bg-red-100', icon_color: 'text-red-600', card_bg_from: 'from-red-50', card_bg_to: 'to-red-100' },
      { id: 'property', label: 'Property Law', icon: 'fa-building', description: 'Property disputes, land cases, registration, builder disputes & RERA', bg_color: 'bg-green-100', icon_color: 'text-green-600', card_bg_from: 'from-green-50', card_bg_to: 'to-green-100' },
      { id: 'civil', label: 'Civil Matters', icon: 'fa-balance-scale', description: 'Recovery suits, injunctions, contracts, appeals & consumer disputes', bg_color: 'bg-purple-100', icon_color: 'text-purple-600', card_bg_from: 'from-purple-50', card_bg_to: 'to-purple-100' },
      { id: 'corporate', label: 'Corporate Law', icon: 'fa-briefcase', description: '', bg_color: 'bg-slate-100', icon_color: 'text-slate-600', card_bg_from: 'from-slate-50', card_bg_to: 'to-slate-100' },
      { id: 'banking', label: 'Banking', icon: 'fa-university', description: '', bg_color: 'bg-slate-100', icon_color: 'text-slate-600', card_bg_from: 'from-slate-50', card_bg_to: 'to-slate-100' },
      { id: 'consumer', label: 'Consumer', icon: 'fa-shopping-cart', description: '', bg_color: 'bg-slate-100', icon_color: 'text-slate-600', card_bg_from: 'from-slate-50', card_bg_to: 'to-slate-100' },
      { id: 'labour', label: 'Labour', icon: 'fa-hard-hat', description: '', bg_color: 'bg-slate-100', icon_color: 'text-slate-600', card_bg_from: 'from-slate-50', card_bg_to: 'to-slate-100' },
      { id: 'tax', label: 'Tax', icon: 'fa-file-invoice-dollar', description: '', bg_color: 'bg-slate-100', icon_color: 'text-slate-600', card_bg_from: 'from-slate-50', card_bg_to: 'to-slate-100' },
      { id: 'ip', label: 'IP Rights', icon: 'fa-trademark', description: '', bg_color: 'bg-slate-100', icon_color: 'text-slate-600', card_bg_from: 'from-slate-50', card_bg_to: 'to-slate-100' },
      { id: 'docs', label: 'Documentation', icon: 'fa-file-alt', description: '', bg_color: 'bg-slate-100', icon_color: 'text-slate-600', card_bg_from: 'from-slate-50', card_bg_to: 'to-slate-100' },
      { id: 'cyber', label: 'Cyber Law', icon: 'fa-laptop', description: '', bg_color: 'bg-slate-100', icon_color: 'text-slate-600', card_bg_from: 'from-slate-50', card_bg_to: 'to-slate-100' },
      { id: 'court', label: 'Court Services', icon: 'fa-landmark', description: '', bg_color: 'bg-slate-100', icon_color: 'text-slate-600', card_bg_from: 'from-slate-50', card_bg_to: 'to-slate-100' }
    ];
    for (const c of seed) {
      await sql`INSERT INTO legal_service_categories (id, label, icon, description, bg_color, icon_color, card_bg_from, card_bg_to) VALUES (${c.id}, ${c.label}, ${c.icon}, ${c.description}, ${c.bg_color}, ${c.icon_color}, ${c.card_bg_from}, ${c.card_bg_to})`;
    }
  }
  return await sql`SELECT * FROM legal_service_categories ORDER BY id ASC`;
}

export async function getLegalServices() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS legal_services (
      id SERIAL PRIMARY KEY,
      category_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      slug TEXT,
      content TEXT,
      image TEXT,
      meta_title TEXT,
      meta_description TEXT,
      keywords TEXT,
      schema_markup TEXT
    )
  `;
  
  // Safe migrations for new columns on existing tables
  try { await sql`ALTER TABLE legal_services ADD COLUMN IF NOT EXISTS slug TEXT`; } catch(e) {}
  try { await sql`ALTER TABLE legal_services ADD COLUMN IF NOT EXISTS content TEXT`; } catch(e) {}
  try { await sql`ALTER TABLE legal_services ADD COLUMN IF NOT EXISTS image TEXT`; } catch(e) {}
  try { await sql`ALTER TABLE legal_services ADD COLUMN IF NOT EXISTS meta_title TEXT`; } catch(e) {}
  try { await sql`ALTER TABLE legal_services ADD COLUMN IF NOT EXISTS meta_description TEXT`; } catch(e) {}
  try { await sql`ALTER TABLE legal_services ADD COLUMN IF NOT EXISTS keywords TEXT`; } catch(e) {}
  try { await sql`ALTER TABLE legal_services ADD COLUMN IF NOT EXISTS schema_markup TEXT`; } catch(e) {}

  return await sql`SELECT * FROM legal_services ORDER BY id DESC`;
}

export async function getLegalServiceBySlug(slug) {
  const sql = getSql();
  const res = await sql`SELECT * FROM legal_services WHERE slug = ${slug}`;
  return res.length > 0 ? res[0] : null;
}

export async function createLegalService(data) {
  const sql = getSql();
  return await sql`
    INSERT INTO legal_services (category_id, title, description, icon, slug, content, image, meta_title, meta_description, keywords, schema_markup)
    VALUES (${data.category_id}, ${data.title}, ${data.description || ''}, ${data.icon || ''}, ${data.slug || ''}, ${data.content || ''}, ${data.image || ''}, ${data.meta_title || ''}, ${data.meta_description || ''}, ${data.keywords || ''}, ${data.schema_markup || ''})
    RETURNING *
  `;
}

export async function updateLegalService(id, data) {
  const sql = getSql();
  return await sql`
    UPDATE legal_services
    SET category_id = ${data.category_id},
        title = ${data.title},
        description = ${data.description || ''},
        icon = ${data.icon || ''},
        slug = ${data.slug || ''},
        content = ${data.content || ''},
        image = ${data.image || ''},
        meta_title = ${data.meta_title || ''},
        meta_description = ${data.meta_description || ''},
        keywords = ${data.keywords || ''},
        schema_markup = ${data.schema_markup || ''}
    WHERE id = ${id}
    RETURNING *
  `;
}

export async function deleteLegalService(id) {
  const sql = getSql();
  return await sql`DELETE FROM legal_services WHERE id = ${id}`;
}

// Export raw sql for migrations/setup
export const sql = (strings, ...values) => {
  const s = getSql();
  return s(strings, ...values);
};
