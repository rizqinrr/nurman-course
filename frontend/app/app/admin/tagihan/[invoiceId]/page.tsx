"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface ProofInvoice {
  id: string;
  amount: number;
  status: "unpaid" | "waiting" | "paid";
  paymentProof?: string | null;
  paymentProofName?: string | null;
  paidAmount?: number | null;
  submittedAt?: string | null;
  enrollment?: {
    murid?: { id: string; name: string } | null;
    program?: { id: string; name: string } | null;
  } | null;
}

function dataUrlToBlobUrl(dataUrl: string): string | null {
  try {
    const [meta, base64] = dataUrl.split(",");
    const mime = meta?.match(/data:([^;]+)/)?.[1] || "application/octet-stream";
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: mime });
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

export default function AdminInvoiceProofPage() {
  const params = useParams<{ invoiceId: string }>();
  const [invoice, setInvoice] = useState<ProofInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await apiFetch<{ data: ProofInvoice }>(
          `/api/admin/invoices/${params.invoiceId}`,
        );
        if (!cancelled) setInvoice(response.data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Gagal memuat bukti.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.invoiceId]);

  const isImage = invoice?.paymentProof?.startsWith("data:image") ?? false;

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col">
      <header className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 border-b border-white/10">
        <Link
          href="/app/admin/tagihan"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Kembali
        </Link>
        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Bukti Pembayaran
          </p>
          <p className="font-mono text-sm font-bold text-slate-200">#{invoice?.id ?? params.invoiceId}</p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 size={28} className="animate-spin" />
            <p className="text-sm font-medium">Memuat bukti...</p>
          </div>
        ) : error ? (
          <div className="max-w-md w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-center">
            <p className="text-sm font-medium text-red-300">{error}</p>
            <Link
              href="/app/admin/tagihan"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft size={15} /> Kembali ke daftar tagihan
            </Link>
          </div>
        ) : invoice?.paymentProof ? (
          isImage ? (
            <div className="flex flex-col items-center gap-4">
              <img
                src={invoice.paymentProof}
                alt={`Bukti pembayaran ${invoice.paymentProofName || ""}`}
                className="max-h-[75vh] w-auto max-w-full rounded-2xl border border-white/10 bg-white shadow-2xl object-contain"
              />
              {invoice.paymentProofName && (
                <p className="max-w-full truncate text-xs font-medium text-slate-400">
                  {invoice.paymentProofName}
                </p>
              )}
            </div>
          ) : (
            <div className="max-w-md w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center">
              <FileText size={36} className="mx-auto text-slate-400" />
              <p className="mt-4 text-sm font-semibold text-slate-200">
                Bukti berupa berkas PDF
              </p>
              {invoice.paymentProofName && (
                <p className="mt-1 max-w-full truncate text-xs text-slate-400">
                  {invoice.paymentProofName}
                </p>
              )}
              <a
                href={dataUrlToBlobUrl(invoice.paymentProof) || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#4a70a9] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#3d5f92] transition-colors"
              >
                <FileText size={16} /> Buka PDF
              </a>
            </div>
          )
        ) : (
          <div className="text-center text-sm font-medium text-slate-400">
            Tidak ada bukti pembayaran untuk tagihan ini.
          </div>
        )}
      </main>
    </div>
  );
}
