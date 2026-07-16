/** pt-BR number / currency / percent formatting helpers. */

const nf0 = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

export function int(n: number): string {
  return nf0.format(Math.round(n || 0));
}

export function dec(n: number, digits = 2): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n || 0);
}

export function brl(n: number, digits = 2): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n || 0);
}

/** Compact currency for small unit costs (e.g. CPE R$ 0,0138). */
export function brlPrecise(n: number): string {
  return "R$ " + dec(n, 4);
}

export function pct(n: number, digits = 2): string {
  return dec(n, digits) + "%";
}

/** Compact "mil / Mi" abbreviation, pt-BR style. */
export function compact(n: number): string {
  const v = n || 0;
  if (Math.abs(v) >= 1_000_000) return nf1.format(v / 1_000_000) + " Mi";
  if (Math.abs(v) >= 1_000) return nf1.format(v / 1_000) + " mil";
  return nf0.format(v);
}

export function compactBRL(n: number): string {
  const v = n || 0;
  if (Math.abs(v) >= 1_000_000) return "R$ " + nf1.format(v / 1_000_000) + " Mi";
  if (Math.abs(v) >= 1_000) return "R$ " + nf1.format(v / 1_000) + " mil";
  return brl(v);
}

const MONTHS = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

/** "08 jul" from an ISO / YYYY-MM-DD string (no timezone drift). */
export function dayLabel(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${String(d).padStart(2, "0")} ${MONTHS[m - 1]}`;
}

/** "8 – 16 jul 2026" from a sorted list of YYYY-MM-DD strings. */
export function rangeLabel(days: string[]): string {
  if (!days.length) return "";
  const a = days[0].slice(0, 10).split("-").map(Number);
  const b = days[days.length - 1].slice(0, 10).split("-").map(Number);
  const sameMonth = a[1] === b[1] && a[0] === b[0];
  if (sameMonth) return `${a[2]} – ${b[2]} ${MONTHS[b[1] - 1]} ${b[0]}`;
  return `${a[2]} ${MONTHS[a[1] - 1]} – ${b[2]} ${MONTHS[b[1] - 1]} ${b[0]}`;
}

/** Human date-time for "atualizado em". */
export function updatedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
