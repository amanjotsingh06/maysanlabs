import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/core/rate-limit";
import { safeFetch } from "@/core/security/ssrf";
import type { WebVitalResult } from "@/types/pagespeed";

const cacheMap = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin') || request.headers.get('referer') || '';
  const allowedOrigins = [
    'https://maysanlabs.com', 
    'https://www.maysanlabs.com', 
    'http://localhost:3000', 
    'http://localhost:3001'
  ];
  if (origin && !allowedOrigins.some(o => origin.startsWith(o))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rateCheck = checkRateLimit(`pagespeed:${ip}`, 10, 60 * 1000);
  if (!rateCheck.allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429, headers: { "Retry-After": String(rateCheck.retryAfter) } });
  }

  try {
    const body = await request.json();
    const { url, strategy = "mobile" } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const fullUrl = url.startsWith("http") ? url : `https://${url}`;

    const cacheKey = `${fullUrl}:${strategy}`;
    const cached = cacheMap.get(cacheKey);
    if (cached && Date.now() < cached.expiry) {
      return NextResponse.json(cached.data);
    }

    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "PageSpeed API key not configured" }, { status: 500 });
    }

    const params = new URLSearchParams();
    params.append("url", fullUrl);
    if (apiKey) {
      params.append("key", apiKey);
    }
    params.append("strategy", strategy);
    params.append("category", "performance");
    params.append("category", "seo");
    params.append("category", "accessibility");
    params.append("category", "best-practices");

    // Multi-category Lighthouse scans via PageSpeed API are intensive and frequently take 20-35s.
    // Set a robust timeout (90s) to allow slow Google server responses without timing out.
    const psiRes = await safeFetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`,
      { signal: AbortSignal.timeout(90000), maxMs: 90000 }
    );

    if (!psiRes.ok) {
      let errMsg = `PageSpeed API returned ${psiRes.status}.`;
      try {
        const errBody = await psiRes.json();
        errMsg += ` ${errBody.error?.message || JSON.stringify(errBody)}`;
      } catch {
        const errText = await psiRes.text().catch(() => "");
        if (errText) errMsg += ` ${errText.slice(0, 200)}`;
      }
      console.error("[PageSpeed] API error:", errMsg);
      return NextResponse.json({ error: errMsg }, { status: 502 });
    }

    const data = await psiRes.json();
    const audits = data.lighthouseResult?.audits || {};
    const categories = data.lighthouseResult?.categories || {};

    const numericValue = (id: string): number | null =>
      audits[id]?.numericValue ?? null;

    const lcpMs = numericValue("largest-contentful-paint");
    const inpMs = numericValue("interaction-to-next-paint");
    const clsRaw = numericValue("cumulative-layout-shift");
    const ttfbMs = numericValue("time-to-first-byte");
    const fcpMs = numericValue("first-contentful-paint");
    const tbtMs = numericValue("total-blocking-time");
    const siMs = numericValue("speed-index");
    const perfScore = categories.performance?.score ?? 0;
    const seoScore = categories.seo?.score ?? 0;
    const accessScore = categories.accessibility?.score ?? null;
    const bpScore = categories["best-practices"]?.score ?? null;

    const round = (v: number, d: number) => Math.round(v * 10 ** d) / 10 ** d;

    const grade = (v: number, good: number, poor: number): "good" | "needs-work" | "poor" =>
      v <= good ? "good" : v <= poor ? "needs-work" : "poor";

    const suggestions: string[] = [];

    if (lcpMs !== null) {
      suggestions.push(
        lcpMs > 2500
          ? "Optimize hero images by converting to WebP/AVIF and lazy-loading below-the-fold content."
          : "Your LCP is healthy. Consider using a CDN for even faster delivery."
      );
    }
    if (clsRaw !== null) {
      suggestions.push(
        clsRaw > 0.1
          ? "Add explicit width/height attributes to all images and reserve space for dynamic embeds."
          : "Layout shift is well-controlled. Keep using explicit dimensions for media elements."
      );
    }
    if (ttfbMs !== null) {
      suggestions.push(
        ttfbMs > 800
          ? "Server response time is slow. Consider upgrading hosting or using edge caching with a CDN."
          : "TTFB looks good. Edge caching can further improve global performance."
      );
    }
    if (inpMs !== null) {
      suggestions.push(
        inpMs > 200
          ? "Reduce JavaScript execution time by code-splitting and deferring non-critical scripts."
          : "Interactivity is responsive. Continue keeping main thread tasks lean."
      );
    }
    if (fcpMs !== null && fcpMs > 3000) {
      suggestions.push("First Contentful Paint is slow. Minimize render-blocking resources and reduce server response time.");
    }
    suggestions.push(
      "Enable text compression (Brotli/Gzip) to reduce transfer sizes by up to 70%.",
      "Implement resource hints (preload, preconnect, prefetch) for critical third-party origins."
    );

    const result: WebVitalResult = {
      url: fullUrl,
      strategy,
      lcp: {
        value: lcpMs !== null ? round(lcpMs / 1000, 1) : null,
        grade: lcpMs !== null ? grade(lcpMs / 1000, 2.5, 4.0) : null,
      },
      inp: {
        value: inpMs !== null ? Math.round(inpMs) : null,
        grade: inpMs !== null ? grade(inpMs, 200, 500) : null,
      },
      cls: {
        value: clsRaw !== null ? round(clsRaw, 2) : null,
        grade: clsRaw !== null ? grade(clsRaw, 0.1, 0.25) : null,
      },
      ttfb: {
        value: ttfbMs !== null ? round(ttfbMs / 1000, 1) : null,
        grade: ttfbMs !== null ? grade(ttfbMs / 1000, 0.8, 1.8) : null,
      },
      fcp: {
        value: fcpMs !== null ? round(fcpMs / 1000, 1) : null,
        grade: fcpMs !== null ? grade(fcpMs / 1000, 1.8, 3.0) : null,
      },
      tbt: {
        value: tbtMs !== null ? Math.round(tbtMs) : null,
        grade: tbtMs !== null ? grade(tbtMs, 200, 600) : null,
      },
      si: {
        value: siMs !== null ? round(siMs / 1000, 1) : null,
        grade: siMs !== null ? grade(siMs / 1000, 3.4, 5.8) : null,
      },
      mobile: Math.round(perfScore * 100),
      seo: Math.round(seoScore * 100),
      performance: Math.round(perfScore * 100),
      accessibility: accessScore !== null ? Math.round(accessScore * 100) : null,
      bestPractices: bpScore !== null ? Math.round(bpScore * 100) : null,
      suggestions,
    };

    cacheMap.set(cacheKey, { data: result, expiry: Date.now() + CACHE_TTL_MS });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[PageSpeed] Error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
