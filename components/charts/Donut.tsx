"use client";

import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import ChartTooltip from "./ChartTooltip";
import { useTheme } from "@/components/ThemeProvider";
import { int, pct } from "@/lib/format";

export interface DonutDatum {
  label: string;
  value: number;
  color?: string;
}

export default function Donut({
  data,
  centerLabel,
  centerValue,
  valueFormatter,
  height = 200,
}: {
  data: DonutDatum[];
  centerLabel?: string;
  centerValue?: string;
  valueFormatter?: (v: number) => string;
  height?: number;
}) {
  const { palette } = useTheme();
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((a, d) => a + d.value, 0);
  const fmt = valueFormatter ?? ((v: number) => int(v));
  const colored = data.map((d, i) => ({ ...d, color: d.color ?? palette.series[i % palette.series.length] }));

  return (
    <div className="flex flex-col items-center">
      {/* Centered pie */}
      <div className="relative mx-auto" style={{ width: height, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={
                <ChartTooltip
                  valueFormatter={(v) => `${fmt(v)} · ${pct(total ? (v / total) * 100 : 0, 1)}`}
                />
              }
            />
            <Pie
              data={colored}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius="63%"
              outerRadius="100%"
              paddingAngle={2}
              stroke={palette.surface}
              strokeWidth={2}
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
              onMouseEnter={(_, i) => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              {colored.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {(centerLabel || centerValue) && (
          <div
            className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-200 ${
              active !== null ? "opacity-0" : "opacity-100"
            }`}
          >
            {centerValue && (
              <span className="text-xl font-semibold tracking-tight tabular">{centerValue}</span>
            )}
            {centerLabel && (
              <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-ink-3">
                {centerLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Legend below — full width, nothing gets cut */}
      <ul className="mt-5 w-full space-y-2">
        {colored.map((d) => {
          const share = total ? (d.value / total) * 100 : 0;
          return (
            <li key={d.label} className="flex items-center gap-2.5">
              <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: d.color }} />
              <span className="min-w-0 flex-1 text-[13px] leading-snug text-ink-2">{d.label}</span>
              <span className="tabular shrink-0 text-[13px] font-semibold text-ink">{fmt(d.value)}</span>
              <span className="tabular w-10 shrink-0 text-right text-[12px] text-ink-3">{pct(share, 0)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
