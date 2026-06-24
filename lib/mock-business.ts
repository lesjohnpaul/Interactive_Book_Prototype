/**
 * Deterministic mock business data for the CEO 360 dashboard.
 * Real reader/answer metrics come from lib/store.ts; everything
 * here (revenue, payments, invoices, demographics) is illustrative
 * for prototype demos and clearly labeled as mock in the UI.
 */

export const revenueByMonth = [
  { month: "Nov", revenue: 4200, signups: 96, books: 41 },
  { month: "Dec", revenue: 6800, signups: 148, books: 67 },
  { month: "Jan", revenue: 9400, signups: 205, books: 98 },
  { month: "Feb", revenue: 8600, signups: 183, books: 91 },
  { month: "Mar", revenue: 12100, signups: 261, books: 134 },
  { month: "Apr", revenue: 14750, signups: 312, books: 168 },
  { month: "May", revenue: 18300, signups: 389, books: 214 },
  { month: "Jun", revenue: 21480, signups: 446, books: 257 },
];

export const ageDemographics = [
  { band: "18–24", share: 14, key: "a" },
  { band: "25–34", share: 36, key: "b" },
  { band: "35–44", share: 27, key: "c" },
  { band: "45–54", share: 15, key: "d" },
  { band: "55+", share: 8, key: "e" },
];

export const countries = [
  { code: "PH", name: "Philippines", readers: 1262, share: 38 },
  { code: "US", name: "United States", readers: 731, share: 22 },
  { code: "SG", name: "Singapore", readers: 399, share: 12 },
  { code: "AU", name: "Australia", readers: 299, share: 9 },
  { code: "CA", name: "Canada", readers: 266, share: 8 },
  { code: "GB", name: "United Kingdom", readers: 199, share: 6 },
  { code: "—", name: "Other", readers: 166, share: 5 },
];

export type PaymentStatus = "paid" | "pending" | "refunded";

export const payments: {
  id: string;
  customer: string;
  email: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  date: string;
}[] = [
  { id: "PAY-1098", customer: "Mara Velasco", email: "mara@example.com", amount: 29, method: "Visa •• 4242", status: "paid", date: "Jun 10, 2026" },
  { id: "PAY-1097", customer: "Daniel Cho", email: "daniel.c@example.com", amount: 49, method: "GCash", status: "paid", date: "Jun 10, 2026" },
  { id: "PAY-1096", customer: "Amelia Hart", email: "amelia.h@example.com", amount: 29, method: "Mastercard •• 8310", status: "pending", date: "Jun 9, 2026" },
  { id: "PAY-1095", customer: "Tomas Reyes", email: "tomas@example.com", amount: 79, method: "PayPal", status: "paid", date: "Jun 9, 2026" },
  { id: "PAY-1094", customer: "Yuki Tanaka", email: "yuki.t@example.com", amount: 29, method: "Visa •• 9921", status: "refunded", date: "Jun 8, 2026" },
  { id: "PAY-1093", customer: "Liam O'Connor", email: "liam.oc@example.com", amount: 49, method: "Apple Pay", status: "paid", date: "Jun 8, 2026" },
  { id: "PAY-1092", customer: "Sofia Marin", email: "sofia.m@example.com", amount: 29, method: "Maya", status: "paid", date: "Jun 7, 2026" },
  { id: "PAY-1091", customer: "June Park", email: "june@example.com", amount: 79, method: "Visa •• 1187", status: "pending", date: "Jun 7, 2026" },
];

export type InvoiceStatus = "paid" | "due" | "overdue" | "draft";

export const invoices: {
  id: string;
  client: string;
  description: string;
  amount: number;
  due: string;
  status: InvoiceStatus;
}[] = [
  { id: "INV-2041", client: "Sunrise Schools Network", description: "Classroom storybook licenses ×120", amount: 3480, due: "Jun 30, 2026", status: "due" },
  { id: "INV-2040", client: "Brightleaf Counseling", description: "Therapist edition, annual plan", amount: 1188, due: "Jun 22, 2026", status: "paid" },
  { id: "INV-2039", client: "Castaño Publishing", description: "Print fulfillment, May batch", amount: 5320, due: "Jun 15, 2026", status: "overdue" },
  { id: "INV-2038", client: "Harbor Family Center", description: "Workshop bundle ×40", amount: 1160, due: "Jul 5, 2026", status: "draft" },
  { id: "INV-2037", client: "Northstar HR (Team offsite)", description: "Corporate self-discovery kits", amount: 2610, due: "Jun 12, 2026", status: "paid" },
];

export const funnel = [
  { stage: "Visited", value: 4820 },
  { stage: "Signed up", value: 1310 },
  { stage: "Started questions", value: 1085 },
  { stage: "Finished questions", value: 644 },
  { stage: "Book generated", value: 601 },
  { stage: "Printed / shared", value: 233 },
];

export const reports = [
  { name: "Monthly revenue summary", detail: "Stripe + invoicing, reconciled", updated: "Jun 9, 2026" },
  { name: "Reader engagement deep-dive", detail: "Completion, drop-off, voice usage", updated: "Jun 8, 2026" },
  { name: "Demographics & markets", detail: "Country, age band, acquisition", updated: "Jun 5, 2026" },
  { name: "Content quality audit", detail: "Answer length, chapter coverage", updated: "May 30, 2026" },
];
