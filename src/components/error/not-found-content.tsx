"use client";

import Link from "next/link";
import { Home, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const quickLinks = [
  { name: "Services", href: "/services" },
  { name: "Products", href: "/products" },
  { name: "Tools", href: "/tools" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Pricing", href: "/pricing" },
];

export default function NotFoundContent() {
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-foreground">
      <main id="main-content" className="flex items-center justify-center px-4 pt-20 pb-32">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-strong rounded-2xl p-8 md:p-12 shadow-2xl shadow-black/30 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6"
            >
              <span className="text-8xl md:text-9xl font-black text-brand-primary tracking-tight">
                404
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-2xl md:text-3xl font-bold text-[var(--text-on-white)] mb-4"
            >
              Page Not Found
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="text-[var(--text-on-white)]/60 mb-8 max-w-md mx-auto"
            >
              Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might have been moved or deleted.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary rounded-full font-semibold text-sm text-black hover:shadow-[0_0_30px_rgba(26,109,214,0.5)] transition-all"
              >
                <Home size={16} />
                Back to Home
              </Link>
              <Link
                href="/start"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-[var(--text-on-white)]/70 font-semibold text-sm hover:bg-white/5 hover:text-[var(--text-on-white)] transition-all"
              >
                Start a Project
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="border-t border-white/10 pt-8"
            >
              <p className="text-[var(--text-on-white)]/30 text-xs font-semibold uppercase tracking-wider mb-4">
                Quick Links
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[var(--text-on-white)]/50 hover:text-brand-primary hover:border-brand-primary/20 text-sm transition-all duration-300"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}