"use client";

import type { Issue } from "@/lib/cv/rules";
import type { RegionConfig } from "@/lib/regions/types";

const STYLE: Record<Issue["level"], { icon: string; cls: string }> = {
  error: { icon: "⛔", cls: "text-red-700" },
  warning: { icon: "⚠️", cls: "text-amber-700" },
  tip: { icon: "💡", cls: "text-slate-700" },
  info: { icon: "ℹ️", cls: "text-slate-500" },
};

export function IssuesPanel({ issues, region }: { issues: Issue[]; region: RegionConfig }) {
  const blocking = issues.filter((i) => i.level === "error" || i.level === "warning").length;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">
          {region.flag} {region.name} check
        </h3>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            blocking ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {blocking ? `${blocking} to fix` : "Looks good"}
        </span>
      </div>
      <ul className="space-y-1.5 text-xs">
        {issues.map((i, n) => (
          <li key={n} className={`flex gap-2 ${STYLE[i.level].cls}`}>
            <span aria-hidden>{STYLE[i.level].icon}</span>
            <span>{i.message}</span>
          </li>
        ))}
      </ul>
      <details className="mt-3 border-t border-slate-100 pt-2">
        <summary className="cursor-pointer text-xs font-medium text-blue-700">
          {region.docName} conventions for {region.name}
        </summary>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-600">
          <li>
            Paper: {region.paper} · Length: {region.idealPages}–{region.maxPages} pages · Dates: {region.dateFormat}
          </li>
          {region.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
