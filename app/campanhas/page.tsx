"use client";

import { useMemo, useState } from "react";
import { useData } from "@/components/DataProvider";
import { useTheme } from "@/components/ThemeProvider";
import { byCampaign, totals, type Group } from "@/lib/data";
import { brl, brlPrecise, compact, int, pct, dayLabel } from "@/lib/format";
import PageHeader, { RangePill } from "@/components/ui/PageHeader";
import ChartCard, { LegendDot } from "@/components/ui/ChartCard";
import Insight, { Hi } from "@/components/ui/Insight";
import MetricToggle from "@/components/ui/MetricToggle";
import TimeSeriesArea from "@/components/charts/TimeSeriesArea";
import StackedBar from "@/components/charts/StackedBar";
import Donut from "@/components/charts/Donut";

type DayMetric = "engagement" | "reach" | "spend" | "clicks";
const DAY_OPTS: { key: DayMetric; label: string }[] = [
  { key: "engagement", label: "Engajamento" },
  { key: "reach", label: "Alcance" },
  { key: "spend", label: "Investimento" },
  { key: "clicks", label: "Cliques" },
];

function CampaignCard({ c, color, share, delay }: { c: Group; color: string; share: number; delay: number }) {
  return (
    <div className="card card-hover animate-in p-5 sm:p-6" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="h-3 w-3 rounded-[4px]" style={{ background: color }} />
          <h3 className="text-[15px] font-semibold leading-tight text-ink">{c.key}</h3>
        </div>
        <span className="tabular shrink-0 rounded-full bg-wash-2 px-2.5 py-1 text-[12px] font-semibold text-ink-2">
          {pct(share, 0)} do inv.
        </span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
        {[
          { label: "Investido", value: brl(c.spend) },
          { label: "Engajamentos", value: int(c.engagement) },
          { label: "Alcance", value: compact(c.reach) },
          { label: "CPE", value: brlPrecise(c.cpe) },
        ].map((m) => (
          <div key={m.label}>
            <p className="tabular text-[19px] font-semibold leading-none text-ink">{m.value}</p>
            <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-3">{m.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-wash-2">
        <div className="h-full rounded-full" style={{ width: `${share}%`, background: color }} />
      </div>
    </div>
  );
}

export default function Campanhas() {
  const { rows } = useData();
  const { palette } = useTheme();
  const [dayMetric, setDayMetric] = useState<DayMetric>("engagement");

  const { t, campaigns, names, composition, spendDonut } = useMemo(() => {
    const t = totals(rows);
    const campaigns = byCampaign(rows);
    const names = campaigns.map((c) => c.key);
    const composition = campaigns.map((c) => ({
      label: c.key,
      reactions: c.reactions,
      comments: c.comments,
      saves: c.saves,
      other: Math.max(0, c.engagement - c.reactions - c.comments - c.saves),
    }));
    const spendDonut = campaigns.map((c) => ({ label: c.key, value: c.spend }));
    return { t, campaigns, names, composition, spendDonut };
  }, [rows]);

  const dailyByCampaign = useMemo(() => {
    const map = new Map<string, Record<string, number | string>>();
    for (const r of rows) {
      if (!map.has(r.date)) {
        const base: Record<string, number | string> = { date: r.date };
        for (const n of names) base[n] = 0;
        map.set(r.date, base);
      }
      const o = map.get(r.date)!;
      o[r.campaign] = (Number(o[r.campaign]) || 0) + r[dayMetric];
    }
    return Array.from(map.values()).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [rows, names, dayMetric]);

  const areaSeries = names.map((n, i) => ({ key: n, name: n, color: palette.series[i % palette.series.length] }));
  const compSeries = [
    { key: "reactions", name: "Reações", color: palette.series[0] },
    { key: "comments", name: "Comentários", color: palette.series[1] },
    { key: "saves", name: "Salvamentos", color: palette.series[2] },
    { key: "other", name: "Cliques e outros", color: palette.series[3] },
  ];
  const tableMetrics: { label: string; get: (c: Group) => string }[] = [
    { label: "Investido", get: (c) => brl(c.spend) },
    { label: "Engajamentos", get: (c) => int(c.engagement) },
    { label: "Alcance", get: (c) => int(c.reach) },
    { label: "Cliques", get: (c) => int(c.clicks) },
    { label: "CPE", get: (c) => brlPrecise(c.cpe) },
    { label: "CTR", get: (c) => pct(c.ctr) },
    { label: "Taxa de engaj.", get: (c) => pct(c.engRate, 1) },
  ];
  const dayFmt = (v: number) => (dayMetric === "spend" ? brl(v) : compact(v));

  return (
    <div>
      <PageHeader title="Campanhas" meta={<RangePill>{campaigns.length} campanhas ativas</RangePill>} />

      {/* Campaign cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {campaigns.map((c, i) => (
          <CampaignCard
            key={c.key}
            c={c}
            color={palette.series[i % palette.series.length]}
            share={t.spend ? (c.spend / t.spend) * 100 : 0}
            delay={i * 60}
          />
        ))}
      </div>

      <div className="mt-4">
        <Insight delay={140}>
          A campanha <Hi>«{campaigns[0]?.key}»</Hi> concentra{" "}
          <Hi>{pct(t.spend ? (campaigns[0].spend / t.spend) * 100 : 0, 0)}</Hi> do investimento e o
          maior alcance. No total, as campanhas somam <Hi>{int(t.engagement)}</Hi> engajamentos a um
          CPE consolidado de <Hi>{brlPrecise(t.cpe)}</Hi>, com o engajamento vindo majoritariamente
          de reações e cliques.
        </Insight>
      </div>

      {/* Row A — daily per campaign, selectable, solo */}
      <div className="mt-4">
        <ChartCard
          title="Evolução diária por campanha"
          subtitle="Comparativo ao longo dos dias"
          right={
            <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
              <div className="hidden flex-wrap items-center gap-3 sm:flex">
                {areaSeries.map((s) => (
                  <LegendDot key={s.key} color={s.color} label={s.name} />
                ))}
              </div>
              <MetricToggle options={DAY_OPTS} value={dayMetric} onChange={setDayMetric} size="sm" />
            </div>
          }
          delay={200}
        >
          <TimeSeriesArea
            data={dailyByCampaign}
            xKey="date"
            series={areaSeries}
            xTickFormatter={dayLabel}
            valueFormatter={(v) => dayFmt(v)}
            height={300}
          />
        </ChartCard>
      </div>

      {/* Row B — 8/4 */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <ChartCard
          className="lg:col-span-8"
          title="Composição do engajamento"
          subtitle="Que tipo de ação cada campanha gera"
          right={
            <div className="hidden flex-wrap items-center gap-3 sm:flex">
              {compSeries.map((s) => (
                <LegendDot key={s.key} color={s.color} label={s.name} />
              ))}
            </div>
          }
          delay={240}
        >
          <StackedBar data={composition} series={compSeries} valueFormatter={(v) => int(v)} labelWidth={130} />
        </ChartCard>

        <ChartCard
          className="lg:col-span-4"
          title="Investimento por campanha"
          subtitle="Distribuição do orçamento"
          delay={280}
        >
          <Donut
            data={spendDonut}
            centerLabel="investido"
            centerValue={brl(t.spend)}
            valueFormatter={(v) => brl(v)}
            height={176}
          />
        </ChartCard>
      </div>

      {/* Row C — comparison table, solo */}
      <div className="mt-4">
        <ChartCard title="Comparativo de métricas" subtitle="Campanhas lado a lado" delay={300}>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[440px] text-[13px]">
              <thead>
                <tr className="text-left">
                  <th className="pb-3 font-medium text-ink-3">Métrica</th>
                  {campaigns.map((c, i) => (
                    <th key={c.key} className="pb-3 text-right">
                      <span className="inline-flex items-center gap-1.5 font-medium text-ink-2">
                        <span className="h-2 w-2 rounded-[3px]" style={{ background: palette.series[i % palette.series.length] }} />
                        {c.key}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableMetrics.map((m) => (
                  <tr key={m.label} className="border-t border-line">
                    <td className="py-2.5 text-ink-3">{m.label}</td>
                    {campaigns.map((c) => (
                      <td key={c.key} className="tabular py-2.5 text-right font-semibold text-ink">
                        {m.get(c)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
