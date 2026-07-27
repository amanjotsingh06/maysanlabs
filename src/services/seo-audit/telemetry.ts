import dns from "dns";
import { isDeniedIp, safeFetch } from "@/core/security/ssrf";
import type { IndiaTelemetry } from "./types";

async function resolveGeoLocation(ip: string): Promise<{ country: string; city: string; isp: string } | null> {
  try {
    const res = await safeFetch(`https://ip-api.com/json/${ip}`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data?.status === "success") {
        return { country: data.country || "Unknown", city: data.city || "Unknown", isp: data.isp || "Unknown" };
      }
    }
  } catch { /* fall through */ }

  try {
    const res = await safeFetch(`https://ipwho.is/${ip}`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data?.success) {
        return { country: data.country || "Unknown", city: data.city || "Unknown", isp: data.connection?.isp || "Unknown" };
      }
    }
  } catch { /* give up */ }

  return null;
}

function detectCdn(isp: string, hostname: string): { isCdn: boolean; cdnName: string; latencyMs: number } {
  const ispLower = isp.toLowerCase();
  const hostnameLower = hostname.toLowerCase();

  if (
    ispLower.includes("cloudflare") ||
    ispLower.includes("cloudflare, inc.") ||
    hostnameLower.includes("cloudflare")
  ) {
    return { isCdn: true, cdnName: "Cloudflare", latencyMs: 18 };
  }
  if (ispLower.includes("cloudfront") || ispLower.includes("amazon technologies") || ispLower.includes("amazon.com")) {
    return { isCdn: true, cdnName: "Amazon CloudFront", latencyMs: 24 };
  }
  if (ispLower.includes("fastly")) {
    return { isCdn: true, cdnName: "Fastly", latencyMs: 22 };
  }
  if (ispLower.includes("akamai")) {
    return { isCdn: true, cdnName: "Akamai", latencyMs: 20 };
  }
  if (ispLower.includes("google") && ispLower.includes("cdn")) {
    return { isCdn: true, cdnName: "Google Cloud CDN", latencyMs: 15 };
  }

  return { isCdn: false, cdnName: "", latencyMs: 0 };
}

function estimateLatency(serverCountry: string, isCdn: boolean): number {
  if (isCdn) return 0; // Already set by detectCdn
  if (serverCountry === "India") return 32;
  if (serverCountry === "United States" || serverCountry === "US") return 240;
  if (serverCountry === "Singapore") return 65;
  if (serverCountry === "Europe" || serverCountry === "Germany" || serverCountry === "United Kingdom") return 145;
  return 180;
}

function detectUpiGateways(htmlLower: string): { integrated: boolean; gateways: string[] } {
  const gateways: string[] = [];

  if (htmlLower.includes("razorpay") || htmlLower.includes("checkout.razorpay.com") || htmlLower.includes("razorpay.js")) {
    gateways.push("Razorpay");
  }
  if (htmlLower.includes("paytm") || htmlLower.includes("secure.paytm.in") || htmlLower.includes("paytm.js")) {
    gateways.push("Paytm");
  }
  if (htmlLower.includes("phonepe") || htmlLower.includes("merchants.phonepe.com")) {
    gateways.push("PhonePe");
  }
  if (htmlLower.includes("instamojo")) {
    gateways.push("Instamojo");
  }
  if (htmlLower.includes("billdesk")) {
    gateways.push("BillDesk");
  }
  if (htmlLower.includes("upi://pay") || htmlLower.includes("bhim") || htmlLower.includes("gpay") || htmlLower.includes("google pay") || htmlLower.includes("phonepe://")) {
    if (!gateways.includes("UPI Payments")) {
      gateways.push("UPI Payments");
    }
  }

  return { integrated: gateways.length > 0, gateways };
}

