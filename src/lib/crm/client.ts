import { Lead, LeadSubmissionResult } from "@/lib/lead/types";
import { getCRMProvider } from "./provider";

export async function createLead(payload: Lead): Promise<LeadSubmissionResult> {
  const provider = getCRMProvider();
  return provider.createLead(payload);
}
