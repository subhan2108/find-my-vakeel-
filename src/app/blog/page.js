import { getPosts } from '@/lib/db';
import Link from 'next/link';

export default async function BlogPage() {
  let posts = [];
  let dbError = null;

  try {
    posts = await getPosts();
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
            To view your blogs, you need to add your Neon Database URL to the <code className="bg-slate-100 px-2 py-1 rounded">.env.local</code> file in your project folder.
          </p>
          <div className="bg-slate-900 text-white p-4 rounded-xl text-left text-xs font-mono mb-8 overflow-x-auto">
            DATABASE_URL=postgresql://user:password@host/neondb
          </div>
          <p className="text-xs text-slate-400">Restart your server after adding the URL.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="text-brand-blue font-bold tracking-widest uppercase text-sm mb-4 block">Our Journal</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-6">Blogs & <span className="text-gradient">Articles</span></h1>
          <p className="text-slate-500 max-w-2xl mx-auto">Latest legal updates, advice, and industry news from India's top advocates.</p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-newspaper text-slate-300 text-2xl"></i>
              </div>
              <p className="text-slate-400">No posts available yet. Please add some from the admin panel.</p>
              <Link href="/admin" className="mt-4 inline-block text-brand-blue font-bold hover:underline">Go to Admin Panel</Link>
            </div>
          ) : (
            posts.map((post) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full"
                data-aos="fade-up"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image || 'https://via.placeholder.com/800x400'} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${post.type === 'blog' ? 'bg-blue-500 text-white' : 'bg-brand-gold text-brand-dark'}`}>
                      {post.type}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">{post.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-3 line-clamp-2 group-hover:text-brand-blue transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-6">
                    {post.content}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">{post.date}</span>
                    <span className="text-brand-blue font-bold text-sm">Read More <i className="fas fa-arrow-right ml-1 text-xs"></i></span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
