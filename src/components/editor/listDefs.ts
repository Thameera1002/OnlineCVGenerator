import { LANGUAGE_LEVELS } from "@/lib/cv/fields";
import type { ListItem, ListKey } from "@/lib/cv/types";
import type { RegionConfig } from "@/lib/regions/types";

export interface ListFieldDef<T> {
  key: keyof T & string;
  label: string;
  type?: "text" | "email" | "tel" | "url" | "month" | "textarea" | "checkbox";
  placeholder?: string;
  hint?: string;
  options?: readonly string[];
  /** Spans both grid columns. */
  wide?: boolean;
  disabledWhen?: (item: T) => boolean;
}

export interface ListDef<K extends ListKey> {
  addLabel: string;
  itemTitle: (item: ListItem<K>) => string;
  fields: ListFieldDef<ListItem<K>>[];
}

const bulletHint = "One achievement per line — each line becomes a bullet point.";

export function listDef<K extends ListKey>(key: K, region: RegionConfig): ListDef<K> {
  const defs: { [P in ListKey]: ListDef<P> } = {
    experience: {
      addLabel: "Add position",
      itemTitle: (e) => [e.jobTitle, e.employer].filter(Boolean).join(" · "),
      fields: [
        { key: "jobTitle", label: "Job title", placeholder: "Software Engineer" },
        { key: "employer", label: "Employer", placeholder: "Company name" },
        { key: "location", label: "Location", placeholder: "Colombo" },
        { key: "current", label: "I currently work here", type: "checkbox" },
        { key: "startDate", label: "Start date", type: "month" },
        { key: "endDate", label: "End date", type: "month", disabledWhen: (e) => e.current },
        { key: "description", label: "Responsibilities & achievements", type: "textarea", wide: true, hint: bulletHint },
      ],
    },
    education: {
      addLabel: "Add qualification",
      itemTitle: (e) => [e.qualification, e.institution].filter(Boolean).join(" · "),
      fields: [
        { key: "qualification", label: "Degree / qualification", placeholder: "BSc (Hons) in Computer Science", wide: true },
        { key: "institution", label: "Institution", placeholder: "University of Moratuwa" },
        { key: "location", label: "Location" },
        { key: "startDate", label: "Start date", type: "month" },
        { key: "endDate", label: "End date (or expected)", type: "month" },
        { key: "grade", label: "Grade / class / GPA", placeholder: "First Class / GPA 3.8", wide: true },
        { key: "description", label: "Details (optional)", type: "textarea", wide: true, hint: "Thesis, key modules, awards…" },
      ],
    },
    schoolExams: {
      addLabel: "Add examination",
      itemTitle: (e) => [e.exam, e.year].filter(Boolean).join(" · "),
      fields: [
        {
          key: "exam",
          label: "Examination",
          options: ["G.C.E. Advanced Level", "G.C.E. Ordinary Level", "London A/L (Edexcel)", "London O/L (Edexcel)"],
          placeholder: "G.C.E. Advanced Level (Physical Science)",
        },
        { key: "year", label: "Year", placeholder: "2016" },
        { key: "school", label: "School", placeholder: "Royal College, Colombo 07", wide: true },
        { key: "results", label: "Subjects & results", type: "textarea", wide: true, placeholder: "Combined Mathematics – A, Physics – A, Chemistry – B" },
      ],
    },
    skills: {
      addLabel: "Add skill group",
      itemTitle: (s) => s.category || s.skills,
      fields: [
        { key: "category", label: "Category (optional)", placeholder: "Programming" },
        { key: "skills", label: "Skills (comma separated)", placeholder: "Java, Python, SQL" },
      ],
    },
    languages: {
      addLabel: "Add language",
      itemTitle: (l) => [l.language, l.level].filter(Boolean).join(" · "),
      fields: [
        { key: "language", label: "Language", options: ["English", "Sinhala", "Tamil", "Arabic", "Hindi", "French", "German", "Spanish", "Portuguese"] },
        {
          key: "level",
          label: region.languageScale === "cefr" ? "Level (CEFR)" : "Proficiency",
          options: LANGUAGE_LEVELS[region.languageScale],
        },
      ],
    },
    certifications: {
      addLabel: "Add certification",
      itemTitle: (c) => c.name,
      fields: [
        { key: "name", label: "Certification / award", wide: true, placeholder: "AWS Certified Developer – Associate" },
        { key: "issuer", label: "Issued by" },
        { key: "date", label: "Date", type: "month" },
      ],
    },
    projects: {
      addLabel: "Add project",
      itemTitle: (p) => p.name,
      fields: [
        { key: "name", label: "Project name" },
        { key: "link", label: "Link (optional)", type: "url", placeholder: "https://github.com/…" },
        { key: "description", label: "Description", type: "textarea", wide: true, hint: bulletHint },
      ],
    },
    references: {
      addLabel: "Add referee",
      itemTitle: (r) => [r.name, r.organization].filter(Boolean).join(" · "),
      fields: [
        { key: "name", label: "Name", placeholder: "Dr. A. B. Perera" },
        { key: "position", label: "Designation" },
        { key: "organization", label: "Organisation", wide: true },
        { key: "phone", label: "Phone", type: "tel" },
        { key: "email", label: "Email", type: "email" },
      ],
    },
  };
  return defs[key] as ListDef<K>;
}
