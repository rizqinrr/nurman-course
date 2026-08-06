"use client";

import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import { getMaterialsByCategory } from "@/data/materials";
import { formatPrice } from "@/utils/format";

export default function JenjangPage() {
  const router = useRouter();
  const jenjangItems = getMaterialsByCategory("jenjang");

  const handleSelectJenjang = (id: string) => {
    router.push(`/course/config?materi=${id}&level=1`);
  };

  return (
    <div className="pb-20 pt-4 sm:pt-8">
      <PageHeader
        title="Pilih Jenjang"
        subtitle="Sesuaikan dengan tingkat pendidikan siswa"
      />

      <section className="space-y-4 sm:space-y-6">
        {jenjangItems.map((item) => (
          <GlassCard
            key={item.id}
            onClick={() => handleSelectJenjang(item.id)}
            className="cursor-pointer rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02] active:scale-95 sm:p-8"
          >
            <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
              {item.name}
            </h2>
            <p className="mb-4 text-sm text-gray-600 sm:text-base">
              {item.description}
            </p>
            <p className="text-lg font-bold text-[#4a70a9] sm:text-xl">
              {formatPrice(item.basePrice)}
            </p>
          </GlassCard>
        ))}
      </section>
    </div>
  );
}
