"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Camera, Copy, Check, Edit3, KeyRound, Plus, Search, UserRound, XCircle, Trash2 } from "lucide-react";
import { createUserSchema } from "@nurman-course/shared";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { apiFetch, buildQuery } from "@/lib/api";
import { User } from "@/data/lms";

interface AdminTutor extends User {
  createdAt?: string;
  address?: string | null;
  photoPath?: string | null;
  _count?: {
    murids: number;
    sessions: number;
  };
}

interface TutorForm {
  name: string;
  phone: string;
  email: string;
  address: string;
  photoPath: string;
  password: string;
}

const emptyForm: TutorForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  photoPath: "",
  password: "",
};

function toForm(tutor: AdminTutor): TutorForm {
  return {
    name: tutor.name,
    phone: tutor.phone,
    email: tutor.email || "",
    address: (tutor as any).address || "",
    photoPath: (tutor as any).photoPath || "",
    password: "",
  };
}

export default function AdminTutorPage() {
  const [tutors, setTutors] = useState<AdminTutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [editingTutor, setEditingTutor] = useState<AdminTutor | null>(null);
  const [selectedTutor, setSelectedTutor] = useState<AdminTutor | null>(null);
  const [form, setForm] = useState<TutorForm>(emptyForm);
  const [lastTempPassword, setLastTempPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<AdminTutor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminTutor | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadTutors = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiFetch<{ data: AdminTutor[] }>(
        `/api/admin/users${buildQuery({ search, role: "tentor", active: activeFilter })}`,
      );
      setTutors(response.data || []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat tentor.");
    } finally {
      setLoading(false);
    }
  }, [activeFilter, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadTutors();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadTutors]);

  const resetForm = () => {
    setEditingTutor(null);
    setForm(emptyForm);
    setLastTempPassword(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = (tutor: AdminTutor) => {
    setEditingTutor(tutor);
    setForm(toForm(tutor));
    setSelectedTutor(null);
    setNotice(null);
    setLastTempPassword(null);
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
    setLastTempPassword(null);

    const payload = {
      role: "tentor" as const,
      name: form.name,
      phone: form.phone,
      email: form.email.trim() ? form.email : null,
      address: form.address.trim() ? form.address.trim() : null,
      photoPath: form.photoPath ? form.photoPath : null,
      ...(editingTutor ? {} : form.password ? { password: form.password } : {}),
    };

    const parsed = createUserSchema.safeParse(payload);

    if (!parsed.success) {
      setErrorMessage(parsed.error.issues[0]?.message || "Data tentor belum valid.");
      return;
    }

    setSaving(true);
    try {
      if (editingTutor) {
        await apiFetch<{ data: AdminTutor }>(`/api/admin/users/${editingTutor.id}`, {
          method: "PATCH",
          body: JSON.stringify(parsed.data),
        });
        setNotice("Data tentor berhasil diperbarui.");
      } else {
        const response = await apiFetch<{ data: AdminTutor; temporaryPassword?: string }>("/api/admin/users", {
          method: "POST",
          body: JSON.stringify(parsed.data),
        });
        if (response.temporaryPassword) {
          setLastTempPassword(response.temporaryPassword);
        }
        setNotice("Akun tentor berhasil dibuat. Password default 12345678 jika dikosongkan. Login via No WA + 12345678 di /login.");
      }
      resetForm();
      await loadTutors();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan tentor.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = (tutor: AdminTutor) => {
    setErrorMessage(null);
    setNotice(null);
    setDeactivateTarget(tutor);
  };

  const confirmDeactivate = async () => {
    if (!deactivateTarget) return;
    const tutor = deactivateTarget;
    setDeactivateTarget(null);
    try {
      await apiFetch(`/api/admin/users/${tutor.id}`, { method: "DELETE" });
      setNotice("Tentor berhasil dinonaktifkan.");
      if (editingTutor?.id === tutor.id) resetForm();
      if (selectedTutor?.id === tutor.id) setSelectedTutor(null);
      await loadTutors();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menonaktifkan tentor.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const tutor = deleteTarget;
    setDeleteTarget(null);
    setDeleting(true);
    try {
      await apiFetch(`/api/admin/users/${tutor.id}?force=1`, { method: "DELETE" });
      setNotice("Tentor berhasil dihapus permanen.");
      if (editingTutor?.id === tutor.id) resetForm();
      if (selectedTutor?.id === tutor.id) setSelectedTutor(null);
      await loadTutors();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menghapus tentor.");
    } finally {
      setDeleting(false);
    }
  };

  const handleResetPassword = async (tutor: AdminTutor) => {
    const input = window.prompt(`Reset password untuk ${tutor.name} (default 12345678). Kosongkan untuk default:`, "12345678");
    if (input === null) return;
    setErrorMessage(null);
    setNotice(null);
    try {
      const body = input.trim() === "" ? {} : { password: input.trim() };
      const res = await apiFetch<{ temporaryPassword: string }>(`/api/admin/users/${tutor.id}/reset-password`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      setLastTempPassword(res.temporaryPassword);
      setNotice(`Password ${tutor.name} direset ke ${res.temporaryPassword}. Bagikan ke tentor untuk login via no WA / email.`);
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
        title="Tentor"
        subtitle="Kelola data tentor, akun login, foto, alamat, dan status mengajar."
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
          <span>Password: <code className="rounded bg-white px-1.5 py-0.5 font-mono text-sky-900">{lastTempPassword}</code> — default <code>12345678</code> jika kosong. Bagikan ke tentor; login pakai No WA + password ini di <code>/login</code>.</span>
          <button type="button" onClick={() => handleCopy(lastTempPassword, "temp-pw")} className="shrink-0 rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold ring-1 ring-sky-200 hover:bg-sky-50 inline-flex items-center gap-1">
            {copied === "temp-pw" ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />} Salin
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="flex flex-col gap-4">
          <GlassCard className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">Cari tentor</span>
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari nama, email, nomor hape, atau alamat..."
                  className="w-full rounded-xl border border-gray-200 bg-white/80 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-[#4a70a9]"
                />
              </label>
              <select
                value={activeFilter}
                onChange={(event) => setActiveFilter(event.target.value)}
                className="rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]"
                aria-label="Filter status tentor"
              >
                <option value="">Semua status</option>
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
          </GlassCard>

          {loading ? (
            <GlassCard className="p-8 text-center text-sm font-medium text-gray-600">Memuat daftar tentor...</GlassCard>
          ) : tutors.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <UserRound size={28} className="mx-auto text-gray-400" />
              <h2 className="mt-3 font-bold text-gray-800">Belum ada tentor</h2>
              <p className="mt-1 text-sm text-gray-500">Tambahkan tentor dari form di samping.</p>
            </GlassCard>
          ) : (
            <div className="grid gap-4">
              {tutors.map((tutor) => (
                <GlassCard key={tutor.id} className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3 min-w-0">
                      {(tutor as any).photoPath ? (
                        <img src={(tutor as any).photoPath} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white/70" />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4a70a9]/15 text-[#4a70a9]">
                          <UserRound size={22} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-bold text-gray-800">{tutor.name}</h2>
                          <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-sky-700">Tentor</span>
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${tutor.active === false ? "bg-gray-200 text-gray-600" : "bg-emerald-100 text-emerald-700"}`}>
                            {tutor.active === false ? "Nonaktif" : "Aktif"}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                          {tutor.email && !tutor.email.includes("@nurmancourse.local") && <span>{tutor.email}</span>}
                          <span>{tutor.phone}</span>
                          {(tutor as any).address && <span className="truncate max-w-[220px]">📍 {(tutor as any).address}</span>}
                        </div>
                        {tutor._count && (
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
                            <span className="rounded-lg bg-white/70 px-2.5 py-1">{tutor._count.murids} murid</span>
                            <span className="rounded-lg bg-white/70 px-2.5 py-1">{tutor._count.sessions} sesi</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2 flex-wrap">
                      <button type="button" onClick={() => setSelectedTutor(tutor)} className="inline-flex items-center gap-1.5 rounded-lg bg-white/70 px-3 py-2 text-xs font-bold text-gray-700 ring-1 ring-gray-200 hover:bg-white">Detail</button>
                      <button type="button" onClick={() => handleEdit(tutor)} className="inline-flex items-center gap-1.5 rounded-lg bg-white/70 px-3 py-2 text-xs font-bold text-gray-700 ring-1 ring-gray-200 hover:bg-white"><Edit3 size={14} /> Edit</button>
                      <button type="button" onClick={() => void handleResetPassword(tutor)} className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100"><KeyRound size={14} /> Reset PW</button>
                      {tutor.active !== false && (
                        <button type="button" onClick={() => void handleDeactivate(tutor)} className="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-2 text-xs font-bold text-orange-600 ring-1 ring-orange-100 hover:bg-orange-100"><XCircle size={14} /> Nonaktif</button>
                      )}
                      <button type="button" onClick={() => setDeleteTarget(tutor)} className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 ring-1 ring-red-100 hover:bg-red-100"><Trash2 size={14} /> Hapus</button>
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
              <h2 className="font-bold text-gray-800">{editingTutor ? "Edit Tentor" : "Tentor Baru"}</h2>
              <p className="mt-1 text-xs text-gray-500">Akun tentor dibuat di sistem login dan database.</p>
            </div>
            {editingTutor && <button type="button" onClick={resetForm} className="rounded-lg p-2 text-gray-400 hover:bg-white/70 hover:text-gray-700" aria-label="Batal edit"><XCircle size={18} /></button>}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <span className="text-[10px] text-gray-500 font-medium">Format JPEG/PNG, Max 1MB — otomatis resize 400x400</span>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#4a70a9]">Data Tentor</h3>

              <label className="block text-xs font-bold text-gray-700">
                Nama Lengkap <span className="text-red-500">*</span>
                <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]" placeholder="Kak Kiki" />
                <span className="mt-1 block text-[10px] font-normal text-gray-500">Tulis nama lengkap sesuai KTP. Min 1 karakter, maks 150.</span>
              </label>

              <label className="block text-xs font-bold text-gray-700">
                Nomor WhatsApp <span className="text-red-500">*</span>
                <input required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]" placeholder="0812xxxx / 62812xxxx" />
                <span className="mt-1 block text-[10px] font-normal text-gray-500">Format Indonesia. Contoh valid: 081234567890 atau 6281234567890. Sistem normalisasi otomatis ke 62... Dapat digunakan untuk login.</span>
              </label>

              <label className="block text-xs font-bold text-gray-700">
                Email <span className="text-gray-400 font-normal">(opsional)</span>
                <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]" placeholder="opsional — kosongkan jika login pakai WA" />
                <span className="mt-1 block text-[10px] font-normal text-gray-500">Opsional. Jika dikosongkan, sistem buat email otomatis {`{nomor}@nurmancourse.local`}. Login dapat pakai nomor WA melalui /api/auth/resolve-phone. Jika diisi, harus format email valid, maks 200 karakter.</span>
              </label>

              <label className="block text-xs font-bold text-gray-700">
                Alamat Domisili <span className="text-gray-400 font-normal">(opsional)</span>
                <textarea value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} rows={2} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9] resize-none" placeholder="Jl. Raya No. 10, Cilacap — opsional" />
                <span className="mt-1 block text-[10px] font-normal text-gray-500">Opsional. Tulis alamat lengkap untuk memudahkan penugasan area. Maks 500 karakter.</span>
              </label>

              {!editingTutor && (
                <label className="block text-xs font-bold text-gray-700">
                  Password Sementara <span className="text-gray-400 font-normal">(opsional, default 12345678)</span>
                  <input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]" placeholder="Kosongkan → 12345678" />
                  <span className="mt-1 block text-[10px] font-normal text-gray-500">Min 6 karakter. Jika kosong, default <b>12345678</b>. Tentor login di /login pakai No WA + password ini (sistem resolve ke email placeholder).</span>
                </label>
              )}
            </div>

            <div className="rounded-xl bg-sky-50/70 border border-sky-100 px-3 py-2.5">
              <p className="text-[11px] font-bold text-sky-800">Ketentuan penulisan & login</p>
              <ul className="mt-1 list-disc pl-4 text-[10px] leading-5 text-sky-700">
                <li>Nomor WA unik, tidak boleh duplikat akun lain. Normalisasi otomatis ke 62... Contoh valid: 0812... / 62812...</li>
                <li>Password default <b>12345678</b> jika dikosongkan saat buat tentor (sebelumnya random). Bisa di-reset per tentor via tombol Reset PW.</li>
                <li>Login tentor: buka <b>/login</b> → isi Email/No WA dengan nomor WA (mis. 0835...) + password 12345678. Backend <code>/api/auth/resolve-phone</code> akan resolve nomor → email placeholder, lalu Supabase <code>signInWithPassword</code>.</li>
                <li>Email unik jika diisi; opsional karena tentor bisa login via nomor WA. Jika kosong, sistem buat <code>{'{nomor}'}@nurmancourse.local</code> dengan email_confirm:true.</li>
                <li>Foto otomatis resize max 400×400 JPEG 80% (Base64) — tidak pakai Supabase Storage seperti murid, max ~2MB string.</li>
              </ul>
            </div>

            <div className="flex gap-2 pt-1">
              {editingTutor && <Button type="button" variant="ghost" onClick={resetForm} className="flex-1">Batal</Button>}
              <Button type="submit" disabled={saving} className="flex-1 justify-center inline-flex items-center gap-2"><Plus size={16} /> {saving ? "Menyimpan..." : editingTutor ? "Simpan Perubahan" : "Tambah"}</Button>
            </div>
          </form>
        </GlassCard>
      </div>

      {selectedTutor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 print:hidden" role="dialog" aria-modal="true" onClick={() => setSelectedTutor(null)}>
          <div className="w-full max-w-lg" onClick={(event) => event.stopPropagation()}>
            <GlassCard className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {(selectedTutor as any).photoPath ? (
                    <img src={(selectedTutor as any).photoPath} alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-white/70" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#4a70a9]/15 text-[#4a70a9]"><UserRound size={26} /></div>
                  )}
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">{selectedTutor.name}</h2>
                    <p className="text-xs text-gray-500">Tentor · {selectedTutor.phone}</p>
                  </div>
                </div>
                <button type="button" onClick={() => setSelectedTutor(null)} className="rounded-lg p-2 text-gray-400 hover:bg-white/70 hover:text-gray-700" aria-label="Tutup detail"><XCircle size={18} /></button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-white/60 p-3 col-span-2"><p className="text-xs font-bold uppercase tracking-wide text-gray-400">Email</p><p className="mt-1 font-semibold text-gray-800 break-all">{selectedTutor.email && !selectedTutor.email.includes("@nurmancourse.local") ? selectedTutor.email : "-"}</p>{selectedTutor.email?.includes("@nurmancourse.local") && <p className="mt-1 text-[10px] text-gray-500">Login via nomor WA (placeholder email)</p>}</div>
                <div className="rounded-xl bg-white/60 p-3 col-span-2"><p className="text-xs font-bold uppercase tracking-wide text-gray-400">Alamat</p><p className="mt-1 font-semibold text-gray-800">{(selectedTutor as any).address || "-"}</p></div>
                <div className="rounded-xl bg-white/60 p-3"><p className="text-xs font-bold uppercase tracking-wide text-gray-400">Status</p><p className="mt-1 font-semibold text-gray-800">{selectedTutor.active === false ? "Nonaktif" : "Aktif"}</p></div>
                <div className="rounded-xl bg-white/60 p-3"><p className="text-xs font-bold uppercase tracking-wide text-gray-400">Bergabung</p><p className="mt-1 font-semibold text-gray-800">{selectedTutor.createdAt ? new Date(selectedTutor.createdAt).toLocaleDateString("id-ID") : "-"}</p></div>
                <div className="rounded-xl bg-white/60 p-3"><p className="text-xs font-bold uppercase tracking-wide text-gray-400">Murid</p><p className="mt-1 font-semibold text-gray-800">{selectedTutor._count?.murids ?? "-"}</p></div>
                <div className="rounded-xl bg-white/60 p-3"><p className="text-xs font-bold uppercase tracking-wide text-gray-400">Sesi</p><p className="mt-1 font-semibold text-gray-800">{selectedTutor._count?.sessions ?? "-"}</p></div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deactivateTarget}
        title="Nonaktifkan Tentor?"
        message={deactivateTarget ? `Tentor ${deactivateTarget.name} tidak dapat login dan tidak ditampilkan di daftar aktif. Data tetap tersimpan.` : undefined}
        confirmLabel="Nonaktifkan"
        danger
        onCancel={() => setDeactivateTarget(null)}
        onConfirm={() => void confirmDeactivate()}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Tentor Permanen?"
        message={
          deleteTarget
            ? `Hapus permanen tentor ${deleteTarget.name}? Akun Supabase akan dihapus (tidak bisa login), ${deleteTarget._count?.sessions ?? 0} sesi yang diampu ikut terhapus (laporan ikut), dan enrollment menjadi tanpa tentor. Tindakan ini tidak dapat dibatalkan.`
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
