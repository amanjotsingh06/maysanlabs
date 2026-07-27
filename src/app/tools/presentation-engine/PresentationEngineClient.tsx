"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Presentation,
  Download,
  Loader2,
  ArrowLeft,
  AlertCircle,
  FileText,
  CheckCircle2,
  Trash2,
  Sparkles,
  ScanSearch,
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import ContactFooter from "@/components/layout/footer";
import {
  compileAdvancedPresentation,
  type AdvancedDeck,
  type AdvancedSlide,
} from "@/core/ppt/engine";
import { parseStructuredData } from "@/core/ppt/parser";

class AiNotConfiguredError extends Error {
  constructor() {
    super("AI parsing not configured");
    this.name = "AiNotConfiguredError";
  }
}

const PARSE_MODE_LABELS: Record<string, string> = {
  json: "Valid Presentation JSON",
  csv: "CSV / Tabular data",
  markdown: "Markdown table",
  kv: "Key:Value pairs",
};

function renderSlidePreview(slide: AdvancedSlide, idx: number) {
  return (
    <div
      key={idx}
      className="bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-sm"
    >
      <div className="bg-[#162447] px-4 py-2 flex items-center justify-between">
        <span className="text-white text-xs font-bold truncate mr-2">
          {slide.title}
        </span>
        <span className="bg-[#1F6B75] text-white text-[9px] font-bold px-2 py-0.5 rounded shrink-0">
          {idx + 1}
        </span>
      </div>
      <div className="p-3 space-y-2">
        <p className="text-[10px] text-foreground/50">{slide.subtitle}</p>

        {slide.type === "kpi_grid" && (
          <div className="grid grid-cols-2 gap-2">
            {slide.metrics.map((m, i) => (
              <div
                key={i}
                className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-xl p-3 text-center"
              >
                <p className="text-lg font-bold text-[#1F6B75]">{m.value}</p>
                <p className="text-[9px] text-gray-500">{m.label}</p>
              </div>
            ))}
          </div>
        )}

        {slide.type === "feature_columns" && (
          <div className="grid grid-cols-2 gap-2">
            {slide.columns.map((col, i) => (
              <div
                key={i}
                className={`border border-[#D1D5DB] rounded-xl p-2 ${
                  col.tinted ? "bg-[#E6F4F5]" : "bg-[#F3F4F6]"
                }`}
              >
                <p className="text-[10px] font-bold text-[#162447] mb-1">
                  {col.heading}
                </p>
                <ul className="text-[8px] text-[#1F2937] list-disc list-inside space-y-0.5">
                  {col.bodyPoints.map((pt, j) => (
                    <li key={j}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {slide.type === "data_matrix" && (
          <div className="overflow-x-auto">
            <table className="w-full text-[9px] border-collapse">
              <thead>
                <tr>
                  {slide.matrixTable.rows[0]?.map((cell, ci) => (
                    <th
                      key={ci}
                      className="px-2 py-1.5 border border-[#D1D5DB] bg-[#162447] text-white font-bold text-center"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slide.matrixTable.rows.slice(1).map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`px-2 py-1.5 border border-[#D1D5DB] ${
                          ci === 0
                            ? "bg-[#E6F4F5] text-[#1F6B75] font-bold text-center"
                            : ci === row.length - 1
                              ? "bg-[#ECFDF5] text-[#065F46]"
                              : ri % 2 === 0
                                ? "bg-[#F3F4F6] text-[#1F2937]"
                                : "bg-white text-[#1F2937]"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {slide.callout && (
          <div className="p-2 rounded text-[9px] bg-[#ECFDF5] text-[#065F46] border border-[#34D399]">
            {slide.callout}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PresentationEngineClient() {
  const [rawData, setRawData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWarning, setIsWarning] = useState(false);
  const [deckPreview, setDeckPreview] = useState<AdvancedDeck | null>(null);
  const [slideCount, setSlideCount] = useState(0);
  const [parseMode, setParseMode] = useState<"auto" | "force-ai">("auto");
  const [methodLabel, setMethodLabel] = useState<string | null>(null);
  const [downloadReady, setDownloadReady] = useState(false);
  const [deckTitle, setDeckTitle] = useState("");

  const blobUrlRef = useRef<string | null>(null);

  const revokeBlob = useCallback(() => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => revokeBlob();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      revokeBlob();
    };
  }, [revokeBlob]);

  const compileAndStore = useCallback(
    async (deck: AdvancedDeck) => {
      revokeBlob();
      const blob = await compileAdvancedPresentation(deck);
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;
      setDeckTitle(deck.deckTitle);
      setDownloadReady(true);
    },
    [revokeBlob]
  );

  const handleDownload = useCallback(() => {
    const url = blobUrlRef.current;
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = `${deckTitle.replace(/\s+/g, "_")}.pptx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(revokeBlob, 60_000);
    setDownloadReady(false);
  }, [deckTitle, revokeBlob]);

  const handleGenerate = useCallback(async () => {
    if (!rawData.trim()) {
      setError("Please paste your raw data, report, or code first.");
      return;
    }

    setLoading(true);
    setError(null);
    setIsWarning(false);
    setDeckPreview(null);
    setSlideCount(0);
    setMethodLabel(null);

    try {
      let deck: AdvancedDeck;
      let method: string;

      if (parseMode === "auto") {
        const parsed = parseStructuredData(rawData);
        if (parsed) {
          deck = parsed.json;
          method = PARSE_MODE_LABELS[parsed.mode] || `Parsed from ${parsed.mode}`;
        } else {
          method = "Structured by AI";
          const res = await fetch("/api/presentation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rawData: rawData.trim() }),
          });
          if (!res.ok) {
            const errData = await res.json().catch(() => null);
            if (errData?.error === "AI_API_KEY_NOT_CONFIGURED") {
              throw new AiNotConfiguredError();
            }
            throw new Error(errData?.error || `Server error (${res.status})`);
          }
          const raw = await res.json();
          deck = raw.deckTitle
            ? (raw as AdvancedDeck)
            : { deckTitle: "AI Generated Deck", slides: raw.slides || [] };
        }
      } else {
        method = "Structured by AI";
        const res = await fetch("/api/presentation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rawData: rawData.trim() }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          if (errData?.error === "AI_API_KEY_NOT_CONFIGURED") {
            throw new AiNotConfiguredError();
          }
          throw new Error(errData?.error || `Server error (${res.status})`);
        }
        const raw = await res.json();
        deck = raw.deckTitle
          ? (raw as AdvancedDeck)
          : { deckTitle: "AI Generated Deck", slides: raw.slides || [] };
      }

      if (!deck.slides || deck.slides.length === 0) {
        throw new Error(
          "No slides were generated. Try providing more detailed data."
        );
      }

      setDeckPreview(deck);
      setSlideCount(deck.slides.length);
      setMethodLabel(method);
      await compileAndStore(deck);
    } catch (err) {
      if (err instanceof AiNotConfiguredError) {
        setError("AI parsing is not configured (no API key). Paste structured data like CSV, markdown tables, or key:value pairs instead — those are handled entirely in your browser.");
        setIsWarning(true);
      } else {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [rawData, parseMode, compileAndStore]);

  const handleClear = useCallback(() => {
    setRawData("");
    setError(null);
    setIsWarning(false);
    setDeckPreview(null);
    setSlideCount(0);
    setMethodLabel(null);
    setDownloadReady(false);
    setDeckTitle("");
    revokeBlob();
  }, [revokeBlob]);

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <div>
        <Navbar />

        <Link
          href="/tools"
          className="block container-main max-w-5xl mx-auto pt-24 pb-0"
        >
          <span className="inline-flex items-center gap-1.5 text-[11px] text-foreground/40 hover:text-brand-primary transition-colors">
            <ArrowLeft size={12} />
            Back to All Tools
          </span>
        </Link>

        <div className="pb-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] max-sm:w-[300px] max-sm:h-[300px] bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="container-main max-w-5xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <span className="badge-section mb-4">
                <Presentation size={12} />
                Presentation Engine
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Dynamic{" "}
                <span className="text-brand-primary">Layout Engine</span>
              </h1>
              <p className="text-foreground/50 max-w-2xl mx-auto text-sm md:text-base">
                Paste any data — the engine auto-selects the right layout: KPI
                cards, feature columns, or data matrices. Structured input is
                instant; complex text routes to AI.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
              <div className="lg:col-span-5 card-glass rounded-3xl p-6 space-y-4 card-hover">
                <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <FileText size={16} className="text-brand-primary" />
                  Input Your Data
                </h3>

                <div>
                  <label
                    htmlFor="raw-data-input"
                    className="text-[10px] font-semibold text-foreground/50 block mb-1"
                  >
                    Raw Data, Report, or Code
                  </label>
                  <textarea
                    id="raw-data-input"
                    rows={16}
                    placeholder={`Paste your data here...

Layouts auto-selected by content shape:
📊 KPI Grid — numeric key:value pairs
📋 Feature Columns — grouped text sections
📑 Data Matrix — CSV, markdown tables, text pairs
🤖 Unstructured text → AI`}
                    value={rawData}
                    onChange={(e) => {
                      setRawData(e.target.value);
                      if (error) setError(null);
                    }}
                    className="w-full bg-white/50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 leading-relaxed resize-none font-mono"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-white/40 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-0.5">
                    <button
                      onClick={() => setParseMode("auto")}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-[9px] text-[10px] font-semibold transition-all ${
                        parseMode === "auto"
                          ? "bg-brand-primary text-black shadow-sm"
                          : "text-foreground/40 hover:text-foreground"
                      }`}
                    >
                      <ScanSearch size={11} />
                      Auto-detect
                    </button>
                    <button
                      onClick={() => setParseMode("force-ai")}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-[9px] text-[10px] font-semibold transition-all ${
                        parseMode === "force-ai"
                          ? "bg-brand-primary text-black shadow-sm"
                          : "text-foreground/40 hover:text-foreground"
                      }`}
                    >
                      <Sparkles size={11} />
                      Force AI
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerate}
                    disabled={loading || !rawData.trim()}
                    className="flex-1 py-2.5 bg-brand-primary text-black rounded-xl font-bold uppercase text-[10px] sm:text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 hover:shadow-[0_0_20px_rgba(26,109,214,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Presentation size={12} />
                        Generate
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownload}
                    disabled={!downloadReady}
                    className="py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold uppercase text-[10px] sm:text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 text-foreground/60 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Download .pptx"
                  >
                    <Download size={12} />
                    Download
                  </button>

                  <button
                    onClick={handleClear}
                    disabled={loading || (!rawData && !deckPreview)}
                    className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-foreground/40 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Clear all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-2 p-3 rounded-xl ${
                      isWarning
                        ? "bg-amber-500/10 border border-amber-500/20"
                        : "bg-red-500/10 border border-red-500/20"
                    }`}
                  >
                    {isWarning ? (
                      <Sparkles size={14} className="text-amber-400 mt-0.5 shrink-0" />
                    ) : (
                      <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
                    )}
                    <p className={`text-xs leading-relaxed ${isWarning ? "text-amber-400" : "text-red-400"}`}>
                      {error}
                    </p>
                  </motion.div>
                )}

                {slideCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                  >
                    <CheckCircle2
                      size={14}
                      className="text-emerald-400 shrink-0"
                    />
                    <p className="text-xs text-emerald-400 leading-relaxed">
                      {slideCount} slide{slideCount !== 1 ? "s" : ""}.{" "}
                      {methodLabel && (
                        <span className="font-semibold opacity-90">
                          {methodLabel}.
                        </span>
                      )}{" "}
                      Ready to download.
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="lg:col-span-7 card-glass-accent rounded-3xl p-6 flex flex-col relative overflow-hidden card-hover">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl pointer-events-none" />

                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2 border-b border-white/10 pb-4">
                  <Presentation size={16} className="text-brand-primary" />
                  Live Slide Preview
                </h3>

                <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
                  {deckPreview ? (
                    <div className="w-full space-y-3 max-h-[600px] overflow-y-auto pr-1">
                      {deckPreview.slides.map((slide, idx) => renderSlidePreview(slide, idx))}
                      <p className="text-center text-[10px] text-foreground/30 pt-1">
                        {deckPreview.slides.length} slide{deckPreview.slides.length !== 1 ? "s" : ""} total
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                        <Presentation
                          size={28}
                          className="text-brand-primary"
                        />
                      </div>
                      <p className="text-sm text-foreground/40 max-w-xs mx-auto">
                        Paste your data and click{" "}
                        <span className="text-brand-primary font-semibold">
                          Generate
                        </span>{" "}
                        to see a live preview with the auto-selected layout.
                      </p>
                      <div className="mt-6 grid grid-cols-2 gap-2 max-w-xs mx-auto">
                        {[
                          {
                            label: "KPI Grid",
                            data:
                              "Revenue: $2.4M\nUsers: 48K\nUptime: 99.9%\nNPS: 58\nGrowth: +32%\nChurn: 1.2%\nCAC: $1,240\nLTV: $12.8K\nARR: $9.6M\nBurn Rate: $340K",
                          },
                          {
                            label: "Data Matrix",
                            data:
                              "Name,Role,Department,Location,Start Date\nAlice,Engineer,Platform,NYC,2023-01-15\nBob,Designer,Creative,SF,2023-03-22\nCarol,PM,Product,NYC,2023-06-01\nDave,Engineer,Platform,SF,2023-08-12\nEve,Designer,Creative,NYC,2024-02-01\nFrank,Engineer,Platform,Austin,2024-03-15\nGrace,PM,Product,SF,2024-04-01\nHank,Engineer,Platform,NYC,2024-05-10\nIvy,Designer,Creative,Austin,2024-06-20\nJack,Engineer,Platform,SF,2024-07-01\nKate,PM,Product,NYC,2024-08-15\nLeo,Engineer,Platform,Austin,2024-09-01\nMia,Designer,Creative,SF,2024-10-01\nNoah,Engineer,Platform,NYC,2024-11-15\nOlivia,PM,Product,Austin,2024-12-01\nPaul,Engineer,Platform,SF,2025-01-10\nQuinn,Designer,Creative,NYC,2025-02-15\nRose,Engineer,Platform,Austin,2025-03-01\nSam,PM,Product,SF,2025-04-01\nTina,Engineer,Platform,NYC,2025-04-15\nUma,Designer,Creative,Austin,2025-05-01\nVictor,Engineer,Platform,SF,2025-05-15\nWendy,PM,Product,NYC,2025-06-01\nXander,Engineer,Platform,Austin,2025-06-15\nYuki,Designer,Creative,SF,2025-07-01\nZara,Engineer,Platform,NYC,2025-07-15",
                          },
                          {
                            label: "Markdown Table",
                            data:
                              "| Metric | Q1 | Q2 | Q3 | Q4 | YoY |\n|--------|-----|-----|-----|-----|------|\n| Revenue | $1.2M | $1.8M | $2.4M | $3.1M | +32% |\n| Costs | $0.8M | $1.1M | $1.3M | $1.5M | +18% |\n| Profit | $0.4M | $0.7M | $1.1M | $1.6M | +58% |\n| Margins | 33% | 39% | 46% | 52% | +19pp |\n| Users | 12K | 24K | 36K | 52K | +78% |\n| Tickets | 340 | 520 | 410 | 290 | -15% |",
                          },
                          {
                            label: "Raw Text",
                            data:
                              "Q4 2025 revenue reached $3.2M, up 24% YoY. Customer count grew to 1,240 accounts. NPS score improved from 42 to 58. The platform processed 2.4M transactions with 99.99% uptime. Engineering team expanded to 48 members across 4 offices. Average response time reduced from 340ms to 89ms. Customer churn decreased from 3.2% to 1.8%.",
                          },
                        ].map((sample) => (
                          <button
                            key={sample.label}
                            onClick={() => {
                              setRawData(sample.data);
                              setError(null);
                            }}
                            className="text-[9px] px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-foreground/40 hover:text-foreground transition-all"
                          >
                            {sample.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-glass rounded-3xl p-6"
            >
              <h3 className="text-sm font-bold text-foreground mb-3">
                How It Works
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                  {
                    step: "1",
                    title: "Paste Data",
                    desc: "Drop any data — CSV, KPI pairs, markdown tables, or free text.",
                  },
                  {
                    step: "2",
                    title: "Auto-Select Layout",
                    desc: "Structured data is parsed into KPI cards, feature columns, or data matrices. Unstructured content uses AI.",
                  },
                  {
                    step: "3",
                    title: "Compile PPT",
                    desc: "pptxgenjs builds a native .pptx with component-driven layout rendering.",
                  },
                  {
                    step: "4",
                    title: "Download",
                    desc: "Deck delivered to your downloads folder. Blob URL cleaned up on tab close.",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/40 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.04]"
                  >
                    <span className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <p className="text-[11px] font-bold text-foreground">
                        {item.title}
                      </p>
                      <p className="text-[9px] text-foreground/40 mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <ContactFooter />
    </main>
  );
}
