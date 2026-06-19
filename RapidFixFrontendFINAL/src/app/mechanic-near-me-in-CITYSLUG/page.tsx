import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ShieldCheck, Clock, Banknote } from "lucide-react";
import { BrandsStrip } from "@/components/BrandsStrip";
import { StatisticsStrip } from "@/components/StatisticsStrip";
import { notFound } from 'next/navigation';
import { cities, cityContent } from '@/lib/cityData';
import { FAQSection } from "@/components/FAQSection";
import { ServiceIcon, type ServiceIconKey } from "@/lib/service-icons";

const services = [
  { slug: "car-service",           label: "Car Service",        icon: "car-service" as ServiceIconKey },
  { slug: "bike-service",          label: "Bike Service",       icon: "bike-service" as ServiceIconKey },
  { slug: "car-ac-repair",         label: "Car AC Repair",      icon: "car-ac-repair" as ServiceIconKey },
  { slug: "battery-replacement",   label: "Battery Service",    icon: "battery-replacement" as ServiceIconKey },
  { slug: "tyre-wheel",            label: "Tyre & Wheel",       icon: "tyre-wheel" as ServiceIconKey },
  { slug: "engine-repair",         label: "Engine Repair",      icon: "engine-repair" as ServiceIconKey },
  { slug: "denting-painting",      label: "Denting & Painting", icon: "denting-painting" as ServiceIconKey },
  { slug: "ev-service",            label: "EV Service",         icon: "ev-service" as ServiceIconKey },
];

export const dynamicParams = false;

type PageProps = {
  searchParams: Promise<{ city: string }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { city } = await searchParams;
  const cityLabel = (city || "").replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const content = cityContent[city || ""];

  return {
    title: `Mechanic Near Me in ${cityLabel} | RapidFix`,
    description: `Trusted mechanic in ${cityLabel} for car & bike repair. Serving ${content?.area || cityLabel}. Home pickup, same-day service, 30-day warranty.`,
    keywords: [
      `mechanic near me in ${city}`,
      `car repair ${city}`,
      `bike mechanic ${city}`,
      `mechanic near me ${city}`,
    ],
    alternates: { canonical: `https://rapidfixauto.in/mechanic-near-me-in-${city}` },
    openGraph: {
      title: `Mechanic Near Me in ${cityLabel} | RapidFix`,
      description: `Expert car & bike mechanic in ${cityLabel}. Home pickup available. Starting ₹299.`,
      url: `https://rapidfixauto.in/mechanic-near-me-in-${city}`,
      siteName: "RapidFix", locale: "en_IN", type: "website",
    },
  };
}

