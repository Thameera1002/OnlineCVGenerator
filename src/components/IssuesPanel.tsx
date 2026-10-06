"use client";

import type { IconName } from "@/lib/icons";
import type { Issue } from "@/lib/cv/rules";
import type { RegionConfig } from "@/lib/regions/types";
import { Icon } from "./ui";

const STYLE: Record<Issue["level"], { icon: IconName; cls: string; label: string }> = {
  error: { icon: "error", cls: "bg-error-container text-on-error-container", label: "Must fix" },
  warning: { icon: "warning", cls: "bg-warning-container text-on-warning-container", label: "Should fix" },
  tip: { icon: "lightbulb", cls: "bg-secondary-container text-on-secondary-container", label: "Tip" },
  info: { icon: "info", cls: "bg-surface-container-highest text-on-surface-variant", label: "Note" },
};

export function blockingCount(issues: Issue[]) {
  return issues.filter((i) => i.level === "error" || i.level === "warning").length;
}

export function IssuesPanel({ issues, region }: { issues: Issue[]; region: RegionConfig }) {
  const blocking = blockingCount(issues);
  return (
    <div className="space-y-4">
      <div
        className={`flex items-center gap-4 rounded-3xl p-5 ${
          blocking ? "bg-warning-container text-on-warning-container" : "bg-success-container text-on-success-container"
        }`}
      >
        <Icon name={blocking ? "warning" : "check_circle"} filled size={36} />
        <div>
          <h2 className="text-lg font-medium">
            {blocking ? `${blocking} thing${blocking > 1 ? "s" : ""} to fix` : "Your CV looks good"}
          </h2>
          <p className="text-sm opacity-80">
            Checked against {region.flag} {region.name} conventions
          </p>
        </div>
      </div>

      {issues.length ? (
        <ul className="space-y-2">
          {issues.map((i, n) => (
            <li key={n} className="flex items-start gap-3 rounded-2xl bg-surface-container-low px-4 py-3">
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${STYLE[i.level].cls}`}>
                <Icon name={STYLE[i.level].icon} size={18} />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-[11px] font-medium tracking-wide text-on-surface-variant uppercase">{STYLE[i.level].label}</p>
                <p className="text-sm text-on-surface">{i.message}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <section className="rounded-3xl bg-surface-container-low p-5">
        <h3 className="mb-3 flex items-center gap-2 text-base font-medium text-on-surface">
          <Icon name="public" size={20} className="text-primary" />
          {region.docName} conventions for {region.name}
        </h3>
        <div className="mb-4 flex flex-wrap gap-2">
          {[
            `Paper: ${region.paper}`,
            `Length: ${region.idealPages}–${region.maxPages} pages`,
            `Dates: ${region.dateFormat}`,
          ].map((c) => (
            <span key={c} className="rounded-lg px-3 py-1.5 text-xs font-medium text-on-surface-variant ring-1 ring-outline-variant">
              {c}
            </span>
          ))}
        </div>
        <ul className="space-y-2 text-sm text-on-surface-variant">
          {region.tips.map((t) => (
            <li key={t} className="flex gap-2">
              <Icon name="check" size={18} className="mt-px text-primary" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
