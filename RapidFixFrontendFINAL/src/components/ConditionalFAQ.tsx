"use client";

import { usePathname } from "next/navigation";
import { FAQSection } from "./FAQSection";

export function ConditionalFAQ() {
  const pathname = usePathname();
  
  // Hide the global FAQSection on dynamic city pages (e.g. /bike-service-in-delhi)
  // because they will render their own city-specific FAQSection directly.
  const isDynamicCityPage = pathname?.includes("-in-") ?? false;
  
  if (isDynamicCityPage) {
    return null;
  }
  
  return <FAQSection />;
}
