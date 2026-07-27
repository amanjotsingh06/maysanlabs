"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, ArrowRight, CheckCircle, Send } from "lucide-react";
import { sendEmail } from "@/app/actions/sendEmail";
import { generateBreadcrumbSchema } from "@/seo/helpers";
import Navbar from "@/components/layout/navbar";

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Maysan Labs",
  description: "Get in touch with Maysan Labs for your software development project inquiries.",
  url: "https://maysanlabs.com/contact",
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Contact", url: "/contact" }
]);

export default function ContactClient() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const data = new FormData();
    data.append("companyName", formData.name);
    data.append("email", formData.email);
    data.append("contact", formData.subject);
    data.append("requirements", formData.message);
    try {
      const result = await sendEmail(data);
      if (result.success) {
        setIsSubmitted(true);
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "contact_form_submit" });
      } else setError(result.message || "Something went wrong.");
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
      {/* Brand Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] max-sm:w-[300px] max-sm:h-[300px] bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />

      <Navbar />

      {/* Hero */}
      <section className="pt-16 pb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 via-brand-primary/2 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-primary/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="container-main relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="badge-section mb-6">
              <Send size={12} />
              Get in Touch
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-foreground mb-5 leading-[1.05]">
              Let&apos;s build something{" "}
              <span className="text-brand-primary">great</span>
            </h1>
            <p className="text-foreground/60 text-lg leading-relaxed">
              Whether you have a project in mind or just want to explore possibilities — our team is ready to help you scale.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Body */}
      <section className="pb-24">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-8">Contact Information</h2>

              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-1">Email</p>
                    <a href="mailto:business@maysanlabs.com" className="text-foreground hover:text-brand-primary transition-colors text-sm font-medium">
                      business@maysanlabs.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-1">Phone</p>
                    <a href="tel:+919660641530" onClick={() => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: "phone_call_click", label: "contact_phone" }); }} className="text-foreground hover:text-brand-primary transition-colors text-sm font-medium">
                      +91 96606 41530
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-1">Office</p>
                    <p className="text-foreground text-sm font-medium">
                      Sector 44, Gurgaon, Haryana 122001, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick links */}
              <div>
                <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-4">Quick Links</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "Our Services", href: "/services" },
                    { label: "Case Studies", href: "/case-studies" },
                    { label: "Pricing", href: "/pricing" },
                    { label: "Start a Project", href: "/start" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-foreground/60 hover:text-foreground hover:border-white/20 text-xs font-semibold transition-all duration-300"
                    >
                      {link.label}
                      <ArrowRight size={12} />
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-12 card-glass rounded-2xl p-6">
                <h3 className="text-foreground font-bold mb-2">Ready to start?</h3>
                <p className="text-foreground/50 text-sm mb-4">
                  Get a detailed proposal with timeline and competitive pricing.
                </p>
                <Link
                  href="/start"
                  onClick={() => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: "cta_click", label: "contact_cta_card" }); }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-light rounded-full font-bold text-sm text-white hover:shadow-[0_0_25px_rgba(26,109,214,0.5)] hover:scale-[1.02] transition-all duration-300"
                >
                  Book a Call
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="card-glass rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">Send a Message</h2>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-brand-primary/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={32} className="text-brand-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">Message Sent!</h3>
                    <p className="text-foreground/50 text-sm mb-6">
                      We&apos;ll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-brand-primary text-sm hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="contact-name" className="text-foreground/40 text-sm mb-2 block">Name *</label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Your name or company"
                        className="w-full bg-white/50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:border-brand-primary/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="text-foreground/40 text-sm mb-2 block">Email *</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                        placeholder="you@company.com"
                        className="w-full bg-white/50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:border-brand-primary/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="text-foreground/40 text-sm mb-2 block">Subject</label>
                      <input
                        id="contact-subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
                        placeholder="What's this about?"
                        className="w-full bg-white/50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:border-brand-primary/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="text-foreground/40 text-sm mb-2 block">Message *</label>
                      <textarea
                        id="contact-message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                        placeholder="Tell us about your project, timeline, and requirements..."
                        className="w-full bg-white/50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:border-brand-primary/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all resize-none"
                      />
                    </div>

                    {error && (
                      <p role="alert" className="text-red-400 text-sm">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-brand-primary to-brand-light rounded-full font-bold text-sm text-white hover:shadow-[0_0_25px_rgba(26,109,214,0.5)] transition-all duration-300 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin">⟳</span>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send size={14} />
                        </>
                      )}
                    </button>

                    <p className="text-foreground/25 text-xs text-center">
                      We typically respond within 24 hours. For urgent matters, call us directly.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