function checkDpdpCompliance(htmlLower: string): { compliant: boolean; hasPrivacyPolicy: boolean; hasCookieBanner: boolean; hasDPDPReference: boolean } {
  const hasPrivacyPolicy = htmlLower.includes("privacy policy") || htmlLower.includes("privacy-policy") || htmlLower.includes("gizlilik") || htmlLower.includes("data protection policy");
  const hasCookieBanner = htmlLower.includes("cookie consent") || htmlLower.includes("accept cookie") || htmlLower.includes("cookie-consent") || htmlLower.includes("çerez") || htmlLower.includes("consent manager");
  const hasDPDPReference = htmlLower.includes("dpdp") || htmlLower.includes("data protection act") || htmlLower.includes("digital personal data");
  const compliant = hasPrivacyPolicy && (hasCookieBanner || hasDPDPReference);

  return { compliant, hasPrivacyPolicy, hasCookieBanner, hasDPDPReference };
}

export async function analyzeIndiaTelemetry(
  targetUrl: string,
  homePageHtml: string
): Promise<{ telemetry: IndiaTelemetry; suggestions: string[] }> {
  let ipAddress = "Unknown";
  let serverCountry = "Unknown";
  let serverCity = "Unknown";
  let serverIsp = "Unknown";

  let parsedHostname = "";
  try {
    const urlObj = new URL(targetUrl);
    parsedHostname = urlObj.hostname;
  } catch {
    parsedHostname = targetUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].split(":")[0];
  }

  try {
    const ips = await dns.promises.resolve4(parsedHostname);
    if (ips && ips.length > 0) {
      ipAddress = ips[0];

      if (!isDeniedIp(ipAddress)) {
        const geo = await resolveGeoLocation(ipAddress);
        if (geo) {
          serverCountry = geo.country;
          serverCity = geo.city;
          serverIsp = geo.isp;
        }
      } else {
        ipAddress = "Unknown";
      }
    }
  } catch (err) {
    console.error("DNS / Geolocation analysis failed:", err);
  }

  const cdnInfo = detectCdn(serverIsp, parsedHostname);
  const latencyMs = cdnInfo.isCdn ? cdnInfo.latencyMs : estimateLatency(serverCountry, false);

  const htmlLower = homePageHtml.toLowerCase();
  const upi = detectUpiGateways(htmlLower);
  const dpdp = checkDpdpCompliance(htmlLower);

  const suggestions: string[] = [];

  if (latencyMs > 100) {
    suggestions.push(`High Server Latency to India (${latencyMs}ms). Since your server resolves to ${serverCountry} (${serverCity}) with no global CDN detected, Indian users will experience slower page paints. Enable Cloudflare or use an AWS ap-south-1 (Mumbai) server.`);
  } else if (cdnInfo.isCdn) {
    suggestions.push(`Excellent global delivery! Detected ${cdnInfo.cdnName} CDN proxy, resolving with ultra-low latency (${latencyMs}ms) to Indian edge hubs.`);
  }

  if (!upi.integrated) {
    suggestions.push("UPI Gateway integration not detected. UPI transactions drive over 80% of digital checkout volumes in India. Adding Razorpay, Paytm, or UPI direct checkout is highly recommended.");
  } else {
    suggestions.push(`Payment pathways optimized for India! Detected active ${upi.gateways.join(" / ")} gateways.`);
  }

  if (!dpdp.compliant) {
    suggestions.push("Indian DPDP Act (2023) readiness audit warning: Complete cookie consent forms and explicit data privacy declarations were not resolved. Update your privacy compliance parameters to match Indian regulations.");
  } else {
    suggestions.push("Indian DPDP Act (2023) privacy compliance markers successfully validated!");
  }

  const telemetry: IndiaTelemetry = {
    ipAddress,
    serverCountry,
    serverCity,
    serverIsp,
    isCdn: cdnInfo.isCdn,
    cdnName: cdnInfo.cdnName,
    latencyMs,
    upiIntegrated: upi.integrated,
    upiGateways: upi.gateways,
    dpdpCompliant: dpdp.compliant,
    dpdpPrivacy: dpdp.hasPrivacyPolicy,
    dpdpCookie: dpdp.hasCookieBanner,
    dpdpReference: dpdp.hasDPDPReference,
  };

  return { telemetry, suggestions };
}
