import { neon } from "@neondatabase/serverless";
import { buildCountdownView, type CalendarDate } from "../lib/date";
import { sendMotivationEmail } from "../lib/email";
import { messageForDate } from "../lib/motivation";

function toCalendarDate(value: string): CalendarDate {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return { year, month, day };
}

async function sendTestEmail() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing.");
  }

  const sql = neon(databaseUrl);
  const settings = await sql`
    SELECT start_date::text, target_date::text, timezone, recipient_email
    FROM countdown_settings
    WHERE id = 1
  `;
  const messages = await sql`
    SELECT body
    FROM motivation_messages
    ORDER BY sort_order ASC
  `;
  const row = settings[0];
  const savedRecipient = row?.recipient_email;
  const recipient = process.env.TEST_TO || savedRecipient;

  if (!row || typeof recipient !== "string") {
    throw new Error("Recipient email is not saved in countdown_settings.");
  }

  const start = toCalendarDate(String(row.start_date));
  const target = toCalendarDate(String(row.target_date));
  const view = buildCountdownView(new Date(), {
    start,
    target,
    timeZone: String(row.timezone),
  });
  const message = messageForDate(
    view.today,
    messages.map((item) => String(item.body)),
    target,
  );
  const subject = `${view.daysRemaining} days until ${view.targetLabel}`;
  const text = `${view.todayLabel}\n\n${message}\n\n${view.daysRemaining} days remaining until ${view.targetLabel}.`;
  const id = await sendMotivationEmail({ to: recipient, subject, text });

  console.log(`Sent to ${recipient}. Resend id: ${id}`);
}

sendTestEmail().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
