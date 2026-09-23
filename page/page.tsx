import { Countdown } from "@/components/Countdown";
import { DateList } from "@/components/DateList";
import { Header } from "@/components/Header";
import { MotivationCard } from "@/components/MotivationCard";
import { buildCountdownView } from "@/lib/date";
import { messageForDate } from "@/lib/motivation";

import { loadCountdownData } from "@/lib/store";

export default async function CountdownPage() {
  const data = await loadCountdownData();
  const view = buildCountdownView(new Date(), {
    start: data.start,
    target: data.target,
    timeZone: data.timeZone,
  });
  const message = messageForDate(view.today, data.messages, data.target);

  return (
    <main className="shell">
      <Header targetLabel={view.targetLabel} />
      <div className="layout">
        <div className="lead">
          <Countdown
            daysRemaining={view.daysRemaining}
            isFinished={view.isFinished}
            targetLabel={view.targetLabel}
          />
          <MotivationCard message={message} dateLabel={view.todayLabel} />
        </div>
        <DateList dates={view.dates} />
      </div>
    </main>
  );
}
