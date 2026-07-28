import { CRMProvider } from "./types";
import { Lead, LeadSubmissionResult } from "@/lib/lead/types";
import { mapLeadToCrmPayload } from "./crmMapper";

export class TwentyCRMProvider implements CRMProvider {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async createLead(lead: Lead): Promise<LeadSubmissionResult> {
    const payload = mapLeadToCrmPayload(lead);
    
    try {
      const response = await fetch(`${this.apiUrl}/person`, {
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
        return {
          success: false,
          message: `CRM Error: ${response.statusText}`,
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
        message: "Network error occurred while submitting to CRM",
      };
    }
  }

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
