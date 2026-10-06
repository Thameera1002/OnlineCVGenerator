"use client";

import { getRegion, REGIONS, isRegionId } from "@/lib/regions";
import { useCV } from "@/lib/store";

export function RegionSelect() {
  const regionId = useCV((s) => s.regionId);
  const source = useCV((s) => s.regionSource);
  const detected = useCV((s) => s.detectedRegionId);
  const setRegion = useCV((s) => s.setRegion);
  const resetToDetectedRegion = useCV((s) => s.resetToDetectedRegion);
  const region = getRegion(regionId);

  return (
    <div className="flex flex-col gap-0.5">
      <label className="flex items-center gap-2 text-sm">
        <span className="hidden font-medium text-slate-600 sm:inline">Region</span>
        <select
          className="max-w-[16rem] rounded-md border border-slate-300 bg-white py-1.5 pr-8 pl-2.5 text-sm font-medium text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
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
      </label>
      <p className="text-[11px] text-slate-500">
        {source === "auto" ? (
          <>📍 Auto-detected from your device</>
        ) : regionId !== detected ? (
          <button type="button" className="text-blue-600 hover:underline" onClick={resetToDetectedRegion}>
            Use detected: {getRegion(detected).flag} {getRegion(detected).name}
          </button>
        ) : (
          <>Selected manually</>
        )}
      </p>
    </div>
  );
}
