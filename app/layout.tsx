import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import DataProvider from "@/components/DataProvider";
import Shell from "@/components/Shell";
import ThemeProvider, { themeInitScript } from "@/components/ThemeProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Ciro Gomes 2026 · Dashboard de Mídia",
  description:
    "Painel de performance da campanha de mídia digital (Meta Ads) — Ciro Gomes, pré-candidato ao Governo do Ceará em 2026.",
};

export const viewport: Viewport = {
  themeColor: "#0c0820",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <DataProvider>
            <Shell>{children}</Shell>
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
