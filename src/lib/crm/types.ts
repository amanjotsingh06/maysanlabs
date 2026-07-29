import { Lead, LeadSubmissionResult } from "@/lib/lead/types";

/**
 * Interface defining the contract for all CRM integrations.
 * Any new CRM (HubSpot, Salesforce, etc.) must implement this interface
 * to be usable by the Lead Submission Service.
 */
export interface CRMProvider {
  createLead(lead: Lead): Promise<LeadSubmissionResult>;
  updateLead?(id: string, data: Partial<Lead>): Promise<LeadSubmissionResult>;
  healthCheck?(): Promise<boolean>;
}
