"use client";

import Navbar from "@/components/layout/navbar";
import ContactFooter from "@/components/layout/footer";
import FAQ from "@/components/home/faq";
import {
  Code2,
  Smartphone,
  ShoppingCart,
  Cloud,
  Workflow,
  Sparkles,
  ArrowRight,
  Mail,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const services = [
  {
    title: "Web Development",
    desc: "Fast, scalable websites built with modern frameworks that grow with your business.",
    icon: Code2,
    color: "from-blue-500 to-cyan-400",
    href: "/services/web",
  },
  {
    title: "Mobile Apps",
    desc: "Cross-platform mobile applications that work seamlessly on iOS and Android.",
    icon: Smartphone,
    color: "from-teal-500 to-cyan-400",
    href: "/services/web",
  },
  {
    title: "E-Commerce",
    desc: "Online stores with automated order management, payments, and inventory.",
    icon: ShoppingCart,
    color: "from-pink-500 to-rose-400",
    href: "/products/flash-fashion",
  },
  {
    title: "Cloud Infrastructure",
    desc: "Secure, scalable hosting on AWS/Azure with enterprise-grade security.",
    icon: Cloud,
    color: "from-cyan-500 to-blue-400",
    href: "/services/cloud",
  },
  {
    title: "Custom Software",
    desc: "Tailored solutions built for your unique business requirements.",
    icon: Workflow,
    color: "from-orange-500 to-yellow-400",
    href: "/services/web",
  },
  {
    title: "AI & Automation",
    desc: "Smart automation and AI integration to streamline your operations.",
    icon: Sparkles,
    color: "from-green-500 to-emerald-400",
    href: "/services/ai",
  },
  {
    title: "Medusa E-Commerce",
    desc: "Custom headless commerce platforms built on Medusa.js for high-growth brands.",
    icon: ShoppingCart,
    color: "from-purple-500 to-pink-400",
    href: "/services/medusa-ecommerce",
  },
  {
    title: "Email Infrastructure",
    desc: "Self-hosted SMTP, DKIM/SPF setup, and campaign automation with zero recurring fees.",
    icon: Mail,
    color: "from-blue-500 to-indigo-400",
    href: "/services/email-infrastructure",
  },
  {
    title: "GST Billing Automation",
    desc: "Automated GST invoicing, e-way bills, and WhatsApp integration for Indian businesses.",
    icon: FileText,
    color: "from-emerald-500 to-teal-400",
    href: "/services/gst-billing-automation",
  },
];

export default function ServicesClient() {
  return (
    <main id="main-content" aria-label="Maysan Labs Development Services" className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] max-sm:w-[300px] max-sm:h-[300px] bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <Navbar />
      
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 via-brand-primary/2 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] max-sm:w-[300px] max-sm:h-[200px] bg-brand-primary/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container-main relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 dark:bg-brand-primary/5 border border-brand-primary/20 dark:border-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-wider mb-6">
              <Code2 size={12} />
              Services
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] text-foreground mb-6 leading-[1.05]">
              What we <span className="text-brand-primary">do</span>
            </h1>
            <p className="text-base md:text-lg text-foreground/60 leading-relaxed mb-8 max-w-2xl font-medium">
              We build scalable, high-performance software solutions for enterprises and fast-growing startups.
            </p>
            <Link href="/start" className="group relative inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#1A6DD6] to-[#00d2ff] rounded-full font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-widest text-white shadow-lg shadow-blue-500/25 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">Start a Project</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="group relative rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl p-6 hover:border-brand-primary/40 dark:hover:border-brand-primary/30 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl shadow-sm overflow-hidden text-left"
              >
                {/* Custom Gradient Neon Border on card hover */}
                <div className={`absolute -inset-px bg-gradient-to-br ${service.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10`} />
                <div className="absolute inset-[1px] bg-background rounded-2xl -z-10" />

                <div className="w-12 h-12 bg-white/50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl flex items-center justify-center text-foreground/50 mb-5 group-hover:bg-brand-primary/15 group-hover:text-brand-primary transition-all duration-300">
                  <service.icon size={20} className="group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-brand-primary transition-colors duration-300">
                  {service.title}
                </h2>
                <p className="text-foreground/45 text-sm leading-relaxed mb-5 group-hover:text-foreground/60 transition-colors duration-300">
                  {service.desc}
                </p>
                <Link href={service.href} className="flex items-center gap-1.5 text-brand-primary text-xs font-semibold uppercase tracking-wider group-hover:gap-2.5 transition-all" aria-label={`Learn more about ${service.title}`}>
                  <span>Learn more</span>
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FAQ />

      <ContactFooter />
    </main>
  );
}
