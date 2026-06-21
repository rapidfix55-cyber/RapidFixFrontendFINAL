"use client";

import { useState, useEffect, useRef } from "react";
import { X, PhoneCall } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

const WA_BUSINESS = "919667891434";

function validatePhone(v: string) {
  if (!v) return "Phone number is required";
  if (!/^[6-9][0-9]{9}$/.test(v))
    return "Enter a valid 10-digit Indian mobile number";
  return null;
}

export function LeadPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Prevents exit-intent firing more than once per page load
  const exitFiredRef = useRef(false);

  const isBlockedPath = () => {
    const p = window.location.pathname;
    return p.startsWith("/admin") || p.startsWith("/checkout") || p.startsWith("/booking");
  };

  const canShow = () =>
    !isBlockedPath() && !localStorage.getItem("rf_lead_submitted");

  const triggerExitIntent = () => {
    if (exitFiredRef.current) return; // already fired this page load
    if (!canShow()) return;
    exitFiredRef.current = true;
    setIsOpen(true);
  };

  // Show popup after 2.5 s on first page view of the session (if user hasn't submitted)
  useEffect(() => {
    if (!canShow()) return;
    if (sessionStorage.getItem("rf_popup_shown")) return;
    const t = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem("rf_popup_shown", "1");
    }, 2500);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Desktop exit-intent: mouse leaves viewport at top ONCE per page load
  useEffect(() => {
    if (window.innerWidth < 768) return;
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 0) triggerExitIntent();
    };
    document.addEventListener("mouseleave", handler);
    return () => document.removeEventListener("mouseleave", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mobile exit-intent: fast fling back to top after scrolling deep = leaving gesture, fires once
  useEffect(() => {
    if (window.innerWidth >= 768) return;
    let lastY = 0;
    let maxY = 0;
    const handler = () => {
      const y = window.scrollY;
      if (y > maxY) maxY = y;
      if (maxY > 400 && y < 80 && lastY - y > 60) triggerExitIntent();
      lastY = y;
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validatePhone(phone.trim());
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";
      if (!apiBase) throw new Error("API URL not configured");
      await fetch(`${apiBase}/leads/capture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
    } catch {
      // fire-and-forget
    } finally {
      setLoading(false);
    }

    const text = encodeURIComponent(
      `Hi RapidFix!\n\nI need a doorstep vehicle repair and would like to book a mechanic.\n\nMy number: +91${phone.trim()}\n\nPlease let me know the next available slot and estimated cost. Thanks!`,
    );
    window.open(`https://wa.me/${WA_BUSINESS}?text=${text}`, "_blank");
    localStorage.setItem("rf_lead_submitted", "1"); // permanent — never show again after submission
    setIsOpen(false);
  }

  if (!isOpen) return null;

  const inputCls = [
    "w-full h-14 pl-14 pr-4 rounded-xl border-2 outline-none transition-colors text-lg text-black dark:text-white dark:bg-zinc-900",
    error
      ? "border-red-500"
      : "border-red-100 focus:border-red-500 dark:border-red-900/30 dark:focus:border-red-500",
  ].join(" ");

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl max-w-3xl w-full flex flex-col md:flex-row animate-in zoom-in-95 duration-500 max-h-[90vh] md:max-h-[85vh]">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-20 size-8 flex items-center justify-center rounded-full bg-black text-white hover:scale-110 transition-transform shadow-md"
        >
          <X className="size-4" />
        </button>

        {/* Image panel — fixed height on mobile, fixed width (2/5) on desktop */}
        <div className="relative h-40 max-h-[35vw] shrink-0 overflow-hidden md:max-h-none md:h-auto md:w-2/5 bg-zinc-100 dark:bg-zinc-900">
          <Image
            src="https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Real-time doorstep repairs"
            fill
            className="object-cover object-[60%_center] md:object-right"
            priority
          />
        </div>

        <div className="p-6 md:p-10 flex-1 flex flex-col justify-center overflow-y-auto">
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/logo.png"
              alt="RapidFix"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">
              RAPID<span className="text-[#ff2020]">FIX</span>
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-zinc-50">
            Real-time doorstep repairs
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-lg">
            Book a certified mechanic in{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              30 seconds
            </span>
            . We come to your home, office or even on road with onsite fix.
          </p>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="relative flex">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-zinc-900 dark:text-zinc-100 pointer-events-none select-none">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="98765 43210"
                maxLength={10}
                className={inputCls}
                value={phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setPhone(digits);
                  if (error) setError(validatePhone(digits));
                }}
              />
            </div>

            {error && <p className="text-sm text-red-500 pl-1">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 text-lg font-bold bg-[#ff2020] hover:bg-[#e01010] disabled:opacity-60 text-white rounded-xl uppercase tracking-wider mt-1"
            >
              {loading ? "Booking…" : "Book Now"}
            </Button>

            <p className="text-[11px] leading-snug text-zinc-500 dark:text-zinc-400 text-center pt-1">
              By continuing, you agree to receive booking & service updates from
              RapidFix on WhatsApp. Reply STOP anytime to opt out. See our{" "}
              <a
                href="/privacy"
                className="underline hover:text-red-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              .
            </p>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
              Or call us directly
            </p>
            <a
              href="tel:+919667891434"
              className="inline-flex items-center gap-2
            text-xl font-bold text-zinc-900 dark:text-zinc-100
            hover:text-red-500 transition-colors"
            >
              <PhoneCall className="size-5" />
              +91 96678 91434
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
