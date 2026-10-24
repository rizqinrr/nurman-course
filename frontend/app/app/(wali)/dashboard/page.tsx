/* Hallmark · genre: warm-editorial · design-system: google-stitch · designed-as-mobile-app */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { LibraryCourseDto } from "@nurman-course/shared";
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
import { getLibrary } from "@/lib/content-api";
import { formatSessionDateTime } from "@/lib/format";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import {
  BookOpen,
  Calendar,
  Clock,
  Home,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  User,
  Headphones,
  FileText,
  Sparkles,
  Video
} from "lucide-react";

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
  tentor?: { id: string; name: string } | null;
}

interface DbInvoice extends Invoice {
  enrollment: DbEnrollment;
}

interface DbSession extends Session {
  program: Program;
  tentor?: { id: string; name: string };
  dailyReport?: DailyReport | null;
}

export default function DashboardSiswaPage() {
  const [loading, setLoading] = useState(true);
  const [studentAccountName, setStudentAccountName] = useState("Siswa");
  const [murids, setMurids] = useState<DbMurid[]>([]);
  const [selectedMuridId, setSelectedMuridId] = useState("");

  const [enrollments, setEnrollments] = useState<DbEnrollment[]>([]);
  const [sessions, setSessions] = useState<DbSession[]>([]);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [, setProgressReports] = useState<ProgressReport[]>([]);
  const [invoices, setInvoices] = useState<DbInvoice[]>([]);
  const [libraryCourses, setLibraryCourses] = useState<LibraryCourseDto[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const meRes = await apiFetch<{ user: { name: string; murids: DbMurid[] } }>("/api/users/me");
        setStudentAccountName(meRes.user.name || "Siswa");
        setMurids(meRes.user.murids || []);
        if (meRes.user.murids?.length > 0) {
          setSelectedMuridId(meRes.user.murids[0].id);
        }

        const [enrollRes, sessionsRes, dailyRes, progressRes, invoiceRes, libraryRes] = await Promise.all([
          apiFetch<{ enrollments: DbEnrollment[] }>("/api/me/enrollments"),
          apiFetch<{ sessions: DbSession[] }>("/api/me/sessions"),
          apiFetch<{ reports: DailyReport[] }>("/api/me/daily-reports"),
          apiFetch<{ reports: ProgressReport[] }>("/api/me/progress-reports"),
          apiFetch<{ invoices: DbInvoice[] }>("/api/me/invoices"),
          getLibrary({ limit: 5 }).catch(() => ({ data: [] as LibraryCourseDto[] })),
        ]);

        setEnrollments(enrollRes.enrollments || []);
        setSessions(sessionsRes.sessions || []);
        setDailyReports(dailyRes.reports || []);
        setProgressReports(progressRes.reports || []);
        setInvoices(invoiceRes.invoices || []);
        setLibraryCourses(libraryRes.data || []);
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
      <div className="p-6 w-full flex-grow flex flex-col gap-4 items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-3 border-[#4a70a9]/20 border-t-[#4a70a9] animate-spin"></div>
        <p className="text-xs font-semibold text-[#535761]">Memuat beranda belajar...</p>
      </div>
    );
  }

  const selectedMurid = murids.find((m) => m.id === selectedMuridId);
  const displayStudentName = selectedMurid?.name || studentAccountName;

  const getActiveProgramInfo = () => {
    const activeEnrollment = enrollments.find((e) => e.muridId === selectedMuridId && e.status === "active");
    if (!activeEnrollment) return null;

    const program = activeEnrollment.program;
    const completedSessionsCount = sessions.filter(
      (s) => s.muridId === selectedMuridId && s.programId === program.id && s.status === "completed"
    ).length;
    const stepsCount = program.sessionsPerBlock || 12;
    const percent = Math.min(Math.round((completedSessionsCount / stepsCount) * 100), 100);
    const text = `${completedSessionsCount} / ${stepsCount} Sesi`;
    const isGuidedClass = program.category === "materi";

    return {
      program,
      percent,
      text,
      tentorName: activeEnrollment.tentor?.name || "Kak Tentor",
      pathLabel: isGuidedClass ? "Kelas Bimbingan" : "Les Privat",
    };
  };

  const getLatestDailyReport = () => {
    return dailyReports.find((r) => r.muridId === selectedMuridId);
  };

  const getUpcomingSession = () => {
    const upcoming = sessions
      .filter(
        (s) =>
          s.muridId === selectedMuridId &&
          s.status === "scheduled" &&
          new Date(s.endsAt).getTime() > Date.now()
      )
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0];
    if (!upcoming) return null;

    const startsDate = new Date(upcoming.startsAt);
    const now = new Date();
    const isTomorrow =
      startsDate.getDate() === now.getDate() + 1 &&
      startsDate.getMonth() === now.getMonth() &&
      startsDate.getFullYear() === now.getFullYear();
    const isToday =
      startsDate.getDate() === now.getDate() &&
      startsDate.getMonth() === now.getMonth() &&
      startsDate.getFullYear() === now.getFullYear();

    let relativeLabel = "Sesi Mendatang";
    if (isToday) relativeLabel = "Hari ini";
    else if (isTomorrow) relativeLabel = "Besok, 1 hari lagi";

    const formatted = formatSessionDateTime(upcoming.startsAt);
    const loc = upcoming.location || "Les Privat - Tatap Muka";
    const isOnline = /online|zoom|meet|discord|daring/i.test(loc);

    return {
      dateFormatted: formatted.split(" • ")[0],
      timeFormatted: formatted.split(" • ")[1] || "16:00 - 17:30 WIB",
      tutorName: upcoming.tentor?.name || "Tentor nCourse",
      location: loc,
      isOnline,
      relativeLabel,
    };
  };

  const getUnpaidInvoice = () => {
    return invoices.find((inv) => inv.enrollment.muridId === selectedMuridId && inv.status === "unpaid");
  };

  const progInfo = getActiveProgramInfo();
  const latestDailyReport = getLatestDailyReport();
  const upcomingSession = getUpcomingSession();
  const unpaidInvoice = getUnpaidInvoice();
  const nextSelfCourse = libraryCourses.find((course) => course.progress.percentage < 100) || libraryCourses[0];

  return (
    <div className="px-4 pt-3 pb-8 space-y-4 animate-[fadeIn_0.3s_ease-out] font-dm text-[#1a1a2e]">
      {/* Top Greeting Header */}
      <section className="flex items-center justify-between pt-1 pb-1">
        <div>
          <h1 className="text-[22px] font-normal text-[#1a1a2e] font-playfair tracking-tight leading-snug">
            Halo, {displayStudentName}
          </h1>
          <span className="text-xs text-[#535761]">
            Ringkasan jadwal bimbingan, materi mandiri, dan progres belajarmu
          </span>
        </div>
      </section>

      {/* Selector jika akun terhubung ke > 1 profil siswa (kompatibilitas transisi) */}
      {murids.length > 1 && (
        <section aria-label="Pilih Profil Siswa" className="overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-2.5 min-w-max">
            {murids.map((m) => {
              const isSelected = m.id === selectedMuridId;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMuridId(m.id)}
                  type="button"
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                    isSelected
                      ? "bg-[#4a70a9] text-white shadow-sm"
                      : "bg-white border border-[#E5DDD0] text-[#535761] hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? "bg-[#F1E1C0]" : "bg-[#C3C6D1]"
                    }`}
                  />
                  <span>{m.name}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Quick Action Pills (Belajar Mandiri & Katalog Program) */}
      <section className="grid grid-cols-2 gap-2.5">
        <Link
          href="/app/materi"
          className="flex items-center justify-between rounded-xl border border-[#2e4b7a] bg-[#2e4b7a] px-3.5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#22395e]"
        >
          <span className="flex items-center gap-2">
            <BookOpen size={15} className="text-[#f2c14e]" />
            Belajar Mandiri
          </span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
        <Link
          href="/app/program"
          className="flex items-center justify-between rounded-xl border border-[#B8CDE4] bg-[#EAF0F8] px-3.5 py-2.5 text-xs font-bold text-[#224477] transition-colors hover:bg-[#D5E3FF]"
        >
          <span className="flex items-center gap-2">
            <Sparkles size={15} />
            Katalog Program
          </span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </section>

      {/* Lanjutkan Materi Mandiri Card */}
      <section className="bg-white border border-[#E5DDD0] rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#E5DDD0]/50">
          <div className="flex items-center gap-1.5 text-[#2e4b7a]">
            <BookOpen size={15} />
            <span className="text-[11px] font-bold">Belajar Mandiri</span>
          </div>
          <Link href="/app/materi" className="text-[11px] font-bold text-[#2e4b7a] hover:underline">
            Buka Ruang Materi →
          </Link>
        </div>
        {nextSelfCourse ? (
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#1a1a2e] truncate">{nextSelfCourse.title}</p>
              <p className="text-xs text-[#535761] mt-0.5">
                Progres {nextSelfCourse.progress.percentage}% · {nextSelfCourse.progress.completedLessons}/{nextSelfCourse.progress.totalLessons} lesson
              </p>
            </div>
            <Link
              href={`/kelas/${encodeURIComponent(nextSelfCourse.slug)}`}
              className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-[#EAF0F8] px-3 py-2 text-xs font-bold text-[#224477] hover:bg-[#D5E3FF]"
            >
              <span>Lanjut</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-[#535761] leading-relaxed">
              Akses modul dan artikel materi kapan saja sesuai ritme belajarmu.
            </p>
            <Link
              href="/materi"
              className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-[#EAF0F8] px-3 py-2 text-xs font-bold text-[#224477] hover:bg-[#D5E3FF]"
            >
              <span>Jelajahi</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </section>

      {selectedMurid ? (
        <>
          {/* Alert Tagihan (Conditional) */}
          {unpaidInvoice && (
            <section className="bg-[#FEF3C7] border border-[#D97706] rounded-[10px] p-3.5 shadow-sm transition-all">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-[#92400E] shrink-0 mt-0.5" size={20} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-xs font-bold text-[#78350F] leading-snug">
                      Tagihan Menunggu Pembayaran
                    </h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FDE68A] text-[#78350F]">
                      Penting
                    </span>
                  </div>
                  <p className="text-[11px] text-[#78350F] mt-0.5 leading-relaxed">
                    Total Rp {unpaidInvoice.amount.toLocaleString("id-ID")} • Jatuh tempo{" "}
                    {formatSessionDateTime(unpaidInvoice.dueAt).split(" • ")[0]}.
                  </p>
                  <div className="mt-2">
                    <Link
                      href="/app/tagihan"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#92400E] hover:underline group"
                    >
                      <span>Lihat &amp; Konfirmasi Pembayaran</span>
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Program Bimbingan / Les Privat Aktif Card */}
          {progInfo ? (
            <section className="bg-white border border-[#E5DDD0] rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E5DDD0]/40">
                <div className="flex items-center gap-1.5 text-[#2e4b7a]">
                  <BookOpen size={16} />
                  <span className="text-[11px] font-bold">{progInfo.pathLabel} Aktif</span>
                </div>
                <span className="inline-flex items-center gap-1 bg-[#DCFCE7] text-[#15803D] rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]"></span>
                  Aktif
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-base font-bold text-[#1a1a2e] font-playfair leading-snug">
                  {progInfo.program.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5 text-[#535761] text-xs">
                  <User size={14} />
                  <span>Tentor: {progInfo.tentorName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#E5DDD0]/40">
                  <div className="bg-[#F7F4EF] rounded-lg p-2.5">
                    <span className="text-[11px] font-semibold text-[#535761] block">
                      Paket Sesi
                    </span>
                    <span className="text-xs font-bold text-[#1a1a2e] mt-0.5 block">{progInfo.text}</span>
                  </div>
                  <div className="bg-[#F7F4EF] rounded-lg p-2.5">
                    <span className="text-[11px] font-semibold text-[#535761] block">
                      Progres Blok
                    </span>
                    <span className="text-xs font-bold text-[#2e4b7a] mt-0.5 block">{progInfo.percent}%</span>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="bg-white border border-[#E5DDD0] rounded-xl p-4 shadow-sm text-center text-xs text-[#535761]">
              Belum ada Kelas Bimbingan atau Les Privat aktif untuk {selectedMurid.name}.
            </section>
          )}

          {/* Sesi Terdekat (Highlighted Card) */}
          {upcomingSession ? (
            <section className="bg-[#EAF0F8] border border-[#B8CDE4] rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#224477]">
                  <Calendar size={16} />
                  <span className="text-[11px] font-bold">Sesi Belajar Berikutnya</span>
                </div>
                <span className="bg-white text-[#224477] text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs border border-[#B8CDE4]/60">
                  {upcomingSession.relativeLabel}
                </span>
              </div>
              <div className="mt-2.5">
                <h4 className="text-base font-bold text-[#1a1a2e] font-playfair">
                  {upcomingSession.dateFormatted}
                </h4>
                <div className="flex items-center gap-1.5 mt-1 text-[#224477] text-xs font-bold">
                  <Clock size={14} />
                  <span>{upcomingSession.timeFormatted}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-[#535761] text-xs">
                  {upcomingSession.isOnline ? <Video size={14} /> : <Home size={14} />}
                  <span>{upcomingSession.location}</span>
                </div>
                <div className="mt-3.5 pt-2.5 border-t border-[#B8CDE4]/60 flex items-center justify-between">
                  <span className="text-[11px] text-[#434750] font-medium">Tentor Pendamping:</span>
                  <span className="text-xs font-bold text-[#1a1a2e]">{upcomingSession.tutorName}</span>
                </div>
              </div>
            </section>
          ) : (
            <section className="bg-white border border-[#E5DDD0] rounded-xl p-4 shadow-sm text-center text-xs text-[#535761]">
              Belum ada jadwal sesi belajar mendatang.
            </section>
          )}

          {latestDailyReport ? (
            <section className="bg-white border border-[#E5DDD0] rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5DDD0]/40">
                <div className="flex items-center gap-1.5 text-[#2e4b7a]">
                  <FileText size={16} />
                  <span className="text-[11px] font-bold">Laporan Sesi Terakhir</span>
                </div>
                <span className="text-[11px] text-[#535761]">
                  {formatSessionDateTime(latestDailyReport.date).split(" • ")[0]}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-sm font-bold text-[#1a1a2e] leading-snug">
                  {latestDailyReport.activity}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-[#15803D] text-xs font-semibold bg-[#DCFCE7] px-2 py-0.5 rounded">
                    <CheckCircle2 size={13} />
                    <span>Kehadiran: Hadir Tepat Waktu</span>
                  </span>
                </div>
                {latestDailyReport.notes && (
                  <div className="mt-2.5 bg-[#F7F4EF] rounded-lg p-3 border border-[#E5DDD0]">
                    <p className="text-xs text-[#434750] italic leading-relaxed">
                      &quot;{latestDailyReport.notes}&quot;
                    </p>
                  </div>
                )}
                <div className="mt-3 pt-2 text-right">
                  <Link
                    href="/app/laporan"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#2e4b7a] hover:underline group"
                  >
                    <span>Lihat Semua Laporan</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </section>
          ) : (
            <section className="bg-white border border-[#E5DDD0] rounded-xl p-4 shadow-sm text-center text-xs text-[#535761]">
              Belum ada riwayat laporan harian yang diterbitkan.
            </section>
          )}

          {/* Direct Support Contact */}
          <section className="bg-white border border-[#E5DDD0] rounded-xl p-3.5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F1E1C0] flex items-center justify-center text-[#5A4E36] shrink-0">
                <Headphones size={18} />
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#1a1a2e]">Konsultasi Akademik</h5>
                <p className="text-[11px] text-[#535761]">Hubungi koordinator nCourse</p>
              </div>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Halo Admin nCourse, saya dari akun siswa ${selectedMurid.name}. Ingin berkonsultasi mengenai program belajar. Terima kasih.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#EAF0F8] hover:bg-[#D5E3FF] text-[#224477] text-xs font-bold rounded-lg active:scale-95 transition-all border border-[#B8CDE4]"
            >
              Chat WA
            </a>
          </section>
        </>
      ) : (
        <div className="text-center py-10 px-4 bg-white border border-[#E5DDD0] rounded-xl text-xs text-[#535761] space-y-2">
          <p className="font-bold text-[#1a1a2e] text-sm">Belum Ada Program Bimbingan / Les Privat</p>
          <p>Kamu tetap bisa langsung belajar mandiri di Ruang Materi atau mendaftar Kelas Bimbingan &amp; Les Privat baru.</p>
          <div className="pt-2 flex flex-wrap justify-center gap-2">
            <Link href="/app/materi" className="px-3.5 py-2 rounded-lg bg-[#2e4b7a] text-white font-bold">
              Buka Materi Mandiri
            </Link>
            <Link href="/course" className="px-3.5 py-2 rounded-lg bg-[#EAF0F8] text-[#224477] font-bold border border-[#B8CDE4]">
              Daftar Kelas / Les
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
