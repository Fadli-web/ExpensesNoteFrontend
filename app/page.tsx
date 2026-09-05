"use client";

import React, { useState } from "react";
import Link from "next/link";
import {

  Play,
  Star,
  ChevronDown,
  Layers,
  Sparkles,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
  PieChart,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Zap,
} from "lucide-react";

export default function LandingIntro() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#0b1614] text-white font-sans antialiased selection:bg-[#c8f53c] selection:text-black">
      {/* ========================================================================= */}
      {/* 1. NAVBAR (Persis gaya Optibiz) */}
      {/* ========================================================================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b1614]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#c8f53c] flex items-center justify-center text-[#0b1614] font-black text-sm">
              E
            </div>
            <span className="text-xl font-black tracking-tight text-white lowercase">
              ExpendNote<span className="text-[#c8f53c]">.</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#" className="text-white font-semibold">Home</a>
            <a href="#about" className="hover:text-white transition">About Us</a>
            <a href="#benefits" className="hover:text-white transition">Benefits</a>
            <a href="#services" className="hover:text-white transition">Services</a>

            <a href="#contact" className="hover:text-white transition">Contact Us</a>
          </div>

          {/* Right Button */}
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-full border border-white/20 hover:border-[#c8f53c] text-xs sm:text-sm font-semibold text-white hover:text-[#c8f53c] transition-all font-semibold"
          >
            Mulai
          </Link>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-36 pb-24 lg:pt-44 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#c8f53c]/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Typography & CTAs */}
            <div className="lg:col-span-6 space-y-7">
              <p className="text-xs sm:text-sm font-medium text-[#c8f53c] tracking-wide">
                Welcome To ExpendNote
              </p>

              <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[1.15]">
                Where AI Scans <br />
                Turn Receipts Into <br />
                Real Control
              </h1>

              <p className="text-sm sm:text-base text-gray-400 max-w-lg leading-relaxed">
                Catat seluruh pengeluaran secara otomatis melalui foto struk belanja.
                Didukung Gemini AI OCR berkecepatan tinggi dengan analisa keuangan instan.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex items-center gap-4 pt-2">
                <Link
                  href="/login"
                  className="px-7 py-3.5 rounded-full bg-[#c8f53c] hover:bg-[#b5e230] text-[#0b1614] text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#c8f53c]/20"
                >
                  <span>Mulai Sekarang</span>

                </Link>


              </div>

              {/* Review & Social Proof Bar */}
              <div className="pt-6 flex flex-wrap items-center gap-8 border-t border-white/5">
                <div>
                  <div className="flex items-center gap-1 text-[#c8f53c] text-xs font-bold mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                    <span className="text-gray-400 ml-1 font-normal">(4.9/5)</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">4.9</span>
                    <span className="text-xs text-gray-400">
                      Rating Kepuasan Pengguna
                    </span>
                  </div>
                </div>

                <div className="h-9 w-px bg-white/10 hidden sm:block" />

                <div>
                  <p className="text-xs text-gray-400 mb-1.5 font-medium">
                    Bergabung Bersama Kami:
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
                        alt="User 1"
                        className="w-8 h-8 rounded-full border-2 border-[#0b1614] object-cover"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces"
                        alt="User 2"
                        className="w-8 h-8 rounded-full border-2 border-[#0b1614] object-cover"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces"
                        alt="User 3"
                        className="w-8 h-8 rounded-full border-2 border-[#0b1614] object-cover"
                      />
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[#13221f] border border-white/20 flex items-center justify-center text-xs font-bold text-[#c8f53c]">
                      +
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Images */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-center">
              <div className="relative w-full max-w-[480px]">
                <div className="absolute -top-6 left-6 z-30 flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#13221f]/90 border border-white/10 backdrop-blur-md shadow-xl text-[11px] text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c8f53c] animate-pulse" />
                  <span>Guiding Financial Journey To Elevate Your Destiny</span>
                </div>

                {/* Back Phone Image */}
                <div className="relative z-10 w-[260px] sm:w-[280px] ml-auto mr-4 transform rotate-12 transition-transform hover:rotate-6 duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80"
                    alt="ExpendNote Mobile Dashboard"
                    className="w-full rounded-[2.5rem] shadow-2xl border-4 border-[#1c332e] object-cover aspect-[9/18]"
                  />
                </div>

                {/* Front Phone Image */}
                <div className="absolute -bottom-8 left-2 sm:left-6 z-20 w-[240px] sm:w-[260px] transform -rotate-6 transition-transform hover:rotate-0 duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80"
                    alt="ExpendNote AI Receipt Preview"
                    className="w-full rounded-[2.5rem] shadow-2xl border-4 border-[#1c332e] object-cover aspect-[9/18]"
                  />
                </div>

                {/* Bottom Right Lime Badge */}
                <div className="absolute -bottom-4 right-0 z-30 bg-[#c8f53c] text-[#0b1614] rounded-2xl p-4 sm:p-5 shadow-2xl flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl font-black leading-none">
                    99%
                  </span>
                  <div className="text-[11px] font-bold leading-tight uppercase tracking-wider">
                    AI OCR <br /> Accuracy
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FOUR FEATURE CARDS STRIP */}
      {/* ========================================================================= */}
      <section className="relative z-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#111f1c] border border-white/5 p-4 rounded-3xl">
            {/* Card 1: Video / Image Thumbnail */}
            <div className="relative rounded-2xl overflow-hidden group min-h-[140px] flex items-end p-4">
              <img
                src="https://assets-a1.kompasiana.com/items/album/2024/08/22/tanda-tanya-66c6d742ed641576f0638e22.jpg?t=o&v=770"
                alt="How it works"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="relative z-10">
                <p className="text-xs font-bold text-white">How Does It Work?</p>
                <p className="text-[11px] text-[#c8f53c] flex items-center gap-1 mt-0.5">
                  <span>Pelajari Alur AI</span>

                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-2xl bg-[#142622]/60 border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#1b3630] text-[#c8f53c] flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                Operational Scanning
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Scan struk fisik dalam sekejap tanpa repot mengetik rincian item satu per satu.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-5 rounded-2xl bg-[#142622]/60 border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#1b3630] text-[#c8f53c] flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                Strategy & Budgeting
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Kendalikan pengeluaran harian dan bulanan dengan limit batas aman otomatis.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-5 rounded-2xl bg-[#142622]/60 border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#1b3630] text-[#c8f53c] flex items-center justify-center">
                <PieChart className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                Financial Consulting
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Visualisasi Donut Chart dan ringkasan kategori untuk evaluasi cash flow bisnis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ABOUT US SECTION */}
      {/* ========================================================================= */}
      <section id="about" className="py-24 bg-white text-[#0b1614]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Image Container Murni */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://i.pinimg.com/1200x/3a/9d/3d/3a9d3d4bd555c22b40a9fa824b96cd3d.jpg"
                  alt="ExpendNote Finance Team"
                  className="w-full h-full object-cover aspect-[4/3]"
                />
              </div>
            </div>

            {/* Right: Text & Mission / Vision */}
            <div className="lg:col-span-7 space-y-6">
              <span className="px-3.5 py-1 rounded-full bg-[#e8f7d0] text-[#4d750c] text-xs font-bold uppercase tracking-wider">
                About Us
              </span>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0b1614]">
                The Best Finance <br />
                Assistant In Town
              </h2>

              <p className="text-sm text-gray-500 leading-relaxed">
                ExpendNote diciptakan untuk menyelesaikan masalah struk fisik
                yang menumpuk dan sering hilang. Kami menggabungkan kecerdasan buatan dan
                antarmuka modern untuk memudahkan pengawasan keuangan secara real-time.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0b1614]">
                    <div className="w-7 h-7 rounded-full bg-[#e8f7d0] flex items-center justify-center text-[#4d750c]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span>Company Mission</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Menghadirkan digitalisasi pencatatan struk yang akurat dan hemat waktu bagi semua kalangan.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0b1614]">
                    <div className="w-7 h-7 rounded-full bg-[#e8f7d0] flex items-center justify-center text-[#4d750c]">
                      <Layers className="w-4 h-4" />
                    </div>
                    <span>Company Vision</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Menjadi platform pelacak pengeluaran nomor satu yang dipercaya oleh UMKM dan profesional.
                  </p>
                </div>
              </div>

              {/* Dark Banner Callout */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0b1614] text-white flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <p className="text-xs text-gray-300 leading-normal max-w-md">
                  Join us to achieve sustainable financial growth and reach your goals with the right tools.
                </p>
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-full bg-[#c8f53c] text-[#0b1614] text-xs font-bold hover:bg-[#b5e230] transition shrink-0 flex items-center gap-1.5"
                >
                  <span>Learn More</span>

                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. STATS BAR */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            <div className="border-l-2 border-[#c8f53c] pl-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#0b1614]">
                25<span className="text-[#84b518]">+</span>
              </p>
              <p className="text-xs text-gray-500 leading-snug">
                Fitur pintar dan integrasi AI yang siap pakai.
              </p>
            </div>

            <div className="border-l-2 border-[#c8f53c] pl-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#0b1614]">
                150K<span className="text-[#84b518]">+</span>
              </p>
              <p className="text-xs text-gray-500 leading-snug">
                Struk transaksi sukses dianalisis oleh AI.
              </p>
            </div>

            <div className="border-l-2 border-[#c8f53c] pl-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#0b1614]">
                98%
              </p>
              <p className="text-xs text-gray-500 leading-snug">
                Tingkat kepuasan dan efisiensi waktu pengguna.
              </p>
            </div>

            <div className="border-l-2 border-[#c8f53c] pl-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#0b1614]">
                $40M<span className="text-[#84b518]">+</span>
              </p>
              <p className="text-xs text-gray-500 leading-snug">
                Akumulasi pengeluaran yang terpantau rapi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. BENEFITS SECTION (Baru: Desain Elegan Foto + Poin Keuntungan) */}
      {/* ========================================================================= */}
      <section id="benefits" className="py-24 bg-[#0e1c19] border-b border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content: Headlines & Feature Checklist */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <span className="px-3.5 py-1 rounded-full bg-[#1b3630] text-[#c8f53c] text-xs font-bold uppercase tracking-wider border border-[#c8f53c]/20">
                  Why Choose Us
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                  Maximize Financial Clarity <br />
                  With Zero Extra Effort
                </h2>
                <p className="text-sm sm:text-base text-gray-400 max-w-xl leading-relaxed">
                  ExpendNote menyingkirkan kerumitan pembukuan manual sehingga Anda dapat fokus mengembangkan bisnis dan menjaga kesehatan arus kas pribadi.
                </p>
              </div>

              {/* Benefit Points 2x2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="p-5 rounded-2xl bg-[#142622]/70 border border-white/5 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#c8f53c]/10 text-[#c8f53c] flex items-center justify-center font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Scan Instan 3 Detik</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    AI membaca nama toko, total belanja, dan tanggal secara real-time tanpa delay.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#142622]/70 border border-white/5 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#c8f53c]/10 text-[#c8f53c] flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Kategorisasi Otomatis</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Setiap struk otomatis dikelompokkan ke pos anggaran yang sesuai tanpa perlu dipilih manual.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#142622]/70 border border-white/5 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#c8f53c]/10 text-[#c8f53c] flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Cloud Receipt Vault</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Arsip foto struk tersimpan abadi di cloud storage, aman dari tinta pudar dan kerusakan fisik.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#142622]/70 border border-white/5 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#c8f53c]/10 text-[#c8f53c] flex items-center justify-center font-bold">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Laporan Siap Pajak</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Ekspor seluruh data transaksi ke file spreadsheet CSV sekali klik untuk akuntan atau audit.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Pure Image Showcase (Bisa kamu ganti fotonya) */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
                {/* GANTI SRC DENGAN FOTO BENEFIT / PRODUCT PREVIEW */}
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80"
                  alt="ExpendNote Productivity"
                  className="w-full h-[460px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1614] via-transparent to-transparent" />

                {/* Floating Lime Card on Image */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#0b1614]/90 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#c8f53c]">Hemat Waktu Hingga 85%</p>
                    <p className="text-[11px] text-gray-300">Dibanding pencatatan bon kertas biasa</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#c8f53c] flex items-center justify-center text-[#0b1614] font-black text-xs">
                    ✓
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. OUR SERVICES / GRID GAMBAR */}
      {/* ========================================================================= */}
      <section id="services" className="py-24 bg-white text-[#0b1614]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <span className="px-3.5 py-1 rounded-full bg-[#e8f7d0] text-[#4d750c] text-xs font-bold uppercase tracking-wider">
                Our Services
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0b1614]">
                Financial Services To Grow And Secure Your Wealth
              </h2>
            </div>
            <Link
              href="/login"
              className="px-6 py-3 rounded-full bg-[#c8f53c] text-[#0b1614] text-xs font-bold hover:bg-[#b5e230] transition flex items-center gap-2 self-start md:self-end"
            >
              <span>Explore All</span>

            </Link>
          </div>

          {/* 3 Grid Gambar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Service Image 1 */}
            <div className="relative rounded-3xl overflow-hidden group shadow-lg">
              <img
                src="https://i.pinimg.com/1200x/d1/9f/bd/d19fbd28dc4dd1e993a98e027e44fc30.jpg"
                alt="Business Strategy"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="py-2.5 px-4 rounded-xl bg-[#0b1614]/90 backdrop-blur-md border border-white/10 text-white text-xs font-bold flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#c8f53c]" />
                  <span>OCR Receipt Vault</span>
                </div>
              </div>
            </div>

            {/* Service Image 2 */}
            <div className="relative rounded-3xl overflow-hidden group shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80"
                alt="Taxes & Accounting"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="py-2.5 px-4 rounded-xl bg-[#0b1614]/90 backdrop-blur-md border border-white/10 text-white text-xs font-bold flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#c8f53c]" />
                  <span>Taxes & CSV Export</span>
                </div>
              </div>
            </div>

            {/* Service Image 3 */}
            <div className="relative rounded-3xl overflow-hidden group shadow-lg sm:col-span-2 lg:col-span-1">
              <img
                src="https://i.pinimg.com/736x/7d/d2/6f/7dd26fd8157c4e802faa0e2b9eed5844.jpg"
                alt="Financial Planning"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="py-2.5 px-4 rounded-xl bg-[#0b1614]/90 backdrop-blur-md border border-white/10 text-white text-xs font-bold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#c8f53c]" />
                  <span>Financial Planning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. CONTACT US SECTION (Baru: Detail Kontak + Form Pesan Modern) */}
      {/* ========================================================================= */}
      <section id="contact" className="py-24 bg-[#0b1614] border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Contact Details & Image Card */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="px-3.5 py-1 rounded-full bg-[#13221f] text-[#c8f53c] text-xs font-bold uppercase tracking-wider border border-[#c8f53c]/20">
                  Get In Touch
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                  Let’s Discuss Your <br />
                  Financial Journey
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Punya pertanyaan seputar integrasi AI OCR atau butuh bantuan setup akun bisnis? Tim kami siap merespons pesan Anda dalam 24 jam.
                </p>
              </div>

              {/* Info Cards */}
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#111f1c] border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-[#1b3630] text-[#c8f53c] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">Kirim Email</p>
                    <p className="text-xs font-bold text-white">support@expendnote.id</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#111f1c] border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-[#1b3630] text-[#c8f53c] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">WhatsApp / Telepon</p>
                    <p className="text-xs font-bold text-white">+62 812-3456-7890</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#111f1c] border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-[#1b3630] text-[#c8f53c] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">Lokasi Kantor</p>
                    <p className="text-xs font-bold text-white">Jakarta Selatan, Indonesia</p>
                  </div>
                </div>
              </div>

              {/* Compact Photo Banner */}
              <div className="relative rounded-2xl overflow-hidden h-36 border border-white/10 shadow-xl">
                {/* GANTI SRC DENGAN FOTO KANTOR / LOKASI */}
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80"
                  alt="Office Desk"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#0b1614]/60 backdrop-blur-[2px] flex items-center px-6 gap-3">
                  <Clock className="w-6 h-6 text-[#c8f53c] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">Jam Operasional Tim</p>
                    <p className="text-[11px] text-gray-300">Senin - Jumat: 09:00 - 18:00 WIB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="p-7 sm:p-9 rounded-3xl bg-[#111f1c] border border-white/5 shadow-2xl space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Kirim Pesan Langsung</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Isi formulir singkat di bawah ini dan kami akan segera menghubungi Anda.
                  </p>
                </div>

                {formSubmitted ? (
                  <div className="p-6 rounded-2xl bg-[#15382b] border border-[#c8f53c]/30 text-center space-y-2 animate-fade-in">
                    <div className="w-10 h-10 rounded-full bg-[#c8f53c] text-[#0b1614] flex items-center justify-center mx-auto font-black">
                      ✓
                    </div>
                    <p className="text-sm font-bold text-white">Pesan Anda Berhasil Terkirim!</p>
                    <p className="text-xs text-gray-300">
                      Terima kasih telah menghubungi ExpendNote. Tim kami akan membalas ke email Anda.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300">Nama Lengkap</label>
                        <input
                          type="text"
                          required
                          placeholder="Mohammad Faddli"
                          className="w-full px-4 py-3 rounded-xl bg-[#0b1614] border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#c8f53c] transition"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-300">Alamat Email</label>
                        <input
                          type="email"
                          required
                          placeholder="nama@email.com"
                          className="w-full px-4 py-3 rounded-xl bg-[#0b1614] border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#c8f53c] transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300">Kategori Pesan</label>
                      <select
                        className="w-full px-4 py-3 rounded-xl bg-[#0b1614] border border-white/10 text-xs text-gray-300 focus:outline-none focus:border-[#c8f53c] transition"
                      >
                        <option>Pertanyaan Umum & Fitur AI</option>
                        <option>Dukungan Teknis Struk Belanja</option>
                        <option>Kerja Sama / Akun Bisnis</option>
                        <option>Saran & Feedback Aplikasi</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300">Pesan Anda</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Tuliskan pesan atau pertanyaan Anda di sini..."
                        className="w-full px-4 py-3 rounded-xl bg-[#0b1614] border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#c8f53c] transition resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-xl bg-[#c8f53c] hover:bg-[#b5e230] text-[#0b1614] text-xs sm:text-sm font-bold transition-all shadow-lg shadow-[#c8f53c]/20 flex items-center justify-center gap-2"
                    >
                      <span>Kirim Pesan Sekarang</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FOOTER MINIMALIS */}
      {/* ========================================================================= */}
      <footer className="py-8 bg-[#0b1614] border-t border-white/5 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Expendnote Expenses Note. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300 transition">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}