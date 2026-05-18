// ── Auth ──────────────────────────────────────────────────────────────────────

export type Role = "owner" | "mechanic";

export type Page =
  | "dashboard"
  | "jobs"
  | "bookings"
  | "bills"
  | "customers"
  | "leads"
  | "inbox"
  | "settings";

export interface StaffPayload {
  sub: string;
  name: string;
  role: Role;
  location_id: string;
  exp: number;
}

// ── Jobs ──────────────────────────────────────────────────────────────────────

export type JobStatus =
  | "received"
  | "diagnosed"
  | "in_progress"
  | "ready"
  | "delivered";

export interface JobVehicle {
  id: string;
  make: string | null;
  model: string | null;
  registration: string | null;
  type: string;
}

export interface JobCustomer {
  id: string;
  name: string;
  phone: string;
}

export interface NavItem {
  id: Page;
  label: string;
  icon: string;
  badge?: number;
  ownerOnly?: boolean;
}

export interface JobMechanic {
  id: string;
  name: string;
}

export interface Job {
  id: string;
  status: JobStatus;
  service_description: string | null;
  estimated_completion: string | null;
  odometer_in: number | null;
  created_at: string;
  updated_at: string;
  customers: JobCustomer | null;
  vehicles: JobVehicle | null;
  mechanic: JobMechanic | null;
}

export interface JobsResponse {
  data: Job[];
  total: number;
  page: number;
  limit: number;
}

export interface StatusHistoryEntry {
  id: string;
  status: JobStatus;
  note: string | null;
  wa_sent: boolean;
  created_at: string;
  staff: { name: string } | null;
}

export interface JobNote {
  id: string;
  note: string;
  created_at: string;
  staff: { name: string } | null;
}

export interface JobDetail extends Job {
  status_history: StatusHistoryEntry[];
  notes: JobNote[];
  bill: {
    id: string;
    status: string;
    total: number;
    amount_due: number;
  } | null;
}

// ── Bookings ──────────────────────────────────────────────────────────────────

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "arrived"
  | "cancelled"
  | "converted";
export type BookingSource = "online" | "whatsapp" | "phone" | "walkin";

export interface Booking {
  id: string;
  slot_at: string | null;
  status: BookingStatus;
  source: BookingSource;
  service_notes: string | null;
  confirmation_sent: boolean;
  created_at: string;
  updated_at: string | null;
  customers: { id: string; name: string; phone: string } | null;
  vehicles: {
    id: string;
    make: string | null;
    model: string | null;
    registration: string | null;
  } | null;
}

export interface BookingsResponse {
  data: Booking[];
  total: number;
  page: number;
  limit: number;
}

// ── Bills ─────────────────────────────────────────────────────────────────────

export type BillStatus = "draft" | "sent" | "paid" | "partial" | "unpaid";

// DB constraint: bill_items.category in ('labour','parts')
export type BillItemCategory = "labour" | "parts";

export interface BillItem {
  id: string;
  category: BillItemCategory;
  description: string;
  quantity: number;
  unit_price: number;
  total: number; // generated column (quantity * unit_price)
}

// Draft line used by the builder before the bill is saved
export interface BillItemDraft {
  category: BillItemCategory;
  description: string;
  quantity: number;
  unit_price: number;
}

export interface Bill {
  id: string;
  subtotal: number;
  discount: number;
  total: number;
  amount_paid: number;
  amount_due: number;
  status: BillStatus;
  sent_at: string | null;
  public_token: string;
  created_at: string;
  customers: { name: string; phone: string } | null;
  jobs: { id: string } | null;
}

// Full bill returned by GET /bills/:id (admin detail / builder)
export interface BillDetail {
  id: string;
  job_id: string;
  customer_id: string;
  subtotal: number;
  discount: number;
  total: number;
  amount_paid: number;
  amount_due: number;
  status: BillStatus;
  public_token: string;
  notes: string | null;
  delivery_method: "whatsapp" | "email" | "both" | null;
  sent_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  customers: { name: string; phone: string } | null;
  jobs: {
    id: string;
    service_description: string | null;
    vehicles: {
      make: string | null;
      model: string | null;
      registration: string | null;
      type: string | null;
    } | null;
  } | null;
  locations: { name: string; address: string | null; phone: string | null } | null;
  bill_items: BillItem[];
}

export interface BillsResponse {
  data: Bill[];
  total: number;
  page: number;
  limit: number;
}

// ── Customers ─────────────────────────────────────────────────────────────────

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  whatsapp_opt_in: boolean;
  created_at: string;
}

export interface CustomersResponse {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
}

// ── Leads ─────────────────────────────────────────────────────────────────────

export type LeadStatus = "new" | "follow_up" | "converted" | "spam";

export interface Lead {
  id: string;
  wa_id: string;
  customer_name: string | null;
  phone: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
  source: string | null;
  staff: { id: string; name: string } | null;
  customers: { id: string; name: string } | null;
}

export interface LeadsResponse {
  data: Lead[];
  total: number;
  page: number;
  limit: number;
}

// ── Messages ──────────────────────────────────────────────────────────────────

export type MessageDirection = "inbound" | "outbound";

export interface Message {
  id: string;
  direction: MessageDirection;
  body: string | null;
  media_url: string | null;
  status: string;
  wa_message_id: string | null;
  created_at: string;
  customer_id: string | null;
  lead_id: string | null;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export interface DashboardData {
  jobs: {
    received: number;
    diagnosed: number;
    in_progress: number;
    ready: number;
  };
  new_leads_today: number;
  revenue: {
    today: number;
    week: number;
    month: number;
  };
  recent_activity: Array<{
    id: string;
    status: JobStatus;
    note: string | null;
    wa_sent: boolean;
    created_at: string;
    staff: { name: string } | null;
    jobs: {
      id: string;
      customers: { name: string } | null;
      vehicles: {
        make: string | null;
        model: string | null;
        registration: string | null;
      } | null;
    } | null;
  }>;
}

// ── Shared ────────────────────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ApiError {
  error: string;
  status: number;
}

export interface Column<T> {
  key: keyof T | string;
  label: string;
  width?: string;
  render?: (row: T) => React.ReactNode;
}
