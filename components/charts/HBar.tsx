"use client";

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "./ChartTooltip";
import { useTheme } from "@/components/ThemeProvider";
import { compact } from "@/lib/format";

export interface HBarDatum {
  label: string;
  value: number;
  color?: string;
}

/** Horizontal bars. Nominal → one hue by default; pass colors for categorical. */
export default function HBar({
  data,
  height,
  valueFormatter,
  colorful = false,
  labelWidth = 132,
}: {
  data: HBarDatum[];
  height?: number;
  valueFormatter?: (v: number) => string;
  colorful?: boolean;
  labelWidth?: number;
}) {
  const { palette } = useTheme();
  const h = height ?? Math.max(150, data.length * 52 + 20);
  const fmt = valueFormatter ?? ((v: number) => compact(v));

  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 2, right: 72, bottom: 2, left: 0 }}
        barCategoryGap={14}
      >
        <XAxis type="number" hide />
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
          content={<ChartTooltip valueFormatter={(v) => fmt(v)} hideSwatch />}
        />
        <Bar dataKey="value" name="Valor" radius={[4, 6, 6, 4]} maxBarSize={26} isAnimationActive={false}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.color ?? (colorful ? palette.series[i % palette.series.length] : palette.series[0])} />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            formatter={(v: number) => fmt(v)}
            style={{ fill: palette.text, fontSize: 12, fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
