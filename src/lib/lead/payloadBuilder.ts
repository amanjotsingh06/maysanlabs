import { Lead } from "./types";

interface BuildLeadParams {
  name: string;
  email: string;
  companyName: string;
  phone?: string;
  tool: string;
  page: string;
  channel?: string;
  result: Record<string, unknown>;
}

/**
 * Constructs a fully normalized Lead payload object ready for validation and CRM mapping.
 * Automatically injects necessary metadata such as submission timestamps.
 * 
 * @param params - The raw lead parameters captured from the frontend component
 * @returns A structured Lead object
 */
export function buildLeadPayload(params: BuildLeadParams): Lead {
  return {
    lead: {
      name: params.name,
      email: params.email,
      companyName: params.companyName,
      phone: params.phone,
    },
    source: {
      tool: params.tool,
      page: params.page,
      channel: params.channel,
    },
    result: params.result,
    metadata: {
      submittedAt: new Date().toISOString(),
      // In a real browser environment, these could be populated from window/document
      // userAgent: typeof window !== "undefined" ? window.navigator.userAgent : undefined,
      // referrer: typeof document !== "undefined" ? document.referrer : undefined,
    },
  };
}
