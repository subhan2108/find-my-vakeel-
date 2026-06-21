import { getLegalServiceBySlug, getLegalCategories } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await getLegalServiceBySlug(slug);
  if (!service) return { title: 'Service Not Found' };
  
  return {
    title: service.meta_title || `${service.title} | Find My Vakeel`,
    description: service.meta_description || service.description,
    keywords: service.keywords,
    alternates: {
      canonical: `/legal-services/${service.slug}`
    }
  };
}

export default async function LegalServiceSlugPage({ params }) {
  const { slug } = await params;
  const service = await getLegalServiceBySlug(slug);
  
  if (!service) {
    return notFound();
  }

  const categories = await getLegalCategories();
  const category = categories.find(c => c.id === service.category_id);

  const bgFrom = category?.card_bg_from || 'from-slate-50';
  const bgTo = category?.card_bg_to || 'to-slate-100';
  const iconColor = category?.icon_color || 'text-slate-600';

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pb-20">
      {service.schema_markup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: service.schema_markup }}
        />
      )}

      {/* Breadcrumbs */}
      <nav className="bg-white border-b border-slate-200 py-3">
        <div className="container mx-auto px-4">
          <ol className="breadcrumb flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <li><Link href="/" className="hover:text-brand-blue transition"><i className="fas fa-home"></i> Home</Link></li>
            <li><i className="fas fa-chevron-right text-xs"></i></li>
            <li><Link href="/legal-services" className="hover:text-brand-blue transition">Legal Services</Link></li>
            <li><i className="fas fa-chevron-right text-xs"></i></li>
            <li className="text-brand-dark font-medium">{service.title}</li>
          </ol>
        </div>
      </nav>

      {/* Header Area */}
      <header className="bg-brand-dark text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(212,175,55,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(26,86,219,0.3) 0%, transparent 50%)" }}></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${bgFrom} ${bgTo} flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <i className={`fas ${service.icon} ${iconColor} text-4xl`}></i>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-white/10 backdrop-blur border border-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-brand-gold">
                {category?.label || 'Legal Service'}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">{service.title}</h1>
            <p className="text-slate-300 text-lg max-w-2xl">{service.description}</p>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Article */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 prose prose-slate prose-lg max-w-none prose-headings:font-serif prose-headings:text-brand-dark prose-a:text-brand-blue hover:prose-a:text-brand-navy">
              {service.content ? (
                <div dangerouslySetInnerHTML={{ __html: service.content }} />
              ) : (
                <p>Detailed information about {service.title} will be updated soon. Please check back later or contact us directly for consultation.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 sticky top-32">
              <h3 className="text-xl font-bold text-brand-dark mb-4">Need Legal Help?</h3>
              <p className="text-slate-500 mb-6 text-sm">Consult with top verified lawyers in India for {service.title} cases.</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm font-semibold text-brand-dark">
                  <i className="fas fa-check-circle text-green-500"></i> Expert Consultation
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-brand-dark">
                  <i className="fas fa-check-circle text-green-500"></i> Verified Professionals
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-brand-dark">
                  <i className="fas fa-check-circle text-green-500"></i> Transparent Pricing
                </div>
              </div>

              <a href="tel:+918261889815" className="block w-full text-center bg-gradient-to-r from-brand-gold to-yellow-500 text-brand-dark py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 mb-4">
                <i className="fas fa-phone mr-2"></i> Call Now
              </a>
              <a href="#consult" className="block w-full text-center bg-brand-dark text-white py-4 rounded-xl font-bold shadow-md hover:bg-slate-800 transition-all">
                <i className="fas fa-envelope mr-2"></i> Request Callback
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
