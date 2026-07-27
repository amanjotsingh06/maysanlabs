import type { Metadata } from "next";
import { generateBreadcrumbSchema, generatePageSEO } from "@/seo/helpers";
import Navbar from "@/components/layout/navbar";
import ContactFooter from "@/components/layout/footer";
import Link from "next/link";
import { ArrowRight, Receipt, MessageSquare, FileText, ShieldCheck, Workflow } from "lucide-react";

export const metadata: Metadata = generatePageSEO({
  title: "Automated GST Billing & WhatsApp Integration for Businesses",
  description: "Automated GST invoice generation, e-way bill management, and WhatsApp-based billing notifications. Streamline Indian tax compliance with custom software.",
  path: "/services/gst-billing-automation",
  keywords: ["GST billing software", "automated GST invoicing", "e-way bill automation", "WhatsApp billing", "GST compliance India", "invoice automation", "business billing software"],
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Services", url: "/services" },
  { name: "GST Billing Automation", url: "/services/gst-billing-automation" },
]);

const features = [
  { icon: Receipt, title: "Automated GST Invoice Generation", desc: "Generate GST-compliant invoices automatically with correct HSN/SAC codes, tax calculations, and QR codes for e-invoicing." },
  { icon: MessageSquare, title: "WhatsApp Business API Integration", desc: "Send invoices, payment reminders, and receipts directly to customers via WhatsApp. Real-time delivery notifications." },
  { icon: FileText, title: "E-Way Bill & E-Invoice Management", desc: "Automated e-way bill generation for inter-state movement. Integrated with NIC e-way bill portal and IRP for e-invoicing." },
  { icon: ShieldCheck, title: "GST Return Filing Assistance", desc: "Auto-populated GSTR-1, GSTR-3B returns from your transaction data. Reduce manual data entry errors." },
  { icon: Workflow, title: "Multi-Branch & Multi-GSTIN Support", desc: "Manage billing across multiple branches and GST registrations from a single dashboard. Consolidated reporting." },
];

export default function GstBillingAutomationPage() {
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
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4 leading-tight tracking-tight">GST Billing Automation</h1>
              <p className="text-base md:text-lg text-foreground/50 leading-relaxed">Automated GST invoicing, e-way bill management, and WhatsApp-based billing notifications for Indian businesses. Streamline tax compliance with custom software.</p>
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
              <h2 className="text-lg font-semibold text-foreground mb-2">Ready to automate your GST billing?</h2>
              <p className="text-sm text-foreground/40 mb-5 max-w-sm mx-auto">Let&apos;s discuss your invoicing and compliance requirements.</p>
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
