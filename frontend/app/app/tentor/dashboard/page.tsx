/* Hallmark · genre: warm-editorial · design-system: design.md · designed-as-mobile-app */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Session,
  DailyReport,
  Murid,
  DbMurid,
  Program,
  ProgressReport,
} from "@/data/lms";
import { apiFetch } from "@/lib/api";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import useClock from "@/hooks/useClock";
import Button from "@/components/ui/Button";
import {
  CalendarDays,
  Users,
  FileWarning,
  Clock,
  MapPin,
  AlertCircle,
  Plus,
  TrendingUp,
  MessageCircle,
  ExternalLink,
  Video,
} from "lucide-react";

function RealtimeClock({ nowMs }: { nowMs: number | null }) {
  if (nowMs === null) {
    return (
      <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0 animate-pulse">
        <div className="h-6 w-44 bg-[#E5DDD0] rounded-full"></div>
        <div className="h-6 w-32 bg-[#EAF0F8] rounded-full"></div>
      </div>
    );
  }

  const dateStr = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(nowMs);

  const timeStr = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(nowMs);

  return (
    <div className="flex flex-wrap items-center gap-2 shrink-0">
      <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F7F4EF] border border-[#E5DDD0] rounded-full">
        <CalendarDays size={13} className="text-[#2e4b7a]" />
        <span className="text-[11px] font-semibold text-[#14233a]">{dateStr}</span>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1 bg-[#EAF0F8] border border-[#B8CDE4] rounded-full">
        <Clock size={13} className="text-[#224477]" />
        <span className="text-[11px] font-extrabold text-[#224477] tabular-nums tracking-wide">{timeStr} WIB</span>
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
  murid?: DbMurid | null;
  program?: Program;
  rawEndsAt?: string;
}

function resolveStudentPhone(
  murid?: {
    id?: string;
    name?: string;
    phone?: string | null;
    parentPhone?: string | null;
    wali?: { phone?: string | null } | null;
  } | null,
): string {
  if (!murid) return WHATSAPP_NUMBER;
  const raw =
    murid.parentPhone ||
    murid.phone ||
    murid.wali?.phone ||
    WHATSAPP_NUMBER;
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return digits || WHATSAPP_NUMBER;
}

function detectCompletedBlocksPending(
  sessions: SessionWithRelations[],
  reports: ProgressReport[],
) {
  const existing = new Set(
    reports.map((r) => `${r.muridId}|${r.programId}|${r.blockNumber}`),
  );
  const perPair = new Map<string, SessionWithRelations[]>();

  sessions.forEach((s) => {
    if (s.status !== "completed" || !s.murid || !s.program) return;
    const key = `${s.muridId}|${s.programId}`;
    if (!perPair.has(key)) perPair.set(key, []);
    perPair.get(key)!.push(s);
  });

  const pending: { murid: DbMurid; program: Program; blockNumber: number }[] = [];

  perPair.forEach((pairSessions) => {
    const first = pairSessions[0];
    const murid = first.murid!;
    const program = first.program!;
    const sessionsPerBlock = program.sessionsPerBlock || 12;
    const blocksFinished = Math.floor(pairSessions.length / sessionsPerBlock);

    for (let block = 1; block <= blocksFinished; block++) {
      if (!existing.has(`${murid.id}|${program.id}|${block}`)) {
        pending.push({ murid, program, blockNumber: block });
      }
    }
  });

  return pending;
}

export default function TentorDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("Tentor");
  const [sessionsData, setSessionsData] = useState<SessionWithRelations[]>([]);
  const nowMs = useClock(1000);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [muridsList, setMuridsList] = useState<Murid[]>([]);
  const [completedBlocksPending, setCompletedBlocksPending] = useState<{
    murid: DbMurid;
    program: Program;
    blockNumber: number;
  }[]>([]);

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
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
            schoolLevel: dbMurid.schoolLevel || "SD",
            phone: dbMurid.phone || dbMurid.wali?.phone || null,
            parentPhone: dbMurid.parentPhone || dbMurid.wali?.phone || null,
            parentName: dbMurid.parentName || dbMurid.wali?.name || null,
            avatarUrl:
              dbMurid.avatarUrl ||
              "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=150&h=150",
          });
        }

        const profileRes = await apiFetch<{ user: { name: string } }>("/api/users/me");
        if (!active) return;
        setProfileName(profileRes.user.name);

        const [sessionsRes, reportsRes, enrollmentsRes, progressRes] = await Promise.all([
          apiFetch<{ sessions: SessionWithRelations[] }>("/api/me/sessions"),
          apiFetch<{ reports: DailyReport[] }>("/api/me/daily-reports"),
          apiFetch<{ enrollments: EnrollmentBundle[] }>(
            "/api/me/enrollments",
          ).catch((): { enrollments: EnrollmentBundle[] } => ({ enrollments: [] })),
          apiFetch<{ reports: ProgressReport[] }>(
            "/api/me/progress-reports",
          ).catch((): { reports: ProgressReport[] } => ({ reports: [] })),
        ]);

        if (!active) return;
        const mappedSessions = sessionsRes.sessions.map((s) => ({
          ...s,
          startsAt: formatSessionDateTime(s.startsAt),
          endsAt: formatSessionDateTime(s.endsAt),
          rawEndsAt: s.endsAt,
        }));
        setSessionsData(mappedSessions);
        setDailyReports(reportsRes.reports);

        const uniqueMuridsMap = new Map<string, Murid>();
        const enrollmentData = enrollmentsRes.enrollments || [];
        enrollmentData.forEach((enr: EnrollmentBundle) => {
          if (enr.murid) mapMuridToList(enr.murid, uniqueMuridsMap);
        });
        mappedSessions.forEach((s) => {
          if (s.murid) mapMuridToList(s.murid, uniqueMuridsMap);
        });
        setMuridsList(Array.from(uniqueMuridsMap.values()));

        const completedBlocks = detectCompletedBlocksPending(
          mappedSessions,
          progressRes.reports,
        );
        setCompletedBlocksPending(completedBlocks);
      } catch (err) {
        if (active) console.error("Error loading dashboard data:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadData();
    return () => { active = false; };
  }, []);

  const todayDateStr = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(nowMs ?? 0);

  const todaySessions = sessionsData.filter(
    (s) => s.startsAt.split(" • ")[0] === todayDateStr
  );

  const sessions = todaySessions;
  const reportedSessionIds = new Set(dailyReports.map((rep) => rep.sessionId));
  const pendingCount = sessionsData.filter((s) =>
    s.status !== "cancelled" &&
    !reportedSessionIds.has(s.id) &&
    nowMs !== null &&
    s.rawEndsAt && new Date(s.rawEndsAt).getTime() <= nowMs
  ).length;

  const getSessionStatusInfo = (sessionId: string, status: string, rawEndsAt?: string) => {
    const hasReport = dailyReports.some((rep) => rep.sessionId === sessionId);
    const isPast = rawEndsAt && nowMs !== null ? new Date(rawEndsAt).getTime() <= nowMs : false;

    if (status === "completed" || isPast) {
      if (hasReport) {
        return {
          label: "Selesai",
          colorClass: "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]",
          actionLabel: "Edit Laporan Harian",
          variant: "ghost" as const,
          isPending: false,
        };
      } else {
        return {
          label: "Butuh Laporan",
          colorClass: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
          actionLabel: "Tulis Laporan Harian",
          variant: "primary" as const,
          isPending: true,
        };
      }
    }
    return {
      label: "Terjadwal",
      colorClass: "bg-[#EAF0F8] border-[#B8CDE4] text-[#224477]",
      actionLabel: "Sesi Belum Dimulai",
      variant: "ghost" as const,
      isPending: false,
    };
  };

  if (loading || nowMs === null) {
    return (
      <div className="p-6 max-w-5xl mx-auto w-full flex-grow flex flex-col justify-center items-center gap-3 min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-3 border-[#4a70a9]/20 border-t-[#4a70a9] animate-spin" />
        <div className="text-xs font-semibold text-[#535761]">Memuat beranda tentor...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full flex-grow flex flex-col gap-5 sm:gap-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center bg-white border border-[#E5DDD0] shadow-xs rounded-2xl p-4 sm:p-6">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#14233a] tracking-tight leading-tight">
            Halo, {profileName}!
          </h1>
          <p className="text-xs sm:text-sm text-[#535761] mt-1 leading-relaxed">
            Agenda mengajar Kelas Bimbingan &amp; Les Privat serta akses cepat Direct Chat WA siswa.
          </p>
        </div>
        <RealtimeClock nowMs={nowMs} />
      </header>

      {/* Statistics Row */}
      <section className="grid grid-cols-3 gap-3 sm:gap-5">
        <div className="bg-white border border-[#E5DDD0] rounded-2xl p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-xs">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#EAF0F8] text-[#224477] flex items-center justify-center shrink-0">
            <CalendarDays size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#535761] block">Sesi Hari Ini</span>
            <strong className="font-extrabold text-[#14233a] text-base sm:text-xl block">{todaySessions.length} Sesi</strong>
          </div>
        </div>

        <div className="bg-white border border-[#E5DDD0] rounded-2xl p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-xs">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#EAF0F8] text-[#224477] flex items-center justify-center shrink-0">
            <Users size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#535761] block">Total Siswa</span>
            <strong className="font-extrabold text-[#14233a] text-base sm:text-xl block">{muridsList.length} Siswa</strong>
          </div>
        </div>

        <div
          className={`rounded-2xl p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-xs border ${
            pendingCount > 0 ? "bg-[#FFFBEB] border-[#FDE68A]" : "bg-white border-[#E5DDD0]"
          }`}
        >
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${
              pendingCount > 0 ? "bg-[#FEF3C7] text-[#92400E]" : "bg-[#EAF0F8] text-[#224477]"
            }`}
          >
            <FileWarning size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#535761] block">Laporan Pending</span>
            <strong className={`font-extrabold text-base sm:text-xl block ${pendingCount > 0 ? "text-[#92400E]" : "text-[#14233a]"}`}>
              {pendingCount} Sesi
            </strong>
          </div>
        </div>
      </section>

      {/* Agenda Mengajar Hari Ini */}
      <section className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between border-b border-[#E5DDD0] pb-2.5">
          <h2 className="text-base sm:text-lg font-bold text-[#14233a] flex items-center gap-2">
            <Clock className="text-[#2e4b7a]" size={20} />
            <span>Agenda Mengajar Hari Ini</span>
          </h2>
          <Link href="/app/tentor/jadwal" className="text-xs font-bold text-[#2e4b7a] hover:underline">
            Semua Jadwal →
          </Link>
        </div>

        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sessions.map((session) => {
              const murid =
                muridsList.find((m) => m.id === session.muridId) ||
                session.murid || { id: session.muridId, name: "Siswa", schoolLevel: "SD" };
              const program = session.program || { id: session.programId, name: "Program Bimbingan", category: "jenjang" as const };
              const statusInfo = getSessionStatusInfo(session.id, session.status, session.rawEndsAt);
              const timePart = session.startsAt.split(" • ")[1] || "16:00 WIB";
              const loc = session.location || "Les Privat - Tatap Muka";
              const isOnline = /online|zoom|meet|discord|daring/i.test(loc);
              const waPhone = resolveStudentPhone(session.murid || murid);
              const waMessage = encodeURIComponent(
                `Halo *${murid.name}* (atau Bapak/Ibu Orang Tua), saya *${profileName}* (Tentor nCourse) mengingatkan jadwal sesi *${program.name}* hari ini pukul *${timePart}*. Sampai jumpa di sesi belajar!`
              );

              return (
                <article
                  key={session.id}
                  className="bg-white rounded-2xl border border-[#E5DDD0] p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-xs"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-xs font-bold text-[#535761] flex items-center gap-1.5">
                        <Clock size={13} className="text-[#2e4b7a]" />
                        {timePart}
                      </span>
                      <span className={`px-2.5 py-0.5 border rounded-full text-[10px] font-bold uppercase ${statusInfo.colorClass}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <h3 className="font-bold text-[#14233a] text-base sm:text-lg">
                      {murid.name}
                    </h3>
                    <p className="text-xs text-[#535761] font-medium mt-0.5">
                      {program.name} • {murid.schoolLevel || "Siswa"}
                    </p>

                    <div className="flex items-start justify-between gap-2 text-xs text-[#535761] mt-3 pt-3 border-t border-[#E5DDD0]/60">
                      <div className="flex items-start gap-1.5 min-w-0">
                        {isOnline ? (
                          <Video size={14} className="text-[#2e4b7a] shrink-0 mt-0.5" />
                        ) : (
                          <MapPin size={14} className="text-[#2e4b7a] shrink-0 mt-0.5" />
                        )}
                        <span className="truncate">{loc}</span>
                      </div>
                      {!isOnline && loc && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-[#2e4b7a] hover:underline"
                        >
                          <span>Maps</span>
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="pt-1 flex flex-col sm:flex-row gap-2">
                    <a
                      href={`https://wa.me/${waPhone}?text=${waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#15803d] hover:bg-[#166534] px-3.5 py-2 text-xs font-bold text-white transition-colors"
                    >
                      <MessageCircle size={14} />
                      <span>Direct Chat WA</span>
                    </a>

                    {statusInfo.label !== "Terjadwal" ? (
                      <Link
                        href={`/app/tentor/laporan-harian?${statusInfo.isPending ? "sessionId" : "editSessionId"}=${session.id}`}
                        className="flex-1 block"
                      >
                        <Button variant={statusInfo.variant} className="w-full justify-center text-xs py-2">
                          {statusInfo.actionLabel}
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/app/tentor/jadwal" className="flex-1 block">
                        <Button variant="ghost" className="w-full justify-center text-xs py-2">
                          Detail Jadwal
                        </Button>
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-[#E5DDD0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#EAF0F8] text-[#224477] flex items-center justify-center shrink-0">
                <CalendarDays size={22} />
              </div>
              <div>
                <h3 className="font-bold text-[#14233a] text-sm sm:text-base">Tidak Ada Sesi Mengajar Hari Ini</h3>
                <p className="text-xs text-[#535761] mt-1 max-w-md">
                  Kamu bisa mengecek jadwal mendatang, membuat jadwal baru bersama siswa, atau melengkapi laporan harian.
                </p>
              </div>
            </div>
            <Link href="/app/tentor/jadwal" className="shrink-0">
              <Button variant="ghost" className="text-xs py-2 px-4">
                Buka Jadwal Mengajar
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Evaluasi Perkembangan Belajar */}
      {completedBlocksPending.length > 0 && (
        <section className="flex flex-col gap-3.5">
          <h2 className="text-base sm:text-lg font-bold text-[#14233a] flex items-center gap-2 border-b border-[#E5DDD0] pb-2.5">
            <TrendingUp className="text-[#2e4b7a]" size={20} />
            <span>Rapor Perkembangan Blok Siap Diterbitkan</span>
          </h2>

          <div className="flex flex-col gap-3.5">
            {completedBlocksPending.map(({ murid, program, blockNumber }) => {
              const waPhone = resolveStudentPhone(murid);
              const waText = encodeURIComponent(
                `Halo *${murid.name}* (atau Bapak/Ibu Orang Tua), selamat! Pembelajaran *${program.name}* untuk *Blok ${blockNumber}* telah selesai. Saya sedang menyiapkan Rapor Perkembangan di aplikasi nCourse.`
              );

              return (
                <article
                  key={`${murid.id}-${program.id}-${blockNumber}`}
                  className="bg-white rounded-2xl p-5 border border-[#E5DDD0] shadow-xs flex flex-col gap-4"
                >
                  <div className="flex gap-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3.5 text-[#78350F]">
                    <AlertCircle size={18} className="shrink-0 mt-0.5 text-[#92400E]" />
                    <div>
                      <p className="text-xs sm:text-sm font-bold">Blok {blockNumber} Selesai Terdeteksi</p>
                      <p className="text-xs text-[#78350F] mt-1 leading-relaxed">
                        Siswa <strong>{murid.name}</strong> telah menyelesaikan{" "}
                        {blockNumber * (program.sessionsPerBlock || 12)} sesi pada program{" "}
                        <strong>{program.name}</strong>. Terbitkan Rapor Perkembangan di aplikasi dan kabari via WhatsApp.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <a
                      href={`https://wa.me/${waPhone}?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#15803d] hover:bg-[#166534] px-3.5 py-2 text-xs font-bold text-white transition-colors"
                    >
                      <MessageCircle size={14} />
                      <span>Direct Chat WA</span>
                    </a>
                    <Link href={`/app/tentor/laporan-perkembangan?muridId=${murid.id}&programId=${program.id}&block=${blockNumber}`}>
                      <Button variant="primary" className="text-xs py-2 px-4 flex items-center gap-1.5">
                        <Plus size={14} />
                        <span>Buat Rapor Perkembangan</span>
                      </Button>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
