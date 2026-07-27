import dynamic from "next/dynamic";
import Navbar from "@/components/layout/navbar";
import Newsletter from "@/components/marketing/newsletter";
import ContactFooter from "@/components/layout/footer";
import BlogPageClient from "@/components/blog/blog-page-client";
import { blogPosts } from "@/data/blog";
import { fetchExternalTechBlogs } from "@/services/devto";
import { Metadata } from "next";
import { generateBreadcrumbSchema } from "@/seo/helpers";

const TrendingTopics = dynamic(() => import("@/components/blog/trending-topics"));

export const revalidate = 3600;

const ogImage = (t: string, d?: string) =>
  `/api/og?title=${encodeURIComponent(t.slice(0, 100))}${d ? `&description=${encodeURIComponent(d.slice(0, 160))}` : ""}`;

export const metadata: Metadata = {
  title: "Blog | Business Growth & Digital Strategy",
  description: "Practical insights on custom software, digital transformation, and business growth from Maysan Labs. Learn how modern technology helps businesses of all sizes compete and win.",
  keywords: ["Maysan Labs blog", "business technology", "digital transformation", "custom software insights", "SME technology", "business growth strategy"],
  openGraph: {
    title: "Blog | Business Growth & Digital Strategy",
    description: "Practical insights on custom software, digital transformation, and business growth.",
    url: "https://maysanlabs.com/blog",
    type: "website",
    siteName: "Maysan Labs",
    images: [{ url: ogImage("Maysan Labs Blog", "Practical insights on custom software, digital transformation, and business growth."), width: 1200, height: 630, alt: "Maysan Labs Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Maysan Labs",
    description: "Technical insights on enterprise SaaS, custom software development, and modern architecture.",
    images: ["/og-image.webp"],
    creator: "@maysanlabs",
  },
  alternates: { 
    canonical: "https://maysanlabs.com/blog",
    languages: {
      en: "https://maysanlabs.com/blog",
    },
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Blog", url: "/blog" }
]);

const getBlogSchema = (posts: typeof blogPosts) => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Maysan Labs Blog",
  description: "Practical insights on custom software, digital transformation, and business growth",
  url: "https://maysanlabs.com/blog",
  publisher: {
    "@type": "Organization",
    name: "Maysan Labs",
    url: "https://maysanlabs.com"
  },
  blogPost: posts.slice(0, 6).map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: `https://maysanlabs.com/blog/${post.slug}`,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author
    }
  }))
});

export default async function BlogListingPage() {
  const externalPosts = await fetchExternalTechBlogs();
  const visiblePosts = blogPosts.filter(
    (post) => process.env.NODE_ENV !== "production" || !post.draft
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getBlogSchema(visiblePosts)) }} />
      <main id="main-content" className="min-h-screen bg-background text-foreground flex flex-col">
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
        <Navbar />

        {/* Hero */}
        <section className="pt-32 pb-14 md:pb-18 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/[0.03] via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] max-sm:w-[300px] max-sm:h-[200px] bg-brand-primary/[0.06] blur-[180px] rounded-full pointer-events-none" />
          <div className="absolute top-12 right-0 w-72 h-72 bg-brand-primary/[0.03] blur-[100px] rounded-full pointer-events-none" />
          <div className="container-main relative">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary text-[11px] font-semibold uppercase tracking-widest">
                  Insights & Strategy
                </span>
                <span className="text-[11px] text-foreground/30 font-medium">
                  {visiblePosts.length} articles
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-4 leading-tight tracking-tight">
                Our Blog
              </h1>
              <p className="text-base md:text-lg text-foreground/50 leading-relaxed max-w-xl">
                Practical insights on custom software, digital growth, and building technology that works for your business.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="container-main">
            <BlogPageClient localPosts={visiblePosts} externalPosts={externalPosts} />
          </div>
        </section>

        <TrendingTopics />

        <Newsletter />
        <ContactFooter />
      </main>
    </>
  );
}
