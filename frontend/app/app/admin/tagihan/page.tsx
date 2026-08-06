/* Hallmark · genre: playful-glassmorphism · design-system: design.md · designed-as-app */
"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Plus, Search, Receipt, Check, Clock, AlertCircle, XCircle, FileText, Eye, ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import { createInvoiceSchema } from "@nurman-course/shared";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ProofModal, { ProofInvoiceData } from "@/components/ui/ProofModal";
import { apiFetch, buildQuery } from "@/lib/api";
import { formatSessionDateTime } from "@/lib/format";

interface AdminPrepayment {
  id: string;
  muridId: string;
  amount: number;
  status: "waiting" | "paid" | "cancelled";
  note?: string | null;
  paymentProof?: string | null;
  paymentProofName?: string | null;
  submittedAt?: string | null;
  paidAt?: string | null;
  createdAt: string;
  murid?: {
    id: string;
    name: string;
    wali?: { id: string; name: string; phone?: string } | null;
    enrollments?: {
      id: string;
      program?: { id: string; name: string } | null;
    }[];
  } | null;
}

interface AdminInvoice {
  id: string;
  enrollmentId: string;
  amount: number;
  status: "unpaid" | "waiting" | "paid";
  dueAt: string;
  paidAt?: string | null;
  note?: string | null;
  createdAt: string;
  paymentProof?: string | null;
  paymentProofName?: string | null;
  paidAmount?: number | null;
  submittedAt?: string | null;
  paymentNote?: string | null;
  enrollment?: {
    id: string;
    status: string;
    murid?: { id: string; name: string } | null;
    program?: { id: string; name: string; slug?: string } | null;
  } | null;
}

interface EnrollmentOption {
  id: string;
  muridName: string;
  programId: string;
  programName: string;
}

interface ProgramOption {
  id: string;
  name: string;
  basePrice: number | null;
  sessionsPerBlock: number;
}

interface InvoiceForm {
  enrollmentId: string;
  amount: string;
  dueAt: string;
  note: string;
}

const emptyForm: InvoiceForm = {
  enrollmentId: "",
  amount: "",
  dueAt: "",
  note: "",
};

