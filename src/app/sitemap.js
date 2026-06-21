import { getPosts, getCustomPages } from '@/lib/db';

export const dynamic = 'force-dynamic'; // Ensures sitemap is always freshly generated
export const revalidate = 0; // Disable caching for the sitemap

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://findmyvakeel.com';

  let routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/areas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }
  ];

  try {
    // Add blog posts
    const posts = await getPosts();
    const postRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug || post.id}`,
      lastModified: new Date(post.date || new Date()),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
    routes = [...routes, ...postRoutes];
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
  }

  try {
    // Add custom pages
    const pages = await getCustomPages();
    const pageRoutes = pages.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: new Date(page.updated_at || new Date()),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
    routes = [...routes, ...pageRoutes];
  } catch (error) {
    console.error('Error fetching custom pages for sitemap:', error);
  }

  return routes;
}
