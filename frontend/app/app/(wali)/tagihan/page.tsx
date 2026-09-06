/* Hallmark · genre: warm-editorial · design-system: google-stitch · designed-as-mobile-app */
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Invoice,
  Enrollment,
  Program,
  Murid
} from "@/data/lms";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { apiFetch } from "@/lib/api";
import { formatSessionDateTime } from "@/lib/format";
import ProofModal, { ProofInvoiceData } from "@/components/ui/ProofModal";
import {
  ArrowLeft,
  Bell,
  Clock,
  AlertCircle,
  CheckCircle2,
  Hourglass,
  Copy,
  Check,
  UploadCloud,
  ChevronDown,
  ChevronUp,
  Wallet,
  Building,
  FileText,
  ChevronRight,
  ShieldCheck,
  Send,
  MessageCircle,
  Paperclip
} from "lucide-react";

interface DbMurid {
  id: string;
  name: string;
}

interface PaymentAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isActive: boolean;
  isDefault: boolean;
  note?: string | null;
}

interface DbEnrollment extends Enrollment {
  program: Program;
  murid: Murid;
}

interface DbInvoice extends Invoice {
  enrollment: DbEnrollment;
  paymentProof?: string | null;
  paymentProofName?: string | null;
  paidAmount?: number | null;
  submittedAt?: string | null;
  paymentNote?: string | null;
}

interface DbPrepayment {
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
}

