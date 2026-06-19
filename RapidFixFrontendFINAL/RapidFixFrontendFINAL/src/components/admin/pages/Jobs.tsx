"use client";
import { useState, useEffect, useCallback } from "react";
import { C } from "@/lib/constants";
import { DataTable } from "../atoms/DataTable";
import { jobsApi } from "@/lib/api";
import type { Role, Job, JobStatus, Column } from "@/lib/types";
import { NewJobModal } from "../atoms/NewJobModal";
import { JobStatusBadge } from "../atoms/JobStatusBadge";
import { BillModal } from "../atoms/BillModal";

// ── Helpers ───────────────────────────────────────────────────────────────────

const Mono = ({ v }: { v: string }) => (
  <span style={{ fontFamily: "'Courier New',monospace", fontSize: 12 }}>
    {v}
  </span>
);
const Muted = ({ v }: { v: string }) => (
  <span style={{ color: C.textSec, fontSize: 12 }}>{v}</span>
);

// ── Mobile job card ─────────────────────────────────────────────────────────────

function JobCard({
  job,
  role,
  onChanged,
  onBill,
  billBusy,
}: {
  job: Job;
  role: Role;
  onChanged: () => void;
  onBill: (id: string) => void;
  billBusy: boolean;
}) {
  const billable = job.status === "ready" || job.status === "delivered";
  const model = `${job.vehicles?.make ?? ""} ${job.vehicles?.model ?? ""}`.trim();
  return (
    <div
      style={{
        padding: "12px 14px",
        borderBottom: `1px solid ${C.borderFaint}`,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontWeight: 600,
            fontSize: 14,
            color: C.text,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {job.customers?.name ?? "—"}
        </span>
        <JobStatusBadge
          jobId={job.id}
          current={job.status}
          onChanged={onChanged}
          readonly={role === "mechanic"}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
          fontSize: 12,
          color: C.textSec,
        }}
      >
        <span style={{ fontFamily: "'Courier New',monospace" }}>
          {job.vehicles?.registration ?? "—"}
        </span>
        <span>{model || "—"}</span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 12, color: C.textSec }}>
          <i className="ti ti-user" style={{ fontSize: 12, marginRight: 4 }} />
          {job.mechanic?.name ?? "Unassigned"}
        </span>
        {role === "owner" && billable ? (
          <button
            onClick={() => onBill(job.id)}
            disabled={billBusy}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 12px",
              fontSize: 12,
              border: `1px solid ${C.accent}`,
              background: C.accent + "12",
              borderRadius: 4,
              cursor: billBusy ? "wait" : "pointer",
              color: C.accent,
              fontFamily: "inherit",
              fontWeight: 600,
            }}
          >
            <i
              className={`ti ${billBusy ? "ti-loader-2 ti-spin" : "ti-receipt"}`}
              style={{ fontSize: 13 }}
            />
            {billBusy ? "…" : "Bill"}
          </button>
        ) : (
          <span style={{ fontSize: 11, color: C.textMuted }}>
            {new Date(job.updated_at).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Filters ───────────────────────────────────────────────────────────────────

const FILTERS = [
  "All",
  "Received",
  "Diagnosed",
  "In Progress",
  "Ready",
  "Delivered",
] as const;
type JobFilter = (typeof FILTERS)[number];

const FILTER_MAP: Partial<Record<JobFilter, JobStatus>> = {
  Received: "received",
  Diagnosed: "diagnosed",
  "In Progress": "in_progress",
  Ready: "ready",
  Delivered: "delivered",
};

// ── Component ─────────────────────────────────────────────────────────────────

export function Jobs({ role }: { role: Role }) {
  const [filter, setFilter] = useState<JobFilter>("All");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewJob, setShowNewJob] = useState(false);
  const [billModal, setBillModal] = useState<{
    jobId?: string;
    billId?: string;
  } | null>(null);
  const [resolvingBill, setResolvingBill] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const status = FILTER_MAP[filter];
      const res = await jobsApi.list({ status, limit: 50 });
      setJobs(res.data);
      setTotal(res.total);
    } catch (e: any) {
      setError(e?.error ?? "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Open the bill modal for a job — reuse an existing bill if one exists,
  // otherwise create a new one for this job.
  async function openBillForJob(jobId: string) {
    setResolvingBill(jobId);
    try {
      const detail = await jobsApi.get(jobId);
      if (detail.bill?.id) {
        setBillModal({ billId: detail.bill.id });
      } else {
        setBillModal({ jobId });
      }
    } catch {
      setBillModal({ jobId });
    } finally {
      setResolvingBill(null);
    }
  }

  // ── Columns (inside component so fetchJobs + role are in scope) ──────────────

  const cols: Column<Job>[] = [
    { key: "id", label: "Job ID", render: (r) => <Mono v={r.id} /> },
    {
      key: "customers",
      label: "Customer",
      render: (r) => <>{r.customers?.name ?? "—"}</>,
    },
    {
      key: "vehicle_reg",
      label: "Reg No.",
      render: (r) => <Mono v={r.vehicles?.registration ?? "—"} />,
    },
    {
      key: "vehicle_model",
      label: "Model",
      render: (r) => (
        <Muted v={`${r.vehicles?.make ?? ""} ${r.vehicles?.model ?? ""}`} />
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <JobStatusBadge
          jobId={r.id}
          current={r.status}
          onChanged={fetchJobs}
          readonly={role === "mechanic"}
        />
      ),
    },
    {
      key: "mechanic",
      label: "Mechanic",
      render: (r) => <>{r.mechanic?.name ?? "Unassigned"}</>,
    },
    {
      key: "updated_at",
      label: "Updated",
      render: (r) => <Muted v={new Date(r.updated_at).toLocaleDateString()} />,
    },
    ...(role === "owner"
      ? [
          {
            key: "bill",
            label: "Bill",
            render: (r: Job) => {
              const billable = r.status === "ready" || r.status === "delivered";
              if (!billable) return <span style={{ color: C.textMuted }}>—</span>;
              const busy = resolvingBill === r.id;
              return (
                <button
                  onClick={() => openBillForJob(r.id)}
                  disabled={busy}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 10px",
                    fontSize: 12,
                    border: `1px solid ${C.accent}`,
                    background: C.accent + "12",
                    borderRadius: 3,
                    cursor: busy ? "wait" : "pointer",
                    color: C.accent,
                    fontFamily: "inherit",
                    fontWeight: 600,
                  }}
                >
                  <i
                    className={`ti ${busy ? "ti-loader-2 ti-spin" : "ti-receipt"}`}
                    style={{ fontSize: 13 }}
                  />
                  {busy ? "…" : "Bill"}
                </button>
              );
            },
          },
        ]
      : []),
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
        {/* Filter tabs */}
        <div
          style={{
            display: "flex",
            background: "#f0f2f5",
            padding: 2,
            borderRadius: 4,
            overflow: "visible",
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

        {role === "owner" && (
          <>
            <button
              onClick={() => setShowNewJob(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                background: C.accent,
                color: "#fff",
                border: "none",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <i className="ti ti-plus" style={{ fontSize: 14 }} />
              New Job
            </button>

            {showNewJob && (
              <NewJobModal
                onClose={() => setShowNewJob(false)}
                onCreated={fetchJobs}
              />
            )}
          </>
        )}
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
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 12, color: C.textSec }}>
            {loading ? "Loading…" : `${total} job${total !== 1 ? "s" : ""}`}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {["Filter", "Export"].map((lbl) => (
              <button
                key={lbl}
                style={{
                  padding: "4px 10px",
                  fontSize: 12,
                  border: `1px solid ${C.border}`,
                  background: C.surface,
                  borderRadius: 3,
                  cursor: "pointer",
                  color: C.textSec,
                  fontFamily: "inherit",
                }}
              >
                {lbl}
              </button>
            ))}
          </div>
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
            Loading jobs…
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
              onClick={fetchJobs}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              retry
            </span>
          </div>
        ) : jobs.length > 0 ? (
          <>
            <div className="jobs-desktop">
              <DataTable columns={cols} rows={jobs} />
            </div>
            <div className="jobs-mobile">
              {jobs.map((j) => (
                <JobCard
                  key={j.id}
                  job={j}
                  role={role}
                  onChanged={fetchJobs}
                  onBill={openBillForJob}
                  billBusy={resolvingBill === j.id}
                />
              ))}
            </div>
          </>
        ) : (
          <div
            style={{
              padding: "40px 0",
              textAlign: "center",
              color: C.textSec,
            }}
          >
            No jobs matching this filter
          </div>
        )}
      </div>

      <style>{`
        .jobs-desktop { display: block; }
        .jobs-mobile { display: none; }
        @media (max-width: 640px) {
          .jobs-desktop { display: none; }
          .jobs-mobile { display: block; }
        }
      `}</style>

      {billModal && (
        <BillModal
          jobId={billModal.jobId}
          billId={billModal.billId}
          onClose={() => setBillModal(null)}
          onSaved={fetchJobs}
        />
      )}
    </div>
  );
}
