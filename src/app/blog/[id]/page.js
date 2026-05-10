import { getPostById } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';

export async function generateMetadata({ params }) {
  const { id } = await params;
  let post = null;
  try {
    post = await getPostById(id);
  } catch (err) {}

  if (!post) return { title: 'Not Found' };

  const metadata = {
    title: post.meta_title || post.title,
    description: post.meta_description || post.content.substring(0, 160),
  };

  if (post.keywords) {
    metadata.keywords = post.keywords;
  }

  if (post.canonical_url) {
    metadata.alternates = { canonical: post.canonical_url };
  } else {
    metadata.alternates = { canonical: `/blog/${id}` };
  }

  return metadata;
}

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
    <>
      {post.schema_markup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: post.schema_markup }}
        />
      )}
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
      <article className="py-16 md:py-24 relative">
        <ProgressBar />

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 pb-12 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-brand-gold shadow-xl rotate-3">
                  <i className="fas fa-user-tie text-2xl"></i>
                </div>
                <div>
                  <p className="font-black text-brand-dark uppercase tracking-widest text-sm">{post.author || 'Editorial Team'}</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Legal Expert @ Find My Vakeel</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-2">Share Article</p>
                <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#1877F2] hover:text-white transition-all duration-500 hover:-translate-y-1 shadow-sm"><i className="fab fa-facebook-f"></i></button>
                <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#1DA1F2] hover:text-white transition-all duration-500 hover:-translate-y-1 shadow-sm"><i className="fab fa-twitter"></i></button>
                <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#0077B5] hover:text-white transition-all duration-500 hover:-translate-y-1 shadow-sm"><i className="fab fa-linkedin-in"></i></button>
                <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#25D366] hover:text-white transition-all duration-500 hover:-translate-y-1 shadow-sm"><i className="fab fa-whatsapp text-lg"></i></button>
              </div>
            </div>

            <div className="prose prose-slate prose-xl max-w-none">
              <div className="text-lg md:text-xl text-slate-700 leading-[1.8] space-y-8 font-serif">
                {post.content.split('\n').map((para, i) => (
                  para.trim() && <p key={i} className="first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-brand-dark">{para}</p>
                ))}
              </div>
            </div>

            {/* Tags/Categories */}
            <div className="mt-16 flex flex-wrap gap-3">
              {['Legal Advice', 'India Law', 'Advocate Help', post.category].map(tag => (
                <span key={tag} className="px-5 py-2 bg-slate-50 text-slate-500 rounded-full text-xs font-bold border border-slate-100 hover:border-brand-gold hover:text-brand-gold transition-all cursor-pointer">
                  #{tag.replace(/\s+/g, '')}
                </span>
              ))}
            </div>

            {/* CTA Box */}
            <div className="mt-20 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-gold via-yellow-200 to-brand-gold rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-10 md:p-16 bg-brand-dark rounded-[2.5rem] text-white border border-white/10 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-serif font-bold mb-6">Need expert legal advice on this?</h3>
                  <p className="text-slate-300 mb-10 text-lg max-w-2xl leading-relaxed">
                    Don't navigate the legal system alone. Connect with a specialized advocate who can guide you through the specifics of your situation.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href="https://wa.me/918261889815" className="btn-gold text-brand-dark px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-2xl">
                      <i className="fab fa-whatsapp text-2xl"></i>
                      Consult on WhatsApp
                    </a>
                    <a href="tel:+918261889815" className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-10 py-5 rounded-2xl font-bold border border-white/20 flex items-center justify-center gap-3">
                      <i className="fas fa-phone"></i>
                      Call Directly
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

    </main>
    </>
  );
}
