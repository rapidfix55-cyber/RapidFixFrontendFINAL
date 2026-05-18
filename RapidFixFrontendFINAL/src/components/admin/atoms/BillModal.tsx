"use client";
import { useState, useEffect, useCallback } from "react";
import { C, BILL_STATUS_CFG } from "@/lib/constants";
import { billsApi } from "@/lib/api";
import type { BillDetail, BillItemDraft, BillItemCategory } from "@/lib/types";

interface Props {
  // Exactly one of these is provided:
  jobId?: string; // create a new bill for this job
  billId?: string; // manage an existing bill
  onClose: () => void;
  onSaved: () => void;
}

const PUBLIC_BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://repaiross.com";

// ── Small UI atoms (match NewJobModal styling) ────────────────────────────────

const Label = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontSize: 11,
      fontWeight: 600,
      color: C.textSec,
      marginBottom: 5,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    }}
  >
    {children}
  </div>
);

const SectionDivider = ({ icon, label }: { icon: string; label: string }) => (
  <div
    style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 0 2px" }}
  >
    <i className={`ti ${icon}`} style={{ fontSize: 13, color: C.textSec }} />
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: C.textSec,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {label}
    </span>
    <div style={{ flex: 1, height: 1, background: C.borderFaint }} />
  </div>
);

const cellInput: React.CSSProperties = {
  width: "100%",
  padding: "6px 8px",
  fontSize: 13,
  border: `1px solid ${C.border}`,
  borderRadius: 4,
  fontFamily: "inherit",
  color: C.text,
  background: C.surface,
  outline: "none",
  boxSizing: "border-box",
};

const inr = (n: number) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ── Component ─────────────────────────────────────────────────────────────────

