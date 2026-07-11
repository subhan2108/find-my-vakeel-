'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const toSlug = (s) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
const parseJson = (v, fallback = []) => {
  if (Array.isArray(v)) return v;
  try { return JSON.parse(v || '[]'); } catch { return fallback; }
};

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT STATES
// ─────────────────────────────────────────────────────────────────────────────
const emptyService = {
  title: '', slug: '', category_id: '', short_description: '',
  icon: 'fa-rocket', badge: '', image: '', rating: '5', status: 'draft', display_order: 0
};

const emptyPage = {
  hero_heading: '', hero_description: '', hero_image: '', content: '',
  benefits: '[]', features: '[]', how_it_works: '[]',
  pricing: '[]', faqs: '[]', testimonials: '[]',
  cta_heading: '', cta_description: '', cta_button_text: 'Get Started', cta_button_url: '',
  related_services: '[]',
  meta_title: '', meta_description: '', meta_keywords: '',
  canonical_url: '', og_title: '', og_description: '', og_image: '', schema_markup: ''
};

const emptyCategory = { id: '', label: '', icon: 'fa-th-large', display_order: 0 };

const defaultLanding = {
  hero_heading: 'Grow Your Legal Practice With Confidence',
  hero_subheading: "India's #1 Advocate Growth Platform",
  hero_description: 'From verified client leads to digital marketing mastery — everything you need to build a thriving legal practice, all under one roof.',
  hero_btn_primary: 'Explore Services',
  hero_btn_secondary: 'View Pricing',
  hero_image: '',
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
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function FormField({ label, children, hint }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-gold outline-none bg-white ${className}`}
      {...props}
    />
  );
}

function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-gold outline-none bg-white resize-y ${className}`}
      {...props}
    />
  );
}

function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-gold outline-none bg-white ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

