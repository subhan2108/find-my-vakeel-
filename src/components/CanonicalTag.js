'use client';

import { usePathname } from 'next/navigation';

export default function CanonicalTag() {
  const pathname = usePathname();
  // Using an environment variable or a fallback default domain
  const domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://findmyvakeel.com';
  
  // Optional: remove trailing slash for consistency (except root)
  const cleanPath = pathname === '/' ? '' : pathname.replace(/\/$/, '');
  
  return <link rel="canonical" href={`${domain}${cleanPath}`} />;
}
