"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAdminName(user.user_metadata?.name || user.email || "Admin");
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Halo, {adminName}!</h1>
        <p className="text-[#4a70a9] font-semibold mb-6">Portal Admin Nurman Course</p>
        <div className="space-y-4">
          <div className="p-4 bg-white/60 rounded-2xl border border-white/80">
            <span className="text-sm font-semibold text-gray-700 block mb-1">Status Sistem</span>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-full">Berjalan Lancar</span>
          </div>
          <Button variant="secondary" onClick={handleLogout} className="w-full justify-center">
            Keluar
          </Button>
        </div>
      </GlassCard>
    </main>
  );
}
