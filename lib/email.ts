const RESEND_ENDPOINT = "https://api.resend.com/emails";
const FROM_ADDRESS = "Countdown <onboarding@resend.dev>";

type SendMotivationEmailInput = {
  to: string;
  subject: string;
  text: string;
};

export async function sendMotivationEmail(input: SendMotivationEmailInput): Promise<string> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set. Add it to .env.local.");
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [input.to],
      subject: input.subject,
      text: input.text,
    }),
  });

  const body = (await response.json()) as { id?: string; message?: string };

  if (!response.ok || !body.id) {
    throw new Error(body.message ?? "Resend rejected the email.");
  }

  return body.id;
}
