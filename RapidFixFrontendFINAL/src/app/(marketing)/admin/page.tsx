import type { Metadata } from "next";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "Admin",
  description: "RapidFix Admin Panel.",
  robots: { index: false, follow: false }, // never index admin pages
};

export default function Page() {
  return <AdminClient />;
}
