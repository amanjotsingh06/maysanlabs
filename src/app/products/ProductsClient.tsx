"use client";

import Navbar from "@/components/layout/navbar";
import ContactFooter from "@/components/layout/footer";
import PortfolioShowcase from "@/components/home/portfolio-showcase";
import { ArrowRight, ArrowUpRight, Layers } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const liveProducts = [
  {
    name: "Maysan Shop",
    category: "E-Commerce",
    tagline: "Commerce without boundaries",
    description: "Full-stack enterprise e-commerce engine designed for absolute horizontal scale. Unifying high-performance transactional rails, automated inventory tracking, and deep user acquisition analytics in a single unified interface.",
    benefits: [
      "High-performance payment gateway integrations",
      "Real-time multi-warehouse inventory automation",
      "Precision-tuned responsive mobile checkout flow",
      "Autonomous dispatch and logistics pipeline"
    ],
    imageUrl: "/banner-centered-v4.webp",
    iframeUrl: "https://flashhfashion.in/",
    ctaHref: "/case-studies/flash-fashion-ecommerce",
    ctaText: "Explore Case Study",
    secondaryCtaText: "Launch Live Site",
    secondaryCtaHref: "https://flashhfashion.in/",
    scrollPercentage: "0%"
  },
  {
    name: "MaysanMails",
    category: "Marketing Infrastructure",
    tagline: "Scale email marketing without monthly fees",
    description: "Self-hosted bulk email infrastructure with high-deliverability SMTP routing, campaign automation, and complete data privacy. Zero recurring subscriber fees — pay once, own forever.",
    benefits: [
      "Zero recurring subscriber fees — save ₹50,000+/yr",
      "High-deliverability SMTP with custom reputation management",
      "Advanced campaign automation and real-time analytics",
      "Complete data privacy — your list, your server"
    ],
    imageUrl: "/MaysanMails.png?v=1",
    iframeUrl: "",
    ctaHref: "/contact",
    ctaText: "Set Up Your Email Infrastructure",
    secondaryCtaText: "",
    secondaryCtaHref: "",
    scrollPercentage: "0%"
  },
  {
    name: "Edu-Maysan",
    category: "EdTech & Analytics",
    tagline: "Intelligence for every classroom",
    description: "Next-generation management and analytics operating system for modern educational institutions. Seamlessly consolidates financial accounting, student logistics, multi-role academic registries, and dynamic attendance reporting.",
    benefits: [
      "Unified institutional operations control center",
      "Multi-role administrator, teacher, and student dashboards",
      "Real-time academic performance analytics",
      "Advanced biometric and dynamic attendance tracking"
    ],
    imageUrl: "/edu_maysan.png?v=3",
    iframeUrl: "https://edumaysan.maysanlabs.com/",
    ctaHref: "/products/edu-maysan",
    ctaText: "Explore Product Details",
    secondaryCtaText: "Launch Live Site",
    secondaryCtaHref: "https://edumaysan.maysanlabs.com/",
    scrollPercentage: "0%"
  }
];

const comingSoonProducts = [
  {
    name: "LogiTrack",
    tagline: "Logistics reimagined",
    description: "Supply chain management system for logistics companies. Real-time tracking and optimization.",
    status: "Coming Soon",
    category: "Logistics",
  },
  {
    name: "HealthSync",
    tagline: "Healthcare synchronized",
    description: "Healthcare management platform for clinics and hospitals. Patient records and appointments.",
    status: "Coming Soon",
    category: "Healthcare",
  },
];

export default function ProductsClient() {
  return (
    <main id="main-content" aria-label="Maysan Labs Flagship Products" className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pb-24 relative">
        <div className="container-main">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 dark:bg-brand-primary/5 border border-brand-primary/20 dark:border-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-wider mb-6">
              <Layers size={12} />
              Our Solutions
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight">
              Flagship Products
            </h1>
            <p className="text-lg md:text-xl text-foreground/50 leading-relaxed mb-8 max-w-2xl">
              Ready-to-deploy products designed to solve real business problems. From education to healthcare, we&apos;ve built platforms that scale.
            </p>
            <Link href="/start" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-full font-semibold hover:bg-brand-primary/90 transition-colors">
              Start Your Project <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Flagship Showcases Section */}
      <section className="py-8 border-t border-white/[0.05]">
        <div className="container-main flex flex-col gap-16 md:gap-24">
          {liveProducts.map((product, index) => (
            <PortfolioShowcase
              key={product.name}
              title={product.name}
              category={product.category}
              tagline={product.tagline}
              description={product.description}
              benefits={product.benefits}
              imageUrl={product.imageUrl}
              iframeUrl={product.iframeUrl}
              ctaHref={product.ctaHref}
              ctaText={product.ctaText}
              secondaryCtaText={product.secondaryCtaText}
              secondaryCtaHref={product.secondaryCtaHref}
              scrollPercentage={product.scrollPercentage}
              reverse={index % 2 !== 0}
            />
          ))}
        </div>
      </section>

      {/* Coming Soon Grid */}
      <section className="py-16 border-t border-gray-200 dark:border-white/[0.05] bg-background">
        <div className="container-main">
          <div className="max-w-3xl mb-12">
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#1A6DD6] uppercase mb-3 block">
              Innovation Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
              In Active Development
            </h2>
            <p className="text-gray-400 text-sm mt-3">
              We constantly iterate on new enterprise paradigms. Here are the solutions entering beta testing soon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comingSoonProducts.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-2xl backdrop-blur-sm shadow-sm p-6 md:p-8 transition-all duration-300 hover:border-brand-primary/30 h-full">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-foreground/60">
                      {product.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>
                  {product.tagline && (
                    <p className="text-blue-400 text-xs font-medium mb-3 italic">
                      {product.tagline}
                    </p>
                  )}
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center py-12 border-t border-white/[0.06]">
            <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">Need something custom?</h3>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">We also build tailored solutions for unique business requirements.</p>
            <Link href="/start" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-full font-semibold hover:bg-brand-primary/90 transition-colors">
              <span>Talk to us</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <ContactFooter />
    </main>
  );
}