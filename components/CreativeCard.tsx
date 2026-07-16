"use client";

import { useState } from "react";
import type { CreativeRollup } from "@/lib/data";
import { brlPrecise, compact, pct } from "@/lib/format";

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="tabular text-[13px] font-semibold leading-none text-ink">{value}</p>
      <p className="mt-1 truncate text-[9px] font-medium uppercase tracking-[0.08em] text-ink-3">{label}</p>
    </div>
  );
}

const SwapIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3l4 4-4 4" />
    <path d="M21 7H8a4 4 0 0 0-4 4" />
    <path d="M7 21l-4-4 4-4" />
    <path d="M3 17h13a4 4 0 0 0 4-4" />
  </svg>
);

/** Compact creative card — metrics toggle between general and video-retention. */
export default function CreativeCard({
  c,
  rank,
  delay = 0,
}: {
  c: CreativeRollup;
  rank: number;
  delay?: number;
}) {
  const [imgOk, setImgOk] = useState(true);
  const [mode, setMode] = useState<"geral" | "video">("geral");
  const engRate = c.reach ? (c.engagement / c.reach) * 100 : 0;
  const ret = (p: number) => (c.videoViews ? (p / c.videoViews) * 100 : 0);

  const metrics =
    mode === "geral"
      ? [
          { label: "Engaj.", value: compact(c.engagement) },
          { label: "Alcance", value: compact(c.reach) },
          { label: "Cliques", value: compact(c.clicks) },
          { label: "CPE", value: brlPrecise(c.cpe) },
        ]
      : [
          { label: "Views", value: compact(c.videoViews) },
          { label: "Assistiu 25%", value: pct(ret(c.p25), 0) },
          { label: "Assistiu 50%", value: pct(ret(c.p50), 0) },
          { label: "Assistiu 75%", value: pct(ret(c.p75), 0) },
        ];

  return (
    <article
      className="card card-hover animate-in group flex flex-col overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-[#241a52] to-[#120c2c]">
        {c.thumbnail && imgOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.thumbnail}
            alt={c.key}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgOk(false)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-ink-3">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.8" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            <span className="px-3 text-center text-[10px]">Prévia indisponível</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        <span className="absolute left-2 top-2 grid h-6 min-w-6 place-items-center rounded-full bg-black/50 px-1.5 text-[11px] font-semibold text-white backdrop-blur-md ring-1 ring-white/15">
          #{rank}
        </span>
        <span className="absolute bottom-2 right-2 rounded-full bg-[var(--violet)]/30 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md ring-1 ring-[var(--border-violet)]">
          {pct(engRate, 0)} eng.
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-center gap-2">
          <p className="min-w-0 flex-1 truncate text-[9px] font-medium uppercase tracking-wide text-ink-3">
            {c.campaign}
          </p>
          <button
            onClick={() => setMode((m) => (m === "geral" ? "video" : "geral"))}
            aria-label={mode === "geral" ? "Ver métricas de vídeo" : "Ver métricas gerais"}
            title="Trocar métricas"
            className="flex shrink-0 items-center gap-1 rounded-lg border border-[var(--border-violet)] bg-[var(--violet)]/20 px-2 py-1 text-[10px] font-semibold text-[var(--violet-bright)] shadow-sm transition hover:bg-[var(--violet)]/30 hover:shadow active:scale-95"
          >
            <SwapIcon />
            {mode === "geral" ? "Vídeo" : "Geral"}
          </button>
        </div>

        <h3 className="mt-0.5 line-clamp-2 min-h-[34px] text-[13px] font-semibold leading-tight tracking-tight text-ink">
          {c.key}
        </h3>

        <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-2.5">
          {metrics.map((m) => (
            <Mini key={m.label} label={m.label} value={m.value} />
          ))}
        </div>

        <a
          href={c.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#7c5cf6] to-[#6c56cf] px-3 py-2 text-[12px] font-semibold text-white transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--violet-bright)]"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-10.4a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" />
          </svg>
          Ver no Instagram
        </a>
      </div>
    </article>
  );
}
