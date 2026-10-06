import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free CV & Resume Builder for Sri Lanka, UK, Europe, Gulf & USA",
  description:
    "Create a CV that follows the conventions of your target country — Sri Lanka, UK, Europe, Germany, Middle East (GCC), USA & Canada or Latin America. Free, no sign-up, your data stays in your browser.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900 print:bg-white">
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
