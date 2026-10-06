"use client";

import { useEffect } from "react";

/** UI languages offered through the Google Translate website widget. */
const LANGUAGES = "en,si,ta,ar,hi,ur,fr,de,es,pt,it,nl,pl,ru,tr,zh-CN,ja,ko,ms,id";

interface GoogleTranslateApi {
  translate: {
    TranslateElement: new (options: Record<string, unknown>, elementId: string) => unknown;
  };
}

declare global {
  interface Window {
    google?: GoogleTranslateApi;
    googleTranslateElementInit?: () => void;
  }
}

/**
 * Google Translate rewrites text nodes behind React's back, which makes React crash
 * when it later removes/inserts those nodes. Make those two DOM calls tolerant.
 */
function patchDomForTranslate() {
  const proto = Node.prototype as Node & { __gtPatched?: boolean };
  if (proto.__gtPatched) return;
  proto.__gtPatched = true;

  const removeChild = proto.removeChild;
  proto.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return removeChild.call(this, child) as T;
  };

  const insertBefore = proto.insertBefore;
  proto.insertBefore = function <T extends Node>(this: Node, node: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) return node;
    return insertBefore.call(this, node, ref) as T;
  };
}

export function GoogleTranslate() {
  useEffect(() => {
    patchDomForTranslate();
    window.googleTranslateElementInit = () => {
      const el = document.getElementById("google_translate_element");
      if (!window.google || !el || el.childElementCount) return;
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", includedLanguages: LANGUAGES, autoDisplay: false },
        "google_translate_element",
      );
    };
    if (document.getElementById("google-translate-script")) {
      window.googleTranslateElementInit();
      return;
    }
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      id="google_translate_element"
      className="gt-widget min-h-8 print:hidden"
      title="Translate this website"
    />
  );
}
