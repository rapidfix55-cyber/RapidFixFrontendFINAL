"use client";

import dynamic from "next/dynamic";

const LocateUs = dynamic(() => import("@/components/LocateUs").then((m) => m.LocateUs), { ssr: false });

export function LocateUsClient() {
  return <LocateUs />;
}
