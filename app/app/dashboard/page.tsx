"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [userName, setUserName] = useState("Peserta");

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.name || user.email || "Peserta");
      }
    }
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#4a70a9]/50 to-white p-4 sm:p-6 flex items-center justify-center">
      <GlassCard className="p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Halo, {userName}!</h1>
        <p className="text-gray-600 mb-6">Selamat datang di LMS Sederhana Nurman Course.</p>
        <div className="space-y-4">
          <div className="p-4 bg-white/60 rounded-2xl border border-white/80">
            <span className="text-sm font-semibold text-gray-700 block mb-1">Status Belajar</span>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">Aktif</span>
          </div>
          <Button variant="secondary" onClick={handleLogout} className="w-full justify-center">
            Keluar
          </Button>
        </div>
      </GlassCard>
    </main>
  );
}
