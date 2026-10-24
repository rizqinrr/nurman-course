/* Hallmark · genre: warm-editorial · design-system: design.md · designed-as-mobile-app */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DailyReportForTentorDetailed, Session, Program, User, DailyReport, Murid } from "@/data/lms";
import { apiFetch } from "@/lib/api";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import Button from "@/components/ui/Button";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  BookOpen,
  MapPin,
  Plus,
  AlertCircle,
  Printer,
  X,
  Eye,
  MessageCircle,
} from "lucide-react";

const NURMAN_ADDR = "Jalan Kalisabuk, Kesugihan, Cilacap";
const NURMAN_WA = "WA: 0853-xxxx-xxxx";

interface DbMurid {
  id: string;
  waliId: string;
  name: string;
  birthDate?: string | null;
  schoolLevel?: string | null;
  avatarUrl?: string | null;
  address?: string | null;
  phone?: string | null;
  parentPhone?: string | null;
  parentName?: string | null;
  wali?: { id?: string; name?: string | null; phone?: string | null } | null;
}

interface SessionWithRelations extends Session {
  murid?: DbMurid | null;
  program?: Program | null;
}

interface DailyReportWithRelations extends DailyReport {
  session: Session & { program?: Program | null; tentor?: User | null };
  murid?: DbMurid | null;
}

interface DailyReportView extends DailyReportForTentorDetailed {
  rawStartsAt: Session["startsAt"];
  rawEndsAt: Session["endsAt"];
  location: string;
  waPhone: string;
}

function resolveStudentPhone(murid?: DbMurid | Murid | null): string {
  if (!murid) return WHATSAPP_NUMBER;
  const raw =
    murid.parentPhone ||
    murid.phone ||
    ("wali" in murid ? murid.wali?.phone : null) ||
    WHATSAPP_NUMBER;
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return digits || WHATSAPP_NUMBER;
}

interface FormProps {
  session: SessionWithRelations;
  initialReport: DailyReportView | null | undefined;
  isEditing: boolean;
  onSubmit: (data: { date: string; startTime: string; endTime: string; activity: string; notes: string }) => void;
  onCancel: () => void;
}

