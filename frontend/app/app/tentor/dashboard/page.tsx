/* Hallmark · genre: playful-glassmorphism · design-system: design.md · designed-as-app */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Session,
  DailyReport,
  Murid,
  Program
} from "@/data/lms";
import { apiFetch } from "@/lib/api";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { 
  CalendarDays, 
  Users, 
  FileWarning, 
  Clock, 
  MapPin, 
  AlertCircle,
  Plus,
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

const formatSessionDateTime = (isoString: string) => {
  try {
    const d = new Date(isoString);
    const dateStr = new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);

    const timeStr = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);

    return `${dateStr} • ${timeStr} WIB`;
  } catch {
    return isoString;
  }
};

interface SessionWithRelations extends Session {
  murid?: Murid;
  program?: Program;
}

export default function TentorDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("Tentor");
  const [sessionsData, setSessionsData] = useState<SessionWithRelations[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [muridsList, setMuridsList] = useState<Murid[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        // Live mode — enrollments is primary source for assigned students
        interface DbMurid {
          id: string;
          waliId: string;
          name: string;
          birthDate?: string | null;
          schoolLevel?: string | null;
          avatarUrl?: string | null;
        }
        interface EnrollmentBundle {
          id: string;
          muridId: string;
          murid?: DbMurid;
        }

        function mapMuridToList(dbMurid: DbMurid, map: Map<string, Murid>) {
          if (map.has(dbMurid.id)) return;
          let age = 7;
          if (dbMurid.birthDate) {
            const birth = new Date(dbMurid.birthDate);
            const ageDifMs = Date.now() - birth.getTime();
            const ageDate = new Date(ageDifMs);
            age = Math.abs(ageDate.getUTCFullYear() - 1970);
          }
          map.set(dbMurid.id, {
            id: dbMurid.id,
            waliId: dbMurid.waliId,
            name: dbMurid.name,
            age,
            schoolLevel: dbMurid.schoolLevel || "TK B",
            avatarUrl:
              dbMurid.avatarUrl ||
              "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=150&h=150",
          });
        }

        const profileRes = (await apiFetch("/api/users/me")) as {
          user: { name: string };
        };
        setProfileName(profileRes.user.name);

        const [sessionsRes, reportsRes, enrollmentsRes] = await Promise.all([
          apiFetch<{ sessions: SessionWithRelations[] }>("/api/me/sessions"),
          apiFetch<{ reports: DailyReport[] }>("/api/me/daily-reports"),
          apiFetch<{ enrollments: EnrollmentBundle[] }>(
            "/api/me/enrollments",
          ).catch(() => ({ enrollments: [] as EnrollmentBundle[] }) as any),
        ]);

        const mappedSessions = sessionsRes.sessions.map((s) => ({
          ...s,
          startsAt: formatSessionDateTime(s.startsAt),
          endsAt: formatSessionDateTime(s.endsAt),
        }));
        setSessionsData(mappedSessions);
        setDailyReports(reportsRes.reports);

        const completedSessions = mappedSessions.filter(
          (s) => s.status === "completed",
        );
        const reportedSessionIds = reportsRes.reports.map(
          (rep) => rep.sessionId,
        );
        const pending = completedSessions.filter(
          (s) => !reportedSessionIds.includes(s.id),
        );
        setPendingCount(pending.length);

        const uniqueMuridsMap = new Map<string, Murid>();
        const enrollmentData = (enrollmentsRes as any).enrollments || [];
        enrollmentData.forEach((enr: EnrollmentBundle) => {
          if (enr.murid) mapMuridToList(enr.murid as DbMurid, uniqueMuridsMap);
        });
        mappedSessions.forEach((s) => {
          if (s.murid) mapMuridToList(s.murid as unknown as DbMurid, uniqueMuridsMap);
        });
        setMuridsList(Array.from(uniqueMuridsMap.values()));
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Dapatkan string tanggal hari ini di WIB
  const todayDateStr = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  // Filter sesi hari ini
  const todaySessions = sessionsData.filter(
    (s) => s.startsAt.split(" • ")[0] === todayDateStr
  );
  
  const sessions = todaySessions;
  
  const getSessionStatusInfo = (sessionId: string, status: string) => {
    if (status === "completed") {
      const hasReport = dailyReports.some(rep => rep.sessionId === sessionId);
      if (hasReport) {
        return {
          label: "Selesai",
          colorClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
          actionLabel: "Edit Laporan Harian",
          variant: "ghost" as const,
          isPending: false
        };
      } else {
        return {
          label: "Butuh Laporan",
          colorClass: "bg-amber-100 text-amber-800 border-amber-200 animate-pulse",
          actionLabel: "Tulis Laporan Harian",
          variant: "primary" as const,
          isPending: true
        };
      }
    }
    return {
      label: "Terjadwal",
      colorClass: "bg-indigo-50 border-indigo-100 text-[#4a70a9]",
      actionLabel: "Sesi Belum Dimulai",
      variant: "ghost" as const,
      isPending: false
    };
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full flex-grow flex flex-col justify-center items-center gap-4">
        <div className="text-gray-500 font-semibold animate-pulse">Memuat data dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full flex-grow flex flex-col gap-5 sm:gap-6 animate-[fadeIn_0.5s_ease-out]">
      <header className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center bg-white/45 backdrop-blur-xl border border-white/60 shadow-sm rounded-[20px] p-4 sm:p-6">
        <div className="min-w-0">
          <h2 className="text-[22px] sm:text-2xl font-extrabold text-gray-800 tracking-tight leading-tight">Halo, {profileName}!</h2>
          <p className="text-[12px] sm:text-sm text-gray-600 mt-1 leading-relaxed">Portal Tentor • Agenda mengajar privat & laporan hari ini</p>
        </div>
        <RealtimeClock />
      </header>

      {/* Statistics Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-5 flex items-center gap-4 border border-white/80 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#4a70a9]/15 text-[#4a70a9] flex items-center justify-center border border-white/50">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sesi Hari Ini</p>
            <h4 className="font-extrabold text-gray-800 text-lg sm:text-xl">{todaySessions.length} Sesi</h4>
            <p className="text-[10px] text-gray-500 mt-0.5">Terjadwal & selesai</p>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex items-center gap-4 border border-white/80 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#4a70a9]/15 text-[#4a70a9] flex items-center justify-center border border-white/50">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Murid</p>
            <h4 className="font-extrabold text-gray-800 text-lg sm:text-xl">{muridsList.length} Siswa</h4>
            <p className="text-[10px] text-gray-500 mt-0.5">Aktif dalam bimbingan</p>
          </div>
        </GlassCard>

        <GlassCard className={`p-5 flex items-center gap-4 border border-white/80 shadow-sm transition-all duration-300 ${pendingCount > 0 ? "bg-amber-50/40 border-amber-200/50" : ""}`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/50 ${pendingCount > 0 ? "bg-amber-100 text-amber-700" : "bg-[#4a70a9]/15 text-[#4a70a9]"}`}>
            <FileWarning size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Laporan Pending</p>
            <h4 className={`font-extrabold text-lg sm:text-xl ${pendingCount > 0 ? "text-amber-700 font-bold" : "text-gray-800"}`}>
              {pendingCount} Laporan
            </h4>
            <p className="text-[10px] text-gray-500 mt-0.5">Butuh segera dilengkapi</p>
          </div>
        </GlassCard>
      </section>

        {/* Jadwal Mengajar / Sesi Terkini */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-white/40 pb-2">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Clock className="text-[#4a70a9]" size={22} />
            <span>Agenda Mengajar Privat</span>
          </h3>
          <div className="flex items-center gap-2">
            <Link href="/app/tentor/jadwal" className="inline-flex items-center gap-1 text-xs font-semibold text-[#4a70a9] hover:underline">
              <Plus size={14} /> Buat Jadwal
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/app/tentor/jadwal" className="text-xs font-semibold text-[#4a70a9] hover:underline">
              Lihat Semua
            </Link>
          </div>
        </div>

        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sessions.map((session) => {
              const murid = muridsList.find((m) => m.id === session.muridId) || session.murid || { name: "Siswa", schoolLevel: "SD" };
              const program = session.program || { id: session.programId, name: "Program Bimbingan" };
              const statusInfo = getSessionStatusInfo(session.id, session.status);
              
              return (
                <GlassCard key={session.id} className="p-5 flex flex-col justify-between gap-4 border border-white/80 shadow-sm">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                        <Clock size={12} />
                        {session.startsAt.split(" • ")[0]}
                      </span>
                      <span className={`px-2.5 py-0.5 border rounded-full text-[10px] font-bold uppercase tracking-wider ${statusInfo.colorClass}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <h4 className="font-bold text-gray-800 text-base sm:text-lg">
                      {murid.name}
                    </h4>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      {program?.name} • {murid.schoolLevel}
                    </p>

                    <div className="flex items-start gap-1.5 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200/30">
                      <MapPin size={14} className="text-[#4a70a9] shrink-0 mt-0.5" />
                      <span>{session.location}</span>
                    </div>
                  </div>

                  <div className="mt-2">
                    {session.status === "completed" ? (
                      <Link href={`/app/tentor/laporan-harian?${statusInfo.isPending ? "sessionId" : "editSessionId"}=${session.id}`} className="w-full block">
                        <Button variant={statusInfo.variant} className="w-full justify-center text-xs py-2">
                          {statusInfo.actionLabel}
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="ghost" disabled className="w-full justify-center text-xs py-2 opacity-50 cursor-not-allowed">
                        Sesi Belum Dimulai ({session.startsAt.split(" • ")[1]?.replace(" WIB", "") || "Scheduled"})
                      </Button>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        ) : (
          <GlassCard className="p-6 border border-white/80 shadow-sm flex flex-col items-start gap-3">
            <CalendarDays className="text-[#4a70a9]" size={32} />
            <div>
              <h4 className="font-bold text-gray-800 text-sm sm:text-base">Tidak Ada Jadwal Hari Ini</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                Anda tidak memiliki agenda mengajar privat yang dijadwalkan untuk hari ini.
              </p>
            </div>
            <Link href="/app/tentor/jadwal" className="mt-1">
              <Button variant="ghost" className="text-xs py-2 px-4 border border-[#4a70a9]/30 text-[#4a70a9] hover:bg-[#4a70a9]/5">
                Lihat Semua Jadwal
              </Button>
            </Link>
          </GlassCard>
        )}
      </section>

      {/* Evaluasi Perkembangan Belajar */}
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-white/40 pb-2">
          <TrendingUp className="text-[#4a70a9]" size={22} />
          <span>Evaluasi Perkembangan Belajar</span>
        </h3>
        
        <GlassCard className="p-6 border border-white/80 shadow-sm relative overflow-hidden flex flex-col gap-4">
          <div className="flex gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-amber-900">
            <AlertCircle size={20} className="shrink-0 mt-0.5 text-amber-700" />
            <div>
              <p className="text-sm font-semibold">Rapor Blok Selesai Terdeteksi</p>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Siswa <strong>Budi Santoso</strong> telah menyelesaikan 12 sesi (Blok 1) pada program <strong>Ngaji Iqra &amp; Al-Qur&apos;an</strong>. Harap segera terbitkan Laporan Perkembangan berkala untuk wali murid.
              </p>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <Link href="/app/tentor/laporan-perkembangan?muridId=murid-budi&programId=prog-ngaji&block=1">
              <Button variant="primary" className="text-xs py-2 px-5 flex items-center gap-2">
                <Plus size={14} />
                Buat Laporan Perkembangan
              </Button>
            </Link>
          </div>
        </GlassCard>
      </section>

    </div>
  );
}
