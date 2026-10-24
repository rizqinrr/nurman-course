import Link from "next/link";

export default function Landing2Footer() {
  return (
    <footer className="bg-[#14233a] text-[#8ea2be] py-16 text-xs sm:text-sm">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1 */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-base text-white tracking-tight mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#2e4b7a] flex items-center justify-center p-1.5 shadow-sm">
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <rect width="32" height="32" rx="7" fill="#2e4b7a" />
                  <polygon points="16,4.5 28,9.5 16,14.5 4,9.5" fill="#f2c14e" />
                  <path d="M25 11.5v5" stroke="#f2c14e" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M9.5 27V17l13 10V17" fill="none" stroke="#fffdf9" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-display font-bold text-lg text-white">n<span className="text-[#f2c14e]">Course</span></span>
            </Link>
            <p className="text-xs text-[#8ea2be] leading-relaxed">
              Platform belajar mandiri bikin website & les privat terpercaya dari Cilacap, Jawa Tengah.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider mb-3">
              Belajar Mandiri
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#kelas" className="hover:text-white transition-colors">Bikin Web & Aplikasi</a></li>
              <li><a href="#kelas" className="hover:text-white transition-colors">Komputer & IT Dasar</a></li>
              <li><a href="#jalur" className="hover:text-white transition-colors">Jalur Belajar Lengkap</a></li>
              <li><Link href="/materi" className="hover:text-white transition-colors">Semua Materi Bacaan</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider mb-3">
              Les Privat
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#les" className="hover:text-white transition-colors">Calistung Ceria (TK/SD)</a></li>
              <li><a href="#les" className="hover:text-white transition-colors">Ngaji, Iqro & Al-Qur&apos;an</a></li>
              <li><a href="#les" className="hover:text-white transition-colors">Bimbel Mapel SD & SMP</a></li>
              <li><a href="/course/config" className="hover:text-white transition-colors">Simulasi Biaya & Jadwal</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider mb-3">
              Kontak & Lokasi
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span>Cilacap, Jawa Tengah</span></li>
              <li><span>Tatap muka & Kelas Online</span></li>
              <li><a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="hover:text-white text-[#f2c14e] font-semibold transition-colors">WhatsApp Customer Care</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#627894]">
          <p>© 2026 nCourse. Semua hak dilindungi.</p>
          <div className="flex gap-4">
            <Link href="/" className="text-white font-medium hover:underline">Beranda</Link>
            <Link href="/materi" className="hover:text-white transition-colors">Belajar Mandiri</Link>
            <Link href="/course/program" className="hover:text-white transition-colors">Les Privat</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
