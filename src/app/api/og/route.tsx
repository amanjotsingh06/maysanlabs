import satori from "satori";
import sharp from "sharp";
import { safeFetch } from "@/core/security/ssrf";

let fontRegular: Buffer | null = null;
let fontBold: Buffer | null = null;

async function getFont(weight: number): Promise<Buffer> {
  const cached = weight === 400 ? fontRegular : fontBold;
  if (cached) return cached;

  try {
    const cssRes = await safeFetch(
      `https://fonts.googleapis.com/css2?family=Outfit:wght@${weight}&display=swap`,
      { signal: AbortSignal.timeout(5000), maxMs: 5000 }
    );
    if (!cssRes.ok) throw new Error(`Google Fonts CSS returned ${cssRes.status}`);
    const css = await cssRes.text();
    const match = css.match(/url\(([^)]+)\)/);
    if (!match) throw new Error("Font URL not found");
    const fontRes = await safeFetch(match[1], { signal: AbortSignal.timeout(5000), maxMs: 5000 });
    if (!fontRes.ok) throw new Error(`Font file returned ${fontRes.status}`);
    const data = Buffer.from(await fontRes.arrayBuffer());

    if (weight === 400) fontRegular = data;
    if (weight === 700) fontBold = data;
    return data;
  } catch (err) {
    console.error(`[OG Image] Font fetch failed for weight ${weight}:`, err);
    // Return an empty buffer as fallback — satori will use system fallback
    return Buffer.alloc(0);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sanitize = (str: string, maxLen: number) =>
    str.replace(/<[^>]*>/g, '').replace(/[<>"'&]/g, '').slice(0, maxLen);
  const title = sanitize(searchParams.get("title") || "Maysan Labs", 120);
  const description =
    sanitize(searchParams.get("description") || "Enterprise SaaS Development Company", 300);

  const [font400, font700] = await Promise.all([
    getFont(400),
    getFont(700),
  ]);

  const svg = await satori(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0a0f1a 0%, #0f1923 50%, #1a2a3a 100%)",
          fontFamily: "Outfit",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "-20%",
            width: "60%",
            height: "100%",
            background:
              "radial-gradient(circle, rgba(26,109,214,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30%",
            left: "-10%",
            width: "50%",
            height: "60%",
            background:
              "radial-gradient(circle, rgba(0,210,255,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: "2px",
            height: "60%",
            background:
              "linear-gradient(to bottom, transparent, rgba(26,109,214,0.3), transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            right: "8%",
            width: "2px",
            height: "40%",
            background:
              "linear-gradient(to top, transparent, rgba(0,210,255,0.2), transparent)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            padding: "60px 70px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#1A6DD6" />
              <path
                d="M8 12L16 8L24 12V20L16 24L8 20V12Z"
                fill="white"
                fillOpacity="0.2"
              />
              <path
                d="M12 14L16 12L20 14V18L16 20L12 18V14Z"
                fill="white"
              />
            </svg>
            <span
              style={{
                fontSize: "18px",
                color: "#1A6DD6",
                fontWeight: 600,
                letterSpacing: "0.1em",
              }}
            >
              MAYSAN LABS
            </span>
          </div>

          <h1
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.2,
              margin: 0,
              maxWidth: "90%",
            }}
          >
            {title}
          </h1>

          <p
            style={{
              fontSize: "22px",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.4,
              margin: "16px 0 0 0",
              maxWidth: "85%",
            }}
          >
            {description}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 70px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.3)",
              fontWeight: 400,
            }}
          >
            maysanlabs.com
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#1A6DD6",
              }}
            />
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#00d2ff",
              }}
            />
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#10b981",
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Outfit", data: font400, weight: 400, style: "normal" },
        { name: "Outfit", data: font700, weight: 700, style: "normal" },
      ],
    }
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
