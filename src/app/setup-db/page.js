import { sql } from '@/lib/db';

export default async function Page() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        image TEXT,
        type TEXT DEFAULT 'blog',
        category TEXT DEFAULT 'Legal',
        date TEXT NOT NULL
      )
    `;
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark p-8">
        <div className="glass-card p-10 rounded-3xl text-center max-w-lg">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-database text-green-600 text-3xl"></i>
          </div>
          <h1 className="text-3xl font-bold mb-4">Database Connected!</h1>
          <p className="text-slate-600 mb-8">
            The 'posts' table has been successfully created in your Neon DB. 
            You can now start adding blogs through the admin panel.
          </p>
          <a href="/admin" className="btn-gold text-brand-dark px-8 py-3 rounded-full font-bold inline-block">
            Go to Admin Panel
          </a>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark p-8">
        <div className="bg-red-50 p-10 rounded-3xl text-center max-w-lg border border-red-200">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-exclamation-triangle text-red-600 text-3xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-red-900 mb-4">Connection Failed</h1>
          <p className="text-red-700 mb-6">
            We couldn't connect to your database. Please make sure you have added the 
            <code className="bg-red-100 px-2 py-1 rounded mx-1">DATABASE_URL</code> 
            to your environment variables.
          </p>
          <div className="text-left bg-white p-4 rounded-lg overflow-auto max-h-40">
            <pre className="text-xs text-red-500">{error.message}</pre>
          </div>
        </div>
      </div>
    );
  }
}
