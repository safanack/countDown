"use client";

import { APP_TIMEZONE } from "@/lib/date";

type HeaderProps = {
  targetLabel: string;
};

function hourInAppTimezone(): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIMEZONE,
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());

  return Number(parts.find((part) => part.type === "hour")?.value);
}

export function Header(_props: HeaderProps) {
  const hour = hourInAppTimezone();

  let greeting = "Good Night";

  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good Evening";
  }

  return (
    <header className="site-header">
      <div>
       

        <h1>
          {greeting}, Muhammed
        </h1>

        
      </div>

    
    </header>
  );
}
