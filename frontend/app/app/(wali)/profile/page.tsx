/* Hallmark · genre: warm-editorial · design-system: google-stitch · designed-as-mobile-app */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";
import { useLogout } from "@/lib/useLogout";
import {
  ArrowLeft,
  Phone,
  Mail,
  GraduationCap,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CalendarCheck
} from "lucide-react";

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
      setPwSuccess("Password berhasil diubah!");
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="p-6 w-full flex-grow flex flex-col gap-4 items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-3 border-[#4a70a9]/20 border-t-[#4a70a9] animate-spin"></div>
        <p className="text-xs font-semibold text-[#737781]">Memuat profil pengguna...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="px-4 py-8 text-center text-[#737781]">
        <div className="p-6 bg-white border border-[#e5ddd0] rounded-xl shadow-xs">
          <p className="font-bold text-sm text-[#1a1a2e]">Gagal Memuat Profil</p>
          <p className="text-xs text-[#737781] mt-1">Silakan coba beberapa saat lagi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-2 pb-24 space-y-4 animate-[fadeIn_0.3s_ease-out] font-dm text-[#1a1a2e]">
      {/* 1. Top Bar Navigation (Stitch Universal Header) */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center gap-3">
          <Link
            href="/app/dashboard"
            aria-label="Kembali ke Dashboard"
            className="w-9 h-9 rounded-full bg-white border border-[#e5ddd0] flex items-center justify-center text-[#1a1a2e] hover:bg-[#eaf0f8] hover:text-[#4a70a9] transition-colors shadow-xs active:scale-95"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-playfair text-[#1a1a2e] tracking-tight leading-tight">
              Profil Saya
            </h1>
            <p className="text-[11px] text-[#737781] leading-none mt-0.5">
              Pengaturan Akun &amp; Data Anak
            </p>
          </div>
        </div>
      </header>

      {/* 2. Hero Card: Identitas Wali Murid */}
      <section className="bg-white rounded-xl border border-[#e5ddd0] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)] space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full bg-[#4a70a9] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0 font-playfair border-2 border-white">
            {getInitials(profile.name)}
          </div>
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1 bg-[#eaf0f8] text-[#30578f] px-2 py-0.5 rounded-full text-[10px] font-bold tracking-normal mb-1">
              <ShieldCheck size={11} />
              <span>Wali Murid Terdaftar</span>
            </span>
            <h2 className="text-base font-bold font-playfair text-[#1a1a2e] truncate">
              {profile.name}
            </h2>
            <p className="text-xs text-[#737781]">Akun Orang Tua / Wali</p>
          </div>
        </div>

        {/* Informasi Kontak */}
        <div className="border-t border-[#e5ddd0]/60 pt-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#737781]">
              <Phone size={14} className="text-[#4a70a9]" />
              <span>WhatsApp:</span>
            </div>
            <span className="font-semibold text-[#1a1a2e] font-mono">
              {profile.phone}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#737781]">
              <Mail size={14} className="text-[#4a70a9]" />
              <span>Email:</span>
            </div>
            <span className="font-semibold text-[#1a1a2e] truncate max-w-[200px]">
              {profile.email || "-"}
            </span>
          </div>
        </div>
      </section>

      {/* 3. Section: Data Anak Bimbingan */}
      <section className="space-y-2.5">
        <div className="flex items-center gap-1.5 px-1">
          <GraduationCap size={16} className="text-[#4a70a9]" />
          <h3 className="text-sm font-bold font-playfair text-[#1a1a2e]">
            Data Anak Bimbingan
          </h3>
        </div>

        {profile.murids.length > 0 ? (
          <div className="space-y-2.5">
            {profile.murids.map((child, idx) => (
              <article
                key={child.id}
                className="bg-white rounded-xl border border-[#e5ddd0] p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs ${idx === 0 ? "bg-[#4a70a9]" : "bg-[#c8b99a]"}`}>
                    {getInitials(child.name)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#1a1a2e] truncate">
                      {child.name}
                    </h4>
                    <p className="text-[11px] text-[#737781] mt-0.5">
                      {child.schoolLevel || "Murid Terdaftar"}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 bg-[#dcfce7] text-[#16a34a] px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0">
                  <CalendarCheck size={11} />
                  <span>Aktif Belajar</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#e5ddd0] rounded-xl p-4 text-center text-xs text-[#737781]">
            Belum ada profil anak terdaftar.
          </div>
        )}
      </section>

      {/* 4. Section: Keamanan Akun (Ganti Password) */}
      <section className="bg-white rounded-xl border border-[#e5ddd0] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)] space-y-3.5">
        <div className="flex items-center gap-2 pb-2 border-b border-[#e5ddd0]/60">
          <KeyRound size={16} className="text-[#4a70a9]" />
          <div>
            <h3 className="text-sm font-bold font-playfair text-[#1a1a2e]">
              Keamanan Akun
            </h3>
            <p className="text-[10px] text-[#737781]">
              Perbarui kata sandi untuk melindungi akses portal
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-3">
          {pwSuccess && (
            <div role="status" className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] p-2.5 text-xs text-[#16a34a] flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0" />
              <span>{pwSuccess}</span>
            </div>
          )}
          {pwError && (
            <div role="alert" className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-2.5 text-xs text-[#dc2626] flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{pwError}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#737781]">
              Password Baru
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                placeholder="Minimal 6 karakter"
                className="w-full text-xs rounded-xl border border-[#e5ddd0] bg-white px-3 py-2.5 text-[#1a1a2e] outline-none focus:border-[#4a70a9] pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Sembunyikan password" : "Tampilkan password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737781] hover:text-[#4a70a9]"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#737781]">
              Konfirmasi Password
            </label>
            <input
              type={showPw ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              minLength={6}
              placeholder="Ulangi password baru"
              className="w-full text-xs rounded-xl border border-[#e5ddd0] bg-white px-3 py-2.5 text-[#1a1a2e] outline-none focus:border-[#4a70a9]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full py-2.5 rounded-xl bg-[#4a70a9] hover:bg-[#3d5d8c] active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
          >
            <KeyRound size={14} />
            <span>{updating ? "Menyimpan..." : "Simpan Kata Sandi"}</span>
          </button>
        </form>
      </section>

      {/* 5. Section: Keluar dari Akun */}
      <section className="pt-2">
        <button
          onClick={askLogout}
          type="button"
          className="w-full py-3 rounded-xl bg-[#fef2f2] hover:bg-[#fee2e2] active:scale-98 text-[#dc2626] border border-[#fecaca] text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          <LogOut size={16} />
          <span>Keluar dari Akun</span>
        </button>
      </section>

      {logoutDialog}
    </div>
  );
}
