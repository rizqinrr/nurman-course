"use client";

import { ArrowRight, UserCheck } from "lucide-react";
import FourStepsInteractive from "./FourStepsInteractive";

export default function PrivateTutoringSection() {
  return (
    <section id="les" className="py-20">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Programs */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border-2 border-emerald-200 text-xs font-mono font-bold text-emerald-800 mb-3 shadow-xs">
              <UserCheck className="w-3.5 h-3.5" /> Pendampingan Intensif 1-on-1
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#14233a]">
              Les Privat untuk Anak & Remaja
            </h2>
            <p className="text-[#50647a] text-base mt-3 mb-4 leading-relaxed">
              Tentor sabar dan terlatih mendampingi anak secara tatap muka (Cilacap) maupun online. Orang tua menerima catatan dan laporan hasil belajar setiap hari.
            </p>
            <div className="mb-8">
              <a
                href="/jangkauan"
                className="inline-flex items-center gap-2 text-xs font-extrabold text-[#2e4b7a] bg-[#eaf0f9] hover:bg-[#dbe6f5] px-3.5 py-1.5 rounded-xl border-2 border-[#4a70a9]/30 shadow-xs transition-transform hover:-translate-y-0.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Buka Peta Jangkauan Wilayah & Cek Lokasi Rumah</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Program Items */}
            <div className="flex flex-col divide-y-2 divide-[#e6dfd1] border-y-2 border-[#e6dfd1]">
              <a
                href="/course/config?program=calistung"
                className="py-4 group flex items-start justify-between gap-4 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-[#14233a] group-hover:text-[#4a70a9] transition-colors text-lg">
                      Calistung Ceria (TK – SD Awal)
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">
                      Favorit Wali
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#50647a] mt-1">
                    Membaca suku kata, menulis halus, dan berhitung konsep dasar tanpa tekanan.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#4a70a9] flex items-center gap-1 group-hover:translate-x-1 transition-transform whitespace-nowrap pt-1">
                  Pilih <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </a>

              <a
                href="/course/config?program=ngaji"
                className="py-4 group flex items-start justify-between gap-4 transition-colors"
              >
                <div>
                  <h3 className="font-display font-bold text-[#14233a] group-hover:text-[#4a70a9] transition-colors text-lg">
                    Belajar Ngaji, Iqro & Al-Qur&apos;an
                  </h3>
                  <p className="text-xs sm:text-sm text-[#50647a] mt-1">
                    Bimbingan makharijul huruf, tajwid dasar, hafalan surat pendek dan doa harian.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#4a70a9] flex items-center gap-1 group-hover:translate-x-1 transition-transform whitespace-nowrap pt-1">
                  Pilih <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </a>

              <a
                href="/course/config?program=bimbel"
                className="py-4 group flex items-start justify-between gap-4 transition-colors"
              >
                <div>
                  <h3 className="font-display font-bold text-[#14233a] group-hover:text-[#4a70a9] transition-colors text-lg">
                    Bimbel Mapel Sekolah (SD & SMP)
                  </h3>
                  <p className="text-xs sm:text-sm text-[#50647a] mt-1">
                    Pendampingan PR Matematika, IPA, Bahasa Inggris, dan persiapan asesmen semester.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#4a70a9] flex items-center gap-1 group-hover:translate-x-1 transition-transform whitespace-nowrap pt-1">
                  Pilih <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </a>

              <a
                href="/course/config?program=coding"
                className="py-4 group flex items-start justify-between gap-4 transition-colors"
              >
                <div>
                  <h3 className="font-display font-bold text-[#14233a] group-hover:text-[#4a70a9] transition-colors text-lg">
                    Bikin Web, Aplikasi & Komputer Dasar
                  </h3>
                  <p className="text-xs sm:text-sm text-[#50647a] mt-1">
                    Bimbingan langsung bikin website nyata dari 0, logika pemrograman, dan skill IT.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#4a70a9] flex items-center gap-1 group-hover:translate-x-1 transition-transform whitespace-nowrap pt-1">
                  Pilih <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: Simulated Live Progress Report for Parents */}
          <div className="lg:col-span-5">
            <div className="bg-[#fffdf9] border-2 border-[#d9d2c2] rounded-[2rem] p-6 sm:p-7 shadow-[0_20px_40px_-18px_rgba(27,48,77,0.2)] relative">
              <div className="flex items-center justify-between mb-3">
                <span className="font-display font-bold text-sm text-[#14233a] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Rapor Perkembangan Murid
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#f7f5ef] border border-[#d9d2c2] font-mono text-[11px] font-bold text-[#627894]">
                  Semester Ini
                </span>
              </div>

              <div className="text-xs text-[#627894] mb-4 font-medium">
                Nama Murid: <b className="text-[#14233a]">Zidny (Kelas 1 SD)</b> • Tentor: <b className="text-[#14233a]">Kak Dina</b>
              </div>

              <hr className="border-0 border-t-2 border-[#e6dfd1] my-3" />

              {/* Progress Bars */}
              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#14233a] mb-1">
                    <span>Kelancaran Membaca Suku Kata</span>
                    <span className="text-emerald-700">85% (Lancar)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[#e6dfd1] overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full w-[85%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-[#14233a] mb-1">
                    <span>Makhraj Huruf & Iqro</span>
                    <span className="text-[#4a70a9]">75% (Tartil)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[#e6dfd1] overflow-hidden">
                    <div className="h-full bg-[#4a70a9] rounded-full w-[75%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-[#14233a] mb-1">
                    <span>Pemahaman Berhitung Konsep</span>
                    <span className="text-amber-700">70% (Berkembang)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[#e6dfd1] overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[70%]" />
                  </div>
                </div>
              </div>

              {/* Notes for parents */}
              <div className="mt-5 bg-[#f7f5ef] border border-[#d9d2c2] rounded-2xl p-4">
                <div className="font-mono text-[11px] uppercase font-bold text-[#2e4b7a] tracking-wider mb-1">
                  Catatan Sesi Terakhir:
                </div>
                <p className="text-xs text-[#2b3a4a] leading-relaxed">
                  “Ananda sangat antusias hari ini. Latihan membaca lancar tanpa terbata-bata. Untuk berhitung sudah paham penjumlahan jari 1–10.”
                </p>
              </div>

              <p className="text-[11px] text-[#627894] mt-4 text-center font-medium">
                Orang tua dapat memantau setiap jadwal, catatan sesi, dan invoice langsung dari portal.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive 4 Steps Registration Flow */}
        <FourStepsInteractive />
      </div>
    </section>
  );
}
