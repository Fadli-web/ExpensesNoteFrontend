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
  Camera,
  Smartphone,
  Image as ImageIcon,
} from "lucide-react";
import CameraCaptureModal from "@/components/CameraCaptureModal";
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
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Editable fields in preview
  const [editMerchant, setEditMerchant] = useState("");
  const [editAmount, setEditAmount] = useState<number | string>("");
  const [editDate, setEditDate] = useState("");
  const [editCategory, setEditCategory] = useState("Belanja Harian");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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
              {/* Hidden Inputs */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />
              <input
                type="file"
                ref={cameraInputRef}
                capture="environment"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                accept="image/*"
                className="hidden"
              />

              {!previewUrl ? (
                /* Two Prominent Flexible Choice Cards */
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-neutral-600 mb-2">
                    Pilih metode input foto struk belanja:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Option 1: Phone Camera / Live Scan */}
                    <div className="relative group p-5 rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/40 hover:bg-emerald-50/80 hover:border-emerald-500 transition-all flex flex-col justify-between text-left shadow-xs">
                      <div className="space-y-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                          <Camera className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900 text-[10px] font-bold mb-1">
                            Rekomendasi HP
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-neutral-900">
                            Foto Kamera HP
                          </h4>
                          <p className="text-[11px] text-neutral-600 leading-relaxed mt-0.5">
                            Nyalakan kamera langsung atau gunakan app kamera bawaan HP untuk jepret struk
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsCameraOpen(true)}
                          className="w-full py-2.5 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Buka Kamera Viewfinder</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="w-full py-2 px-3 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-medium rounded-xl transition flex items-center justify-center gap-1.5"
                        >
                          <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>App Kamera Bawaan HP</span>
                        </button>
                      </div>
                    </div>

                    {/* Option 2: Upload File / Gallery */}
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      className="relative group p-5 rounded-2xl border-2 border-dashed border-neutral-300 hover:border-neutral-500 bg-[#f8faf9] hover:bg-neutral-100/70 transition-all flex flex-col justify-between text-left shadow-xs"
                    >
                      <div className="space-y-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-neutral-800 text-white flex items-center justify-center shadow-xs">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700 text-[10px] font-bold mb-1">
                            Penyimpanan File
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-neutral-900">
                            Unggah dari Berkas
                          </h4>
                          <p className="text-[11px] text-neutral-600 leading-relaxed mt-0.5">
                            Pilih gambar struk yang sudah tersimpan di galeri foto atau file explorer (JPG, PNG, WebP)
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2.5 px-3.5 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs mt-1"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Pilih dari Galeri / Dokumen</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Selected File Preview with Retake/Change options */
                <div className="bg-[#f8faf9] border border-[#e4ebe5] rounded-2xl p-4 flex flex-col items-center gap-3">
                  <div className="relative group max-h-52 overflow-hidden rounded-xl border border-neutral-200 bg-black/5 flex items-center justify-center p-1">
                    <img
                      src={previewUrl}
                      alt="Preview struk"
                      className="max-h-48 rounded-lg object-contain shadow-xs"
                    />
                  </div>

                  <div className="text-center">
                    <p className="text-xs font-bold text-neutral-800 truncate max-w-xs">
                      {selectedFile?.name || "Foto Struk Belanja"}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {selectedFile ? `${(selectedFile.size / 1024).toFixed(0)} KB • Siap dipindai` : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCameraOpen(true)}
                      className="flex-1 py-2 px-3 bg-white border border-neutral-200 hover:bg-neutral-100 rounded-xl text-[11px] font-semibold text-neutral-700 transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Foto Ulang Kamera</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2 px-3 bg-white border border-neutral-200 hover:bg-neutral-100 rounded-xl text-[11px] font-semibold text-neutral-700 transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Ganti File Galeri</span>
                    </button>
                  </div>
                </div>
              )}
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

      {/* Live Camera Viewfinder Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(file) => {
          handleFileChange(file);
        }}
        onSwitchToUpload={() => {
          fileInputRef.current?.click();
        }}
      />
    </div>,
    document.body
  );
}