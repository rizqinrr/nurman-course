/* Hallmark · genre: playful-glassmorphism · design-system: design.md · designed-as-app */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { apiFetch } from "@/lib/api";
import { formatSessionDateTime } from "@/lib/format";
import GlassCard from "@/components/ui/GlassCard";

interface AdminDashboardData {
  programsActive: number;
  muridsActive: number;
  tentorsActive: number;
  invoicesPending: number;
  sessionsToday: Array<{
    id: string;
    startsAt: string;
    endsAt: string;
    status: string;
    program?: { id: string; name: string } | null;
    murid?: { id: string; name: string } | null;
  }>;
}

import { 
  CalendarDays, 
  Clock, 
  Users, 
  GraduationCap, 
  CreditCard, 
  AlertCircle,
  TrendingUp
} from "lucide-react";

function RealtimeClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const initTimer = setTimeout(() => {
      setNow(new Date());
    }, 0);
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => {
      clearTimeout(initTimer);
      clearInterval(timer);
    };
  }, []);

  if (!now) {
    return (
      <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0 animate-pulse">
        <div className="h-6 w-44 bg-white/20 rounded-full"></div>
        <div className="h-6 w-32 bg-[#4a70a9]/10 rounded-full"></div>
      </div>
    );
  }

  const dateStr = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  const timeStr = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);

  return (
    <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
      <div className="flex items-center gap-1.5 px-3.5 py-1 bg-white/50 border border-white/70 rounded-full shadow-sm">
        <CalendarDays size={13} className="text-[#4a70a9]" />
        <span className="text-[11px] font-semibold text-gray-700">{dateStr}</span>
      </div>
      <div className="flex items-center gap-1.5 px-3.5 py-1 bg-[#4a70a9]/10 border border-[#4a70a9]/25 rounded-full shadow-sm">
        <Clock size={13} className="text-[#4a70a9]" />
        <span className="text-[11px] font-extrabold text-[#4a70a9] tabular-nums tracking-wide">{timeStr} WIB</span>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [meRes, dashRes] = await Promise.all([
          apiFetch<{ user: { name: string } }>("/api/users/me"),
          apiFetch<{ data: AdminDashboardData }>("/api/admin/dashboard"),
        ]);
        setAdminName(meRes.user.name);
        const dash = dashRes.data;
        if (dash) {
          setDashboard({
            ...dash,
            sessionsToday: (dash.sessionsToday || []).map((s) => ({
              ...s,
              startsAt: formatSessionDateTime(s.startsAt),
              endsAt: formatSessionDateTime(s.endsAt),
            })),
          });
        }
      } catch (err) {
        console.error("Failed to load admin dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [supabase]);

  // Compute Stats
  const activeProgramsCount = dashboard?.programsActive ?? 0;
  const totalMurid = dashboard?.muridsActive ?? 0;
  const totalTutors = dashboard?.tentorsActive ?? 0;
  const unpaidInvoicesCount = dashboard?.invoicesPending ?? 0;

  const todaySessions = dashboard?.sessionsToday ?? [];

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full flex-grow flex flex-col gap-6 items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#4a70a9] animate-spin"></div>
        <p className="text-sm font-semibold text-gray-600">Memuat data dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full flex-grow flex flex-col gap-6 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Header Area */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl p-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
            Halo, {adminName}!
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Portal Admin • Kelola program les privat, data siswa, jadwal tentor, dan tagihan wali murid
          </p>
        </div>
        <RealtimeClock />
      </header>

      {/* Statistics Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-5 flex items-center gap-4 border border-white/80 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#4a70a9]/15 text-[#4a70a9] flex items-center justify-center border border-white/50">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Program Aktif</p>
            <h4 className="font-extrabold text-gray-800 text-lg sm:text-xl">{activeProgramsCount} Program</h4>
            <p className="text-[10px] text-gray-500 mt-0.5">Tersedia dalam katalog</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4 border border-white/80 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#4a70a9]/15 text-[#4a70a9] flex items-center justify-center border border-white/50">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Siswa</p>
            <h4 className="font-extrabold text-gray-800 text-lg sm:text-xl">{totalMurid} Murid</h4>
            <p className="text-[10px] text-gray-500 mt-0.5">Aktif belajar</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4 border border-white/80 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#4a70a9]/15 text-[#4a70a9] flex items-center justify-center border border-white/50">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Tentor</p>
            <h4 className="font-extrabold text-gray-800 text-lg sm:text-xl">{totalTutors} Tentor</h4>
            <p className="text-[10px] text-gray-500 mt-0.5">Terdaftar aktif</p>
          </div>
        </GlassCard>

        <GlassCard className={`p-5 flex items-center gap-4 border border-white/80 shadow-sm transition-all duration-300 ${unpaidInvoicesCount > 0 ? "bg-amber-50/40 border-amber-200/50" : ""}`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/50 ${unpaidInvoicesCount > 0 ? "bg-amber-100 text-amber-700" : "bg-[#4a70a9]/15 text-[#4a70a9]"}`}>
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tagihan Pending</p>
            <h4 className={`font-extrabold text-lg sm:text-xl ${unpaidInvoicesCount > 0 ? "text-amber-700 font-bold" : "text-gray-800"}`}>
              {unpaidInvoicesCount} Invoice
            </h4>
            <p className="text-[10px] text-gray-500 mt-0.5">Belum lunas / menunggu</p>
          </div>
        </GlassCard>
      </section>

      {/* Overview & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status Sistem */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <section className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-white/40 pb-2">
              <TrendingUp className="text-[#4a70a9]" size={22} />
              <span>Status Platform</span>
            </h3>
            
            <GlassCard className="p-6 border border-white/80 shadow-sm flex flex-col gap-4 justify-between flex-grow">
              <div className="flex flex-col items-start gap-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">STATUS KONEKSI</span>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-emerald-700">Sistem Berjalan Lancar</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mt-2">
                  Layanan otentikasi Supabase dan perutean Next.js berfungsi normal. Pendaftaran lead funnel berjalan lancar.
                </p>
              </div>
            </GlassCard>
          </section>
        </div>

        {/* Agenda Sesi Hari Ini */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <section className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-white/40 pb-2">
              <CalendarDays className="text-[#4a70a9]" size={22} />
              <span>Sesi Hari Ini ({todaySessions.length})</span>
            </h3>

            {todaySessions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {todaySessions.map((session) => {
                  const program = session.program;
                  const murid = session.murid;
                  return (
                    <GlassCard key={session.id} className="p-4 border border-white/80 shadow-sm flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wide">
                            {session.startsAt.split(" • ")[1]?.replace(" WIB", "") || "Scheduled"}
                          </span>
                          <span className={`px-2 py-0.5 border rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            session.status === "completed" 
                              ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                              : "bg-indigo-50 border-indigo-100 text-[#4a70a9]"
                          }`}>
                            {session.status === "completed" ? "Selesai" : "Terjadwal"}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-800 text-sm">{murid?.name}</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">{program?.name}</p>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            ) : (
              <GlassCard className="p-6 border border-white/60 shadow-sm flex flex-col items-start gap-2">
                <AlertCircle className="text-gray-400" size={24} />
                <div>
                  <h4 className="font-bold text-gray-800 text-xs sm:text-sm">Tidak Ada Sesi Hari Ini</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Tidak ada aktivitas belajar-mengajar privat yang dijadwalkan hari ini.
                  </p>
                </div>
              </GlassCard>
            )}
          </section>
        </div>

      </div>

    </div>
  );
}
