"use client";

import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  Download,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Transaction } from "@/lib/types";

export default function ExportPage() {
  const [activePeriod, setActivePeriod] = useState<
    "all" | "this_month" | "last_month" | "this_year" | "custom"
  >("all");
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [error, setError] = useState("");

  // Live transactions preview
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingPreview, setIsLoadingPreview] = useState(true);

  useEffect(() => {
    async function loadPreview() {
      try {
        const res = await api.listTransactions({ limit: 100 });
        if (res && res.data) {
          setTransactions(res.data);
        }
      } catch (err) {
        console.warn("Failed fetching preview transactions:", err);
      } finally {
        setIsLoadingPreview(false);
      }
    }
    loadPreview();
  }, []);

  const handleExport = async (
    periodType?: "all" | "this_month" | "last_month" | "this_year" | "custom"
  ) => {
    const selected = periodType || activePeriod;
    setIsDownloading(true);
    setError("");
    setDownloadSuccess(false);

    try {
      if (selected === "custom" && (!startDate || !endDate)) {
        throw new Error("Tanggal awal dan akhir wajib diisi untuk rentang kustom");
      }

      const blob = await api.downloadExportCsv({
        period: selected,
        start: selected === "custom" ? startDate : undefined,
        end: selected === "custom" ? endDate : undefined,
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `expendnote-transaksi-${selected}-${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
    } catch (err: any) {
      setError(err.message || "Gagal mengunduh file CSV");
    } finally {
      setIsDownloading(false);
    }
  };

  const options = [
    {
      id: "all" as const,
      title: "Semua Transaksi",
      desc: "Unduh seluruh riwayat transaksi dan struk belanja Anda (Direkomendasikan)",
      badge: "Paling Lengkap",
      icon: Layers,
    },
    {
      id: "this_month" as const,
      title: "Bulan Ini",
      desc: "Semua transaksi dan struk yang tercatat pada bulan berjalan",
      badge: "Bulan Berjalan",
      icon: Clock,
    },
    {
      id: "last_month" as const,
      title: "Bulan Lalu",
      desc: "Rekap transaksi lengkap untuk pembukuan bulan sebelumnya",
      badge: "Arsip",
      icon: Calendar,
    },
    {
      id: "this_year" as const,
      title: "Tahun Ini",
      desc: "Laporan fiskal pengeluaran tahun berjalan siap audit",
      badge: "Tahunan",
      icon: FileSpreadsheet,
    },
    {
      id: "custom" as const,
      title: "Rentang Kustom",
      desc: "Pilih tanggal awal dan akhir sesuai kebutuhan spesifik Anda",
      badge: "Kustom",
      icon: Calendar,
    },
  ];

  const totalAmount = transactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-12">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
          DATA PORTABILITY
        </span>
        <h2 className="text-2xl font-bold text-[#111111] tracking-tight">
          Export Data Transaksi ke CSV
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Unduh rekapan pengeluaran Anda dalam format CSV UTF-8 yang kompatibel langsung dengan WPS Office, Microsoft Excel, Google Sheets, & Numbers.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {downloadSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">File CSV Berhasil Diunduh!</p>
            <p className="text-[11px] text-emerald-700">
              Buka berkas di WPS Office atau Excel untuk melihat seluruh kolom data transaksi Anda.
            </p>
          </div>
        </div>
      )}

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map((opt) => {
          const isSelected = activePeriod === opt.id;
          const Icon = opt.icon;

          return (
            <div
              key={opt.id}
              onClick={() => setActivePeriod(opt.id)}
              className={`p-5 rounded-[24px] cursor-pointer flex flex-col justify-between transition-all duration-200 bg-white ${
                isSelected
                  ? "border-2 border-[#111111] shadow-sm bg-[#fafaf8]"
                  : "border border-black/[0.06] hover:border-black/20"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-[#111111] text-white"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {opt.badge}
                  </span>
                  <div className="p-2 rounded-xl bg-neutral-100 text-neutral-800">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-bold text-sm text-[#111111] mb-1">{opt.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{opt.desc}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-black/[0.04] flex items-center justify-between">
                <span className="text-[11px] font-medium text-neutral-600">
                  {isSelected ? "Pilihan Aktif" : "Pilih Periode Ini"}
                </span>
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? "border-[#111111] bg-[#111111] text-white"
                      : "border-neutral-300"
                  }`}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Range Picker (Visible only when 'custom' selected) */}
      {activePeriod === "custom" && (
        <div className="p-6 rounded-[28px] bg-white border-2 border-[#111111] animate-fade-in space-y-4 shadow-sm">
          <h4 className="text-sm font-bold text-[#111111] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neutral-700" />
            <span>Tentukan Rentang Tanggal Kustom</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Dari Tanggal (Start Date)
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f4f4f2] border-none rounded-xl text-xs text-[#111111] focus:outline-none focus:bg-white focus:ring-1 focus:ring-black/20"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Sampai Tanggal (End Date)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f4f4f2] border-none rounded-xl text-xs text-[#111111] focus:outline-none focus:bg-white focus:ring-1 focus:ring-black/20"
              />
            </div>
          </div>
        </div>
      )}

      {/* Live Data Preview Banner */}
      <div className="p-5 rounded-[28px] bg-white border border-black/[0.06] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold text-[#111111]">
              Pratinjau Data yang Siap Diekspor
            </h4>
          </div>
          <span className="text-xs font-bold text-[#111111]">
            {isLoadingPreview ? "Memuat..." : `${transactions.length} Transaksi (${formatCurrency(totalAmount)})`}
          </span>
        </div>

        {transactions.length > 0 && (
          <div className="max-h-40 overflow-y-auto divide-y divide-black/[0.04] text-xs bg-[#fafaf8] rounded-2xl border border-black/[0.04]">
            {transactions.slice(0, 5).map((t) => (
              <div key={t.id} className="p-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-neutral-900">{t.merchant}</span>
                  <span className="text-neutral-400 text-[11px] ml-2">({t.category})</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#111111]">{formatCurrency(t.amount)}</span>
                  <span className="text-neutral-400 text-[10px] block">{t.transaction_date || "-"}</span>
                </div>
              </div>
            ))}
            {transactions.length > 5 && (
              <div className="p-2 text-center text-[11px] text-neutral-400 font-medium bg-[#f4f4f2]">
                + {transactions.length - 5} transaksi lainnya akan disertakan dalam file CSV
              </div>
            )}
          </div>
        )}
      </div>

      {/* Download CTA Button */}
      <div className="p-6 rounded-[28px] bg-white border border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#111111]">Siap Mengunduh Data</h4>
            <p className="text-xs text-neutral-400">
              Format CSV standar UTF-8 lengkap dengan nama toko, kategori, nominal, metode pembayaran, dan tanggal
            </p>
          </div>
        </div>

        <button
          onClick={() => handleExport()}
          disabled={isDownloading || transactions.length === 0}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#111111] hover:bg-black text-white font-medium text-xs transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 shrink-0 cursor-pointer"
        >
          {isDownloading ? (
            <span>Menyiapkan File...</span>
          ) : (
            <>
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download CSV Sekarang</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
