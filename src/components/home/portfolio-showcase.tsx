"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

interface PortfolioShowcaseProps {
  title: string;
  category: string;
  tagline?: string;
  description: string;
  benefits?: string[];
  imageUrl: string;
  iframeUrl?: string; // Live site URL for dummy computer sandbox
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  scrollPercentage?: string; // e.g. "80%" or "85%"
  reverse?: boolean;
}

export default function PortfolioShowcase({
  title,
  category,
  tagline,
  description,
  benefits = [],
  imageUrl,
  iframeUrl,
  ctaText = "Explore Project",
  ctaHref = "#",
  secondaryCtaText,
  secondaryCtaHref,
  scrollPercentage = "82%",
  reverse = false,
}: PortfolioShowcaseProps) {
  const [isLiveMode, setIsLiveMode] = useState(false);
  return (
    <div className={`w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center py-12 md:py-16 ${reverse ? 'lg:flex-row-reverse' : ''}`}>
      
      {/* Left Column: Information & Details (Span 5) */}
      <div className={`lg:col-span-5 flex flex-col justify-center ${reverse ? 'lg:order-last' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col text-left"
        >
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#1A6DD6] uppercase mb-3">
            {category}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground tracking-tight leading-tight mb-4">
            {title}
          </h2>
          {tagline && (
            <p className="text-foreground/40 text-xs sm:text-sm font-medium italic mb-4">
              &ldquo;{tagline}&rdquo;
            </p>
          )}
          <p className="text-foreground/45 text-sm sm:text-base leading-relaxed mb-6">
            {description}
          </p>

          {benefits.length > 0 && (
            <div className="flex flex-col gap-2.5 mb-8">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 text-foreground/50 text-xs sm:text-sm">
                  <CheckCircle2 size={14} className="text-[#1A6DD6] shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Link 
              href={ctaHref} 
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A6DD6] rounded-full font-bold text-[9px] sm:text-[10px] uppercase tracking-widest text-white shadow-lg shadow-blue-500/20 overflow-hidden transition-all duration-300 hover:bg-[#1f7ae8] hover:shadow-blue-500/40 hover:scale-105 active:scale-95"
            >
              <span>{ctaText}</span>
              <ArrowUpRight size={14} />
            </Link>

            {iframeUrl && (
              <button 
                onClick={() => setIsLiveMode(!isLiveMode)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border font-bold text-[9px] sm:text-[10px] uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 ${
                  isLiveMode 
                    ? "bg-green-500/20 border-green-500/40 text-green-400" 
                    : "bg-white/[0.03] border-white/15 text-foreground/70 hover:bg-white/[0.08] hover:text-foreground hover:border-white/25"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isLiveMode ? "bg-green-400 animate-pulse" : "bg-white/40"}`} />
                <span>{isLiveMode ? "Disable Sandbox" : "Interact Live"}</span>
              </button>
            )}

            {secondaryCtaText && secondaryCtaHref && (
              <Link 
                href={secondaryCtaHref} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 bg-white/[0.03] text-foreground/70 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest transition-all duration-300 hover:bg-white/[0.08] hover:text-foreground hover:border-white/25 hover:scale-105 active:scale-95"
              >
                <span>{secondaryCtaText}</span>
                <ArrowUpRight size={14} />
              </Link>
            )}
          </div>
        </motion.div>
      </div>

      {/* Right Column: Interactive MacBook Device Mockup (Span 7) */}
      <div className="lg:col-span-7 flex justify-center w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl group relative"
        >
          {/* Neon Backdrop Pulse Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#1A6DD6]/20 to-cyan-500/5 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000 pointer-events-none" />

          {/* Laptops Display Body */}
          <div className="relative aspect-[16/10] bg-[#0c0c0c] rounded-t-xl overflow-hidden border border-white/10 shadow-2xl">
            
            {/* Screen Inner Glass Area */}
            <div className="absolute inset-[3%] bg-[#121212] rounded-md overflow-hidden">
              
              {/* Floating Glassmorphic Interactive Sandbox Toggle */}
              {iframeUrl && (
                <button
                  onClick={() => setIsLiveMode(!isLiveMode)}
                  className={`absolute top-2.5 right-2.5 z-30 px-2.5 py-1 rounded-full text-[8px] sm:text-[9px] uppercase tracking-widest font-extrabold flex items-center gap-1.5 transition-all duration-300 backdrop-blur-md shadow-lg ${
                    isLiveMode 
                      ? "bg-green-500/20 border border-green-500/40 text-green-400" 
                      : "bg-black/60 border border-white/10 text-white/70 hover:bg-black/80 hover:text-white"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isLiveMode ? "bg-green-400 animate-pulse" : "bg-white/40"}`} />
                  <span>{isLiveMode ? "Sandbox Active" : "Interact Live"}</span>
                </button>
              )}

              {isLiveMode && iframeUrl ? (
                <iframe
                  src={iframeUrl}
                  className="w-full h-full border-0 bg-white"
                  title={`${title} live sandbox preview`}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              ) : (
                /* Scrolling Image Layer */
                <div className="w-full h-full relative overflow-hidden">
                  <div 
                    style={{ '--scroll-translate': `-${scrollPercentage}` } as React.CSSProperties}
                    className={`w-full absolute top-0 left-0 transition-transform duration-[4500ms] ease-in-out transform translate-y-0 group-hover:translate-y-[var(--scroll-translate)] ${
                      scrollPercentage === "0%" ? "h-full flex items-center justify-center" : "h-auto"
                    }`}
                  >
                    <img 
                      src={imageUrl} 
                      alt={`${title} product interface preview`}
                      className={`w-full ${
                        scrollPercentage === "0%" ? "h-full object-fill" : "h-auto object-cover object-top"
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Reflection Screen Gloss overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.04] pointer-events-none z-10" />
            </div>

            {/* Apple Bezel Notch / Camera lens dot */}
            <div className="absolute top-[1%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#2a2a2a] flex items-center justify-center pointer-events-none">
              <div className="w-0.5 h-0.5 rounded-full bg-blue-500/80" />
            </div>
          </div>

          {/* MacBook Aluminium Bottom Chassis Base */}
          <div className="relative w-[108%] -left-[4%] h-2.5 sm:h-3.5 bg-gradient-to-b from-[#e5e7eb] to-[#9ca3af] dark:from-[#2e2e2e] dark:to-[#171717] rounded-b-xl border-t border-white/[0.15] shadow-2xl flex items-center justify-center">
            
            {/* Base Indent finger-grip notch */}
            <div className="w-16 sm:w-24 h-1 bg-[#d1d5db]/60 dark:bg-[#0c0c0c]/80 rounded-b-md" />
          </div>

          {/* Sleek bottom shadow */}
          <div className="absolute w-[100%] left-[0%] -bottom-6 h-6 bg-black/40 blur-xl rounded-full opacity-60 pointer-events-none" />

          {/* Pinterest-Inspired Floating Glassmorphic Metric Panels */}
          {title === "Maysan Shop" && (
            <div className="absolute -bottom-2 -left-6 z-20 w-44 backdrop-blur-md bg-[#080B16]/85 border border-white/10 rounded-2xl p-4 shadow-2xl animate-float-card hidden sm:block">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[8px] uppercase tracking-widest text-white/40 font-extrabold">Live Revenue</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-lg font-black text-white mb-0.5 tracking-tight">₹4,82,910</div>
              <div className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                <span>+24.8%</span>
                <span className="text-white/30 font-medium">vs yesterday</span>
              </div>
              
              {/* Mini Neon Visual Sparkline */}
              <div className="mt-3 flex items-end gap-1.5 h-8">
                <div className="w-full bg-white/5 rounded-t-sm h-3" />
                <div className="w-full bg-white/5 rounded-t-sm h-5" />
                <div className="w-full bg-white/5 rounded-t-sm h-4" />
                <div className="w-full bg-[#1A6DD6]/30 rounded-t-sm h-6" />
                <div className="w-full bg-[#1A6DD6] rounded-t-sm h-8 shadow-[0_0_10px_rgba(26,109,214,0.5)]" />
              </div>
            </div>
          )}

          {title === "Edu-Maysan" && (
            <div className="absolute -bottom-2 -right-6 z-20 w-44 backdrop-blur-md bg-[#080B16]/85 border border-white/10 rounded-2xl p-4 shadow-2xl animate-float-card hidden sm:block" style={{ animationDelay: "1s" }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[8px] uppercase tracking-widest text-white/40 font-extrabold">Attendance</span>
                <span className="text-[#1A6DD6] text-[9px] font-black uppercase">98.4%</span>
              </div>
              <div className="text-lg font-black text-white mb-0.5 tracking-tight">12,840</div>
              <span className="text-[9px] text-white/30 font-medium">Active registrations</span>
              
              {/* Mini biometric indicators */}
              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[8px] font-bold text-white/50">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A6DD6]" />
                  <span>Bio-RFID</span>
                </div>
                <span className="text-green-400 font-extrabold uppercase">Live</span>
              </div>
            </div>
          )}

          {/* Floating Keyframes Style Block */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes floatAnimation {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            .animate-float-card {
              animation: floatAnimation 4s ease-in-out infinite;
            }
          `}} />
        </motion.div>
      </div>

    </div>
  );
}
