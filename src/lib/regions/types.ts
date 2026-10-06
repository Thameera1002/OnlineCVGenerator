import type { RegionalFieldKey, SectionKey, TemplateId } from "@/lib/cv/types";

/**
 * - required:    must be filled in for this region
 * - recommended: expected by most employers here
 * - optional:    acceptable, user's choice
 * - hidden:      not customary / may cause bias or legal issues — not shown on the CV
 */
export type FieldPolicy = "required" | "recommended" | "optional" | "hidden";

export type DateFormat = "MMM YYYY" | "MM/YYYY" | "MM.YYYY";

export type RegionId = "lk" | "uk" | "eu" | "dach" | "gcc" | "na" | "latam" | "intl";

export interface RegionConfig {
  id: RegionId;
  name: string;
  flag: string;
  /** Countries/markets this profile covers, shown in the selector. */
  covers: string;
  /** What the document is called locally ("Resume", "CV", "Lebenslauf"...). */
  docName: string;
  paper: "A4" | "Letter";
  dateFormat: DateFormat;
  /** Warn above this many pages. */
  maxPages: number;
  /** Suggest trimming above this many pages. */
  idealPages: number;
  languageScale: "cefr" | "descriptive";
  fields: Record<RegionalFieldKey, FieldPolicy>;
  /** Short explanation shown when a field is hidden or discouraged. */
  fieldNotes?: Partial<Record<RegionalFieldKey, string>>;
  /** Section order on the CV. Sections not listed are not used in this region. */
  sections: SectionKey[];
  sectionLabels?: Partial<Record<SectionKey, string>>;
  references: {
    /** full = list referees; on-request = one line; none = omit entirely */
    mode: "full" | "on-request" | "none";
    min?: number;
    note?: string;
  };
  declarationDefault?: string;
  defaultTemplate: TemplateId;
  tips: string[];
}
