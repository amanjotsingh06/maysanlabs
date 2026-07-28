"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, Search, CheckCircle, AlertTriangle, 
  BarChart3, Gauge, Loader2, Smartphone, Monitor, Clock, 
  Share2, History, ChevronDown, ChevronUp, Zap, 
  FileText, Shield, ArrowLeft, ArrowRight, User, Check
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import ContactFooter from "@/components/layout/footer";
import { analyzeSitemap } from "@/app/actions/analyzeSitemap";
import type { SeoAuditResult } from "@/app/actions/analyzeSitemap";
import type { WebVitalResult } from "@/types/pagespeed";

import {
  ActionItemCard, RadarChart, SpeedSimulator, OverallScoreCircle, MetricBadge, MiniScoreCard,
  IndianMarketTelemetryHub, SecurityTab, SeoTabError, SeoTabContent,
  ScanRecord, perfSteps, seoSteps, metricInfo, HISTORY_KEY, MAX_HISTORY, loadHistory, getLabel,
} from "./components";
import { LeadCaptureCTA, ResultSummary } from "@/components/conversion-flow";

export default function SiteCheckerClient({ initialUrl }: { initialUrl?: string }) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [scanning, setScanning] = useState(false);

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [perfResults, setPerfResults] = useState<WebVitalResult | null>(null);
  const [seoResults, setSeoResults] = useState<SeoAuditResult | null>(null);
  const [perfStep, setPerfStep] = useState("");
  const [seoStep, setSeoStep] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDetailed, setShowDetailed] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [seoAuditError, setSeoAuditError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"performance" | "seo" | "india" | "security">("performance");
  const resultsRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const autoScanned = useRef(false);

  const validateUrl = (input: string): string | null => {
    if (!input.trim()) return "Please enter a URL";
    try {
      const urlObj = new URL(input.startsWith("http") ? input : `https://${input}`);
      if (!urlObj.hostname.includes(".")) return "Please enter a valid domain (e.g. example.com)";
      return null;
    } catch {
      return "Invalid URL format. Try: example.com";
    }
  };

  const startScan = useCallback(async () => {
    const error = validateUrl(url);
    setUrlError(error);
    if (error) return;

    setScanning(true);
    setScanError(null);
    setSeoAuditError(null);
    setPerfResults(null);
    setSeoResults(null);
    setShowLeadForm(false);
    setPerfStep(perfSteps[0]);
    setSeoStep("");

    const fullUrl = url.startsWith("http") ? url : `https://${url}`;

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    let perfStepIdx = 1;
    const perfInterval = setInterval(() => {
      if (perfStepIdx < perfSteps.length) {
        setPerfStep(perfSteps[perfStepIdx - 1]);
        perfStepIdx++;
      }
    }, 600);

    const perfController = new AbortController();
    const perfTimeoutId = setTimeout(() => perfController.abort(), 100000);
    signal.addEventListener("abort", () => {
      clearTimeout(perfTimeoutId);
      perfController.abort();
    }, { once: true });

    const perfPromise = fetch("/api/pagespeed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: fullUrl, strategy }),
      signal: perfController.signal,
    }).then(async (res) => {
      clearTimeout(perfTimeoutId);
      clearInterval(perfInterval);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "PageSpeed scan failed");
      }
      const result: WebVitalResult = await res.json();
      return result;
    }).catch((err) => {
      clearTimeout(perfTimeoutId);
      throw err;
    });

    let seoStepIdx = 1;
    const seoInterval = setInterval(() => {
      if (seoStepIdx <= seoSteps.length) {
        setSeoStep(seoSteps[seoStepIdx - 1]);
        seoStepIdx++;
      }
    }, 800);

    const seoPromise = analyzeSitemap(fullUrl).then((result) => {
      clearInterval(seoInterval);
      setSeoStep("SEO audit complete!");
      return result;
    }).catch((err) => {
      clearInterval(seoInterval);
      console.error("Sitemap audit failed:", err);
      return null;
    });

    try {
      const [perfSettled, seoSettled] = await Promise.allSettled([perfPromise, seoPromise]);

      clearInterval(perfInterval);
      clearInterval(seoInterval);

      let perfError: string | null = null;
      let perf: WebVitalResult | null = null;
      let seo: SeoAuditResult | null = null;

      if (perfSettled.status === "fulfilled") {
        perf = perfSettled.value;
        setPerfStep("PageSpeed report ready!");
        setPerfResults(perf);
      } else {
        perfError = perfSettled.reason instanceof Error ? perfSettled.reason.message : "Performance scan failed";
        console.error("[SiteChecker] Perf scan failed:", perfSettled.reason);
      }

      if (seoSettled.status === "fulfilled" && seoSettled.value) {
        seo = seoSettled.value;
        setSeoResults(seo);
        setSeoStep("SEO audit complete!");
      } else {
        const message = "SEO audit returned no data. The site may not have a sitemap or may be unreachable.";
        setSeoAuditError(message);
      }

      setTimeout(() => {
        setScanning(false);

        if (!perf && !seo) {
          setScanError(perfError || "Both scans failed. Please try again.");
          return;
        }

        const m = perf ? [perf.lcp, perf.inp, perf.cls, perf.ttfb] : [];
        const poor = m.filter((x) => x.grade === "poor").length;
        const needs = m.filter((x) => x.grade === "needs-work").length;
        const overall = poor > 0 ? "Poor" : needs > 0 ? "Needs Work" : "Good";

        const newRecord: ScanRecord = { url: fullUrl, strategy, timestamp: Date.now(), overall, perf: perf?.performance ?? 0, seoScore: seo?.seoScore ?? 0 };
        try { const raw = localStorage.getItem(HISTORY_KEY); const existing = raw ? JSON.parse(raw) : []; existing.unshift(newRecord); localStorage.setItem(HISTORY_KEY, JSON.stringify(existing.slice(0, MAX_HISTORY))); } catch { }
        setHistory(prev => [newRecord, ...prev].slice(0, MAX_HISTORY));

        setTimeout(() => {
          setShowLeadForm(true);
        }, 2000);

        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }, 400);
    } catch (err) {
      clearInterval(perfInterval);
      clearInterval(seoInterval);
      setScanError(err instanceof Error ? err.message : "Scan failed. Please verify target url indexation status and try again.");
      setScanning(false);
    }
  }, [url, strategy]);

  const startScanRef = useRef(startScan);
  startScanRef.current = startScan;

  useEffect(() => {
    setHistory(loadHistory());
    if (initialUrl && !autoScanned.current) {
      autoScanned.current = true;
      startScanRef.current();
    }
    return () => abortRef.current?.abort();
  }, [initialUrl]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    startScan();
  }, [startScan]);



  const metrics = perfResults ? [perfResults.lcp, perfResults.inp, perfResults.cls, perfResults.ttfb] : [];
  const poorCount = metrics.filter((m) => m.grade === "poor").length;
  const needsWorkCount = metrics.filter((m) => m.grade === "needs-work").length;
  const gradedCount = metrics.filter((m) => m.grade !== null).length;
  const overallGrade: string | null = gradedCount === 0 ? null : poorCount > 0 ? "poor" : needsWorkCount > 0 ? "needs-work" : "good";

  const combinedScore = perfResults
    ? Math.round(
        (perfResults.performance * 0.4 +
          perfResults.seo * 0.2 +
          (seoResults?.seoScore ?? 0) * 0.2 +
          (perfResults.accessibility ?? 75) * 0.1 +
          (perfResults.bestPractices ?? 70) * 0.1)
      )
    : 0;

  const copyResults = () => {
    if (!perfResults) return;
    const lines = [
      `SEO Report for ${perfResults.url} (${strategy})`,
      `Overall: ${getLabel(overallGrade)}`,
      `Performance: ${perfResults.performance}/100 | SEO: ${perfResults.seo}/100`,
      ``,
      `LCP: ${perfResults.lcp.value ?? "—"}s (${getLabel(perfResults.lcp.grade)})`,
      `INP: ${perfResults.inp.value ?? "—"}ms (${getLabel(perfResults.inp.grade)})`,
      `CLS: ${perfResults.cls.value ?? "—"} (${getLabel(perfResults.cls.grade)})`,
      `TTFB: ${perfResults.ttfb.value ?? "—"}s (${getLabel(perfResults.ttfb.grade)})`,
      ``,
      `Suggestions:`,
      ...perfResults.suggestions.map((s) => `  › ${s}`),
    ];
    if (seoResults) {
      lines.push(``, `SEO Audit:`, `  Score: ${seoResults.seoScore}/100`, `  Pages: ${seoResults.totalUrls}`, `  Missing Meta: ${seoResults.missingMeta}`, `  Broken Links: ${seoResults.brokenLinks}`, `  Schema Issues: ${seoResults.missingSchemas}`);
    }
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const scrollToSection = (tab: "performance" | "seo" | "india" | "security") => {
    setActiveSection(tab);
    setTimeout(() => {
      document.getElementById("tab-view-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
      
      <div className="relative z-10 flex-grow">
        <Navbar />
        
        <div className="pt-24 pb-16 px-4">
          <div className="container-main max-w-4xl mx-auto">
            
            <Link href="/tools" className="inline-flex items-center gap-1.5 text-[11px] text-foreground/40 hover:text-brand-primary mb-6 transition-colors">
              <ArrowLeft size={12} />
              Back to All Tools
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Speed <span className="text-brand-primary">Auditor</span>
              </h1>
              <p className="text-xs text-foreground/50 mt-2">
                Audit your website speed, Core Web Vitals, and technical SEO factors in real-time.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-6 mb-6 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
                  <input
                    type="text"
                    aria-label="Website URL"
                    placeholder="Enter website domain (e.g., example.com)"
                    value={url}
                    onChange={(e) => { setUrl(e.target.value); setUrlError(null); }}
                    disabled={scanning}
                    className="w-full bg-white/80 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-gray-400 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-sm disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={scanning}
                  className="bg-brand-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {scanning ? (
                    <><Loader2 size={16} className="animate-spin" /> Scanning...</>
                  ) : (
                    <><Search size={16} /> Run Health Audit</>
                  )}
                </button>
              </form>

              <div className="flex items-center justify-between flex-wrap gap-3 mt-4">
                <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-lg">
                  <button type="button" onClick={() => setStrategy("mobile")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${strategy === "mobile" ? "bg-brand-primary text-white" : "text-foreground/50 hover:text-foreground"}`}>
                    <Smartphone size={13} /> Mobile
                  </button>
                  <button type="button" onClick={() => setStrategy("desktop")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${strategy === "desktop" ? "bg-brand-primary text-white" : "text-foreground/50 hover:text-foreground"}`}>
                    <Monitor size={13} /> Desktop
                  </button>
                </div>
                
                {history.length > 0 && (
                  <button type="button" onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-1 text-xs text-foreground/50 hover:text-foreground transition-all">
                    <History size={13} /> History ({history.length})
                  </button>
                )}
              </div>

              {showHistory && history.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-white/80 dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.06] max-h-48 overflow-y-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-foreground/50">Scan history</span>
                    <button onClick={clearHistory} className="text-xs text-red-400/60 hover:text-red-400 transition-colors">Clear All</button>
                  </div>
                  {history.map((h, i) => (
                    <div key={i} className="flex items-center justify-between py-2 text-sm border-b border-gray-200/50 dark:border-white/[0.03] last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground/60 truncate max-w-[180px] max-sm:max-w-[120px]">{h.url.replace("https://", "")}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${h.overall === "Good" ? "bg-green-500/10 text-green-600" : h.overall === "Needs Work" ? "bg-amber-500/10 text-amber-600" : "bg-red-500/10 text-red-600"}`}>{h.overall}</span>
                      </div>
                      <button onClick={() => { setUrl(h.url); setStrategy(h.strategy as "mobile" | "desktop"); setShowHistory(false); }} className="text-brand-primary hover:underline font-medium">Re-scan</button>
                    </div>
                  ))}
                </motion.div>
              )}

              {urlError && <p className="text-red-400 text-sm mt-2">{urlError}</p>}
            </motion.div>

            {scanning && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-6 mb-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 size={18} className="text-brand-primary animate-spin" />
                  <span className="text-sm font-medium text-foreground/70">Running scan on <span className="text-brand-primary font-semibold">{url.startsWith("http") ? url : `https://${url}`}</span></span>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <Zap size={12} className="text-brand-primary" />
                      <span className="text-foreground/60">Performance & Core Web Vitals</span>
                      {perfStep === "PageSpeed report ready!" && <span className="text-green-500 text-xs ml-auto font-semibold">Done</span>}
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-white/[0.05] rounded-full overflow-hidden">
                      <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-1/2 h-full rounded-full bg-brand-primary" />
                    </div>
                    <p className="text-xs text-foreground/40 mt-1">{perfStep}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <FileText size={12} className="text-teal-500" />
                      <span className="text-foreground/60">SEO & Sitemap Audit</span>
                      {seoStep === "SEO audit complete!" && <span className="text-green-500 text-xs ml-auto font-semibold">Done</span>}
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-white/[0.05] rounded-full overflow-hidden">
                      <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-1/2 h-full rounded-full bg-teal-500" />
                    </div>
                    <p className="text-xs text-foreground/40 mt-1">{seoStep || "Waiting..."}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {scanError && !scanning && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/25 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-red-400 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Health Scan Failed</h3>
                    <p className="text-sm text-foreground/60 mt-1">{scanError}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {(perfResults || seoResults) && !scanning && (
                <motion.div ref={resultsRef} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Check size={11} className="text-green-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">Website Audit Completed</h4>
                        <p className="text-xs text-foreground/50">All diagnostic parameters resolved</p>
                      </div>
                    </div>
                    <span className="text-xs text-foreground/40">Just now</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-6 text-center backdrop-blur-sm">
                      <span className="text-xs text-foreground/50 uppercase tracking-wider font-semibold block mb-4">
                        Overall Website Score
                      </span>
                      
                      <div className="my-6">
                        <OverallScoreCircle score={combinedScore} />
                      </div>
                      
                      <p className="text-sm text-foreground/60 mb-6">
                        {combinedScore >= 80
                          ? "Your website is in excellent shape!"
                          : combinedScore >= 60
                          ? "Good, but there's room for improvement."
                          : "Critical issues affecting page experience."}
                      </p>

                      <div className="flex items-center gap-3 flex-wrap justify-center">
<button
                          onClick={() => scrollToSection("seo")}
                          className="bg-brand-primary text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-brand-primary/90 transition-colors flex items-center gap-2"
                        >
                          View All Issues
                          <ArrowRight size={14} />
                        </button>
                        <button onClick={copyResults} className="bg-white/80 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 text-foreground px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors flex items-center gap-2">
                          {copied ? <><CheckCircle size={14} className="text-green-500" /> Copied</> : <><Share2 size={14} /> Share Report</>}
                        </button>
                        {perfResults && (
                          <button
                            onClick={() => setShowLeadForm(true)}
                            className="bg-white/80 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 text-foreground px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors flex items-center gap-2"
                          >
                            <FileText size={14} /> Download PDF Report
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="bg-white/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-6 text-center backdrop-blur-sm">
                      <span className="text-xs text-foreground/50 uppercase tracking-wider font-semibold block mb-4">
                        Performance Radar
                      </span>
                      <RadarChart 
                        scores={{
                          perf: perfResults?.performance ?? 50,
                          seo: seoResults?.seoScore ?? 50,
                          sec: seoResults?.security?.score ?? 50,
                          mob: perfResults?.mobile ?? 50,
                          ux: perfResults?.bestPractices ?? 50
                        }} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <MiniScoreCard title="Performance" score={perfResults?.performance ?? 0} status={perfResults && perfResults.performance >= 75 ? "Good" : "Needs Work"} icon={Zap} colorClass="text-brand-primary" />
                    <MiniScoreCard title="SEO Check" score={seoResults?.seoScore ?? 0} status={seoResults && seoResults.seoScore >= 80 ? "Good" : "Needs Work"} icon={Search} colorClass="text-teal-500" />
                    <MiniScoreCard title="Security" score={seoResults?.security?.score ?? 0} status={seoResults?.security && seoResults.security.score >= 80 ? "Good" : "Needs Work"} icon={Shield} colorClass="text-brand-primary" />
                    <MiniScoreCard title="Mobile" score={perfResults?.mobile ?? 0} status={perfResults && perfResults.mobile >= 75 ? "Good" : "Needs Work"} icon={Smartphone} colorClass="text-green-500" />
                    <MiniScoreCard title="UX Index" score={perfResults?.accessibility ?? 75} status={(perfResults?.accessibility ?? 75) >= 80 ? "Good" : "Needs Work"} icon={User} colorClass="text-amber-500" />
                  </div>

                  <div id="tab-view-section" className="flex items-center gap-2 flex-wrap p-1 bg-white/80 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] rounded-xl w-fit mx-auto backdrop-blur-xl pt-12">
                    <button onClick={() => setActiveSection("performance")} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSection === "performance" ? "bg-brand-primary text-white" : "text-foreground/50 hover:text-foreground"}`}>
                      <Zap size={13} /> Performance
                    </button>
                    <button onClick={() => setActiveSection("seo")} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSection === "seo" ? "bg-brand-primary text-white" : "text-foreground/50 hover:text-foreground"}`}>
                      <FileText size={13} /> SEO & Sitemap
                    </button>
                    <button onClick={() => setActiveSection("india")} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSection === "india" ? "bg-brand-primary text-white" : "text-foreground/50 hover:text-foreground"}`}>
                      India
                    </button>
                    <button onClick={() => setActiveSection("security")} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSection === "security" ? "bg-brand-primary text-white" : "text-foreground/50 hover:text-foreground"}`}>
                      <Shield size={13} /> Security
                    </button>
                  </div>

                  {perfResults && activeSection === "performance" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
                      <div className="bg-white/[0.03] border-white/[0.08] rounded-3xl p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                          <div>
                            <h2 className="text-base font-bold text-foreground">Measured Speed Vitals</h2>
                            <p className="text-xs text-foreground/45">GPU paint schedules and main thread delay checks</p>
                          </div>
                          <span className={`px-3 py-1 border rounded-full text-xs font-bold font-mono ${overallGrade === "good" ? "bg-green-500/10 dark:bg-[#10b981]/5 border-green-500/20 dark:border-[#10b981]/20 text-green-600 dark:text-[#10b981]" : overallGrade === "needs-work" ? "bg-amber-500/10 dark:bg-amber-400/5 border-amber-500/20 dark:border-amber-400/20 text-amber-600 dark:text-amber-400" : "bg-red-500/10 dark:bg-red-400/5 border-red-500/20 dark:border-red-400/20 text-red-600 dark:text-red-400"}`}>
                            {getLabel(overallGrade).toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                          <MetricBadge label="LCP" value={perfResults.lcp.value !== null ? `${perfResults.lcp.value.toFixed(1)}s` : null} grade={perfResults.lcp.grade} info={metricInfo.LCP} />
                          <MetricBadge label="INP" value={perfResults.inp.value !== null ? `${perfResults.inp.value}ms` : null} grade={perfResults.inp.grade} info={metricInfo.INP} />
                          <MetricBadge label="CLS" value={perfResults.cls.value !== null ? perfResults.cls.value.toFixed(2) : null} grade={perfResults.cls.grade} info={metricInfo.CLS} />
                          <MetricBadge label="TTFB" value={perfResults.ttfb.value !== null ? `${perfResults.ttfb.value.toFixed(1)}s` : null} grade={perfResults.ttfb.grade} info={metricInfo.TTFB} />
                        </div>

                        <div className="border-t border-white/5 pt-4">
                          <button type="button" onClick={() => setShowDetailed(!showDetailed)} className="flex items-center gap-1.5 text-xs text-foreground/40 hover:text-foreground/75 transition-all">
                            <Clock size={12} /> {showDetailed ? "Hide" : "Show"} Detailed Lighthouse metrics {showDetailed ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                          </button>
                          
                          <AnimatePresence>
                            {showDetailed && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                                  <MetricBadge label="FCP" value={perfResults.fcp.value !== null ? `${perfResults.fcp.value.toFixed(1)}s` : null} grade={perfResults.fcp.grade} info={metricInfo.FCP} />
                                  <MetricBadge label="TBT" value={perfResults.tbt.value !== null ? `${perfResults.tbt.value}ms` : null} grade={perfResults.tbt.grade} info={metricInfo.TBT} />
                                  <MetricBadge label="Speed Index" value={perfResults.si.value !== null ? `${perfResults.si.value.toFixed(1)}s` : null} grade={perfResults.si.grade} info={metricInfo.SI} />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <SpeedSimulator lcp={perfResults.lcp.value ?? 4} fcp={perfResults.fcp.value ?? 2} ttfb={perfResults.ttfb.value ?? 0.8} />

                      <div className="bg-white/[0.03] border-white/[0.08] rounded-3xl p-6 md:p-8">
                        <div className="mb-4">
                          <h2 className="text-base font-bold text-foreground">Prioritized Action Items</h2>
                          <p className="text-xs text-foreground/45">Resolve these metrics to accelerate page load thresholds</p>
                        </div>
                        <div className="space-y-3">
                          {perfResults.suggestions.map((s, i) => (
                            <ActionItemCard key={i} suggestion={s} />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {seoAuditError && !seoResults && activeSection === "seo" && (
                    <SeoTabError error={seoAuditError} />
                  )}
                  {seoResults && activeSection === "seo" && (
                    <SeoTabContent seoResults={seoResults} />
                  )}

                  {seoResults?.indiaTelemetry && activeSection === "india" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                      <IndianMarketTelemetryHub telemetry={seoResults.indiaTelemetry} />
                      
                      <div className="bg-white/[0.03] border-white/[0.08] rounded-3xl p-6 md:p-8 text-left">
                        <h4 className="text-sm font-bold text-foreground mb-4">India Compliance & Checkout Best Practices</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-foreground/75 leading-relaxed font-light">
                          <div className="space-y-3 p-4 bg-white/[0.02] border-white/[0.06] rounded-xl">
                            <h5 className="font-bold text-[#14b8a6] flex items-center gap-1.5">
                              <Zap size={13} />
                              Indian Core Web Vitals
                            </h5>
                            <ul className="space-y-2 list-disc list-inside pl-1 text-[11px]">
                              <li>Jio 4G/5G mobile latencies: Ensure all image assets use WebP or AVIF compressions.</li>
                              <li>AWS ap-south-1 Edge locations: Enable a Cloudflare caching proxy to deliver static resources locally from Mumbai or Bangalore PoPs.</li>
                              <li>Main Thread Block Reduction: Heavy JS bundles delay paints on lower-end Android handsets common in rural India.</li>
                            </ul>
                          </div>

                          <div className="space-y-3 p-4 bg-white/[0.02] border-white/[0.06] rounded-xl">
                            <h5 className="font-bold text-amber-400 flex items-center gap-1.5">
                              <Shield size={13} />
                              DPDP Act (2023) Guidance
                            </h5>
                            <ul className="space-y-2 list-disc list-inside pl-1 text-[11px]">
                              <li>Indian Consent Mandates: The DPDP Act requires unambiguous explicit consent.</li>
                              <li>Localized Languages: Indian compliance encourages displaying data usage in local languages.</li>
                              <li>User Data Deletion APIs: Build account features for quick data disposal requests.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {seoResults?.security && activeSection === "security" && (
                    <SecurityTab security={seoResults.security} />
                  )}

                  {showLeadForm && (
                    <div className="mt-8 space-y-6">
                      <ResultSummary 
                        title="Audit Summary"
                        metrics={[
                          { label: "Overall Combined Score", value: `${combinedScore}/100` },
                          { label: "Performance", value: perfResults?.performance ?? "N/A" },
                          { label: "SEO Score", value: seoResults?.seoScore ?? perfResults?.seo ?? "N/A" },
                          { label: "Accessibility", value: perfResults?.accessibility ?? "N/A" },
                          { label: "Action Items", value: perfResults?.suggestions.length ?? 0 }
                        ]}
                      />
                      
                      <LeadCaptureCTA
                        title="Get Your Full Audit Report & Next Steps"
                        description="Want our engineering team to review these findings and create a custom performance optimization plan for your business? Book a free discovery call."
                        buttonLabel="Book Free Discovery Call"
                        toolName="Website Checker"
                        pagePath="/tools/site-checker"
                        resultData={{
                          url: url,
                          overallScore: combinedScore,
                          performance: perfResults?.performance,
                          seoScore: seoResults?.seoScore,
                          actionItems: perfResults?.suggestions.length
                        }}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {!scanning && !perfResults && !seoResults && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="card-glass rounded-3xl p-6 text-center card-hover">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-3.5"><Gauge size={18} className="text-brand-primary" /></div>
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Core Web Vitals</h3>
                    <p className="text-[10px] text-foreground/45 leading-relaxed font-light">Interactive speeds including LCP, INP, CLS, and latency checks.</p>
                  </div>
                  <div className="card-glass rounded-3xl p-6 text-center card-hover">
                    <div className="w-10 h-10 rounded-xl bg-[#14b8a6]/10 flex items-center justify-center mx-auto mb-3.5"><BarChart3 size={18} className="text-[#14b8a6]" /></div>
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">PSI / Lighthouse</h3>
                    <p className="text-[10px] text-foreground/45 leading-relaxed font-light">Fidelity grades on Accessibility, Best Practices, and performance audits.</p>
                  </div>
                  <div className="card-glass rounded-3xl p-6 text-center card-hover">
                    <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 flex items-center justify-center mx-auto mb-3.5"><FileText size={18} className="text-[#10b981]" /></div>
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Sitemap Audit</h3>
                    <p className="text-[10px] text-foreground/45 leading-relaxed font-light">Crawls robots and XML sitemaps to verify meta headers and SSL encryption.</p>
                  </div>
                  <div className="card-glass rounded-3xl p-6 text-center card-hover">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-3.5"><Shield size={18} className="text-brand-primary" /></div>
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Rich Indexation</h3>
                    <p className="text-[10px] text-foreground/45 leading-relaxed font-light">Scans structured JSON-LD schemas and headings outlines required for snippets.</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-foreground/35 font-medium uppercase tracking-[0.2em]">Engineered and Maintained by Maysan Labs Studio</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <ContactFooter />
    </main>
  );
}
