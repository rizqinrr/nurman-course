/* Hallmark · genre: playful-glassmorphism · design-system: design.md · designed-as-app */
"use client";

import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { Users, BookOpen, ShieldAlert } from "lucide-react";

export default function AppIndexPage() {
  return (
    <main className="min-h-screen bg-[#6d8fc4] flex flex-col justify-center items-center p-4 sm:p-6 md:p-12 relative overflow-hidden font-sans">
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-4xl flex flex-col gap-8 text-center z-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-sm leading-tight tracking-tight">
            Nurman Course LMS
          </h1>
          <p className="text-sm sm:text-base text-indigo-50 mt-2 max-w-xl mx-auto font-medium">
            Pilih portal akses Anda untuk memulai pemantauan dan pengelolaan aktivitas belajar-mengajar privat.
          </p>
        </div>

        {/* 3 Columns Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          {/* Wali Portal */}
          <GlassCard className="p-6 flex flex-col justify-between h-full border border-white/80 hover:shadow-2xl transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#4a70a9]/15 text-[#4a70a9] flex items-center justify-center mb-5 border-2 border-white shadow-inner">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Portal Wali Murid</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6">
                Pantau perkembangan belajar anak, jadwal les, histori laporan harian, serta lakukan konfirmasi pembayaran tagihan secara mandiri.
              </p>
            </div>
            <Link href="/app/dashboard" className="w-full mt-auto block">
              <Button variant="primary" className="w-full justify-center text-xs sm:text-sm py-2.5">
                Masuk Wali Murid
              </Button>
            </Link>
          </GlassCard>

          {/* Tentor Portal */}
          <GlassCard className="p-6 flex flex-col justify-between h-full border border-white/80 hover:shadow-2xl transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#4a70a9]/15 text-[#4a70a9] flex items-center justify-center mb-5 border-2 border-white shadow-inner">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Portal Tentor</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6">
                Kelola jadwal sesi privat, catat laporan harian per sesi pertemuan, dan terbitkan rapor perkembangan belajar berkala (per blok) siswa.
              </p>
            </div>
            <Link href="/app/tentor/dashboard" className="w-full mt-auto block">
              <Button variant="primary" className="w-full justify-center text-xs sm:text-sm py-2.5">
                Masuk Tentor
              </Button>
            </Link>
          </GlassCard>

          {/* Admin Portal */}
          <GlassCard className="p-6 flex flex-col justify-between h-full border border-white/80 hover:shadow-2xl transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#4a70a9]/15 text-[#4a70a9] flex items-center justify-center mb-5 border-2 border-white shadow-inner">
                <ShieldAlert size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Portal Admin</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6">
                Manajemen CRUD data master program les, roadmap, materi, murid, penugasan tentor, penjadwalan sesi, serta verifikasi bukti transfer tagihan.
              </p>
            </div>
            <Link href="/app/admin" className="w-full mt-auto block">
              <Button variant="primary" className="w-full justify-center text-xs sm:text-sm py-2.5">
                Masuk Admin
              </Button>
            </Link>
          </GlassCard>

        </div>

        <div className="mt-4 text-center">
          <Link href="/course" className="text-xs text-white/80 hover:text-white font-semibold underline underline-offset-4 transition-colors">
            Kembali ke Landing Page Pendaftaran
          </Link>
        </div>
      </div>
    </main>
  );
}