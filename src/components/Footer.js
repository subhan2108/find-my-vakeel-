import Link from 'next/link';
import { getSectionById } from '@/lib/db';

export default async function Footer() {
  let footerData = null;
  try {
    const section = await getSectionById('footer');
    if (section && section.content) {
      footerData = section.content;
    }
  } catch (err) {
    console.error('Failed to fetch footer data:', err);
  }

  const getContent = (key, defaultValue) => {
    return footerData && footerData[key] ? footerData[key] : defaultValue;
  };

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-brand-gold rounded-xl flex items-center justify-center text-brand-dark font-serif font-bold">
                <i className="fas fa-scale-balanced"></i>
              </div>
              <div>
                <span className="text-xl font-bold font-serif">Find My <span className="text-brand-gold">Vakeel</span></span>
                <p className="text-[10px] text-slate-400 uppercase">India's Legal Marketplace</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-6">
              {getContent('description', "India's most trusted legal marketplace. Connecting clients with verified advocates across 100+ cities.")}
            </p>
            <div className="flex gap-3">
              <a href={getContent('facebook_url', 'https://www.facebook.com/findmyvakeel/')} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href={getContent('twitter_url', '#')} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all">
                <i className="fab fa-twitter"></i>
              </a>
              <a href={getContent('linkedin_url', '#')} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href={getContent('instagram_url', 'https://www.instagram.com/findmyvakeel/')} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-brand-gold">Quick Links</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><Link href="/#find-lawyer" className="hover:text-brand-gold flex items-center gap-2"><i className="fas fa-chevron-right text-xs"></i> Find a Lawyer</Link></li>
              <li><Link href="/blog" className="hover:text-brand-gold flex items-center gap-2 font-bold text-slate-300"><i className="fas fa-chevron-right text-xs"></i> Legal Articles</Link></li>
              <li><Link href="/#practice-areas" className="hover:text-brand-gold flex items-center gap-2"><i className="fas fa-chevron-right text-xs"></i> Practice Areas</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-brand-gold flex items-center gap-2"><i className="fas fa-chevron-right text-xs"></i> How It Works</Link></li>
              <li><Link href="/#testimonials" className="hover:text-brand-gold flex items-center gap-2"><i className="fas fa-chevron-right text-xs"></i> Testimonials</Link></li>
              <li><Link href="/#about" className="hover:text-brand-gold flex items-center gap-2"><i className="fas fa-chevron-right text-xs"></i> About Us</Link></li>
            </ul>
          </div>

          {/* Practice Areas */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-brand-gold">Practice Areas</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><Link href="/#practice-areas" className="hover:text-brand-gold flex items-center gap-2"><i className="fas fa-chevron-right text-xs"></i> Family Law & Divorce</Link></li>
              <li><Link href="/#practice-areas" className="hover:text-brand-gold flex items-center gap-2"><i className="fas fa-chevron-right text-xs"></i> Criminal Defense</Link></li>
              <li><Link href="/#practice-areas" className="hover:text-brand-gold flex items-center gap-2"><i className="fas fa-chevron-right text-xs"></i> Property & Real Estate</Link></li>
              <li><Link href="/#practice-areas" className="hover:text-brand-gold flex items-center gap-2"><i className="fas fa-chevron-right text-xs"></i> Corporate & Business</Link></li>
              <li><Link href="/#practice-areas" className="hover:text-brand-gold flex items-center gap-2"><i className="fas fa-chevron-right text-xs"></i> Civil Matters</Link></li>
              <li><Link href="/#practice-areas" className="hover:text-brand-gold flex items-center gap-2"><i className="fas fa-chevron-right text-xs"></i> Consumer Court</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-brand-gold">Contact Us</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex items-start gap-3">
                <i className="fas fa-location-dot mt-1 text-brand-gold"></i>
                <span dangerouslySetInnerHTML={{ __html: getContent('address', "123 Legal Chambers, High Court Road,<br />New Delhi, India - 110001") }}></span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-phone text-brand-gold"></i>
                <span>{getContent('phone', "+91 82618 89815")}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-envelope text-brand-gold"></i>
                <span>{getContent('email', "support@findmyvakeel.com")}</span>
              </li>
              <li className="pt-4">
                <p className="mb-3 text-xs uppercase tracking-widest">Subscribe to Newsletter</p>
                <div className="flex">
                  <input type="email" placeholder="Email Address" className="bg-slate-800 border-none rounded-l-lg px-4 py-2 w-full text-white text-xs focus:ring-1 focus:ring-brand-gold outline-none" />
                  <button className="bg-brand-gold text-brand-dark px-4 py-2 rounded-r-lg hover:bg-yellow-500 transition-colors">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {getContent('copyright', 'Find My Vakeel. All rights reserved.')}</p>
          <div className="flex gap-6">
            <Link href="/#terms" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/#terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/#terms" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
