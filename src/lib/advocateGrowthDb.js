import { neon } from '@neondatabase/serverless';

const getSql = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing. Please add it to .env.local');
  }
  return neon(process.env.DATABASE_URL);
};

// ─────────────────────────────────────────────────────────────────────────────
// TABLE INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────
export async function initAgDb() {
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS ag_categories (
      id   TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      icon  TEXT DEFAULT '',
      display_order INTEGER DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS ag_services (
      id               SERIAL PRIMARY KEY,
      title            TEXT NOT NULL,
      slug             TEXT UNIQUE NOT NULL,
      category_id      TEXT,
      short_description TEXT DEFAULT '',
      icon             TEXT DEFAULT '',
      badge            TEXT DEFAULT '',
      image            TEXT DEFAULT '',
      rating           TEXT DEFAULT '5',
      status           TEXT DEFAULT 'draft',
      display_order    INTEGER DEFAULT 0,
      created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS ag_service_pages (
      id               SERIAL PRIMARY KEY,
      service_id       INTEGER UNIQUE NOT NULL REFERENCES ag_services(id) ON DELETE CASCADE,
      hero_heading     TEXT DEFAULT '',
      hero_description TEXT DEFAULT '',
      hero_image       TEXT DEFAULT '',
      content          TEXT DEFAULT '',
      benefits         JSONB DEFAULT '[]',
      features         JSONB DEFAULT '[]',
      how_it_works     JSONB DEFAULT '[]',
      pricing          JSONB DEFAULT '[]',
      faqs             JSONB DEFAULT '[]',
      testimonials     JSONB DEFAULT '[]',
      cta_heading      TEXT DEFAULT '',
      cta_description  TEXT DEFAULT '',
      cta_button_text  TEXT DEFAULT '',
      cta_button_url   TEXT DEFAULT '',
      related_services JSONB DEFAULT '[]',
      meta_title       TEXT DEFAULT '',
      meta_description TEXT DEFAULT '',
      meta_keywords    TEXT DEFAULT '',
      canonical_url    TEXT DEFAULT '',
      og_title         TEXT DEFAULT '',
      og_description   TEXT DEFAULT '',
      og_image         TEXT DEFAULT '',
      schema_markup    TEXT DEFAULT '',
      updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS ag_landing (
      key   TEXT PRIMARY KEY,
      value JSONB
    )
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────
export async function getAgCategories() {
  const sql = getSql();
  await initAgDb();
  return await sql`SELECT * FROM ag_categories ORDER BY display_order ASC, label ASC`;
}

export async function upsertAgCategory(data) {
  const sql = getSql();
  await initAgDb();
  return await sql`
    INSERT INTO ag_categories (id, label, icon, display_order)
    VALUES (${data.id}, ${data.label}, ${data.icon || ''}, ${data.display_order || 0})
    ON CONFLICT (id) DO UPDATE SET
      label         = EXCLUDED.label,
      icon          = EXCLUDED.icon,
      display_order = EXCLUDED.display_order
    RETURNING *
  `;
}

export async function deleteAgCategory(id) {
  const sql = getSql();
  await initAgDb();
  return await sql`DELETE FROM ag_categories WHERE id = ${id}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES (Grid Cards)
// ─────────────────────────────────────────────────────────────────────────────
export async function getAgServices() {
  const sql = getSql();
  await initAgDb();
  return await sql`SELECT * FROM ag_services ORDER BY display_order ASC, created_at DESC`;
}

export async function getPublishedAgServices() {
  const sql = getSql();
  await initAgDb();
  return await sql`SELECT * FROM ag_services WHERE status = 'published' ORDER BY display_order ASC, created_at DESC`;
}

export async function getAgServiceBySlug(slug) {
  const sql = getSql();
  await initAgDb();
  const res = await sql`SELECT * FROM ag_services WHERE slug = ${slug}`;
  return res[0] || null;
}

export async function createAgService(data) {
  const sql = getSql();
  await initAgDb();
  const [service] = await sql`
    INSERT INTO ag_services (title, slug, category_id, short_description, icon, badge, image, rating, status, display_order)
    VALUES (
      ${data.title}, ${data.slug}, ${data.category_id || null},
      ${data.short_description || ''}, ${data.icon || ''}, ${data.badge || ''},
      ${data.image || ''}, ${data.rating || '5'}, ${data.status || 'draft'},
      ${data.display_order || 0}
    )
    RETURNING *
  `;
  // Auto-create empty service page
  await sql`
    INSERT INTO ag_service_pages (service_id) VALUES (${service.id})
    ON CONFLICT (service_id) DO NOTHING
  `;
  return service;
}

export async function updateAgService(id, data) {
  const sql = getSql();
  await initAgDb();
  const [service] = await sql`
    UPDATE ag_services SET
      title             = ${data.title},
      slug              = ${data.slug},
      category_id       = ${data.category_id || null},
      short_description = ${data.short_description || ''},
      icon              = ${data.icon || ''},
      badge             = ${data.badge || ''},
      image             = ${data.image || ''},
      rating            = ${data.rating || '5'},
      status            = ${data.status || 'draft'},
      display_order     = ${data.display_order || 0},
      updated_at        = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
  return service;
}

export async function deleteAgService(id) {
  const sql = getSql();
  await initAgDb();
  // ag_service_pages cascades via FK
  return await sql`DELETE FROM ag_services WHERE id = ${id}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE PAGES (Individual Rich Pages)
// ─────────────────────────────────────────────────────────────────────────────
export async function getAgServicePage(serviceId) {
  const sql = getSql();
  await initAgDb();
  const res = await sql`SELECT * FROM ag_service_pages WHERE service_id = ${serviceId}`;
  return res[0] || null;
}

export async function getAgServicePageBySlug(slug) {
  const sql = getSql();
  await initAgDb();
  const res = await sql`
    SELECT sp.*, s.title, s.slug, s.category_id, s.icon, s.badge, s.image, s.rating, s.status, s.short_description
    FROM ag_service_pages sp
    JOIN ag_services s ON s.id = sp.service_id
    WHERE s.slug = ${slug} AND s.status = 'published'
  `;
  return res[0] || null;
}

export async function upsertAgServicePage(serviceId, data) {
  const sql = getSql();
  await initAgDb();
  const benefitsJson = typeof data.benefits === 'string' ? data.benefits : JSON.stringify(data.benefits || []);
  const featuresJson = typeof data.features === 'string' ? data.features : JSON.stringify(data.features || []);
  const howItWorksJson = typeof data.how_it_works === 'string' ? data.how_it_works : JSON.stringify(data.how_it_works || []);
  const pricingJson = typeof data.pricing === 'string' ? data.pricing : JSON.stringify(data.pricing || []);
  const faqsJson = typeof data.faqs === 'string' ? data.faqs : JSON.stringify(data.faqs || []);
  const testimonialsJson = typeof data.testimonials === 'string' ? data.testimonials : JSON.stringify(data.testimonials || []);
  const relatedJson = typeof data.related_services === 'string' ? data.related_services : JSON.stringify(data.related_services || []);

  return await sql`
    INSERT INTO ag_service_pages (
      service_id, hero_heading, hero_description, hero_image, content,
      benefits, features, how_it_works, pricing, faqs, testimonials,
      cta_heading, cta_description, cta_button_text, cta_button_url,
      related_services,
      meta_title, meta_description, meta_keywords, canonical_url,
      og_title, og_description, og_image, schema_markup
    ) VALUES (
      ${serviceId}, ${data.hero_heading || ''}, ${data.hero_description || ''}, ${data.hero_image || ''},
      ${data.content || ''}, ${benefitsJson}, ${featuresJson}, ${howItWorksJson},
      ${pricingJson}, ${faqsJson}, ${testimonialsJson},
      ${data.cta_heading || ''}, ${data.cta_description || ''}, ${data.cta_button_text || ''}, ${data.cta_button_url || ''},
      ${relatedJson},
      ${data.meta_title || ''}, ${data.meta_description || ''}, ${data.meta_keywords || ''}, ${data.canonical_url || ''},
      ${data.og_title || ''}, ${data.og_description || ''}, ${data.og_image || ''}, ${data.schema_markup || ''}
    )
    ON CONFLICT (service_id) DO UPDATE SET
      hero_heading     = EXCLUDED.hero_heading,
      hero_description = EXCLUDED.hero_description,
      hero_image       = EXCLUDED.hero_image,
      content          = EXCLUDED.content,
      benefits         = EXCLUDED.benefits,
      features         = EXCLUDED.features,
      how_it_works     = EXCLUDED.how_it_works,
      pricing          = EXCLUDED.pricing,
      faqs             = EXCLUDED.faqs,
      testimonials     = EXCLUDED.testimonials,
      cta_heading      = EXCLUDED.cta_heading,
      cta_description  = EXCLUDED.cta_description,
      cta_button_text  = EXCLUDED.cta_button_text,
      cta_button_url   = EXCLUDED.cta_button_url,
      related_services = EXCLUDED.related_services,
      meta_title       = EXCLUDED.meta_title,
      meta_description = EXCLUDED.meta_description,
      meta_keywords    = EXCLUDED.meta_keywords,
      canonical_url    = EXCLUDED.canonical_url,
      og_title         = EXCLUDED.og_title,
      og_description   = EXCLUDED.og_description,
      og_image         = EXCLUDED.og_image,
      schema_markup    = EXCLUDED.schema_markup,
      updated_at       = CURRENT_TIMESTAMP
    RETURNING *
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// LANDING PAGE SETTINGS
// ─────────────────────────────────────────────────────────────────────────────
export async function getAgLanding() {
  const sql = getSql();
  await initAgDb();
  const rows = await sql`SELECT * FROM ag_landing`;
  const out = {};
  rows.forEach(r => { out[r.key] = r.value; });
  return out;
}

export async function saveAgLandingKey(key, value) {
  const sql = getSql();
  await initAgDb();
  const valueJson = typeof value === 'string' ? value : JSON.stringify(value);
  return await sql`
    INSERT INTO ag_landing (key, value)
    VALUES (${key}, ${valueJson}::jsonb)
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    RETURNING *
  `;
}
