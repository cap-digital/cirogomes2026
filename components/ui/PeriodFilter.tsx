"use client";

import { useEffect, useRef, useState } from "react";
import { useData } from "@/components/DataProvider";
import type { PeriodKey } from "@/lib/types";
import { dayLabel } from "@/lib/format";

const PRESETS: { key: PeriodKey; label: string }[] = [
  { key: "yesterday", label: "Ontem" },
  { key: "last7", label: "Últimos 7 dias" },
  { key: "last30", label: "Últimos 30 dias" },
  { key: "all", label: "Todo o período" },
];

const LABELS: Record<PeriodKey, string> = {
  all: "Todo o período",
  yesterday: "Ontem",
  last7: "Últimos 7 dias",
  last30: "Últimos 30 dias",
  custom: "Personalizado",
};

export default function PeriodFilter() {
  const { period, setPeriod, bounds } = useData();
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(period.from);
  const [to, setTo] = useState(period.to);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFrom(period.from);
    setTo(period.to);
  }, [period.from, period.to]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const rangeText =
    period.from === period.to
      ? dayLabel(period.from)
      : `${dayLabel(period.from)} – ${dayLabel(period.to)}`;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-line-2 bg-wash-1 px-4 py-2 text-sm text-ink-2 transition hover:border-[var(--border-violet)]"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        <span className="font-medium text-ink">{LABELS[period.key]}</span>
        <span className="hidden text-ink-3 sm:inline">· {rangeText}</span>
        <svg
          width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-[260px] rounded-2xl border border-line-2 bg-[var(--surface-3)] p-2 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.55)]">
          {PRESETS.map((p) => {
            const active = period.key === p.key;
            return (
              <button
                key={p.key}
                onClick={() => {
                  setPeriod(p.key);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] transition ${
                  active ? "bg-[var(--violet)]/15 font-medium text-ink" : "text-ink-2 hover:bg-wash-1"
                }`}
              >
                {p.label}
                {active && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--violet-bright)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </button>
            );
          })}

          <div className="my-2 border-t border-line" />
          <p className="px-3 pb-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-3">
            Personalizado
          </p>
          <div className="flex items-center gap-2 px-2">
            <input
              type="date"
              value={from}
              min={bounds.min}
              max={bounds.max}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-lg border border-line bg-wash-1 px-2 py-1.5 text-[12px] text-ink outline-none focus:border-[var(--border-violet)]"
            />
            <span className="shrink-0 text-ink-3">–</span>
            <input
              type="date"
              value={to}
              min={bounds.min}
              max={bounds.max}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-lg border border-line bg-wash-1 px-2 py-1.5 text-[12px] text-ink outline-none focus:border-[var(--border-violet)]"
            />
          </div>
          <button
            onClick={() => {
              if (from && to) {
                const [a, b] = from <= to ? [from, to] : [to, from];
                setPeriod("custom", { from: a, to: b });
                setOpen(false);
              }
            }}
            className="mt-2 w-full rounded-lg bg-gradient-to-r from-[var(--violet)] to-[var(--violet-deep)] px-3 py-2 text-[13px] font-semibold text-white transition hover:opacity-90"
          >
            Aplicar período
          </button>
        </div>
      )}
    </div>
  );
}
