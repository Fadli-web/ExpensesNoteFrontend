"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Receipt,
  FileSpreadsheet,
  User,
  Sparkles,
  Lock,
  X,
  CreditCard,
  PiggyBank,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { backendHealth } = useAuth();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Transactions",
      href: "/transactions",
      icon: ArrowLeftRight,
      badge: "AI",
    },
    {
      name: "Receipts Vault",
      href: "/receipts",
      icon: Receipt,
    },
    {
      name: "Export CSV",
      href: "/export",
      icon: FileSpreadsheet,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  const secondaryItems = [

    {
      name: "Insights",
      href: "/insights",
      icon: Sparkles,
      badge: "AI",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-[#e5ebe7] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full overflow-y-auto px-5 py-6">
          {/* Logo Brand */}
          <div className="flex items-center justify-between px-2 mb-8">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="grid grid-cols-2 gap-1 p-1.5 bg-[#e8f5ec] rounded-xl group-hover:bg-[#d1fae5] transition">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0e3d25]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#0e3d25]"></span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-[#0e3d25]">
                  ExpendNote
                </span>
                <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider">
                  Expenses Note
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-1.5 mb-6">
            <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
              Main Menu
            </div>
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-150 ${isActive
                    ? "bg-[#e8f5ec] text-[#0e3d25] font-semibold shadow-sm"
                    : "text-gray-600 hover:text-[#0e3d25] hover:bg-[#f4f7f5]"
                    }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${isActive ? "text-[#16a34a]" : "text-gray-400"
                      }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Secondary Navigation */}
          <div className="space-y-1.5 mb-6">
            <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
              Financial Suite
            </div>
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-medium text-gray-600 hover:text-[#0e3d25] hover:bg-[#f4f7f5] transition"
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Bottom Card - AI Smart Receipt Vault */}
          <div className="mt-auto pt-4">
            <div className="expendnote-card-dark p-4 relative overflow-hidden rounded-2xl">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4 text-emerald-300" />
              </div>
              <h4 className="text-xs font-semibold text-white leading-relaxed mb-1">
                AI Smart Receipt Vault
              </h4>
              <p className="text-[11px] text-emerald-200/70 leading-relaxed">
                Scan struk belanja fisik dan pantau pengeluaran Anda secara otomatis.
              </p>
            </div>


          </div>
        </div>
      </aside>
    </>
  );
}
