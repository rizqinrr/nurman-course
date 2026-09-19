"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Check, LockKeyhole } from "lucide-react";
import CourseRouteHeader from "@/components/course/CourseRouteHeader";
import { getMaterialById } from "@/data/materials";
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
  const selectedLevelData = material?.levels.find((item) => item.level === selectedLevel);

  const handleContinue = () => {
    if (!material || !selectedLevelData || selectedLevelData.comingSoon) return;
    router.push(`/course/config?materi=${material.id}&level=${selectedLevelData.level}`);
  };

  if (!material) {
    return (
      <div className="pt-4 sm:pt-8">
        <CourseRouteHeader current={3} title="Materi tidak ditemukan" subtitle="Silakan kembali ke daftar materi dan pilih materi lain." />
      </div>
    );
  }

  return (
    <div className="pb-40 pt-4 sm:pt-8">
      <CourseRouteHeader current={3} title={material.name} subtitle={material.description} />

      <section className="mb-6 rounded-[1.75rem] border border-[#c4d3e3] bg-white/75 p-5 sm:p-6">
        <h2 className="text-2xl font-black tracking-[-0.04em] text-[#294568] sm:text-3xl">
          Kuasai {material.name} dengan jalur belajar yang jelas
        </h2>
        <p className="mt-3 leading-7 text-[#536781]">
          Pilih level yang paling sesuai, belajar bertahap, dan fokus pada hasil yang bisa langsung dipakai.
        </p>
      </section>

      <div className="mb-6 flex items-end justify-between gap-4 rounded-[1.75rem] border border-[#c4d3e3] bg-[#2e4b7a] p-5 text-white shadow-[0_16px_38px_rgba(46,75,122,0.2)] sm:p-6">
        <div>
          <p className="text-sm font-semibold text-[#d9e5f1]">Harga mulai</p>
          <p className="mt-1 text-2xl font-black tracking-[-0.03em]">{formatPrice(material.basePrice)} <span className="text-sm font-semibold">/ sesi</span></p>
        </div>
        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold">60 menit</span>
      </div>

      {material.id === "vibe-coding" && (
        <div className="mb-6 rounded-2xl border border-[#d8c274] bg-[#fff9df] px-4 py-4 text-sm leading-6 text-[#625522]">
          <p className="font-black text-[#493b12]">Syarat ikut kelas</p>
          <p>Punya laptop/komputer sendiri dan internet lancar untuk tool AI online.</p>
        </div>
      )}

      <section aria-labelledby="level-title">
        <h2 id="level-title" className="mb-4 text-xl font-black tracking-[-0.03em] text-[#294568]">Level yang tersedia</h2>
        <div className="relative space-y-4 pl-5">
          <div className="absolute bottom-10 left-1 top-10 w-px bg-[#c4d3e3]" aria-hidden="true" />
          {material.levels.map((item) => {
            const isComingSoon = Boolean(item.comingSoon);
            const isSelected = !isComingSoon && selectedLevel === item.level;
            return (
              <button
                key={item.level}
                type="button"
                disabled={isComingSoon}
                aria-pressed={isSelected}
                onClick={() => setSelectedLevel(item.level)}
                className={`relative w-full rounded-[1.75rem] border p-5 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a70a9] sm:p-6 ${isComingSoon ? "cursor-not-allowed border-[#d3dfeb] bg-[#edf2f7] text-[#7d8fa5]" : isSelected ? "border-[#4a70a9] bg-white shadow-[0_18px_42px_rgba(46,75,122,0.16)] ring-2 ring-[#4a70a9]/15" : "border-[#c4d3e3] bg-white/75 hover:-translate-y-1 hover:border-[#4a70a9] hover:bg-white"}`}
              >
                <div className="flex items-start gap-4">
                  <span className={`relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-sm font-black ${isComingSoon ? "bg-[#dce5ee] text-[#657991]" : isSelected ? "bg-[#f2c14e] text-[#493b12]" : "bg-[#4a70a9] text-white"}`}>
                    {isComingSoon ? <LockKeyhole size={18} aria-hidden="true" /> : item.level}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-black tracking-[-0.03em] text-[#294568]">{item.title}</span>
                      {isSelected && <span className="inline-flex items-center gap-1 rounded-full bg-[#eaf1f8] px-2.5 py-1 text-xs font-black text-[#355276]"><Check size={12} /> Terpilih</span>}
                      {isComingSoon && <span className="rounded-full bg-[#fff5cb] px-2.5 py-1 text-xs font-black text-[#806512]">Coming Soon</span>}
                    </span>
                    <span className="mt-0.5 block text-sm text-[#627894]">{item.subtitle}</span>
                    {!isComingSoon && <span className="mt-2 block text-sm font-bold text-[#627894]">Harga final dihitung pada langkah Jadwal</span>}
                  </span>
                </div>
                {item.features.length > 0 && (
                  <ul className="mt-4 grid gap-2 border-t border-[#dbe5ef] pt-4 text-sm leading-6 text-[#536781] sm:grid-cols-2">
                    {item.features.map((feature) => <li key={feature} className="flex gap-2"><Check size={15} className="mt-1 shrink-0 text-[#4a70a9]" aria-hidden="true" /><span>{feature}</span></li>)}
                  </ul>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#c4d3e3] bg-[#f8fbff]/95 px-4 pb-5 pt-4 shadow-[0_-12px_34px_rgba(46,75,122,0.12)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#627894]">Level terpilih</p>
            <p className="truncate text-sm font-black text-[#294568] sm:text-base">{selectedLevelData ? `Level ${selectedLevelData.level} · ${selectedLevelData.title}` : "Belum memilih level"}</p>
          </div>
          <button type="button" onClick={handleContinue} disabled={!selectedLevelData} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#4a70a9] px-5 text-sm font-black text-white shadow-[0_12px_26px_rgba(74,112,169,0.25)] transition hover:bg-[#3a5a99] disabled:cursor-not-allowed disabled:bg-[#a8b7c8] disabled:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a70a9]">Lanjut jadwal <ArrowRight size={17} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  );
}
