"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LocateUs } from "@/components/LocateUs";
import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { LeadPopup } from "@/components/LeadPopup";
import { GsapScrollWrapper } from "@/components/GsapScrollWrapper";
import { FAQSection } from "@/components/FAQSection";

// Routes that render standalone — no marketing nav, footer, popups, etc.
const BARE_PREFIXES = ["/bill"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isBare = BARE_PREFIXES.some((p) => pathname.startsWith(p));

  if (isBare) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Header />
      <GsapScrollWrapper>
        <main className="flex-1">{children}</main>
        <FAQSection />
        <LocateUs />
        <Footer />
      </GsapScrollWrapper>
      <StickyWhatsApp />
      <LeadPopup />
    </>
  );
}