function LaporanHarianForm({ session, initialReport, isEditing, onSubmit, onCancel }: FormProps) {
  const [date, setDate] = useState("2026-08-01");
  const [startTime, setStartTime] = useState(initialReport?.startTime || "14:00");
  const [endTime, setEndTime] = useState(initialReport?.endTime || "15:30");
  const [activity, setActivity] = useState(initialReport?.activity || "");
  const [notes, setNotes] = useState(initialReport?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ date, startTime, endTime, activity, notes });
  };

  const murid = session.murid || { name: "Siswa", schoolLevel: "Belum ditentukan", birthDate: undefined };
  const program = session.program;

  return (
    <div className="flex flex-col gap-5 animate-[fadeIn_0.3s_ease-out]">
      <header className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 text-xs font-bold text-[#14233a] bg-white hover:bg-[#EAF0F8] border border-[#E5DDD0] px-3.5 py-1.5 rounded-full w-fit shadow-xs self-start transition-colors"
        >
          <ArrowLeft size={14} /> Kembali
        </button>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#14233a] tracking-tight mt-1">
          {isEditing ? "Edit Laporan Kegiatan Harian" : "Input Laporan Kegiatan Harian"}
        </h1>
        <p className="text-xs sm:text-sm text-[#535761]">
          Catat rincian materi yang dibahas dan evaluasi singkat siswa untuk sesi ini.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-5 border border-[#E5DDD0] shadow-xs">
            <h2 className="text-xs font-bold text-[#535761] mb-4 border-b border-[#E5DDD0] pb-2">
              Konteks Sesi
            </h2>
            <div className="flex flex-col gap-3.5 text-xs sm:text-sm">
              <div>
                <span className="text-xs font-bold text-[#535761] block mb-0.5">Siswa</span>
                <span className="font-bold text-[#14233a] text-base block">{murid.name}</span>
                <span className="text-xs text-[#535761] block">
                  {murid.schoolLevel} • {murid.birthDate ? calculateAge(murid.birthDate) : 7} Tahun
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-[#535761] block mb-0.5">Program Belajar</span>
                <span className="font-semibold text-[#14233a] flex items-center gap-1.5 mt-0.5">
                  <BookOpen size={15} className="text-[#2e4b7a]" />
                  {program?.name}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-[#535761] block mb-0.5">Jadwal Sesi</span>
                <span className="font-medium text-[#14233a] block">{session.startsAt}</span>
              </div>
              <div className="pt-3 border-t border-[#E5DDD0] flex items-start gap-1.5 text-[#535761]">
                <MapPin size={14} className="text-[#2e4b7a] shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{session.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#E5DDD0] shadow-xs">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#14233a]">Tanggal Sesi</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="rounded-xl border border-[#E5DDD0] bg-white px-3 py-2 text-xs sm:text-sm focus:border-[#4a70a9] outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#14233a]">Jam Mulai</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="rounded-xl border border-[#E5DDD0] bg-white px-3 py-2 text-xs sm:text-sm text-center focus:border-[#4a70a9] outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#14233a]">Jam Selesai</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="rounded-xl border border-[#E5DDD0] bg-white px-3 py-2 text-xs sm:text-sm text-center focus:border-[#4a70a9] outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#14233a]">Materi / Aktivitas Hari Ini</label>
                <textarea
                  placeholder="Contoh: Belajar melafalkan huruf Alif sampai Kho di Iqra 1 jilid 1..."
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  rows={3}
                  className="rounded-xl border border-[#E5DDD0] bg-white px-4 py-2.5 text-xs sm:text-sm focus:border-[#4a70a9] outline-none resize-none"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#14233a]">Catatan &amp; Evaluasi Siswa</label>
                <textarea
                  placeholder="Contoh: Siswa sangat fokus, pengucapan makhraj huruf Kho perlu latihan tambahan..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="rounded-xl border border-[#E5DDD0] bg-white px-4 py-2.5 text-xs sm:text-sm focus:border-[#4a70a9] outline-none resize-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E5DDD0]">
                <Button type="button" variant="ghost" onClick={onCancel} className="text-xs py-2 px-4">
                  Batal
                </Button>
                <Button type="submit" variant="primary" className="text-xs py-2 px-5">
                  {isEditing ? "Perbarui Laporan" : "Simpan Laporan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
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

const calculateAge = (birthDateString: string) => {
  try {
    const birth = new Date(birthDateString);
    const ageDifMs = Date.now() - birth.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  } catch {
    return 7;
  }
};

export default function LaporanHarianClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const editSessionId = searchParams.get("editSessionId");

  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<DailyReportView[]>([]);
  const [sessions, setSessions] = useState<SessionWithRelations[]>([]);
  const [murids, setMurids] = useState<Murid[]>([]);
  const [selectedMuridId, setSelectedMuridId] = useState<string>("all");
  const [selectedBlock, setSelectedBlock] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [tentorName, setTentorName] = useState("Tentor");
  const [, setProfileLoading] = useState(true);
  const [detailReport, setDetailReport] = useState<DailyReportView | null>(null);

  const refreshData = async () => {
    try {
      interface EnrollmentWithMurid {
        id: string;
        muridId: string;
        murid?: DbMurid | null;
      }
      const [reportsRes, sessionsRes, enrollmentsRes, profileRes] = await Promise.all([
        apiFetch<{ reports: DailyReportWithRelations[] }>("/api/me/daily-reports"),
        apiFetch<{ sessions: SessionWithRelations[] }>("/api/me/sessions"),
        apiFetch<{ enrollments: EnrollmentWithMurid[] }>(
          "/api/me/enrollments",
        ).catch((): { enrollments: EnrollmentWithMurid[] } => ({ enrollments: [] })),
        apiFetch<{ user: { name: string } }>(
          "/api/users/me",
        ).catch(() => ({ user: { name: "Tentor" } })),
      ]);
      if (profileRes?.user?.name) {
        setTentorName(profileRes.user.name);
        setProfileLoading(false);
      }

      const mappedReports = reportsRes.reports.map((r): DailyReportView => ({
        id: r.id,
        sessionId: r.sessionId,
        muridId: r.muridId,
        date: formatSessionDateTime(r.session.startsAt).split(" • ")[0],
        startTime: r.startTime,
        endTime: r.endTime,
        activity: r.activity,
        notes: r.notes || "",
        programName: r.session.program?.name || "Program Bimbingan",
        muridName: r.murid?.name || "Siswa",
        muridAge: r.murid?.birthDate ? calculateAge(r.murid.birthDate) : 7,
        rawStartsAt: r.session.startsAt,
        rawEndsAt: r.session.endsAt,
        location: r.session.location || r.murid?.address || "",
        waPhone: resolveStudentPhone(r.murid),
      }));
      setReports(mappedReports);

      const mappedSessions = sessionsRes.sessions.map((s) => ({
        ...s,
        startsAt: formatSessionDateTime(s.startsAt),
        endsAt: formatSessionDateTime(s.endsAt),
      }));
      setSessions(mappedSessions);

      const uniqueMuridsMap = new Map<string, Murid>();
      const enrList: EnrollmentWithMurid[] = enrollmentsRes.enrollments || [];
      enrList.forEach((enr) => {
        const m = enr.murid;
        if (m && !uniqueMuridsMap.has(m.id)) {
          uniqueMuridsMap.set(m.id, {
            id: m.id,
            waliId: m.waliId || "wali-1",
            name: m.name,
            age: m.birthDate ? calculateAge(m.birthDate) : 7,
            schoolLevel: m.schoolLevel || "SD",
            avatarUrl: m.avatarUrl || "",
            phone: m.phone || m.wali?.phone || null,
            parentPhone: m.parentPhone || m.wali?.phone || null,
          });
        }
      });
      mappedSessions.forEach((s) => {
        if (s.murid && !uniqueMuridsMap.has(s.murid.id)) {
          uniqueMuridsMap.set(s.murid.id, {
            id: s.murid.id,
            waliId: s.murid.waliId || "wali-1",
            name: s.murid.name,
            age: s.murid.birthDate ? calculateAge(s.murid.birthDate) : 7,
            schoolLevel: s.murid.schoolLevel || "SD",
            avatarUrl: s.murid.avatarUrl || "",
            phone: s.murid.phone || s.murid.wali?.phone || null,
            parentPhone: s.murid.parentPhone || s.murid.wali?.phone || null,
          });
        }
      });
      setMurids(Array.from(uniqueMuridsMap.values()));
    } catch (err) {
      console.error("Error refreshing daily reports data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      refreshData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!sessionId || loading) return;
    const alreadyReported = reports.some((r) => r.sessionId === sessionId);
    if (alreadyReported) {
      router.replace(`/app/tentor/laporan-harian?editSessionId=${sessionId}`);
    }
  }, [sessionId, reports, loading, router]);

  const filteredReports =
    selectedMuridId === "all" ? reports : reports.filter((r) => r.muridId === selectedMuridId);
  const selectedMurid = murids.find((m) => m.id === selectedMuridId);
  const muridReports = reports.filter((r) => r.muridId === selectedMuridId);
  const chronologicalReports = [...muridReports].reverse();
  const programOfMurid = selectedMurid
    ? sessions.find((s) => s.muridId === selectedMurid.id)?.program || null
    : null;
  const sessionsPerBlock = programOfMurid ? programOfMurid.sessionsPerBlock || 12 : 12;
  const totalBlocks = Math.ceil(chronologicalReports.length / sessionsPerBlock) || 1;
  const startIndex = (selectedBlock - 1) * sessionsPerBlock;
  const printReports = chronologicalReports.slice(startIndex, startIndex + sessionsPerBlock);

  const activeSession = sessionId
    ? sessions.find((s) => s.id === sessionId)
    : editSessionId
      ? sessions.find((s) => s.id === editSessionId)
      : null;
  const isEditing = !!editSessionId;
  const initialReport = editSessionId ? reports.find((r) => r.sessionId === editSessionId) : null;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };
  const handleCloseForm = () => {
    router.push("/app/tentor/laporan-harian");
  };
  const handleFormSubmit = async (data: {
    date: string;
    startTime: string;
    endTime: string;
    activity: string;
    notes: string;
  }) => {
    if (!activeSession) return;
    try {
      await apiFetch("/api/daily-reports", {
        method: "POST",
        body: JSON.stringify({
          sessionId: activeSession.id,
          activity: data.activity,
          notes: data.notes,
        }),
      });
      triggerToast(
        isEditing
          ? "Laporan harian berhasil diperbarui!"
          : "Laporan harian berhasil disimpan di aplikasi!",
      );
      await refreshData();
    } catch (err) {
      console.error("Error submitting report:", err);
      const errMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      triggerToast("Gagal menyimpan laporan: " + errMsg);
    }
    handleCloseForm();
  };

  const handleWriteReport = () => {
    const pendingSess = sessions.find(
      (s) => s.status !== "cancelled" && !reports.some((r) => r.sessionId === s.id),
    );
    if (pendingSess) {
      router.push(`/app/tentor/laporan-harian?sessionId=${pendingSess.id}`);
    } else {
      triggerToast(
        "Semua sesi mengajar sudah dilaporkan. Buat jadwal baru di halaman Jadwal terlebih dahulu.",
      );
    }
  };

  const handlePrint = () => {
    if (selectedMuridId === "all") {
      triggerToast("Pilih siswa dulu untuk cetak");
      return;
    }
    if (typeof document !== "undefined") {
      document.title = `Laporan-Harian-${selectedMurid?.name || "Siswa"}-Blok-${selectedBlock}`;
    }
    window.print();
  };

  const buildWaReportUrl = (rep: DailyReportView) => {
    const text = encodeURIComponent(
      `Halo *${rep.muridName}* (atau Bapak/Ibu Orang Tua), Laporan Harian sesi *${rep.programName}* tanggal *${rep.date}* telah diterbitkan di Portal Siswa nCourse.\n\n*Materi:* ${rep.activity}\n*Catatan Tentor:* "${rep.notes || "Sesi berjalan lancar."}"\n\nSilakan cek detail lengkapnya di aplikasi nCourse. Terima kasih!`
    );
    return `https://wa.me/${rep.waPhone}?text=${text}`;
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto w-full flex-grow flex flex-col justify-center items-center gap-3 min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-3 border-[#4a70a9]/20 border-t-[#4a70a9] animate-spin" />
        <div className="text-xs font-semibold text-[#535761]">Memuat laporan harian...</div>
      </div>
    );
  }

  const todayWib = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full flex-grow flex flex-col gap-5 pb-28 relative print:p-0 print:pb-0 print:bg-white">
      <div className="print:hidden flex flex-col gap-5 w-full">
        {toastMessage && (
          <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-[#14233a] text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-full shadow-lg flex items-center gap-2 z-50">
            <CheckCircle2 size={16} className="text-[#4ade80]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {!activeSession && (
          <header className="rounded-2xl bg-white border border-[#E5DDD0] shadow-xs p-4 sm:p-5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#14233a] tracking-tight">
              Laporan Harian
            </h1>
            <p className="text-xs sm:text-sm text-[#535761] leading-relaxed mt-1">
              Simpan catatan belajar di aplikasi &amp; kirim notifikasi 1-klik via WhatsApp ke siswa/orang tua
            </p>
          </header>
        )}

        {activeSession ? (
          <LaporanHarianForm
            session={activeSession}
            initialReport={initialReport}
            isEditing={isEditing}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
          />
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl border border-[#E5DDD0] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-[#535761]">Filter Siswa</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMuridId("all");
                        setSelectedBlock(1);
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                        selectedMuridId === "all"
                          ? "bg-[#2e4b7a] text-white border-[#2e4b7a]"
                          : "bg-[#F7F4EF] text-[#434750] hover:bg-[#EAF0F8] border-[#E5DDD0]"
                      }`}
                    >
                      Semua Siswa
                    </button>
                    {murids.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setSelectedMuridId(m.id);
                          setSelectedBlock(1);
                        }}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                          selectedMuridId === m.id
                            ? "bg-[#2e4b7a] text-white border-[#2e4b7a]"
                            : "bg-[#F7F4EF] text-[#434750] hover:bg-[#EAF0F8] border-[#E5DDD0]"
                        }`}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 self-stretch sm:self-end">
                  {selectedMuridId !== "all" && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs bg-[#F7F4EF] border border-[#E5DDD0] rounded-xl px-3 py-2 flex-1 sm:flex-auto justify-between">
                        <span className="text-[#535761] font-bold text-[11px]">Blok</span>
                        <select
                          value={selectedBlock}
                          onChange={(e) => setSelectedBlock(Number(e.target.value))}
                          className="bg-transparent font-semibold text-[#14233a] outline-none cursor-pointer ml-2 text-xs"
                        >
                          {Array.from({ length: totalBlocks }).map((_, i) => {
                            const blockNum = i + 1;
                            const startSess = i * sessionsPerBlock + 1;
                            const endSess = Math.min(
                              (i + 1) * sessionsPerBlock,
                              chronologicalReports.length,
                            );
                            return (
                              <option key={blockNum} value={blockNum} className="text-[#14233a]">
                                Blok {blockNum} (Sesi {startSess}-{endSess})
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#EAF0F8] hover:bg-[#D5E3FF] text-[#224477] border border-[#B8CDE4] font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                      >
                        <Printer size={15} /> Cetak PDF
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleWriteReport}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#2e4b7a] text-white hover:bg-[#22395e] font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                  >
                    <Plus size={15} /> Tulis Laporan
                  </button>
                </div>
              </div>
            </div>

            {/* Tabel Daftar Laporan */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#E5DDD0] shadow-xs">
              {filteredReports.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-[#E5DDD0] bg-[#F7F4EF] text-[11px] text-[#535761]">
                        <th className="px-4 py-3 font-bold w-[36px] text-center">No</th>
                        <th className="px-4 py-3 font-bold">Siswa &amp; Materi</th>
                        <th className="px-4 py-3 font-bold hidden md:table-cell">Tanggal</th>
                        <th className="px-4 py-3 font-bold hidden sm:table-cell">Jam</th>
                        <th className="px-4 py-3 font-bold text-right">Aksi &amp; WA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5DDD0]/60">
                      {filteredReports.map((report, index) => (
                        <tr key={report.id} className="hover:bg-[#F7F4EF]/50 transition-colors">
                          <td className="px-4 py-3 text-center text-[#535761] font-semibold">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-[#14233a] block">{report.muridName}</span>
                            <span className="text-xs text-[#535761] line-clamp-1 block mt-0.5">
                              {report.activity}
                            </span>
                            <span className="block md:hidden text-[11px] text-[#535761] mt-0.5">
                              {report.date}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#535761] hidden md:table-cell whitespace-nowrap">
                            {report.date}
                          </td>
                          <td className="px-4 py-3 text-[#535761] hidden sm:table-cell whitespace-nowrap">
                            {report.startTime} - {report.endTime}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap justify-end gap-1.5">
                              <a
                                href={buildWaReportUrl(report)}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Kabari Siswa / Orang Tua via WhatsApp"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white font-bold text-[11px] transition-colors"
                              >
                                <MessageCircle size={12} />
                                <span>Kabari WA</span>
                              </a>
                              <button
                                type="button"
                                onClick={() => setDetailReport(report)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#EAF0F8] text-[#224477] border border-[#B8CDE4] hover:bg-[#D5E3FF] font-semibold text-[11px] transition-colors"
                              >
                                <Eye size={12} /> Detail
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  router.push(
                                    `/app/tentor/laporan-harian?editSessionId=${report.sessionId}`,
                                  )
                                }
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white text-[#434750] border border-[#E5DDD0] hover:bg-[#F7F4EF] font-semibold text-[11px] transition-colors"
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center gap-3">
                  <AlertCircle className="text-[#2e4b7a]" size={32} />
                  <div>
                    <h2 className="font-bold text-[#14233a] text-sm">Belum Ada Laporan Harian</h2>
                    <p className="text-xs text-[#535761] mt-1 max-w-sm">
                      Tulis laporan pertama setelah sesi mengajar selesai.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {selectedMuridId !== "all" && filteredReports.length > 0 && (
              <div className="md:hidden sticky bottom-[72px] z-20">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full h-11 rounded-xl bg-[#14233a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
                >
                  <Printer size={16} /> Cetak Hasil Belajar (Blok {selectedBlock})
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Detail Laporan */}
      {detailReport && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 print:hidden"
          onClick={() => setDetailReport(null)}
        >
          <div className="absolute inset-0 bg-[#14233a]/50" />
          <div
            className="relative w-full max-w-lg animate-[fadeIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl p-6 border border-[#E5DDD0] shadow-xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-extrabold text-[#14233a] text-base flex items-center gap-2">
                    <span>{detailReport.muridName}</span>
                    <span className="text-[11px] font-semibold text-[#535761] bg-[#F7F4EF] px-2.5 py-0.5 rounded-full border border-[#E5DDD0]">
                      {detailReport.muridAge} Tahun
                    </span>
                  </h2>
                  <p className="text-xs text-[#535761] font-medium mt-1 flex items-center gap-1.5">
                    <BookOpen size={13} className="text-[#2e4b7a]" />
                    {detailReport.programName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailReport(null)}
                  className="p-1.5 rounded-lg hover:bg-[#F7F4EF] text-[#535761] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#535761] font-semibold border-b border-[#E5DDD0] pb-3">
                <Clock size={14} className="text-[#2e4b7a]" />
                <span>
                  {detailReport.date} • {detailReport.startTime} - {detailReport.endTime} WIB
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-[#535761] block mb-1">
                  Materi / Aktivitas
                </span>
                <p className="text-sm font-semibold text-[#14233a] leading-relaxed">
                  {detailReport.activity}
                </p>
              </div>
              <div className="border-l-2 border-[#2e4b7a] pl-4 py-2.5 bg-[#F7F4EF] rounded-r-xl pr-3">
                <span className="text-xs font-bold text-[#2e4b7a] block mb-1">
                  Catatan Evaluasi
                </span>
                <p className="text-xs italic text-[#434750] leading-relaxed">
                  &quot;{detailReport.notes}&quot;
                </p>
              </div>
              <div className="flex flex-wrap justify-between items-center gap-2 pt-3 border-t border-[#E5DDD0]">
                <a
                  href={buildWaReportUrl(detailReport)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs transition-colors"
                >
                  <MessageCircle size={14} />
                  <span>Kabari via WhatsApp</span>
                </a>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setDetailReport(null)}
                    className="text-xs py-2 px-4"
                  >
                    Tutup
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      const sid = detailReport.sessionId;
                      setDetailReport(null);
                      router.push(`/app/tentor/laporan-harian?editSessionId=${sid}`);
                    }}
                    className="text-xs py-2 px-4"
                  >
                    Edit Laporan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedMuridId !== "all" && selectedMurid && (
        <div className="hidden print:block bg-white text-black p-0 font-sans w-full min-h-screen text-[11px] print:text-black">
          <style>{`@media print { @page { size: A4; margin: 12mm 10mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .print-avoid-break { break-inside: avoid; } table { border-collapse: collapse; } }`}</style>
          <div className="text-center flex flex-col items-center mb-5 pb-4 border-b-2 border-black">
            <h1 className="text-[20px] font-black tracking-[0.12em] text-black uppercase">NCOURSE</h1>
            <p className="text-[11px] font-semibold text-gray-800 tracking-wide mt-0.5">
              Laporan Kegiatan Belajar Mengajar
            </p>
            <p className="text-[9px] text-gray-600 mt-1">
              {NURMAN_ADDR} • {NURMAN_WA}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[10px] mb-4 border border-black p-3 rounded-[8px]">
            <div>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="font-bold py-0.5 w-[88px]">Nama Siswa</td>
                    <td className="py-0.5">: {selectedMurid.name}</td>
                  </tr>
                  <tr>
                    <td className="font-bold py-0.5">Umur</td>
                    <td className="py-0.5">: {selectedMurid.age} Th</td>
                  </tr>
                  <tr>
                    <td className="font-bold py-0.5">Jenjang</td>
                    <td className="py-0.5">: {selectedMurid.schoolLevel}</td>
                  </tr>
                  <tr>
                    <td className="font-bold py-0.5">Tanggal Cetak</td>
                    <td className="py-0.5">: {todayWib}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="font-bold py-0.5 w-[88px]">Program</td>
                    <td className="py-0.5">
                      : {programOfMurid?.name || printReports[0]?.programName || "Program"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold py-0.5">Periode</td>
                    <td className="py-0.5">
                      : Blok {selectedBlock} / {totalBlocks} (Target {sessionsPerBlock} Sesi)
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold py-0.5">Tentor</td>
                    <td className="py-0.5">: {tentorName}</td>
                  </tr>
                  <tr>
                    <td className="font-bold py-0.5">Jumlah Sesi</td>
                    <td className="py-0.5">: {printReports.length} sesi di blok ini</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h2 className="text-[11px] font-black uppercase tracking-wider mb-2 text-black">
            Detail Pertemuan
          </h2>
          <table className="w-full border border-black text-[9.5px] mb-6">
            <thead>
              <tr className="bg-gray-100 text-black">
                <th className="border border-black px-2 py-2 w-[28px] text-center font-bold">No</th>
                <th className="border border-black px-2 py-2 w-[90px] text-left font-bold">
                  Hari &amp; Tanggal
                </th>
                <th className="border border-black px-2 py-2 w-[70px] text-left font-bold">Jam</th>
                <th className="border border-black px-2 py-2 text-left font-bold">
                  Materi / Aktivitas
                </th>
                <th className="border border-black px-2 py-2 text-left font-bold w-[28%]">
                  Catatan Evaluasi Tentor
                </th>
              </tr>
            </thead>
            <tbody>
              {printReports.length > 0 ? (
                printReports.map((rep, index) => (
                  <tr key={rep.id} className="print-avoid-break">
                    <td className="border border-black px-2 py-2 text-center align-top">
                      {startIndex + index + 1}
                    </td>
                    <td className="border border-black px-2 py-2 align-top font-semibold">
                      {rep.date}
                    </td>
                    <td className="border border-black px-2 py-2 align-top">
                      {rep.startTime} - {rep.endTime}
                    </td>
                    <td className="border border-black px-2 py-2 align-top">{rep.activity}</td>
                    <td className="border border-black px-2 py-2 align-top italic">
                      &quot;{rep.notes}&quot;
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="border border-black px-3 py-6 text-center text-gray-500">
                    Belum ada laporan harian di blok ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="border border-black p-3 rounded-[8px] text-[10px] mb-8">
            <p className="font-bold mb-1">Ringkasan Blok {selectedBlock}</p>
            <p className="leading-relaxed">
              Total {printReports.length} sesi tercatat. Program:{" "}
              <span className="font-semibold">{programOfMurid?.name || "-"}</span>. Tentor:{" "}
              <span className="font-semibold">{tentorName}</span>. Dicetak otomatis dari sistem
              nCourse.
            </p>
          </div>

          <div className="flex justify-between items-start pt-4 text-[10px] mt-8">
            <div className="text-center w-[160px] flex flex-col gap-14">
              <span>Siswa / Orang Tua Pendamping</span>
              <div className="border-b border-black w-full"></div>
              <span className="text-[8px] text-gray-500">{selectedMurid.name}</span>
            </div>
            <div className="text-center w-[160px] flex flex-col gap-14">
              <span>Tentor</span>
              <div className="flex flex-col items-center">
                <span className="font-bold">{tentorName}</span>
                <div className="border-b border-black w-full mt-1"></div>
                <span className="text-[8px] text-gray-500 mt-1">nCourse • {NURMAN_ADDR}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
