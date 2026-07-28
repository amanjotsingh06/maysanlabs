import { CRMProvider } from "./types";
import { MockCRMProvider } from "./mockProvider";
import { TwentyCRMProvider } from "./twentyProvider";

export function getCRMProvider(): CRMProvider {
  const providerName = process.env.CRM_PROVIDER?.toLowerCase() || "mock";
  
  if (providerName === "twenty") {
    const apiUrl = process.env.CRM_API_URL;
    const apiKey = process.env.CRM_API_KEY;
    if (!apiUrl || !apiKey) {
      console.warn("CRM_API_URL or CRM_API_KEY missing for Twenty. Falling back to Mock.");
      return new MockCRMProvider();
    }
    return new TwentyCRMProvider(apiUrl, apiKey);
  }

  // Add more providers here as needed (e.g., HubSpot, Salesforce)
  // if (providerName === 'hubspot') { ... }

  return new MockCRMProvider();
}
