# RapidFix Auto — SEO Pages Build Context (Updated)

## Project Overview
Next.js 16.2.4 (Turbopack) project for RapidFix, a car & bike repair service in Delhi NCR (India) offering home pickup service.
- **Domain:** `https://rapidfixauto.in`
- **Stack:** Next.js App Router, TypeScript, Tailwind CSS
- **Component aliases:** `@/components/...` (e.g. `import { Button } from "@/components/ui/Button"`)
- **Project root:** `C:\Users\shini\OneDrive\Desktop\SEO RAPIDFIX\RapidFixFrontendFINAL\RapidFixFrontendFINAL\`

---

## What Was Built in This Session

### Root Cause of 404 Bug (FIXED)
- Old pages had `@antigravity/ui/Button` (non-existent package, build-breaking import)
- Old pages had **no `generateStaticParams`** — Next.js never generated any city routes → universal 404
- Old pages used sync `params` (old Next.js pattern) — now uses `Promise<{ city: string }>`

### Fixes Applied to All 9 Service Pages
1. Fixed `@antigravity/ui/Button` → `@/components/ui/Button`
2. Added `export function generateStaticParams()` returning all 11 cities
3. Added `export const dynamicParams = false` — garbage city params → 404
4. Added `notFound()` guard in both `generateMetadata` and the page function
5. Added guard `if (!city || !cities.includes(city)) return { title: "RapidFix" }` in `generateMetadata` (required for Next.js 16 Turbopack build)
6. Full page anatomy: JSON-LD AutoRepair + FAQPage schema, city-unique tips, internal city links, FAQ section
7. Async `params: Promise<{ city: string }>` pattern (required in Next.js 15/16)

---

## Current Folder Structure

```
src/app/
├── layout.tsx                              ← global metadata, Google verification tag
├── page.tsx                                ← homepage
├── robots.ts                               ← allow /, disallow /admin /checkout /api /_next
├── sitemap.ts                              ← 9 services × 11 cities = 99 + 7 static = 106 URLs
│
├── blog/
│   ├── page.tsx
│   └── [slug]/page.tsx
│
├── mechanic-near-me-in-[city]/page.tsx     ← REWRITTEN this session
├── bike-service-in-[city]/page.tsx         ← REWRITTEN this session
├── car-service-in-[city]/page.tsx          ← REWRITTEN this session
├── car-ac-repair-in-[city]/page.tsx        ← CREATED this session
├── battery-replacement-in-[city]/page.tsx  ← CREATED this session
├── tyre-wheel-in-[city]/page.tsx           ← CREATED this session
├── engine-repair-in-[city]/page.tsx        ← CREATED this session
├── denting-painting-in-[city]/page.tsx     ← CREATED this session
├── ev-service-in-[city]/page.tsx           ← CREATED this session
│
├── locations/page.tsx
├── services/                               ← static service hub pages (pre-existing)
├── about/page.tsx
├── actions/
├── booking/page.tsx
├── contact/page.tsx
├── checkout/page.tsx
└── admin/

src/lib/
├── cityData.ts        ← CREATED this session (cities, cityContent, serviceCityTips)
├── service-icons.tsx  ← CREATED this session (ServiceIcon component + ServiceIconKey type)
├── utils.ts           ← pre-existing
├── api.ts             ← pre-existing
├── constants.ts       ← pre-existing
└── types.ts           ← pre-existing

