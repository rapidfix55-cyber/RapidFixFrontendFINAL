import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ShieldCheck, Clock, Banknote, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BrandsStrip } from "@/components/BrandsStrip";
import { StatisticsStrip } from "@/components/StatisticsStrip";
import { ServiceIcon, type ServiceIconKey } from "@/lib/service-icons";
import { cities, cityContent, serviceCityTips } from "@/lib/cityData";

type ServiceSlug =
  | "bike-service"
  | "car-service"
  | "mechanic-near-me"
  | "car-ac-repair"
  | "battery-replacement"
  | "tyre-wheel"
  | "engine-repair"
  | "denting-painting"
  | "ev-service";

const SERVICE_META: Record<ServiceSlug, { label: string; description: string; startPrice: string; hero: string }> = {
  "bike-service":        { label: "Bike Service",         description: "Oil change, tune-up & regular bike maintenance.",            startPrice: "₹299",  hero: "Keep Your Bike Running."      },
  "car-service":         { label: "Car Service",          description: "Periodic service, engine care & full inspection.",           startPrice: "₹999",  hero: "Peak Performance Every Drive." },
  "mechanic-near-me":    { label: "Mechanic Near Me",     description: "On-call roadside assistance & quick fixes.",                startPrice: "₹199",  hero: "Help Is On The Way."           },
  "car-ac-repair":       { label: "Car AC Repair",        description: "Gas refill, compressor check & full AC service.",           startPrice: "₹499",  hero: "Stay Cool On Every Road."      },
  "battery-replacement": { label: "Battery Replacement",  description: "Battery test, replacement & terminal service.",             startPrice: "₹199",  hero: "Never Get Stranded Again."     },
  "tyre-wheel":          { label: "Tyre & Wheel",         description: "Puncture repair, tyre replacement & wheel alignment.",      startPrice: "₹99",   hero: "Roll Without Worry."           },
  "engine-repair":       { label: "Engine Repair",        description: "Full diagnostics, overhaul & performance tuning.",          startPrice: "₹1499", hero: "Precision Under the Hood."     },
  "denting-painting":    { label: "Denting & Painting",   description: "Scratch removal, body dent repair & full polish.",          startPrice: "₹799",  hero: "Look Brand New Again."         },
  "ev-service":          { label: "EV Service",           description: "Electric bike & scooter service, battery & motor check.",   startPrice: "₹999",  hero: "EV Care. Future Ready."        },
};

const VALID_SERVICES = Object.keys(SERVICE_META) as ServiceSlug[];

function toTitleCase(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

type PageProps = { params: Promise<{ service: string; city: string }> };

export function generateStaticParams() {
  const params: { service: string; city: string }[] = [];
  for (const service of VALID_SERVICES)
    for (const city of cities)
      params.push({ service, city });
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service, city } = await params;
  if (!VALID_SERVICES.includes(service as ServiceSlug) || !cities.includes(city))
    return { title: "RapidFix" };
  const meta = SERVICE_META[service as ServiceSlug];
  const cityLabel = toTitleCase(city);
  return {
    title: `${meta.label} in ${cityLabel} | RapidFix`,
    description: `Expert ${meta.label.toLowerCase()} in ${cityLabel}. ${meta.description} Home pickup, same-day service. Starting ${meta.startPrice}.`,
    alternates: { canonical: `https://rapidfixauto.in/${service}-in-${city}` },
    openGraph: {
      title: `${meta.label} in ${cityLabel} | RapidFix`,
      description: `${meta.label} in ${cityLabel} starting ${meta.startPrice}. Home pickup available.`,
      url: `https://rapidfixauto.in/${service}-in-${city}`,
      siteName: "RapidFix",
      locale: "en_IN",
      type: "website",
    },
  };
}

