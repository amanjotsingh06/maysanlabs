import type { Metadata } from "next";
import InsightsClient from "./InsightsClient";
import { getAllPosts } from "@/sanity/lib/queries";
import { generateBreadcrumbSchema } from "@/seo/helpers";

const ogImage = (t: string, d?: string) =>
  `/api/og?title=${encodeURIComponent(t.slice(0, 100))}${d ? `&description=${encodeURIComponent(d.slice(0, 160))}` : ""}`;

export const metadata: Metadata = {
  title: "Insights & Technical Blog",
  description: "Explore technical insights from Maysan Labs - architectural deep dives, scaling strategies, and best practices for modern SaaS products. Expert advice on React, Node.js, cloud infrastructure, and enterprise development from the maysanlabs team.",
  keywords: ["Maysan Labs insights", "maysanlabs technical blog", "SaaS development insights", "React tutorials", "Node.js guides", "cloud architecture", "enterprise software", "scaling strategies", "Maysan Labs blog"],
  openGraph: {
    title: "Insights & Technical Blog",
    description: "Explore our latest technical insights, architectural deep dives, and scaling strategies for modern SaaS products.",
    url: "https://maysanlabs.com/insights",
    type: "website",
    siteName: "Maysan Labs",
    images: [{ url: ogImage("Insights & Technical Blog", "Architectural deep dives, scaling strategies, and best practices for modern SaaS products."), width: 1200, height: 630, alt: "Technical Insights - Maysan Labs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights & Technical Blog",
    description: "Explore our latest technical insights, architectural deep dives, and scaling strategies for modern SaaS products.",
    images: ["/og-image.webp"],
    creator: "@maysanlabs",
  },
  alternates: { 
    canonical: "https://maysanlabs.com/insights",
    languages: {
      en: "https://maysanlabs.com/insights",
    },
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Insights", url: "/insights" }
]);

export default async function InsightsPage() {
  const posts = await getAllPosts();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <InsightsClient blogPosts={posts} />
    </>
  );
}
