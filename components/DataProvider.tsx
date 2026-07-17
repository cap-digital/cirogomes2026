"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import type { ApiResponse, Period, PeriodKey, Row } from "@/lib/types";
import {
  normalize,
  normalizeFollowers,
  followersSum as sumFollowers,
  filterByPeriod,
  uniqueDays,
} from "@/lib/data";
import { spToday, addDays } from "@/lib/format";
import LoadingScreen from "./LoadingScreen";

interface DataState {
  rows: Row[]; // filtered by the active period
  allRows: Row[]; // unfiltered
  days: string[]; // days present in the filtered rows
  followers: Record<string, number>; // gained per campaign (campaign-level only)
  followersSum: number;
  period: Period; // resolved { key, from, to }
  setPeriod: (key: PeriodKey, range?: { from: string; to: string }) => void;
  bounds: { min: string; max: string };
  timestamp: string;
  refetch: () => void;
}

const Ctx = createContext<DataState | null>(null);

export function useData(): DataState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useData must be used within <DataProvider>");
  return ctx;
}

type Status = "loading" | "ready" | "error";

export default function DataProvider({ children }: { children: React.ReactNode }) {
  const [allRows, setAllRows] = useState<Row[]>([]);
  const [followers, setFollowers] = useState<Record<string, number>>({});
  const [timestamp, setTimestamp] = useState("");
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string>("");

  const [periodKey, setPeriodKey] = useState<PeriodKey>("all");
  const [custom, setCustom] = useState<{ from: string; to: string } | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/data", { cache: "no-store" });
      if (!res.ok) throw new Error(`Erro ${res.status} ao buscar os dados`);
      const json: ApiResponse = await res.json();
      if (!json?.consolidado?.length) throw new Error("Resposta sem dados");
      setAllRows(normalize(json.consolidado));
      setFollowers(normalizeFollowers(json.seguidores));
      setTimestamp(json.timestamp || new Date().toISOString());
      setStatus("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const bounds = useMemo(() => {
    const ds = uniqueDays(allRows);
    return { min: ds[0] ?? "", max: ds[ds.length - 1] ?? "" };
  }, [allRows]);

  const period = useMemo<Period>(() => {
    if (periodKey === "custom" && custom) return { key: "custom", from: custom.from, to: custom.to };
    const today = spToday();
    if (periodKey === "yesterday") {
      const y = addDays(today, -1);
      return { key: "yesterday", from: y, to: y };
    }
    if (periodKey === "last7") return { key: "last7", from: addDays(today, -6), to: today };
    if (periodKey === "last30") return { key: "last30", from: addDays(today, -29), to: today };
    return { key: "all", from: bounds.min, to: bounds.max };
  }, [periodKey, custom, bounds]);

  const rows = useMemo(() => filterByPeriod(allRows, period.from, period.to), [allRows, period]);

  const setPeriod = useCallback((key: PeriodKey, range?: { from: string; to: string }) => {
    setPeriodKey(key);
    if (key === "custom" && range) setCustom(range);
  }, []);

  const value = useMemo<DataState>(
    () => ({
      rows,
      allRows,
      days: uniqueDays(rows),
      followers,
      followersSum: sumFollowers(followers),
      period,
      setPeriod,
      bounds,
      timestamp,
      refetch: load,
    }),
    [rows, allRows, followers, period, setPeriod, bounds, timestamp, load]
  );

  if (status === "loading") return <LoadingScreen />;

  if (status === "error") {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center px-6">
        <div className="card max-w-md p-8 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-[var(--series-4)]/15 text-[var(--series-4)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">Não foi possível carregar os dados</h2>
          <p className="mt-2 text-sm text-ink-3">{error}</p>
          <button
            onClick={load}
            className="mt-6 rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--violet-deep)] px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
