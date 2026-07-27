"use client";

import { useEffect } from "react";
import { RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center px-4 py-32">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-6">
          <RefreshCw size={28} className="text-brand-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Something went wrong
        </h1>
        <p className="text-foreground/60 text-sm mb-8">
          We couldn&apos;t load this author&apos;s page. Usually this is temporary.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary rounded-full font-semibold text-sm text-black hover:shadow-[0_0_30px_rgba(26,109,214,0.5)] transition-all"
          >
            <RefreshCw size={16} />
            Try again
          </button>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/10 text-foreground/70 font-semibold text-sm hover:bg-white/5 hover:text-foreground transition-all"
          >
            <ArrowLeft size={16} />
            Back to blog
          </Link>
        </div>
      </div>
    </div>
  );
}
