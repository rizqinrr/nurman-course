/* Hallmark · genre: playful-glassmorphism · design-system: design.md · designed-as-app */
"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Invoice,
  Enrollment,
  Program,
  Murid
} from "@/data/lms";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { apiFetch } from "@/lib/api";
import { formatSessionDateTime } from "@/lib/format";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import ProofModal, { ProofInvoiceData } from "@/components/ui/ProofModal";
import { 
  AlertCircle, 
  CheckCircle2, 
  Coins, 
  Upload, 
  Building,
  Check,
  Clock,
  Eye
} from "lucide-react";

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

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
  const [murids, setMurids] = useState<DbMurid[]>([]);
  const [selectedMuridId, setSelectedMuridId] = useState("");
  
  const [invoices, setInvoices] = useState<DbInvoice[]>([]);
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>([]);

  const [uploadedProof, setUploadedProof] = useState<string | null>(null);
  const [uploadedProofName, setUploadedProofName] = useState<string>("");
  const [paymentNote, setPaymentNote] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [prepayments, setPrepayments] = useState<DbPrepayment[]>([]);
  const [historySort, setHistorySort] = useState<"terbaru" | "terlama">("terbaru");
  const [proofWali, setProofWali] = useState<ProofInvoiceData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Live mode
        const meRes = await apiFetch<{ user: { name: string; murids: DbMurid[] } }>("/api/users/me");
        setMurids(meRes.user.murids || []);
        if (meRes.user.murids?.length > 0) {
          setSelectedMuridId(meRes.user.murids[0].id);
        }

        const invoicesRes = await apiFetch<{ invoices: DbInvoice[] }>("/api/me/invoices");
        setInvoices(invoicesRes.invoices);

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
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full flex-grow flex flex-col gap-6 items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#4a70a9] animate-spin"></div>
        <p className="text-sm font-semibold text-gray-600">Memuat tagihan belajar...</p>
      </div>
    );
  }

  const selectedMurid = murids.find((m) => m.id === selectedMuridId);

  const getFilteredInvoices = (): DbInvoice[] => {
    return invoices.filter((inv) => inv.enrollment?.muridId === selectedMuridId);
  };

  const activeInvoices = getFilteredInvoices();
  const pendingInvoices = activeInvoices.filter((inv) => inv.status !== "paid");

  // Tagihan terbaru yang belum lunas (belum dibayar / menunggu verifikasi)
  const latestUnpaid = pendingInvoices[0];

  // Rekening tujuan transfer (default dulu, lalu yang pertama aktif)
  const defaultAccount = paymentAccounts.find((acc) => acc.isDefault && acc.isActive) ||
    paymentAccounts.find((acc) => acc.isActive) ||
    null;

  // Riwayat gabungan: invoice + prabayar, urut berdasarkan tanggal transaksi
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
            setUploadedProof(canvas.toDataURL("image/jpeg", 0.8));
            setUploadedProofName(file.name);
            setPaymentError(null);
          }
        };
        img.src = result;
      } else {
        if (result.length > 4_000_000) {
          alert("File PDF terlalu besar. Maksimal sekitar 3MB.");
          return;
        }
        setUploadedProof(result);
        setUploadedProofName(file.name);
        setPaymentError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

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
          amount: invoice.amount,
          proofBase64: uploadedProof,
          proofName: uploadedProofName,
          note: paymentNote || null,
        }),
      });
      const invoicesRes = await apiFetch<{ invoices: DbInvoice[] }>("/api/me/invoices");
      setInvoices(invoicesRes.invoices);
      setUploadedProof(null);
      setUploadedProofName("");
      setPaymentNote("");
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "Gagal mengirim pembayaran.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitPrepayment = async () => {
    const amountVal = Number(customAmount) || 0;
    if (amountVal <= 0) {
      setPaymentError("Silakan masukkan nominal pembayaran.");
      return;
    }
    if (!uploadedProof) {
      setPaymentError("Unggah bukti transfer terlebih dahulu.");
      return;
    }
    if (!selectedMurid) return;
    setSubmitting(true);
    setPaymentError(null);
    try {
      await apiFetch<{ data: DbPrepayment }>("/api/me/prepayments", {
        method: "POST",
        body: JSON.stringify({
          muridId: selectedMurid.id,
          amount: amountVal,
          proofBase64: uploadedProof,
          proofName: uploadedProofName,
          note: paymentNote || null,
        }),
      });
      const prepaymentsRes = await apiFetch<{ data: DbPrepayment[] }>("/api/me/prepayments");
      setPrepayments(prepaymentsRes.data || []);
      setCustomAmount("");
      setUploadedProof(null);
      setUploadedProofName("");
      setPaymentNote("");
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "Gagal mengirim pembayaran.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleWAConfirm = (invoiceId: string, amount: number) => {
    if (!selectedMurid) return;
    const text = encodeURIComponent(
      `Halo Admin Nurman Course, saya ingin konfirmasi pembayaran untuk Invoice *#${invoiceId}* atas nama siswa *${selectedMurid.name}* sebesar *Rp ${amount.toLocaleString("id-ID")}*. Bukti transfer telah terlampir/diunggah di portal. Terima kasih.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  const getProgramNameFromEnrollment = (enrollmentId: string, liveProgramName?: string) => {
    if (liveProgramName) return liveProgramName;
    if (enrollmentId.includes("ngaji")) return "Ngaji Iqra & Al-Qur'an";
    if (enrollmentId.includes("vibe")) return "Kelas Vibe Coding";
    return "Calistung Dasar";
  };

  // Mapper period & breakdown di frontend untuk live mode
  const getInvoicePeriod = (inv: DbInvoice) => {
    // Menggunakan data startedAt dari enrollment atau deskripsi/note
    if (inv.note) return inv.note; // e.g. "Biaya Blok 1 Kelas Ngaji Al-Qur'an"
    const d = new Date(inv.enrollment.startedAt);
    return `Periode Bimbingan Belajar (Mulai ${d.toLocaleDateString("id-ID", { month: "long", year: "numeric" })})`;
  };

  const getInvoiceBreakdown = (inv: DbInvoice) => {
    return [
      {
        label: `Biaya Paket Program ${inv.enrollment?.program?.name || ""}`,
        amount: inv.amount
      }
    ];
  };

  const renderStatusBadge = (status: string) => {
    if (status === "paid") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md text-[10px] font-bold shadow-sm">
          <Check size={10} strokeWidth={3} />
          Lunas
        </span>
      );
    }
    if (status === "unpaid") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-800 border border-red-200 rounded-md text-[10px] font-bold shadow-sm">
          <AlertCircle size={10} />
          Belum Dibayar
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-200 rounded-md text-[10px] font-bold shadow-sm">
        <Clock size={10} />
        Verifikasi
      </span>
    );
  };

  const renderInvoiceDate = (inv: DbInvoice) => {
    if (inv.status === "paid") {
      return <span>Dibayar: {inv.paidAt ? formatSessionDateTime(inv.paidAt).split(" • ")[0] : "-"}</span>;
    }
    return <span>Tempo: {formatSessionDateTime(inv.dueAt).split(" • ")[0]}</span>;
  };

  const renderPrepaymentBadge = (status: DbPrepayment["status"]) => {
    if (status === "paid") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md text-[10px] font-bold shadow-sm">
          <Check size={10} strokeWidth={3} />
          Lunas
        </span>
      );
    }
    if (status === "cancelled") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded-md text-[10px] font-bold shadow-sm">
          <AlertCircle size={10} />
          Dibatalkan
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-200 rounded-md text-[10px] font-bold shadow-sm">
        <Clock size={10} />
        Menunggu Verifikasi
      </span>
    );
  };

  const renderPrepaymentDate = (p: DbPrepayment) => {
    if (p.status === "paid") {
      return <span>Dibayar: {p.paidAt ? formatSessionDateTime(p.paidAt).split(" • ")[0] : "-"}</span>;
    }
    if (p.status === "cancelled") {
      return <span>Dikirim: {p.submittedAt ? formatSessionDateTime(p.submittedAt).split(" • ")[0] : "-"}</span>;
    }
    return <span>Dikirim: {p.submittedAt ? formatSessionDateTime(p.submittedAt).split(" • ")[0] : formatSessionDateTime(p.createdAt).split(" • ")[0]}</span>;
  };

  const openWaliInvoiceDetail = (inv: DbInvoice) => {
    setProofWali({
      id: inv.id,
      amount: inv.amount,
      status: inv.status,
      paymentProof: inv.paymentProof,
      paymentProofName: inv.paymentProofName,
      paidAmount: inv.paidAmount,
      submittedAt: inv.submittedAt,
      note: inv.paymentNote,
      enrollment: inv.enrollment
        ? {
            murid: inv.enrollment.murid ? { id: inv.enrollment.murid.id, name: inv.enrollment.murid.name } : null,
            program: inv.enrollment.program ? { id: inv.enrollment.program.id, name: inv.enrollment.program.name } : null,
          }
        : null,
    });
  };

  const openWaliPrepaymentDetail = (p: DbPrepayment) => {
    setProofWali({
      id: p.id,
      amount: p.amount,
      status: p.status === "paid" ? "paid" : "waiting",
      paymentProof: p.paymentProof,
      paymentProofName: p.paymentProofName,
      paidAmount: p.amount,
      submittedAt: p.submittedAt,
      note: p.note,
      isPrepayment: true,
      murid: selectedMurid ? { id: selectedMurid.id, name: selectedMurid.name } : null,
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full flex-grow flex flex-col gap-6 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Page Header */}
      <header className="flex flex-col gap-1 bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight font-sans">
          Tagihan Saya
        </h1>
        <p className="text-sm text-gray-600">
          Lacak tagihan belajar anak Anda dan lakukan konfirmasi pembayaran dengan mudah.
        </p>
      </header>

      {/* Child selector */}
      {murids.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto py-1 bg-white/30 backdrop-blur-xl border border-white/60 p-4 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold text-gray-500 shrink-0">Siswa:</span>
          <div className="flex gap-2">
            {murids.map((m) => {
              const isSelected = m.id === selectedMuridId;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMuridId(m.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 active:scale-95 whitespace-nowrap border flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#4a70a9] text-white border-[#4a70a9] shadow-md shadow-[#4a70a9]/30"
                      : "bg-white/50 border-white/70 text-gray-600 hover:bg-white/85"
                  }`}
                >
                  {m.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedMurid ? (
        <>
          {/* Latest Unpaid Invoice Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Coins className="text-amber-500" size={20} />
              <span>Tagihan Aktif</span>
            </h2>
            
            {latestUnpaid ? (
              <GlassCard className="p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden group border border-white/80 shadow-xl">
                {/* Glow decor */}
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#4a70a9]/10 rounded-full blur-[50px] pointer-events-none group-hover:scale-110 duration-700"></div>

                {/* Card Title & Status */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-200/50 pb-4 relative z-10">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Invoice</span>
                    <h3 className="text-base sm:text-lg font-bold text-gray-800">#{latestUnpaid.id}</h3>
                  </div>
                  {latestUnpaid.status === "unpaid" ? (
                    <span className="px-3 py-1 bg-red-50 text-red-800 border border-red-100 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm animate-pulse">
                      <AlertCircle size={14} className="text-red-500" />
                      Belum Dibayar
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-100 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <Clock size={14} className="text-amber-500" />
                      Menunggu Verifikasi
                    </span>
                  )}
                </div>

                {/* Details Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="flex flex-col gap-3 text-xs sm:text-sm text-gray-600">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Program</p>
                      <p className="font-semibold text-gray-800">
                        {getProgramNameFromEnrollment(latestUnpaid.enrollmentId, latestUnpaid.enrollment?.program?.name)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Periode Sesi</p>
                      <p className="font-semibold text-gray-800">{getInvoicePeriod(latestUnpaid)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-red-400 font-bold uppercase">Jatuh Tempo</p>
                      <p className="font-semibold text-red-600">
                        {formatSessionDateTime(latestUnpaid.dueAt).split(" • ")[0]}
                      </p>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="flex flex-col justify-center gap-3 bg-white/20 border border-white/40 p-4 sm:p-5 rounded-xl">
                    <div className="flex flex-col gap-1.5 text-xs text-gray-500 border-b border-gray-200/50 pb-2">
                      {getInvoiceBreakdown(latestUnpaid).map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{item.label}</span>
                          <span className="font-semibold text-gray-700">Rp {item.amount.toLocaleString("id-ID")}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Total Tagihan</p>
                      <p className="text-2xl font-bold text-[#4a70a9] leading-none">
                        Rp {latestUnpaid.amount.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bank Account Information */}
                <div className="border-t border-gray-200/30 pt-4 flex gap-4 items-start relative z-10">
                  <div className="w-10 h-10 rounded-full bg-[#4a70a9]/10 flex items-center justify-center shrink-0 text-[#4a70a9]">
                    <Building size={20} />
                  </div>
                  {defaultAccount ? (
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-800">Transfer {defaultAccount.bankName}</p>
                      <p className="text-base sm:text-lg font-mono font-bold text-[#4a70a9] tracking-wider my-0.5">
                        {defaultAccount.accountNumber}
                      </p>
                      <p className="text-xs text-gray-500">a/n {defaultAccount.accountName}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-800">Info Rekening</p>
                      <p className="text-sm text-gray-500">Rekening tujuan transfer akan segera ditambahkan.</p>
                    </div>
                  )}
                </div>

                {paymentError && latestUnpaid.status === "unpaid" && (
                  <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 relative z-10">
                    {paymentError}
                  </div>
                )}

                {latestUnpaid.status === "unpaid" ? (
                  <>
                    {/* Upload Bukti Transfer */}
                    <div 
                      onClick={handleUploadAreaClick}
                      className="border-2 border-dashed border-gray-300 hover:border-[#4a70a9]/50 rounded-xl p-5 text-center cursor-pointer hover:bg-[#4a70a9]/5 transition-colors duration-200 group relative z-10 flex flex-col items-center justify-center gap-1.5"
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange}
                        className="hidden" 
                        accept="image/*,application/pdf"
                      />
                      {uploadedProof ? (
                        <>
                          {uploadedProof.startsWith("data:image") ? (
                            <img src={uploadedProof} alt="Pratinjau bukti transfer" className="max-h-24 rounded-lg border border-white shadow-sm mb-1 shrink-0" />
                          ) : (
                            <Check className="text-emerald-500 mb-1 shrink-0 animate-bounce" size={24} />
                          )}
                          <p className="text-xs font-semibold text-gray-800 truncate max-w-xs">{uploadedProofName}</p>
                          <p className="text-[10px] text-emerald-600 font-bold uppercase">Berhasil Diunggah</p>
                        </>
                      ) : (
                        <>
                          <Upload className="text-gray-400 group-hover:scale-110 transition-transform mb-1 shrink-0" size={24} />
                          <p className="text-xs font-semibold text-gray-700">Unggah Bukti Transfer</p>
                          <p className="text-[10px] text-gray-400">Format JPG, PNG, atau PDF</p>
                        </>
                      )}
                    </div>

                    {/* Catatan Pembayaran */}
                    <div className="relative z-10">
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Catatan (Opsional)</label>
                      <textarea
                        value={paymentNote}
                        onChange={(e) => setPaymentNote(e.target.value)}
                        placeholder="Contoh: Pembayaran bulan September, sudah konfirmasi via WA"
                        rows={2}
                        className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9] resize-none"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2.5 relative z-10">
                      <Button
                        onClick={() => handleSubmitPayment(latestUnpaid)}
                        disabled={submitting}
                        className="w-full text-sm sm:text-base justify-center py-3.5 shadow-md shadow-[#4a70a9]/20 flex items-center gap-2"
                      >
                        {submitting ? "Mengirim..." : "Kirim Data Pembayaran"}
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleWAConfirm(latestUnpaid.id, latestUnpaid.amount)}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1fb858] text-white px-4 py-2.5 text-sm font-bold shadow-md transition-all active:scale-95"
                      >
                        <WhatsAppIcon size={16} />
                        <span>Konfirmasi Pembayaran</span>
                      </button>
                    </div>
                  </>
                ) : (
                  /* Menunggu verifikasi admin */
                  <div className="flex flex-col gap-4 relative z-10">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                      <Clock size={20} className="shrink-0" />
                      <div>
                        <p className="font-bold text-sm">Bukti Pembayaran Terkirim</p>
                        <p className="text-xs mt-0.5">Menunggu verifikasi admin. Status akan berubah setelah admin mengonfirmasi.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-white/40 border border-white/60 rounded-xl p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Dibayar</p>
                        <p className="font-bold text-gray-800 mt-0.5">Rp {(latestUnpaid.paidAmount ?? latestUnpaid.amount).toLocaleString("id-ID")}</p>
                      </div>
                      <div className="bg-white/40 border border-white/60 rounded-xl p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Terkirim</p>
                        <p className="font-bold text-gray-800 mt-0.5">{latestUnpaid.submittedAt ? formatSessionDateTime(latestUnpaid.submittedAt).split(" • ")[0] : "-"}</p>
                      </div>
                      <div className="bg-white/40 border border-white/60 rounded-xl p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">File</p>
                        <p className="font-bold text-gray-800 mt-0.5 truncate">{latestUnpaid.paymentProofName || "Bukti terkirim"}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleWAConfirm(latestUnpaid.id, latestUnpaid.amount)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1fb858] text-white px-4 py-2.5 text-sm font-bold shadow-md transition-all active:scale-95"
                    >
                      <WhatsAppIcon size={16} />
                      <span>Konfirmasi Pembayaran</span>
                    </button>
                  </div>
                )}
              </GlassCard>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 p-6 bg-white/40 border border-white/60 rounded-2xl text-gray-600">
                  <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
                  <div>
                    <p className="font-bold text-sm">Semua Tagihan Lunas</p>
                    <p className="text-xs text-gray-500">Tidak ada tagihan aktif yang perlu dibayar untuk {selectedMurid.name}. Terima kasih!</p>
                  </div>
                </div>

                {/* Prepayment / Manual Payment Card */}
                <GlassCard className="p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden group border border-white/80 shadow-xl">
                  <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#4a70a9]/10 rounded-full blur-[50px] pointer-events-none group-hover:scale-110 duration-700"></div>

                  <div className="border-b border-gray-200/50 pb-4 relative z-10">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800">Pembayaran Mandiri / Prabayar</h3>
                    <p className="text-xs text-gray-500 mt-1">Anda dapat mengirimkan pembayaran/prabayar tanpa tagihan aktif melalui form ini.</p>
                  </div>

                  {paymentError && (
                    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 relative z-10">
                      {paymentError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Nominal Pembayaran (Rp)</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={customAmount}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setCustomAmount(val);
                          }}
                          placeholder="Contoh: 150000"
                          className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9]"
                        />
                      </div>
                      
                      {/* Bank Account Information */}
                      <div className="border-t border-gray-200/30 pt-4 flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-full bg-[#4a70a9]/10 flex items-center justify-center shrink-0 text-[#4a70a9]">
                          <Building size={20} />
                        </div>
                        {defaultAccount ? (
                          <div>
                            <p className="text-xs sm:text-sm font-semibold text-gray-800">Transfer {defaultAccount.bankName}</p>
                            <p className="text-base sm:text-lg font-mono font-bold text-[#4a70a9] tracking-wider my-0.5">
                              {defaultAccount.accountNumber}
                            </p>
                            <p className="text-xs text-gray-500">a/n {defaultAccount.accountName}</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs sm:text-sm font-semibold text-gray-800">Info Rekening</p>
                            <p className="text-sm text-gray-500">Rekening tujuan transfer akan segera ditambahkan.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mock Upload Area & Confirm Button */}
                    <div className="flex flex-col gap-4 justify-between">
                      <div 
                        onClick={handleUploadAreaClick}
                        className="border-2 border-dashed border-gray-300 hover:border-[#4a70a9]/50 rounded-xl p-5 text-center cursor-pointer hover:bg-[#4a70a9]/5 transition-colors duration-200 group flex flex-col items-center justify-center gap-1.5"
                      >
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileChange}
                          className="hidden" 
                          accept="image/*,application/pdf"
                        />
                        {uploadedProof ? (
                          <>
                            {uploadedProof.startsWith("data:image") ? (
                              <img src={uploadedProof} alt="Pratinjau bukti transfer" className="max-h-24 rounded-lg border border-white shadow-sm mb-1 shrink-0" />
                            ) : (
                              <Check className="text-emerald-500 text-3xl mb-1 shrink-0" size={24} />
                            )}
                            <p className="text-xs font-semibold text-gray-800 truncate max-w-xs">{uploadedProofName}</p>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase">Berhasil Diunggah</p>
                          </>
                        ) : (
                          <>
                            <Upload className="text-gray-400 group-hover:scale-110 transition-transform mb-1 shrink-0" size={24} />
                            <p className="text-xs font-semibold text-gray-700">Unggah Bukti Transfer</p>
                            <p className="text-[10px] text-gray-400">Format JPG, PNG, atau PDF (Max 5MB)</p>
                          </>
                        )}
                      </div>

                      {/* Catatan Pembayaran Prabayar */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Catatan (Opsional)</label>
                        <textarea
                          value={paymentNote}
                          onChange={(e) => setPaymentNote(e.target.value)}
                          placeholder="Contoh: Prabayar biaya blok berikutnya, atau untuk program baru"
                          rows={2}
                          className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#4a70a9] resize-none"
                        />
                      </div>

                      <Button
                        onClick={() => void handleSubmitPrepayment()}
                        disabled={submitting}
                        className="w-full text-sm sm:text-base justify-center py-3.5 shadow-md flex items-center gap-2"
                      >
                        {submitting ? "Mengirim..." : "Kirim Data Pembayaran"}
                      </Button>
                      <button
                        type="button"
                        onClick={() => {
                          const amountVal = Number(customAmount) || 0;
                          if (amountVal <= 0) {
                            alert("Silakan masukkan nominal pembayaran.");
                            return;
                          }
                          const text = encodeURIComponent(
                            `Halo Admin Nurman Course, saya ingin konfirmasi pembayaran mandiri/prabayar atas nama siswa *${selectedMurid.name}* sebesar *Rp ${amountVal.toLocaleString("id-ID")}*. Bukti transfer telah terlampir/diunggah di portal. Terima kasih.`
                          );
                          window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1fb858] text-white px-4 py-2.5 text-sm font-bold shadow-md transition-all active:scale-95"
                      >
                        <WhatsAppIcon size={16} />
                        <span>Konfirmasi Pembayaran via WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}
          </div>

          {/* History Section: invoice + prabayar */}
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex justify-between items-center border-b border-gray-200/50 pb-2">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" size={20} />
                <span>Riwayat Pembayaran</span>
              </h2>
              <Button 
                variant="ghost" 
                onClick={() => setShowAllHistory(!showAllHistory)}
                className="text-xs border border-gray-200/50 px-3 py-1.5 hover:bg-white/40 shadow-sm"
              >
                {showAllHistory ? "Sembunyikan Riwayat" : "Lihat Semua Riwayat"}
              </Button>
            </div>

            {showAllHistory && (
              <div className="animate-[slideDown_0.3s_ease-out]">
                {/* Sortir */}
                <div className="flex items-center gap-2 mb-3 text-xs">
                  <span className="font-semibold text-gray-500">Urutkan:</span>
                  <button
                    type="button"
                    onClick={() => setHistorySort("terbaru")}
                    className={`px-3 py-1.5 rounded-full border font-semibold transition-colors ${
                      historySort === "terbaru"
                        ? "bg-[#4a70a9] text-white border-transparent shadow-sm"
                        : "bg-white/40 text-gray-600 border-white/60 hover:bg-white/60"
                    }`}
                  >
                    Terbaru
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistorySort("terlama")}
                    className={`px-3 py-1.5 rounded-full border font-semibold transition-colors ${
                      historySort === "terlama"
                        ? "bg-[#4a70a9] text-white border-transparent shadow-sm"
                        : "bg-white/40 text-gray-600 border-white/60 hover:bg-white/60"
                    }`}
                  >
                    Terlama
                  </button>
                </div>

                {historyItems.length > 0 ? (
                  <>
                    {/* Mobile: Card list */}
                    <div className="flex flex-col gap-3 md:hidden">
                      {historyItems.map((entry) =>
                        entry.type === "invoice" ? (
                          <div key={entry.item.id} className="bg-white/40 border border-white/60 rounded-2xl p-4 shadow-sm flex flex-col gap-2.5">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-mono font-bold text-gray-700 text-xs mt-0.5">#{entry.item.id}</span>
                              {renderStatusBadge(entry.item.status)}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800 text-sm">
                                {getProgramNameFromEnrollment(entry.item.enrollmentId, entry.item.enrollment?.program?.name)}
                              </div>
                              <div className="text-[10px] text-gray-400 mt-0.5">
                                {getInvoicePeriod(entry.item)}
                              </div>
                            </div>
                            <div className="flex items-end justify-between border-t border-gray-200/30 pt-2.5">
                              <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Jumlah</p>
                                <p className="font-bold text-gray-800 text-base">
                                  Rp {entry.item.amount.toLocaleString("id-ID")}
                                </p>
                              </div>
                              <div className="text-right text-xs text-gray-500 font-medium">
                                {renderInvoiceDate(entry.item)}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => openWaliInvoiceDetail(entry.item)}
                              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#4a70a9]/10 px-3 py-2 text-xs font-bold text-[#4a70a9] ring-1 ring-[#4a70a9]/30 hover:bg-[#4a70a9]/20"
                            >
                              <Eye size={14} /> Detail
                            </button>
                          </div>
                        ) : (
                          <div key={entry.item.id} className="bg-white/40 border border-white/60 rounded-2xl p-4 shadow-sm flex flex-col gap-2.5">
                            <div className="flex items-start justify-between gap-2">
                              <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-100 text-indigo-700 px-2 py-0.5 text-[9px] font-bold uppercase border border-indigo-200 mt-0.5">
                                Prabayar
                              </span>
                              {renderPrepaymentBadge(entry.item.status)}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800 text-sm">Prabayar (tanpa tagihan)</div>
                              {entry.item.note && (
                                <div className="text-[10px] text-gray-400 mt-0.5 truncate">{entry.item.note}</div>
                              )}
                            </div>
                            <div className="flex items-end justify-between border-t border-gray-200/30 pt-2.5">
                              <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Jumlah</p>
                                <p className="font-bold text-gray-800 text-base">
                                  Rp {entry.item.amount.toLocaleString("id-ID")}
                                </p>
                              </div>
                              <div className="text-right text-xs text-gray-500 font-medium">
                                {renderPrepaymentDate(entry.item)}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => openWaliPrepaymentDetail(entry.item)}
                              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#4a70a9]/10 px-3 py-2 text-xs font-bold text-[#4a70a9] ring-1 ring-[#4a70a9]/30 hover:bg-[#4a70a9]/20"
                            >
                              <Eye size={14} /> Detail
                            </button>
                          </div>
                        )
                      )}
                    </div>

                    {/* Desktop: Table */}
                    <div className="hidden md:block overflow-x-auto bg-white/40 border border-white/60 rounded-2xl shadow-sm">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-gray-200/50 bg-white/20 text-gray-500 font-semibold">
                            <th className="p-4">Invoice / Jenis</th>
                            <th className="p-4">Program / Periode</th>
                            <th className="p-4 text-right">Jumlah</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4">Tanggal / Jatuh Tempo</th>
                            <th className="p-4 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/30">
                          {historyItems.map((entry) =>
                            entry.type === "invoice" ? (
                              <tr key={entry.item.id} className="hover:bg-white/30 transition-colors">
                                <td className="p-4 font-mono font-bold text-gray-700">#{entry.item.id}</td>
                                <td className="p-4">
                                  <div className="font-semibold text-gray-800">
                                    {getProgramNameFromEnrollment(entry.item.enrollmentId, entry.item.enrollment?.program?.name)}
                                  </div>
                                  <div className="text-[10px] text-gray-400 mt-0.5">
                                    {getInvoicePeriod(entry.item)}
                                  </div>
                                </td>
                                <td className="p-4 text-right font-bold text-gray-800">
                                  Rp {entry.item.amount.toLocaleString("id-ID")}
                                </td>
                                <td className="p-4 text-center">
                                  {renderStatusBadge(entry.item.status)}
                                </td>
                                <td className="p-4 text-gray-500 font-medium">
                                  {renderInvoiceDate(entry.item)}
                                </td>
                                <td className="p-4 text-center">
                                  <button
                                    type="button"
                                    onClick={() => openWaliInvoiceDetail(entry.item)}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#4a70a9]/10 px-3 py-2 text-xs font-bold text-[#4a70a9] ring-1 ring-[#4a70a9]/30 hover:bg-[#4a70a9]/20"
                                  >
                                    <Eye size={14} /> Detail
                                  </button>
                                </td>
                              </tr>
                            ) : (
                              <tr key={entry.item.id} className="hover:bg-white/30 transition-colors">
                                <td className="p-4">
                                  <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-100 text-indigo-700 px-2 py-0.5 text-[9px] font-bold uppercase border border-indigo-200">
                                    Prabayar
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="font-semibold text-gray-800">Prabayar (tanpa tagihan)</div>
                                  {entry.item.note && (
                                    <div className="text-[10px] text-gray-400 mt-0.5 truncate">{entry.item.note}</div>
                                  )}
                                </td>
                                <td className="p-4 text-right font-bold text-gray-800">
                                  Rp {entry.item.amount.toLocaleString("id-ID")}
                                </td>
                                <td className="p-4 text-center">
                                  {renderPrepaymentBadge(entry.item.status)}
                                </td>
                                <td className="p-4 text-gray-500 font-medium">
                                  {renderPrepaymentDate(entry.item)}
                                </td>
                                <td className="p-4 text-center">
                                  <button
                                    type="button"
                                    onClick={() => openWaliPrepaymentDetail(entry.item)}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#4a70a9]/10 px-3 py-2 text-xs font-bold text-[#4a70a9] ring-1 ring-[#4a70a9]/30 hover:bg-[#4a70a9]/20"
                                  >
                                    <Eye size={14} /> Detail
                                  </button>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    Belum ada data tagihan.
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white/40 border border-white/60 rounded-2xl text-gray-500">
          Tidak ada data anak ditemukan. Hubungi admin untuk mendaftarkan anak Anda.
        </div>
      )}

      {proofWali && (
        <ProofModal invoice={proofWali} hideLink onClose={() => setProofWali(null)} />
      )}
    </div>
  );
}
