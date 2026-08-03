"use client";

import { motion } from "framer-motion";
import { Activity, Database, TrendingUp, Shield, BarChart3, ArrowRight, BookOpen, Briefcase, Code2, LineChart, Clock, User, Tag, Layers, Zap, Cpu } from "lucide-react";
import { SafeLink } from "@/components/ui/SafeLink";
import Navbar from "@/components/layout/navbar";
import ContactFooter from "@/components/layout/footer";
import type { BlogPost } from "@/sanity/lib/queries";
import { caseStudies } from "@/data/case-studies";

const insights = [
  {
    id: "01",
    title: "Market Analysis",
    value: "24/7",
    desc: "Real-time monitoring of market trends and competitor movements.",
    icon: <BarChart3 size={24} />,
  },
  {
    id: "02",
    title: "Operational Efficiency",
    value: "+40%",
    desc: "Average increase in speed after implementing our custom services.",
    icon: <TrendingUp size={24} />,
  },
  {
    id: "03",
    title: "Data Sovereignty",
    value: "100%",
    desc: "Your data remains yours. No third-party sharing or leakage.",
    icon: <Shield size={24} />,
  },
  {
    id: "04",
    title: "Runtime Latency",
    value: "<35ms",
    desc: "Ultra-low latency bridges ensuring seamless digital scaling.",
    icon: <Database size={24} />,
  },
];

const techCount = caseStudies.reduce<Record<string, number>>((acc, cs) => {
  cs.technologies.forEach((t) => {
    acc[t] = (acc[t] || 0) + 1;
  });
  return acc;
}, {});

const topTech = Object.entries(techCount)
  .sort(([, a], [, b]) => b - a);

const categoryColors: Record<string, string> = {
  "Strategy": "bg-blue-500/20 text-blue-400",
  "Infrastructure": "bg-emerald-500/20 text-emerald-400",
  "Methodology": "bg-rose-500/20 text-rose-400",
  "AI & ML": "bg-cyan-500/20 text-cyan-400",
  "Security": "bg-red-500/20 text-red-400",
  "Performance": "bg-amber-500/20 text-amber-400",
  "Business": "bg-emerald-500/20 text-emerald-400",
  "Design": "bg-pink-500/20 text-pink-400",
  "Architecture": "bg-cyan-500/20 text-cyan-400",
  "Optimization": "bg-teal-500/20 text-teal-400",
  "Transformation": "bg-orange-500/20 text-orange-400",
  "Insights": "bg-brand-primary/20 text-brand-primary",
};

