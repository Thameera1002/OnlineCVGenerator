/* eslint-disable @next/next/no-img-element -- photos are local data URLs */
import { regionSections, sectionLabel } from "@/lib/regions";
import type { SectionKey, TemplateId } from "@/lib/cv/types";
import { contactItems, sectionBody, showPhoto, type CVContext } from "./sections";
import "./cv.css";

export const TEMPLATES: { id: TemplateId; name: string; description: string }[] = [
  { id: "classic", name: "Classic", description: "Single column, ATS-friendly" },
  { id: "modern", name: "Modern", description: "Coloured header, two columns" },
];

function Section({ k, ctx }: { k: SectionKey; ctx: CVContext }) {
  const body = sectionBody(k, ctx);
  if (body == null) return null;
  return (
    <section className={`cv-section cv-section-${k}`}>
      <h2 className="cv-h2">{sectionLabel(ctx.region, k)}</h2>
      {body}
    </section>
  );
}

function Header({ ctx }: { ctx: CVContext }) {
  const p = ctx.data.personal;
  return (
    <header className="cv-header">
      {showPhoto(ctx) ? <img className="cv-photo" src={p.photo} alt="" /> : null}
      <div className="cv-header-text">
        <h1 className="cv-name">{p.fullName || "Your Name"}</h1>
        {p.headline ? <div className="cv-headline">{p.headline}</div> : null}
        <div className="cv-contact">
          {contactItems(ctx).map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      </div>
    </header>
  );
}

const SIDE_SECTIONS = new Set<SectionKey>([
  "personalDetails",
  "skills",
  "languages",
  "certifications",
  "interests",
]);

export function CVDocument({ ctx, template }: { ctx: CVContext; template: TemplateId }) {
  const sections = regionSections(ctx.region);
  const paper = ctx.region.paper === "Letter" ? "cv-letter" : "cv-a4";

  if (template === "modern") {
    return (
      <div className={`cv cv-modern ${paper}`}>
        <Header ctx={ctx} />
        <div className="cv-columns">
          <main className="cv-main">
            {sections
              .filter((k) => !SIDE_SECTIONS.has(k))
              .map((k) => (
                <Section key={k} k={k} ctx={ctx} />
              ))}
          </main>
          <aside className="cv-side">
            {sections
              .filter((k) => SIDE_SECTIONS.has(k))
              .map((k) => (
                <Section key={k} k={k} ctx={ctx} />
              ))}
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className={`cv cv-classic ${paper}`}>
      <Header ctx={ctx} />
      {sections.map((k) => (
        <Section key={k} k={k} ctx={ctx} />
      ))}
    </div>
  );
}
