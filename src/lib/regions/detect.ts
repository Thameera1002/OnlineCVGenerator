import { DEFAULT_REGION, type RegionId } from "./index";

/**
 * Region detection without any network request (keeps the app browser-only and
 * private): the device timezone is the strongest signal, the browser locale's
 * country code is the fallback.
 */

const GCC_ZONES = new Set([
  "Asia/Dubai",
  "Asia/Riyadh",
  "Asia/Qatar",
  "Asia/Kuwait",
  "Asia/Bahrain",
  "Asia/Muscat",
  "Asia/Aden",
  "Asia/Amman",
  "Asia/Beirut",
  "Asia/Baghdad",
  "Africa/Cairo",
]);

const DACH_ZONES = new Set(["Europe/Berlin", "Europe/Busingen", "Europe/Vienna", "Europe/Zurich"]);
const UK_ZONES = new Set(["Europe/London", "Europe/Dublin", "Europe/Belfast", "Europe/Jersey", "Europe/Guernsey", "Europe/Isle_of_Man"]);
const NON_EU_EUROPE_ZONES = new Set(["Europe/Moscow", "Europe/Istanbul", "Europe/Minsk", "Europe/Kaliningrad", "Europe/Samara", "Europe/Volgograd", "Europe/Saratov", "Europe/Ulyanovsk", "Europe/Astrakhan", "Europe/Kirov"]);

const NA_PREFIXES = [
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Phoenix", "America/Anchorage", "America/Juneau", "America/Sitka",
  "America/Nome", "America/Adak", "America/Boise", "America/Detroit",
  "America/Indiana", "America/Kentucky", "America/North_Dakota", "America/Menominee",
  "America/Toronto", "America/Vancouver", "America/Edmonton", "America/Winnipeg",
  "America/Halifax", "America/St_Johns", "America/Regina", "America/Moncton",
  "America/Whitehorse", "America/Yellowknife", "America/Iqaluit", "America/Glace_Bay",
  "America/Goose_Bay", "America/Swift_Current", "America/Dawson_Creek", "America/Cambridge_Bay",
  "Pacific/Honolulu", "US/", "Canada/",
];

function fromTimezone(tz: string): RegionId | null {
  if (tz === "Asia/Colombo") return "lk";
  if (GCC_ZONES.has(tz)) return "gcc";
  if (UK_ZONES.has(tz)) return "uk";
  if (DACH_ZONES.has(tz)) return "dach";
  if (tz.startsWith("Europe/") && !NON_EU_EUROPE_ZONES.has(tz)) return "eu";
  if (NA_PREFIXES.some((p) => tz.startsWith(p))) return "na";
  if (tz.startsWith("America/")) return "latam";
  return null;
}

const COUNTRY_TO_REGION: Record<string, RegionId> = {
  LK: "lk",
  US: "na", CA: "na",
  GB: "uk", IE: "uk",
  DE: "dach", AT: "dach", CH: "dach",
  AE: "gcc", SA: "gcc", QA: "gcc", KW: "gcc", BH: "gcc", OM: "gcc", JO: "gcc", LB: "gcc", EG: "gcc",
  MX: "latam", BR: "latam", AR: "latam", CO: "latam", CL: "latam", PE: "latam", VE: "latam",
  EC: "latam", UY: "latam", PY: "latam", BO: "latam", CR: "latam", PA: "latam", GT: "latam", DO: "latam",
  FR: "eu", NL: "eu", BE: "eu", LU: "eu", IT: "eu", ES: "eu", PT: "eu", PL: "eu", SE: "eu",
  DK: "eu", FI: "eu", NO: "eu", CZ: "eu", SK: "eu", HU: "eu", RO: "eu", BG: "eu", GR: "eu",
  HR: "eu", SI: "eu", EE: "eu", LV: "eu", LT: "eu", MT: "eu", CY: "eu", IS: "eu",
};

function fromLocale(locale: string): RegionId | null {
  try {
    // Only trust an explicit country subtag ("si-LK"), never a guessed one.
    const country = new Intl.Locale(locale).region;
    return country ? (COUNTRY_TO_REGION[country] ?? null) : null;
  } catch {
    return null;
  }
}

export function detectRegion(): RegionId {
  if (typeof window === "undefined") return DEFAULT_REGION;
  let tz = "";
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    // ignore — fall through to locale
  }
  const byTz = tz ? fromTimezone(tz) : null;
  if (byTz) return byTz;
  // A real geographic timezone we don't map (e.g. Asia/Kolkata) is more reliable
  // than a browser language like "en-US", so go neutral instead of guessing.
  if (tz.includes("/") && !tz.startsWith("Etc/")) return DEFAULT_REGION;
  for (const locale of navigator.languages ?? [navigator.language]) {
    const byLocale = fromLocale(locale);
    if (byLocale) return byLocale;
  }
  return DEFAULT_REGION;
}
