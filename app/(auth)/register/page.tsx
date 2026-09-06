"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Validasi format email yang ketat: harus ada @, domain, dan TLD (misal .com, .id)
  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email dan kata sandi wajib diisi");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Format email tidak valid. Pastikan email mengandung domain lengkap, contoh: nama@gmail.com");
      return;
    }
    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await register(email, password, fullName);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Pendaftaran gagal. Silakan coba kembali.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat py-10"
      style={{
        backgroundImage: `url('https://i.pinimg.com/1200x/a4/e6/96/a4e69668d996a344408cc6879124e8ad.jpg')`,
      }}
    >
      {/* Dark Overlay with Blur Effect */}
      <div className="absolute inset-0 bg-[#0f0f0f]/80 backdrop-blur-md" />

      {/* Main Container */}
      <div className="relative z-10 max-w-md w-full animate-fade-in space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-1 shadow-sm border border-white/10">
            <div className="grid grid-cols-2 gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            DAFTAR AKUN BARU
          </h1>
          <p className="text-xs text-neutral-400">
            Mulai kelola pengeluaran dan arsipkan struk belanja Anda secara terpusat
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white/95 backdrop-blur-xl p-7 sm:p-8 rounded-[32px] shadow-2xl border border-white/20">
          {error && (
            <div className="p-3.5 mb-5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="font-medium flex-1">{error}</p>
            </div>
          )}

          {/* Google Sign Up Button */}
          <div className="mb-4">
            <GoogleSignInButton label="Daftar dengan Google" />
          </div>

          <div className="relative flex py-2 items-center mb-3">
            <div className="flex-grow border-t border-neutral-200"></div>
            <span className="flex-shrink mx-3 text-[11px] font-medium text-neutral-400">
              atau daftar dengan email
            </span>
            <div className="flex-grow border-t border-neutral-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Mohammad Faddli"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#f4f4f2] border-none rounded-xl text-xs text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-black/20 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Alamat Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#f4f4f2] border-none rounded-xl text-xs text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-black/20 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Kata Sandi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#f4f4f2] border-none rounded-xl text-xs text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-black/20 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Konfirmasi Kata Sandi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Ketik ulang kata sandi"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#f4f4f2] border-none rounded-xl text-xs text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-black/20 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#111111] hover:bg-black text-white text-xs font-medium rounded-full transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-3 cursor-pointer"
            >
              {isLoading ? (
                <span>Mendaftarkan Akun...</span>
              ) : (
                <>
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer link to Login */}
        <p className="text-center text-xs text-neutral-400">
          Sudah memiliki akun?{" "}
          <Link
            href="/login"
            className="font-medium text-white underline underline-offset-4 hover:text-neutral-200"
          >
            Masuk di Sini
          </Link>
        </p>
      </div>
    </div>
  );
}