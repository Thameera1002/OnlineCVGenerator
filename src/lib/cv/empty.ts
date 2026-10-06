import type { CVData, ListItem, ListKey } from "./types";

export function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export function emptyCV(): CVData {
  return {
    personal: {
      fullName: "",
      headline: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      linkedin: "",
      website: "",
      photo: "",
      dateOfBirth: "",
      gender: "",
      maritalStatus: "",
      nationality: "",
      religion: "",
      nicNumber: "",
      passportNumber: "",
      visaStatus: "",
      workAuthorization: "",
      drivingLicense: "",
      noticePeriod: "",
    },
    summary: "",
    experience: [],
    education: [],
    schoolExams: [],
    skills: [],
    languages: [],
    certifications: [],
    projects: [],
    references: [],
    interests: "",
    declaration: { text: "", place: "", date: "" },
  };
}

const blankItems: { [K in ListKey]: () => ListItem<K> } = {
  experience: () => ({
    id: newId(),
    jobTitle: "",
    employer: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  }),
  education: () => ({
    id: newId(),
    qualification: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    grade: "",
    description: "",
  }),
  schoolExams: () => ({ id: newId(), exam: "", year: "", school: "", results: "" }),
  skills: () => ({ id: newId(), category: "", skills: "" }),
  languages: () => ({ id: newId(), language: "", level: "" }),
  certifications: () => ({ id: newId(), name: "", issuer: "", date: "" }),
  projects: () => ({ id: newId(), name: "", link: "", description: "" }),
  references: () => ({
    id: newId(),
    name: "",
    position: "",
    organization: "",
    email: "",
    phone: "",
  }),
};

export function blankItem<K extends ListKey>(key: K): ListItem<K> {
  return blankItems[key]();
}

/** Merge possibly-partial/older saved data onto a full empty CV. */
export function normalizeCV(input: unknown): CVData {
  const base = emptyCV();
  if (!input || typeof input !== "object") return base;
  const src = input as Partial<CVData>;
  return {
    ...base,
    ...src,
    personal: { ...base.personal, ...(src.personal ?? {}) },
    declaration: { ...base.declaration, ...(src.declaration ?? {}) },
  };
}
