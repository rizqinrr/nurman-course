"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  UserRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isContentReturnPath, roleHomePath, safeReturnPath } from "@/lib/navigation";

const inputClass =
  "w-full rounded-2xl border border-[#b9c9dc] bg-white px-4 py-3.5 text-sm text-slate-950 outline-none transition focus:border-[#4a70a9] focus:ring-4 focus:ring-[#4a70a9]/15";

const isDevelopment = process.env.NODE_ENV === "development";

const dummyAccounts = [
  { role: "Admin", email: "admin@nurmancourse.com", description: "Kelola operasional", tone: "bg-[#4a70a9]" },
  { role: "Tentor", email: "tentor1@nurmancourse.com", description: "Kelola sesi belajar", tone: "bg-[#6f8fbd]" },
  { role: "Wali", email: "wali1@nurmancourse.com", description: "Pantau progres anak", tone: "bg-[#8da7ce]" },
  { role: "Member", email: "member@nurmancourse.com", description: "Baca materi mandiri", tone: "bg-[#b0c5e2]" },
];

async function fetchDbRole(accessToken: string): Promise<string | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) return null;
    const body = (await response.json()) as { user?: { role?: string } };
    return body.user?.role ?? null;
  } catch {
    return null;
  }
}

function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [mode, setMode] = useState<"login" | "register">(
    searchParams.get("mode") === "register" ? "register" : "login",
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const emailValue = email.trim();
  const emailIsPhone = mode === "login" && emailValue.length > 0 && /^\d/.test(emailValue);

  const selectMode = (nextMode: "login" | "register") => {
    setMode(nextMode);
    setNotice(null);
    setError(null);
  };

  const fillDummy = (account: (typeof dummyAccounts)[number]) => {
    setMode("login");
    setEmail(account.email);
    setPassword("Password123!");
    setNotice(`Akun ${account.role} siap dipakai. Tekan Masuk untuk melanjutkan.`);
    setError(null);
  };

  const handleLogin = async () => {
    const redirectedFrom = safeReturnPath(searchParams.get("next") ?? searchParams.get("redirectedFrom")) || "/app/dashboard";
    const loginValue = email.trim();
    let loginEmail = loginValue;

    if (!loginValue.includes("@")) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/auth/resolve-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: loginValue }),
      });
      const body = (await response.json().catch(() => ({}))) as { email?: string; error?: string };
      if (!response.ok || !body.email) throw new Error(body.error ?? "Nomor WhatsApp tidak terdaftar.");
      loginEmail = body.email;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
    if (authError) throw authError;

    const session = (await supabase.auth.getSession()).data.session;
    if (!session) throw new Error("Sesi login tidak tersedia. Silakan coba lagi.");

    await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/track/login`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session.access_token}` },
    }).catch(() => undefined);

    const role = await fetchDbRole(session.access_token);
    if (!role) {
      await supabase.auth.signOut();
      throw new Error("Profil akun belum siap. Silakan coba lagi atau hubungi admin.");
    }
    router.push(isContentReturnPath(redirectedFrom) ? redirectedFrom : roleHomePath(role));
    router.refresh();
  };

  const handleRegister = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
    });
    const body = (await response.json().catch(() => ({}))) as { error?: { message?: string } };
    if (!response.ok) throw new Error(body.error?.message ?? "Pendaftaran gagal.");
    setNotice(`Tautan verifikasi sudah dikirim ke ${email.trim()}.`);
    setName("");
    setPassword("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setNotice(null);
    setError(null);
    try {
      if (mode === "login") await handleLogin();
      else await handleRegister();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page min-h-screen overflow-hidden bg-[#eaf1fa] text-[#14233a]">
      <div className="auth-grid" aria-hidden="true" />
      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl items-stretch lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden flex-col justify-between p-10 lg:flex xl:p-16">
          <Link href="/landing" className="flex items-center gap-3 font-semibold tracking-tight text-[#17345d]">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2e4b7a] p-1 shadow-lg shadow-[#2e4b7a]/20">
              <Image src="/Nlogo.png" alt="Logo Nurman Course" width={44} height={44} className="rounded-xl" />
            </span>
            <span className="text-xl">Nurman <span className="text-[#4a70a9]">Course</span></span>
          </Link>
          <div className="max-w-xl">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-[#4a70a9]">Ruang belajar yang terarah</p>
            <h1 className="text-5xl font-black leading-[1.02] tracking-[-0.05em] text-[#14233a] xl:text-7xl">Satu akun untuk mengikuti peta belajar anak.</h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-[#536781]">Masuk untuk melihat materi, jadwal, laporan progres, dan langkah berikutnya yang paling masuk akal.</p>
            <div className="mt-10 grid max-w-md grid-cols-2 gap-3 text-sm font-semibold text-[#355276]">
              {['Materi tersimpan', 'Jadwal lebih rapi', 'Progres terlihat', 'Komunikasi dekat'].map((item) => <div key={item} className="flex items-center gap-2 rounded-2xl border border-[#c9d7e8] bg-white/65 px-4 py-3"><Check size={16} className="text-[#4a70a9]" />{item}</div>)}
            </div>
          </div>
          <p className="text-xs font-semibold text-[#71839c]">Belajar lebih dekat, hasil lebih nyata.</p>
        </section>

        <section className="flex items-center justify-center p-5 sm:p-8 lg:bg-white/35 xl:p-16">
          <div className="w-full max-w-md">
            <div className="mb-7 flex items-center gap-3 lg:hidden">
              <Image src="/Nlogo.png" alt="Logo Nurman Course" width={44} height={44} className="rounded-xl bg-[#2e4b7a] p-1" />
              <span className="font-bold text-[#17345d]">Nurman <span className="text-[#4a70a9]">Course</span></span>
            </div>
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4a70a9]">Pintu masuk</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#14233a]">{mode === "login" ? "Selamat datang kembali" : "Mulai ruang belajar"}</h2>
              <p className="mt-2 text-sm leading-6 text-[#536781]">{mode === "login" ? "Lanjutkan perjalanan belajar dari tempat terakhir." : "Buat akun member gratis untuk menyimpan progress materi."}</p>
            </div>
            <div className="mb-5 grid grid-cols-2 rounded-2xl bg-[#d6e2f0] p-1" role="tablist" aria-label="Mode autentikasi">
              <button type="button" role="tab" aria-selected={mode === "login"} onClick={() => selectMode("login")} className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${mode === "login" ? "bg-white text-[#2e4b7a] shadow-sm" : "text-[#5c708a]"}`}>Masuk</button>
              <button type="button" role="tab" aria-selected={mode === "register"} onClick={() => selectMode("register")} className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${mode === "register" ? "bg-white text-[#2e4b7a] shadow-sm" : "text-[#5c708a]"}`}>Daftar</button>
            </div>
            <div className="rounded-[2rem] border border-white/80 bg-white/85 p-5 shadow-[0_24px_70px_rgba(46,75,122,0.15)] sm:p-7">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div role="alert" className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700"><AlertCircle size={18} className="mt-0.5 shrink-0" />{error}</div>}
                {notice && <div role="status" className="rounded-2xl border border-[#b8d4f1] bg-[#eef6ff] p-3 text-sm font-medium text-[#2e4b7a]">{notice}</div>}
                {mode === "register" && <label className="block"><span className="mb-1.5 block text-sm font-bold text-[#355276]">Nama</span><span className="relative block"><UserRound size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8194ae]" /><input id="auth-name" required value={name} onChange={(event) => setName(event.target.value)} className={`${inputClass} pl-11`} autoComplete="name" /></span></label>}
                <label className="block"><span className="mb-1.5 block text-sm font-bold text-[#355276]">{mode === "login" ? "Email atau Nomor WhatsApp" : "Email"}</span><span className="relative block"><Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8194ae]" /><input id="auth-email" required type={mode === "register" ? "email" : "text"} inputMode={emailIsPhone ? "numeric" : "email"} value={email} onChange={(event) => setEmail(event.target.value)} className={`${inputClass} pl-11`} autoComplete={mode === "login" ? "username" : "email"} /></span>
                {mode === "login" && emailIsPhone && <span className="mt-1.5 block text-xs text-[#71839c]">Format nomor: 62xxxxxxxxxx, contoh 6281234567890.</span>}</label>
                <label className="block"><span className="mb-1.5 block text-sm font-bold text-[#355276]">Password</span><span className="relative block"><Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8194ae]" /><input id="auth-password" required type={showPassword ? "text" : "password"} minLength={mode === "register" ? 8 : undefined} value={password} onChange={(event) => setPassword(event.target.value)} className={`${inputClass} pl-11 pr-12`} autoComplete={mode === "login" ? "current-password" : "new-password"} /><button type="button" aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#71839c] hover:text-[#4a70a9]">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span>{mode === "register" && <span className="mt-1.5 block text-xs text-[#71839c]">Minimal 8 karakter.</span>}</label>
                <button type="submit" disabled={loading} className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4a70a9] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4a70a9]/20 transition hover:bg-[#3a5a99] disabled:cursor-wait disabled:opacity-60">{loading ? <><Loader2 size={18} className="animate-spin" /> Memproses...</> : <>{mode === "login" ? "Masuk ke akun" : "Buat akun member"}<ArrowRight size={18} className="transition group-hover:translate-x-0.5" /></>}</button>
              </form>
            </div>
            {isDevelopment && (
              <div className="mt-6 rounded-[1.5rem] border border-dashed border-[#a9bdd6] bg-white/45 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#627894]">Akun development</p>
                <p className="mt-1 text-xs text-[#71839c]">Klik untuk mengisi form. Password seed: Password123!</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {dummyAccounts.map((account) => (
                    <button
                      key={account.role}
                      type="button"
                      onClick={() => fillDummy(account)}
                      className="flex items-center gap-2 rounded-xl border border-[#c9d7e8] bg-white/75 px-3 py-2 text-left transition hover:-translate-y-0.5 hover:border-[#4a70a9]"
                    >
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${account.tone}`} />
                      <span>
                        <span className="block text-xs font-bold text-[#294568]">{account.role}</span>
                        <span className="block text-[10px] text-[#71839c]">{account.description}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <p className="mt-5 text-center text-xs text-[#71839c]"><Link href="/landing" className="font-bold text-[#2e4b7a] hover:underline">Kembali ke landing page</Link></p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<main className="grid min-h-screen place-items-center bg-[#eaf1fa] text-sm font-semibold text-[#4a70a9]">Memuat ruang masuk...</main>}><AuthPage /></Suspense>;
}
