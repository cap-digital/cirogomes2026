"use client";

import { useMemo, useState } from "react";
import { useData } from "@/components/DataProvider";
import { useTheme } from "@/components/ThemeProvider";
import {
  totals,
  byDate,
  byCampaign,
  byCreative,
  videoFunnel,
} from "@/lib/data";
import {
  brl,
  brlPrecise,
  compact,
  compactBRL,
  int,
  pct,
  rangeLabel,
  dayLabel,
} from "@/lib/format";
import PageHeader, { RangePill } from "@/components/ui/PageHeader";
import KpiCard from "@/components/ui/KpiCard";
import ChartCard, { LegendDot } from "@/components/ui/ChartCard";
import Insight, { Hi } from "@/components/ui/Insight";
import MetricToggle from "@/components/ui/MetricToggle";
import ComboChart from "@/components/charts/ComboChart";
import TimeSeriesArea from "@/components/charts/TimeSeriesArea";
import HBar from "@/components/charts/HBar";
import Donut from "@/components/charts/Donut";
import Funnel from "@/components/charts/Funnel";

type MetricKey = "reach" | "engagement" | "spend" | "clicks" | "videoViews";

export default function VisaoGeral() {
  const { rows, days } = useData();
  const { palette } = useTheme();
  const [metric, setMetric] = useState<MetricKey>("engagement");

  const { t, daily, campaignDonut, creativeBars, funnel, topCreative } = useMemo(() => {
    const t = totals(rows);
    const daily = byDate(rows).map((d) => ({
      date: d.key,
      reach: d.reach,
      engagement: d.engagement,
      spend: d.spend,
      clicks: d.clicks,
      videoViews: d.videoViews,
    }));
    const campaignDonut = byCampaign(rows).map((c) => ({ label: c.key, value: c.spend }));
    const creatives = byCreative(rows);
    const creativeBars = creatives.slice(0, 5).map((c) => ({ label: c.key, value: c.engagement }));
    return { t, daily, campaignDonut, creativeBars, funnel: videoFunnel(rows), topCreative: creatives[0] };
  }, [rows]);

  const METRICS: { key: MetricKey; label: string; color: string; fmt: (v: number) => string }[] = [
    { key: "reach", label: "Alcance", color: palette.cyanSeries, fmt: (v) => compact(v) },
    { key: "engagement", label: "Engajamento", color: palette.series[0], fmt: (v) => compact(v) },
    { key: "spend", label: "Investimento", color: palette.series[2], fmt: (v) => brl(v) },
    { key: "clicks", label: "Cliques", color: palette.series[3], fmt: (v) => compact(v) },
    { key: "videoViews", label: "Visualizações", color: palette.series[4], fmt: (v) => compact(v) },
  ];
  const current = METRICS.find((m) => m.key === metric)!;

  return (
    <div>
      <PageHeader title="Visão geral" meta={<RangePill>{rangeLabel(days)}</RangePill>} />

      {/* Rich KPIs — big number + folded rates/costs */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <KpiCard
          value={brl(t.spend)}
          label="Investido"
          accent="violet"
          metrics={[
            { label: "CPM", value: brl(t.cpm) },
            { label: "CPC", value: brl(t.cpc) },
          ]}
        />
        <KpiCard
          value={int(t.engagement)}
          label="Engajamentos"
          accent="cyan"
          delay={50}
          metrics={[
            { label: "CPE", value: brlPrecise(t.cpe) },
            { label: "Taxa engaj.", value: pct(t.engRate, 1) },
          ]}
        />
        <KpiCard
          value={compact(t.reach)}
          label="Alcance"
          accent="amber"
          delay={100}
          metrics={[
            { label: "Cliques", value: int(t.clicks) },
            { label: "CTR", value: pct(t.ctr) },
          ]}
        />
        <KpiCard
          value={compact(t.videoViews)}
          label="Visualizações"
          accent="green"
          delay={150}
          metrics={[
            { label: "Assistiram 100%", value: pct(t.vtr, 1) },
            { label: "Custo/view", value: brlPrecise(t.costPerView) },
          ]}
        />
      </div>

      {/* Analysis — moved up, right after the big numbers */}
      <div className="mt-4">
        <Insight delay={180}>
          Volume alto de engajamento com <Hi>CPE de {brlPrecise(t.cpe)}</Hi> — mídia eficiente e
          bem distribuída. Alcance de <Hi>{compact(t.reach)}</Hi> pessoas gerou{" "}
          <Hi>{int(t.engagement)}</Hi> engajamentos (<Hi>{pct(t.engRate, 0)}</Hi> de taxa) e{" "}
          <Hi>{int(t.clicks)}</Hi> cliques no link. O criativo <Hi>«{topCreative?.key}»</Hi> lidera,
          e <Hi>{pct(t.vtr, 0)}</Hi> das visualizações chegam ao fim do vídeo.
        </Insight>
      </div>

      {/* Row A — hero, solo full-width, metric selectable */}
      <div className="mt-4">
        <ChartCard
          title="Evolução diária no período"
          subtitle="Escolha a métrica para acompanhar dia a dia"
          right={<MetricToggle options={METRICS} value={metric} onChange={setMetric} />}
          delay={200}
        >
          <TimeSeriesArea
            data={daily}
            xKey="date"
            series={[{ key: current.key, name: current.label, color: current.color }]}
            xTickFormatter={dayLabel}
            valueFormatter={(v) => current.fmt(v)}
            height={300}
          />
        </ChartCard>
      </div>

      {/* Row B — 7/5 */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <ChartCard
          className="lg:col-span-7"
          title="Alcance e engajamento por dia"
          subtitle="Barras: alcance · Linha: engajamento (mesma escala)"
          right={
            <div className="hidden items-center gap-4 sm:flex">
              <LegendDot color={palette.cyanSeries} label="Alcance" />
              <LegendDot color={palette.series[0]} label="Engajamento" />
            </div>
          }
          delay={240}
        >
          <ComboChart
            data={daily}
            xKey="date"
            bar={{ key: "reach", name: "Alcance", color: palette.cyanSeries }}
            line={{ key: "engagement", name: "Engajamento", color: palette.series[0] }}
            xTickFormatter={dayLabel}
            valueFormatter={(v) => int(v)}
            height={300}
          />
        </ChartCard>

        <ChartCard
          className="lg:col-span-5"
          title="Retenção de vídeo"
          subtitle="Das visualizações até assistir 100%"
          delay={280}
        >
          <Funnel data={funnel} />
        </ChartCard>
      </div>

      {/* Row C — 8/4 */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <ChartCard
          className="lg:col-span-8"
          title="Top criativos por engajamento"
          subtitle="Ranking dos anúncios ativos"
          delay={300}
        >
          <HBar data={creativeBars} valueFormatter={(v) => compact(v)} labelWidth={160} height={300} />
        </ChartCard>

        <ChartCard
          className="lg:col-span-4"
          title="Investimento por campanha"
          subtitle="Distribuição do valor investido"
          delay={340}
        >
          <Donut
            data={campaignDonut}
            centerLabel="investido"
            centerValue={compactBRL(t.spend)}
            valueFormatter={(v) => brl(v)}
            height={188}
          />
        </ChartCard>
      </div>
    </div>
  );
}
