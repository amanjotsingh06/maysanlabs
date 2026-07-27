"use server";

import nodemailer from "nodemailer";
import { headers } from "next/headers";
import { checkRateLimit } from "@/core/rate-limit";
import { safeFetch } from "@/core/security/ssrf";
import { escapeHtml, textForEmail, multilineHtml } from "@/core/security/escape";

export async function sendEmail(formData: FormData) {
  const honeypot = formData.get("website") as string;

  // Honeypot check: if the hidden field is filled, it's likely a bot
  if (honeypot && honeypot.trim() !== "") {
    console.warn("[Form Security] Honeypot triggered - potential bot submission");
    // Return success to avoid tipping off bots, but don't process the form
    return { success: true, message: "Inquiry received successfully" };
  }

  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || headersList.get("x-real-ip") || "unknown";
  const rateCheck = checkRateLimit(`sendEmail:${ip}`, 5, 60 * 1000);
  if (!rateCheck.allowed) {
    return { success: false, message: "Too many requests. Please try again later." };
  }

  const companyName = formData.get("companyName") as string;
  const requirements = formData.get("requirements") as string;
  const email = formData.get("email") as string;
  const contact = formData.get("contact") as string;

  if (!companyName || !email) {
    return { success: false, message: "Missing required fields" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    return { success: false, message: "Invalid email format" };
  }

  // Check for missing SMTP configuration
  const smtpConfigured =
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    !process.env.SMTP_USER.includes("your-email") &&
    !process.env.SMTP_PASS.includes("your-app");

  if (!smtpConfigured) {
    console.warn("SMTP not configured. Inquiry received but email not sent (details omitted for security).");
    return { success: false, message: "Inquiry received, but email delivery is not configured. Please contact us directly at business@maysanlabs.com" };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== "false",
      minVersion: "TLSv1.2",
    },
  });

  try {
    // 1. Send Email Notification
    const mailPromise = transporter.sendMail({
      from: `"Maysan Labs System" <${process.env.SMTP_USER}>`,
      to: "business@maysanlabs.com",
      subject: `New Project Inquiry: ${companyName}`,
      text: `
        New Project Initialization Request

        Company: ${companyName}
        Email: ${email}
        Contact: ${contact}

        Requirements:
        ${textForEmail(requirements)}
      `,
      html: `
        <h2>New Project Initialization Request</h2>
        <p><strong>Company:</strong> ${escapeHtml(companyName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Contact:</strong> ${escapeHtml(contact)}</p>
        <h3>Requirements:</h3>
        <p style="white-space: pre-wrap;">${multilineHtml(requirements)}</p>
      `,
    });

    // 2. Send Discord Notification (if configured)
    if (process.env.DISCORD_WEBHOOK_URL) {
      const discordPromise = safeFetch(process.env.DISCORD_WEBHOOK_URL as string, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: "🚀 **New Project Inquiry Received!**",
          embeds: [
            {
              title: `Inquiry: ${companyName}`,
              color: 0x5865f2,
              fields: [
                { name: "Email", value: email, inline: true },
                { name: "Contact", value: contact || "N/A", inline: true },
                { name: "Requirements", value: requirements.slice(0, 1024) },
              ],
              footer: { text: "Maysan Labs System" },
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });
      // We don't await discord here to avoid blocking mail if discord fails,
      // but let's await both for reliability since it's a server action.
      const [mailResult] = await Promise.allSettled([mailPromise, discordPromise]);
      if (mailResult.status === "rejected") {
        throw mailResult.reason;
      }
    } else {
      await mailPromise;
    }

    return { success: true, message: "Inquiry received successfully" };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Notification Error:", errMsg);
    return { success: false, message: "Email delivery failed. Please contact us directly at business@maysanlabs.com" };
  }
}
