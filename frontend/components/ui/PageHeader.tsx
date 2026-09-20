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
    <header className="border-b border-[#d4dfeb] pb-6">
      {showBack && (
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 inline-flex min-h-9 items-center gap-2 rounded-lg border border-[#cbd8e5] bg-white px-3 text-xs font-bold text-[#284970] transition-colors hover:border-[#4a70a9] hover:bg-[#f4f8fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a70a9]"
        >
          <ArrowLeft size={16} strokeWidth={2.25} aria-hidden="true" />
          Kembali
        </button>
      )}

      <h1 className="text-2xl font-black tracking-[-0.04em] text-[#14233a] sm:text-3xl">{title}</h1>

      {subtitle && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#657991]">{subtitle}</p>
      )}
    </header>
  );
}
