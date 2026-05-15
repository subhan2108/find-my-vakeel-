import { getCustomPagesByTag, getStaticSeo } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  let seo = null;
  try {
    seo = await getStaticSeo('/areas');
  } catch (err) {}

  const metadata = {
    title: seo?.meta_title || "Practice Areas | Find My Vakeel",
    description: seo?.meta_description || "Explore our specialized legal practice areas across India. Verified advocates for family, criminal, property, and corporate law.",
  };

  if (seo?.keywords) {
    metadata.keywords = seo.keywords;
  }

  if (seo?.canonical_url) {
    metadata.alternates = { canonical: seo.canonical_url };
  } else {
    metadata.alternates = { canonical: '/areas' };
  }

  return metadata;
}

export default async function AreasPage() {
  let schemaScript = null;
  try {
    const seo = await getStaticSeo('/areas');
    if (seo?.schema_markup) schemaScript = seo.schema_markup;
  } catch (err) {}

  let pages = [];
  let dbError = null;

  try {
    pages = await getCustomPagesByTag('areas');
  } catch (error) {
    dbError = error.message;
  }

  if (dbError && dbError.includes('DATABASE_URL is missing')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8 pt-32">
        <div className="glass-card p-10 rounded-3xl text-center max-w-lg border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-database text-brand-blue text-3xl"></i>
          </div>
          <h1 className="text-3xl font-bold mb-4">Database Not Configured</h1>
          <p className="text-slate-600 mb-8 text-sm">
            To view these pages, you need to add your Neon Database URL to the <code className="bg-slate-100 px-2 py-1 rounded">.env.local</code> file.
          </p>
        </div>
      </div>
    );
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
      <main className="pt-32 pb-20 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="text-brand-blue font-bold tracking-widest uppercase text-sm mb-4 block">Our Specializations</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-6">Legal <span className="text-gradient">Practice Areas</span></h1>
            <p className="text-slate-500 max-w-2xl mx-auto">Connecting you with verified specialized advocates for every legal need across India.</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {pages.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-200 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-balance-scale text-slate-200 text-3xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-2">No Specific Areas Listed Yet</h3>
                <p className="text-slate-400">Our team is currently documenting our specialized practice areas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pages.map((page, idx) => (
                  <Link 
                    key={page.slug} 
                    href={`/${page.slug}`}
                    className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-1 flex items-center justify-between"
                    data-aos="fade-up"
                    data-aos-delay={idx * 50}
                  >
                    <div>
                      <h3 className="text-xl font-bold text-brand-dark group-hover:text-brand-blue transition-colors">
                        {page.title || page.slug}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Explore Services</p>
                    </div>
                    <div className="w-12 h-12 bg-slate-50 group-hover:bg-brand-gold rounded-xl flex items-center justify-center text-slate-400 group-hover:text-brand-dark transition-all shadow-inner">
                      <i className="fas fa-chevron-right transition-transform group-hover:translate-x-1"></i>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
