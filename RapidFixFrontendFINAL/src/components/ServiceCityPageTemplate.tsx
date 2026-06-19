"use client"

import Link from "next/link"
import { ArrowRight, ShieldCheck, Clock, Banknote } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { BrandsStrip } from "@/components/BrandsStrip"
import { StatisticsStrip } from "@/components/StatisticsStrip"
import { FAQSection } from "@/components/FAQSection"
import { ServiceIcon, type ServiceIconKey } from "@/lib/service-icons"

export type ServiceCityTemplateData = {
  area: string
  tip: string
  landmarks: string[]
  priceNote: string
  responseTime: string
  commonIssues: string[]
}

export type ServiceCityTemplateConfig = {
  slug: string
  label: string
  description: string
  startPrice: string
  icon: ServiceIconKey
}

export type ServiceCityTemplateFaqItem = {
  q: string
  a: string
}

type Props = {
  city: string
  cityLabel: string
  content: ServiceCityTemplateData
  config: ServiceCityTemplateConfig
  faqItems: ServiceCityTemplateFaqItem[]
}

export function ServiceCityPageTemplate({ city, cityLabel, content, config, faqItems }: Props) {
  return (
    <div className="w-full flex flex-col bg-white overflow-hidden relative pt-24">
      <section className="bg-(--color-primary) text-white border-b-2 border-black">
        <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 max-w-5xl">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:text-left md:gap-5">
            <ServiceIcon slug={config.icon} className="h-20 w-20 md:h-24 md:w-24 shrink-0" />
            <div>
              <p className="text-sm md:text-base font-black uppercase tracking-[0.35em] text-white/80 mb-3">{config.label} in {cityLabel}</p>
              <h1 className="text-[clamp(3.5rem,9vw,6.5rem)] font-black uppercase tracking-tight leading-[0.92]">
                Precision, Redrawn.
              </h1>
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-lg md:text-2xl font-medium text-white/90 mx-auto md:mx-0">
            Looking for expert <strong>{config.label.toLowerCase()} in {cityLabel}</strong>? RapidFix covers {content.area} with home pickup, same-day service, and a 30-day warranty.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 md:px-8 py-10 md:py-14 max-w-5xl border-b-2 border-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white border-2 border-black divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
          <div className="p-6 md:p-8">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-(--color-primary) mb-3">Service Snapshot</p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight">
              {config.label} starting from {config.startPrice}
            </h2>
            <p className="mt-4 text-base md:text-lg text-black/70 font-medium leading-relaxed">
              {config.description}
            </p>
            <Link href="/booking" className="inline-block mt-8">
              <Button size="lg" className="px-10 md:px-16 group text-lg md:text-xl h-16 md:h-20">
                BOOK NOW <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="bg-(--color-grey-100) p-6 md:p-8 flex flex-col justify-center">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-black mb-3">Quick Tip</p>
            <p className="text-base md:text-lg font-medium text-black/80 leading-relaxed">
              <em>{content.tip}</em>
            </p>
          </div>
        </div>
      </main>

      <section className="container mx-auto px-4 md:px-8 py-10 md:py-14 max-w-5xl border-b-2 border-black">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black border-2 border-black bg-white">
          <div className="p-6 md:p-8 flex items-center justify-center gap-4 hover:bg-(--color-grey-100) transition-colors">
            <ShieldCheck className="w-8 h-8 text-(--color-primary) shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-black/50 mb-1">Warranty</p>
              <h4 className="font-black text-lg md:text-xl uppercase tracking-tight">30 Days</h4>
            </div>
          </div>
          <div className="p-6 md:p-8 flex items-center justify-center gap-4 hover:bg-(--color-grey-100) transition-colors">
            <Clock className="w-8 h-8 text-(--color-primary) shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-black/50 mb-1">Speed</p>
              <h4 className="font-black text-lg md:text-xl uppercase tracking-tight">Same Day</h4>
            </div>
          </div>
          <div className="p-6 md:p-8 flex items-center justify-center gap-4 hover:bg-(--color-grey-100) transition-colors">
            <Banknote className="w-8 h-8 text-(--color-primary) shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-black/50 mb-1">Pricing</p>
              <h4 className="font-black text-lg md:text-xl uppercase tracking-tight">Transparent</h4>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-8 py-10 md:py-14 max-w-5xl border-b-2 border-black">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-6">Common {config.label} Issues in {cityLabel}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.commonIssues.map((issue, index) => (
            <div key={index} className="border-2 border-black rounded-xl p-4 md:p-6 bg-white">
              <p className="font-medium text-sm md:text-base text-black/80 leading-relaxed">{issue}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-8 py-10 md:py-14 max-w-5xl border-b-2 border-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-black divide-y-2 md:divide-y-0 md:divide-x-2 divide-black bg-white">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4">Areas We Cover in {cityLabel}</h2>
            <p className="text-base md:text-lg text-black/70 font-medium leading-relaxed">
              Our mechanics reach you near <strong>{content.landmarks.join(', ')}</strong> and all surrounding localities within {cityLabel}.
            </p>
          </div>
          <div className="bg-(--color-grey-100) p-6 md:p-8 flex items-center">
            <p className="text-base md:text-lg font-medium text-black/80 leading-relaxed">{content.priceNote}</p>
          </div>
        </div>
      </section>

      <section className="bg-(--color-primary) text-white border-b-2 border-black">
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

      <div className="border-b-2 border-black bg-white">
        <div className="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
          <BrandsStrip />
        </div>
      </div>

      <div className="border-b-2 border-black bg-(--color-grey-100)">
        <div className="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
          <StatisticsStrip />
        </div>
      </div>

      <div className="border-b-2 border-black bg-white">
        <div className="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
          <FAQSection items={faqItems} />
        </div>
      </div>

      <section className="container mx-auto px-4 md:px-8 py-10 md:py-14 max-w-5xl border-b-2 border-black bg-white">
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4">{config.label} in Other Cities</h2>
        <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-2 md:grid-cols-4 md:max-h-none md:overflow-visible md:pr-0">
          {cityItems(city, config.slug).map((cityName) => (
            <Link key={cityName} href={`/${config.slug}-in-${cityName}`}
              className="min-w-0 border-2 border-black rounded-lg px-3 py-2 text-sm font-bold text-center leading-tight wrap-break-word whitespace-normal bg-white hover:bg-black hover:text-white transition-colors">
              {cityName.replace(/-/g, ' ').replace(/\b\w/g, x => x.toUpperCase())}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

function cityItems(currentCity: string, _slug: string) {
  // This helper keeps the template focused on layout.
  return [
    ...new Set([
      "noida",
      "gurgaon",
      "faridabad",
      "ghaziabad",
      "greater-noida",
      "delhi",
      "south-delhi",
      "west-delhi",
    ])
  ].filter((city) => city !== currentCity)
}
