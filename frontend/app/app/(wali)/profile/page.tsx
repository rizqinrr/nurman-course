/* Hallmark · genre: playful-glassmorphism · design-system: design.md · designed-as-app */
"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";
import { useLogout } from "@/lib/useLogout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { 
  User, 
  Phone, 
  Mail, 
  GraduationCap, 
  LogOut,
  ChevronLeft,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

interface DbMurid {
  id: string;
  name: string;
  schoolLevel?: string | null;
  avatarUrl?: string | null;
  photoPath?: string | null;
}

interface UserProfile {
  name: string;
  phone: string;
  email: string | null;
  murids: DbMurid[];
}

export default function ProfilePage() {
  const { askLogout, logoutDialog } = useLogout();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);
    if (newPassword.length < 6) {
      setPwError("Password minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Konfirmasi password tidak sama.");
      return;
    }
    setUpdating(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPwError(error.message || "Gagal mengubah password.");
        return;
      }
      setPwSuccess("Password berhasil diubah.");
      setNewPassword("");
      setConfirmPassword("");
      setShowPw(false);
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Gagal mengubah password.");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await apiFetch<{ user: UserProfile }>("/api/users/me");
        setProfile(res.user);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full flex-grow flex flex-col gap-6 items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#4a70a9] animate-spin"></div>
        <p className="text-sm font-semibold text-gray-600">Memuat profil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full flex-grow flex flex-col gap-6">
        <GlassCard className="p-8 text-center text-gray-600 border border-white/85 shadow-sm">
          <p className="font-bold">Gagal memuat profil</p>
          <p className="text-sm text-gray-500 mt-1">Silakan coba beberapa saat lagi.</p>
        </GlassCard>
      </div>
    );
  }

  const child = profile.murids[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full flex-grow flex flex-col gap-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Header */}
      <header className="flex items-center gap-4 bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl p-6 relative">
        <Link 
          href="/app/dashboard"
          className="p-2.5 rounded-xl hover:bg-white/50 text-gray-600 transition-colors border border-transparent hover:border-white/50 active:scale-95"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight font-sans">
            Profil Saya
          </h1>
          <p className="text-sm text-gray-600">
            Detail akun wali murid Nurman Course
          </p>
        </div>
      </header>

      {/* Profile Details */}
      <GlassCard className="p-6 sm:p-8 flex flex-col gap-6 border border-white/80 shadow-xl">
        {/* Avatar Placeholder (Child) */}
        <div className="flex flex-col items-center gap-3 border-b border-gray-200/50 pb-6">
          {child && (child.photoPath || child.avatarUrl) ? (
            <img 
              src={child.photoPath || child.avatarUrl || ""} 
              alt={child?.name || "Foto Anak"} 
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#4a70a9]/10 border-2 border-white flex items-center justify-center text-[#4a70a9] shadow-inner">
              <GraduationCap size={40} />
            </div>
          )}
          <h2 className="text-xl font-bold text-gray-800">{child?.name || "Nama Anak"}</h2>
          <span className="px-3 py-1 bg-[#4a70a9]/10 text-[#4a70a9] text-xs font-bold rounded-full">
            {child?.schoolLevel || "Murid"}
          </span>
        </div>

        {/* Read-only Fields */}
        <div className="space-y-4">
          {/* Section: Informasi Anak (Sekarang di Atas) */}
          {child && (
            <div className="pb-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <GraduationCap size={18} className="text-[#4a70a9]" />
                Informasi Anak
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Nama Anak
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={child.name}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-500 outline-none cursor-not-allowed border-dashed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Kelas / Jenjang
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={child.schoolLevel || "-"}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-500 outline-none cursor-not-allowed border-dashed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section: Informasi Wali (Sekarang di Bawah) */}
          <div className="border-t border-gray-200/50 pt-4 mt-2">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <User size={18} className="text-[#4a70a9]" />
              Informasi Wali
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  Nama Lengkap Wali
                </label>
                <input
                  type="text"
                  readOnly
                  value={profile.name}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-500 outline-none cursor-not-allowed border-dashed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={profile.phone}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-500 outline-none cursor-not-allowed border-dashed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    Alamat Email
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={profile.email || "-"}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-500 outline-none cursor-not-allowed border-dashed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ubah Kata Sandi */}
        <div className="border-t border-gray-200/50 pt-5">
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <KeyRound size={18} className="text-[#4a70a9]" />
            Ubah Kata Sandi
          </h3>
          <form onSubmit={handleUpdatePassword} className="space-y-3">
            {pwSuccess && (
              <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-700 flex items-center gap-2">
                <CheckCircle2 size={15} className="shrink-0" /> {pwSuccess}
              </div>
            )}
            {pwError && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" /> {pwError}
              </div>
            )}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Password Baru
              </label>
              <input
                type={showPw ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#4a70a9]"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Sembunyikan password" : "Tampilkan password"}
                className="absolute right-3 bottom-2.5 text-gray-400 hover:text-[#4a70a9]"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Konfirmasi Password Baru
              </label>
              <input
                type={showPw ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#4a70a9]"
              />
            </div>
            <Button type="submit" disabled={updating} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4a70a9] hover:bg-[#3a5a99] text-white text-sm px-4 py-2.5">
              <KeyRound size={15} /> {updating ? "Menyimpan..." : "Simpan Kata Sandi"}
            </Button>
          </form>
        </div>

        {/* Action Button */}
        <div className="border-t border-gray-200/50 pt-6 flex justify-center">
          <Button
            onClick={askLogout}
            className="inline-flex items-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 text-white border-red-500 shadow-sm px-4 py-2 text-sm"
          >
            <LogOut size={16} />
            <span>Keluar dari Akun</span>
          </Button>
        </div>
      </GlassCard>
      {logoutDialog}
    </div>
  );
}
