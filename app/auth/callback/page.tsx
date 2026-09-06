"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, CheckCircle2, AlertCircle, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { api, storeTokens } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorDetails, setErrorDetails] = useState<string>("");

  useEffect(() => {
    async function handleAuth() {
      try {
        if (typeof window === "undefined") return;

        // 1. Check for error parameters in query string or hash
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));

        const error = urlParams.get("error") || hashParams.get("error");
        const errorDesc =
          urlParams.get("error_description") || hashParams.get("error_description");

        if (error) {
          setStatus("error");
          setErrorMessage(errorDesc || error || "Otentikasi Google dibatalkan atau gagal.");
          if (errorDesc?.toLowerCase().includes("not enabled")) {
            setErrorDetails(
              "Provider Google belum diaktifkan di Supabase Dashboard Anda. Silakan buka Supabase Studio > Authentication > Providers > Google, lalu aktifkan dengan Client ID dan Secret dari Google Cloud Console."
            );
          }
          return;
        }

        // 2. Extract access_token & refresh_token from hash (standard Supabase OAuth Implicit Flow)
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        // 3. Or extract code (PKCE Flow)
        const code = urlParams.get("code");

        if (!accessToken && !code) {
          setStatus("error");
          setErrorMessage("Tidak ditemukan token otentikasi Google yang valid.");
          return;
        }

        let syncRes: any = null;

        if (code) {
          try {
            syncRes = await api.googleOAuth({
              code,
              redirect_uri: `${window.location.origin}/auth/callback`,
            });
          } catch (oauthErr) {
            console.warn("Direct google-oauth failed, trying google-sync fallback:", oauthErr);
            syncRes = await api.syncGoogleAuth({ code });
          }
        } else if (accessToken) {
          syncRes = await api.syncGoogleAuth({
            access_token: accessToken,
            refresh_token: refreshToken || undefined,
          });
        }

        if (syncRes?.session?.access_token) {
          storeTokens(syncRes.session.access_token, syncRes.session.refresh_token);
        } else if (accessToken) {
          storeTokens(accessToken, refreshToken || undefined);
        }

        // 5. Update local auth profile
        await refreshProfile();

        setStatus("success");
        setTimeout(() => {
          router.replace("/dashboard");
        }, 800);
      } catch (err: any) {
        console.error("Callback error:", err);
        setStatus("error");
        setErrorMessage(err.message || "Gagal menyinkronkan data profil akun Google Anda ke server.");
      }
    }

    handleAuth();
  }, [router, refreshProfile]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f0f0f] text-white">
      <div className="max-w-md w-full p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl text-center shadow-2xl">
        {status === "processing" && (
          <div className="space-y-4 animate-fade-in">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <RefreshCw className="w-7 h-7 text-emerald-400 animate-spin" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Menghubungkan Akun Google...
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">
              Memverifikasi identitas Anda dan menyinkronkan profil ke database ExpendNote
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4 animate-fade-in">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Login Berhasil!
            </h2>
            <p className="text-xs text-neutral-300">
              Mengarahkan Anda ke Dashboard...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4 animate-fade-in text-left">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-rose-400" />
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Gagal Memproses Login Google
            </h2>
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-300 font-medium">
              {errorMessage}
            </div>

            {errorDetails && (
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-[11px] text-neutral-300 space-y-1.5 leading-relaxed">
                <p className="font-semibold text-white">Panduan Pengaturan:</p>
                <p>{errorDetails}</p>
                <a
                  href="https://supabase.com/docs/guides/auth/social-login/auth-google"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:underline pt-1"
                >
                  <span>Buka Dokumentasi Supabase Google Auth</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <div className="pt-2">
              <Link
                href="/login"
                className="w-full py-2.5 px-4 bg-white text-black hover:bg-neutral-200 text-xs font-semibold rounded-full transition flex items-center justify-center gap-2 shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Halaman Masuk</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
