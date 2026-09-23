import { buildCountdownView } from "@/lib/date";
import { sendMotivationEmail } from "@/lib/email";
import { messageForDate } from "@/lib/motivation";
import { loadCountdownData } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!secret || authorization !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await loadCountdownData();

  if (!data.recipientEmail) {
    return Response.json({ error: "Recipient email is not saved." }, { status: 400 });
  }

  const view = buildCountdownView(new Date(), {
    start: data.start,
    target: data.target,
    timeZone: data.timeZone,
  });
  const message = messageForDate(view.today, data.messages, data.target);
  const id = await sendMotivationEmail({
    to: data.recipientEmail,
    subject: `${view.daysRemaining} days until ${view.targetLabel}`,
    text: `${view.todayLabel}\n\n${message}\n\n${view.daysRemaining} days remaining until ${view.targetLabel}.`,
  });

  return Response.json({ id, to: data.recipientEmail });
}
