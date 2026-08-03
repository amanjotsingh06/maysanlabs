import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { generateIndividualReviewSchemas } from "@/data/seo-schema";
import { getAllPosts } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://maysanlabs.com",
  },
};

import Navbar from "@/components/layout/navbar";
import Hero from "@/components/home/hero";
import ScrollReveal from "@/components/effects/scroll-reveal";
import LatestInsights from "@/components/blog/latest-insights";
import Newsletter from "@/components/marketing/newsletter";

const LogoMarquee = dynamic(() => import("@/components/home/logo-marquee"));
const Problem = dynamic(() => import("@/components/marketing/problem"));
const BuildScaleGrow = dynamic(() => import("@/components/home/build-scale-grow"));
const StatsSection = dynamic(() => import("@/components/home/stats-section"));
const Services = dynamic(() => import("@/components/marketing/services"));
const Products = dynamic(() => import("@/components/marketing/products"));
const Testimonials = dynamic(() => import("@/components/dynamic/ClientImports").then(m => m.Testimonials));
const FAQ = dynamic(() => import("@/components/dynamic/ClientImports").then(m => m.FAQ));
const MultiStepForm = dynamic(() => import("@/components/dynamic/ClientImports").then(m => m.MultiStepForm));
const ContactFooter = dynamic(() => import("@/components/dynamic/ClientImports").then(m => m.ContactFooter));
const ToolsShowcase = dynamic(() => import("@/components/interactive/tools-showcase"));

export const revalidate = 3600;

export default async function Home() {
  const blogPosts = await getAllPosts();
  const today = new Date().toISOString().split("T")[0];
  const visiblePosts = blogPosts.filter(
    (post) => process.env.NODE_ENV !== "production" || !post.draft
  );
  const latestPosts = visiblePosts.slice(0, 3).map((post, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `https://maysanlabs.com/blog/${post.slug}`,
      datePublished: post.date,
      author: { "@type": "Person", name: post.author },
    },
  }));

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen relative overflow-hidden text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "@id": "https://maysanlabs.com/#webpage",
                "url": "https://maysanlabs.com/",
                "name": "Maysan Labs — Custom Software Development",
                "description": "Custom software development, cloud infrastructure, and SaaS solutions. Based in Gurgaon, India.",
                dateModified: today,
                speakable: {
                  "@type": "SpeakableSpecification",
                  cssSelector: [".hero-heading", ".hero-subtitle"],
                },
                about: { "@type": "Organization", name: "Maysan Labs" },
              },
              {
                "@type": "ItemList",
                itemListElement: latestPosts,
              },
            ],
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateIndividualReviewSchemas())
        }}
      />

      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
      <Navbar />
      <Hero />

      {/* Trusted by + Problem */}
      <section className="pt-20 md:pt-28 pb-8 md:pb-12 border-b border-gray-100 dark:border-white/[0.06]">
        <div className="container-main text-center">
          <span className="badge-section mb-8 inline-flex">Trusted by fast-growing companies</span>
        </div>
        <LogoMarquee />
      </section>
      <StatsSection />

      <ScrollReveal className="content-auto-wide">
        <Problem />
      </ScrollReveal>

      <ScrollReveal className="content-auto-wide">
        <Services />
      </ScrollReveal>

      <ScrollReveal className="content-auto-wide">
        <Products />
      </ScrollReveal>

      {/* How We Work */}
      <ScrollReveal className="content-auto-wide">
        <section className="sec-xl container-main">
          <div className="text-center mb-16">
            <span className="badge-section mb-6 inline-flex">How We Work</span>
            <h2 className="heading-lg text-foreground">
              From idea to scale in{" "}
              <span className="text-gradient-brand">three steps</span>
            </h2>
            <p className="text-foreground/60 text-sm md:text-base max-w-xl mx-auto mt-4 font-medium">
              We engineer, deploy, and grow — you focus on your business.
            </p>
          </div>
          <BuildScaleGrow />
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.1} className="content-auto-wide">
        <Testimonials />
      </ScrollReveal>

      <ScrollReveal className="content-auto-wide">
        <LatestInsights />
      </ScrollReveal>

      <ToolsShowcase />

      <ScrollReveal delay={0.1} className="content-auto">
        <FAQ />
      </ScrollReveal>

      {/* Start Your Project */}
      <ScrollReveal>
        <section id="start" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 via-brand-primary/2 to-transparent dark:from-brand-primary/10 dark:via-brand-primary/5 dark:to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[50%] rounded-full blur-[130px] bg-brand-primary/5 dark:bg-brand-primary/10 pointer-events-none" />
          <div className="container-narrow relative z-10">
            <div className="text-center mb-12">
              <span className="badge-section mb-6 inline-flex">Start Your Project</span>
              <h2 className="heading-lg text-foreground mb-4">
                Tell us what you need
              </h2>
              <p className="text-foreground/60 text-sm md:text-base max-w-lg mx-auto font-medium">
                Answer a few quick questions and we&apos;ll get back within 24 hours with a clear plan and price.
              </p>
            </div>
            <div className="bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-sm">
              <MultiStepForm />
            </div>
          </div>
        </section>
      </ScrollReveal>

      <Newsletter />

      <ScrollReveal delay={0.2}>
        <ContactFooter />
      </ScrollReveal>
    </main>
  );
}
