'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function ClientProviders({ children }) {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });

    // Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  return <>{children}</>;
}
