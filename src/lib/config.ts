/** Public site configuration, set via environment variables at build time (see .env.example). */
export const siteConfig = {
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "",
  adsenseSlots: {
    editor: process.env.NEXT_PUBLIC_ADSENSE_SLOT_EDITOR ?? "",
  },
  buyMeACoffeeUsername: process.env.NEXT_PUBLIC_BMC_USERNAME ?? "",
};
