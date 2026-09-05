"use client";

import React from "react";
import { Wifi, Plus, Send, Download, History } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { useAuth } from "@/context/AuthContext";

interface DigitalCardProps {
  balance?: number;
  onQuickAction?: (action: string) => void;
}

export default function DigitalCard({ balance = 0, onQuickAction }: DigitalCardProps) {
  const { user } = useAuth();
  const name = user?.full_name || (user?.email ? user.email.split("@")[0] : "PENGGUNA");

  return (
    <div className="space-y-4">
      {/* Forest Green Card */}
      <div className="expendnote-card-dark p-6 relative overflow-hidden flex flex-col justify-between h-52">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />

        {/* Top row: Brand & Contactless Icon */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-2 gap-0.5 p-1 bg-white/10 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>
            <span className="text-xs font-black tracking-wider text-emerald-200 uppercase">
              EXPENDNOTE VAULT
            </span>
          </div>
          <Wifi className="w-5 h-5 text-white/70 rotate-90" />
        </div>

        {/* Center: Cardholder Name & Balance */}
        <div className="relative z-10">
          <p className="text-xs text-emerald-200/80 font-medium">Budget & Pengeluaran</p>
          <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight mt-0.5">
            {formatCurrency(balance)}
          </h2>
        </div>

        {/* Bottom row: User Name & Expiry */}
        <div className="flex items-center justify-between text-xs text-emerald-100/90 relative z-10">
          <span className="font-semibold tracking-wide uppercase">{name}</span>
          <span className="font-mono text-[11px] text-white/70">EXP 12/28 • 323</span>
        </div>
      </div>

      {/* Quick Action Buttons (Top Up, Transfer, Scan, History) */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Scan AI", action: "scan", icon: Plus },
          { label: "Tambah", action: "add", icon: Send },
          { label: "Export", action: "export", icon: Download },
          { label: "Riwayat", action: "history", icon: History },
        ].map((btn) => {
          const Icon = btn.icon;
          return (
            <button
              key={btn.action}
              onClick={() => onQuickAction?.(btn.action)}
              className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-[#e4ebe5] hover:bg-[#e8f5ec] hover:border-emerald-200 transition group shadow-xs"
            >
              <div className="w-8 h-8 rounded-full bg-[#f4f7f5] group-hover:bg-emerald-100 flex items-center justify-center text-[#0e3d25] transition mb-1">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-gray-700 group-hover:text-[#0e3d25]">
                {btn.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
