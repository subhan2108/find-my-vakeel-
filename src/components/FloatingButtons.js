'use client';

import { useState, useEffect } from 'react';

export default function FloatingButtons() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-4">
      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className={`w-12 h-12 rounded-full bg-brand-blue text-white shadow-2xl flex items-center justify-center transition-all duration-500 hover:bg-brand-navy hover:-translate-y-2 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <i className="fas fa-chevron-up text-lg"></i>
      </button>

      {/* WhatsApp */}
      <a
        href="https://wa.me/918261889815"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-green-500 text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 animate-bounce-slow"
      >
        <i className="fab fa-whatsapp text-3xl"></i>
      </a>
    </div>
  );
}
