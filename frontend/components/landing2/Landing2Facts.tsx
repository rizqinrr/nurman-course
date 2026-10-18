export default function Landing2Facts() {
  return (
    <section className="border-y border-[#d3dddf] bg-white" aria-label="Fakta singkat">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#d3dddf]">
          <div className="py-6 sm:py-8 pr-4">
            <b className="block text-2xl sm:text-3xl font-extrabold text-[#243c4c] tracking-tight">
              12
            </b>
            <span className="text-xs sm:text-sm text-[#5c7787] mt-0.5 block">
              kelas & modul mandiri
            </span>
          </div>

          <div className="py-6 sm:py-8 px-0 sm:px-4 md:pl-6">
            <b className="block text-2xl sm:text-3xl font-extrabold text-[#243c4c] tracking-tight">
              180+
            </b>
            <span className="text-xs sm:text-sm text-[#5c7787] mt-0.5 block">
              materi bacaan siap praktik
            </span>
          </div>

          <div className="py-6 sm:py-8 pr-4 md:pl-6">
            <b className="block text-2xl sm:text-3xl font-extrabold text-[#243c4c] tracking-tight">
              4
            </b>
            <span className="text-xs sm:text-sm text-[#5c7787] mt-0.5 block">
              program les privat pilihan
            </span>
          </div>

          <div className="py-6 sm:py-8 px-0 sm:px-4 md:pl-6">
            <b className="block text-2xl sm:text-3xl font-extrabold text-[#243c4c] tracking-tight">
              Cilacap
            </b>
            <span className="text-xs sm:text-sm text-[#5c7787] mt-0.5 block">
              tatap muka & kelas online
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
