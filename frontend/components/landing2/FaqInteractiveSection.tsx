"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "Apakah anak bisa belajar bikin web & aplikasi dari 0 tanpa pengalaman koding?",
    a: "Sangat bisa! Di Nurman Course, materi diajarkan mulai dari yang paling visual dan mudah dipahami: menyusun teks, gambar, tata letak warna, hingga membuat website toko sederhana. Tidak langsung dijejali rumus rumit.",
  },
  {
    q: "Apa saja program les privat yang tersedia di Nurman Course?",
    a: "Kami menyediakan: 1) Calistung (Membaca, menulis, berhitung untuk TK & SD awal), 2) Belajar Ngaji, Iqro & Tahsin Al-Qur'an, 3) Bimbel Mapel Sekolah (SD & SMP), dan 4) Bikin Web & Komputer Dasar. Semua didampingi tentor sabar secara 1-on-1.",
  },
  {
    q: "Bagaimana cara orang tua memantau perkembangan belajar anak?",
    a: "Setelah setiap sesi les privat selesai, tentor mengisi laporan harian berisi materi yang dipelajari, pencapaian anak, dan catatan evaluasi. Orang tua bisa melihatnya secara real-time di Portal Wali.",
  },
  {
    q: "Apakah les privat diadakan secara tatap muka atau online?",
    a: "Kedua opsi tersedia! Untuk wilayah Cilacap dan sekitarnya, tentor bisa datang ke rumah (tatap muka). Untuk siswa di luar Cilacap atau yang memilih fleksibilitas, kami menyediakan kelas online interaktif via Google Meet.",
  },
  {
    q: "Apa bedanya kelas mandiri gratis dan berbayar?",
    a: "Modul dasar dan pengenalan dapat dibaca secara gratis cukup dengan mendaftar akun. Modul tingkat lanjut dan proyek pembuatan aplikasi lengkap dapat diakses dengan paket terjangkau.",
  },
];

export default function FaqInteractiveSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-white border-t border-[#d3dddf]">
      <div className="max-w-[840px] mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5289ad]/15 text-xs font-semibold text-[#243c4c] mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#3f7499]" /> Tanya Jawab
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#243c4c]">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-sm text-[#5c7787] mt-1.5">
            Hal penting seputar belajar mandiri, les privat, dan pemantauan orang tua.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-[#e5ebee] border-y border-[#e5ebee]">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={item.q} className="py-4">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 font-bold text-sm sm:text-base text-[#243c4c] hover:text-[#3f7499] transition-colors cursor-pointer py-1"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#5c7787] flex-none transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#3f7499]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="text-xs sm:text-sm text-[#5c7787] leading-relaxed mt-2.5 pr-6 animate-fade-in">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
