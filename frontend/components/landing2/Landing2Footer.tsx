import Link from "next/link";

export default function Landing2Footer() {
  return (
    <footer className="bg-[#1b2f3d] text-[#acbcbf] py-14 text-xs sm:text-sm">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1 */}
          <div className="md:col-span-1">
            <Link href="/landing2" className="flex items-center gap-2.5 font-bold text-base text-white tracking-tight mb-3">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center p-1">
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <rect width="32" height="32" rx="7" fill="#F7F9F8" />
                  <polygon points="16,4.5 28,9.5 16,14.5 4,9.5" fill="#698696" />
                  <path d="M9.5 27V17l13 10V17" fill="none" stroke="#243C4C" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </div>
              <span>Nurman Course</span>
            </Link>
            <p className="text-xs text-[#8c9fa8] leading-relaxed">
              Platform belajar mandiri bikin website & les privat terpercaya dari Cilacap, Jawa Tengah.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
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
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Les Privat
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#les" className="hover:text-white transition-colors">Calistung Ceria (TK/SD)</a></li>
              <li><a href="#les" className="hover:text-white transition-colors">Ngaji, Iqro & Al-Qur'an</a></li>
              <li><a href="#les" className="hover:text-white transition-colors">Bimbel Mapel SD & SMP</a></li>
              <li><a href="/course/config" className="hover:text-white transition-colors">Simulasi Biaya & Jadwal</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Kontak & Lokasi
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span>Cilacap, Jawa Tengah</span></li>
              <li><span>Tatap muka & Kelas Online</span></li>
              <li><a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="hover:text-white text-emerald-400 font-semibold transition-colors">WhatsApp Customer Care</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#788f9a]">
          <p>© 2026 Nurman Course. Semua hak dilindungi.</p>
          <div className="flex gap-4">
            <Link href="/landing" className="hover:text-white transition-colors">Versi Landing 1</Link>
            <Link href="/landing2" className="text-white font-medium">Landing 2 (Eksperimen)</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
