import type { FollowerRaw, RawRow, Row } from "./types";

/** Coerce Meta's empty-string-as-null metric values into numbers. */
export function num(v: unknown): number {
  if (v === "" || v === null || v === undefined) return 0;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
}

export function normalize(raw: RawRow[]): Row[] {
  return raw.map((r) => ({
    date: (r.date || "").slice(0, 10),
    campaign: cleanTag(r.campaign),
    adset: cleanTag(r.adset_name),
    ad: cleanTag(r.ad_name),
    thumbnail: r.thumbnail_url || "",
    permalink: r.instagram_permalink_url || "",
    age: r.age || "Desconhecido",
    gender: r.gender || "unknown",
    spend: num(r.spend),
    clicks: num(r.clicks),
    reach: num(r.reach),
    engagement: num(r.actions_post_engagement),
    comments: num(r.actions_comment),
    saves: num(r.actions_onsite_conversion_post_save),
    reactions: num(r.actions_post_reaction),
    videoViews: num(r.actions_video_view),
    p25: num(r.video_p25_watched_actions_video_view),
    p50: num(r.video_p50_watched_actions_video_view),
    p75: num(r.video_p75_watched_actions_video_view),
    p100: num(r.video_p100_watched_actions_video_view),
  }));
}

/** "[TRÁFEGO PARA O PERFIL]" -> "Tráfego para o perfil" */
export function cleanTag(s: string): string {
  if (!s) return "";
  const inner = s.replace(/[[\]]/g, "").trim();
  if (!inner) return "";
  return inner.charAt(0).toUpperCase() + inner.slice(1).toLowerCase();
}

/** Followers gained per campaign (keyed by cleaned campaign name). Campaign-level only. */
export function normalizeFollowers(raw?: FollowerRaw[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const r of raw ?? []) {
    const key = cleanTag(r.campaign);
    map[key] = (map[key] ?? 0) + num(r["followers gained"]);
  }
  return map;
}

export const followersSum = (map: Record<string, number>): number =>
  Object.values(map).reduce((a, b) => a + b, 0);

/** Derived follower metrics. Computed from all-time data (followers has no date). */
export function followerMetrics(allRows: Row[], followers: number) {
  const s = totals(allRows);
  return {
    followers,
    cpf: safeDiv(s.spend, followers), // custo por seguidor
    rateReach: safeDiv(followers, s.reach) * 100, // % do alcance que virou seguidor
    rateEng: safeDiv(followers, s.engagement) * 100,
  };
}

/** Filter dated rows to an inclusive [from, to] YYYY-MM-DD window. */
export function filterByPeriod(rows: Row[], from: string, to: string): Row[] {
  if (!from || !to) return rows;
  return rows.filter((r) => r.date >= from && r.date <= to);
}

const SUM_KEYS = [
  "spend", "clicks", "reach", "engagement", "comments", "saves",
  "reactions", "videoViews", "p25", "p50", "p75", "p100",
] as const;

type SumKey = (typeof SUM_KEYS)[number];
export type Sums = Record<SumKey, number>;

function emptySums(): Sums {
  return Object.fromEntries(SUM_KEYS.map((k) => [k, 0])) as Sums;
}

function addInto(acc: Sums, r: Row) {
  for (const k of SUM_KEYS) acc[k] += r[k];
}

export interface Totals extends Sums {
  cpe: number;      // custo por engajamento
  cpc: number;      // custo por clique
  cpm: number;      // custo por mil alcançados
  ctr: number;      // cliques / alcance (%)
  engRate: number;  // engajamento / alcance (%)
  vtr: number;      // p100 / views (%)
  hookRate: number; // views / alcance (%)
  costPerView: number;
  costPerReach1k: number;
}

export function totals(rows: Row[]): Totals {
  const s = emptySums();
  for (const r of rows) addInto(s, r);
  return {
    ...s,
    cpe: safeDiv(s.spend, s.engagement),
    cpc: safeDiv(s.spend, s.clicks),
    cpm: safeDiv(s.spend, s.reach) * 1000,
    ctr: safeDiv(s.clicks, s.reach) * 100,
    engRate: safeDiv(s.engagement, s.reach) * 100,
    vtr: safeDiv(s.p100, s.videoViews) * 100,
    hookRate: safeDiv(s.videoViews, s.reach) * 100,
    costPerView: safeDiv(s.spend, s.videoViews),
    costPerReach1k: safeDiv(s.spend, s.reach) * 1000,
  };
}

export function safeDiv(a: number, b: number): number {
  return b ? a / b : 0;
}

/** Generic group-by that returns sums + derived cpe/engRate per group, sorted. */
export interface Group extends Sums {
  key: string;
  cpe: number;
  engRate: number;
  ctr: number;
}

