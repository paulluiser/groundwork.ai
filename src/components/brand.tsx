import { cn } from "@/lib/utils";

/* The Kern mark: two backslashes, ink and green. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg className={cn("kern-mark size-6", className)} viewBox="0 0 32 32" aria-hidden="true">
      <line className="s1" x1="8" y1="5" x2="15" y2="27" />
      <line className="s2" x1="17" y1="5" x2="24" y2="27" />
    </svg>
  );
}

/* Kern's progress meter: five slashes that turn green as lessons are done. Used only for progress. */
export function Meter({ value, size = 16, label, className }: { value: number; size?: number; label?: string; className?: string }) {
  const f = Math.max(0, Math.min(1, value || 0));
  let on = Math.round(f * 5);
  if (f > 0 && on === 0) on = 1;
  if (f < 1 && on === 5) on = 4;
  return (
    <svg className={cn("kern-meter shrink-0", className)} width={Math.round(size * 1.65)} height={size} viewBox="0 0 26.5 16" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {[0, 1, 2, 3, 4].map((i) => { const x = 3 + i * 5; return <line key={i} className={i < on ? "on" : ""} x1={x - 1.6} y1={3} x2={x + 1.6} y2={13} />; })}
    </svg>
  );
}
