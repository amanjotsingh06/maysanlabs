"use server";
import { headers } from "next/headers";
import { checkRateLimit } from "@/core/rate-limit";
import { analyzeSitemap as analyzeSitemapImpl } from "@/services/seo-audit/orchestrator";
import type { SeoAuditResult } from "@/services/seo-audit/types";

export async function analyzeSitemap(sitemapUrl: string): Promise<SeoAuditResult> {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || headersList.get("x-real-ip") || "unknown";
  const rateCheck = checkRateLimit(`analyzeSitemap:${ip}`, 10, 60 * 1000);
  if (!rateCheck.allowed) {
    throw new Error("Too many requests. Please wait a moment.");
  }

  if (!sitemapUrl || typeof sitemapUrl !== "string" || sitemapUrl.trim().length === 0) {
    throw new Error("A valid URL is required");
  }

  try {
    return await analyzeSitemapImpl(sitemapUrl);
  } catch (error) {
    console.error("[analyzeSitemap] Audit failed:", error);
    throw new Error("SEO audit failed. Please try again.");
  }
}

export type {
  CheckedPage,
  IndiaTelemetry,
  SslCertInfo,
  SecurityAudit,
  SeoAuditResult,
} from "@/services/seo-audit/types";
