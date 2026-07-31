"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";

export default function LoginPage() {
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
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Redirect based on user metadata role
        const role = data.user?.user_metadata?.role || "peserta";
        const redirectPath = role === "admin" ? "/app/admin" : redirectedFrom;

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
          <form onSubmit={handleAuth} className="space-y-4">
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-base focus:border-[#4a70a9] focus:outline-none bg-white/70"
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-base focus:border-[#4a70a9] focus:outline-none bg-white/70"
                    placeholder="Contoh: 081234567890"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-base focus:border-[#4a70a9] focus:outline-none bg-white/70"
                placeholder="budi@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-base focus:border-[#4a70a9] focus:outline-none bg-white/70"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 justify-center"
            >
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
