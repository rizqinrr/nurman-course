"use client";

import { useState, useEffect, useCallback } from "react";
import { Murid, Program } from "@/data/lms";
import { apiFetch } from "@/lib/api";
import { addOneHour } from "@/utils/format";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  CalendarDays, Clock, MapPin, BookOpen,
  CheckCircle2, AlertTriangle, History, Plus, X, Edit3, Trash2, GraduationCap, Ban,
} from "lucide-react";

const formatSessionDateTime = (isoString: string) => {
  try {
    const d = new Date(isoString);
    const dateStr = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(d);
    const timeStr = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", hour12: false }).format(d);
    return `${dateStr} • ${timeStr} WIB`;
  } catch { return isoString; }
};

interface AdminSession {
  id: string;
  muridId: string;
  programId: string;
  status: "scheduled" | "completed" | "cancelled";
  startsAt: string;
  endsAt: string;
  location?: string | null;
  murid?: Murid;
  program?: Program;
  tentor?: { id: string; name: string };
  dailyReport?: { id: string } | null;
}

interface EnrollmentWithRelations {
  id: string;
  muridId: string;
  programId: string;
  murid?: Murid & { address?: string | null };
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

const emptyForm: JadwalForm = { enrollmentId: "", date: new Date().toISOString().slice(0,10), startTime: "15:00", endTime: "16:00", location: "" };

export default function AdminJadwalPage() {
  const [loading, setLoading] = useState(true);
  const [sessionsDataRaw, setSessionsDataRaw] = useState<AdminSession[]>([]);
  const [sessionsFormatted, setSessionsFormatted] = useState<AdminSession[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentWithRelations[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<AdminSession | null>(null);
  const [form, setForm] = useState<JadwalForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<AdminSession | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminSession | null>(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [sessionsRes, enrollmentsRes] = await Promise.all([
        apiFetch<{ data: AdminSession[] }>("/api/admin/sessions"),
        apiFetch<{ data: EnrollmentWithRelations[] }>("/api/admin/enrollments?status=active").catch(() => ({ data: [] as EnrollmentWithRelations[] })),
      ]);

      setSessionsDataRaw(sessionsRes.data);
      const mapped = (sessionsRes.data || []).map((s) => ({
        ...s,
        startsAt: formatSessionDateTime(s.startsAt),
        endsAt: formatSessionDateTime(s.endsAt),
      }));
      setSessionsFormatted(mapped);
      setEnrollments(enrollmentsRes.data || []);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Gagal memuat jadwal");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  const nowMs = Date.now();
  const passedIds = new Set(
    sessionsDataRaw.filter((s) => new Date(s.endsAt).getTime() <= nowMs).map((s) => s.id),
  );
  const upcomingSessions = sessionsFormatted
    .filter((s) => s.status === "scheduled" && !passedIds.has(s.id))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const pastSessions = sessionsFormatted
    .filter((s) => s.status !== "scheduled" || passedIds.has(s.id))
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt));

  const openCreate = () => {
    setEditingSession(null);
    const firstEnr = enrollments[0];
    setForm({
      enrollmentId: firstEnr?.id || "",
      date: new Date().toISOString().slice(0,10),
      startTime: "15:00",
      endTime: "16:00",
      location: firstEnr?.murid?.address || "",
    });
    setShowForm(true);
    setErrorMsg(null);
  };

  const openEdit = (s: AdminSession) => {
    const raw = sessionsDataRaw.find((r: AdminSession) => r.id === s.id);
    if (!raw) return;
    const d = new Date(raw.startsAt);
    const date = raw.startsAt.slice(0,10);
    const st = `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
    const edD = new Date(raw.endsAt);
    const et = `${String(edD.getHours()).padStart(2,"0")}:${String(edD.getMinutes()).padStart(2,"0")}`;
    const linkedEnr = enrollments.find(e => e.muridId === raw.muridId && e.programId === raw.programId);
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
      setErrorMsg("Pilih murid/program (enrollment)");
      return;
    }
    if (form.startTime >= form.endTime) {
      setErrorMsg("Jam selesai harus setelah jam mulai");
      return;
    }
    setSaving(true);
    try {
      if (editingSession) {
        await apiFetch<{ data: AdminSession }>(`/api/admin/sessions/${editingSession.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            date: form.date,
            startTime: form.startTime,
            endTime: form.endTime,
            location: form.location || null,
          }),
        });
        setNotice("Jadwal berhasil diperbarui");
      } else {
        await apiFetch<{ data: AdminSession }>(`/api/admin/sessions`, {
          method: "POST",
          body: JSON.stringify({
            enrollmentId: form.enrollmentId,
            date: form.date,
            startTime: form.startTime,
            endTime: form.endTime,
            location: form.location || null,
          }),
        });
        setNotice("Jadwal berhasil dibuat. Muncul di dashboard tentor & wali murid.");
      }
      setShowForm(false);
      setEditingSession(null);
      setForm(emptyForm);
      await loadData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal simpan jadwal";
      setErrorMsg(msg.includes("404") ? `Backend belum restart — endpoint baru belum aktif. Jalankan: npm run dev --workspace=backend. Detail: ${msg}` : msg);
    } finally {
      setSaving(false);
    }
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    const id = cancelTarget.id;
    setConfirmBusy(true);
    try {
      await apiFetch(`/api/admin/sessions/${id}`, { method: "PATCH", body: JSON.stringify({ status: "cancelled" }) });
      setNotice("Sesi dibatalkan");
      setCancelTarget(null);
      await loadData();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal batalkan");
    } finally {
      setConfirmBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setConfirmBusy(true);
    try {
      await apiFetch(`/api/admin/sessions/${id}`, { method: "DELETE" });
      setNotice("Jadwal dihapus");
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal hapus");
    } finally {
      setConfirmBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full flex-grow flex flex-col justify-center items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-white/20 border-t-[#4a70a9] animate-spin" />
        <div className="text-gray-500 font-semibold animate-pulse">Memuat jadwal...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full flex-grow flex flex-col gap-5 sm:gap-6 pb-32 animate-[fadeIn_0.5s_ease-out]">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[20px] bg-white/45 backdrop-blur-xl border border-white/60 shadow-sm p-4 sm:p-5">
        <div>
          <h1 className="text-[22px] sm:text-3xl font-extrabold text-gray-900 tracking-tight">Jadwal Mengajar</h1>
          <p className="text-[12px] sm:text-sm text-gray-600 leading-relaxed mt-0.5">Kelola jadwal seluruh murid • Muncul di dashboard tentor & wali murid</p>
        </div>
        <Button onClick={openCreate} disabled={enrollments.length===0} className="inline-flex items-center gap-2 justify-center h-11 px-5 rounded-xl text-sm">
          <Plus size={18} /> Buat Jadwal
        </Button>
      </header>

      {errorMsg && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</div>}
      {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</div>}
      {enrollments.length===0 && (
        <GlassCard className="p-4 border border-amber-200 bg-amber-50/60">
          <p className="text-sm text-amber-800"><AlertTriangle size={14} className="inline mr-1" /> Belum ada enrollment aktif. Buat dulu di <span className="font-bold">/app/admin/enrollment</span>.</p>
        </GlassCard>
      )}

      {showForm && (
        <GlassCard className="p-5 border border-white/80 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">{editingSession ? "Edit Jadwal" : "Buat Jadwal Baru"}</h3>
            <button onClick={() => { setShowForm(false); setEditingSession(null); }} className="p-2 rounded-lg hover:bg-white/60"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!editingSession && (
              <label className="block text-xs font-bold text-gray-700">
                Murid & Program (enrollment)
                <select required value={form.enrollmentId} onChange={(e) => {
                  const enr = enrollments.find(x => x.id === e.target.value);
                  setForm({ ...form, enrollmentId: e.target.value, location: enr?.murid?.address || form.location });
                }} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm outline-none focus:border-[#4a70a9]">
                  <option value="">Pilih murid...</option>
                  {enrollments.map((enr) => (
                    <option key={enr.id} value={enr.id}>{enr.murid?.name || enr.muridId} • {enr.program?.name || enr.programId}{enr.tentor ? ` (Tentor: ${enr.tentor.name})` : ""}</option>
                  ))}
                </select>
              </label>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="block text-xs font-bold text-gray-700">Tanggal
                <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm outline-none focus:border-[#4a70a9]" />
              </label>
              <label className="block text-xs font-bold text-gray-700">Jam Mulai
                <input type="time" required value={form.startTime} onChange={(e) => { const v = e.target.value; setForm((f) => ({ ...f, startTime: v, endTime: v ? addOneHour(v) : f.endTime })); }} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm outline-none focus:border-[#4a70a9]" />
              </label>
              <label className="block text-xs font-bold text-gray-700">Jam Selesai
                <input type="time" required value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm outline-none focus:border-[#4a70a9]" />
              </label>
            </div>
            <label className="block text-xs font-bold text-gray-700">Lokasi (opsional, default alamat murid)
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Contoh: Rumah murid Jl..." className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm outline-none focus:border-[#4a70a9]" />
            </label>
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditingSession(null); }} className="flex-1 justify-center">Batal</Button>
              <Button type="submit" disabled={saving} className="flex-1 justify-center gap-2">{saving ? "Menyimpan..." : editingSession ? "Simpan" : "Buat Jadwal"}</Button>
            </div>
          </form>
        </GlassCard>
      )}

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-white/40 pb-2">
          <CalendarDays size={20} className="text-[#4a70a9]" />
          <span>Sesi Mendatang</span>
          <span className="ml-1 rounded-full bg-[#4a70a9]/10 px-2 py-0.5 text-[10px] text-[#4a70a9]">{upcomingSessions.length}</span>
        </h3>
        {upcomingSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingSessions.map((session) => {
              const murid = session.murid || { name: "Siswa", schoolLevel: "SD" } as any;
              const program = session.program || { id: session.programId, name: "Program Bimbingan" } as any;
              return (
                <GlassCard key={session.id} className="p-5 flex flex-col justify-between gap-4 border border-white/80 shadow-sm">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5"><Clock size={12} />{session.startsAt.split(" • ")[0]}</span>
                      <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-[#4a70a9] rounded-full text-[10px] font-bold uppercase">Terjadwal</span>
                    </div>
                    <h4 className="font-bold text-gray-800 text-base">{murid.name}</h4>
                    <div className="flex flex-col gap-1.5 text-xs text-gray-500 mt-2">
                      <div className="flex items-center gap-1.5"><BookOpen size={14} className="text-[#4a70a9] shrink-0" /><span>{program?.name} • {(murid as any).schoolLevel || "-"}</span></div>
                      <div className="flex items-center gap-1.5"><Clock size={14} className="text-[#4a70a9] shrink-0" /><span>{session.startsAt.split(" • ")[1] || "WIB"} - {session.endsAt.split(" • ")[1] || ""}</span></div>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200/30">
                      <MapPin size={14} className="text-[#4a70a9] shrink-0 mt-0.5" /><span>{session.location || "-"}</span>
                    </div>
                    {session.tentor && <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-500"><GraduationCap size={12} className="text-[#4a70a9]" /> Tentor: {session.tentor.name}</div>}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Button variant="ghost" onClick={() => openEdit(session)} className="justify-center text-xs py-2 gap-1"><Edit3 size={14} /> Edit</Button>
                    <Button variant="ghost" onClick={() => setCancelTarget(session)} className="justify-center text-xs py-2 gap-1 border-amber-200 text-amber-700 hover:bg-amber-50"><Ban size={14} /> Batalkan</Button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setDeleteTarget(session)} className="w-full text-[11px] font-semibold text-red-500 hover:text-red-700 flex items-center justify-center gap-1 py-1"><Trash2 size={12} /> Hapus</button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        ) : (
          <GlassCard className="p-6 border border-white/60 shadow-sm flex flex-col items-start gap-3">
            <CalendarDays className="text-[#4a70a9]" size={32} />
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Tidak Ada Sesi Mendatang</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">Buat jadwal baru lewat tombol Buat Jadwal. Pilih enrollment murid yang aktif.</p>
            </div>
            {enrollments.length>0 && <Button onClick={openCreate} variant="ghost" className="mt-1 text-xs gap-2 border border-[#4a70a9]/20"><Plus size={14} /> Buat Jadwal Sekarang</Button>}
          </GlassCard>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-white/40 pb-2">
          <History size={20} className="text-gray-500" />
          <span>Riwayat</span>
          <span className="ml-1 rounded-full bg-white/60 px-2 py-0.5 text-[10px] text-gray-500">{pastSessions.length}</span>
        </h3>
        {pastSessions.length > 0 ? (
          <div className="flex flex-col gap-3">
            {pastSessions.map((session) => {
              const murid = session.murid || { name: "Siswa" } as any;
              const program = session.program || { id: session.programId, name: "Program" } as any;
              const reported = Boolean(session.dailyReport?.id);
              const isCancelled = session.status === "cancelled";
              return (
                <GlassCard key={session.id} className="p-4 border border-white/80 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-2.5 mb-2">
                      <span className="text-xs sm:text-sm font-bold text-gray-800">{session.startsAt.split(" • ")[0]}</span>
                      {isCancelled ? <span className="px-2.5 py-0.5 bg-gray-100 border text-gray-600 rounded-full text-[10px] font-bold uppercase">Dibatalkan</span> : reported ? <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full text-[10px] font-bold uppercase flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" />Selesai</span> : <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-100 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 animate-pulse"><AlertTriangle size={12} />Butuh Laporan</span>}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><BookOpen size={13} className="text-[#4a70a9]" /><span className="font-semibold text-gray-700">{murid.name}</span></span>
                      <span>{program?.name}</span>
                      <span className="flex items-center gap-1"><Clock size={13} className="text-[#4a70a9]" />{session.startsAt.split(" • ")[1] || "WIB"}</span>
                      {session.tentor && <span className="flex items-center gap-1"><GraduationCap size={13} className="text-[#4a70a9]" />{session.tentor.name}</span>}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        ) : (
          <GlassCard className="p-6 border border-white/60 flex flex-col items-start gap-3">
            <History className="text-gray-400" size={32} />
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Belum Ada Riwayat</h4>
              <p className="text-xs text-gray-500 mt-1">Belum ada sesi selesai/dibatalkan.</p>
            </div>
          </GlassCard>
        )}
      </section>

      <ConfirmDialog
        open={!!cancelTarget}
        title="Batalkan Jadwal?"
        message="Sesi akan dibatalkan dan pindah ke Riwayat. Anda tetap bisa membuat ulang jika perlu."
        confirmLabel={confirmBusy ? "Membatalkan..." : "Batalkan"}
        cancelLabel="Tutup"
        icon={<Ban size={20} strokeWidth={2.25} />}
        onConfirm={() => void confirmCancel()}
        onCancel={() => setCancelTarget(null)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Jadwal?"
        message={deleteTarget ? `Sesi ${deleteTarget.murid?.name || "murid"} akan dihapus permanen dan tidak bisa dikembalikan.` : ""}
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
