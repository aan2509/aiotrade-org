import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { buildRootMetadata, getSiteSeoSettings } from "@/lib/site-seo";
import "./globals.css";

const poppins = localFont({
  src: [
    { path: "./Poppins/Poppins-Light.ttf", weight: "300", style: "normal" },
    { path: "./Poppins/Poppins-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "./Poppins/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "./Poppins/Poppins-Italic.ttf", weight: "400", style: "italic" },
    { path: "./Poppins/Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "./Poppins/Poppins-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "./Poppins/Poppins-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./Poppins/Poppins-SemiBoldItalic.ttf", weight: "600", style: "italic" },
    { path: "./Poppins/Poppins-Bold.ttf", weight: "700", style: "normal" },
    { path: "./Poppins/Poppins-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
  variable: "--font-poppins",
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSiteSeoSettings();

  return buildRootMetadata(seo);
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full overflow-x-clip bg-background text-foreground font-sans">
        <div className="flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}
