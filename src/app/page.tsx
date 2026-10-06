import { CVBuilder } from "@/components/CVBuilder";
import { GoogleTranslate } from "@/components/GoogleTranslate";
import { BuyMeCoffee } from "@/components/monetization/BuyMeCoffee";
import { RegionSelect } from "@/components/RegionSelect";
import { Icon } from "@/components/ui";
import type { IconName } from "@/lib/icons";
import { REGIONS } from "@/lib/regions";

const FEATURES: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "public",
    title: "Built for your region",
    text: "Each region uses its own rules for photos, personal details, section order, paper size, date format and length — so your CV looks the way local employers expect.",
  },
  {
    icon: "lock",
    title: "Private by design",
    text: "Your CV is saved only in this browser. Nothing is uploaded to a server. Use Backup to keep a copy or move to another device.",
  },
];

function FooterBlock({ icon, title, text }: (typeof FEATURES)[number]) {
  return (
    <div>
      <h2 className="mb-2 flex items-center gap-2 text-base font-medium text-on-surface">
        <Icon name={icon} size={20} className="text-primary" />
        {title}
      </h2>
      <p className="leading-relaxed">{text}</p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* Material 3 top app bar */}
      <header className="z-30 bg-surface-container lg:sticky lg:top-0 print:hidden">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 lg:h-20 lg:flex-nowrap">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-on-primary">
              <Icon name="description" filled />
            </span>
            <div>
              <h1 className="text-lg leading-6 font-medium tracking-tight text-on-surface">CV Generator</h1>
              <p className="text-xs text-on-surface-variant">Region-ready CVs · free · no sign-up</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <RegionSelect />
            <GoogleTranslate />
            <BuyMeCoffee />
          </div>
        </div>
      </header>

      <CVBuilder />

      <footer className="mt-4 bg-surface-container-low pb-24 lg:pb-0 print:hidden">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-10 text-sm text-on-surface-variant md:grid-cols-3">
          <FooterBlock {...FEATURES[0]} />
          <div>
            <h2 className="mb-2 flex items-center gap-2 text-base font-medium text-on-surface">
              <Icon name="language" size={20} className="text-primary" />
              Supported regions
            </h2>
            <ul className="space-y-1">
              {REGIONS.map((r) => (
                <li key={r.id}>
                  {r.flag} <strong className="font-medium text-on-surface">{r.name}</strong> — {r.covers}
                </li>
              ))}
            </ul>
          </div>
          <FooterBlock {...FEATURES[1]} />
        </div>
      </footer>
    </>
  );
}
