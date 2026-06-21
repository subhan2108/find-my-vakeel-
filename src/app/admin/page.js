'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [posts, setPosts] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [editingId, setEditingId] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [seoRoute, setSeoRoute] = useState('/');
  const [seoFormData, setSeoFormData] = useState({
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    schema_markup: '',
    keywords: ''
  });
  const [customPages, setCustomPages] = useState([]);
  const [editingCustomPageSlug, setEditingCustomPageSlug] = useState(null);
  const [customPageForm, setCustomPageForm] = useState({
    slug: '',
    title: '',
    html_content: '',
    css_content: '',
    js_content: '',
    meta_description: '',
    canonical_url: '',
    schema_markup: '',
    keywords: '',
    tag: ''
  });
  const [customPageValidationErrors, setCustomPageValidationErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80',
    type: 'blog',
    category: 'Legal Updates',
    author: 'Editorial Team',
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    schema_markup: '',
    keywords: '',
    slug: ''
  });
  const [storageInfo, setStorageInfo] = useState(null);

  // Check for existing session
  useEffect(() => {
    const token = localStorage.getItem('vakeel_admin_token');
    if (token === 'authenticated_vakeel_session') {
      setIsAuthenticated(true);
      fetchPosts();
      fetchSections();
      fetchCustomPages();
      fetchStorageInfo();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'seo' && isAuthenticated) {
      fetchStaticSeo();
    }
  }, [seoRoute, activeTab, isAuthenticated]);

  const fetchStaticSeo = async () => {
    try {
      const res = await fetch(`/api/seo?route=${encodeURIComponent(seoRoute)}`);
      const data = await res.json();
      if (res.ok) {
        setSeoFormData({
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          canonical_url: data.canonical_url || '',
          schema_markup: data.schema_markup || '',
          keywords: data.keywords || ''
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeoSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ route: seoRoute, ...seoFormData })
      });
      if (res.ok) alert('SEO settings saved successfully!');
    } catch (err) {
      alert('Failed to save SEO settings');
    }
  };

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
        fetchPosts();
        fetchSections();
        fetchCustomPages();
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
    // Clear data
    setPosts([]);
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch posts');
      }
      
      // Ensure data is an array
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      // Optional: set an error state to show to the user
      setPosts([]); 
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/sections');
      const data = await res.json();
      if (!res.ok) throw new Error('Failed to fetch sections');
      setSections(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setSections([]);
    }
  };

  const fetchCustomPages = async () => {
    try {
      const res = await fetch('/api/custom-pages');
      const data = await res.json();
      setCustomPages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStorageInfo = async () => {
    try {
      const res = await fetch('/api/admin/storage');
      const data = await res.json();
      if (res.ok) setStorageInfo(data);
    } catch (err) {
      console.error('Failed to fetch storage info:', err);
    }
  };

  const validateCustomPageForm = () => {
    const errors = {};
    if (!customPageForm.slug || customPageForm.slug.trim() === '') {
      errors.slug = 'Slug is required';
    } else if (!/^[a-z0-9\-]+$/.test(customPageForm.slug.trim())) {
      errors.slug = 'Slug must only contain lowercase letters, numbers, and hyphens';
    } else {
      const duplicate = customPages.find(p => p.slug === customPageForm.slug.trim() && p.slug !== editingCustomPageSlug);
      if (duplicate) {
        errors.slug = 'This slug is already in use by another custom page';
      }
    }

    if (!customPageForm.title || customPageForm.title.trim() === '') {
      errors.title = 'Title is required';
    }

    if (!customPageForm.tag || customPageForm.tag.trim() === '') {
      errors.tag = 'Tag is required';
    }

    if (!customPageForm.html_content || customPageForm.html_content.trim() === '') {
      errors.html_content = 'Code content is required';
    }

    setCustomPageValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCustomPageSubmit = async (e) => {
    e.preventDefault();
    if (!validateCustomPageForm()) {
      return;
    }
    try {
      const res = await fetch('/api/custom-pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customPageForm)
      });
      if (res.ok) {
        alert('Custom page saved successfully!');
        setCustomPageForm({ slug: '', title: '', html_content: '', css_content: '', js_content: '', meta_description: '', canonical_url: '', schema_markup: '', keywords: '', tag: '' });
        setCustomPageValidationErrors({});
        setEditingCustomPageSlug(null);
        fetchCustomPages();
      }
    } catch (err) {
      alert('Failed to save custom page');
    }
  };

  const startEditCustomPage = async (pageStub) => {
    try {
      const res = await fetch(`/api/custom-pages/${encodeURIComponent(pageStub.slug)}`);
      if (!res.ok) throw new Error('Failed to load page');
      const page = await res.json();
      setEditingCustomPageSlug(page.slug);
      setCustomPageForm({
        slug: page.slug || '',
        title: page.title || '',
        html_content: page.html_content || '',
        css_content: '',
        js_content: '',
        meta_description: page.meta_description || '',
        canonical_url: page.canonical_url || '',
        schema_markup: page.schema_markup || '',
        keywords: page.keywords || '',
        tag: page.tag || ''
      });
      setCustomPageValidationErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert('Failed to load full page data');
    }
  };

  const cancelEditCustomPage = () => {
    setEditingCustomPageSlug(null);
    setCustomPageForm({ slug: '', title: '', html_content: '', css_content: '', js_content: '', meta_description: '', canonical_url: '', schema_markup: '', keywords: '', tag: '' });
    setCustomPageValidationErrors({});
  };

  const deleteCustomPage = async (slug) => {
    if (!confirm('Are you sure you want to delete this custom page?')) return;
    try {
      const res = await fetch('/api/custom-pages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug })
      });
      if (res.ok) {
        fetchCustomPages();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to delete custom page');
      }
    } catch (err) {
      alert('Failed to delete custom page');
    }
  };

  const toggleSectionVisibility = async (section) => {
    try {
      const updatedSection = { ...section, is_visible: !section.is_visible };
      const res = await fetch(`/api/sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSection)
      });
      if (res.ok) {
        fetchSections();
      }
    } catch (err) {
      alert('Failed to update section visibility');
    }
  };

  const handleSectionUpdate = async (e, section) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newName = formData.get('section_name');
    
    const updatedContent = { ...section.content };
    if (section.content) {
      Object.keys(section.content).forEach(key => {
        const val = formData.get(key);
        if (val !== null) {
          updatedContent[key] = val;
        }
      });
    }

    try {
      const updatedSection = { ...section, name: newName, content: updatedContent };
      const res = await fetch(`/api/sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSection)
      });
      if (res.ok) {
        setSections(sections.map(s => s.id === section.id ? updatedSection : s));
        alert('Section updated successfully');
      } else {
        alert('Failed to update section');
      }
    } catch (err) {
      alert('Failed to update section');
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title || formData.title.trim().length < 5) {
      errors.title = 'Title must be at least 5 characters long';
    }
    if (!formData.content || formData.content.trim().length < 20) {
      errors.content = 'Content must be at least 20 characters long';
    }
    if (formData.slug) {
      const trimmedSlug = formData.slug.trim();
      if (!/^[a-z0-9\-]+$/.test(trimmedSlug)) {
        errors.slug = 'Slug must only contain lowercase letters, numbers, and hyphens';
      } else if (trimmedSlug.startsWith('-') || trimmedSlug.endsWith('-')) {
        errors.slug = 'Slug cannot start or end with a hyphen';
      } else {
        const duplicate = posts.find(p => p.slug === trimmedSlug && p.id !== editingId);
        if (duplicate) {
          errors.slug = 'This slug is already in use by another post';
        }
      }
    }
    if (formData.image) {
      try {
        const u = new URL(formData.image.trim());
        if (!['http:', 'https:'].includes(u.protocol)) {
          errors.image = 'Image URL must start with http:// or https://';
        }
      } catch {
        errors.image = 'Please enter a valid Image URL (must start with https://)';
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const url = editingId ? `/api/posts/${editingId}` : '/api/posts';
      const method = editingId ? 'PUT' : 'POST';
      
      const payload = { 
        ...formData, 
        slug: formData.slug ? formData.slug.trim().toLowerCase() : null,
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) 
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        alert(editingId ? 'Post updated successfully!' : 'Post published successfully!');
        setFormData({ title: '', content: '', image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80', type: 'blog', category: 'Legal Updates', author: 'Editorial Team', meta_title: '', meta_description: '', canonical_url: '', schema_markup: '', keywords: '', slug: '' });
        setValidationErrors({});
        setEditingId(null);
        fetchPosts();
      } else {
        alert(data.error || 'Failed to save post');
      }
    } catch (err) {
      alert('Failed to save post');
    }
  };

  const startEdit = (post) => {
    setEditingId(post.id);
    setFormData({
      title: post.title || '',
      content: post.content || '',
      image: post.image || '',
      type: post.type || 'blog',
      category: post.category || '',
      author: post.author || 'Editorial Team',
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      canonical_url: post.canonical_url || '',
      schema_markup: post.schema_markup || '',
      keywords: post.keywords || '',
      slug: post.slug || ''
    });
    setValidationErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', content: '', image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80', type: 'blog', category: 'Legal Updates', author: 'Editorial Team', meta_title: '', meta_description: '', canonical_url: '', schema_markup: '', keywords: '', slug: '' });
    setValidationErrors({});
  };

  const deletePost = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPosts();
      }
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-brand-gold rounded-3xl flex items-center justify-center text-brand-dark text-4xl font-serif font-bold shadow-2xl mx-auto mb-6 rotate-3">
              <i className="fas fa-lock"></i>
            </div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-slate-400">Secure access for Find My Vakeel administrators</p>
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
            <Link href="/" className="text-slate-500 hover:text-brand-gold text-sm font-bold flex items-center justify-center gap-2 transition-colors">
              <i className="fas fa-arrow-left"></i> Back to Website
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-3xl font-bold text-brand-dark">Admin Dashboard</h1>
              <p className="text-slate-500">Manage your legal articles and blog posts</p>
            </div>
            <div className="flex gap-4">
              <a href="/blog" target="_blank" className="bg-white border border-slate-200 px-6 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-colors">View Blog</a>
              <button onClick={handleLogout} className="bg-brand-dark text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition-colors">Logout</button>
            </div>
          </div>

          {/* Storage Usage Bar */}
          {storageInfo && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <i className="fas fa-database text-brand-gold"></i>
                  <span className="text-sm font-bold text-brand-dark uppercase tracking-widest">Database Storage Usage</span>
                </div>
                <span className="text-xs font-bold text-slate-500">{storageInfo.used_formatted} / {storageInfo.limit_formatted} ({storageInfo.percent_used}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div 
                  className={`h-full transition-all duration-1000 ${parseFloat(storageInfo.percent_used) > 90 ? 'bg-red-500' : parseFloat(storageInfo.percent_used) > 70 ? 'bg-yellow-500' : 'bg-brand-gold'}`} 
                  style={{ width: `${storageInfo.percent_used}%` }}
                ></div>
              </div>
              {parseFloat(storageInfo.percent_used) > 80 && (
                <p className="text-[10px] text-red-500 font-bold mt-2 uppercase tracking-tight">
                  <i className="fas fa-warning mr-1"></i> Storage almost full. Consider optimizing or upgrading your plan.
                </p>
              )}
            </div>
          )}

          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setActiveTab('posts')} 
              className={`px-6 py-2 rounded-lg font-bold transition-colors ${activeTab === 'posts' ? 'bg-brand-gold text-brand-dark' : 'bg-white text-slate-500 border border-slate-200'}`}
            >
              Blog Posts
            </button>
            <button 
              onClick={() => setActiveTab('sections')} 
              className={`px-6 py-2 rounded-lg font-bold transition-colors ${activeTab === 'sections' ? 'bg-brand-gold text-brand-dark' : 'bg-white text-slate-500 border border-slate-200'}`}
            >
              Homepage Sections
            </button>
            <button 
              onClick={() => setActiveTab('seo')} 
              className={`px-6 py-2 rounded-lg font-bold transition-colors ${activeTab === 'seo' ? 'bg-brand-gold text-brand-dark' : 'bg-white text-slate-500 border border-slate-200'}`}
            >
              Static Pages SEO
            </button>
            <button 
              onClick={() => setActiveTab('customPages')} 
              className={`px-6 py-2 rounded-lg font-bold transition-colors ${activeTab === 'customPages' ? 'bg-brand-gold text-brand-dark' : 'bg-white text-slate-500 border border-slate-200'}`}
            >
              Custom HTML Pages
            </button>
          </div>

          {activeTab === 'posts' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create/Edit Post Form */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-32">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-brand-dark">
                    {editingId ? 'Edit Post' : 'Create New Post'}
                  </h3>
                  {editingId && (
                    <button onClick={cancelEdit} className="text-xs text-red-500 font-bold hover:underline">Cancel Edit</button>
                  )}
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Title</label>
                    <input 
                      type="text" 
                      className={`w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none ${validationErrors.title ? 'border-red-500 focus:ring-red-200' : 'border-slate-200'}`} 
                      value={formData.title || ''}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Article Title"
                      required 
                    />
                    {validationErrors.title && (
                      <p className="text-red-500 text-xs mt-1 font-semibold">{validationErrors.title}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Slug / Custom Path (Optional)</label>
                    <input 
                      type="text" 
                      className={`w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none ${validationErrors.slug ? 'border-red-500 focus:ring-red-200' : 'border-slate-200'}`} 
                      value={formData.slug || ''}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      placeholder="e.g. how-to-hire-a-lawyer"
                    />
                    {validationErrors.slug ? (
                      <p className="text-red-500 text-xs mt-1 font-semibold">{validationErrors.slug}</p>
                    ) : (
                      <p className="text-slate-400 text-[11px] mt-1">If blank, it will default to the ID. Use only lowercase letters, numbers, and hyphens.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Author Name</label>
                    <input 
                      type="text" 
                      className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none" 
                      value={formData.author || ''}
                      onChange={(e) => setFormData({...formData, author: e.target.value})}
                      placeholder="e.g. Adv. Rajesh Kumar"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Image URL</label>
                    <input 
                      type="text" 
                      className={`w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none ${validationErrors.image ? 'border-red-500 focus:ring-red-200' : 'border-slate-200'}`} 
                      value={formData.image || ''}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                    />
                    {validationErrors.image && (
                      <p className="text-red-500 text-xs mt-1 font-semibold">{validationErrors.image}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Type</label>
                      <select 
                        className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                        value={formData.type || 'blog'}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                      >
                        <option value="blog">Blog</option>
                        <option value="article">Article</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Category</label>
                      <input 
                        type="text" 
                        className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none" 
                        value={formData.category || ''}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Content</label>
                    <textarea 
                      className={`w-full border rounded-lg p-3 text-sm h-40 focus:ring-2 focus:ring-brand-blue outline-none ${validationErrors.content ? 'border-red-500 focus:ring-red-200' : 'border-slate-200'}`} 
                      value={formData.content || ''}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      placeholder="Write your content here..."
                      required
                    ></textarea>
                    {validationErrors.content && (
                      <p className="text-red-500 text-xs mt-1 font-semibold">{validationErrors.content}</p>
                    )}
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100 mt-6">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">SEO Settings (Optional)</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Meta Title</label>
                        <input type="text" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none" value={formData.meta_title || ''} onChange={(e) => setFormData({...formData, meta_title: e.target.value})} placeholder="Custom SEO Title" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Meta Description</label>
                        <textarea className="w-full border border-slate-200 rounded-lg p-3 text-sm h-20 focus:ring-2 focus:ring-brand-blue outline-none" value={formData.meta_description || ''} onChange={(e) => setFormData({...formData, meta_description: e.target.value})} placeholder="SEO Description"></textarea>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Canonical URL</label>
                        <input type="url" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none" value={formData.canonical_url || ''} onChange={(e) => setFormData({...formData, canonical_url: e.target.value})} placeholder="https://findmyvakeel.com/blog/..." />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Meta Keywords (Comma separated)</label>
                        <input type="text" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none" value={formData.keywords || ''} onChange={(e) => setFormData({...formData, keywords: e.target.value})} placeholder="legal, advice, vakeel" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Schema Markup (JSON-LD)</label>
                        <textarea className="w-full border border-slate-200 rounded-lg p-3 text-sm h-32 focus:ring-2 focus:ring-brand-blue outline-none font-mono text-xs" value={formData.schema_markup || ''} onChange={(e) => setFormData({...formData, schema_markup: e.target.value})} placeholder='{"@context": "https://schema.org", "@type": "Article"...}'></textarea>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full btn-gold text-brand-dark py-3 rounded-lg font-bold">
                    {editingId ? 'Update Post' : 'Publish Post'}
                  </button>
                </form>
              </div>
            </div>

            {/* Posts List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-lg">Existing Posts</h3>
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{posts.length} Posts</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading posts...</div>
                  ) : posts.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">No posts found</div>
                  ) : posts.map((post) => (
                    <div key={post.id} className={`p-6 flex items-center gap-4 transition-colors ${editingId === post.id ? 'bg-blue-50' : ''}`}>
                      <img src={post.image} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" alt="" />
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${post.type === 'blog' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
                            {post.type}
                          </span>
                          <span className="text-xs text-slate-400">{post.date}</span>
                        </div>
                        <h4 className="font-bold text-brand-dark line-clamp-1">{post.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-1">{post.content}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => startEdit(post)} 
                          className="w-10 h-10 rounded-lg bg-slate-50 text-slate-400 hover:bg-brand-blue hover:text-white transition-all flex items-center justify-center"
                          title="Edit Post"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          onClick={() => deletePost(post.id)} 
                          className="w-10 h-10 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                          title="Delete Post"
                        >
                          <i className="fas fa-trash-can"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          ) : activeTab === 'sections' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-lg mb-6">Manage Homepage Sections</h3>
            <div className="space-y-4">
              {sections.length === 0 ? (
                <div className="text-center p-8 text-slate-400">No sections found. Make sure the database is set up and the homepage has been loaded at least once.</div>
              ) : (
                sections.map((section) => (
                  <div key={section.id} className="flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white transition-all shadow-sm">
                    {/* Header (Always Visible) */}
                    <div 
                      className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                      onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-brand-dark text-lg">{section.id.replace(/-/g, ' ').toUpperCase()}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${section.is_visible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {section.is_visible ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSectionVisibility(section);
                          }}
                          className={`px-3 py-1.5 rounded font-bold text-xs transition-colors ${section.is_visible ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-green-500 text-white hover:bg-green-600'}`}
                        >
                          {section.is_visible ? 'Hide' : 'Show'}
                        </button>
                        <i className={`fas fa-chevron-down transition-transform ${expandedSection === section.id ? 'rotate-180' : ''} text-slate-400`}></i>
                      </div>
                    </div>

                    {/* Expandable Content Form */}
                    {expandedSection === section.id && (
                      <form onSubmit={(e) => handleSectionUpdate(e, section)} className="p-6 border-t border-slate-200 bg-white">
                        <div className="mb-6">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Admin Label</label>
                          <input 
                            type="text" 
                            name="section_name"
                            defaultValue={section.name}
                            className="w-full max-w-md border border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                            placeholder="Admin Label (e.g. Hero Section)"
                          />
                        </div>

                        {section.content && Object.keys(section.content).length > 0 && (
                          <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl">
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-200 pb-2">Edit Content Text</h4>
                            <div className="grid grid-cols-1 gap-4">
                              {Object.entries(section.content).map(([key, value]) => (
                                <div key={key}>
                                  <label className="block text-[11px] font-black text-slate-600 mb-1 tracking-wider">
                                    {key.replace(/_/g, ' ').toUpperCase()}
                                  </label>
                                  <textarea 
                                    name={key}
                                    defaultValue={value}
                                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none resize-y min-h-[40px] shadow-sm bg-white"
                                    rows={value.length > 80 ? 3 : 1}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
                          <button type="submit" className="bg-brand-gold hover:bg-yellow-500 text-brand-dark px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2">
                            <i className="fas fa-save"></i> Save Changes
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          ) : activeTab === 'customPages' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-32">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-brand-dark">
                    {editingCustomPageSlug ? 'Edit Custom Page' : 'Create Custom Page'}
                  </h3>
                  {editingCustomPageSlug && (
                    <button onClick={cancelEditCustomPage} className="text-xs text-red-500 font-bold hover:underline">Cancel</button>
                  )}
                </div>
                <form onSubmit={handleCustomPageSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">URL Path / Slug</label>
                    <input type="text" className={`w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none ${customPageValidationErrors.slug ? 'border-red-500 focus:ring-red-200' : 'border-slate-200'}`} value={customPageForm.slug} onChange={(e) => setCustomPageForm({...customPageForm, slug: e.target.value})} placeholder="e.g. about-us" disabled={!!editingCustomPageSlug} />
                    {customPageValidationErrors.slug && <p className="text-red-500 text-xs mt-1 font-semibold">{customPageValidationErrors.slug}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Page Title (Meta)</label>
                    <input type="text" className={`w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none ${customPageValidationErrors.title ? 'border-red-500 focus:ring-red-200' : 'border-slate-200'}`} value={customPageForm.title} onChange={(e) => setCustomPageForm({...customPageForm, title: e.target.value})} placeholder="About Find My Vakeel" />
                    {customPageValidationErrors.title && <p className="text-red-500 text-xs mt-1 font-semibold">{customPageValidationErrors.title}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Tag (e.g. areas)</label>
                    <input type="text" className={`w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none ${customPageValidationErrors.tag ? 'border-red-500 focus:ring-red-200' : 'border-slate-200'}`} value={customPageForm.tag} onChange={(e) => setCustomPageForm({...customPageForm, tag: e.target.value})} placeholder="Use 'areas' for navbar listing" />
                    {customPageValidationErrors.tag && <p className="text-red-500 text-xs mt-1 font-semibold">{customPageValidationErrors.tag}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Code (HTML, CSS &lt;style&gt;, JS &lt;script&gt;)</label>
                    <textarea className={`w-full border rounded-lg p-4 text-sm h-96 font-mono text-xs focus:ring-2 focus:ring-brand-blue outline-none bg-slate-50 ${customPageValidationErrors.html_content ? 'border-red-500 focus:ring-red-200' : 'border-slate-200'}`} value={customPageForm.html_content} onChange={(e) => setCustomPageForm({...customPageForm, html_content: e.target.value})} placeholder="<style> body { background: #fff; } </style>&#10;&#10;<div>Hello World</div>&#10;&#10;<script> console.log('loaded'); </script>"></textarea>
                    {customPageValidationErrors.html_content && <p className="text-red-500 text-xs mt-1 font-semibold">{customPageValidationErrors.html_content}</p>}
                  </div>

                  <div className="pt-6 border-t border-slate-100 mt-6">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">SEO Settings (Optional)</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Meta Description</label>
                        <textarea className="w-full border border-slate-200 rounded-lg p-3 text-sm h-20 focus:ring-2 focus:ring-brand-blue outline-none" value={customPageForm.meta_description} onChange={(e) => setCustomPageForm({...customPageForm, meta_description: e.target.value})} placeholder="SEO Description"></textarea>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Canonical URL</label>
                        <input type="url" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none" value={customPageForm.canonical_url} onChange={(e) => setCustomPageForm({...customPageForm, canonical_url: e.target.value})} placeholder="https://findmyvakeel.com/..." />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Meta Keywords (Comma separated)</label>
                        <input type="text" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none" value={customPageForm.keywords} onChange={(e) => setCustomPageForm({...customPageForm, keywords: e.target.value})} placeholder="legal, advice, vakeel" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Schema Markup (JSON-LD)</label>
                        <textarea className="w-full border border-slate-200 rounded-lg p-3 text-sm h-32 focus:ring-2 focus:ring-brand-blue outline-none font-mono text-xs" value={customPageForm.schema_markup} onChange={(e) => setCustomPageForm({...customPageForm, schema_markup: e.target.value})} placeholder='{"@context": "https://schema.org"}'></textarea>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full btn-gold text-brand-dark py-3 rounded-lg font-bold">
                    {editingCustomPageSlug ? 'Update Page' : 'Create Page'}
                  </button>
                </form>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-lg">Custom Pages</h3>
                </div>
                <div className="divide-y divide-slate-50">
                  {customPages.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">No custom pages yet.</div>
                  ) : customPages.map((page) => (
                    <div key={page.slug} className="p-6 flex items-start gap-4">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-brand-dark truncate">{page.title?.trim() || 'Untitled custom page'}</h4>
                        <div className="flex gap-2 items-center min-w-0">
                          <a href={`/${encodeURIComponent(page.slug)}`} target="_blank" className="min-w-0 truncate text-xs text-brand-blue hover:underline">/{page.slug}</a>
                          {page.tag && <span className="shrink-0 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded">{page.tag}</span>}
                        </div>
                      </div>
                      <div className="shrink-0 flex gap-2">
                        <button onClick={() => startEditCustomPage(page)} className="w-10 h-10 rounded-lg bg-slate-50 text-slate-400 hover:bg-brand-blue hover:text-white transition-all flex items-center justify-center" title="Edit Page">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button onClick={() => deleteCustomPage(page.slug)} className="w-10 h-10 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center" title="Delete Page">
                          <i className="fas fa-trash-can"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-3xl">
            <h3 className="font-bold text-lg mb-6">Manage Static Pages SEO</h3>
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-2">Select Page Route</label>
              <select 
                className="w-full max-w-md border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                value={seoRoute}
                onChange={(e) => setSeoRoute(e.target.value)}
              >
                <option value="/">Homepage (/)</option>
                <option value="/blog">Blog List (/blog)</option>
              </select>
            </div>
            <form onSubmit={handleSeoSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-1">Meta Title</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none" value={seoFormData.meta_title || ''} onChange={(e) => setSeoFormData({...seoFormData, meta_title: e.target.value})} placeholder="Title Tag" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Meta Description</label>
                <textarea className="w-full border border-slate-200 rounded-lg p-3 text-sm h-24 focus:ring-2 focus:ring-brand-blue outline-none" value={seoFormData.meta_description || ''} onChange={(e) => setSeoFormData({...seoFormData, meta_description: e.target.value})} placeholder="Meta Description"></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Canonical URL</label>
                <input type="url" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none" value={seoFormData.canonical_url || ''} onChange={(e) => setSeoFormData({...seoFormData, canonical_url: e.target.value})} placeholder="https://findmyvakeel.com/path" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Meta Keywords (Comma separated)</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none" value={seoFormData.keywords || ''} onChange={(e) => setSeoFormData({...seoFormData, keywords: e.target.value})} placeholder="legal, advice, vakeel" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Schema Markup (JSON-LD)</label>
                <textarea className="w-full border border-slate-200 rounded-lg p-3 text-sm h-40 focus:ring-2 focus:ring-brand-blue outline-none font-mono text-xs" value={seoFormData.schema_markup || ''} onChange={(e) => setSeoFormData({...seoFormData, schema_markup: e.target.value})} placeholder='{"@context": "https://schema.org"...}'></textarea>
              </div>
              <button type="submit" className="bg-brand-gold text-brand-dark px-8 py-3 rounded-lg font-bold shadow-md hover:bg-yellow-500 transition-colors">
                Save SEO Settings
              </button>
            </form>
          </div>
          )}
        </div>
      </div>
    </main>
  );
}
