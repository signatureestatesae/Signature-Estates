import { NextRequest, NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase/serviceRole";
import { sendEmail } from "@/lib/email";

// Keep this modest — resumes are typically a few hundred KB to low single
// digit MB, and the file is base64-encoded into the notification email
// below, which inflates its size by ~33%.
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const CAREERS_FROM_EMAIL = process.env.CAREERS_FROM_EMAIL || "careers@signatureestates.ae";
const CAREERS_NOTIFICATION_EMAIL = process.env.CAREERS_NOTIFICATION_EMAIL || "info@signatureestates.ae";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();
  const jobPostingId = String(form.get("jobPostingId") ?? "").trim() || null;
  const jobTitle = String(form.get("jobTitle") ?? "").trim() || "General Application";
  const cv = form.get("cv");

  if (!name || !email || !(cv instanceof File) || cv.size === 0) {
    return NextResponse.json({ error: "Name, email and a CV file are required." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(cv.type)) {
    return NextResponse.json({ error: "CV must be a PDF or Word document." }, { status: 400 });
  }
  if (cv.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "CV must be smaller than 8MB." }, { status: 400 });
  }

  const bytes = new Uint8Array(await cv.arrayBuffer());
  const ext = cv.name.split(".").pop() || "pdf";
  const cvPath = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabaseServiceRole.storage
    .from("resumes")
    .upload(cvPath, bytes, { contentType: cv.type, upsert: false });
  if (uploadError) {
    return NextResponse.json({ error: "Could not upload CV. Please try again." }, { status: 500 });
  }

  const { error: insertError } = await supabaseServiceRole.from("job_applications").insert({
    job_posting_id: jobPostingId,
    job_title: jobTitle,
    name,
    email,
    phone,
    message,
    cv_path: cvPath,
    cv_filename: cv.name,
  });
  if (insertError) {
    return NextResponse.json({ error: "Could not save your application. Please try again." }, { status: 500 });
  }

  // Best-effort — the application is already safely stored above, so an
  // email failure (e.g. RESEND_API_KEY not configured yet) shouldn't turn
  // into a failed submission for the applicant.
  try {
    const contentBase64 = Buffer.from(bytes).toString("base64");
    await sendEmail({
      to: CAREERS_NOTIFICATION_EMAIL,
      from: CAREERS_FROM_EMAIL,
      subject: `New Application: ${jobTitle} — ${name}`,
      html: `
        <p><strong>Position:</strong> ${escapeHtml(jobTitle)}</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
        ${message ? `<p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>` : ""}
        <p>CV attached.</p>
      `,
      attachment: { filename: cv.name, contentBase64 },
    });
  } catch (err) {
    console.error("careers/apply: failed to send notification email", err);
  }

  return NextResponse.json({ success: true });
}
