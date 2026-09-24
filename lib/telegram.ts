const TELEGRAM_API = "https://api.telegram.org";

type SendTelegramInput = {
  text: string;
};

export async function sendTelegramMessage(input: SendTelegramInput): Promise<number> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set.");
  }

  const response = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: input.text,
    }),
  });

  const body = (await response.json()) as {
    ok?: boolean;
    result?: { message_id?: number };
    description?: string;
  };

  if (!response.ok || !body.ok || typeof body.result?.message_id !== "number") {
    throw new Error(body.description ?? "Telegram rejected the message.");
  }

  return body.result.message_id;
}
