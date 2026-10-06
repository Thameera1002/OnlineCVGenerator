"use client";

import type { ListItem, ListKey } from "@/lib/cv/types";
import type { RegionConfig } from "@/lib/regions/types";
import { useCV } from "@/lib/store";
import { Button, Checkbox, Field, Icon, IconButton } from "../ui";
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
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="rounded-2xl bg-surface-container-low p-4 ring-1 ring-outline-variant/60">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary-container text-xs font-semibold text-on-secondary-container">
                {index + 1}
              </span>
              <span className="truncate text-sm font-medium text-on-surface">
                {def.itemTitle(item) || <span className="text-on-surface-variant italic">New entry</span>}
              </span>
            </div>
            <div className="-mr-2 flex shrink-0 items-center">
              <IconButton icon="arrow_upward" label="Move up" disabled={index === 0} onClick={() => moveItem(listKey, item.id, -1)} />
              <IconButton icon="arrow_downward" label="Move down" disabled={index === items.length - 1} onClick={() => moveItem(listKey, item.id, 1)} />
              <IconButton icon="delete" label="Remove" className="hover:bg-error/[0.08] hover:text-error" onClick={() => removeItem(listKey, item.id)} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {def.fields.map((f) => {
              const value = item[f.key] as unknown;
              const set = (v: string | boolean) =>
                updateItem(listKey, item.id, { [f.key]: v } as Partial<ListItem<K>>);
              if (f.type === "checkbox") {
                return (
                  <div key={f.key} className="flex items-center">
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
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-outline-variant px-4 py-8 text-center text-sm text-on-surface-variant">
          <Icon name="add" size={28} className="text-outline" />
          Nothing here yet.
        </div>
      ) : null}
      <Button variant="tonal" icon="add" onClick={() => addItem(listKey)}>
        {def.addLabel}
      </Button>
    </div>
  );
}
