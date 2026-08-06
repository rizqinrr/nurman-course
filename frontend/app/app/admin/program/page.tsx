"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Edit3, Map, Plus, Search, XCircle } from "lucide-react";
import { createProgramSchema, ProgramCategory } from "@nurman-course/shared";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import { apiFetch, buildQuery } from "@/lib/api";
import { Program } from "@/data/lms";

interface AdminProgram extends Program {
  _count?: {
    roadmapSteps: number;
    enrollments: number;
    sessions: number;
  };
}

interface ProgramForm {
  slug: string;
  name: string;
  description: string;
  category: ProgramCategory;
  basePrice: string;
  sessionsPerBlock: string;
  active: boolean;
  hasRoadmap: boolean;
}

const emptyForm: ProgramForm = {
  slug: "",
  name: "",
  description: "",
  category: "materi",
  basePrice: "",
  sessionsPerBlock: "12",
  active: true,
  hasRoadmap: false,
};

const categoryLabels: Record<ProgramCategory, string> = {
  materi: "Materi",
  jenjang: "Jenjang",
  calistung: "Calistung",
};

function toForm(program: AdminProgram): ProgramForm {
  return {
    slug: program.slug,
    name: program.name,
    description: program.description,
    category: program.category as ProgramCategory,
    basePrice: program.basePrice?.toString() || "",
    sessionsPerBlock: program.sessionsPerBlock?.toString() || "12",
    active: program.active,
    hasRoadmap: program.hasRoadmap ?? false,
  };
}

