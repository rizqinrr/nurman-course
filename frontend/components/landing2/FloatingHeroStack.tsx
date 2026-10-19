"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle2, Clock, Sparkles } from "lucide-react";

export default function FloatingHeroStack() {
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(62);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto animate progress after 1.2s
  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(100);
    }, 1200);

    const t2 = setTimeout(() => {
      setIsCompleted(true);
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // 2.5D Tilt on Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const handleToggleDone = () => {
    if (!isCompleted) {
      setProgress(100);
      setIsCompleted(true);
    } else {
      setProgress(62);
      setIsCompleted(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[420px] sm:h-[440px] flex items-center justify-center select-none"
      style={{ perspective: "1000px" }}
    >
      {/* Background Soft Glow */}
      <div className="absolute w-72 h-72 rounded-full bg-[#4a70a9]/15 blur-3xl -z-10 pointer-events-none" />

      {/* CARD 1: Lesson Card (.m1) */}
      <div
        className="absolute top-4 left-2 sm:left-4 w-[88%] sm:w-[82%] bg-[#fffdf9] border-2 border-[#d9d2c2] rounded-[1.75rem] p-6 shadow-[0_20px_40px_-18px_rgba(27,48,77,0.2)] transition-all duration-300 ease-out z-10 cursor-pointer"
        style={{
          transform: `rotate(-1.8deg) translate3d(${mouseOffset.x * 20}px, ${mouseOffset.y * 15}px, 0px)`,
        }}
        onClick={handleToggleDone}
      >
        <div className="flex items-center justify-between text-xs text-[#627894] mb-2 font-mono font-bold">
          <span>MATERI / BIKIN WEB</span>
          <span className="flex items-center gap-1 text-[#4a70a9]">
            <Sparkles className="w-3.5 h-3.5" /> Praktik langsung
          </span>
        </div>

        <h3 className="font-display text-lg sm:text-xl font-bold text-[#14233a] mb-3">
          Membuat Halaman Profil & Toko
        </h3>

        <ul className="list-none m-0 mb-4 pl-3 border-l-2 border-[#d9d2c2] text-xs text-[#50647a] flex flex-col gap-1.5 font-medium">
          <li>1. Menyiapkan struktur HTML dasar</li>
          <li className="text-[#14233a] font-bold pl-2 -ml-3.5 border-l-2 border-[#4a70a9]">
            2. Menata tata letak & gambar produk
          </li>
          <li>3. Menghubungkan tombol pesan WhatsApp</li>
        </ul>

        {/* Animated Progress Bar */}
        <div className="h-2.5 rounded-full bg-[#e6dfd1] overflow-hidden mb-3">
          <div
            className="h-full bg-[#4a70a9] transition-all duration-1000 cubic-bezier(0.3, 0.7, 0.2, 1)"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-[#627894] flex items-center gap-1 font-semibold">
            <Clock className="w-3.5 h-3.5" /> 8 menit baca
          </span>
          <button
            type="button"
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shadow-[0_3px_0_#2b4875] ${
              isCompleted
                ? "bg-[#14233a] text-white"
                : "bg-[#4a70a9] text-white hover:bg-[#3d6094]"
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Selesai</span>
              </>
            ) : (
              <span>Tandai selesai</span>
            )}
          </button>
        </div>
      </div>

      {/* CARD 2: Daily Report Card (.m2) */}
      <div
        className="absolute bottom-4 right-2 sm:right-4 w-[85%] sm:w-[78%] bg-[#fffdf9] border-2 border-[#d9d2c2] rounded-[1.75rem] p-6 shadow-[0_24px_50px_-20px_rgba(27,48,77,0.22)] transition-all duration-300 ease-out z-20"
        style={{
          transform: `rotate(1.5deg) translate3d(${mouseOffset.x * -24}px, ${mouseOffset.y * -18}px, 20px)`,
        }}
      >
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="font-display font-bold text-sm sm:text-base text-[#14233a]">
            Calistung & Ngaji, sesi hari ini
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
            ✓ Selesai
          </span>
        </div>
        <div className="text-xs text-[#627894] mb-3 font-medium">
          16.00 – 17.00 WIB • Tentor Dina • Tatap Muka
        </div>

        <hr className="border-0 border-t-2 border-[#e6dfd1] my-2.5" />

        <div className="text-[11px] font-mono font-bold text-[#2e4b7a] uppercase tracking-wide mb-1">
          Laporan Harian untuk Wali Murid:
        </div>
        <p className="text-xs text-[#2b3a4a] leading-relaxed bg-[#f7f5ef] p-3 rounded-xl border border-[#d9d2c2]">
          “Ananda sudah lancar membaca dua suku kata dan melafalkan makhraj huruf dengan tartil. Besok lanjut latihan berhitung penjumlahan santai.”
        </p>
      </div>
    </div>
  );
}
