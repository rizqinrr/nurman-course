/* Hallmark · genre: warm-editorial · design-system: google-stitch · designed-as-mobile-app */
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
  FileText
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

export default function DashboardWaliPage() {
  const [loading, setLoading] = useState(true);
  const [parentName, setParentName] = useState("Ibu / Bapak");
  const [murids, setMurids] = useState<DbMurid[]>([]);
  const [selectedMuridId, setSelectedMuridId] = useState("");

  const [enrollments, setEnrollments] = useState<DbEnrollment[]>([]);
  const [sessions, setSessions] = useState<DbSession[]>([]);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [progressReports, setProgressReports] = useState<ProgressReport[]>([]);
  const [invoices, setInvoices] = useState<DbInvoice[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const meRes = await apiFetch<{ user: { name: string; murids: DbMurid[] } }>("/api/users/me");
        setParentName(meRes.user.name || "Wali Murid");
        setMurids(meRes.user.murids || []);
        if (meRes.user.murids?.length > 0) {
          setSelectedMuridId(meRes.user.murids[0].id);
        }

        const [enrollRes, sessionsRes, dailyRes, progressRes, invoiceRes] = await Promise.all([
          apiFetch<{ enrollments: DbEnrollment[] }>("/api/me/enrollments"),
          apiFetch<{ sessions: DbSession[] }>("/api/me/sessions"),
          apiFetch<{ reports: DailyReport[] }>("/api/me/daily-reports"),
          apiFetch<{ reports: ProgressReport[] }>("/api/me/progress-reports"),
          apiFetch<{ invoices: DbInvoice[] }>("/api/me/invoices"),
        ]);

        setEnrollments(enrollRes.enrollments || []);
        setSessions(sessionsRes.sessions || []);
        setDailyReports(dailyRes.reports || []);
        setProgressReports(progressRes.reports || []);
        setInvoices(invoiceRes.invoices || []);
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
        <p className="text-xs font-semibold text-[#737781]">Memuat dashboard...</p>
      </div>
    );
  }

  const selectedMurid = murids.find((m) => m.id === selectedMuridId);

  // Resolver helper
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

    return { program, percent, text, tentorName: activeEnrollment.tentor?.name || "Kak Tentor" };
  };

  const getLatestDailyReportWali = () => {
    return dailyReports.find((r) => r.muridId === selectedMuridId);
  };

  const getUpcomingSessionWali = () => {
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
    return {
      dateFormatted: formatted.split(" • ")[0],
      timeFormatted: formatted.split(" • ")[1] || "16:00 - 17:30 WIB",
      tutorName: upcoming.tentor?.name || "Tentor Nurman",
      location: upcoming.location || "Les Privat - Tatap Muka",
      relativeLabel,
    };
  };

  const getUnpaidInvoiceWali = () => {
    return invoices.find((inv) => inv.enrollment.muridId === selectedMuridId && inv.status === "unpaid");
  };

  const progInfo = getActiveProgramInfo();
  const latestDailyReport = getLatestDailyReportWali();
  const upcomingSession = getUpcomingSessionWali();
  const unpaidInvoice = getUnpaidInvoiceWali();

  return (
    <div className="px-4 pt-3 pb-8 space-y-4 animate-[fadeIn_0.3s_ease-out] font-dm text-[#1a1a2e]">
      {/* Top Greeting Header (Stitch Viewport) */}
      <section className="flex flex-col pt-1 pb-1">
        <h1 className="text-[22px] font-normal text-[#1a1a2e] font-playfair tracking-tight leading-snug">
          Halo, {parentName}
        </h1>
        <span className="text-xs text-[#737781]">Selamat datang kembali</span>
      </section>

      {/* Child Selector Tabs */}
      {murids.length > 0 && (
        <section aria-label="Pilih Profil Anak" className="overflow-x-auto no-scrollbar py-0.5">
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
                      : "bg-white border border-[#E5DDD0] text-[#737781] hover:bg-gray-50"
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

      {selectedMurid ? (
        <>
          {/* Alert Tagihan (Conditional) */}
          {unpaidInvoice && (
            <section className="bg-[#FEF3C7] border border-[#D97706] border-l-4 border-l-[#D97706] rounded-[10px] p-3.5 shadow-sm transition-all">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-[#D97706] shrink-0 mt-0.5" size={20} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-xs font-bold text-[#92400E] leading-snug">
                      Tagihan Menunggu Pembayaran
                    </h2>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#FDE68A] text-[#92400E]">
                      Penting
                    </span>
                  </div>
                  <p className="text-[11px] text-[#92400E]/90 mt-0.5 leading-relaxed">
                    Total Rp {unpaidInvoice.amount.toLocaleString("id-ID")} • Jatuh tempo{" "}
                    {formatSessionDateTime(unpaidInvoice.dueAt).split(" • ")[0]}.
                  </p>
                  <div className="mt-2">
                    <Link
                      href="/app/tagihan"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#D97706] hover:underline group"
                    >
                      <span>Bayar Sekarang</span>
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Program Aktif Card */}
          {progInfo ? (
            <section className="bg-white border border-[#E5DDD0] rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E5DDD0]/40">
                <div className="flex items-center gap-1.5 text-[#737781]">
                  <BookOpen size={16} className="text-[#4a70a9]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#737781]">
                    Program Aktif
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 bg-[#DCFCE7] text-[#16A34A] rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                  Aktif
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-base font-bold text-[#1a1a2e] font-playfair leading-snug">
                  {progInfo.program.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5 text-[#737781] text-xs">
                  <User size={14} />
                  <span>Tentor: {progInfo.tentorName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#E5DDD0]/40">
                  <div className="bg-[#F7F4EF] rounded-lg p-2.5">
                    <span className="text-[10px] font-semibold text-[#737781] block uppercase tracking-wide">
                      Paket Sesi
                    </span>
                    <span className="text-xs font-bold text-[#1a1a2e] mt-0.5 block">{progInfo.text}</span>
                  </div>
                  <div className="bg-[#F7F4EF] rounded-lg p-2.5">
                    <span className="text-[10px] font-semibold text-[#737781] block uppercase tracking-wide">
                      Progres Belajar
                    </span>
                    <span className="text-xs font-bold text-[#4a70a9] mt-0.5 block">{progInfo.percent}%</span>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="bg-white border border-[#E5DDD0] rounded-xl p-4 shadow-sm text-center text-xs text-[#737781]">
              Belum ada program bimbingan aktif untuk {selectedMurid.name}.
            </section>
          )}

          {/* Sesi Terdekat (Highlighted Card) */}
          {upcomingSession ? (
            <section className="bg-[#EAF0F8] border border-[#B8CDE4] rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)] relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#4a70a9]/10 rounded-full pointer-events-none" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#4a70a9]">
                  <Calendar size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Sesi Terdekat</span>
                </div>
                <span className="bg-white text-[#4a70a9] text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs border border-[#B8CDE4]/60">
                  {upcomingSession.relativeLabel}
                </span>
              </div>
              <div className="mt-2.5">
                <h4 className="text-base font-bold text-[#1a1a2e] font-playfair">
                  {upcomingSession.dateFormatted}
                </h4>
                <div className="flex items-center gap-1.5 mt-1 text-[#4a70a9] text-xs font-bold">
                  <Clock size={14} />
                  <span>{upcomingSession.timeFormatted}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-[#737781] text-xs">
                  <Home size={14} />
                  <span>{upcomingSession.location}</span>
                </div>
                <div className="mt-3.5 pt-2.5 border-t border-[#B8CDE4]/60 flex items-center justify-between">
                  <span className="text-[11px] text-[#434750] font-medium">Pengajar:</span>
                  <span className="text-xs font-bold text-[#1a1a2e]">{upcomingSession.tutorName}</span>
                </div>
              </div>
            </section>
          ) : (
            <section className="bg-white border border-[#E5DDD0] rounded-xl p-4 shadow-sm text-center text-xs text-[#737781]">
              Belum ada jadwal sesi belajar mendatang.
            </section>
          )}

          {/* Rekap Rapor Terakhir */}
          {latestDailyReport ? (
            <section className="bg-white border border-[#E5DDD0] rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5DDD0]/40">
                <div className="flex items-center gap-1.5 text-[#737781]">
                  <FileText size={16} className="text-[#4a70a9]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#737781]">
                    Rapor Terakhir
                  </span>
                </div>
                <span className="text-[11px] text-[#737781]">
                  Sesi {formatSessionDateTime(latestDailyReport.date).split(" • ")[0]}
                </span>
              </div>
              <div className="mt-3">
                <div>
                  <p className="text-[10px] font-semibold text-[#737781] uppercase tracking-wide">
                    Materi Pembelajaran
                  </p>
                  <h4 className="text-sm font-bold text-[#1a1a2e] mt-0.5 leading-snug">
                    {latestDailyReport.activity}
                  </h4>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-[#16A34A] text-xs font-semibold bg-[#DCFCE7]/60 px-2 py-0.5 rounded">
                    <CheckCircle2 size={13} />
                    <span>Kehadiran: Hadir Tepat Waktu</span>
                  </span>
                </div>
                {latestDailyReport.notes && (
                  <div className="mt-2.5 bg-[#F7F4EF] rounded-lg p-3 border-l-2 border-[#4a70a9]">
                    <p className="text-xs text-[#434750] italic leading-relaxed">
                      &quot;{latestDailyReport.notes}&quot;
                    </p>
                  </div>
                )}
                <div className="mt-3 pt-2 text-right">
                  <Link
                    href="/app/laporan"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#4a70a9] hover:underline group"
                  >
                    <span>Lihat Semua Laporan</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </section>
          ) : (
            <section className="bg-white border border-[#E5DDD0] rounded-xl p-4 shadow-sm text-center text-xs text-[#737781]">
              Belum ada riwayat laporan harian yang diterbitkan.
            </section>
          )}

          {/* Institutional Direct Support Contact */}
          <section className="bg-white border border-[#E5DDD0] rounded-xl p-3.5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F1E1C0]/60 flex items-center justify-center text-[#6F6349] shrink-0">
                <Headphones size={18} />
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#1a1a2e]">Konsultasi Akademik</h5>
                <p className="text-[11px] text-[#737781]">Hubungi koordinator les</p>
              </div>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Halo Admin Nurman Course, saya wali murid dari ${selectedMurid.name}. Ingin berkonsultasi mengenai bimbingan belajar anak saya. Terima kasih.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#EAF0F8] hover:bg-[#D5E3FF] text-[#30578F] text-xs font-bold rounded-lg active:scale-95 transition-all border border-[#B8CDE4]/50"
            >
              Chat
            </a>
          </section>
        </>
      ) : (
        <div className="text-center py-12 bg-white border border-[#E5DDD0] rounded-xl text-xs text-[#737781]">
          Tidak ada data anak ditemukan. Hubungi admin untuk mendaftarkan anak Anda.
        </div>
      )}
    </div>
  );
}
