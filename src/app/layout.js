import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientProviders from "@/components/ClientProviders";
import FloatingButtons from "@/components/FloatingButtons";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://findmyvakeel.com'),
  title: "Find My Vakeel | India's #1 Legal Marketplace",
  description: "India's most trusted legal marketplace connecting clients with verified advocates across 100+ cities",
  alternates: {
    canonical: './',
  },
  verification: {
    google: 'a9Uo-AQX24kXJaSe1sgr3Vgcq_A5Qzjbo2KQMCjIRyQ',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="trustpilot-one-time-domain-verification-id" content="fae9b98a-840a-45d7-80e5-453fb78b8701"/>
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&family=Merriweather:wght@300;400;700&display=swap" rel="stylesheet" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8961417979626134"
          crossOrigin="anonymous"></script>
      </head>
      <body className="antialiased bg-brand-dark overflow-x-hidden" suppressHydrationWarning>
        <ClientProviders>
          <Header />
          {children}
          <FloatingButtons />
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
