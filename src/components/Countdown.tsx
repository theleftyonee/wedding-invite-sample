import { useEffect, useMemo, useState } from "react";
import { remainingUntil, parseInstant } from "../lib/schedule";

function Cell({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <strong>{String(value).padStart(2, "0")}</strong>
      <span>{label}</span>
    </div>
  );
}

export default function Countdown({ iso, variant = "full" }: { iso: string; variant?: "full" | "compact" }) {
  const target = useMemo(() => parseInstant(iso), [iso]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!target) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (!target) return null;

  const remaining = remainingUntil(target, now);
  if (!remaining) return null;

  if (remaining.arrived) {
    return <p className="countdown-arrived">The day is here</p>;
  }

  const spoken = `${remaining.days} ${remaining.days === 1 ? "day" : "days"}, ${remaining.hours} ${remaining.hours === 1 ? "hour" : "hours"}, ${remaining.minutes} ${remaining.minutes === 1 ? "minute" : "minutes"} until the wedding`;

  if (variant === "compact") {
    return (
      <p className="countdown-line" aria-label={spoken}>
        <span>{remaining.days}</span> days
        <i aria-hidden="true" />
        <span>{remaining.hours}</span> hours
      </p>
    );
  }

  return (
    <div className="countdown" aria-label={spoken}>
      <p className="countdown-label">Until we celebrate</p>
      <div className="countdown-grid">
        <Cell value={remaining.days} label="Days" />
        <Cell value={remaining.hours} label="Hours" />
        <Cell value={remaining.minutes} label="Minutes" />
        <Cell value={remaining.seconds} label="Seconds" />
      </div>
    </div>
  );
}
