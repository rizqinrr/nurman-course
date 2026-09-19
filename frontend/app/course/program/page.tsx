"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, GraduationCap, Sparkles, type LucideIcon } from "lucide-react";
import CourseRouteHeader from "@/components/course/CourseRouteHeader";

interface ProgramRoute {
  id: string;
  label: string;
  description: string;
  route: string;
  icon: LucideIcon;
  accent: "blue" | "gold";
}

const programRoutes: ProgramRoute[] = [
  {
    id: "materi",
    label: "Les Per Materi",
    description: "Fokus pada satu materi spesifik sesuai kebutuhan",
    route: "/course/materi",
    icon: BookOpen,
    accent: "blue",
  },
  {
    id: "jenjang",
    label: "Les Berdasarkan Jenjang",
    description: "Belajar sesuai kurikulum sekolah (SD / SMP / SMA)",
    route: "/course/jenjang",
    icon: GraduationCap,
    accent: "blue",
  },
  {
    id: "calistung",
    label: "Calistung & Ngaji",
    description: "Dasar membaca, menulis, berhitung & agama",
    route: "/course/calistung",
    icon: Sparkles,
    accent: "gold",
  },
];

export default function ProgramPage() {
  const router = useRouter();

  const handleSelectRoute = (route: string) => {
    router.push(route);
  };

  return (
    <div className="pb-14 pt-4 sm:pt-8">
      <CourseRouteHeader
        current={1}
        title="Pilih Program"
        subtitle="Pilih program yang sesuai kebutuhan Anda"
      />

      <div className="relative">
        <div className="absolute bottom-12 left-7 top-12 w-px bg-[#c4d3e3]" aria-hidden="true" />

        <div className="space-y-4">
          {programRoutes.map((route) => {
            const Icon = route.icon;
            const isGold = route.accent === "gold";
            return (
              <button
                key={route.id}
                type="button"
                onClick={() => handleSelectRoute(route.route)}
                className="group relative grid w-full grid-cols-[3rem_1fr_auto] items-center gap-4 rounded-[1.75rem] border border-[#c4d3e3] bg-white/75 p-4 text-left backdrop-blur-xl shadow-[0_10px_28px_rgba(46,75,122,0.08)] transition hover:-translate-y-1 hover:border-[#4a70a9] hover:bg-white hover:shadow-[0_20px_50px_rgba(46,75,122,0.14)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a70a9] sm:gap-6 sm:p-6"
              >
                <span className={`relative z-10 grid h-12 w-12 place-items-center rounded-2xl sm:h-14 sm:w-14 ${isGold ? "bg-[#f2c14e] text-[#493b12]" : "bg-[#4a70a9] text-white"} transition group-hover:scale-105`}>
                  <Icon size={23} strokeWidth={2.25} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-lg font-black tracking-[-0.03em] text-[#294568] sm:text-xl">
                    {route.label}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-[#627894]">
                    {route.description}
                  </span>
                </span>
                <ArrowRight size={20} className="mr-1 text-[#8da3bd] transition group-hover:translate-x-1 group-hover:text-[#4a70a9]" />
                <span className="sr-only">Buka {route.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}