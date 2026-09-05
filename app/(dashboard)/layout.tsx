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
    // Refresh window or trigger event
    window.dispatchEvent(new CustomEvent("refresh-transactions"));
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        {/* Topbar */}
        <Topbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenScan={() => setIsScanOpen(true)}
          onOpenCreate={() => setIsCreateOpen(true)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
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
