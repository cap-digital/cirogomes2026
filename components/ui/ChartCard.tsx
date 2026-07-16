import type { ReactNode } from "react";

/** Card wrapper for a chart: title, optional subtitle, optional right slot (legend/badge). */
export default function ChartCard({
  title,
  subtitle,
  right,
  children,
  className = "",
  bodyClassName = "",
  delay = 0,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  delay?: number;
}) {
  return (
    <section
      className={`card animate-in flex flex-col p-5 sm:p-6 ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold tracking-tight text-ink">{title}</h3>
          {subtitle && <p className="mt-1 text-[13px] text-ink-3">{subtitle}</p>}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
      <div className={`flex-1 ${bodyClassName}`}>{children}</div>
    </section>
  );
}

/** Inline legend dot + label. */
export function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink-3">
      <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: color }} />
      {label}
    </span>
  );
}
