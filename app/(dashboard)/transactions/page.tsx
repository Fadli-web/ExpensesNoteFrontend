"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  Plus,
  Sparkles,
  Filter,
  Download,
  Trash2,
  Edit,
  Receipt,
  FileText,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  AlertTriangle,
  Eye,
} from "lucide-react";
import TransactionModal from "@/components/TransactionModal";
import ScanReceiptModal from "@/components/ScanReceiptModal";
import ReceiptLightbox from "@/components/ReceiptLightbox";
import { api } from "@/lib/api";
import {
  EXPENSE_CATEGORIES,
  PAYMENT_METHODS,
  formatCurrency,
  formatDate,
  getCategoryBadgeColor,
} from "@/lib/formatters";
import { Transaction } from "@/lib/types";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [lightboxReceipt, setLightboxReceipt] = useState<{ url: string; merchant: string; date: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.listTransactions({
        page: currentPage,
        limit,
        search: search.trim() || undefined,
        category: category || undefined,
        payment_method: paymentMethod || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });

      if (res && res.data) {
        setTransactions(res.data);
        setTotalItems(res.total || res.data.length);
      } else {
        setTransactions([]);
        setTotalItems(0);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactions([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, search, category, paymentMethod, startDate, endDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSaveTransaction = async (data: any) => {
    if (editingTransaction) {
      await api.updateTransaction(editingTransaction.id, data);
    } else {
      await api.createTransaction(data);
    }
    setEditingTransaction(null);
    fetchTransactions();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTransaction) return;
    try {
      await api.deleteTransaction(deletingTransaction.id);
      setDeletingTransaction(null);
      fetchTransactions();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus transaksi");
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setPaymentMethod("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / limit) || 1;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0e3d25] tracking-tight">
            Daftar Transaksi
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Kelola seluruh catatan belanja dan riwayat pengeluaran Anda
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsScanOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-xs hover:bg-emerald-200 transition shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Scan AI</span>
          </button>

          <button
            onClick={() => {
              setEditingTransaction(null);
              setIsCreateOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#0e3d25] text-white font-bold text-xs hover:bg-[#155333] transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Manual</span>
          </button>

          <a
            href="/export"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-[#e4ebe5] text-gray-700 font-bold text-xs hover:bg-[#f4f7f5] transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export</span>
          </a>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="expendnote-card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Search Merchant */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari toko / merchant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#f8faf9] border border-[#e4ebe5] rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-[#f8faf9] border border-[#e4ebe5] rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="">Semua Kategori</option>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 bg-[#f8faf9] border border-[#e4ebe5] rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="">Semua Metode</option>
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Dari"
              className="w-full px-3 py-2 bg-[#f8faf9] border border-[#e4ebe5] rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* End Date & Reset */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Sampai"
              className="w-full px-3 py-2 bg-[#f8faf9] border border-[#e4ebe5] rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            {(search || category || paymentMethod || startDate || endDate) && (
              <button
                onClick={handleClearFilters}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                title="Reset Filter"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Transactions Table */}
      <div className="expendnote-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8faf9] border-b border-[#e4ebe5] text-gray-500 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Merchant & Catatan</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Metode Bayar</th>
                <th className="py-3.5 px-4">Rincian Item</th>
                <th className="py-3.5 px-4 text-right">Jumlah (Rp)</th>
                <th className="py-3.5 px-4 text-center">Struk</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    <span>Memuat data transaksi...</span>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <p className="font-semibold text-gray-600">Belum ada transaksi</p>
                    <p className="text-[11px] mt-1">
                      Mulai catat dengan klik tombol &apos;Tambah Manual&apos; atau &apos;Scan AI&apos;
                    </p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const badge = getCategoryBadgeColor(tx.category);
                  return (
                    <tr key={tx.id} className="hover:bg-[#f8faf9] transition-colors">
                      {/* Merchant */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 text-sm">{tx.merchant}</div>
                        {tx.notes && (
                          <div className="text-[11px] text-gray-400 truncate max-w-[200px]">
                            {tx.notes}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.border}`}
                        >
                          {tx.category}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-gray-600 font-medium">
                        {formatDate(tx.transaction_date)}
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-4">
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
                          {tx.payment_method || "Cash"}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4 text-gray-500">
                        {tx.items && tx.items.length > 0 ? (
                          <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px]">
                            {tx.items.length} item
                          </span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right font-black text-[#0e3d25] text-sm">
                        -{formatCurrency(tx.amount)}
                      </td>

                      {/* Struk */}
                      <td className="py-3.5 px-4 text-center">
                        {tx.receipt_url ? (
                          <button
                            onClick={() =>
                              setLightboxReceipt({
                                url: tx.receipt_url!,
                                merchant: tx.merchant,
                                date: formatDate(tx.transaction_date),
                              })
                            }
                            className="inline-flex items-center gap-1 text-emerald-600 font-bold hover:underline"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Lihat</span>
                          </button>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingTransaction(tx);
                              setIsCreateOpen(true);
                            }}
                            className="p-1.5 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingTransaction(tx)}
                            className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#e4ebe5] bg-[#f8faf9] text-xs text-gray-500">
          <div>
            Menampilkan <span className="font-bold text-gray-800">{transactions.length}</span> dari{" "}
            <span className="font-bold text-gray-800">{totalItems}</span> transaksi
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-[#e4ebe5] bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-gray-800 px-1">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-[#e4ebe5] bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Modal (Add / Edit) */}
      <TransactionModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSaveTransaction}
        transaction={editingTransaction}
      />

      {/* AI Scan Receipt Modal */}
      <ScanReceiptModal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        onSuccessSave={handleSaveTransaction}
      />

      {/* Delete Confirmation Modal (Portal to document.body) */}
      {mounted && deletingTransaction && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-gray-100 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">Hapus Transaksi?</h4>
              <p className="text-xs text-gray-500 mt-1">
                Apakah Anda yakin ingin menghapus transaksi di{" "}
                <span className="font-bold text-gray-800">{deletingTransaction.merchant}</span>?
                File struk di Supabase Storage juga akan otomatis dihapus.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeletingTransaction(null)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Lightbox for receipt */}
      <ReceiptLightbox
        isOpen={!!lightboxReceipt}
        onClose={() => setLightboxReceipt(null)}
        imageUrl={lightboxReceipt?.url || null}
        merchant={lightboxReceipt?.merchant}
        date={lightboxReceipt?.date}
      />
    </div>
  );
}
