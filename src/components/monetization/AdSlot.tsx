"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/config";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const ADSENSE_CLIENT = siteConfig.adsenseClient;

/**
 * Google AdSense unit. Renders nothing until NEXT_PUBLIC_ADSENSE_CLIENT and a slot id
 * are configured (a dashed placeholder is shown in development instead).
 */
export function AdSlot({ slot, className = "" }: { slot: string | undefined; className?: string }) {
  const enabled = Boolean(ADSENSE_CLIENT && slot);

  useEffect(() => {
    if (!enabled) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense throws if the slot was already filled (e.g. React strict-mode re-run).
    }
  }, [enabled]);

  if (!enabled) {
    if (process.env.NODE_ENV !== "development") return null;
    return (
      <div
        className={`flex min-h-24 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-xs text-slate-400 print:hidden ${className}`}
      >
        Ad space (set NEXT_PUBLIC_ADSENSE_CLIENT)
      </div>
    );
  }

  return (
    <div className={`print:hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
