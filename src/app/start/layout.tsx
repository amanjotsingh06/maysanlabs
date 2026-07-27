import { Metadata } from "next";

const ogImage = (t: string, d?: string) =>
  `/api/og?title=${encodeURIComponent(t.slice(0, 100))}${d ? `&description=${encodeURIComponent(d.slice(0, 160))}` : ""}`;

export const metadata: Metadata = {
  title: "Start Your Project | Free Consultation",
  description: "Ready to build your enterprise SaaS solution? Contact Maysan Labs for a free consultation. We specialize in custom software development, cloud infrastructure, and scalable web applications.",
  keywords: ["contact Maysan Labs", "maysanlabs contact", "Maysan Labs consultation", "start project", "get quote", "custom software development", "enterprise SaaS development", "consultation", "project inquiry", "request proposal", "contact software company India"],
  openGraph: {
    title: "Start Your Project | Free Consultation",
    description: "Ready to build your enterprise SaaS solution? Contact Maysan Labs for a free consultation.",
    url: "https://maysanlabs.com/start",
    type: "website",
    images: [{ url: ogImage("Start Your Project", "Free consultation for custom software, cloud infrastructure, and enterprise SaaS."), width: 1200, height: 630, alt: "Start Your Project with Maysan Labs" }],
  },
  alternates: { 
    canonical: "https://maysanlabs.com/start",
  },
};

export default function StartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
