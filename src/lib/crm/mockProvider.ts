import { CRMProvider } from "./types";
import { Lead, LeadSubmissionResult } from "@/lib/lead/types";

export class MockCRMProvider implements CRMProvider {
  async createLead(lead: Lead): Promise<LeadSubmissionResult> {
    console.log("[MockCRMProvider] Creating lead...", lead);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simulate success
    return {
      success: true,
      message: "Lead created successfully (Mock)",
      leadId: `mock-lead-${Date.now()}`
    };
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}
