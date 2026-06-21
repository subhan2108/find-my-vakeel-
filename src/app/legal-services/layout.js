export const metadata = {
  title: "Legal Services Directory India | Family, Criminal, Property & Corporate Law | Find My Vakeel",
  description: "Explore 100+ legal services across India. Find verified lawyers for divorce, criminal defense, property disputes, corporate law, consumer court & more. Free consultation available at Find My Vakeel.",
  keywords: "legal services India, family lawyer, criminal lawyer, property disputes, corporate law, consumer court, divorce lawyer, bail, trademark registration, legal notice drafting",
  alternates: {
    canonical: 'https://www.findmyvakeel.com/legal-services',
  },
  openGraph: {
    title: "Legal Services Directory India | Find My Vakeel",
    description: "Explore 100+ legal services across India. Connect with verified lawyers for any legal issue. Free consultation.",
    url: "https://www.findmyvakeel.com/legal-services",
    type: "website",
    images: [
      {
        url: "https://www.findmyvakeel.com/images/legal-services-og.jpg",
      }
    ]
  }
};

export default function LegalServicesLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Legal Services Directory - Find My Vakeel",
            "description": "Comprehensive legal services directory covering Family Law, Criminal Law, Property Law, Corporate Law and more across India.",
            "url": "https://www.findmyvakeel.com/legal-services",
            "publisher": {
              "@type": "Organization",
              "name": "Find My Vakeel",
              "url": "https://www.findmyvakeel.com",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-8261889815",
                "contactType": "customer service",
                "areaServed": "IN"
              }
            },
            "mainEntity": {
              "@type": "ItemList",
              "name": "Legal Services",
              "itemListElement": [
                {"@type": "Service", "name": "Family Law", "description": "Divorce, custody, maintenance & matrimonial disputes"},
                {"@type": "Service", "name": "Criminal Law", "description": "Bail, FIR, criminal trial, cyber crime defense"},
                {"@type": "Service", "name": "Property Law", "description": "Property disputes, registration, partition suits"},
                {"@type": "Service", "name": "Corporate Law", "description": "Company registration, contracts, corporate litigation"},
                {"@type": "Service", "name": "Consumer Protection", "description": "Consumer court cases, product defects, online fraud"}
              ]
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {"@type": "Question", "name": "What types of legal services does Find My Vakeel offer?", "acceptedAnswer": {"@type": "Answer", "text": "Find My Vakeel offers 100+ legal services including Family Law, Criminal Law, Property Law, Corporate Law, Consumer Protection, Labour Law, Taxation, Intellectual Property, and Cyber Law across all courts in India."}},
              {"@type": "Question", "name": "How can I consult a lawyer through Find My Vakeel?", "acceptedAnswer": {"@type": "Answer", "text": "You can consult a verified lawyer through our website, WhatsApp, or phone call at +91 8261889815. We offer free initial consultation."}},
              {"@type": "Question", "name": "Is the initial consultation free?", "acceptedAnswer": {"@type": "Answer", "text": "Yes! Most lawyers on our platform offer a free initial consultation of 10-15 minutes via phone or WhatsApp."}}
            ]
          })
        }}
      />
      {children}
    </>
  );
}
