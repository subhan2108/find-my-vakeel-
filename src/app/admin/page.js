'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
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
        </div>
      </div>
    </main>
  );
}
