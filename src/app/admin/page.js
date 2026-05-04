'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80',
    type: 'blog',
    category: 'Legal Updates'
  });

  // Since we are in Next.js, we'll fetch from a simple API we'll create
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) })
      });
      if (res.ok) {
        alert('Post published successfully!');
        setFormData({ title: '', content: '', image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80', type: 'blog', category: 'Legal Updates' });
        fetchPosts();
      }
    } catch (err) {
      alert('Failed to publish post');
    }
  };

  const deletePost = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      fetchPosts();
    } catch (err) {
      alert('Failed to delete post');
    }
  };

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
              <button onClick={() => window.location.href = '/'} className="bg-brand-dark text-white px-6 py-2 rounded-lg font-semibold">Logout</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Post Form */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-32">
                <h3 className="text-xl font-bold text-brand-dark mb-6">Create New Post</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Title</label>
                    <input 
                      type="text" 
                      className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Article Title"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Image URL</label>
                    <input 
                      type="text" 
                      className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none" 
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Type</label>
                      <select 
                        className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                        value={formData.type}
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
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Content</label>
                    <textarea 
                      className="w-full border border-slate-200 rounded-lg p-3 text-sm h-40 focus:ring-2 focus:ring-brand-blue outline-none" 
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      placeholder="Write your content here..."
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full btn-gold text-brand-dark py-3 rounded-lg font-bold">Publish Post</button>
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
                    <div key={post.id} className="p-6 flex items-center gap-4">
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
                        <button onClick={() => deletePost(post.id)} className="w-10 h-10 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
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
