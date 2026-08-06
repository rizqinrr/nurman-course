/* Hallmark · genre: playful-glassmorphism · design-system: design.md · designed-as-app */
import { Suspense } from "react";
import LaporanPerkembanganClient from "./LaporanPerkembanganClient";

export default function LaporanPerkembanganPage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-indigo-50 font-semibold">
        Memuat halaman laporan perkembangan...
      </div>
    }>
      <LaporanPerkembanganClient />
    </Suspense>
  );
}