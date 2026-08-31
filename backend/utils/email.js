import { BrevoClient } from '@getbrevo/brevo';
import config from '../config/config.js';

const brevo = new BrevoClient({ apiKey: config.BREVO_API_KEY });

export async function sendReminderEmail(toEmail, toName, schemeName, reminderDate) {
  await brevo.transactionalEmails.sendTransacEmail({
    subject: `Reminder: ${schemeName} — Scheme Saathi`,
    htmlContent: `
      <p>Hi ${toName},</p>
      <p>This is a reminder for the scheme you're tracking: <strong>${schemeName}</strong>.</p>
      <p>Your reminder date (${new Date(reminderDate).toLocaleDateString('en-IN')}) has arrived — log in to Scheme Saathi to check your application status and required documents.</p>
      <p>— Scheme Saathi</p>
    `,
    sender: { name: 'Scheme Saathi', email: config.BREVO_SENDER_EMAIL },
    to: [{ email: toEmail, name: toName }],
  });
}