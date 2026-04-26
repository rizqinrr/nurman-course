"use client";

import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";

interface Program {
  id: string;
  label: string;
  description: string;
  route: string;
}

const programs: Program[] = [
  {
    id: "materi",
    label: "Les Per Materi",
    description: "Fokus pada satu materi spesifik sesuai kebutuhan",
    route: "/course/materi",
  },
  {
    id: "jenjang",
    label: "Les Berdasarkan Jenjang",
    description: "Belajar sesuai kurikulum sekolah (SD / SMP / SMA)",
    route: "/course/jenjang",
  },
  {
    id: "calistung",
    label: "Calistung & Ngaji",
    description: "Dasar membaca, menulis, berhitung & agama",
    route: "/course/calistung",
  },
];

export default function ProgramPage() {
  const router = useRouter();

  const handleSelectProgram = (route: string) => {
    router.push(route);
  };

  return (
    <div className="pb-20 pt-4 sm:pt-8">
      <PageHeader
        title="Pilih Program"
        subtitle="Pilih program yang sesuai kebutuhan Anda"
      />

      {/* Programs Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {programs.map((program) => (
          <GlassCard
            key={program.id}
            onClick={() => handleSelectProgram(program.route)}
            className="p-6 sm:p-8 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-95"
          >
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {program.label}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 font-medium">
                {program.description}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
