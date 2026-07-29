import { Lead, LeadSubmissionResult } from "@/lib/lead/types";
import { getCRMProvider } from "./provider";

/**
 * High-level service abstraction for CRM operations.
 * Isolates the rest of the application from the specific CRM implementation.
 * 
 * @param payload - The structured, normalized Lead payload
 * @returns A standardized LeadSubmissionResult indicating success or failure
 */
export async function createLead(payload: Lead): Promise<LeadSubmissionResult> {
  const provider = getCRMProvider();
  return provider.createLead(payload);
}
