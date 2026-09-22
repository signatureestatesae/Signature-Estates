import "server-only";

interface SendEmailArgs {
  to: string;
  from: string;
  subject: string;
  html: string;
  attachment?: { filename: string; contentBase64: string };
}

/**
 * Sends via the Resend REST API directly (no SDK) so this stays a single
 * fetch call. If RESEND_API_KEY isn't configured yet, this no-ops instead
 * of throwing — the caller (the careers apply route) already persisted the
 * application to the database, so a missing email config shouldn't fail
 * the applicant's submission, just skip the notification.
 */
export async function sendEmail({ to, from, subject, html, attachment }: SendEmailArgs): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("sendEmail: RESEND_API_KEY is not set — skipping email send.", { subject });
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      attachments: attachment
        ? [{ filename: attachment.filename, content: attachment.contentBase64 }]
        : undefined,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend API error (${res.status}): ${body}`);
  }
}
