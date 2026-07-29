"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calculator, ChevronRight, ChevronLeft, Calendar } from "lucide-react";
import { LeadCaptureCTA, ResultSummary } from "@/components/conversion-flow";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import ContactFooter from "@/components/layout/footer";

const appTypes = [
  { id: "saas", name: "Multi-Tenant B2B SaaS", baseCost: 1200000, timelineWeeks: 12, desc: "Sub-organizations, subscription models, scalable backends." },
  { id: "commerce", name: "Headless D2C Commerce Store", baseCost: 1000000, timelineWeeks: 10, desc: "Medusa/Shopify APIs, custom cart engines, Stripe gateways." },
  { id: "ai", name: "Autonomous AI-Powered Portal", baseCost: 1500000, timelineWeeks: 14, desc: "Custom LLMs, vector-database RAG pipelines, agents integration." },
  { id: "dashboard", name: "Enterprise Customer Dashboard", baseCost: 800000, timelineWeeks: 8, desc: "High-performance charts, complex operations, secure roles." },
];

const featureModules = [
  { id: "auth", name: "Advanced Authentication & Roles", cost: 150000, timelineWeeks: 1, desc: "RBAC permissions, OAuth integrations, 2FA profiles." },
  { id: "billing", name: "Subscription & Invoicing Billing", cost: 200000, timelineWeeks: 2, desc: "Stripe/Paddle engines, custom tiered subscriptions." },
  { id: "charts", name: "Analytics & Custom Reporting", cost: 300000, timelineWeeks: 2, desc: "Interactive charts, exports (PDF/CSV), background processing." },
  { id: "ai-rag", name: "LLM/RAG Vector Integration", cost: 500000, timelineWeeks: 3, desc: "Knowledge graphs, vector db connections, semantic searches." },
  { id: "chat", name: "Real-time Collaboration & Chat", cost: 350000, timelineWeeks: 2, desc: "Websockets, presence updates, notification dispatchers." },
  { id: "mobile", name: "iOS & Android Companion App", cost: 800000, timelineWeeks: 4, desc: "React Native custom cross-platform mobile bundles." },
];

const infraOptions = [
  { id: "high-avail", name: "High-Availability Multi-Node SLA", cost: 400000, timelineWeeks: 2, desc: "AWS clusters, auto-scaling, disaster recovery layers." },
  { id: "compliance", name: "HIPAA / ISO 27001 Security Ready", cost: 600000, timelineWeeks: 3, desc: "Deep audits trails, encrypted databases, locked systems." },
];

