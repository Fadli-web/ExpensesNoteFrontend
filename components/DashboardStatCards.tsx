"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Calendar, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface StatCardsProps {
  totalThisMonth?: number;
  totalLastMonth?: number;
  percentChange?: number;
  dailyAverage?: number;
  totalTransactions?: number;
}

export default function DashboardStatCards({
  totalThisMonth = 0,
  totalLastMonth = 0,
  percentChange = 0,
  dailyAverage = 0,
  totalTransactions,
}: StatCardsProps) {
  const isPositive = percentChange >= 0;

  const cards = [
    {
      title: "Total Pengeluaran",
      amount: formatCurrency(totalThisMonth),
      badge: totalTransactions ? `${totalTransactions} Transaksi Tercatat` : `${isPositive ? "+" : ""}${percentChange}% vs bulan lalu`,
      isPositive: !isPositive,
      rawChange: percentChange,
      icon: Wallet,
      iconBg: "bg-emerald-100 text-emerald-800",
    },
    {
      title: "Pengeluaran Bulan Lalu",
      amount: formatCurrency(totalLastMonth),
      badge: "Arsip Rekap",
      isPositive: true,
      icon: Calendar,
      iconBg: "bg-blue-100 text-blue-800",
    },
    {
      title: "Rata-rata Harian",
      amount: formatCurrency(dailyAverage),
      badge: "Berdasarkan 30 hari",
      isPositive: true,
      icon: TrendingUp,
      iconBg: "bg-amber-100 text-amber-800",
    },
    {
      title: "Health & Score Belanja",
      amount: "Terkendali",
      badge: "Bagus (88%)",
      isPositive: true,
      icon: ShoppingBag,
      iconBg: "bg-purple-100 text-purple-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="expendnote-card p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-transform"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-xl lg:text-2xl font-black text-[#0e3d25] tracking-tight">
                {card.amount}
              </div>

              <div className="flex items-center gap-1.5 mt-2.5">
                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    card.rawChange !== undefined
                      ? card.rawChange > 0
                        ? "bg-rose-100 text-rose-700"
                        : "bg-emerald-100 text-emerald-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {card.rawChange !== undefined &&
                    (card.rawChange > 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    ))}
                  {card.badge}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
