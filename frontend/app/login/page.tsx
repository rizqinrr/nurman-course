"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";

const inputBase =
  "w-full rounded-xl border border-slate-300 bg-white/85 py-3 text-base text-slate-900 placeholder:text-slate-400 placeholder:font-normal shadow-sm transition-all duration-200 focus:border-[#4a70a9] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#4a70a9]/15";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom") || "/app/dashboard";
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const isEmail = email.includes("@");
      let loginEmail = email;

      if (!isEmail) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/auth/resolve-phone`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ phone: email }),
          },
        );

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          throw new Error(errBody.error || "Nomor WhatsApp tidak terdaftar.");
        }

        const resData = await response.json();
        if (!resData.email) {
          throw new Error(
            "Gagal mengidentifikasi email akun untuk nomor ini.",
          );
        }
        loginEmail = resData.email;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (error) throw error;

      const role = data.user?.user_metadata?.role || "wali";
      let redirectPath = redirectedFrom;
      if (role === "admin") redirectPath = "/app/admin";
      else if (role === "tentor") redirectPath = "/app/tentor";
      else redirectPath = "/app/dashboard";

      router.push(redirectPath);
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan. Silakan coba lagi.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const emailValue = email.trim();
  const emailIsPhone = emailValue.length > 0 && /^\d/.test(emailValue);
  const currentYear = new Date().getFullYear();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#4a70a9]/45 via-[#eef3fb] to-white p-4 sm:p-6">
      {/* Decorative background orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#4a70a9]/25 blur-3xl login-orb"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#3b82f6]/20 blur-3xl login-orb"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 right-1/4 h-48 w-48 rounded-full bg-[#7a9ad0]/20 blur-3xl login-orb"
      />

      <div className="login-entrance w-full max-w-md">
        {/* Brand header */}
        <div className="mb-6 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/80 bg-[#2e4b7a] shadow-[0_8px_18px_rgba(74,112,169,0.5)]"
          >
            <Image
              src="/Nlogo.png"
              alt="Logo Nurman Course"
              width={500}
              height={500}
              priority
              className="h-14 w-14 rounded-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-[26px]">
            Selamat Datang Kembali
          </h1>
          <p className="mt-1.5 text-sm text-black sm:text-base">
            Masuk ke Nurman Course untuk mengakses katalog, jadwal, dan materi
            belajar
          </p>
        </div>

        <GlassCard className="p-6 sm:p-8">
          <form onSubmit={handleAuth} className="space-y-4">
            {errorMsg && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700"
              >
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Email atau Nomor WhatsApp
              </label>
              <div className="relative">
                <Mail
                  size={20}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="login-email"
                  type="text"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputBase} pl-11`}
                  placeholder=""
                />
              </div>
              {emailValue.length > 0 && (
                <p className="mt-1.5 text-[11px] text-slate-400">
                  {emailIsPhone ? (
                    <>
                      Format: 62xxxxxxxxxxx (contoh 6281234567890), bukan 08...
                    </>
                  ) : (
                    <>
                      Gunakan format email yang valid (contoh: nama@email.com)
                    </>
                  )}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={20}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputBase} pl-11 pr-12`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition-colors hover:text-[#4a70a9]"
                >
                  {showPassword ? (
                    <EyeOff size={20} aria-hidden="true" />
                  ) : (
                    <Eye size={20} aria-hidden="true" />
                  )}
                </button>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400">
                Password default 12345678
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="group mt-1 w-full justify-center"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Masuk</span>
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </>
              )}
            </Button>
          </form>
        </GlassCard>

        <div className="mt-6 text-center text-xs text-black">
          &copy; {currentYear} Nurman Course
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#4a70a9]/45 to-white p-4 sm:p-6">
          <div className="animate-pulse text-slate-500 font-semibold">
            Memuat halaman masuk...
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
