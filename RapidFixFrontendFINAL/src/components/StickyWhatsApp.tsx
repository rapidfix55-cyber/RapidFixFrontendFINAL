"use client";

import { useEffect, useState } from "react";

const WA_URL = `https://wa.me/919667891434?text=${encodeURIComponent(
  "Hi RapidFix!\n\nI found you online and need a vehicle repair.\n\nPlease let me know the next available slot and estimated cost. Thanks!",
)}`;

export function StickyWhatsApp() {
  const [visible, setVisible] = useState(true);
  const [pulse, setPulse] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  // Hide when contact section is in view
  useEffect(() => {
    const check = () => {
      const el = document.getElementById("contact");
      if (el) setVisible(el.getBoundingClientRect().top > window.innerHeight);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  // Pulse + tooltip after 45 s if user hasn't interacted with WhatsApp yet
  useEffect(() => {
    if (sessionStorage.getItem("rf_wa_pulsed")) return;
    const t = setTimeout(() => {
      setPulse(true);
      setTooltip(true);
      sessionStorage.setItem("rf_wa_pulsed", "1");
    }, 25_000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      {tooltip && (
        <div className="bg-white text-black text-xs font-bold px-3 py-2 rounded-xl shadow-xl border border-black/10 text-center leading-snug whitespace-nowrap animate-in fade-in duration-300">
          Chat with us now
          <br />
          <span className="font-normal text-black/60">avg. reply in 2 mins</span>
        </div>
      )}

      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => { setPulse(false); setTooltip(false); }}
        aria-label="Chat with us on WhatsApp"
        className={`relative bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform duration-300 ${
          pulse ? "animate-bounce" : ""
        }`}
      >
        {/* Ripple ring when pulsing */}
        {pulse && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" />
        )}
        <img src="/WhatsApp.svg" alt="WhatsApp" width={36} height={36} />
      </a>
    </div>
  );
}
