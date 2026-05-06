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
    INSERT INTO posts (title, content, image, type, category, date, author)
    VALUES (${post.title}, ${post.content}, ${post.image}, ${post.type}, ${post.category}, ${post.date}, ${post.author || 'Editorial Team'})
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
        author = ${post.author || 'Editorial Team'}
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

// Export raw sql for migrations/setup
export const sql = (strings, ...values) => {
  const s = getSql();
  return s(strings, ...values);
};
