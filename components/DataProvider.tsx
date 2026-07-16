"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import type { ApiResponse, Row } from "@/lib/types";
import { normalize, uniqueDays } from "@/lib/data";
import LoadingScreen from "./LoadingScreen";

interface DataState {
  rows: Row[];
  days: string[];
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
  const [rows, setRows] = useState<Row[]>([]);
  const [timestamp, setTimestamp] = useState("");
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string>("");

  const load = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/data", { cache: "no-store" });
      if (!res.ok) throw new Error(`Erro ${res.status} ao buscar os dados`);
      const json: ApiResponse = await res.json();
      if (!json?.consolidado?.length) throw new Error("Resposta sem dados");
      setRows(normalize(json.consolidado));
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

  const value = useMemo<DataState>(
    () => ({ rows, days: uniqueDays(rows), timestamp, refetch: load }),
    [rows, timestamp, load]
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
