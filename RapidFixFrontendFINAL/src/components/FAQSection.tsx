"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What services does RapidFix provide for cars and bikes?",
    answer: "RapidFix offers professional car and bike repair services including periodic maintenance, engine diagnostics, brake repair, AC servicing, battery replacement, tyre services, denting & painting, and emergency roadside assistance.",
  },
  {
    question: "How can I book a car or bike service with RapidFix online?",
    answer: "You can easily book a car service or bike repair online through our website. Select your required service, choose a convenient time slot, and confirm your booking in just a few clicks.",
  },
  {
    question: "Does RapidFix offer doorstep car and bike service?",
    answer: "Yes, RapidFix provides doorstep vehicle servicing in selected locations. Our expert technicians come to your home or office.",
  },
  {
    question: "Is RapidFix available in my city?",
    answer: "RapidFix is expanding rapidly across multiple cities in India. Enter your location on our website to check availability.",
  },
  {
    question: "Which car and bike brands does RapidFix service?",
    answer: "RapidFix services all major brands including Tata, Mahindra, Honda, Hyundai, Suzuki, BMW, Audi, Mercedes, and more.",
  },
  {
    question: "Do you provide warranty on repairs and services?",
    answer: "Yes, we offer a service warranty on car and bike repairs. Coverage depends on the type of service and parts used.",
  },
];

type FAQItem = { question: string; answer: string };

export function FAQSection({ items }: { items?: FAQItem[] }) {
  const activeFaqs = items || faqs;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 relative z-10 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black opacity-[0.03] uppercase tracking-tighter whitespace-nowrap z-[-1] pointer-events-none text-black">
        QUESTIONS
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-16 text-center text-black">
          FREQUENTLY ASKED QUESTIONS
        </h2>

        <div className="flex flex-col">
          {activeFaqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-black/10 last:border-b-0 py-6"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between text-left group outline-none"
              >
                <h3 className="text-lg md:text-xl font-bold uppercase tracking-wide text-black group-hover:text-black/70 transition-colors">
                  {faq.question}
                </h3>
                <div className="text-[#ff2020] shrink-0 ml-6">
                  {openIndex === index ? (
                    <Minus className="w-6 h-6" />
                  ) : (
                    <Plus className="w-6 h-6" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-black/60 pt-4 leading-relaxed font-medium pr-12">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}