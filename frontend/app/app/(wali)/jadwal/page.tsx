/* Hallmark · genre: warm-editorial · design-system: google-stitch · designed-as-mobile-app */
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
import {
  ArrowLeft,
  Bell,
  Calendar,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  ChevronDown,
  Check,
  CalendarDays,
  CalendarRange
} from "lucide-react";

interface DbMurid {
  id: string;
  name: string;
}

interface DbSession extends Session {
  program: Program;
  tentor?: { id: string; name: string; phone?: string | null };
}

export default function JadwalSesiPage() {
  const [loading, setLoading] = useState(true);
  const [murids, setMurids] = useState<DbMurid[]>([]);
  const [selectedMuridId, setSelectedMuridId] = useState("");

  const [sessions, setSessions] = useState<DbSession[]>([]);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [historyDisplayLimit, setHistoryDisplayLimit] = useState(3);

  useEffect(() => {
    async function loadData() {
      try {
        const meRes = await apiFetch<{ user: { name: string; murids: DbMurid[] } }>("/api/users/me");
        setMurids(meRes.user.murids || []);
        if (meRes.user.murids?.length > 0) {
          setSelectedMuridId(meRes.user.murids[0].id);
        }

        const [sessionsRes, dailyRes] = await Promise.all([
          apiFetch<{ sessions: DbSession[] }>("/api/me/sessions"),
          apiFetch<{ reports: DailyReport[] }>("/api/me/daily-reports")
        ]);

        setSessions(sessionsRes.sessions || []);
        setDailyReports(dailyRes.reports || []);
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
      <div className="p-6 w-full flex-grow flex flex-col gap-4 items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-3 border-[#4a70a9]/20 border-t-[#4a70a9] animate-spin"></div>
        <p className="text-xs font-semibold text-[#737781]">Memuat jadwal belajar...</p>
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

  const activeSessions = sessions.filter((s) => s.muridId === selectedMuridId);
  const passedIds = new Set(
    activeSessions.filter((s) => new Date(s.endsAt).getTime() <= Date.now()).map((s) => s.id)
  );

  const upcomingSessions = activeSessions
    .filter((s) => s.status === "scheduled" && !passedIds.has(s.id))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  const pastSessions = activeSessions
    .filter((s) => s.status !== "scheduled" || passedIds.has(s.id))
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt));

  const filteredReports = dailyReports.filter((r) => r.muridId === selectedMuridId);

  const handleContactTutorWA = (startsAtStr: string, tentorName?: string, tentorPhone?: string | null) => {
    if (!selectedMurid) return;
    const tName = tentorName || "Kak Tentor";
    const text = encodeURIComponent(
      `Halo ${tName}, saya wali murid dari *${selectedMurid.name}*. Mengenai jadwal sesi *${startsAtStr}*, apakah bisa mengajukan reschedule? Terima kasih.`
    );
    const phone = tentorPhone || WHATSAPP_NUMBER;
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  const handleRescheduleAdminWA = () => {
    if (!selectedMurid) return;
    const text = encodeURIComponent(
      `Halo Admin Nurman Course, saya wali murid dari *${selectedMurid.name}*. Ingin mengajukan penyesuaian jadwal sesi belajar rutin. Mohon info ketersediaan slot. Terima kasih.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <div className="px-4 pt-2 pb-28 space-y-5 animate-[fadeIn_0.3s_ease-out] font-dm text-[#1a1a2e]">
      {/* 1. Top Bar Navigation (100% Stitch Mobile Header) */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center gap-3">
          <Link
            href="/app/dashboard"
            aria-label="Kembali ke Dashboard"
            className="w-9 h-9 rounded-full bg-white border border-[#e5ddd0] flex items-center justify-center text-[#1a1a2e] hover:bg-[#eaf0f8] hover:text-[#4a70a9] transition-colors shadow-xs active:scale-95"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold font-playfair text-[#1a1a2e] tracking-tight leading-tight">
              Jadwal Belajar
            </h1>
            <p className="text-[11px] text-[#737781] leading-none mt-0.5">Portal Wali Murid</p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Notifikasi Jadwal"
          className="w-9 h-9 rounded-full bg-white border border-[#e5ddd0] flex items-center justify-center text-[#434750] hover:text-[#4a70a9] transition-colors shadow-xs active:scale-95"
        >
          <Bell size={17} />
        </button>
      </header>

      {/* 2. Child Selector (Avatar Inisial Bulat - Stitch Style cdfc63d / 0530b9b) */}
      {murids.length > 0 && (
        <section aria-label="Pilih Profil Anak" className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5">
          {murids.map((m, idx) => {
            const isSelected = m.id === selectedMuridId;
            const avatarBg = idx === 0 ? "bg-[#4a70a9]" : "bg-[#c8b99a]";

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

      {selectedMurid ? (
        <>
          {/* 3. Section Sesi Mendatang */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-playfair text-[#1a1a2e]">
                  Sesi Mendatang
                </h2>
                <span className="bg-[#eaf0f8] text-[#30578f] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {upcomingSessions.length} sesi
                </span>
              </div>
              <button
                type="button"
                className="text-xs font-semibold text-[#4a70a9] hover:underline flex items-center gap-1"
              >
                <CalendarRange size={14} />
                <span>Kalender</span>
              </button>
            </div>

            {upcomingSessions.length > 0 ? (
              <div className="space-y-3.5">
                {upcomingSessions.map((session) => {
                  const startsAtStr = formatSessionDateTime(session.startsAt);
                  const dateParts = startsAtStr.split(" • ");
                  const dateDisplay = dateParts[0];
                  const timeDisplay = dateParts[1] || "16:00 - 17:30 WIB";
                  const tentorName = session.tentor?.name || "Kak Dimas Prayoga, S.Si.";

                  return (
                    <article
                      key={session.id}
                      className="bg-white rounded-xl border border-[#e5ddd0] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)] space-y-3 relative overflow-hidden"
                    >
                      {/* Top Row: TERJADWAL badge + Tanggal */}
                      <div className="flex items-center justify-between pb-2 border-b border-[#e5ddd0]/50">
                        <span className="inline-flex items-center gap-1.5 bg-[#eaf0f8] text-[#30578f] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Terjadwal
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1a1a2e]">
                          <Calendar size={13} className="text-[#4a70a9]" />
                          <span>{dateDisplay}</span>
                        </div>
                      </div>

                      {/* Header Program & Deskripsi Sesi */}
                      <div>
                        <h3 className="text-base font-bold font-playfair text-[#1a1a2e] leading-snug">
                          {session.program?.name || "Bimbingan Belajar"}
                        </h3>
                        <p className="text-xs text-[#737781] mt-0.5">
                          Bimbel Intensif Persiapan Penilaian &amp; Pemantapan Konsep
                        </p>
                      </div>

                      {/* Detail Sesi List */}
                      <div className="space-y-2 py-1 text-xs text-[#434750]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-[#f7f4ef] flex items-center justify-center text-[#4a70a9] shrink-0">
                            <Clock size={12} />
                          </div>
                          <span className="font-medium text-[#1a1a2e]">
                            {timeDisplay} (90 Menit)
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-[#f7f4ef] flex items-center justify-center text-[#4a70a9] shrink-0">
                            <User size={12} />
                          </div>
                          <span>
                            Tentor: <strong className="font-semibold text-[#1a1a2e]">{tentorName}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-[#f7f4ef] flex items-center justify-center text-[#4a70a9] shrink-0">
                            <MapPin size={12} />
                          </div>
                          <span>
                            {session.location || "Les Privat – Tatap Muka (Rumah Murid)"}
                          </span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-[#e5ddd0]/60 pt-2.5">
                        <button
                          type="button"
                          onClick={() => handleContactTutorWA(startsAtStr, tentorName, session.tentor?.phone)}
                          className="w-full py-2 px-3 rounded-lg bg-[#eaf0f8] hover:bg-[#d9e6f6] active:scale-98 text-[#30578f] text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                        >
                          <MessageCircle size={15} className="text-[#30578f]" />
                          <span>Reschedule via WhatsApp</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-[#e5ddd0] rounded-xl p-8 text-center text-xs text-[#737781] shadow-xs">
                Belum ada jadwal sesi mendatang untuk {selectedMurid.name}.
              </div>
            )}
          </section>

          {/* 4. Section Riwayat Pertemuan */}
          <section className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base font-bold font-playfair text-[#1a1a2e]">
                Riwayat Pertemuan
              </h2>
              <span className="text-xs text-[#737781] font-medium">Bulan Berjalan</span>
            </div>

            {pastSessions.length > 0 ? (
              <div className="space-y-3">
                {pastSessions.slice(0, historyDisplayLimit).map((session) => {
                  const report = filteredReports.find((r) => r.sessionId === session.id);
                  const startsAtStr = formatSessionDateTime(session.startsAt);
                  const dateParts = startsAtStr.split(" • ");
                  const dateDisplay = dateParts[0];
                  const timeDisplay = dateParts[1] || "16:00 - 17:30 WIB";
                  const isCancelled = session.status === "cancelled";

                  return (
                    <article
                      key={session.id}
                      className="bg-white rounded-xl border border-[#e5ddd0] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)] space-y-2.5"
                    >
                      {/* Status Header */}
                      <div className="flex items-center justify-between">
                        {isCancelled ? (
                          <span className="inline-flex items-center gap-1 bg-[#fee2e2] text-[#dc2626] px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Dibatalkan
                          </span>
                        ) : session.status === "completed" ? (
                          <span className="inline-flex items-center gap-1 bg-[#dcfce7] text-[#16a34a] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            <CheckCircle2 size={12} />
                            <span>Hadir / Selesai</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-[#fef3c7] text-[#d97706] px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            <Clock size={12} />
                            <span>Menunggu Laporan</span>
                          </span>
                        )}

                        <span className="text-xs font-semibold text-[#1a1a2e]">{dateDisplay}</span>
                      </div>

                      {/* Judul Program & Jam */}
                      <div>
                        <h4 className="text-sm font-bold text-[#1a1a2e] leading-snug">
                          {session.program?.name || "Matematika & IPA Terpadu"}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-[#737781] mt-0.5">
                          <Clock size={12} />
                          <span>{timeDisplay}</span>
                        </div>
                      </div>

                      {/* Materi / Catatan Singkat */}
                      <div className="bg-[#f7f4ef] rounded-lg p-2.5 text-xs text-[#1a1a2e]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#737781] block mb-0.5">
                          Materi:
                        </span>
                        <p className="leading-snug font-medium">
                          {report?.activity || (isCancelled ? "Sesi ini dibatalkan." : "Pembahasan materi dan latihan soal harian.")}
                        </p>
                      </div>

                      {/* Footer Action Link */}
                      <div className="pt-1 flex justify-end">
                        <Link
                          href="/app/laporan"
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#4a70a9] hover:underline"
                        >
                          <span>Lihat Detail Laporan</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </article>
                  );
                })}

                {/* Tombol Tampilkan Lebih Banyak */}
                {pastSessions.length > 1 && pastSessions.length > historyDisplayLimit && (
                  <button
                    type="button"
                    onClick={() => setHistoryDisplayLimit((prev) => prev + 5)}
                    className="w-full py-2.5 rounded-xl border border-[#e5ddd0] bg-white text-xs font-semibold text-[#4a70a9] hover:bg-[#eaf0f8] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Tampilkan Lebih Banyak</span>
                    <ChevronDown size={15} />
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white border border-[#e5ddd0] rounded-xl p-8 text-center text-xs text-[#737781] shadow-xs">
                Belum ada riwayat pertemuan untuk {selectedMurid.name}.
              </div>
            )}
          </section>

          {/* 5. Floating Action Button (FAB) Stitch - Terkunci di dalam container mobile frame */}
          <div className="fixed bottom-[72px] left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-30 pointer-events-none">
            <button
              onClick={handleRescheduleAdminWA}
              type="button"
              className="pointer-events-auto w-full py-3 px-4 rounded-xl bg-[#4a70a9] hover:bg-[#3d5d8c] active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(74,112,169,0.35)] transition-all border border-white/20"
            >
              <CalendarDays size={16} />
              <span>Ajukan Perubahan Jadwal</span>
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white border border-[#e5ddd0] rounded-xl text-xs text-[#737781]">
          Tidak ada data anak ditemukan. Hubungi admin untuk mendaftarkan anak Anda.
        </div>
      )}
    </div>
  );
}
