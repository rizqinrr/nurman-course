"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import { getLevelBasePrice, getMaterialById } from "@/data/materials";
import { formatPrice } from "@/utils/format";

export default function MateriDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const materialId = useMemo(() => {
    const rawId = params?.id;
    if (typeof rawId === "string") return rawId;
    if (Array.isArray(rawId)) return rawId[0];
    return "";
  }, [params]);

  const material = getMaterialById(materialId);

  const handleContinue = () => {
    if (!material || selectedLevel === null) return;
    const levelData = material.levels.find((l) => l.level === selectedLevel);
    if (!levelData || levelData.comingSoon) return;
    router.push(`/course/config?materi=${material.id}&level=${selectedLevel}`);
  };

  if (!material) {
    return (
      <div className="pt-4 sm:pt-8">
        <PageHeader
          title="Detail Materi"
          subtitle="Pilih materi dari daftar yang tersedia"
        />

        <div className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-lg">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Materi tidak ditemukan
          </h1>
          <p className="text-gray-600">
            Silakan kembali ke daftar materi dan pilih materi lain.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-40 pt-4 sm:pt-8">
      <PageHeader title={material.name} subtitle={material.description} />

      <section className="mb-8 rounded-3xl border border-white/70 bg-white/70 p-6 shadow-lg sm:p-8">
        <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">
          Kuasai {material.name} dengan jalur belajar yang jelas
        </h2>
        <p className="mb-4 text-gray-600">
          Pilih level yang paling sesuai, belajar bertahap, dan fokus pada hasil
          yang bisa langsung dipakai.
        </p>
        <p className="text-lg font-bold text-[#4a70a9] sm:text-xl">
          {formatPrice(material.basePrice)} per sesi
        </p>
        {material.id === "vibe-coding" && (
          <div className="mt-4 rounded-2xl border border-[#4a70a9]/20 bg-blue-50/60 px-4 py-3 text-sm text-gray-700 sm:text-base">
            <p className="font-semibold text-gray-900">Syarat ikut kelas</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5">
              <li>Punya laptop/komputer sendiri</li>
              <li>Internet yang lancar (tool AI online)</li>
            </ul>
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-4 text-lg font-bold text-gray-900 sm:text-xl">
          Pilih Level Belajar
        </h3>
        <div className="space-y-4 sm:space-y-5">
          {material.levels.map((item) => {
            const isComingSoon = Boolean(item.comingSoon);
            const isSelected = !isComingSoon && selectedLevel === item.level;
            const enhancedSelect =
              material.id === "komputer-dasar" || material.id === "vibe-coding";

            return (
              <GlassCard
                key={item.level}
                onClick={
                  isComingSoon
                    ? undefined
                    : () => setSelectedLevel(item.level)
                }
                className={`p-5 sm:p-6 transition-all duration-200 ${
                  isComingSoon
                    ? "cursor-not-allowed border-white/50 opacity-70"
                    : isSelected && enhancedSelect
                      ? "border-2 border-[#4a70a9] bg-blue-50/90 ring-2 ring-[#4a70a9]/35 scale-[1.01] shadow-md"
                      : isSelected
                        ? "border-[#4a70a9] bg-blue-50/80 ring-2 ring-[#4a70a9]/30"
                        : enhancedSelect
                          ? "border-white/70 hover:border-gray-300 hover:bg-white/80"
                          : "border-white/70"
                }`}
              >
                <div className="mb-3">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-[#4a70a9]">
                      Level {item.level}
                    </p>
                    {isSelected && enhancedSelect && (
                      <span className="rounded-full bg-[#4a70a9] px-2.5 py-0.5 text-xs font-semibold text-white shadow">
                        Terpilih
                      </span>
                    )}
                    {isComingSoon && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                        Coming Soon
                      </span>
                    )}
                  </div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600 sm:text-base">
                      {item.subtitle}
                    </p>
                    {!isComingSoon && (
                      <p className="mt-2 text-sm font-semibold text-[#4a70a9] sm:text-base">
                        {formatPrice(getLevelBasePrice(material, item.level))} /
                        sesi (60 menit)
                      </p>
                    )}
                  </div>

                {item.features.length > 0 && (
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 sm:text-base">
                    {item.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                )}
              </GlassCard>
            );
          })}
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 border-t border-white/70 bg-white/95 px-4 pb-5 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500">Level Terpilih</p>
            <p className="truncate text-sm font-semibold text-gray-900 sm:text-base">
              {selectedLevel ? `Level ${selectedLevel}` : "Belum memilih level"}
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={handleContinue}
            disabled={selectedLevel === null}
            className="whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50"
          >
            Lanjut Pilih Jadwal
          </Button>
        </div>
      </div>
    </div>
  );
}
