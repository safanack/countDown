import { buildCountdownView } from "@/lib/date";
import { messageForDate } from "@/lib/motivation";
import { loadCountdownData } from "@/lib/store";
import { sendTelegramMessage } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!secret || authorization !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    return Response.json({ error: "Telegram is not configured." }, { status: 400 });
  }

  const data = await loadCountdownData();
  const view = buildCountdownView(new Date(), {
    start: data.start,
    target: data.target,
    timeZone: data.timeZone,
  });
  const message = messageForDate(view.today, data.messages, data.target);
  const text = `${view.todayLabel}\n\n${message}\n\n${view.daysRemaining} days remaining until ${view.targetLabel}.`;
  const messageId = await sendTelegramMessage({ text });

  return Response.json({ messageId });
}
