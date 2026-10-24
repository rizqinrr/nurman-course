/* Hallmark · genre: warm-editorial · design-system: design.md · designed-as-mobile-app */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Session, DailyReport, DbMurid, Program } from "@/data/lms";
import useClock from "@/hooks/useClock";
import { apiFetch } from "@/lib/api";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { addOneHour } from "@/utils/format";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  CalendarDays,
  Clock,
  User,
  MapPin,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  History,
  Plus,
  X,
  Edit3,
  Trash2,
  GraduationCap,
  Ban,
  MessageCircle,
} from "lucide-react";

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

function resolveStudentPhone(murid?: DbMurid | null): string {
  if (!murid) return WHATSAPP_NUMBER;
  const raw = murid.parentPhone || murid.phone || murid.wali?.phone || WHATSAPP_NUMBER;
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return digits || WHATSAPP_NUMBER;
}

interface SessionWithRelations extends Session {
  murid?: DbMurid | null;
  program?: Program;
  tentor?: { id: string; name: string };
}

interface EnrollmentWithMurid {
  id: string;
  muridId: string;
  programId: string;
  murid?: DbMurid | null;
  program?: Program & { id: string; name: string };
  tentor?: { id: string; name: string };
}

interface JadwalForm {
  enrollmentId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
}

const emptyForm: JadwalForm = {
  enrollmentId: "",
  date: new Date().toISOString().slice(0, 10),
  startTime: "15:00",
  endTime: "16:00",
  location: "",
};

