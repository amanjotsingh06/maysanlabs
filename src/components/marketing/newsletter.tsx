"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubscribed(true);
        setEmail("");
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "newsletter_signup" });
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 border-t border-white/5">
      <div className="container-main">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-6">
            <Mail size={28} className="text-brand-primary" />
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
            Stay Updated with Our Insights
          </h2>
          <p className="text-foreground/50 mb-8">
            Get the latest on enterprise software development, cloud architecture, and engineering best practices delivered to your inbox.
          </p>

          {subscribed ? (
            <div
              className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 flex items-center gap-4 animate-fade-in"
            >
              <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
              <div className="text-left">
                <p className="text-foreground font-semibold">Thanks for subscribing!</p>
                <p className="text-foreground/50 text-sm">Check your email for confirmation.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email for newsletter"
                className="flex-1 px-5 py-3.5 bg-white/[0.03] border border-white/10 rounded-full text-foreground placeholder:text-foreground/30 focus:border-brand-primary/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3.5 bg-brand-primary rounded-full font-semibold text-sm text-black hover:shadow-[0_0_25px_rgba(26,109,214,0.5)] transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? "Subscribing..." : "Subscribe"}
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {error && (
            <p role="alert" aria-live="polite" className="text-red-400 text-sm mt-3">{error}</p>
          )}

          <p className="text-foreground/30 text-xs mt-4">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
}
