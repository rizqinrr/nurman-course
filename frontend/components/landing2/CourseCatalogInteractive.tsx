"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Code2,
  Monitor,
  Calculator,
  Compass,
  Layout,
} from "lucide-react";

interface CourseItem {
  id: string;
  tag: string;
  category: "all" | "web" | "komputer" | "calistung" | "ngaji";
  title: string;
  desc: string;
  lessons: string;
  duration: string;
  isFree: boolean;
  color: string;
}

const COURSES: CourseItem[] = [
  {
    id: "1",
    tag: "WEB",
    category: "web",
    title: "Bikin Website Pertama dari Nol",
    desc: "Praktik langsung membuat halaman profil dan toko kecil tanpa rumus rumit.",
    lessons: "16 materi",
    duration: "95 menit",
    isFree: true,
    color: "#4a70a9",
  },
  {
    id: "2",
    tag: "CSS",
    category: "web",
    title: "Tata Letak & Desain Web Rapi",
    desc: "Mendesain website agar tampil rapi di layar ponsel, tablet, dan laptop.",
    lessons: "14 materi",
    duration: "88 menit",
    isFree: true,
    color: "#2e4b7a",
  },
  {
    id: "3",
    tag: "APP",
    category: "web",
    title: "Bikin Aplikasi Web Interaktif",
    desc: "Menambah keranjang belanja, formulir order WhatsApp, dan kalkulator harga.",
    lessons: "18 materi",
    duration: "120 menit",
    isFree: false,
    color: "#3d6094",
  },
  {
    id: "4",
    tag: "PC",
    category: "komputer",
    title: "Komputer Dasar & Internet Sehat",
    desc: "Ketik 10 jari, manajemen file folder, pengolah dokumen, dan browsing aman.",
    lessons: "12 materi",
    duration: "75 menit",
    isFree: true,
    color: "#1e3a5f",
  },
  {
    id: "5",
    tag: "BACA",
    category: "calistung",
    title: "Calistung Ceria (Membaca & Tulis)",
    desc: "Metode bertahap suku kata yang menyenangkan dan mudah dipahami anak.",
    lessons: "20 materi",
    duration: "Sesuai ritme",
    isFree: true,
    color: "#d97706",
  },
  {
    id: "6",
    tag: "QURAN",
    category: "ngaji",
    title: "Iqro & Tajwid Dasar",
    desc: "Mengenal makharijul huruf, tajwid dasar, dan adab membaca Al-Qur'an.",
    lessons: "24 materi",
    duration: "Bertahap",
    isFree: true,
    color: "#059669",
  },
];

const PATH_STEPS = [
  { title: "Dasar Komputer & Web", state: "done" },
  { title: "Bikin Halaman Pertama", state: "done" },
  { title: "Desain & Tata Letak", state: "active" },
  { title: "Interaksi & Form WA", state: "next" },
  { title: "Website Siap Online", state: "next" },
];

