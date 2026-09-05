"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Clock,
  ShieldCheck,
} from "lucide-react";
import DashboardStatCards from "@/components/DashboardStatCards";
import CashflowChart from "@/components/CashflowChart";
import CategoryDonutChart from "@/components/CategoryDonutChart";
import TopMerchantsCard from "@/components/TopMerchantsCard";
import DigitalCard from "@/components/DigitalCard";
import ReceiptLightbox from "@/components/ReceiptLightbox";
import { api } from "@/lib/api";
import { formatCurrency, formatDate, getCategoryBadgeColor } from "@/lib/formatters";
import { DashboardSummary, Transaction } from "@/lib/types";
const EMPTY_SUMMARY: DashboardSummary = {
  total_this_month: 0,
  total_last_month: 0,
  percent_change_vs_last_month: null,
  average_daily_this_month: 0,
  top_merchants: [],
  category_breakdown: [],
  daily_trend: [],
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>(EMPTY_SUMMARY);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<{ url: string; merchant: string; date: string } | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch summary & recent transactions concurrently from real backend
      const [sumRes, txRes] = await Promise.allSettled([
        api.getDashboardSummary(),
        api.listTransactions({ limit: 6 }),
      ]);

      if (sumRes.status === "fulfilled" && sumRes.value) {
        setSummary(sumRes.value);
      } else {
        setSummary(EMPTY_SUMMARY);
      }

      if (txRes.status === "fulfilled" && txRes.value?.data) {
        setRecentTransactions(txRes.value.data);
      } else {
        setRecentTransactions([]);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setSummary(EMPTY_SUMMARY);
      setRecentTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    const handleRefresh = () => loadData();
    window.addEventListener("refresh-transactions", handleRefresh);
    return () => window.removeEventListener("refresh-transactions", handleRefresh);
  }, [loadData]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 via-[#0e3d25] to-[#14532d] text-white p-6 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>AI Smart Expense Tracker</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Ringkasan Keuangan Anda
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl">
            Semua transaksi tercatat secara otomatis. Gunakan scan AI untuk mendeteksi struk belanjaan dalam hitungan detik.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 transition text-white"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/transactions"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-[#0e3d25] font-bold text-xs hover:bg-emerald-50 transition shadow-sm"
          >
            <span>Semua Transaksi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Decorative background blur */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Stat Cards */}
      <DashboardStatCards
        totalThisMonth={summary.total_this_month}
        totalLastMonth={summary.total_last_month}
        percentChange={summary.percent_change_vs_last_month ?? undefined}
        dailyAverage={summary.average_daily_this_month}
        totalTransactions={summary.total_transactions || recentTransactions.length}
      />

      {/* Charts Section: Cashflow Chart & Expense Breakdown Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Tren Pengeluaran Harian */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          <CashflowChart
            data={summary.daily_trend}
            totalBalance={summary.total_this_month}
          />
        </div>

        {/* Right: Expense Breakdown Donut Chart (Prominent & Balanced) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
          <CategoryDonutChart
            data={summary.category_breakdown}
            totalAmount={summary.total_this_month}
          />
        </div>
      </div>

      {/* Tables & Secondary Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Recent Transactions Table */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="expendnote-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Riwayat Terbaru
                </span>
                <h3 className="text-base font-bold text-[#0e3d25]">Recent Transactions</h3>
              </div>
              <Link
                href="/transactions"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 pl-1">Merchant</th>
                    <th className="pb-3">Kategori</th>
                    <th className="pb-3">Tanggal</th>
                    <th className="pb-3">Metode</th>
                    <th className="pb-3 text-right">Jumlah</th>
                    <th className="pb-3 text-center">Struk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400 text-xs">
                        Belum ada transaksi tercatat. Mulai dengan Scan AI atau Tambah Manual.
                      </td>
                    </tr>
                  ) : (
                    recentTransactions.slice(0, 5).map((tx) => {
                      const badge = getCategoryBadgeColor(tx.category);
                      return (
                        <tr key={tx.id} className="hover:bg-[#f8faf9] transition-colors">
                          <td className="py-3.5 pl-1">
                            <div className="font-bold text-gray-900">{tx.merchant}</div>
                            {tx.notes && (
                              <div className="text-[11px] text-gray-400 truncate max-w-[150px]">
                                {tx.notes}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.border}`}
                            >
                              {tx.category}
                            </span>
                          </td>
                          <td className="py-3.5 text-gray-500 font-medium">
                            {formatDate(tx.transaction_date)}
                          </td>
                          <td className="py-3.5">
                            <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md text-[11px] font-medium">
                              {tx.payment_method || "Cash"}
                            </span>
                          </td>
                          <td className="py-3.5 text-right font-black text-[#0e3d25]">
                            -{formatCurrency(tx.amount)}
                          </td>
                          <td className="py-3.5 text-center">
                            {tx.receipt_url ? (
                              <button
                                onClick={() =>
                                  setSelectedReceipt({
                                    url: tx.receipt_url!,
                                    merchant: tx.merchant,
                                    date: formatDate(tx.transaction_date),
                                  })
                                }
                                className="inline-flex items-center gap-1 text-emerald-600 font-bold hover:underline"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-[11px]">Foto</span>
                              </button>
                            ) : (
                              <span className="text-gray-300 text-[11px]">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Digital Card + Top Merchants */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Forest Green Card & Quick Buttons */}
          <DigitalCard
            balance={summary.total_this_month}
            onQuickAction={(action) => {
              if (action === "scan") {
                const btn = document.querySelector("header button") as HTMLButtonElement;
                btn?.click();
              } else if (action === "add") {
                window.location.href = "/transactions";
              } else if (action === "export") {
                window.location.href = "/export";
              } else {
                window.location.href = "/transactions";
              }
            }}
          />

          {/* Top 5 Merchants */}
          <TopMerchantsCard merchants={summary.top_merchants} />
        </div>
      </div>

      {/* Lightbox for receipt viewing */}
      <ReceiptLightbox
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        imageUrl={selectedReceipt?.url || null}
        merchant={selectedReceipt?.merchant}
        date={selectedReceipt?.date}
      />
    </div>
  );
}
