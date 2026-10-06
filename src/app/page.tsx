import { CVBuilder } from "@/components/CVBuilder";
import { GoogleTranslate } from "@/components/GoogleTranslate";
import { BuyMeCoffee } from "@/components/monetization/BuyMeCoffee";
import { RegionSelect } from "@/components/RegionSelect";
import { REGIONS } from "@/lib/regions";

export default function Home() {
  return (
    <>
      <header className="border-b border-slate-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              <span className="text-blue-600">CV</span> Generator
            </h1>
            <p className="text-xs text-slate-500">Region-ready CVs · free · no sign-up</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <RegionSelect />
            <GoogleTranslate />
            <BuyMeCoffee />
          </div>
        </div>
      </header>

      <CVBuilder />

      <footer className="mt-8 border-t border-slate-200 bg-white print:hidden">
        <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-8 text-sm text-slate-600 md:grid-cols-3">
          <div>
            <h2 className="mb-2 font-semibold text-slate-900">Built for your region</h2>
            <p>
              Each region uses its own rules for photos, personal details, section order, paper size, date
              format and length — so your CV looks the way local employers expect.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-semibold text-slate-900">Supported regions</h2>
            <ul className="space-y-0.5">
              {REGIONS.map((r) => (
                <li key={r.id}>
                  {r.flag} <strong className="font-medium">{r.name}</strong> — {r.covers}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-2 font-semibold text-slate-900">Private by design</h2>
            <p>
              Your CV is saved only in this browser. Nothing is uploaded to a server. Use <em>Backup</em> to keep a
              copy or move to another device.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