export default function CourseCatalogInteractive() {
  const [activeFilter, setActiveFilter] = useState<CourseItem["category"]>("all");
  const [activeStepIndex, setActiveStepIndex] = useState(2);

  const filteredCourses =
    activeFilter === "all"
      ? COURSES
      : COURSES.filter((c) => c.category === activeFilter);

  return (
    <section id="kelas" className="py-20 bg-[#f2efe7]/50 border-y-2 border-[#d9d2c2]">
      <div className="max-w-[1140px] mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4a70a9]/10 border-2 border-[#4a70a9]/20 font-mono text-xs font-bold text-[#2e4b7a] mb-2 shadow-xs">
              <BookOpen className="w-3.5 h-3.5 text-[#4a70a9]" /> Modul Belajar Mandiri
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#14233a]">
              Kelas Mandiri & Praktik Langsung
            </h2>
            <p className="text-[#50647a] text-sm sm:text-base mt-1 max-w-xl">
              Pilih materi bacaan terstruktur dengan progres otomatis. Mulai gratis kapan saja.
            </p>
          </div>

          <Link
            href="/materi"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#4a70a9] hover:text-[#14233a] transition-colors"
          >
            Lihat semua materi <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter Chips with Icons */}
        <div className="flex flex-wrap gap-2.5 mb-8" role="group" aria-label="Filter kategori">
          {[
            { id: "all", label: "Semua Topik", icon: Layout },
            { id: "web", label: "Bikin Web & App", icon: Code2 },
            { id: "komputer", label: "Komputer Dasar", icon: Monitor },
            { id: "calistung", label: "Calistung Anak", icon: Calculator },
            { id: "ngaji", label: "Ngaji & Iqro", icon: BookOpen },
          ].map((chip) => {
            const isActive = activeFilter === chip.id;
            const Icon = chip.icon;
            return (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id as CourseItem["category"])}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#4a70a9] text-white shadow-xs"
                    : "bg-[#fffdf9] text-[#50647a] border-2 border-[#d9d2c2] hover:border-[#4a70a9] hover:text-[#14233a]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#4a70a9]"}`} />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((c) => (
            <div
              key={c.id}
              className="group bg-[#fffdf9] border-2 border-[#d9d2c2] hover:border-[#4a70a9] rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_16px_32px_-18px_rgba(27,48,77,0.18)] hover:-translate-y-1 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xs text-white shadow-xs transition-transform group-hover:scale-105"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.tag}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      c.isFree
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {c.isFree ? "Gratis Dibaca" : "Akses Khusus"}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-[#14233a] group-hover:text-[#4a70a9] transition-colors mb-2">
                  {c.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#50647a] leading-relaxed mb-6">
                  {c.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t-2 border-[#e6dfd1] text-xs text-[#627894] font-medium">
                <span className="flex items-center gap-1.5 font-semibold">
                  <BookOpen className="w-3.5 h-3.5 text-[#4a70a9]" /> {c.lessons}
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-[#4a70a9]" /> {c.duration}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Path Timeline (.path from nCourse.html) */}
        <div className="mt-12 bg-[#fffdf9] border-2 border-[#d9d2c2] rounded-3xl p-6 sm:p-8 shadow-[0_16px_32px_-20px_rgba(27,48,77,0.18)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-mono text-xs uppercase font-bold text-[#4a70a9] tracking-wider">
                Roadmap Pembelajaran
              </span>
              <h3 className="font-display text-xl font-bold text-[#14233a] mt-0.5">
                Contoh Jalur Belajar: Dari Nol Sampai Punya Website Online
              </h3>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f7f5ef] border border-[#d9d2c2] text-xs font-semibold text-[#50647a]">
              <Compass className="w-3.5 h-3.5 text-[#4a70a9]" /> Klik langkah untuk melihat
            </span>
          </div>

          {/* Path nodes with interactive connectors */}
          <div className="flex items-center gap-0 overflow-x-auto py-4 scrollbar-none">
            {PATH_STEPS.map((step, idx) => {
              const isPastOrCurrent = idx <= activeStepIndex;
              const isCurrent = idx === activeStepIndex;

              return (
                <div key={step.title} className="flex items-center flex-none">
                  {/* Step Button */}
                  <button
                    onClick={() => setActiveStepIndex(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isCurrent
                        ? "bg-[#14233a] text-white shadow-md scale-105"
                        : isPastOrCurrent
                        ? "bg-[#4a70a9] text-white"
                        : "bg-[#f7f5ef] text-[#50647a] border-2 border-[#d9d2c2] hover:border-[#4a70a9]"
                    }`}
                  >
                    {idx + 1}. {step.title}
                  </button>

                  {/* Connector line (if not last) */}
                  {idx < PATH_STEPS.length - 1 && (
                    <div className="w-8 sm:w-12 h-1 bg-[#e6dfd1] relative mx-1 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-0 bg-[#4a70a9] transition-all duration-500 origin-left"
                        style={{
                          transform: idx < activeStepIndex ? "scaleX(1)" : "scaleX(0)",
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xs text-[#627894] mt-3 font-medium">
            Jalur belajar memastikan kamu tidak bingung harus mulai dari mana. Setiap materi selesai, sistem akan mengarahkanmu ke langkah berikutnya.
          </p>
        </div>
      </div>
    </section>
  );
}
