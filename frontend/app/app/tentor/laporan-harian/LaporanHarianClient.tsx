"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DailyReportForTentorDetailed, Session, Program, User, DailyReport, Murid } from "@/data/lms";
import { apiFetch } from "@/lib/api";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { ArrowLeft, CheckCircle2, Clock, BookOpen, MapPin, Plus, AlertCircle, Printer, X, Eye } from "lucide-react";

const NURMAN_ADDR = "Jalan Kalisabuk, Kesugihan, Cilacap";
const NURMAN_WA = "WA: 0853-xxxx-xxxx";

interface FormProps {
  session: SessionWithRelations;
  initialReport: DailyReportForTentorDetailed | null | undefined;
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
    <div className="flex flex-col gap-6 animate-[fadeIn_0.4s_ease-out]">
      <header className="flex flex-col gap-2">
        <button onClick={onCancel} className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-white/40 hover:bg-white/60 border border-white/60 px-3.5 py-1.5 rounded-full w-fit shadow-sm self-start transition-colors">
          <ArrowLeft size={14} /> Kembali
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight mt-1">{isEditing ? "Edit Laporan Kegiatan Harian" : "Input Laporan Kegiatan Harian"}</h1>
        <p className="text-xs sm:text-sm text-gray-600">Catat rincian materi yang dibahas dan evaluasi singkat siswa untuk sesi ini.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 flex flex-col gap-4">
          <GlassCard className="p-5 border border-white/80 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200/30 pb-2">Konteks Sesi</h3>
            <div className="flex flex-col gap-4 text-xs sm:text-sm">
              <div><span className="text-[10px] font-bold text-gray-400 block mb-0.5">SISWA</span><span className="font-bold text-gray-800 text-base">{murid.name}</span><span className="text-xs text-gray-500 block">{murid.schoolLevel} • {murid.birthDate ? calculateAge(murid.birthDate) : 7} Tahun</span></div>
              <div><span className="text-[10px] font-bold text-gray-400 block mb-0.5">PROGRAM LES</span><span className="font-semibold text-gray-800 flex items-center gap-1.5 mt-0.5"><BookOpen size={16} className="text-[#4a70a9]" />{program?.name}</span></div>
              <div><span className="text-[10px] font-bold text-gray-400 block mb-0.5">JADWAL ASLI</span><span className="font-medium text-gray-700 block">{session.startsAt}</span></div>
              <div className="pt-3 border-t border-gray-200/30 flex items-start gap-1.5 text-gray-500"><MapPin size={14} className="text-[#4a70a9] shrink-0 mt-0.5" /><span className="text-[11px] leading-relaxed">{session.location}</span></div>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2">
          <GlassCard className="p-6 md:p-8 border border-white/80 shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1 flex flex-col gap-1.5"><label className="text-xs font-bold text-gray-700">Tanggal Sesi</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl border border-gray-300/80 bg-white/70 px-3 py-2 text-xs sm:text-sm focus:border-[#4a70a9] focus:ring-1 focus:ring-[#4a70a9] outline-none" required /></div>
                <div className="flex flex-col gap-1.5"><label className="text-xs font-bold text-gray-700">Jam Mulai</label><input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="rounded-xl border border-gray-300/80 bg-white/70 px-3 py-2 text-xs sm:text-sm text-center focus:border-[#4a70a9] focus:ring-1 focus:ring-[#4a70a9] outline-none" required /></div>
                <div className="flex flex-col gap-1.5"><label className="text-xs font-bold text-gray-700">Jam Selesai</label><input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="rounded-xl border border-gray-300/80 bg-white/70 px-3 py-2 text-xs sm:text-sm text-center focus:border-[#4a70a9] focus:ring-1 focus:ring-[#4a70a9] outline-none" required /></div>
              </div>
              <div className="flex flex-col gap-1.5"><label className="text-xs font-bold text-gray-700">Materi / Aktivitas Hari Ini</label><textarea placeholder="Contoh: Belajar melafalkan huruf Alif sampai Kho di Iqra 1 jilid 1..." value={activity} onChange={(e) => setActivity(e.target.value)} rows={3} className="rounded-xl border border-gray-300/80 bg-white/70 px-4 py-2.5 text-xs sm:text-sm focus:border-[#4a70a9] focus:ring-1 focus:ring-[#4a70a9] outline-none resize-none" required /></div>
              <div className="flex flex-col gap-1.5"><label className="text-xs font-bold text-gray-700">Catatan & Evaluasi Murid</label><textarea placeholder="Contoh: Budi sangat fokus, pengucapan makhraj huruf Kho perlu latihan tambahan..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="rounded-xl border border-gray-300/80 bg-white/70 px-4 py-2.5 text-xs sm:text-sm focus:border-[#4a70a9] focus:ring-1 focus:ring-[#4a70a9] outline-none resize-none" required /></div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200/30"><Button type="button" variant="ghost" onClick={onCancel} className="text-xs py-2 px-4 shadow-sm">Batal</Button><Button type="submit" variant="primary" className="text-xs py-2 px-5">{isEditing ? "Perbarui Laporan" : "Simpan & Kirim Laporan"}</Button></div>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

const formatSessionDateTime = (isoString: string) => {
  try {
    const d = new Date(isoString);
    const dateStr = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(d);
    const timeStr = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", hour12: false }).format(d);
    return `${dateStr} • ${timeStr} WIB`;
  } catch { return isoString; }
};

const calculateAge = (birthDateString: string) => {
  try { const birth = new Date(birthDateString); const ageDifMs = Date.now() - birth.getTime(); const ageDate = new Date(ageDifMs); return Math.abs(ageDate.getUTCFullYear() - 1970); } catch { return 7; }
};

interface DbMurid { id: string; waliId: string; name: string; birthDate?: string | null; schoolLevel?: string | null; avatarUrl?: string | null; }
interface SessionWithRelations extends Session { murid?: DbMurid; program?: Program; }
interface DailyReportWithRelations extends DailyReport { session: Session & { program?: Program; tentor?: User }; murid?: DbMurid; }

export default function LaporanHarianClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const editSessionId = searchParams.get("editSessionId");

  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<DailyReportForTentorDetailed[]>([]);
  const [sessions, setSessions] = useState<SessionWithRelations[]>([]);
  const [murids, setMurids] = useState<Murid[]>([]);
  const [selectedMuridId, setSelectedMuridId] = useState<string>("all");
  const [selectedBlock, setSelectedBlock] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [tentorName, setTentorName] = useState("Tentor");
  const [profileLoading, setProfileLoading] = useState(true);
  const [detailReport, setDetailReport] = useState<DailyReportForTentorDetailed | null>(null);

  const refreshData = async () => {
    try {
      interface EnrollmentWithMurid { id: string; muridId: string; murid?: { id: string; waliId: string; name: string; birthDate?: string | null; schoolLevel?: string | null; avatarUrl?: string | null }; }
      const [reportsRes, sessionsRes, enrollmentsRes, profileRes] = await Promise.all([
        apiFetch<{ reports: DailyReportWithRelations[] }>("/api/me/daily-reports"),
        apiFetch<{ sessions: SessionWithRelations[] }>("/api/me/sessions"),
        apiFetch<{ enrollments: EnrollmentWithMurid[] }>("/api/me/enrollments").catch(() => ({ enrollments: [] as any } as any)),
        apiFetch<{ user: { name: string } }>("/api/users/me").catch(() => ({ user: { name: "Tentor" } } as any)),
      ]);
      if (profileRes?.user?.name) { setTentorName(profileRes.user.name); setProfileLoading(false); }

      const mappedReports = reportsRes.reports.map((r) => ({
        id: r.id, sessionId: r.sessionId, muridId: r.muridId,
        date: formatSessionDateTime(r.session.startsAt).split(" • ")[0],
        startTime: r.startTime, endTime: r.endTime, activity: r.activity, notes: r.notes || "",
        programName: r.session.program?.name || "Program General",
        muridName: r.murid?.name || "Siswa", muridAge: r.murid?.birthDate ? calculateAge(r.murid.birthDate) : 7,
        rawStartsAt: r.session.startsAt, rawEndsAt: r.session.endsAt, location: (r.session as any).location || (r.murid as any)?.address || "",
      } as any));
      setReports(mappedReports as any);

      const mappedSessions = sessionsRes.sessions.map((s) => ({ ...s, startsAt: formatSessionDateTime(s.startsAt), endsAt: formatSessionDateTime(s.endsAt) }));
      setSessions(mappedSessions);

      const uniqueMuridsMap = new Map<string, Murid>();
      const enrList: EnrollmentWithMurid[] = (enrollmentsRes as any).enrollments || [];
      enrList.forEach((enr) => { const m = enr.murid; if (m && !uniqueMuridsMap.has(m.id)) { uniqueMuridsMap.set(m.id, { id: m.id, waliId: m.waliId || "wali-1", name: m.name, age: m.birthDate ? calculateAge(m.birthDate) : 7, schoolLevel: m.schoolLevel || "TK B", avatarUrl: m.avatarUrl || "" } as any); } });
      mappedSessions.forEach((s) => { if (s.murid && !uniqueMuridsMap.has(s.murid.id)) { uniqueMuridsMap.set(s.murid.id, { id: s.murid.id, waliId: s.murid.waliId || "wali-1", name: s.murid.name, age: s.murid.birthDate ? calculateAge(s.murid.birthDate) : 7, schoolLevel: s.murid.schoolLevel || "TK B", avatarUrl: s.murid.avatarUrl || "" } as any); } });
      setMurids(Array.from(uniqueMuridsMap.values()));
    } catch (err) { console.error("Error refreshing daily reports data:", err); } finally { setLoading(false); }
  };

  useEffect(() => { const timer = setTimeout(() => { refreshData(); }, 0); return () => clearTimeout(timer); }, []);

  // Auto-redirect: jika URL memakai sessionId tapi sesi sudah punya laporan,
  // alihkan ke mode edit agar form terisi data lama (bukan menimpa dengan form kosong).
  useEffect(() => {
    if (!sessionId || loading) return;
    const alreadyReported = reports.some(r => r.sessionId === sessionId);
    if (alreadyReported) {
      router.replace(`/app/tentor/laporan-harian?editSessionId=${sessionId}`);
    }
  }, [sessionId, reports, loading, router]);

  const filteredReports = selectedMuridId === "all" ? reports : reports.filter(r => r.muridId === selectedMuridId);
  const selectedMurid = murids.find(m => m.id === selectedMuridId);
  const muridReports = reports.filter(r => r.muridId === selectedMuridId);
  const chronologicalReports = [...muridReports].reverse();
  const programOfMurid = selectedMurid ? sessions.find(s => s.muridId === selectedMurid.id)?.program || null : null;
  const sessionsPerBlock = programOfMurid ? (programOfMurid as any).sessionsPerBlock || 12 : 12;
  const totalBlocks = Math.ceil(chronologicalReports.length / sessionsPerBlock) || 1;
  const startIndex = (selectedBlock - 1) * sessionsPerBlock;
  const printReports = chronologicalReports.slice(startIndex, startIndex + sessionsPerBlock);

  const activeSession = sessionId ? sessions.find(s => s.id === sessionId) : editSessionId ? sessions.find(s => s.id === editSessionId) : null;
  const isEditing = !!editSessionId;
  const initialReport = editSessionId ? reports.find(r => r.sessionId === editSessionId) : null;

  const triggerToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 4000); };
  const handleCloseForm = () => { router.push("/app/tentor/laporan-harian"); };
  const handleFormSubmit = async (data: { date: string; startTime: string; endTime: string; activity: string; notes: string }) => {
    if (!activeSession) return;
    try {
      await apiFetch("/api/daily-reports", { method: "POST", body: JSON.stringify({ sessionId: activeSession.id, activity: data.activity, notes: data.notes }) });
      triggerToast(isEditing ? "Laporan harian berhasil diperbarui!" : "Laporan harian berhasil disimpan dan dikirim!");
      await refreshData();
    } catch (err) { console.error("Error submitting report:", err); const errMsg = err instanceof Error ? err.message : "Terjadi kesalahan"; triggerToast("Gagal menyimpan laporan: " + errMsg); }
    handleCloseForm();
  };

