"use client";

import { useMemo } from "react";
import { useData } from "@/components/DataProvider";
import { byCreative, totals } from "@/lib/data";
import { brl, brlPrecise, compact, int, pct } from "@/lib/format";
import PageHeader from "@/components/ui/PageHeader";
import PeriodFilter from "@/components/ui/PeriodFilter";
import EmptyPeriod from "@/components/ui/EmptyPeriod";
import ChartCard from "@/components/ui/ChartCard";
import Insight, { Hi } from "@/components/ui/Insight";
import CreativeCard from "@/components/CreativeCard";
import CreativeTable from "@/components/CreativeTable";

function BannerStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="tabular text-[19px] font-semibold leading-none text-ink sm:text-[22px]">{value}</p>
      <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--cyan)]">
        {label}
      </p>
    </div>
  );
}

export default function Criativos() {
  const { rows } = useData();

  const { creatives, t, best, top } = useMemo(() => {
    const creatives = byCreative(rows); // sorted by engagement desc
    const t = totals(rows);
    const best = [...creatives].filter((c) => c.engagement > 300).sort((a, b) => a.cpe - b.cpe)[0];
    return { creatives, t, best, top: creatives[0] };
  }, [rows]);

  if (!rows.length) {
    return (
      <div>
        <PageHeader title="Criativos" meta={<PeriodFilter />} />
        <EmptyPeriod />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Criativos" meta={<PeriodFilter />} />

      {/* Banner — count + summary */}
      <div className="card animate-in flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-[var(--border-violet)] bg-[var(--violet)]/12">
            <span className="text-[28px] font-semibold leading-none text-[var(--violet-bright)]">
              {creatives.length}
            </span>
          </div>
          <div>
            <p className="text-[15px] font-semibold text-ink">Criativos ativos</p>
            <p className="mt-0.5 text-[13px] text-ink-3">Impulsionados via Meta Ads no Instagram</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
          <BannerStat label="Engajamento" value={int(t.engagement)} />
          <BannerStat label="Alcance" value={compact(t.reach)} />
          <BannerStat label="Visualizações" value={compact(t.videoViews)} />
          <BannerStat label="Investido" value={brl(t.spend)} />
        </div>
      </div>

      {/* Analysis — complementary to the banner */}
      <div className="mt-4">
        <Insight delay={120}>
          O criativo <Hi>«{top?.key}»</Hi> lidera em engajamento, enquanto{" "}
          <Hi>«{best?.key}»</Hi> tem o melhor custo (<Hi>{brlPrecise(best?.cpe ?? 0)}</Hi> por
          engajamento). No conjunto, a taxa de engajamento sobre o alcance é de{" "}
          <Hi>{pct(t.engRate, 0)}</Hi> e <Hi>{pct(t.vtr, 0)}</Hi> das visualizações chegam ao fim do
          vídeo. Toque em <Hi>Ver no Instagram</Hi> para abrir o post original.
        </Insight>
      </div>

      {/* Compact cards — ranked by engagement */}
      <div className="mt-4 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {creatives.map((c, i) => (
          <CreativeCard key={c.key} c={c} rank={i + 1} delay={i * 50} />
        ))}
      </div>

      {/* Sortable table */}
      <div className="mt-4">
        <ChartCard
          title="Tabela de criativos"
          subtitle="Clique nos títulos das colunas para ordenar"
          delay={200}
        >
          <CreativeTable creatives={creatives} />
        </ChartCard>
      </div>
    </div>
  );
}
