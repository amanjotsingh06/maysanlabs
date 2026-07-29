import { CRMProvider } from "./types";
import { Lead, LeadSubmissionResult } from "@/lib/lead/types";
import { mapLeadToCrmPayload } from "./crmMapper";

/**
 * Implementation of the CRMProvider interface for Twenty CRM.
 * Handles authentication and data submission to the Twenty REST API.
 */
export class TwentyCRMProvider implements CRMProvider {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  /**
   * Transforms a generic Lead object into a Twenty-specific payload and submits it to the /people endpoint.
   * 
   * @param lead - The generic Lead object captured from the frontend
   * @returns A promise resolving to a LeadSubmissionResult
   */
  async createLead(lead: Lead): Promise<LeadSubmissionResult> {
    const payload = mapLeadToCrmPayload(lead);
    
    try {
      const response = await fetch(`${this.apiUrl}/people`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("[TwentyCRMProvider] API Error:", errorData || response.statusText);

        // Handle Twenty CRM duplicate email error gracefully
        const isDuplicate = errorData?.messages?.some((msg: string) => 
          msg.toLowerCase().includes('duplicate')
        );

        if (isDuplicate) {
          return {
            success: false,
            message: "A request with this email has already been submitted. We'll be in touch soon!",
          };
        }

        return {
          success: false,
          message: "We encountered an issue processing your request. Please try again later.",
        };
      }

      const data = await response.json();
      return {
        success: true,
        message: "Lead created successfully",
        leadId: data.id || data.data?.id,
      };
    } catch (error) {
      console.error("[TwentyCRMProvider] Network Error:", error);
      return {
        success: false,
        message: "A network error occurred. Please check your connection and try again.",
      };
    }
  }

  /**
   * Pings the Twenty CRM health endpoint to verify connectivity and authentication.
   * 
   * @returns True if the CRM is reachable and credentials are valid, false otherwise.
   */
  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${this.apiUrl}/health`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
