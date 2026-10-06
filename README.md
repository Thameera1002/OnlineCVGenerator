# Online CV Generator

A free, browser-only CV/resume builder that formats your CV the way employers in your target region expect.

- **Region-aware**: Sri Lanka, USA & Canada, UK & Ireland, Europe (Europass), Germany/Austria/Switzerland, Middle East (GCC), Latin America, International.
- **Auto-detects the region** from the device timezone/locale (no network call); the user can change it at any time and their data is kept.
- **Private**: data lives in `localStorage` only. Backup/Restore exports a JSON file.
- **PDF export** via the browser's print dialog ("Save as PDF") with selectable, ATS-readable text.
- **Google Translate** widget for the site UI (the CV itself is marked `notranslate`).
- **Monetisation**: Google AdSense slot + Buy Me a Coffee button, both configured by env vars.

## Development

```bash
npm install
cp .env.example .env.local   # optional: AdSense / Buy Me a Coffee
npm run dev                  # http://localhost:3000
npm run build                # static site in ./out
```

`./out` can be hosted on any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3).
For AdSense, also add an `ads.txt` file to `public/`.

## Project structure

```
src/
  app/                    layout + single page
  lib/
    cv/                   data model, formatting, rules checker, sample data
    regions/              one config file per region + detect.ts
    store.ts              Zustand store persisted to localStorage
    config.ts             env-based site config (ads, Buy Me a Coffee)
  components/
    editor/               form sections (generic ListSection + field defs)
    cv/                   CV templates (Classic, Modern) + print CSS
    preview/              scaled live preview, page-break markers, print
    monetization/         AdSlot, BuyMeCoffee
    GoogleTranslate.tsx   translate widget (+ React DOM patch)
```

## Adding a region

1. Copy `src/lib/regions/international.ts` to a new file and adjust:
   - `fields`: `required | recommended | optional | hidden` for photo, DOB, NIC, visa status…
   - `sections` (order), `sectionLabels`, `paper`, `dateFormat`, `idealPages`/`maxPages`,
     `references.mode`, `declarationDefault`, `tips`.
2. Add its id to `RegionId` in `regions/types.ts` and register it in `REGIONS` (`regions/index.ts`).
3. Map its timezones / country codes in `regions/detect.ts`.
