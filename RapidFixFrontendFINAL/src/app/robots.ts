import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/svc/",       // internal rewrite target â€” duplicate of /service-in-city URLs
          "/admin/",
          "/checkout/",
          "/api/",
          "/_next/",
        ],
      },
      // Allow Google's AdsBot so Shopping/Ads can crawl product pages
      {
        userAgent: "AdsBot-Google",
        allow: "/",
        disallow: ["/admin/", "/checkout/", "/api/"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rapidfixauto.in"}/sitemap.xml`,
    host: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rapidfixauto.in",
  };
}
