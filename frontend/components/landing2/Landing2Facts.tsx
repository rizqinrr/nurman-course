export default function Landing2Facts() {
  return (
    <section className="border-y-2 border-[#d9d2c2] bg-[#fffdf9]/60 backdrop-blur-xs" aria-label="Fakta singkat">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x-2 divide-[#d9d2c2]">
          <div className="py-6 sm:py-7 pr-4">
            <b className="font-display block text-3xl sm:text-4xl font-extrabold text-[#14233a] tracking-tight">
              12
            </b>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#627894] mt-1 block">
              kelas & modul mandiri
            </span>
          </div>

          <div className="py-6 sm:py-7 px-0 sm:px-4 md:pl-6">
            <b className="font-display block text-3xl sm:text-4xl font-extrabold text-[#14233a] tracking-tight">
              180+
            </b>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#627894] mt-1 block">
              materi bacaan siap praktik
            </span>
          </div>

          <div className="py-6 sm:py-7 pr-4 md:pl-6">
            <b className="font-display block text-3xl sm:text-4xl font-extrabold text-[#14233a] tracking-tight">
              4
            </b>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#627894] mt-1 block">
              program les privat pilihan
            </span>
          </div>

          <div className="py-6 sm:py-7 px-0 sm:px-4 md:pl-6">
            <b className="font-display block text-3xl sm:text-4xl font-extrabold text-[#14233a] tracking-tight">
              Cilacap
            </b>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#627894] mt-1 block">
              tatap muka & kelas online
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
