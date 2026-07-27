import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) return true;
  record.count += 1;
  return false;
}

function createTransporter() {
  const smtpConfigured =
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    !process.env.SMTP_USER.includes("your-email") &&
    !process.env.SMTP_PASS.includes("your-app");

  if (!smtpConfigured) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== "false", minVersion: "TLSv1.2" },
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin') || request.headers.get('referer') || '';
  const allowedOrigins = ['https://maysanlabs.com', 'http://localhost:3000', 'http://localhost:3001'];
  if (origin && !allowedOrigins.some(o => origin.startsWith(o))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { email, company, source } = body;

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const transporter = createTransporter();
    if (!transporter) {
      console.log("[Newsletter] Dev mode — SMTP not configured");
      return NextResponse.json({ success: true, message: "Subscribed (dev mode)" });
    }

    await transporter.sendMail({
      from: `"Maysan Labs Newsletter" <${process.env.SMTP_USER}>`,
      to: "business@maysanlabs.com",
      subject: `New newsletter subscriber: ${email}`,
      text: `New newsletter subscription\n\nEmail: ${email}${company ? `\nCompany: ${company}` : ""}${source ? `\nSource: ${source}` : ""}`,
      html: `<p><strong>New newsletter subscription</strong></p>
             <p>Email: ${email}</p>
             ${company ? `<p>Company: ${company}</p>` : ""}
             ${source ? `<p>Source: ${source}</p>` : ""}`,
    });

    return NextResponse.json({ success: true, message: "Subscribed successfully!" });
  } catch (error) {
    console.error("[Newsletter] Error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}