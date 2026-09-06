"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Trash2, Calendar, DollarSign, Tag, CreditCard, FileText, Camera, Upload, Check, RefreshCw } from "lucide-react";
import CameraCaptureModal from "@/components/CameraCaptureModal";
import { api } from "@/lib/api";
import { Transaction, TransactionItem } from "@/lib/types";
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from "@/lib/formatters";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  transaction?: Transaction | null;
  initialReceiptPath?: string | null;
}

export default function TransactionModal({
  isOpen,
  onClose,
  onSubmit,
  transaction,
  initialReceiptPath,
}: TransactionModalProps) {
  const [mounted, setMounted] = useState(false);
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState<number | string>("");
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHODS[0]);
  const [transactionDate, setTransactionDate] = useState("");
  const [notes, setNotes] = useState("");
  const [receiptPath, setReceiptPath] = useState<string | null>(null);
  const [items, setItems] = useState<TransactionItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAttachReceiptFile = async (file: File) => {
    try {
      setIsUploadingReceipt(true);
      setError("");
      const res = await api.uploadReceipt(file);
      setReceiptPath(res.receipt_path);
    } catch (err: any) {
      setError(err.message || "Gagal mengunggah foto struk");
    } finally {
      setIsUploadingReceipt(false);
    }
  };

  // Client-side mount check for React Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (transaction) {
      setMerchant(transaction.merchant || "");
      setAmount(transaction.amount || "");
      setCategory(transaction.category || EXPENSE_CATEGORIES[0]);
      setPaymentMethod(transaction.payment_method || PAYMENT_METHODS[0]);
      setTransactionDate(
        transaction.transaction_date
          ? transaction.transaction_date.slice(0, 10)
          : new Date().toISOString().slice(0, 10)
      );
      setNotes(transaction.notes || "");
      setReceiptPath(transaction.receipt_path || null);
      setItems(transaction.items || []);
    } else {
      setMerchant("");
      setAmount("");
      setCategory(EXPENSE_CATEGORIES[0]);
      setPaymentMethod(PAYMENT_METHODS[0]);
      setTransactionDate(new Date().toISOString().slice(0, 10));
      setNotes("");
      setReceiptPath(initialReceiptPath || null);
      setItems([]);
    }
    setError("");
  }, [transaction, initialReceiptPath, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleAddItem = () => {
    setItems([...items, { name: "", qty: 1, price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleItemChange = (index: number, field: keyof TransactionItem, val: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    setItems(updated);

    // Auto update total amount if items exist
    const total = updated.reduce((sum, it) => sum + (Number(it.qty) || 0) * (Number(it.price) || 0), 0);
    if (total > 0) {
      setAmount(total);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant.trim()) {
      setError("Nama toko/merchant wajib diisi");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Jumlah pengeluaran harus lebih dari 0");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit({
        merchant: merchant.trim(),
        amount: Number(amount),
        category,
        payment_method: paymentMethod,
        transaction_date: transactionDate,
        notes: notes.trim(),
        items: items.filter((i) => i.name.trim() !== ""),
        receipt_path: receiptPath,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan transaksi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#e4ebe5] animate-fade-in my-auto overflow-hidden">
        {/* Modal Header (Fixed) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0 bg-white">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0e3d25]">
              {transaction ? "Edit Transaksi" : "Tambah Transaksi Baru"}
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-500">
              Isi rincian pengeluaran Anda dengan lengkap dan rapi
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form with min-h-0 to prevent flexbox overflow */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable form body */}
          <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1 min-h-0">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* Merchant & Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Nama Toko / Merchant <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Indomaret, SPBU"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-[#e4ebe5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Jumlah Pengeluaran (Rp) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                    Rp
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="50000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#f8faf9] border border-[#e4ebe5] rounded-xl text-sm font-bold text-[#0e3d25] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Category & Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Kategori
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-[#e4ebe5] rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none pr-8 text-emerald-950"
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <Tag className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Metode Pembayaran
                </label>
                <div className="relative">
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-[#e4ebe5] rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none pr-8 text-emerald-950"
                  >
                    {PAYMENT_METHODS.map((pm) => (
                      <option key={pm} value={pm}>
                        {pm}
                      </option>
                    ))}
                  </select>
                  <CreditCard className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Date & Receipt Path info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Tanggal Transaksi <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-[#e4ebe5] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Lampiran Foto Struk
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => e.target.files?.[0] && handleAttachReceiptFile(e.target.files[0])}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  {receiptPath ? (
                    <div className="flex-1 flex items-center justify-between px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
                      <span className="flex items-center gap-1.5 truncate">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Struk Terlampir</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setReceiptPath(null)}
                        className="text-[11px] text-rose-600 hover:underline ml-2 font-medium cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  ) : isUploadingReceipt ? (
                    <div className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500 flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                      <span>Mengunggah struk...</span>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCameraOpen(true)}
                        className="flex-1 py-2 px-2.5 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-900 rounded-xl text-[11px] font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Foto HP</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 py-2 px-2.5 bg-[#f8faf9] border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl text-[11px] font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-gray-500" />
                        <span>Pilih File</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Catatan / Deskripsi Tambahan
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Belanja bulanan bersama keluarga"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#f8faf9] border border-[#e4ebe5] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Items Breakdown (Optional) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">
                  Rincian Item Belanja (Opsional)
                </span>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Item</span>
                </button>
              </div>

              {items.length > 0 ? (
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Nama Item"
                        value={it.name}
                        onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-[#f8faf9] border border-[#e4ebe5] rounded-lg text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        min="1"
                        value={it.qty}
                        onChange={(e) => handleItemChange(idx, "qty", Number(e.target.value))}
                        className="w-16 px-2 py-1.5 bg-[#f8faf9] border border-[#e4ebe5] rounded-lg text-xs text-center"
                      />
                      <input
                        type="number"
                        placeholder="Harga"
                        min="0"
                        value={it.price}
                        onChange={(e) => handleItemChange(idx, "price", Number(e.target.value))}
                        className="w-24 px-2 py-1.5 bg-[#f8faf9] border border-[#e4ebe5] rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-gray-400 italic">
                  Opsional: Klik &apos;Tambah Item&apos; jika ingin merinci tiap produk pada struk.
                </p>
              )}
            </div>
          </div>

          {/* Modal Footer Actions (Fixed at Bottom, shrink-0, NEVER Cut Off) */}
          <div className="shrink-0 px-6 py-4 border-t border-gray-100 bg-[#f8faf9] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-gray-600 hover:bg-gray-200 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-[#0e3d25] text-white hover:bg-[#155333] transition disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? "Menyimpan..." : transaction ? "Simpan Perubahan" : "Buat Transaksi"}
            </button>
          </div>
        </form>
      </div>

      {/* Camera Capture Modal for Transaction form */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(file) => handleAttachReceiptFile(file)}
        onSwitchToUpload={() => fileInputRef.current?.click()}
      />
    </div>,
    document.body
  );
}