src/components/
├── FAQSection.tsx     ← UPDATED this session (now accepts optional items prop)
├── BrandsStrip.tsx
├── StatisticsStrip.tsx
├── ui/Button.tsx      ← correct import: @/components/ui/Button
└── ...others
```

---

## Cities (11 total — expanded from original 7)

```ts
export const cities = [
  'delhi',
  'noida',
  'gurgaon',
  'faridabad',
  'ghaziabad',
  'greater-noida',
  'dwarka',
  'rohini',        // NEW
  'pitampura',     // NEW
  'janakpuri',     // NEW
  'lajpat-nagar',  // NEW
];
```

**4 cities were added:** rohini, pitampura, janakpuri, lajpat-nagar — each with fully unique content in `cityData.ts`.

---

## The 9 Service Page Types

| Slug | Label | Start Price | Folder |
|------|-------|-------------|--------|
| `mechanic-near-me` | Mechanic Near Me | ₹199 | `mechanic-near-me-in-[city]` |
| `bike-service` | Bike Service | ₹299 | `bike-service-in-[city]` |
| `car-service` | Car Service | ₹999 | `car-service-in-[city]` |
| `car-ac-repair` | Car AC Repair | ₹499 | `car-ac-repair-in-[city]` |
| `battery-replacement` | Battery Replacement | ₹199 | `battery-replacement-in-[city]` |
| `tyre-wheel` | Tyre & Wheel | ₹99 | `tyre-wheel-in-[city]` |
| `engine-repair` | Engine Repair | ₹1499 | `engine-repair-in-[city]` |
| `denting-painting` | Denting & Painting | ₹799 | `denting-painting-in-[city]` |
| `ev-service` | EV Service | ₹999 | `ev-service-in-[city]` |

**Total city pages: 9 × 11 = 99**

---

## Key Library Files

### `src/lib/cityData.ts`
Exports:
- `cities: string[]` — the 11 city slugs
- `cityContent: Record<string, CityContent>` — per-city: `area`, `landmarks`, `commonIssues`, `priceNote`, `responseTime`
- `serviceCityTips: Record<string, Record<string, string>>` — **99 unique tips** (one per service+city combination) — primary SEO differentiator

`CityContent` interface:
```ts
interface CityContent {
  area: string;         // used in schema areaServed
  landmarks: string[];  // displayed in "Areas We Cover" section
  commonIssues: string[]; // 4 items shown as cards
  priceNote: string;    // unique pricing context text
  responseTime: string; // e.g. "35–50 minutes"
}
```

### `src/lib/service-icons.tsx`
```ts
export type ServiceIconKey =
  | "mechanic-near-me" | "bike-service" | "car-service"
  | "car-ac-repair" | "battery-replacement" | "tyre-wheel"
  | "engine-repair" | "denting-painting" | "ev-service";

export function ServiceIcon({ slug, className }: { slug: ServiceIconKey; className?: string }) // renders LucideIcon
```
Icons used: `Wrench` (mechanic, engine), `Gauge` (bike), `Car` (car), `Wind` (ac), `Battery` (battery), `Settings` (tyre), `Paintbrush` (denting), `Zap` (ev)

### `src/components/FAQSection.tsx`
```ts
interface FAQItem { question: string; answer: string; }
interface FAQSectionProps { items?: FAQItem[]; }
export function FAQSection({ items }: FAQSectionProps = {})
// When items provided → renders those FAQs
// When no items → renders default hardcoded FAQs
```
Note: FAQSection is a `"use client"` component (uses framer-motion).
**Do NOT embed JSON-LD schema inside FAQSection** — schema is put directly in the page via `<script type="application/ld+json">` tags.

---

## Required Page Anatomy (every [city] page MUST have all of this)

```ts
// 1. SERVICE_CONFIG (unique per page)
const SERVICE_CONFIG = {
  slug: "car-service",
  label: "Car Service",
  description: "Periodic service, engine care & full inspection.",
  startPrice: "₹999",
  icon: "car-service" as ServiceIconKey,
};

// 2. Static params control
export const dynamicParams = false;

// 3. Type (Next.js 15/16 async params)
type PageProps = { params: Promise<{ city: string }> };

// 4. generateStaticParams (MANDATORY)
export function generateStaticParams() {
  return cities.map((city) => ({ city }));
}

// 5. generateMetadata with guard
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  if (!city || !cities.includes(city)) return { title: "RapidFix" }; // REQUIRED guard
  const cityLabel = city.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${SERVICE_CONFIG.label} in ${cityLabel} | RapidFix`,
    description: `...`,
    keywords: [...],
    alternates: { canonical: `https://rapidfixauto.in/${SERVICE_CONFIG.slug}-in-${city}` },
    openGraph: { ... },
  };
}

