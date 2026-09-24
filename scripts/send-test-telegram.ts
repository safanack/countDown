import { neon } from "@neondatabase/serverless";
import { buildCountdownView, type CalendarDate } from "../lib/date";
import { messageForDate } from "../lib/motivation";
import { sendTelegramMessage } from "../lib/telegram";

function toCalendarDate(value: string): CalendarDate {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return { year, month, day };
}

async function sendTestTelegram() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing.");
  }

  const sql = neon(databaseUrl);
  const settings = await sql`
    SELECT start_date::text, target_date::text, timezone
    FROM countdown_settings
    WHERE id = 1
  `;
  const messages = await sql`
    SELECT body
    FROM motivation_messages
    ORDER BY sort_order ASC
  `;
  const row = settings[0];

  if (!row) {
    throw new Error("Countdown settings are missing.");
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
  const text = `${view.todayLabel}\n\n${message}\n\n${view.daysRemaining} days remaining until ${view.targetLabel}.`;
  const messageId = await sendTelegramMessage({ text });

  console.log(`Sent Telegram message ${messageId}.`);
}

sendTestTelegram().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
