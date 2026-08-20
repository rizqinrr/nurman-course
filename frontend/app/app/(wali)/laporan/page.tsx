/* Hallmark · genre: playful-glassmorphism · design-system: design.md · designed-as-app */
"use client";

import { useState, useEffect } from "react";
import { 
  DailyReportDetailed,
  ProgressReportDetailed,
  DailyReport,
  ProgressReport,
  Program
} from "@/data/lms";
import { apiFetch } from "@/lib/api";
import { formatSessionDateTime } from "@/lib/format";
import GlassCard from "@/components/ui/GlassCard";
import { 
  FileText, 
  Calendar, 
  Clock, 
  BookOpen, 
  ClipboardList,
  Award,
  CheckCircle2,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

interface DbMurid {
  id: string;
  name: string;
}

const WhatsAppIcon = ({ size = 18, className }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

interface DbDailyReport extends DailyReport {
  session?: {
    program?: Program;
    tentor?: { name: string; phone?: string | null };
  };
}

interface DbProgressReport extends ProgressReport {
  program?: Program;
  tentor?: { id: string; name: string; phone?: string | null } | null;
}

export default function LaporanPage() {
  const [loading, setLoading] = useState(true);
  const [murids, setMurids] = useState<DbMurid[]>([]);
  const [selectedMuridId, setSelectedMuridId] = useState("");
  const [activeTab, setActiveTab] = useState<"harian" | "perkembangan">("harian");

  const [dailyReports, setDailyReports] = useState<DbDailyReport[]>([]);
  const [progressReports, setProgressReports] = useState<DbProgressReport[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        // Live mode
        const meRes = await apiFetch<{ user: { name: string; murids: DbMurid[] } }>("/api/users/me");
        setMurids(meRes.user.murids || []);
        if (meRes.user.murids?.length > 0) {
          setSelectedMuridId(meRes.user.murids[0].id);
        }

        const [dailyRes, progressRes] = await Promise.all([
          apiFetch<{ reports: DbDailyReport[] }>("/api/me/daily-reports"),
          apiFetch<{ reports: DbProgressReport[] }>("/api/me/progress-reports")
        ]);

        setDailyReports(dailyRes.reports);
        setProgressReports(progressRes.reports);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load reports:", err);
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
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full flex-grow flex flex-col gap-6 items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#4a70a9] animate-spin"></div>
        <p className="text-sm font-semibold text-gray-600">Memuat laporan belajar...</p>
      </div>
    );
  }

  const selectedMurid = murids.find((m) => m.id === selectedMuridId);

  // Filter & format daily reports
  const getFilteredDailyReports = (): DailyReportDetailed[] => {
    const filtered = dailyReports.filter(r => r.muridId === selectedMuridId);
    return filtered.map(r => ({
      ...r,
      date: formatSessionDateTime(r.date).split(" • ")[0],
      programName: r.session?.program?.name || "Program General",
      tentorName: r.session?.tentor?.name || "Kak Kiki"
    }));
  };

  // Filter & format progress reports
  const getFilteredProgressReports = (): ProgressReportDetailed[] => {
    const filtered = progressReports.filter(r => r.muridId === selectedMuridId);
    return filtered.map(r => ({
      ...r,
      programName: r.program?.name || "Program General",
      sessionsPerBlock: r.program?.sessionsPerBlock || 12
    }));
  };

  const filteredDailyReports = getFilteredDailyReports();
  const filteredProgressReports = getFilteredProgressReports();

  const handleContactTutorWA = (report: DailyReportDetailed) => {
    if (!selectedMurid) return;
    const text = encodeURIComponent(
      `Halo ${report.tentorName}, saya wali murid dari *${selectedMurid.name}*. Ingin bertanya mengenai laporan harian tanggal *${report.date}* materi *${report.activity}*. Terima kasih.`
    );
    const phone = (report as any).session?.tentor?.phone || WHATSAPP_NUMBER;
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  const handleContactAdminProgressWA = (report: ProgressReportDetailed) => {
    if (!selectedMurid) return;
    const mentor = (report as any).tentor;
    const text = encodeURIComponent(
      `Halo ${mentor?.name || "Admin Nurman Course"}, saya wali murid dari *${selectedMurid.name}*. Ingin berkonsultasi mengenai laporan perkembangan blok *${report.blockNumber}* untuk program *${report.programName}*. Terima kasih.`
    );
    const phone = mentor?.phone || WHATSAPP_NUMBER;
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full flex-grow flex flex-col gap-6 pb-28 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Page Header */}
      <header className="flex flex-col gap-1 bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight font-sans">
          Laporan Belajar
        </h1>
        <p className="text-sm text-gray-600">
          Pantau ringkasan kegiatan harian dan laporan capaian perkembangan belajar anak
        </p>
      </header>

      {/* Child selector */}
      {murids.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto py-1 bg-white/30 backdrop-blur-xl border border-white/60 p-4 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold text-gray-500 shrink-0">Siswa:</span>
          <div className="flex gap-2">
            {murids.map((m) => {
              const isSelected = m.id === selectedMuridId;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMuridId(m.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 active:scale-95 whitespace-nowrap border flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#4a70a9] text-white border-[#4a70a9] shadow-md shadow-[#4a70a9]/30"
                      : "bg-white/50 border-white/70 text-gray-600 hover:bg-white/85"
                  }`}
                >
                  {m.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Toggle Tabs (Harian vs Perkembangan) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Harian Tab */}
        <button
          onClick={() => setActiveTab("harian")}
          className={`flex flex-col gap-1 p-3 sm:p-4 rounded-2xl border text-left transition-colors duration-200 active:scale-[0.98] min-h-[72px] ${
            activeTab === "harian"
              ? "bg-[#4a70a9] text-white border-[#4a70a9] shadow-lg shadow-[#4a70a9]/20"
              : "bg-white/40 border-white/60 text-gray-700 hover:bg-white/60"
          }`}
        >
          <div className="flex items-center gap-2">
            <ClipboardList size={18} className={activeTab === "harian" ? "text-white" : "text-[#4a70a9]"} />
            <span className="font-bold text-sm sm:text-base">Laporan Harian</span>
          </div>
          <span className={`text-[10px] sm:text-xs leading-relaxed hidden sm:block ${activeTab === "harian" ? "text-indigo-100" : "text-gray-500"}`}>
            Per sesi pertemuan • Diperbarui tiap sesi selesai dilaksanakan
          </span>
        </button>

        {/* Perkembangan Tab */}
        <button
          onClick={() => setActiveTab("perkembangan")}
          className={`flex flex-col gap-1 p-3 sm:p-4 rounded-2xl border text-left transition-colors duration-200 active:scale-[0.98] min-h-[72px] ${
            activeTab === "perkembangan"
              ? "bg-[#4a70a9] text-white border-[#4a70a9] shadow-lg shadow-[#4a70a9]/20"
              : "bg-white/40 border-white/60 text-gray-700 hover:bg-white/60"
          }`}
        >
          <div className="flex items-center gap-2">
            <Award size={18} className={activeTab === "perkembangan" ? "text-white" : "text-[#4a70a9]"} />
            <span className="font-bold text-sm sm:text-base">Laporan Perkembangan</span>
          </div>
          <span className={`text-[10px] sm:text-xs leading-relaxed hidden sm:block ${activeTab === "perkembangan" ? "text-indigo-100" : "text-gray-500"}`}>
            Per blok pertemuan • Diperbarui tiap akhir siklus (10x / 12x sesi)
          </span>
        </button>
      </div>



      {/* Reports List */}
      {selectedMurid ? (
        <section className="flex flex-col gap-4">
          {activeTab === "harian" ? (
            <>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200/50 pb-2">
                <ClipboardList size={20} className="text-[#4a70a9]" />
                <span>Daftar Laporan Harian</span>
              </h3>

              {filteredDailyReports.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {filteredDailyReports.map((report) => (
                    <GlassCard key={report.id} className="p-6 flex flex-col gap-4">
                      {/* Top Badge & Date Time */}
                      <div className="flex flex-wrap justify-between items-start gap-2 border-b border-gray-200/50 pb-3">
                        <div className="flex flex-col gap-1">
                          <span className="self-start px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-[#4a70a9] rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {report.programName}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                            <Calendar size={14} className="text-gray-400" />
                            <span className="font-semibold text-gray-700">{report.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 bg-white/40 border border-white/60 px-3 py-1 rounded-lg">
                          <Clock size={14} className="text-[#4a70a9]" />
                          <span>{report.startTime} - {report.endTime} WIB</span>
                        </div>
                      </div>

                      {/* Material Taught */}
                      <div className="flex flex-col gap-1.5 text-left">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1">
                          <BookOpen size={12} />
                          Materi / Kegiatan yang Diajarkan
                        </span>
                        <p className="text-sm sm:text-base font-bold text-gray-800 leading-snug">
                          {report.activity}
                        </p>
                      </div>

                      {/* Tutor Info */}
                      <div className="flex items-center gap-2.5 py-1 self-start">
                        <div className="w-8 h-8 rounded-full bg-[#4a70a9]/10 border border-[#4a70a9]/20 flex items-center justify-center text-sm font-bold text-[#4a70a9]">
                          {report.tentorName.charAt(0)}
                        </div>
                        <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-gray-800">{report.tentorName}</span>
                        <span className="text-[10px] text-gray-500 font-medium">Tentor</span>
                        </div>
                      </div>

                      {/* Notes box */}
                      <div className="mt-2 border-l-2 border-[#4a70a9]/30 pl-4 py-1 flex flex-col gap-1 text-left">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                          <FileText size={12} className="text-gray-400" />
                          Catatan Perkembangan Sesi Ini
                        </span>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                          {report.notes || "Tidak ada catatan sesi."}
                        </p>
                      </div>

                      {/* Contact WA */}
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => handleContactTutorWA(report)}
                          title="Diskusi via WhatsApp"
                          aria-label="Diskusi via WhatsApp"
                          className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#1fb858] text-white flex items-center justify-center shadow-sm active:scale-95 transition-all"
                        >
                          <WhatsAppIcon size={18} />
                        </button>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-white/40 border border-white/60 rounded-2xl text-gray-600">
                  <ClipboardList size={32} className="text-[#4a70a9] shrink-0" />
                  <div className="flex-grow text-left">
                    <p className="font-bold text-sm">Belum Ada Laporan Harian</p>
                    <p className="text-xs text-gray-500 mt-0.5">Laporan harian akan terbit setelah sesi belajar diselesaikan.</p>
                  </div>
                  <a 
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Halo Admin Nurman Course, saya wali murid dari ${selectedMurid.name}. Ingin menanyakan perihal update laporan belajar anak saya. Terima kasih.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Hubungi Admin via WhatsApp"
                    aria-label="Hubungi Admin via WhatsApp"
                    className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#1fb858] text-white flex items-center justify-center shadow-sm active:scale-95 transition-all shrink-0 mt-2 sm:mt-0"
                  >
                    <WhatsAppIcon size={18} />
                  </a>
                </div>
              )}
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200/50 pb-2">
                <Award size={20} className="text-[#4a70a9]" />
                <span>Daftar Laporan Perkembangan</span>
              </h3>

              {filteredProgressReports.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {filteredProgressReports.map((report) => (
                    <GlassCard key={report.id} className="p-6 flex flex-col gap-4">
                      {/* Header */}
                      <div className="flex flex-wrap justify-between items-start gap-2 border-b border-gray-200/50 pb-3">
                        <div className="flex flex-col gap-1">
                          <span className="self-start px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-[#4a70a9] rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {report.programName}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                            <Award size={14} className="text-emerald-500" />
                            <span className="font-bold text-gray-700">Laporan Perkembangan Blok {report.blockNumber}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg">
                          <span>Siklus: {report.sessionsPerBlock} Sesi Selesai</span>
                        </div>
                      </div>

                      {/* Achievements */}
                      <div className="flex flex-col gap-2 text-left">
                        <span className="text-[10px] font-bold text-[#4a70a9] uppercase tracking-wide flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          Capaian Hasil Belajar
                        </span>
                        <ul className="space-y-1.5">
                          {report.achievements.map((ach, idx) => (
                            <li key={idx} className="text-xs sm:text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-emerald-500 text-base leading-none select-none">•</span>
                              <span>{ach}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                       {/* Mastered & Weak Materials */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                         {/* Mastered */}
                         <div className="border-l-2 border-emerald-500/40 pl-4 py-1 flex flex-col gap-1 text-left">
                           <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide flex items-center gap-1">
                             <TrendingUp size={12} />
                             Materi yang Dikuasai
                           </span>
                           <ul className="space-y-1">
                             {report.masteredMaterials.map((item, idx) => (
                               <li key={idx} className="text-xs sm:text-sm text-gray-700 flex items-start gap-2">
                                 <span className="text-emerald-500 text-base leading-none select-none">•</span>
                                 <span>{item}</span>
                               </li>
                             ))}
                           </ul>
                         </div>

                         {/* Weak */}
                         <div className="border-l-2 border-amber-500/40 pl-4 py-1 flex flex-col gap-1 text-left">
                           <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide flex items-center gap-1">
                             <AlertTriangle size={12} />
                             Perlu Latihan Tambahan
                           </span>
                           <ul className="space-y-1">
                             {report.weakMaterials.map((item, idx) => (
                               <li key={idx} className="text-xs sm:text-sm text-gray-700 flex items-start gap-2">
                                 <span className="text-amber-500 text-base leading-none select-none">•</span>
                                 <span>{item}</span>
                               </li>
                             ))}
                           </ul>
                         </div>
                       </div>

                      {/* Notes/Saran box */}
                      <div className="border-l-2 border-gray-400/40 pl-4 py-1 flex flex-col gap-1 text-left">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1 border-b border-gray-200/50 pb-1">
                          <FileText size={12} className="text-gray-400" />
                      Catatan & Saran Tentor
                        </span>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                          {report.notes || "Tidak ada saran khusus."}
                        </p>
                      </div>

                      {/* Contact Admin */}
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => handleContactAdminProgressWA(report)}
                          title="Konsultasi Perkembangan Anak"
                          aria-label="Konsultasi Perkembangan Anak"
                          className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#1fb858] text-white flex items-center justify-center shadow-sm active:scale-95 transition-all"
                        >
                          <WhatsAppIcon size={18} />
                        </button>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-white/40 border border-white/60 rounded-2xl text-gray-600">
                  <Award size={32} className="text-[#4a70a9] shrink-0" />
                  <div className="flex-grow text-left">
                    <p className="font-bold text-sm">Belum Ada Laporan Perkembangan</p>
                    <p className="text-xs text-gray-400 mt-1.5 max-w-md leading-relaxed">
                      Laporan dikeluarkan secara berkala setiap akhir 1 blok pertemuan (10 atau 12 sesi belajar).
                    </p>
                  </div>
                  <a 
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Halo Admin Nurman Course, saya wali murid dari ${selectedMurid.name}. Ingin menanyakan perihal laporan perkembangan belajar berkala anak saya. Terima kasih.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Hubungi Admin via WhatsApp"
                    aria-label="Hubungi Admin via WhatsApp"
                    className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#1fb858] text-white flex items-center justify-center shadow-sm active:scale-95 transition-all shrink-0 mt-2 sm:mt-0"
                  >
                    <WhatsAppIcon size={18} />
                  </a>
                </div>
              )}
            </>
          )}
        </section>
      ) : (
        <div className="text-center py-12 bg-white/40 border border-white/60 rounded-2xl text-gray-500">
          Tidak ada data anak ditemukan. Hubungi admin untuk mendaftarkan anak Anda.
        </div>
      )}

    </div>
  );
}
