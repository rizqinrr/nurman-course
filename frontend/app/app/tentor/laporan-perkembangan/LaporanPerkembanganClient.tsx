"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProgressReportForTentorDetailed, Murid, Program, Session } from "@/data/lms";
import { apiFetch } from "@/lib/api";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { ArrowLeft, CheckCircle2, BookOpen, Award, AlertCircle, Plus, AlertTriangle, Printer, X } from "lucide-react";

const NURMAN_ADDR = "Jalan Kalisabuk, Kesugihan, Cilacap";
const NURMAN_WA = "WA: 0853-xxxx-xxxx";

interface FormProps {
  murid: Murid;
  program: Program;
  blockNumber: number;
  onSubmit: (data: { achievements: string[]; masteredMaterials: string[]; weakMaterials: string[]; notes: string }) => void;
  onCancel: () => void;
}

interface BulletPointInputProps {
  icon: React.ReactNode;
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  accentColor: string;
  minPoints?: number;
}

function BulletPointInput({ icon, label, values, onChange, placeholder, accentColor, minPoints = 1 }: BulletPointInputProps) {
  const update = (index: number, value: string) => { const next = [...values]; next[index] = value; onChange(next); };
  const add = () => onChange([...values, ""]);
  const remove = (index: number) => { if (values.length <= minPoints) return; onChange(values.filter((_, i) => i !== index)); };
  return (
    <div className="flex flex-col gap-2 border-l-2 pl-4 transition-colors" style={{ borderColor: accentColor }}>
      <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">{icon}<span>{label}</span></label>
      <div className="flex flex-col gap-2">
        {values.map((val, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="shrink-0 w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center border shadow-sm" style={{ backgroundColor: `${accentColor}10`, borderColor: `${accentColor}40`, color: accentColor }}>{index + 1}</span>
            <input type="text" value={val} onChange={(e) => update(index, e.target.value)} placeholder={index === 0 ? placeholder : "Poin tambahan..."} className="flex-1 rounded-xl border border-gray-300/80 bg-white/70 px-4 py-2 text-xs sm:text-sm focus:border-[#4a70a9] focus:ring-1 focus:ring-[#4a70a9] outline-none text-gray-900 placeholder:text-gray-400" />
            <button type="button" onClick={() => remove(index)} disabled={values.length <= minPoints} className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed"><X size={15} /></button>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="self-start mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/40 hover:bg-white/60 border border-white/60 shadow-sm" style={{ color: accentColor }}><Plus size={14} /> Tambah Poin</button>
    </div>
  );
}

function LaporanPerkembanganForm({ murid, program, blockNumber, onSubmit, onCancel }: FormProps) {
  const [achievements, setAchievements] = useState<string[]>([""]);
  const [masteredMaterials, setMasteredMaterials] = useState<string[]>([""]);
  const [weakMaterials, setWeakMaterials] = useState<string[]>([""]);
  const [notes, setNotes] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAchievements = achievements.map(a => a.trim()).filter(Boolean);
    const cleanMastered = masteredMaterials.map(m => m.trim()).filter(Boolean);
    const cleanWeak = weakMaterials.map(w => w.trim()).filter(Boolean);
    if (cleanAchievements.length === 0) { setValidationError("Harap isi minimal 1 poin Capaian & Perkembangan Anak."); return; }
    if (cleanMastered.length === 0) { setValidationError("Harap isi minimal 1 poin Materi yang Sudah Dikuasai."); return; }
    if (cleanWeak.length === 0) { setValidationError("Harap isi minimal 1 poin Materi yang Masih Perlu Pengulangan."); return; }
    setValidationError(null);
    onSubmit({ achievements: cleanAchievements, masteredMaterials: cleanMastered, weakMaterials: cleanWeak, notes });
  };
  return (
    <div className="flex flex-col gap-6 animate-[fadeIn_0.4s_ease-out]">
      <header className="flex flex-col gap-2"><button onClick={onCancel} className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-white/40 hover:bg-white/60 border border-white/60 px-3.5 py-1.5 rounded-full w-fit shadow-sm self-start"><ArrowLeft size={14} /> Kembali</button><h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight mt-1">Buat Rapor Perkembangan</h1><p className="text-xs sm:text-sm text-gray-600">Tulis evaluasi berkala capaian belajar anak untuk dibaca orang tua.</p></header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 flex flex-col gap-4"><GlassCard className="p-5 border border-white/80 shadow-sm"><h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200/30 pb-2">Konteks Siswa</h3><div className="flex flex-col gap-4 text-xs sm:text-sm"><div><span className="text-[10px] font-bold text-gray-400 block mb-0.5">SISWA</span><span className="font-bold text-gray-800 text-base">{murid.name}</span><span className="text-xs text-gray-500 block">{murid.schoolLevel} • {murid.age} Tahun</span></div><div><span className="text-[10px] font-bold text-gray-400 block mb-0.5">PROGRAM</span><span className="font-semibold text-gray-800 flex items-center gap-1.5 mt-0.5"><BookOpen size={16} className="text-[#4a70a9]" />{program.name}</span><span className="text-xs text-gray-500 block mt-0.5">({program.sessionsPerBlock} Sesi/Blok)</span></div><div className="pt-3 border-t border-gray-200/30"><span className="text-[10px] font-bold text-gray-400 block mb-1">PERIODE EVALUASI</span><span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 text-[#4a70a9] text-xs font-bold rounded-lg shadow-sm">Blok {blockNumber}</span></div></div></GlassCard></div>
        <div className="lg:col-span-2"><GlassCard className="p-6 md:p-8 border border-white/80 shadow-sm"><form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {validationError && (<div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2"><AlertCircle size={16} className="shrink-0" /><span>{validationError}</span></div>)}
          <BulletPointInput icon={<Award size={16} className="text-[#4a70a9]" />} label="Capaian & Perkembangan Anak" values={achievements} onChange={setAchievements} placeholder="Contoh: Pengenalan huruf Hijaiyah tuntas..." accentColor="#4a70a9" />
          <BulletPointInput icon={<CheckCircle2 size={16} className="text-emerald-600" />} label="Materi yang Sudah Dikuasai" values={masteredMaterials} onChange={setMasteredMaterials} placeholder="Contoh: Pengenalan seluruh huruf hijaiyah tunggal berharakat fathah..." accentColor="#10b981" />
          <BulletPointInput icon={<AlertTriangle size={16} className="text-amber-600" />} label="Materi yang Masih Perlu Pengulangan / Latihan" values={weakMaterials} onChange={setWeakMaterials} placeholder="Contoh: Pelafalan huruf tebal seperti Shod, Dhod..." accentColor="#d97706" />
          <div className="flex flex-col gap-1.5 border-l-2 border-gray-400/40 pl-4"><label className="text-xs font-bold text-gray-700">Catatan & Saran Tentor untuk Orang Tua</label><textarea placeholder="Contoh: Disarankan latihan 5-10 menit setelah maghrib..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="rounded-xl border border-gray-300/80 bg-white/70 px-4 py-2.5 text-xs sm:text-sm focus:border-[#4a70a9] focus:ring-1 focus:ring-[#4a70a9] outline-none resize-none" required /></div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200/30"><Button type="button" variant="ghost" onClick={onCancel} className="text-xs py-2 px-4 shadow-sm">Batal</Button><Button type="submit" variant="primary" className="text-xs py-2 px-5">Terbitkan Rapor Perkembangan</Button></div>
        </form></GlassCard></div>
      </div>
    </div>
  );
}

const calculateAge = (birthDateString: string) => { try { const birth = new Date(birthDateString); const ageDifMs = Date.now() - birth.getTime(); const ageDate = new Date(ageDifMs); return Math.abs(ageDate.getUTCFullYear() - 1970); } catch { return 7; } };
interface DbMurid { id: string; waliId: string; name: string; birthDate?: string | null; schoolLevel?: string | null; avatarUrl?: string | null; }
interface SessionWithRelations extends Session { murid?: DbMurid; program?: Program; }
interface ProgressReportWithRelations { id: string; muridId: string; programId: string; blockNumber: number; achievements: string[]; masteredMaterials: string[]; weakMaterials: string[]; notes?: string | null; program?: Program | null; murid?: DbMurid | null; createdAt: string; }

export default function LaporanPerkembanganClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const muridId = searchParams.get("muridId");
  const programId = searchParams.get("programId");
  const block = searchParams.get("block");

  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<ProgressReportForTentorDetailed[]>([]);
  const [murids, setMurids] = useState<Murid[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [sessions, setSessions] = useState<SessionWithRelations[]>([]);
  const [selectedMuridId, setSelectedMuridId] = useState<string>("all");
  const [selectedProgressBlock, setSelectedProgressBlock] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [tentorName, setTentorName] = useState("Tentor");

  const refreshData = async () => {
    try {
      interface EnrollmentWithMurid { id: string; muridId: string; murid?: { id: string; waliId: string; name: string; birthDate?: string | null; schoolLevel?: string | null; avatarUrl?: string | null }; }
      const [reportsRes, sessionsRes, enrollmentsRes, profileRes] = await Promise.all([
        apiFetch<{ reports: ProgressReportWithRelations[] }>("/api/me/progress-reports"),
        apiFetch<{ sessions: SessionWithRelations[] }>("/api/me/sessions"),
        apiFetch<{ enrollments: EnrollmentWithMurid[] }>("/api/me/enrollments").catch(() => ({ enrollments: [] as any } as any)),
        apiFetch<{ user: { name: string } }>("/api/users/me").catch(() => ({ user: { name: "Tentor" } } as any)),
      ]);
      if (profileRes?.user?.name) setTentorName(profileRes.user.name);

      const mappedReports = reportsRes.reports.map((r) => ({ id: r.id, muridId: r.muridId, programId: r.programId, blockNumber: r.blockNumber, achievements: r.achievements, masteredMaterials: r.masteredMaterials, weakMaterials: r.weakMaterials, notes: r.notes || "", programName: r.program?.name || "Program General", muridName: r.murid?.name || "Siswa", muridAge: r.murid?.birthDate ? calculateAge(new Date(r.murid.birthDate).toISOString()) : 7, sessionsPerBlock: (r.program as any)?.sessionsPerBlock || 12 }));
      setReports(mappedReports);
      setSessions(sessionsRes.sessions);

      const uniqueMuridsMap = new Map<string, Murid>();
      const enrList: EnrollmentWithMurid[] = (enrollmentsRes as any).enrollments || [];
      enrList.forEach((enr) => { const m = enr.murid; if (m && !uniqueMuridsMap.has(m.id)) { uniqueMuridsMap.set(m.id, { id: m.id, waliId: m.waliId, name: m.name, age: m.birthDate ? calculateAge(new Date(m.birthDate).toISOString()) : 7, schoolLevel: m.schoolLevel || "TK B", avatarUrl: m.avatarUrl || "" } as any); } });
      sessionsRes.sessions.forEach((s) => { if (s.murid && !uniqueMuridsMap.has(s.murid.id)) { const m = s.murid; uniqueMuridsMap.set(m.id, { id: m.id, waliId: m.waliId, name: m.name, age: m.birthDate ? calculateAge(new Date(m.birthDate).toISOString()) : 7, schoolLevel: m.schoolLevel || "TK B", avatarUrl: m.avatarUrl || "" } as any); } });
      setMurids(Array.from(uniqueMuridsMap.values()));

      const uniqueProgramsMap = new Map<string, Program>();
      sessionsRes.sessions.forEach((s) => { if (s.program && !uniqueProgramsMap.has(s.program.id)) { uniqueProgramsMap.set(s.program.id, s.program); } });
      setPrograms(Array.from(uniqueProgramsMap.values()));
    } catch (err) { console.error("Error refreshing progress reports:", err); } finally { setLoading(false); }
  };

  useEffect(() => { const timer = setTimeout(() => { refreshData(); }, 0); return () => clearTimeout(timer); }, []);

  const filteredReports = selectedMuridId === "all" ? reports : reports.filter(r => r.muridId === selectedMuridId);
  const selectedMurid = murids.find(m => m.id === selectedMuridId);
  const muridProgressReports = reports.filter(r => r.muridId === selectedMuridId);
  const chronologicalProgressReports = [...muridProgressReports].reverse();
  const totalProgressBlocks = chronologicalProgressReports.length;
  const printProgressReport = totalProgressBlocks > 0 ? chronologicalProgressReports[selectedProgressBlock - 1] : null;

  const activeMurid = muridId ? murids.find(m => m.id === muridId) : null;
  const activeProgram = programId ? programs.find(p => p.id === programId) : null;
  const activeBlock = block ? parseInt(block, 10) : 1;

  const triggerToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 4000); };
  const handleCloseForm = () => { router.push("/app/tentor/laporan-perkembangan"); };
  const handleFormSubmit = async (data: { achievements: string[]; masteredMaterials: string[]; weakMaterials: string[]; notes: string }) => {
    if (!activeMurid || !activeProgram) return;
    try {
      await apiFetch("/api/progress-reports", { method: "POST", body: JSON.stringify({ muridId: activeMurid.id, programId: activeProgram.id, blockNumber: activeBlock, achievements: data.achievements, masteredMaterials: data.masteredMaterials, weakMaterials: data.weakMaterials, notes: data.notes }) });
      triggerToast("Rapor perkembangan berhasil diterbitkan!");
      await refreshData();
    } catch (err) { console.error("Error submitting progress report:", err); const errMsg = err instanceof Error ? err.message : "Terjadi kesalahan"; triggerToast("Gagal menerbitkan rapor: " + errMsg); }
    handleCloseForm();
  };

  const handlePrint = () => {
    if (selectedMuridId === "all" || !printProgressReport) { triggerToast("Pilih siswa & rapor dulu untuk cetak"); return; }
    if (typeof document !== "undefined") { document.title = `Rapor-Perkembangan-${selectedMurid?.name || "Siswa"}-Blok-${printProgressReport.blockNumber}`; }
    window.print();
  };

  if (loading) { return (<div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full flex-grow flex flex-col justify-center items-center gap-4"><div className="text-gray-500 font-semibold animate-pulse">Memuat laporan perkembangan...</div></div>); }

  const todayWib = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", day: "numeric", month: "long", year: "numeric" }).format(new Date());

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full flex-grow flex flex-col gap-6 pb-32 relative print:p-0 print:pb-0 print:bg-white">
      <div className="print:hidden flex flex-col gap-6 w-full">
        {toastMessage && (<div className="fixed top-12 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-md text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 z-50"><CheckCircle2 size={16} className="text-emerald-400" /><span>{toastMessage}</span></div>)}
        {(!activeMurid || !activeProgram) && (<header className="rounded-[20px] bg-white/45 backdrop-blur-xl border border-white/60 shadow-sm p-4 sm:p-5"><h1 className="text-[22px] sm:text-3xl font-extrabold text-gray-900 tracking-tight">Laporan Perkembangan</h1><p className="text-[12px] sm:text-sm text-gray-600 leading-relaxed mt-1">Evaluasi berkala per blok untuk wali • Cetak rapi per blok</p></header>)}

        {activeMurid && activeProgram ? (
          <LaporanPerkembanganForm murid={activeMurid} program={activeProgram} blockNumber={activeBlock} onSubmit={handleFormSubmit} onCancel={handleCloseForm} />
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5"><span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">Filter Siswa</span><div className="flex flex-wrap gap-1.5"><button onClick={() => { setSelectedMuridId("all"); setSelectedProgressBlock(1); }} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selectedMuridId === "all" ? "bg-[#4a70a9] text-white border-transparent" : "bg-white/40 text-gray-600 hover:bg-white/60 border-white/60"}`}>Semua</button>{murids.map((m) => (<button key={m.id} onClick={() => { setSelectedMuridId(m.id); setSelectedProgressBlock(1); }} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selectedMuridId === m.id ? "bg-[#4a70a9] text-white border-transparent" : "bg-white/40 text-gray-600 hover:bg-white/60 border-white/60"}`}>{m.name}</button>))}</div></div>
                <div className="flex flex-col gap-2 self-stretch sm:self-end">
                  {selectedMuridId !== "all" && totalProgressBlocks > 0 && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs bg-white/60 border border-white/60 rounded-xl px-3 py-2 shadow-sm flex-1 sm:flex-auto justify-between"><span className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">Rapor</span><select value={selectedProgressBlock} onChange={(e) => setSelectedProgressBlock(Number(e.target.value))} className="bg-transparent font-semibold text-gray-800 outline-none cursor-pointer ml-2 text-xs">{Array.from({ length: totalProgressBlocks }).map((_, i) => { const blockNum = i + 1; const rep = chronologicalProgressReports[i]; return (<option key={blockNum} value={blockNum} className="text-gray-800">Blok {rep.blockNumber}</option>); })}</select></div>
                      <button onClick={handlePrint} className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/80 hover:bg-white text-[#4a70a9] border border-white/80 shadow-sm font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95"><Printer size={16} /> Cetak PDF</button>
                    </div>
                  )}
                  <button onClick={() => { const targetMurid = murids.find(m => m.id === selectedMuridId) || murids[0]; if (!targetMurid) { triggerToast("Belum ada data siswa tersedia."); return; } const firstProgramId = sessions.find(s => s.muridId === targetMurid.id)?.programId; const targetProgram = firstProgramId ? programs.find(p => p.id === firstProgramId) : programs[0]; if (!targetProgram) { triggerToast("Belum ada data program tersedia."); return; } router.push(`/app/tentor/laporan-perkembangan?muridId=${targetMurid.id}&programId=${targetProgram.id}&block=1`); }} className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#4a70a9] text-white hover:bg-[#3a5a99] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95"><Plus size={16} /> Buat Rapor</button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <GlassCard key={report.id} className="p-5 border border-white/80 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start border-b border-gray-200/20 pb-3"><div><h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-2"><span>{report.muridName}</span><span className="text-[10px] font-normal text-gray-500 bg-white/40 px-2.5 py-0.5 rounded-full border border-white/60">{report.muridAge} Tahun</span></h3><p className="text-xs text-gray-500 mt-1">{report.programName}</p></div><span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 text-[#4a70a9] text-xs font-bold rounded-lg shadow-sm shrink-0">Blok {report.blockNumber} ({report.sessionsPerBlock} Sesi)</span></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
                      <div className="flex flex-col gap-2"><h4 className="font-bold text-gray-800 flex items-center gap-1.5"><Award size={16} className="text-[#4a70a9]" /> Pencapaian Utama</h4><ul className="list-disc list-inside text-gray-600 space-y-1 pl-1">{report.achievements.map((ach, idx) => (<li key={idx} className="leading-relaxed">{ach}</li>))}</ul></div>
                      <div className="flex flex-col gap-4"><div className="flex flex-col gap-1 border-l-2 border-emerald-500/40 pl-3"><h4 className="font-bold text-[10px] uppercase tracking-wider text-emerald-800">Materi Dikuasai</h4><ul className="list-disc list-inside text-gray-600 space-y-0.5 mt-0.5">{report.masteredMaterials.map((item, idx) => (<li key={idx} className="leading-relaxed">{item}</li>))}</ul></div><div className="flex flex-col gap-1 border-l-2 border-amber-500/40 pl-3"><h4 className="font-bold text-[10px] uppercase tracking-wider text-amber-800">Butuh Pengulangan</h4><ul className="list-disc list-inside text-gray-600 space-y-0.5 mt-0.5">{report.weakMaterials.map((item, idx) => (<li key={idx} className="leading-relaxed">{item}</li>))}</ul></div></div>
                    </div>
                    <div className="border-t border-gray-200/30 pt-3 mt-1"><span className="text-[10px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">Catatan & Saran Tentor</span><p className="text-xs italic text-gray-600 leading-relaxed">"{report.notes}"</p></div>
                  </GlassCard>
                ))
              ) : (<div className="flex flex-col items-center justify-center p-8 bg-white/40 border border-white/60 rounded-3xl text-center gap-3"><AlertCircle className="text-[#4a70a9]" size={36} /><div><h3 className="font-bold text-gray-800 text-sm">Belum Ada Rapor Perkembangan</h3><p className="text-xs text-gray-500 mt-1 max-w-sm">Buat rapor setelah murid menyelesaikan satu blok.</p></div></div>)}
            </div>

            {selectedMuridId !== "all" && totalProgressBlocks > 0 && (
              <div className="md:hidden sticky bottom-[72px] z-20"><button onClick={handlePrint} className="w-full h-12 rounded-2xl bg-gray-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl active:scale-[0.98]"><Printer size={18} /> Cetak Rapor Blok {printProgressReport?.blockNumber || ""}</button></div>
            )}
          </div>
        )}
      </div>

      {selectedMuridId !== "all" && selectedMurid && printProgressReport && (
        <div className="hidden print:block bg-white text-black p-0 font-sans w-full min-h-screen text-[11px]">
          <style>{`@media print { @page { size: A4; margin: 12mm 10mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .print-avoid-break { break-inside: avoid; } table { border-collapse: collapse; } }`}</style>
          <div className="text-center flex flex-col items-center mb-5 pb-4 border-b-2 border-black"><h1 className="text-[20px] font-black tracking-[0.12em] uppercase">NURMAN COURSE</h1><p className="text-[11px] font-semibold text-gray-800 tracking-wide mt-0.5">Rapor Evaluasi Perkembangan Belajar Siswa</p><p className="text-[9px] text-gray-600 mt-1">{NURMAN_ADDR} • {NURMAN_WA}</p></div>

          <div className="grid grid-cols-2 gap-3 text-[10px] mb-4 border border-black p-3 rounded-[8px]"><div><table className="w-full"><tbody><tr><td className="font-bold py-0.5 w-[88px]">Nama Siswa</td><td className="py-0.5">: {selectedMurid.name}</td></tr><tr><td className="font-bold py-0.5">Umur</td><td className="py-0.5">: {selectedMurid.age} Th</td></tr><tr><td className="font-bold py-0.5">Jenjang</td><td className="py-0.5">: {selectedMurid.schoolLevel}</td></tr><tr><td className="font-bold py-0.5">Tanggal Cetak</td><td className="py-0.5">: {todayWib}</td></tr></tbody></table></div><div><table className="w-full"><tbody><tr><td className="font-bold py-0.5 w-[88px]">Program</td><td className="py-0.5">: {printProgressReport.programName}</td></tr><tr><td className="font-bold py-0.5">Rapor Blok</td><td className="py-0.5">: Blok {printProgressReport.blockNumber} ({printProgressReport.sessionsPerBlock} Sesi)</td></tr><tr><td className="font-bold py-0.5">Tentor</td><td className="py-0.5">: {tentorName}</td></tr></tbody></table></div></div>

          <h2 className="text-[11px] font-black uppercase tracking-wider mb-2">Ringkasan Pencapaian Blok {printProgressReport.blockNumber}</h2>
          <table className="w-full border border-black text-[10px] mb-4"><thead><tr className="bg-gray-100"><th className="border border-black px-2 py-2 w-[32px] text-center">No</th><th className="border border-black px-2 py-2 text-left">Pencapaian Utama</th></tr></thead><tbody>{printProgressReport.achievements.map((ach, idx) => (<tr key={idx} className="print-avoid-break"><td className="border border-black px-2 py-1.5 text-center align-top">{idx+1}</td><td className="border border-black px-2 py-1.5 align-top">{ach}</td></tr>))}</tbody></table>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div><h3 className="text-[10px] font-black uppercase tracking-wider mb-2">Materi Dikuasai</h3><table className="w-full border border-black text-[9.5px]"><thead><tr className="bg-emerald-50"><th className="border border-black px-2 py-1.5 w-[28px]">No</th><th className="border border-black px-2 py-1.5 text-left">Materi</th></tr></thead><tbody>{printProgressReport.masteredMaterials.map((m, i) => (<tr key={i} className="print-avoid-break"><td className="border border-black px-2 py-1.5 text-center">{i+1}</td><td className="border border-black px-2 py-1.5">{m}</td></tr>))}</tbody></table></div>
            <div><h3 className="text-[10px] font-black uppercase tracking-wider mb-2">Butuh Pengulangan</h3><table className="w-full border border-black text-[9.5px]"><thead><tr className="bg-amber-50"><th className="border border-black px-2 py-1.5 w-[28px]">No</th><th className="border border-black px-2 py-1.5 text-left">Materi</th></tr></thead><tbody>{printProgressReport.weakMaterials.map((m, i) => (<tr key={i} className="print-avoid-break"><td className="border border-black px-2 py-1.5 text-center">{i+1}</td><td className="border border-black px-2 py-1.5">{m}</td></tr>))}</tbody></table></div>
          </div>

          <div className="border border-black p-3 rounded-[8px] mb-8"><p className="font-black text-[10px] uppercase tracking-wider mb-1">Catatan & Saran Tentor</p><p className="text-[10px] leading-relaxed italic">"{printProgressReport.notes}"</p></div>

          <div className="flex justify-between items-start pt-4 text-[10px] mt-10"><div className="text-center w-[160px] flex flex-col gap-14"><span>Orang Tua / Wali Murid</span><div className="border-b border-black w-full"></div></div><div className="text-center w-[160px] flex flex-col gap-14"><span>Tentor</span><div className="flex flex-col items-center"><span className="font-bold">{tentorName}</span><div className="border-b border-black w-full mt-1"></div><span className="text-[8px] text-gray-500 mt-1">Nurman Course • {NURMAN_ADDR}</span></div></div></div>
        </div>
      )}
    </div>
  );
}
