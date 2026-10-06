"use client";

import { useEffect, useRef, useState } from "react";
import { CVDocument } from "@/components/cv/CVDocument";
import type { CVContext } from "@/components/cv/sections";
import type { TemplateId } from "@/lib/cv/types";

const MM = 96 / 25.4; // CSS px per mm
/** Printed page margins (top/bottom, left/right), matching the @page rule below. */
const MARGIN_Y_MM = 12;
const MARGIN_X_MM = 14;

const PAPER = {
  A4: { w: 210, h: 297, css: "A4" },
  Letter: { w: 215.9, h: 279.4, css: "letter" },
} as const;

export function CVPreview({
  ctx,
  template,
  onPagesChange,
}: {
  ctx: CVContext;
  template: TemplateId;
  onPagesChange: (pages: number) => void;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(0);
  const paper = PAPER[ctx.region.paper];
  const pageContentPx = (paper.h - 2 * MARGIN_Y_MM) * MM;
  const pages = Math.max(1, Math.ceil((height - 2 * MARGIN_Y_MM * MM - 2) / pageContentPx));

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const ro = new ResizeObserver(() => {
      setScale(Math.min(1, outer.clientWidth / (paper.w * MM)));
      setHeight(inner.offsetHeight);
    });
    ro.observe(outer);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [paper.w]);

  useEffect(() => onPagesChange(pages), [pages, onPagesChange]);

  return (
    <div ref={outerRef} className="w-full print:w-auto">
      <style>{`@page { size: ${paper.css}; margin: ${MARGIN_Y_MM}mm ${MARGIN_X_MM}mm; }`}</style>
      <div
        className="relative mx-auto print:mx-0"
        style={{ width: paper.w * MM * scale, height: height * scale }}
        id="cv-print-frame"
      >
        <div
          id="cv-print-scale"
          className="absolute top-0 left-0 origin-top-left shadow-xl ring-1 ring-slate-200 print:static print:shadow-none print:ring-0"
          style={{ transform: `scale(${scale})` }}
        >
          {/* translate="no": Google Translate must not alter the user's own CV text */}
          <div ref={innerRef} translate="no" className="notranslate">
            <CVDocument ctx={ctx} template={template} />
          </div>
          {Array.from({ length: pages - 1 }, (_, i) => (
            <div
              key={i}
              aria-hidden
              className="pointer-events-none absolute right-0 left-0 border-t-2 border-dashed border-rose-300 print:hidden"
              style={{ top: (MARGIN_Y_MM * MM + (i + 1) * pageContentPx) }}
            >
              <span className="absolute -top-2.5 right-2 rounded bg-rose-100 px-1.5 text-[11px] font-medium text-rose-700">
                Page {i + 2}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Opens the browser print dialog; users choose "Save as PDF". Text stays selectable (ATS-friendly). */
export function printCV(fileName: string) {
  const previous = document.title;
  document.title = fileName;
  const restore = () => {
    document.title = previous;
    window.removeEventListener("afterprint", restore);
  };
  window.addEventListener("afterprint", restore);
  window.print();
}
