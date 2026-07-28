export interface Lead {
  lead: {
    name: string;
    email: string;
    companyName: string;
    phone?: string;
  };
  source: {
    tool: string;
    page: string;
    channel?: string;
  };
  result: Record<string, unknown>;
  metadata: {
    submittedAt: string;
    userAgent?: string;
    referrer?: string;
    sessionId?: string;
    campaign?: string;
  };
}

export interface LeadSubmissionResult {
  success: boolean;
  message: string;
  leadId?: string;
}
