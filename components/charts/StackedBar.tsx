"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "./ChartTooltip";
import { useTheme } from "@/components/ThemeProvider";
import { compact } from "@/lib/format";
import type { SeriesDef } from "./TimeSeriesArea";

/** Horizontal stacked bars — segments separated by a 2px surface gap (skill rule). */
export default function StackedBar({
  data,
  series,
  height,
  valueFormatter,
  labelWidth = 120,
}: {
  data: Record<string, number | string>[];
  series: SeriesDef[];
  height?: number;
  valueFormatter?: (v: number, name: string) => string;
  labelWidth?: number;
}) {
  const { palette } = useTheme();
  const h = height ?? Math.max(140, data.length * 66 + 20);
  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 2, right: 12, bottom: 2, left: 0 }}
        barCategoryGap={18}
      >
        <CartesianGrid stroke={palette.grid} horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: palette.textMuted, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => compact(Number(v))}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={labelWidth}
          tick={{ fill: palette.text, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          interval={0}
        />
        <Tooltip
          cursor={{ fill: palette.cursorFill }}
          content={<ChartTooltip valueFormatter={valueFormatter} />}
        />
        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.name}
            stackId="a"
            fill={s.color}
            stroke={palette.surface}
            strokeWidth={2}
            radius={i === series.length - 1 ? [0, 5, 5, 0] : i === 0 ? [5, 0, 0, 5] : 0}
            maxBarSize={34}
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
