'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const displayScrolled = isHomePage ? isScrolled : true;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-500 ${displayScrolled ? 'glass-nav shadow-lg py-3' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo (Left) */}
          <div className="flex justify-start shrink-0 z-10">
            <Link href="/" className="flex items-center gap-2 md:gap-3 group">
              <div className="w-9 h-9 md:w-12 md:h-12 bg-gradient-to-br from-brand-blue to-brand-navy rounded-lg md:rounded-xl flex items-center justify-center text-brand-gold text-lg md:text-2xl font-serif font-bold shadow-lg group-hover:rotate-12 transition-transform shrink-0">
                <i className="fas fa-scale-balanced"></i>
              </div>
              <div className="flex flex-col min-w-0">
                <span className={`text-sm md:text-2xl font-bold font-serif leading-tight truncate transition-colors ${displayScrolled ? 'text-brand-dark' : 'text-white'}`}>
                  Find My <span className={displayScrolled ? 'text-gradient' : 'text-brand-gold'}>Vakeel</span>
                </span>
                <span className={`text-[7px] md:text-[10px] uppercase tracking-tighter md:tracking-widest truncate transition-colors ${displayScrolled ? 'text-brand-slate' : 'text-slate-300'}`}>
                  India's Legal Marketplace
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Links (Middle - Desktop) */}
          <nav className="hidden xl:flex items-center gap-2">
            {[
              { label: 'Find Lawyer', href: '/#find-lawyer' },
              { label: 'Practice Areas', href: '/#practice-areas' },
              { label: 'Articles', href: '/blog' },
              { label: 'How It Works', href: '/#how-it-works' },
              { label: 'Testimonials', href: '/#testimonials' },
              { label: 'About', href: '/#about' }
            ].map((link) => (
              <Link 
                key={link.label}
                href={link.href} 
                className={`px-2 xl:px-3 py-2 font-semibold text-sm transition-all rounded-full whitespace-nowrap hover:bg-white/10 ${displayScrolled ? 'text-slate-700 hover:text-brand-blue' : 'text-white hover:text-brand-gold'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions (Right) */}
          <div className="flex justify-end items-center gap-3 md:gap-6 shrink-0 z-10">
            <div className="hidden lg:flex items-center gap-6">
              <a href="https://wa.me/918261889815" className={`font-bold flex items-center gap-2 transition-colors ${displayScrolled ? 'text-brand-blue hover:text-brand-navy' : 'text-white hover:text-brand-gold'}`}>
                <i className="fab fa-whatsapp text-xl"></i> 
                <span className="hidden xl:inline">WhatsApp</span>
              </a>
              <Link href="/#find-lawyer" className="btn-gold text-brand-dark px-6 py-3 rounded-full font-bold shadow-xl text-sm whitespace-nowrap transition-transform hover:scale-105">
                Free Consultation
              </Link>
            </div>
            
            <button 
              className={`xl:hidden p-3 rounded-xl transition-all ${displayScrolled ? 'bg-slate-100 text-brand-dark' : 'bg-white/10 text-white'} ${isMenuOpen ? 'is-active' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <span className="hamburger-box">
                <span className={`hamburger-inner ${!displayScrolled ? 'bg-white before:bg-white after:bg-white' : 'bg-brand-dark before:bg-brand-dark after:bg-brand-dark'}`}></span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`xl:hidden fixed inset-0 z-[-1] bg-slate-900/95 backdrop-blur-xl transition-all duration-500 ease-in-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="flex flex-col h-full pt-24 px-6 gap-4 overflow-y-auto">
          {[
            { label: 'Find a Lawyer', href: '/#find-lawyer', icon: 'fa-search' },
            { label: 'Practice Areas', href: '/#practice-areas', icon: 'fa-balance-scale' },
            { label: 'Legal Articles', href: '/blog', icon: 'fa-newspaper' },
            { label: 'How It Works', href: '/#how-it-works', icon: 'fa-info-circle' },
            { label: 'Testimonials', href: '/#testimonials', icon: 'fa-star' },
            { label: 'About Us', href: '/#about', icon: 'fa-building' },
            { label: 'Contact Us', href: '/#contact', icon: 'fa-envelope' }
          ].map((link) => (
            <Link 
              key={link.label}
              href={link.href} 
              className="text-white text-lg font-bold p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 transition-all active:scale-95"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-brand-gold/20 rounded-xl flex items-center justify-center text-brand-gold">
                <i className={`fas ${link.icon}`}></i>
              </div>
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 mt-4 pb-12">
            <a href="https://wa.me/918261889815" className="bg-green-500 text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg">
              <i className="fab fa-whatsapp text-2xl"></i> Chat on WhatsApp
            </a>
            <Link href="/#find-lawyer" className="bg-brand-gold text-brand-dark p-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-phone text-2xl"></i> Request Consultation
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
