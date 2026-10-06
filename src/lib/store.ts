"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { blankItem, emptyCV, normalizeCV } from "@/lib/cv/empty";
import { sampleCV } from "@/lib/cv/sample";
import type { CVData, ListItem, ListKey, PersonalInfo, TemplateId } from "@/lib/cv/types";
import { DEFAULT_REGION, isRegionId, type RegionId } from "@/lib/regions";
import { detectRegion } from "@/lib/regions/detect";

type ScalarKey = "summary" | "interests";

interface CVState {
  data: CVData;
  regionId: RegionId;
  /** "auto" re-detects on every visit; "manual" keeps the user's choice. */
  regionSource: "auto" | "manual";
  detectedRegionId: RegionId;
  /** null = use the region's default template */
  templateId: TemplateId | null;

  setPersonal: (patch: Partial<PersonalInfo>) => void;
  setText: (key: ScalarKey, value: string) => void;
  setDeclaration: (patch: Partial<CVData["declaration"]>) => void;
  addItem: (key: ListKey) => void;
  updateItem: <K extends ListKey>(key: K, id: string, patch: Partial<ListItem<K>>) => void;
  removeItem: (key: ListKey, id: string) => void;
  moveItem: (key: ListKey, id: string, delta: -1 | 1) => void;

  setRegion: (id: RegionId) => void;
  resetToDetectedRegion: () => void;
  setTemplate: (id: TemplateId) => void;

  loadSample: () => void;
  reset: () => void;
  importData: (data: unknown) => void;
}

function updateList<K extends ListKey>(
  data: CVData,
  key: K,
  fn: (items: ListItem<K>[]) => ListItem<K>[],
): CVData {
  return { ...data, [key]: fn(data[key] as ListItem<K>[]) };
}

export const useCV = create<CVState>()(
  persist(
    (set) => ({
      data: emptyCV(),
      regionId: DEFAULT_REGION,
      regionSource: "auto",
      detectedRegionId: DEFAULT_REGION,
      templateId: null,

      setPersonal: (patch) =>
        set((s) => ({ data: { ...s.data, personal: { ...s.data.personal, ...patch } } })),
      setText: (key, value) => set((s) => ({ data: { ...s.data, [key]: value } })),
      setDeclaration: (patch) =>
        set((s) => ({ data: { ...s.data, declaration: { ...s.data.declaration, ...patch } } })),

      addItem: (key) =>
        set((s) => ({ data: updateList(s.data, key, (items) => [...items, blankItem(key)]) })),
      updateItem: (key, id, patch) =>
        set((s) => ({
          data: updateList(s.data, key, (items) =>
            items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
          ),
        })),
      removeItem: (key, id) =>
        set((s) => ({
          data: updateList(s.data, key, (items) => items.filter((it) => it.id !== id)),
        })),
      moveItem: (key, id, delta) =>
        set((s) => ({
          data: updateList(s.data, key, (items) => {
            const i = items.findIndex((it) => it.id === id);
            const j = i + delta;
            if (i < 0 || j < 0 || j >= items.length) return items;
            const next = [...items];
            [next[i], next[j]] = [next[j], next[i]];
            return next;
          }),
        })),

      setRegion: (id) => set({ regionId: id, regionSource: "manual" }),
      resetToDetectedRegion: () =>
        set((s) => ({ regionId: s.detectedRegionId, regionSource: "auto" })),
      setTemplate: (id) => set({ templateId: id }),

      loadSample: () => set({ data: sampleCV() }),
      reset: () => set({ data: emptyCV(), templateId: null }),
      importData: (raw) => {
        const obj = (raw ?? {}) as { data?: unknown; regionId?: unknown };
        set((s) => ({
          data: normalizeCV(obj.data ?? raw),
          ...(isRegionId(obj.regionId)
            ? { regionId: obj.regionId, regionSource: "manual" as const }
            : { regionId: s.regionId }),
        }));
      },
    }),
    {
      name: "cv-generator:v1",
      version: 1,
      // Hydrate manually after mount so the static HTML matches the first client render.
      skipHydration: true,
      partialize: (s) => ({
        data: s.data,
        regionId: s.regionId,
        regionSource: s.regionSource,
        templateId: s.templateId,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<CVState>;
        return {
          ...current,
          ...p,
          data: normalizeCV(p.data),
          regionId: isRegionId(p.regionId) ? p.regionId : current.regionId,
        };
      },
      onRehydrateStorage: () => () => {
        const detected = detectRegion();
        useCV.setState((s) => ({
          detectedRegionId: detected,
          regionId: s.regionSource === "manual" ? s.regionId : detected,
        }));
      },
    },
  ),
);

/** Export the current CV as a JSON backup the user can re-import later. */
export function exportBackup(): string {
  const { data, regionId } = useCV.getState();
  return JSON.stringify({ app: "online-cv-generator", version: 1, regionId, data }, null, 2);
}
