/* Hallmark · genre: playful-glassmorphism · design-system: design.md · designed-as-app */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Murid,
  Program,
  Session,
  DailyReport,
  ProgressReport,
  Invoice,
  Enrollment
} from "@/data/lms";
import { apiFetch } from "@/lib/api";
import { formatSessionDateTime, calculateAge } from "@/lib/format";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { 
  UserCheck, 
  Calendar, 
  CalendarDays,
  FileText, 
  TrendingUp, 
  Clock, 
  CreditCard,
  GraduationCap
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

interface DbMurid {
  id: string;
  name: string;
  birthDate?: string | null;
  schoolLevel?: string | null;
  avatarUrl?: string | null;
  photoPath?: string | null;
}

interface DbEnrollment extends Enrollment {
  program: Program;
  murid: Murid;
}

interface DbInvoice extends Invoice {
  enrollment: DbEnrollment;
}

interface DbSession extends Session {
  program: Program;
  dailyReport?: DailyReport | null;
}

export default function DashboardWaliPage() {
  const [loading, setLoading] = useState(true);
  const [parentName, setParentName] = useState("Wali Murid");
  const [murids, setMurids] = useState<DbMurid[]>([]);
  const [selectedMuridId, setSelectedMuridId] = useState("");
  
  // Data lists
  const [enrollments, setEnrollments] = useState<DbEnrollment[]>([]);
  const [sessions, setSessions] = useState<DbSession[]>([]);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [progressReports, setProgressReports] = useState<ProgressReport[]>([]);
  const [invoices, setInvoices] = useState<DbInvoice[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        // Live Mode
        const meRes = await apiFetch<{ user: { name: string; murids: DbMurid[] } }>("/api/users/me");
        setParentName(meRes.user.name);
        setMurids(meRes.user.murids || []);
        if (meRes.user.murids?.length > 0) {
          setSelectedMuridId(meRes.user.murids[0].id);
        }

        const [enrollRes, sessionsRes, dailyRes, progressRes, invoiceRes] = await Promise.all([
          apiFetch<{ enrollments: DbEnrollment[] }>("/api/me/enrollments"),
          apiFetch<{ sessions: DbSession[] }>("/api/me/sessions"),
          apiFetch<{ reports: DailyReport[] }>("/api/me/daily-reports"),
          apiFetch<{ reports: ProgressReport[] }>("/api/me/progress-reports"),
          apiFetch<{ invoices: DbInvoice[] }>("/api/me/invoices")
        ]);

        setEnrollments(enrollRes.enrollments);
        setSessions(sessionsRes.sessions);
        setDailyReports(dailyRes.reports);
        setProgressReports(progressRes.reports);
        setInvoices(invoiceRes.invoices);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full flex-grow flex flex-col gap-6 items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#4a70a9] animate-spin"></div>
        <p className="text-sm font-semibold text-gray-600">Memuat data dashboard...</p>
      </div>
    );
  }

  const selectedMurid = murids.find((m) => m.id === selectedMuridId);

  // Helper functions resolver
  const getActiveProgramInfo = () => {
    // Live mode resolver
    const activeEnrollment = enrollments.find(e => e.muridId === selectedMuridId && e.status === "active");
    if (!activeEnrollment) return null;

    const program = activeEnrollment.program;
    const completedSessionsCount = sessions.filter(s => s.muridId === selectedMuridId && s.programId === program.id && s.status === "completed").length;
    const stepsCount = program.sessionsPerBlock || 12;
    const percent = Math.min(Math.round((completedSessionsCount / stepsCount) * 100), 100);
    const text = `Sesi ${completedSessionsCount} dari ${stepsCount}`;

    return { program, percent, text };
  };

  const getLatestDailyReportWali = () => {
    return dailyReports.find(r => r.muridId === selectedMuridId);
  };

  const getLatestProgressReportWali = (programId: string) => {
    return progressReports.find(r => r.muridId === selectedMuridId && r.programId === programId);
  };

  const getUpcomingSessionWali = () => {
    const s = sessions.find(s => s.muridId === selectedMuridId && s.status === "scheduled");
    return s ? { startsAt: formatSessionDateTime(s.startsAt), tutorName: "Kak Kiki", location: s.location || "Rumah Siswa" } : null;
  };

  const getUnpaidInvoiceWali = () => {
    return invoices.find(inv => inv.enrollment.muridId === selectedMuridId && inv.status === "unpaid");
  };

  const isUrgentInvoice = (inv: DbInvoice) => {
    return inv.status === "unpaid" && new Date(inv.dueAt).getTime() <= Date.now() + 24 * 60 * 60 * 1000;
  };

  const progInfo = getActiveProgramInfo();
  const latestDailyReport = getLatestDailyReportWali();
  const latestProgressReport = progInfo ? getLatestProgressReportWali(progInfo.program.id) : null;
  const upcomingSession = getUpcomingSessionWali();
  const unpaidInvoice = getUnpaidInvoiceWali();
  const hasUrgentInvoice = invoices.some(
    (inv) => inv.enrollment.muridId === selectedMuridId && isUrgentInvoice(inv)
  );

  const sessionCard = (
    <GlassCard className="p-6 flex flex-col gap-4 border border-white/80 shadow-sm">
      <div className="flex items-center gap-2 border-b border-white/40 pb-3">
        <Calendar className="text-gray-500" size={20} />
        <h3 className="font-bold text-gray-800 text-base">Sesi Terdekat</h3>
      </div>
      {upcomingSession ? (
        <div className="flex flex-col gap-2 flex-grow justify-between">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#4a70a9]">{upcomingSession.startsAt}</h4>
            <p className="text-xs text-gray-500 mt-1">Tutor: {upcomingSession.tutorName}</p>
            <p className="text-xs text-gray-500">{upcomingSession.location}</p>
          </div>
          <Link href="/app/jadwal" className="mt-4 w-full block">
            <Button variant="ghost" className="w-full text-xs justify-center py-2">
              Detail Jadwal
            </Button>
          </Link>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 flex-grow flex items-center justify-center">
          Belum ada jadwal sesi terdekat.
        </div>
      )}
    </GlassCard>
  );

  const invoiceCard = (
    <GlassCard className="p-6 flex flex-col gap-4 border border-white/80 shadow-sm">
      <div className="flex items-center gap-2 justify-between border-b border-white/40 pb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="text-gray-500" size={20} />
          <h3 className="font-bold text-gray-800 text-base">Tagihan Terdekat</h3>
        </div>
        {unpaidInvoice && (
          <span className="px-2.5 py-0.5 bg-red-100 text-red-800 rounded-full text-[10px] font-bold shadow-sm animate-pulse">
            Belum Lunas
          </span>
        )}
      </div>
      {unpaidInvoice ? (
        <div className="flex flex-col gap-4 flex-grow justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">#{unpaidInvoice.id}</p>
            <h4 className="text-2xl font-bold text-gray-800">
              Rp {unpaidInvoice.amount.toLocaleString("id-ID")}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Jatuh Tempo: {formatSessionDateTime(unpaidInvoice.dueAt).split(" • ")[0]}
            </p>
          </div>
          <Link href="/app/tagihan" className="w-full block">
            <Button className="w-full text-xs justify-center py-2.5 shadow-[0_4px_12px_rgba(74,112,169,0.3)]">
              Rincian Pembayaran
            </Button>
          </Link>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 flex-grow flex items-center justify-center">
          Semua tagihan sudah lunas!
        </div>
      )}
    </GlassCard>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full flex-grow flex flex-col gap-6">
      
      {/* Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl p-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
            Halo, {parentName}!
          </h2>
          <p className="text-sm text-gray-600">
            Portal Wali Murid • Pantau perkembangan belajar buah hati Anda
          </p>
        </div>
        <RealtimeClock />
      </header>



      {/* Top Block: Sesi Terdekat & Tagihan Ringkas (H-1) */}
      {selectedMurid && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessionCard}
          {hasUrgentInvoice && invoiceCard}
        </section>
      )}

      {/* Content Grid */}
      {selectedMurid ? (
        <div className="flex flex-col gap-6">
          
          {/* Block A: Informasi Murid & Program */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3 border-b border-white/40 pb-2">
              <UserCheck className="text-[#4a70a9]" size={24} />
              <h3 className="text-lg font-bold text-gray-800">Informasi Murid & Program</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profil Murid */}
              <GlassCard className="p-5 flex items-center gap-4 border border-white/80 shadow-sm">
                {selectedMurid.photoPath || selectedMurid.avatarUrl ? (
                  <img
                    src={selectedMurid.photoPath || selectedMurid.avatarUrl || ""}
                    alt={selectedMurid.name}
                    className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-white shadow-md"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#4a70a9]/15 flex items-center justify-center shrink-0 border-2 border-white shadow-inner text-[#4a70a9]">
                    <GraduationCap size={28} />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{selectedMurid.name}</h4>
                  <p className="text-sm text-gray-500">
                    {calculateAge(selectedMurid.birthDate)} Tahun • {selectedMurid.schoolLevel || "Belum ditentukan"}
                  </p>
                </div>
              </GlassCard>
              {/* Program & Progres */}
              {progInfo ? (
                <GlassCard className="p-5 flex flex-col justify-between gap-4 border border-white/80 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Program Aktif
                      </p>
                      <h4 className="font-bold text-gray-800">{progInfo.program.name}</h4>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100/80 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Aktif
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-semibold text-gray-500">
                      <span>Progres Belajar</span>
                      <span className="text-[#4a70a9]">{progInfo.text}</span>
                    </div>
                    <div className="w-full bg-gray-200/80 rounded-full h-2 overflow-hidden shadow-inner">
                      <div 
                        className="bg-[#4a70a9] h-full rounded-full transition-[width] duration-500" 
                        style={{ width: `${progInfo.percent}%` }}
                      ></div>
                    </div>
                  </div>
                </GlassCard>
              ) : (
                <GlassCard className="p-5 flex items-center justify-center text-center text-gray-500 border border-white/80 shadow-sm">
                  Belum terdaftar di program aktif apa pun.
                </GlassCard>
              )}
            </div>
          </section>

          {/* Block B: Laporan Harian Terakhir */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3 border-b border-white/40 pb-2">
              <FileText className="text-[#4a70a9]" size={24} />
              <h3 className="text-lg font-bold text-gray-800">Laporan Sesi Terakhir</h3>
            </div>
            {latestDailyReport ? (
              <GlassCard className="p-6 flex flex-col gap-4 border border-white/80 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                  <Clock size={14} />
                  <span>
                    {formatSessionDateTime(latestDailyReport.date).split(" • ")[0]} • {latestDailyReport.startTime} - {latestDailyReport.endTime} WIB
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Materi Diajarkan
                  </p>
                  <p className="font-bold text-gray-800 text-sm sm:text-base">
                    {latestDailyReport.activity}
                  </p>
                </div>
                <div className="bg-[#4a70a9]/5 rounded-xl p-4 border border-[#4a70a9]/10 relative">
                  <p className="text-[10px] font-bold text-[#4a70a9] uppercase tracking-wider mb-2">
                    Catatan Guru
                  </p>
                  <p className="text-sm italic text-gray-600">
                    &quot;{latestDailyReport.notes || "Tidak ada catatan sesi ini."}&quot;
                  </p>
                </div>
              </GlassCard>
            ) : (
              <GlassCard className="p-6 text-center text-gray-500 border border-white/80 shadow-sm">
                Belum ada riwayat laporan sesi.
              </GlassCard>
            )}
            <Link href="/app/laporan" className="w-full">
              <Button variant="ghost" className="w-full justify-center text-sm border-dashed border-[#4a70a9]/30 text-[#4a70a9] hover:bg-[#4a70a9]/5 py-3">
                Lihat Riwayat Laporan Harian Lengkap
              </Button>
            </Link>
          </section>

          {/* Block C: Rapor Perkembangan */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3 border-b border-white/40 pb-2">
              <TrendingUp className="text-[#4a70a9]" size={24} />
              <h3 className="text-lg font-bold text-gray-800">Rapor Perkembangan Belajar</h3>
            </div>
            {latestProgressReport ? (
              <GlassCard className="p-6 flex flex-col gap-4 border border-white/80 shadow-sm">
                <span className="self-start px-3 py-1 bg-indigo-50 border border-indigo-100 text-[#4a70a9] text-xs font-bold rounded-lg shadow-sm">
                  Periode: Blok {latestProgressReport.blockNumber} ({progInfo?.program.sessionsPerBlock || 12} Sesi)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2 mb-3">
                      <span className="p-1 rounded-md bg-emerald-50 text-emerald-600 font-bold text-[10px]">✓</span>
                      Pencapaian Utama
                    </h4>
                    <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 space-y-1">
                      {latestProgressReport.achievements.map((ach, idx) => (
                        <li key={idx}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2 mb-3">
                      <span className="p-1 rounded-md bg-amber-50 text-amber-600 font-bold text-[10px]">!</span>
                      Materi Butuh Latihan
                    </h4>
                    <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 space-y-1">
                      {latestProgressReport.weakMaterials.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-200/50 pt-4 mt-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Saran Guru:</p>
                  <p className="text-xs sm:text-sm text-gray-600 italic mt-1">&quot;{latestProgressReport.notes || "Tidak ada saran khusus."}&quot;</p>
                </div>
              </GlassCard>
            ) : (
              <GlassCard className="p-6 text-center text-gray-500 border border-white/80 shadow-sm">
                Rapor perkembangan akan terbit setelah menyelesaikan blok pertemuan belajar anak.
              </GlassCard>
            )}
            <Link href="/app/laporan" className="w-full">
              <Button variant="ghost" className="w-full justify-center text-sm border-dashed border-[#4a70a9]/30 text-[#4a70a9] hover:bg-[#4a70a9]/5 py-3">
                Buka Laporan Perkembangan Lengkap
              </Button>
            </Link>
          </section>

          {/* Tagihan Ringkas (tampil di bawah saat tidak ada tagihan H-1) */}
          {!hasUrgentInvoice && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {invoiceCard}
            </div>
          )}

        </div>
      ) : (
        <div className="text-center py-12 bg-white/40 border border-white/60 rounded-2xl text-gray-500">
          Tidak ada data anak ditemukan. Hubungi admin untuk mendaftarkan anak Anda.
        </div>
      )}
    </div>
  );
}
