"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Camera,
  CheckCircle2,
  AlertCircle,
  Server,
  RefreshCw,
  SlidersHorizontal,
  Shield,
  Save,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const {
    user,
    updateProfile,
    changePassword,
    uploadAvatar,
    apiUrl,
    updateApiUrl,
    backendHealth,
    checkHealth,
  } = useAuth();

  // Profile fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Avatar upload
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  // API Config
  const [customApiUrl, setCustomApiUrl] = useState(apiUrl);
  const [isCheckingApi, setIsCheckingApi] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setEmail(user.email || "");
    }
    setCustomApiUrl(apiUrl);
  }, [user, apiUrl]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileError("");
    setProfileSuccess(false);

    try {
      await updateProfile(fullName, email);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 4000);
    } catch (err: any) {
      setProfileError(err.message || "Gagal memperbarui profil");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordError("Password baru harus minimal 8 karakter");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password baru tidak cocok");
      return;
    }

    setIsSavingPassword(true);
    setPasswordError("");
    setPasswordSuccess(false);

    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err: any) {
      setPasswordError(err.message || "Gagal mengganti password");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleAvatarChange = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setAvatarError("Harap pilih file gambar (JPEG/PNG/WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Ukuran foto maksimal 5MB");
      return;
    }

    setIsUploadingAvatar(true);
    setAvatarError("");
    try {
      await uploadAvatar(file);
    } catch (err: any) {
      setAvatarError(err.message || "Gagal mengunggah foto profil");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveApiUrl = async () => {
    setIsCheckingApi(true);
    updateApiUrl(customApiUrl);
    await checkHealth();
    setIsCheckingApi(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
          ACCOUNT SETTINGS
        </span>
        <h2 className="text-2xl font-bold text-[#111111] tracking-tight">
          Profil & Pengaturan
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Kelola informasi akun Anda, keamanan kata sandi, dan konfigurasi API server
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-[28px] border border-black/[0.06] p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xs">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-[#111111] text-white flex items-center justify-center text-3xl font-bold overflow-hidden shadow-sm">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name || "Profile"}
                className="w-full h-full object-cover"
              />
            ) : (
              (user?.full_name?.charAt(0) || "A").toUpperCase()
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-2 bg-[#111111] text-white rounded-full hover:bg-black cursor-pointer transition shadow-md">
            <Camera className="w-4 h-4" />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => e.target.files?.[0] && handleAvatarChange(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>

        <div className="text-center sm:text-left space-y-1 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="text-lg font-bold text-[#111111]">
              {user?.full_name || user?.email?.split("@")[0] || "Pengguna"}
            </h3>
          </div>
          <p className="text-xs text-neutral-500 flex items-center justify-center sm:justify-start gap-1.5">
            <Mail className="w-3.5 h-3.5 text-neutral-400" />
            <span>{user?.email || "-"}</span>
          </p>
          <p className="text-[11px] text-emerald-700 font-medium pt-1">
            Status Akun: Terverifikasi & Aktif
          </p>
          {isUploadingAvatar && (
            <p className="text-xs text-neutral-600 font-medium animate-pulse">
              Mengunggah avatar baru...
            </p>
          )}
          {avatarError && <p className="text-xs text-rose-500 font-medium">{avatarError}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Update Profile Form */}
        <div className="bg-white rounded-[28px] border border-black/[0.06] p-6 space-y-4 shadow-xs">
          <h4 className="text-sm font-bold text-[#111111] flex items-center gap-2">
            <User className="w-4 h-4 text-neutral-600" />
            <span>Informasi Personal</span>
          </h4>

          {profileSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Profil berhasil diperbarui!</span>
            </div>
          )}

          {profileError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl">
              {profileError}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f4f4f2] border-none rounded-xl text-xs text-[#111111] focus:outline-none focus:bg-white focus:ring-1 focus:ring-black/20 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f4f4f2] border-none rounded-xl text-xs text-[#111111] focus:outline-none focus:bg-white focus:ring-1 focus:ring-black/20 transition"
              />
              <p className="text-[10px] text-neutral-400 mt-1">
                Perubahan email akan membutuhkan verifikasi ke alamat baru.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSavingProfile}
              className="w-full py-2.5 px-4 bg-[#111111] hover:bg-black text-white text-xs font-medium rounded-full transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingProfile ? "Menyimpan..." : "Perbarui Profil"}</span>
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white rounded-[28px] border border-black/[0.06] p-6 space-y-4 shadow-xs">
          <h4 className="text-sm font-bold text-[#111111] flex items-center gap-2">
            <Lock className="w-4 h-4 text-neutral-600" />
            <span>Ganti Kata Sandi</span>
          </h4>

          {passwordSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Kata sandi berhasil diganti!</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl">
              {passwordError}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Password Saat Ini
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f4f4f2] border-none rounded-xl text-xs text-[#111111] focus:outline-none focus:bg-white focus:ring-1 focus:ring-black/20 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Password Baru (Min. 8 Karakter)
              </label>
              <input
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f4f4f2] border-none rounded-xl text-xs text-[#111111] focus:outline-none focus:bg-white focus:ring-1 focus:ring-black/20 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f4f4f2] border-none rounded-xl text-xs text-[#111111] focus:outline-none focus:bg-white focus:ring-1 focus:ring-black/20 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isSavingPassword}
              className="w-full py-2.5 px-4 bg-[#111111] hover:bg-black text-white text-xs font-medium rounded-full transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isSavingPassword ? "Memproses..." : "Update Password"}</span>
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
