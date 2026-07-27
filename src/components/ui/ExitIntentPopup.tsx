"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight, CheckCircle2, Download, Mail, X } from "lucide-react";

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const alreadyShown = useRef(false);

  const closePopup = useCallback(() => setIsVisible(false), []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("exitIntentShown");
      if (saved) {
        alreadyShown.current = true;
        return;
      }
    } catch {}

    const handleExitIntent = (event: MouseEvent) => {
      if (event.clientY <= 0 && !alreadyShown.current) {
        setIsVisible(true);
        alreadyShown.current = true;
        localStorage.setItem("exitIntentShown", "true");
      }
    };

    document.addEventListener("mouseleave", handleExitIntent);
    return () => document.removeEventListener("mouseleave", handleExitIntent);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePopup();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, closePopup]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError("");
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit-intent" }),
      });
    } catch {
      // The popup should never block browsing if the newsletter endpoint fails.
    }
    setSubmitted(true);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "exit_intent_signup" });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-8">
      <button
        type="button"
        tabIndex={-1}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closePopup}
        aria-label="Close popup"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Enterprise SaaS scaling checklist signup"
        className="pointer-events-auto relative w-full max-w-[500px] animate-fade-in-up"
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--bg-dark)] p-6 shadow-2xl">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closePopup}
            aria-label="Close popup"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-foreground/40 transition-all hover:bg-white/10 hover:text-foreground focus-ring"
          >
            <X size={16} />
          </button>

          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-brand-primary via-[#60A5FA] to-brand-primary" />

          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary/20">
              <Download size={16} className="text-brand-primary" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
              Free Resource
            </span>
          </div>

          {!submitted ? (
            <>
              <h3 className="mb-2 text-2xl font-bold text-foreground">
                The 2026 Enterprise SaaS Scaling Checklist
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-foreground/50">
                How to architect for your first 100k users, including database sharding, edge caching, multi-tenancy, and more.
              </p>

              <ul className="mb-6 space-y-2.5">
                {[
                  "Database sharding & read replica strategy",
                  "Edge caching for sub-50ms global latency",
                  "Multi-tenant isolation patterns",
                  "CI/CD pipeline for zero-downtime deploys",
                  "Cost forecasting at every scale tier",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/60">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand-primary" />
                    {item}
                  </li>
                ))}
              </ul>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setEmailError("");
                    }}
                    placeholder="Enter your email"
                    aria-label="Email for SaaS scaling checklist"
                    aria-describedby={emailError ? "exit-intent-email-error" : undefined}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-foreground/30 transition-all focus:border-brand-primary/40 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                  />
                </div>
                {emailError && (
                  <p id="exit-intent-email-error" role="alert" className="text-xs text-red-400">
                    {emailError}
                  </p>
                )}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-primary to-[#1565d4] py-3.5 text-sm font-bold text-white transition-all hover:shadow-[0_0_30px_rgba(26,109,214,0.45)] focus-ring"
                >
                  Send Me the Checklist
                  <ArrowRight size={16} />
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-foreground/30">
                No spam. Unsubscribe anytime.
              </p>
            </>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/20">
                <CheckCircle2 size={28} className="text-brand-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">Checklist Sent!</h3>
              <p className="mb-6 text-sm text-foreground/50">
                Check your inbox for <strong className="text-foreground/70">{email}</strong>. The 2026 SaaS Scaling Checklist is on its way.
              </p>
              <button
                type="button"
                onClick={closePopup}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-foreground/60 transition-all hover:text-foreground focus-ring"
              >
                Continue browsing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
