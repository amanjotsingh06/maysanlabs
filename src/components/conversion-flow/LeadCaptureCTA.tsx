"use client";

import { Mail } from "lucide-react";
import LeadCaptureForm, { LeadCaptureFormProps } from "./LeadCaptureForm";

interface LeadCaptureCTAProps extends Omit<LeadCaptureFormProps, "buttonLabel" | "buttonIcon"> {
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
}

export default function LeadCaptureCTA({
  title = "Book a Free Discovery Call",
  description = "Want our engineering team to turn this blueprint into reality? Submit your details to receive expert guidance tailored to your business.",
  buttonLabel = "Book Free Discovery Call",
  buttonIcon,
  ...formProps
}: LeadCaptureCTAProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 bg-brand-primary/5 border border-brand-primary/20 p-4 rounded-xl">
        <Mail className="text-brand-primary shrink-0 mt-1" size={20} />
        <div>
          <p className="text-xs font-bold text-foreground mb-1">{title}</p>
          <p className="text-[10px] text-foreground/70 leading-relaxed">{description}</p>
        </div>
      </div>

      <LeadCaptureForm 
        buttonLabel={buttonLabel}
        buttonIcon={buttonIcon}
        {...formProps} 
      />
    </div>
  );
}
