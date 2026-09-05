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
    <div className="expendnote-card p-6 flex flex-col justify-between h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Pengeluaran Terbanyak
          </span>
          <h3 className="text-base font-bold text-[#0e3d25]">Top Merchants</h3>
        </div>
        <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2.5 py-1 rounded-full">
          Aktif
        </span>
      </div>

      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center my-auto">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mb-2.5">
            <Store className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-gray-700">Belum Ada Merchant</p>
          <p className="text-[11px] text-gray-400 mt-0.5 max-w-[200px]">
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
                    <div className="w-8 h-8 rounded-xl bg-[#f4f7f5] border border-[#e4ebe5] flex items-center justify-center text-[#0e3d25] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 truncate max-w-[140px]">
                        {item.merchant}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {item.transaction_count ? `${item.transaction_count} transaksi` : "Tercatat"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-[#0e3d25]">
                      {formatCurrency(item.total_amount)}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#f1f5f2] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#16a34a] h-full rounded-full transition-all duration-500"
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
