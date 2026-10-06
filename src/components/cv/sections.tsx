import type { ReactNode } from "react";
import { DETAIL_FIELD_ORDER, isVisible, REGIONAL_FIELDS } from "@/lib/cv/fields";
import { displayUrl, formatDay, formatMonth, formatRange, toBullets } from "@/lib/cv/format";
import type { CVData, SectionKey } from "@/lib/cv/types";
import type { RegionConfig } from "@/lib/regions/types";

export interface CVContext {
  data: CVData;
  region: RegionConfig;
}

function Bullets({ text }: { text: string }) {
  const lines = toBullets(text);
  if (!lines.length) return null;
  if (lines.length === 1) return <p className="cv-text">{lines[0]}</p>;
  return (
    <ul className="cv-bullets">
      {lines.map((l, i) => (
        <li key={i}>{l}</li>
      ))}
    </ul>
  );
}

function Entry({
  title,
  subtitle,
  date,
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  date?: string;
  children?: ReactNode;
}) {
  return (
    <div className="cv-entry">
      <div className="cv-entry-head">
        <div>
          <div className="cv-entry-title">{title}</div>
          {subtitle ? <div className="cv-entry-sub">{subtitle}</div> : null}
        </div>
        {date ? <div className="cv-entry-date">{date}</div> : null}
      </div>
      {children}
    </div>
  );
}

const join = (parts: (string | undefined)[], sep = ", ") => parts.filter(Boolean).join(sep);

export function contactItems({ data, region }: CVContext): string[] {
  const p = data.personal;
  const location = isVisible(region, "address") && p.address
    ? join([p.address, p.city, p.country])
    : join([p.city, p.country]);
  return [
    p.email,
    p.phone,
    location,
    p.linkedin && displayUrl(p.linkedin),
    p.website && displayUrl(p.website),
  ].filter(Boolean);
}

export function showPhoto({ data, region }: CVContext): boolean {
  return isVisible(region, "photo") && Boolean(data.personal.photo);
}

/** Renders a section's body, or null when there is nothing to show. */
export function sectionBody(key: SectionKey, ctx: CVContext): ReactNode {
  const { data, region } = ctx;
  switch (key) {
    case "personalDetails": {
      const rows = DETAIL_FIELD_ORDER.filter(
        (k) => isVisible(region, k) && data.personal[k].trim(),
      ).map((k) => ({
        label: REGIONAL_FIELDS[k].label,
        value: k === "dateOfBirth" ? formatDay(data.personal[k], region) : data.personal[k],
      }));
      if (!rows.length) return null;
      return (
        <dl className="cv-details">
          {rows.map((r) => (
            <div key={r.label}>
              <dt>{r.label}</dt>
              <dd>{r.value}</dd>
            </div>
          ))}
        </dl>
      );
    }
    case "summary":
      return data.summary.trim() ? <p className="cv-text">{data.summary}</p> : null;
    case "experience":
      if (!data.experience.length) return null;
      return data.experience.map((e) => (
        <Entry
          key={e.id}
          title={e.jobTitle}
          subtitle={join([e.employer, e.location])}
          date={formatRange(e.startDate, e.endDate, e.current, region)}
        >
          <Bullets text={e.description} />
        </Entry>
      ));
    case "education":
      if (!data.education.length) return null;
      return data.education.map((e) => (
        <Entry
          key={e.id}
          title={e.qualification}
          subtitle={join([e.institution, e.location])}
          date={formatRange(e.startDate, e.endDate, false, region)}
        >
          {e.grade ? <p className="cv-text">{e.grade}</p> : null}
          <Bullets text={e.description} />
        </Entry>
      ));
    case "schoolExams":
      if (!data.schoolExams.length) return null;
      return data.schoolExams.map((e) => (
        <Entry key={e.id} title={e.exam} subtitle={e.school} date={e.year}>
          {e.results ? <p className="cv-text">{e.results}</p> : null}
        </Entry>
      ));
    case "skills": {
      const groups = data.skills.filter((s) => s.skills.trim());
      if (!groups.length) return null;
      return (
        <ul className="cv-plain-list">
          {groups.map((s) => (
            <li key={s.id}>
              {s.category ? <strong>{s.category}: </strong> : null}
              {s.skills}
            </li>
          ))}
        </ul>
      );
    }
    case "languages": {
      const langs = data.languages.filter((l) => l.language.trim());
      if (!langs.length) return null;
      return (
        <ul className="cv-plain-list">
          {langs.map((l) => (
            <li key={l.id}>
              <strong>{l.language}</strong>
              {l.level ? ` — ${l.level}` : ""}
            </li>
          ))}
        </ul>
      );
    }
    case "certifications": {
      const certs = data.certifications.filter((c) => c.name.trim());
      if (!certs.length) return null;
      return (
        <ul className="cv-plain-list">
          {certs.map((c) => (
            <li key={c.id}>
              <strong>{c.name}</strong>
              {c.issuer ? `, ${c.issuer}` : ""}
              {c.date ? ` (${formatMonth(c.date, region.dateFormat)})` : ""}
            </li>
          ))}
        </ul>
      );
    }
    case "projects":
      if (!data.projects.length) return null;
      return data.projects.map((pr) => (
        <Entry key={pr.id} title={pr.name} subtitle={pr.link ? displayUrl(pr.link) : undefined}>
          <Bullets text={pr.description} />
        </Entry>
      ));
    case "interests":
      return data.interests.trim() ? <Bullets text={data.interests} /> : null;
    case "references":
      if (region.references.mode === "none") return null;
      if (region.references.mode === "on-request" || !data.references.length)
        return <p className="cv-text">Available upon request.</p>;
      return (
        <div className="cv-referees">
          {data.references.map((r) => (
            <div key={r.id}>
              <div className="cv-entry-title">{r.name}</div>
              <div>{r.position}</div>
              <div>{r.organization}</div>
              {r.phone ? <div>Tel: {r.phone}</div> : null}
              {r.email ? <div>{r.email}</div> : null}
            </div>
          ))}
        </div>
      );
    case "declaration": {
      const text = data.declaration.text || region.declarationDefault || "";
      const d = data.declaration;
      return (
        <div className="cv-declaration">
          {text ? <p className="cv-text">{text}</p> : null}
          <div className="cv-sign-row">
            <div>
              {d.place ? <div>Place: {d.place}</div> : null}
              <div>Date: {d.date ? formatDay(d.date, region) : "...................."}</div>
            </div>
            <div className="cv-sign">
              <div className="cv-sign-line" />
              <div>{data.personal.fullName || "Signature"}</div>
            </div>
          </div>
        </div>
      );
    }
  }
}
