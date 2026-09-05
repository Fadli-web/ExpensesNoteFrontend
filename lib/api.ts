import {
  AuthResponse,
  DashboardSummary,
  ReceiptGalleryResponse,
  ReceiptScanResult,
  ReceiptUploadResult,
  Transaction,
  TransactionListResponse,
  UserProfile,
} from "./types";

const DEFAULT_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://expenses-project-backend.vercel.app";

export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("expenses_api_url");
    if (saved && saved.trim()) {
      // Auto-cleanup obsolete protected preview URL
      if (saved.includes("expenses-project-backend-git-main-fadli-webs-projects")) {
        localStorage.removeItem("expenses_api_url");
        return DEFAULT_API_URL;
      }
      return saved.trim();
    }
  }
  return DEFAULT_API_URL;
}

export function setCustomBaseUrl(url: string) {
  if (typeof window !== "undefined") {
    if (!url || url.trim() === "" || url.trim() === DEFAULT_API_URL) {
      localStorage.removeItem("expenses_api_url");
    } else {
      localStorage.setItem("expenses_api_url", url.trim());
    }
  }
}

export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("expenses_access_token");
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("expenses_refresh_token");
}

export function storeTokens(accessToken: string, refreshToken?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("expenses_access_token", accessToken);
  if (refreshToken) {
    localStorage.setItem("expenses_refresh_token", refreshToken);
  }
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("expenses_access_token");
  localStorage.removeItem("expenses_refresh_token");
  localStorage.removeItem("expenses_user");
  localStorage.removeItem("expenses_demo_mode");
}

export function isDemoMode(): boolean {
  return false;
}

export function setDemoMode(val: boolean) {
  if (typeof window === "undefined") return;
  localStorage.removeItem("expenses_demo_mode");
}

