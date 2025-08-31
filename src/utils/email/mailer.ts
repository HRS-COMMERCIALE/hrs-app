import nodemailer, { Transporter } from 'nodemailer';

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean; // true for 465, false for other ports
  auth?: {
    user: string;
    pass: string;
  };
};

export type MailOptions = {
  from?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
  headers?: Record<string, string>;
  attachments?: Array<{
    filename?: string;
    content?: string | Buffer;
    path?: string;
    contentType?: string;
    cid?: string; // for inline images
  }>;
};

let cachedTransporter: Transporter | null = null;

function getDefaultSmtpConfig(): SmtpConfig {
  const host = process.env.SMTP_HOST || '';
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465;
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  const auth = user && pass ? { user, pass } : undefined;

  return { host, port, secure, auth };
}

export function createTransport(config?: Partial<SmtpConfig>): Transporter {
  const base = getDefaultSmtpConfig();
  const merged: SmtpConfig = {
    ...base,
    ...config,
    auth: config?.auth ?? base.auth,
  };

  if (!merged.host || !merged.port) {
    throw new Error('SMTP configuration is incomplete. Please set SMTP_HOST and SMTP_PORT.');
  }

  return nodemailer.createTransport({
    host: merged.host,
    port: merged.port,
    secure: merged.secure,
    auth: merged.auth,
  });
}

export async function getTransporter(config?: Partial<SmtpConfig>): Promise<Transporter> {
  if (config || !cachedTransporter) {
    cachedTransporter = createTransport(config);
  }
  return cachedTransporter;
}

export async function sendEmail(options: MailOptions, smtpOverride?: Partial<SmtpConfig>) {
  const transporter = await getTransporter(smtpOverride);

  const fromDefault = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com';

  const info = await transporter.sendMail({
    from: options.from || fromDefault,
    to: options.to,
    cc: options.cc,
    bcc: options.bcc,
    subject: options.subject,
    text: options.text,
    html: options.html,
    replyTo: options.replyTo,
    headers: options.headers,
    attachments: options.attachments,
  });

  return {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
    response: info.response,
  };
}

// Utility to quickly verify SMTP connection during startup or health checks
export async function verifySmtpConnection(config?: Partial<SmtpConfig>) {
  const transporter = await getTransporter(config);
  await transporter.verify();
}


