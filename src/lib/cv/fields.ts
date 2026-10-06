import type { RegionConfig } from "@/lib/regions/types";
import type { PersonalInfo, RegionalFieldKey } from "./types";

export interface RegionalFieldMeta {
  label: string;
  type: "text" | "date" | "select";
  placeholder?: string;
  options?: string[];
}

/** Editor metadata for region-dependent personal fields (photo/address handled separately). */
export const REGIONAL_FIELDS: Record<
  Exclude<RegionalFieldKey, "photo" | "address">,
  RegionalFieldMeta
> = {
  dateOfBirth: { label: "Date of birth", type: "date" },
  gender: { label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
  maritalStatus: {
    label: "Marital status",
    type: "select",
    options: ["Single", "Married", "Divorced", "Widowed"],
  },
  nationality: { label: "Nationality", type: "text", placeholder: "Sri Lankan" },
  religion: { label: "Religion", type: "text" },
  nicNumber: { label: "NIC number", type: "text", placeholder: "199912345678" },
  passportNumber: { label: "Passport number", type: "text" },
  visaStatus: { label: "Visa status", type: "text", placeholder: "Employment visa (transferable)" },
  workAuthorization: {
    label: "Work authorization / right to work",
    type: "text",
    placeholder: "Authorized to work in the US",
  },
  drivingLicense: { label: "Driving licence", type: "text", placeholder: "Full licence (light vehicles)" },
  noticePeriod: { label: "Notice period / availability", type: "text", placeholder: "1 month" },
};

export const DETAIL_FIELD_ORDER = Object.keys(REGIONAL_FIELDS) as (keyof typeof REGIONAL_FIELDS)[];

export function isVisible(region: RegionConfig, key: RegionalFieldKey): boolean {
  return region.fields[key] !== "hidden";
}

/** Regional fields the user has filled in but this region won't print. */
export function hiddenFilledFields(region: RegionConfig, p: PersonalInfo): RegionalFieldKey[] {
  return (Object.keys(region.fields) as RegionalFieldKey[]).filter(
    (k) => region.fields[k] === "hidden" && Boolean(p[k]),
  );
}

export function regionalFieldLabel(key: RegionalFieldKey): string {
  if (key === "photo") return "Photo";
  if (key === "address") return "Full address";
  return REGIONAL_FIELDS[key].label;
}

export const LANGUAGE_LEVELS = {
  cefr: ["Native", "C2 – Proficient", "C1 – Advanced", "B2 – Upper intermediate", "B1 – Intermediate", "A2 – Elementary", "A1 – Beginner"],
  descriptive: ["Native", "Fluent", "Professional working", "Intermediate", "Basic"],
} as const;
