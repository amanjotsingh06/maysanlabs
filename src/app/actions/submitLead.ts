"use server";
// Note: This is an action file, the component is below

import { createLead } from "@/lib/crm/client";
import { LeadSchema } from "@/lib/lead/validation";
import { LeadSubmissionResult } from "@/lib/lead/types";

/**
 * Next.js Server Action responsible for receiving lead submissions from the frontend.
 * Validates the raw payload using Zod and delegates to the CRM infrastructure layer.
 * 
 * @param payload - The untyped raw payload from the client form
 * @returns A promise resolving to a LeadSubmissionResult
 */
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
