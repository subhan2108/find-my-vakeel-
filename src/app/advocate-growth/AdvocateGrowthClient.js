'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ── Render star rating ────────────────────────────────────────────────────────
function StarRating({ rating = '5' }) {
  const r = parseFloat(rating);
  return (
    <div className="flex text-[#d4af37] text-xs">
      {[1, 2, 3, 4, 5].map(i => (
        <i key={i} className={`fas ${i <= Math.floor(r) ? 'fa-star' : i - 0.5 <= r ? 'fa-star-half-alt' : 'fa-star text-white/20'}`}></i>
      ))}
    </div>
  );
}

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const n = parseInt(String(target).replace(/,/g, ''), 10);
      const step = Math.ceil(n / 60);
      let cur = 0;
      const timer = setInterval(() => {
        cur = Math.min(cur + step, n);
        setCount(cur);
        if (cur >= n) clearInterval(timer);
      }, 20);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString('en-IN')}{suffix}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AdvocateGrowthClient({ services = [], categories = [], landing = {} }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(s => s.category_id === activeCategory);

  // Defaults from landing settings
  const L = {
    hero_subheading: "India's #1 Advocate Growth Platform",
    hero_heading: 'Grow Your Legal Practice With Confidence',
    hero_description: 'From verified client leads to digital marketing mastery — everything you need to build a thriving legal practice, all under one roof.',
    hero_btn_primary: 'Explore Services',
    hero_btn_secondary: 'View Pricing',
    stats_advocates: '10000',
    stats_leads: '50000',
    stats_services: '25',
    stats_success: '98',
    trusted_label: 'Trusted by advocates across India',
    services_heading: 'Everything You Need to Scale Your Practice',
    services_description: '25+ powerful tools and services designed specifically for Indian advocates to attract clients, build reputation, and grow revenue.',
    cta_heading: 'Ready to Grow Your Legal Practice?',
    cta_description: "Join 10,000+ advocates who are already growing their practice with Find My Vakeel.",
    cta_btn: 'Start Growing Today',
    phone: '+91 82618 89815',
    ...landing,
  };

  const allCategories = [
    { id: 'all', label: 'All Services', icon: 'fa-th-large' },
    ...categories,
  ];

  return (
    <>
      {/* ── Global Styles ─────────────────────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .ag-body { background: #0a1128; color: #e2e8f0; }
        .ag-text-gradient-gold {
          background: linear-gradient(135deg, #d4af37 0%, #f3e5ab 50%, #d4af37 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: ag-gradient 5s ease infinite;
        }
        @keyframes ag-gradient { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        .ag-hero-bg {
          background:
            radial-gradient(ellipse at top left, rgba(59,130,246,.15) 0%,transparent 50%),
            radial-gradient(ellipse at top right, rgba(212,175,55,.1) 0%,transparent 50%),
            radial-gradient(ellipse at bottom, rgba(30,58,138,.2) 0%,transparent 50%),
            linear-gradient(180deg,#0a1128 0%,#0f172a 100%);
        }
        .ag-grid-pattern {
          background-image: linear-gradient(rgba(212,175,55,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .ag-glass {
          background: rgba(255,255,255,.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,.08);
        }
        .ag-glass-gold {
          background: linear-gradient(135deg, rgba(212,175,55,.08) 0%, rgba(212,175,55,.02) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(212,175,55,.2);
        }
        .ag-service-card {
          background: linear-gradient(135deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,.01) 100%);
          border: 1px solid rgba(255,255,255,.08);
          transition: all .4s cubic-bezier(.4,0,.2,1);
          position: relative;
          overflow: hidden;
        }
        .ag-service-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
          background: linear-gradient(90deg,transparent,#d4af37,transparent);
          transform: scaleX(0); transition: transform .4s;
        }
        .ag-service-card:hover { transform:translateY(-8px); border-color:rgba(212,175,55,.3); background:linear-gradient(135deg,rgba(212,175,55,.08) 0%,rgba(255,255,255,.02) 100%); box-shadow:0 20px 60px rgba(212,175,55,.15); }
        .ag-service-card:hover::before { transform:scaleX(1); }
        .ag-service-card:hover .ag-svc-icon { transform:scale(1.1) rotate(-5deg); background:linear-gradient(135deg,#d4af37,#f3e5ab); }
        .ag-service-card:hover .ag-svc-icon i { color:#0a1128 !important; }
        .ag-svc-icon { transition: all .4s cubic-bezier(.4,0,.2,1); }
        .ag-category-pill { transition:all .3s; cursor:pointer; white-space:nowrap; }
        .ag-category-pill:hover { background:rgba(212,175,55,.15); border-color:rgba(212,175,55,.4); }
        .ag-category-pill.active { background:linear-gradient(135deg,#d4af37,#f3e5ab); color:#0a1128; border-color:transparent; font-weight:700; }
        .ag-btn-gold { background:linear-gradient(135deg,#d4af37 0%,#f3e5ab 50%,#d4af37 100%); background-size:200% auto; color:#0a1128; font-weight:700; transition:all .3s; }
        .ag-btn-gold:hover { background-position:right center; box-shadow:0 10px 40px rgba(212,175,55,.4); transform:translateY(-2px); }
        .ag-btn-outline { background:transparent; border:2px solid rgba(212,175,55,.4); color:#d4af37; font-weight:600; transition:all .3s; }
        .ag-btn-outline:hover { background:rgba(212,175,55,.1); border-color:#d4af37; }
        .ag-orb { position:absolute; border-radius:50%; filter:blur(80px); opacity:.4; pointer-events:none; }
        @keyframes ag-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        .ag-float { animation: ag-float 6s ease-in-out infinite; }
        .ag-badge { background:linear-gradient(135deg,#d4af37,#f3e5ab); color:#0a1128; font-weight:700; font-size:10px; padding:3px 10px; border-radius:20px; letter-spacing:.5px; text-transform:uppercase; box-shadow:0 4px 15px rgba(212,175,55,.4); }
        .ag-scroll-hide { scrollbar-width:none; }
        .ag-scroll-hide::-webkit-scrollbar { display:none; }
        .ag-divider { height:1px; background:linear-gradient(90deg,transparent,rgba(212,175,55,.3),transparent); }
      ` }} />

      <div className="ag-body">
        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section className="ag-hero-bg ag-grid-pattern min-h-screen flex items-center pt-32 pb-20 relative overflow-hidden">
          <div className="ag-orb w-96 h-96 ag-float" style={{ background: '#3b82f6', top: '5rem', left: '-12rem' }}></div>
          <div className="ag-orb w-96 h-96 ag-float" style={{ background: '#d4af37', top: '10rem', right: '-12rem', animationDelay: '2s' }}></div>

          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full ag-glass-gold mb-6">
                  <span className="w-2 h-2 bg-green-400 rounded-full" style={{ animation: 'pulse 2s infinite' }}></span>
                  <span className="text-xs md:text-sm font-semibold text-[#d4af37]">{L.hero_subheading}</span>
                </div>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {L.hero_heading.split(' ').slice(0, 2).join(' ')} <span className="ag-text-gradient-gold">{L.hero_heading.split(' ').slice(2).join(' ')}</span>
                </h1>
                <p className="text-base md:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">{L.hero_description}</p>
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <a href="#services" className="ag-btn-gold px-8 py-4 rounded-xl text-base flex items-center justify-center gap-2">
                    <span>{L.hero_btn_primary}</span><i className="fas fa-arrow-right"></i>
                  </a>
                  <a href="#cta" className="ag-btn-outline px-8 py-4 rounded-xl text-base flex items-center justify-center gap-2">
                    <i className="fas fa-phone-alt"></i><span>Talk to Us</span>
                  </a>
                </div>
                {/* Trust */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {['A','R','S'].map((l, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a1128] flex items-center justify-center text-xs font-bold text-white" style={{ background: ['#3b82f6','#ec4899','#22c55e'][i] }}>{l}</div>
                      ))}
                    </div>
                    <span className="text-slate-400"><span className="text-white font-bold">10,000+</span> Advocates</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <i key={i} className="fas fa-star text-[#d4af37] text-sm"></i>)}
                    <span className="text-slate-400 ml-1">4.9/5</span>
                  </div>
                </div>
              </div>

              {/* Right — Dashboard Card */}
              <div className="relative">
                <div className="ag-glass-gold rounded-3xl p-8 relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-xs text-[#d4af37] uppercase tracking-wider font-semibold mb-1">Practice Dashboard</div>
                      <div className="text-2xl font-bold text-white">Advocate Growth</div>
                    </div>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#d4af37,#f3e5ab)' }}>
                      <i className="fas fa-chart-line text-[#0a1128] text-2xl"></i>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="rounded-2xl p-4 border border-white/10" style={{ background: 'rgba(255,255,255,.05)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,.2)' }}>
                          <i className="fas fa-users text-blue-400 text-sm"></i>
                        </div>
                        <span className="text-xs text-slate-400">New Leads</span>
                      </div>
                      <div className="text-2xl font-bold text-white">247</div>
                      <div className="text-xs text-green-400 mt-1"><i className="fas fa-arrow-up"></i> +32% this month</div>
                    </div>
                    <div className="rounded-2xl p-4 border border-white/10" style={{ background: 'rgba(255,255,255,.05)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,175,55,.2)' }}>
                          <i className="fas fa-briefcase text-[#d4af37] text-sm"></i>
                        </div>
                        <span className="text-xs text-slate-400">Cases Won</span>
                      </div>
                      <div className="text-2xl font-bold text-white">89</div>
                      <div className="text-xs text-green-400 mt-1"><i className="fas fa-arrow-up"></i> +18% this month</div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-300">Profile Completion</span>
                      <span className="text-[#d4af37] font-bold">92%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.05)' }}>
                      <div className="h-full rounded-full" style={{ width: '92%', background: 'linear-gradient(90deg,#d4af37,#f3e5ab)' }}></div>
                    </div>
                  </div>
                </div>
                {/* Floating badges */}
                <div className="absolute -top-6 -right-6 ag-glass rounded-2xl p-4 ag-float hidden md:block z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,.2)' }}><i className="fas fa-check-circle text-green-400"></i></div>
                    <div><div className="text-xs text-slate-400">Verified</div><div className="text-sm font-bold text-white">Bar Council</div></div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 ag-glass rounded-2xl p-4 ag-float hidden md:block z-20" style={{ animationDelay: '1.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,.2)' }}><i className="fas fa-crown text-[#d4af37]"></i></div>
                    <div><div className="text-xs text-slate-400">Premium</div><div className="text-sm font-bold text-white">Member</div></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { target: L.stats_advocates, label: 'Advocates Enrolled', suffix: '+' },
                { target: L.stats_leads, label: 'Client Leads Delivered', suffix: '+' },
                { target: L.stats_services, label: 'Growth Services', suffix: '+' },
                { target: L.stats_success, label: 'Success Rate', suffix: '%' },
              ].map(({ target, label, suffix }) => (
                <div key={label} className="text-center">
                  <div className="text-3xl md:text-5xl font-bold ag-text-gradient-gold" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <Counter target={target} />{suffix}
                  </div>
                  <div className="text-xs md:text-sm text-slate-400 mt-2 uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUSTED BY ────────────────────────────────────────────────────── */}
        <section className="py-16 border-y" style={{ borderColor: 'rgba(255,255,255,.05)', background: 'rgba(10,17,40,.5)' }}>
          <div className="container mx-auto px-4 md:px-8">
            <p className="text-center text-xs uppercase tracking-[.3em] text-slate-500 mb-8">{L.trusted_label}</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16" style={{ opacity: .6 }}>
              {[
                { icon: 'fa-landmark', label: 'Bar Council' },
                { icon: 'fa-gavel', label: 'Supreme Court' },
                { icon: 'fa-balance-scale', label: 'High Courts' },
                { icon: 'fa-university', label: 'District Courts' },
                { icon: 'fa-shield-alt', label: 'Tribunals' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-slate-400">
                  <i className={`fas ${icon} text-2xl`}></i>
                  <span className="font-serif font-bold">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICES ──────────────────────────────────────────────────────── */}
        <section id="services" className="py-20 md:py-32 relative">
          <div className="container mx-auto px-4 md:px-8">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full ag-glass-gold mb-6">
                <i className="fas fa-rocket text-[#d4af37] text-xs"></i>
                <span className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider">Our Services</span>
              </div>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                {L.services_heading.split(' ').slice(0, -2).join(' ')}{' '}
                <span className="ag-text-gradient-gold">{L.services_heading.split(' ').slice(-2).join(' ')}</span>
              </h2>
              <p className="text-slate-400 text-base md:text-lg">{L.services_description}</p>
            </div>

            {/* Category Filter */}
            <div className="flex overflow-x-auto ag-scroll-hide gap-3 mb-12 pb-2">
              {allCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`ag-category-pill px-5 py-2.5 rounded-full border border-white/10 text-sm ${activeCategory === cat.id ? 'active' : 'text-slate-300'}`}
                >
                  <i className={`fas ${cat.icon || 'fa-tag'} mr-2`}></i>{cat.label}
                </button>
              ))}
            </div>

            {/* Services Grid */}
            {filteredServices.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
                  <i className="fas fa-rocket text-slate-600 text-3xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No Services Yet</h3>
                <p className="text-slate-400">Services will appear here once published from the Admin Panel.</p>
                <Link href="/admin/advocate-growth" className="ag-btn-gold inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold mt-6">
                  <i className="fas fa-plus"></i> Add Services in Admin
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredServices.map(service => (
                  <div key={service.id} className="ag-service-card rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="ag-svc-icon w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,.2)' }}>
                        <i className={`fas ${service.icon || 'fa-rocket'} text-blue-400 text-xl`}></i>
                      </div>
                      {service.badge && <span className="ag-badge">{service.badge}</span>}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                    <p className="text-sm text-slate-400 mb-4 leading-relaxed">{service.short_description}</p>
                    <div className="flex items-center justify-between">
                      <Link href={`/advocate-growth/${service.slug}`} className="text-sm text-[#d4af37] font-semibold flex items-center gap-1 hover:text-[#f3e5ab] transition">
                        Learn More <i className="fas fa-arrow-right text-xs"></i>
                      </Link>
                      <StarRating rating={service.rating} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section id="cta" className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)' }}>
          <div className="ag-orb w-96 h-96 ag-float" style={{ background: '#d4af37', top: '-6rem', right: '-6rem' }}></div>
          <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full ag-glass-gold mb-6">
              <i className="fas fa-crown text-[#d4af37] text-xs"></i>
              <span className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider">Get Started Today</span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              {L.cta_heading}
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">{L.cta_description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`tel:${L.phone}`} className="ag-btn-gold px-10 py-4 rounded-xl text-base flex items-center justify-center gap-2">
                <i className="fas fa-phone"></i> <span>{L.cta_btn}</span>
              </a>
              <a href={`https://wa.me/${L.phone.replace(/\D/g, '')}`} className="ag-btn-outline px-10 py-4 rounded-xl text-base flex items-center justify-center gap-2">
                <i className="fab fa-whatsapp"></i> <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