export function BillModal({ jobId, billId, onClose, onSaved }: Props) {
  const [bill, setBill] = useState<BillDetail | null>(null);
  const [items, setItems] = useState<BillItemDraft[]>([
    { category: "labour", description: "", quantity: 1, unit_price: 0 },
  ]);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(!!billId);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [payAmount, setPayAmount] = useState("");
  const [recordingPay, setRecordingPay] = useState(false);
  const [copied, setCopied] = useState(false);

  const hydrate = useCallback((b: BillDetail) => {
    setBill(b);
    setDiscount(Number(b.discount) || 0);
    setNotes(b.notes ?? "");
    setItems(
      b.bill_items.length
        ? b.bill_items.map((i) => ({
            category: i.category,
            description: i.description,
            quantity: Number(i.quantity),
            unit_price: Number(i.unit_price),
          }))
        : [{ category: "labour", description: "", quantity: 1, unit_price: 0 }],
    );
  }, []);

  useEffect(() => {
    if (!billId) return;
    setLoading(true);
    billsApi
      .get(billId)
      .then(hydrate)
      .catch((e: any) => setError(e?.error ?? "Failed to load bill"))
      .finally(() => setLoading(false));
  }, [billId, hydrate]);

  const isDraft = !bill || bill.status === "draft";
  const editable = isDraft;

  const subtotal = items.reduce(
    (s, i) => s + Number(i.quantity || 0) * Number(i.unit_price || 0),
    0,
  );
  const total = Math.max(0, subtotal - Number(discount || 0));

  const validItems = items.filter(
    (i) => i.description.trim() && Number(i.unit_price) > 0,
  );
  const canSave = !saving && validItems.length > 0;

  // ── Item row helpers ────────────────────────────────────────────────────────
  function setItem(idx: number, patch: Partial<BillItemDraft>) {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    );
  }
  function addItem() {
    setItems((prev) => [
      ...prev,
      { category: "labour", description: "", quantity: 1, unit_price: 0 },
    ]);
  }
  function removeItem(idx: number) {
    setItems((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== idx),
    );
  }

  // ── Save (create or update draft) ───────────────────────────────────────────
  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        discount: Number(discount) || 0,
        notes: notes.trim() || undefined,
        items: validItems.map((i) => ({
          category: i.category,
          description: i.description.trim(),
          quantity: Number(i.quantity) || 1,
          unit_price: Number(i.unit_price) || 0,
        })),
      };

      let saved: BillDetail;
      if (bill) {
        saved = await billsApi.update(bill.id, payload);
      } else {
        if (!jobId) throw { error: "No job linked to this bill" };
        saved = await billsApi.create({ job_id: jobId, ...payload });
      }
      hydrate(saved);
      onSaved();
    } catch (e: any) {
      setError(e?.error ?? "Failed to save bill");
    } finally {
      setSaving(false);
    }
  }

  // ── Send via WhatsApp ───────────────────────────────────────────────────────
  async function handleSend() {
    if (!bill) return;
    setSending(true);
    setError(null);
    try {
      await billsApi.send(bill.id, "whatsapp");
      const fresh = await billsApi.get(bill.id);
      hydrate(fresh);
      onSaved();
    } catch (e: any) {
      setError(e?.error ?? "Failed to send bill");
    } finally {
      setSending(false);
    }
  }

  // ── Record payment ──────────────────────────────────────────────────────────
  async function handleRecordPayment() {
    if (!bill) return;
    const amt = Number(payAmount);
    if (isNaN(amt) || amt < 0) {
      setError("Enter a valid payment amount");
      return;
    }
    setRecordingPay(true);
    setError(null);
    try {
      await billsApi.recordPayment(bill.id, amt);
      const fresh = await billsApi.get(bill.id);
      hydrate(fresh);
      setPayAmount("");
      onSaved();
    } catch (e: any) {
      setError(e?.error ?? "Failed to record payment");
    } finally {
      setRecordingPay(false);
    }
  }

  const publicUrl = bill ? `${PUBLIC_BASE}/bill/${bill.public_token}` : "";
  function copyLink() {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  const statusCfg = bill ? BILL_STATUS_CFG[bill.status] : BILL_STATUS_CFG.draft;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          boxShadow: "0 16px 48px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.06)",
          width: "100%",
          maxWidth: 640,
          maxHeight: "92dvh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 6,
                background: C.accent + "15",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className="ti ti-receipt"
                style={{ fontSize: 15, color: C.accent }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>
                {bill ? "Bill" : "Create Bill"}
              </div>
              <div style={{ fontSize: 11, color: C.textSec, marginTop: 1 }}>
                {bill?.customers?.name ??
                  "Itemized invoice for the completed job"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 9px",
                borderRadius: 999,
                background: statusCfg.bg,
                color: statusCfg.text,
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: statusCfg.dot,
                }}
              />
              {statusCfg.label}
            </span>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                cursor: "pointer",
                color: C.textSec,
                padding: "4px 6px",
                display: "flex",
                alignItems: "center",
                lineHeight: 1,
              }}
            >
              <i className="ti ti-x" style={{ fontSize: 14 }} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {loading ? (
            <div
              style={{
                padding: "40px 0",
                textAlign: "center",
                color: C.textSec,
                fontSize: 13,
              }}
            >
              <i className="ti ti-loader-2 ti-spin" style={{ fontSize: 16 }} />{" "}
              Loading bill…
            </div>
          ) : (
            <>
              {/* Vehicle / job context */}
              {bill?.jobs?.vehicles && (
                <div
                  style={{
                    fontSize: 12,
                    color: C.textSec,
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 5,
                    padding: "8px 12px",
                  }}
                >
                  <i className="ti ti-car" style={{ marginRight: 6 }} />
                  {[
                    bill.jobs.vehicles.make,
                    bill.jobs.vehicles.model,
                    bill.jobs.vehicles.registration
                      ? `(${bill.jobs.vehicles.registration})`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" ") || "Vehicle"}
                </div>
              )}

              {/* Line items */}
              <div>
                <SectionDivider icon="ti-list-details" label="Line Items" />
                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {/* Header row */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "92px 1fr 60px 90px 90px 28px",
                      gap: 8,
                      fontSize: 10,
                      fontWeight: 600,
                      color: C.textSec,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      padding: "0 2px",
                    }}
                  >
                    <span>Type</span>
                    <span>Description</span>
                    <span>Qty</span>
                    <span>Rate</span>
                    <span style={{ textAlign: "right" }}>Amount</span>
                    <span />
                  </div>

                  {items.map((it, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "92px 1fr 60px 90px 90px 28px",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <select
                        disabled={!editable}
                        value={it.category}
                        onChange={(e) =>
                          setItem(idx, {
                            category: e.target.value as BillItemCategory,
                          })
                        }
                        style={{ ...cellInput, cursor: "pointer" }}
                      >
                        <option value="labour">Labour</option>
                        <option value="parts">Parts</option>
                      </select>
                      <input
                        disabled={!editable}
                        placeholder="e.g. Engine oil replacement"
                        value={it.description}
                        onChange={(e) =>
                          setItem(idx, { description: e.target.value })
                        }
                        style={cellInput}
                      />
                      <input
                        disabled={!editable}
                        type="number"
                        min={0}
                        value={it.quantity}
                        onChange={(e) =>
                          setItem(idx, { quantity: Number(e.target.value) })
                        }
                        style={cellInput}
                      />
                      <input
                        disabled={!editable}
                        type="number"
                        min={0}
                        value={it.unit_price}
                        onChange={(e) =>
                          setItem(idx, { unit_price: Number(e.target.value) })
                        }
                        style={cellInput}
                      />
                      <span
                        style={{
                          fontSize: 13,
                          color: C.text,
                          textAlign: "right",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {inr(
                          Number(it.quantity || 0) *
                            Number(it.unit_price || 0),
                        )}
                      </span>
                      {editable ? (
                        <button
                          onClick={() => removeItem(idx)}
                          title="Remove"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: C.textMuted,
                            padding: 2,
                          }}
                        >
                          <i className="ti ti-trash" style={{ fontSize: 14 }} />
                        </button>
                      ) : (
                        <span />
                      )}
                    </div>
                  ))}

                  {editable && (
                    <button
                      onClick={addItem}
                      style={{
                        alignSelf: "flex-start",
                        fontSize: 12,
                        color: C.accent,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "2px 0",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <i className="ti ti-plus" style={{ fontSize: 12 }} />
                      Add line item
                    </button>
                  )}
                </div>
              </div>

              {/* Totals */}
              <div>
                <SectionDivider icon="ti-calculator" label="Totals" />
                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    fontSize: 13,
                  }}
                >
                  <Row label="Subtotal" value={inr(subtotal)} />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: C.textSec }}>Discount (₹)</span>
                    <input
                      disabled={!editable}
                      type="number"
                      min={0}
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      style={{ ...cellInput, width: 110, textAlign: "right" }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: 8,
                      borderTop: `1px solid ${C.border}`,
                      fontSize: 15,
                      fontWeight: 700,
                      color: C.text,
                    }}
                  >
                    <span>Total</span>
                    <span style={{ fontVariantNumeric: "tabular-nums" }}>
                      {inr(total)}
                    </span>
                  </div>
                  {bill && bill.amount_paid > 0 && (
                    <>
                      <Row
                        label="Paid"
                        value={inr(bill.amount_paid)}
                        color={C.success}
                      />
                      <Row
                        label="Due"
                        value={inr(bill.amount_due)}
                        color={bill.amount_due > 0 ? C.warning : C.success}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label>Notes (optional)</Label>
                <textarea
                  disabled={!editable}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Visible on the customer's bill page…"
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    fontSize: 13,
                    border: `1px solid ${C.border}`,
                    borderRadius: 4,
                    fontFamily: "inherit",
                    color: C.text,
                    background: editable ? C.bg : C.borderFaint,
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                    lineHeight: 1.5,
                  }}
                />
              </div>

              {/* Share link + payment (only once saved) */}
              {bill && (
                <>
                  <div>
                    <SectionDivider icon="ti-link" label="Customer Link" />
                    <div
                      style={{
                        marginTop: 12,
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <input
                        readOnly
                        value={publicUrl}
                        style={{ ...cellInput, background: C.bg }}
                      />
                      <button
                        onClick={copyLink}
                        style={{
                          padding: "7px 12px",
                          fontSize: 12,
                          border: `1px solid ${C.border}`,
                          borderRadius: 4,
                          background: C.surface,
                          color: copied ? C.success : C.textSec,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          whiteSpace: "nowrap",
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <i
                          className={`ti ${copied ? "ti-check" : "ti-copy"}`}
                          style={{ fontSize: 13 }}
                        />
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {bill.status !== "draft" && bill.amount_due > 0 && (
                    <div>
                      <SectionDivider
                        icon="ti-cash"
                        label="Record Payment"
                      />
                      <div
                        style={{
                          marginTop: 12,
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="number"
                          min={0}
                          placeholder={`Amount (due ${inr(bill.amount_due)})`}
                          value={payAmount}
                          onChange={(e) => setPayAmount(e.target.value)}
                          style={cellInput}
                        />
                        <button
                          onClick={handleRecordPayment}
                          disabled={recordingPay || !payAmount}
                          style={{
                            padding: "7px 14px",
                            fontSize: 12,
                            border: "none",
                            borderRadius: 4,
                            background:
                              recordingPay || !payAmount
                                ? C.textMuted
                                : C.success,
                            color: "#fff",
                            cursor:
                              recordingPay || !payAmount
                                ? "not-allowed"
                                : "pointer",
                            fontFamily: "inherit",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {recordingPay ? "Saving…" : "Record"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {error && (
                <div
                  style={{
                    padding: "9px 12px",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: 4,
                    fontSize: 13,
                    color: C.danger,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <i
                    className="ti ti-alert-circle"
                    style={{ fontSize: 14, flexShrink: 0 }}
                  />
                  {error}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
            background: C.bg,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              fontSize: 13,
              border: `1px solid ${C.border}`,
              borderRadius: 4,
              background: C.surface,
              color: C.textSec,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Close
          </button>

          {editable && (
            <button
              onClick={handleSave}
              disabled={!canSave}
              style={{
                padding: "8px 18px",
                fontSize: 13,
                border: "none",
                borderRadius: 4,
                background: canSave ? C.accent : C.textMuted,
                color: "#fff",
                cursor: canSave ? "pointer" : "not-allowed",
                fontFamily: "inherit",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {saving && (
                <i
                  className="ti ti-loader-2 ti-spin"
                  style={{ fontSize: 13 }}
                />
              )}
              {saving ? "Saving…" : bill ? "Save Changes" : "Save Draft"}
            </button>
          )}

          {bill && (
            <button
              onClick={handleSend}
              disabled={sending}
              style={{
                padding: "8px 18px",
                fontSize: 13,
                border: "none",
                borderRadius: 4,
                background: sending ? C.textMuted : C.success,
                color: "#fff",
                cursor: sending ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <i
                className={`ti ${sending ? "ti-loader-2 ti-spin" : "ti-brand-whatsapp"}`}
                style={{ fontSize: 14 }}
              />
              {sending
                ? "Sending…"
                : bill.status === "draft"
                  ? "Send to Customer"
                  : "Resend"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: C.textSec }}>{label}</span>
      <span
        style={{
          color: color ?? C.text,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
    </div>
  );
}
