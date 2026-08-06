"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  ChevronDown,
  FileText,
  Layers,
  Map,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  createMaterialItemSchema,
  createRoadmapStepSchema,
  updateMaterialItemSchema,
  updateRoadmapStepSchema,
} from "@nurman-course/shared";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import MarkdownContent from "@/components/ui/MarkdownContent";
import { apiFetch } from "@/lib/api";
import { MaterialItem, Program, RoadmapStep } from "@/data/lms";

interface AdminProgram extends Program {
  _count?: {
    roadmapSteps: number;
  };
}

interface StepForm {
  title: string;
  level: string;
  bodyText: string;
}

interface MaterialForm {
  title: string;
  bodyText: string;
}

interface ConfirmTarget {
  type: "step" | "material";
  id: string;
  stepId?: string;
  label: string;
}

const emptyStepForm: StepForm = { title: "", level: "", bodyText: "" };
const emptyMaterialForm: MaterialForm = { title: "", bodyText: "" };

function titleToForm(step: RoadmapStep): StepForm {
  return { title: step.title, level: step.level || "", bodyText: step.bodyText };
}

function materialToForm(material: MaterialItem): MaterialForm {
  return { title: material.title, bodyText: material.bodyText };
}

export default function RoadmapClient() {
  const searchParams = useSearchParams();
  const programParam = searchParams.get("program");

  const [programs, setPrograms] = useState<AdminProgram[]>([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [selectedProgramId, setSelectedProgramId] = useState<string>(programParam || "");
  const [steps, setSteps] = useState<RoadmapStep[]>([]);
  const [stepsLoading, setStepsLoading] = useState(false);
  const [materialsMap, setMaterialsMap] = useState<Record<string, MaterialItem[]>>({});
  const [materialsLoading, setMaterialsLoading] = useState<string | null>(null);
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  const [stepModalOpen, setStepModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<RoadmapStep | null>(null);
  const [stepForm, setStepForm] = useState<StepForm>(emptyStepForm);
  const [stepSaving, setStepSaving] = useState(false);

  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [materialStepId, setMaterialStepId] = useState<string | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<MaterialItem | null>(null);
  const [materialForm, setMaterialForm] = useState<MaterialForm>(emptyMaterialForm);
  const [materialSaving, setMaterialSaving] = useState(false);

  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const roadmapPrograms = useMemo(
    () => programs.filter((p) => p.hasRoadmap),
    [programs],
  );

  const selectedProgram = useMemo(
    () => roadmapPrograms.find((p) => p.id === selectedProgramId) || null,
    [roadmapPrograms, selectedProgramId],
  );

  const loadPrograms = useCallback(async () => {
    setProgramsLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiFetch<{ data: AdminProgram[] }>("/api/admin/programs");
      const list = res.data || [];
      setPrograms(list);
      if (!selectedProgramId && list.length > 0) {
        const firstRoadmap = list.find((p) => p.hasRoadmap);
        setSelectedProgramId(firstRoadmap?.id || "");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal memuat daftar program.");
    } finally {
      setProgramsLoading(false);
    }
  }, [selectedProgramId]);

  useEffect(() => {
    void loadPrograms();
  }, [loadPrograms]);

  const loadSteps = useCallback(async (programId: string) => {
    if (!programId) return;
    setStepsLoading(true);
    setErrorMsg(null);
    setExpandedStepId(null);
    setMaterialsMap({});
    try {
      const res = await apiFetch<{ data: RoadmapStep[] }>(
        `/api/admin/programs/${programId}/roadmap`,
      );
      setSteps(res.data || []);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal memuat roadmap.");
    } finally {
      setStepsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSteps(selectedProgramId);
  }, [selectedProgramId, loadSteps]);

  const loadMaterials = useCallback(async (stepId: string) => {
    setMaterialsLoading(stepId);
    try {
      const res = await apiFetch<{ data: MaterialItem[] }>(
        `/api/admin/roadmap-steps/${stepId}/materials`,
      );
      setMaterialsMap((prev) => ({ ...prev, [stepId]: res.data || [] }));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal memuat materi.");
    } finally {
      setMaterialsLoading((prev) => (prev === stepId ? null : prev));
    }
  }, []);

  const toggleStep = (stepId: string) => {
    setExpandedStepId((prev) => {
      const next = prev === stepId ? null : stepId;
      if (next && !(next in materialsMap)) {
        void loadMaterials(next);
      }
      return next;
    });
  };

  const resetStepModal = () => {
    setStepModalOpen(false);
    setEditingStep(null);
    setStepForm(emptyStepForm);
  };

  const openCreateStep = () => {
    setEditingStep(null);
    setStepForm(emptyStepForm);
    setStepModalOpen(true);
  };

  const openEditStep = (step: RoadmapStep) => {
    setEditingStep(step);
    setStepForm(titleToForm(step));
    setStepModalOpen(true);
  };

  const handleSaveStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram) return;
    setErrorMsg(null);
    setNotice(null);

    const payload = {
      title: stepForm.title,
      level: stepForm.level.trim() || null,
      bodyText: stepForm.bodyText,
    };
    const schema = editingStep ? updateRoadmapStepSchema : createRoadmapStepSchema.omit({ programId: true });
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Data langkah belum valid.");
      return;
    }

    setStepSaving(true);
    try {
      if (editingStep) {
        await apiFetch<{ data: RoadmapStep }>(`/api/admin/roadmap-steps/${editingStep.id}`, {
          method: "PATCH",
          body: JSON.stringify(parsed.data),
        });
        setNotice("Langkah roadmap diperbarui.");
      } else {
        await apiFetch<{ data: RoadmapStep }>(`/api/admin/programs/${selectedProgram.id}/roadmap`, {
          method: "POST",
          body: JSON.stringify(parsed.data),
        });
        setNotice("Langkah roadmap ditambahkan.");
      }
      resetStepModal();
      await loadSteps(selectedProgram.id);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal menyimpan langkah.");
    } finally {
      setStepSaving(false);
    }
  };

  const resetMaterialModal = () => {
    setMaterialModalOpen(false);
    setMaterialStepId(null);
    setEditingMaterial(null);
    setMaterialForm(emptyMaterialForm);
  };

  const openCreateMaterial = (stepId: string) => {
    setMaterialStepId(stepId);
    setEditingMaterial(null);
    setMaterialForm(emptyMaterialForm);
    setMaterialModalOpen(true);
  };

  const openEditMaterial = (stepId: string, material: MaterialItem) => {
    setMaterialStepId(stepId);
    setEditingMaterial(material);
    setMaterialForm(materialToForm(material));
    setMaterialModalOpen(true);
  };

  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialStepId) return;
    setErrorMsg(null);
    setNotice(null);

    const payload = { title: materialForm.title, bodyText: materialForm.bodyText };
    const schema = editingMaterial ? updateMaterialItemSchema : createMaterialItemSchema.omit({ roadmapStepId: true });
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Data materi belum valid.");
      return;
    }

    setMaterialSaving(true);
    try {
      if (editingMaterial) {
        await apiFetch<{ data: MaterialItem }>(`/api/admin/material-items/${editingMaterial.id}`, {
          method: "PATCH",
          body: JSON.stringify(parsed.data),
        });
        setNotice("Materi diperbarui.");
      } else {
        await apiFetch<{ data: MaterialItem }>(`/api/admin/roadmap-steps/${materialStepId}/materials`, {
          method: "POST",
          body: JSON.stringify(parsed.data),
        });
        setNotice("Materi ditambahkan.");
      }
      resetMaterialModal();
      await loadMaterials(materialStepId);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal menyimpan materi.");
    } finally {
      setMaterialSaving(false);
    }
  };

  const handleReorderSteps = async (stepIds: string[]) => {
    if (!selectedProgram) return;
    setErrorMsg(null);
    setNotice(null);
    try {
      const res = await apiFetch<{ data: RoadmapStep[] }>(
        `/api/admin/programs/${selectedProgram.id}/roadmap/reorder`,
        { method: "POST", body: JSON.stringify({ stepIds }) },
      );
      setSteps(res.data || []);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal mengubah urutan langkah.");
    }
  };

  const moveStep = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= steps.length) return;
    const next = [...steps];
    [next[index], next[target]] = [next[target], next[index]];
    void handleReorderSteps(next.map((s) => s.id));
  };

  const handleReorderMaterials = async (stepId: string, materialIds: string[]) => {
    setErrorMsg(null);
    setNotice(null);
    try {
      const res = await apiFetch<{ data: MaterialItem[] }>(
        `/api/admin/roadmap-steps/${stepId}/materials/reorder`,
        { method: "POST", body: JSON.stringify({ materialIds }) },
      );
      setMaterialsMap((prev) => ({ ...prev, [stepId]: res.data || [] }));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal mengubah urutan materi.");
    }
  };

  const moveMaterial = (stepId: string, index: number, direction: -1 | 1) => {
    const current = materialsMap[stepId] || [];
    const target = index + direction;
    if (target < 0 || target >= current.length) return;
    const next = [...current];
    [next[index], next[target]] = [next[target], next[index]];
    void handleReorderMaterials(stepId, next.map((m) => m.id));
  };

  const handleDelete = async () => {
    if (!confirmTarget) return;
    setErrorMsg(null);
    setNotice(null);
    setDeleting(true);
    try {
      if (confirmTarget.type === "step") {
        await apiFetch(`/api/admin/roadmap-steps/${confirmTarget.id}`, { method: "DELETE" });
        if (selectedProgram) await loadSteps(selectedProgram.id);
        setNotice("Langkah roadmap dihapus.");
      } else {
        const stepId = confirmTarget.stepId;
        await apiFetch(`/api/admin/material-items/${confirmTarget.id}`, { method: "DELETE" });
        if (stepId) await loadMaterials(stepId);
        setNotice("Materi dihapus.");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal menghapus.");
    } finally {
      setDeleting(false);
      setConfirmTarget(null);
    }
  };

  const materialsOf = (stepId: string) => materialsMap[stepId] || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full flex-grow flex flex-col gap-5 sm:gap-6 pb-32">
      <PageHeader
        title="Roadmap & Materi"
        subtitle="Susun peta jalan belajar bertingkat dan materi tiap langkah untuk program ber-roadmap."
        showBack={false}
      />

      {errorMsg && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}
      {notice && (
        <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {notice}
        </div>
      )}

      <GlassCard className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex-1 block text-xs font-bold text-gray-700">
            <span className="mb-1.5 flex items-center gap-1.5">
              <Map size={14} className="text-[#4a70a9]" />
              Pilih Program (ber-roadmap)
            </span>
            <select
              value={selectedProgramId}
              onChange={(e) => setSelectedProgramId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]"
              aria-label="Pilih program"
            >
              <option value="">Pilih program...</option>
              {roadmapPrograms.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p._count?.roadmapSteps ?? 0} langkah)
                </option>
              ))}
            </select>
          </label>
          {selectedProgram && (
            <Button
              onClick={openCreateStep}
              disabled={stepsLoading}
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-sm shrink-0"
            >
              <Plus size={18} /> Tambah Langkah
            </Button>
          )}
        </div>
      </GlassCard>

      {!selectedProgram && !programsLoading && (
        <GlassCard className="p-8 text-center">
          <Map size={32} className="mx-auto text-gray-400" />
          <h2 className="mt-3 font-bold text-gray-800">Belum ada program ber-roadmap</h2>
          <p className="mt-1 text-sm text-gray-500">
            Aktifkan toggle &quot;Punya roadmap (ber-level)&quot; di halaman Program, lalu mulai
            menyusun langkah di sini.
          </p>
        </GlassCard>
      )}

      {selectedProgram && (
        <>
          {stepsLoading ? (
            <GlassCard className="p-8 text-center text-sm font-medium text-gray-600">
              Memuat roadmap...
            </GlassCard>
          ) : steps.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <Layers size={32} className="mx-auto text-gray-400" />
              <h2 className="mt-3 font-bold text-gray-800">Belum ada langkah roadmap</h2>
              <p className="mt-1 text-sm text-gray-500">
                Tambah langkah pertama (misal Level 1) untuk program {selectedProgram.name}.
              </p>
            </GlassCard>
          ) : (
            <section className="flex flex-col gap-3">
              {steps.map((step, index) => {
                const isOpen = expandedStepId === step.id;
                const materials = materialsOf(step.id);
                const isLoadingMaterials = materialsLoading === step.id;
                const stepIdForDelete = step.id;

                return (
                  <GlassCard key={step.id} className="p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 shrink-0 rounded-xl bg-[#4a70a9]/10 border border-[#4a70a9]/20 flex items-center justify-center font-bold text-[#4a70a9] text-sm">
                          {step.order + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                              {step.title}
                            </h3>
                            {step.level && (
                              <span className="rounded-lg bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-700 ring-1 ring-indigo-200">
                                {step.level}
                              </span>
                            )}
                          </div>
                          <div className="mt-2">
                            <MarkdownContent text={step.bodyText} />
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => moveStep(index, -1)}
                          disabled={index === 0}
                          className="inline-flex items-center justify-center rounded-lg bg-white/70 p-2 text-gray-500 ring-1 ring-gray-200 hover:bg-white disabled:opacity-30"
                          aria-label="Naikkan urutan"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveStep(index, 1)}
                          disabled={index === steps.length - 1}
                          className="inline-flex items-center justify-center rounded-lg bg-white/70 p-2 text-gray-500 ring-1 ring-gray-200 hover:bg-white disabled:opacity-30"
                          aria-label="Turunkan urutan"
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditStep(step)}
                          className="inline-flex items-center justify-center rounded-lg bg-white/70 p-2 text-gray-700 ring-1 ring-gray-200 hover:bg-white"
                          aria-label="Edit langkah"
                        >
                          <BookOpen size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmTarget({ type: "step", id: stepIdForDelete, label: step.title })}
                          className="inline-flex items-center justify-center rounded-lg bg-red-50 p-2 text-red-600 ring-1 ring-red-100 hover:bg-red-100"
                          aria-label="Hapus langkah"
                        >
                          <Trash2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStep(step.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#4a70a9]/10 px-3 py-2 text-xs font-bold text-[#4a70a9] ring-1 ring-[#4a70a9]/20 hover:bg-[#4a70a9]/20"
                        >
                          <FileText size={14} />
                          Materi ({materials.length})
                          <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="mt-4 border-t border-gray-200/50 pt-4">
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500">
                            Materi Langkah {step.order + 1}
                          </h4>
                          <Button
                            onClick={() => openCreateMaterial(step.id)}
                            className="inline-flex items-center gap-1.5 justify-center text-xs px-3 py-2"
                          >
                            <Plus size={14} /> Tambah Materi
                          </Button>
                        </div>

                        {isLoadingMaterials ? (
                          <p className="py-4 text-center text-xs font-medium text-gray-500">
                            Memuat materi...
                          </p>
                        ) : materials.length === 0 ? (
                          <p className="rounded-xl bg-white/40 px-4 py-4 text-center text-xs text-gray-500">
                            Belum ada materi. Tambahkan materi teks untuk langkah ini.
                          </p>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {materials.map((material, mi) => (
                              <div
                                key={material.id}
                                className="flex flex-col gap-2 rounded-xl bg-white/50 border border-white/70 p-3 sm:flex-row sm:items-start sm:justify-between"
                              >
                                <div className="min-w-0">
                                  <p className="font-semibold text-gray-800 text-sm">
                                    {material.order + 1}. {material.title}
                                  </p>
                                  <div className="mt-1">
                                    <MarkdownContent text={material.bodyText} />
                                  </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => moveMaterial(step.id, mi, -1)}
                                    disabled={mi === 0}
                                    className="inline-flex items-center justify-center rounded-lg bg-white/70 p-1.5 text-gray-500 ring-1 ring-gray-200 hover:bg-white disabled:opacity-30"
                                    aria-label="Naikkan materi"
                                  >
                                    <ArrowUp size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => moveMaterial(step.id, mi, 1)}
                                    disabled={mi === materials.length - 1}
                                    className="inline-flex items-center justify-center rounded-lg bg-white/70 p-1.5 text-gray-500 ring-1 ring-gray-200 hover:bg-white disabled:opacity-30"
                                    aria-label="Turunkan materi"
                                  >
                                    <ArrowDown size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => openEditMaterial(step.id, material)}
                                    className="inline-flex items-center justify-center rounded-lg bg-white/70 p-1.5 text-gray-700 ring-1 ring-gray-200 hover:bg-white"
                                    aria-label="Edit materi"
                                  >
                                    <BookOpen size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmTarget({ type: "material", id: material.id, stepId: step.id, label: material.title })}
                                    className="inline-flex items-center justify-center rounded-lg bg-red-50 p-1.5 text-red-600 ring-1 ring-red-100 hover:bg-red-100"
                                    aria-label="Hapus materi"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </GlassCard>
                );
              })}
            </section>
          )}
        </>
      )}

      {stepModalOpen && (
        <StepModal
          title={editingStep ? "Edit Langkah" : "Tambah Langkah"}
          form={stepForm}
          setForm={setStepForm}
          saving={stepSaving}
          onClose={resetStepModal}
          onSubmit={handleSaveStep}
        />
      )}

      {materialModalOpen && (
        <MaterialModal
          title={editingMaterial ? "Edit Materi" : "Tambah Materi"}
          form={materialForm}
          setForm={setMaterialForm}
          saving={materialSaving}
          onClose={resetMaterialModal}
          onSubmit={handleSaveMaterial}
        />
      )}

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        title={confirmTarget?.type === "step" ? "Hapus Langkah?" : "Hapus Materi?"}
        message={
          confirmTarget
            ? `"${confirmTarget.label}" akan dihapus permanen. ${
                confirmTarget.type === "step"
                  ? "Seluruh materi di dalamnya ikut terhapus."
                  : "Materi ini tidak bisa dikembalikan."
              }`
            : undefined
        }
        confirmLabel={deleting ? "Menghapus..." : "Ya, Hapus"}
        danger
        onConfirm={() => void handleDelete()}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}