export default async function MechanicNearMeInCityPage({ searchParams }: PageProps) {
  const { city } = await searchParams;

  if (!city || !cities.includes(city)) notFound();

  const cityLabel = city.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const content = cityContent[city] ?? {
    area: cityLabel,
    tip: "Regular maintenance keeps your vehicle running smoothly and saves on costly repairs.",
    landmarks: [cityLabel],
    commonIssues: ["General wear and tear", "Routine maintenance needs"],
    priceNote: "Transparent pricing with no hidden charges.",
    responseTime: "45-60 minutes",
  };

  const localBusinessSchema = {
    "@context": "https://schema.org", "@type": "AutoRepair",
    name: `RapidFix - Mechanic in ${cityLabel}`,
    description: `Expert car and bike mechanic in ${cityLabel}. Home pickup, same-day service.`,
    url: `https://rapidfixauto.in/mechanic-near-me-in-${city}`,
    telephone: "+919667891434", email: "rapidfix55@gmail.com",
    address: { "@type": "PostalAddress", addressLocality: cityLabel, addressRegion: "Delhi NCR", addressCountry: "IN" },
    areaServed: content.area, priceRange: "₹₹", openingHours: "Mo-Su 08:00-20:00",
  };

  const faqItems = [
    {
      question: `How do I find a reliable mechanic in ${cityLabel}?`,
      answer: `RapidFix covers ${content.area} in ${cityLabel}. Book online and a certified mechanic comes to you.`
    },
    {
      question: `Does RapidFix offer home pickup in ${cityLabel}?`,
      answer: `Yes, RapidFix offers doorstep repair across ${cityLabel}. No need to visit a garage.`
    },
    {
      question: `What is the cost of car repair in ${cityLabel}?`,
      answer: `Car service starts from ₹999 and bike service from ₹299. Transparent pricing, no hidden charges.`
    },
    {
      question: `How quickly can a mechanic reach me in ${cityLabel}?`,
      answer: `RapidFix offers same-day service in ${cityLabel}. Book before noon for same-day pickup.`
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqItems.map(item => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer }
    })),
  };

  return (
    <div className="w-full flex flex-col bg-white overflow-hidden relative pt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="bg-[var(--color-primary)] text-white border-b-2 border-black">
        <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 max-w-5xl">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:text-left md:gap-5">
            <ServiceIcon slug="car-service" className="h-20 w-20 md:h-24 md:w-24 shrink-0" />
            <div>
              <p className="text-sm md:text-base font-black uppercase tracking-[0.35em] text-white/80 mb-3">Mechanic Near Me in {cityLabel}</p>
              <h1 className="text-[clamp(3.5rem,9vw,6.5rem)] font-black uppercase tracking-tight leading-[0.92]">
                We Come to You.
              </h1>
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-lg md:text-2xl font-medium text-white/90 mx-auto md:mx-0">
            Trusted car & bike mechanics in {cityLabel} with home pickup, same-day service, and a 30-day warranty.
          </p>
        </div>
      </section>

      {/* Service Snapshot + Quick Tip */}
      <main className="container mx-auto px-4 md:px-8 py-10 md:py-14 max-w-5xl border-b-2 border-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white border-2 border-black divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
          <div className="p-6 md:p-8">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-3">Why RapidFix</p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight">
              Car & Bike Repair starting from ₹299
            </h2>
            <p className="mt-4 text-base md:text-lg text-black/70 font-medium leading-relaxed">
              Certified mechanics at your doorstep in {cityLabel}. No garage visits, no hidden charges.
            </p>
            <Link href="/booking" className="inline-block mt-8">
              <Button size="lg" className="px-10 md:px-16 group text-lg md:text-xl h-16 md:h-20">
                BOOK NOW <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="bg-[var(--color-grey-100)] p-6 md:p-8 flex flex-col justify-center">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-black mb-3">Quick Tip</p>
            <p className="text-base md:text-lg font-medium text-black/80 leading-relaxed">
              <em>{content.tip}</em>
            </p>
          </div>
        </div>
      </main>

      {/* Trust Badges */}
      <section className="container mx-auto px-4 md:px-8 py-10 md:py-14 max-w-5xl border-b-2 border-black">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black border-2 border-black bg-white">
          <div className="p-6 md:p-8 flex items-center justify-center gap-4 hover:bg-[var(--color-grey-100)] transition-colors">
            <ShieldCheck className="w-8 h-8 text-[var(--color-primary)] shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-black/50 mb-1">Warranty</p>
              <h4 className="font-black text-lg md:text-xl uppercase tracking-tight">30 Days</h4>
            </div>
          </div>
          <div className="p-6 md:p-8 flex items-center justify-center gap-4 hover:bg-[var(--color-grey-100)] transition-colors">
            <Clock className="w-8 h-8 text-[var(--color-primary)] shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-black/50 mb-1">Speed</p>
              <h4 className="font-black text-lg md:text-xl uppercase tracking-tight">Same Day</h4>
            </div>
          </div>
          <div className="p-6 md:p-8 flex items-center justify-center gap-4 hover:bg-[var(--color-grey-100)] transition-colors">
            <Banknote className="w-8 h-8 text-[var(--color-primary)] shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-black/50 mb-1">Pricing</p>
              <h4 className="font-black text-lg md:text-xl uppercase tracking-tight">Transparent</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 md:px-8 py-10 md:py-14 max-w-5xl border-b-2 border-black">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-6">Our Services in {cityLabel}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map(svc => (
            <Link key={svc.slug} href={`/${svc.slug}-in-${city}`}
              className="border-2 border-black rounded-xl p-4 md:p-6 text-center bg-white hover:bg-black hover:text-white transition-colors group">
              <ServiceIcon slug={svc.icon} className="mx-auto h-10 w-10 mb-3" />
              <p className="font-black text-sm uppercase tracking-tight">{svc.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Common Issues */}
      <section className="container mx-auto px-4 md:px-8 py-10 md:py-14 max-w-5xl border-b-2 border-black">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-6">Common Mechanic Issues in {cityLabel}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.commonIssues.map((issue, i) => (
            <div key={i} className="border-2 border-black rounded-xl p-4 md:p-6 bg-white">
              <p className="font-medium text-sm md:text-base text-black/80 leading-relaxed">{issue}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Areas + Price Note */}
      <section className="container mx-auto px-4 md:px-8 py-10 md:py-14 max-w-5xl border-b-2 border-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-black divide-y-2 md:divide-y-0 md:divide-x-2 divide-black bg-white">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4">Areas We Cover in {cityLabel}</h2>
            <p className="text-base md:text-lg text-black/70 font-medium leading-relaxed">
              Our mechanics reach you near <strong>{content.landmarks.join(', ')}</strong> and all surrounding localities within {cityLabel}.
            </p>
          </div>
          <div className="bg-[var(--color-grey-100)] p-6 md:p-8 flex items-center">
            <p className="text-base md:text-lg font-medium text-black/80 leading-relaxed">{content.priceNote}</p>
          </div>
        </div>
      </section>

      {/* Response Time CTA */}
      <section className="bg-[var(--color-primary)] text-white border-b-2 border-black">
        <div className="container mx-auto px-4 md:px-8 py-12 md:py-16 max-w-5xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-white/80 mb-3">Response Time</p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight mb-3">Average in {cityLabel}</h2>
            <p className="text-white/90 font-medium text-base md:text-lg">{content.responseTime}. Book now and track your mechanic in real time.</p>
          </div>
          <Link href="/booking">
            <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-10 h-16 text-lg font-black">
              BOOK NOW <ArrowRight className="ml-3" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Trust Badges (repeated) */}
      <section className="border-b-2 border-black bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
          <div className="p-6 md:p-8 flex items-center justify-center gap-4 hover:bg-[var(--color-grey-100)] transition-colors">
            <ShieldCheck className="w-8 h-8 text-[var(--color-primary)] shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-black/50 mb-1">Warranty</p>
              <h4 className="font-black text-base md:text-lg uppercase tracking-tight">30 Days</h4>
            </div>
          </div>
          <div className="p-6 md:p-8 flex items-center justify-center gap-4 hover:bg-[var(--color-grey-100)] transition-colors">
            <Clock className="w-8 h-8 text-[var(--color-primary)] shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-black/50 mb-1">Delivery</p>
              <h4 className="font-black text-base md:text-lg uppercase tracking-tight">Same Day</h4>
            </div>
          </div>
          <div className="p-6 md:p-8 flex items-center justify-center gap-4 hover:bg-[var(--color-grey-100)] transition-colors">
            <Banknote className="w-8 h-8 text-[var(--color-primary)] shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-black/50 mb-1">Pricing</p>
              <h4 className="font-black text-base md:text-lg uppercase tracking-tight">Transparent</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Strip */}
      <div className="border-b-2 border-black">
        <div className="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
          <BrandsStrip />
        </div>
      </div>

      {/* Statistics Strip */}
      <div className="border-b-2 border-black bg-[var(--color-grey-100)]">
        <div className="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
          <StatisticsStrip />
        </div>
      </div>

      {/* FAQ */}
      <div className="border-b-2 border-black bg-white">
        <div className="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
          <FAQSection items={faqItems} />
        </div>
      </div>

      {/* Other Cities */}
      <section className="container mx-auto px-4 md:px-8 py-10 md:py-14 max-w-5xl border-b-2 border-black bg-white">
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4">Mechanic Near Me in Other Cities</h2>
        <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-2 md:grid-cols-4 md:max-h-none md:overflow-visible md:pr-0">
          {cities.filter(c => c !== city).map(c => (
            <Link key={c} href={`/mechanic-near-me-in-${c}`}
              className="min-w-0 border-2 border-black rounded-lg px-3 py-2 text-sm font-bold text-center leading-tight break-words whitespace-normal bg-white hover:bg-black hover:text-white transition-colors">
              {c.replace(/-/g, ' ').replace(/\b\w/g, x => x.toUpperCase())}
            </Link>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t-2 border-b-2 border-black bg-[var(--color-grey-100)] py-24 relative z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-black opacity-[0.03] uppercase tracking-tighter whitespace-nowrap z-[-1] pointer-events-none text-black">
          ACTION
        </div>
        <div className="container mx-auto px-8 text-center flex flex-col items-center">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-8">
            WANT A SERVICE?
          </h2>
          <p className="text-xl text-black/70 font-medium mb-12 max-w-2xl">
            Don't let your vehicle settle for less. Book an appointment today
            and experience true automotive perfection.
          </p>
          <Link href="/booking">
            <Button size="lg" className="w-full sm:w-auto px-16 group text-xl h-20">
              BOOK NOW <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}