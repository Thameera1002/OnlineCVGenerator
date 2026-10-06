"use client";

import type { ListItem, ListKey } from "@/lib/cv/types";
import type { RegionConfig } from "@/lib/regions/types";
import { useCV } from "@/lib/store";
import { Button, Checkbox, Field } from "../ui";
import { listDef } from "./listDefs";

export function ListSection<K extends ListKey>({
  listKey,
  region,
}: {
  listKey: K;
  region: RegionConfig;
}) {
  const items = useCV((s) => s.data[listKey]) as ListItem<K>[];
  const addItem = useCV((s) => s.addItem);
  const updateItem = useCV((s) => s.updateItem);
  const removeItem = useCV((s) => s.removeItem);
  const moveItem = useCV((s) => s.moveItem);
  const def = listDef(listKey, region);

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="truncate text-xs font-semibold text-slate-700">
              {index + 1}. {def.itemTitle(item) || "New entry"}
            </span>
            <div className="flex shrink-0 items-center">
              <Button variant="ghost" className="px-2!" aria-label="Move up" disabled={index === 0} onClick={() => moveItem(listKey, item.id, -1)}>
                ↑
              </Button>
              <Button variant="ghost" className="px-2!" aria-label="Move down" disabled={index === items.length - 1} onClick={() => moveItem(listKey, item.id, 1)}>
                ↓
              </Button>
              <Button variant="danger" className="px-2!" onClick={() => removeItem(listKey, item.id)}>
                Remove
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {def.fields.map((f) => {
              const value = item[f.key] as unknown;
              const set = (v: string | boolean) =>
                updateItem(listKey, item.id, { [f.key]: v } as Partial<ListItem<K>>);
              if (f.type === "checkbox") {
                return (
                  <div key={f.key} className="flex items-end pb-1.5">
                    <Checkbox label={f.label} checked={Boolean(value)} onChange={set} />
                  </div>
                );
              }
              return (
                <Field
                  key={f.key}
                  className={f.wide ? "sm:col-span-2" : undefined}
                  label={f.label}
                  type={f.type}
                  value={String(value ?? "")}
                  placeholder={f.placeholder}
                  hint={f.hint}
                  options={f.options}
                  disabled={f.disabledWhen?.(item)}
                  onChange={set}
                />
              );
            })}
          </div>
        </div>
      ))}
      <Button onClick={() => addItem(listKey)}>+ {def.addLabel}</Button>
    </div>
  );
}
