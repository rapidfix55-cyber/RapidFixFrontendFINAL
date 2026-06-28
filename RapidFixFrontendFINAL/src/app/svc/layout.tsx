import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { LeadPopup } from "@/components/LeadPopup";
import { GsapScrollWrapper } from "@/components/GsapScrollWrapper";

const LocateUs = dynamic(() => import("@/components/LocateUs").then((m) => m.LocateUs), { ssr: false });

// Service-city pages use this layout — identical to SiteChrome but without the
// global generic FAQSection, because each city page renders its own dynamic FAQ.
export default function ServiceCityLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <GsapScrollWrapper>
        <main className="flex-1">{children}</main>
        <LocateUs />
        <Footer />
      </GsapScrollWrapper>
      <StickyWhatsApp />
      <LeadPopup />
    </>
  );
}
