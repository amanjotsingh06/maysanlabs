"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Pause, Play } from "lucide-react";

const testimonials = [
  {
    name: "Vikram Singh",
    role: "Founder, Maysan Shop",
    message: "Maysan Labs built our entire custom ERP and inventory system from scratch. The regional warehousing, automated order workflows, and UPI payment integrations work flawlessly. Our order fulfillment efficiency jumped dramatically.",
    metric: "300%",
    metricLabel: "Efficiency gain",
  },
  {
    name: "Rahul Sharma",
    role: "CEO, TechRetail India",
    message: "Maysan Labs delivered an ultra-scalable cloud database that handled our Diwali festive sale traffic without a single hiccup. Their engineering quality is truly world-class.",
    metric: "3x faster",
    metricLabel: "Page load time",
  },
  {
    name: "Priya Mehta",
    role: "Founder, StyleHub",
    message: "They engineered a robust system that scaled from 10,000 to 5 Lakh active users seamlessly. True partners in our growth journey.",
    metric: "5 Lakhs",
    metricLabel: "Active users",
  },
  {
    name: "Suraj Devadiga",
    role: "Founder, Flash Fashion",
    message: "Maysan Labs engineered a world-class, ultra-fast e-commerce platform for our clothing brand. Surili from their team spearheaded our digital marketing campaigns, driving massive brand adoption across India.",
    metric: "₹1.5 Cr+",
    metricLabel: "First-Month Sales",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % testimonials.length);
  }, []);




  const t = testimonials[current];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <section className="py-16 md:py-20 relative bg-[var(--sec-bg-alt)]">
      <div className="container-main">
        <div className="text-center mb-10 md:mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-medium">
              <Star size={12} />
              Testimonials
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="heading-md text-foreground"
          >
            What clients say
          </motion.h2>
        </div>

        <div
          className="max-w-3xl mx-auto relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative min-h-[280px] flex items-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-2xl p-8 md:p-10 shadow-lg"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="text-brand-primary fill-brand-primary" />
                  ))}
                </div>

                <p className="text-foreground/70 text-base md:text-lg leading-relaxed mb-6">
                  &ldquo;{t.message}&rdquo;
                </p>

                <div className="flex items-center justify-between pt-5 border-t border-[var(--border-subtle)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center font-bold text-brand-primary">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-foreground font-semibold text-sm">{t.name}</p>
                      <p className="text-foreground/50 text-xs">{t.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-400 font-extrabold text-lg drop-shadow-[0_0_10px_rgba(59,130,246,0.15)]">
                      {t.metric}
                    </p>
                    <p className="text-foreground/35 text-xs uppercase tracking-wider font-semibold">
                      {t.metricLabel}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center mt-8 relative">
            <style>{`
              @keyframes slide-progress {
                from { transform: scaleX(0); }
                to { transform: scaleX(1); }
              }
            `}</style>
            <div className="flex items-center gap-1">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="min-w-0 min-h-0 p-2 flex items-center justify-center group outline-none"
                >
                  <div
                    className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-500 ease-out bg-foreground/20 ${
                      i === current
                        ? "w-8"
                        : "w-1.5 group-hover:bg-foreground/40"
                    }`}
                  >
                    {i === current && (
                      <div
                        key={`progress-${current}`}
                        className="absolute top-0 left-0 h-full w-full bg-foreground/80 rounded-full origin-left"
                        style={{
                          animation: `slide-progress 5000ms linear forwards`,
                          animationPlayState: isPaused ? "paused" : "running",
                        }}
                        onAnimationEnd={() => {
                          if (!isPaused) next();
                        }}
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsPaused((p) => !p)}
              aria-label={isPaused ? "Resume auto-play" : "Pause auto-play"}
              className="absolute right-0 flex items-center justify-center w-8 h-8 min-w-0 min-h-0 rounded-full border border-foreground/10 text-foreground/40 hover:text-foreground/80 hover:bg-foreground/5 transition-all"
            >
              {isPaused ? <Play size={10} fill="currentColor" className="ml-0.5" /> : <Pause size={10} fill="currentColor" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
