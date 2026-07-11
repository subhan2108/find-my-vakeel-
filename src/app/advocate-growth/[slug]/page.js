import { getAgServicePageBySlug, getPublishedAgServices } from '@/lib/advocateGrowthDb';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import FaqAccordion from './FaqAccordion';

export const dynamic = 'force-dynamic';

// ── Static Params for ISR/SSG (optional) ─────────────────────────────────────
export async function generateStaticParams() {
  try {
    const services = await getPublishedAgServices();
    return services.map(s => ({ slug: s.slug }));
  } catch { return []; }
}

// ── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  let data = null;
  try { data = await getAgServicePageBySlug(params.slug); } catch {}
  if (!data) return { title: 'Service Not Found | Find My Vakeel' };

  const title = data.meta_title || `${data.title} | Advocate Growth Center | Find My Vakeel`;
  const description = data.meta_description || data.short_description || data.hero_description || '';
  const canonical = data.canonical_url || `/advocate-growth/${params.slug}`;

  return {
    title,
    description,
    keywords: data.meta_keywords || '',
    alternates: { canonical },
    openGraph: {
      title: data.og_title || title,
      description: data.og_description || description,
      images: data.og_image ? [{ url: data.og_image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.og_title || title,
      description: data.og_description || description,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const parseJson = (v, fallback = []) => {
  if (Array.isArray(v)) return v;
  try { return JSON.parse(v || '[]'); } catch { return fallback; }
};

function StarRating({ rating = 5 }) {
  const r = parseFloat(rating);
  return (
    <div className="flex gap-0.5 text-[#d4af37]">
      {[1,2,3,4,5].map(i => (
        <i key={i} className={`fas ${i <= Math.floor(r) ? 'fa-star' : i - 0.5 <= r ? 'fa-star-half-alt' : 'fa-star opacity-20'} text-sm`}></i>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default async function AdvocateGrowthServicePage({ params }) {
  let data = null;
  try { data = await getAgServicePageBySlug(params.slug); } catch {}
  if (!data) notFound();

  const benefits   = parseJson(data.benefits);
  const features   = parseJson(data.features);
  const howItWorks = parseJson(data.how_it_works);
  const pricing    = parseJson(data.pricing);
  const faqs       = parseJson(data.faqs);
  const testimonials = parseJson(data.testimonials);

  // Schemas
  const serviceSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.title,
    description: data.short_description || data.hero_description,
    provider: { '@type': 'Organization', name: 'Find My Vakeel', url: 'https://findmyvakeel.com' },
    url: `https://findmyvakeel.com/advocate-growth/${params.slug}`,
  });

  const faqSchema = faqs.length > 0 ? JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }) : null;

  const breadcrumbSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://findmyvakeel.com' },
      { '@type': 'ListItem', position: 2, name: 'Advocate Growth Center', item: 'https://findmyvakeel.com/advocate-growth' },
      { '@type': 'ListItem', position: 3, name: data.title, item: `https://findmyvakeel.com/advocate-growth/${params.slug}` },
    ],
  });

  const customSchema = data.schema_markup;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serviceSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />}
      {customSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: customSchema }} />}

      <style dangerouslySetInnerHTML={{ __html: `
        .sp-body { background:#0a1128; color:#e2e8f0; font-family:'Inter',sans-serif; }
        .sp-hero { background: radial-gradient(ellipse at top left, rgba(59,130,246,.15) 0%,transparent 50%), radial-gradient(ellipse at top right,rgba(212,175,55,.1) 0%,transparent 50%), linear-gradient(180deg,#0a1128 0%,#0f172a 100%); }
        .sp-glass { background:rgba(255,255,255,.03); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,.08); }
        .sp-glass-gold { background:linear-gradient(135deg,rgba(212,175,55,.08) 0%,rgba(212,175,55,.02) 100%); backdrop-filter:blur(20px); border:1px solid rgba(212,175,55,.2); }
        .sp-card { background:linear-gradient(135deg,rgba(255,255,255,.04) 0%,rgba(255,255,255,.01) 100%); border:1px solid rgba(255,255,255,.08); }
        .sp-badge { background:linear-gradient(135deg,#d4af37,#f3e5ab); color:#0a1128; font-weight:700; font-size:10px; padding:3px 10px; border-radius:20px; text-transform:uppercase; }
        .sp-btn-gold { background:linear-gradient(135deg,#d4af37 0%,#f3e5ab 50%,#d4af37 100%); background-size:200% auto; color:#0a1128; font-weight:700; transition:all .3s; display:inline-flex; align-items:center; gap:8px; }
        .sp-btn-gold:hover { background-position:right center; box-shadow:0 10px 40px rgba(212,175,55,.4); transform:translateY(-2px); }
        .sp-text-gold { background:linear-gradient(135deg,#d4af37 0%,#f3e5ab 50%,#d4af37 100%); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:sp-grad 5s ease infinite; }
        @keyframes sp-grad { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        .sp-faq-content { max-height:0; overflow:hidden; transition:max-height .4s ease; }
        .sp-faq-item.open .sp-faq-content { max-height:500px; }
      ` }} />

      <div className="sp-body">
        {/* ── HERO ── */}
        <section className="sp-hero pt-32 pb-20 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
              <Link href="/" className="hover:text-[#d4af37] transition">Home</Link>
              <i className="fas fa-chevron-right text-xs"></i>
              <Link href="/advocate-growth" className="hover:text-[#d4af37] transition">Advocate Growth Center</Link>
              <i className="fas fa-chevron-right text-xs"></i>
              <span className="text-[#d4af37]">{data.title}</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                {data.badge && <span className="sp-badge mb-4 inline-block">{data.badge}</span>}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {data.hero_heading || data.title}
                </h1>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                  {data.hero_description || data.short_description}
                </p>
                <a href="tel:+918261889815" className="sp-btn-gold px-8 py-4 rounded-xl text-base">
                  <i className="fas fa-phone"></i> <span>Get Started — Free Consultation</span>
                </a>
              </div>
              {data.hero_image && (
                <div>
                  <img src={data.hero_image} alt={data.title} className="rounded-3xl w-full object-cover shadow-2xl" style={{ maxHeight: '400px' }} />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── MAIN CONTENT ── */}
        {data.content && (
          <section className="py-16 container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto prose prose-invert prose-lg" dangerouslySetInnerHTML={{ __html: data.content }} />
          </section>
        )}

        {/* ── BENEFITS ── */}
        {benefits.length > 0 && (
          <section className="py-16 relative" style={{ background: 'rgba(15,23,42,.5)' }}>
            <div className="container mx-auto px-4 md:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>
                Key <span className="sp-text-gold">Benefits</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((b, i) => (
                  <div key={i} className="sp-card rounded-2xl p-6">
                    {b.icon && (
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(212,175,55,.15)' }}>
                        <i className={`fas ${b.icon} text-[#d4af37] text-xl`}></i>
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-white mb-2">{b.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{b.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FEATURES ── */}
        {features.length > 0 && (
          <section className="py-16 container mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>
              Features & <span className="sp-text-gold">Capabilities</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div key={i} className="sp-glass-gold rounded-xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(212,175,55,.15)' }}>
                    <i className={`fas ${f.icon || 'fa-check'} text-[#d4af37]`}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{f.title}</h4>
                    <p className="text-slate-400 text-sm">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── HOW IT WORKS ── */}
        {howItWorks.length > 0 && (
          <section className="py-16 relative" style={{ background: 'rgba(15,23,42,.5)' }}>
            <div className="container mx-auto px-4 md:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>
                How It <span className="sp-text-gold">Works</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {howItWorks.map((step, i) => (
                  <div key={i} className="text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-[#0a1128]" style={{ background: 'linear-gradient(135deg,#d4af37,#f3e5ab)' }}>
                      {step.step || i + 1}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-slate-400 text-sm">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── PRICING ── */}
        {pricing.length > 0 && (
          <section className="py-16 container mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>
              Pricing <span className="sp-text-gold">Plans</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricing.map((plan, i) => (
                <div key={i} className={`rounded-2xl p-8 flex flex-col ${plan.is_popular ? 'border-2 relative' : 'sp-card'}`}
                  style={plan.is_popular ? { border: '2px solid #d4af37', background: 'linear-gradient(135deg,rgba(212,175,55,.1) 0%,rgba(212,175,55,.03) 100%)' } : {}}>
                  {plan.is_popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="sp-badge">Most Popular</span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-[#d4af37] mb-1">{plan.price}</div>
                  {plan.period && <div className="text-slate-500 text-sm mb-6">{plan.period}</div>}
                  <ul className="space-y-3 flex-1 mb-8">
                    {(Array.isArray(plan.features) ? plan.features : []).map((feat, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                        <i className="fas fa-check text-[#d4af37] mt-0.5 flex-shrink-0"></i>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="tel:+918261889815" className={`text-center py-3 px-6 rounded-xl font-bold transition ${plan.is_popular ? 'sp-btn-gold' : 'border border-white/20 text-white hover:border-[#d4af37] hover:text-[#d4af37]'}`}>
                    {plan.cta || 'Get Started'}
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── TESTIMONIALS ── */}
        {testimonials.length > 0 && (
          <section className="py-16 relative" style={{ background: 'rgba(15,23,42,.5)' }}>
            <div className="container mx-auto px-4 md:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>
                What Advocates <span className="sp-text-gold">Say</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((t, i) => (
                  <div key={i} className="sp-card rounded-2xl p-6">
                    <StarRating rating={t.rating} />
                    <p className="text-slate-300 text-sm leading-relaxed my-4">&ldquo;{t.review}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[#0a1128]" style={{ background: 'linear-gradient(135deg,#d4af37,#f3e5ab)' }}>
                        {(t.name || 'A')[0]}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{t.name}</div>
                        {t.role && <div className="text-slate-500 text-xs">{t.role}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FAQs ── */}
        {faqs.length > 0 && (
          <section className="py-16 container mx-auto px-4 md:px-8 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>
              Frequently Asked <span className="sp-text-gold">Questions</span>
            </h2>
            <FaqAccordion faqs={faqs} />
          </section>
        )}

        {/* ── CTA ── */}
        <section className="py-20 text-center" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 50%,#0f172a 100%)' }}>
          <div className="container mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {data.cta_heading || `Ready to Get Started with ${data.title}?`}
            </h2>
            {data.cta_description && <p className="text-slate-300 max-w-2xl mx-auto mb-8">{data.cta_description}</p>}
            <a href={data.cta_button_url || 'tel:+918261889815'} className="sp-btn-gold px-10 py-4 rounded-xl text-base">
              <i className="fas fa-phone"></i>
              <span>{data.cta_button_text || 'Contact Us Now'}</span>
            </a>
            <div className="mt-6">
              <Link href="/advocate-growth" className="text-slate-400 hover:text-[#d4af37] text-sm transition">
                <i className="fas fa-arrow-left mr-1"></i> Back to Advocate Growth Center
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
