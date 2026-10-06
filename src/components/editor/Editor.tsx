"use client";

import { useState, type ReactNode } from "react";
import type { ListKey, SectionKey } from "@/lib/cv/types";
import type { IconName } from "@/lib/icons";
import { regionSections, sectionLabel } from "@/lib/regions";
import type { RegionConfig } from "@/lib/regions/types";
import { useCV } from "@/lib/store";
import { Button, Field, Icon, Tabs, type TabItem } from "../ui";
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

type EditorTab = "personal" | Exclude<SectionKey, "personalDetails">;

const ICONS: Record<EditorTab, IconName> = {
  personal: "person",
  summary: "notes",
  experience: "work",
  education: "school",
  schoolExams: "history_edu",
  skills: "psychology",
  languages: "language",
  certifications: "workspace_premium",
  projects: "rocket_launch",
  interests: "interests",
  references: "groups",
  declaration: "draw",
};

const SUBTITLES: Partial<Record<EditorTab, string>> = {
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
      rows={k === "summary" ? 6 : 5}
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

function Note({ icon, children }: { icon: IconName; children: ReactNode }) {
  return (
    <p className="flex gap-3 rounded-xl bg-secondary-container/60 px-4 py-3 text-sm text-on-secondary-container">
      <Icon name={icon} size={20} />
      <span>{children}</span>
    </p>
  );
}

function SectionBody({ k, region }: { k: Exclude<EditorTab, "personal">; region: RegionConfig }) {
  return (
    <div className="space-y-4">
      {k === "summary" || k === "interests" ? <SummaryEditor k={k} /> : null}
      {k === "declaration" ? <DeclarationEditor region={region} /> : null}
      {k === "references" && region.references.mode !== "full" ? (
        <Note icon="info">
          In {region.name}, references are not listed — your {region.docName} will say
          <em> “Available upon request.”</em>
        </Note>
      ) : null}
      {k === "references" && region.references.note ? (
        <p className="text-xs text-on-surface-variant">{region.references.note}</p>
      ) : null}
      {LIST_SECTIONS.has(k) && (k !== "references" || region.references.mode === "full") ? (
        <ListSection listKey={k as ListKey} region={region} />
      ) : null}
    </div>
  );
}

export function Editor({ region, onFinish }: { region: RegionConfig; onFinish: () => void }) {
  const data = useCV((s) => s.data);
  const [requested, setRequested] = useState<EditorTab>("personal");

  const tabIds: EditorTab[] = [
    "personal",
    ...regionSections(region).filter((k): k is Exclude<SectionKey, "personalDetails"> => k !== "personalDetails"),
  ];
  // A region switch can remove the open section; fall back to the first tab.
  const active = tabIds.includes(requested) ? requested : "personal";
  const index = tabIds.indexOf(active);

  const label = (k: EditorTab) => (k === "personal" ? "Personal" : sectionLabel(region, k));
  const tabs: TabItem<EditorTab>[] = tabIds.map((k) => ({
    id: k,
    label: label(k),
    icon: ICONS[k],
    badge: LIST_SECTIONS.has(k as SectionKey) ? data[k as ListKey].length : undefined,
  }));

  const go = (k: EditorTab) => {
    setRequested(k);
    document.getElementById("editor-top")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };
  const prev = tabIds[index - 1];
  const next = tabIds[index + 1];

  return (
    <div id="editor-top" className="scroll-mt-24">
      <Tabs items={tabs} value={active} onChange={setRequested} label="CV sections" idPrefix="editor" />

      <section
        role="tabpanel"
        id={`editor-panel-${active}`}
        aria-labelledby={`editor-tab-${active}`}
        className="px-4 pt-6 pb-4 sm:px-6"
      >
        <header className="mb-6 flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container">
            <Icon name={ICONS[active]} />
          </span>
          <div>
            <h2 className="text-[22px] leading-7 font-normal text-on-surface">
              {active === "personal" ? "Personal information" : label(active)}
            </h2>
            <p className="text-sm text-on-surface-variant">
              {active === "personal" ? `Fields adapted for ${region.name}` : (SUBTITLES[active] ?? `Step ${index + 1} of ${tabIds.length}`)}
            </p>
          </div>
        </header>

        {active === "personal" ? <PersonalSection region={region} /> : <SectionBody k={active} region={region} />}

        <nav aria-label="Section navigation" className="mt-8 flex items-center justify-between gap-3 border-t border-outline-variant pt-4">
          {prev ? (
            <Button variant="text" icon="arrow_back" onClick={() => go(prev)}>
              <span className="max-w-[9rem] truncate sm:max-w-none">{label(prev)}</span>
            </Button>
          ) : (
            <span />
          )}
          <span className="hidden text-xs text-on-surface-variant sm:inline">
            {index + 1} / {tabIds.length}
          </span>
          {next ? (
            <Button variant="tonal" onClick={() => go(next)} className="pr-4!">
              <span className="max-w-[9rem] truncate sm:max-w-none">Next: {label(next)}</span>
              <Icon name="arrow_forward" size={18} />
            </Button>
          ) : (
            <Button variant="filled" icon="fact_check" onClick={onFinish}>
              Review &amp; download
            </Button>
          )}
        </nav>
      </section>
    </div>
  );
}
