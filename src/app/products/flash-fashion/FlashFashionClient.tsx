"use client";

import Navbar from "@/components/layout/navbar";
import ContactFooter from "@/components/layout/footer";
import { ShoppingBag, Package, CreditCard, Users, BarChart3, ArrowRight, ArrowUpRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const features = [
  {
    icon: Package,
    title: "Inventory Management",
    description: "Real-time stock tracking across multiple warehouses. Low stock alerts and automated reordering."
  },
  {
    icon: CreditCard,
    title: "Payment Processing",
    description: "Integrated with Stripe, Razorpay, and Paytm. Multiple payment modes including UPI, cards, and wallets."
  },
  {
    icon: Users,
    title: "Customer CRM",
    description: "Complete customer profiles, order history, loyalty programs, and targeted marketing campaigns."
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Real-time sales analytics, product performance metrics, and business intelligence reports."
  }
];

const metrics = [
  { value: "10K+", label: "Products Managed" },
  { value: "50K+", label: "Orders Processed" },
  { value: "99.9%", label: "Uptime" },
  { value: "3x", label: "Revenue Growth" }
];

const techStack = ["Next.js", "React", "Node.js", "PostgreSQL", "Redis", "Stripe", "AWS", "TypeScript"];

export default function FlashFashionClient() {
  return (
    <main id="main-content" aria-label="FlashFashion Ecommerce Platform Details" className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pb-24 relative">
        <div className="container-main max-w-5xl mx-auto">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-foreground/40 hover:text-brand-primary transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Products</span>
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="badge-section">
                <ShoppingBag size={12} />
                Live Product
              </span>
              <span className="text-foreground/30">•</span>
              <span className="text-foreground/40 text-sm">Ecommerce</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight">
              FlashFashion
            </h1>
            <p className="text-xl text-foreground/50 mb-8 max-w-xl">
              Full-stack ecommerce platform built from scratch. A complete solution with inventory, orders, payments, and customer management.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="https://flashhfashion.in/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-full font-semibold hover:bg-brand-primary/90 transition-colors">
                Launch Live Store <ArrowUpRight size={16} />
              </Link>
              <Link href="/case-studies/flash-fashion-ecommerce" className="inline-flex items-center gap-2 px-8 py-4 bg-white/80 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 text-foreground rounded-full font-semibold hover:bg-white dark:hover:bg-white/[0.08] transition-colors">
                View Case Study <ArrowUpRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-12 border-y border-gray-200 dark:border-white/[0.06] bg-white/30 dark:bg-white/[0.01]">
        <div className="container-main max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{metric.value}</div>
                <div className="text-sm text-foreground/50 font-medium">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container-main max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">Platform Capabilities</h2>
            <p className="text-foreground/50 max-w-xl mx-auto">Everything you need to run a modern ecommerce business at scale.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-2xl backdrop-blur-sm shadow-sm p-6 md:p-8 transition-all duration-300 h-full">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                    <feature.icon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                  <p className="text-foreground/50 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-12 border-t border-gray-200 dark:border-white/[0.06]">
        <div className="container-main max-w-5xl mx-auto">
          <div className="bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-2xl backdrop-blur-sm shadow-sm p-8">
            <h3 className="text-sm font-semibold text-foreground/50 uppercase tracking-wider mb-5">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, i) => (
                <span key={i} className="px-3.5 py-1.5 bg-white/80 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 rounded-lg text-sm text-foreground/70">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container-main max-w-5xl mx-auto">
          <div className="bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-2xl backdrop-blur-sm shadow-sm p-8 md:p-12 text-center transition-all duration-300">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">Need a similar ecommerce platform?</h2>
            <p className="text-foreground/50 mb-8 max-w-xl mx-auto">We build custom ecommerce solutions tailored to your business requirements.</p>
            <Link href="/start" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-full font-semibold hover:bg-brand-primary/90 transition-colors">
              Start Your Project <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <ContactFooter />
    </main>
  );
}