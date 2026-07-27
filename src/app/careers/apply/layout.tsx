import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply Now",
  description: "Apply to join Maysan Labs - a leading enterprise SaaS development company. We're looking for talented engineers, developers, and designers to build next-generation software solutions.",
  keywords: ["apply Maysan Labs", "maysanlabs apply", "Maysan Labs careers", "Maysan Labs hiring", "software engineer jobs Gurgaon", "SaaS development jobs", "job application", "join our team", "tech jobs India"],
  openGraph: {
    title: "Apply Now | Join Maysan Labs",
    description: "Apply to join Maysan Labs - a leading enterprise SaaS development company.",
    url: "https://maysanlabs.com/careers/apply",
    type: "website",
    siteName: "Maysan Labs",
    images: [{ url: "/og-image.webp", width: 1200, height: 630, alt: "Apply to Maysan Labs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apply Now | Join Maysan Labs",
    description: "Apply to join Maysan Labs - a leading enterprise SaaS development company.",
    images: ["/og-image.webp"],
    creator: "@maysanlabs",
  },
  alternates: { 
    canonical: "https://maysanlabs.com/careers/apply",
    languages: {
      en: "https://maysanlabs.com/careers/apply",
    },
  },
};

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}