"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Bagaimana cara memastikan rumah saya bisa dikunjungi tentor?",
    a: "Anda bisa memilih kecamatan/kelurahan Anda pada fitur Cek Lokasi di atas, atau klik titik rumah Anda langsung di peta. Jika berada dalam Zona 1 (Cilacap Kota), tentor kami siap datang tanpa biaya transport ekstra. Untuk Zona 2, ada kontribusi transport terjangkau Rp 10.000 - Rp 15.000 per pertemuan.",
  },
  {
    q: "Apakah biaya transport dihitung per anak atau per kunjungan?",
    a: "Biaya transport hanya dihitung per satu kali kunjungan sesi, bukan per anak. Jika ada 2 anak belajar bersama di satu rumah pada waktu yang sama, biaya transport tetap hanya 1 kali.",
  },
  {
    q: "Bagaimana jika rumah saya berada di luar area Cilacap?",
    a: "Untuk siswa di luar jangkauan tatap muka (misal Purwokerto, Banyumas, Kebumen, atau kota lainnya), kami menyediakan kelas privat 1-on-1 online via Google Meet / Zoom. Materi, durasi, dan laporan perkembangan anak tetap sama lengkapnya.",
  },
  {
    q: "Apakah anak bisa belajar di rumah tentor?",
    a: "Bisa! Selain opsi tentor datang ke rumah siswa, Anda juga bisa memilih lokasi belajar di rumah tentor (Hub nCourse) saat konfigurasi jadwal. Opsi ini bebas biaya transport.",
  },
  {
    q: "Bagaimana orang tua memantau hasil belajar saat tentor datang ke rumah?",
    a: "Setiap sesi selesai, tentor mengisi laporan harian langsung ke sistem. Orang tua dapat login ke Portal Wali (atau menerima link via WhatsApp) untuk melihat materi apa yang dipelajari, catatan sikap/fokus anak, dan rekomendasi latihan.",
  },
];

export default function CoverageFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10">
        <div className="text-center">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#4a70a9]">
            Pertanyaan Umum
          </span>
          <h2 className="mt-2 font-display text-3xl font-black text-[#14233a] sm:text-4xl">
            Seputar Jangkauan & Kunjungan Tentor
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border-2 border-[#d9d2c2] bg-[#fffdf9] transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left font-display text-base font-extrabold text-[#14233a] transition-colors hover:text-[#4a70a9]"
                >
                  <span className="pr-4">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#8da3bd] transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#4a70a9]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t-2 border-[#e6dfd1] bg-[#f7f5ef] p-5 text-xs sm:text-sm leading-relaxed text-[#50647a]">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
