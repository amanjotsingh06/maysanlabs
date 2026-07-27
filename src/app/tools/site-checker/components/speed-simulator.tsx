"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Smartphone, Play, Pause, Loader2, Server } from "lucide-react";

export function SpeedSimulator({ lcp, fcp, ttfb }: { lcp: number; fcp: number; ttfb: number }) {
  const [step, setStep] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const steps = [
    { label: "0.0s Connection", desc: "Browser initiates socket request. Page is blank.", time: 0 },
    { label: `${ttfb.toFixed(1)}s TTFB`, desc: "First byte received from server. Skeleton DOM loading.", time: ttfb },
    { label: `${fcp.toFixed(1)}s FCP`, desc: "First Contentful Paint. Skeletons painted, fallback text visible.", time: fcp },
    { label: `${lcp.toFixed(1)}s LCP`, desc: "Largest Contentful Paint. Primary hero components fully active.", time: lcp },
  ];

  const handlePlayPause = () => {
    if (isPlaying) {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setStep(0);
      let curr = 0;
      playIntervalRef.current = setInterval(() => {
        curr++;
        if (curr < steps.length) { setStep(curr); }
        else { setIsPlaying(false); if (playIntervalRef.current) clearInterval(playIntervalRef.current); }
      }, 1800);
    }
  };

  useEffect(() => {
    return () => { if (playIntervalRef.current) clearInterval(playIntervalRef.current); };
  }, []);

  return (
    <div className="bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Smartphone size={16} className="text-brand-primary" />
            Above-the-Fold Speed Paint Simulator
          </h3>
          <p className="text-xs text-foreground/40">Visualize what users actually see at each milestone</p>
        </div>
        <button onClick={handlePlayPause} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/20 transition-all rounded-lg text-xs font-semibold">
          {isPlaying ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Play Load Simulation</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-4">
            {steps.map((s, idx) => (
              <button key={idx} type="button" onClick={() => { setStep(idx); setIsPlaying(false); }}
                className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer text-left w-full ${
                  step === idx ? "bg-brand-primary/5 border-brand-primary/30 shadow-lg shadow-brand-primary/5" : "bg-transparent border-transparent hover:bg-white/[0.02]"
                }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold font-mono ${step === idx ? "text-brand-primary" : "text-foreground/50"}`}>{s.label}</span>
                    <span className="text-[9px] font-mono text-foreground/30">Step {idx + 1}</span>
                </div>
                <p className="text-xs text-foreground/45 mt-1 leading-relaxed">{s.desc}</p>
              </button>
            ))}
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-[10px] text-foreground/30 font-mono">
              <span>Start</span>
              <span>Interactive ({lcp.toFixed(1)}s)</span>
            </div>
            <input type="range" min={0} max={3} step={1} value={step}
              onChange={(e) => { setStep(parseInt(e.target.value)); setIsPlaying(false); }}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary" />
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center">
          <div className="w-[200px] h-[380px] rounded-[30px] border-4 border-slate-800 bg-[#03050d] relative overflow-hidden shadow-2xl flex flex-col p-3 text-[10px] select-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-800 rounded-b-xl z-25" />
            <div className="flex-1 flex flex-col justify-between pt-4 relative">
              {step === 0 && (
                <div className="absolute inset-0 bg-[#03050d] flex flex-col items-center justify-center text-center p-4">
                  <Loader2 size={24} className="text-white/20 animate-spin animate-pulse" />
                  <p className="text-[10px] text-white/30 mt-3 font-mono">http get/socket request...</p>
                </div>
              )}
              {step === 1 && (
                <div className="absolute inset-0 bg-[#03050d] flex flex-col p-2 space-y-3">
                  <div className="w-full h-6 bg-white/[0.03] border border-white/[0.04] rounded flex items-center px-1.5 justify-between">
                    <div className="w-6 h-2 bg-white/10 rounded" />
                    <div className="w-12 h-2 bg-white/10 rounded" />
                  </div>
                  <div className="flex-1 border border-white/[0.04] rounded-lg p-2 bg-white/[0.01] flex flex-col justify-center items-center">
                    <Server size={20} className="text-brand-primary/30 animate-pulse" />
                    <span className="text-[8px] text-white/20 mt-2 font-mono">TTFB resolved</span>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="absolute inset-0 bg-[#03050d] flex flex-col p-2 space-y-3">
                  <div className="w-full h-6 bg-white/[0.03] border border-white/[0.04] rounded flex items-center px-1.5 justify-between">
                    <div className="w-6 h-2 bg-brand-primary/20 rounded" />
                    <div className="flex gap-1.5"><div className="w-8 h-2 bg-white/10 rounded" /><div className="w-8 h-2 bg-white/10 rounded" /></div>
                  </div>
                  <div className="flex-grow flex flex-col space-y-2 p-1">
                    <div className="w-3/4 h-3 bg-white/15 rounded animate-pulse" />
                    <div className="w-1/2 h-2 bg-white/5 rounded" />
                    <div className="w-full h-16 bg-white/[0.02] border border-white/[0.04] rounded-lg mt-2 flex items-center justify-center">
                      <span className="text-[7px] text-white/25 font-mono">Painting skeletons...</span>
                    </div>
                  </div>
                </div>
              )}
              {step === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-[#03050d] flex flex-col p-2 space-y-3">
                  <div className="w-full h-6 bg-white/[0.03] border border-brand-primary/20 rounded flex items-center px-1.5 justify-between">
                    <div className="w-10 h-2 bg-gradient-to-r from-brand-primary to-[#00d2ff] rounded" />
                    <div className="flex gap-1.5"><div className="w-8 h-2 bg-white/20 rounded" /><div className="w-8 h-2 bg-white/20 rounded" /></div>
                  </div>
                  <div className="flex-grow flex flex-col space-y-2 p-1 text-left">
                    <span className="px-1.5 py-0.5 border border-[#10b981]/20 bg-[#10b981]/5 text-[#10b981] rounded-full text-[5px] w-fit font-bold uppercase tracking-widest">Live</span>
                    <div className="space-y-1">
                      <div className="w-full h-3 bg-white/30 rounded" />
                      <div className="w-4/5 h-2.5 bg-white/20 rounded" />
                    </div>
                    <div className="w-full h-24 bg-gradient-to-b from-brand-primary/10 to-transparent border border-white/10 rounded-lg p-2 flex flex-col justify-between">
                      <div className="flex justify-between items-center border-b border-white/5 pb-1">
                        <span className="text-[6px] text-white/40">Maysan Labs Studio</span>
                        <span className="text-[6px] text-[#10b981] font-bold">99.9%</span>
                      </div>
                      <div className="w-full h-5 bg-gradient-to-r from-brand-primary to-[#00d2ff] rounded flex items-center justify-center font-bold text-white text-[6px]">EXPLORE STUDIO</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            <div className="w-16 h-1 bg-white/10 rounded-full mx-auto mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
}


