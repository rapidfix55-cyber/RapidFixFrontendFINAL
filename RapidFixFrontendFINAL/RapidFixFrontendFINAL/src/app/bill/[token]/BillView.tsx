"use client";

import { useEffect, useState } from "react";
import { billsApi } from "@/lib/api";
import type { BillDetail } from "@/lib/types";
import { Loader2, Printer, CheckCircle2, AlertCircle } from "lucide-react";

const inr = (n: number) =>
  `₹${Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> =
  {
    draft: { bg: "#f1f5f9", text: "#475569", label: "Draft" },
    sent: { bg: "#eff6ff", text: "#1d4ed8", label: "Awaiting Payment" },
    unpaid: { bg: "#fffbeb", text: "#92400e", label: "Unpaid" },
    partial: { bg: "#fff7ed", text: "#9a3412", label: "Partially Paid" },
    paid: { bg: "#f0fdf4", text: "#065f46", label: "Paid" },
  };

export default function BillView({ token }: { token: string }) {
  const [bill, setBill] = useState<BillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    billsApi
      .getPublic(token)
      .then(setBill)
      .catch((e: any) => setError(e?.error ?? "Bill not found"))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-grey-100)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-grey-100)] p-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-[var(--color-primary)] mx-auto mb-4" />
          <h1 className="text-2xl font-black uppercase mb-2">Bill Not Found</h1>
          <p className="text-[var(--color-grey-800)]">
            This bill link is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  const s = STATUS_STYLE[bill.status] ?? STATUS_STYLE.draft;
  const veh = bill.jobs?.vehicles;
  const vehicleLabel = veh
    ? [veh.make, veh.model, veh.registration ? `(${veh.registration})` : null]
        .filter(Boolean)
        .join(" ")
    : null;

  return (
    <div
      id="invoice-print-root"
      className="min-h-screen bg-[var(--color-grey-100)] py-10 px-4 print:bg-white print:py-0"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page { size: A4 portrait; margin: 12mm; }
              html, body { background: #fff !important; margin: 0 !important; padding: 0 !important; }
              body * { visibility: hidden !important; }
              #invoice-print-root, #invoice-print-root * { visibility: visible !important; }
              #invoice-print-root {
                position: absolute; left: 0; top: 0;
                width: 100%; min-height: 0 !important;
                padding: 0 !important; margin: 0 !important;
                background: #fff !important;
              }
              #invoice-sheet {
                box-shadow: none !important;
                border: 1px solid #000 !important;
                width: 100% !important; max-width: 100% !important;
                margin: 0 !important;
              }
              #invoice-sheet, #invoice-sheet * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              #invoice-sheet tr,
              #invoice-sheet thead,
              #invoice-sheet table { break-inside: avoid; }
              .print\\:hidden { display: none !important; }
            }
          `,
        }}
      />
      <div className="max-w-3xl mx-auto">
        {/* Action bar — hidden on print */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <span
            className="px-3 py-1.5 text-xs font-black uppercase tracking-widest rounded-full"
            style={{ background: s.bg, color: s.text }}
          >
            {s.label}
          </span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-black)] text-white text-xs font-black uppercase tracking-widest"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>

        {/* Invoice sheet */}
        <div
          id="invoice-sheet"
          className="bg-white border-2 border-[var(--color-black)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] print:shadow-none print:border"
        >
          {/* Header */}
          <div className="bg-[var(--color-black)] text-white p-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
                Rapid<span className="text-[var(--color-primary)]">Fix</span>
              </h1>
              <p className="text-[var(--color-grey-300)] text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
                Service Invoice
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase text-[var(--color-grey-300)] tracking-widest">
                Invoice No.
              </p>
              <p className="text-lg font-black font-mono">
                {bill.public_token.toUpperCase()}
              </p>
              <p className="text-[10px] font-bold text-[var(--color-grey-300)] mt-2">
                {new Date(bill.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 border-b-2 border-[var(--color-grey-200)]">
            <div>
              <p className="text-[10px] font-black uppercase text-[var(--color-grey-800)] tracking-widest mb-2">
                Billed To
              </p>
              <p className="font-black text-lg">
                {bill.customers?.name ?? "Customer"}
              </p>
              {bill.customers?.phone && (
                <p className="text-sm text-[var(--color-grey-800)] font-bold">
                  {bill.customers.phone}
                </p>
              )}
              {vehicleLabel && (
                <p className="text-sm text-[var(--color-grey-800)] mt-2 font-bold uppercase">
                  {vehicleLabel}
                </p>
              )}
            </div>
            <div className="md:text-right">
              <p className="text-[10px] font-black uppercase text-[var(--color-grey-800)] tracking-widest mb-2">
                Service Centre
              </p>
              <p className="font-black">
                {bill.locations?.name ?? "RapidFix"}
              </p>
              {bill.locations?.address && (
                <p className="text-sm text-[var(--color-grey-800)] font-bold">
                  {bill.locations.address}
                </p>
              )}
              {bill.locations?.phone && (
                <p className="text-sm text-[var(--color-grey-800)] font-bold">
                  {bill.locations.phone}
                </p>
              )}
            </div>
          </div>

          {/* Line items */}
          <div className="p-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[var(--color-black)]">
                  <th className="text-left py-3 text-[10px] font-black uppercase tracking-widest">
                    Description
                  </th>
                  <th className="text-left py-3 text-[10px] font-black uppercase tracking-widest">
                    Type
                  </th>
                  <th className="text-right py-3 text-[10px] font-black uppercase tracking-widest">
                    Qty
                  </th>
                  <th className="text-right py-3 text-[10px] font-black uppercase tracking-widest">
                    Rate
                  </th>
                  <th className="text-right py-3 text-[10px] font-black uppercase tracking-widest">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {bill.bill_items.map((it) => (
                  <tr
                    key={it.id}
                    className="border-b border-[var(--color-grey-200)]"
                  >
                    <td className="py-3 font-bold">{it.description}</td>
                    <td className="py-3 capitalize text-[var(--color-grey-800)]">
                      {it.category}
                    </td>
                    <td className="py-3 text-right tabular-nums">
                      {Number(it.quantity)}
                    </td>
                    <td className="py-3 text-right tabular-nums">
                      {inr(it.unit_price)}
                    </td>
                    <td className="py-3 text-right tabular-nums font-bold">
                      {inr(it.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mt-6">
              <div className="w-full max-w-xs space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-grey-800)] font-bold uppercase text-xs">
                    Subtotal
                  </span>
                  <span className="tabular-nums font-bold">
                    {inr(bill.subtotal)}
                  </span>
                </div>
                {bill.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[var(--color-grey-800)] font-bold uppercase text-xs">
                      Discount
                    </span>
                    <span className="tabular-nums font-bold text-[var(--color-success)]">
                      − {inr(bill.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t-2 border-[var(--color-black)] text-lg font-black">
                  <span className="uppercase">Total</span>
                  <span className="tabular-nums">{inr(bill.total)}</span>
                </div>
                {bill.amount_paid > 0 && (
                  <>
                    <div className="flex justify-between pt-1">
                      <span className="text-[var(--color-grey-800)] font-bold uppercase text-xs">
                        Paid
                      </span>
                      <span className="tabular-nums font-bold text-[var(--color-success)]">
                        {inr(bill.amount_paid)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-grey-800)] font-bold uppercase text-xs">
                        Balance Due
                      </span>
                      <span className="tabular-nums font-black">
                        {inr(bill.amount_due)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Notes */}
            {bill.notes && (
              <div className="mt-8 p-4 bg-[var(--color-grey-100)] border border-[var(--color-grey-300)]">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-grey-800)] mb-1">
                  Notes
                </p>
                <p className="text-sm">{bill.notes}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-[var(--color-grey-100)] p-6 text-center border-t-2 border-[var(--color-grey-200)]">
            <div className="flex items-center justify-center gap-2 text-[var(--color-success)] mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">
                Thank you for choosing RapidFix
              </span>
            </div>
            <p className="text-[10px] text-[var(--color-grey-800)] font-bold uppercase tracking-wider">
              For queries, reply to our WhatsApp message
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
