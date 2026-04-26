"use client";

import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import { getMaterialsByCategory } from "@/data/materials";
import { formatPrice } from "@/utils/format";

export default function CalistungPage() {
  const router = useRouter();
  const calistungItems = getMaterialsByCategory("calistung");

  const handleSelect = (id: string) => {
    router.push(`/course/config?program=calistung&materi=${id}&level=1`);
  };

  return (
    <div className="pb-20 pt-4 sm:pt-8">
      <PageHeader
        title="Calistung & Ngaji"
        subtitle="Program dasar membaca, menulis, berhitung & ngaji"
      />

      <section className="space-y-4 sm:space-y-6">
        {calistungItems.map((item) => (
          <GlassCard
            key={item.id}
            onClick={() => handleSelect(item.id)}
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
