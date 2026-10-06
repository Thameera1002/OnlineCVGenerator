"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { TEMPLATES } from "@/components/cv/CVDocument";
import { checkCV } from "@/lib/cv/rules";
import { siteConfig } from "@/lib/config";
import { getRegion } from "@/lib/regions";
import { exportBackup, useCV } from "@/lib/store";
import { Editor } from "./editor/Editor";
import { IssuesPanel } from "./IssuesPanel";
import { AdSlot } from "./monetization/AdSlot";
import { CVPreview, printCV } from "./preview/CVPreview";
import { Button } from "./ui";

function useHydrated() {
  return useSyncExternalStore(
    (cb) => useCV.persist.onFinishHydration(cb),
    () => useCV.persist.hasHydrated(),
    () => false,
  );
}

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
    <div className="flex flex-wrap gap-2">
      <Button variant="ghost" onClick={() => confirm("Replace your current CV with sample data?") && loadSample()}>
        Load sample
      </Button>
      <Button variant="ghost" onClick={download} title="Save your data as a file to continue on another device">
        Backup
      </Button>
      <Button variant="ghost" onClick={() => fileRef.current?.click()}>
        Restore
      </Button>
      <Button variant="danger" onClick={() => confirm("Clear all CV data? This cannot be undone.") && reset()}>
        Clear
      </Button>
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
    </div>
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
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const onPagesChange = useCallback((n: number) => setPages(n), []);
  const issues = useMemo(() => checkCV(data, region, pages), [data, region, pages]);
  const ctx = useMemo(() => ({ data, region }), [data, region]);

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center py-32 text-sm text-slate-500">
        Loading your CV…
      </div>
    );
  }

  const fileName = `${(data.personal.fullName || "My").trim().replace(/\s+/g, "_")}_${region.docName.split(" ")[0]}`;

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-4 px-4 py-4 print:p-0">
      {/* Mobile tab switch */}
      <div className="grid grid-cols-2 rounded-lg bg-slate-200 p-1 text-sm font-medium lg:hidden print:hidden">
        {(["edit", "preview"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setMobileTab(t)}
            className={`rounded-md py-1.5 capitalize ${mobileTab === t ? "bg-white shadow-sm" : "text-slate-600"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Editor column */}
        <div className={`space-y-4 print:hidden ${mobileTab === "edit" ? "" : "hidden lg:block"}`}>
          <DataMenu />
          <Editor region={region} />
          <AdSlot slot={siteConfig.adsenseSlots.editor} />
        </div>

        {/* Preview column */}
        <div className={`print:block ${mobileTab === "preview" ? "" : "hidden lg:block"}`}>
          <div className="space-y-4 lg:sticky lg:top-4 print:static">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm print:hidden">
              <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    title={t.description}
                    onClick={() => setTemplate(t.id)}
                    className={`rounded-md px-3 py-1 text-sm font-medium ${
                      template === t.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-500">
                {region.paper} · ~{pages} page{pages > 1 ? "s" : ""}
              </span>
              <Button variant="primary" onClick={() => printCV(fileName)}>
                ⬇ Download PDF
              </Button>
            </div>

            <div className="max-h-none overflow-visible rounded-xl bg-slate-200/70 p-3 sm:p-5 lg:max-h-[calc(100vh-11rem)] lg:overflow-auto print:max-h-none print:overflow-visible print:rounded-none print:bg-transparent print:p-0">
              <CVPreview ctx={ctx} template={template} onPagesChange={onPagesChange} />
            </div>

            <div className="print:hidden">
              <IssuesPanel issues={issues} region={region} />
            </div>
            <p className="text-[11px] text-slate-500 print:hidden">
              Tip: in the print dialog choose <strong>Save as PDF</strong> and turn off “Headers and footers”.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
