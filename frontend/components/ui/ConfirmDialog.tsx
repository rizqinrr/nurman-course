"use client";

import Button from "@/components/ui/Button";
import { LogOut, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  icon?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  danger = false,
  icon,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <span
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${
              danger
                ? "bg-red-500/15 text-red-600"
                : "bg-[#4a70a9]/15 text-[#4a70a9]"
            }`}
          >
            {icon ?? <LogOut size={20} strokeWidth={2.25} />}
          </span>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-500"
            aria-label="Tutup popup"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <h3 id="confirm-dialog-title" className="text-lg font-bold text-gray-900">
          {title}
        </h3>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}

        <div className="mt-6 flex gap-2">
          <Button variant="ghost" size="md" onClick={onCancel} className="flex-1">
            {cancelLabel}
          </Button>
          <Button
            size="md"
            onClick={onConfirm}
            className={`flex-1 ${
              danger ? "bg-red-500 hover:bg-red-600 border-red-500" : ""
            }`}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
