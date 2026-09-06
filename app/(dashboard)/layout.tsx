"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import TransactionModal from "@/components/TransactionModal";
import ScanReceiptModal from "@/components/ScanReceiptModal";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreateTransaction = async (data: any) => {
    await api.createTransaction(data);
    window.dispatchEvent(new CustomEvent("refresh-transactions"));
  };

  return (
    /*
     * Ink & Paper layout shell:
     * - bg-[#f0f0ee] warm paper background
     * - Dark sidebar fixed left (w-64)
     * - Floating topbar: fixed top-4, z-30, glass pill
     * - Main content: padding-left for sidebar on desktop, pt-20 for floating topbar
     */
    <div className="min-h-screen flex" style={{ background: "#f0f0ee" }}>

      {/* Dark Ink Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">

        {/* Floating Glass Topbar */}
        <Topbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenScan={() => setIsScanOpen(true)}
          onOpenCreate={() => setIsCreateOpen(true)}
        />

        {/* Page Content — pt-20 to clear floating topbar */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-20 pb-12 max-w-screen-xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Modals */}
      <TransactionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateTransaction}
      />
      <ScanReceiptModal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        onSuccessSave={handleCreateTransaction}
      />
    </div>
  );
}
