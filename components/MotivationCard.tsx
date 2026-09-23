type MotivationCardProps = {
  message: string;
  dateLabel: string;
};

export function MotivationCard({ message, dateLabel }: MotivationCardProps) {
  return (
    <section className="motivation" aria-labelledby="today-message">
      <div className="motivation-meta">
        <h2 id="today-message">Today&apos;s message</h2>
        <p>{dateLabel}</p>
      </div>
      <blockquote>
        <p>{message}</p>
      </blockquote>
    </section>
  );
}
