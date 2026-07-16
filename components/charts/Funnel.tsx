"use client";

import { useTheme } from "@/components/ThemeProvider";
import { int, pct } from "@/lib/format";

export interface FunnelDatum {
  label: string;
  value: number;
}

/** Legible ink for text sitting on a colored bar. */
function inkOn(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const L = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return L > 0.58 ? "#160f2e" : "#f4f2ff";
}

/**
 * Centered funnel — ordinal stages on the violet ramp (light→dark). Widths are
 * proportional to the top stage; each row shows retention vs top and step drop.
 */
export default function Funnel({ data }: { data: FunnelDatum[] }) {
  const { palette } = useTheme();
  const top = data[0]?.value || 1;

  return (
    <div className="flex flex-col gap-2.5">
      {data.map((d, i) => {
        const widthPct = Math.max(6, (d.value / top) * 100);
        const retention = (d.value / top) * 100;
        const prev = i > 0 ? data[i - 1].value : d.value;
        const stepDrop = i > 0 && prev ? (1 - d.value / prev) * 100 : 0;
        const color = palette.ord[Math.min(i, palette.ord.length - 1)];
        const ink = inkOn(color);

        return (
          <div key={d.label} className="group">
            <div className="mb-1 flex items-baseline justify-between text-[12px]">
              <span className="font-medium text-ink-2">{d.label}</span>
              <span className="tabular text-ink-3">
                <span className="font-semibold text-ink">{int(d.value)}</span>
                <span className="ml-2">{pct(retention, 0)} do topo</span>
              </span>
            </div>
            <div className="relative h-9 w-full overflow-hidden rounded-lg bg-wash-1">
              <div
                className="flex h-full items-center justify-end rounded-lg px-3 transition-[width] duration-700 ease-out"
                style={{
                  width: `${widthPct}%`,
                  background: `linear-gradient(90deg, ${color}cc, ${color})`,
                }}
              >
                <span className="tabular text-[11px] font-semibold" style={{ color: ink }}>
                  {pct(retention, 0)}
                </span>
              </div>
            </div>
            {i > 0 && stepDrop > 0.5 && (
              <div className="mt-1 flex justify-center">
                <span className="tabular rounded-full bg-wash-2 px-2 py-0.5 text-[10px] text-ink-3">
                  −{pct(stepDrop, 0)} vs. etapa anterior
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
