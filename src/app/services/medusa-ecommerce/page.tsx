import type { Metadata } from "next";
import { generateBreadcrumbSchema, generatePageSEO } from "@/seo/helpers";
import Navbar from "@/components/layout/navbar";
import ContactFooter from "@/components/layout/footer";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Palette, Cpu, Globe, BarChart3 } from "lucide-react";

export const metadata: Metadata = generatePageSEO({
  title: "Custom Medusa Headless E-Commerce Development",
  description: "Enterprise headless e-commerce development with Medusa.js. Custom storefronts, payment integrations, multi-warehouse inventory, scalable commerce infrastructure for high-growth brands.",
  path: "/services/medusa-ecommerce",
  keywords: ["Medusa.js development", "headless e-commerce", "custom Medusa storefront", "Medusa migration", "headless commerce India", "e-commerce development company", "MedusaJS developer"],
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Services", url: "/services" },
  { name: "Medusa E-Commerce", url: "/services/medusa-ecommerce" },
]);

const features = [
  { icon: ShoppingCart, title: "Custom Medusa Storefronts", desc: "Headless frontends built with Next.js, React, or any framework — fully decoupled from backend commerce logic for ultimate flexibility." },
  { icon: Palette, title: "Payment & Shipping Integrations", desc: "Seamless integration with Razorpay, Stripe, PayPal, and Indian payment gateways. Custom shipping rules and real-time rate calculations." },
  { icon: Cpu, title: "Multi-Warehouse Inventory", desc: "Real-time inventory sync across warehouses, automated stock management, and intelligent order routing for Pan-India fulfilment." },
  { icon: Globe, title: "Marketplace & Multi-Vendor", desc: "Build marketplace platforms with Medusa's multi-vendor architecture. Vendor dashboards, commission management, and order splitting." },
  { icon: BarChart3, title: "Migration from Shopify/Magento", desc: "Migrate your existing store from Shopify, Magento, or WooCommerce to Medusa with zero downtime and complete data fidelity." },
];

export default function MedusaEcommercePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main id="main-content" className="min-h-screen bg-background text-foreground flex flex-col">
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
        <Navbar />
        <section className="pt-32 pb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brand-primary/[0.04] blur-[120px] rounded-full pointer-events-none" />
          <div className="container-main relative">
            <div className="max-w-2xl">
              <Link href="/services" className="text-sm text-foreground/30 hover:text-brand-primary transition-colors mb-4 inline-block">&larr; All Services</Link>
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4 leading-tight tracking-tight">Medusa Headless E-Commerce</h1>
              <p className="text-base md:text-lg text-foreground/50 leading-relaxed">Custom headless commerce platforms built on Medusa.js. Flexible, scalable, and fully customizable — the modern alternative to Shopify and Magento for high-growth brands.</p>
            </div>
          </div>
        </section>
        <section className="pb-16 md:pb-24">
          <div className="container-main">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((f) => (
                <div key={f.title} className="bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-xl p-6">
                  <div className="w-9 h-9 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-3">
                    <f.icon size={16} />
                  </div>
                  <h2 className="text-base font-semibold text-foreground mb-1.5">{f.title}</h2>
                  <p className="text-sm text-foreground/50 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 bg-gradient-to-br from-brand-primary/5 to-transparent border border-brand-primary/10 rounded-xl p-6 md:p-8 text-center">
              <h2 className="text-lg font-semibold text-foreground mb-2">Ready to move to headless commerce?</h2>
              <p className="text-sm text-foreground/40 mb-5 max-w-sm mx-auto">Let&apos;s discuss your e-commerce architecture and migration plan.</p>
              <Link href="/start" className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary/90 transition-all">
                Start your project <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
        <ContactFooter />
      </main>
    </>
  );
}
