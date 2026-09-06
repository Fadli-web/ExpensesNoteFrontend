"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/formatters";

interface TrendDataPoint {
  date: string;
  total_amount: number;
}

interface CashflowChartProps {
  data?: TrendDataPoint[];
  totalBalance?: number;
}

export default function CashflowChart({ data = [], totalBalance = 0 }: CashflowChartProps) {
  const [activeRange, setActiveRange] = useState<"7d" | "30d">("7d");
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; x: number; y: number; item: TrendDataPoint } | null>(null);

  // Baseline zero points if empty or gracefully pad single point
  const defaultPoints: TrendDataPoint[] = [
    { date: "Sen", total_amount: 0 },
    { date: "Sel", total_amount: 0 },
    { date: "Rab", total_amount: 0 },
    { date: "Kam", total_amount: 0 },
    { date: "Jum", total_amount: 0 },
    { date: "Sab", total_amount: 0 },
    { date: "Min", total_amount: 0 },
  ];

  let points: TrendDataPoint[] = defaultPoints;
  if (data && data.length > 1) {
    points = data;
  } else if (data && data.length === 1) {
    const single = data[0];
    points = [
      { date: "Awal", total_amount: 0 },
      single,
      { date: "Terkini", total_amount: single.total_amount },
    ];
  }

  const maxVal = Math.max(...points.map((p) => p.total_amount), 100000);

  // SVG dimensions
  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  // Calculate coordinates
  const coords = points.map((p, i) => {
    const x = paddingX + (i / Math.max(points.length - 1, 1)) * (width - paddingX * 2);
    const y = height - paddingY - (p.total_amount / maxVal) * (height - paddingY * 2);
    return { x, y, item: p };
  });

  // Generate smooth SVG path (Catmull-Rom or bezier)
  const linePath = coords.reduce((acc, curr, i, arr) => {
    if (i === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[i - 1];
    const cpx1 = prev.x + (curr.x - prev.x) / 2;
    const cpy1 = prev.y;
    const cpx2 = prev.x + (curr.x - prev.x) / 2;
    const cpy2 = curr.y;
    return `${acc} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
  }, "");

  // Area fill under curve
  const areaPath = `${linePath} L ${coords[coords.length - 1]?.x || width} ${height - paddingY} L ${coords[0]?.x || 0} ${height - paddingY} Z`;

  return (
    <div className="bg-white rounded-[28px] border border-black/[0.06] p-6 flex flex-col justify-between shadow-xs">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
            CASHFLOW DYNAMICS
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold tracking-tight text-[#111111]">
              {formatCurrency(totalBalance)}
            </h3>
            <span className="text-[10px] font-medium text-neutral-600 bg-neutral-100 px-2.5 py-0.5 rounded-full">
              Bulan Ini
            </span>
          </div>
        </div>

        {/* Range switcher & legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#111111]"></span>
              <span className="text-[11px] font-medium">Pengeluaran</span>
            </span>
          </div>

          <div className="flex items-center bg-[#f4f4f2] p-1 rounded-full">
            <button
              onClick={() => setActiveRange("7d")}
              className={`px-3 py-1 text-xs font-medium rounded-full transition ${
                activeRange === "7d"
                  ? "bg-white text-[#111111] shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setActiveRange("30d")}
              className={`px-3 py-1 text-xs font-medium rounded-full transition ${
                activeRange === "30d"
                  ? "bg-white text-[#111111] shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Bulan Ini
            </button>
          </div>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 sm:h-56 overflow-visible"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#e2ebe4"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height / 2}
            x2={width - paddingX}
            y2={height / 2}
            stroke="#e2ebe4"
            strokeDasharray="4 4"
          />

          {/* Area Fill */}
          <path d={areaPath} fill="url(#chartGradient)" />

          {/* Curved Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#16a34a"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {coords.map((c, i) => (
            <g key={i}>
              <circle
                cx={c.x}
                cy={c.y}
                r={hoveredPoint?.index === i ? 6 : 4}
                fill="#ffffff"
                stroke="#16a34a"
                strokeWidth={hoveredPoint?.index === i ? 3 : 2}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredPoint({ index: i, x: c.x, y: c.y, item: c.item })}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {/* X Axis label */}
              <text
                x={c.x}
                y={height - 10}
                textAnchor="middle"
                fontSize="11"
                fill="#64748b"
                fontWeight="500"
              >
                {c.item.date.includes("-") ? c.item.date.split("-").slice(1).join("/") : c.item.date}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full mb-2 bg-[#0e3d25] text-white px-3 py-1.5 rounded-xl shadow-lg text-xs"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100}%`,
            }}
          >
            <p className="text-[10px] text-emerald-300 font-medium">{hoveredPoint.item.date}</p>
            <p className="font-bold">{formatCurrency(hoveredPoint.item.total_amount)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
