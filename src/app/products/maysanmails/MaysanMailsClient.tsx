"use client";

import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import ContactFooter from "@/components/layout/footer";
import { ArrowRight, Mail, Shield, Zap, TrendingUp, Server, CheckCircle2 } from "lucide-react";

const features = [
  { icon: Shield, title: "Zero recurring fees", desc: "Pay once, own forever. No per-subscriber charges, no monthly SaaS bills. Save ₹50,000+ per year vs ConvertKit or Mailchimp." },
  { icon: Server, title: "Self-hosted infrastructure", desc: "Your email list lives on your own server. Complete data privacy — no third party ever touches your subscriber data." },
  { icon: Zap, title: "High-deliverability SMTP", desc: "Custom sender reputation management, SPF/DKIM/DMARC configuration, and intelligent warm-up to land in inboxes, not spam folders." },
  { icon: TrendingUp, title: "Campaign automation", desc: "Trigger-based sequences, drip campaigns, and behavior-based segmentation. Set it up once, let it run." },
];

const painPoints = [
  "Paying ₹2,000-5,000/month for every 1,000 subscribers on Mailchimp or ConvertKit?",
  "Worried about your email list data being sold or shared by third-party SaaS platforms?",
  "Frustrated by sending limits and deliverability issues on shared SMTP services?",
  "Need complete control over your email infrastructure for compliance and data sovereignty?",
];

export default function MaysanMailsClient() {
  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container-narrow relative z-10">
          <span className="badge-section mb-6 inline-flex gap-2">
            <Mail size={12} /> Email Infrastructure
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
            Scale your email marketing{" "}
            <span className="text-gradient-brand">without monthly fees</span>
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl mb-8 leading-relaxed">
            MaysanMails is a self-hosted bulk email platform that gives you high-deliverability SMTP routing,
            campaign automation, and real-time analytics — all without per-subscriber SaaS charges.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white px-8 py-3.5 rounded-full font-bold hover:shadow-lg hover:shadow-brand-primary/25 transition-all">
              Set up your email infrastructure
              <ArrowRight size={14} />
            </Link>
            <Link href="/start" className="inline-flex items-center justify-center gap-2 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] text-foreground px-8 py-3.5 rounded-full font-bold hover:border-brand-primary/30 transition-all">
              Book a scoping call
            </Link>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 bg-black/[0.01] dark:bg-white/[0.01] border-y border-gray-100 dark:border-white/[0.06]">
        <div className="container-narrow">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Does this sound familiar?
          </h2>
          <div className="space-y-3">
            {painPoints.map((point) => (
              <div key={point} className="flex items-start gap-3 bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-xl p-4">
                <CheckCircle2 size={16} className="text-brand-primary shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/70">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container-narrow">
          <span className="badge-section mb-6 inline-flex">What You Get</span>
          <h2 className="heading-md text-foreground mb-12">
            Complete email infrastructure,{" "}
            <span className="text-gradient-brand">fully owned by you</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-white/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-6 hover:border-brand-primary/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-4">
                  <f.icon size={18} className="text-brand-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-black/[0.01] dark:bg-white/[0.01]">
        <div className="container-narrow text-center">
          <span className="badge-section mb-6 inline-flex">Pricing</span>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            One-time setup. Zero recurring fees.
          </h2>
          <p className="text-foreground/60 max-w-lg mx-auto mb-10">
            Unlike SaaS platforms that charge per subscriber per month, MaysanMails is a one-time investment.
            You own the infrastructure. You control the costs.
          </p>

          <div className="max-w-md mx-auto bg-white/70 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-8">
            <div className="text-4xl font-black text-foreground mb-2">₹2,49,999</div>
            <p className="text-sm text-foreground/50 mb-6">One-time setup and deployment</p>

            <ul className="space-y-3 mb-8 text-left">
              {["SMTP server setup & SPF/DKIM/DMARC", "Campaign automation workflows", "Real-time delivery dashboard", "30 days of post-launch support", "Custom sender reputation warm-up"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-foreground/70">
                  <CheckCircle2 size={14} className="text-brand-primary shrink-0" /> {f}
                </li>
              ))}
            </ul>

            <Link href="/contact" className="flex items-center justify-center gap-2 w-full bg-brand-primary text-white py-3.5 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-brand-primary/25 transition-all">
              Get started
              <ArrowRight size={14} />
            </Link>
          </div>

          <p className="text-xs text-foreground/40 mt-6">
            Compare: Mailchimp Standard (5,000 contacts) = ₹2,800/month = ₹33,600/year. At 50,000 contacts = ₹28,000/month.
          </p>
        </div>
      </section>

      <ContactFooter />
    </main>
  );
}
