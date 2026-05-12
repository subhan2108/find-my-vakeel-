import { getStaticSeo } from '@/lib/db';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  let seo = null;
  try {
    seo = await getStaticSeo('/');
  } catch (err) {
    console.error('Failed to fetch home SEO:', err.message);
  }

  const title = seo?.meta_title || "Find My Vakeel | India's #1 Legal Marketplace";
  const description = seo?.meta_description || "India's most trusted legal marketplace connecting clients with verified advocates across 100+ cities";

  const metadata = {
    title,
    description,
  };

  if (seo?.keywords) {
    metadata.keywords = seo.keywords;
  }

  if (seo?.canonical_url) {
    metadata.alternates = { canonical: seo.canonical_url };
  }

  return metadata;
}

export default async function Home() {
  let schemaScript = null;
  try {
    const seo = await getStaticSeo('/');
    if (seo?.schema_markup) {
      schemaScript = seo.schema_markup;
    }
  } catch (err) {
    // Ignore db missing errors gracefully on frontend
  }

  return (
    <>
      {schemaScript && typeof schemaScript === 'string' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: schemaScript.replace(/<script[^>]*>|<\/script>/gi, '') 
          }}
        />
      )}
      <HomeClient />
    </>
  );
}
