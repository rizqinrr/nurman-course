/* Hallmark · genre: playful-glassmorphism · design-system: design.md · designed-as-app */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Session,
  DailyReport,
  Program
} from "@/data/lms";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { apiFetch } from "@/lib/api";
import { formatSessionDateTime } from "@/lib/format";
import Button from "@/components/ui/Button";
import { 
  CalendarDays, 
  Clock, 
  User, 
  MapPin, 
  History, 
  CheckCircle2, 
  MessageSquare,
  FileText
} from "lucide-react";

interface DbMurid {
  id: string;
  name: string;
}

interface DbSession extends Session {
  program: Program;
  tentor?: { id: string; name: string };
}

export default function JadwalSesiPage() {
  const [loading, setLoading] = useState(true);
  const [murids, setMurids] = useState<DbMurid[]>([]);
  const [selectedMuridId, setSelectedMuridId] = useState("");

  const [sessions, setSessions] = useState<DbSession[]>([]);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        // Live mode
        const meRes = await apiFetch<{ user: { name: string; murids: DbMurid[] } }>("/api/users/me");
        setMurids(meRes.user.murids || []);
        if (meRes.user.murids?.length > 0) {
          setSelectedMuridId(meRes.user.murids[0].id);
        }

        const [sessionsRes, dailyRes] = await Promise.all([
          apiFetch<{ sessions: DbSession[] }>("/api/me/sessions"),
          apiFetch<{ reports: DailyReport[] }>("/api/me/daily-reports")
        ]);

        setSessions(sessionsRes.sessions);
        setDailyReports(dailyRes.reports);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load jadwal data:", err);
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
        <p className="text-sm font-semibold text-gray-600">Memuat jadwal sesi...</p>
      </div>
    );
  }

  const selectedMurid = murids.find((m) => m.id === selectedMuridId);

  const getFilteredSessions = () => {
    return sessions.filter(s => s.muridId === selectedMuridId);
  };

  const getFilteredDailyReports = () => {
    return dailyReports.filter(r => r.muridId === selectedMuridId);
  };

  const activeSessions = getFilteredSessions();
  const upcomingSessions = activeSessions.filter((s) => s.status === "scheduled");
  const pastSessions = activeSessions.filter((s) => s.status === "completed");
  const filteredReports = getFilteredDailyReports();

  const handleContactTutorWA = (startsAtStr: string, tentorName?: string) => {
    if (!selectedMurid) return;
    const tName = tentorName || "Kak Tentor";
    const text = encodeURIComponent(
      `Halo ${tName}, saya wali murid dari *${selectedMurid.name}*. Mengenai jadwal sesi *${startsAtStr}*, apakah bisa reschedule? Terima kasih.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  const handleRescheduleAdminWA = () => {
    if (!selectedMurid) return;
    const text = encodeURIComponent(
      `Halo Admin Nurman Course, saya wali murid dari *${selectedMurid.name}*. Ingin mengajukan perubahan jadwal belajar rutin anak saya. Mohon info ketersediaan slot. Terima kasih.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full flex-grow flex flex-col gap-6 pb-8 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Page Header */}
      <header className="flex flex-col gap-1 bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight font-sans">
          Jadwal Belajar
        </h1>
        <p className="text-sm text-gray-600">
          Pantau waktu les dan absensi kehadiran buah hati Anda
        </p>
      </header>



      {selectedMurid ? (
        <>
          {/* Upcoming Sessions */}
          <section className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200/50 pb-2">
              <CalendarDays size={20} className="text-[#4a70a9]" />
              <span>Sesi Mendatang</span>
            </h3>
            {upcomingSessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingSessions.map((session) => {
                  const startsAtStr = formatSessionDateTime(session.startsAt);
                  return (
                    <div 
                      key={session.id} 
                      className="bg-white/60 border border-white/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden flex flex-col justify-between gap-4"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs sm:text-sm font-bold text-[#4a70a9]">
                          {startsAtStr.split(" • ")[0]}
                        </span>
                        <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-[#4a70a9] rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Terjadwal
                        </span>
                      </div>
                      
                      <h4 className="text-base sm:text-lg font-bold text-gray-800">
                        {session.program?.name || "Bimbingan Belajar"}
                      </h4>

                      <div className="flex flex-col gap-2 text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-[#4a70a9]" />
                          <span>{startsAtStr.split(" • ")[1] || "14:00 - 15:30 WIB"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-[#4a70a9]" />
                          <span>Tutor: {(session as any).tentor?.name || "Tentor"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-[#4a70a9]" />
                          <span>{session.location || "Rumah Siswa"}</span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        onClick={() => handleContactTutorWA(startsAtStr, (session as any).tentor?.name)}
                        className="w-full text-xs justify-center py-2.5 border border-[#4a70a9]/30 text-[#4a70a9] hover:bg-[#4a70a9]/5 flex items-center gap-1.5 mt-2"
                      >
                        <MessageSquare size={14} />
                        <span>Reschedule ({(session as any).tentor?.name ? `WA ${ (session as any).tentor.name }` : "WhatsApp Tentor"})</span>
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-white/40 border border-white/60 rounded-2xl text-gray-500">
                Belum ada jadwal sesi mendatang.
              </div>
            )}
          </section>

          {/* Past Sessions History */}
          <section className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200/50 pb-2">
              <History size={20} className="text-gray-500" />
              <span>Riwayat Pertemuan & Laporan</span>
            </h3>
            
            {pastSessions.length > 0 ? (
              <div className="flex flex-col gap-4">
                {pastSessions.map((session) => {
                  const report = filteredReports.find((r) => r.sessionId === session.id);
                  const startsAtStr = formatSessionDateTime(session.startsAt);
                  return (
                    <div 
                      key={session.id} 
                      className="bg-white/60 border border-white/80 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
                    >
                      <div className="flex-1 flex flex-col gap-1.5">
                        <div className="flex items-center gap-3">
                          <span className="text-xs sm:text-sm font-bold text-gray-800">
                            {startsAtStr.split(" • ")[0]}
                          </span>
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-emerald-500" />
                            Hadir / Selesai
                          </span>
                        </div>
                        {report ? (
                          <p className="text-xs sm:text-sm text-gray-600">
                            Langkah diajarkan: <strong className="text-gray-800 font-bold">{report.activity}</strong>
                          </p>
                        ) : (
                          <p className="text-xs sm:text-sm text-gray-500">
                            Sesi telah selesai dilaksanakan.
                          </p>
                        )}
                      </div>
                      <Link href="/app/laporan" className="shrink-0 w-full md:w-auto">
                        <Button variant="ghost" className="w-full md:w-auto text-xs justify-center py-2 text-[#4a70a9] hover:bg-[#4a70a9]/5 flex items-center gap-1">
                          <FileText size={14} />
                          <span>Lihat Detail Laporan</span>
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-white/40 border border-white/60 rounded-2xl text-gray-500">
                Belum ada riwayat pertemuan.
              </div>
            )}
          </section>

          {/* Floating Action Button - Ajukan Perubahan Jadwal */}
          <button
            onClick={handleRescheduleAdminWA}
            className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-40 flex items-center gap-2 rounded-full bg-[#4a70a9] text-white text-xs sm:text-sm font-semibold px-5 py-3.5 shadow-xl shadow-[#4a70a9]/30 hover:bg-[#3d5f96] active:scale-95 transition-all cursor-pointer"
          >
            <CalendarDays size={16} />
            <span className="hidden sm:inline">Ajukan Perubahan Jadwal</span>
          </button>
        </>
      ) : (
        <div className="text-center py-12 bg-white/40 border border-white/60 rounded-2xl text-gray-500">
          Tidak ada data anak ditemukan. Hubungi admin untuk mendaftarkan anak Anda.
        </div>
      )}

    </div>
  );
}
