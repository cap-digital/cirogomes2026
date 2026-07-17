/** Raw row as returned by the Supabase `CiroGomes2026` edge function. */
export interface RawRow {
  date: string;
  campaign: string;
  adset_name: string;
  ad_name: string;
  thumbnail_url: string;
  instagram_permalink_url: string;
  age: string;
  gender: string;
  spend: number | string;
  clicks: number | string;
  reach: number | string;
  actions_post_engagement: number | string;
  actions_comment: number | string;
  actions_onsite_conversion_post_save: number | string;
  actions_post_reaction: number | string;
  actions_video_view: number | string;
  video_p25_watched_actions_video_view: number | string;
  video_p50_watched_actions_video_view: number | string;
  video_p75_watched_actions_video_view: number | string;
  video_p100_watched_actions_video_view: number | string;
}

/** Followers tab — only campaign-level, no date/gender granularity. */
export interface FollowerRaw {
  campaign: string;
  "followers gained": number | string;
}

export interface ApiResponse {
  success: boolean;
  consolidado: RawRow[];
  seguidores?: FollowerRaw[];
  timestamp: string;
}

export type PeriodKey = "all" | "yesterday" | "last7" | "last30" | "custom";

export interface Period {
  key: PeriodKey;
  from: string; // YYYY-MM-DD inclusive
  to: string; // YYYY-MM-DD inclusive
}

/** Normalized numeric row (empty strings coerced to 0, dates trimmed to YYYY-MM-DD). */
export interface Row {
  date: string;
  campaign: string;
  adset: string;
  ad: string;
  thumbnail: string;
  permalink: string;
  age: string;
  gender: string;
  spend: number;
  clicks: number;
  reach: number;
  engagement: number;
  comments: number;
  saves: number;
  reactions: number;
  videoViews: number;
  p25: number;
  p50: number;
  p75: number;
  p100: number;
}

export type MetricKey =
  | "spend"
  | "clicks"
  | "reach"
  | "engagement"
  | "comments"
  | "saves"
  | "reactions"
  | "videoViews"
  | "p25"
  | "p50"
  | "p75"
  | "p100";
