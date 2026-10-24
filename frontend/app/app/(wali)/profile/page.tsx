/* Hallmark · genre: warm-editorial · design-system: google-stitch · designed-as-mobile-app */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
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
  CalendarCheck,
  Users
} from "lucide-react";

interface DbMurid {
  id: string;
  name: string;
  schoolLevel?: string | null;
  avatarUrl?: string | null;
  photoPath?: string | null;
  parentName?: string | null;
  parentPhone?: string | null;
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
      await apiFetch("/api/users/me/password", {
        method: "PATCH",
        body: JSON.stringify({ password: newPassword }),
      });
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
        <p className="text-xs font-semibold text-[#535761]">Memuat profil siswa...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="px-4 py-8 text-center text-[#535761]">
        <div className="p-6 bg-white border border-[#e5ddd0] rounded-xl shadow-xs">
          <p className="font-bold text-sm text-[#1a1a2e]">Gagal Memuat Profil</p>
          <p className="text-xs text-[#535761] mt-1">Silakan coba beberapa saat lagi.</p>
        </div>
      </div>
    );
  }

  const primaryStudent = profile.murids[0];
  const studentDisplayName = primaryStudent?.name || profile.name;

  return (
    <div className="px-4 pt-2 pb-24 space-y-4 animate-[fadeIn_0.3s_ease-out] font-dm text-[#1a1a2e]">
      {/* 1. Top Bar Navigation */}
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
              Profil Siswa
            </h1>
            <p className="text-[11px] text-[#535761] leading-none mt-0.5">
              Identitas Siswa, Kontak Orang Tua &amp; Keamanan Akun
            </p>
          </div>
        </div>
      </header>

      {/* 2. Hero Card: Identitas Siswa */}
      <section className="bg-white rounded-xl border border-[#e5ddd0] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full bg-[#2e4b7a] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0 font-playfair border-2 border-white">
            {getInitials(studentDisplayName)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1">
              <span className="inline-flex items-center gap-1 bg-[#eaf0f8] text-[#224477] px-2 py-0.5 rounded-full text-[10px] font-bold">
                <ShieldCheck size={11} />
                <span>Siswa Terdaftar</span>
              </span>
            </div>
            <h2 className="text-base font-bold font-playfair text-[#1a1a2e] truncate">
              {studentDisplayName}
            </h2>
            <p className="text-xs text-[#535761]">
              {primaryStudent?.schoolLevel || "Akun Siswa nCourse (Belajar Mandiri & Bimbingan)"}
            </p>
          </div>
        </div>

        {/* Informasi Kontak Siswa & Orang Tua */}
        <div className="border-t border-[#e5ddd0]/60 pt-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#535761]">
              <Phone size={14} className="text-[#2e4b7a]" />
              <span>WhatsApp Aktif (Siswa / Orang Tua):</span>
            </div>
            <span className="font-semibold text-[#1a1a2e] font-mono">
              {primaryStudent?.parentPhone || profile.phone}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#535761]">
              <Users size={14} className="text-[#2e4b7a]" />
              <span>Nama Kontak / Wali Pendamping:</span>
            </div>
            <span className="font-semibold text-[#1a1a2e] truncate max-w-[200px]">
              {primaryStudent?.parentName || profile.name}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#535761]">
              <Mail size={14} className="text-[#2e4b7a]" />
              <span>Email Login:</span>
            </div>
            <span className="font-semibold text-[#1a1a2e] truncate max-w-[200px]">
              {profile.email || "-"}
            </span>
          </div>
        </div>
      </section>

      {/* 3. Section: Status Akademik Siswa */}
      <section className="space-y-2.5">
        <div className="flex items-center gap-1.5 px-1">
          <GraduationCap size={16} className="text-[#2e4b7a]" />
          <h3 className="text-sm font-bold font-playfair text-[#1a1a2e]">
            Profil Belajar Siswa
          </h3>
        </div>

        {profile.murids.length > 0 ? (
          <div className="space-y-2.5">
            {profile.murids.map((child, idx) => (
              <article
                key={child.id}
                className="bg-white rounded-xl border border-[#e5ddd0] p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs ${idx === 0 ? "bg-[#2e4b7a]" : "bg-[#8c7a5b]"}`}>
                    {getInitials(child.name)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#1a1a2e] truncate">
                      {child.name}
                    </h4>
                    <p className="text-[11px] text-[#535761] mt-0.5">
                      {child.schoolLevel || "Siswa Aktif"}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0">
                  <CalendarCheck size={11} />
                  <span>Aktif Belajar</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#e5ddd0] rounded-xl p-4 text-center text-xs text-[#535761]">
            Akun aktif untuk Belajar Mandiri. Hubungi admin untuk mengaktifkan jadwal Kelas Bimbingan atau Les Privat.
          </div>
        )}
      </section>

      {/* 4. Section: Keamanan Akun (Ganti Password) */}
      <section className="bg-white rounded-xl border border-[#e5ddd0] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] space-y-3.5">
        <div className="flex items-center gap-2 pb-2 border-b border-[#e5ddd0]/60">
          <KeyRound size={16} className="text-[#2e4b7a]" />
          <div>
            <h3 className="text-sm font-bold font-playfair text-[#1a1a2e]">
              Keamanan Akun
            </h3>
            <p className="text-[10px] text-[#535761]">
              Perbarui kata sandi untuk melindungi akses portal siswa
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-3">
          {pwSuccess && (
            <div role="status" className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] p-2.5 text-xs text-[#15803d] flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0" />
              <span>{pwSuccess}</span>
            </div>
          )}
          {pwError && (
            <div role="alert" className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-2.5 text-xs text-[#b91c1c] flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{pwError}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#535761]">
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#535761] hover:text-[#2e4b7a]"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#535761]">
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
            className="w-full py-2.5 rounded-xl bg-[#2e4b7a] hover:bg-[#22395e] active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
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
          className="w-full py-3 rounded-xl bg-[#fef2f2] hover:bg-[#fee2e2] active:scale-98 text-[#b91c1c] border border-[#fecaca] text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          <LogOut size={16} />
          <span>Keluar dari Akun</span>
        </button>
      </section>

      {logoutDialog}
    </div>
  );
}
