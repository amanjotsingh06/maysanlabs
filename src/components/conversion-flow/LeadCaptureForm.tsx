"use client";

import { useState } from "react";
import { Loader2, Download, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { submitLead } from "@/app/actions/submitLead";
import { buildLeadPayload } from "@/lib/lead/payloadBuilder";

export interface LeadCaptureFormProps {
  toolName: string;
  pagePath: string;
  resultData: Record<string, unknown>;
  onLeadSubmitted?: (leadId?: string) => void;
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
}

export default function LeadCaptureForm({
  toolName,
  pagePath,
  resultData,
  onLeadSubmitted,
  buttonLabel = "Unlock Detailed Breakdown",
  buttonIcon = <Download size={14} />,
}: LeadCaptureFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !company || !name) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = buildLeadPayload({
        name,
        email,
        companyName: company,
        tool: toolName,
        page: pagePath,
        result: resultData,
      });

      const res = await submitLead(payload);

      if (res.success) {
        setIsSubmitted(true);
        onLeadSubmitted?.(res.leadId);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-green-400" />
        </div>
        <h4 className="text-lg font-bold text-foreground mb-2">Request Submitted Successfully!</h4>
        <p className="text-xs text-foreground/50 leading-relaxed mb-6">
          Our engineering team has received your details. We will reach out shortly to schedule your free discovery call.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="user-name" className="text-xs font-semibold text-foreground/70 mb-1.5 block">Full Name *</label>
          <input
            id="user-name"
            type="text"
            required
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-all"
          />
        </div>
        <div>
          <label htmlFor="user-email" className="text-xs font-semibold text-foreground/70 mb-1.5 block">Work Email *</label>
          <input
            id="user-email"
            type="email"
            required
            placeholder="jane@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-all"
          />
        </div>
        <div>
          <label htmlFor="user-company" className="text-xs font-semibold text-foreground/70 mb-1.5 block">Company Name *</label>
          <input
            id="user-company"
            type="text"
            required
            placeholder="Acme Corp"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full bg-white/50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-all"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-brand-primary text-black rounded-xl font-bold uppercase text-[10px] sm:text-xs md:text-sm tracking-wider transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(26,109,214,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              {buttonIcon}
              {buttonLabel}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
