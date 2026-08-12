/* Hallmark · genre: playful-glassmorphism · design-system: design.md · designed-as-app */
"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { ClipboardList, Plus, Search, Edit3, XCircle, Receipt, Trash2 } from "lucide-react";
import { createEnrollmentSchema, updateEnrollmentSchema } from "@nurman-course/shared";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { apiFetch, buildQuery } from "@/lib/api";
import { formatSessionDateTime } from "@/lib/format";

interface AdminEnrollment {
  id: string;
  muridId: string;
  programId: string;
  status: "active" | "completed" | "cancelled";
  startedAt: string | null;
  tentorId?: string | null;
  murid?: { id: string; name: string; active?: boolean } | null;
  program?: { id: string; name: string; slug?: string; active?: boolean } | null;
  tentor?: { id: string; name: string } | null;
  invoices?: AdminInvoice[];
  _count?: { invoices: number };
}

interface AdminInvoice {
  id: string;
  amount: number;
  status: "unpaid" | "waiting" | "paid";
  dueAt: string;
  paidAt?: string | null;
  note?: string | null;
  createdAt: string;
}

interface AdminEnrollmentForm {
  muridId: string;
  programId: string;
  status: "active" | "completed" | "cancelled";
  startedAt: string;
  tentorId: string;
}

interface Option {
  id: string;
  name: string;
}

const emptyForm: AdminEnrollmentForm = {
  muridId: "",
  programId: "",
  status: "active",
  startedAt: "",
  tentorId: "",
};

const statusStyle: Record<AdminEnrollment["status"], string> = {
  active: "bg-emerald-100 text-emerald-700",
  completed: "bg-indigo-100 text-indigo-700",
  cancelled: "bg-gray-200 text-gray-600",
};