export default function ScopeEstimatorClient() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedApp, setSelectedApp] = useState(appTypes[0].id);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedInfra, setSelectedInfra] = useState<string[]>([]);
  const [acceleratedTimeline, setAcceleratedTimeline] = useState(false);

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleInfra = (id: string) => {
    setSelectedInfra((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const estimates = useMemo(() => {
    const app = appTypes.find((a) => a.id === selectedApp) || appTypes[0];
    let totalCost = app.baseCost;
    let totalTimeline = app.timelineWeeks;

    selectedFeatures.forEach((featId) => {
      const feat = featureModules.find((f) => f.id === featId);
      if (feat) {
        totalCost += feat.cost;
        totalTimeline += feat.timelineWeeks;
      }
    });

    selectedInfra.forEach((infraId) => {
      const inf = infraOptions.find((i) => i.id === infraId);
      if (inf) {
        totalCost += inf.cost;
        totalTimeline += inf.timelineWeeks;
      }
    });

    if (acceleratedTimeline) {
      // Timeline acceleration reduces delivery duration by 30% but adds 25% rush costs
      totalCost = Math.round(totalCost * 1.25);
      totalTimeline = Math.round(totalTimeline * 0.7);
    }

    return {
      minCost: Math.round(totalCost * 0.9),
      maxCost: Math.round(totalCost * 1.15),
      timelineWeeks: totalTimeline,
    };
  }, [selectedApp, selectedFeatures, selectedInfra, acceleratedTimeline]);


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
                Requirements Estimator
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Software Cost & <span className="text-brand-primary">Scoping Estimator</span>
              </h1>
              <p className="text-foreground/50 max-w-2xl mx-auto text-sm md:text-base">
                Select the features you want in your custom application to instantly calculate a detailed cost breakdown and delivery timeline.
              </p>
            </motion.div>

            {/* Stepper Progress Bar */}
            <div className="flex items-center justify-between max-w-full sm:max-w-md mx-auto mb-10">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep >= step
                      ? "bg-brand-primary text-black"
                      : "bg-white/[0.05] text-foreground/30 border border-white/10"
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-12 h-0.5 mx-2 ${currentStep > step ? "bg-brand-primary" : "bg-white/5"}`} />
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
              {/* Stepper Area */}
              <div className="lg:col-span-7 card-glass rounded-3xl p-6 md:p-8 min-h-[400px] flex flex-col justify-between card-hover">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-lg font-bold text-foreground mb-4">1. Select Application Architecture</h3>
                      <div className="space-y-3" role="radiogroup" aria-label="Application architectures">
                        {appTypes.map((app) => (
                          <button
                            key={app.id}
                            role="radio"
                            aria-checked={selectedApp === app.id}
                            onClick={() => setSelectedApp(app.id)}
                            className={`w-full p-4 rounded-xl text-left border transition-all ${
                              selectedApp === app.id
                                ? "bg-brand-primary/10 border-brand-primary/40 text-foreground"
                                : "bg-black/20 border-white/5 hover:border-white/10 text-foreground/60"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-sm">{app.name}</span>
                              <span className="text-[10px] sm:text-xs text-brand-primary font-mono bg-brand-primary/5 px-2 py-0.5 rounded">
                                Base ~₹{app.baseCost.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <p className="text-[11px] text-foreground/45 leading-relaxed">{app.desc}</p>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-lg font-bold text-foreground mb-4">2. Select Premium Feature Modules</h3>
                      <div className="space-y-3">
                        {featureModules.map((feat) => (
                          <button
                            key={feat.id}
                            onClick={() => toggleFeature(feat.id)}
                            className={`w-full p-4 rounded-xl text-left border transition-all ${
                              selectedFeatures.includes(feat.id)
                                ? "bg-brand-primary/10 border-brand-primary/40 text-foreground"
                                : "bg-black/20 border-white/5 hover:border-white/10 text-foreground/60"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-sm">{feat.name}</span>
                              <span className="text-[10px] sm:text-xs text-brand-primary font-mono bg-brand-primary/5 px-2 py-0.5 rounded">
                                +₹{feat.cost.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <p className="text-[11px] text-foreground/45 leading-relaxed">{feat.desc}</p>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-lg font-bold text-foreground mb-4">3. Scaling & Compliance</h3>
                      <div className="space-y-4">
                        <div className="space-y-3">
                          {infraOptions.map((inf) => (
                            <button
                              key={inf.id}
                              onClick={() => toggleInfra(inf.id)}
                              className={`w-full p-4 rounded-xl text-left border transition-all ${
                                selectedInfra.includes(inf.id)
                                  ? "bg-brand-primary/10 border-brand-primary/40 text-foreground"
                                  : "bg-black/20 border-white/5 hover:border-white/10 text-foreground/60"
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-sm">{inf.name}</span>
                                <span className="text-[10px] sm:text-xs text-brand-primary font-mono bg-brand-primary/5 px-2 py-0.5 rounded">
                                  +₹{inf.cost.toLocaleString('en-IN')}
                                </span>
                              </div>
                              <p className="text-[11px] text-foreground/45 leading-relaxed">{inf.desc}</p>
                            </button>
                          ))}
                        </div>

                        {/* accelerated Timeline option */}
                        <div className="p-4 bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-foreground block">Accelerate Timeline Delivery</span>
                            <span className="text-[10px] text-foreground/40 leading-relaxed block max-w-sm">
                              Accelerate delivery by ~30% utilizing dual parallel pipelines (+25% rush premium).
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={acceleratedTimeline}
                            onChange={(e) => setAcceleratedTimeline(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer accent-brand-primary"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-lg font-bold text-foreground mb-4">4. Scoping Lead Submission</h3>
                      
                      <div className="mb-6">
                        <ResultSummary 
                          title="Scoping Summary"
                          metrics={[
                            { label: "Estimated Budget", value: `₹${estimates.minCost.toLocaleString('en-IN')} - ₹${estimates.maxCost.toLocaleString('en-IN')}` },
                            { label: "Timeline", value: `${estimates.timelineWeeks} Weeks` },
                            { label: "Architecture", value: appTypes.find((a) => a.id === selectedApp)?.name || "Custom App" },
                            { label: "Features Selected", value: selectedFeatures.length.toString() },
                          ]}
                        />
                      </div>
                      
                      <LeadCaptureCTA
                        title="Lock in Your Pricing & Receive PDF Checklist"
                        description="Want our engineering team to turn this blueprint into reality? Submit your details to receive expert guidance."
                        buttonLabel="Unlock Detailed Cost Breakdown"
                        toolName="App Cost Estimator"
                        pagePath="/tools/scope-estimator"
                        resultData={{
                          appType: appTypes.find((a) => a.id === selectedApp)?.name,
                          features: selectedFeatures,
                          infra: selectedInfra,
                          acceleratedTimeline,
                          estimatedMinCost: estimates.minCost,
                          estimatedMaxCost: estimates.maxCost,
                          timelineWeeks: estimates.timelineWeeks
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Back and Next Controls */}
                <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-6">
                  {currentStep > 1 && currentStep < 4 ? (
                    <button
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      className="inline-flex items-center gap-1.5 text-xs text-foreground/50 hover:text-foreground transition-all"
                    >
                      <ChevronLeft size={16} />
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 4 ? (
                    <button
                      onClick={() => setCurrentStep((prev) => prev + 1)}
                      className="px-5 py-2.5 bg-white/50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 hover:border-brand-primary/40 dark:hover:border-brand-primary/30 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-sm hover:shadow-lg"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  ) : (
                    <div />
                  )}
                </div>
              </div>

              {/* Calculator Live Ticker Area */}
              <div className="lg:col-span-5 card-glass-accent rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden card-hover">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl pointer-events-none" />

                <div className="space-y-6 relative z-10">
                  <div>
                    <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest block mb-1">Live Estimated Budget</span>
                    <p className="text-3xl md:text-4xl font-black text-foreground">
                      ₹{estimates.minCost.toLocaleString('en-IN')} - ₹{estimates.maxCost.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] text-foreground/45 leading-relaxed mt-1">Estimate based on active scoping specifications. Actual line-item quote may vary.</p>
                  </div>

                  <div className="space-y-3 border-t border-white/10 pt-5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-foreground/50">Architectural Platform</span>
                      <span className="font-bold text-foreground">
                        {appTypes.find((a) => a.id === selectedApp)?.name}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-foreground/50">Modules Integrated</span>
                      <span className="font-bold text-foreground">
                        {selectedFeatures.length} Features
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-foreground/50">Infrastructure Scale</span>
                      <span className="font-bold text-foreground">
                        {selectedInfra.length} Node Configs
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-foreground/50">Timeline delivery</span>
                      <span className="font-bold text-brand-primary flex items-center gap-1.5">
                        <Calendar size={12} />
                        {estimates.timelineWeeks} Weeks (~{Math.round((estimates.timelineWeeks * 7) / 30)} months)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 relative z-10 text-center">
                  <p className="text-[9px] sm:text-[10px] text-foreground/30 leading-relaxed">
                    Custom scoping estimates configured live utilizing standard industry software development matrix parameters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactFooter />
    </main>
  );
}
