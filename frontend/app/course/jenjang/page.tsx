"use client";

import { ArrowRight, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import CourseRouteHeader from "@/components/course/CourseRouteHeader";
import { getMaterialsByCategory } from "@/data/materials";
import { formatPrice } from "@/utils/format";

export default function JenjangPage() {
  const router = useRouter();
  const jenjangItems = getMaterialsByCategory("jenjang");

  return (
    <div className="pb-14 pt-4 sm:pt-8">
      <CourseRouteHeader
        current={2}
        title="Pilih Jenjang"
        subtitle="Sesuaikan dengan tingkat pendidikan siswa"
      />
      <div className="relative space-y-4 pl-5">
        <div className="absolute bottom-10 left-1 top-10 w-px bg-[#c4d3e3]" aria-hidden="true" />
        {jenjangItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => router.push(`/course/config?materi=${item.id}&level=1`)}
            className="group relative flex w-full items-center gap-4 rounded-[1.75rem] border border-[#c4d3e3] bg-white/75 p-5 text-left shadow-[0_10px_28px_rgba(46,75,122,0.08)] transition hover:-translate-y-1 hover:border-[#4a70a9] hover:bg-white hover:shadow-[0_20px_50px_rgba(46,75,122,0.14)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a70a9] sm:p-6"
          >
            <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#4a70a9] text-white">
              <GraduationCap size={22} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-lg font-black tracking-[-0.03em] text-[#294568] sm:text-xl">{item.name}</span>
              <span className="mt-1 block text-sm leading-6 text-[#627894]">{item.description}</span>
              <span className="mt-2 block text-xs font-bold text-[#4a70a9]">{formatPrice(item.basePrice)} / sesi</span>
            </span>
            <ArrowRight size={20} className="shrink-0 text-[#8da3bd] transition group-hover:translate-x-1 group-hover:text-[#4a70a9]" />
          </button>
        ))}
      </div>
    </div>
  );
}