function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return "Belum diatur";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function AdminProgramPage() {
  const [programs, setPrograms] = useState<AdminProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("true");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editingProgram, setEditingProgram] = useState<AdminProgram | null>(null);
  const [form, setForm] = useState<ProgramForm>(emptyForm);

  const loadPrograms = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiFetch<{ data: AdminProgram[] }>(
        `/api/admin/programs${buildQuery({ search, active: activeFilter, category: categoryFilter })}`,
      );
      setPrograms(response.data || []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat program.");
    } finally {
      setLoading(false);
    }
  }, [activeFilter, categoryFilter, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadPrograms();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadPrograms, search, activeFilter, categoryFilter]);

  const resetForm = () => {
    setEditingProgram(null);
    setForm(emptyForm);
    setErrorMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setNotice(null);

    const payload = {
      slug: form.slug,
      name: form.name,
      description: form.description,
      category: form.category,
      basePrice: form.basePrice ? Number(form.basePrice) : null,
      sessionsPerBlock: Number(form.sessionsPerBlock),
      active: form.active,
      hasRoadmap: form.hasRoadmap,
    };
    const parsed = createProgramSchema.safeParse(payload);

    if (!parsed.success) {
      setErrorMessage(parsed.error.issues[0]?.message || "Data program belum valid.");
      return;
    }

    setSaving(true);
    try {
      const path = editingProgram ? `/api/admin/programs/${editingProgram.id}` : "/api/admin/programs";
      const method = editingProgram ? "PATCH" : "POST";
      await apiFetch<{ data: AdminProgram }>(path, {
        method,
        body: JSON.stringify(parsed.data),
      });
      setNotice(editingProgram ? "Program berhasil diperbarui." : "Program berhasil dibuat.");
      resetForm();
      await loadPrograms();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan program.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (program: AdminProgram) => {
    if (!window.confirm(`Nonaktifkan program ${program.name}?`)) return;
    setErrorMessage(null);
    setNotice(null);

    try {
      await apiFetch(`/api/admin/programs/${program.id}`, { method: "DELETE" });
      setNotice("Program berhasil dinonaktifkan.");
      if (editingProgram?.id === program.id) resetForm();
      await loadPrograms();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menonaktifkan program.");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full flex-grow flex flex-col gap-6">
      <PageHeader
        title="Program"
        subtitle="Kelola katalog program, harga, kategori, dan status aktif."
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
                <span className="sr-only">Cari program</span>
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari nama atau slug..."
                  className="w-full rounded-xl border border-gray-200 bg-white/80 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-[#4a70a9]"
                />
              </label>
              <select
                value={activeFilter}
                onChange={(event) => setActiveFilter(event.target.value)}
                className="rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]"
                aria-label="Filter status program"
              >
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
                <option value="">Semua status</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]"
                aria-label="Filter kategori program"
              >
                <option value="">Semua kategori</option>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </GlassCard>

          {loading ? (
            <GlassCard className="p-8 text-center text-sm font-medium text-gray-600">Memuat daftar program...</GlassCard>
          ) : programs.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <BookOpen size={28} className="mx-auto text-gray-400" />
              <h2 className="mt-3 font-bold text-gray-800">Belum ada program</h2>
              <p className="mt-1 text-sm text-gray-500">Tambah program pertama dari form di samping.</p>
            </GlassCard>
          ) : (
            <div className="grid gap-4">
              {programs.map((program) => (
                <GlassCard key={program.id} className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold text-gray-800">{program.name}</h2>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${program.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"}`}>
                          {program.active ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-xs text-gray-500">{program.slug}</p>
                      <p className="mt-3 line-clamp-2 text-sm text-gray-600">{program.description}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => { setEditingProgram(program); setForm(toForm(program)); setNotice(null); }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white/70 px-3 py-2 text-xs font-bold text-gray-700 ring-1 ring-gray-200 hover:bg-white"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      {program.hasRoadmap && (
                        <Link
                          href={`/app/admin/roadmap?program=${program.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-100"
                        >
                          <Map size={14} /> Roadmap
                        </Link>
                      )}
                      {program.active && (
                        <button
                          type="button"
                          onClick={() => void handleDeactivate(program)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 ring-1 ring-red-100 hover:bg-red-100"
                        >
                          <XCircle size={14} /> Nonaktifkan
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-600">
                    <span className="rounded-lg bg-[#4a70a9]/10 px-2.5 py-1 font-semibold text-[#4a70a9]">{categoryLabels[program.category as ProgramCategory] || program.category}</span>
                    <span className="rounded-lg bg-white/70 px-2.5 py-1">Mulai {formatPrice(program.basePrice)}</span>
                    {program.hasRoadmap && <span className="rounded-lg bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-700 ring-1 ring-indigo-200">Roadmap</span>}
                    {program._count && <span className="rounded-lg bg-white/70 px-2.5 py-1">{program._count.enrollments} enrollment</span>}
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </section>

        <GlassCard className="h-fit p-5 xl:sticky xl:top-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-gray-800">{editingProgram ? "Edit Program" : "Program Baru"}</h2>
              <p className="mt-1 text-xs text-gray-500">Data akan tersimpan ke database live.</p>
            </div>
            {editingProgram && (
              <button type="button" onClick={resetForm} className="rounded-lg p-2 text-gray-400 hover:bg-white/70 hover:text-gray-700" aria-label="Batal edit">
                <XCircle size={18} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <label className="block text-xs font-bold text-gray-700">Nama Program<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]" /></label>
            <label className="block text-xs font-bold text-gray-700">Slug<input required value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]" placeholder="contoh: matematika-sd" /></label>
            <label className="block text-xs font-bold text-gray-700">Kategori<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as ProgramCategory })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]"><option value="materi">Materi</option><option value="jenjang">Jenjang</option><option value="calistung">Calistung</option></select></label>
            <label className="block text-xs font-bold text-gray-700">Deskripsi<textarea required rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1.5 w-full resize-y rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-bold text-gray-700">Harga mulai<input type="number" min="0" value={form.basePrice} onChange={(event) => setForm({ ...form, basePrice: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]" placeholder="Opsional" /></label>
              <label className="block text-xs font-bold text-gray-700">Sesi per blok<input required type="number" min="1" max="100" value={form.sessionsPerBlock} onChange={(event) => setForm({ ...form, sessionsPerBlock: event.target.value })} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]" /></label>
            </div>
            <label className="flex items-center gap-2 rounded-xl bg-white/60 px-3 py-2.5 text-sm font-semibold text-gray-700"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} className="h-4 w-4 accent-[#4a70a9]" /> Program aktif</label>
            <label className="flex items-center gap-2 rounded-xl bg-white/60 px-3 py-2.5 text-sm font-semibold text-gray-700"><input type="checkbox" checked={form.hasRoadmap} onChange={(event) => setForm({ ...form, hasRoadmap: event.target.checked })} className="h-4 w-4 accent-[#4a70a9]" /> Punya roadmap (ber-level)</label>
            <div className="flex gap-2 pt-2">
              {editingProgram && <Button type="button" variant="ghost" onClick={resetForm} className="flex-1">Batal</Button>}
              <Button type="submit" disabled={saving} className="flex-1 justify-center inline-flex items-center gap-2"><Plus size={16} /> {saving ? "Menyimpan..." : editingProgram ? "Simpan Perubahan" : "Tambah"}</Button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
