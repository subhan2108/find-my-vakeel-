import { getPublishedAgServices, getAgCategories, getAgLanding } from '@/lib/advocateGrowthDb';
import AdvocateGrowthClient from './AdvocateGrowthClient';

export const dynamic = 'force-dynamic';

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata() {
  let landing = {};
  try { landing = await getAgLanding(); } catch {}
  return {
    title: landing.meta_title || 'Advocate Growth Center | Grow Your Legal Practice | Find My Vakeel',
    description: landing.meta_description || "India's most comprehensive Advocate Growth Center. Get verified client leads, build your professional profile, master digital marketing, and scale your legal practice with Find My Vakeel.",
    keywords: landing.meta_keywords || 'advocate growth, lawyer marketing, legal practice growth, advocate leads',
    alternates: { canonical: landing.canonical_url || '/advocate-growth' },
    openGraph: {
      title: landing.og_title || 'Advocate Growth Center | Find My Vakeel',
      description: landing.og_description || "India's #1 Advocate Growth Platform",
      images: landing.og_image ? [{ url: landing.og_image }] : [],
    },
  };
}

export default async function AdvocateGrowthPage() {
  let services = [], categories = [], landing = {};

  try {
    [services, categories, landing] = await Promise.all([
      getPublishedAgServices(),
      getAgCategories(),
      getAgLanding(),
    ]);
  } catch (e) {
    console.error('Advocate Growth Page error:', e);
  }

  // Schema markup
  const schema = landing.schema_markup || JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Find My Vakeel – Advocate Growth Center',
    url: 'https://findmyvakeel.com/advocate-growth',
    description: 'India\'s most comprehensive Advocate Growth Center.',
    areaServed: 'IN',
    serviceType: 'Legal Practice Growth Services',
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <AdvocateGrowthClient
        services={services}
        categories={categories}
        landing={landing}
      />
    </>
  );
}
