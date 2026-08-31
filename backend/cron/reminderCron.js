import cron from 'node-cron';
import Application from '../models/Application.js';
import { sendReminderEmail } from '../utils/email.js';

export async function checkAndSendReminders() {
  console.log('[reminder-cron] Running reminder check...');
  let sentCount = 0;

  const dueApplications = await Application.find({
    reminderDate: { $lte: new Date() },
    reminderSentAt: null,
  })
    .populate('userId', 'name email')
    .populate('schemeId', 'schemeName');

  for (const app of dueApplications) {
    if (!app.userId?.email || !app.schemeId?.schemeName) continue;
    try {
      await sendReminderEmail(
        app.userId.email,
        app.userId.name,
        app.schemeId.schemeName,
        app.reminderDate
      );
      app.reminderSentAt = new Date();
      await app.save();
      sentCount++;
      console.log(`[reminder-cron] Sent reminder to ${app.userId.email} for ${app.schemeId.schemeName}`);
    } catch (err) {
      console.error(`[reminder-cron] Failed to send reminder for application ${app._id}:`, err.message);
    }
  }

  return sentCount;
}

export function startReminderCron() {
  cron.schedule('0 8 * * *', () => {
    checkAndSendReminders().catch((err) =>
      console.error('[reminder-cron] Error querying due applications:', err.message)
    );
  });
}