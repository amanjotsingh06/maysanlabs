import { Lead } from "@/lib/lead/types";

/**
 * Maps our internal, normalized Lead object into the specific JSON schema required by Twenty CRM.
 * Translates standard fields into Twenty's complex objects (Full Name, Emails array, Phones array)
 * and formats custom fields to use camelCase API identifiers.
 * 
 * @param lead - The normalized lead object from the frontend
 * @returns A JSON object ready to be sent to Twenty CRM's /people endpoint
 */
export function mapLeadToCrmPayload(lead: Lead): Record<string, unknown> {
  // Split full name into first and last for Twenty's "Full Name" object
  const nameParts = lead.lead.name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ") || "";

  const payload: Record<string, unknown> = {
    name: {
      firstName,
      lastName,
    },
    emails: {
      primaryEmail: lead.lead.email,
      additionalEmails: []
    },
    
    // Twenty CRM automatically converts snake_case names in the UI to camelCase in the API!
    sourceTool: lead.source.tool,
    sourcePage: lead.source.page,
    sourceChannel: lead.source.channel || "",
    resultData: lead.result, 
    userAgent: lead.metadata.userAgent || "",
    referrer: lead.metadata.referrer || "",
    
    // Custom text field for Company Name 
    companyName: lead.lead.companyName, 
  };

  if (lead.lead.phone) {
    payload.phones = {
      primaryPhoneNumber: lead.lead.phone,
      primaryPhoneCountryCode: "",
      primaryPhoneCallingCode: "",
      additionalPhones: []
    };
  }

  return payload;
}
