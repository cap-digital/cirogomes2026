/**
 * Chart color tokens — both themes validated with dataviz/validate_palette.js:
 *   DARK  categorical worst CVD ΔE 13.8 · ordinal ramp all-pass (surface #1c1636)
 *   LIGHT categorical worst CVD ΔE 15.6 · ordinal ramp all-pass (surface #ffffff)
 * Recharts needs concrete color strings, so charts read these via the theme context.
 */

export type ThemeName = "dark" | "light";

export interface Palette {
  series: string[];
  ord: string[];
  surface: string;
  grid: string;
  axis: string;
  text: string;
  textMuted: string;
  brandViolet: string;
  brandCyan: string;
  cyanSeries: string;
  cursor: string;
  cursorFill: string;
  scaleLo: [number, number, number];
  scaleHi: [number, number, number];
}

export const DARK: Palette = {
  series: ["#9085e9", "#1f97ab", "#bd8010", "#d55181", "#2fa35c"],
  ord: ["#cdc6f6", "#ac9ff0", "#8b7be8", "#6c56cf", "#553fb0"],
  surface: "#1c1636",
  grid: "rgba(255,255,255,0.06)",
  axis: "#8a83b0",
  text: "#c0b9df",
  textMuted: "#8a83b0",
  brandViolet: "#9085e9",
  brandCyan: "#4fd6e6",
  cyanSeries: "#1f97ab",
  cursor: "rgba(255,255,255,0.18)",
  cursorFill: "rgba(255,255,255,0.04)",
  scaleLo: [40, 32, 74],
  scaleHi: [181, 166, 255],
};

export const LIGHT: Palette = {
  series: ["#5b3fc4", "#0e8fa3", "#b9770c", "#c43f74", "#2b8a4e"],
  ord: ["#b3a6ea", "#9a86e0", "#7f66d2", "#6446bd", "#4a3aa7"],
  surface: "#ffffff",
  grid: "rgba(28,18,66,0.08)",
  axis: "#8a83a6",
  text: "#4b4467",
  textMuted: "#8a83a6",
  brandViolet: "#6d4ac9",
  brandCyan: "#0e8fa3",
  cyanSeries: "#0e8fa3",
  cursor: "rgba(28,18,66,0.16)",
  cursorFill: "rgba(28,18,66,0.045)",
  scaleLo: [233, 229, 249],
  scaleHi: [74, 58, 167],
};

export function getPalette(t: ThemeName): Palette {
  return t === "light" ? LIGHT : DARK;
}

/** Sequential violet interpolation for the heatmap (low → high). */
export function violetScale(t: number, p: Palette): string {
  const x = Math.max(0, Math.min(1, t));
  const e = Math.pow(x, 0.85);
  const c = p.scaleLo.map((l, i) => Math.round(l + (p.scaleHi[i] - l) * e));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

/** Legible ink for a heatmap cell given its normalized value + theme. */
export function violetScaleInk(t: number, theme: ThemeName): string {
  if (theme === "light") return t > 0.5 ? "#f5f3ff" : "#231a4a";
  return t > 0.55 ? "#160f2e" : "#e7e2ff";
}
