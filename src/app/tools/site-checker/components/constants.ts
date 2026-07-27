export interface ScanRecord {
  url: string;
  strategy: string;
  timestamp: number;
  overall: string;
  perf: number;
  seoScore: number;
}

export const perfSteps = [
  "Requesting Google PageSpeed Insights...",
  "Measuring Largest Contentful Paint (LCP)...",
  "Evaluating Interaction to Next Paint (INP)...",
  "Checking Cumulative Layout Shift (CLS)...",
  "Analyzing server response time (TTFB)...",
  "Scoring performance & SEO...",
  "PageSpeed report ready!",
];

export const seoSteps = [
  "Connecting to server...",
  "Locating sitemap.xml & robots.txt...",
  "Parsing XML URL node tree...",
  "Auditing meta titles & descriptions...",
  "Analyzing JSON-LD structured schemas...",
  "Checking HTTP status codes & redirects...",
  "Verifying heading hierarchy & indexability...",
  "Compiling structured crawl report...",
];

export const metricInfo: Record<string, string> = {
  LCP: "Largest Contentful Paint measures when the main content of a page is likely loaded. Good is < 2.5s.",
  INP: "Interaction to Next Paint measures interaction responsiveness across the entire page lifecycle. Good is < 200ms.",
  CLS: "Cumulative Layout Shift measures the visual stability of a page's layout. Good is < 0.1.",
  TTFB: "Time to First Byte measures the latency of the network request before receiving the first byte. Good is < 0.8s.",
  FCP: "First Contentful Paint measures when the browser renders the first piece of DOM content. Good is < 1.8s.",
  TBT: "Total Blocking Time measures the total duration of blocking JavaScript between FCP and TBT. Good is < 200ms.",
  SI: "Speed Index measures how quickly content is visually displayed during page load. Good is < 3.4s.",
};

export const HISTORY_KEY = "seo-scan-history";
export const MAX_HISTORY = 10;

export function loadHistory(): ScanRecord[] {
  if (typeof window === "undefined") return [];
  try { const raw = localStorage.getItem(HISTORY_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}

export function getLetterGrade(score: number): { letter: string; color: string } {
  if (score >= 90) return { letter: "A", color: "text-[#10b981]" };
  if (score >= 75) return { letter: "B", color: "text-[#14b8a6]" };
  if (score >= 60) return { letter: "C", color: "text-amber-400" };
  if (score >= 40) return { letter: "D", color: "text-orange-400" };
  return { letter: "F", color: "text-red-400" };
}

export function getLabel(grade: string | null): string {
  switch (grade) {
    case "good": return "Good";
    case "needs-work": return "Needs Work";
    case "poor": return "Poor";
    default: return "—";
  }
}
