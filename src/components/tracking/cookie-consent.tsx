"use client";

import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";

declare global {
  interface Window {
    __cookieConsent?: "accepted" | "declined" | null;
  }
}

const STORAGE_KEY = "cookie-consent";

export function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  return window.__cookieConsent === "accepted";
}

export function getStoredConsent(): "accepted" | "declined" | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "accepted" || stored === "declined") return stored;
  return null;
}

export default function CookieConsent() {
  const [consent, setConsent] = useState<"accepted" | "declined" | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    const raf = requestAnimationFrame(() => {
      setConsent(stored);
      window.__cookieConsent = stored ?? null;
      setMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    window.__cookieConsent = "accepted";
    setConsent("accepted");
    window.dispatchEvent(new CustomEvent("cookieConsentChanged"));
  };

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    window.__cookieConsent = "declined";
    setConsent("declined");
    window.dispatchEvent(new CustomEvent("cookieConsentChanged"));
  };

  if (!mounted || consent !== null) return null;

  return (
    <div
      role="region"
      aria-label="Cookie preferences"
      className="fixed bottom-4 left-0 right-0 z-[200] flex justify-center animate-fade-in-up md:bottom-6"
    >
      <div className="w-[calc(100%-2rem)] max-w-lg">
        <div className="glass-strong rounded-2xl p-4 shadow-2xl shadow-black/30 sm:p-5">
          <div className="mb-3 flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
              <Cookie size={16} />
            </div>
            <p className="text-xs leading-relaxed text-foreground/80 sm:text-sm">
              We use cookies to improve your experience. By continuing, you
              agree to our use of cookies.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleAccept}
              className="flex-1 rounded-full bg-brand-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-all duration-200 hover:shadow-glow-sm hover:brightness-110 focus-ring active:scale-[0.97]"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={handleDecline}
              className="flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-foreground/80 transition-all duration-200 hover:bg-white/15 focus-ring active:scale-[0.97]"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
