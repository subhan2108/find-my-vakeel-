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

// Export raw sql for migrations/setup
export const sql = (strings, ...values) => {
  const s = getSql();
  return s(strings, ...values);
};
