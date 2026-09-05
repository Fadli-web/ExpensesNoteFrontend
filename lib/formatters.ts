export const EXPENSE_CATEGORIES = [
  "Belanja Harian",
  "Transportasi",
  "Makanan & Minuman",
  "Tagihan & Utilitas",
  "Kesehatan",
  "Hiburan",
  "Pendidikan",
  "Belanja Online",
  "Lainnya"
] as const;

export const PAYMENT_METHODS = [
  "Cash",
  "Debit",
  "Transfer",
  "Credit Card",
  "E-Wallet",
  "QRIS",
  "Lainnya"
] as const;

export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return "Rp 0";
  }
  const numeric = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(numeric);
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getCategoryBadgeColor(category?: string): { bg: string; text: string; border: string } {
  switch (category) {
    case "Makanan & Minuman":
      return { bg: "bg-orange-50 text-orange-700", text: "text-orange-700", border: "border-orange-200" };
    case "Belanja Harian":
      return { bg: "bg-emerald-50 text-emerald-700", text: "text-emerald-700", border: "border-emerald-200" };
    case "Transportasi":
      return { bg: "bg-blue-50 text-blue-700", text: "text-blue-700", border: "border-blue-200" };
    case "Tagihan & Utilitas":
      return { bg: "bg-purple-50 text-purple-700", text: "text-purple-700", border: "border-purple-200" };
    case "Kesehatan":
      return { bg: "bg-rose-50 text-rose-700", text: "text-rose-700", border: "border-rose-200" };
    case "Hiburan":
      return { bg: "bg-pink-50 text-pink-700", text: "text-pink-700", border: "border-pink-200" };
    case "Pendidikan":
      return { bg: "bg-indigo-50 text-indigo-700", text: "text-indigo-700", border: "border-indigo-200" };
    case "Belanja Online":
      return { bg: "bg-cyan-50 text-cyan-700", text: "text-cyan-700", border: "border-cyan-200" };
    default:
      return { bg: "bg-slate-50 text-slate-700", text: "text-slate-700", border: "border-slate-200" };
  }
}
