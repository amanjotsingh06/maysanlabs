"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/navbar";
import ContactFooter from "@/components/layout/footer";
import { caseStudies, aggregateStats, categories } from "@/data/case-studies";
import { ArrowRight, Briefcase, Search, X, Shield, Zap, Building2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { staggerContainer, fadeUpHeavy as cardVariants, fadeUp } from "@/utils/motion-variants";

const stats = [
  { icon: Briefcase, label: "Projects Delivered", value: aggregateStats.totalProjects.toString() },
  { icon: Building2, label: "Enterprise Clients", value: aggregateStats.totalClients.toString() },
  { icon: Shield, label: "Avg. Uptime", value: aggregateStats.uptime },
  { icon: Zap, label: "Avg. Response", value: aggregateStats.avgResponseTime },
];

const featured = caseStudies[0];

export default function CaseStudiesClient() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return caseStudies.filter((s) => {
      const catMatch = activeCategory === "All" || s.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const searchMatch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.client.toLowerCase().includes(q) ||
        s.challenge.toLowerCase().includes(q) ||
        s.technologies.some((t) => t.toLowerCase().includes(q)) ||
        s.category.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });
  }, [activeCategory, searchQuery]);

  const rest = filtered.filter((s) => s.slug !== featured.slug);

  return (
    <main id="main-content" aria-label="Maysan Labs Case Studies" className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-primary/5 rounded-full blur-[180px] pointer-events-none" />

      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pb-20 relative">
        <div className="container-main relative">
          <motion.div className="max-w-4xl mx-auto text-center" initial="hidden" animate="visible" variants={fadeUp}>
            <motion.span variants={fadeUp} className="badge-section mb-6">
              <Briefcase size={12} />
              Real-World Impact
            </motion.span>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] text-foreground mb-6 leading-[1.05]">
              Case Studies
            </motion.h1>
            <motion.p variants={fadeUp} className="text-base md:text-lg text-foreground/60 leading-relaxed mb-10 max-w-2xl mx-auto">
              Explore our portfolio of industrial-grade transformations. Each project delivered measurable impact for our clients.
            </motion.p>

            {/* Search */}
            <motion.div variants={fadeUp} className="relative max-w-md mx-auto mb-6">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
              <input
                type="text"
                aria-label="Search case studies"
                placeholder="Search case studies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-white/[0.03] border border-white/[0.08] rounded-full text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-brand-primary/40 focus:bg-white/[0.05] transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground transition-colors">
                  <X size={16} />
                </button>
              )}
            </motion.div>

            {/* Category Tabs */}
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2">
              {["All", ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-brand-primary text-white shadow-[0_0_20px_rgba(26,109,214,0.3)]"
                      : "bg-white/[0.03] border border-white/[0.06] text-foreground/50 hover:text-foreground hover:border-white/[0.12]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="py-10 border-y border-white/[0.06] bg-white/[0.01]"
      >
        <div className="container-main">
          <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="text-center">
                <stat.icon size={20} className="text-brand-primary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-widest text-foreground/40 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Case Study */}
      {activeCategory === "All" && !searchQuery && (
        <section className="py-16 md:py-20">
          <div className="container-main">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="max-w-5xl mx-auto"
            >
              <motion.span variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-semibold uppercase tracking-wider mb-4">
                Featured Project
              </motion.span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-6 text-left">
                Featured Innovation
              </h2>
              <motion.div variants={fadeUp} className="relative group">
                <Link
                  href={`/case-studies/${featured.slug}`}
                  className="block relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-primary/5 border border-white/[0.08] p-8 md:p-12 transition-all duration-500 hover:border-brand-primary/30 hover:shadow-[0_0_40px_rgba(26,109,214,0.15)]"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full pointer-events-none" />
                  <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-medium mb-4">
                        {featured.category}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-3">
                        {featured.title}
                      </h3>
                      <p className="text-foreground/60 text-sm leading-relaxed mb-3">
                        {featured.challenge}
                      </p>
                      <p className="text-foreground/40 text-xs">
                        Client: <span className="text-foreground/70 font-medium">{featured.client}</span> &middot; {featured.year}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {featured.technologies.slice(0, 4).map((tech) => (
                          <span key={tech} className="text-[9px] font-semibold px-2 py-1 bg-white/[0.04] border border-white/[0.06] rounded-full text-foreground/60 uppercase tracking-wider">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-2 mt-5 text-brand-primary text-sm font-semibold group/link">
                        View Case Study <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {featured.metrics.map((m) => (
                        <div key={m.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
                          <div className="text-xl md:text-2xl font-bold text-brand-primary mb-1">{m.value}</div>
                          <div className="text-[9px] uppercase tracking-widest text-foreground/40 font-medium">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Grid */}
      <section className={`pb-16 md:pb-24 relative ${activeCategory === "All" && !searchQuery ? "" : "pt-16 md:pt-20"}`}>
        <div className="container-main">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-8 text-left">
              Engineering Case Studies
            </h2>
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-20"
                >
                  <Search size={40} className="mx-auto text-foreground/20 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No case studies found</h3>
                  <p className="text-foreground/50 text-sm mb-6">Try a different category or search term</p>
                  <button
                    onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
                    className="px-5 py-2.5 bg-brand-primary text-white rounded-full text-sm font-semibold hover:bg-brand-primary/90 transition-colors"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={`${activeCategory}-${searchQuery}`}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {(activeCategory === "All" && !searchQuery ? rest : filtered).map((study) => (
                    <motion.div key={study.slug} variants={cardVariants}>
                      <Link
                        href={`/case-studies/${study.slug}`}
                        className="flex flex-col h-full bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-2xl backdrop-blur-sm shadow-sm p-6 md:p-8 transition-all duration-300 hover:border-brand-primary/30 hover:shadow-md group/card"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex-1 pr-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[11px] font-medium">
                              {study.category}
                            </span>
                            <h3 className="text-xl font-bold text-foreground tracking-tight leading-tight mt-4 group-hover/card:text-brand-primary transition-colors">
                              {study.title}
                            </h3>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-white/50 border border-gray-200 dark:border-white/[0.06] flex items-center justify-center text-foreground/40 group-hover/card:bg-brand-primary group-hover/card:text-white group-hover/card:border-brand-primary transition-all shrink-0">
                            <ArrowRight size={16} />
                          </div>
                        </div>

                        <p className="text-foreground/60 text-sm leading-relaxed mb-8 flex-1">
                          {study.challenge}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                          {study.metrics.map((metric, idx) => (
                            <div key={idx} className="bg-white/50 dark:bg-white/[0.03] rounded-xl p-4 border border-gray-100 dark:border-white/[0.05] group-hover/card:border-brand-primary/20 transition-all">
                              <div className="text-xl font-bold text-brand-primary leading-none mb-2">
                                {metric.value}
                              </div>
                              <div className="text-[10px] sm:text-xs uppercase text-foreground/50 tracking-widest font-medium">
                                {metric.label}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-white/[0.06]">
                          {study.technologies.slice(0, 4).map((tech) => (
                            <span key={tech} className="text-[10px] font-semibold px-2.5 py-1 bg-brand-primary/10 rounded-full text-foreground/70 uppercase tracking-wider">
                              {tech}
                            </span>
                          ))}
                          {study.technologies.length > 4 && (
                            <span className="text-[10px] font-semibold px-2 py-1 text-foreground/50 uppercase tracking-wider">
                              +{study.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mt-16 text-center py-12 border-t border-gray-100 dark:border-white/[0.06]"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Ready for your <span className="text-brand-primary">transformation</span>?
            </h2>
            <p className="text-foreground/60 mb-8 max-w-lg mx-auto">
              Let&apos;s discuss how we can help solve your challenges.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/start"
                className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-primary/90 transition-colors"
              >
                Book a Strategy Call
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] text-foreground/70 px-6 py-3 rounded-full font-semibold hover:border-white/[0.15] hover:text-foreground transition-all"
              >
                Contact Us <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <ContactFooter />
    </main>
  );
}
