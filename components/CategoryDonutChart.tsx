"use client";

import React from "react";
import { PieChart, Tag } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface CategoryItem {
  category: string;
  total_amount: number;
  percentage: number;
}

interface CategoryDonutChartProps {
  data?: CategoryItem[];
  totalAmount?: number;
}

const CATEGORY_COLORS = [
  "#16a34a", // Emerald
  "#22c55e", // Green
  "#10b981", // Teal
  "#0e3d25", // Deep forest
  "#84cc16", // Lime
  "#065f46", // Dark green
  "#14b8a6", // Mint
];

export default function CategoryDonutChart({ data = [], totalAmount = 0 }: CategoryDonutChartProps) {
  const sumCategories = data.reduce((sum, item) => sum + (Number(item.total_amount) || 0), 0);
  const effectiveTotal = sumCategories > 0 ? sumCategories : totalAmount;
  const hasData = data.length > 0 && effectiveTotal > 0;
  const radius = 68;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  let accumulatedAngle = 0;
  const itemsWithAngles = data.map((item) => {
    const angle = accumulatedAngle;
    accumulatedAngle += (item.percentage / 100) * 360;
    return { ...item, angle };
  });

  return (
    <div className="bg-white rounded-[28px] border border-black/[0.06] p-6 flex flex-col justify-between h-full min-h-[380px] shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
            BREAKDOWN
          </span>
          <h3 className="text-base font-bold text-[#111111] tracking-tight">Expense Distribution</h3>
        </div>
        <span className="text-[10px] text-neutral-600 font-medium bg-neutral-100 px-2.5 py-0.5 rounded-full">
          Aktif
        </span>
      </div>

      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center my-auto">
          <div className="w-14 h-14 rounded-2xl bg-neutral-50 text-neutral-400 flex items-center justify-center mb-3">
            <PieChart className="w-7 h-7" />
          </div>
          <p className="text-sm font-bold text-neutral-800">Belum Ada Pengeluaran</p>
          <p className="text-xs text-neutral-400 mt-1 max-w-[220px]">
            Distribusi kategori pengeluaran Anda akan otomatis muncul di sini setelah mencatat transaksi.
          </p>
        </div>
      ) : (
        <>
          {/* Donut Ring Visual */}
          <div className="relative flex items-center justify-center my-3">
            <svg className="w-44 h-44 -rotate-90" viewBox="0 0 180 180">
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="transparent"
                stroke="#f1f5f2"
                strokeWidth={strokeWidth}
              />
              {itemsWithAngles.map((item, idx) => {
                const strokeDash = Math.max((item.percentage / 100) * circumference, 1);
                const stroke = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
                const angle = item.angle;

                return (
                  <circle
                    key={item.category}
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="transparent"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${strokeDash} ${circumference}`}
                    strokeDashoffset="0"
                    style={{
                      transformOrigin: "center",
                      transform: `rotate(${angle}deg)`,
                    }}
                    className="transition-all duration-500 hover:opacity-85"
                  />
                );
              })}
            </svg>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Total
              </span>
              <span className="text-base font-black text-[#0e3d25] truncate max-w-[130px]">
                {formatCurrency(effectiveTotal)}
              </span>
            </div>
          </div>

          {/* Category Percentages List */}
          <div className="space-y-2.5 mt-2">
            {data.slice(0, 4).map((item, idx) => {
              const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-medium text-gray-700 truncate max-w-[170px]">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="truncate">{item.category}</span>
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-gray-400 font-medium text-[11px]">
                        {formatCurrency(item.total_amount)}
                      </span>
                      <span className="font-bold text-[#0e3d25] w-9 text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-[#e8ebe7] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
