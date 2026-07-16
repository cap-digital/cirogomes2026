"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "./ChartTooltip";
import { useTheme } from "@/components/ThemeProvider";
import { compact } from "@/lib/format";

export interface VBarDatum {
  label: string;
  value: number;
  color?: string;
}

/** Vertical bars. Nominal → one hue by default. */
export default function VBar({
  data,
  height = 300,
  valueFormatter,
  colorful = false,
}: {
  data: VBarDatum[];
  height?: number;
  valueFormatter?: (v: number) => string;
  colorful?: boolean;
}) {
  const { palette } = useTheme();
  const fmt = valueFormatter ?? ((v: number) => compact(v));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 6, bottom: 0, left: -6 }} barCategoryGap="24%">
        <defs>
          <linearGradient id="vbar-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.series[0]} stopOpacity={1} />
            <stop offset="100%" stopColor={palette.series[0]} stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={palette.grid} vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: palette.text, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          dy={6}
          interval={0}
        />
        <YAxis
          tick={{ fill: palette.textMuted, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={44}
          tickFormatter={(v) => compact(Number(v))}
        />
        <Tooltip
          cursor={{ fill: palette.cursorFill }}
          content={<ChartTooltip valueFormatter={(v) => fmt(v)} hideSwatch />}
        />
        <Bar dataKey="value" name="Valor" radius={[6, 6, 0, 0]} maxBarSize={54} isAnimationActive={false}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.color ?? (colorful ? palette.series[i % palette.series.length] : "url(#vbar-grad)")} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
