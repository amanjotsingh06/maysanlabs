"use server";
// Note: This is an action file, the component is below

import { createLead } from "@/lib/crm/client";
import { LeadSchema } from "@/lib/lead/validation";
import { LeadSubmissionResult } from "@/lib/lead/types";

export async function submitLead(payload: unknown): Promise<LeadSubmissionResult> {
  try {
    const validationResult = LeadSchema.safeParse(payload);
    
    if (!validationResult.success) {
      console.error("[submitLead] Validation failed:", validationResult.error.format());
      return {
        success: false,
        message: "Invalid submission data. Please check the fields and try again.",
      };
    }

    const validatedLead = validationResult.data;
    const result = await createLead(validatedLead);
    return result;

  } catch (error) {
    console.error("[submitLead] Unexpected error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