function dueDateDefault(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

function suggestAmount(program: ProgramOption | undefined): string {
  if (!program?.basePrice || !program.sessionsPerBlock) return "";
  return String(program.basePrice * program.sessionsPerBlock);
}

export default function AdminTagihanPage() {
  const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
  const [prepayments, setPrepayments] = useState<AdminPrepayment[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentOption[]>([]);
  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [historySort, setHistorySort] = useState<"terbaru" | "terlama">("terbaru");
  const [confirmPublishOpen, setConfirmPublishOpen] = useState(false);
  const [form, setForm] = useState<InvoiceForm>(emptyForm);
  const [proofData, setProofData] = useState<ProofInvoiceData | null>(null);
  const [proofDetailHref, setProofDetailHref] = useState<string | undefined>(undefined);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const [invoiceResponse, prepayRes] = await Promise.all([
        apiFetch<{ data: AdminInvoice[] }>(
          `/api/admin/invoices${buildQuery({ search, limit: 100 })}`,
        ),
        apiFetch<{ data: AdminPrepayment[] }>("/api/admin/prepayments").catch(() => ({ data: [] as AdminPrepayment[] })),
      ]);
      setInvoices(invoiceResponse.data || []);
      setPrepayments(prepayRes.data || []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat tagihan.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  const loadFormOptions = useCallback(async () => {
    try {
      const [enrollmentRes, programRes] = await Promise.all([
        apiFetch<{ data: AdminInvoice["enrollment"] extends null ? never : Array<{ id: string; murid: { name: string } | null; program: { id: string; name: string } | null }> }>(
          `/api/admin/enrollments${buildQuery({ status: "active", limit: 100 })}`,
        ),
        apiFetch<{ data: ProgramOption[] }>(`/api/admin/programs${buildQuery({ limit: 100 })}`),
      ]);
      const mapped: EnrollmentOption[] = (enrollmentRes.data || [])
        .filter((e) => e.program?.id)
        .map((e) => ({
          id: e.id,
          muridName: e.murid?.name || "Murid",
          programId: e.program!.id,
          programName: e.program?.name || "Program",
        }));
      setEnrollments(mapped);
      setPrograms(programRes.data || []);
    } catch (error) {
      console.error("Gagal memuat opsi enrollment/program:", error);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadInvoices();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadInvoices]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadFormOptions();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadFormOptions]);

  const resetForm = () => {
    setForm({ ...emptyForm, dueAt: dueDateDefault() });
    setErrorMessage(null);
  };

  const handleEnrollmentChange = (enrollmentId: string) => {
    const option = enrollments.find((e) => e.id === enrollmentId);
    const program = programs.find((p) => p.id === option?.programId);
    const suggested = suggestAmount(program);
    setForm((prev) => ({
      ...prev,
      enrollmentId,
      amount: suggested || prev.amount,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setNotice(null);

    const payload = {
      enrollmentId: form.enrollmentId,
      amount: Number(form.amount),
      dueAt: form.dueAt,
      note: form.note || null,
    };
    const parsed = createInvoiceSchema.safeParse(payload);

    if (!parsed.success) {
      setErrorMessage(parsed.error.issues[0]?.message || "Data tagihan belum valid.");
      return;
    }

    setConfirmPublishOpen(true);
  };

  const publishInvoice = async () => {
    setConfirmPublishOpen(false);
    setErrorMessage(null);
    setNotice(null);

    const payload = {
      enrollmentId: form.enrollmentId,
      amount: Number(form.amount),
      dueAt: form.dueAt,
      note: form.note || null,
    };
    const parsed = createInvoiceSchema.safeParse(payload);
    if (!parsed.success) return;

    setSaving(true);
    try {
      await apiFetch<{ data: AdminInvoice }>("/api/admin/invoices", {
        method: "POST",
        body: JSON.stringify(parsed.data),
      });
      setNotice("Tagihan berhasil diterbitkan.");
      resetForm();
      await loadInvoices();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan tagihan.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangeStatus = async (invoice: AdminInvoice, status: AdminInvoice["status"]) => {
    if (!window.confirm(`Ubah status tagihan #${invoice.id} menjadi "${status}"?`)) return;
    setErrorMessage(null);
    setNotice(null);

    try {
      await apiFetch(`/api/admin/invoices/${invoice.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setNotice("Status tagihan berhasil diperbarui.");
      await loadInvoices();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal mengubah status tagihan.");
    }
  };

  const handlePrepaymentStatus = async (prepayment: AdminPrepayment, status: AdminPrepayment["status"]) => {
    if (!window.confirm(`Ubah status pembayaran prabayar menjadi "${status}"?`)) return;
    setErrorMessage(null);
    setNotice(null);

    try {
      await apiFetch(`/api/admin/prepayments/${prepayment.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setNotice("Status pembayaran prabayar berhasil diperbarui.");
      await loadInvoices();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal mengubah status prabayar.");
    }
  };

  const openInvoiceProof = (invoice: AdminInvoice) => {
    setProofDetailHref(`/app/admin/tagihan/${invoice.id}`);
    setProofData({
      id: invoice.id,
      amount: invoice.amount,
      status: invoice.status,
      paymentProof: invoice.paymentProof,
      paymentProofName: invoice.paymentProofName,
      paidAmount: invoice.paidAmount,
      submittedAt: invoice.submittedAt,
      note: invoice.paymentNote,
      enrollment: invoice.enrollment,
    });
  };

  const openPrepaymentProof = (prepayment: AdminPrepayment) => {
    setProofDetailHref(undefined);
    const activeEnrollment = prepayment.murid?.enrollments?.[0];
    setProofData({
      id: prepayment.id,
      amount: prepayment.amount,
      status: prepayment.status === "paid" ? "paid" : "waiting",
      paymentProof: prepayment.paymentProof,
      paymentProofName: prepayment.paymentProofName,
      paidAmount: prepayment.amount,
      submittedAt: prepayment.submittedAt,
      note: prepayment.note,
      isPrepayment: true,
      murid: prepayment.murid ? { id: prepayment.murid.id, name: prepayment.murid.name } : null,
      enrollment: activeEnrollment?.program
        ? {
            murid: prepayment.murid ? { id: prepayment.murid.id, name: prepayment.murid.name } : null,
            program: { id: activeEnrollment.program.id, name: activeEnrollment.program.name },
          }
        : null,
    });
  };

  const getTxDate = (item: AdminInvoice | AdminPrepayment): string => {
    if ("dueAt" in item) {
      return item.paidAt ?? item.submittedAt ?? item.dueAt;
    }
    return item.paidAt ?? item.submittedAt ?? item.createdAt;
  };

  const matchesStatus = (status: string): boolean => {
    if (!statusFilter) return true;
    return status === statusFilter;
  };

  const matchesSearch = (name?: string | null): boolean => {
    if (!search.trim()) return true;
    return (name || "").toLowerCase().includes(search.trim().toLowerCase());
  };

  const historyItems: Array<{ type: "invoice" | "prepayment"; item: AdminInvoice | AdminPrepayment }> = [
    ...invoices
      .filter((inv) => matchesStatus(inv.status) && matchesSearch(inv.enrollment?.murid?.name))
      .map((item) => ({ type: "invoice" as const, item })),
    ...prepayments
      .filter((p) => matchesStatus(p.status) && matchesSearch(p.murid?.name))
      .map((item) => ({ type: "prepayment" as const, item })),
  ].sort((a, b) => {
    const da = getTxDate(a.item);
    const db = getTxDate(b.item);
    return historySort === "terbaru" ? db.localeCompare(da) : da.localeCompare(db);
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full flex-grow flex flex-col gap-6">
      <PageHeader
        title="Tagihan"
        subtitle="Terbitkan tagihan dan kelola status pembayaran murid."
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative flex-1">
                <span className="sr-only">Cari tagihan</span>
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari nama murid..."
                  className="w-full rounded-xl border border-gray-200 bg-white/80 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-[#4a70a9]"
                />
              </label>
              <button
                type="button"
                onClick={() => setHistorySort(historySort === "terbaru" ? "terlama" : "terbaru")}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm font-bold text-gray-700 outline-none transition-colors hover:bg-white focus:border-[#4a70a9]"
                title="Klik untuk membalik urutan"
              >
                {historySort === "terbaru" ? <ArrowDownWideNarrow size={15} /> : <ArrowUpNarrowWide size={15} />}
                {historySort === "terbaru" ? "Terbaru" : "Terlama"}
              </button>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]"
                aria-label="Filter status"
              >
                <option value="">Semua status</option>
                <option value="unpaid">Belum Dibayar</option>
                <option value="waiting">Verifikasi</option>
                <option value="paid">Lunas</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
          </GlassCard>

          {loading ? (
            <GlassCard className="p-8 text-center text-sm font-medium text-gray-600">Memuat daftar tagihan...</GlassCard>
          ) : historyItems.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <Receipt size={28} className="mx-auto text-gray-400" />
              <h2 className="mt-3 font-bold text-gray-800">Belum ada tagihan</h2>
              <p className="mt-1 text-sm text-gray-500">Terbitkan tagihan dari form di samping.</p>
            </GlassCard>
          ) : (
            <div className="grid gap-4">
              {historyItems.map(({ type, item }) =>
                type === "invoice" ? (
                  (() => {
                    const invoice = item as AdminInvoice;
                    return (
                      <GlassCard key={invoice.id} className="p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-sm font-bold text-gray-800">#{invoice.id}</span>
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                                invoice.status === "paid" ? "bg-emerald-100 text-emerald-700" : invoice.status === "waiting" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                              }`}>
                                {invoice.status === "paid" ? <Check size={10} strokeWidth={3} /> : invoice.status === "waiting" ? <Clock size={10} /> : <AlertCircle size={10} />}
                                {invoice.status === "paid" ? "Lunas" : invoice.status === "waiting" ? "Verifikasi" : "Belum Dibayar"}
                              </span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                              <span className="font-semibold text-gray-700">{invoice.enrollment?.murid?.name || "-"}</span>
                              <span>{invoice.enrollment?.program?.name || "-"}</span>
                            </div>
                            <div className="mt-1 text-xs text-gray-400">
                              Tempo: {formatSessionDateTime(invoice.dueAt).split(" • ")[0]}
                              {invoice.paidAt && <> · Dibayar: {formatSessionDateTime(invoice.paidAt).split(" • ")[0]}</>}
                              {invoice.note && <span className="block">{invoice.note}</span>}
                            </div>

                            {invoice.status === "waiting" && (
                              <div className="mt-3 flex items-center gap-3">
                                {invoice.paymentProof?.startsWith("data:image") ? (
                                  <button
                                    type="button"
                                    onClick={() => openInvoiceProof(invoice)}
                                    title="Lihat bukti transfer"
                                    className="shrink-0"
                                  >
                                    <img
                                      src={invoice.paymentProof}
                                      alt="Bukti transfer"
                                      className="h-16 w-16 rounded-lg object-cover border border-gray-200 shadow-sm hover:opacity-80 transition-opacity"
                                    />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => openInvoiceProof(invoice)}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100"
                                  >
                                    <FileText size={14} /> Buka Bukti (PDF)
                                  </button>
                                )}
                                <div className="text-xs text-gray-600">
                                  <p className="font-semibold text-gray-700">
                                    Dibayar: Rp {(invoice.paidAmount ?? invoice.amount).toLocaleString("id-ID")}
                                  </p>
                                  {invoice.submittedAt && (
                                    <p>Terkirim: {formatSessionDateTime(invoice.submittedAt).split(" • ")[0]}</p>
                                  )}
                                  {invoice.paymentProofName && (
                                    <p className="max-w-[200px] truncate">{invoice.paymentProofName}</p>
                                  )}
                                  {invoice.paymentNote && (
                                    <p className="max-w-[240px] text-amber-700">Catatan: {invoice.paymentNote}</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <div className="text-right">
                              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Nominal</p>
                              <p className="text-lg font-bold text-[#4a70a9]">Rp {invoice.amount.toLocaleString("id-ID")}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => openInvoiceProof(invoice)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#4a70a9]/10 px-3 py-2 text-xs font-bold text-[#4a70a9] ring-1 ring-[#4a70a9]/30 hover:bg-[#4a70a9]/20"
                              >
                                <Eye size={14} /> Detail
                              </button>
                              {invoice.status !== "paid" && (
                                <button
                                  type="button"
                                  onClick={() => void handleChangeStatus(invoice, "paid")}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
                                >
                                  <Check size={14} /> Lunas
                                </button>
                              )}
                              {invoice.status === "unpaid" && (
                                <button
                                  type="button"
                                  onClick={() => void handleChangeStatus(invoice, "waiting")}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100"
                                >
                                  <Clock size={14} /> Verifikasi
                                </button>
                              )}
                              {invoice.status !== "unpaid" && (
                                <button
                                  type="button"
                                  onClick={() => void handleChangeStatus(invoice, "unpaid")}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/70 px-3 py-2 text-xs font-bold text-gray-700 ring-1 ring-gray-200 hover:bg-white"
                                >
                                  <XCircle size={14} /> Belum Bayar
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    );
                  })()
                ) : (
                  (() => {
                    const prepayment = item as AdminPrepayment;
                    return (
                      <GlassCard key={prepayment.id} className="p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-sm font-bold text-gray-800">#{prepayment.id}</span>
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                                prepayment.status === "paid" ? "bg-emerald-100 text-emerald-700" : prepayment.status === "cancelled" ? "bg-gray-100 text-gray-500" : "bg-amber-100 text-amber-700"
                              }`}>
                                {prepayment.status === "paid" ? <Check size={10} strokeWidth={3} /> : prepayment.status === "cancelled" ? <XCircle size={10} /> : <Clock size={10} />}
                                {prepayment.status === "paid" ? "Lunas" : prepayment.status === "cancelled" ? "Dibatalkan" : "Menunggu Verifikasi"}
                              </span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                              <span className="font-semibold text-gray-700">{prepayment.murid?.name || "-"}</span>
                              <span>Prabayar (tanpa tagihan)</span>
                            </div>
                            <div className="mt-1 text-xs text-gray-400">
                              Terkirim: {prepayment.submittedAt ? formatSessionDateTime(prepayment.submittedAt).split(" • ")[0] : "-"}
                              {prepayment.paidAt && <> · Lunas: {formatSessionDateTime(prepayment.paidAt).split(" • ")[0]}</>}
                              {prepayment.note && <span className="block">{prepayment.note}</span>}
                            </div>

                            {prepayment.status === "waiting" && (
                              <div className="mt-3 flex items-center gap-3">
                                {prepayment.paymentProof?.startsWith("data:image") ? (
                                  <button
                                    type="button"
                                    onClick={() => openPrepaymentProof(prepayment)}
                                    title="Lihat bukti transfer"
                                    className="shrink-0"
                                  >
                                    <img
                                      src={prepayment.paymentProof}
                                      alt="Bukti transfer prabayar"
                                      className="h-16 w-16 rounded-lg object-cover border border-gray-200 shadow-sm hover:opacity-80 transition-opacity"
                                    />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => openPrepaymentProof(prepayment)}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100"
                                  >
                                    <FileText size={14} /> Buka Bukti (PDF)
                                  </button>
                                )}
                                {prepayment.murid?.wali?.phone && (
                                  <div className="text-xs text-gray-600">
                                    <p className="font-semibold text-gray-700">{prepayment.murid.wali.name || "Wali"}</p>
                                    <p>{prepayment.murid.wali.phone}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <div className="text-right">
                              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Nominal</p>
                              <p className="text-lg font-bold text-[#4a70a9]">Rp {prepayment.amount.toLocaleString("id-ID")}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => openPrepaymentProof(prepayment)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#4a70a9]/10 px-3 py-2 text-xs font-bold text-[#4a70a9] ring-1 ring-[#4a70a9]/30 hover:bg-[#4a70a9]/20"
                              >
                                <Eye size={14} /> Detail
                              </button>
                              {prepayment.status !== "paid" && (
                                <button
                                  type="button"
                                  onClick={() => void handlePrepaymentStatus(prepayment, "paid")}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
                                >
                                  <Check size={14} /> Lunas
                                </button>
                              )}
                              {prepayment.status !== "cancelled" && (
                                <button
                                  type="button"
                                  onClick={() => void handlePrepaymentStatus(prepayment, "cancelled")}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/70 px-3 py-2 text-xs font-bold text-gray-700 ring-1 ring-gray-200 hover:bg-white"
                                >
                                  <XCircle size={14} /> Batalkan
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    );
                  })()
                )
              )}
            </div>
          )}
        </section>

        <GlassCard className="h-fit p-5 xl:sticky xl:top-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-gray-800">Terbitkan Tagihan</h2>
              <p className="mt-1 text-xs text-gray-500">Nominal terisi otomatis dari program, dapat diubah.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <label className="block text-xs font-bold text-gray-700">Enrollment Aktif
              <select required value={form.enrollmentId} onChange={(event) => handleEnrollmentChange(event.target.value)} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]">
                <option value="">Pilih enrollment...</option>
                {enrollments.map((enrollment) => (
                  <option key={enrollment.id} value={enrollment.id}>{enrollment.muridName} — {enrollment.programName}</option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-bold text-gray-700">Nominal (Rp)
              <input
                required
                type="number"
                min={1}
                value={form.amount}
                onChange={(event) => setForm({ ...form, amount: event.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]"
                placeholder="contoh: 180000"
              />
            </label>
            <label className="block text-xs font-bold text-gray-700">Jatuh Tempo
              <input
                required
                type="date"
                value={form.dueAt}
                onChange={(event) => setForm({ ...form, dueAt: event.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]"
              />
            </label>
            <label className="block text-xs font-bold text-gray-700">Catatan
              <textarea
                value={form.note}
                onChange={(event) => setForm({ ...form, note: event.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]"
                placeholder="Opsional, contoh: Biaya Blok 1"
                rows={2}
              />
            </label>
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={saving} className="flex-1 justify-center inline-flex items-center gap-2"><Plus size={16} /> {saving ? "Menerbitkan..." : "Tambah"}</Button>
            </div>
          </form>
        </GlassCard>
      </div>

      {proofData && (
        <ProofModal invoice={proofData} detailHref={proofDetailHref} onClose={() => setProofData(null)} />
      )}

      <ConfirmDialog
        open={confirmPublishOpen}
        title="Terbitkan Tagihan?"
        message={`Yakin ingin menerbitkan tagihan ini untuk ${enrollments.find((e) => e.id === form.enrollmentId)?.muridName || "murid"}? Data akan langsung masuk ke daftar tagihan.`}
        confirmLabel="Terbitkan"
        onConfirm={() => void publishInvoice()}
        onCancel={() => setConfirmPublishOpen(false)}
      />
    </div>
  );
}
