export const APP_TIMEZONE = "Asia/Kolkata";

export const START_DATE: CalendarDate = {
  year: 2026,
  month: 9,
  day: 23,
};

export const TARGET_DATE: CalendarDate = {
  year: 2026,
  month: 10,
  day: 15,
};

export type CalendarDate = {
  year: number;
  month: number;
  day: number;
};

export type DateRow = {
  key: string;
  weekday: string;
  day: string;
  month: string;
  isToday: boolean;
  isComplete: boolean;
};

export type CountdownView = {
  today: CalendarDate;
  todayLabel: string;
  targetLabel: string;
  daysRemaining: number;
  isFinished: boolean;
  dates: DateRow[];
};

export function calendarDateInTimeZone(
  date: Date = new Date(),
  timeZone: string = APP_TIMEZONE,
): CalendarDate {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
  };
}

export function dateKey(date: CalendarDate): string {
  const month = String(date.month).padStart(2, "0");
  const day = String(date.day).padStart(2, "0");
  return `${date.year}-${month}-${day}`;
}

export function compareDates(left: CalendarDate, right: CalendarDate): number {
  return dateKey(left).localeCompare(dateKey(right));
}

export function addDays(date: CalendarDate, days: number): CalendarDate {
  const next = new Date(Date.UTC(date.year, date.month - 1, date.day + days));
  return {
    year: next.getUTCFullYear(),
    month: next.getUTCMonth() + 1,
    day: next.getUTCDate(),
  };
}

export function daysBetween(from: CalendarDate, to: CalendarDate): number {
  const start = Date.UTC(from.year, from.month - 1, from.day);
  const end = Date.UTC(to.year, to.month - 1, to.day);
  return Math.round((end - start) / 86_400_000);
}

function toUtcDate(date: CalendarDate): Date {
  return new Date(Date.UTC(date.year, date.month - 1, date.day));
}

export function formatLong(date: CalendarDate): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(toUtcDate(date));
}

function formatWeekday(date: CalendarDate): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    timeZone: "UTC",
  }).format(toUtcDate(date));
}

function formatMonth(date: CalendarDate): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone: "UTC",
  }).format(toUtcDate(date));
}

export function listDates(from: CalendarDate, to: CalendarDate): CalendarDate[] {
  const dates: CalendarDate[] = [];
  let cursor = from;

  while (compareDates(cursor, to) <= 0) {
    dates.push(cursor);
    cursor = addDays(cursor, 1);
  }

  return dates;
}

type CountdownRange = {
  start?: CalendarDate;
  target?: CalendarDate;
  timeZone?: string;
};

export function buildCountdownView(now: Date = new Date(), range: CountdownRange = {}): CountdownView {
  const timeZone = range.timeZone ?? APP_TIMEZONE;
  const today = calendarDateInTimeZone(now, timeZone);
  const target = range.target ?? TARGET_DATE;
  const start = range.start ?? START_DATE;
  const comparison = compareDates(today, target);
  const isFinished = comparison > 0;
  const daysRemaining = Math.max(0, daysBetween(today, target));
  const span = listDates(start, target);

  return {
    today,
    todayLabel: formatLong(today),
    targetLabel: formatLong(target),
    daysRemaining,
    isFinished,
    dates: span.map((date) => ({
      key: dateKey(date),
      weekday: formatWeekday(date),
      day: String(date.day),
      month: formatMonth(date),
      isToday: compareDates(date, today) === 0,
      isComplete: compareDates(date, today) < 0,
    })),
  };
}
