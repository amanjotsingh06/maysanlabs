"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

export function ActionItemCard({ suggestion }: { suggestion: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const s = suggestion.toLowerCase();

  const isLcp = s.includes("lcp") || s.includes("largest contentful") || s.includes("hero image");
  const isCls = s.includes("cls") || s.includes("layout shift") || s.includes("dimension") || s.includes("width");
  const isSchema = s.includes("schema") || s.includes("json-ld") || s.includes("microdata");
  const isSitemap = s.includes("sitemap");
  const isAlt = s.includes("alt text") || s.includes("alt tag");

  let codeTemplate = "";
  if (isLcp) {
    codeTemplate = `// Optimized Above-the-Fold Image handling in Next.js (app/Hero.tsx)
import Image from 'next/image';

export function HeroImage() {
  return (
    <div className="relative w-full h-[400px]">
      <Image
        src="/hero-banner.webp"
        alt="Core Branding Banner"
        fill
        priority
        fetchPriority="high"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
        className="object-cover"
      />
    </div>
  );
}`;
  } else if (isCls) {
    codeTemplate = `<!-- 1. Always specify explicit dimensions to prevent shifts -->
<img src="/banner.png" width="800" height="400" alt="Promotional Banner" class="w-full h-auto" />

<!-- 2. Reserve spaces in CSS layout grids using aspect ratio -->
<div class="aspect-[21/9] bg-slate-900 w-full">
  <div class="dynamic-loaded-ad-container"></div>
</div>`;
  } else if (isSchema) {
    codeTemplate = `// Add Structured JSON-LD microdata inside Next.js (app/page.tsx)
export default function Page() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Maysan Labs",
    "url": "https://maysanlabs.com"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <main>...</main>
    </>
  );
}`;
  } else if (isSitemap) {
    codeTemplate = `// Static sitemap.ts generation in Next.js App Router (app/sitemap.ts)
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://maysanlabs.com', lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
    { url: 'https://maysanlabs.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ];
}`;
  } else if (isAlt) {
    codeTemplate = `// 1. Ensure descriptive alt tags
<Image src="/platform.png" alt="Analytics Dashboard Graph Screen" />
// 2. Decorative elements: empty string for screen readers
<Image src="/glow.png" alt="" aria-hidden="true" />`;
  }

  return (
    <div className="bg-[#03050d]/40 border border-white/[0.04] rounded-xl overflow-hidden hover:border-white/10 transition-colors">
      <button type="button" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} className="p-4 flex items-center justify-between cursor-pointer select-none w-full">
        <div className="flex items-start gap-3 min-w-0 pr-4">
          <span className="mt-0.5 shrink-0 text-[#10b981]">
            <CheckCircle size={14} className="text-brand-primary" />
          </span>
          <span className="text-xs text-foreground/80 font-medium text-left leading-relaxed">{suggestion}</span>
        </div>
        <div className="shrink-0 text-foreground/45">
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
        </button>

      <AnimatePresence>
        {isOpen && codeTemplate && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden bg-[#03050d] border-t border-white/5">
            <div className="p-4 space-y-3 font-mono text-[9px] text-left">
              <span className="text-[10px] font-bold text-[#14b8a6] tracking-wider block font-sans uppercase">Code Recommendation Fix</span>
              <pre className="p-3 bg-black/45 border border-white/5 rounded-lg overflow-x-auto text-cyan-400/90 select-all whitespace-pre leading-relaxed">
                {codeTemplate}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


