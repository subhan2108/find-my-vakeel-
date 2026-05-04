'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full top-0 z-50 glass-nav transition-all duration-500 ${isScrolled ? 'shadow-md py-2' : 'py-4'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-brand-blue to-brand-navy rounded-xl flex items-center justify-center text-brand-gold text-xl sm:text-2xl font-serif font-bold shadow-lg group-hover:rotate-12 transition-transform">
            <i className="fas fa-scale-balanced"></i>
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-2xl font-bold font-serif text-brand-dark leading-tight whitespace-nowrap">
              Find My <span className="text-gradient">Vakeel</span>
            </span>
            <span className="text-[8px] sm:text-[10px] text-brand-slate uppercase tracking-widest whitespace-nowrap">
              India's Legal Marketplace
            </span>
          </div>
        </Link>

        {/* Center: Nav Links (Desktop) */}
        <nav className="hidden xl:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          <Link href="/#find-lawyer" className="px-3 py-2 font-medium text-slate-700 hover:text-brand-blue transition-colors whitespace-nowrap">Find Lawyer</Link>
          <Link href="/#practice-areas" className="px-3 py-2 font-medium text-slate-700 hover:text-brand-blue transition-colors whitespace-nowrap">Practice Areas</Link>
          <Link href="/blog" className="px-3 py-2 font-medium text-slate-700 hover:text-brand-blue transition-colors whitespace-nowrap">Blogs & Articles</Link>
          <Link href="/#how-it-works" className="px-3 py-2 font-medium text-slate-700 hover:text-brand-blue transition-colors whitespace-nowrap">How It Works</Link>
          <Link href="/#testimonials" className="px-3 py-2 font-medium text-slate-700 hover:text-brand-blue transition-colors whitespace-nowrap">Testimonials</Link>
          <Link href="/#lawyer-join" className="px-3 py-2 font-medium text-slate-700 hover:text-brand-blue transition-colors whitespace-nowrap">For Lawyers</Link>
          <Link href="/#about" className="px-3 py-2 font-medium text-slate-700 hover:text-brand-blue transition-colors whitespace-nowrap">About</Link>
          <Link href="/#contact" className="px-3 py-2 font-medium text-slate-700 hover:text-brand-blue transition-colors whitespace-nowrap">Contact</Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:flex items-center gap-4">
            <a href="https://wa.me/918261889815" className="text-brand-blue font-semibold hover:underline flex items-center gap-1 whitespace-nowrap">
              <i className="fab fa-whatsapp"></i> WhatsApp
            </a>
            <Link href="/#contact-form" className="btn-gold text-white px-6 py-2.5 rounded-full font-semibold shadow-lg whitespace-nowrap">
              Free Consultation
            </Link>
          </div>
          <button 
            id="mobile-menu-btn" 
            className={`xl:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center ${isMenuOpen ? 'is-active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`xl:hidden bg-white border-t absolute w-full left-0 top-full shadow-2xl transition-all duration-300 ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col p-4 gap-2">
          <Link href="/#find-lawyer" className="text-slate-700 font-medium py-3 px-4 hover:bg-slate-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>Find a Lawyer</Link>
          <Link href="/#practice-areas" className="text-slate-700 font-medium py-3 px-4 hover:bg-slate-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>Practice Areas</Link>
          <Link href="/blog" className="text-slate-700 font-medium py-3 px-4 hover:bg-slate-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>Blogs & Articles</Link>
          <Link href="/admin" className="text-slate-700 font-medium py-3 px-4 hover:bg-slate-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
        </div>
      </div>
    </header>
  );
}
