"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { TEMPLATES } from "@/components/cv/CVDocument";
import { checkCV } from "@/lib/cv/rules";
import { siteConfig } from "@/lib/config";
import { getRegion } from "@/lib/regions";
import { exportBackup, useCV } from "@/lib/store";
import { Editor } from "./editor/Editor";
import { blockingCount, IssuesPanel } from "./IssuesPanel";
import { AdSlot } from "./monetization/AdSlot";
import { CVPreview, printCV } from "./preview/CVPreview";
import type { IconName } from "@/lib/icons";
import { Button, Icon, OverflowMenu, SegmentedButtons, Tabs } from "./ui";

function useHydrated() {
  return useSyncExternalStore(
    (cb) => useCV.persist.onFinishHydration(cb),
    () => useCV.persist.hasHydrated(),
    () => false,
  );
}

type View = "edit" | "preview" | "review";

function DataMenu() {
  const loadSample = useCV((s) => s.loadSample);
  const reset = useCV((s) => s.reset);
  const importData = useCV((s) => s.importData);
  const fileRef = useRef<HTMLInputElement>(null);

  const download = () => {
    const blob = new Blob([exportBackup()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "my-cv-backup.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <OverflowMenu
        label="CV data options"
        items={[
          {
            label: "Load sample",
            icon: "auto_awesome",
            onSelect: () => confirm("Replace your current CV with sample data?") && loadSample(),
          },
          {
            label: "Backup to file",
            icon: "save",
            hint: "Save your data as a file to continue on another device",
            onSelect: download,
          },
          { label: "Restore from file", icon: "upload_file", onSelect: () => fileRef.current?.click() },
          {
            label: "Clear all data",
            icon: "delete_sweep",
            danger: true,
            onSelect: () => confirm("Clear all CV data? This cannot be undone.") && reset(),
          },
        ]}
      />
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          try {
            importData(JSON.parse(await file.text()));
          } catch {
            alert("That file is not a valid CV backup.");
          }
        }}
      />
    </>
  );
}

