"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { LeadPopup } from "@/components/LeadPopup";
import { GsapScrollWrapper } from "@/components/GsapScrollWrapper";
import { FAQSection } from "@/components/FAQSection";

const LocateUs = dynamic(() => import("@/components/LocateUs").then((m) => m.LocateUs), { ssr: false });

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
