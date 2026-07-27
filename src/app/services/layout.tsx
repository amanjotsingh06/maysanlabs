export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "SaaS Infrastructure Development",
            provider: {
              "@type": "Organization",
              name: "Maysan Labs",
            },
            description:
              "High-performance MERN stack architecture and autonomous operational layers for modern enterprises.",
            areaServed: [
              { "@type": "City", name: "Gurgaon" },
              { "@type": "Country", name: "India" },
            ],
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Enterprise Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Core Infrastructure",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "AI Integration",
                  },
                },
              ],
            },
          }),
        }}
      />
      {children}
    </>
  );
}
