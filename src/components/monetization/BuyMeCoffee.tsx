import { siteConfig } from "@/lib/config";

const BMC_USERNAME = siteConfig.buyMeACoffeeUsername;

/** Plain link (no third-party widget script) to the creator's Buy Me a Coffee page. */
export function BuyMeCoffee({ className = "" }: { className?: string }) {
  if (!BMC_USERNAME) return null;
  return (
    <a
      href={`https://www.buymeacoffee.com/${encodeURIComponent(BMC_USERNAME)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 rounded-md bg-[#FFDD00] px-3 py-1.5 text-sm font-semibold text-black shadow-sm transition hover:brightness-95 ${className}`}
    >
      <span aria-hidden>☕</span>
      <span>Buy me a coffee</span>
    </a>
  );
}
