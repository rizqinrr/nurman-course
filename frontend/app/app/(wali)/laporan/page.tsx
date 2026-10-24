/* Hallmark · genre: warm-editorial · design-system: google-stitch · designed-as-mobile-app */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DailyReportDetailed,
  ProgressReportDetailed,
  DailyReport,
  ProgressReport,
  Program
} from "@/data/lms";
import { apiFetch } from "@/lib/api";
import { formatSessionDateTime } from "@/lib/format";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import {
  ArrowLeft,
  Bell,
  SlidersHorizontal,
  Calendar,
  Clock,
  ClipboardList,
  Award,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  MessageCircle,
  Quote,
  Check,
  Download,
  ChevronDown,
  Sparkles,
  Archive
} from "lucide-react";

interface DbMurid {
  id: string;
  name: string;
}

interface DbDailyReport extends DailyReport {
  session?: {
    program?: Program | null;
    tentor?: { name: string; phone?: string | null } | null;
  } | null;
}

interface DbProgressReport extends ProgressReport {
  program?: Program | null;
  tentor?: { id: string; name: string; phone?: string | null } | null;
}

type DailyReportView = DailyReportDetailed & Pick<DbDailyReport, "session">;
type ProgressReportView = ProgressReportDetailed & Pick<DbProgressReport, "tentor">;

