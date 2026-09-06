"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Calendar, BarChart3 } from "lucide-react";
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
  const isUp = percentChange > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 stagger">

      {/* Card 1 — Dark Ink (Hero card) */}
      <div
        className="norma-card-dark p-5 flex flex-col justify-between min-h-[140px] relative overflow-hidden animate-fade-in hover:-translate-y-0.5 transition-transform duration-200"
      >
        {/* Subtle glow orb */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wide text-white/40 uppercase">
            Bulan Ini
          </span>
          <div className="w-8 h-8 rounded-xl bg-white/8 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white/50" />
          </div>
        </div>

        <div>
          <div className="text-2xl font-bold tracking-tight text-white mt-3">
            {formatCurrency(totalThisMonth)}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            {totalTransactions ? (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-white/50">
                {totalTransactions} transaksi tercatat
              </span>
            ) : (
              <span
                className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  isUp ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(percentChange).toFixed(1)}% vs bln lalu
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card 2 — Paper (Bulan Lalu) */}
      <div className="norma-card p-5 flex flex-col justify-between min-h-[140px] animate-fade-in hover:-translate-y-0.5 transition-transform duration-200">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wide text-[#888] uppercase">
            Bulan Lalu
          </span>
          <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-[#888]" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold tracking-tight text-[#111] mt-3">
            {formatCurrency(totalLastMonth)}
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-black/6 text-[#888] mt-2 inline-block">
            Arsip Rekap
          </span>
        </div>
      </div>

      {/* Card 3 — Paper (Rata-rata Harian) */}
      <div className="norma-card p-5 flex flex-col justify-between min-h-[140px] animate-fade-in hover:-translate-y-0.5 transition-transform duration-200">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wide text-[#888] uppercase">
            Rata-rata Harian
          </span>
          <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-[#888]" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold tracking-tight text-[#111] mt-3">
            {formatCurrency(dailyAverage)}
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-black/6 text-[#888] mt-2 inline-block">
            Per hari / 30 hari
          </span>
        </div>
      </div>

      {/* Card 4 — Paper (Vs Last Month % Badge) */}
      <div className="norma-card p-5 flex flex-col justify-between min-h-[140px] animate-fade-in hover:-translate-y-0.5 transition-transform duration-200">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wide text-[#888] uppercase">
            Perubahan
          </span>
          <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-[#888]" />
          </div>
        </div>
        <div>
          <div
            className={`text-2xl font-bold tracking-tight mt-3 ${
              isUp ? "text-rose-600" : percentChange < 0 ? "text-emerald-700" : "text-[#111]"
            }`}
          >
            {percentChange === 0
              ? "—"
              : `${isUp ? "+" : ""}${percentChange.toFixed(1)}%`}
          </div>
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full mt-2 inline-block ${
              isUp
                ? "bg-rose-100 text-rose-700"
                : percentChange < 0
                ? "bg-emerald-100 text-emerald-700"
                : "bg-black/6 text-[#888]"
            }`}
          >
            {isUp ? "Naik vs bln lalu" : percentChange < 0 ? "Turun vs bln lalu" : "Sama seperti bln lalu"}
          </span>
        </div>
      </div>
    </div>
  );
}
