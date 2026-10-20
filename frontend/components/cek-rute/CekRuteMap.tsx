"use client";

import dynamic from "next/dynamic";
import { Compass } from "lucide-react";
import type { LatLng } from "@/lib/ors-client";

interface Props {
  titikUtama?: { lat: number; lng: number; alamat?: string };
  lokasiUser: (LatLng & { alamat?: string }) | null;
  onUserLocationChange: (lokasi: LatLng & { alamat?: string }) => void;
  rute: [number, number][] | null;
  tahap: number;
  isPilihDiPetaAktif: boolean;
  onMapClick: (coords: LatLng) => void;
}

const CekRuteMapInner = dynamic(
  () => import("./CekRuteMapInner"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#f7f5ef] p-8 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#4a70a9] bg-[#eaf0f9] text-[#2e4b7a]">
          <Compass className="h-8 w-8 animate-spin text-[#4a70a9]" />
        </div>
        <p className="mt-4 font-display text-base font-bold text-[#14233a]">
          Menyiapkan Peta Rute...
        </p>
        <p className="mt-1 font-mono text-xs text-[#50647a]">
          Memuat peta jalan darat dan koordinat tempat les
        </p>
      </div>
    ),
  }
);

export default function CekRuteMap(props: Props) {
  return <CekRuteMapInner {...props} />;
}