interface StepModalProps {
  title: string;
  form: StepForm;
  setForm: React.Dispatch<React.SetStateAction<StepForm>>;
  saving: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

function StepModal({ title, form, setForm, saving, onClose, onSubmit }: StepModalProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-white/70 bg-white/85 p-5 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-white/70 hover:text-gray-700" aria-label="Tutup">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block text-xs font-bold text-gray-700">
            Judul Langkah
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Contoh: Level 1 — Dasar"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]"
            />
          </label>
          <label className="block text-xs font-bold text-gray-700">
            Level (opsional)
            <input
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              placeholder="Contoh: Dasar / Pemula"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]"
            />
          </label>
          <label className="block text-xs font-bold text-gray-700">
            Konten / Deskripsi
            <textarea
              required
              rows={7}
              value={form.bodyText}
              onChange={(e) => setForm({ ...form, bodyText: e.target.value })}
              placeholder={"Tuliskan konten langkah.\nGunakan **teks tebal**, ## untuk sub-judul, dan - untuk poin."}
              className="mt-1.5 w-full resize-y rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]"
            />
          </label>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 justify-center">
              Batal
            </Button>
            <Button type="submit" disabled={saving} className="flex-1 justify-center gap-2">
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface MaterialModalProps {
  title: string;
  form: MaterialForm;
  setForm: React.Dispatch<React.SetStateAction<MaterialForm>>;
  saving: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

function MaterialModal({ title, form, setForm, saving, onClose, onSubmit }: MaterialModalProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-white/70 bg-white/85 p-5 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-white/70 hover:text-gray-700" aria-label="Tutup">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block text-xs font-bold text-gray-700">
            Judul Materi
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Contoh: Mengenal Perangkat Keras"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]"
            />
          </label>
          <label className="block text-xs font-bold text-gray-700">
            Konten Materi
            <textarea
              required
              rows={7}
              value={form.bodyText}
              onChange={(e) => setForm({ ...form, bodyText: e.target.value })}
              placeholder={"Tuliskan isi materi.\nGunakan **teks tebal**, ## untuk sub-judul, dan - untuk poin."}
              className="mt-1.5 w-full resize-y rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]"
            />
          </label>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 justify-center">
              Batal
            </Button>
            <Button type="submit" disabled={saving} className="flex-1 justify-center gap-2">
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
