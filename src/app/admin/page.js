'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [posts, setPosts] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [editingId, setEditingId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80',
    type: 'blog',
    category: 'Legal Updates',
    author: 'Editorial Team'
  });

  // Check for existing session
  useEffect(() => {
    const token = localStorage.getItem('vakeel_admin_token');
    if (token === 'authenticated_vakeel_session') {
      setIsAuthenticated(true);
      fetchPosts();
      fetchSections();
    } else {
      setLoading(false);
    }
  }, []);

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

  const updateSectionTitle = async (section, newName) => {
    try {
      const updatedSection = { ...section, name: newName };
      const res = await fetch(`/api/sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSection)
      });
      if (res.ok) {
        fetchSections();
        alert('Section updated successfully');
      }
    } catch (err) {
      alert('Failed to update section');
    }
  };

  const updateSectionContent = async (section, contentKey, contentValue) => {
    try {
      const updatedContent = { ...section.content, [contentKey]: contentValue };
      const updatedSection = { ...section, content: updatedContent };
      const res = await fetch(`/api/sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSection)
      });
      if (res.ok) {
        setSections(sections.map(s => s.id === section.id ? updatedSection : s));
      }
    } catch (err) {
      alert('Failed to update content');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/posts/${editingId}` : '/api/posts';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) })
      });
      
      if (res.ok) {
        alert(editingId ? 'Post updated successfully!' : 'Post published successfully!');
        setFormData({ title: '', content: '', image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80', type: 'blog', category: 'Legal Updates' });
        setEditingId(null);
        fetchPosts();
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
      author: post.author || 'Editorial Team'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', content: '', image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80', type: 'blog', category: 'Legal Updates', author: 'Editorial Team' });
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
              <a href="/blog" target="_blank" className="bg-white border border-slate-200 px-6 py-2 rounded-lg font-semibold hover:bg-slate-50">View Blog</a>
              <button onClick={handleLogout} className="bg-brand-dark text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition-colors">Logout</button>
            </div>
          </div>

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
                      className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none" 
                      value={formData.title || ''}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Article Title"
                      required 
                    />
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
                      className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none" 
                      value={formData.image || ''}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                    />
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
                      className="w-full border border-slate-200 rounded-lg p-3 text-sm h-40 focus:ring-2 focus:ring-brand-blue outline-none" 
                      value={formData.content || ''}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      placeholder="Write your content here..."
                      required
                    ></textarea>
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
          ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-lg mb-6">Manage Homepage Sections</h3>
            <div className="space-y-4">
              {sections.length === 0 ? (
                <div className="text-center p-8 text-slate-400">No sections found. Make sure the database is set up and the homepage has been loaded at least once.</div>
              ) : (
                sections.map((section) => (
                  <div key={section.id} className="flex flex-col p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors gap-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-brand-dark text-lg">{section.id.replace(/-/g, ' ').toUpperCase()}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${section.is_visible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {section.is_visible ? 'Visible' : 'Hidden'}
                          </span>
                        </div>
                        <input 
                          type="text" 
                          defaultValue={section.name}
                          onBlur={(e) => {
                            if (e.target.value !== section.name) {
                              updateSectionTitle(section, e.target.value);
                            }
                          }}
                          className="w-full max-w-md border border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                          placeholder="Admin Label (e.g. Hero Section)"
                        />
                      </div>
                      <div className="flex shrink-0">
                        <button 
                          onClick={() => toggleSectionVisibility(section)}
                          className={`px-4 py-2 rounded font-bold text-sm transition-colors ${section.is_visible ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-green-500 text-white hover:bg-green-600'}`}
                        >
                          {section.is_visible ? 'Hide Section' : 'Show Section'}
                        </button>
                      </div>
                    </div>
                    {/* Content Editor */}
                    {section.content && Object.keys(section.content).length > 0 && (
                      <div className="bg-white border border-slate-200 p-4 rounded-lg mt-2">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Edit Content Text</h4>
                        <div className="space-y-3">
                          {Object.entries(section.content).map(([key, value]) => (
                            <div key={key}>
                              <label className="block text-xs font-bold text-slate-600 capitalize mb-1">{key}</label>
                              <textarea 
                                defaultValue={value}
                                onBlur={(e) => {
                                  if (e.target.value !== value) {
                                    updateSectionContent(section, key, e.target.value);
                                  }
                                }}
                                className="w-full border border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none resize-y min-h-[40px]"
                                rows={value.length > 50 ? 3 : 1}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          )}
        </div>
      </div>
    </main>
  );
}
