"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ExternalLink, Image as ImageIcon } from "lucide-react";

interface ReceiptLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  merchant?: string;
  date?: string;
}

export default function ReceiptLightbox({
  isOpen,
  onClose,
  imageUrl,
  merchant,
  date,
}: ReceiptLightboxProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !imageUrl || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] my-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 bg-[#f8faf9] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 truncate max-w-xs">
                Struk Belanja {merchant ? `- ${merchant}` : ""}
              </h4>
              {date && <p className="text-[11px] text-gray-500">{date}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full text-gray-600 hover:bg-gray-200 transition"
              title="Buka gambar penuh di tab baru"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Display with min-h-0 */}
        <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-gray-900/5 min-h-0">
          <img
            src={imageUrl}
            alt={merchant || "Receipt"}
            className="max-h-[72vh] w-auto rounded-xl object-contain shadow-md"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
