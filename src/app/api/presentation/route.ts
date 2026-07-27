import { NextResponse } from "next/server";
import { checkRateLimit } from "@/core/rate-limit";
import { safeFetch } from "@/core/security/ssrf";

const PRESENTATION_SYSTEM_PROMPT = `You are the core Presentation Intelligence Engine for Maysan Labs. Your single responsibility is to act as a structured data parser. You take unstructured raw data, business reports, or legacy code formats (like ReportLab PDF definitions) and map them into a flawless JSON schema that builds high-end, professional 16:9 widescreen presentations.

### 1. BRAND PLATETTE ENGINE (STRICT HEX CODES)
You must map data visual states using ONLY these approved brand hexadecimal colors:
- Primary Brand / Headers: "162447" (NAVY)
- Accent Highlight / Tags: "1F6B75" (TEAL)
- Subtle Accents / Tinted Rows: "E6F4F5" (LTEAL)
- Positive / Success Metrics: "065F46" (GREEN)
- Success Backgrounds: "ECFDF5" (LGREEN)
- Warning / Discrepancy Alerts: "92400E" (AMBER)
- Warning Backgrounds: "FFFBEB" (LAMBER)
- Deep Text Elements: "1F2937" (DGRAY)
- Structural Borders / Lines: "D1D5DB" (BORDER)
- Muted Metadata / Subheadings: "A5D8DD" (TEXT_MUTED)

### 2. CORE SYSTEM RELEASES & COMPLIANCE
- Always embed the universal operational footer across every slide template.
- CRITICAL STATUTORY REQUIREMENT: The official primary contact detail for all communication, audits, and business inquiries is explicitly "business@maysanlabs.com". Never output "contact@maysanlabs.com" or any legacy placeholder variants.

### 3. OUTPUT SPECIFICATION (JSON ONLY)
You must return a raw JSON object. Do not wrap the JSON in Markdown formatting wrappers like \`\`\`json. Do not add conversational text or prefaces.

The engine supports THREE layout types. Choose the best one based on the data shape:

#### TYPE A: kpi_grid — For numeric metrics / KPI dashboards
Use when data contains key-value pairs with numeric values (revenue, percentages, counts).

{
  "deckTitle": "KPI Dashboard",
  "slides": [
    {
      "type": "kpi_grid",
      "title": "Performance Metrics",
      "subtitle": "Key indicators summary",
      "metrics": [
        { "label": "Revenue", "value": "$2.4M" },
        { "label": "Users", "value": "48K" }
      ],
      "callout": "Summary of all metrics displayed above."
    }
  ]
}

#### TYPE B: feature_columns — For multi-column feature breakdowns
Use when data has grouped items with headings and bullet points.

{
  "deckTitle": "Feature Overview",
  "slides": [
    {
      "type": "feature_columns",
      "title": "Platform Capabilities",
      "subtitle": "Core feature breakdown by category",
      "columns": [
        {
          "heading": "Security",
          "bodyPoints": ["End-to-end encryption", "SOC 2 compliance", "RBAC access controls"],
          "tinted": false
        },
        {
          "heading": "Performance",
          "bodyPoints": ["99.9% uptime SLA", "<50ms latency", "Auto-scaling"],
          "tinted": true
        }
      ],
      "callout": "All features available in the Enterprise plan."
    }
  ]
}

#### TYPE C: data_matrix — For high-density tabular data
Use for CSV-like data, comparison tables, or any row/column data.

{
  "deckTitle": "Data Report",
  "slides": [
    {
      "type": "data_matrix",
      "title": "Quarterly Results",
      "subtitle": "Q1–Q4 2025 performance by department",
      "matrixTable": {
        "colWidths": [0.4, 1.8, 0.5, 2.0, 3.8, 3.8],
        "rows": [
          ["Sr.", "Module", "Type", "Domain", "What It Does", "Evidence"],
          ["1", "Auth-N", "Algo", "Security", "OAuth2 + JWT", "99.9% uptime"]
        ]
      },
      "yOffset": 1.8,
      "callout": "Total revenue grew 24% YoY."
    }
  ]
}

### 4. ALIGNMENT FIX RULES (CRITICAL FOR TABLE RENDERING)
To prevent text misalignment and vertical stretching in the PowerPoint output:

- Column Width Rule: Total colWidths must sum exactly to 12.3. Wide text columns (What It Does, Evidence, Description) must be at least 3.5 inches.
- Text Density Rule: If any cell in a row contains more than 15 words, split that data into two separate slides.
- Font Scaling: For tables with more than 5 columns, force fontSize to 7 or 8 (never 10+).
- Abbreviation Rule: Use abbreviations for long terms (e.g., 'Res. & Ext.' instead of 'Research, Innovations & Extension').

### 5. DESIGN RULES FOR 16:9 LANDSCAPE WIDESCREEN
- Maintain a clean corporate grid rhythm. Leave ample whitespace. Focus on structural asymmetry over dense paragraphs.
- Use ALL provided data without truncation. If the dataset is large, generate as many slides as needed with logical groupings.`;

