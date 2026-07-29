"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export interface SummaryMetric {
  label: string;
  value: string | number;
  icon?: ReactNode;
}

interface ResultSummaryProps {
  metrics: SummaryMetric[];
  title?: string;
  subtitle?: string;
}

/**
 * A glass-styled summary card component used to display calculation results and metrics.
 * Designed to be used alongside LeadCaptureCTA in the conversion funnel.
 * 
 * @param props.metrics - Array of metric objects to display (label, value, optional icon)
 * @param props.title - Optional title for the summary card (defaults to "Calculation Results")
 * @param props.subtitle - Optional subtitle providing additional context
 */
export default function ResultSummary({ metrics, title = "Calculation Results", subtitle }: ResultSummaryProps) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glass-accent rounded-3xl p-6 md:p-8 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        <div>
          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest block mb-1">
            {title}
          </span>
          {subtitle && (
            <p className="text-[10px] text-foreground/45 leading-relaxed mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="space-y-4 border-t border-white/10 pt-5">
          {metrics.map((metric, index) => (
            <div key={index} className="flex justify-between items-center text-xs">
              <span className="text-foreground/50 flex items-center gap-1.5">
                {metric.icon && <span className="text-brand-primary">{metric.icon}</span>}
                {metric.label}
              </span>
              <span className="font-bold text-foreground text-right max-w-[60%]">
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
