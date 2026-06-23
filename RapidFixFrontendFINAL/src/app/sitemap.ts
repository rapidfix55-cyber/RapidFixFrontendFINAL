import type { MetadataRoute } from "next";
import { cities } from "@/lib/cityData";

const BASE = "https://www.rapidfixauto.in";

const SERVICES = [
  "bike-service",
  "car-service",
  "mechanic-near-me",
  "car-ac-repair",
  "battery-replacement",
  "tyre-wheel",
  "engine-repair",
  "denting-painting",
  "ev-service",
] as const;

// Tier the cities: Delhi NCR metro gets higher priority (more search volume)
const TIER1_CITIES = ["delhi", "noida", "gurgaon", "faridabad", "ghaziabad", "greater-noida", "dwarka", "rohini", "pitampura", "janakpuri", "lajpat-nagar"];
const TIER2_CITIES = cities.filter((c) => !TIER1_CITIES.includes(c));

function url(path: string, priority: number, changeFreq: MetadataRoute.Sitemap[number]["changeFrequency"]): MetadataRoute.Sitemap[number] {
  return { url: `${BASE}${path}`, priority, changeFrequency: changeFreq, lastModified: new Date() };
}

export default function sitemap(): MetadataRoute.Sitemap {
  // â”€â”€ Static pages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const staticRoutes: MetadataRoute.Sitemap = [
    url("/",          1.0, "weekly"),
    url("/booking",   0.95, "monthly"),
    url("/locations", 0.85, "weekly"),
    url("/services",  0.80, "monthly"),
    url("/actions",   0.75, "weekly"),
    url("/blog",      0.70, "weekly"),
    url("/about",     0.60, "monthly"),
    url("/contact",   0.60, "monthly"),
    url("/privacy",   0.20, "yearly"),
  ];

  // â”€â”€ Tier-1 city service pages (Delhi NCR â€” highest commercial intent) â”€â”€â”€â”€â”€â”€
  const tier1Pages: MetadataRoute.Sitemap = SERVICES.flatMap((service) =>
    TIER1_CITIES.map((city) => url(`/${service}-in-${city}`, 0.90, "weekly"))
  );

  // â”€â”€ Tier-2 city service pages (other metros) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const tier2Pages: MetadataRoute.Sitemap = SERVICES.flatMap((service) =>
    TIER2_CITIES.map((city) => url(`/${service}-in-${city}`, 0.75, "monthly"))
  );

  return [...staticRoutes, ...tier1Pages, ...tier2Pages];
}
