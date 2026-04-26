"use client";

import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import { getMaterialsByCategory } from "@/data/materials";
import { formatPrice } from "@/utils/format";

export default function MateriPage() {
  const router = useRouter();
  const materials = getMaterialsByCategory("materi");

  const handleSelectMaterial = (id: string) => {
    router.push(`/course/materi/${id}`);
  };

  return (
    <div className="pb-20 pt-4 sm:pt-8">
      <PageHeader
        title="Pilih Materi"
        subtitle="Pilih materi yang ingin Anda pelajari"
      />

      {/* Materials Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {materials.map((material) => (
          <GlassCard
            key={material.id}
            className="p-6 sm:p-8 flex flex-col gap-4"
          >
            {/* Title */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                {material.name}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                {material.description}
              </p>
            </div>

            {/* Price */}
            <p className="text-lg sm:text-xl font-bold text-[#4a70a9]">
              {formatPrice(material.basePrice)}
            </p>

            {/* Button */}
            <Button
              variant="primary"
              size="md"
              onClick={() => handleSelectMaterial(material.id)}
              className="w-full sm:w-auto"
            >
              Pilih Materi
            </Button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