export default async function ServiceCityPage({ params }: PageProps) {
  const { service, city } = await params;
  if (!VALID_SERVICES.includes(service as ServiceSlug) || !cities.includes(city)) notFound();

  const meta = SERVICE_META[service as ServiceSlug];
  const cityLabel = toTitleCase(city);
  const content = cityContent[city] ?? {
    area: cityLabel,
    landmarks: [cityLabel],
    commonIssues: [
      "General wear and tear from city driving",
      "Routine maintenance and oil changes needed",
      "Tyre pressure and tread checks recommended",
      "Battery health checks for extreme weather",
    ],
    priceNote: "Transparent pricing with no hidden charges.",
    responseTime: "45–60 minutes",
  };
  const tip = serviceCityTips[service]?.[city] ?? content.commonIssues[0];

  const faqItems = [
    {
      question: `How much does ${meta.label.toLowerCase()} cost in ${cityLabel}?`,
      answer: `${meta.label} at RapidFix ${cityLabel} starts from ${meta.startPrice}. Pricing is transparent with no hidden charges — you get a full quote before work begins.`,
    },
    {
      question: `Does RapidFix offer home pickup for ${meta.label.toLowerCase()} in ${cityLabel}?`,
      answer: `Yes, RapidFix offers doorstep ${meta.label.toLowerCase()} across ${cityLabel}. Book online and our technician comes directly to you — no need to visit a garage.`,
    },
    {
      question: `How long does ${meta.label.toLowerCase()} take in ${cityLabel}?`,
      answer: `Most ${meta.label.toLowerCase()} jobs are completed the same day in ${cityLabel}. We inform you upfront if any work requires additional time.`,
    },
    {
      question: `Is there a warranty on ${meta.label.toLowerCase()} in ${cityLabel}?`,
      answer: `Yes, RapidFix provides a 30-day service warranty on all ${meta.label.toLowerCase()} work in ${cityLabel}. If any issue recurs within 30 days, we fix it at no extra charge.`,
    },
    {
      question: `Which areas in ${cityLabel} does RapidFix cover?`,
      answer: `Our technicians cover ${content.landmarks.join(", ")} and all surrounding localities in ${cityLabel}. Average response time is ${content.responseTime}.`,
    },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",        item: "https://rapidfixauto.in" },
      { "@type": "ListItem", position: 2, name: meta.label,    item: `https://rapidfixauto.in/services` },
      { "@type": "ListItem", position: 3, name: `${meta.label} in ${cityLabel}`, item: `https://rapidfixauto.in/${service}-in-${city}` },
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: `RapidFix ${meta.label} in ${cityLabel}`,
    description: `${meta.label} in ${cityLabel}. ${meta.description}`,
    url: `https://rapidfixauto.in/${service}-in-${city}`,
    telephone: "+919667891434",
    email: "rapidfix55@gmail.com",
    address: { "@type": "PostalAddress", addressLocality: cityLabel, addressCountry: "IN" },
    areaServed: content.area,
    priceRange: "₹₹",
    openingHours: "Mo-Su 08:00-20:00",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const otherCities = cities.filter((c) => c !== city);

  return (
    <div className="w-full flex flex-col bg-white overflow-hidden relative pt-20 sm:pt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── HERO ── */}
      <section className="no-gsap bg-[var(--color-primary)] text-white border-b-2 border-black">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-16 md:py-20 max-w-5xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <ServiceIcon slug={service as ServiceIconKey} className="h-14 w-14 sm:h-20 sm:w-20 shrink-0" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.2em] text-white/90 mb-2">
                {meta.label} in {cityLabel}
              </h1>
              <p className="text-4xl sm:text-5xl md:text-[clamp(3rem,7vw,5.5rem)] font-black uppercase tracking-tight leading-[0.95]">
                {meta.hero}
              </p>
            </div>
          </div>
          <p className="mt-5 text-base sm:text-lg md:text-xl font-medium text-white/85 max-w-2xl leading-relaxed">
            Expert {meta.label.toLowerCase()} in {cityLabel} — home pickup, same-day service, 30-day warranty.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href="/booking">
              <Button size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-gray-100 px-8 h-14 text-base font-black group">
                BOOK NOW <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          {/* Trust strip — social proof above the fold */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-white/75 text-xs sm:text-sm font-medium">
            <span>⭐ 4.8 on Google</span>
            <span className="hidden sm:inline text-white/30">·</span>
            <span>10,000+ services done</span>
            <span className="hidden sm:inline text-white/30">·</span>
            <span>30-day warranty</span>
            <span className="hidden sm:inline text-white/30">·</span>
            <span>Home pickup available</span>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="no-gsap border-b-2 border-black bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl">
          <div className="grid grid-cols-3 divide-x-2 divide-black">
            {[
              { icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)] shrink-0" />, label: "Warranty", value: "30 Days" },
              { icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)] shrink-0" />,       label: "Speed",   value: "Same Day" },
              { icon: <Banknote className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)] shrink-0" />,    label: "Pricing", value: "Transparent" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="py-4 sm:py-6 px-3 sm:px-8 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 hover:bg-[var(--color-grey-100)] transition-colors">
                {icon}
                <div className="text-center sm:text-left">
                  <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-black/50 leading-none mb-1">{label}</p>
                  <p className="font-black text-sm sm:text-base md:text-lg uppercase tracking-tight leading-none">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO INTRO TEXT — read by Googlebot immediately after h1 ── */}
      <section className="no-gsap border-b-2 border-black bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 max-w-5xl prose">
          <p>
            Looking for reliable <strong>{meta.label.toLowerCase()} in {cityLabel}</strong>? RapidFix brings certified
            technicians directly to your doorstep across {content.landmarks.join(", ")} and all nearby areas.
            Our {meta.label.toLowerCase()} starts from <strong>{meta.startPrice}</strong> — with transparent pricing,
            no hidden charges, and a <strong>30-day service warranty</strong> on every job.
          </p>
          <p>
            Whether you need emergency roadside help or a scheduled {meta.label.toLowerCase()}, book online and a
            technician reaches you in <strong>{content.responseTime}</strong>. {content.priceNote}
          </p>
        </div>
      </section>

      {/* ── SERVICE SNAPSHOT + TIP ── */}
      <section className="no-gsap border-b-2 border-black bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 border-2 border-black divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
            <div className="p-5 sm:p-8 flex flex-col">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-3">Service Snapshot</p>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight">
                Starting from {meta.startPrice}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-black/70 font-medium leading-relaxed">{meta.description}</p>
            </div>
            <div className="bg-[var(--color-grey-100)] p-5 sm:p-8 flex flex-col justify-center">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-black/50 mb-3">Quick Tip for {cityLabel}</p>
              <p className="text-sm sm:text-base font-medium text-black/80 leading-relaxed italic">{tip}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMON ISSUES ── */}
      <section className="no-gsap border-b-2 border-black bg-[var(--color-grey-100)]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 max-w-5xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight mb-5 sm:mb-6">
            Common {meta.label} Issues in {cityLabel}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {content.commonIssues.map((issue, i) => (
              <div
                key={issue}
                className="bg-white border-2 border-black rounded-xl p-4 sm:p-5 min-h-[5rem] flex items-start gap-3"
              >
                <span className="text-[var(--color-primary)] font-black text-lg shrink-0 mt-0.5">{i + 1}.</span>
                <h3 className="text-sm sm:text-base text-black/80 font-medium leading-relaxed m-0">{issue}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AREAS + PRICE NOTE ── */}
      <section className="no-gsap border-b-2 border-black bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 border-2 border-black divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
            <div className="p-5 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-tight">
                  Areas We Cover in {cityLabel}
                </h2>
              </div>
              <p className="text-sm sm:text-base text-black/70 font-medium leading-relaxed">
                Our technicians reach you near{" "}
                <strong>{content.landmarks.join(", ")}</strong>{" "}
                and all surrounding localities. Avg. response: <strong>{content.responseTime}</strong>.
              </p>
            </div>
            <div className="bg-[var(--color-grey-100)] p-5 sm:p-8 flex items-center">
              <p className="text-sm sm:text-base font-medium text-black/80 leading-relaxed">{content.priceNote}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── BRANDS ── */}
      <div className="border-b-2 border-black">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 max-w-5xl">
          <BrandsStrip />
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="border-b-2 border-black bg-[var(--color-grey-100)]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 max-w-5xl">
          <StatisticsStrip />
        </div>
      </div>

      {/* ── FAQ (dynamic, city + service specific) ── */}
      <section className="no-gsap border-b-2 border-black bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 max-w-5xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight mb-5 sm:mb-6">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col divide-y-2 divide-black border-2 border-black">
            {faqItems.map((item, i) => (
              <details key={item.question ?? i} className="group bg-white open:bg-[var(--color-grey-100)] transition-colors">
                <summary className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 sm:py-5 cursor-pointer list-none font-black text-sm sm:text-base uppercase tracking-tight">
                  <span>{item.question}</span>
                  <span className="shrink-0 text-[var(--color-primary)] text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="px-4 sm:px-6 pb-4 sm:pb-5 text-sm sm:text-base text-black/75 font-medium leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── OTHER CITIES ── */}
      <section className="no-gsap border-b-2 border-black bg-[var(--color-grey-100)]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 max-w-5xl">
          <h2 className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-tight mb-4 sm:mb-5">
            {meta.label} in Other Cities
          </h2>
          <div className="max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-black/20 scrollbar-track-transparent">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
              {otherCities.map((c) => (
                <Link
                  key={c}
                  href={`/${service}-in-${c}`}
                  className="bg-white border-2 border-black rounded-lg px-3 py-3 text-xs sm:text-sm font-bold text-center leading-snug hover:bg-black hover:text-white transition-colors min-h-[2.75rem] flex items-center justify-center"
                >
                  {toTitleCase(c)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="no-gsap border-b-2 border-black bg-[var(--color-primary)] text-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 max-w-5xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight mb-2">
              Book {meta.label} in {cityLabel}
            </h2>
            <p className="text-white/85 font-medium text-sm sm:text-base max-w-xl">
              Home pickup · Same-day service · 30-day warranty · Starting {meta.startPrice}
            </p>
          </div>
          <Link href="/booking" className="shrink-0">
            <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-8 h-14 text-base font-black group w-full sm:w-auto">
              BOOK NOW <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
