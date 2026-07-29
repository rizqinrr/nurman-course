"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

export default function PageHeader({
  title,
  subtitle,
  showBack = true,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className="mb-6">
      {showBack && (
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/25 px-4 py-2 text-sm font-medium text-white border border-white/40 shadow-md active:scale-95"
        >
          <ArrowLeft size={18} strokeWidth={2.25} aria-hidden="true" />
          Kembali
        </button>
      )}

      <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>

      {subtitle && (
        <p className="mt-1 text-sm sm:text-base text-white/80">{subtitle}</p>
      )}
    </header>
  );
}
