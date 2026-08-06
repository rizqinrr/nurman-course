"use client";

import { FileText, X, ZoomIn } from "lucide-react";

export interface ProofInvoiceData {
  id: string;
  amount: number;
  status: "unpaid" | "waiting" | "paid";
  paymentProof?: string | null;
  paymentProofName?: string | null;
  paidAmount?: number | null;
  submittedAt?: string | null;
  note?: string | null;
  isPrepayment?: boolean;
  enrollment?: {
    murid?: { id: string; name: string } | null;
    program?: { id: string; name: string } | null;
  } | null;
  murid?: { id: string; name: string } | null;
}

interface ProofModalProps {
  invoice: ProofInvoiceData;
  onClose: () => void;
  detailHref?: string;
  hideLink?: boolean;
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

export default function ProofModal({ invoice, onClose, detailHref, hideLink = false }: ProofModalProps) {
  const proof = invoice.paymentProof;
  const isImage = proof?.startsWith("data:image") ?? false;
  const muridName = invoice.enrollment?.murid?.name || invoice.murid?.name || "-";
  const programName = invoice.enrollment?.program?.name;
  const targetHref = detailHref || `/app/admin/tagihan/${invoice.id}`;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Detail bukti pembayaran"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Bukti Pembayaran</h3>
            <p className="mt-0.5 font-mono text-xs text-gray-500">#{invoice.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80 text-gray-500"
            aria-label="Tutup popup"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {proof ? (
          isImage ? (
            hideLink ? (
              <div className="relative block overflow-hidden rounded-2xl bg-black/5">
                <img
                  src={proof}
                  alt={`Bukti pembayaran ${invoice.paymentProofName || ""}`}
                  className="mx-auto max-h-[50vh] w-auto object-contain"
                />
              </div>
            ) : (
              <a
                href={targetHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-2xl bg-black/5"
                title="Buka di halaman baru"
              >
                <img
                  src={proof}
                  alt={`Bukti pembayaran ${invoice.paymentProofName || ""}`}
                  className="mx-auto max-h-[50vh] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                />
                <span className="absolute inset-x-0 bottom-0 inline-flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <ZoomIn size={14} /> Klik untuk tampilan penuh
                </span>
              </a>
            )
          ) : (
            <a
              href={dataUrlToBlobUrl(proof) || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-amber-50 px-4 py-6 text-sm font-bold text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100"
            >
              <FileText size={20} /> Buka Bukti (PDF)
            </a>
          )
        ) : (
          <div className="rounded-2xl bg-gray-50 px-4 py-6 text-center text-sm font-medium text-gray-500">
            Tidak ada bukti pembayaran.
          </div>
        )}

        {isImage && !hideLink && (
          <p className="mt-2 text-center text-xs font-medium text-gray-400">
            Klik foto untuk membuka di halaman baru.
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-gray-50 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Murid</p>
            <p className="truncate font-semibold text-gray-800">{muridName}</p>
          </div>
          <div className="rounded-xl bg-gray-50 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Program</p>
            <p className="truncate font-semibold text-gray-800">{programName || "-"}</p>
          </div>
          <div className="rounded-xl bg-gray-50 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{invoice.isPrepayment ? "Dibayar" : "Tagihan"}</p>
            <p className="font-semibold text-gray-800">Rp {invoice.amount.toLocaleString("id-ID")}</p>
          </div>
          <div className="rounded-xl bg-gray-50 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Dibayar</p>
            <p className="font-semibold text-emerald-700">
              Rp {(invoice.paidAmount ?? invoice.amount).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {invoice.note && (
          <div className="mt-3 rounded-xl bg-gray-50 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Catatan</p>
            <p className="text-sm font-medium text-gray-700">{invoice.note}</p>
          </div>
        )}

        {invoice.paymentProofName && (
          <p className="mt-3 truncate text-xs font-medium text-gray-400">
            File: {invoice.paymentProofName}
          </p>
        )}

        <div className="mt-5 flex gap-2">
          {!hideLink && (
            <a
              href={targetHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 justify-center inline-flex items-center gap-2 rounded-xl bg-[#4a70a9] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#3d5f92] transition-colors"
            >
              <ZoomIn size={15} /> {invoice.isPrepayment ? "Lihat Bukti" : "Detail Invoice"}
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            className={`inline-flex items-center justify-center rounded-xl bg-white/80 px-4 py-2.5 text-sm font-bold text-gray-600 ring-1 ring-gray-200 hover:bg-white ${
              hideLink ? "flex-1" : ""
            }`}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
