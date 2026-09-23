type CountdownProps = {
  daysRemaining: number;
  isFinished: boolean;
  targetLabel: string;
};

export function Countdown({ daysRemaining, isFinished, targetLabel }: CountdownProps) {
  const unit = daysRemaining === 1 ? "day" : "days";
  const label = isFinished ? "The date has passed" : `${unit} remaining`;

  return (
    <section className="countdown" aria-label="Days remaining">
      <p className="countdown-kicker">{isFinished ? "Complete" : "Countdown"}</p>
      <p className="countdown-number">{daysRemaining}</p>
      <p className="countdown-label">{label}</p>
      <p className="countdown-target">Target date · {targetLabel}</p>
    </section>
  );
}
