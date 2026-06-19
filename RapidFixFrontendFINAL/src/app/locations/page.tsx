"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, MapPin, ShieldCheck, Clock, Banknote, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { BrandsStrip } from "@/components/BrandsStrip";
import { StatisticsStrip } from "@/components/StatisticsStrip";

// ── DATA ──────────────────────────────────────────────────────────────────────

const ALL_CITIES: { slug: string; label: string; area: string }[] = [
  { slug: "delhi",              label: "Delhi",              area: "South, West, East Delhi" },
  { slug: "noida",              label: "Noida",              area: "Sector 18, 62, 120" },
  { slug: "gurgaon",            label: "Gurgaon",            area: "DLF, Cyber City, Sohna Road" },
  { slug: "faridabad",          label: "Faridabad",          area: "NIT, Sector 15, Old Faridabad" },
  { slug: "ghaziabad",          label: "Ghaziabad",          area: "Indirapuram, Vaishali, Raj Nagar" },
  { slug: "greater-noida",      label: "Greater Noida",      area: "Omega, Alpha, Knowledge Park" },
  { slug: "dwarka",             label: "Dwarka",             area: "Sector 10, 12, 21" },
  { slug: "gurugram",           label: "Gurugram",           area: "Sector 29, 56, Golf Course Rd" },
  { slug: "manesar",            label: "Manesar",            area: "IMT Manesar, Sector 8" },
  { slug: "bahadurgarh",        label: "Bahadurgarh",        area: "Tikri, Rohtak Road" },
  { slug: "sonipat",            label: "Sonipat",            area: "Model Town, Murthal Road" },
  { slug: "rohtak",             label: "Rohtak",             area: "Delhi Road, Asthal Bohar" },
  { slug: "panipat",            label: "Panipat",            area: "Sector 12, GT Road" },
  { slug: "karnal",             label: "Karnal",             area: "Sector 7, GT Road" },
  { slug: "rewari",             label: "Rewari",             area: "Dharuhera, Bhiwadi Road" },
  { slug: "bhiwadi",            label: "Bhiwadi",            area: "Phase 1, 2, 3 Industrial Area" },
  { slug: "alwar",              label: "Alwar",              area: "Bhiwadi Road, Tijara" },
  { slug: "meerut",             label: "Meerut",             area: "Shastri Nagar, Garh Road" },
  { slug: "hapur",              label: "Hapur",              area: "NH-9, Pilkhuwa" },
  { slug: "bulandshahr",        label: "Bulandshahr",        area: "Khurja, Sikandrabad" },
  { slug: "modinagar",          label: "Modinagar",          area: "GT Road, NH-58" },
  { slug: "mumbai",             label: "Mumbai",             area: "Andheri, Bandra, Thane" },
  { slug: "bangalore",          label: "Bangalore",          area: "Koramangala, Whitefield, HSR" },
  { slug: "hyderabad",          label: "Hyderabad",          area: "Banjara Hills, Kondapur, Gachibowli" },
  { slug: "chennai",            label: "Chennai",            area: "Anna Nagar, T. Nagar, Velachery" },
  { slug: "kolkata",            label: "Kolkata",            area: "Salt Lake, Park Street, Howrah" },
  { slug: "pune",               label: "Pune",               area: "Kothrud, Wakad, Hinjewadi" },
  { slug: "ahmedabad",          label: "Ahmedabad",          area: "Satellite, Navrangpura, SG Road" },
  { slug: "surat",              label: "Surat",              area: "Adajan, Vesu, Ring Road" },
  { slug: "jaipur",             label: "Jaipur",             area: "Vaishali Nagar, Malviya Nagar, C-Scheme" },
  { slug: "lucknow",            label: "Lucknow",            area: "Hazratganj, Gomti Nagar, Aliganj" },
  { slug: "kanpur",             label: "Kanpur",             area: "Civil Lines, Swaroop Nagar" },
  { slug: "nagpur",             label: "Nagpur",             area: "Dharampeth, Sitabuldi, Wardha Road" },
  { slug: "indore",             label: "Indore",             area: "Vijay Nagar, Palasia, AB Road" },
  { slug: "bhopal",             label: "Bhopal",             area: "MP Nagar, Kolar Road, Arera Colony" },
  { slug: "patna",              label: "Patna",              area: "Boring Road, Bailey Road, Kankarbagh" },
  { slug: "vadodara",           label: "Vadodara",           area: "Alkapuri, Gotri, Manjalpur" },
  { slug: "ludhiana",           label: "Ludhiana",           area: "Model Town, Ferozepur Road, BRS Nagar" },
  { slug: "agra",               label: "Agra",               area: "Fatehabad Road, Sikandra, Shahganj" },
  { slug: "nashik",             label: "Nashik",             area: "Gangapur Road, College Road, Panchavati" },
  { slug: "ranchi",             label: "Ranchi",             area: "Doranda, Kanke Road, Bariatu" },
  { slug: "coimbatore",         label: "Coimbatore",         area: "RS Puram, Saibaba Colony, Peelamedu" },
  { slug: "vijayawada",         label: "Vijayawada",         area: "Benz Circle, Governorpet, MG Road" },
  { slug: "mysore",             label: "Mysore",             area: "Vijayanagar, Kuvempunagar, Saraswathipuram" },
  { slug: "jodhpur",            label: "Jodhpur",            area: "Ratanada, Shastri Nagar, Paota" },
  { slug: "raipur",             label: "Raipur",             area: "Shankar Nagar, Pandri, Telibandha" },
  { slug: "kochi",              label: "Kochi",              area: "Kakkanad, Edapally, Vyttila" },
  { slug: "chandigarh",         label: "Chandigarh",         area: "Sector 17, 22, 35" },
  { slug: "bhubaneswar",        label: "Bhubaneswar",        area: "Saheed Nagar, Patia, Nayapalli" },
  { slug: "thiruvananthapuram", label: "Thiruvananthapuram", area: "Kowdiar, Pattom, Vanchiyoor" },
  { slug: "visakhapatnam",      label: "Visakhapatnam",      area: "MVP Colony, Gajuwaka, Rushikonda" },
  { slug: "madurai",            label: "Madurai",            area: "Anna Nagar, KK Nagar, Bypass Road" },
];