/** Material 3 navigation bar, shown on small screens only. */
function BottomNav({ view, onChange, reviewBadge }: { view: View; onChange: (v: View) => void; reviewBadge: number }) {
  const items: { id: View; label: string; icon: IconName }[] = [
    { id: "edit", label: "Edit", icon: "edit" },
    { id: "preview", label: "Preview", icon: "visibility" },
    { id: "review", label: "Review", icon: "fact_check" },
  ];
  return (
    <nav
      aria-label="Views"
      className="fixed inset-x-0 bottom-0 z-30 grid h-20 grid-cols-3 bg-surface-container pb-[env(safe-area-inset-bottom)] shadow-elevation-2 lg:hidden print:hidden"
    >
      {items.map((it) => {
        const active = view === it.id;
        return (
          <button
            key={it.id}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => {
              onChange(it.id);
              window.scrollTo({ top: 0 });
            }}
            className="group flex flex-col items-center justify-center gap-1"
          >
            <span
              className={`relative flex h-8 w-16 items-center justify-center rounded-full transition-colors ${
                active
                  ? "bg-secondary-container text-on-secondary-container"
                  : "text-on-surface-variant group-hover:bg-on-surface/[0.08]"
              }`}
            >
              <Icon name={it.icon} filled={active} />
              {it.id === "review" && reviewBadge ? (
                <span className="absolute top-0 right-3 min-w-4 rounded-full bg-error px-1 text-center text-[10px] leading-4 font-medium text-on-error">
                  {reviewBadge}
                </span>
              ) : null}
            </span>
            <span className={`text-xs font-medium ${active ? "text-on-surface" : "text-on-surface-variant"}`}>
              {it.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export function CVBuilder() {
  const hydrated = useHydrated();
  useEffect(() => {
    void useCV.persist.rehydrate();
  }, []);

  const data = useCV((s) => s.data);
  const regionId = useCV((s) => s.regionId);
  const templateChoice = useCV((s) => s.templateId);
  const setTemplate = useCV((s) => s.setTemplate);
  const region = getRegion(regionId);
  const template = templateChoice ?? region.defaultTemplate;

  const [pages, setPages] = useState(1);
  const [view, setView] = useState<View>("edit");
  const onPagesChange = useCallback((n: number) => setPages(n), []);
  const issues = useMemo(() => checkCV(data, region, pages), [data, region, pages]);
  const ctx = useMemo(() => ({ data, region }), [data, region]);

  if (!hydrated) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-32 text-sm text-on-surface-variant">
        <span className="size-10 animate-spin rounded-full border-4 border-primary-container border-t-primary" />
        Loading your CV…
      </div>
    );
  }

  const fileName = `${(data.personal.fullName || "My").trim().replace(/\s+/g, "_")}_${region.docName.split(" ")[0]}`;
  const blocking = blockingCount(issues);
  // On large screens the editor is always visible, so the right pane shows preview unless review is picked.
  const outputTab = view === "review" ? "review" : "preview";
  const downloadButton = (
    <Button variant="filled" icon="download" onClick={() => printCV(fileName)}>
      Download PDF
    </Button>
  );

  return (
    <div className="mx-auto w-full max-w-[1500px] flex-1 px-3 pt-4 pb-28 sm:px-4 lg:pb-6 print:p-0">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Editor pane */}
        <div className={`space-y-4 print:hidden ${view === "edit" ? "" : "hidden lg:block"}`}>
          <div className="overflow-visible rounded-3xl bg-surface-container-lowest shadow-elevation-1">
            <div className="flex items-center justify-between gap-3 py-2 pr-2 pl-6">
              <div>
                <h2 className="text-base font-medium text-on-surface">Edit your {region.docName}</h2>
                <p className="flex items-center gap-1 text-xs text-on-surface-variant">
                  <Icon name="lock" size={14} /> Saved automatically in this browser
                </p>
              </div>
              <DataMenu />
            </div>
            <Editor region={region} onFinish={() => setView("review")} />
          </div>
          <AdSlot slot={siteConfig.adsenseSlots.editor} />
        </div>

        {/* Output pane: preview + review */}
        <div className={`print:block ${view === "edit" ? "hidden lg:block" : ""}`}>
          <div className="rounded-3xl bg-surface-container-low lg:sticky lg:top-24 print:static print:rounded-none print:bg-transparent">
            <Tabs
              className="hidden px-4 lg:flex print:hidden"
              idPrefix="output"
              label="Output"
              value={outputTab}
              onChange={setView}
              items={[
                { id: "preview", label: "Preview", icon: "visibility" },
                { id: "review", label: "Review", icon: "fact_check", badge: blocking, badgeTone: "error" },
              ]}
            />

            {/* Preview stays in the DOM (hidden) so it can always be printed. */}
            <div
              role="tabpanel"
              id="output-panel-preview"
              aria-labelledby="output-tab-preview"
              className={`${outputTab === "preview" ? "" : "hidden"} print:block`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 print:hidden">
                <SegmentedButtons
                  label="Template"
                  value={template}
                  onChange={setTemplate}
                  items={TEMPLATES.map((t) => ({ id: t.id, label: t.name, title: t.description }))}
                />
                <span className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-on-surface-variant ring-1 ring-outline-variant">
                  <Icon name="description" size={16} />
                  {region.paper} · ~{pages} page{pages > 1 ? "s" : ""}
                </span>
                {downloadButton}
              </div>

              <div className="mx-3 overflow-visible rounded-2xl bg-surface-container-highest p-3 sm:p-5 lg:max-h-[calc(100vh-16rem)] lg:overflow-auto print:mx-0 print:max-h-none print:overflow-visible print:rounded-none print:bg-transparent print:p-0">
                <CVPreview ctx={ctx} template={template} onPagesChange={onPagesChange} />
              </div>
              <p className="flex items-center gap-2 px-5 py-3 text-xs text-on-surface-variant print:hidden">
                <Icon name="info" size={16} />
                <span>
                  In the print dialog choose <strong>Save as PDF</strong> and turn off “Headers and footers”.
                </span>
              </p>
            </div>

            <div
              role="tabpanel"
              id="output-panel-review"
              aria-labelledby="output-tab-review"
              className={`p-3 sm:p-4 print:hidden ${outputTab === "review" ? "" : "hidden"}`}
            >
              <IssuesPanel issues={issues} region={region} />
              <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                <Button variant="outlined" icon="visibility" onClick={() => setView("preview")}>
                  Preview
                </Button>
                {downloadButton}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav view={view} onChange={setView} reviewBadge={blocking} />
    </div>
  );
}