// 6. Page function with notFound guard
export default async function Page({ params }: PageProps) {
  const { city } = await params;
  if (!city || !cities.includes(city)) notFound(); // REQUIRED guard
  
  const cityLabel = city.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const content = cityContent[city];
  const tip = serviceCityTips[SERVICE_CONFIG.slug]?.[city] ?? content.commonIssues[0];
  
  // ... JSON-LD schemas, JSX return
}
```

---

## Page Sections (UI structure — same for all 9 pages)

1. **Hero** — colored bg, `ServiceIcon`, H1 with punchy tagline, subtitle with city name
2. **Service Snapshot + Quick Tip** — 2-col grid: price/description/CTA | unique city+service tip
3. **Trust Badges** — 3-col: Warranty 30 Days | Same Day | Transparent Pricing
4. **Common Issues** — 2-col grid of 4 cards from `content.commonIssues`
5. **Areas + Price Note** — 2-col: landmarks text | `content.priceNote`
6. **Response Time CTA** — colored bg, `content.responseTime`, Book Now button
7. **BrandsStrip** — pre-existing component
8. **StatisticsStrip** — pre-existing component
9. **FAQSection** — passes 4 city+service specific `faqItems`
10. **Other Cities** — grid of links to same service in other cities
11. **Final CTA** — large "WANT A SERVICE?" with Book Now

---

## JSON-LD Schemas (both required on every page)

```ts
// AutoRepair (LocalBusiness)
{
  "@context": "https://schema.org", "@type": "AutoRepair",
  name: `RapidFix ${SERVICE_CONFIG.label} in ${cityLabel}`,
  telephone: "+919667891434", email: "rapidfix55@gmail.com",
  address: { "@type": "PostalAddress", addressLocality: cityLabel, addressRegion: "Delhi NCR", addressCountry: "IN" },
  areaServed: content.area,
  priceRange: "₹₹", openingHours: "Mo-Su 08:00-20:00",
}

// FAQPage
{
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: faqItems.map(item => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer }
  })),
}
```

---

## Sitemap (`src/app/sitemap.ts`)

```ts
const cities = ['delhi','noida','gurgaon','faridabad','ghaziabad','greater-noida','dwarka','rohini','pitampura','janakpuri','lajpat-nagar'];

const serviceRoutes = [
  'mechanic-near-me', 'bike-service', 'car-service', 'car-ac-repair',
  'battery-replacement', 'tyre-wheel', 'engine-repair', 'denting-painting', 'ev-service',
];

// 99 city+service URLs (priority: 0.9, changeFrequency: 'weekly')
// + 7 static routes (homepage priority 1.0, booking 0.9, actions 0.8, locations 0.8, etc.)
// Total: 106 URLs
```

---

## robots.ts (DO NOT CHANGE)
```ts
rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/admin/', '/checkout', '/checkout/', '/api/', '/_next/'] }]
sitemap: 'https://rapidfixauto.in/sitemap.xml'
host: 'https://rapidfixauto.in'
```

---

## Business Info (use exactly across all schema/contact references)
- **Brand:** RapidFix / RapidFixAuto
- **Domain:** https://rapidfixauto.in
- **Phone:** +919667891434
- **Email:** rapidfix55@gmail.com
- **Region:** Delhi NCR, India
- **Hours:** Mo-Su 08:00-20:00

---

## Next.js 16 Turbopack — Critical Notes

1. **`params` is always `Promise<{ city: string }>`** — must `await params`
2. **`generateStaticParams` must be exported** — without it, ALL dynamic routes 404
3. **`dynamicParams = false`** — makes non-listed cities return 404
4. **Guard in `generateMetadata`** — `if (!city || !cities.includes(city)) return { title: "RapidFix" }` — required because Next.js 16 Turbopack calls `generateMetadata` with the template path during build, resulting in `city = undefined`
5. **Build output** shows `○ /bike-service-in-[city]` as ONE line (not expanded) — this is expected in Next.js 16. Individual city pages are generated on first request and cached (ISR-like, `initialRevalidateSeconds: false`)
6. **PowerShell quirk:** Folder names with `[city]` need `-LiteralPath` flag, NOT plain path strings

---

## Build Status
```
✓ Compiled successfully
✓ TypeScript passed
✓ Static pages generated (35/35)
Build: PASSES ✅
```

All 9 routes show `○ (Static)` in build output. No `@antigravity` imports remain. All pages have `generateStaticParams`, `dynamicParams = false`, `notFound()` guard.

---

## What Still Needs Work (potential next steps)

- **Locations page** (`/locations`) — may need updating to link to all 11 cities (4 new cities added)
- **Blog content** — blog posts could target city+service keywords
- **Image assets** — service icon images could replace lucide icons for better CTR
- **Google Search Console** — submit updated sitemap after deployment (`https://rapidfixauto.in/sitemap.xml`)
- **Vercel deployment** — push `fix/seo-sitemap-robots-cities` branch and create PR to main
