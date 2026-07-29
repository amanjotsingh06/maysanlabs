"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calculator, TrendingUp, Clock } from "lucide-react";
import { LeadCaptureCTA, ResultSummary } from "@/components/conversion-flow";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import ContactFooter from "@/components/layout/footer";

const platforms = [
  { name: "Shopify Basic", feePct: 2.0, baseCost: 3300 }, // Approx ₹3,300/mo
  { name: "Shopify Plus", feePct: 0.25, baseCost: 170000 }, // Approx ₹1.7L/mo
  { name: "WooCommerce", feePct: 0, baseCost: 12500 }, // Approx ₹12.5k/mo
  { name: "Custom Platform", feePct: 1.0, baseCost: 34000 }, // Approx ₹34k/mo
];

export default function HeadlessRoiClient() {
  const [monthlySales, setMonthlySales] = useState(1000000); // Default ₹10L/mo
  const [aov, setAov] = useState(1500); // Default ₹1,500 AOV
  const [selectedPlatform, setSelectedPlatform] = useState(0);
  const [conversionRate, setConversionRate] = useState(1.8);


  const platform = platforms[selectedPlatform];

  const calculations = useMemo(() => {
    const ordersPerMonth = monthlySales / aov;
    
    // Conversion rate increases typically by 22% due to instant page load speeds
    const liftMultiplier = 0.22;
    const newConversionRate = conversionRate * (1 + liftMultiplier);
    const monthlyRevenueLift = monthlySales * liftMultiplier;
    
    // Traditional platform transaction fees
    const platformTransactionFees = monthlySales * (platform.feePct / 100);
    const platformBaseCosts = platform.baseCost;
    const totalPlatformCostMonthly = platformTransactionFees + platformBaseCosts;

    // Headless infrastructure monthly estimate in INR (approx ₹10k base + volume auto-scale)
    const headlessHostingCostMonthly = 10000 + Math.min(20000, (monthlySales * 0.0005));
    const totalHeadlessCostMonthly = headlessHostingCostMonthly; // Bypasses transactional billing overrides
    
    const monthlySavings = totalPlatformCostMonthly - totalHeadlessCostMonthly;
    const annualNetSavings = (monthlySavings * 12) + (monthlyRevenueLift * 12);
    const estimatedMigrationCost = 1500000; // Approx ₹15L scoping build
    
    const roiPercent = (annualNetSavings / estimatedMigrationCost) * 100;
    const breakEvenMonths = Math.ceil(estimatedMigrationCost / (monthlySavings + monthlyRevenueLift));

    return {
      ordersPerMonth: Math.round(ordersPerMonth),
      newConversionRate: Math.round(newConversionRate * 100) / 100,
      monthlyRevenueLift: Math.round(monthlyRevenueLift),
      totalPlatformCostMonthly: Math.round(totalPlatformCostMonthly),
      totalHeadlessCostMonthly: Math.round(totalHeadlessCostMonthly),
      annualNetSavings: Math.round(annualNetSavings),
      roiPercent: Math.round(roiPercent),
      breakEvenMonths: Math.max(1, breakEvenMonths),
    };
  }, [monthlySales, aov, conversionRate, platform]);



  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <div>
        <Navbar />

        <Link href="/tools" className="block container-main max-w-4xl mx-auto pt-24 pb-0">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-foreground/40 hover:text-brand-primary transition-colors">
            <ArrowLeft size={12} />
            Back to All Tools
          </span>
        </Link>

        <div className="pb-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] max-sm:w-[300px] max-sm:h-[300px] bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="container-main max-w-4xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <span className="badge-section mb-4">
                <Calculator size={12} />
                Commerce Math
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Online Store <span className="text-brand-primary">Profit Calculator</span>
              </h1>
              <p className="text-foreground/50 max-w-2xl mx-auto text-sm md:text-base">
                See how much more money your store can make by boosting loading speeds, increasing customer sales, and lowering platform fees.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
              {/* Sliders Box */}
              <div className="lg:col-span-7 card-glass rounded-3xl p-6 md:p-8 space-y-6 card-hover">
                <div>
                  <label htmlFor="sales-slider" className="flex justify-between text-sm font-semibold mb-2">
                    <span>Monthly Store Revenue</span>
                    <span className="text-brand-primary font-mono">₹{monthlySales.toLocaleString('en-IN')}</span>
                  </label>
                  <input
                    id="sales-slider"
                    type="range"
                    min={10000}
                    max={1000000}
                    step={10000}
                    value={monthlySales}
                    onChange={(e) => setMonthlySales(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  />
                  <div className="flex justify-between text-[10px] text-foreground/30 font-mono mt-1">
                    <span>₹10k</span>
                    <span>₹500k</span>
                    <span>₹10L+</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="aov-input" className="text-xs font-semibold text-foreground/70 block mb-1.5">Average Order Value (AOV)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30 text-xs font-mono">₹</span>
                      <input
                        id="aov-input"
                        type="number"
                        min={5}
                        max={10000}
                        value={aov}
                        onChange={(e) => setAov(Math.max(5, Number(e.target.value)))}
                        className="bg-white/50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl pl-7 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="conv-slider" className="flex justify-between text-xs font-semibold text-foreground/70 mb-1.5">
                      <span>Conversion Rate</span>
                      <span className="text-brand-primary font-mono">{conversionRate}%</span>
                    </label>
                    <input
                      id="conv-slider"
                      type="range"
                      min={0.2}
                      max={6.0}
                      step={0.1}
                      value={conversionRate}
                      onChange={(e) => setConversionRate(Number(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-foreground/70 block mb-3">Current E-commerce Platform</span>
                  <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="E-commerce platforms">
                    {platforms.map((plat, idx) => (
                      <button
                        key={plat.name}
                        role="radio"
                        aria-checked={selectedPlatform === idx}
                        onClick={() => setSelectedPlatform(idx)}
                        className={`p-3 rounded-xl text-left border transition-all text-xs ${
                          selectedPlatform === idx
                            ? "bg-brand-primary/10 border-brand-primary/40 text-foreground"
                            : "bg-white/50 dark:bg-black/30 border-gray-200 dark:border-white/5 hover:border-brand-primary/30 dark:hover:border-white/10 text-foreground/60"
                        }`}
                      >
                        <p className="font-bold">{plat.name}</p>
                        <p className="text-[9px] sm:text-[10px] text-foreground/40 mt-0.5">
                          {plat.feePct > 0 ? `${plat.feePct}% transaction fee` : "No transaction fees"}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Calculations Box */}
              <div className="lg:col-span-5 card-glass-accent rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden card-hover">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl pointer-events-none" />

                <div className="space-y-6 relative z-10">
                  <div>
                    <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest block mb-1">Projected Annual Savings</span>
                    <p className="text-4xl md:text-5xl font-black text-foreground">
                      ₹{calculations.annualNetSavings.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-foreground/40 mt-1">Calculated from speed conversion boost & bypassed fees</p>
                  </div>

                  <div className="space-y-3 border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-foreground/50">Speed Conversion Lift</span>
                      <span className="font-bold text-green-400 flex items-center gap-1">
                        <TrendingUp size={12} />
                        {conversionRate}% → {calculations.newConversionRate}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-foreground/50">Annual Speed Revenue Gain</span>
                      <span className="font-bold text-foreground">
                        +₹{(calculations.monthlyRevenueLift * 12).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-foreground/50">Platform Tech Costs (Annual)</span>
                      <span className="font-bold text-red-400">
                        ₹{(calculations.totalPlatformCostMonthly * 12).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-foreground/50">Headless Costs (Annual)</span>
                      <span className="font-bold text-green-400">
                        ₹{(calculations.totalHeadlessCostMonthly * 12).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar Chart styled in CSS */}
                  <div className="space-y-2 pt-2">
                    <div className="text-[9px] sm:text-[10px] text-foreground/40 font-bold uppercase tracking-wider">Estimated Tech Costs Comparison</div>
                    <div className="space-y-1">
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="bg-red-400 h-full rounded-full" style={{ width: "100%" }} />
                      </div>
                      <div className="flex justify-between text-[8px] sm:text-[9px] text-foreground/30">
                        <span>Current Stack Costs</span>
                        <span>100%</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-400 h-full rounded-full" style={{ width: `${Math.max(10, (calculations.totalHeadlessCostMonthly / calculations.totalPlatformCostMonthly) * 100)}%` }} />
                      </div>
                      <div className="flex justify-between text-[8px] sm:text-[9px] text-foreground/30">
                        <span>Headless Jamstack Costs</span>
                        <span>{Math.round((calculations.totalHeadlessCostMonthly / calculations.totalPlatformCostMonthly) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 relative z-10">
                  <div className="flex items-center justify-between text-xs p-3 bg-brand-primary/5 border border-brand-primary/20 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-brand-primary" />
                      <span className="text-foreground/70">Breakeven timeline</span>
                    </div>
                    <span className="font-bold text-brand-primary">{calculations.breakEvenMonths} months</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lead capture hook card */}
            <div className="mt-8 space-y-6">
              <ResultSummary 
                title="Calculated ROI"
                metrics={[
                  { label: "Annual Net Savings", value: `₹${calculations.annualNetSavings.toLocaleString('en-IN')}` },
                  { label: "Break-even Timeline", value: `${calculations.breakEvenMonths} Months` },
                  { label: "Projected Speed Conversion Lift", value: `+₹${Math.round(calculations.monthlyRevenueLift * 12).toLocaleString('en-IN')} / year` },
                ]}
              />

              <LeadCaptureCTA
                title="Unlock Migration Roadmap & Detailed Audit"
                description="Enter your details to generate a highly detailed, printable PDF breakdown including headless checkout integration paths and full scaling analysis."
                buttonLabel="Unlock Roadmap PDF"
                toolName="Headless ROI Calculator"
                pagePath="/tools/headless-roi"
                resultData={{
                  monthlySales,
                  aov,
                  platform: platform.name,
                  conversionRate,
                  calculations
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <ContactFooter />
    </main>
  );
}
