"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Scan,
  CheckCircle2,
  Mail,
  Phone,
  Clock,
  Menu,
  X,
} from "lucide-react";

export default function LandingIntro() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.firstElementChild?.clientWidth || 300;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -cardWidth - 24 : cardWidth + 24,
        behavior: "smooth",
      });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans antialiased selection:bg-black selection:text-white overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. FLOATING PILL NAVBAR + MOBILE RESPONSIVE DRAWER */}
      {/* ========================================================================= */}
      <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-3 sm:px-4">
        <nav className="w-full max-w-5xl bg-white/80 backdrop-blur-2xl border border-black/[0.07] rounded-full px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between shadow-[0_4px_28px_rgba(0,0,0,0.04)] transition-all">
          <Link href="/" className="font-semibold text-xs tracking-wider uppercase text-black shrink-0">
            ExpendNote
          </Link>

          <div className="hidden md:flex items-center gap-7 text-xs font-medium text-neutral-500">
            <a href="#how-it-works" className="hover:text-black transition">How it works</a>
            <a href="#philosophy" className="hover:text-black transition">Architecture</a>
            <a href="#presets" className="hover:text-black transition">Presets</a>
            <a href="#contact" className="hover:text-black transition">Inquiry</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden lg:inline-block text-[11px] font-mono text-neutral-400">ID / EN</span>
            <Link
              href="/login"
              className="px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black text-white hover:bg-neutral-800 text-[11px] sm:text-xs font-medium transition shadow-sm"
            >
              Start Free
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full text-neutral-700 hover:text-black md:hidden"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-3 top-16 z-40 p-5 rounded-3xl bg-white/95 backdrop-blur-2xl border border-black/[0.08] shadow-2xl md:hidden space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col space-y-3 text-sm font-medium text-neutral-700">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-neutral-100 transition"
            >
              How it works
            </a>
            <a
              href="#philosophy"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-neutral-100 transition"
            >
              Architecture
            </a>
            <a
              href="#presets"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-neutral-100 transition"
            >
              Presets
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-neutral-100 transition"
            >
              Inquiry
            </a>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CINEMATIC VIDEO HERO */}
      {/* ========================================================================= */}
      <section className="pt-20 sm:pt-24 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative w-full min-h-[580px] sm:min-h-[640px] lg:h-[84vh] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-black shadow-2xl border border-black/5 flex flex-col justify-between p-6 sm:p-10 lg:p-14">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-55 mix-blend-screen scale-105 pointer-events-none"
          >
            <source
              src="https://video-previews.elements.envatousercontent.com/07a9bf0b-16fe-4114-832c-90d26b54051d/watermarked_preview/watermarked_preview.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/50" />

          {/* Top Pill Chip */}
          <div className="relative z-10 self-start">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-white text-[10px] sm:text-[11px] font-medium tracking-wide">
              Free cloud synchronization on all accounts
            </div>
          </div>

          {/* Center Content Split */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-end my-auto lg:my-0">
            <div className="lg:col-span-7 space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-normal text-white tracking-[-0.04em] leading-[1.06]">
                Cut your expense clutter. <br />
                <span className="font-serif italic text-neutral-200 font-light">In one scan.</span>
              </h1>
            </div>

            <div className="lg:col-span-5 space-y-5 sm:space-y-6">
              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed max-w-md">
                Sebuah sistem pencatatan cerdas. Arahkan kamera ke struk transaksi belanja, dan seluruh rincian pos anggaran tertata rapi — tanpa ketik manual selamanya.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition shadow-sm"
                >
                  Quick start
                </Link>
                <a
                  href="#how-it-works"
                  className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-white text-xs font-medium hover:bg-white/20 transition"
                >
                  What are the features
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Batch Status Chip */}
          <div className="relative z-10 flex justify-center pt-4">
            <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-neutral-300 text-[10px] sm:text-[11px] flex items-center gap-2 text-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>Gemini Vision AI Engine aktif. Kompatibel dengan nota cetak & digital.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. HOW IT WORKS */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 sm:mb-14 space-y-3 transition-all duration-700 reveal-on-scroll opacity-0 translate-y-8">
          <h2 className="text-2xl sm:text-4xl font-normal tracking-tight">How it works.</h2>
          <p className="text-neutral-500 text-xs sm:text-sm font-light leading-relaxed">
            Konfigurasikan preferensi anggaran Anda sekali, lalu biarkan sistem AI mengerjakan sisanya — satu foto struk untuk membaca, mengelompokkan, dan mengarsipkannya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 transition-all duration-700 delay-100 reveal-on-scroll opacity-0 translate-y-8">
          {/* Card 1 */}
          <div className="rounded-3xl bg-white border border-black/[0.07] p-6 sm:p-7 flex flex-col justify-between min-h-[440px] sm:min-h-[470px] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="space-y-3 sm:space-y-4">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-black/15 text-xs font-mono">
                1
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-medium tracking-tight">Tentukan pos anggaran</h3>
                <p className="text-xs text-neutral-500 font-light mt-1">Pilih kategori pengeluaran Anda satu kali.</p>
              </div>
            </div>

            <div className="mt-6 bg-[#F6F5F2] border border-black/[0.06] rounded-2xl p-4 space-y-2.5 shadow-inner">
              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
                <span>PRESET ANGGARAN</span>
                <span>AUTO</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-black/5 text-xs flex justify-between items-center">
                <span>Kebutuhan Pokok</span>
                <span className="text-[10px] font-mono text-neutral-400">50%</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-black/5 text-xs flex justify-between items-center">
                <span>Operasional Bisnis</span>
                <span className="text-[10px] font-mono text-neutral-400">30%</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-black/5 text-xs flex justify-between items-center">
                <span>Tabungan & Invest</span>
                <span className="text-[10px] font-mono text-neutral-400">20%</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl bg-white border border-black/[0.07] p-6 sm:p-7 flex flex-col justify-between min-h-[440px] sm:min-h-[470px] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="space-y-3 sm:space-y-4">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-black/15 text-xs font-mono">
                2
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-medium tracking-tight">Foto struk transaksi</h3>
                <p className="text-xs text-neutral-500 font-light mt-1">Cukup arahkan kamera ke bon fisik atau PDF.</p>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[210px] h-[240px] sm:h-[260px] bg-neutral-900 rounded-t-[2.2rem] p-3 border-x-4 border-t-4 border-neutral-700 shadow-2xl flex flex-col items-center justify-center text-center">
              <div className="w-10 h-1 rounded-full bg-neutral-600 mb-6" />
              <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-3 animate-pulse">
                <Scan className="w-6 h-6" />
              </div>
              <p className="text-[11px] text-white font-medium">Ready to Scan</p>
              <p className="text-[9px] text-neutral-400">Pegang struk di depan lensa</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl bg-white border border-black/[0.07] p-6 sm:p-7 flex flex-col justify-between min-h-[440px] sm:min-h-[470px] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="space-y-3 sm:space-y-4">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-black/15 text-xs font-mono">
                3
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-medium tracking-tight">Terdata otomatis</h3>
                <p className="text-xs text-neutral-500 font-light mt-1">Angka tersusun rapi tanpa sisa kertas.</p>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[210px] h-[240px] sm:h-[260px] bg-[#1a1a1a] rounded-t-[2.2rem] p-3 border-x-4 border-t-4 border-neutral-700 shadow-2xl flex flex-col justify-between text-white">
              <div className="w-10 h-1 rounded-full bg-neutral-600 mx-auto" />
              <div className="space-y-2 py-4">
                <div className="flex items-center gap-1.5 text-emerald-400 text-[10px]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Struk Terverifikasi</span>
                </div>
                <p className="text-xs font-semibold">Rp 148.500</p>
                <p className="text-[10px] text-neutral-400">Kopi & Konsumsi • Hari ini</p>
              </div>
              <div className="w-full py-1.5 rounded-lg bg-white/10 text-center text-[10px] text-neutral-300">
                Selesai
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-10 sm:mt-12 text-xs">
          <span className="text-neutral-400 font-light text-center w-full sm:w-auto mb-1 sm:mb-0">
            Atau input langsung dari:
          </span>
          <span className="px-3.5 py-1 rounded-full bg-neutral-100 border border-black/5 text-neutral-700 font-medium text-[11px] sm:text-xs">
            Kamera Ponsel
          </span>
          <span className="px-3.5 py-1 rounded-full bg-neutral-100 border border-black/5 text-neutral-700 font-medium text-[11px] sm:text-xs">
            Unggah File Foto Struk
          </span>
          <span className="px-3.5 py-1 rounded-full bg-neutral-100 border border-black/5 text-neutral-700 font-medium text-[11px] sm:text-xs">
            Ekspor Spreadsheet
          </span>
        </div>

        <div className="flex justify-center mt-6">
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-medium transition inline-flex items-center gap-2 shadow-sm"
          >
            <span>Mulai Uji Coba Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. METRIC STATS SHOWCASE */}
      {/* ========================================================================= */}
      <section id="philosophy" className="py-10 sm:py-12 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-black shadow-2xl border border-black/10 p-6 sm:p-10 lg:p-14 min-h-[580px] flex flex-col justify-between transition-all duration-700 reveal-on-scroll opacity-0 translate-y-8">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen scale-105 pointer-events-none"
          >
            <source
              src="https://media.gettyimages.com/id/2193248885/video/senior-businesswoman-providing-financial-advice-to-businessman.mp4?s=mp4-640x640-gi&k=20&c=Ahjfvmn1QkjRs9kWj94a31Mf0nmfUGF07ffDHnKXek0="
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/95 via-black/75 to-black/40" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-6 space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight leading-[1.15]">
                Your finance is engineered <br />
                <span className="font-serif italic font-normal text-neutral-300">for chaos.</span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-md">
                Tinta bon belanja yang pudar, struk yang terselip di saku celana, dan rekap manual di akhir bulan selalu menghabiskan waktu berharga Anda.
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-5 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/15 text-white space-y-1 shadow-lg">
                <p className="text-2xl sm:text-4xl font-light tracking-tight">220+</p>
                <p className="text-[10px] sm:text-[11px] text-neutral-400 font-light">lembar struk terbuang tiap bulan</p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/15 text-white space-y-1 shadow-lg">
                <p className="text-2xl sm:text-4xl font-light tracking-tight">150</p>
                <p className="text-[10px] sm:text-[11px] text-neutral-400 font-light">menit terbuang untuk pembukuan</p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/15 text-white space-y-1 shadow-lg">
                <p className="text-2xl sm:text-4xl font-light tracking-tight">&lt; 3s</p>
                <p className="text-[10px] sm:text-[11px] text-neutral-400 font-light">waktu pindai bersama ExpendNote</p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/15 text-white space-y-1 shadow-lg">
                <p className="text-2xl sm:text-4xl font-light tracking-tight">100%</p>
                <p className="text-[10px] sm:text-[11px] text-neutral-400 font-light">arsip digital abadi di cloud</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 sm:pt-10 flex flex-wrap items-center gap-3">
            <a
              href="#presets"
              className="px-4 sm:px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs font-medium hover:bg-white/20 transition inline-flex items-center gap-2"
            >
              <span>See workflow preview</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
            <Link
              href="/login"
              className="px-4 sm:px-5 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition inline-flex items-center gap-1.5"
            >
              <span>Try OCR engine</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. MAKE ROOM FOR WHAT MATTERS */}
      {/* ========================================================================= */}
      <section id="presets" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4 sm:gap-6 transition-all duration-700 reveal-on-scroll opacity-0 translate-y-8">
          <div className="space-y-2 sm:space-y-3 max-w-xl">
            <h2 className="text-2xl sm:text-4xl font-normal tracking-tight">
              What can be Noted? <br />
              <span className="font-serif italic font-normal">for you.</span>
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm font-light leading-relaxed">
              Berikut beberapa jenis struk yang bisa Anda catat menggunakan ExpendNote
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => scrollCarousel("left")}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-black/10 bg-white hover:bg-neutral-100 flex items-center justify-center text-black transition shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollCarousel("right")}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-black/10 bg-white hover:bg-neutral-100 flex items-center justify-center text-black transition shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory transition-all duration-700 reveal-on-scroll opacity-0 translate-y-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {[
            {
              title: "Business Trip",
              count: "Nota tol & hotel",
              desc: "Kumpulkan bon dinas luar kota otomatis untuk klaim reimbursement tanpa pusing.",
              image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
            },
            {
              title: "Daily Commute",
              count: "Tiket & ride-hail",
              desc: "Simpan riwayat tiket transit, ojek online, dan bensin tanpa struk yang tercecer.",
              image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80",
            },
            {
              title: "Culinary & Coffee",
              count: "Struk resto & kafe",
              desc: "Klasifikasi otomatis bon makan siang, nongkrong, dan camilan ke pos gaya hidup.",
              image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80",
            },
            {
              title: "Study & Courses",
              count: "Buku & materi digital",
              desc: "Pantau pengeluaran self-improvement dan langganan software secara presisi.",
              image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
            },
            {
              title: "Home & Grocery",
              count: "Belanja bulanan",
              desc: "Cek detail belanja supermarket hingga ke item diskon dan rincian pajaknya.",
              image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="w-[260px] sm:w-[300px] md:w-[320px] shrink-0 snap-start space-y-3 group cursor-pointer"
            >
              <div className="relative h-[320px] sm:h-[380px] rounded-3xl overflow-hidden bg-neutral-200 border border-black/5 shadow-sm">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-3 right-3 sm:bottom-5 sm:left-4 sm:right-4 p-2 sm:p-2.5 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white flex items-center justify-between text-xs px-3.5 sm:px-4">
                  <span className="font-medium text-[11px] sm:text-xs">{card.title}</span>
                  <span className="text-[9px] sm:text-[10px] font-mono text-neutral-300">{card.count}</span>
                </div>
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-500 font-light leading-relaxed px-1">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CONTACT / INQUIRY */}
      {/* ========================================================================= */}
      <section id="contact" className="py-20 sm:py-24 bg-[#111111] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start transition-all duration-700 reveal-on-scroll opacity-0 translate-y-8">
            <div className="lg:col-span-5 space-y-5 sm:space-y-6">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                Contact
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-tight">
                Get in touch with <br />
                <span className="font-serif italic font-normal text-neutral-300">our team.</span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                Punya pertanyaan integrasi OCR struk skala besar atau ingin berdiskusi seputar keamanan data Anda?
              </p>

              <div className="space-y-2.5 text-xs font-light text-neutral-300 pt-2">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span className="truncate">support@expendnote.id</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>+62 812-3456-7890</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>Senin – Jumat / 09:00 – 18:00 WIB</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 lg:p-9 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-2xl">
                {formSubmitted ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center mx-auto text-sm font-bold">
                      ✓
                    </div>
                    <p className="text-sm sm:text-base font-light">Pesan Berhasil Terkirim</p>
                    <p className="text-xs text-neutral-400 font-light">
                      Tim kami akan merespons melalui email dalam 24 jam kerja.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 text-xs font-light">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                      <div className="space-y-1.5">
                        <label className="text-neutral-400 uppercase tracking-widest text-[10px] font-mono">Nama</label>
                        <input
                          type="text"
                          required
                          placeholder="Nama lengkap"
                          className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-white transition"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-neutral-400 uppercase tracking-widest text-[10px] font-mono">Email</label>
                        <input
                          type="email"
                          required
                          placeholder="nama@email.com"
                          className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-white transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-400 uppercase tracking-widest text-[10px] font-mono">Kebutuhan</label>
                      <select className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#1c1c1c] border border-white/10 text-neutral-300 focus:outline-none focus:border-white transition">
                        <option>Pertanyaan Fitur Scan AI</option>
                        <option>Akun Bisnis & UMKM</option>
                        <option>Konsultasi Keamanan & Cloud</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-400 uppercase tracking-widest text-[10px] font-mono">Pesan</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Tuliskan pesan Anda..."
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-white transition resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 sm:py-3.5 px-6 rounded-full bg-white text-black font-medium hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 text-xs"
                    >
                      <span>Kirim Formulir</span>
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
      {/* 7. FOOTER */}
      {/* ========================================================================= */}
      <footer className="py-8 bg-[#111111] border-t border-white/[0.07] text-[10px] sm:text-[11px] font-mono text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} EXPENDNOTE. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-4 sm:gap-6">
            <a href="#" className="hover:text-neutral-300 transition">PRIVACY</a>
            <a href="#" className="hover:text-neutral-300 transition">TERMS</a>
            <a href="#" className="hover:text-neutral-300 transition">STATUS</a>
          </div>
        </div>
      </footer>
    </div>
  );
}