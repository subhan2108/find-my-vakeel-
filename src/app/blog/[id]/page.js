import { getPostById } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function BlogPostPage({ params }) {
  const { id } = await params;
  let post = null;
  let dbError = null;

  try {
    post = await getPostById(id);
  } catch (error) {
    dbError = error.message;
  }

  if (dbError && dbError.includes('DATABASE_URL is missing')) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8 pt-32">
          <div className="glass-card p-10 rounded-3xl text-center max-w-lg border-2 border-dashed border-slate-200">
            <h1 className="text-2xl font-bold mb-4 text-brand-dark">Database Required</h1>
            <p className="text-slate-600 text-sm">Please configure your DATABASE_URL in .env.local to view this article.</p>
          </div>
        </div>
      );
  }

  if (!post) {
    notFound();
  }

  return (
    <main className="pt-24 min-h-screen bg-white">
      {/* Article Hero */}
      <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        <img 
          src={post.image || 'https://via.placeholder.com/1200x600'} 
          className="w-full h-full object-cover"
          alt={post.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="container mx-auto">
            <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-brand-gold mb-6 transition-colors group">
              <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
              Back to Articles
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${post.type === 'blog' ? 'bg-blue-500 text-white' : 'bg-brand-gold text-brand-dark'}`}>
                {post.type}
              </span>
              <span className="text-white/60 text-sm">{post.date}</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white max-w-4xl leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-6 mb-12 pb-8 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-brand-dark">
                  <i className="fas fa-user-tie text-xl"></i>
                </div>
                <div>
                  <p className="font-bold text-brand-dark">Editorial Team</p>
                  <p className="text-xs text-slate-500">Legal Experts @ Find My Vakeel</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-brand-blue hover:text-white transition-all"><i className="fab fa-facebook-f text-xs"></i></button>
                <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-brand-blue hover:text-white transition-all"><i className="fab fa-twitter text-xs"></i></button>
                <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-brand-blue hover:text-white transition-all"><i className="fab fa-linkedin-in text-xs"></i></button>
              </div>
            </div>

            <div className="content-body text-lg text-slate-700 leading-relaxed space-y-6">
              {post.content.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="mt-16 p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <h3 className="text-xl font-bold text-brand-dark mb-4">Need Legal Advice?</h3>
              <p className="text-slate-600 mb-6">Connect with our verified advocates on WhatsApp for a quick consultation regarding this topic or any other legal matter.</p>
              <a href="https://wa.me/918261889815" className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold inline-flex items-center gap-2 transition-all">
                <i className="fab fa-whatsapp"></i>
                Consult on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
