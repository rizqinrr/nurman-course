"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import CourseRouteHeader from "@/components/course/CourseRouteHeader";
import { getMaterialsByCategory } from "@/data/materials";
import { formatPrice } from "@/utils/format";

export default function MateriPage() {
  const router = useRouter();
  const materials = getMaterialsByCategory("materi");

  return (
    <div className="pb-14 pt-4 sm:pt-8">
      <CourseRouteHeader
        current={2}
        title="Pilih Materi"
        subtitle="Pilih materi yang ingin Anda pelajari"
      />
      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#c4d3e3] bg-[#f8fbff] px-4 py-3 text-sm font-semibold text-[#536781]">
        <BookOpen size={18} className="text-[#4a70a9]" aria-hidden="true" />
        Fokus satu per satu supaya target belajar lebih jelas.
      </div>
      <div className="space-y-4">
        {materials.map((material) => (
          <button
            key={material.id}
            type="button"
            onClick={() => router.push(`/course/materi/${material.id}`)}
            className="group flex w-full items-center gap-4 rounded-[1.75rem] border border-[#c4d3e3] bg-white/75 p-5 text-left shadow-[0_10px_28px_rgba(46,75,122,0.08)] transition hover:-translate-y-1 hover:border-[#4a70a9] hover:bg-white hover:shadow-[0_20px_50px_rgba(46,75,122,0.14)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a70a9] sm:p-6"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#4a70a9] text-white">
              <BookOpen size={22} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-lg font-black tracking-[-0.03em] text-[#294568] sm:text-xl">{material.name}</span>
              <span className="mt-1 block text-sm leading-6 text-[#627894]">{material.description}</span>
              <span className="mt-2 block text-xs font-bold text-[#4a70a9]">{formatPrice(material.basePrice)} / sesi</span>
            </span>
            <ArrowRight size={20} className="shrink-0 text-[#8da3bd] transition group-hover:translate-x-1 group-hover:text-[#4a70a9]" />
          </button>
        ))}
      </div>
    </div>
  );
}
