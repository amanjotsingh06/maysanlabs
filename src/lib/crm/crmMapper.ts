import { Lead } from "@/lib/lead/types";

// This is an example mapper for a generic or specific CRM (e.g. Twenty)
export function mapLeadToCrmPayload(lead: Lead): Record<string, unknown> {
  return {
    name: lead.lead.name,
    email: lead.lead.email,
    company: lead.lead.companyName,
    phone: lead.lead.phone,
    source_tool: lead.source.tool,
    source_page: lead.source.page,
    source_channel: lead.source.channel,
    result_data: JSON.stringify(lead.result), // Flatten complex objects if CRM requires flat structures
    created_at: lead.metadata.submittedAt,
    user_agent: lead.metadata.userAgent,
    referrer: lead.metadata.referrer,
  };
}
