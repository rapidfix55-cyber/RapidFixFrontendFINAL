import { Metadata } from "next";
import BillView from "./BillView";

export const metadata: Metadata = {
  title: "Your Bill | RapidFix",
  description: "View your RapidFix service invoice.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <BillView token={token} />;
}
