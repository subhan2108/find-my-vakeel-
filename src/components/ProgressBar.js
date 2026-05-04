'use client';

import { useEffect } from 'react';

export default function ProgressBar() {
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      const progressBar = document.getElementById("reading-progress");
      if (progressBar) {
        progressBar.style.width = scrolled + "%";
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-slate-100">
      <div 
        id="reading-progress"
        className="h-full bg-brand-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]" 
        style={{ width: '0%', transition: 'width 0.1s' }}
      ></div>
    </div>
  );
}