const SYSTEM_PROMPT_FOOTER = `
### IMPORTANT OUTPUT RULES:
- Return ONLY valid JSON. No markdown, no code fences, no explanatory text.
- Use the brand colors listed above for all textColor references.
- Use ALL provided data — do not truncate or summarize. Add more slides as needed.
- Always end with a "callout" string on the final slide for summary.
- Shorten cell text to fit 3 lines max per cell. Keep descriptions concise.
- The footer across all slides must reference business@maysanlabs.com.
- Choose the layout type (kpi_grid, feature_columns, data_matrix) that best fits the data shape.
- For data_matrix, include the header as the first row in matrixTable.rows.
- Wrap everything in { "deckTitle": "...", "slides": [...] }.
- Do NOT include slideNumber in slides — it's assigned automatically.`;

const API_URL = process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions";
const API_KEY = process.env.AI_API_KEY || "";
const MODEL = process.env.AI_MODEL || "gpt-4o-mini";

export async function POST(request: Request) {
  try {
    const origin = request.headers.get('origin') || request.headers.get('referer') || '';
    const allowedOrigins = ['https://maysanlabs.com', 'http://localhost:3000', 'http://localhost:3001'];
    if (origin && !allowedOrigins.some(o => origin.startsWith(o))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateCheck = checkRateLimit("presentation:" + ip, 5, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { rawData } = await request.json();

    if (!rawData || typeof rawData !== "string" || rawData.trim().length === 0) {
      return NextResponse.json(
        { error: "No raw data provided" },
        { status: 400 }
      );
    }

    if (!API_KEY) {
      return NextResponse.json(
        { error: "AI_API_KEY_NOT_CONFIGURED", message: "AI parsing is unavailable. Paste structured data (CSV, markdown tables, or key:value pairs) instead — those are handled entirely in your browser." },
        { status: 501 }
      );
    }

    const response = await safeFetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: PRESENTATION_SYSTEM_PROMPT + SYSTEM_PROMPT_FOOTER },
          {
            role: "user",
            content: `Convert the following raw data into the structured presentation JSON:\n\n${rawData}`,
          },
        ],
        temperature: 0.1,
        max_tokens: 16384,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Presentation API] LLM error:", response.status, errorText);
      return NextResponse.json(
        { error: `AI service error: ${response.statusText}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "AI returned empty response" },
        { status: 502 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
          return NextResponse.json(
            { error: "Failed to parse AI response as JSON" },
            { status: 422 }
          );
        }
      } else {
        return NextResponse.json(
          { error: "No JSON found in AI response" },
          { status: 422 }
        );
      }
    }

    if (!parsed.slides || !Array.isArray(parsed.slides) || parsed.slides.length === 0) {
      return NextResponse.json(
        { error: "Invalid structure: missing slides array" },
        { status: 422 }
      );
    }

    parsed.slides = parsed.slides.map((slide: Record<string, unknown>, index: number) => ({
      ...slide,
      slideNumber: index + 1,
    }));

    return NextResponse.json(parsed, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[Presentation API] Internal error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