  const handleWriteReport = () => {
    // Cari sesi apa pun yang belum dilaporkan dan tidak dibatalkan.
    // TANPA fallback ke sessions[0] — fallback lama menyebabkan laporan lama tertimpa via upsert.
    const pendingSess = sessions.find(s => s.status !== "cancelled" && !reports.some(r => r.sessionId === s.id));
    if (pendingSess) {
      router.push(`/app/tentor/laporan-harian?sessionId=${pendingSess.id}`);
    } else {
      triggerToast("Semua sesi mengajar sudah dilaporkan. Buat jadwal baru di halaman Jadwal terlebih dahulu.");
    }
  };

  const handlePrint = () => {
    if (selectedMuridId === "all") { triggerToast("Pilih siswa dulu untuk cetak"); return; }
    if (typeof document !== "undefined") { document.title = `Laporan-Harian-${selectedMurid?.name || "Siswa"}-Blok-${selectedBlock}`; }
    window.print();
  };

  if (loading) { return (<div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full flex-grow flex flex-col justify-center items-center gap-4"><div className="text-gray-500 font-semibold animate-pulse">Memuat laporan harian...</div></div>); }

  const todayWib = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", day: "numeric", month: "long", year: "numeric" }).format(new Date());

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full flex-grow flex flex-col gap-6 pb-32 relative print:p-0 print:pb-0 print:bg-white">
      <div className="print:hidden flex flex-col gap-6 w-full">
        {toastMessage && (<div className="fixed top-12 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-md text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 z-50 animate-[slideDown_0.2s_ease-out]"><CheckCircle2 size={16} className="text-emerald-400" /><span>{toastMessage}</span></div>)}

        {!activeSession && (<header className="rounded-[20px] bg-white/45 backdrop-blur-xl border border-white/60 shadow-sm p-4 sm:p-5"><h1 className="text-[22px] sm:text-3xl font-extrabold text-gray-900 tracking-tight">Laporan Harian</h1><p className="text-[12px] sm:text-sm text-gray-600 leading-relaxed mt-1">Kelola catatan belajar per sesi • Cetak rapi per blok</p></header>)}

        {activeSession ? (
          <LaporanHarianForm session={activeSession} initialReport={initialReport} isEditing={isEditing} onSubmit={handleFormSubmit} onCancel={handleCloseForm} />
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5"><span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">Filter Siswa</span><div className="flex flex-wrap gap-1.5"><button onClick={() => { setSelectedMuridId("all"); setSelectedBlock(1); }} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selectedMuridId === "all" ? "bg-[#4a70a9] text-white border-transparent" : "bg-white/40 text-gray-600 hover:bg-white/60 border-white/60"}`}>Semua</button>{murids.map((m) => (<button key={m.id} onClick={() => { setSelectedMuridId(m.id); setSelectedBlock(1); }} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selectedMuridId === m.id ? "bg-[#4a70a9] text-white border-transparent" : "bg-white/40 text-gray-600 hover:bg-white/60 border-white/60"}`}>{m.name}</button>))}</div></div>

                <div className="flex flex-col gap-2 self-stretch sm:self-end">
                  {selectedMuridId !== "all" && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs bg-white/60 border border-white/60 rounded-xl px-3 py-2 shadow-sm flex-1 sm:flex-auto justify-between">
                        <span className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">Blok</span>
                        <select value={selectedBlock} onChange={(e) => setSelectedBlock(Number(e.target.value))} className="bg-transparent font-semibold text-gray-800 outline-none cursor-pointer ml-2 text-xs">
                          {Array.from({ length: totalBlocks }).map((_, i) => { const blockNum = i + 1; const startSess = i * sessionsPerBlock + 1; const endSess = Math.min((i + 1) * sessionsPerBlock, chronologicalReports.length); return (<option key={blockNum} value={blockNum} className="text-gray-800">Blok {blockNum} (Sesi {startSess}-{endSess})</option>); })}
                        </select>
                      </div>
                      <button onClick={handlePrint} className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/80 hover:bg-white text-[#4a70a9] border border-white/80 shadow-sm font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"><Printer size={16} /> Cetak PDF</button>
                    </div>
                  )}
                  <button onClick={handleWriteReport} className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#4a70a9] text-white hover:bg-[#3a5a99] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95"><Plus size={16} /> Tulis Laporan</button>
                </div>
              </div>
            </div>

            {/* Tabel Daftar Laporan */}
            <GlassCard className="overflow-hidden border border-white/80 shadow-sm">
              {filteredReports.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-gray-200/40 bg-white/40 text-[10px] uppercase tracking-wider text-gray-500">
                        <th className="px-4 py-3 font-bold w-[36px] text-center">No</th>
                        <th className="px-4 py-3 font-bold">Siswa</th>
                        <th className="px-4 py-3 font-bold hidden md:table-cell">Tanggal</th>
                        <th className="px-4 py-3 font-bold hidden sm:table-cell">Jam</th>
                        <th className="px-4 py-3 font-bold hidden lg:table-cell">Program</th>
                        <th className="px-4 py-3 font-bold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/30">
                      {filteredReports.map((report, index) => (
                        <tr key={report.id} className="hover:bg-white/50 transition-colors">
                          <td className="px-4 py-3 text-center text-gray-400 font-semibold">{index + 1}</td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-gray-800">{report.muridName}</span>
                            <span className="block md:hidden text-[10px] text-gray-500 mt-0.5">{report.date}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-600 hidden md:table-cell whitespace-nowrap">{report.date}</td>
                          <td className="px-4 py-3 text-gray-600 hidden sm:table-cell whitespace-nowrap">{report.startTime} - {report.endTime}</td>
                          <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{report.programName}</td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-1.5">
                              <button onClick={() => setDetailReport(report as any)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#4a70a9]/10 text-[#4a70a9] border border-[#4a70a9]/20 hover:bg-[#4a70a9]/20 font-semibold text-[11px] transition-colors"><Eye size={13} /> Detail</button>
                              <button onClick={() => router.push(`/app/tentor/laporan-harian?editSessionId=${report.sessionId}`)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/70 text-gray-600 border border-gray-200/60 hover:bg-white font-semibold text-[11px] transition-colors">Edit</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (<div className="flex flex-col items-center justify-center p-8 text-center gap-3"><AlertCircle className="text-[#4a70a9]" size={36} /><div><h3 className="font-bold text-gray-800 text-sm">Belum Ada Laporan Harian</h3><p className="text-xs text-gray-500 mt-1 max-w-sm">Tulis laporan pertama setelah mengajar selesai.</p></div></div>)}
            </GlassCard>

            {selectedMuridId !== "all" && filteredReports.length > 0 && (
              <div className="md:hidden sticky bottom-[72px] z-20">
                <button onClick={handlePrint} className="w-full h-12 rounded-2xl bg-gray-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-all"><Printer size={18} /> Cetak Hasil Belajar Terbaru (Blok {selectedBlock})</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Detail Laporan */}
      {detailReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 print:hidden" onClick={() => setDetailReport(null)}>
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg animate-[fadeIn_0.25s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <GlassCard className="p-6 border border-white/80 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-gray-800 text-base flex items-center gap-2"><span>{detailReport.muridName}</span><span className="text-[10px] font-normal text-gray-500 bg-white/60 px-2.5 py-0.5 rounded-full border border-white/60">{detailReport.muridAge} Tahun</span></h3>
                  <p className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-1.5"><BookOpen size={13} className="text-[#4a70a9]" />{detailReport.programName}</p>
                </div>
                <button onClick={() => setDetailReport(null)} className="p-1.5 rounded-lg hover:bg-white/70 text-gray-500 transition-colors"><X size={18} /></button>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold border-b border-gray-200/30 pb-3"><Clock size={14} className="text-[#4a70a9]" /><span>{detailReport.date} • {detailReport.startTime} - {detailReport.endTime} WIB</span></div>
              <div><span className="text-[10px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">Materi / Aktivitas</span><p className="text-sm font-semibold text-gray-800 leading-relaxed">{detailReport.activity}</p></div>
              <div className="border-l-2 border-[#4a70a9]/30 pl-4 py-2 bg-[#4a70a9]/5 rounded-r-xl pr-3"><span className="text-[10px] font-bold text-[#4a70a9] block mb-1 uppercase tracking-wider">Catatan Evaluasi</span><p className="text-xs italic text-gray-600 leading-relaxed">&quot;{detailReport.notes}&quot;</p></div>
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200/30">
                <Button variant="ghost" onClick={() => setDetailReport(null)} className="text-xs py-2 px-4">Tutup</Button>
                <Button variant="primary" onClick={() => { const sid = detailReport.sessionId; setDetailReport(null); router.push(`/app/tentor/laporan-harian?editSessionId=${sid}`); }} className="text-xs py-2 px-4">Edit Laporan</Button>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {selectedMuridId !== "all" && selectedMurid && (
        <div className="hidden print:block bg-white text-black p-0 font-sans w-full min-h-screen text-[11px] print:text-black">
          <style>{`@media print { @page { size: A4; margin: 12mm 10mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .print-avoid-break { break-inside: avoid; } table { border-collapse: collapse; } }`}</style>
          <div className="text-center flex flex-col items-center mb-5 pb-4 border-b-2 border-black">
            <h1 className="text-[20px] font-black tracking-[0.12em] text-black uppercase">NURMAN COURSE</h1>
            <p className="text-[11px] font-semibold text-gray-800 tracking-wide mt-0.5">Laporan Kegiatan Belajar Mengajar Privat</p>
            <p className="text-[9px] text-gray-600 mt-1">{NURMAN_ADDR} • {NURMAN_WA}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[10px] mb-4 border border-black p-3 rounded-[8px]">
            <div><table className="w-full"><tbody><tr><td className="font-bold py-0.5 w-[88px]">Nama Siswa</td><td className="py-0.5">: {selectedMurid.name}</td></tr><tr><td className="font-bold py-0.5">Umur</td><td className="py-0.5">: {selectedMurid.age} Th</td></tr><tr><td className="font-bold py-0.5">Jenjang</td><td className="py-0.5">: {selectedMurid.schoolLevel}</td></tr><tr><td className="font-bold py-0.5">Tanggal Cetak</td><td className="py-0.5">: {todayWib}</td></tr></tbody></table></div>
            <div><table className="w-full"><tbody><tr><td className="font-bold py-0.5 w-[88px]">Program</td><td className="py-0.5">: {programOfMurid?.name || (printReports[0] as any)?.programName || "Program"}</td></tr><tr><td className="font-bold py-0.5">Periode</td><td className="py-0.5">: Blok {selectedBlock} / {totalBlocks} (Target {sessionsPerBlock} Sesi)</td></tr><tr><td className="font-bold py-0.5">Tentor</td><td className="py-0.5">: {tentorName}</td></tr><tr><td className="font-bold py-0.5">Jumlah Sesi</td><td className="py-0.5">: {printReports.length} sesi di blok ini</td></tr></tbody></table></div>
          </div>

          <h2 className="text-[11px] font-black uppercase tracking-wider mb-2 text-black">Detail Pertemuan</h2>
          <table className="w-full border border-black text-[9.5px] mb-6">
            <thead><tr className="bg-gray-100 text-black"><th className="border border-black px-2 py-2 w-[28px] text-center font-bold">No</th><th className="border border-black px-2 py-2 w-[90px] text-left font-bold">Hari & Tanggal</th><th className="border border-black px-2 py-2 w-[70px] text-left font-bold">Jam</th><th className="border border-black px-2 py-2 text-left font-bold">Materi / Aktivitas</th><th className="border border-black px-2 py-2 text-left font-bold w-[28%]">Catatan Evaluasi Tentor</th></tr></thead>
            <tbody>
              {printReports.length > 0 ? printReports.map((rep: any, index: number) => (
                <tr key={rep.id} className="print-avoid-break"><td className="border border-black px-2 py-2 text-center align-top">{startIndex + index + 1}</td><td className="border border-black px-2 py-2 align-top font-semibold">{rep.date}</td><td className="border border-black px-2 py-2 align-top">{rep.startTime} - {rep.endTime}</td><td className="border border-black px-2 py-2 align-top">{rep.activity}</td><td className="border border-black px-2 py-2 align-top italic">"{rep.notes}"</td></tr>
              )) : (<tr><td colSpan={5} className="border border-black px-3 py-6 text-center text-gray-500">Belum ada laporan harian di blok ini.</td></tr>)}
            </tbody>
          </table>

          <div className="border border-black p-3 rounded-[8px] text-[10px] mb-8"><p className="font-bold mb-1">Ringkasan Blok {selectedBlock}</p><p className="leading-relaxed">Total {printReports.length} sesi tercatat. Program: <span className="font-semibold">{programOfMurid?.name || "-"}</span>. Tentor: <span className="font-semibold">{tentorName}</span>. Dicetak otomatis dari sistem Nurman Course.</p></div>

          <div className="flex justify-between items-start pt-4 text-[10px] mt-8">
            <div className="text-center w-[160px] flex flex-col gap-14"><span>Orang Tua / Wali Murid</span><div className="border-b border-black w-full"></div><span className="text-[8px] text-gray-500">{selectedMurid.name}</span></div>
            <div className="text-center w-[160px] flex flex-col gap-14"><span>Tentor</span><div className="flex flex-col items-center"><span className="font-bold">{tentorName}</span><div className="border-b border-black w-full mt-1"></div><span className="text-[8px] text-gray-500 mt-1">Nurman Course • {NURMAN_ADDR}</span></div></div>
          </div>
        </div>
      )}
    </div>
  );
}
