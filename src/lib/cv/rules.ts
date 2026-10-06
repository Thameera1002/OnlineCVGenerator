import { regionSections } from "@/lib/regions";
import type { RegionConfig } from "@/lib/regions/types";
import { hiddenFilledFields, regionalFieldLabel } from "./fields";
import { toBullets } from "./format";
import type { CVData, RegionalFieldKey } from "./types";

export type IssueLevel = "error" | "warning" | "tip" | "info";

export interface Issue {
  level: IssueLevel;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Check a CV against its region's conventions. `pages` comes from the live preview. */
export function checkCV(data: CVData, region: RegionConfig, pages: number): Issue[] {
  const issues: Issue[] = [];
  const p = data.personal;
  const sections = regionSections(region);

  if (!p.fullName.trim()) issues.push({ level: "error", message: "Add your full name." });
  if (!p.email.trim()) issues.push({ level: "error", message: "Add an email address." });
  else if (!EMAIL_RE.test(p.email.trim()))
    issues.push({ level: "error", message: "The email address looks invalid." });
  if (!p.phone.trim()) issues.push({ level: "warning", message: "Add a phone number." });

  for (const key of Object.keys(region.fields) as RegionalFieldKey[]) {
    const policy = region.fields[key];
    if (p[key]) continue;
    const label = regionalFieldLabel(key);
    if (policy === "required")
      issues.push({ level: "error", message: `${label} is required for ${region.name} CVs.` });
    else if (policy === "recommended")
      issues.push({ level: "tip", message: `${label} is usually included in ${region.name}.` });
  }

  const hidden = hiddenFilledFields(region, p);
  if (hidden.length) {
    issues.push({
      level: "info",
      message: `Not shown for ${region.name}: ${hidden.map(regionalFieldLabel).join(", ")}. Your data is kept if you switch region.`,
    });
  }

  if (!data.summary.trim() && sections.includes("summary"))
    issues.push({ level: "tip", message: "Add a short summary at the top — recruiters read it first." });
  else if (region.id === "na" && data.summary.length > 600)
    issues.push({ level: "warning", message: "Keep your summary under ~4 lines for US/Canadian resumes." });

  if (!data.experience.length && !data.education.length)
    issues.push({ level: "warning", message: "Add at least one work experience or education entry." });

  for (const exp of data.experience) {
    if (!exp.jobTitle || !exp.employer || !exp.startDate) {
      issues.push({
        level: "warning",
        message: `Experience "${exp.jobTitle || exp.employer || "untitled"}" is missing a title, employer or start date.`,
      });
    }
  }

  if (region.id === "na" || region.id === "uk") {
    const bullets = data.experience.flatMap((e) => toBullets(e.description));
    if (bullets.length >= 3 && !bullets.some((b) => /\d/.test(b)))
      issues.push({ level: "tip", message: "Quantify achievements with numbers (%, revenue, users, time saved)." });
  }

  if (sections.includes("schoolExams") && !data.schoolExams.length)
    issues.push({ level: "tip", message: "Add your G.C.E. O/L and A/L results." });

  if (region.references.mode === "full" && (region.references.min ?? 0) > data.references.length)
    issues.push({
      level: "warning",
      message: `Add ${region.references.min} referees. ${region.references.note ?? ""}`.trim(),
    });

  if (pages > region.maxPages)
    issues.push({
      level: "warning",
      message: `Your ${region.docName} is about ${pages} pages — aim for ${region.idealPages}, at most ${region.maxPages}.`,
    });
  else if (pages > region.idealPages)
    issues.push({
      level: "tip",
      message: `About ${pages} pages. ${region.idealPages} page${region.idealPages > 1 ? "s" : ""} is ideal for ${region.name}.`,
    });

  return issues;
}
