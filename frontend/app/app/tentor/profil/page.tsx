"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useLogout } from "@/lib/useLogout";
import { ChevronLeft, LogOut, User, Mail, Phone, GraduationCap, Shield, Users, KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

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
  const { askLogout, logoutDialog } = useLogout();
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
    async function load() {
      try {
        const res = await apiFetch<{ user: TentorProfile & { enrollments?: EnrollmentSummary[] } }>("/api/users/me");
        setProfile(res.user);
        try {
          const enr = await apiFetch<{ data?: EnrollmentSummary[]; enrollments?: EnrollmentSummary[] }>("/api/me/enrollments");
          setEnrollments((enr as any).data || (enr as any).enrollments || []);
        } catch {}
      } catch (e) {
        setError(e instanceof Error ? e.message : "Gagal memuat profil");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full flex-grow flex flex-col gap-6 items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#4a70a9] animate-spin" />
        <p className="text-sm font-semibold text-gray-600">Memuat profil tentor…</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full flex-grow flex flex-col gap-6">
        <GlassCard className="p-8 text-center border border-white/80 shadow-sm">
          <p className="font-bold text-gray-800">{error || "Gagal memuat profil"}</p>
          <Link href="/app/tentor/dashboard" className="mt-4 inline-block text-sm font-semibold text-[#4a70a9] hover:underline">Kembali ke Dashboard</Link>
        </GlassCard>
      </div>
    );
  }

  const initial = profile.name.trim().charAt(0).toUpperCase();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full flex-grow flex flex-col gap-5 sm:gap-6 animate-[fadeIn_0.5s_ease-out] pb-24">
      <header className="flex items-center gap-3 rounded-[20px] bg-white/45 backdrop-blur-xl border border-white/60 shadow-sm p-4 sm:p-5">
        <Link href="/app/tentor/dashboard" className="w-9 h-9 rounded-xl bg-white/70 border border-white/60 flex items-center justify-center text-gray-600 hover:bg-white active:scale-95 transition-all">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="text-[18px] sm:text-xl font-extrabold text-gray-800 tracking-tight">Profil Tentor</h1>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Akun & penugasan mengajar</p>
        </div>
      </header>

      <GlassCard className="p-6 sm:p-7 flex flex-col gap-6 border border-white/80 shadow-xl">
        <div className="flex flex-col items-center gap-3 border-b border-gray-200/50 pb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4a70a9] to-indigo-500 text-white flex items-center justify-center text-2xl font-extrabold shadow-md border-2 border-white">{initial}</div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#4a70a9]/10 border border-[#4a70a9]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#4a70a9]"><Shield size={12} />{profile.role}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5"><User size={14} className="text-[#4a70a9]" /> Informasi Akun</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Nama</span>
              <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 text-sm text-gray-700"><User size={14} className="text-gray-400 shrink-0" /><span className="truncate">{profile.name}</span></div>
            </label>
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1"><Phone size={10} /> Nomor WA</span>
              <div className="mt-1.5 rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 text-sm text-gray-700 truncate">{profile.phone}</div>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1"><Mail size={10} /> Email</span>
              <div className="mt-1.5 rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 text-sm text-gray-700 truncate">{profile.email || "-"}</div>
            </label>
          </div>
        </div>

        <div className="border-t border-gray-200/50 pt-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5"><Users size={14} className="text-[#4a70a9]" /> Murid Ditugaskan <span className="ml-1 rounded-full bg-[#4a70a9]/10 px-2 py-0.5 text-[10px] text-[#4a70a9]">{enrollments.length}</span></h3>
          {enrollments.length === 0 ? (
            <p className="mt-3 text-xs text-gray-500">Belum ada penugasan enrollment.</p>
          ) : (
            <div className="mt-3 grid gap-2">
              {enrollments.map((enr) => (
                <div key={enr.id} className="rounded-xl bg-white/60 border border-white/60 px-3.5 py-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{enr.murid?.name || enr.id.slice(0, 8)}</p>
                    <p className="text-[11px] text-gray-500 truncate">{enr.program?.name || "-"} {enr.murid?.schoolLevel ? `• ${enr.murid.schoolLevel}` : ""}</p>
                  </div>
                  <GraduationCap size={16} className="text-[#4a70a9]/60 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200/50 pt-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5"><KeyRound size={14} className="text-[#4a70a9]" /> Ubah Kata Sandi</h3>
          <form onSubmit={handleUpdatePassword} className="mt-3 space-y-3">
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
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Password Baru</label>
              <input
                type={showPw ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-[#4a70a9]"
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
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Konfirmasi Password Baru</label>
              <input
                type={showPw ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-[#4a70a9]"
              />
            </div>
            <Button type="submit" disabled={updating} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4a70a9] hover:bg-[#3a5a99] text-white text-sm px-4 py-2.5">
              <KeyRound size={15} /> {updating ? "Menyimpan..." : "Simpan Kata Sandi"}
            </Button>
          </form>
        </div>

        <div className="border-t border-gray-200/50 pt-5 flex justify-center">
          <Button onClick={askLogout} className="inline-flex items-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 text-white border-red-500 shadow-sm px-4 py-2 text-sm">
            <LogOut size={16} /> Keluar
          </Button>
        </div>
      </GlassCard>
      {logoutDialog}
    </div>
  );
}
