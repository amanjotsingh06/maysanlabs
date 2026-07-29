import { z } from "zod";

/**
 * Zod validation schema for the Lead domain model.
 * Enforces strict typing and presence of required fields before CRM submission.
 */
export const LeadSchema = z.object({
  lead: z.object({
    name: z.string().min(2, "Name is required").max(100),
    email: z.string().email("Invalid email address"),
    companyName: z.string().min(1, "Company Name is required").max(100),
    phone: z.string().optional(),
  }),
  source: z.object({
    tool: z.string().min(1),
    page: z.string().min(1),
    channel: z.string().optional(),
  }),
  result: z.record(z.string(), z.unknown()),
  metadata: z.object({
    submittedAt: z.string().datetime(),
    userAgent: z.string().optional(),
    referrer: z.string().optional(),
    sessionId: z.string().optional(),
    campaign: z.string().optional(),
  }),
});
