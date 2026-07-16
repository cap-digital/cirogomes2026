"use client";

import { useMemo, useState } from "react";
import type { CreativeRollup } from "@/lib/data";
import { brl, brlPrecise, compact, int, pct } from "@/lib/format";

interface Col {
  key: string;
  label: string;
  numeric: boolean;
  get: (c: CreativeRollup) => number | string;
  render: (c: CreativeRollup) => string;
}

const vtr = (c: CreativeRollup) => (c.videoViews ? (c.p100 / c.videoViews) * 100 : 0);

const COLS: Col[] = [
  { key: "key", label: "Criativo", numeric: false, get: (c) => c.key, render: (c) => c.key },
  { key: "campaign", label: "Campanha", numeric: false, get: (c) => c.campaign, render: (c) => c.campaign },
  { key: "spend", label: "Investido", numeric: true, get: (c) => c.spend, render: (c) => brl(c.spend) },
  { key: "reach", label: "Alcance", numeric: true, get: (c) => c.reach, render: (c) => int(c.reach) },
  { key: "engagement", label: "Engaj.", numeric: true, get: (c) => c.engagement, render: (c) => int(c.engagement) },
  { key: "clicks", label: "Cliques", numeric: true, get: (c) => c.clicks, render: (c) => int(c.clicks) },
  { key: "videoViews", label: "Views", numeric: true, get: (c) => c.videoViews, render: (c) => compact(c.videoViews) },
  { key: "vtr", label: "Vídeo 100%", numeric: true, get: (c) => vtr(c), render: (c) => pct(vtr(c), 0) },
  { key: "cpe", label: "CPE", numeric: true, get: (c) => c.cpe, render: (c) => brlPrecise(c.cpe) },
];

export default function CreativeTable({ creatives }: { creatives: CreativeRollup[] }) {
  const [sortKey, setSortKey] = useState("engagement");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    const col = COLS.find((c) => c.key === sortKey)!;
    const arr = [...creatives].sort((a, b) => {
      const av = col.get(a);
      const bv = col.get(b);
      if (typeof av === "string" || typeof bv === "string") {
        return String(av).localeCompare(String(bv), "pt-BR");
      }
      return av - bv;
    });
    return dir === "desc" ? arr.reverse() : arr;
  }, [creatives, sortKey, dir]);

  const onSort = (key: string, numeric: boolean) => {
    if (key === sortKey) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDir(numeric ? "desc" : "asc");
    }
  };

  return (
    <div className="overflow-x-auto no-scrollbar">
      <table className="w-full min-w-[720px] border-collapse text-[13px]">
        <thead>
          <tr>
            {COLS.map((col) => {
              const active = col.key === sortKey;
              return (
                <th
                  key={col.key}
                  onClick={() => onSort(col.key, col.numeric)}
                  className={`cursor-pointer select-none pb-3 font-medium ${
                    col.numeric ? "text-right" : "text-left"
                  } ${active ? "text-ink" : "text-ink-3 hover:text-ink-2"}`}
                >
                  <span className={`inline-flex items-center gap-1 ${col.numeric ? "flex-row-reverse" : ""}`}>
                    {col.label}
                    <span className={`text-[9px] transition-opacity ${active ? "opacity-100 text-[var(--violet-bright)]" : "opacity-30"}`}>
                      {active ? (dir === "asc" ? "▲" : "▼") : "▼"}
                    </span>
                  </span>
                </th>
              );
            })}
            <th className="pb-3" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((c, i) => (
            <tr key={c.key} className="border-t border-line transition-colors hover:bg-wash-1">
              {COLS.map((col) => (
                <td
                  key={col.key}
                  className={`py-2.5 ${col.numeric ? "tabular text-right font-semibold text-ink" : ""} ${
                    col.key === "key" ? "max-w-[240px] pr-3" : ""
                  } ${col.key === "campaign" ? "text-ink-3" : col.numeric ? "" : "text-ink-2"}`}
                >
                  {col.key === "key" ? (
                    <span className="flex items-center gap-2">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-wash-2 text-[10px] font-semibold text-ink-3">
                        {i + 1}
                      </span>
                      <span className="truncate">{col.render(c)}</span>
                    </span>
                  ) : (
                    col.render(c)
                  )}
                </td>
              ))}
              <td className="py-2.5 pl-2 text-right">
                <a
                  href={c.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir no Instagram"
                  className="inline-grid h-7 w-7 place-items-center rounded-lg border border-line text-ink-3 transition hover:border-[var(--border-violet)] hover:text-[var(--violet-bright)]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-10.4a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" />
                  </svg>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
