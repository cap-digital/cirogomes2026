import type { ReactNode } from "react";

export interface SubMetric {
  label: string;
  value: string;
}

/**
 * Stat tile: big value + cyan label, plus optional sub-metrics (rates/costs) folded
 * into the same card under a hairline, and/or a descriptive `sub` line.
 */
export default function KpiCard({
  value,
  label,
  sub,
  metrics,
  accent = "violet",
  delay = 0,
}: {
  value: ReactNode;
  label: string;
  sub?: string;
  metrics?: SubMetric[];
  accent?: "violet" | "cyan" | "amber" | "magenta" | "green";
  delay?: number;
}) {
  const accentColor = {
    violet: "var(--series-1)",
    cyan: "var(--series-2)",
    amber: "var(--series-3)",
    magenta: "var(--series-4)",
    green: "var(--series-5)",
  }[accent];

  return (
    <div
      className="card card-hover animate-in group flex min-w-0 flex-col overflow-hidden p-4 sm:p-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full opacity-40 blur-2xl transition-opacity group-hover:opacity-70"
        style={{ background: accentColor }}
      />
      <p className="relative text-[clamp(1.4rem,4.4vw,2.15rem)] font-semibold leading-none tracking-tight tabular">
        {value}
      </p>
      <p className="stat-label relative mt-3.5" style={{ color: accentColor }}>
        {label}
      </p>
      {sub && <p className="relative mt-1.5 text-[13px] text-ink-3">{sub}</p>}

      {metrics && metrics.length > 0 && (
        <div className="relative mt-4 flex flex-wrap gap-x-5 gap-y-2.5 border-t border-line pt-3.5">
          {metrics.map((m) => (
            <div key={m.label} className="min-w-0">
              <p className="tabular text-[15px] font-semibold leading-none text-ink">{m.value}</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.1em] text-ink-3">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
