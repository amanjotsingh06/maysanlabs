"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import Link from "next/link";
import { Search, X, ArrowRight } from "lucide-react";

import { caseStudies } from "@/data/case-studies";
import type { BlogPost } from "@/sanity/lib/queries";

interface SearchItem {
  title: string;
  description: string;
  url: string;
  category: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const staticItems: SearchItem[] = [
  { title: "Services", description: "Custom software development services", url: "/services", category: "page" },
  { title: "Products", description: "Our SaaS products", url: "/products", category: "page" },
  { title: "Case Studies", description: "Client success stories", url: "/case-studies", category: "page" },
  { title: "Blog", description: "Technical insights and articles", url: "/blog", category: "page" },
  { title: "Insights", description: "Live dashboard with latest posts and trends", url: "/insights", category: "page" },
  { title: "Careers", description: "Join our team", url: "/careers", category: "page" },
  { title: "Architecture", description: "Our technical approach", url: "/architecture", category: "page" },
  { title: "About", description: "About Maysan Labs", url: "/about", category: "page" },
  { title: "Pricing", description: "Pricing plans", url: "/pricing", category: "page" },
  { title: "Contact", description: "Get in touch with our team", url: "/contact", category: "page" },
  { title: "Privacy Policy", description: "How we handle your data", url: "/privacy", category: "page" },
  { title: "Terms of Service", description: "Terms and conditions", url: "/terms", category: "page" },
  { title: "Start a Project", description: "Kick off your next project with us", url: "/start", category: "cta" },
  { title: "Site Checker", description: "Free website SEO & performance audit tool", url: "/tools/site-checker", category: "tool" },
  { title: "Image Compressor", description: "Shrink PNG, JPEG, and WebP files in-browser", url: "/tools/image-compressor", category: "tool" },
  { title: "App Cost Estimator", description: "Estimate custom software development costs", url: "/tools/scope-estimator", category: "tool" },
  { title: "Profit Calculator", description: "Calculate headless CMS ROI for your business", url: "/tools/headless-roi", category: "tool" },
  { title: "Policy Generator", description: "Create privacy policy and terms of service pages", url: "/tools/privacy-generator", category: "tool" },
  { title: "Link Preview Maker", description: "Design how your site looks when shared on social media", url: "/tools/og-generator", category: "tool" },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [asyncBlogPosts, setAsyncBlogPosts] = useState<BlogPost[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && asyncBlogPosts.length === 0) {
      fetch('/api/posts').then(res => res.json()).then(data => setAsyncBlogPosts(data)).catch(console.error);
    }
  }, [isOpen, asyncBlogPosts.length]);

  const allItems = useMemo<SearchItem[]>(() => [
    ...staticItems,
    ...asyncBlogPosts.map((post) => ({
      title: post.title,
      description: post.excerpt || "",
      url: `/blog/${post.slug}`,
      category: "blog",
    })),
    ...caseStudies.map((study) => ({
      title: study.title,
      description: `${study.client} — ${study.challenge.slice(0, 120)}`,
      url: `/case-studies/${study.slug}`,
      category: "case-study",
    })),
  ], [asyncBlogPosts]);

  const fuse = useMemo(
    () =>
      new Fuse(allItems, {
        keys: ["title", "description", "category"],
        threshold: 0.4,
        includeScore: true,
      }),
    [allItems],
  );

  const results = useMemo(() => {
    if (!query.trim()) return allItems;
    return fuse.search(query).map((r) => r.item);
  }, [query, fuse, allItems]);

  // Focus trap
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !containerRef.current) return;
      const focusable = containerRef.current.querySelectorAll<HTMLElement>(
        "input, a, button, [tabindex]:not([tabindex='-1'])",
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[300] flex items-start justify-center pt-[15vh] px-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close search"
          />

          {/* Modal */}
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            initial={{ y: -20, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-slate-200/50 dark:shadow-black/60 overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 px-5 py-4">
              <Search size={18} className="shrink-0 text-slate-400 dark:text-foreground/40" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, blog posts, tools..."
                aria-label="Search pages, blog posts, tools"
                className="flex-1 bg-transparent text-sm text-slate-800 dark:text-foreground placeholder-slate-400 dark:placeholder-foreground/30 outline-none"
              />
              <button
                onClick={onClose}
                aria-label="Close search"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-foreground/50 transition-colors hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-foreground"
              >
                <X size={14} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-slate-500 dark:text-foreground/40">
                    No results found for &ldquo;{query}&rdquo;
                  </p>
                </div>
              ) : (
                <ul className="space-y-1">
                  {results.map((item) => (
                    <li key={item.url}>
                      <Link
                        href={item.url}
                        onClick={onClose}
                        className="group flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-white/5"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold text-slate-800 dark:text-foreground group-hover:text-brand-primary transition-colors">
                            {item.title}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-foreground/40">
                            {item.description}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full border border-slate-200 dark:border-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-slate-100 dark:bg-white/[0.03] text-slate-600 dark:text-foreground/30">
                            {item.category === "blog" ? "article" :
                             item.category === "case-study" ? "case study" :
                             item.category === "tool" ? "tool" :
                             item.category === "cta" ? "action" :
                             "page"}
                          </span>
                          <ArrowRight
                            size={14}
                            className="shrink-0 text-slate-300 dark:text-foreground/20 transition-all duration-200 group-hover:text-brand-primary group-hover:translate-x-0.5"
                          />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer hint */}
            <div className="border-t border-slate-100 dark:border-white/5 px-5 py-3">
              <p className="text-[10px] text-slate-400 dark:text-foreground/25">
                <kbd className="rounded border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">
                  Esc
                </kbd>{" "}
                to close
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}