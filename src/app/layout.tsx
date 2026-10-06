import type { Metadata, Viewport } from "next";
import { Geist, Roboto } from "next/font/google";
import Script from "next/script";
import { siteConfig } from "@/lib/config";
import { ICON_FONT_URL } from "@/lib/icons";
import "./globals.css";

/** Used by the CV document itself (see cv.css). */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/** Material 3 UI typeface. */
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free CV & Resume Builder for Sri Lanka, UK, Europe, Gulf & USA",
  description:
    "Create a CV that follows the conventions of your target country — Sri Lanka, UK, Europe, Germany, Middle East (GCC), USA & Canada or Latin America. Free, no sign-up, your data stays in your browser.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eceef4" },
    { media: "(prefers-color-scheme: dark)", color: "#1d2024" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${roboto.variable} h-full antialiased`}>
      <head>
        <link rel="stylesheet" href={ICON_FONT_URL} />
      </head>
      <body className="flex min-h-full flex-col bg-surface text-on-surface print:bg-white">
        {children}
        {siteConfig.adsenseClient ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
