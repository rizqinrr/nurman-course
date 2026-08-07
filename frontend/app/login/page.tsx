"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom") || "/app/dashboard";
  const supabase = createClient();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (isSignUp) {
        if (!name || !phone) {
          throw new Error("Nama Lengkap dan Nomor WhatsApp wajib diisi.");
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              phone,
              role: "peserta",
            },
          },
        });

        if (error) throw error;

        if (data.user && data.session === null) {
          setSuccessMsg("Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.");
        } else {
          setSuccessMsg("Pendaftaran berhasil! Mengalihkan ke dashboard...");
          router.push(redirectedFrom);
          router.refresh();
        }
      } else {
        const isEmail = email.includes("@");
        let loginEmail = email;

        if (!isEmail) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/auth/resolve-phone`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ phone: email }),
          });

          if (!response.ok) {
            const errBody = await response.json().catch(() => ({}));
            throw new Error(errBody.error || "Nomor WhatsApp tidak terdaftar.");
          }

          const resData = await response.json();
          if (!resData.email) {
            throw new Error("Gagal mengidentifikasi email akun untuk nomor ini.");
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
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#4a70a9]/50 to-white p-4 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <PageHeader
          title={isSignUp ? "Daftar Akun" : "Masuk Akun"}
          subtitle="Akses katalog, jadwal, dan materi belajar Anda"
          showBack={false}
        />

        <GlassCard className="p-6 sm:p-8 mt-4">
          <form onSubmit={handleAuth} className="space-y-5">
            {errorMsg && (
              <div className="p-3 bg-red-100 text-red-700 text-sm rounded-xl font-medium">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-green-100 text-green-700 text-sm rounded-xl font-medium">
                {successMsg}
              </div>
            )}

            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-base focus:border-[#4a70a9] focus:outline-none bg-white/70 text-gray-900 placeholder:text-gray-400"
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-base focus:border-[#4a70a9] focus:outline-none bg-white/70 text-gray-900 placeholder:text-gray-400"
                    placeholder="Contoh: 081234567890"
                  />
                  <p className="mt-1.5 text-[11px] text-gray-500">Format: 62xxxxxxxxxxx (contoh 62812...), bukan 08...</p>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {isSignUp ? "Email" : "Email atau Nomor WhatsApp"}
              </label>
              <input
                type={isSignUp ? "email" : "text"}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-base focus:border-[#4a70a9] focus:outline-none bg-white/70 text-gray-900 placeholder:text-gray-400"
                placeholder={isSignUp ? "budi@gmail.com" : "budi@gmail.com atau 6281234567890"}
              />
              {!isSignUp && (
                <p className="mt-1.5 text-[11px] text-gray-500">
                  Email bisa, atau No WA format 62... (contoh: 6281234567890), bukan 08...
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-base focus:border-[#4a70a9] focus:outline-none bg-white/70 text-gray-900 placeholder:text-gray-400"
                placeholder="••••••••"
              />
              {!isSignUp && (
                <p className="mt-1.5 text-[11px] text-gray-500">Password default 12345678</p>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-1 justify-center">
              {loading ? "Memproses..." : isSignUp ? "Daftar" : "Masuk"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {isSignUp ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="text-[#4a70a9] font-bold hover:underline"
            >
              {isSignUp ? "Masuk di sini" : "Daftar di sini"}
            </button>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-b from-[#4a70a9]/50 to-white p-4 sm:p-6 flex items-center justify-center">
          <div className="text-gray-600 font-semibold">Memuat halaman masuk...</div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
