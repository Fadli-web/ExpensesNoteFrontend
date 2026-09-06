"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Receipt,
  TrendingUp,
  PieChart,
  FileSpreadsheet,
  ArrowUpRight,
  ScanLine,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function LandingIntro() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F6F5F2] text-[#161616] font-sans antialiased selection:bg-[#161616] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. FLOATING MINIMALIST PILL NAVBAR (Norma Signature Style) */}
      {/* ========================================================================= */}
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="w-full max-w-5xl bg-white/70 backdrop-blur-xl border border-black/[0.07] rounded-full px-4 sm:px-6 h-14 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#161616] flex items-center justify-center text-white text-[11px] font-semibold">
              E
            </span>
            <span className="text-sm font-semibold tracking-tight uppercase text-[#161616]">
              ExpendNote
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-neutral-500">
            <a href="#about" className="hover:text-black transition-colors">About</a>
            <a href="#benefits" className="hover:text-black transition-colors">Philosophy</a>
            <a href="#services" className="hover:text-black transition-colors">System</a>
            <a href="#contact" className="hover:text-black transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 rounded-full text-xs font-medium text-neutral-600 hover:text-black transition"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-full bg-[#161616] text-white hover:bg-black/85 text-xs font-medium transition shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* ========================================================================= */}
      {/* 2. CINEMATIC HERO (Video / Large Ambient Image + Glass Overlays) */}
      {/* ========================================================================= */}
      <section className="relative pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative w-full h-[76vh] min-h-[580px] rounded-[2.5rem] overflow-hidden bg-[#181818] shadow-2xl border border-black/5 flex items-end p-8 sm:p-14">
          {/* Background Ambient Imagery */}
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&auto=format&fit=crop&q=80"
            alt="ExpendNote ambient interface"
            className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

          {/* Top Glass Badge in Hero */}
          <div className="absolute top-8 left-8 sm:left-12 flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-white text-[12px] font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Autonomous Ledger Engine 2.0
          </div>

          {/* Hero Content Bottom */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end w-full">
            <div className="lg:col-span-8 space-y-4">
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-mono">
                Visionary Financial Ledger
              </p>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light text-white tracking-[-0.04em] leading-[1.05]">
                Get your expenditure <br />
                <span className="font-serif italic font-normal text-neutral-200">in one stream.</span>
              </h1>
            </div>

            <div className="lg:col-span-4 lg:text-right space-y-4">
              <p className="text-sm text-neutral-300 font-light leading-relaxed max-w-sm ml-auto">
                Konversikan setiap struk fisik menjadi metrik terkurasi. Didukung kecerdasan optik Gemini AI tanpa gesekan manual.
              </p>
              <div className="flex lg:justify-end gap-3 pt-2">
                <Link
                  href="/login"
                  className="px-6 py-3 rounded-full bg-white text-[#161616] text-xs font-semibold hover:bg-neutral-100 transition shadow-lg inline-flex items-center gap-2"
                >
                  <span>Initialize System</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. EDITORIAL MARQUEE / METRICS BAR */}
      {/* ========================================================================= */}
      <section className="py-14 border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">Precision</span>
              <p className="text-3xl font-light tracking-tight text-[#161616]">99.4%</p>
              <p className="text-xs text-neutral-500">Optical OCR Accuracy</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">Latency</span>
              <p className="text-3xl font-light tracking-tight text-[#161616]">&lt; 2.4s</p>
              <p className="text-xs text-neutral-500">Receipt parsing speed</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">Volume</span>
              <p className="text-3xl font-light tracking-tight text-[#161616]">150k+</p>
              <p className="text-xs text-neutral-500">Processed entries</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">Indexed</span>
              <p className="text-3xl font-light tracking-tight text-[#161616]">$40M</p>
              <p className="text-xs text-neutral-500">Tracked cash flow</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ASYMMETRIC PHILOSOPHY / ABOUT SECTION */}
      {/* ========================================================================= */}
      <section id="about" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400">
              01 / Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight leading-[1.15]">
              A digital sanctuary <br />
              <span className="font-serif italic font-normal">for everyday expenses.</span>
            </h2>
            <p className="text-neutral-600 text-sm leading-relaxed font-light">
              ExpendNote menghilangkan kebisingan spreadsheet konvensional. Setiap nota belanja, slip pembayaran, dan struk fisik diubah menjadi sistem jurnal yang terorganisasi dan hening.
            </p>

            <div className="pt-4 border-t border-black/[0.06] space-y-4 text-xs font-light text-neutral-700">
              <div className="flex items-start gap-3">
                <span className="font-mono text-neutral-400 text-[11px]">01</span>
                <p><strong className="font-medium text-black">Instant Recognition:</strong> Deteksi pos pengeluaran, PPN, dan diskon secara granular.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-mono text-neutral-400 text-[11px]">02</span>
                <p><strong className="font-medium text-black">Cryptographic Cloud Vault:</strong> Arsip digital tidak pernah pudar layaknya tinta kertas termal.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden bg-[#ECEAE5] p-3 border border-black/5 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1000&auto=format&fit=crop&q=80"
                alt="Architecture view"
                className="w-full h-[480px] object-cover rounded-2xl grayscale-[25%] hover:grayscale-0 transition duration-700"
              />
              <div className="absolute bottom-8 left-8 right-8 p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-neutral-800">Automated Taxonomy Engine</p>
                  <p className="text-[11px] text-neutral-500 font-light">Categorizes every receipt without user intervention</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs">
                  <ScanLine className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. NORMA-STYLE PRODUCT CARDS (Clean Monochrome Minimal Cards) */}
      {/* ========================================================================= */}
      <section id="benefits" className="py-24 bg-[#EFECE6] border-y border-black/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                02 / Core Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-[#161616]">
                Designed with clarity. <br />
                <span className="font-serif italic font-normal">Engineered for precision.</span>
              </h2>
            </div>
            <p className="text-neutral-500 text-xs font-light max-w-xs md:text-right">
              Empat pilar otomasi pengelolaan keuangan mikro dan korporat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Receipt,
                tag: "01 / OCR",
                title: "Optical Capture",
                desc: "Tangkap gambar struk buram sekalipun dengan kalibrasi kontras adaptif.",
              },
              {
                icon: Sparkles,
                tag: "02 / AI",
                title: "Auto-Sorting",
                desc: "Algoritma memisahkan biaya operasional, pajak, dan pengeluaran pribadi.",
              },
              {
                icon: TrendingUp,
                tag: "03 / METRICS",
                title: "Cashflow Pulse",
                desc: "Kurva pengeluaran real-time dengan ambang batas limit preventif.",
              },
              {
                icon: FileSpreadsheet,
                tag: "04 / EXPORT",
                title: "Audit Ready",
                desc: "Ekspor rapi menuju standar CSV, Excel, dan integrasi software akuntansi.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-md rounded-2xl p-7 border border-black/[0.06] hover:border-black/20 transition-all duration-300 flex flex-col justify-between h-72 shadow-sm group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-400">{item.tag}</span>
                    <item.icon className="w-4 h-4 text-neutral-700 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-base font-medium tracking-tight text-neutral-900">{item.title}</h3>
                </div>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. COMPARISON MATRIX (Norma Characteristic Spec Sheet) */}
      {/* ========================================================================= */}
      <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400">
            03 / Specification
          </span>
          <h2 className="text-3xl font-light tracking-tight">Manual vs ExpendNote System</h2>
        </div>

        <div className="rounded-3xl border border-black/[0.08] bg-white overflow-hidden shadow-sm text-xs font-light">
          <div className="grid grid-cols-3 bg-neutral-100/70 p-4 border-b border-black/[0.06] font-mono text-[11px] text-neutral-500">
            <div>DIMENSION</div>
            <div>CONVENTIONAL</div>
            <div className="font-semibold text-black">EXPENDNOTE AI</div>
          </div>
          {[
            { dim: "Data Input", old: "Ketik manual per nota (5-10 menit)", now: "Foto & Ekstraksi AI (<3 detik)" },
            { dim: "Physical Storage", old: "Tumpukan kertas rapuh pudar", now: "Terenkripsi di Cloud Vault" },
            { dim: "Tax Reconciliation", old: "Merekap manual akhir bulan", now: "Ekspor 1-klik siap audit" },
            { dim: "Granular Categorization", old: "Rentan human error", now: "Klasifikasi otomatis 99% akurat" },
          ].map((row, idx) => (
            <div key={idx} className="grid grid-cols-3 p-4 border-b border-black/[0.04] last:border-0 hover:bg-neutral-50/80 transition">
              <div className="font-mono text-neutral-400 text-[11px]">{row.dim}</div>
              <div className="text-neutral-500">{row.old}</div>
              <div className="font-medium text-neutral-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                {row.now}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. CONTACT / INQUIRY (Architectural Glass Form) */}
      {/* ========================================================================= */}
      <section id="contact" className="py-24 bg-[#141414] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-400">
                  04 / Inquiry
                </span>
                <h2 className="text-3xl sm:text-5xl font-light tracking-tight leading-tight">
                  Initiate the <br />
                  <span className="font-serif italic font-normal text-neutral-300">dialogue.</span>
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                  Konsultasikan kebutuhan implementasi API OCR struk atau integrasi finansial korporat Anda.
                </p>
              </div>

              <div className="space-y-3 text-xs font-light text-neutral-300">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
                  <Mail className="w-4 h-4 text-neutral-400" />
                  <span>support@expendnote.id</span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  <span>+62 812-3456-7890</span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  <span>Mon – Fri / 09:00 – 18:00 WIB</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl">
                {formSubmitted ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center mx-auto text-sm font-bold">
                      ✓
                    </div>
                    <p className="text-base font-light">Pesan Terkirim</p>
                    <p className="text-xs text-neutral-400 font-light">
                      Kami akan mengkaji pesan Anda dalam 24 jam kerja.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-5 text-xs font-light">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-neutral-400 uppercase tracking-widest text-[10px] font-mono">Nama</label>
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-white transition"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-neutral-400 uppercase tracking-widest text-[10px] font-mono">Email</label>
                        <input
                          type="email"
                          required
                          placeholder="nama@domain.com"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-white transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-400 uppercase tracking-widest text-[10px] font-mono">Kebutuhan</label>
                      <select className="w-full px-4 py-3 rounded-xl bg-[#1d1d1d] border border-white/10 text-neutral-300 focus:outline-none focus:border-white transition">
                        <option>Integrasi Enterprise & Bisnis</option>
                        <option>Akses Pengguna Individual</option>
                        <option>Konsultasi API OCR</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-400 uppercase tracking-widest text-[10px] font-mono">Pesan</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Deskripsikan kebutuhan Anda..."
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-white transition resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-full bg-white text-black font-medium hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 text-xs"
                    >
                      <span>Submit Inquiry</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. MINIMAL FOOTER */}
      {/* ========================================================================= */}
      <footer className="py-10 bg-[#141414] border-t border-white/[0.08] text-[11px] font-mono text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} EXPENDNOTE CORP. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-300 transition">PRIVACY</a>
            <a href="#" className="hover:text-neutral-300 transition">TERMS</a>
            <a href="#" className="hover:text-neutral-300 transition">SECURITY</a>
          </div>
        </div>
      </footer>
    </div>
  );
} 