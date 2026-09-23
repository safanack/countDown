import { daysBetween, TARGET_DATE, type CalendarDate } from "@/lib/date";

export const MESSAGES = [
  "Show up for the next small step. That is the whole job today.",
  "You do not need a perfect day. You need an honest one.",
  "Keep the promise you made when this still felt far away.",
  "One finished task beats a long list of intentions.",
  "The date is getting closer. So is the person who kept going.",
  "Start before you feel ready. Readiness usually arrives later.",
  "Protect the hour that matters and let the rest be ordinary.",
  "Progress is quiet. Do the work even if nobody sees it.",
  "Leave today slightly better than you found it.",
  "Stay with the hard part a little longer than you want to.",
  "A short focused stretch is enough to move the day forward.",
  "You already began. Continuing is the skill.",
  "Make the next decision a kind one, then follow it.",
  "The countdown only works if today counts.",
  "Do the version you can finish, then improve it tomorrow.",
  "Energy returns after you start, not before.",
  "Keep your standard, and lower the drama.",
  "This day is part of the result, even if it feels ordinary.",
  "Choose the work that future-you will thank you for.",
  "Close one open loop before the day ends.",
  "You can be tired and still be consistent.",
  "Measure the day by what you kept, not what you wished.",
  "The finish line is a date. The work is still this morning.",
  "Arrive at 15 October with fewer excuses and a clearer record.",
];

export function messageForDate(
  today: CalendarDate,
  messages: readonly string[] = MESSAGES,
  target: CalendarDate = TARGET_DATE,
): string {
  const list = messages.length > 0 ? messages : MESSAGES;
  const remaining = Math.max(0, daysBetween(today, target));
  return list[remaining % list.length];
}
