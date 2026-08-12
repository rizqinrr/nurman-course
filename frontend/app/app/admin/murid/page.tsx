"use client";

import { FormEvent, useCallback, useEffect, useState, useRef } from "react";
import { Edit3, Plus, Search, UserRound, XCircle, Camera, Trash2, KeyRound, Copy, Check } from "lucide-react";
import { createMuridSchema } from "@nurman-course/shared";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { apiFetch } from "@/lib/api";
import { Murid } from "@/data/lms";

interface AdminMurid extends Murid {
  birthDate?: string | null;
  address?: string | null;
  registeredAt?: string | null;
  active?: boolean;
  photoPath?: string | null;
  wali?: {
    id: string;
    name: string;
    email?: string | null;
    phone: string;
  } | null;
  _count?: {
    enrollments: number;
    sessions: number;
  };
}

interface MuridForm {
  name: string;
  birthDate: string;
  schoolLevel: string;
  address: string;
  registeredAt: string;
  photoPath: string; // Base64 data URI
  waliName: string;
  waliPhone: string;
  waliEmail: string;
  active: boolean;
}

const emptyForm: MuridForm = {
  name: "",
  birthDate: "",
  schoolLevel: "",
  address: "",
  registeredAt: new Date().toISOString().slice(0, 10),
  photoPath: "",
  waliName: "",
  waliPhone: "",
  waliEmail: "",
  active: true,
};

function toForm(murid: AdminMurid): MuridForm {
  return {
    name: murid.name,
    birthDate: murid.birthDate ? murid.birthDate.slice(0, 10) : "",
    schoolLevel: murid.schoolLevel || "",
    address: murid.address || "",
    registeredAt: murid.registeredAt ? murid.registeredAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
    photoPath: murid.photoPath || "",
    waliName: murid.wali?.name || "",
    waliPhone: murid.wali?.phone || "",
    waliEmail: murid.wali?.email || "",
    active: murid.active !== false,
  };
}

function ageFromBirthDate(birthDate?: string | null): string {
  if (!birthDate) return "-";
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return "-";
  const age = Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  return `${Math.max(0, age)} th`;
}

