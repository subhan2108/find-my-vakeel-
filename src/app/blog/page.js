import { getPosts, getStaticSeo } from '@/lib/db';
import Link from 'next/link';

export async function generateMetadata() {
  let seo = null;
  try {
    seo = await getStaticSeo('/blog');
  } catch (err) {}

  const metadata = {
    title: seo?.meta_title || "Legal Articles & Updates | Find My Vakeel",
    description: seo?.meta_description || "Read the latest legal updates, articles, and insights from India's top advocates and legal experts.",
  };

  if (seo?.keywords) {
    metadata.keywords = seo.keywords;
  }

  if (seo?.canonical_url) {
    metadata.alternates = { canonical: seo.canonical_url };
  } else {
    metadata.alternates = { canonical: '/blog' };
  }

  return metadata;
}

export default async function BlogPage() {
  let schemaScript = null;
  try {
    const seo = await getStaticSeo('/blog');
    if (seo?.schema_markup) schemaScript = seo.schema_markup;
  } catch (err) {}
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
    <>
      {schemaScript && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaScript }}
        />
      )}
      <main className="pt-32 pb-20 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="text-brand-blue font-bold tracking-widest uppercase text-sm mb-4 block">Our Journal</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-6">Blogs & <span className="text-gradient">Articles</span></h1>
          <p className="text-slate-500 max-w-2xl mx-auto">Latest legal updates, advice, and industry news from India's top advocates.</p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.length === 0 ? (
            <div className="col-span-full text-center py-24 bg-white rounded-[3rem] border border-slate-200 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-newspaper text-slate-200 text-3xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-brand-dark mb-2">No Articles Yet</h3>
              <p className="text-slate-400 mb-8">We're currently drafting new legal insights for you.</p>
              <Link href="/admin" className="btn-gold text-brand-dark px-10 py-4 rounded-2xl font-bold transition-all inline-block shadow-lg">
                <i className="fas fa-plus mr-2"></i> Create First Post
              </Link>
            </div>
          ) : (
            posts.map((post, idx) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.id}`}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-700 ease-out hover:-translate-y-2 hover:scale-[1.02] flex flex-col h-full"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={post.image || 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80'} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6">
                    <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg ${post.type === 'blog' ? 'bg-brand-blue text-white' : 'bg-brand-gold text-brand-dark'}`}>
                      {post.type}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="p-10 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold text-brand-blue uppercase tracking-[0.2em]">{post.category}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{post.date}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-brand-dark mb-4 leading-tight group-hover:text-brand-blue transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-8 leading-relaxed">
                    {post.content}
                  </p>
                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-brand-dark text-[10px]">
                        <i className="fas fa-user-tie"></i>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.author || 'Editorial Team'}</span>
                    </div>
                    <span className="text-brand-blue font-black text-xs uppercase tracking-widest flex items-center gap-2">
                      Read Article <i className="fas fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1"></i>
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
    </>
  );
}
