"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle, Briefcase, Code, Mail, Send, Loader2, AlertCircle } from "lucide-react";
import { submitLead } from "@/app/actions/submitLead";
import { buildLeadPayload } from "@/lib/lead/payloadBuilder";

const steps = [
  { id: 1, title: "Project Type", icon: Briefcase },
  { id: 2, title: "Requirements", icon: Code },
  { id: 3, title: "Contact", icon: Mail },
];

const projectTypes = [
  { id: "web", label: "Web Application", desc: "Custom web app development" },
  { id: "mobile", label: "Mobile App", desc: "iOS & Android development" },
  { id: "ecommerce", label: "E-Commerce", desc: "Online store development" },
  { id: "saas", label: "SaaS Product", desc: "Software as a service" },
  { id: "custom", label: "Custom Solution", desc: "Other custom development" },
];

const budgets = ["< ₹5 Lakhs", "₹5L - ₹15L", "₹15L - ₹50L", "₹50 Lakhs+", "Not sure yet"];

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: "",
    budget: "",
    description: "",
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = buildLeadPayload({
        name: formData.name,
        email: formData.email,
        companyName: formData.name, // User inputs Name/Company in same field
        phone: formData.phone,
        tool: "MultiStepForm",
        page: "/",
        result: {
          projectType: formData.projectType,
          budget: formData.budget,
          description: formData.description,
        },
      });

      const result = await submitLead(payload);

      if (result.success) {
        setIsSubmitted(true);
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "project_form_submit", projectType: formData.projectType, budget: formData.budget });
      } else {
        setError(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setError("Failed to send message. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center py-16"
      >
        <div className="w-20 h-20 rounded-full bg-brand-primary/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-brand-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">Thank You!</h3>
        <p className="text-foreground/50 mb-6">We&apos;ve received your request and will get back to you within 24 hours.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary rounded-full font-semibold text-sm text-black hover:shadow-[0_0_30px_rgba(26,109,214,0.5)] transition-all">
          Back to Home
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              currentStep >= step.id
                ? "bg-brand-primary text-black"
                : "bg-white/[0.05] text-foreground/30 border border-white/10"
            }`}>
              {currentStep > step.id ? <CheckCircle size={18} /> : <step.icon size={18} />}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-2 ${currentStep > step.id ? "bg-brand-primary" : "bg-white/5"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="card-glass rounded-2xl p-8">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 id="step1-heading" className="text-xl font-semibold text-foreground mb-6">What type of project?</h3>
              <div className="space-y-3" role="radiogroup" aria-labelledby="step1-heading">
                {projectTypes.map((type) => (
                  <button
                    key={type.id}
                    role="radio"
                    aria-checked={formData.projectType === type.id}
                    onClick={() => updateFormData("projectType", type.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      formData.projectType === type.id
                        ? "bg-brand-primary/10 border border-brand-primary/30"
                        : "bg-white/[0.02] border border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground font-medium">{type.label}</p>
                        <p className="text-foreground/40 text-sm">{type.desc}</p>
                      </div>
                      {formData.projectType === type.id && (
                        <CheckCircle size={20} className="text-brand-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-6">
                <label id="budget-label" className="text-foreground/40 text-sm mb-3 block">Budget Range</label>
                <div className="flex flex-wrap gap-2" role="group" aria-labelledby="budget-label">
                  {budgets.map((budget) => (
                    <button
                      key={budget}
                      onClick={() => updateFormData("budget", budget)}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        formData.budget === budget
                          ? "bg-brand-primary text-black"
                          : "bg-white/[0.03] text-foreground/60 border border-white/5 hover:border-white/10"
                      }`}
                    >
                      {budget}
                    </button>
                  ))}
                </div>
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
              <h3 id="step2-heading" className="text-xl font-semibold text-foreground mb-6">Tell us about your project</h3>
              <label htmlFor="project-description" className="sr-only">Project description</label>
              <textarea
                id="project-description"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                placeholder="Describe your project, goals, timeline, and any specific requirements..."
                rows={6}
                className="w-full bg-white/50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:border-brand-primary/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all resize-none"
              />
              <p className="text-foreground/30 text-sm mt-3">The more details you provide, the better we can help you.</p>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-xl font-semibold text-foreground mb-6">Your contact information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="text-foreground/40 text-sm mb-2 block">Name / Company *</label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    placeholder="John Doe / Acme Corp"
                    className="w-full bg-white/50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:border-brand-primary/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="text-foreground/40 text-sm mb-2 block">Email *</label>
                  <input
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-white/50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:border-brand-primary/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="text-foreground/40 text-sm mb-2 block">Phone (optional)</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    placeholder="+1 234 567 8900"
                    className="w-full bg-white/50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:border-brand-primary/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {currentStep > 1 ? (
            <button
              onClick={prevStep}
              className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 text-foreground/60 hover:text-foreground hover:border-white/20 transition-all"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          ) : (
            <div />
          )}
          
          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              disabled={currentStep === 1 && !formData.projectType}
              className="flex items-center gap-2 px-6 py-3 bg-brand-primary rounded-full font-semibold text-sm text-black hover:shadow-[0_0_30px_rgba(26,109,214,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.name || !formData.email}
              className="flex items-center gap-2 px-6 py-3 bg-brand-primary rounded-full font-semibold text-sm text-black hover:shadow-[0_0_30px_rgba(26,109,214,0.5)] transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Submit
                  <Send size={16} />
                </>
              )}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            role="alert"
            aria-live="polite"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400"
          >
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}