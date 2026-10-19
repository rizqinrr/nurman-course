"use client";

import { Clock, Globe, MapPin, Sparkles, Truck } from "lucide-react";
import { COVERAGE_AREAS } from "@/data/coverage";

interface Props {
  selectedAreaId: string | null;
  onSelectArea: (areaId: string) => void;
}

export default function CoverageAreaCards({ selectedAreaId, onSelectArea }: Props) {
  const zona1Areas = COVERAGE_AREAS.filter((a) => a.zone === 1);
  const zona2Areas = COVERAGE_AREAS.filter((a) => a.zone === 2);

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#4a70a9]">
            Skema Zonasi & Layanan
          </span>
          <h2 className="mt-2 font-display text-3xl font-black text-[#14233a] sm:text-4xl">
            Tiga Pilihan Jangkauan Belajar
          </h2>
          <p className="mt-2 text-sm text-[#50647a] sm:text-base">
            Dari les tatap muka di rumah hingga pendampingan online interaktif, semua terpantau lewat portal wali.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {/* CARD ZONA 1 */}
          <div className="flex flex-col justify-between rounded-2xl border-2 border-[#4a70a9] bg-[#fffdf9] p-6 shadow-[0_12px_28px_-16px_rgba(46,75,122,0.25)] relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#4a70a9] text-white px-3 py-1 rounded-bl-xl font-mono text-[0.68rem] font-bold uppercase tracking-wider">
              Favorit Tatap Muka
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf0f9] text-[#2e4b7a] font-black text-sm border border-[#4a70a9]/30">
                  1
                </span>
                <div>
                  <h3 className="font-display text-lg font-black text-[#14233a]">Zona 1 — Cilacap Kota</h3>
                  <span className="font-mono text-xs font-bold text-emerald-700">Bebas Biaya Transport (Rp 0)</span>
                </div>
              </div>

              <p className="mt-4 text-xs text-[#50647a] leading-relaxed">
                Area prioritas di mana tentor siap meluncur langsung ke rumah siswa tanpa tambahan biaya perjalanan.
              </p>

              <div className="mt-5 space-y-2.5 border-t border-[#e6dfd1] pt-4 text-xs">
                <div className="flex items-center gap-2 text-[#203652]">
                  <Clock className="h-4 w-4 text-[#4a70a9] shrink-0" />
                  <span>Estimasi tiba: <strong>10 - 25 menit</strong></span>
                </div>
                <div className="flex items-center gap-2 text-[#203652]">
                  <Truck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Transport: <strong>Gratis</strong></span>
                </div>
                <div className="flex items-start gap-2 text-[#203652]">
                  <MapPin className="h-4 w-4 text-[#4a70a9] shrink-0 mt-0.5" />
                  <span>Kecamatan: <strong>Cilacap Tengah, Selatan, Utara</strong></span>
                </div>
              </div>

              <div className="mt-5">
                <span className="block text-[0.68rem] font-mono uppercase tracking-wider text-[#627894] mb-1.5 font-bold">
                  Pilih Area untuk Sorot di Peta:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {zona1Areas.map((area) => (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => onSelectArea(area.id)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                        selectedAreaId === area.id
                          ? "bg-[#2e4b7a] text-white shadow-xs"
                          : "bg-[#f7f5ef] text-[#203652] hover:bg-[#eaf0f9] border border-[#d9d2c2]"
                      }`}
                    >
                      {area.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CARD ZONA 2 */}
          <div className="flex flex-col justify-between rounded-2xl border-2 border-[#d9d2c2] bg-[#fffdf9] p-6 shadow-[0_12px_28px_-16px_rgba(27,48,77,0.18)]">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fef3c7] text-[#92400e] font-black text-sm border border-[#f59e0b]/30">
                  2
                </span>
                <div>
                  <h3 className="font-display text-lg font-black text-[#14233a]">Zona 2 — Sekitar Cilacap</h3>
                  <span className="font-mono text-xs font-bold text-[#b45309]">Jangkauan Reguler</span>
                </div>
              </div>

              <p className="mt-4 text-xs text-[#50647a] leading-relaxed">
                Mencakup kecamatan di luar lingkar kota dengan tambahan kontribusi transport terjangkau per sesi.
              </p>

              <div className="mt-5 space-y-2.5 border-t border-[#e6dfd1] pt-4 text-xs">
                <div className="flex items-center gap-2 text-[#203652]">
                  <Clock className="h-4 w-4 text-[#f59e0b] shrink-0" />
                  <span>Estimasi tiba: <strong>25 - 45 menit</strong></span>
                </div>
                <div className="flex items-center gap-2 text-[#203652]">
                  <Truck className="h-4 w-4 text-[#b45309] shrink-0" />
                  <span>Transport: <strong>Rp 10.000 - Rp 15.000 / sesi</strong></span>
                </div>
                <div className="flex items-start gap-2 text-[#203652]">
                  <MapPin className="h-4 w-4 text-[#f59e0b] shrink-0 mt-0.5" />
                  <span>Kecamatan: <strong>Kesugihan, Jeruklegi, Maos, Adipala, Kroya, Sampang</strong></span>
                </div>
              </div>

              <div className="mt-5">
                <span className="block text-[0.68rem] font-mono uppercase tracking-wider text-[#627894] mb-1.5 font-bold">
                  Pilih Area untuk Sorot di Peta:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {zona2Areas.map((area) => (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => onSelectArea(area.id)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                        selectedAreaId === area.id
                          ? "bg-[#b45309] text-white shadow-xs"
                          : "bg-[#f7f5ef] text-[#203652] hover:bg-[#fef3c7] border border-[#d9d2c2]"
                      }`}
                    >
                      {area.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CARD ZONA 3 ONLINE */}
          <div className="flex flex-col justify-between rounded-2xl border-2 border-[#d9d2c2] bg-[#fffdf9] p-6 shadow-[0_12px_28px_-16px_rgba(27,48,77,0.18)]">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ede9fe] text-[#6d28d9] font-black text-sm border border-[#8b5cf6]/30">
                  🌐
                </span>
                <div>
                  <h3 className="font-display text-lg font-black text-[#14233a]">Zona Online — Seluruh Indonesia</h3>
                  <span className="font-mono text-xs font-bold text-[#6d28d9]">Google Meet / Zoom 1-on-1</span>
                </div>
              </div>

              <p className="mt-4 text-xs text-[#50647a] leading-relaxed">
                Untuk siswa di luar Cilacap (Purwokerto, Banyumas, Jakarta, Surabaya, dll.) yang ingin bimbingan intensif privat.
              </p>

              <div className="mt-5 space-y-2.5 border-t border-[#e6dfd1] pt-4 text-xs">
                <div className="flex items-center gap-2 text-[#203652]">
                  <Globe className="h-4 w-4 text-[#8b5cf6] shrink-0" />
                  <span>Jangkauan: <strong>Seluruh Indonesia & Mancanegara</strong></span>
                </div>
                <div className="flex items-center gap-2 text-[#203652]">
                  <Truck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Transport: <strong>Bebas Biaya (Rp 0)</strong></span>
                </div>
                <div className="flex items-start gap-2 text-[#203652]">
                  <Sparkles className="h-4 w-4 text-[#8b5cf6] shrink-0 mt-0.5" />
                  <span>Media: <strong>Live screen-share, interactive tablet, & recording</strong></span>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-[#f5f3ff] p-3 text-xs text-[#5b21b6] border border-[#ddd6fe]">
                💡 Tetap mendapatkan laporan belajar harian di portal wali persis seperti les tatap muka!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