export default function TagihanWaliPage() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Wali");
  const [murids, setMurids] = useState<DbMurid[]>([]);
  const [selectedMuridId, setSelectedMuridId] = useState("");

  const [invoices, setInvoices] = useState<DbInvoice[]>([]);
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>([]);
  const [prepayments, setPrepayments] = useState<DbPrepayment[]>([]);

  // State Form Pembayaran Tagihan Aktif
  const [uploadedProof, setUploadedProof] = useState<string | null>(null);
  const [uploadedProofName, setUploadedProofName] = useState<string>("");
  const [paymentNote, setPaymentNote] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // State Accordion Prabayar
  const [isPrepaymentOpen, setIsPrepaymentOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [prepaymentNote, setPrepaymentNote] = useState<string>("");
  const [uploadedPrepaymentProof, setUploadedPrepaymentProof] = useState<string | null>(null);
  const [uploadedPrepaymentProofName, setUploadedPrepaymentProofName] = useState<string>("");
  const [submittingPrepayment, setSubmittingPrepayment] = useState(false);

  // State Riwayat Pembayaran (Hidden by Default)
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [historySort, setHistorySort] = useState<"terbaru" | "terlama">("terbaru");

  // State Modal Bukti
  const [proofWali, setProofWali] = useState<ProofInvoiceData | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const prepaymentFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const meRes = await apiFetch<{ user: { name: string; murids: DbMurid[] } }>("/api/users/me");
        setUserName(meRes.user.name || "Wali");
        setMurids(meRes.user.murids || []);
        if (meRes.user.murids?.length > 0) {
          setSelectedMuridId(meRes.user.murids[0].id);
        }

        const invoicesRes = await apiFetch<{ invoices: DbInvoice[] }>("/api/me/invoices");
        setInvoices(invoicesRes.invoices || []);

        const [accountsRes, prepaymentsRes] = await Promise.all([
          apiFetch<{ data: PaymentAccount[] }>("/api/payment-accounts"),
          apiFetch<{ data: DbPrepayment[] }>("/api/me/prepayments").catch(() => ({ data: [] as DbPrepayment[] })),
        ]);
        setPaymentAccounts(accountsRes.data || []);
        setPrepayments(prepaymentsRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load invoices data:", err);
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
        <p className="text-xs font-semibold text-[#737781]">Memuat informasi tagihan...</p>
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

  const activeInvoices = invoices.filter((inv) => inv.enrollment?.muridId === selectedMuridId);
  const pendingInvoices = activeInvoices.filter((inv) => inv.status !== "paid");
  const latestUnpaid = pendingInvoices[0];

  const defaultAccount =
    paymentAccounts.find((acc) => acc.isDefault && acc.isActive) ||
    paymentAccounts.find((acc) => acc.isActive) ||
    null;

  const getTxDate = (item: DbInvoice | DbPrepayment): string => {
    if ("enrollment" in item) {
      return item.paidAt ?? item.submittedAt ?? item.dueAt;
    }
    return item.paidAt ?? item.submittedAt ?? item.createdAt;
  };

  const historyItems = [
    ...activeInvoices.map((inv) => ({ type: "invoice" as const, item: inv, date: getTxDate(inv) })),
    ...prepayments
      .filter((p) => p.muridId === selectedMurid?.id)
      .map((p) => ({ type: "prepayment" as const, item: p, date: getTxDate(p) })),
  ].sort((a, b) => (historySort === "terbaru" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));

  // Handle Copy Nomor Rekening
  const handleCopyAccount = (accNumber: string) => {
    navigator.clipboard.writeText(accNumber.replace(/\s+/g, ""));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Upload Handler untuk Tagihan Aktif
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      alert("Format file harus berupa gambar (JPG/PNG) atau PDF.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (file.type.startsWith("image/")) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 450;
          const MAX_HEIGHT = 450;
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
            setUploadedProof(canvas.toDataURL("image/jpeg", 0.8));
            setUploadedProofName(file.name);
            setPaymentError(null);
          }
        };
        img.src = result;
      } else {
        if (result.length > 4_000_000) {
          alert("File PDF terlalu besar. Maksimal 4MB.");
          return;
        }
        setUploadedProof(result);
        setUploadedProofName(file.name);
        setPaymentError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload Handler untuk Prabayar
  const handlePrepaymentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedPrepaymentProof(result);
      setUploadedPrepaymentProofName(file.name);
    };
    reader.readAsDataURL(file);
  };

  // Submit Pembayaran Tagihan Aktif
  const handleSubmitPayment = async (invoice: DbInvoice) => {
    if (!uploadedProof) {
      setPaymentError("Unggah bukti transfer terlebih dahulu.");
      return;
    }
    setSubmitting(true);
    setPaymentError(null);
    try {
      await apiFetch<{ data: unknown }>(`/api/me/invoices/${invoice.id}/payment`, {
        method: "POST",
        body: JSON.stringify({
          paymentProof: uploadedProof,
          paymentProofName: uploadedProofName,
          paymentNote: paymentNote.trim() || undefined,
        }),
      });

      const invRes = await apiFetch<{ invoices: DbInvoice[] }>("/api/me/invoices");
      setInvoices(invRes.invoices || []);
      setUploadedProof(null);
      setUploadedProofName("");
      setPaymentNote("");
      alert("Bukti pembayaran berhasil dikirim! Menunggu verifikasi admin.");
    } catch (err) {
      console.error(err);
      setPaymentError("Gagal mengirim bukti pembayaran. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Pembayaran Prabayar
  const handleSubmitPrepayment = async () => {
    const amountVal = Number(customAmount) || 0;
    if (amountVal <= 0) {
      alert("Masukkan nominal deposit / pembayaran prabayar.");
      return;
    }
    if (!selectedMuridId) {
      alert("Pilih murid terlebih dahulu.");
      return;
    }
    if (!uploadedPrepaymentProof) {
      alert("Unggah bukti transfer terlebih dahulu.");
      return;
    }

    setSubmittingPrepayment(true);
    try {
      await apiFetch("/api/me/prepayments", {
        method: "POST",
        body: JSON.stringify({
          muridId: selectedMuridId,
          amount: amountVal,
          note: prepaymentNote.trim() || undefined,
          paymentProof: uploadedPrepaymentProof,
          paymentProofName: uploadedPrepaymentProofName,
        }),
      });

      const [prepRes, invRes] = await Promise.all([
        apiFetch<{ data: DbPrepayment[] }>("/api/me/prepayments"),
        apiFetch<{ invoices: DbInvoice[] }>("/api/me/invoices"),
      ]);
      setPrepayments(prepRes.data || []);
      setInvoices(invRes.invoices || []);
      setCustomAmount("");
      setPrepaymentNote("");
      setUploadedPrepaymentProof(null);
      setUploadedPrepaymentProofName("");
      setIsPrepaymentOpen(false);
      alert("Pembayaran prabayar berhasil diajukan! Menunggu verifikasi admin.");
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim data pembayaran prabayar.");
    } finally {
      setSubmittingPrepayment(false);
    }
  };

  const openInvoiceDetail = (inv: DbInvoice) => {
    setProofWali({
      id: inv.id,
      amount: inv.amount,
      status: inv.status,
      submittedAt: inv.submittedAt,
      paymentProof: inv.paymentProof,
      paymentProofName: inv.paymentProofName,
      note: inv.paymentNote,
      enrollment: {
        murid: selectedMurid ? { id: selectedMurid.id, name: selectedMurid.name } : null,
        program: inv.enrollment?.program ? { id: inv.enrollment.program.id, name: inv.enrollment.program.name } : null,
      },
    });
  };

  const openPrepaymentDetail = (prep: DbPrepayment) => {
    setProofWali({
      id: prep.id,
      amount: prep.amount,
      status: prep.status === "cancelled" ? "unpaid" : prep.status,
      submittedAt: prep.submittedAt,
      paymentProof: prep.paymentProof,
      paymentProofName: prep.paymentProofName,
      note: prep.note,
      isPrepayment: true,
      murid: selectedMurid ? { id: selectedMurid.id, name: selectedMurid.name } : null,
    });
  };

  return (
    <div className="px-4 pt-2 pb-24 space-y-4 animate-[fadeIn_0.3s_ease-out] font-dm text-[#1a1a2e]">
      {/* 1. Top Bar Navigation (Stitch Screen 61df6c7) */}
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
              Tagihan
            </h1>
            <p className="text-[11px] text-[#737781] leading-none mt-0.5">
              Kelola &amp; Pembayaran Belajar
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Notifikasi Tagihan"
          className="w-9 h-9 rounded-full bg-white border border-[#e5ddd0] flex items-center justify-center text-[#434750] hover:text-[#4a70a9] transition-colors shadow-xs active:scale-95"
        >
          <Bell size={17} />
        </button>
      </header>

      {/* 2. Child Selector (Avatar Inisial Bulat - Seragam Stitch) */}
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
          {/* 3. Section Tagihan Aktif (Hero Card Stitch) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base font-bold font-playfair text-[#1a1a2e]">
                Tagihan Aktif
              </h2>
              {pendingInvoices.length > 0 && (
                <span className="inline-flex items-center gap-1 bg-[#fff3e0] text-[#d97706] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <Clock size={11} />
                  <span>{pendingInvoices.length} Menunggu</span>
                </span>
              )}
            </div>

            {latestUnpaid ? (
              <article className="bg-white rounded-xl border border-[#e5ddd0] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)] space-y-3.5">
                {/* Header Tagihan & Status Badge */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[#e5ddd0]/60">
                  <span className="font-mono text-xs font-bold text-[#4a70a9]">
                    #{latestUnpaid.id}
                  </span>
                  {latestUnpaid.status === "waiting" ? (
                    <span className="inline-flex items-center gap-1 bg-[#fffbeb] border border-[#fde68a] text-[#d97706] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      <Hourglass size={11} />
                      <span>Menunggu Verifikasi</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      <AlertCircle size={11} />
                      <span>Belum Dibayar</span>
                    </span>
                  )}
                </div>

                {/* Program & Periode */}
                <div>
                  <h3 className="text-base font-bold font-playfair text-[#1a1a2e] leading-snug">
                    {latestUnpaid.enrollment?.program?.name || "Matematika & IPA Terpadu (Kelas 8)"}
                  </h3>
                  <p className="text-xs text-[#737781] mt-0.5">
                    Paket {new Date(latestUnpaid.dueAt).toLocaleDateString("id-ID", { month: "long", year: "numeric" })} (16 Sesi Pembelajaran)
                  </p>
                </div>

                {/* Ringkasan Nominal Tagihan */}
                <div className="bg-[#f7f4ef] rounded-xl p-3 space-y-1.5 border border-[#e5ddd0]/60">
                  <div className="flex justify-between text-xs text-[#737781]">
                    <span>Biaya Paket:</span>
                    <span className="font-semibold text-[#1a1a2e]">
                      Rp {latestUnpaid.amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline border-t border-[#e5ddd0]/60 pt-1.5">
                    <span className="text-xs font-bold text-[#1a1a2e]">Total Tagihan:</span>
                    <span className="text-lg font-bold text-[#30578f] font-mono">
                      Rp {latestUnpaid.amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#dc2626] pt-1">
                    <Clock size={12} />
                    <span>Jatuh tempo: {formatSessionDateTime(latestUnpaid.dueAt).split(" • ")[0]}</span>
                  </div>
                </div>

                {/* Informasi Rekening Bank Transfer */}
                <div className="border border-[#e5ddd0] rounded-xl p-3 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#737781]">
                      Transfer ke: Manual Verification
                    </span>
                    <ShieldCheck size={14} className="text-[#16a34a]" />
                  </div>
                  {defaultAccount ? (
                    <div>
                      <p className="text-xs font-bold text-[#1a1a2e]">{defaultAccount.bankName}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-mono text-base font-bold text-[#30578f] tracking-wide">
                          {defaultAccount.accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyAccount(defaultAccount.accountNumber)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#eaf0f8] hover:bg-[#d9e6f6] active:scale-95 text-[#30578f] text-[11px] font-bold transition-all"
                        >
                          {copySuccess ? <Check size={13} className="text-[#16a34a]" /> : <Copy size={13} />}
                          <span>{copySuccess ? "Tersalin!" : "Salin"}</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-[#737781] mt-0.5">a.n. {defaultAccount.accountName}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-[#737781]">Info rekening transfer akan segera tersedia.</p>
                  )}
                </div>

                {/* Area Upload Bukti Pembayaran */}
                {latestUnpaid.status === "unpaid" ? (
                  <div className="space-y-3 pt-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*,application/pdf"
                      className="hidden"
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#c8b99a] hover:border-[#4a70a9] rounded-xl p-4 text-center cursor-pointer bg-[#fdfcfa] hover:bg-[#f7f4ef] transition-colors flex flex-col items-center justify-center gap-1.5"
                    >
                      <UploadCloud size={24} className="text-[#4a70a9]" />
                      <p className="text-xs font-semibold text-[#1a1a2e]">
                        {uploadedProofName ? uploadedProofName : "Ketuk untuk pilih file bukti bayar"}
                      </p>
                      <p className="text-[10px] text-[#737781]">
                        {uploadedProofName ? "File siap diunggah" : "JPG, PNG, atau PDF (maks. 4MB)"}
                      </p>
                    </div>

                    {paymentError && (
                      <p className="text-xs text-[#dc2626] font-semibold">{paymentError}</p>
                    )}

                    <div>
                      <input
                        type="text"
                        value={paymentNote}
                        onChange={(e) => setPaymentNote(e.target.value)}
                        placeholder="Catatan tambahan (opsional)"
                        className="w-full text-xs rounded-xl border border-[#e5ddd0] bg-white px-3 py-2 text-[#1a1a2e] outline-none focus:border-[#4a70a9]"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleSubmitPayment(latestUnpaid)}
                      className="w-full py-2.5 rounded-xl bg-[#4a70a9] hover:bg-[#3d5d8c] active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
                    >
                      <Send size={14} />
                      <span>{submitting ? "Mengirim..." : "Kirim Bukti Pembayaran"}</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-3 flex items-center gap-2 text-xs text-[#92400e]">
                    <Hourglass size={16} className="text-[#d97706] shrink-0" />
                    <span>Bukti pembayaran sedang diverifikasi oleh admin. Kami akan segera memperbarui status tagihan Anda.</span>
                  </div>
                )}
              </article>
            ) : (
              <div className="bg-white border border-[#e5ddd0] rounded-xl p-6 text-center space-y-2 shadow-xs">
                <CheckCircle2 size={32} className="text-[#16a34a] mx-auto" />
                <h3 className="text-sm font-bold text-[#1a1a2e]">Tidak Ada Tagihan Menunggu</h3>
                <p className="text-xs text-[#737781]">
                  Seluruh kewajiban pembayaran untuk {selectedMurid.name} telah lunas.
                </p>
              </div>
            )}
          </section>

          {/* 4. Accordion: Pembayaran Mandiri / Prabayar (Stitch Collapsible) */}
          <section className="bg-white rounded-xl border border-[#e5ddd0] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
            <button
              type="button"
              onClick={() => setIsPrepaymentOpen((prev) => !prev)}
              className="w-full p-4 flex items-start justify-between text-left hover:bg-[#f7f4ef]/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#eaf0f8] text-[#4a70a9] flex items-center justify-center shrink-0 mt-0.5">
                  <Wallet size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1a1a2e] font-playfair">
                    Pembayaran Mandiri / Prabayar
                  </h3>
                  <p className="text-[11px] text-[#737781] mt-0.5 leading-snug">
                    Bayar di muka untuk sesi atau deposit paket belajar berikutnya.
                  </p>
                </div>
              </div>
              <div className="text-[#737781] p-1">
                {isPrepaymentOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            {isPrepaymentOpen && (
              <div className="p-4 pt-0 border-t border-[#e5ddd0]/60 space-y-3 animate-[fadeIn_0.2s_ease-out]">
                <p className="text-[11px] text-[#737781] leading-relaxed">
                  Gunakan opsi ini jika Anda ingin melakukan deposit mandiri atau top up kuota sesi ekstra sebelum invoice terbit otomatis.
                </p>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#737781]">
                    Nominal Transfer (Rp)
                  </label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Contoh: 500000"
                    className="w-full text-xs rounded-xl border border-[#e5ddd0] bg-white px-3 py-2 text-[#1a1a2e] outline-none focus:border-[#4a70a9]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#737781]">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    value={prepaymentNote}
                    onChange={(e) => setPrepaymentNote(e.target.value)}
                    placeholder="Contoh: Deposit penambahan 4 sesi persiapan ujian"
                    rows={2}
                    className="w-full text-xs rounded-xl border border-[#e5ddd0] bg-white px-3 py-2 text-[#1a1a2e] outline-none focus:border-[#4a70a9] resize-none"
                  />
                </div>

                {/* Upload Bukti Prabayar */}
                <input
                  type="file"
                  ref={prepaymentFileInputRef}
                  onChange={handlePrepaymentFileChange}
                  accept="image/*,application/pdf"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => prepaymentFileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 rounded-xl border border-[#e5ddd0] bg-[#f7f4ef] hover:bg-[#eaf0f8] text-xs font-semibold text-[#30578f] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Paperclip size={14} />
                  <span>
                    {uploadedPrepaymentProofName ? uploadedPrepaymentProofName : "Pilih Struk / Bukti Transfer"}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={submittingPrepayment}
                  onClick={handleSubmitPrepayment}
                  className="w-full py-2.5 rounded-xl bg-[#4a70a9] hover:bg-[#3d5d8c] active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
                >
                  <Wallet size={14} />
                  <span>{submittingPrepayment ? "Mengirim..." : "Kirim Pembayaran Prabayar"}</span>
                </button>
              </div>
            )}
          </section>

          {/* 5. Section Riwayat Pembayaran (Hidden by Default sesuai request) */}
          <section className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base font-bold font-playfair text-[#1a1a2e]">
                Riwayat Pembayaran
              </h2>
              <button
                type="button"
                onClick={() => setShowAllHistory((prev) => !prev)}
                className="text-xs font-semibold text-[#4a70a9] hover:underline flex items-center gap-1"
              >
                <span>{showAllHistory ? "Tutup Riwayat" : "Lihat Riwayat"}</span>
                {showAllHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {showAllHistory ? (
              <div className="space-y-3 animate-[fadeIn_0.2s_ease-out]">
                {/* Sortir Sederhana */}
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-[#737781]">Total {historyItems.length} transaksi</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setHistorySort("terbaru")}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        historySort === "terbaru" ? "bg-[#4a70a9] text-white" : "bg-white border border-[#e5ddd0] text-[#737781]"
                      }`}
                    >
                      Terbaru
                    </button>
                    <button
                      type="button"
                      onClick={() => setHistorySort("terlama")}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        historySort === "terlama" ? "bg-[#4a70a9] text-white" : "bg-white border border-[#e5ddd0] text-[#737781]"
                      }`}
                    >
                      Terlama
                    </button>
                  </div>
                </div>

                {historyItems.length > 0 ? (
                  <div className="space-y-2.5">
                    {historyItems.map((entry) => {
                      const isInvoice = entry.type === "invoice";
                      const item = entry.item;
                      const isPaid = item.status === "paid";
                      const isWaiting = item.status === "waiting";

                      return (
                        <article
                          key={item.id}
                          className="bg-white rounded-xl border border-[#e5ddd0] p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.08)] space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-[#737781]">
                              #{item.id}
                            </span>
                            {isPaid ? (
                              <span className="inline-flex items-center gap-1 bg-[#dcfce7] text-[#16a34a] px-2 py-0.5 rounded-full text-[10px] font-bold">
                                <CheckCircle2 size={11} />
                                <span>Lunas</span>
                              </span>
                            ) : isWaiting ? (
                              <span className="inline-flex items-center gap-1 bg-[#fffbeb] text-[#d97706] px-2 py-0.5 rounded-full text-[10px] font-bold">
                                <Hourglass size={11} />
                                <span>Verifikasi</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-[#fef2f2] text-[#dc2626] px-2 py-0.5 rounded-full text-[10px] font-bold">
                                <AlertCircle size={11} />
                                <span>Belum Dibayar</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-baseline justify-between">
                            <span className="font-mono text-base font-bold text-[#1a1a2e]">
                              Rp {item.amount.toLocaleString("id-ID")}
                            </span>
                            <span className="text-[11px] text-[#737781]">
                              {formatSessionDateTime(entry.date).split(" • ")[0]}
                            </span>
                          </div>

                          <div className="text-xs text-[#434750]">
                            {isInvoice ? (
                              <span className="font-medium">
                                {(item as DbInvoice).enrollment?.program?.name || "Bimbingan Belajar"}
                              </span>
                            ) : (
                              <span className="font-medium text-[#4a70a9]">
                                Pembayaran Mandiri / Prabayar
                              </span>
                            )}
                          </div>

                          <div className="border-t border-[#e5ddd0]/50 pt-2 flex items-center justify-between">
                            <span className="text-[10px] text-[#737781]">
                              Metode: Transfer Bank
                            </span>
                            <button
                              type="button"
                              onClick={() => (isInvoice ? openInvoiceDetail(item as DbInvoice) : openPrepaymentDetail(item as DbPrepayment))}
                              className="inline-flex items-center gap-0.5 text-xs font-bold text-[#4a70a9] hover:underline"
                            >
                              <span>Detail</span>
                              <ChevronRight size={13} />
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white border border-[#e5ddd0] rounded-xl p-6 text-center text-xs text-[#737781]">
                    Belum ada riwayat transaksi pembayaran.
                  </div>
                )}
              </div>
            ) : (
              <div
                onClick={() => setShowAllHistory(true)}
                className="bg-white border border-[#e5ddd0] rounded-xl p-4 text-center cursor-pointer hover:bg-[#f7f4ef]/50 transition-colors shadow-xs"
              >
                <p className="text-xs font-semibold text-[#4a70a9]">
                  Terdapat {historyItems.length} transaksi sebelumnya
                </p>
                <p className="text-[11px] text-[#737781] mt-0.5">
                  Ketuk untuk membuka riwayat pembayaran
                </p>
              </div>
            )}
          </section>

          {/* Modal Pratinjau Bukti Pembayaran */}
          {proofWali && (
            <ProofModal
              invoice={proofWali}
              onClose={() => setProofWali(null)}
              hideLink={true}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white border border-[#e5ddd0] rounded-xl text-xs text-[#737781]">
          Tidak ada data anak ditemukan. Hubungi admin untuk mendaftarkan anak Anda.
        </div>
      )}
    </div>
  );
}
