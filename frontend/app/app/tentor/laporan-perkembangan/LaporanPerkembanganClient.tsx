/* Hallmark · genre: warm-editorial · design-system: design.md · designed-as-mobile-app */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProgressReportForTentorDetailed, Murid, Program, Session } from "@/data/lms";
import { apiFetch } from "@/lib/api";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import Button from "@/components/ui/Button";
import {
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Award,
  AlertCircle,
  Plus,
  AlertTriangle,
  Printer,
  X,
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
  phone?: string | null;
  parentPhone?: string | null;
  parentName?: string | null;
  wali?: { id?: string; name?: string | null; phone?: string | null } | null;
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
  murid: Murid;
  program: Program;
  blockNumber: number;
  onSubmit: (data: {
    achievements: string[];
    masteredMaterials: string[];
    weakMaterials: string[];
    notes: string;
  }) => void;
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

function BulletPointInput({
  icon,
  label,
  values,
  onChange,
  placeholder,
  accentColor,
  minPoints = 1,
}: BulletPointInputProps) {
  const update = (index: number, value: string) => {
    const next = [...values];
    next[index] = value;
    onChange(next);
  };
  const add = () => onChange([...values, ""]);
  const remove = (index: number) => {
    if (values.length <= minPoints) return;
    onChange(values.filter((_, i) => i !== index));
  };
  return (
    <div
      className="flex flex-col gap-2 border-l-2 pl-4 transition-colors"
      style={{ borderColor: accentColor }}
    >
      <label className="text-xs font-bold text-[#14233a] flex items-center gap-1.5">
        {icon}
        <span>{label}</span>
      </label>
      <div className="flex flex-col gap-2">
        {values.map((val, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="shrink-0 w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center border"
              style={{
                backgroundColor: `${accentColor}15`,
                borderColor: `${accentColor}40`,
                color: accentColor,
              }}
            >
              {index + 1}
            </span>
            <input
              type="text"
              value={val}
              onChange={(e) => update(index, e.target.value)}
              placeholder={index === 0 ? placeholder : "Poin tambahan..."}
              className="flex-1 rounded-xl border border-[#E5DDD0] bg-white px-4 py-2 text-xs sm:text-sm focus:border-[#4a70a9] outline-none text-[#14233a] placeholder:text-[#535761]"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={values.length <= minPoints}
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#535761] hover:text-[#b91c1c] hover:bg-[#fef2f2] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="self-start mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F7F4EF] hover:bg-[#EAF0F8] border border-[#E5DDD0]"
        style={{ color: accentColor }}
      >
        <Plus size={14} /> Tambah Poin
      </button>
    </div>
  );
}

function LaporanPerkembanganForm({
  murid,
  program,
  blockNumber,
  onSubmit,
  onCancel,
}: FormProps) {
  const [achievements, setAchievements] = useState<string[]>([""]);
  const [masteredMaterials, setMasteredMaterials] = useState<string[]>([""]);
  const [weakMaterials, setWeakMaterials] = useState<string[]>([""]);
  const [notes, setNotes] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAchievements = achievements.map((a) => a.trim()).filter(Boolean);
    const cleanMastered = masteredMaterials.map((m) => m.trim()).filter(Boolean);
    const cleanWeak = weakMaterials.map((w) => w.trim()).filter(Boolean);
    if (cleanAchievements.length === 0) {
      setValidationError("Harap isi minimal 1 poin Capaian & Perkembangan Siswa.");
      return;
    }
    if (cleanMastered.length === 0) {
      setValidationError("Harap isi minimal 1 poin Materi yang Sudah Dikuasai.");
      return;
    }
    if (cleanWeak.length === 0) {
      setValidationError("Harap isi minimal 1 poin Materi yang Masih Perlu Pengulangan.");
      return;
    }
    setValidationError(null);
    onSubmit({
      achievements: cleanAchievements,
      masteredMaterials: cleanMastered,
      weakMaterials: cleanWeak,
      notes,
    });
  };
  return (
    <div className="flex flex-col gap-5 animate-[fadeIn_0.3s_ease-out]">
      <header className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 text-xs font-bold text-[#14233a] bg-white hover:bg-[#EAF0F8] border border-[#E5DDD0] px-3.5 py-1.5 rounded-full w-fit shadow-xs self-start"
        >
          <ArrowLeft size={14} /> Kembali
        </button>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#14233a] tracking-tight mt-1">
          Buat Rapor Perkembangan Blok
        </h1>
        <p className="text-xs sm:text-sm text-[#535761]">
          Tulis evaluasi berkala capaian belajar siswa untuk dibaca di Portal Siswa.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-5 border border-[#E5DDD0] shadow-xs">
            <h2 className="text-xs font-bold text-[#535761] mb-4 border-b border-[#E5DDD0] pb-2">
              Konteks Siswa
            </h2>
            <div className="flex flex-col gap-3.5 text-xs sm:text-sm">
              <div>
                <span className="text-xs font-bold text-[#535761] block mb-0.5">Siswa</span>
                <span className="font-bold text-[#14233a] text-base block">{murid.name}</span>
                <span className="text-xs text-[#535761] block">
                  {murid.schoolLevel} • {murid.age} Tahun
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-[#535761] block mb-0.5">Program</span>
                <span className="font-semibold text-[#14233a] flex items-center gap-1.5 mt-0.5">
                  <BookOpen size={15} className="text-[#2e4b7a]" />
                  {program.name}
                </span>
                <span className="text-xs text-[#535761] block mt-0.5">
                  ({program.sessionsPerBlock} Sesi/Blok)
                </span>
              </div>
              <div className="pt-3 border-t border-[#E5DDD0]">
                <span className="text-xs font-bold text-[#535761] block mb-1">
                  Periode Evaluasi
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAF0F8] border border-[#B8CDE4] text-[#224477] text-xs font-bold rounded-lg">
                  Blok {blockNumber}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#E5DDD0] shadow-xs">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {validationError && (
                <div className="p-3.5 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-xs font-semibold flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}
              <BulletPointInput
                icon={<Award size={16} className="text-[#2e4b7a]" />}
                label="Capaian & Perkembangan Siswa"
                values={achievements}
                onChange={setAchievements}
                placeholder="Contoh: Pengenalan huruf Hijaiyah tuntas..."
                accentColor="#2e4b7a"
              />
              <BulletPointInput
                icon={<CheckCircle2 size={16} className="text-[#15803d]" />}
                label="Materi yang Sudah Dikuasai"
                values={masteredMaterials}
                onChange={setMasteredMaterials}
                placeholder="Contoh: Pengenalan seluruh huruf hijaiyah tunggal berharakat fathah..."
                accentColor="#15803d"
              />
              <BulletPointInput
                icon={<AlertTriangle size={16} className="text-[#92400e]" />}
                label="Materi yang Masih Perlu Pengulangan / Latihan"
                values={weakMaterials}
                onChange={setWeakMaterials}
                placeholder="Contoh: Pelafalan huruf tebal seperti Shod, Dhod..."
                accentColor="#92400e"
              />
              <div className="flex flex-col gap-1.5 border-l-2 border-[#E5DDD0] pl-4">
                <label className="text-xs font-bold text-[#14233a]">
                  Catatan &amp; Rekomendasi Tentor
                </label>
                <textarea
                  placeholder="Contoh: Disarankan latihan 5-10 menit setiap sore..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="rounded-xl border border-[#E5DDD0] bg-white px-4 py-2.5 text-xs sm:text-sm focus:border-[#4a70a9] outline-none resize-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E5DDD0]">
                <Button type="button" variant="ghost" onClick={onCancel} className="text-xs py-2 px-4">
                  Batal
                </Button>
                <Button type="submit" variant="primary" className="text-xs py-2 px-5">
                  Terbitkan Rapor Perkembangan
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

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

interface SessionWithRelations extends Session {
  murid?: DbMurid | null;
  program?: Program | null;
}

interface ProgressReportWithRelations {
  id: string;
  muridId: string;
  programId: string;
  blockNumber: number;
  achievements: string[];
  masteredMaterials: string[];
  weakMaterials: string[];
  notes?: string | null;
  program?: Program | null;
  murid?: DbMurid | null;
  createdAt: string;
}

interface ProgressReportView extends ProgressReportForTentorDetailed {
  waPhone: string;
}

export default function LaporanPerkembanganClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const muridId = searchParams.get("muridId");
  const programId = searchParams.get("programId");
  const block = searchParams.get("block");

  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<ProgressReportView[]>([]);
  const [murids, setMurids] = useState<Murid[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [sessions, setSessions] = useState<SessionWithRelations[]>([]);
  const [selectedMuridId, setSelectedMuridId] = useState<string>("all");
  const [selectedProgressBlock, setSelectedProgressBlock] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [tentorName, setTentorName] = useState("Tentor");

  const refreshData = async () => {
    try {
      interface EnrollmentWithMurid {
        id: string;
        muridId: string;
        murid?: DbMurid | null;
      }
      const [reportsRes, sessionsRes, enrollmentsRes, profileRes] = await Promise.all([
        apiFetch<{ reports: ProgressReportWithRelations[] }>("/api/me/progress-reports"),
        apiFetch<{ sessions: SessionWithRelations[] }>("/api/me/sessions"),
        apiFetch<{ enrollments: EnrollmentWithMurid[] }>(
          "/api/me/enrollments",
        ).catch((): { enrollments: EnrollmentWithMurid[] } => ({ enrollments: [] })),
        apiFetch<{ user: { name: string } }>(
          "/api/users/me",
        ).catch(() => ({ user: { name: "Tentor" } })),
      ]);
      if (profileRes?.user?.name) setTentorName(profileRes.user.name);

      const mappedReports = reportsRes.reports.map((r): ProgressReportView => ({
        id: r.id,
        muridId: r.muridId,
        programId: r.programId,
        blockNumber: r.blockNumber,
        achievements: r.achievements,
        masteredMaterials: r.masteredMaterials,
        weakMaterials: r.weakMaterials,
        notes: r.notes || "",
        programName: r.program?.name || "Program Bimbingan",
        muridName: r.murid?.name || "Siswa",
        muridAge: r.murid?.birthDate
          ? calculateAge(new Date(r.murid.birthDate).toISOString())
          : 7,
        sessionsPerBlock: r.program?.sessionsPerBlock || 12,
        waPhone: resolveStudentPhone(r.murid),
      }));
      setReports(mappedReports);
      setSessions(sessionsRes.sessions);

      const uniqueMuridsMap = new Map<string, Murid>();
      const enrList: EnrollmentWithMurid[] = enrollmentsRes.enrollments || [];
      enrList.forEach((enr) => {
        const m = enr.murid;
        if (m && !uniqueMuridsMap.has(m.id)) {
          uniqueMuridsMap.set(m.id, {
            id: m.id,
            waliId: m.waliId,
            name: m.name,
            age: m.birthDate ? calculateAge(new Date(m.birthDate).toISOString()) : 7,
            schoolLevel: m.schoolLevel || "SD",
            avatarUrl: m.avatarUrl || "",
            phone: m.phone || m.wali?.phone || null,
            parentPhone: m.parentPhone || m.wali?.phone || null,
          });
        }
      });
      sessionsRes.sessions.forEach((s) => {
        if (s.murid && !uniqueMuridsMap.has(s.murid.id)) {
          const m = s.murid;
          uniqueMuridsMap.set(m.id, {
            id: m.id,
            waliId: m.waliId,
            name: m.name,
            age: m.birthDate ? calculateAge(new Date(m.birthDate).toISOString()) : 7,
            schoolLevel: m.schoolLevel || "SD",
            avatarUrl: m.avatarUrl || "",
            phone: m.phone || m.wali?.phone || null,
            parentPhone: m.parentPhone || m.wali?.phone || null,
          });
        }
      });
      setMurids(Array.from(uniqueMuridsMap.values()));

      const uniqueProgramsMap = new Map<string, Program>();
      sessionsRes.sessions.forEach((s) => {
        if (s.program && !uniqueProgramsMap.has(s.program.id)) {
          uniqueProgramsMap.set(s.program.id, s.program);
        }
      });
      setPrograms(Array.from(uniqueProgramsMap.values()));
    } catch (err) {
      console.error("Error refreshing progress reports:", err);
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

  const filteredReports =
    selectedMuridId === "all" ? reports : reports.filter((r) => r.muridId === selectedMuridId);
  const selectedMurid = murids.find((m) => m.id === selectedMuridId);
  const muridProgressReports = reports.filter((r) => r.muridId === selectedMuridId);
  const chronologicalProgressReports = [...muridProgressReports].reverse();
  const totalProgressBlocks = chronologicalProgressReports.length;
  const printProgressReport =
    totalProgressBlocks > 0
      ? chronologicalProgressReports[selectedProgressBlock - 1]
      : null;

  const activeMurid = muridId ? murids.find((m) => m.id === muridId) : null;
  const activeProgram = programId ? programs.find((p) => p.id === programId) : null;
  const activeBlock = block ? parseInt(block, 10) : 1;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };
  const handleCloseForm = () => {
    router.push("/app/tentor/laporan-perkembangan");
  };
  const handleFormSubmit = async (data: {
    achievements: string[];
    masteredMaterials: string[];
    weakMaterials: string[];
    notes: string;
  }) => {
    if (!activeMurid || !activeProgram) return;
    try {
      await apiFetch("/api/progress-reports", {
        method: "POST",
        body: JSON.stringify({
          muridId: activeMurid.id,
          programId: activeProgram.id,
          blockNumber: activeBlock,
          achievements: data.achievements,
          masteredMaterials: data.masteredMaterials,
          weakMaterials: data.weakMaterials,
          notes: data.notes,
        }),
      });
      triggerToast("Rapor perkembangan berhasil diterbitkan di Portal Siswa!");
      await refreshData();
    } catch (err) {
      console.error("Error submitting progress report:", err);
      const errMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      triggerToast("Gagal menerbitkan rapor: " + errMsg);
    }
    handleCloseForm();
  };

  const handlePrint = () => {
    if (selectedMuridId === "all" || !printProgressReport) {
      triggerToast("Pilih siswa & rapor dulu untuk cetak");
      return;
    }
    if (typeof document !== "undefined") {
      document.title = `Rapor-Perkembangan-${selectedMurid?.name || "Siswa"}-Blok-${printProgressReport.blockNumber}`;
    }
    window.print();
  };

  const buildWaProgressUrl = (rep: ProgressReportView) => {
    const text = encodeURIComponent(
      `Halo *${rep.muridName}* (atau Bapak/Ibu Orang Tua), Rapor Perkembangan *Blok ${rep.blockNumber}* (${rep.sessionsPerBlock} Sesi) untuk program *${rep.programName}* telah diterbitkan di Portal Siswa nCourse.\n\n*Capaian Utama:* ${rep.achievements[0] || "-"}\n*Catatan Tentor:* "${rep.notes || "-"}"\n\nSilakan buka aplikasi nCourse untuk membaca rapor lengkap atau mengunduh PDF. Terima kasih!`
    );
    return `https://wa.me/${rep.waPhone}?text=${text}`;
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto w-full flex-grow flex flex-col justify-center items-center gap-3 min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-3 border-[#4a70a9]/20 border-t-[#4a70a9] animate-spin" />
        <div className="text-xs font-semibold text-[#535761]">Memuat rapor perkembangan...</div>
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
        {(!activeMurid || !activeProgram) && (
          <header className="rounded-2xl bg-white border border-[#E5DDD0] shadow-xs p-4 sm:p-5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#14233a] tracking-tight">
              Rapor Perkembangan
            </h1>
            <p className="text-xs sm:text-sm text-[#535761] leading-relaxed mt-1">
              Evaluasi berkala per blok di Portal Siswa • Dilengkapi tombol Kabari via WhatsApp
            </p>
          </header>
        )}

        {activeMurid && activeProgram ? (
          <LaporanPerkembanganForm
            murid={activeMurid}
            program={activeProgram}
            blockNumber={activeBlock}
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
                        setSelectedProgressBlock(1);
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
                          setSelectedProgressBlock(1);
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
                  {selectedMuridId !== "all" && totalProgressBlocks > 0 && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs bg-[#F7F4EF] border border-[#E5DDD0] rounded-xl px-3 py-2 flex-1 sm:flex-auto justify-between">
                        <span className="text-[#535761] font-bold text-[11px]">Rapor</span>
                        <select
                          value={selectedProgressBlock}
                          onChange={(e) => setSelectedProgressBlock(Number(e.target.value))}
                          className="bg-transparent font-semibold text-[#14233a] outline-none cursor-pointer ml-2 text-xs"
                        >
                          {Array.from({ length: totalProgressBlocks }).map((_, i) => {
                            const blockNum = i + 1;
                            const rep = chronologicalProgressReports[i];
                            return (
                              <option key={blockNum} value={blockNum} className="text-[#14233a]">
                                Blok {rep.blockNumber}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#EAF0F8] hover:bg-[#D5E3FF] text-[#224477] border border-[#B8CDE4] font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <Printer size={15} /> Cetak PDF
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const targetMurid =
                        murids.find((m) => m.id === selectedMuridId) || murids[0];
                      if (!targetMurid) {
                        triggerToast("Belum ada data siswa tersedia.");
                        return;
                      }
                      const firstProgramId = sessions.find(
                        (s) => s.muridId === targetMurid.id,
                      )?.programId;
                      const targetProgram = firstProgramId
                        ? programs.find((p) => p.id === firstProgramId)
                        : programs[0];
                      if (!targetProgram) {
                        triggerToast("Belum ada data program tersedia.");
                        return;
                      }
                      router.push(
                        `/app/tentor/laporan-perkembangan?muridId=${targetMurid.id}&programId=${targetProgram.id}&block=1`,
                      );
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#2e4b7a] text-white hover:bg-[#22395e] font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                  >
                    <Plus size={15} /> Buat Rapor
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <article
                    key={report.id}
                    className="bg-white rounded-2xl p-5 border border-[#E5DDD0] shadow-xs flex flex-col gap-4"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-2 border-b border-[#E5DDD0] pb-3">
                      <div>
                        <h2 className="font-extrabold text-[#14233a] text-sm sm:text-base flex items-center gap-2">
                          <span>{report.muridName}</span>
                          <span className="text-[11px] font-semibold text-[#535761] bg-[#F7F4EF] px-2.5 py-0.5 rounded-full border border-[#E5DDD0]">
                            {report.muridAge} Tahun
                          </span>
                        </h2>
                        <p className="text-xs text-[#535761] mt-1">{report.programName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAF0F8] border border-[#B8CDE4] text-[#224477] text-xs font-bold rounded-lg shrink-0">
                          Blok {report.blockNumber} ({report.sessionsPerBlock} Sesi)
                        </span>
                        <a
                          href={buildWaProgressUrl(report)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold transition-colors"
                        >
                          <MessageCircle size={13} />
                          <span>Kabari via WA</span>
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-[#14233a] flex items-center gap-1.5">
                          <Award size={15} className="text-[#2e4b7a]" /> Pencapaian Utama
                        </h3>
                        <ul className="list-disc list-inside text-[#434750] space-y-1 pl-1">
                          {report.achievements.map((ach, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {ach}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1 border-l-2 border-[#15803d] pl-3">
                          <h3 className="font-bold text-xs text-[#15803d]">Materi Dikuasai</h3>
                          <ul className="list-disc list-inside text-[#434750] space-y-0.5 mt-0.5">
                            {report.masteredMaterials.map((item, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-col gap-1 border-l-2 border-[#92400e] pl-3">
                          <h3 className="font-bold text-xs text-[#92400e]">Butuh Pengulangan</h3>
                          <ul className="list-disc list-inside text-[#434750] space-y-0.5 mt-0.5">
                            {report.weakMaterials.map((item, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-[#E5DDD0] pt-3 mt-1">
                      <span className="text-xs font-bold text-[#535761] block mb-1">
                        Catatan &amp; Rekomendasi Tentor
                      </span>
                      <p className="text-xs italic text-[#434750] leading-relaxed">
                        &quot;{report.notes}&quot;
                      </p>
                    </div>
                  </article>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-white border border-[#E5DDD0] rounded-2xl text-center gap-3">
                  <AlertCircle className="text-[#2e4b7a]" size={32} />
                  <div>
                    <h2 className="font-bold text-[#14233a] text-sm">
                      Belum Ada Rapor Perkembangan
                    </h2>
                    <p className="text-xs text-[#535761] mt-1 max-w-sm">
                      Buat rapor setelah siswa menyelesaikan satu blok pertemuan.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {selectedMuridId !== "all" && totalProgressBlocks > 0 && (
              <div className="md:hidden sticky bottom-[72px] z-20">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full h-11 rounded-xl bg-[#14233a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
                >
                  <Printer size={16} /> Cetak Rapor Blok {printProgressReport?.blockNumber || ""}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedMuridId !== "all" && selectedMurid && printProgressReport && (
        <div className="hidden print:block bg-white text-black p-0 font-sans w-full min-h-screen text-[11px]">
          <style>{`@media print { @page { size: A4; margin: 12mm 10mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .print-avoid-break { break-inside: avoid; } table { border-collapse: collapse; } }`}</style>
          <div className="text-center flex flex-col items-center mb-5 pb-4 border-b-2 border-black">
            <h1 className="text-[20px] font-black tracking-[0.12em] uppercase">NCOURSE</h1>
            <p className="text-[11px] font-semibold text-gray-800 tracking-wide mt-0.5">
              Rapor Evaluasi Perkembangan Belajar Siswa
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
                    <td className="py-0.5">: {printProgressReport.programName}</td>
                  </tr>
                  <tr>
                    <td className="font-bold py-0.5">Rapor Blok</td>
                    <td className="py-0.5">
                      : Blok {printProgressReport.blockNumber} ({printProgressReport.sessionsPerBlock} Sesi)
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold py-0.5">Tentor</td>
                    <td className="py-0.5">: {tentorName}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h2 className="text-[11px] font-black uppercase tracking-wider mb-2">
            Ringkasan Pencapaian Blok {printProgressReport.blockNumber}
          </h2>
          <table className="w-full border border-black text-[10px] mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black px-2 py-2 w-[32px] text-center">No</th>
                <th className="border border-black px-2 py-2 text-left">Pencapaian Utama</th>
              </tr>
            </thead>
            <tbody>
              {printProgressReport.achievements.map((ach, idx) => (
                <tr key={idx} className="print-avoid-break">
                  <td className="border border-black px-2 py-1.5 text-center align-top">
                    {idx + 1}
                  </td>
                  <td className="border border-black px-2 py-1.5 align-top">{ach}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-wider mb-2">
                Materi Dikuasai
              </h3>
              <table className="w-full border border-black text-[9.5px]">
                <thead>
                  <tr className="bg-emerald-50">
                    <th className="border border-black px-2 py-1.5 w-[28px]">No</th>
                    <th className="border border-black px-2 py-1.5 text-left">Materi</th>
                  </tr>
                </thead>
                <tbody>
                  {printProgressReport.masteredMaterials.map((m, i) => (
                    <tr key={i} className="print-avoid-break">
                      <td className="border border-black px-2 py-1.5 text-center">{i + 1}</td>
                      <td className="border border-black px-2 py-1.5">{m}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-wider mb-2">
                Butuh Pengulangan
              </h3>
              <table className="w-full border border-black text-[9.5px]">
                <thead>
                  <tr className="bg-amber-50">
                    <th className="border border-black px-2 py-1.5 w-[28px]">No</th>
                    <th className="border border-black px-2 py-1.5 text-left">Materi</th>
                  </tr>
                </thead>
                <tbody>
                  {printProgressReport.weakMaterials.map((m, i) => (
                    <tr key={i} className="print-avoid-break">
                      <td className="border border-black px-2 py-1.5 text-center">{i + 1}</td>
                      <td className="border border-black px-2 py-1.5">{m}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border border-black p-3 rounded-[8px] mb-8">
            <p className="font-black text-[10px] uppercase tracking-wider mb-1">
              Catatan &amp; Rekomendasi Tentor
            </p>
            <p className="text-[10px] leading-relaxed italic">
              &quot;{printProgressReport.notes}&quot;
            </p>
          </div>

          <div className="flex justify-between items-start pt-4 text-[10px] mt-10">
            <div className="text-center w-[160px] flex flex-col gap-14">
              <span>Siswa / Orang Tua Pendamping</span>
              <div className="border-b border-black w-full"></div>
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