export default function LaporanPage() {
  const [loading, setLoading] = useState(true);
  const [murids, setMurids] = useState<DbMurid[]>([]);
  const [selectedMuridId, setSelectedMuridId] = useState("");
  const [activeTab, setActiveTab] = useState<"harian" | "perkembangan">("harian");
  const [dailyDisplayLimit, setDailyDisplayLimit] = useState(3);

  const [dailyReports, setDailyReports] = useState<DbDailyReport[]>([]);
  const [progressReports, setProgressReports] = useState<DbProgressReport[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const meRes = await apiFetch<{ user: { name: string; murids: DbMurid[] } }>("/api/users/me");
        setMurids(meRes.user.murids || []);
        if (meRes.user.murids?.length > 0) {
          setSelectedMuridId(meRes.user.murids[0].id);
        }

        const [dailyRes, progressRes] = await Promise.all([
          apiFetch<{ reports: DbDailyReport[] }>("/api/me/daily-reports"),
          apiFetch<{ reports: DbProgressReport[] }>("/api/me/progress-reports"),
        ]);

        setDailyReports(dailyRes.reports || []);
        setProgressReports(progressRes.reports || []);
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
      <div className="p-6 w-full flex-grow flex flex-col gap-4 items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-3 border-[#4a70a9]/20 border-t-[#4a70a9] animate-spin"></div>
        <p className="text-xs font-semibold text-[#535761]">Memuat laporan belajar...</p>
      </div>
    );
  }

  const selectedMurid = murids.find((m) => m.id === selectedMuridId);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getFilteredDailyReports = (): DailyReportView[] => {
    const filtered = dailyReports.filter((r) => r.muridId === selectedMuridId);
    return filtered.map((r) => ({
      ...r,
      date: formatSessionDateTime(r.date).split(" • ")[0],
      programName: r.session?.program?.name || "Program Bimbingan",
      tentorName: r.session?.tentor?.name || "Tentor",
    }));
  };

  const getFilteredProgressReports = (): ProgressReportView[] => {
    const filtered = progressReports.filter((r) => r.muridId === selectedMuridId);
    return filtered.map((r) => ({
      ...r,
      programName: r.program?.name || "Program Bimbingan",
      sessionsPerBlock: r.program?.sessionsPerBlock || 12,
    }));
  };

  const filteredDailyReports = getFilteredDailyReports();
  const filteredProgressReports = getFilteredProgressReports();

  const handleContactTutorWA = (report: DailyReportView) => {
    if (!selectedMurid) return;
    const text = encodeURIComponent(
      `Halo ${report.tentorName}, saya dari akun siswa *${selectedMurid.name}*. Ingin bertanya mengenai laporan harian tanggal *${report.date}* materi *${report.activity}*. Terima kasih.`
    );
    const phone = report.session?.tentor?.phone || WHATSAPP_NUMBER;
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  const handleContactAdminProgressWA = (report: ProgressReportView) => {
    if (!selectedMurid) return;
    const mentor = report.tentor;
    const text = encodeURIComponent(
      `Halo ${mentor?.name || "Admin nCourse"}, saya dari akun siswa *${selectedMurid.name}*. Ingin berkonsultasi mengenai laporan perkembangan blok *${report.blockNumber}* untuk program *${report.programName}*. Terima kasih.`
    );
    const phone = mentor?.phone || WHATSAPP_NUMBER;
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  return (
    <div className="px-4 pt-2 pb-10 space-y-4 animate-[fadeIn_0.3s_ease-out] font-dm text-[#1a1a2e]">
      {/* 1. Top Bar Navigation */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center gap-3">
          <Link
            href="/app/dashboard"
            aria-label="Kembali ke Dashboard"
            className="w-9 h-9 rounded-full bg-white border border-[#e5ddd0] flex items-center justify-center text-[#1a1a2e] hover:bg-[#eaf0f8] hover:text-[#4a70a9] transition-colors shadow-xs active:scale-95"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold font-playfair text-[#1a1a2e] tracking-tight">
            Laporan Belajar
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Notifikasi"
            className="w-9 h-9 rounded-full bg-white border border-[#e5ddd0] flex items-center justify-center text-[#434750] hover:text-[#4a70a9] transition-colors shadow-xs active:scale-95"
          >
            <Bell size={17} />
          </button>
          <button
            type="button"
            aria-label="Filter"
            className="w-9 h-9 rounded-full bg-white border border-[#e5ddd0] flex items-center justify-center text-[#434750] hover:text-[#4a70a9] transition-colors shadow-xs active:scale-95"
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </header>

      {/* 2. Student Selector (if > 1) */}
      {murids.length > 1 && (
        <section aria-label="Pilih Profil Siswa" className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          {murids.map((m, idx) => {
            const isSelected = m.id === selectedMuridId;
            const avatarBg = idx === 0 ? "bg-[#4a70a9]" : "bg-[#8c7a5b]";

            return (
              <button
                key={m.id}
                onClick={() => setSelectedMuridId(m.id)}
                type="button"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all active:scale-95 shrink-0 ${
                  isSelected
                    ? "bg-white border-2 border-[#4a70a9] shadow-xs"
                    : "bg-white border border-[#e5ddd0] hover:border-[#4a70a9]/60 opacity-80"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-xs ${avatarBg}`}
                >
                  {getInitials(m.name)}
                </div>
                <div className="text-left flex items-center gap-1.5">
                  <span className={`text-xs block ${isSelected ? "font-bold text-[#1a1a2e]" : "font-medium text-[#434750]"}`}>
                    {m.name}
                  </span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-[#4a70a9] text-white flex items-center justify-center">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </section>
      )}

      {/* 3. Segmented Tab Switcher (Harian vs Perkembangan) */}
      <section className="bg-[#f0ebe3] p-1 rounded-xl flex items-stretch gap-1">
        <button
          onClick={() => setActiveTab("harian")}
          type="button"
          className={`flex-1 rounded-lg py-2.5 px-3 text-left transition-all flex flex-col justify-center ${
            activeTab === "harian"
              ? "bg-white shadow-[0_1px_4px_rgba(26,26,46,0.06)] border border-[#e5ddd0]/80 text-[#2e4b7a]"
              : "hover:bg-white/40 text-[#535761]"
          }`}
        >
          <div className="flex items-center gap-1.5 font-semibold">
            <ClipboardList size={16} />
            <span className="text-xs">Laporan Harian</span>
          </div>
          <p className="text-[10px] text-[#535761] mt-0.5 leading-tight">Per sesi pertemuan</p>
        </button>

        <button
          onClick={() => setActiveTab("perkembangan")}
          type="button"
          className={`flex-1 rounded-lg py-2.5 px-3 text-left transition-all flex flex-col justify-center ${
            activeTab === "perkembangan"
              ? "bg-white shadow-[0_1px_4px_rgba(26,26,46,0.06)] border border-[#e5ddd0]/80 text-[#2e4b7a]"
              : "hover:bg-white/40 text-[#535761]"
          }`}
        >
          <div className="flex items-center gap-1.5 font-semibold">
            <Award size={16} />
            <span className="text-xs">Rapor Perkembangan</span>
          </div>
          <p className="text-[10px] text-[#535761] mt-0.5 leading-tight">Per blok pertemuan</p>
        </button>
      </section>

      {/* 4. Tab Content Area */}
      {selectedMurid ? (
        activeTab === "harian" ? (
          <section className="space-y-3.5">
            {filteredDailyReports.length > 0 ? (
              <>
                {filteredDailyReports.slice(0, dailyDisplayLimit).map((report) => (
                  <article
                    key={report.id}
                    className="bg-white rounded-xl border border-[#e5ddd0] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] relative overflow-hidden space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2.5 border-b border-[#e5ddd0]/50">
                      <span className="inline-flex items-center gap-1.5 bg-[#eaf0f8] text-[#224477] px-2.5 py-1 rounded-full text-[11px] font-bold tracking-normal">
                        <span className="w-2 h-2 rounded-full bg-[#4a70a9]" />
                        {report.programName}
                      </span>
                      <button
                        onClick={() => handleContactTutorWA(report)}
                        title={`Hubungi ${report.tentorName} di WhatsApp`}
                        aria-label={`Hubungi ${report.tentorName} di WhatsApp`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#15803d] hover:bg-[#166534] active:scale-95 text-white text-[11px] font-bold shadow-xs transition-transform"
                      >
                        <MessageCircle size={13} />
                        <span>Chat Tentor</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[#535761]">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#535761] shrink-0" />
                        <span className="text-xs font-medium text-[#1a1a2e]">{report.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-[#535761] shrink-0" />
                        <span className="text-xs font-medium text-[#1a1a2e]">
                          {report.startTime} - {report.endTime} WIB
                        </span>
                      </div>
                    </div>

                    <div className="pt-0.5">
                      <span className="text-[11px] font-bold text-[#535761] block mb-1">
                        Materi / Kegiatan
                      </span>
                      <p className="text-sm font-semibold text-[#1a1a2e] leading-snug">
                        {report.activity}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 pt-1">
                      <div className="w-8 h-8 rounded-full bg-[#eaf0f8] text-[#224477] border border-[#4a70a9]/20 flex items-center justify-center text-[11px] font-bold">
                        {getInitials(report.tentorName)}
                      </div>
                      <div className="text-left">
                        <span className="text-xs font-semibold text-[#1a1a2e] block leading-tight">
                          {report.tentorName}
                        </span>
                        <span className="text-[10px] text-[#535761] block">Tentor Pendamping</span>
                      </div>
                    </div>

                    <div className="bg-[#f7f4ef] border-l-[3px] border-[#c8b99a] rounded-r-lg p-3 text-[#1a1a2e]">
                      <div className="flex items-center gap-1 text-[#705200] mb-1">
                        <Quote size={13} />
                        <span className="text-[11px] font-bold">Catatan Tentor</span>
                      </div>
                      <p className="text-xs text-[#1a1a2e]/90 italic leading-relaxed">
                        &quot;{report.notes || "Sesi berjalan lancar dan siswa aktif menyimak materi."}&quot;
                      </p>
                    </div>
                  </article>
                ))}

                {filteredDailyReports.length > dailyDisplayLimit && (
                  <button
                    type="button"
                    onClick={() => setDailyDisplayLimit((prev) => prev + 5)}
                    className="w-full py-2.5 rounded-xl border border-[#e5ddd0] bg-white text-xs font-semibold text-[#2e4b7a] hover:bg-[#eaf0f8] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Tampilkan Lebih Banyak</span>
                    <ChevronDown size={15} />
                  </button>
                )}
              </>
            ) : (
              <div className="bg-white border border-[#e5ddd0] rounded-xl p-8 text-center text-xs text-[#535761] shadow-xs">
                Belum ada data laporan harian untuk {selectedMurid.name}.
              </div>
            )}
          </section>
        ) : (
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#2e4b7a]" />
                <h2 className="text-base font-bold font-playfair text-[#1a1a2e]">
                  Evaluasi Blok Pertemuan
                </h2>
              </div>
              <button
                type="button"
                className="text-xs font-semibold text-[#2e4b7a] hover:underline flex items-center gap-1"
              >
                <Archive size={13} />
                <span>Lihat Arsip</span>
              </button>
            </div>

            {filteredProgressReports.length > 0 ? (
              filteredProgressReports.map((report) => (
                <article
                  key={report.id}
                  className="bg-white rounded-xl border border-[#e5ddd0] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] space-y-3.5"
                >
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#e5ddd0]/50">
                    <div>
                      <h3 className="text-base font-bold text-[#1a1a2e] font-playfair">
                        Rapor Perkembangan Blok {report.blockNumber}
                      </h3>
                      <span className="text-[11px] font-medium text-[#535761] block mt-0.5">
                        Evaluasi Berkala · {report.programName}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1 bg-[#dcfce7] text-[#15803d] px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0">
                      <CheckCircle2 size={13} />
                      <span>{report.sessionsPerBlock} sesi selesai</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-0.5">
                    <span className="text-xs font-bold text-[#434750] block">
                      Capaian Hasil Belajar:
                    </span>
                    <ul className="space-y-1.5">
                      {report.achievements.map((ach, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#1a1a2e]">
                          <div className="w-4 h-4 rounded-full bg-[#dcfce7] text-[#15803d] flex items-center justify-center shrink-0 mt-0.5">
                            <Check size={11} strokeWidth={3} />
                          </div>
                          <span className="leading-snug">{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-[#15803d] mb-2">
                        <TrendingUp size={15} />
                        <span className="text-xs font-bold">Materi Dikuasai</span>
                      </div>
                      <ul className="text-xs text-[#1a1a2e]/90 space-y-1.5 pl-4 list-disc marker:text-[#15803d]">
                        {report.masteredMaterials.map((item, idx) => (
                          <li key={idx} className="leading-snug">{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-[#92400e] mb-2">
                        <AlertTriangle size={15} />
                        <span className="text-xs font-bold">Perlu Latihan</span>
                      </div>
                      <ul className="text-xs text-[#1a1a2e]/90 space-y-1.5 pl-4 list-disc marker:text-[#92400e]">
                        {report.weakMaterials.map((item, idx) => (
                          <li key={idx} className="leading-snug">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-[#f7f4ef] border-l-[3px] border-[#c8b99a] rounded-r-lg p-3">
                    <div className="flex items-center gap-1.5 text-[#705200] mb-1">
                      <Award size={14} />
                      <span className="text-[11px] font-bold">
                        Catatan &amp; Rekomendasi
                      </span>
                    </div>
                    <p className="text-xs text-[#1a1a2e] leading-relaxed">
                      {report.notes || "Direkomendasikan sesi pengayaan dan latihan soal berkala sebelum ujian."}
                    </p>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      onClick={() => window.print()}
                      type="button"
                      className="w-full py-2.5 rounded-xl bg-[#2e4b7a] hover:bg-[#22395e] active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
                    >
                      <Download size={15} />
                      <span>Unduh Rapor PDF</span>
                    </button>
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleContactAdminProgressWA(report)}
                        type="button"
                        className="inline-flex items-center gap-1.5 text-[#15803d] hover:text-[#166534] text-xs font-bold py-1 px-3 hover:bg-[#f0fdf4] rounded-lg transition-colors"
                      >
                        <MessageCircle size={15} />
                        <span>Konsultasi Rapor via WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="bg-white border border-[#e5ddd0] rounded-xl p-8 text-center text-xs text-[#535761] shadow-xs">
                Belum ada rapor perkembangan blok untuk {selectedMurid.name}.
              </div>
            )}
          </section>
        )
      ) : (
        <div className="text-center py-12 bg-white border border-[#e5ddd0] rounded-xl text-xs text-[#535761]">
          Belum ada profil siswa yang terhubung. Hubungi admin nCourse untuk mengaktifkan laporan.
        </div>
      )}
    </div>
  );
}
