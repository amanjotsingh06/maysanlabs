export default function AboutLayout({
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
            "@type": "AboutPage",
            name: "About Maysan Labs",
            description:
              "Engineering philosophy focused on precision stacks, data sovereignty, and edge distribution.",
            mainEntity: {
              "@type": "Organization",
              name: "Maysan Labs",
              url: "https://maysanlabs.com",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
