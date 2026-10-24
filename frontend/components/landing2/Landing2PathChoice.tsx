import Link from "next/link";
import { ArrowRight, BookOpen, Laptop, Home, MapPin } from "lucide-react";

export default function Landing2PathChoice() {
  return (
    <section id="pilihan-belajar" className="py-20">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#14233a]">
            3 Jalur Belajar dalam 1 Akun Siswa
          </h2>
          <p className="text-sm sm:text-base text-[#50647a] mt-3 leading-relaxed">
            Pilih cara belajar yang paling pas hari ini: mandiri lewat modul online, bimbingan materi &amp; proyek bareng tentor, atau les privat tatap muka di rumah.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jalur 1: Belajar Mandiri */}
          <article className="bg-[#fffdf9] border-2 border-[#d9d2c2] hover:border-[#4a70a9] rounded-3xl p-7 flex flex-col justify-between transition-all duration-200 shadow-[0_12px_28px_-18px_rgba(27,48,77,0.16)]">
            <div>
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#eaf0f8] border border-[#b8cde4] flex items-center justify-center text-[#2e4b7a]">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="rounded-full bg-[#eaf0f8] px-3 py-1 text-xs font-bold text-[#224477]">
                  Online · Fleksibel
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold text-[#14233a] mb-2.5">
                Belajar Mandiri
              </h3>
              <p className="text-sm text-[#50647a] mb-6 leading-relaxed">
                Baca modul &amp; artikel interaktif kapan saja sesuai ritme sendiri. Tandai lesson selesai dan simpan progres di akun Siswa.
              </p>

              <dl className="grid grid-cols-[92px_1fr] gap-x-3 gap-y-2.5 text-xs sm:text-sm pt-4 border-t border-[#e6dfd1]">
                <dt className="text-[#50647a] font-bold">Cocok untuk</dt>
                <dd className="text-[#14233a] font-semibold">Pelajar, mahasiswa &amp; umum</dd>

                <dt className="text-[#50647a] font-bold">Format</dt>
                <dd className="text-[#2b3a4a]">Modul teks &amp; latihan bertahap</dd>

                <dt className="text-[#50647a] font-bold">Biaya</dt>
                <dd className="text-[#15803d] font-bold">Banyak materi gratis</dd>
              </dl>
            </div>

            <div className="mt-7 pt-5 border-t border-[#e6dfd1]">
              <Link
                href="/materi"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2e4b7a] hover:bg-[#22395e] text-white text-xs sm:text-sm font-bold transition-colors"
              >
                <span>Mulai Belajar Mandiri</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </article>

          {/* Jalur 2: Kelas Bimbingan */}
          <article className="bg-[#fffdf9] border-2 border-[#4a70a9] rounded-3xl p-7 flex flex-col justify-between transition-all duration-200 shadow-[0_16px_32px_-18px_rgba(46,75,122,0.22)]">
            <div>
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#2e4b7a] flex items-center justify-center text-[#f2c14e]">
                  <Laptop className="w-6 h-6" />
                </div>
                <span className="rounded-full bg-[#2e4b7a] px-3 py-1 text-xs font-bold text-white">
                  Privat 1-on-1 / Grup Kecil
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold text-[#14233a] mb-2.5">
                Kelas Bimbingan
              </h3>
              <p className="text-sm text-[#50647a] mb-6 leading-relaxed">
                Bimbingan materi spesifik atau pembuatan proyek nyata (Web, Desain, Aplikasi) didampingi mentor. Bisa sendiri atau patungan grup kecil.
              </p>

              <dl className="grid grid-cols-[92px_1fr] gap-x-3 gap-y-2.5 text-xs sm:text-sm pt-4 border-t border-[#e6dfd1]">
                <dt className="text-[#50647a] font-bold">Pilihan Kelas</dt>
                <dd className="text-[#14233a] font-semibold">1 Orang (Privat) atau 2–3+ Orang (Grup Kecil)</dd>

                <dt className="text-[#50647a] font-bold">Topik</dt>
                <dd className="text-[#2b3a4a]">Web Dev, UI/UX, Python, Komputer &amp; Proyek</dd>

                <dt className="text-[#50647a] font-bold">Hemat Grup</dt>
                <dd className="text-[#15803d] font-bold">Diskon 20% (2 org) s.d. 35% (3+ org)</dd>
              </dl>
            </div>

            <div className="mt-7 pt-5 border-t border-[#e6dfd1]">
              <Link
                href="/course/materi"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#4a70a9] hover:bg-[#385d91] text-white text-xs sm:text-sm font-bold transition-colors"
              >
                <span>Pilih Materi &amp; Proyek</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </article>

          {/* Jalur 3: Les Privat (Ke Rumah) */}
          <article className="bg-[#fffdf9] border-2 border-[#d9d2c2] hover:border-[#4a70a9] rounded-3xl p-7 flex flex-col justify-between transition-all duration-200 shadow-[0_12px_28px_-18px_rgba(27,48,77,0.16)]">
            <div>
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#92400e]">
                  <Home className="w-6 h-6" />
                </div>
                <span className="rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-bold text-[#92400e]">
                  Tentor Datang ke Rumah
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold text-[#14233a] mb-2.5">
                Les Privat
              </h3>
              <p className="text-sm text-[#50647a] mb-6 leading-relaxed">
                Pendampingan tatap muka di rumah siswa untuk anak TK, SD, dan SMP. Dilengkapi Laporan Harian &amp; Rapor Perkembangan di aplikasi.
              </p>

              <dl className="grid grid-cols-[92px_1fr] gap-x-3 gap-y-2.5 text-xs sm:text-sm pt-4 border-t border-[#e6dfd1]">
                <dt className="text-[#50647a] font-bold">Cocok untuk</dt>
                <dd className="text-[#14233a] font-semibold">Anak TK, SD &amp; SMP</dd>

                <dt className="text-[#50647a] font-bold">Program</dt>
                <dd className="text-[#2b3a4a]">Calistung, Ngaji/Iqro &amp; Mapel Sekolah</dd>

                <dt className="text-[#50647a] font-bold">Pemantauan</dt>
                <dd className="text-[#2b3a4a]">Laporan di aplikasi + Direct Chat WA</dd>
              </dl>
            </div>

            <div className="mt-7 pt-5 border-t border-[#e6dfd1] flex flex-col gap-2">
              <Link
                href="/course/program"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-[#2e4b7a] bg-white hover:bg-[#eaf0f8] text-[#2e4b7a] text-xs sm:text-sm font-bold transition-colors"
              >
                <span>Susun Jadwal Les Privat</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cek-rute"
                className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-[#50647a] hover:text-[#14233a]"
              >
                <MapPin className="w-3.5 h-3.5 text-[#2e4b7a]" />
                <span>Cek Jarak Rute &amp; Estimasi Biaya ke Rumah</span>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
