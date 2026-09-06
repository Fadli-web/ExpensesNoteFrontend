"use client";

import React from "react";
import { Store, ShoppingCart, Fuel, Coffee, Laptop } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface MerchantItem {
  merchant: string;
  total_amount: number;
  transaction_count?: number;
}

interface TopMerchantsCardProps {
  merchants?: MerchantItem[];
}

export default function TopMerchantsCard({ merchants = [] }: TopMerchantsCardProps) {
  const hasData = merchants.length > 0;
  const maxAmount = Math.max(...merchants.map((m) => m.total_amount), 1);

  const getMerchantIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("spbu") || lower.includes("bensin") || lower.includes("pertamina")) return Fuel;
    if (lower.includes("kopi") || lower.includes("starbucks") || lower.includes("cafe")) return Coffee;
    if (lower.includes("tokopedia") || lower.includes("shopee") || lower.includes("online")) return Laptop;
    if (lower.includes("superindo") || lower.includes("market") || lower.includes("indomaret") || lower.includes("alfamart")) return ShoppingCart;
    return Store;
  };

  return (
    <div className="bg-white rounded-[28px] border border-black/[0.06] p-6 flex flex-col justify-between h-full min-h-[300px] shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
            MERCHANTS
          </span>
          <h3 className="text-base font-bold text-[#111111] tracking-tight">Top Merchants</h3>
        </div>
        <span className="text-[10px] text-neutral-600 font-medium bg-neutral-100 px-2.5 py-0.5 rounded-full">
          Aktif
        </span>
      </div>

      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center my-auto">
          <div className="w-12 h-12 rounded-2xl bg-neutral-50 text-neutral-400 flex items-center justify-center mb-2.5">
            <Store className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-neutral-800">Belum Ada Merchant</p>
          <p className="text-[11px] text-neutral-400 mt-0.5 max-w-[200px]">
            Daftar toko/merchant dengan transaksi terbesar akan tampil di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {merchants.slice(0, 5).map((item, idx) => {
            const Icon = getMerchantIcon(item.merchant);
            const pct = Math.round((item.total_amount / maxAmount) * 100);

            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900 truncate max-w-[140px]">
                        {item.merchant}
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        {item.transaction_count ? `${item.transaction_count} transaksi` : "Tercatat"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-[#111111]">
                      {formatCurrency(item.total_amount)}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#111111] h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
