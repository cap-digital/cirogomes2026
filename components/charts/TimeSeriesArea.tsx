"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "./ChartTooltip";
import { useTheme } from "@/components/ThemeProvider";
import { compact } from "@/lib/format";

export interface SeriesDef {
  key: string;
  name: string;
  color: string;
}

export default function TimeSeriesArea({
  data,
  xKey,
  series,
  height = 300,
  valueFormatter,
  xTickFormatter,
}: {
  data: Record<string, number | string>[];
  xKey: string;
  series: SeriesDef[];
  height?: number;
  valueFormatter?: (v: number, name: string) => string;
  xTickFormatter?: (v: string) => string;
}) {
  const { palette } = useTheme();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 6, right: 10, bottom: 0, left: -6 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.42} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid stroke={palette.grid} vertical={false} />
        <XAxis
          dataKey={xKey}
          tickFormatter={xTickFormatter}
          tick={{ fill: palette.textMuted, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          dy={8}
          minTickGap={8}
        />
        <YAxis
          tick={{ fill: palette.textMuted, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={44}
          tickFormatter={(v) => compact(Number(v))}
        />
        <Tooltip
          cursor={{ stroke: palette.cursor, strokeWidth: 1 }}
          content={<ChartTooltip valueFormatter={valueFormatter} labelFormatter={xTickFormatter} />}
        />
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            strokeWidth={2.4}
            fill={`url(#grad-${s.key})`}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, stroke: palette.surface }}
            isAnimationActive={false}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
