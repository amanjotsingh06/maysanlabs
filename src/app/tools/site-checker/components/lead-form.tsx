"use client";

import { motion } from "framer-motion";
import { Sparkles, Download, CheckCircle } from "lucide-react";

interface LeadFormProps {
  leadCaptured: boolean;
  showLeadForm: boolean;
  setShowLeadForm: (v: boolean) => void;
  email: string;
  setEmail: (v: string) => void;
  company: string;
  setCompany: (v: string) => void;
  leadSubmitting: boolean;
  handleLeadSubmit: (e: React.FormEvent) => void;
  leadError: string | null;
}

export function LeadForm({ leadCaptured, showLeadForm, setShowLeadForm, email, setEmail, company, setCompany, leadSubmitting, handleLeadSubmit, leadError }: LeadFormProps) {
  if (leadCaptured) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-6 card-glass rounded-3xl text-center">
        <CheckCircle className="text-[#10b981] mx-auto mb-3" size={24} />
        <h4 className="text-sm font-bold text-foreground">SEO Audit PDF Dispatched!</h4>
        <p className="text-xs text-foreground/45 mt-1 max-w-sm mx-auto font-light">
          We have dispatched your custom technical audit blueprint to {email}. Please review your inbox folder shortly.
        </p>
      </motion.div>
    );
  }

  if (!showLeadForm) {
    return (
      <div className="text-center pt-4">
        <button onClick={() => setShowLeadForm(true)} className="px-8 py-4 bg-gradient-to-r from-brand-primary to-[#00d2ff] hover:shadow-[0_0_35px_rgba(26,109,214,0.4)] shadow-[0_0_15px_rgba(26,109,214,0.2)] rounded-full font-bold text-sm tracking-widest text-white transition-all duration-300 hover:scale-[1.02] inline-flex items-center gap-2 uppercase">
          <Download size={14} />
          Export Full Audit Report
        </button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-tr from-brand-primary/10 to-[#14b8a6]/10 border border-white/[0.08] rounded-3xl p-6 md:p-8 backdrop-blur-xl relative text-left">
      <div className="absolute top-3 right-4">
        <button type="button" onClick={() => setShowLeadForm(false)} className="text-foreground/45 hover:text-foreground text-xs font-mono">Dismiss</button>
      </div>
      <div className="max-w-xl">
        <h2 className="text-base font-bold text-foreground mb-1.5 flex items-center gap-2">
          <Sparkles size={16} className="text-[#00d2ff]" />
          Download Premium SEO Audit Blueprint
        </h2>
        <p className="text-xs text-foreground/50 mb-5 leading-relaxed font-light">
          Get a detailed custom PDF outlining a complete diagnostic strategy for your domain, optimized for Indian network scaling and DPDP legislation.
        </p>
        <form onSubmit={handleLeadSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input type="email" required aria-label="Email address" placeholder="Business Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/80 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl px-4 py-3 text-xs text-foreground placeholder:text-foreground/40 focus:border-brand-primary/50 focus:outline-none focus:ring-1 focus:ring-brand-primary/20" />
          </div>
          <div className="flex-1">
            <input type="text" required aria-label="Company name" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full bg-white/80 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl px-4 py-3 text-xs text-foreground placeholder:text-foreground/40 focus:border-brand-primary/50 focus:outline-none focus:ring-1 focus:ring-brand-primary/20" />
          </div>
          <button type="submit" disabled={leadSubmitting} className="px-5 py-3 bg-brand-primary hover:bg-brand-primary/90 transition-all font-bold text-xs uppercase tracking-wider text-white rounded-xl disabled:opacity-50 shrink-0">
            {leadSubmitting ? "Generating..." : "Get PDF Blueprint"}
          </button>
        </form>
        {leadError && <p className="text-red-400 text-[10px] mt-2 font-mono">{leadError}</p>}
      </div>
    </motion.div>
  );
}