const statusLabel: Record<AdminEnrollment["status"], string> = {
  active: "Aktif",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

function toForm(enrollment: AdminEnrollment): AdminEnrollmentForm {
  return {
    muridId: enrollment.muridId,
    programId: enrollment.programId,
    status: enrollment.status,
    startedAt: enrollment.startedAt ? enrollment.startedAt.slice(0, 10) : "",
    tentorId: enrollment.tentorId || "",
  };
}

export default function AdminEnrollmentPage() {
  const [enrollments, setEnrollments] = useState<AdminEnrollment[]>([]);
  const [murids, setMurids] = useState<Option[]>([]);
  const [programs, setPrograms] = useState<Option[]>([]);
  const [tentors, setTentors] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingEnrollment, setEditingEnrollment] = useState<AdminEnrollment | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<AdminEnrollment | null>(null);
  const [form, setForm] = useState<AdminEnrollmentForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<AdminEnrollment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadEnrollments = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiFetch<{ data: AdminEnrollment[] }>(
        `/api/admin/enrollments${buildQuery({ search, status: statusFilter, limit: 100 })}`,
      );
      setEnrollments(response.data || []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat enrollment.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  const loadOptions = useCallback(async () => {
    try {
      const [muridRes, programRes, tentorRes] = await Promise.all([
        apiFetch<{ data: Option[] }>(`/api/admin/murids${buildQuery({ limit: 100 })}`),
        apiFetch<{ data: Option[] }>(`/api/admin/programs${buildQuery({ limit: 100 })}`),
        apiFetch<{ data: Option[] }>(`/api/admin/tentors${buildQuery({ limit: 100 })}`),
      ]);
      if (!muridRes.data || !programRes.data || !tentorRes.data) {
        throw new Error("Response admin murids/programs/tentors tidak sesuai shape {data}");
      }
      setMurids(muridRes.data);
      setPrograms(programRes.data);
      setTentors(tentorRes.data);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Gagal memuat opsi murid/program/tentor";
      setErrorMessage(msg);
      console.error("[admin/enrollment] loadOptions failed:", error);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadEnrollments();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadEnrollments]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadOptions();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadOptions]);

  const resetForm = () => {
    setEditingEnrollment(null);
    setForm(emptyForm);
    setErrorMessage(null);
  };

  const handleEdit = (enrollment: AdminEnrollment) => {
    setEditingEnrollment(enrollment);
    setForm(toForm(enrollment));
    setSelectedEnrollment(null);
    setNotice(null);
  };

  const handleDetail = async (enrollment: AdminEnrollment) => {
    setSelectedEnrollment(enrollment);
    setNotice(null);

    try {
      const response = await apiFetch<{ data: AdminEnrollment }>(
        `/api/admin/enrollments/${enrollment.id}`,
      );
      if (response.data) {
        setSelectedEnrollment(response.data);
      }
    } catch (error) {
      console.error("Gagal memuat detail enrollment:", error);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setNotice(null);

    const payload = {
      muridId: form.muridId,
      programId: form.programId,
      startedAt: form.startedAt || null,
      tentorId: form.tentorId || null,
      ...(editingEnrollment ? { status: form.status } : {}),
    };
    const schema = editingEnrollment ? updateEnrollmentSchema : createEnrollmentSchema;
    const parsed = schema.safeParse(payload);

    if (!parsed.success) {
      setErrorMessage(parsed.error.issues[0]?.message || "Data enrollment belum valid.");
      return;
    }

    setSaving(true);
    try {
      const path = editingEnrollment ? `/api/admin/enrollments/${editingEnrollment.id}` : "/api/admin/enrollments";
      const method = editingEnrollment ? "PATCH" : "POST";
      await apiFetch<{ data: AdminEnrollment }>(path, {
        method,
        body: JSON.stringify(parsed.data),
      });
      setNotice(editingEnrollment ? "Enrollment berhasil diperbarui." : "Enrollment berhasil dibuat.");
      resetForm();
      await loadEnrollments();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan enrollment.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const enrollment = deleteTarget;
    setDeleteTarget(null);
    setDeleting(true);
    setErrorMessage(null);
    setNotice(null);
    try {
      await apiFetch(`/api/admin/enrollments/${enrollment.id}`, { method: "DELETE" });
      setNotice("Enrollment berhasil dihapus permanen.");
      if (editingEnrollment?.id === enrollment.id) resetForm();
      if (selectedEnrollment?.id === enrollment.id) setSelectedEnrollment(null);
      await loadEnrollments();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menghapus enrollment.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full flex-grow flex flex-col gap-6">
      <PageHeader
        title="Enrollment"
        subtitle="Kelola pendaftaran murid pada program bimbingan belajar."
        showBack={false}
      />

      {errorMessage && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}
      {notice && (
        <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="flex flex-col gap-4">
          <GlassCard className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">Cari enrollment</span>
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari nama murid..."
                  className="w-full rounded-xl border border-gray-200 bg-white/80 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-[#4a70a9]"
                />
              </label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]"
                aria-label="Filter status"
              >
                <option value="">Semua status</option>
                <option value="active">Aktif</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
          </GlassCard>

          {loading ? (
            <GlassCard className="p-8 text-center text-sm font-medium text-gray-600">Memuat daftar enrollment...</GlassCard>
          ) : enrollments.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <ClipboardList size={28} className="mx-auto text-gray-400" />
              <h2 className="mt-3 font-bold text-gray-800">Belum ada enrollment</h2>
              <p className="mt-1 text-sm text-gray-500">Daftarkan murid ke program dari form di samping.</p>
            </GlassCard>
          ) : (
            <div className="grid gap-4">
              {enrollments.map((enrollment) => (
                <GlassCard key={enrollment.id} className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4a70a9]/15 text-[#4a70a9]">
                        <ClipboardList size={22} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-bold text-gray-800">{enrollment.murid?.name || enrollment.muridId}</h2>
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusStyle[enrollment.status]}`}>
                            {statusLabel[enrollment.status]}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span>Program: {enrollment.program?.name || "-"}</span>
                          {enrollment.startedAt && (
                            <span>Mulai: {formatSessionDateTime(enrollment.startedAt).split(" • ")[0]}</span>
                          )}
                          {enrollment.tentor && (
                            <span>Tentor: {enrollment.tentor.name}</span>
                          )}
                        </div>
                        {enrollment._count && (
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
                            <span className="rounded-lg bg-white/70 px-2.5 py-1">{enrollment._count.invoices} tagihan</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => void handleDetail(enrollment)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white/70 px-3 py-2 text-xs font-bold text-gray-700 ring-1 ring-gray-200 hover:bg-white"
                      >
                        <Receipt size={14} /> Detail
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(enrollment)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white/70 px-3 py-2 text-xs font-bold text-gray-700 ring-1 ring-gray-200 hover:bg-white"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(enrollment)}
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
              <h2 className="font-bold text-gray-800">{editingEnrollment ? "Edit Enrollment" : "Enrollment Baru"}</h2>
              <p className="mt-1 text-xs text-gray-500">Daftarkan murid ke program bimbingan.</p>
            </div>
            {editingEnrollment && (
              <button type="button" onClick={resetForm} className="rounded-lg p-2 text-gray-400 hover:bg-white/70 hover:text-gray-700" aria-label="Batal edit">
                <XCircle size={18} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <label className="block text-xs font-bold text-gray-700">Murid
              <select required value={form.muridId} onChange={(event) => setForm({ ...form, muridId: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]">
                <option value="">Pilih murid...</option>
                {murids.map((murid) => (
                  <option key={murid.id} value={murid.id}>{murid.name}</option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-bold text-gray-700">Program
              <select required value={form.programId} onChange={(event) => setForm({ ...form, programId: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]">
                <option value="">Pilih program...</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>{program.name}</option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-bold text-gray-700">Tentor
              <select value={form.tentorId} onChange={(event) => setForm({ ...form, tentorId: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]">
                <option value="">Pilih tentor...</option>
                {tentors.map((tentor) => (
                  <option key={tentor.id} value={tentor.id}>{tentor.name}</option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-bold text-gray-700">Tanggal Mulai
                <input type="date" value={form.startedAt} onChange={(event) => setForm({ ...form, startedAt: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]" />
              </label>
              {editingEnrollment && (
                <label className="block text-xs font-bold text-gray-700">Status
                  <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as AdminEnrollmentForm["status"] })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]">
                    <option value="active">Aktif</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </select>
                </label>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              {editingEnrollment && <Button type="button" variant="ghost" onClick={resetForm} className="flex-1">Batal</Button>}
              <Button type="submit" disabled={saving} className="flex-1 justify-center inline-flex items-center gap-2"><Plus size={16} /> {saving ? "Menyimpan..." : editingEnrollment ? "Simpan Perubahan" : "Tambah"}</Button>
            </div>
          </form>
        </GlassCard>
      </div>

      {selectedEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 print:hidden" role="dialog" aria-modal="true" onClick={() => setSelectedEnrollment(null)}>
          <div className="w-full max-w-lg" onClick={(event) => event.stopPropagation()}>
            <GlassCard className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{selectedEnrollment.murid?.name || selectedEnrollment.muridId}</h2>
                  <p className="mt-0.5 text-xs text-gray-500">Program: {selectedEnrollment.program?.name || "-"}</p>
                </div>
                <button type="button" onClick={() => setSelectedEnrollment(null)} className="rounded-lg p-2 text-gray-400 hover:bg-white/70 hover:text-gray-700" aria-label="Tutup detail">
                  <XCircle size={18} />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-white/60 p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Status</p>
                  <p className={`mt-1 font-semibold ${selectedEnrollment.status === "active" ? "text-emerald-700" : "text-gray-700"}`}>{statusLabel[selectedEnrollment.status]}</p>
                </div>
                <div className="rounded-xl bg-white/60 p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Tanggal Mulai</p>
                  <p className="mt-1 font-semibold text-gray-800">
                    {selectedEnrollment.startedAt ? formatSessionDateTime(selectedEnrollment.startedAt).split(" • ")[0] : "-"}
                  </p>
                </div>
                {selectedEnrollment.tentor && (
                  <div className="col-span-2 rounded-xl bg-white/60 p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Tentor</p>
                    <p className="mt-1 font-semibold text-gray-800">{selectedEnrollment.tentor.name}</p>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Daftar Tagihan</p>
                {selectedEnrollment.invoices && selectedEnrollment.invoices.length > 0 ? (
                  <div className="mt-2 divide-y divide-gray-200/40 rounded-xl bg-white/60">
                    {selectedEnrollment.invoices.map((inv) => (
                      <div key={inv.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                        <div className="min-w-0">
                          <p className="truncate font-mono font-bold text-gray-800">#{inv.id}</p>
                          <p className="text-xs text-gray-500">Tempo: {formatSessionDateTime(inv.dueAt).split(" • ")[0]}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <span className="font-bold text-gray-800">Rp {inv.amount.toLocaleString("id-ID")}</span>
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${inv.status === "paid" ? "bg-emerald-100 text-emerald-700" : inv.status === "waiting" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                            {inv.status === "paid" ? "Lunas" : inv.status === "waiting" ? "Verifikasi" : "Belum Dibayar"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">Belum ada tagihan untuk enrollment ini.</p>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Enrollment Permanen?"
        message={
          deleteTarget
            ? `Hapus permanen enrollment ${deleteTarget.murid?.name || deleteTarget.muridId} pada program ${deleteTarget.program?.name || "-"}? ${deleteTarget._count?.invoices ?? 0} tagihan terkait akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.`
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
