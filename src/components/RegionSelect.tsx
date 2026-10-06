"use client";

import { getRegion, REGIONS, isRegionId } from "@/lib/regions";
import { useCV } from "@/lib/store";
import { Icon } from "./ui";

export function RegionSelect() {
  const regionId = useCV((s) => s.regionId);
  const source = useCV((s) => s.regionSource);
  const detected = useCV((s) => s.detectedRegionId);
  const setRegion = useCV((s) => s.setRegion);
  const resetToDetectedRegion = useCV((s) => s.resetToDetectedRegion);
  const region = getRegion(regionId);

  return (
    <div className="flex flex-col gap-0.5">
      <label className="relative flex items-center">
        <span className="sr-only">Target region</span>
        <Icon name="public" size={20} className="pointer-events-none absolute left-3 text-on-surface-variant" />
        <select
          className="h-10 max-w-[17rem] appearance-none rounded-lg border border-outline bg-surface-container-low pr-9 pl-10 text-sm font-medium text-on-surface transition-colors hover:border-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          value={regionId}
          onChange={(e) => isRegionId(e.target.value) && setRegion(e.target.value)}
          title={region.covers}
        >
          {REGIONS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.flag} {r.name}
            </option>
          ))}
        </select>
        <span aria-hidden className="pointer-events-none absolute right-3 text-xs text-on-surface-variant">
          ▼
        </span>
      </label>
      <p className="pl-1 text-[11px] text-on-surface-variant">
        {source === "auto" ? (
          <>Auto-detected from your device</>
        ) : regionId !== detected ? (
          <button type="button" className="font-medium text-primary hover:underline" onClick={resetToDetectedRegion}>
            Use detected: {getRegion(detected).flag} {getRegion(detected).name}
          </button>
        ) : (
          <>Selected manually</>
        )}
      </p>
    </div>
  );
}
