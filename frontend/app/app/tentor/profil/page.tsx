/* Hallmark · genre: warm-editorial · design-system: design.md · designed-as-mobile-app */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import Button from "@/components/ui/Button";
import { useLogout } from "@/lib/useLogout";
import {
  ChevronLeft,
  LogOut,
  User,
  Mail,
  Phone,
  GraduationCap,
  Shield,
  Users,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface TentorProfile {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: string;
}

interface EnrollmentSummary {
  id: string;
  murid?: { id: string; name: string; schoolLevel?: string | null };
  program?: { id: string; name: string };
}

export default function TentorProfilePage() {
  const { askLogout, logoutDialog } = useLogout({
    message: "Kamu akan keluar dari Portal Tentor nCourse.",
  });
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<TentorProfile | null>(null);
  const [enrollments, setEnrollments] = useState<EnrollmentSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
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
    let active = true;
    async function load() {
      try {
        const res = await apiFetch<{ user: TentorProfile & { enrollments?: EnrollmentSummary[] } }>(
          "/api/users/me",
        );
        if (!active) return;
        setProfile(res.user);
        try {
          const enr = await apiFetch<{
            data?: EnrollmentSummary[];
            enrollments?: EnrollmentSummary[];
          }>("/api/me/enrollments");
          if (active) setEnrollments(enr.data || enr.enrollments || []);
        } catch {}
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Gagal memuat profil");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto w-full flex-grow flex flex-col gap-3 items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-3 border-[#4a70a9]/20 border-t-[#4a70a9] animate-spin" />
        <p className="text-xs font-semibold text-[#535761]">Memuat profil tentor…</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full flex-grow flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-8 text-center border border-[#E5DDD0] shadow-xs">
          <p className="font-bold text-[#14233a]">{error || "Gagal memuat profil"}</p>
          <Link
            href="/app/tentor/dashboard"
            className="mt-4 inline-block text-sm font-semibold text-[#2e4b7a] hover:underline"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const initial = profile.name.trim().charAt(0).toUpperCase();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full flex-grow flex flex-col gap-5 sm:gap-6 animate-[fadeIn_0.3s_ease-out] pb-24">
      <header className="flex items-center gap-3 rounded-2xl bg-white border border-[#E5DDD0] shadow-xs p-4 sm:p-5">
        <Link
          href="/app/tentor/dashboard"
          className="w-9 h-9 rounded-xl bg-[#F7F4EF] border border-[#E5DDD0] flex items-center justify-center text-[#14233a] hover:bg-[#EAF0F8] active:scale-95 transition-all"
        >
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-[#14233a] tracking-tight">
            Profil Tentor
          </h1>
          <p className="text-xs text-[#535761] mt-0.5">Identitas pengajar &amp; penugasan siswa</p>
        </div>
      </header>

      <div className="bg-white rounded-2xl p-5 sm:p-7 flex flex-col gap-6 border border-[#E5DDD0] shadow-xs">
        <div className="flex flex-col items-center gap-3 border-b border-[#E5DDD0] pb-6">
          <div className="w-20 h-20 rounded-full bg-[#2e4b7a] text-white flex items-center justify-center text-2xl font-extrabold shadow-xs border-2 border-white">
            {initial}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-[#14233a]">{profile.name}</h2>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF0F8] border border-[#B8CDE4] px-2.5 py-1 text-[10px] font-bold uppercase text-[#224477]">
                <Shield size={12} />
                {profile.role}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#14233a] flex items-center gap-1.5">
            <User size={15} className="text-[#2e4b7a]" /> Informasi Akun
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-bold text-[#535761]">Nama</span>
              <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-[#E5DDD0] bg-[#F7F4EF] px-3.5 py-2.5 text-sm text-[#14233a]">
                <User size={14} className="text-[#535761] shrink-0" />
                <span className="truncate">{profile.name}</span>
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-bold text-[#535761] flex items-center gap-1">
                <Phone size={12} /> Nomor WhatsApp
              </span>
              <div className="mt-1.5 rounded-xl border border-[#E5DDD0] bg-[#F7F4EF] px-3.5 py-2.5 text-sm text-[#14233a] truncate">
                {profile.phone}
              </div>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-bold text-[#535761] flex items-center gap-1">
                <Mail size={12} /> Email
              </span>
              <div className="mt-1.5 rounded-xl border border-[#E5DDD0] bg-[#F7F4EF] px-3.5 py-2.5 text-sm text-[#14233a] truncate">
                {profile.email || "-"}
              </div>
            </label>
          </div>
        </div>

        <div className="border-t border-[#E5DDD0] pt-5">
          <h3 className="text-sm font-bold text-[#14233a] flex items-center gap-1.5">
            <Users size={15} className="text-[#2e4b7a]" /> Siswa Ditugaskan{" "}
            <span className="ml-1 rounded-full bg-[#EAF0F8] px-2.5 py-0.5 text-xs font-bold text-[#224477]">
              {enrollments.length}
            </span>
          </h3>
          {enrollments.length === 0 ? (
            <p className="mt-3 text-xs text-[#535761]">Belum ada penugasan siswa aktif.</p>
          ) : (
            <div className="mt-3 grid gap-2">
              {enrollments.map((enr) => (
                <div
                  key={enr.id}
                  className="rounded-xl bg-[#F7F4EF] border border-[#E5DDD0] px-3.5 py-2.5 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#14233a] truncate">
                      {enr.murid?.name || enr.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-[#535761] truncate">
                      {enr.program?.name || "-"}{" "}
                      {enr.murid?.schoolLevel ? `• ${enr.murid.schoolLevel}` : ""}
                    </p>
                  </div>
                  <GraduationCap size={16} className="text-[#2e4b7a] shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-[#E5DDD0] pt-5">
          <h3 className="text-sm font-bold text-[#14233a] flex items-center gap-1.5">
            <KeyRound size={15} className="text-[#2e4b7a]" /> Ubah Kata Sandi
          </h3>
          <form onSubmit={handleUpdatePassword} className="mt-3 space-y-3">
            {pwSuccess && (
              <div
                role="status"
                className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-3.5 py-2.5 text-xs text-[#15803d] flex items-center gap-2"
              >
                <CheckCircle2 size={15} className="shrink-0" /> {pwSuccess}
              </div>
            )}
            {pwError && (
              <div
                role="alert"
                className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-3.5 py-2.5 text-xs text-[#b91c1c] flex items-center gap-2"
              >
                <AlertCircle size={15} className="shrink-0" /> {pwError}
              </div>
            )}
            <div className="relative">
              <label className="block text-xs font-bold text-[#535761]">Password Baru</label>
              <input
                type={showPw ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                className="mt-1.5 w-full rounded-xl border border-[#E5DDD0] bg-white px-3.5 py-2.5 text-sm text-[#14233a] outline-none focus:border-[#4a70a9]"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Sembunyikan password" : "Tampilkan password"}
                className="absolute right-3 bottom-2.5 text-[#535761] hover:text-[#2e4b7a]"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#535761]">
                Konfirmasi Password Baru
              </label>
              <input
                type={showPw ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                className="mt-1.5 w-full rounded-xl border border-[#E5DDD0] bg-white px-3.5 py-2.5 text-sm text-[#14233a] outline-none focus:border-[#4a70a9]"
              />
            </div>
            <Button
              type="submit"
              disabled={updating}
              className="inline-flex items-center justify-center gap-2 rounded-xl text-xs px-4 py-2.5"
            >
              <KeyRound size={15} /> {updating ? "Menyimpan..." : "Simpan Kata Sandi"}
            </Button>
          </form>
        </div>

        <div className="border-t border-[#E5DDD0] pt-5 flex justify-center">
          <button
            type="button"
            onClick={askLogout}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#fef2f2] hover:bg-[#fee2e2] text-[#b91c1c] border border-[#fecaca] font-bold px-5 py-2.5 text-xs transition-colors cursor-pointer"
          >
            <LogOut size={16} /> Keluar dari Akun
          </button>
        </div>
      </div>
      {logoutDialog}
    </div>
  );
}