export default function TentorJadwalPage() {
  const [selectedMuridId, setSelectedMuridId] = useState("all");
  const [loading, setLoading] = useState(true);
  const [sessionsDataRaw, setSessionsDataRaw] = useState<SessionWithRelations[]>([]);
  const [sessionsFormatted, setSessionsFormatted] = useState<SessionWithRelations[]>([]);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [muridsList, setMuridsList] = useState<DbMurid[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentWithMurid[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<SessionWithRelations | null>(null);
  const [form, setForm] = useState<JadwalForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<SessionWithRelations | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SessionWithRelations | null>(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

  const nowMs = useClock();
  const requestId = useRef(0);
  const saveId = useRef(0);
  const mutationId = useRef(0);
  const mounted = useRef(false);

  const loadData = useCallback(() => {
    const currentRequest = ++requestId.current;
    return Promise.all([
      apiFetch<{ sessions: SessionWithRelations[] }>("/api/me/sessions"),
      apiFetch<{ reports: DailyReport[] }>("/api/me/daily-reports"),
      apiFetch<{ enrollments?: EnrollmentWithMurid[]; data?: EnrollmentWithMurid[] }>(
        "/api/me/enrollments",
      ).catch(() => ({ enrollments: [], data: [] })),
    ])
      .then(([sessionsRes, reportsRes, enrollmentsRes]) => {
        if (!mounted.current || currentRequest !== requestId.current) return;
        setSessionsDataRaw(sessionsRes.sessions);
        const mapped = sessionsRes.sessions.map((s) => ({
          ...s,
          startsAt: formatSessionDateTime(s.startsAt),
          endsAt: formatSessionDateTime(s.endsAt),
        }));
        setSessionsFormatted(mapped);
        setDailyReports(reportsRes.reports);

        const enrList = enrollmentsRes.enrollments || enrollmentsRes.data || [];
        setEnrollments(enrList);

        const uniqueMap = new Map<string, DbMurid>();
        enrList.forEach((e) => {
          if (e.murid && !uniqueMap.has(e.murid.id)) {
            uniqueMap.set(e.murid.id, { ...e.murid, avatarUrl: e.murid.avatarUrl || "" });
          }
        });
        sessionsRes.sessions.forEach((s) => {
          if (s.murid && !uniqueMap.has(s.murid.id)) {
            uniqueMap.set(s.murid.id, { ...s.murid, avatarUrl: s.murid.avatarUrl || "" });
          }
        });
        setMuridsList(Array.from(uniqueMap.values()));
      })
      .catch((e: unknown) => {
        if (mounted.current && currentRequest === requestId.current) {
          setErrorMsg(e instanceof Error ? e.message : "Gagal memuat jadwal");
        }
      })
      .finally(() => {
        if (mounted.current && currentRequest === requestId.current) setLoading(false);
      });
  }, []);

  useEffect(() => {
    mounted.current = true;
    void loadData();
    return () => {
      mounted.current = false;
    };
  }, [loadData]);

  const reloadData = () => {
    setLoading(true);
    setErrorMsg(null);
    return loadData();
  };

  const filteredSessions =
    selectedMuridId === "all"
      ? sessionsFormatted
      : sessionsFormatted.filter((s) => s.muridId === selectedMuridId);

  const passedIds = new Set(
    sessionsDataRaw
      .filter((s) => nowMs !== null && new Date(s.endsAt).getTime() <= nowMs)
      .map((s) => s.id),
  );

  const upcomingSessions = filteredSessions
    .filter((s) => s.status === "scheduled" && !passedIds.has(s.id))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const pastSessions = filteredSessions
    .filter((s) => s.status !== "scheduled" || passedIds.has(s.id))
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt));

  const hasReport = (sessionId: string) => dailyReports.some((r) => r.sessionId === sessionId);

  const openCreate = () => {
    setEditingSession(null);
    const firstEnr = enrollments[0];
    setForm({
      enrollmentId: firstEnr?.id || "",
      date: new Date().toISOString().slice(0, 10),
      startTime: "15:00",
      endTime: "16:00",
      location: firstEnr?.murid?.address || "",
    });
    setShowForm(true);
    setErrorMsg(null);
  };

  const openEdit = (s: SessionWithRelations) => {
    const raw = sessionsDataRaw.find((r: SessionWithRelations) => r.id === s.id);
    if (!raw) return;
    const d = new Date(raw.startsAt);
    const date = raw.startsAt.slice(0, 10);
    const st = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    const edD = new Date(raw.endsAt);
    const et = `${String(edD.getHours()).padStart(2, "0")}:${String(edD.getMinutes()).padStart(2, "0")}`;
    const linkedEnr = enrollments.find((e) => e.muridId === raw.muridId && e.programId === raw.programId);
    setEditingSession(s);
    setForm({
      enrollmentId: linkedEnr?.id || "",
      date,
      startTime: st,
      endTime: et,
      location: raw.location || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setNotice(null);
    if (!form.enrollmentId && !editingSession) {
      setErrorMsg("Pilih siswa & program (enrollment)");
      return;
    }
    if (form.startTime >= form.endTime) {
      setErrorMsg("Jam selesai harus setelah jam mulai");
      return;
    }
    setSaving(true);
    const currentSave = ++saveId.current;
    try {
      if (editingSession) {
        await apiFetch<{ data: SessionWithRelations }>(`/api/me/sessions/${editingSession.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            date: form.date,
            startTime: form.startTime,
            endTime: form.endTime,
            location: form.location || null,
          }),
        });
        if (!mounted.current || currentSave !== saveId.current) return;
        setNotice("Jadwal berhasil diperbarui");
      } else {
        await apiFetch<{ data: SessionWithRelations }>(`/api/me/sessions`, {
          method: "POST",
          body: JSON.stringify({
            enrollmentId: form.enrollmentId,
            date: form.date,
            startTime: form.startTime,
            endTime: form.endTime,
            location: form.location || null,
          }),
        });
        if (!mounted.current || currentSave !== saveId.current) return;
        setNotice("Jadwal berhasil dibuat dan langsung tampil di Portal Siswa.");
      }
      setShowForm(false);
      setEditingSession(null);
      setForm(emptyForm);
      await reloadData();
    } catch (err) {
      if (!mounted.current || currentSave !== saveId.current) return;
      const msg = err instanceof Error ? err.message : "Gagal simpan jadwal";
      setErrorMsg(
        msg.includes("404")
          ? `Backend belum restart — endpoint baru belum aktif. Jalankan: npm run dev --workspace=backend. Detail: ${msg}`
          : msg,
      );
    } finally {
      if (mounted.current && currentSave === saveId.current) setSaving(false);
    }
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    const id = cancelTarget.id;
    setConfirmBusy(true);
    const currentMutation = ++mutationId.current;
    try {
      await apiFetch(`/api/me/sessions/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (!mounted.current || currentMutation !== mutationId.current) return;
      setNotice("Sesi dibatalkan");
      setCancelTarget(null);
      await reloadData();
    } catch (err) {
      if (!mounted.current || currentMutation !== mutationId.current) return;
      setErrorMsg(err instanceof Error ? err.message : "Gagal batalkan");
    } finally {
      if (mounted.current && currentMutation === mutationId.current) setConfirmBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setConfirmBusy(true);
    const currentMutation = ++mutationId.current;
    try {
      await apiFetch(`/api/me/sessions/${id}`, { method: "DELETE" });
      if (!mounted.current || currentMutation !== mutationId.current) return;
      setNotice("Jadwal dihapus");
      setDeleteTarget(null);
      await reloadData();
    } catch (err) {
      if (!mounted.current || currentMutation !== mutationId.current) return;
      setErrorMsg(err instanceof Error ? err.message : "Gagal hapus");
    } finally {
      if (mounted.current && currentMutation === mutationId.current) setConfirmBusy(false);
    }
  };

  if (loading || nowMs === null) {
    return (
      <div className="p-6 max-w-4xl mx-auto w-full flex-grow flex flex-col justify-center items-center gap-3 min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-3 border-[#4a70a9]/20 border-t-[#4a70a9] animate-spin" />
        <div className="text-xs font-semibold text-[#535761]">Memuat jadwal mengajar...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full flex-grow flex flex-col gap-5 sm:gap-6 pb-28 animate-[fadeIn_0.3s_ease-out]">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-white border border-[#E5DDD0] shadow-xs p-4 sm:p-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#14233a] tracking-tight">
            Jadwal Mengajar
          </h1>
          <p className="text-xs sm:text-sm text-[#535761] leading-relaxed mt-0.5">
            Atur jadwal sesi per siswa • Tersinkron ke Portal Siswa &amp; pengingat Direct Chat WA
          </p>
        </div>
        <Button
          onClick={openCreate}
          disabled={enrollments.length === 0}
          className="inline-flex items-center gap-2 justify-center h-10 px-4 rounded-xl text-xs font-bold"
        >
          <Plus size={16} /> Buat Jadwal
        </Button>
      </header>

      {errorMsg && (
        <div role="alert" className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-xs font-semibold text-[#b91c1c]">
          {errorMsg}
        </div>
      )}
      {notice && (
        <div role="status" className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-xs font-semibold text-[#15803d]">
          {notice}
        </div>
      )}
      {enrollments.length === 0 && (
        <div className="p-4 rounded-xl border border-[#fde68a] bg-[#fffbeb]">
          <p className="text-xs sm:text-sm text-[#78350F]">
            <AlertTriangle size={14} className="inline mr-1" /> Belum ada penugasan siswa aktif. Minta admin menghubungkan kamu dengan siswa di{" "}
            <span className="font-bold">/app/admin/enrollment</span> terlebih dahulu.
          </p>
        </div>
      )}

      {/* Filter Siswa */}
      <div className="flex flex-col gap-2 bg-white p-4 rounded-2xl border border-[#E5DDD0] shadow-xs">
        <span className="text-xs font-bold text-[#535761]">Filter Siswa</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedMuridId("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              selectedMuridId === "all"
                ? "bg-[#2e4b7a] text-white border-[#2e4b7a]"
                : "bg-[#F7F4EF] text-[#434750] hover:bg-[#EAF0F8] border-[#E5DDD0]"
            }`}
          >
            Semua Siswa
          </button>
          {muridsList.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMuridId(m.id)}
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

      {showForm && (
        <div className="p-5 rounded-2xl bg-white border border-[#E5DDD0] shadow-md">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5DDD0]">
            <h2 className="font-bold text-[#14233a] text-base">
              {editingSession ? "Edit Jadwal Sesi" : "Buat Jadwal Baru"}
            </h2>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingSession(null);
              }}
              className="p-1.5 rounded-lg hover:bg-[#F7F4EF] text-[#535761]"
            >
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!editingSession && (
              <label className="block text-xs font-bold text-[#14233a]">
                Siswa &amp; Program (Enrollment)
                <select
                  required
                  value={form.enrollmentId}
                  onChange={(e) => {
                    const enr = enrollments.find((x) => x.id === e.target.value);
                    setForm({
                      ...form,
                      enrollmentId: e.target.value,
                      location: enr?.murid?.address || form.location,
                    });
                  }}
                  className="mt-1.5 w-full rounded-xl border border-[#E5DDD0] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4a70a9]"
                >
                  <option value="">Pilih siswa...</option>
                  {enrollments.map((enr) => (
                    <option key={enr.id} value={enr.id}>
                      {enr.murid?.name || enr.muridId} • {enr.program?.name || enr.programId}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="block text-xs font-bold text-[#14233a]">
                Tanggal
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-[#E5DDD0] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4a70a9]"
                />
              </label>
              <label className="block text-xs font-bold text-[#14233a]">
                Jam Mulai
                <input
                  type="time"
                  required
                  value={form.startTime}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm((f) => ({ ...f, startTime: v, endTime: v ? addOneHour(v) : f.endTime }));
                  }}
                  className="mt-1.5 w-full rounded-xl border border-[#E5DDD0] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4a70a9]"
                />
              </label>
              <label className="block text-xs font-bold text-[#14233a]">
                Jam Selesai
                <input
                  type="time"
                  required
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-[#E5DDD0] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4a70a9]"
                />
              </label>
            </div>
            <label className="block text-xs font-bold text-[#14233a]">
              Lokasi / Link Kelas Online (opsional, default alamat rumah siswa)
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Contoh: Rumah siswa Jl. Kalisabuk... atau Online via Google Meet"
                className="mt-1.5 w-full rounded-xl border border-[#E5DDD0] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#4a70a9]"
              />
            </label>
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  setEditingSession(null);
                }}
                className="flex-1 justify-center"
              >
                Batal
              </Button>
              <Button type="submit" disabled={saving} className="flex-1 justify-center gap-2">
                {saving ? "Menyimpan..." : editingSession ? "Simpan" : "Buat Jadwal"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Sesi Mendatang */}
      <section className="flex flex-col gap-3.5">
        <h2 className="text-base sm:text-lg font-bold text-[#14233a] flex items-center gap-2 border-b border-[#E5DDD0] pb-2">
          <CalendarDays size={19} className="text-[#2e4b7a]" />
          <span>Sesi Mendatang</span>
          <span className="ml-1 rounded-full bg-[#EAF0F8] px-2.5 py-0.5 text-xs font-bold text-[#224477]">
            {upcomingSessions.length}
          </span>
        </h2>
        {upcomingSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingSessions.map((session) => {
              const murid =
                muridsList.find((m) => m.id === session.muridId) ||
                session.murid || { id: session.muridId, waliId: "", name: "Siswa", schoolLevel: "SD" };
              const program = session.program || { id: session.programId, name: "Program Bimbingan" };
              const waPhone = resolveStudentPhone(murid);
              const waReminder = encodeURIComponent(
                `Halo *${murid.name}* (atau Bapak/Ibu Orang Tua), mengingatkan jadwal sesi *${program.name}* pada *${session.startsAt}* di *${session.location || "lokasi belajar"}*. Sampai jumpa!`
              );

              return (
                <article
                  key={session.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 border border-[#E5DDD0] shadow-xs"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-xs font-bold text-[#535761] flex items-center gap-1.5">
                        <Clock size={12} className="text-[#2e4b7a]" />
                        {session.startsAt.split(" • ")[0]}
                      </span>
                      <span className="px-2.5 py-0.5 bg-[#EAF0F8] border border-[#B8CDE4] text-[#224477] rounded-full text-[10px] font-bold uppercase">
                        Terjadwal
                      </span>
                    </div>
                    <h3 className="font-bold text-[#14233a] text-base">{murid.name}</h3>
                    <div className="flex flex-col gap-1.5 text-xs text-[#535761] mt-2">
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={14} className="text-[#2e4b7a] shrink-0" />
                        <span>
                          {program?.name} • {murid.schoolLevel || "-"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-[#2e4b7a] shrink-0" />
                        <span>
                          {session.startsAt.split(" • ")[1] || "WIB"} - {session.endsAt.split(" • ")[1] || ""}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs text-[#535761] mt-3 pt-3 border-t border-[#E5DDD0]/60">
                      <MapPin size={14} className="text-[#2e4b7a] shrink-0 mt-0.5" />
                      <span>{session.location || "-"}</span>
                    </div>
                    {session.tentor && (
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#535761]">
                        <GraduationCap size={12} className="text-[#2e4b7a]" /> Tentor: {session.tentor.name}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 pt-1">
                    <a
                      href={`https://wa.me/${waPhone}?text=${waReminder}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#15803d] hover:bg-[#166534] py-2 px-3 text-xs font-bold text-white transition-colors"
                    >
                      <MessageCircle size={14} />
                      <span>Ingatkan Siswa / Ortu via WA</span>
                    </a>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => openEdit(session)}
                        className="justify-center text-xs py-1.5 gap-1"
                      >
                        <Edit3 size={13} /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setCancelTarget(session)}
                        className="justify-center text-xs py-1.5 gap-1 border-[#fde68a] text-[#92400E] hover:bg-[#fffbeb]"
                      >
                        <Ban size={13} /> Batal
                      </Button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(session)}
                        className="rounded-xl border border-[#fecaca] bg-[#fef2f2] text-[11px] font-bold text-[#b91c1c] hover:bg-[#fee2e2] flex items-center justify-center gap-1 py-1.5"
                      >
                        <Trash2 size={12} /> Hapus
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-[#E5DDD0] shadow-xs flex flex-col items-start gap-3">
            <CalendarDays className="text-[#2e4b7a]" size={28} />
            <div>
              <h3 className="font-bold text-[#14233a] text-sm">Tidak Ada Sesi Mendatang</h3>
              <p className="text-xs text-[#535761] mt-1 max-w-sm">
                Buat jadwal baru lewat tombol Buat Jadwal untuk siswa yang terhubung dengan kamu.
              </p>
            </div>
            {enrollments.length > 0 && (
              <Button onClick={openCreate} variant="ghost" className="mt-1 text-xs gap-2">
                <Plus size={14} /> Buat Jadwal Sekarang
              </Button>
            )}
          </div>
        )}
      </section>

      {/* Riwayat & Laporan */}
      <section className="flex flex-col gap-3.5">
        <h2 className="text-base sm:text-lg font-bold text-[#14233a] flex items-center gap-2 border-b border-[#E5DDD0] pb-2">
          <History size={19} className="text-[#535761]" />
          <span>Riwayat Sesi &amp; Laporan</span>
          <span className="ml-1 rounded-full bg-white border border-[#E5DDD0] px-2.5 py-0.5 text-xs font-bold text-[#535761]">
            {pastSessions.length}
          </span>
        </h2>
        {pastSessions.length > 0 ? (
          <div className="flex flex-col gap-3">
            {pastSessions.map((session) => {
              const murid =
                muridsList.find((m) => m.id === session.muridId) ||
                session.murid || { name: "Siswa" };
              const program = session.program || { id: session.programId, name: "Program" };
              const reported = hasReport(session.id);
              const isCancelled = session.status === "cancelled";
              return (
                <article
                  key={session.id}
                  className="bg-white rounded-2xl p-4 border border-[#E5DDD0] shadow-xs flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
                >
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-2.5 mb-2">
                      <span className="text-xs sm:text-sm font-bold text-[#14233a]">
                        {session.startsAt.split(" • ")[0]}
                      </span>
                      {isCancelled ? (
                        <span className="px-2.5 py-0.5 bg-gray-100 border border-gray-200 text-gray-700 rounded-full text-[10px] font-bold uppercase">
                          Dibatalkan
                        </span>
                      ) : reported ? (
                        <span className="px-2.5 py-0.5 bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          Selesai
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                          <AlertTriangle size={12} />
                          Butuh Laporan
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#535761]">
                      <span className="flex items-center gap-1">
                        <User size={13} className="text-[#2e4b7a]" />
                        <span className="font-semibold text-[#14233a]">{murid.name}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen size={13} className="text-[#2e4b7a]" />
                        {program?.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-[#2e4b7a]" />
                        {session.startsAt.split(" • ")[1] || "WIB"}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 w-full md:w-auto self-stretch md:self-center flex items-center">
                    {!isCancelled &&
                      (reported ? (
                        <Link href={`/app/tentor/laporan-harian?editSessionId=${session.id}`} className="w-full">
                          <Button variant="ghost" className="w-full text-xs justify-center py-2 px-4">
                            Lihat Laporan
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/app/tentor/laporan-harian?sessionId=${session.id}`} className="w-full">
                          <Button variant="primary" className="w-full text-xs justify-center py-2 px-4">
                            Tulis Laporan
                          </Button>
                        </Link>
                      ))}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-[#E5DDD0] flex flex-col items-start gap-3">
            <History className="text-[#535761]" size={28} />
            <div>
              <h3 className="font-bold text-[#14233a] text-sm">Belum Ada Riwayat</h3>
              <p className="text-xs text-[#535761] mt-1">Belum ada sesi selesai atau dibatalkan.</p>
            </div>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={!!cancelTarget}
        title="Batalkan Jadwal?"
        message="Sesi akan dibatalkan dan pindah ke Riwayat. Kamu tetap bisa membuat jadwal pengganti."
        confirmLabel={confirmBusy ? "Membatalkan..." : "Batalkan"}
        cancelLabel="Tutup"
        icon={<Ban size={20} strokeWidth={2.25} />}
        onConfirm={() => void confirmCancel()}
        onCancel={() => setCancelTarget(null)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Jadwal?"
        message={
          deleteTarget
            ? `Sesi ${deleteTarget.murid?.name || "siswa"} akan dihapus permanen dan tidak bisa dikembalikan.`
            : ""
        }
        confirmLabel={confirmBusy ? "Menghapus..." : "Hapus"}
        cancelLabel="Batal"
        danger
        icon={<Trash2 size={20} strokeWidth={2.25} />}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
