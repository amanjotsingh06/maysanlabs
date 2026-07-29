import { CRMProvider } from "./types";
import { Lead, LeadSubmissionResult } from "@/lib/lead/types";

/**
 * A dummy CRM provider used for local development, testing, or as a fallback.
 * Simulates network latency and logs payloads to the console instead of making real API requests.
 */
export class MockCRMProvider implements CRMProvider {
  /**
   * Simulates the creation of a lead by waiting 800ms and returning a success payload.
   * Logs the incoming lead to the server console for debugging.
   */
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
