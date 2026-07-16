"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "./ChartTooltip";
import { useTheme } from "@/components/ThemeProvider";
import { compact } from "@/lib/format";

/**
 * Bars + line on a SINGLE shared axis (never dual-axis). Both measures must be the
 * same unit / comparable scale — here both are volume counts.
 */
export default function ComboChart({
  data,
  xKey,
  bar,
  line,
  height = 300,
  valueFormatter,
  xTickFormatter,
}: {
  data: Record<string, number | string>[];
  xKey: string;
  bar: { key: string; name: string; color: string };
  line: { key: string; name: string; color: string };
  height?: number;
  valueFormatter?: (v: number, name: string) => string;
  xTickFormatter?: (v: string) => string;
}) {
  const { palette } = useTheme();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 6, right: 10, bottom: 0, left: -6 }}>
        <defs>
          <linearGradient id={`bargrad-${bar.key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={bar.color} stopOpacity={0.9} />
            <stop offset="100%" stopColor={bar.color} stopOpacity={0.45} />
          </linearGradient>
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
          cursor={{ fill: palette.cursorFill }}
          content={<ChartTooltip valueFormatter={valueFormatter} labelFormatter={xTickFormatter} />}
        />
        <Bar
          dataKey={bar.key}
          name={bar.name}
          fill={`url(#bargrad-${bar.key})`}
          radius={[6, 6, 0, 0]}
          maxBarSize={46}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey={line.key}
          name={line.name}
          stroke={line.color}
          strokeWidth={2.6}
          dot={{ r: 3.5, strokeWidth: 0, fill: line.color }}
          activeDot={{ r: 5.5, strokeWidth: 2, stroke: palette.surface }}
          isAnimationActive={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
