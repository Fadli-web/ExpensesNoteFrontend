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
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { name: "Dashboard",     href: "/dashboard",    icon: LayoutDashboard },
    { name: "Transactions",  href: "/transactions", icon: ArrowLeftRight,  badge: "AI" },
    { name: "Receipts",      href: "/receipts",     icon: Receipt },
    { name: "Export CSV",    href: "/export",       icon: FileSpreadsheet },
    { name: "Insights AI",   href: "/insights",     icon: Sparkles,        badge: "AI" },
    { name: "Profile",       href: "/profile",      icon: User },
  ];

  const displayName = user?.full_name || (user?.email ? user.email.split("@")[0] : "You");

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar — Dark Ink */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "#111111" }}
      >
        {/* Inner wrapper */}
        <div className="flex flex-col h-full px-4 py-6 overflow-y-auto">

          {/* Logo */}
          <div className="flex items-center justify-between px-2 mb-8">
            <Link href="/dashboard" className="flex items-center gap-3 group" onClick={onClose}>
              {/* Logo mark: two dots grid */}
              <div className="flex items-center justify-center w-9 h-9 rounded-2xl bg-white/10 shrink-0 group-hover:bg-white/15 transition">
                <div className="grid grid-cols-2 gap-[3px]">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="w-2 h-2 rounded-full bg-white" />
                </div>
              </div>
              <div>
                <span className="block font-bold text-[15px] tracking-tight text-white leading-none">
                  ExpendNote
                </span>
                <span className="block text-[10px] font-medium text-white/35 uppercase tracking-widest mt-0.5">
                  Expense Tracker
                </span>
              </div>
            </Link>

            {/* Mobile close */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Section Label */}
          <div className="px-3 mb-2">
            <span className="text-[10px] font-semibold tracking-[0.12em] text-white/25 uppercase">
              Menu
            </span>
          </div>

          {/* Nav Items */}
          <nav className="space-y-0.5">
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
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/45 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                        isActive ? "text-emerald-400" : "text-white/30 group-hover:text-white/55"
                      }`}
                    />
                    <span className="tracking-[-0.01em]">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Divider */}
          <div className="border-t border-white/8 my-4" />

          {/* Bottom: User pill + AI badge */}
          <div className="space-y-3 px-1">
            {/* AI Feature Card */}
            <div className="relative overflow-hidden rounded-2xl p-4 bg-white/[0.04] border border-white/8">
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-[11px] font-semibold text-white/70">AI Receipt Scan</span>
              </div>
              <p className="text-[10px] text-white/30 leading-relaxed">
                Scan struk belanja dan catat otomatis dengan Gemini Vision
              </p>
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-2xl bg-white/[0.03] border border-white/6">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-white/80 truncate">{displayName}</p>
                <p className="text-[10px] text-white/25 truncate">{user?.email || ""}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
