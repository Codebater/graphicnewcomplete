import { Resend } from 'resend';
import type { IConsultationBooking } from '@/models/ConsultationBooking';

const FROM_UPDATES = 'updates@graphiq.art';
const ADMIN_EMAIL = process.env.CONSULTATION_ADMIN_EMAIL || 'hello@graphiq.art';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error('Missing RESEND_API_KEY');
  }
  return new Resend(key);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function bookingFieldsHtml(b: Pick<IConsultationBooking, keyof IConsultationBooking>) {
  const rows: [string, string][] = [
    ['Service', String(b.service)],
    ['Preferred date', String(b.date)],
    ['Preferred time', String(b.time)],
    ['Name', String(b.name)],
    ['Company', String(b.company || '—')],
    ['Email', String(b.email)],
    ['Phone', String(b.phone || '—')],
    ['Budget', String(b.budget || '—')],
    ['Project details', String(b.message)],
  ];
  return rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e5e5e5;font-weight:600;">${escapeHtml(k)}</td><td style="padding:8px 12px;border:1px solid #e5e5e5;white-space:pre-wrap;">${escapeHtml(v)}</td></tr>`
    )
    .join('');
}

export async function sendConsultationEmails(booking: IConsultationBooking) {
  const resend = getResend();

  const table = `<table style="border-collapse:collapse;max-width:640px;">${bookingFieldsHtml(booking)}</table>`;

  await resend.emails.send({
    from: `GRAPHIQ Studio <${FROM_UPDATES}>`,
    to: booking.email,
    replyTo: ADMIN_EMAIL,
    subject: 'Your consultation payment was received',
    html: `
      <p>Hi ${escapeHtml(booking.name)},</p>
      <p>Thank you — we&apos;ve received your <strong>$300</strong> consultation payment. Our team will follow up at <a href="mailto:${escapeHtml(ADMIN_EMAIL)}">${escapeHtml(ADMIN_EMAIL)}</a> using the details you submitted.</p>
      <p><strong>What you booked</strong></p>
      ${table}
      <p style="margin-top:24px;color:#666;font-size:14px;">— GRAPHIQ STUDIO LLC</p>
    `,
  });

  await resend.emails.send({
    from: `GRAPHIQ Studio <${FROM_UPDATES}>`,
    to: ADMIN_EMAIL,
    replyTo: booking.email,
    subject: `Paid consultation: ${booking.name}`,
    html: `
      <p>New <strong>$300</strong> consultation payment (Stripe).</p>
      ${table}
    `,
  });
}