const SERVICES = [
  { slug: "car-service",         label: "Car Service" },
  { slug: "bike-service",        label: "Bike Service" },
  { slug: "car-ac-repair",       label: "Car AC Repair" },
  { slug: "battery-replacement", label: "Battery" },
  { slug: "tyre-wheel",          label: "Tyre & Wheel" },
  { slug: "engine-repair",       label: "Engine Repair" },
  { slug: "denting-painting",    label: "Denting & Painting" },
  { slug: "ev-service",          label: "EV Service" },
];

const CITIES_PER_PAGE = 8;

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function LocationsPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? ALL_CITIES.filter(
          (c) => c.label.toLowerCase().includes(q) || c.area.toLowerCase().includes(q)
        )
      : ALL_CITIES;
  }, [query]);

  const totalPages = Math.ceil(filtered.length / CITIES_PER_PAGE);
  const pageCities = filtered.slice((page - 1) * CITIES_PER_PAGE, page * CITIES_PER_PAGE);

  function handleSearch(val: string) {
    setQuery(val);
    setPage(1);
  }

  function goTo(p: number) {
    setPage(p);
    // scroll city list into view smoothly
    document.getElementById("city-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Build page numbers with ellipsis
  function pageNumbers(): (number | "…")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const nums: (number | "…")[] = [1];
    if (page > 3) nums.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) nums.push(i);
    if (page < totalPages - 2) nums.push("…");
    nums.push(totalPages);
    return nums;
  }

  return (
    <div className="w-full flex flex-col bg-white overflow-hidden relative pt-24">

      {/* ── HERO ── */}
      <section className="bg-[var(--color-primary)] text-white border-b-2 border-black">
        <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 max-w-5xl">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:text-left md:gap-5">
            <MapPin className="h-20 w-20 md:h-24 md:w-24 shrink-0 text-white/80" />
            <div>
              <p className="text-sm md:text-base font-black uppercase tracking-[0.35em] text-white/80 mb-3">
                Service Locations
              </p>
              <h1 className="text-[clamp(3rem,8vw,6rem)] font-black uppercase tracking-tight leading-[0.92]">
                We Come to You.
              </h1>
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-lg md:text-2xl font-medium text-white/90 mx-auto md:mx-0">
            Expert car and bike repair across {ALL_CITIES.length}+ cities — home pickup,
            same-day service, and a 30-day warranty wherever you are.
          </p>

          {/* Search bar */}
          <div className="mt-8 relative max-w-lg mx-auto md:mx-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search your city…"
              className="w-full pl-12 pr-4 h-14 border-2 border-black rounded-xl bg-white text-black font-medium text-base placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
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

      {/* ── CITY LIST ── */}
      <section
        id="city-list"
        className="container mx-auto px-4 md:px-8 py-10 md:py-14 max-w-5xl border-b-2 border-black scroll-mt-24"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
            Cities We Serve
          </h2>
          <p className="text-sm font-bold text-black/50 uppercase tracking-widest">
            {filtered.length} {filtered.length === 1 ? "city" : "cities"}
            {query && ` for "${query}"`}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="border-2 border-black rounded-xl p-10 text-center">
            <p className="text-lg font-black uppercase tracking-tight mb-2">No cities found</p>
            <p className="text-sm text-black/60 font-medium">Try a different search term.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-0 border-2 border-black divide-y-2 divide-black">
            {pageCities.map((city) => (
              <div
                key={city.slug}
                className="grid grid-cols-1 md:grid-cols-[1fr_auto] bg-white hover:bg-[var(--color-grey-100)] transition-colors"
              >
                {/* Left */}
                <div className="p-5 md:p-7">
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-1">
                    {city.area}
                  </p>
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-3">
                    {city.label}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {SERVICES.map((svc) => (
                      <Link
                        key={svc.slug}
                        href={`/${svc.slug}-in-${city.slug}`}
                        className="text-xs border-2 border-black rounded px-2.5 py-1 font-black uppercase tracking-wide bg-white hover:bg-black hover:text-white transition-colors"
                      >
                        {svc.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center border-t-2 md:border-t-0 md:border-l-2 border-black px-6 py-4 md:p-8">
                  <Link
                    href={`/mechanic-near-me-in-${city.slug}`}
                    className="flex items-center gap-2 font-black uppercase text-sm tracking-wide group whitespace-nowrap"
                  >
                    All Services
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-1 flex-wrap">
            {/* Prev */}
            <button
              onClick={() => goTo(page - 1)}
              disabled={page === 1}
              className="flex items-center justify-center w-10 h-10 border-2 border-black rounded font-black disabled:opacity-30 hover:bg-black hover:text-white transition-colors disabled:hover:bg-white disabled:hover:text-black"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {pageNumbers().map((n, i) =>
              n === "…" ? (
                <span
                  key={`ellipsis-${i}`}
                  className="flex items-center justify-center w-10 h-10 font-black text-black/40 select-none"
                >
                  …
                </span>
              ) : (
                <button
                  key={n}
                  onClick={() => goTo(n as number)}
                  className={`flex items-center justify-center w-10 h-10 border-2 border-black rounded font-black transition-colors ${
                    page === n
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-black hover:text-white"
                  }`}
                  aria-label={`Page ${n}`}
                  aria-current={page === n ? "page" : undefined}
                >
                  {n}
                </button>
              )
            )}

            {/* Next */}
            <button
              onClick={() => goTo(page + 1)}
              disabled={page === totalPages}
              className="flex items-center justify-center w-10 h-10 border-2 border-black rounded font-black disabled:opacity-30 hover:bg-black hover:text-white transition-colors disabled:hover:bg-white disabled:hover:text-black"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* ── RESPONSE-TIME BANNER ── */}
      <section className="bg-[var(--color-primary)] text-white border-b-2 border-black">
        <div className="container mx-auto px-4 md:px-8 py-12 md:py-16 max-w-5xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-white/80 mb-3">
              Response Time
            </p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight mb-3">
              45–60 Minutes Across India
            </h2>
            <p className="text-white/90 font-medium text-base md:text-lg">
              Book now and track your mechanic in real time.
            </p>
          </div>
          <Link href="/booking">
            <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-10 h-16 text-lg font-black">
              BOOK NOW <ArrowRight className="ml-3" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── BRANDS ── */}
      <div className="border-b-2 border-black">
        <div className="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
          <BrandsStrip />
        </div>
      </div>

      {/* ── STATISTICS ── */}
      <div className="border-b-2 border-black bg-[var(--color-grey-100)]">
        <div className="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
          <StatisticsStrip />
        </div>
      </div>

      {/* ── BOTTOM CTA ── */}
      <section className="border-t-2 border-b-2 border-black bg-[var(--color-grey-100)] py-24 relative z-10 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-black opacity-[0.03] uppercase tracking-tighter whitespace-nowrap z-[-1] pointer-events-none text-black"
          aria-hidden="true"
        >
          LOCATIONS
        </div>
        <div className="container mx-auto px-8 text-center flex flex-col items-center">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-8">
            NEAR YOU?
          </h2>
          <p className="text-xl text-black/70 font-medium mb-12 max-w-2xl">
            Don't let your vehicle settle for less. Book an appointment today
            and experience true automotive perfection.
          </p>
          <Link href="/booking">
            <Button size="lg" className="w-full sm:w-auto px-16 group text-xl h-20">
              BOOK NOW{" "}
              <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}