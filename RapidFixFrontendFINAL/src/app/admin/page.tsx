import type { Metadata } from "next";
import AdminPageClient from "./AdminPageClient";

export const metadata: Metadata = {
  title: "Admin",
  description: "RapidFix Admin Panel.",
  robots: { index: false, follow: false }, // never index admin pages
};

export default function AdminPage() {
  return <AdminPageClient />;
}

