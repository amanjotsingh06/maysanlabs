"use client";

import { useState } from "react";
import { ListCollapse, CheckCircle, AlertTriangle, XCircle, Code, Shield, Globe } from "lucide-react";

export function HeadingsHierarchyMap({ h1Count, h2Count, title }: { h1Count: number; h2Count: number; title: string }) {
  const issues = [];
  if (h1Count === 0) issues.push("Missing <h1> element! Every page must have exactly one root heading.");
  if (h1Count > 1) issues.push(`Found ${h1Count} <h1> elements! Multiple H1s dilute SEO weight.`);

  return (
    <div className="bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 mb-6">
      <div className="mb-5 border-b border-white/5 pb-4 text-left">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <ListCollapse size={16} className="text-[#10b981]" />
          Visual Heading Node Hierarchy
        </h3>
        <p className="text-xs text-foreground/40">Audit semantic title nesting mapped for optimal indexing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-7 bg-black/30 border border-white/[0.03] rounded-xl p-5 min-h-[220px] flex flex-col justify-center text-left">
          <div className="space-y-4 relative pl-4 border-l border-white/10">
            <div className="relative">
              <span className="absolute -left-[21px] top-1/2 -translate-y-1/2 w-4 h-px bg-white/20" />
              <div className={`p-3 rounded-lg border flex items-center gap-2 text-xs font-semibold ${h1Count === 1 ? "bg-[#10b981]/5 border-[#10b981]/25 text-[#10b981]" : "bg-amber-400/5 border-amber-400/25 text-amber-400"}`}>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/40">H1</span>
                <span className="truncate max-w-[280px]">{title || "Missing Title Node"}</span>
                {h1Count !== 1 && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping ml-auto" />}
              </div>
            </div>

            <div className="pl-6 space-y-3 relative">
              <span className="absolute -left-[9px] top-0 bottom-4 w-px bg-white/10" />
              {Array.from({ length: Math.min(3, h2Count || 1) }).map((_, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-3.5 h-px bg-white/10" />
                  <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.01] flex items-center gap-2 text-[11px] text-foreground/70">
                    <span className="font-mono text-[8px] px-1 py-0.5 rounded bg-black/20 text-foreground/40">H2</span>
                    <span className="font-medium">Audited Sitemap Page Module #{idx + 1}</span>
                  </div>
                </div>
              ))}
              {h2Count > 3 && <div className="text-[10px] text-foreground/30 pl-4 font-mono">+ {h2Count - 3} more structural subheadings</div>}
            </div>
          </div>
        </div>

        <div className="md:col-span-5 space-y-4 text-left">
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
            <span className="text-[9px] text-[#10b981] font-bold uppercase tracking-wider block mb-1">Heading Telemetry</span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                    <span className="text-xs text-foreground/40 font-medium">H1 Tags</span>
                <p className={`text-xl font-bold font-mono ${h1Count === 1 ? "text-[#10b981]" : "text-amber-400"}`}>{h1Count}</p>
              </div>
              <div>
                <span className="text-xs text-foreground/40 font-medium">H2 Tags</span>
                <p className="text-xl font-bold font-mono text-[#14b8a6]">{h2Count}</p>
              </div>
            </div>
          </div>

          {issues.length > 0 ? (
            <div className="p-3 bg-amber-400/5 border border-amber-400/20 rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1"><AlertTriangle size={12} /> Core Violations</span>
              <ul className="space-y-1 text-[11px] text-amber-400/80 pl-1 list-disc list-inside">
                {issues.map((iss, i) => <li key={i}>{iss}</li>)}
              </ul>
            </div>
          ) : (
            <div className="p-3 bg-[#10b981]/5 border border-[#10b981]/20 rounded-xl">
              <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wide flex items-center gap-1"><CheckCircle size={12} /> Layout Perfect</span>
              <p className="text-[11px] text-[#10b981]/80 mt-1 leading-relaxed">Heading structure is perfectly nested. Standard HTML crawler protocols are verified.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SchemaMarkupGraph({ hasSchema }: { hasSchema: boolean }) {
  const [activeSchema, setActiveSchema] = useState<string | null>("Organization");
  const schemaMockups: Record<string, string> = {
    Organization: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Maysan Labs",
  "url": "https://maysanlabs.com",
  "logo": "https://maysanlabs.com/logo-rounded-v2.webp",
  "sameAs": ["https://www.linkedin.com/company/maysanlabs"]
}`,
    WebSite: `{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Maysan Labs",
  "url": "https://maysanlabs.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://maysanlabs.com/tools/site-checker?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}`
  };

  return (
    <div className="bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 mb-6">
      <div className="mb-5 border-b border-white/5 pb-4 text-left">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Code size={16} className="text-[#14b8a6]" />
          JSON-LD Schema Markup Object Graph
        </h3>
        <p className="text-xs text-foreground/40">Inspect metadata structures exposed for Google Rich Snippets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-6 bg-black/30 border border-white/[0.03] rounded-xl p-5 min-h-[240px] flex flex-col justify-center">
          {hasSchema ? (
            <div className="flex flex-col items-center gap-6 relative">
              <span className="absolute top-6 bottom-6 w-px bg-white/10 z-0" />
              <button type="button" onClick={() => setActiveSchema("WebSite")}
                className={`px-4 py-2.5 rounded-lg border z-10 cursor-pointer transition-all duration-300 font-mono text-[11px] ${activeSchema === "WebSite" ? "bg-brand-primary/10 border-brand-primary/30 text-[#1a73e8]" : "bg-white/[0.02] border-white/5 text-foreground/50 hover:border-white/20"}`}>
                WebSite Schema
              </button>
              <button type="button" onClick={() => setActiveSchema("Organization")}
                className={`px-4 py-2.5 rounded-lg border z-10 cursor-pointer transition-all duration-300 font-mono text-[11px] ${activeSchema === "Organization" ? "bg-[#14b8a6]/10 border-[#14b8a6]/30 text-[#14b8a6]" : "bg-white/[0.02] border-white/5 text-foreground/50 hover:border-white/20"}`}>
                Organization Schema
              </button>
            </div>
          ) : (
            <div className="text-center p-6 space-y-2">
              <XCircle className="text-red-400 mx-auto" size={24} />
              <p className="text-xs text-foreground/70 font-semibold">No Schemas Located</p>
              <p className="text-[10px] text-foreground/40 leading-relaxed">This page is not exposing schema microdata. Inject JSON-LD to rank higher on rich-feature searches.</p>
            </div>
          )}
        </div>

        <div className="md:col-span-6 text-left">
          <div className="bg-[#03050d] border border-white/10 rounded-xl overflow-hidden font-mono text-[10px] text-foreground/80 flex flex-col h-[240px] shadow-2xl">
            <div className="px-3 py-2 bg-white/5 border-b border-white/8 flex items-center justify-between text-[9px] text-white/40">
              <span>json-ld-telemetry-console.json</span>
              <span className="text-[#14b8a6] animate-pulse">● Live Stream</span>
            </div>
            <div className="flex-1 p-4 overflow-auto text-left leading-normal whitespace-pre text-cyan-400/90 selection:bg-white/10">
              {hasSchema && activeSchema ? schemaMockups[activeSchema] : `{\n  "error": "No Schema microdata detected"\n}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CrawlerRadar({ hasViewport, hasHtmlLang, https, isNoindex }: { hasViewport: boolean; hasHtmlLang: boolean; https: boolean; isNoindex: boolean }) {
  const checks = [
    { label: "SSL Encryption", value: https, desc: "Secure connections prevent packet tampering." },
    { label: "Mobile Viewport Node", value: hasViewport, desc: "Controls layout sizing on modern devices." },
    { label: "Html Lang Tag", value: hasHtmlLang, desc: "Identifies system languages for indexing." },
    { label: "Noindex Directives", value: !isNoindex, desc: "Confirms sitemaps expose searchable paths." },
  ];

  return (
    <div className="bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 mb-6">
      <div className="mb-5 border-b border-white/5 pb-4 text-left">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Shield size={16} className="text-brand-primary" />
          Crawler Indexability Radar
        </h3>
        <p className="text-xs text-foreground/40">Verify access controls and standards tags required for search visibility</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">
        <div className="md:col-span-5 flex justify-center">
          <div className="relative w-44 h-44 rounded-full border border-white/5 flex items-center justify-center bg-black/40 overflow-hidden shadow-inner select-none">
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_60%,rgba(26,109,214,0.12))] animate-spin-slow pointer-events-none rounded-full" />
            <div className="absolute w-32 h-32 rounded-full border border-white/5" />
            <div className="absolute w-20 h-20 rounded-full border border-white/5" />
            <div className="w-4 h-4 rounded-full bg-brand-primary shadow-[0_0_15px_#1A6DD6] animate-ping" />
            <div className="w-3.5 h-3.5 rounded-full bg-brand-primary absolute" />
          </div>
        </div>

        <div className="md:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {checks.map((c, idx) => (
              <div key={idx} className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 flex items-start gap-3 transition-colors hover:border-white/10">
                <div className="mt-0.5 shrink-0">
                  {c.value ? <CheckCircle size={14} className="text-[#10b981]" /> : <AlertTriangle size={14} className="text-amber-400 animate-pulse" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">{c.label}</h4>
                  <p className="text-[10px] text-foreground/45 mt-0.5 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function GoogleSearchPreview({ url, title, description }: { url: string; title: string; description: string }) {
  return (
    <div className="bg-slate-950/60 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
      <div className="mb-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Globe size={15} className="text-brand-primary" />
          Google Search Preview Snippet
        </h3>
        <p className="text-xs text-foreground/45">Examine how your primary page exposes title and description nodes to indexers</p>
      </div>
      <div className="bg-white dark:bg-[#0b0c10] border border-black/10 dark:border-white/5 rounded-xl p-4 font-sans text-left max-w-2xl shadow-inner">
        <div className="text-[11px] text-[#202124] dark:text-[#bdc1c6] mb-1.5 flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
          <Globe size={11} className="text-[#1a0dab] dark:text-[#8ab4f8]" />
          <span className="font-mono text-[9px] opacity-75">{url}</span>
        </div>
        <h4 className="text-[18px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-tight mb-1 font-medium font-sans">
          {title || "Missing Title Tag"}
        </h4>
        <p className="text-[12px] text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed font-sans font-light">
          {description || "Warning: No meta description tag was detected in our crawl checks! Add a unique, keyword-rich meta description element to control organic search snippet descriptions."}
        </p>
      </div>
    </div>
  );
}