export function groupBy(rows: Row[], field: (r: Row) => string): Group[] {
  const map = new Map<string, Sums>();
  for (const r of rows) {
    const k = field(r);
    if (!map.has(k)) map.set(k, emptySums());
    addInto(map.get(k)!, r);
  }
  return Array.from(map.entries()).map(([key, s]) => ({
    key,
    ...s,
    cpe: safeDiv(s.spend, s.engagement),
    engRate: safeDiv(s.engagement, s.reach) * 100,
    ctr: safeDiv(s.clicks, s.reach) * 100,
  }));
}

export const uniqueDays = (rows: Row[]): string[] =>
  Array.from(new Set(rows.map((r) => r.date))).filter(Boolean).sort();

/** Daily time series, filled and sorted ascending. */
export function byDate(rows: Row[]): Group[] {
  return groupBy(rows, (r) => r.date).sort((a, b) => a.key.localeCompare(b.key));
}

export function byCampaign(rows: Row[]): Group[] {
  return groupBy(rows, (r) => r.campaign).sort((a, b) => b.spend - a.spend);
}

const AGE_ORDER = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+", "Unknown", "Desconhecido"];
export function byAge(rows: Row[]): Group[] {
  return groupBy(rows, (r) => r.age).sort(
    (a, b) => AGE_ORDER.indexOf(a.key) - AGE_ORDER.indexOf(b.key)
  );
}

export function byGender(rows: Row[]): Group[] {
  const order = ["female", "male", "unknown"];
  return groupBy(rows, (r) => r.gender).sort(
    (a, b) => order.indexOf(a.key) - order.indexOf(b.key)
  );
}

export const GENDER_LABELS: Record<string, string> = {
  female: "Feminino",
  male: "Masculino",
  unknown: "Não informado",
};

export function ageLabel(a: string): string {
  return a === "Unknown" || a === "Desconhecido" ? "N/D" : a;
}

/** Per-creative rollup, carrying the thumbnail + permalink + campaign. */
export interface CreativeRollup extends Group {
  thumbnail: string;
  permalink: string;
  campaign: string;
}

export function byCreative(rows: Row[]): CreativeRollup[] {
  const meta = new Map<string, { thumbnail: string; permalink: string; campaign: string }>();
  for (const r of rows) {
    if (!meta.has(r.ad)) {
      meta.set(r.ad, { thumbnail: r.thumbnail, permalink: r.permalink, campaign: r.campaign });
    }
  }
  return groupBy(rows, (r) => r.ad)
    .map((g) => ({ ...g, ...meta.get(g.key)! }))
    .sort((a, b) => b.engagement - a.engagement);
}

/** Age × gender matrix for the heatmap (value = engagement by default). */
export interface HeatCell {
  age: string;
  gender: string;
  value: number;
}
export function ageGenderGrid(
  rows: Row[],
  metric: "engagement" | "reach" | "spend" = "engagement"
): { ages: string[]; genders: string[]; cells: HeatCell[]; max: number } {
  const genders = ["female", "male", "unknown"];
  const ages = byAge(rows).map((g) => g.key).filter((a) => a !== "Unknown" && a !== "Desconhecido");
  const map = new Map<string, number>();
  let max = 0;
  for (const r of rows) {
    if (!ages.includes(r.age)) continue;
    const k = `${r.age}|${r.gender}`;
    const v = (map.get(k) ?? 0) + r[metric];
    map.set(k, v);
    if (v > max) max = v;
  }
  const cells: HeatCell[] = [];
  for (const age of ages)
    for (const gender of genders)
      cells.push({ age, gender, value: map.get(`${age}|${gender}`) ?? 0 });
  return { ages, genders, cells, max };
}

/** Video watch-through funnel stages. */
export interface FunnelStage {
  key: string;
  label: string;
  value: number;
}
export function videoFunnel(rows: Row[]): FunnelStage[] {
  const t = totals(rows);
  return [
    { key: "views", label: "Visualizações", value: t.videoViews },
    { key: "p25", label: "25% assistido", value: t.p25 },
    { key: "p50", label: "50% assistido", value: t.p50 },
    { key: "p75", label: "75% assistido", value: t.p75 },
    { key: "p100", label: "100% assistido", value: t.p100 },
  ];
}

/** Engagement composition (for stacked / breakdown views). */
export function engagementBreakdown(rows: Row[]) {
  const t = totals(rows);
  const other = Math.max(
    0,
    t.engagement - t.reactions - t.comments - t.saves
  );
  return [
    { key: "reactions", label: "Reações", value: t.reactions },
    { key: "comments", label: "Comentários", value: t.comments },
    { key: "saves", label: "Salvamentos", value: t.saves },
    { key: "other", label: "Cliques e outros", value: other },
  ];
}
