export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse {
  user: User;
  session?: AuthSession;
  message?: string;
}

export interface TransactionItem {
  name: string;
  qty: number;
  price: number;
}

export interface Transaction {
  id: string;
  user_id?: string;
  merchant: string;
  amount: number;
  category: string;
  payment_method: string;
  transaction_date: string;
  notes?: string;
  items?: TransactionItem[];
  receipt_path?: string | null;
  receipt_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface TransactionListResponse {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface DashboardSummary {
  total_this_month: number;
  total_last_month: number;
  percent_change_vs_last_month: number | null;
  average_daily_this_month: number;
  total_transactions?: number;
  top_merchants: Array<{
    merchant: string;
    total_amount: number;
    transaction_count: number;
  }>;
  category_breakdown: Array<{
    category: string;
    total_amount: number;
    percentage: number;
  }>;
  daily_trend: Array<{
    date: string;
    total_amount: number;
  }>;
}

export interface ReceiptScanResult {
  merchant?: string;
  amount?: number;
  transaction_date?: string;
  category?: string;
  items?: TransactionItem[];
  confidence?: number;
  raw_text?: string;
}

export interface ReceiptUploadResult {
  receipt_path: string;
  receipt_url: string;
}

export interface ReceiptGalleryItem {
  id: string;
  receipt_path: string;
  receipt_url: string;
  merchant?: string;
  amount?: number;
  category?: string;
  transaction_date?: string;
  created_at: string;
}

export interface ReceiptGalleryResponse {
  data: ReceiptGalleryItem[];
  total: number;
  page: number;
  limit: number;
}
