"use client";

import { ArrowRight, CheckCircle2, MessageSquare, UserCheck, Calendar } from "lucide-react";

export default function PrivateTutoringSection() {
  return (
    <section id="les" className="py-20 bg-white">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Programs */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 mb-2">
              <UserCheck className="w-3.5 h-3.5" /> Pendampingan Intensif 1-on-1
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#243c4c]">
              Les Privat untuk Anak & Remaja
            </h2>
            <p className="text-[#5c7787] text-base mt-2 mb-8 leading-relaxed">
              Tentor sabar dan terlatih mendampingi anak secara tatap muka (Cilacap) maupun online. Orang tua menerima catatan dan laporan hasil belajar setiap hari.
            </p>

            {/* Program Items */}
            <div className="flex flex-col divide-y divide-[#e5ebee] border-y border-[#e5ebee]">
              <a
                href="/course/config?program=calistung"
                className="py-4 group flex items-start justify-between gap-4 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#243c4c] group-hover:text-[#3f7499] transition-colors">
                      Calistung Ceria (TK – SD Awal)
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-medium border border-amber-200">
                      Favorit Wali
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5c7787] mt-1">
                    Membaca suku kata, menulis halus, dan berhitung konsep dasar tanpa tekanan.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#3f7499] flex items-center gap-1 group-hover:translate-x-1 transition-transform whitespace-nowrap pt-1">
                  Pilih <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </a>

              <a
                href="/course/config?program=ngaji"
                className="py-4 group flex items-start justify-between gap-4 transition-colors"
              >
                <div>
                  <h3 className="font-bold text-[#243c4c] group-hover:text-[#3f7499] transition-colors">
                    Belajar Ngaji, Iqro & Al-Qur'an
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5c7787] mt-1">
                    Bimbingan makharijul huruf, tajwid dasar, hafalan surat pendek dan doa harian.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#3f7499] flex items-center gap-1 group-hover:translate-x-1 transition-transform whitespace-nowrap pt-1">
                  Pilih <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </a>

              <a
                href="/course/config?program=bimbel"
                className="py-4 group flex items-start justify-between gap-4 transition-colors"
              >
                <div>
                  <h3 className="font-bold text-[#243c4c] group-hover:text-[#3f7499] transition-colors">
                    Bimbel Mapel Sekolah (SD & SMP)
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5c7787] mt-1">
                    Pendampingan PR Matematika, IPA, Bahasa Inggris, dan persiapan asesmen semester.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#3f7499] flex items-center gap-1 group-hover:translate-x-1 transition-transform whitespace-nowrap pt-1">
                  Pilih <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </a>

              <a
                href="/course/config?program=coding"
                className="py-4 group flex items-start justify-between gap-4 transition-colors"
              >
                <div>
                  <h3 className="font-bold text-[#243c4c] group-hover:text-[#3f7499] transition-colors">
                    Bikin Web, Aplikasi & Komputer Dasar
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5c7787] mt-1">
                    Bimbingan langsung bikin website nyata dari 0, logika pemrograman, dan skill IT.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#3f7499] flex items-center gap-1 group-hover:translate-x-1 transition-transform whitespace-nowrap pt-1">
                  Pilih <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: Simulated Live Progress Report for Parents */}
          <div className="lg:col-span-5">
            <div className="bg-[#f8faf9] border border-[#d3dddf] rounded-3xl p-6 sm:p-7 shadow-lg relative">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm text-[#243c4c] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Rapor Perkembangan Murid
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white border border-[#d3dddf] text-[11px] font-semibold text-[#5c7787]">
                  Semester Ini
                </span>
              </div>

              <div className="text-xs text-[#5c7787] mb-4">
                Nama Murid: <b>Zidny (Kelas 1 SD)</b> • Tentor: <b>Kak Dina</b>
              </div>

              <hr className="border-[#e5ebee] my-3" />

              {/* Progress Bars */}
              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#243c4c] mb-1">
                    <span>Kelancaran Membaca Suku Kata</span>
                    <span className="text-emerald-700">85% (Lancar)</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#d3dddf] overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full w-[85%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#243c4c] mb-1">
                    <span>Makhraj Huruf & Iqro</span>
                    <span className="text-[#3f7499]">75% (Tartil)</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#d3dddf] overflow-hidden">
                    <div className="h-full bg-[#3f7499] rounded-full w-[75%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#243c4c] mb-1">
                    <span>Pemahaman Berhitung Konsep</span>
                    <span className="text-amber-700">70% (Berkembang)</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#d3dddf] overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[70%]" />
                  </div>
                </div>
              </div>

              {/* Notes for parents */}
              <div className="mt-5 bg-white border border-[#d3dddf] rounded-2xl p-4">
                <div className="text-[11px] uppercase font-bold text-[#5c7787] tracking-wider mb-1">
                  Catatan Sesi Terakhir:
                </div>
                <p className="text-xs text-[#243c4c] leading-relaxed">
                  “Ananda sangat antusias hari ini. Latihan membaca lancar tanpa terbata-bata. Untuk berhitung sudah paham penjumlahan jari 1–10.”
                </p>
              </div>

              <p className="text-[11px] text-[#5c7787] mt-4 text-center">
                Orang tua dapat memantau setiap jadwal, catatan sesi, dan invoice langsung dari portal.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Steps Registration Flow */}
        <div className="mt-16 pt-12 border-t border-[#d3dddf] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-[#f8faf9] border border-[#e1e9ea]">
            <span className="text-xs font-bold text-[#3f7499]">Langkah 1</span>
            <b className="text-sm text-[#243c4c]">Pilih Kebutuhan</b>
            <span className="text-xs text-[#5c7787]">Tentukan program dan jenjang belajar anak.</span>
          </div>

          <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-[#f8faf9] border border-[#e1e9ea]">
            <span className="text-xs font-bold text-[#3f7499]">Langkah 2</span>
            <b className="text-sm text-[#243c4c]">Cocokkan Tentor</b>
            <span className="text-xs text-[#5c7787]">Sesuai mata pelajaran, karakter & domisili.</span>
          </div>

          <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-[#f8faf9] border border-[#e1e9ea]">
            <span className="text-xs font-bold text-[#3f7499]">Langkah 3</span>
            <b className="text-sm text-[#243c4c]">Atur Jadwal & Biaya</b>
            <span className="text-xs text-[#5c7787]">Pilih hari dan sesi, total biaya transparan.</span>
          </div>

          <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-[#f8faf9] border border-[#e1e9ea]">
            <span className="text-xs font-bold text-emerald-700">Langkah 4</span>
            <b className="text-sm text-[#243c4c]">Mulai lewat WhatsApp</b>
            <span className="text-xs text-[#5c7787]">Pesan pendaftaran terisi otomatis dan siap kirim.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
