import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RapidFix | Precision Automotive Engineering",
  description: "High-performance automotive repair and precision engineering.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans overflow-x-hidden">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
