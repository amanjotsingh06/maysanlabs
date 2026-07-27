import type { Metadata } from "next";
import { generateBreadcrumbSchema, generatePageSEO } from "@/seo/helpers";
import Navbar from "@/components/layout/navbar";
import ContactFooter from "@/components/layout/footer";
import Link from "next/link";
import { ArrowRight, Mail, Shield, BarChart3, Settings, Globe } from "lucide-react";

export const metadata: Metadata = generatePageSEO({
  title: "Self-Hosted Email Infrastructure & Bulk SMTP Setup",
  description: "Enterprise self-hosted email infrastructure with high-deliverability SMTP, DKIM/SPF/DMARC configuration, campaign automation, and complete data privacy.",
  path: "/services/email-infrastructure",
  keywords: ["self-hosted email", "SMTP server setup", "bulk email infrastructure", "email deliverability", "DKIM SPF DMARC", "email marketing infrastructure", "custom SMTP"],
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Services", url: "/services" },
  { name: "Email Infrastructure", url: "/services/email-infrastructure" },
]);

const features = [
  { icon: Mail, title: "SMTP Server Setup & Configuration", desc: "Dedicated SMTP servers with custom IP reputation management, warmup automation, and real-time deliverability monitoring." },
  { icon: Shield, title: "DKIM, SPF & DMARC Authentication", desc: "Full email authentication stack setup to maximize inbox placement and protect your domain from spoofing." },
  { icon: BarChart3, title: "Campaign Automation Engine", desc: "Advanced email sequencing, behavioral triggers, A/B testing, and analytics without monthly subscriber fees." },
  { icon: Settings, title: "Bounce Handling & List Cleaning", desc: "Automated bounce processing, complaint feedback loops, and list hygiene to maintain sender reputation." },
  { icon: Globe, title: "Migration from SendGrid/Mailgun", desc: "Zero-disruption migration from any ESP. Preserve your templates, segments, and automation workflows." },
];

export default function EmailInfrastructurePage() {
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
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4 leading-tight tracking-tight">Self-Hosted Email Infrastructure</h1>
              <p className="text-base md:text-lg text-foreground/50 leading-relaxed">Enterprise self-hosted email with high-deliverability SMTP, DKIM/SPF/DMARC configuration, campaign automation, and complete data privacy — no per-subscriber fees.</p>
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
              <h2 className="text-lg font-semibold text-foreground mb-2">Take control of your email infrastructure?</h2>
              <p className="text-sm text-foreground/40 mb-5 max-w-sm mx-auto">Let&apos;s discuss your deliverability needs and migration plan.</p>
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