function JsonArrayField({ label, value, onChange, placeholder, hint }) {
  const arr = parseJson(value);
  const str = JSON.stringify(arr, null, 2);
  return (
    <FormField label={label} hint={hint || 'JSON array format. E.g. [{"title":"...","description":"..."}]'}>
      <Textarea
        value={str}
        onChange={e => onChange(e.target.value)}
        rows={6}
        className="font-mono text-xs"
        placeholder={placeholder}
      />
    </FormField>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${
        active ? 'bg-brand-gold text-brand-dark' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
      status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
    }`}>
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function AdvocateGrowthAdmin() {
  const [tab, setTab] = useState('services');
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [landing, setLanding] = useState(defaultLanding);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Service form
  const [svcForm, setSvcForm] = useState(emptyService);
  const [editingSvcId, setEditingSvcId] = useState(null);

  // Page content form
  const [pageForm, setPageForm] = useState(emptyPage);
  const [editingPageSvcId, setEditingPageSvcId] = useState(null);
  const [editingPageSvcTitle, setEditingPageSvcTitle] = useState('');

  // Category form
  const [catForm, setCatForm] = useState(emptyCategory);
  const [editingCatId, setEditingCatId] = useState(null);

  // ── Fetch ──
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [svcsRes, catsRes, landingRes] = await Promise.all([
        fetch('/api/advocate-growth/services'),
        fetch('/api/advocate-growth/categories'),
        fetch('/api/advocate-growth/landing'),
      ]);
      if (svcsRes.ok) setServices(await svcsRes.json());
      if (catsRes.ok) setCategories(await catsRes.json());
      if (landingRes.ok) {
        const l = await landingRes.json();
        setLanding(prev => ({ ...defaultLanding, ...prev, ...l }));
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
      if (!active) return;
      const token = localStorage.getItem('vakeel_admin_token');
      if (token === 'authenticated_vakeel_session') {
        setIsAuthenticated(true);
        fetchAll();
      } else {
        setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [fetchAll]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPassword })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('vakeel_admin_token', data.token);
        setIsAuthenticated(true);
        fetchAll();
      } else {
        setAuthError('Access Denied: Incorrect Password');
      }
    } catch (err) {
      setAuthError('Authentication failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vakeel_admin_token');
    setIsAuthenticated(false);
    setLoginPassword('');
  };

  const notify = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  // ── Service CRUD ──
  const submitService = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...svcForm };
    if (!payload.slug) payload.slug = toSlug(payload.title);
    const url = editingSvcId ? `/api/advocate-growth/services/${editingSvcId}` : '/api/advocate-growth/services';
    const method = editingSvcId ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) { notify(editingSvcId ? 'Service updated!' : 'Service created!'); resetSvcForm(); fetchAll(); }
    else { notify('Failed to save service', 'error'); }
  };

  const resetSvcForm = () => { setSvcForm(emptyService); setEditingSvcId(null); };
  const editService = (s) => { setSvcForm(s); setEditingSvcId(s.id); setTab('services'); window.scrollTo(0, 0); };
  const deleteService = async (id) => {
    if (!confirm('Delete this service and its page?')) return;
    await fetch(`/api/advocate-growth/services/${id}`, { method: 'DELETE' });
    fetchAll(); notify('Service deleted');
  };

  // ── Page Content ──
  const openPageEditor = async (service) => {
    setEditingPageSvcId(service.id);
    setEditingPageSvcTitle(service.title);
    setTab('page-editor');
    const res = await fetch(`/api/advocate-growth/services/${service.id}`);
    if (res.ok) {
      const data = await res.json();
      setPageForm({
        ...emptyPage,
        ...data,
        benefits: JSON.stringify(parseJson(data.benefits), null, 2),
        features: JSON.stringify(parseJson(data.features), null, 2),
        how_it_works: JSON.stringify(parseJson(data.how_it_works), null, 2),
        pricing: JSON.stringify(parseJson(data.pricing), null, 2),
        faqs: JSON.stringify(parseJson(data.faqs), null, 2),
        testimonials: JSON.stringify(parseJson(data.testimonials), null, 2),
        related_services: JSON.stringify(parseJson(data.related_services), null, 2),
      });
    }
    window.scrollTo(0, 0);
  };

  const submitPage = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/advocate-growth/services/${editingPageSvcId}/page`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pageForm),
    });
    setSaving(false);
    if (res.ok) { notify('Page content saved!'); }
    else { notify('Failed to save page', 'error'); }
  };

  // ── Category CRUD ──
  const submitCategory = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/advocate-growth/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catForm),
    });
    setSaving(false);
    if (res.ok) { notify('Category saved!'); setCatForm(emptyCategory); setEditingCatId(null); fetchAll(); }
    else { notify('Failed to save category', 'error'); }
  };

  const deleteCategory = async (id) => {
    if (!confirm('Delete this category?')) return;
    await fetch(`/api/advocate-growth/categories?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    fetchAll(); notify('Category deleted');
  };

  // ── Landing ──
  const saveLanding = async (e) => {
    e.preventDefault();
    setSaving(true);
    const sections = {};
    Object.entries(landing).forEach(([k, v]) => { sections[k] = v; });
    const res = await fetch('/api/advocate-growth/landing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sections }),
    });
    setSaving(false);
    if (res.ok) notify('Landing page settings saved!');
    else notify('Failed to save', 'error');
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-2">
          <i className="fas fa-circle-notch fa-spin text-2xl text-brand-gold"></i>
          <span className="text-sm font-bold">Loading…</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-brand-dark p-8 relative overflow-hidden">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.05)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] pointer-events-none"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-brand-blue/10 blur-[120px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-brand-gold/10 blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-serif font-black text-white mb-2 tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
              Find My <span className="bg-gradient-to-r from-brand-gold via-brand-yellow to-brand-gold bg-clip-text text-transparent">Vakeel</span>
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Advocate Growth Admin Center</p>
          </div>
          
          <form onSubmit={handleLogin} className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="mb-6">
              <label className="block text-white text-sm font-bold mb-2 ml-1 uppercase tracking-widest">Master Password</label>
              <input 
                type="password" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-gold outline-none transition-all"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter password..."
                required
              />
              {authError && <p className="text-red-400 text-xs mt-3 font-bold flex items-center gap-2"><i className="fas fa-circle-exclamation"></i> {authError}</p>}
            </div>
            <button type="submit" className="w-full btn-gold text-brand-dark py-4 rounded-2xl font-black text-lg shadow-xl uppercase tracking-widest">
              Access Dashboard
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <Link href="/admin" className="text-slate-500 hover:text-brand-gold text-sm font-bold flex items-center justify-center gap-2 transition-colors">
              <i className="fas fa-arrow-left"></i> Back to Main Admin
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/admin" className="text-sm text-slate-400 hover:text-brand-gold transition flex items-center gap-1">
                <i className="fas fa-arrow-left text-xs"></i> Main Admin
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-sm font-bold text-brand-gold">Advocate Growth Center</span>
            </div>
            <h1 className="text-2xl font-bold text-brand-dark">Advocate Growth Center CMS</h1>
            <p className="text-slate-500 text-sm">Fully dynamic CMS — completely separate from Blog & Legal Services</p>
          </div>
          <div className="flex gap-3">
            <a href="/advocate-growth" target="_blank" className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition">
              <i className="fas fa-external-link-alt text-xs"></i> View Page
            </a>
            <button onClick={handleLogout} className="bg-brand-dark text-white hover:bg-slate-800 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition">
              <i className="fas fa-sign-out-alt text-xs"></i> Logout
            </button>
          </div>
        </div>

        {/* Toast */}
        {msg.text && (
          <div className={`fixed top-24 right-6 z-50 px-5 py-3 rounded-xl text-sm font-bold shadow-xl flex items-center gap-2 ${
            msg.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}>
            <i className={`fas ${msg.type === 'error' ? 'fa-circle-xmark' : 'fa-circle-check'}`}></i>
            {msg.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <TabBtn active={tab === 'services'} onClick={() => setTab('services')}>
            <i className="fas fa-rocket mr-1.5"></i> Services
          </TabBtn>
          {tab === 'page-editor' && (
            <TabBtn active={true} onClick={() => {}}>
              <i className="fas fa-file-pen mr-1.5"></i> Page: {editingPageSvcTitle}
            </TabBtn>
          )}
          <TabBtn active={tab === 'categories'} onClick={() => setTab('categories')}>
            <i className="fas fa-tags mr-1.5"></i> Categories
          </TabBtn>
          <TabBtn active={tab === 'landing'} onClick={() => setTab('landing')}>
            <i className="fas fa-home mr-1.5"></i> Landing Page
          </TabBtn>
        </div>

        {loading && <div className="text-center py-20 text-slate-400">Loading…</div>}

        {/* ═══════════════════════════════════════════════════════ SERVICES TAB */}
        {!loading && tab === 'services' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-28">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-brand-dark">{editingSvcId ? 'Edit Service' : 'New Service'}</h3>
                  {editingSvcId && <button onClick={resetSvcForm} className="text-xs text-red-500 font-bold hover:underline">Cancel</button>}
                </div>
                <form onSubmit={submitService} className="space-y-3">
                  <FormField label="Title">
                    <Input value={svcForm.title} onChange={e => setSvcForm({ ...svcForm, title: e.target.value, slug: toSlug(e.target.value) })} placeholder="e.g. Client Leads" required />
                  </FormField>
                  <FormField label="Slug (URL)">
                    <Input value={svcForm.slug} onChange={e => setSvcForm({ ...svcForm, slug: e.target.value })} placeholder="client-leads" required />
                  </FormField>
                  <FormField label="Category">
                    <Select value={svcForm.category_id} onChange={e => setSvcForm({ ...svcForm, category_id: e.target.value })}>
                      <option value="">— No Category —</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </Select>
                  </FormField>
                  <FormField label="Short Description">
                    <Textarea value={svcForm.short_description} onChange={e => setSvcForm({ ...svcForm, short_description: e.target.value })} rows={3} placeholder="Get verified client leads directly to your phone…" />
                  </FormField>
                  <FormField label="Icon (FontAwesome)" hint="e.g. fa-user-tie">
                    <Input value={svcForm.icon} onChange={e => setSvcForm({ ...svcForm, icon: e.target.value })} placeholder="fa-user-tie" />
                  </FormField>
                  <FormField label="Badge" hint="e.g. Hot, Premium, New, Verified, Pro (leave blank for none)">
                    <Input value={svcForm.badge} onChange={e => setSvcForm({ ...svcForm, badge: e.target.value })} placeholder="Hot" />
                  </FormField>
                  <FormField label="Image URL">
                    <Input type="url" value={svcForm.image} onChange={e => setSvcForm({ ...svcForm, image: e.target.value })} placeholder="https://..." />
                  </FormField>
                  <FormField label="Rating" hint="e.g. 5 or 4.5">
                    <Input value={svcForm.rating} onChange={e => setSvcForm({ ...svcForm, rating: e.target.value })} placeholder="5" />
                  </FormField>
                  <FormField label="Display Order" hint="Lower number = shown first">
                    <Input type="number" value={svcForm.display_order} onChange={e => setSvcForm({ ...svcForm, display_order: parseInt(e.target.value) })} />
                  </FormField>
                  <FormField label="Status">
                    <Select value={svcForm.status} onChange={e => setSvcForm({ ...svcForm, status: e.target.value })}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </Select>
                  </FormField>
                  <button type="submit" disabled={saving} className="w-full btn-gold text-brand-dark py-2.5 rounded-xl font-bold mt-2">
                    {saving ? 'Saving…' : editingSvcId ? 'Update Service' : 'Create Service'}
                  </button>
                </form>
              </div>
            </div>

            {/* List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="font-bold text-brand-dark">All Services</h3>
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{services.length} total</span>
                </div>
                {services.length === 0 ? (
                  <div className="p-16 text-center text-slate-400">No services yet. Create one on the left.</div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {services.map(s => (
                      <div key={s.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                          <i className={`fas ${s.icon || 'fa-rocket'} text-brand-gold`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-brand-dark text-sm">{s.title}</span>
                            {s.badge && <span className="bg-brand-gold text-brand-dark text-[9px] font-bold px-1.5 py-0.5 rounded">{s.badge}</span>}
                            <StatusBadge status={s.status} />
                          </div>
                          <a href={`/advocate-growth/${s.slug}`} target="_blank" className="text-[10px] text-brand-blue hover:underline">/advocate-growth/{s.slug}</a>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button onClick={() => openPageEditor(s)} className="px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-600 text-xs font-bold hover:bg-purple-100 transition" title="Edit page content">
                            <i className="fas fa-file-pen mr-1"></i>Page
                          </button>
                          <button onClick={() => editService(s)} className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-brand-blue hover:text-white transition flex items-center justify-center" title="Edit card">
                            <i className="fas fa-edit text-xs"></i>
                          </button>
                          <button onClick={() => deleteService(s.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center" title="Delete">
                            <i className="fas fa-trash-can text-xs"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════ PAGE EDITOR TAB */}
        {!loading && tab === 'page-editor' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-brand-dark text-lg">Edit Page: {editingPageSvcTitle}</h3>
                <p className="text-slate-500 text-sm">This is the full content of the individual service page.</p>
              </div>
              <button onClick={() => { setTab('services'); setEditingPageSvcId(null); }} className="text-sm text-slate-400 hover:text-brand-dark transition flex items-center gap-1">
                <i className="fas fa-arrow-left text-xs"></i> Back
              </button>
            </div>
            <form onSubmit={submitPage} className="space-y-6">
              <div className="border-b border-slate-100 pb-6">
                <h4 className="font-bold text-slate-600 text-xs uppercase tracking-widest mb-4">Hero Section</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Hero Heading">
                    <Input value={pageForm.hero_heading} onChange={e => setPageForm({ ...pageForm, hero_heading: e.target.value })} />
                  </FormField>
                  <FormField label="Hero Image URL">
                    <Input type="url" value={pageForm.hero_image} onChange={e => setPageForm({ ...pageForm, hero_image: e.target.value })} />
                  </FormField>
                </div>
                <FormField label="Hero Description">
                  <Textarea value={pageForm.hero_description} onChange={e => setPageForm({ ...pageForm, hero_description: e.target.value })} rows={3} />
                </FormField>
              </div>

              <div className="border-b border-slate-100 pb-6">
                <h4 className="font-bold text-slate-600 text-xs uppercase tracking-widest mb-4">Main Content</h4>
                <FormField label="Rich Content (HTML supported)">
                  <Textarea value={pageForm.content} onChange={e => setPageForm({ ...pageForm, content: e.target.value })} rows={8} />
                </FormField>
              </div>

              <div className="border-b border-slate-100 pb-6">
                <h4 className="font-bold text-slate-600 text-xs uppercase tracking-widest mb-4">Dynamic Sections (JSON Arrays)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <JsonArrayField label="Benefits" value={pageForm.benefits} onChange={v => setPageForm({ ...pageForm, benefits: v })} placeholder='[{"title":"...","description":"...","icon":"fa-check"}]' />
                  <JsonArrayField label="Features" value={pageForm.features} onChange={v => setPageForm({ ...pageForm, features: v })} placeholder='[{"title":"...","description":"...","icon":"fa-star"}]' />
                  <JsonArrayField label="How It Works" value={pageForm.how_it_works} onChange={v => setPageForm({ ...pageForm, how_it_works: v })} placeholder='[{"step":"1","title":"...","description":"..."}]' />
                  <JsonArrayField label="Pricing Packages" value={pageForm.pricing} onChange={v => setPageForm({ ...pageForm, pricing: v })} placeholder='[{"name":"Basic","price":"₹999","features":["..."],"is_popular":false}]' />
                  <JsonArrayField label="FAQs" value={pageForm.faqs} onChange={v => setPageForm({ ...pageForm, faqs: v })} placeholder='[{"question":"...","answer":"..."}]' />
                  <JsonArrayField label="Testimonials" value={pageForm.testimonials} onChange={v => setPageForm({ ...pageForm, testimonials: v })} placeholder='[{"name":"...","role":"...","review":"...","rating":5}]' />
                </div>
              </div>

              <div className="border-b border-slate-100 pb-6">
                <h4 className="font-bold text-slate-600 text-xs uppercase tracking-widest mb-4">CTA Section</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="CTA Heading">
                    <Input value={pageForm.cta_heading} onChange={e => setPageForm({ ...pageForm, cta_heading: e.target.value })} />
                  </FormField>
                  <FormField label="CTA Button Text">
                    <Input value={pageForm.cta_button_text} onChange={e => setPageForm({ ...pageForm, cta_button_text: e.target.value })} />
                  </FormField>
                  <FormField label="CTA Description">
                    <Input value={pageForm.cta_description} onChange={e => setPageForm({ ...pageForm, cta_description: e.target.value })} />
                  </FormField>
                  <FormField label="CTA Button URL">
                    <Input value={pageForm.cta_button_url} onChange={e => setPageForm({ ...pageForm, cta_button_url: e.target.value })} />
                  </FormField>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-600 text-xs uppercase tracking-widest mb-4">SEO &amp; Metadata</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Meta Title">
                    <Input value={pageForm.meta_title} onChange={e => setPageForm({ ...pageForm, meta_title: e.target.value })} />
                  </FormField>
                  <FormField label="Meta Keywords">
                    <Input value={pageForm.meta_keywords} onChange={e => setPageForm({ ...pageForm, meta_keywords: e.target.value })} />
                  </FormField>
                  <FormField label="Meta Description">
                    <Textarea value={pageForm.meta_description} onChange={e => setPageForm({ ...pageForm, meta_description: e.target.value })} rows={2} />
                  </FormField>
                  <FormField label="Canonical URL">
                    <Input type="url" value={pageForm.canonical_url} onChange={e => setPageForm({ ...pageForm, canonical_url: e.target.value })} />
                  </FormField>
                  <FormField label="OG Title">
                    <Input value={pageForm.og_title} onChange={e => setPageForm({ ...pageForm, og_title: e.target.value })} />
                  </FormField>
                  <FormField label="OG Image URL">
                    <Input type="url" value={pageForm.og_image} onChange={e => setPageForm({ ...pageForm, og_image: e.target.value })} />
                  </FormField>
                </div>
                <div className="mt-4">
                  <FormField label="JSON-LD Schema Markup">
                    <Textarea value={pageForm.schema_markup} onChange={e => setPageForm({ ...pageForm, schema_markup: e.target.value })} rows={5} className="font-mono text-xs" placeholder='{"@context":"https://schema.org","@type":"Service",...}' />
                  </FormField>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button type="submit" disabled={saving} className="btn-gold text-brand-dark px-8 py-3 rounded-xl font-bold flex items-center gap-2">
                  <i className="fas fa-save"></i>
                  {saving ? 'Saving…' : 'Save Page Content'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════ CATEGORIES TAB */}
        {!loading && tab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-brand-dark">{editingCatId ? 'Edit Category' : 'New Category'}</h3>
                  {editingCatId && <button onClick={() => { setCatForm(emptyCategory); setEditingCatId(null); }} className="text-xs text-red-500 font-bold hover:underline">Cancel</button>}
                </div>
                <form onSubmit={submitCategory} className="space-y-3">
                  <FormField label="Category ID (Slug)" hint="Lowercase, hyphens only. Cannot be changed later.">
                    <Input value={catForm.id} onChange={e => setCatForm({ ...catForm, id: e.target.value })} disabled={!!editingCatId} required placeholder="leads" />
                  </FormField>
                  <FormField label="Label (Display Name)">
                    <Input value={catForm.label} onChange={e => setCatForm({ ...catForm, label: e.target.value })} required placeholder="Lead Generation" />
                  </FormField>
                  <FormField label="Icon (FontAwesome)" hint="e.g. fa-user-plus">
                    <Input value={catForm.icon} onChange={e => setCatForm({ ...catForm, icon: e.target.value })} placeholder="fa-th-large" />
                  </FormField>
                  <FormField label="Display Order">
                    <Input type="number" value={catForm.display_order} onChange={e => setCatForm({ ...catForm, display_order: parseInt(e.target.value) })} />
                  </FormField>
                  <button type="submit" disabled={saving} className="w-full btn-gold text-brand-dark py-2.5 rounded-xl font-bold">
                    {saving ? 'Saving…' : 'Save Category'}
                  </button>
                </form>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-50">
                  <h3 className="font-bold text-brand-dark">All Categories</h3>
                </div>
                {categories.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">No categories yet.</div>
                ) : (
                  <ul className="divide-y divide-slate-50">
                    {categories.map(c => (
                      <li key={c.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                          <i className={`fas ${c.icon || 'fa-tag'} text-brand-gold text-sm`}></i>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-brand-dark text-sm">{c.label}</div>
                          <div className="text-[10px] text-slate-400">{c.id}</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setCatForm(c); setEditingCatId(c.id); window.scrollTo(0, 0); }} className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-brand-blue hover:text-white transition flex items-center justify-center">
                            <i className="fas fa-edit text-xs"></i>
                          </button>
                          <button onClick={() => deleteCategory(c.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center">
                            <i className="fas fa-trash-can text-xs"></i>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════ LANDING PAGE TAB */}
        {!loading && tab === 'landing' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-4xl">
            <h3 className="font-bold text-brand-dark text-lg mb-2">Landing Page Settings</h3>
            <p className="text-slate-500 text-sm mb-6">All text on the /advocate-growth landing page is editable here.</p>
            <form onSubmit={saveLanding} className="space-y-8">
              {/* Hero */}
              <div className="border-b border-slate-100 pb-6">
                <h4 className="font-bold text-slate-600 text-xs uppercase tracking-widest mb-4">Hero Section</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ['hero_subheading', 'Hero Badge Text'],
                    ['hero_heading', 'Hero Heading'],
                    ['hero_btn_primary', 'Primary Button Text'],
                    ['hero_btn_secondary', 'Secondary Button Text'],
                    ['hero_image', 'Hero Dashboard Image URL'],
                    ['phone', 'Phone Number'],
                  ].map(([key, label]) => (
                    <FormField key={key} label={label}>
                      <Input value={landing[key] || ''} onChange={e => setLanding({ ...landing, [key]: e.target.value })} />
                    </FormField>
                  ))}
                  <div className="md:col-span-2">
                    <FormField label="Hero Description">
                      <Textarea value={landing.hero_description || ''} onChange={e => setLanding({ ...landing, hero_description: e.target.value })} rows={3} />
                    </FormField>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="border-b border-slate-100 pb-6">
                <h4 className="font-bold text-slate-600 text-xs uppercase tracking-widest mb-4">Statistics Bar</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    ['stats_advocates', 'Advocates Enrolled'],
                    ['stats_leads', 'Leads Delivered'],
                    ['stats_services', 'Growth Services'],
                    ['stats_success', 'Success Rate (%)'],
                  ].map(([key, label]) => (
                    <FormField key={key} label={label}>
                      <Input value={landing[key] || ''} onChange={e => setLanding({ ...landing, [key]: e.target.value })} />
                    </FormField>
                  ))}
                </div>
              </div>

              {/* Services Section */}
              <div className="border-b border-slate-100 pb-6">
                <h4 className="font-bold text-slate-600 text-xs uppercase tracking-widest mb-4">Services Section</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Section Heading">
                    <Input value={landing.services_heading || ''} onChange={e => setLanding({ ...landing, services_heading: e.target.value })} />
                  </FormField>
                  <FormField label="Trusted By Label">
                    <Input value={landing.trusted_label || ''} onChange={e => setLanding({ ...landing, trusted_label: e.target.value })} />
                  </FormField>
                  <div className="md:col-span-2">
                    <FormField label="Section Description">
                      <Textarea value={landing.services_description || ''} onChange={e => setLanding({ ...landing, services_description: e.target.value })} rows={2} />
                    </FormField>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div>
                <h4 className="font-bold text-slate-600 text-xs uppercase tracking-widest mb-4">CTA Section</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="CTA Heading">
                    <Input value={landing.cta_heading || ''} onChange={e => setLanding({ ...landing, cta_heading: e.target.value })} />
                  </FormField>
                  <FormField label="CTA Button Text">
                    <Input value={landing.cta_btn || ''} onChange={e => setLanding({ ...landing, cta_btn: e.target.value })} />
                  </FormField>
                  <div className="md:col-span-2">
                    <FormField label="CTA Description">
                      <Textarea value={landing.cta_description || ''} onChange={e => setLanding({ ...landing, cta_description: e.target.value })} rows={2} />
                    </FormField>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={saving} className="btn-gold text-brand-dark px-8 py-3 rounded-xl font-bold flex items-center gap-2">
                  <i className="fas fa-save"></i>
                  {saving ? 'Saving…' : 'Save Landing Page Settings'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </main>
  );
}