export default function InsightsClient({ blogPosts }: { blogPosts: BlogPost[] }) {
  const recentPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const categoryCount = blogPosts.reduce<Record<string, number>>((acc, p) => {
    const cat = p.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] max-sm:w-[300px] max-sm:h-[300px] bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <Navbar />

      <div className="sr-only" aria-hidden="true">
        <h2>Enterprise Business Data Metrics, Operational Scaling, and Latency Analysis</h2>
        <h2>Market Trend Competitor Tracking, High Sovereignty Clouds, & API Gateways</h2>
        <span className="author" rel="author">Written by Maysan Labs Analytics Board</span>
        <span className="contributor">Contributor: Lead Data Officer</span>
        <time dateTime="2026-05-27" className="pubdate">Last updated: May 27, 2026</time>
        <p className="geo-tldr">
          Operational Efficiency refers to systems optimization resulting in an average 40% increase in software throughput and responsiveness.
          Data Sovereignty is defined as 100% complete isolated database storage guaranteeing no third-party leaks.
          According to real-time latency monitoring, our custom API bridges sustain a zero-leak connection under 35ms latency.
        </p>
      </div>

      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 via-brand-primary/2 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] max-sm:w-[300px] max-sm:h-[200px] bg-brand-primary/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container-main relative">
          <div className="max-w-3xl">
            <span className="badge-section mb-6">
              <Activity size={12} />
              Business Data
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight">
              Data & <span className="text-brand-primary">insights</span> for<br />
              Your Business.
            </h1>
            <p className="text-lg md:text-xl text-foreground/50 leading-relaxed mb-8 max-w-2xl">
              We provide clear data and insights to help you make better decisions for your company and grow your business.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insights.map((item, index) => (
              <motion.div
                key={item.id}
                className="card-glass rounded-2xl p-6 card-hover group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-white/[0.03] flex items-center justify-center text-foreground/40 rounded-xl group-hover:bg-brand-primary/20 group-hover:text-brand-primary transition-all duration-300">
                      {item.icon}
                    </div>
                    <span className="text-xs text-foreground/20 font-bold uppercase tracking-widest">{item.id}</span>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-foreground mb-3 group-hover:text-brand-primary transition-colors">
                      {item.value}
                    </div>
                    <h3 className="text-xs font-bold text-foreground/40 mb-4 uppercase tracking-wider">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground/45">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <span className="badge-section mb-4">
                <BookOpen size={12} />
                Latest Articles
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                Recent <span className="text-brand-primary">Insights</span>
              </h2>
            </div>
            <SafeLink
              href="/blog"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary/10 text-brand-primary text-sm font-semibold hover:bg-brand-primary/20 transition-all"
            >
              View all articles <ArrowRight size={16} />
            </SafeLink>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <SafeLink
                  href={`/blog/${post.slug}`}
                  className="block card-glass rounded-2xl p-6 h-full card-hover group"
                >
                  <div className="flex flex-col h-full gap-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${categoryColors[post.category || "Uncategorized"] || "bg-white/[0.06] text-foreground/60"}`}>
                        {post.category || "Uncategorized"}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-foreground/40">
                        <Clock size={11} />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-brand-primary transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-foreground/45 leading-relaxed flex-1">
                      {post.excerpt || ""}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                      <span className="flex items-center gap-1.5 text-xs text-foreground/40">
                        <User size={12} />
                        {post.author || "Unknown"}
                      </span>
                      <span className="text-xs text-foreground/30">{post.date}</span>
                    </div>
                  </div>
                </SafeLink>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <SafeLink
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary/10 text-brand-primary text-sm font-semibold hover:bg-brand-primary/20 transition-all"
            >
              View all articles <ArrowRight size={16} />
            </SafeLink>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <span className="badge-section mb-4">
                <Briefcase size={12} />
                Case Studies
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                Proven <span className="text-brand-primary">Results</span>
              </h2>
            </div>
            <SafeLink
              href="/case-studies"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary/10 text-brand-primary text-sm font-semibold hover:bg-brand-primary/20 transition-all"
            >
              View all cases <ArrowRight size={16} />
            </SafeLink>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <SafeLink
                  href={`/case-studies/${study.slug}`}
                  className="block card-glass rounded-2xl p-6 h-full card-hover group"
                >
                  <div className="flex flex-col h-full gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-foreground/40 uppercase tracking-wider">
                        {study.category}
                      </span>
                      <span className="text-xs text-foreground/30">{study.year}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-brand-primary transition-colors">
                        {study.title}
                      </h3>
                      <p className="text-sm text-foreground/50 mt-1">{study.client}</p>
                    </div>
                    <p className="text-sm text-foreground/45 leading-relaxed flex-1">
                      {study.challenge}
                    </p>
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/[0.06]">
                      {study.metrics.slice(0, 3).map((m) => (
                        <div key={m.label} className="text-center">
                          <div className="text-sm font-bold text-brand-primary">{m.value}</div>
                          <div className="text-[10px] text-foreground/40 uppercase tracking-wider mt-0.5">{m.label}</div>
                        </div>
                      ))}
                    </div>
                    {study.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {study.technologies.slice(0, 4).map((tech) => (
                          <span key={tech} className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] text-foreground/50 border border-white/[0.06]">
                            {tech}
                          </span>
                        ))}
                        {study.technologies.length > 4 && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] text-foreground/40">
                            +{study.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </SafeLink>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <SafeLink
              href="/case-studies"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary/10 text-brand-primary text-sm font-semibold hover:bg-brand-primary/20 transition-all"
            >
              View all cases <ArrowRight size={16} />
            </SafeLink>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="badge-section mb-4">
              <LineChart size={12} />
              Analytics Dashboard
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Knowledge <span className="text-brand-primary">Dashboard</span>
            </h2>
            <p className="text-foreground/45 mt-3 max-w-xl mx-auto">
              Real-time view into our published content, technology expertise, and domain coverage.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Layers size={16} className="text-brand-primary" />
                <h3 className="text-sm font-semibold text-foreground">Content by Category</h3>
              </div>
              <div className="space-y-3">
                {topCategories.map(([category, count]) => {
                  const maxCount = topCategories[0][1];
                  const pct = Math.round((count / maxCount) * 100);
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-foreground/60">{category}</span>
                        <span className="text-foreground/40 text-xs font-semibold">{count} articles</span>
                      </div>
                      <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-brand-primary/60"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Code2 size={16} className="text-brand-primary" />
                <h3 className="text-sm font-semibold text-foreground">Technology Stack</h3>
              </div>
              <div className="space-y-3">
                {topTech.map(([tech, count]) => {
                  const maxCount = topTech[0][1];
                  const pct = Math.round((count / maxCount) * 100);
                  return (
                    <div key={tech}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-foreground/60">{tech}</span>
                        <span className="text-foreground/40 text-xs font-semibold">{count} {count === 1 ? "project" : "projects"}</span>
                      </div>
                      <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-cyan-500/60"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
          >
            {[
              { icon: <BookOpen size={18} />, label: "Articles Published", value: blogPosts.length.toString(), color: "text-brand-primary" },
              { icon: <Briefcase size={18} />, label: "Case Studies", value: caseStudies.length.toString(), color: "text-emerald-400" },
              { icon: <Tag size={18} />, label: "Categories", value: Object.keys(categoryCount).length.toString(), color: "text-pink-400" },
              { icon: <Cpu size={18} />, label: "Technologies Used", value: Object.keys(techCount).length.toString(), color: "text-cyan-400" },
            ].map((stat, i) => (
              <div
                key={i}
                className="card-glass rounded-xl p-4 text-center"
              >
                <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.03] ${stat.color} mb-2`}>
                  {stat.icon}
                </div>
                <div className={`text-2xl font-bold text-foreground ${stat.color}`}>{stat.value}</div>
                <div className="text-[11px] text-foreground/40 uppercase tracking-wider mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative max-w-4xl mx-auto p-10 md:p-14 bg-gradient-to-br from-brand-primary/10 via-brand-primary/5 to-transparent border border-brand-primary/20 rounded-3xl overflow-hidden text-center"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-primary/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-primary/20 mb-6">
                <Zap size={28} className="text-brand-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Stay Ahead with <span className="text-brand-primary">Expert Insights</span>
              </h2>
              <p className="text-foreground/45 max-w-lg mx-auto mb-8">
                Get the latest architectural deep dives, scaling strategies, and best practices delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <SafeLink
                  href="/blog"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primary/90 transition-all"
                >
                  Browse All Articles <ArrowRight size={16} />
                </SafeLink>
                <SafeLink
                  href="/case-studies"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-foreground text-sm font-semibold hover:bg-white/[0.08] transition-all"
                >
                  View Case Studies <ArrowRight size={16} />
                </SafeLink>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <ContactFooter />
    </main>
  );
}
