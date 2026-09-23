import type { DateRow } from "@/lib/date";

type DateListProps = {
  dates: DateRow[];
};

export function DateList({ dates }: DateListProps) {
  if (dates.length === 0) {
    return null;
  }

  return (
    <section className="dates" aria-label="Dates until 15 October">
      <ol className="date-list">
        {dates.map((date) => (
          <li
            key={date.key}
            className={date.isComplete ? "date-card is-complete" : "date-card"}
          >
            <span className="date-weekday">{date.weekday}</span>
            <span className="date-day">{date.day}</span>
            <span className="date-month">{date.month}</span>
            <span className="sr-only">{date.isComplete ? "Passed" : "Upcoming"}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
