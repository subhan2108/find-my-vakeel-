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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&family=Merriweather:wght@300;400;700&display=swap" rel="stylesheet" />
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