// Request helper with automatic Bearer token & refresh handling
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBaseUrl().replace(/\/$/, "");
  const url = `${baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const token = getStoredAccessToken();
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  // If body is not FormData, ensure Content-Type is json
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err: any) {
    console.warn("Network request error:", err);
    throw new Error(`Gagal terhubung ke backend (${baseUrl}). Periksa koneksi atau URL API.`);
  }

  // Check if response is HTML
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    const text = await res.text().catch(() => "");
    const lower = text.toLowerCase();
    if (
      lower.includes("vercel deployment") ||
      lower.includes("sso-api") ||
      lower.includes("log in with vercel")
    ) {
      throw new Error(
        "Backend mengembalikan halaman proteksi Vercel SSO. Harap matikan Deployment Protection di Vercel Dashboard."
      );
    }
    throw new Error(
      `Server backend mengembalikan error status ${res.status} (${res.statusText || "Internal Server Error"}).`
    );
  }

  // Handle 401 Unauthorized -> try refresh token
  if (res.status === 401 && !endpoint.includes("/api/auth/")) {
    const refreshToken = getStoredRefreshToken();
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${baseUrl}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          const newAccess = refreshData.session?.access_token;
          const newRefresh = refreshData.session?.refresh_token;

          if (newAccess) {
            storeTokens(newAccess, newRefresh);
            headers["Authorization"] = `Bearer ${newAccess}`;
            // Retry original request
            const retryRes = await fetch(url, {
              ...options,
              headers,
            });
            if (!retryRes.ok) {
              const errJson = await retryRes.json().catch(() => ({}));
              throw new Error(errJson.message || `Request failed with status ${retryRes.status}`);
            }
            return retryRes.json();
          }
        }
      } catch (refreshErr) {
        console.warn("Failed to auto-refresh token:", refreshErr);
      }
    }
    clearTokens();
    throw new Error("Sesi login Anda telah berakhir. Silakan login kembali.");
  }

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    const message =
      errJson.message ||
      errJson.error ||
      `Request error: ${res.status} ${res.statusText}`;
    throw new Error(message);
  }

  // Check if empty response (e.g. 204)
  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}

// ----------------------------------------------------------------------
// API Methods
// ----------------------------------------------------------------------

export const api = {
  // 🏥 Health
  async checkHealth(): Promise<{ status: string; database?: string }> {
    return apiRequest<{ status: string; database?: string }>("/api/health");
  },

  // 🔐 Auth
  async register(data: { email: string; password: string; full_name?: string }): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getMe(): Promise<{ user: UserProfile }> {
    return apiRequest<{ user: UserProfile }>("/api/auth/me");
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  },

  async logout(): Promise<{ message: string }> {
    try {
      const res = await apiRequest<{ message: string }>("/api/auth/logout", {
        method: "POST",
      });
      clearTokens();
      return res;
    } catch (e) {
      clearTokens();
      return { message: "Logged out" };
    }
  },

  // 👤 Profile
  async getProfile(): Promise<UserProfile> {
    return apiRequest<UserProfile>("/api/profile");
  },

  async updateProfile(data: { full_name?: string; email?: string }): Promise<UserProfile> {
    return apiRequest<UserProfile>("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async changePassword(data: { current_password: string; new_password: string }): Promise<{ message: string }> {
    return apiRequest<{ message: string }>("/api/profile/password", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    return apiRequest<{ avatar_url: string }>("/api/profile/avatar", {
      method: "POST",
      body: JSON.stringify({
        image_base64: base64,
        media_type: file.type || "image/jpeg",
      }),
    });
  },

  // 💸 Transactions
  async listTransactions(params?: {
    page?: number;
    limit?: number;
    start_date?: string;
    end_date?: string;
    category?: string;
    payment_method?: string;
    search?: string;
  }): Promise<TransactionListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    if (params?.start_date) query.set("start_date", params.start_date);
    if (params?.end_date) query.set("end_date", params.end_date);
    if (params?.category) query.set("category", params.category);
    if (params?.payment_method) query.set("payment_method", params.payment_method);
    if (params?.search) query.set("search", params.search);

    const qs = query.toString() ? `?${query.toString()}` : "";
    return apiRequest<TransactionListResponse>(`/api/transactions${qs}`);
  },

  async createTransaction(data: {
    merchant: string;
    amount: number;
    category: string;
    payment_method: string;
    transaction_date: string;
    notes?: string;
    items?: Array<{ name: string; qty: number; price: number }>;
    receipt_path?: string | null;
  }): Promise<Transaction> {
    return apiRequest<Transaction>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getTransactionDetail(id: string): Promise<Transaction> {
    return apiRequest<Transaction>(`/api/transactions/${id}`);
  },

  async updateTransaction(
    id: string,
    data: Partial<{
      merchant: string;
      amount: number;
      category: string;
      payment_method: string;
      transaction_date: string;
      notes: string;
      items: Array<{ name: string; qty: number; price: number }>;
      receipt_path?: string | null;
    }>
  ): Promise<Transaction> {
    return apiRequest<Transaction>(`/api/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteTransaction(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/api/transactions/${id}`, {
      method: "DELETE",
    });
  },

  // 🧾 Receipts
  async scanReceipt(imageBase64: string, mediaType = "image/jpeg"): Promise<ReceiptScanResult> {
    // 1. First attempt: call backend API endpoint
    try {
      const res = await apiRequest<any>("/api/receipts/scan", {
        method: "POST",
        body: JSON.stringify({
          image_base64: imageBase64,
          media_type: mediaType,
        }),
      });
      if (res && (res.merchant || res.data?.merchant || res.amount !== undefined || res.data?.amount !== undefined)) {
        return res.data ? { ...res.data, ...res } : res;
      }
    } catch (backendErr: any) {
      console.warn("Backend receipt scan failed or pending deploy, activating direct Gemini OCR fallback:", backendErr);
    }

    // 2. Direct Gemini OCR fallback if NEXT_PUBLIC_GEMINI_API_KEY is configured
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    if (!apiKey) {
      throw new Error("Gagal memindai struk melalui server. Pastikan backend aktif atau atur NEXT_PUBLIC_GEMINI_API_KEY.");
    }

    let cleanB64 = imageBase64;
    if (cleanB64.includes(",")) {
      cleanB64 = cleanB64.split(",")[1];
    }

    const systemPrompt = `Kamu adalah mesin OCR + kategorisasi struk belanja untuk aplikasi pencatat keuangan.
Baca gambar struk yang diberikan dan kembalikan HANYA satu objek JSON valid, tanpa teks lain, tanpa markdown code fence, dengan format persis:
{
  "merchant": string,
  "amount": number,
  "transaction_date": string,
  "category": string,
  "items": [ { "name": string, "qty": number, "price": number } ],
  "confidence": number
}
Kategori yang valid: Belanja Harian, Transportasi, Makanan & Minuman, Tagihan & Utilitas, Kesehatan, Hiburan, Pendidikan, Belanja Online, Lainnya. Format tanggal YYYY-MM-DD. Jika tidak yakin, isi null (items tetap array).`;

    const candidateModels = [
      "gemini-3.5-flash-lite",
      "gemini-3.6-flash",
      "gemini-2.5-flash",
      "gemini-flash-lite-latest",
    ];

    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: systemPrompt },
                  {
                    inline_data: {
                      mime_type: mediaType || "image/jpeg",
                      data: cleanB64,
                    },
                  },
                ],
              },
            ],
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData?.error?.message || `Gemini API model ${model} failed with status ${response.status}`);
        }

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const cleanJson = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleanJson);
        return {
          merchant: parsed.merchant || "Merchant Struk",
          amount: Number(parsed.amount) || 0,
          transaction_date: parsed.transaction_date || new Date().toISOString().slice(0, 10),
          category: parsed.category || "Belanja Harian",
          items: Array.isArray(parsed.items) ? parsed.items : [],
          confidence: Number(parsed.confidence) || 0.95,
          raw_text: text,
        };
      } catch (err: any) {
        lastError = err;
      }
    }

    throw lastError || new Error("Gagal menganalisis struk dengan Gemini AI.");
  },

  async uploadReceipt(file: File): Promise<ReceiptUploadResult> {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    return apiRequest<ReceiptUploadResult>("/api/receipts/upload", {
      method: "POST",
      body: JSON.stringify({
        image_base64: base64,
        media_type: file.type || "image/jpeg",
      }),
    });
  },

  async getReceiptGallery(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<ReceiptGalleryResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    if (params?.start_date) query.set("start_date", params.start_date);
    if (params?.end_date) query.set("end_date", params.end_date);

    const qs = query.toString() ? `?${query.toString()}` : "";
    return apiRequest<ReceiptGalleryResponse>(`/api/receipts/gallery${qs}`);
  },

  // 📊 Dashboard
  async getDashboardSummary(): Promise<DashboardSummary> {
    try {
      const [summary, txRes] = await Promise.all([
        apiRequest<DashboardSummary>("/api/dashboard/summary").catch(() => null),
        this.listTransactions({ limit: 100 }).catch(() => null),
      ]);

      const txs = txRes?.data || [];
      const totalAllTxs = txs.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      // If user has transactions recorded, use the comprehensive aggregate
      if (totalAllTxs > 0) {
        // Category breakdown
        const catMap: Record<string, number> = {};
        for (const t of txs) {
          const c = t.category || "Lainnya";
          catMap[c] = (catMap[c] || 0) + (Number(t.amount) || 0);
        }
        const categoryBreakdown = Object.entries(catMap)
          .map(([category, amount]) => ({
            category,
            total_amount: amount,
            percentage: Math.round((amount / (totalAllTxs || 1)) * 100),
          }))
          .sort((a, b) => b.total_amount - a.total_amount);

        // Daily trend (chronological)
        const dailyMap: Record<string, number> = {};
        for (const t of txs) {
          const d = t.transaction_date || t.created_at?.slice(0, 10) || "Hari Ini";
          dailyMap[d] = (dailyMap[d] || 0) + (Number(t.amount) || 0);
        }
        const dailyTrend = Object.entries(dailyMap)
          .map(([date, total_amount]) => ({
            date,
            total_amount,
          }))
          .sort((a, b) => (a.date < b.date ? -1 : 1));

        // Top merchants
        const mCount: Record<string, { total: number; count: number }> = {};
        for (const t of txs) {
          if (!t.merchant) continue;
          if (!mCount[t.merchant]) mCount[t.merchant] = { total: 0, count: 0 };
          mCount[t.merchant].total += Number(t.amount) || 0;
          mCount[t.merchant].count += 1;
        }
        const topMerchants = Object.entries(mCount)
          .map(([merchant, info]) => ({
            merchant,
            total_amount: info.total,
            transaction_count: info.count,
          }))
          .sort((a, b) => b.total_amount - a.total_amount)
          .slice(0, 5);

        // Standard 30-day daily run rate: Total / 30 days
        const avgDaily = Math.round(totalAllTxs / 30);

        return {
          total_this_month: totalAllTxs,
          total_last_month: summary?.total_last_month || 0,
          percent_change_vs_last_month: summary?.percent_change_vs_last_month || null,
          average_daily_this_month: avgDaily,
          total_transactions: txs.length,
          top_merchants: topMerchants,
          category_breakdown: categoryBreakdown,
          daily_trend: dailyTrend,
        };
      }

      if (summary) return summary;

      return {
        total_this_month: 0,
        total_last_month: 0,
        percent_change_vs_last_month: null,
        average_daily_this_month: 0,
        total_transactions: 0,
        top_merchants: [],
        category_breakdown: [],
        daily_trend: [],
      };
    } catch (e) {
      console.warn("Failed fetching backend dashboard summary:", e);
      return {
        total_this_month: 0,
        total_last_month: 0,
        percent_change_vs_last_month: null,
        average_daily_this_month: 0,
        top_merchants: [],
        category_breakdown: [],
        daily_trend: [],
      };
    }
  },

  // 📥 Export
  getExportCsvUrl(params: {
    period: "all" | "this_month" | "last_month" | "this_year" | "custom";
    start?: string;
    end?: string;
  }): string {
    const baseUrl = getBaseUrl().replace(/\/$/, "");
    const query = new URLSearchParams();
    query.set("period", params.period);
    if (params.period === "custom" && params.start && params.end) {
      query.set("start", params.start);
      query.set("end", params.end);
    }
    return `${baseUrl}/api/export/csv?${query.toString()}`;
  },

  async downloadExportCsv(params: {
    period: "all" | "this_month" | "last_month" | "this_year" | "custom";
    start?: string;
    end?: string;
  }): Promise<Blob> {
    const url = this.getExportCsvUrl(params);
    const token = getStoredAccessToken();
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      throw new Error(`Gagal mendownload CSV (${res.status} ${res.statusText})`);
    }

    return res.blob();
  },

  // 💡 AI Insights & Financial Advisor
  async getInsightsSummary(): Promise<{
    financial_health: string;
    health_score: number;
    summary: string;
    key_recommendations: string[];
    saving_potential: string;
    context?: any;
  }> {
    return apiRequest("/api/insights/summary");
  },

  async askInsights(
    question: string,
    history?: { role: "user" | "model"; text: string }[]
  ): Promise<{
    reply: string;
    is_financial: boolean;
  }> {
    return apiRequest("/api/insights/ask", {
      method: "POST",
      body: JSON.stringify({ question, history }),
    });
  },
};
