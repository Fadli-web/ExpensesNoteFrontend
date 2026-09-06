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
      {/* Page Header — nor.ma split ink + paper style */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 mb-2">
        {/* Left: dark ink hero */}
        <div
          className="relative overflow-hidden rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[120px]"
          style={{ background: "#111111" }}
        >
          {/* Glow orbs */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-emerald-500/8 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/2 w-32 h-16 rounded-full bg-emerald-400/5 blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/8 text-emerald-400 text-[10px] font-semibold mb-3 border border-white/8">
              <Sparkles className="w-3 h-3" />
              <span>AI Expense Tracker</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
              Ringkasan Keuangan Anda
            </h2>
            <p className="text-[12px] text-white/35 mt-1.5 max-w-sm leading-relaxed">
              Semua transaksi tercatat otomatis. Gunakan Scan AI untuk mendeteksi struk dalam hitungan detik.
            </p>
          </div>
        </div>

        {/* Right: paper quick actions */}
        <div className="flex sm:flex-col gap-2 sm:gap-2 sm:justify-center">
          <button
            onClick={loadData}
            disabled={isLoading}
            title="Refresh Data"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[12px] font-semibold text-[#555] hover:text-[#111] hover:bg-black/8 transition"
            style={{ background: "#e8e8e6", border: "1px solid rgba(0,0,0,0.07)" }}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/transactions"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[12px] font-semibold text-white transition hover:opacity-90"
            style={{ background: "#111111" }}
          >
            <span>Semua Transaksi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
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
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="norma-card-white p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-[10px] font-semibold text-[#aaa] uppercase tracking-widest">
                  Riwayat Terbaru
                </span>
                <h3 className="text-[15px] font-semibold tracking-tight text-[#111] mt-0.5">Recent Transactions</h3>
              </div>
              <Link
                href="/transactions"
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#555] hover:text-[#111] transition"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-black/5 text-[#bbb] font-semibold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 pl-1">Merchant</th>
                    <th className="pb-3">Kategori</th>
                    <th className="pb-3">Tanggal</th>
                    <th className="pb-3">Metode</th>
                    <th className="pb-3 text-right">Jumlah</th>
                    <th className="pb-3 text-center">Struk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04]">
                  {recentTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-[#bbb] text-xs">
                        Belum ada transaksi. Mulai dengan Scan AI atau Tambah Manual.
                      </td>
                    </tr>
                  ) : (
                    recentTransactions.slice(0, 5).map((tx) => {
                      const badge = getCategoryBadgeColor(tx.category);
                      return (
                        <tr key={tx.id} className="hover:bg-black/[0.02] transition-colors">
                          <td className="py-3.5 pl-1">
                            <div className="font-semibold text-[#111]">{tx.merchant}</div>
                            {tx.notes && (
                              <div className="text-[11px] text-[#bbb] truncate max-w-[150px] mt-0.5">
                                {tx.notes}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg} ${badge.border}`}
                            >
                              {tx.category}
                            </span>
                          </td>
                          <td className="py-3.5 text-[#999] font-medium">
                            {formatDate(tx.transaction_date)}
                          </td>
                          <td className="py-3.5">
                            <span className="text-[#888] bg-black/5 px-2 py-0.5 rounded-lg text-[11px] font-medium">
                              {tx.payment_method || "Cash"}
                            </span>
                          </td>
                          <td className="py-3.5 text-right font-bold text-[#111]">
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
                                className="inline-flex items-center gap-1 text-emerald-600 font-semibold hover:underline"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span className="text-[11px]">Foto</span>
                              </button>
                            ) : (
                              <span className="text-[#ddd] text-[11px]">—</span>
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
