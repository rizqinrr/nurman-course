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
    a: "Sangat bisa! Di nCourse, materi diajarkan mulai dari yang paling visual dan mudah dipahami: menyusun teks, gambar, tata letak warna, hingga membuat website toko sederhana. Tidak langsung dijejali rumus rumit.",
  },
  {
    q: "Apa saja program les privat yang tersedia di nCourse?",
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
    <section id="faq" className="py-20 border-t-2 border-[#d9d2c2]">
      <div className="max-w-[840px] mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4a70a9]/10 border-2 border-[#4a70a9]/20 font-mono text-xs font-bold text-[#2e4b7a] mb-2 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#4a70a9]" /> Tanya Jawab
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#14233a]">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-sm sm:text-base text-[#50647a] mt-1.5">
            Hal penting seputar belajar mandiri, les privat, dan pemantauan orang tua.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={item.q}
                className={`bg-[#fffdf9] border-2 rounded-2xl p-5 transition-all duration-200 ${
                  isOpen
                    ? "border-[#4a70a9] shadow-[0_12px_24px_-16px_rgba(27,48,77,0.18)]"
                    : "border-[#d9d2c2] hover:border-[#4a70a9]/60"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 font-display font-bold text-base sm:text-lg text-[#14233a] hover:text-[#4a70a9] transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#627894] flex-none transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#4a70a9]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="text-sm text-[#50647a] leading-relaxed mt-3 pt-3 border-t border-[#e6dfd1] animate-fade-in">
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
