"use client";

import { useData } from "@/components/DataProvider";

export default function EmptyPeriod() {
  const { setPeriod } = useData();
  return (
    <div className="card animate-in flex flex-col items-center gap-4 p-10 text-center sm:p-14">
      <div className="grid h-12 w-12 place-items-center rounded-full border border-line-2 bg-wash-1 text-ink-3">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18M8 15h.01M12 15h.01M16 15h.01" />
        </svg>
      </div>
      <div>
        <h3 className="text-[15px] font-semibold text-ink">Sem dados no período selecionado</h3>
        <p className="mt-1 text-[13px] text-ink-3">Escolha outro intervalo no filtro acima.</p>
      </div>
      <button
        onClick={() => setPeriod("all")}
        className="rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--violet-deep)] px-5 py-2 text-[13px] font-medium text-white transition hover:opacity-90"
      >
        Ver todo o período
      </button>
    </div>
  );
}
