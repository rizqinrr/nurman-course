import { ArrowRight, BookOpen, UserCheck } from "lucide-react";

export default function Landing2PathChoice() {
  return (
    <section id="pilihan-belajar" className="py-20">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#14233a]">
            Pilih Cara Belajarmu
          </h2>
          <p className="text-sm sm:text-base text-[#50647a] mt-2">
            Dua jalur dengan akun yang sama. Pilih yang paling cocok hari ini, ganti atau gabungkan kapan saja.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Kelas Mandiri */}
          <div className="bg-[#fffdf9] border-2 border-[#d9d2c2] hover:border-[#4a70a9] rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 shadow-[0_16px_32px_-20px_rgba(27,48,77,0.18)] hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#4a70a9]/10 border-2 border-[#4a70a9]/20 flex items-center justify-center text-[#4a70a9] mb-6 shadow-xs">
                <BookOpen className="w-6 h-6" />
              </div>

              <h3 className="font-display text-2xl font-bold text-[#14233a] mb-2.5">
                Kelas Mandiri
              </h3>
              <p className="text-sm text-[#50647a] mb-6 leading-relaxed">
                Cocok untuk yang ingin belajar sesuai ritme sendiri. Baca materi ringkas, tandai progres, dan langsung praktik membuat karya.
              </p>

              <dl className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-2.5 text-xs sm:text-sm pt-4 border-t-2 border-[#e6dfd1]">
                <dt className="text-[#627894] font-bold">Untuk</dt>
                <dd className="text-[#14233a] font-semibold">Pelajar, mahasiswa & umum</dd>

                <dt className="text-[#627894] font-bold">Cara kerja</dt>
                <dd className="text-[#2b3a4a]">Baca modul, tandai selesai, simpan progres</dd>

                <dt className="text-[#627894] font-bold">Akses</dt>
                <dd className="text-[#2b3a4a]">Banyak modul gratis, tanpa batas waktu</dd>
              </dl>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-[#e6dfd1]">
              <a
                href="#kelas"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#4a70a9] hover:bg-[#3d6094] text-white text-xs sm:text-sm font-bold shadow-[0_3px_0_#2b4875] transition-all cursor-pointer"
              >
                Lihat Modul Mandiri <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Card 2: Les Privat */}
          <div className="bg-[#fffdf9] border-2 border-[#d9d2c2] hover:border-[#4a70a9] rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 shadow-[0_16px_32px_-20px_rgba(27,48,77,0.18)] hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#f2c14e]/20 border-2 border-[#f2c14e]/40 flex items-center justify-center text-[#d97706] mb-6 shadow-xs">
                <UserCheck className="w-6 h-6" />
              </div>

              <h3 className="font-display text-2xl font-bold text-[#14233a] mb-2.5">
                Les Privat Intensif (1-on-1)
              </h3>
              <p className="text-sm text-[#50647a] mb-6 leading-relaxed">
                Cocok untuk orang tua yang ingin pendampingan tulus dan terarah bagi anak. Didampingi tentor sabar dengan laporan harian setiap sesi.
              </p>

              <dl className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-2.5 text-xs sm:text-sm pt-4 border-t-2 border-[#e6dfd1]">
                <dt className="text-[#627894] font-bold">Untuk</dt>
                <dd className="text-[#14233a] font-semibold">Anak TK, SD, SMP & Remaja</dd>

                <dt className="text-[#627894] font-bold">Program</dt>
                <dd className="text-[#2b3a4a]">Calistung, Ngaji/Iqro, Bimbel, Bikin Web</dd>

                <dt className="text-[#627894] font-bold">Pemantauan</dt>
                <dd className="text-[#2b3a4a]">Catatan harian tentor di portal orang tua</dd>
              </dl>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-[#e6dfd1]">
              <a
                href="/course/config"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[#d9d2c2] bg-[#fffdf9] hover:border-[#4a70a9] text-[#2e4b7a] text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs"
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
