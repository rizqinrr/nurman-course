"use client";

import dynamic from "next/dynamic";
import { Compass } from "lucide-react";

interface Props {
  selectedAreaId: string | null;
  onSelectArea: (areaId: string) => void;
  userCoords: { lat: number; lng: number } | null;
  onMapClick: (coords: { lat: number; lng: number }) => void;
}

const CoverageMapInner = dynamic(
  () => import("./CoverageMapInner"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[460px] sm:min-h-[560px] w-full flex-col items-center justify-center rounded-2xl border-2 border-[#d9d2c2] bg-[#f7f5ef] p-8 text-center shadow-inner">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf0f9] text-[#2e4b7a] border-2 border-[#4a70a9]">
          <Compass className="h-8 w-8 animate-spin text-[#4a70a9]" />
        </div>
        <p className="mt-4 font-display text-base font-bold text-[#14233a]">
          Menyiapkan Peta Jangkauan...
        </p>
        <p className="mt-1 font-mono text-xs text-[#50647a]">
          Memuat titik koordinat area Cilacap & sekitarnya
        </p>
      </div>
    ),
  }
);

export default function CoverageMap(props: Props) {
  return <CoverageMapInner {...props} />;
}
