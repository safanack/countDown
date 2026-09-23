import { getSql, hasDatabase } from "@/lib/db";
import {
  APP_TIMEZONE,
  START_DATE,
  TARGET_DATE,
  type CalendarDate,
} from "@/lib/date";
import { MESSAGES } from "@/lib/motivation";

export type CountdownData = {
  start: CalendarDate;
  target: CalendarDate;
  timeZone: string;
  recipientEmail: string | null;
  messages: string[];
  source: "neon" | "local";
};

type SettingsRow = {
  start_date: string;
  target_date: string;
  timezone: string;
  recipient_email: string | null;
};

type MessageRow = {
  body: string;
};

function toCalendarDate(value: string): CalendarDate {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return { year, month, day };
}

function localCountdownData(): CountdownData {
  return {
    start: START_DATE,
    target: TARGET_DATE,
    timeZone: APP_TIMEZONE,
    recipientEmail: null,
    messages: MESSAGES,
    source: "local",
  };
}

export async function loadCountdownData(): Promise<CountdownData> {
  if (!hasDatabase()) {
    return localCountdownData();
  }

  const sql = getSql();
  const settings = (await sql`
    SELECT start_date::text, target_date::text, timezone, recipient_email
    FROM countdown_settings
    WHERE id = 1
  `) as SettingsRow[];
  const messages = (await sql`
    SELECT body
    FROM motivation_messages
    ORDER BY sort_order ASC
  `) as MessageRow[];

  const row = settings[0];

  if (!row || messages.length === 0) {
    return localCountdownData();
  }

  return {
    start: toCalendarDate(row.start_date),
    target: toCalendarDate(row.target_date),
    timeZone: row.timezone,
    recipientEmail: row.recipient_email,
    messages: messages.map((message) => message.body),
    source: "neon",
  };
}
