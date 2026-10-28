// Formatting helpers — numbers, dates, ranges, trend deltas.

import type { Biomarker, Lang } from '@/data/types';

const MONTHS: Record<Lang, string[]> = {
  ru: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
  kk: ['қаң', 'ақп', 'нау', 'сәу', 'мам', 'мау', 'шіл', 'там', 'қыр', 'қаз', 'қар', 'жел'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

/** "2026-08-06" → "6 авг 2026" (localized month). */
export function formatDate(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split('-').map(Number);
  const month = MONTHS[lang][(m ?? 1) - 1] ?? '';
  if (d) return `${d} ${month} ${y}`;
  return `${month} ${y}`;
}

/** Trim trailing zeros: 5.30 → "5.3", 152 → "152". */
export function num(v: number): string {
  return Number.isInteger(v) ? String(v) : String(Math.round(v * 100) / 100);
}

/** Human range string from a marker's bounds. */
export function rangeText(low: number | null, high: number | null): string {
  if (low != null && high != null) return `${num(low)}–${num(high)}`;
  if (high != null) return `< ${num(high)}`;
  if (low != null) return `> ${num(low)}`;
  return '—';
}

export interface Delta {
  pct: number;      // signed percentage vs first history point
  dir: 'up' | 'down' | 'flat';
  label: string;    // e.g. "↓ 12%"
}

/** Percentage change from the first to the last history point. */
export function trendDelta(m: Biomarker): Delta | null {
  if (m.history.length < 2) return null;
  const first = m.history[0].value;
  const last = m.history[m.history.length - 1].value;
  if (first === 0) return null;
  const pct = Math.round(((last - first) / Math.abs(first)) * 100);
  const dir = pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat';
  const arrow = dir === 'up' ? '↑' : dir === 'down' ? '↓' : '→';
  return { pct, dir, label: dir === 'flat' ? '→' : `${arrow} ${Math.abs(pct)}%` };
}
