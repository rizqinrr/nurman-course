/* Hallmark · genre: playful-glassmorphism · design-system: design.md · designed-as-app */
import { Suspense } from "react";
import LaporanHarianClient from "./LaporanHarianClient";

export default function LaporanHarianPage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-indigo-50 font-semibold">
        Memuat halaman laporan harian...
      </div>
    }>
      <LaporanHarianClient />
    </Suspense>
  );
}