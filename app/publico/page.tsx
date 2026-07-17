"use client";

import { useMemo, useState } from "react";
import { useData } from "@/components/DataProvider";
import { useTheme } from "@/components/ThemeProvider";
import {
  byAge,
  byGender,
  ageGenderGrid,
  ageLabel,
  GENDER_LABELS,
  totals,
} from "@/lib/data";
import { brl, brlPrecise, compact, int, pct } from "@/lib/format";
import PageHeader from "@/components/ui/PageHeader";
import PeriodFilter from "@/components/ui/PeriodFilter";
import EmptyPeriod from "@/components/ui/EmptyPeriod";
import KpiCard from "@/components/ui/KpiCard";
import ChartCard from "@/components/ui/ChartCard";
import Insight, { Hi } from "@/components/ui/Insight";
import MetricToggle from "@/components/ui/MetricToggle";
import VBar from "@/components/charts/VBar";
import HBar from "@/components/charts/HBar";
import Donut from "@/components/charts/Donut";
import Heatmap from "@/components/charts/Heatmap";

const isReal = (a: string) => a !== "Unknown" && a !== "Desconhecido";
type AgeMetric = "engagement" | "reach" | "clicks" | "spend";
type HeatMetric = "engagement" | "reach" | "spend";

const AGE_OPTS: { key: AgeMetric; label: string }[] = [
  { key: "engagement", label: "Engajamento" },
  { key: "reach", label: "Alcance" },
  { key: "clicks", label: "Cliques" },
  { key: "spend", label: "Investimento" },
];
const HEAT_OPTS: { key: HeatMetric; label: string }[] = [
  { key: "engagement", label: "Engajamento" },
  { key: "reach", label: "Alcance" },
  { key: "spend", label: "Investimento" },
];
const HEAT_LABEL: Record<HeatMetric, string> = {
  engagement: "engajamentos",
  reach: "de alcance",
  spend: "investidos (R$)",
};
const fmtMetric = (k: string, v: number) => (k === "spend" ? brl(v) : compact(v));

export default function Publico() {
  const { rows } = useData();
  const { palette } = useTheme();
  const [ageMetric, setAgeMetric] = useState<AgeMetric>("engagement");
  const [heatMetric, setHeatMetric] = useState<HeatMetric>("engagement");

  const d = useMemo(() => {
    const t = totals(rows);
    const ages = byAge(rows).filter((g) => isReal(g.key));
    const genders = byGender(rows);
    const genderDonut = genders
      .filter((g) => g.engagement > 0)
      .map((g) => ({ label: GENDER_LABELS[g.key] ?? g.key, value: g.engagement }));

    const ageCpe = ages.map((g) => ({ label: ageLabel(g.key), value: g.cpe }));
    const ageReach = ages.map((g) => ({ label: ageLabel(g.key), value: g.reach }));

    const topAge = [...ages].sort((a, b) => b.engagement - a.engagement)[0];
    const bestCpeAge = [...ages].filter((a) => a.engagement > 500).sort((a, b) => a.cpe - b.cpe)[0];
    const totalGenderEng = genders.reduce((s, g) => s + g.engagement, 0);
    const topGender = [...genders].sort((a, b) => b.engagement - a.engagement)[0];

    return {
      t,
      ages,
      genderDonut,
      ageCpe,
      ageReach,
      topAge,
      bestCpeAge,
      topGender,
      topGenderShare: totalGenderEng ? (topGender.engagement / totalGenderEng) * 100 : 0,
    };
  }, [rows]);

  const ageBars = useMemo(
    () => d.ages.map((g) => ({ label: ageLabel(g.key), value: g[ageMetric] })),
    [d.ages, ageMetric]
  );
  const grid = useMemo(() => ageGenderGrid(rows, heatMetric), [rows, heatMetric]);

  if (!rows.length) {
    return (
      <div>
        <PageHeader title="Público" meta={<PeriodFilter />} />
        <EmptyPeriod />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Público" meta={<PeriodFilter />} />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3 sm:gap-4">
        <KpiCard
          value={ageLabel(d.topAge?.key ?? "")}
          label="Faixa que mais engaja"
          sub={`${int(d.topAge?.engagement ?? 0)} engajamentos`}
          accent="violet"
        />
        <KpiCard
          value={GENDER_LABELS[d.topGender?.key ?? ""] ?? "—"}
          label="Gênero predominante"
          sub={`${pct(d.topGenderShare, 0)} do engajamento`}
          accent="cyan"
          delay={50}
        />
        <KpiCard
          value={ageLabel(d.bestCpeAge?.key ?? "")}
          label="Melhor CPE por faixa"
          sub={`${brlPrecise(d.bestCpeAge?.cpe ?? 0)} por engajamento`}
          accent="green"
          delay={100}
        />
      </div>

      <div className="mt-4">
        <Insight delay={140}>
          O público <Hi>{GENDER_LABELS[d.topGender?.key ?? ""]?.toLowerCase()}</Hi> concentra{" "}
          <Hi>{pct(d.topGenderShare, 0)}</Hi> do engajamento e a faixa{" "}
          <Hi>{ageLabel(d.topAge?.key ?? "")} anos</Hi> é a mais ativa. A melhor eficiência está em{" "}
          <Hi>{ageLabel(d.bestCpeAge?.key ?? "")}</Hi> (CPE {brlPrecise(d.bestCpeAge?.cpe ?? 0)}). O
          mapa de calor concentra nas idades intermediárias — bom alvo para escalar.
        </Insight>
      </div>

      {/* Row A — age bars (selectable) 8 / gender donut 4 */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <ChartCard
          className="lg:col-span-8"
          title="Por faixa etária"
          subtitle="Distribuição por idade"
          right={<MetricToggle options={AGE_OPTS} value={ageMetric} onChange={setAgeMetric} size="sm" />}
          delay={180}
        >
          <VBar data={ageBars} valueFormatter={(v) => fmtMetric(ageMetric, v)} height={300} />
        </ChartCard>

        <ChartCard
          className="lg:col-span-4"
          title="Por gênero"
          subtitle="Participação no engajamento"
          delay={220}
        >
          <Donut
            data={d.genderDonut}
            centerLabel="engajam."
            centerValue={compact(d.t.engagement)}
            valueFormatter={(v) => int(v)}
            height={176}
          />
        </ChartCard>
      </div>

      {/* Row B — heatmap solo, selectable */}
      <div className="mt-4">
        <ChartCard
          title="Faixa etária × gênero"
          subtitle="Cruzamento — escolha a métrica do mapa de calor"
          right={<MetricToggle options={HEAT_OPTS} value={heatMetric} onChange={setHeatMetric} size="sm" />}
          delay={240}
        >
          <Heatmap {...grid} metricLabel={HEAT_LABEL[heatMetric]} />
        </ChartCard>
      </div>

      {/* Row C — 6/6 efficiency */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Alcance por faixa etária" subtitle="Pessoas alcançadas por idade" delay={260}>
          <HBar
            data={d.ageReach.map((x) => ({ ...x, color: palette.cyanSeries }))}
            valueFormatter={(v) => compact(v)}
            labelWidth={56}
          />
        </ChartCard>
        <ChartCard
          title="Custo por engajamento (CPE)"
          subtitle="Menor é melhor — eficiência por idade"
          delay={300}
        >
          <HBar
            data={d.ageCpe.map((x) => ({ ...x, color: palette.series[4] }))}
            valueFormatter={(v) => brlPrecise(v)}
            labelWidth={56}
          />
        </ChartCard>
      </div>
    </div>
  );
}
