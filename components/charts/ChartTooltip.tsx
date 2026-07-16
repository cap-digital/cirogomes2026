"use client";

import type { TooltipProps } from "recharts";

type Fmt = (value: number, name: string) => string;

interface Props extends TooltipProps<number, string> {
  valueFormatter?: Fmt;
  labelFormatter?: (label: string) => string;
  /** Hide the little swatch (for single-series charts). */
  hideSwatch?: boolean;
}

/** Design-system tooltip: dark violet card, hairline ring, tabular values. */
export default function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
  labelFormatter,
  hideSwatch,
}: Props) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-xl border border-line-2 bg-[var(--surface-3)] px-3.5 py-2.5 shadow-[0_10px_40px_-8px_rgba(0,0,0,0.6)] ring-1 ring-black/10">
      {label != null && label !== "" && (
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-ink-3">
          {labelFormatter ? labelFormatter(String(label)) : String(label)}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry, i) => {
          const color = (entry.color || entry.payload?.fill || "#9085e9") as string;
          const name = String(entry.name ?? "");
          const value = Number(entry.value ?? 0);
          return (
            <div key={i} className="flex items-center justify-between gap-4 text-[13px]">
              <span className="flex items-center gap-2 text-ink-2">
                {!hideSwatch && (
                  <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: color }} />
                )}
                {name}
              </span>
              <span className="tabular font-semibold text-ink">
                {valueFormatter ? valueFormatter(value, name) : value.toLocaleString("pt-BR")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
