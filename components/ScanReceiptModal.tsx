"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Calendar,
  DollarSign,
  Store,
  Tag,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency, EXPENSE_CATEGORIES } from "@/lib/formatters";
import { ReceiptScanResult } from "@/lib/types";

interface ScanReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessSave: (transactionData: any) => Promise<void>;
}

export default function ScanReceiptModal({
  isOpen,
  onClose,
  onSuccessSave,
}: ScanReceiptModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ReceiptScanResult | null>(null);
  const [error, setError] = useState<string>("");
  const [step, setStep] = useState<"upload" | "preview" | "saving">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Client-side mount guard for React Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset all state every time the modal is opened fresh
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setScanResult(null);
      setStep("upload");
      setError("");
      setEditMerchant("");
      setEditAmount("");
      setEditDate("");
      setEditCategory("Belanja Harian");
    }
  }, [isOpen]);

  // Editable fields in preview
  const [editMerchant, setEditMerchant] = useState("");
  const [editAmount, setEditAmount] = useState<number | string>("");
  const [editDate, setEditDate] = useState("");
  const [editCategory, setEditCategory] = useState("Belanja Harian");

  useEffect(() => {
    if (scanResult) {
      setEditMerchant(scanResult.merchant || "Merchant Struk");
      setEditAmount(scanResult.amount || 0);
      setEditDate(scanResult.transaction_date || new Date().toISOString().slice(0, 10));
      setEditCategory(scanResult.category || "Belanja Harian");
    }
  }, [scanResult]);

  if (!isOpen || !mounted) return null;

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Harap unggah file gambar (JPEG, PNG, WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB");
      return;
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setError("");
    setScanResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleStartScan = async () => {
    if (!selectedFile) return;
    setIsScanning(true);
    setError("");

    try {
      const base64 = await convertFileToBase64(selectedFile);
      const res = await api.scanReceipt(base64, selectedFile.type);
      setScanResult(res);
      setStep("preview");
    } catch (err: any) {
      setError(err.message || "Gagal melakukan scan AI pada struk");
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirmSave = async () => {
    if (!scanResult) return;
    setStep("saving");
    setError("");

    try {
      let receiptPath: string | null = null;

      // Upload file to Supabase Storage
      if (selectedFile) {
        try {
          const uploadRes = await api.uploadReceipt(selectedFile);
          receiptPath = uploadRes.receipt_path;
        } catch (uploadErr) {
          console.warn("Upload image failed, continuing transaction creation:", uploadErr);
        }
      }

      await onSuccessSave({
        merchant: editMerchant.trim() || scanResult.merchant || "Merchant AI",
        amount: Number(editAmount) || 0,
        category: editCategory || scanResult.category || "Belanja Harian",
        payment_method: "Cash",
        transaction_date: editDate || scanResult.transaction_date || new Date().toISOString().slice(0, 10),
        notes: `Tersimpan via AI Gemini OCR (Confidence: ${Math.round(
          (scanResult.confidence || 0.95) * 100
        )}%)`,
        items: scanResult.items || [],
        receipt_path: receiptPath,
      });

      // Notify dashboard and other views to refresh
      window.dispatchEvent(new CustomEvent("refresh-transactions"));
      resetAll();
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan hasil scan");
      setStep("preview");
    }
  };

  const resetAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setScanResult(null);
    setStep("upload");
    setError("");
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#e4ebe5] animate-fade-in my-auto overflow-hidden">
        {/* Modal Header (Fixed) */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0e3d25]">
                AI Receipt Scanner (Gemini)
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500">
                Pindai otomatis struk belanja dan catat ke transaksi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (min-h-0 prevents flexbox scroll cutoff) */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 flex-1 min-h-0">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === "upload" && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-5 sm:p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2.5 ${
                  selectedFile
                    ? "border-emerald-500 bg-emerald-50/50"
                    : "border-gray-200 hover:border-emerald-400 hover:bg-[#f8faf9]"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={previewUrl}
                      alt="Preview struk"
                      className="max-h-40 sm:max-h-48 rounded-xl object-contain shadow-xs border border-gray-100"
                    />
                    <p className="text-xs font-semibold text-emerald-800">
                      {selectedFile?.name} ({(selectedFile!.size / 1024).toFixed(0)} KB)
                    </p>
                    <p className="text-[11px] text-gray-400">Klik untuk mengganti foto struk</p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-gray-800">
                        Klik atau seret foto struk ke sini
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Mendukung format JPG, PNG, WebP (Maksimal 5MB)
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {step === "preview" && scanResult && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-emerald-950">
                      Struk Berhasil Dianalisis!
                    </p>
                    <p className="text-[10px] text-emerald-700">
                      Periksa dan sesuaikan data di bawah sebelum menyimpan
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                  {Math.round((scanResult.confidence || 0.95) * 100)}% Match
                </span>
              </div>

              <div className="space-y-3 bg-[#f8faf9] border border-[#e4ebe5] rounded-2xl p-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 flex items-center gap-1.5 mb-1">
                    <Store className="w-3.5 h-3.5 text-gray-400" />
                    <span>Nama Toko / Merchant</span>
                  </label>
                  <input
                    type="text"
                    value={editMerchant}
                    onChange={(e) => setEditMerchant(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-emerald-500 font-semibold text-gray-900"
                    placeholder="Contoh: Indomaret"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 flex items-center gap-1.5 mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                      <span>Total Belanja (Rp)</span>
                    </label>
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-emerald-500 font-black text-emerald-800"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-600 flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>Tanggal</span>
                    </label>
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-emerald-500 font-medium text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 flex items-center gap-1.5 mb-1">
                    <Tag className="w-3.5 h-3.5 text-gray-400" />
                    <span>Kategori Pengeluaran</span>
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-emerald-500 font-semibold text-emerald-900"
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {scanResult.items && scanResult.items.length > 0 && (
                <div className="border border-[#e4ebe5] rounded-2xl p-3.5">
                  <p className="text-[11px] font-bold text-gray-700 mb-2">
                    Rincian Item Belanja ({scanResult.items.length})
                  </p>
                  <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                    {scanResult.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-0"
                      >
                        <span className="text-gray-700 truncate max-w-[200px]">
                          {it.name} <span className="text-gray-400">x{it.qty}</span>
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(it.price * (it.qty || 1))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === "saving" && (
            <div className="py-10 flex flex-col items-center justify-center text-center gap-3 animate-fade-in">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
              <p className="text-sm font-bold text-gray-900">Menyimpan Transaksi...</p>
              <p className="text-xs text-gray-500 max-w-xs">
                Mengunggah foto struk dan memperbarui statistik pengeluaran Anda
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer (Fixed at Bottom, shrink-0, NEVER Cut Off) */}
        <div className="p-4 sm:p-5 border-t border-gray-100 shrink-0 bg-[#f8faf9] flex items-center gap-2.5">
          {step === "upload" && (
            <button
              type="button"
              onClick={handleStartScan}
              disabled={!selectedFile || isScanning}
              className="w-full py-3 px-4 bg-[#0e3d25] hover:bg-[#155333] text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Menganalisis Struk dengan AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Mulai Pindai AI</span>
                </>
              )}
            </button>
          )}

          {step === "preview" && (
            <>
              <button
                type="button"
                onClick={resetAll}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
              >
                Scan Ulang
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="flex-[2] py-2.5 px-4 rounded-xl bg-[#0e3d25] text-white text-xs font-bold hover:bg-[#155333] transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Simpan ke Transaksi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {step === "saving" && (
            <button
              disabled
              className="w-full py-2.5 px-4 rounded-xl bg-gray-200 text-gray-500 text-xs font-bold"
            >
              Sedang memproses...
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}