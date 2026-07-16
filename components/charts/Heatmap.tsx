"use client";

import { useState } from "react";
import { violetScale, violetScaleInk } from "@/lib/theme";
import { useTheme } from "@/components/ThemeProvider";
import { GENDER_LABELS, ageLabel, type HeatCell } from "@/lib/data";
import { compact, int } from "@/lib/format";

export default function Heatmap({
  ages,
  genders,
  cells,
  max,
  metricLabel = "engajamentos",
}: {
  ages: string[];
  genders: string[];
  cells: HeatCell[];
  max: number;
  metricLabel?: string;
}) {
  const { theme, palette } = useTheme();
  const [hover, setHover] = useState<HeatCell | null>(null);
  const get = (age: string, gender: string) =>
    cells.find((c) => c.age === age && c.gender === gender)?.value ?? 0;

  return (
    <div>
      <div className="overflow-x-auto no-scrollbar">
        <div className="min-w-[320px]">
          {/* header */}
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `56px repeat(${genders.length}, minmax(0, 1fr))` }}
          >
            <div />
            {genders.map((g) => (
              <div
                key={g}
                className="pb-1.5 text-center text-[11px] font-medium uppercase tracking-wider text-ink-3"
              >
                {GENDER_LABELS[g] ?? g}
              </div>
            ))}
          </div>
          {/* rows */}
          <div className="flex flex-col gap-1.5">
            {ages.map((age) => (
              <div
                key={age}
                className="grid items-center gap-1.5"
                style={{ gridTemplateColumns: `56px repeat(${genders.length}, minmax(0, 1fr))` }}
              >
                <div className="pr-1 text-right text-[12px] font-medium text-ink-2">
                  {ageLabel(age)}
                </div>
                {genders.map((g) => {
                  const v = get(age, g);
                  const t = max ? v / max : 0;
                  const active = hover?.age === age && hover?.gender === g;
                  return (
                    <div
                      key={g}
                      onMouseEnter={() => setHover({ age, gender: g, value: v })}
                      onMouseLeave={() => setHover(null)}
                      className="grid h-12 place-items-center rounded-lg text-[12px] font-semibold tabular transition-transform duration-150"
                      style={{
                        background: violetScale(t, palette),
                        color: violetScaleInk(t, theme),
                        transform: active ? "scale(1.04)" : "scale(1)",
                        boxShadow: active ? `0 0 0 2px ${palette.cursor}` : "none",
                      }}
                    >
                      {compact(v)}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* scale + readout */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] text-ink-3">
          <span>menos</span>
          <span
            className="h-2.5 w-28 rounded-full"
            style={{ background: `linear-gradient(90deg, ${violetScale(0, palette)}, ${violetScale(0.5, palette)}, ${violetScale(1, palette)})` }}
          />
          <span>mais</span>
        </div>
        <p className="text-[12px] text-ink-3">
          {hover ? (
            <span>
              <span className="text-ink-2">
                {ageLabel(hover.age)} · {GENDER_LABELS[hover.gender] ?? hover.gender}
              </span>{" "}
              — <span className="font-semibold text-ink">{int(hover.value)}</span> {metricLabel}
            </span>
          ) : (
            <span>Passe o mouse nas células · valores em {metricLabel}</span>
          )}
        </p>
      </div>
    </div>
  );
}
