"use server";

import nodemailer from "nodemailer";
import { headers } from "next/headers";
import { checkRateLimit } from "@/core/rate-limit";
import { safeFetch } from "@/core/security/ssrf";
import { escapeHtml, safeHref, textForEmail, multilineHtml } from "@/core/security/escape";
import { validateResume, ResumeValidationError } from "@/core/security/resume";

export async function applyJob(formData: FormData) {
  // Honeypot check: if the hidden field is filled, it's likely a bot
  const honeypot = formData.get("website") as string;
  if (honeypot && honeypot.trim() !== "") {
    console.warn("[Form Security] Honeypot triggered - potential bot submission");
    // Return success to avoid tipping off bots, but don't process the form
    return { success: true, message: "Application submitted successfully" };
  }

  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || headersList.get("x-real-ip") || "unknown";
  const rateCheck = checkRateLimit(`applyJob:${ip}`, 5, 60 * 1000);
  if (!rateCheck.allowed) {
    return { success: false, message: "Too many requests. Please try again later." };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const jobId = formData.get("jobId") as string;
  const jobTitle = formData.get("jobTitle") as string;
  const linkedIn = formData.get("linkedIn") as string;
  const portfolio = formData.get("portfolio") as string;
  const message = formData.get("message") as string;
  const resumeRaw = formData.get("resume");

  if (!name || !email || !resumeRaw) {
    return { success: false, message: "Missing required fields (Name, Email, Resume)" };
  }

  let validatedResume;
  try {
    validatedResume = await validateResume(resumeRaw);
  } catch (err) {
    if (err instanceof ResumeValidationError) {
      return { success: false, message: err.message };
    }
    throw err;
  }
  const resume = validatedResume.file;
  const resumeFilename = validatedResume.safeName;

  // Check for missing SMTP configuration
  const smtpConfigured =
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    !process.env.SMTP_USER.includes("your-email") &&
    !process.env.SMTP_PASS.includes("your-app");

  if (!smtpConfigured) {
    console.warn("SMTP not configured. Application received (details omitted for security).");
    return { success: false, message: "Application received but email delivery is not configured. Please email us directly at careers@maysanlabs.com" };
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
    // Convert resume to Buffer for Nodemailer attachment
    const arrayBuffer = await resume.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const linkedInHref = safeHref(linkedIn);
    const portfolioHref = safeHref(portfolio);

    // 1. Send Email Notification to Team
    const mailPromise = transporter.sendMail({
      from: `"Maysan Labs Talent" <${process.env.SMTP_USER}>`,
      to: "business@maysanlabs.com",
      subject: `New Application: ${jobTitle} - ${name}`,
      text: `
        New Job Application Received

        Position: ${jobTitle} (${jobId})
        Candidate: ${name}
        Email: ${email}
        Phone: ${phone || "N/A"}
        LinkedIn: ${linkedIn || "N/A"}
        Portfolio: ${portfolio || "N/A"}

        Cover Letter / Message:
        ${textForEmail(message) || "No message provided."}
      `,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; line-height: 1.6;">
          <h2 style="color: #000;">New Job Application Received</h2>
          <p><strong>Position:</strong> ${escapeHtml(jobTitle)} (${escapeHtml(jobId)})</p>
          <p><strong>Candidate:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone) || "N/A"}</p>
          <p><strong>LinkedIn:</strong> <a href="${escapeHtml(linkedInHref)}">${escapeHtml(linkedIn) || "N/A"}</a></p>
          <p><strong>Portfolio:</strong> <a href="${escapeHtml(portfolioHref)}">${escapeHtml(portfolio) || "N/A"}</a></p>
          <hr />
          <h3>Cover Letter / Message:</h3>
          <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 8px;">${multilineHtml(message) || "No message provided."}</p>
          <hr />
          <p><small>Resume is attached to this email.</small></p>
        </div>
      `,
      attachments: [
        {
          filename: resumeFilename,
          content: buffer,
        }
      ]
    });

    // 2. Send Discord Notification
    if (process.env.DISCORD_WEBHOOK_URL) {
      const discordPromise = safeFetch(process.env.DISCORD_WEBHOOK_URL as string, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: "🎯 **New Job Application Alert!**",
          embeds: [
            {
              title: `Position: ${jobTitle}`,
              color: 0x00ff00,
              fields: [
                { name: "Candidate", value: name, inline: true },
                { name: "Email", value: email, inline: true },
                { name: "LinkedIn", value: linkedIn || "N/A" },
                { name: "Message Snippet", value: message ? (message.length > 500 ? message.slice(0, 500) + "..." : message) : "N/A" },
              ],
              footer: { text: "Maysan Labs Talent Portal" },
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });
      const [mailResult] = await Promise.allSettled([mailPromise, discordPromise]);
      if (mailResult.status === "rejected") {
        throw mailResult.reason;
      }
    } else {
      await mailPromise;
    }

    return { success: true, message: "Application submitted successfully" };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Application processing error:", errMsg);
    return { success: false, message: "Application submission failed. Please email us at careers@maysanlabs.com" };
  }
}
