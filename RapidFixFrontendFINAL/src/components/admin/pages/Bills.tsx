"use client";
import { useState, useEffect, useCallback } from "react";
import { C, BILL_STATUS_CFG } from "@/lib/constants";
import { DataTable } from "../atoms/DataTable";
import { billsApi } from "@/lib/api";
import type { Bill, BillStatus, Column } from "@/lib/types";
import { BillModal } from "../atoms/BillModal";

const Mono = ({ v }: { v: string }) => (
  <span style={{ fontFamily: "'Courier New',monospace", fontSize: 12 }}>
    {v.slice(0, 8)}
  </span>
);
const Muted = ({ v }: { v: string }) => (
  <span style={{ color: C.textSec, fontSize: 12 }}>{v}</span>
);
const inr = (n: number) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const FILTERS = ["All", "Draft", "Sent", "Unpaid", "Partial", "Paid"] as const;
type BillFilter = (typeof FILTERS)[number];
const FILTER_MAP: Partial<Record<BillFilter, BillStatus>> = {
  Draft: "draft",
  Sent: "sent",
  Unpaid: "unpaid",
  Partial: "partial",
  Paid: "paid",
};

function StatusBadge({ status }: { status: BillStatus }) {
  const cfg = BILL_STATUS_CFG[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 9px",
        borderRadius: 999,
        background: cfg.bg,
        color: cfg.text,
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: cfg.dot,
        }}
      />
      {cfg.label}
    </span>
  );
}

export function Bills() {
  const [filter, setFilter] = useState<BillFilter>("All");
  const [bills, setBills] = useState<Bill[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openBillId, setOpenBillId] = useState<string | null>(null);

  const fetchBills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const status = FILTER_MAP[filter];
      const res = await billsApi.list({ status, limit: 50 });
      setBills(res.data);
      setTotal(res.total);
    } catch (e: any) {
      setError(e?.error ?? "Failed to load bills");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const cols: Column<Bill>[] = [
    { key: "id", label: "Bill", render: (r) => <Mono v={r.id} /> },
    {
      key: "customers",
      label: "Customer",
      render: (r) => <>{r.customers?.name ?? "—"}</>,
    },
    {
      key: "total",
      label: "Total",
      render: (r) => (
        <span style={{ fontVariantNumeric: "tabular-nums" }}>
          {inr(r.total)}
        </span>
      ),
    },
    {
      key: "amount_due",
      label: "Due",
      render: (r) => (
        <span
          style={{
            fontVariantNumeric: "tabular-nums",
            color: r.amount_due > 0 ? C.warning : C.success,
          }}
        >
          {inr(r.amount_due)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "created_at",
      label: "Created",
      render: (r) => (
        <Muted v={new Date(r.created_at).toLocaleDateString()} />
      ),
    },
    {
      key: "actions",
      label: "",
      render: (r) => (
        <button
          onClick={() => setOpenBillId(r.id)}
          style={{
            padding: "4px 10px",
            fontSize: 12,
            border: `1px solid ${C.border}`,
            background: C.surface,
            borderRadius: 3,
            cursor: "pointer",
            color: C.text,
            fontFamily: "inherit",
          }}
        >
          Open
        </button>
      ),
    },
  ];

  return (
    <div>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            background: "#f0f2f5",
            padding: 2,
            borderRadius: 4,
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "5px 11px",
                fontSize: 12,
                borderRadius: 3,
                fontFamily: "inherit",
                border: "none",
                background: filter === f ? C.surface : "transparent",
                color: filter === f ? C.text : C.textSec,
                fontWeight: filter === f ? 500 : 400,
                cursor: "pointer",
                boxShadow: filter === f ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table card */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 4,
        }}
      >
        <div
          style={{
            padding: "11px 14px 11px 20px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 12, color: C.textSec }}>
            {loading ? "Loading…" : `${total} bill${total !== 1 ? "s" : ""}`}
          </span>
        </div>

        {loading ? (
          <div
            style={{
              padding: "40px 0",
              textAlign: "center",
              color: C.textSec,
              fontSize: 13,
            }}
          >
            Loading bills…
          </div>
        ) : error ? (
          <div
            style={{
              padding: "40px 0",
              textAlign: "center",
              color: C.danger,
              fontSize: 13,
            }}
          >
            {error} —{" "}
            <span
              onClick={fetchBills}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              retry
            </span>
          </div>
        ) : bills.length > 0 ? (
          <DataTable columns={cols} rows={bills} />
        ) : (
          <div
            style={{
              padding: "40px 0",
              textAlign: "center",
              color: C.textSec,
            }}
          >
            No bills matching this filter
          </div>
        )}
      </div>

      {openBillId && (
        <BillModal
          billId={openBillId}
          onClose={() => setOpenBillId(null)}
          onSaved={fetchBills}
        />
      )}
    </div>
  );
}
