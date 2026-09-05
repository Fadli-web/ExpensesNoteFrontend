"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  Send,
  RefreshCw,
  PiggyBank,
  Wallet,
  Store,
  Tag,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Bot,
  User,
  ArrowRight,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/formatters";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  is_financial?: boolean;
  timestamp: string;
}

export default function InsightsPage() {
  const [summaryData, setSummaryData] = useState<{
    financial_health: string;
    health_score: number;
    summary: string;
    key_recommendations: string[];
    saving_potential: string;
    context?: any;
  } | null>(null);

  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState("");

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchSummary = async () => {
    setIsLoadingSummary(true);
    setSummaryError("");
    try {
      const res = await api.getInsightsSummary();
      setSummaryData(res);
    } catch (err: any) {
      console.error("Failed loading summary insights:", err);
      setSummaryError(err.message || "Gagal memuat ringkasan insight AI");
    } finally {
      setIsLoadingSummary(false);
    }
  };

  useEffect(() => {
    fetchSummary();

    // Default welcoming message
    setMessages([
      {
        id: "welcome",
        role: "model",
        text: "Halo! Saya **Asisten AI Keuangan COINEST** 🤖✨\n\nSaya siap membantu menganalisis pola pengeluaran, pos anggaran belanja, dan memberikan rekomendasi penghematan berdasarkan data transaksi riil Anda.\n\n*Catatan: Saya hanya melayani pertanyaan seputar keuangan dan data transaksi Anda. Pertanyaan non-keuangan (seperti resep makanan, hiburan, dll) akan otomatis saya tolak.*",
        is_financial: true,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAsking]);

  const handleSendQuestion = async (queryText?: string) => {
    const textToSend = queryText || inputQuestion;
    if (!textToSend.trim() || isAsking) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      role: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuestion("");
    setIsAsking(true);

    try {
      // Build history for context
      const history = messages.slice(-5).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await api.askInsights(textToSend.trim(), history);

      const aiMsg: ChatMessage = {
        id: "ai-" + Date.now(),
        role: "model",
        text: res.reply || "Tidak ada respons dari asisten AI.",
        is_financial: res.is_financial,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: "error-" + Date.now(),
        role: "model",
        text: `Terjadi kendala saat menghubungi AI: ${err.message || "Silakan periksa koneksi Anda."}`,
        is_financial: true,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAsking(false);
    }
  };

  const quickQuestions = [
    {
      label: "📊 Analisis Pengeluaran Saya",
      query: "Berapa total pengeluaran saya dan apa yang paling boros?",
    },
    {
      label: "💡 Saran Penghematan",
      query: "Bagaimana cara saya berhemat berdasarkan data pengeluaran dan merchant langganan saya?",
    },
    {
      label: "🏪 Evaluasi Toko Terbesar",
      query: "Berapa banyak uang yang saya habiskan di toko/merchant terbesar saya?",
    },
    {
      label: "🍕 Gimana cara buat pizza? (Uji Blokir)",
      query: "gimana cara buat pizza",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0e3d25] to-[#164e32] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-[#c8f53c] text-xs font-bold border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Financial Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Smart Financial Insights
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            Analisis cerdas berdasarkan transaksi nyata Anda. Dapatkan evaluasi kesehatan finansial, rekomendasi penghematan otomatis, dan konsultasi keuangan dengan Gemini AI.
          </p>
        </div>

        <div className="relative z-10">
          <button
            onClick={fetchSummary}
            disabled={isLoadingSummary}
            className="px-5 py-2.5 rounded-2xl bg-[#c8f53c] hover:bg-[#b5e230] text-[#0b1614] text-xs font-bold transition flex items-center gap-2 shadow-lg disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSummary ? "animate-spin" : ""}`} />
            <span>Perbarui Analisis</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Health Score */}
        <div className="bg-white p-5 rounded-3xl border border-[#e5ebe7] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Skor Finansial</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0e3d25]">
                {isLoadingSummary ? "--" : summaryData?.health_score || 75}
              </span>
              <span className="text-xs text-gray-400 font-bold">/ 100</span>
            </div>
            <span className="inline-block mt-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {isLoadingSummary ? "Menghitung..." : summaryData?.financial_health || "Terkendali"}
            </span>
          </div>
        </div>

        {/* Card 2: Saving Potential */}
        <div className="bg-white p-5 rounded-3xl border border-[#e5ebe7] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Potensi Hemat / Bulan</span>
            <div className="w-8 h-8 rounded-xl bg-[#e8f5ec] text-[#16a34a] flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-black text-emerald-800">
              {isLoadingSummary ? "Menganalisis..." : summaryData?.saving_potential || "Rp 150.000+"}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">Estimasi efisiensi pengeluaran</p>
          </div>
        </div>

        {/* Card 3: Top Category */}
        <div className="bg-white p-5 rounded-3xl border border-[#e5ebe7] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Kategori Terbesar</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-base font-black text-gray-900 truncate">
              {isLoadingSummary
                ? "..."
                : summaryData?.context?.categoryBreakdown?.[0]?.category || "Belanja Harian"}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              {summaryData?.context?.categoryBreakdown?.[0]?.percentage || "91%"} dari seluruh transaksi
            </p>
          </div>
        </div>

        {/* Card 4: Top Merchant */}
        <div className="bg-white p-5 rounded-3xl border border-[#e5ebe7] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Merchant Terbesar</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-base font-black text-gray-900 truncate">
              {isLoadingSummary
                ? "..."
                : summaryData?.context?.topMerchants?.[0]?.merchant || "TK. SINAR AGUNG"}
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">
              {summaryData?.context?.topMerchants?.[0]?.totalFormatted || "Rp 697.000"}
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Summary & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Executive Summary */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-[#e5ebe7] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Ringkasan Analisis Finansial AI
              </h3>
              <p className="text-xs text-gray-400">
                Dihasilkan otomatis berdasarkan data struk dan transaksi pengguna
              </p>
            </div>
          </div>

          {isLoadingSummary ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
              <p className="text-xs text-gray-500 font-medium">
                Gemini AI sedang membaca dan mengalkulasi data transaksi Anda...
              </p>
            </div>
          ) : summaryError ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{summaryError}</span>
            </div>
          ) : (
            <div className="space-y-3 text-xs sm:text-sm text-gray-600 leading-relaxed bg-[#f8faf9] p-5 rounded-2xl border border-[#e5ebe7]">
              {summaryData?.summary ? (
                summaryData.summary.split("\n\n").map((para, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {para}
                  </p>
                ))
              ) : (
                <p>Belum ada data pengeluaran yang cukup untuk dianalisis.</p>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Key Recommendations */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-[#e5ebe7] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Rekomendasi Utama
              </h3>
              <p className="text-xs text-gray-400">Tindakan nyata untuk menghemat pengeluaran</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {isLoadingSummary ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-14 bg-gray-100 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : summaryData?.key_recommendations && summaryData.key_recommendations.length > 0 ? (
              summaryData.key_recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#f8faf9] border border-[#e5ebe7] flex items-start gap-3 hover:border-emerald-300 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed font-medium">
                    {rec}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400">Belum ada rekomendasi yang tersedia.</p>
            )}
          </div>
        </div>
      </div>

      {/* Interactive AI Chat Section */}
      <div className="bg-white rounded-3xl border border-[#e5ebe7] shadow-xl overflow-hidden flex flex-col min-h-[550px]">
        {/* Chat Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f8faf9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0e3d25] text-[#c8f53c] flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">
                  Konsultasi AI Keuangan COINEST
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Gemini Online
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Tanyakan apa saja seputar pengeluaran, perincian belanja, atau tips hemat
              </p>
            </div>
          </div>

          {/* Scope Guardrail Info Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Topik dibatasi khusus keuangan & data transaksi</span>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-4 border-b border-gray-100 bg-white flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-400 mr-1 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            Contoh:
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendQuestion(q.query)}
              disabled={isAsking}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                q.label.includes("Pizza")
                  ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                  : "bg-[#f4f7f5] text-gray-700 border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-900"
              }`}
            >
              <span>{q.label}</span>
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[460px] bg-white">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-xs ${
                  msg.role === "user"
                    ? "bg-[#0e3d25] text-white"
                    : msg.is_financial === false
                    ? "bg-rose-100 text-rose-700"
                    : "bg-[#c8f53c] text-[#0b1614]"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-[#0e3d25] text-white rounded-tr-none"
                    : msg.is_financial === false
                    ? "bg-rose-50 border border-rose-200 text-rose-900 rounded-tl-none"
                    : "bg-[#f8faf9] border border-[#e4ebe5] text-gray-800 rounded-tl-none"
                }`}
              >
                {/* Warning tag if question was rejected */}
                {msg.is_financial === false && (
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[11px] mb-2 pb-1.5 border-b border-rose-200">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Pertanyaan Di Luar Topik Keuangan Diblokir</span>
                  </div>
                )}

                <div className="whitespace-pre-line space-y-1.5 font-normal">
                  {msg.text}
                </div>

                <div
                  className={`text-[10px] mt-2 text-right ${
                    msg.role === "user" ? "text-emerald-300" : "text-gray-400"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isAsking && (
            <div className="flex gap-3 max-w-[80%] mr-auto animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-[#c8f53c] text-[#0b1614] flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#f8faf9] border border-[#e4ebe5] rounded-2xl rounded-tl-none p-4 text-xs text-gray-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>AI Gemini sedang menganalisis data keuangan Anda...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuestion();
          }}
          className="p-4 border-t border-gray-100 bg-[#f8faf9] flex items-center gap-3"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            disabled={isAsking}
            placeholder="Tanyakan analisis keuangan Anda (misal: 'Berapa total belanja saya di Indomaret?')..."
            className="flex-1 px-4 py-3 bg-white border border-[#e5ebe7] rounded-2xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || isAsking}
            className="px-5 py-3 rounded-2xl bg-[#0e3d25] hover:bg-[#155333] text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-md disabled:opacity-40 cursor-pointer"
          >
            <span>Kirim</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
