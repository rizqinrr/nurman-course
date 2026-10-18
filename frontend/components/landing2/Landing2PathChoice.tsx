import { ArrowRight, BookOpen, UserCheck } from "lucide-react";

export default function Landing2PathChoice() {
  return (
    <section id="pilihan-belajar" className="py-20 bg-[#f9faf9]">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#243c4c]">
            Pilih Cara Belajarmu
          </h2>
          <p className="text-sm sm:text-base text-[#5c7787] mt-2">
            Dua jalur dengan akun yang sama. Pilih yang paling cocok hari ini, ganti atau gabungkan kapan saja.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Kelas Mandiri */}
          <div className="bg-white border border-[#d3dddf] hover:border-[#3f7499] rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#3f7499]/15 flex items-center justify-center text-[#3f7499] mb-6">
                <BookOpen className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-[#243c4c] mb-3">
                Kelas Mandiri
              </h3>
              <p className="text-sm text-[#5c7787] mb-6 leading-relaxed">
                Cocok untuk yang ingin belajar sesuai ritme sendiri. Baca materi ringkas, tandai progres, dan langsung praktik membuat karya.
              </p>

              <dl className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-2.5 text-xs sm:text-sm pt-4 border-t border-[#f0f4f5]">
                <dt className="text-[#5c7787] font-medium">Untuk</dt>
                <dd className="text-[#243c4c] font-semibold">Pelajar, mahasiswa & umum</dd>

                <dt className="text-[#5c7787] font-medium">Cara kerja</dt>
                <dd className="text-[#243c4c]">Baca modul, tandai selesai, simpan progres</dd>

                <dt className="text-[#5c7787] font-medium">Akses</dt>
                <dd className="text-[#243c4c]">Banyak modul gratis, tanpa batas waktu</dd>
              </dl>
            </div>

            <div className="mt-8 pt-6 border-t border-[#f0f4f5]">
              <a
                href="#kelas"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#3f7499] hover:bg-[#243c4c] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm"
              >
                Lihat Modul Mandiri <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Card 2: Les Privat */}
          <div className="bg-white border border-[#d3dddf] hover:border-[#3f7499] rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 mb-6">
                <UserCheck className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-[#243c4c] mb-3">
                Les Privat Intensif (1-on-1)
              </h3>
              <p className="text-sm text-[#5c7787] mb-6 leading-relaxed">
                Cocok untuk orang tua yang ingin pendampingan tulus dan terarah bagi anak. Didampingi tentor sabar dengan laporan harian setiap sesi.
              </p>

              <dl className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-2.5 text-xs sm:text-sm pt-4 border-t border-[#f0f4f5]">
                <dt className="text-[#5c7787] font-medium">Untuk</dt>
                <dd className="text-[#243c4c] font-semibold">Anak TK, SD, SMP & Remaja</dd>

                <dt className="text-[#5c7787] font-medium">Program</dt>
                <dd className="text-[#243c4c]">Calistung, Ngaji/Iqro, Bimbel, Bikin Web</dd>

                <dt className="text-[#5c7787] font-medium">Pemantauan</dt>
                <dd className="text-[#243c4c]">Catatan harian tentor di portal orang tua</dd>
              </dl>
            </div>

            <div className="mt-8 pt-6 border-t border-[#f0f4f5]">
              <a
                href="/course/config"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#243c4c] hover:bg-[#243c4c] hover:text-white text-[#243c4c] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Susun Les Privat Anak <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
