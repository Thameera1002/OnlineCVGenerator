import type { SectionKey } from "@/lib/cv/types";
import { dach } from "./dach";
import { europe } from "./europe";
import { gulf } from "./gulf";
import { international } from "./international";
import { latinAmerica } from "./latin-america";
import { northAmerica } from "./north-america";
import { sriLanka } from "./sri-lanka";
import type { RegionConfig, RegionId } from "./types";
import { uk } from "./uk";

export type { RegionConfig, RegionId } from "./types";

/** Order shown in the region selector. */
export const REGIONS: RegionConfig[] = [
  sriLanka,
  northAmerica,
  uk,
  europe,
  dach,
  gulf,
  latinAmerica,
  international,
];

const byId = new Map(REGIONS.map((r) => [r.id, r]));

export const DEFAULT_REGION: RegionId = "intl";

export function getRegion(id: RegionId | string | null | undefined): RegionConfig {
  return byId.get(id as RegionId) ?? international;
}

export function isRegionId(id: unknown): id is RegionId {
  return typeof id === "string" && byId.has(id as RegionId);
}

const DEFAULT_SECTION_LABELS: Record<SectionKey, string> = {
  personalDetails: "Personal Details",
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  schoolExams: "School Examinations",
  skills: "Skills",
  languages: "Languages",
  certifications: "Certifications",
  projects: "Projects",
  interests: "Interests",
  references: "References",
  declaration: "Declaration",
};

export function sectionLabel(region: RegionConfig, key: SectionKey): string {
  return region.sectionLabels?.[key] ?? DEFAULT_SECTION_LABELS[key];
}

/**
 * Sections in CV order. `personalDetails` is always available: regions that don't
 * list it still get optional facts (driving licence, notice period...) at the end.
 */
export function regionSections(region: RegionConfig): SectionKey[] {
  const keys = region.sections.filter(
    (k) => k !== "references" || region.references.mode !== "none",
  );
  return keys.includes("personalDetails") ? keys : [...keys, "personalDetails"];
}
