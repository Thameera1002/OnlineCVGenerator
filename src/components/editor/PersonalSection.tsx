"use client";

import { DETAIL_FIELD_ORDER, REGIONAL_FIELDS } from "@/lib/cv/fields";
import type { RegionConfig } from "@/lib/regions/types";
import { useCV } from "@/lib/store";
import { Field, Icon, PolicyBadge } from "../ui";
import { PhotoInput } from "./PhotoInput";

export function PersonalSection({ region }: { region: RegionConfig }) {
  const p = useCV((s) => s.data.personal);
  const setPersonal = useCV((s) => s.setPersonal);
  const policy = region.fields;
  const notes = region.fieldNotes ?? {};

  const hiddenWithNotes = DETAIL_FIELD_ORDER.filter((k) => policy[k] === "hidden" && notes[k]);

  return (
    <div className="space-y-6">
      {policy.photo !== "hidden" ? (
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-on-surface">
            Photo
            <PolicyBadge policy={policy.photo} />
          </div>
          <PhotoInput value={p.photo} onChange={(photo) => setPersonal({ photo })} note={notes.photo} />
        </div>
      ) : (
        <p className="flex gap-3 rounded-xl bg-warning-container px-4 py-3 text-sm text-on-warning-container">
          <Icon name="no_photography" size={20} />
          <span>
            No photo for {region.name}. {notes.photo ?? ""}
          </span>
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name" badge="required" value={p.fullName} onChange={(fullName) => setPersonal({ fullName })} placeholder="Nimal Perera" />
        <Field label="Professional title" value={p.headline} onChange={(headline) => setPersonal({ headline })} placeholder="Software Engineer" />
        <Field label="Email" badge="required" type="email" value={p.email} onChange={(email) => setPersonal({ email })} />
        <Field label="Phone" type="tel" value={p.phone} onChange={(phone) => setPersonal({ phone })} placeholder="+94 77 123 4567" />
        {policy.address !== "hidden" ? (
          <Field
            className="sm:col-span-2"
            label="Address"
            badge={policy.address}
            value={p.address}
            onChange={(address) => setPersonal({ address })}
            placeholder="No. 25, Temple Road, Nugegoda"
          />
        ) : null}
        <Field label="City" value={p.city} onChange={(city) => setPersonal({ city })} hint={policy.address === "hidden" ? notes.address : undefined} />
        <Field label="Country" value={p.country} onChange={(country) => setPersonal({ country })} />
        <Field label="LinkedIn" type="url" value={p.linkedin} onChange={(linkedin) => setPersonal({ linkedin })} placeholder="https://linkedin.com/in/…" />
        <Field label="Website / portfolio" type="url" value={p.website} onChange={(website) => setPersonal({ website })} />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-primary">
          Details used in {region.name}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {DETAIL_FIELD_ORDER.filter((k) => policy[k] !== "hidden").map((k) => {
            const meta = REGIONAL_FIELDS[k];
            return (
              <Field
                key={k}
                label={meta.label}
                badge={policy[k]}
                type={meta.type === "date" ? "date" : "text"}
                options={meta.options}
                placeholder={meta.placeholder}
                hint={notes[k]}
                value={p[k]}
                onChange={(v) => setPersonal({ [k]: v })}
              />
            );
          })}
        </div>
        {hiddenWithNotes.length ? (
          <ul className="mt-4 space-y-1 rounded-xl bg-surface-container px-4 py-3 text-xs text-on-surface-variant">
            {hiddenWithNotes.map((k) => (
              <li key={k}>
                <strong className="font-medium text-on-surface">{REGIONAL_FIELDS[k].label}:</strong> {notes[k]}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
