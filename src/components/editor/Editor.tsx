"use client";

import type { ListKey, SectionKey } from "@/lib/cv/types";
import { regionSections, sectionLabel } from "@/lib/regions";
import type { RegionConfig } from "@/lib/regions/types";
import { useCV } from "@/lib/store";
import { Card, Field } from "../ui";
import { ListSection } from "./ListSection";
import { PersonalSection } from "./PersonalSection";

const LIST_SECTIONS = new Set<SectionKey>([
  "experience",
  "education",
  "schoolExams",
  "skills",
  "languages",
  "certifications",
  "projects",
  "references",
]);

const SUBTITLES: Partial<Record<SectionKey, string>> = {
  summary: "3–4 lines about who you are and what you offer",
  experience: "Most recent first",
  education: "Degrees, diplomas and professional qualifications",
  schoolExams: "O/L and A/L subjects with grades",
  skills: "Group related skills together",
};

function SummaryEditor({ k }: { k: "summary" | "interests" }) {
  const value = useCV((s) => s.data[k]);
  const setText = useCV((s) => s.setText);
  return (
    <Field
      label={k === "summary" ? "Summary" : "Activities & interests"}
      type="textarea"
      rows={k === "summary" ? 5 : 4}
      value={value}
      onChange={(v) => setText(k, v)}
      hint={k === "interests" ? "One per line." : undefined}
    />
  );
}

function DeclarationEditor({ region }: { region: RegionConfig }) {
  const d = useCV((s) => s.data.declaration);
  const setDeclaration = useCV((s) => s.setDeclaration);
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Field
        className="sm:col-span-2"
        label="Statement"
        type="textarea"
        rows={3}
        value={d.text}
        placeholder={region.declarationDefault || "Optional"}
        hint={region.declarationDefault ? "Leave empty to use the standard wording shown." : undefined}
        onChange={(text) => setDeclaration({ text })}
      />
      <Field label="Place" value={d.place} onChange={(place) => setDeclaration({ place })} />
      <Field label="Date" type="date" value={d.date} onChange={(date) => setDeclaration({ date })} hint="Leave empty to fill in by hand when signing." />
    </div>
  );
}

export function Editor({ region }: { region: RegionConfig }) {
  const sections = regionSections(region).filter((k) => k !== "personalDetails");

  return (
    <div className="space-y-3">
      <Card title="Personal information" subtitle={`Fields adapted for ${region.name}`} defaultOpen>
        <PersonalSection region={region} />
      </Card>
      {sections.map((k) => (
        <Card key={k} title={sectionLabel(region, k)} subtitle={SUBTITLES[k]}>
          {k === "summary" || k === "interests" ? <SummaryEditor k={k} /> : null}
          {k === "declaration" ? <DeclarationEditor region={region} /> : null}
          {k === "references" && region.references.mode !== "full" ? (
            <p className="text-sm text-slate-600">
              In {region.name}, references are not listed — your {region.docName} will say
              <em> “Available upon request.”</em>
            </p>
          ) : null}
          {k === "references" && region.references.note ? (
            <p className="text-xs text-slate-500">{region.references.note}</p>
          ) : null}
          {LIST_SECTIONS.has(k) && (k !== "references" || region.references.mode === "full") ? (
            <ListSection listKey={k as ListKey} region={region} />
          ) : null}
        </Card>
      ))}
    </div>
  );
}