export default function AdminMuridPage() {
  const [murids, setMurids] = useState<AdminMurid[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingMurid, setEditingMurid] = useState<AdminMurid | null>(null);
  const [selectedMurid, setSelectedMurid] = useState<AdminMurid | null>(null);
  const [form, setForm] = useState<MuridForm>(emptyForm);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<AdminMurid | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminMurid | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [lastTempPassword, setLastTempPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const loadMurids = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiFetch<{ data: AdminMurid[] }>(
        `/api/admin/murids?search=${encodeURIComponent(search)}`,
      );
      // Backend response keys might vary, let's map safely
      // In backend /api/admin/murids maps to response.data or response.murids
      const responseData = (response as Record<string, unknown>).data as AdminMurid[] | undefined || (response as Record<string, unknown>).murids as AdminMurid[] | undefined;
      setMurids(responseData || []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat murid.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadMurids();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadMurids, search]);

  const resetForm = () => {
    setEditingMurid(null);
    setForm(emptyForm);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEdit = (murid: AdminMurid) => {
    setEditingMurid(murid);
    setForm(toForm(murid));
    setSelectedMurid(null);
    setNotice(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Format file harus berupa gambar.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          setForm((prev) => ({ ...prev, photoPath: dataUrl }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setNotice(null);

    const payload = {
      name: form.name,
      birthDate: form.birthDate || null,
      schoolLevel: form.schoolLevel,
      address: form.address,
      registeredAt: form.registeredAt,
      active: form.active,
      waliName: form.waliName,
      waliPhone: form.waliPhone,
      waliEmail: form.waliEmail || null,
      photoPath: form.photoPath || null,
    };
    const parsed = createMuridSchema.safeParse(payload);

    if (!parsed.success) {
      setErrorMessage(parsed.error.issues[0]?.message || "Data murid belum valid.");
      return;
    }

    setSaving(true);
    try {
      const path = editingMurid ? `/api/admin/murids/${editingMurid.id}` : "/api/admin/murids";
      const method = editingMurid ? "PATCH" : "POST";
      const response = await apiFetch<{ data: AdminMurid; defaultPassword?: string; waliCreated?: boolean }>(path, {
        method,
        body: JSON.stringify(parsed.data),
      });

      let noticeMsg = editingMurid ? "Murid berhasil diperbarui." : "Murid berhasil dibuat.";
      if (response.waliCreated && response.defaultPassword) {
        noticeMsg += ` Akun wali otomatis dibuat dengan password default: ${response.defaultPassword}`;
      }

      setNotice(noticeMsg);
      resetForm();
      await loadMurids();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan murid.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = (murid: AdminMurid) => {
    setErrorMessage(null);
    setNotice(null);
    setDeactivateTarget(murid);
  };

  const confirmDeactivate = async () => {
    if (!deactivateTarget) return;
    const murid = deactivateTarget;
    setDeactivateTarget(null);
    try {
      await apiFetch(`/api/admin/murids/${murid.id}`, { method: "DELETE" });
      setNotice("Murid berhasil dinonaktifkan.");
      if (editingMurid?.id === murid.id) resetForm();
      if (selectedMurid?.id === murid.id) setSelectedMurid(null);
      await loadMurids();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menonaktifkan murid.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const murid = deleteTarget;
    setDeleteTarget(null);
    setDeleting(true);
    try {
      await apiFetch(`/api/admin/murids/${murid.id}?force=1`, { method: "DELETE" });
      setNotice("Murid berhasil dihapus permanen.");
      if (editingMurid?.id === murid.id) resetForm();
      if (selectedMurid?.id === murid.id) setSelectedMurid(null);
      await loadMurids();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menghapus murid.");
    } finally {
      setDeleting(false);
    }
  };

  const handleResetPassword = async (murid: AdminMurid) => {
    if (!murid.wali?.id) {
      setErrorMessage("Wali belum terhubung, tidak bisa reset password.");
      return;
    }
    const input = window.prompt(`Reset password akun Wali ${murid.wali.name} (default 12345678). Kosongkan untuk default:`, "12345678");
    if (input === null) return;
    setErrorMessage(null);
    setNotice(null);
    setLastTempPassword(null);
    try {
      const body = input.trim() === "" ? {} : { password: input.trim() };
      const res = await apiFetch<{ temporaryPassword: string }>(`/api/admin/users/${murid.wali.id}/reset-password`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      setLastTempPassword(res.temporaryPassword);
      setNotice(`Password akun Wali ${murid.wali.name} direset ke ${res.temporaryPassword}.`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal reset password.");
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full flex-grow flex flex-col gap-6">
      <PageHeader
        title="Murid"
        subtitle="Kelola data murid beserta akun wali penanggung jawabnya."
        showBack={false}
      />

      {errorMessage && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}
      {notice && (
        <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 whitespace-pre-line">
          {notice}
        </div>
      )}
      {lastTempPassword && (
        <div role="status" className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-800 flex items-center justify-between gap-2">
          <span>Password Wali: <code className="rounded bg-white px-1.5 py-0.5 font-mono text-sky-900">{lastTempPassword}</code> — default <code>12345678</code> jika kosong. Bagikan ke wali; login pakai No WA + password ini di <code>/login</code>.</span>
          <button type="button" onClick={() => handleCopy(lastTempPassword, "temp-pw")} className="shrink-0 rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold ring-1 ring-sky-200 hover:bg-sky-50 inline-flex items-center gap-1">
            {copied === "temp-pw" ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />} Salin
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="flex flex-col gap-4">
          <GlassCard className="p-4">
            <div className="relative">
              <span className="sr-only">Cari murid</span>
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama murid atau wali..."
                className="w-full rounded-xl border border-gray-200 bg-white/80 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-[#4a70a9]"
              />
            </div>
          </GlassCard>

          {loading ? (
            <GlassCard className="p-8 text-center text-sm font-medium text-gray-600">Memuat daftar murid...</GlassCard>
          ) : murids.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <UserRound size={28} className="mx-auto text-gray-400" />
              <h2 className="mt-3 font-bold text-gray-800">Belum ada murid</h2>
              <p className="mt-1 text-sm text-gray-500">Tambahkan murid dari form di samping.</p>
            </GlassCard>
          ) : (
            <div className="grid gap-4">
              {murids.map((murid) => (
                <GlassCard key={murid.id} className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3 min-w-0">
                      {murid.photoPath ? (
                        <img src={murid.photoPath} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white/70" />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4a70a9]/15 text-[#4a70a9]">
                          <UserRound size={22} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-bold text-gray-800">{murid.name}</h2>
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${murid.active === false ? "bg-gray-200 text-gray-600" : "bg-emerald-100 text-emerald-700"}`}>
                            {murid.active === false ? "Nonaktif" : "Aktif"}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span>Wali: {murid.wali?.name || "-"} ({murid.wali?.phone || "-"})</span>
                          {murid.schoolLevel && <span>{murid.schoolLevel}</span>}
                          <span>Usia: {ageFromBirthDate(murid.birthDate)}</span>
                          {murid.address && <span className="truncate max-w-xs">{murid.address}</span>}
                        </div>
                        {murid._count && (
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
                            <span className="rounded-lg bg-white/70 px-2.5 py-1">{murid._count.enrollments} enrollment</span>
                            <span className="rounded-lg bg-white/70 px-2.5 py-1">{murid._count.sessions} sesi</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedMurid(murid)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white/70 px-3 py-2 text-xs font-bold text-gray-700 ring-1 ring-gray-200 hover:bg-white"
                      >
                        Detail
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(murid)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white/70 px-3 py-2 text-xs font-bold text-gray-700 ring-1 ring-gray-200 hover:bg-white"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleResetPassword(murid)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100"
                      >
                        <KeyRound size={14} /> Reset PW
                      </button>
                      {murid.active !== false && (
                        <button
                          type="button"
                          onClick={() => void handleDeactivate(murid)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-2 text-xs font-bold text-orange-600 ring-1 ring-orange-100 hover:bg-orange-100"
                        >
                          <XCircle size={14} /> Nonaktifkan
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(murid)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 ring-1 ring-red-100 hover:bg-red-100"
                      >
                        <Trash2 size={14} /> Hapus
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </section>

        <GlassCard className="h-fit p-5 xl:sticky xl:top-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-gray-800">{editingMurid ? "Edit Murid" : "Murid Baru"}</h2>
              <p className="mt-1 text-xs text-gray-500">Akun wali akan dibuat/diperbarui otomatis.</p>
            </div>
            {editingMurid && (
              <button type="button" onClick={resetForm} className="rounded-lg p-2 text-gray-400 hover:bg-white/70 hover:text-gray-700" aria-label="Batal edit">
                <XCircle size={18} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Foto Section */}
            <div className="flex flex-col items-center gap-2 pb-2 border-b border-gray-100">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {form.photoPath ? (
                  <img src={form.photoPath} alt="Preview" className="h-20 w-20 rounded-full object-cover border-2 border-[#4a70a9]/35" />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 group-hover:border-[#4a70a9] transition-colors">
                    <Camera size={24} />
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-white font-bold">Ubah Foto</span>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <span className="text-[10px] text-gray-500 font-medium">Format JPEG/PNG, Max 1MB</span>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#4a70a9]">Informasi Murid</h3>
              
              <label className="block text-xs font-bold text-gray-700">Nama Lengkap Murid
                <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]" placeholder="Contoh: Budi Santoso" />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-bold text-gray-700">Tanggal Lahir
                  <input type="date" value={form.birthDate} onChange={(event) => setForm({ ...form, birthDate: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]" />
                </label>
                <label className="block text-xs font-bold text-gray-700">Kelas / Jenjang
                  <input required value={form.schoolLevel} onChange={(event) => setForm({ ...form, schoolLevel: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]" placeholder="contoh: SD Kelas 2" />
                </label>
              </div>

              <label className="block text-xs font-bold text-gray-700">Alamat Rumah
                <textarea required value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#4a70a9]" rows={2} placeholder="Alamat lengkap rumah..." />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-xs font-bold text-gray-700">Tanggal Daftar
                  <input type="date" required value={form.registeredAt} onChange={(event) => setForm({ ...form, registeredAt: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]" />
                </label>
                <label className="block text-xs font-bold text-gray-700">Status
                  <select value={form.active ? "true" : "false"} onChange={(event) => setForm({ ...form, active: event.target.value === "true" })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]">
                    <option value="true">Aktif</option>
                    <option value="false">Nonaktif</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#4a70a9]">Informasi Wali Murid</h3>

              <label className="block text-xs font-bold text-gray-700">Nama Lengkap Wali
                <input required value={form.waliName} onChange={(event) => setForm({ ...form, waliName: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]" placeholder="Nama orang tua / wali..." />
              </label>

              <label className="block text-xs font-bold text-gray-700">Nomor WhatsApp Wali
                <input required value={form.waliPhone} onChange={(event) => setForm({ ...form, waliPhone: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]" placeholder="Contoh: 081234567890" />
              </label>

              <label className="block text-xs font-bold text-gray-700">Email Wali (Opsional)
                <input type="email" value={form.waliEmail} onChange={(event) => setForm({ ...form, waliEmail: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]" placeholder="wali@email.com" />
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              {editingMurid && <Button type="button" variant="ghost" onClick={resetForm} className="flex-1">Batal</Button>}
              <Button type="submit" disabled={saving} className="flex-1 justify-center inline-flex items-center gap-2"><Plus size={16} /> {saving ? "Menyimpan..." : editingMurid ? "Simpan Perubahan" : "Tambah"}</Button>
            </div>
          </form>
        </GlassCard>
      </div>

      {selectedMurid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 print:hidden" role="dialog" aria-modal="true" onClick={() => setSelectedMurid(null)}>
          <div className="w-full max-w-lg" onClick={(event) => event.stopPropagation()}>
            <GlassCard className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {selectedMurid.photoPath ? (
                  <img src={selectedMurid.photoPath} alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-[#4a70a9]/30" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#4a70a9]/15 text-[#4a70a9]">
                    <UserRound size={26} />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{selectedMurid.name}</h2>
                  <p className="text-xs text-gray-500">Wali: {selectedMurid.wali?.name || "-"}{selectedMurid.wali?.phone ? ` · ${selectedMurid.wali.phone}` : ""}</p>
                </div>
              </div>
              <button type="button" onClick={() => setSelectedMurid(null)} className="rounded-lg p-2 text-gray-400 hover:bg-white/70 hover:text-gray-700" aria-label="Tutup detail">
                <XCircle size={18} />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white/60 p-3 col-span-2">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Alamat</p>
                <p className="mt-1 font-semibold text-gray-800">{selectedMurid.address || "-"}</p>
              </div>
              <div className="rounded-xl bg-white/60 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Jenjang</p>
                <p className="mt-1 font-semibold text-gray-800">{selectedMurid.schoolLevel || "-"}</p>
              </div>
              <div className="rounded-xl bg-white/60 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Tanggal Lahir</p>
                <p className="mt-1 font-semibold text-gray-800">{selectedMurid.birthDate ? new Date(selectedMurid.birthDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}</p>
              </div>
              <div className="rounded-xl bg-white/60 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Email Wali</p>
                <p className="mt-1 font-semibold text-gray-800 truncate">{selectedMurid.wali?.email || "-"}</p>
              </div>
              <div className="rounded-xl bg-white/60 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Tanggal Daftar</p>
                <p className="mt-1 font-semibold text-gray-800">{selectedMurid.registeredAt ? new Date(selectedMurid.registeredAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}</p>
              </div>
              <div className="rounded-xl bg-white/60 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Enrollment</p>
                <p className="mt-1 font-semibold text-gray-800">{selectedMurid._count?.enrollments ?? "-"}</p>
              </div>
              <div className="rounded-xl bg-white/60 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Sesi</p>
                <p className="mt-1 font-semibold text-gray-800">{selectedMurid._count?.sessions ?? "-"}</p>
              </div>
            </div>
            </GlassCard>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deactivateTarget}
        title="Nonaktifkan Murid?"
        message={deactivateTarget ? `Murid ${deactivateTarget.name} tidak dapat login dan tidak ditampilkan di daftar aktif. Data tetap tersimpan.` : undefined}
        confirmLabel="Nonaktifkan"
        danger
        onCancel={() => setDeactivateTarget(null)}
        onConfirm={() => void confirmDeactivate()}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Murid Permanen?"
        message={
          deleteTarget
            ? `Hapus permanen murid ${deleteTarget.name}? Data terkait akan ikut terhapus: ${deleteTarget._count?.enrollments ?? 0} enrollment, ${deleteTarget._count?.sessions ?? 0} sesi (beserta laporan & tagihan). Tindakan ini tidak dapat dibatalkan.`
            : undefined
        }
        confirmLabel={deleting ? "Menghapus..." : "Hapus"}
        danger
        icon={<Trash2 size={20} strokeWidth={2.25} />}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
