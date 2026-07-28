import { Lead, LeadSubmissionResult } from "@/lib/lead/types";

export interface CRMProvider {
  createLead(lead: Lead): Promise<LeadSubmissionResult>;
  updateLead?(id: string, data: Partial<Lead>): Promise<LeadSubmissionResult>;
  healthCheck?(): Promise<boolean>;
}
