import type { DateFormat, RegionConfig } from "@/lib/regions/types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Format a "YYYY-MM" value according to the region's convention. */
export function formatMonth(value: string, format: DateFormat): string {
  const m = /^(\d{4})-(\d{2})/.exec(value);
  if (!m) return value;
  const [, year, month] = m;
  switch (format) {
    case "MMM YYYY":
      return `${MONTHS[Number(month) - 1] ?? month} ${year}`;
    case "MM.YYYY":
      return `${month}.${year}`;
    default:
      return `${month}/${year}`;
  }
}

export function formatRange(
  start: string,
  end: string,
  current: boolean,
  region: RegionConfig,
): string {
  const from = start ? formatMonth(start, region.dateFormat) : "";
  const to = current ? "Present" : end ? formatMonth(end, region.dateFormat) : "";
  if (from && to) return `${from} – ${to}`;
  return from || to;
}

/** Format a full "YYYY-MM-DD" date (date of birth, declaration date). */
export function formatDay(value: string, region: RegionConfig): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return value;
  const [, y, mo, d] = m;
  if (region.dateFormat === "MMM YYYY") {
    return region.paper === "Letter"
      ? `${MONTHS[Number(mo) - 1]} ${Number(d)}, ${y}`
      : `${Number(d)} ${MONTHS[Number(mo) - 1]} ${y}`;
  }
  return region.dateFormat === "MM.YYYY" ? `${d}.${mo}.${y}` : `${d}/${mo}/${y}`;
}

/** Split a description into bullet lines, stripping typed bullet markers. */
export function toBullets(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.replace(/^\s*[-•*▪–]\s*/, "").trim())
    .filter(Boolean);
}

export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
