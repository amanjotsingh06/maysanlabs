"use client";

import { Cpu, ShieldCheck, Rocket, Smartphone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const architectures = [
  {
    id: "automation",
    title: "Spreadsheets → Automated Systems",
    text: "Stop copying data between Excel sheets. We build custom software that handles billing, WhatsApp alerts, email automation, and inventory — automatically.",
    icon: Cpu,
    href: "/services",
    gradient: "from-blue-500/10 to-brand-primary/5",
    iconBg: "from-blue-500 to-brand-primary",
  },
  {
    id: "modern-web",
    title: "Legacy Software → Modern Portals",
    text: "Refactor slow, outdated systems. We build fast Next.js websites with role-based logins, custom dashboards, and encrypted cloud storage.",
    icon: ShieldCheck,
    href: "/services/web",
    gradient: "from-emerald-500/10 to-teal-500/5",
    iconBg: "from-emerald-500 to-teal-500",
  },
  {
    id: "mvp",
    title: "Idea → Working MVP",
    text: "Launch your app in weeks, not months. Lightweight, high-performance MVPs so you can gather real feedback and start scaling.",
    icon: Rocket,
    href: "/start",
    gradient: "from-purple-500/10 to-pink-500/5",
    iconBg: "from-purple-500 to-pink-500",
  },
  {
    id: "mobile",
    title: "Website → Mobile App",
    text: "Extend your reach with native iOS and Android apps that sync with your website and backend — single codebase, zero compromises.",
    icon: Smartphone,
    href: "/services",
    gradient: "from-orange-500/10 to-amber-500/5",
    iconBg: "from-orange-500 to-amber-500",
  },
];

export default function Problem() {
  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      <div className="container-main relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-14"
        >
          <span className="badge-section mb-5 inline-flex">What We Solve</span>
          <h2 className="heading-lg text-foreground mb-4">
            Outdated websites, spreadsheets & old code{" "}
            <span className="text-gradient-brand">slow you down</span>
          </h2>
          <p className="text-foreground/60 text-base md:text-lg leading-relaxed max-w-2xl">
            We replace outdated systems with modern software — websites, tools, apps, and automations built for your business.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {architectures.map((arch, index) => {
            const Icon = arch.icon;
            return (
              <motion.div
                key={arch.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
              >
                <Link
                  href={arch.href}
                  aria-label={`Learn more about ${arch.title}`}
                  className="group relative flex flex-col h-full rounded-2xl border border-gray-100 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-6 hover:-translate-y-1 hover:shadow-lg hover:border-brand-primary/20 transition-all duration-300 overflow-hidden"
                >
                  {/* Gradient wash on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${arch.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                  <div className={`relative z-10 w-12 h-12 rounded-xl bg-gradient-to-br ${arch.iconBg} flex items-center justify-center mb-5`}>
                    <Icon size={20} className="text-white" />
                  </div>

                  <h3 className="relative z-10 text-base font-bold text-foreground mb-2 group-hover:text-brand-primary transition-colors">
                    {arch.title}
                  </h3>
                  <p className="relative z-10 text-sm text-foreground/60 leading-relaxed flex-1">
                    {arch.text}
                  </p>

                  <div className="relative z-10 flex items-center gap-1.5 mt-5 text-xs font-semibold text-brand-primary group-hover:gap-2.5 transition-all">
                    <span>Learn more</span>
                    <ArrowRight size={12} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
