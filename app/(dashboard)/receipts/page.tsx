"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Upload,
  Search,
  Sparkles,
  RefreshCw,
  Eye,
  Calendar,
  Tag,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import ScanReceiptModal from "@/components/ScanReceiptModal";
import TransactionModal from "@/components/TransactionModal";
import ReceiptLightbox from "@/components/ReceiptLightbox";
import { api } from "@/lib/api";
import { EXPENSE_CATEGORIES, formatCurrency, formatDate, getCategoryBadgeColor } from "@/lib/formatters";
import { ReceiptGalleryItem } from "@/lib/types";

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<ReceiptGalleryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedReceiptPath, setSelectedReceiptPath] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ url: string; merchant?: string; date?: string } | null>(null);

  const fetchGallery = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.getReceiptGallery({
        page,
        limit,
        search: search.trim() || undefined,
        category: category || undefined,
      });

      if (res && res.data) {
        setReceipts(res.data);
        setTotal(res.total || res.data.length);
      } else {
        setReceipts([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Error loading receipt gallery:", err);
      setReceipts([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, category]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const handleUploadDirect = async (file: File) => {
    try {
      setIsLoading(true);
      await api.uploadReceipt(file);
      fetchGallery();
    } catch (err: any) {
      alert(err.message || "Gagal mengunggah foto struk");
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-[11px] font-medium border border-emerald-500/20 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Digital Receipt Vault</span>
          </div>
          <h2 className="text-2xl font-bold text-[#111111] tracking-tight">
            Galeri Struk Tersimpan
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Arsip digital semua bukti pembayaran dan struk belanja dengan signed URL aman
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsScanOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111111] text-white font-medium text-xs hover:bg-black transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pindai Struk (AI)</span>
          </button>
        </div>
      </div>

      {/* Filter & Upload Toolbar */}
      <div className="bg-white rounded-[24px] border border-black/[0.06] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-1 items-center gap-3 w-full">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari struk merchant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#f4f4f2] border-none rounded-xl text-xs text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-black/20 transition"
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-48">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-[#f4f4f2] border-none rounded-xl text-xs text-[#111111] focus:outline-none focus:bg-white focus:ring-1 focus:ring-black/20 transition"
            >
              <option value="">Semua Kategori</option>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Direct Upload input */}
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-black/[0.08] rounded-full text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition shrink-0 shadow-xs">
          <Upload className="w-3.5 h-3.5 text-neutral-500" />
          <span>Unggah File Struk</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => e.target.files?.[0] && handleUploadDirect(e.target.files[0])}
            className="hidden"
          />
        </label>
      </div>

      {/* Receipts Grid */}
      {isLoading ? (
        <div className="bg-white rounded-[28px] border border-black/[0.06] p-16 text-center text-neutral-400 shadow-xs">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-[#111111]" />
          <p className="font-medium text-neutral-600">Memuat berkas struk...</p>
        </div>
      ) : receipts.length === 0 ? (
        <div className="bg-white rounded-[28px] border border-black/[0.06] p-16 text-center text-neutral-400 shadow-xs">
          <Upload className="w-10 h-10 mx-auto mb-3 text-neutral-300" />
          <h4 className="text-base font-bold text-neutral-800">Belum Ada Struk Tersimpan</h4>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            Unggah foto struk belanjaan Anda atau gunakan fitur AI Scan untuk pengenalan otomatis.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {receipts.map((rec) => {
            const badge = getCategoryBadgeColor(rec.category);
            return (
              <div
                key={rec.id}
                className="bg-white rounded-[24px] border border-black/[0.06] overflow-hidden group flex flex-col justify-between hover:-translate-y-1 transition-all duration-200 shadow-xs"
              >
                {/* Image Container with Zoom overlay */}
                <div
                  onClick={() =>
                    setLightbox({
                      url: rec.receipt_url,
                      merchant: rec.merchant,
                      date: formatDate(rec.transaction_date || rec.created_at),
                    })
                  }
                  className="relative h-48 bg-gray-100 cursor-pointer overflow-hidden flex items-center justify-center"
                >
                  <img
                    src={rec.receipt_url}
                    alt={rec.merchant || "Receipt"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="p-2 rounded-full bg-white/90 text-gray-800 text-xs font-bold shadow-md flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>Perbesar</span>
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-bold text-gray-900 text-sm truncate">
                        {rec.merchant || "Toko / Merchant"}
                      </h4>
                      {rec.amount && (
                        <span className="font-black text-[#0e3d25] text-xs">
                          {formatCurrency(rec.amount)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{formatDate(rec.transaction_date || rec.created_at)}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    {rec.category ? (
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.border}`}
                      >
                        {rec.category}
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400">Vault Archive</span>
                    )}

                    <button
                      onClick={() => {
                        setSelectedReceiptPath(rec.receipt_path);
                        setIsCreateOpen(true);
                      }}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5"
                      title="Catat Transaksi dari struk ini"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Catat</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 expendnote-card text-xs text-gray-500">
        <span>
          Total <span className="font-bold text-gray-800">{total}</span> berkas struk
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1}
            className="p-1.5 rounded-lg border border-[#e4ebe5] bg-white text-gray-600 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-gray-800 px-1">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg border border-[#e4ebe5] bg-white text-gray-600 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scan Modal */}
      <ScanReceiptModal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        onSuccessSave={async (data) => {
          await api.createTransaction(data);
          fetchGallery();
        }}
      />

      {/* Create Transaction with attached receipt */}
      <TransactionModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setSelectedReceiptPath(null);
        }}
        onSubmit={async (data) => {
          await api.createTransaction(data);
          fetchGallery();
        }}
        initialReceiptPath={selectedReceiptPath}
      />

      {/* Lightbox */}
      <ReceiptLightbox
        isOpen={!!lightbox}
        onClose={() => setLightbox(null)}
        imageUrl={lightbox?.url || null}
        merchant={lightbox?.merchant}
        date={lightbox?.date}
      />
    </div>
  );
}
