"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import CourseRouteHeader from "@/components/course/CourseRouteHeader";
import { getMaterialsByCategory } from "@/data/materials";
import { formatPrice } from "@/utils/format";

export default function CalistungPage() {
  const router = useRouter();
  const calistungItems = getMaterialsByCategory("calistung");

  return (
    <div className="pb-14 pt-4 sm:pt-8">
      <CourseRouteHeader
        current={2}
        title="Calistung & Ngaji"
        subtitle="Pilih paket: Ngaji saja (mulai 15rb) atau Calistung & Ngaji (30rb)"
      />
      <div className="relative space-y-4 pl-5">
        <div className="absolute bottom-10 left-1 top-10 w-px bg-[#d5b454]" aria-hidden="true" />
        {calistungItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => router.push(`/course/config?program=calistung&materi=${item.id}&level=1`)}
            className="group relative flex w-full items-center gap-4 rounded-[1.75rem] border border-[#d8c274] bg-[#fff9df]/90 p-5 text-left shadow-[0_10px_28px_rgba(114,91,27,0.09)] transition hover:-translate-y-1 hover:border-[#c39a25] hover:bg-[#fff7d3] hover:shadow-[0_20px_50px_rgba(114,91,27,0.14)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#806512] sm:p-6"
          >
            <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#f2c14e] text-[#493b12]">
              <Sparkles size={22} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-lg font-black tracking-[-0.03em] text-[#493b12] sm:text-xl">{item.name}</span>
              <span className="mt-1 block text-sm leading-6 text-[#6f622f]">{item.description}</span>
              <span className="mt-2 block text-xs font-black text-[#806512]">{formatPrice(item.basePrice)} / sesi</span>
            </span>
            <ArrowRight size={20} className="shrink-0 text-[#a98b32] transition group-hover:translate-x-1 group-hover:text-[#806512]" />
          </button>
        ))}
      </div>
    </div>
  );
}
