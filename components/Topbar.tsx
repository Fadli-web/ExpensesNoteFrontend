"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Sparkles,
  Plus,
  LogOut,
  User,
  ChevronDown,
  Search,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface TopbarProps {
  onToggleSidebar?: () => void;
  title?: string;
  onOpenScan?: () => void;
  onOpenCreate?: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export default function Topbar({
  onToggleSidebar,
  title = "Dashboard",
  onOpenScan,
  onOpenCreate,
  searchQuery = "",
  onSearchChange,
}: TopbarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    router.push("/login");
  };

  const displayName =
    user?.full_name || (user?.email ? user.email.split("@")[0] : "You");

  return (
    /*
     * Floating pill topbar — fixed at top, glass blur effect.
     * Sits over content; page must have pt-20 (done in layout.tsx).
     */
    <header className="fixed top-4 left-0 right-0 z-30 px-4 lg:pl-[280px] pointer-events-none">
      <div
        className="max-w-screen-xl mx-auto pointer-events-auto"
      >
        <div
          className="flex items-center justify-between gap-3 px-3 py-2 rounded-2xl shadow-sm"
          style={{
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(20px) saturate(1.8)",
            WebkitBackdropFilter: "blur(20px) saturate(1.8)",
            border: "1px solid rgba(0,0,0,0.07)",
          }}
        >
          {/* Left: hamburger + title */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-[#333] hover:bg-black/5 transition"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
            <span className="text-[15px] font-semibold tracking-tight text-[#111] hidden sm:block">
              {title}
            </span>
          </div>

          {/* Center: search */}
          <div className="flex-1 max-w-sm hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#999]" />
              <input
                type="text"
                placeholder="Cari merchant, kategori..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-[13px] bg-black/5 rounded-xl border border-black/6 text-[#111] placeholder-[#aaa] focus:outline-none focus:border-black/15 focus:bg-black/[0.07] transition"
              />
            </div>
          </div>

          {/* Right: action pills + avatar */}
          <div className="flex items-center gap-2">
            {/* Scan AI pill */}
            {onOpenScan && (
              <button
                onClick={onOpenScan}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Scan AI</span>
              </button>
            )}

            {/* Add transaction */}
            {onOpenCreate && (
              <button
                onClick={onOpenCreate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-full text-white transition"
                style={{ background: "#111111" }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tambah</span>
              </button>
            )}

            {/* Divider */}
            <div className="w-px h-5 bg-black/10" />

            {/* Profile avatar dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-1.5 py-1 rounded-full hover:bg-black/5 transition"
              >
                <div className="w-7 h-7 rounded-full bg-[#111] text-white flex items-center justify-center text-[11px] font-bold overflow-hidden shrink-0">
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    displayName.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-[12px] font-semibold text-[#111] hidden md:inline max-w-[100px] truncate">
                  {displayName}
                </span>
                <ChevronDown
                  className={`w-3 h-3 text-[#999] transition-transform ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 rounded-2xl py-1.5 z-50 animate-fade-in overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(20px) saturate(1.8)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.8)",
                    border: "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 16px 48px -12px rgba(0,0,0,0.18)",
                  }}
                >
                  <div className="px-4 py-2.5 border-b border-black/5">
                    <p className="text-[12px] font-bold text-[#111] truncate">{displayName}</p>
                    <p className="text-[11px] text-[#999] truncate mt-0.5">{user?.email || ""}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-[12px] font-medium text-[#333] hover:bg-black/5 hover:text-[#111] transition"
                    >
                      <User className="w-3.5 h-3.5 text-[#aaa]" />
                      <span>My Profile</span>
                    </Link>
                  </div>
                  <div className="border-t border-black/5 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-[12px] font-semibold text-rose-600 hover:bg-rose-50 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
