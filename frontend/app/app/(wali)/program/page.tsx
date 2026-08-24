"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Murid,
  Program,
  Enrollment,
} from "@/data/lms";
import { apiFetch } from "@/lib/api";
import {
  Search,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

interface DbMurid {
  id: string;
  name: string;
  schoolLevel?: string | null;
}

interface DbEnrollment extends Enrollment {
  program: Program;
  murid: Murid;
}

const CATEGORY_FILTERS = [
  { value: "semua", label: "Semua" },
  { value: "materi", label: "Materi" },
  { value: "jenjang", label: "Jenjang" },
  { value: "calistung", label: "Calistung" },
];

const CATEGORY_LABELS: Record<string, string> = {
  materi: "Materi",
  jenjang: "Jenjang",
  calistung: "Calistung",
};

export default function ProgramKatalogPage() {
  const [loading, setLoading] = useState(true);
  const [murids, setMurids] = useState<DbMurid[]>([]);
  const [selectedMuridId, setSelectedMuridId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("semua");

  const [programs, setPrograms] = useState<Program[]>([]);
  const [enrollments, setEnrollments] = useState<DbEnrollment[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const meRes = await apiFetch<{ user: { name: string; murids: DbMurid[] } }>("/api/users/me");
        setMurids(meRes.user.murids || []);
        if (meRes.user.murids?.length > 0) {
          setSelectedMuridId(meRes.user.murids[0].id);
        }

        const [progRes, enrollRes] = await Promise.all([
          apiFetch<{ programs: Program[] }>("/api/programs"),
          apiFetch<{ enrollments: DbEnrollment[] }>("/api/me/enrollments"),
        ]);

        setPrograms(progRes.programs);
        setEnrollments(enrollRes.enrollments);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load catalog programs:", err);
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full flex-grow flex flex-col gap-6 items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#4a70a9] animate-spin"></div>
        <p className="text-sm font-semibold text-gray-600">Memuat katalog program...</p>
      </div>
    );
  }

  const selectedMurid = murids.find((m) => m.id === selectedMuridId);

  const filteredPrograms = programs
    .filter((p) => {
      if (activeCategory !== "semua" && p.category !== activeCategory) return false;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (a.active !== b.active) return a.active ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full flex-grow flex flex-col gap-6 pb-28 font-dm text-app-text-mid">
      {/* Page Header */}
      <header className="flex flex-col gap-1 bg-app-white border border-app-border shadow-sm rounded-2xl p-6">
        <h1 className="text-xl sm:text-2xl font-normal text-app-text tracking-tight font-playfair">
          Program Belajar Anak
        </h1>
        <p className="text-sm text-app-text-muted">
          Pilih program, lihat detail, lalu daftarkan buah hati Anda.
        </p>
      </header>

      {/* Child selector */}
      {murids.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto py-1 bg-app-white border border-app-border p-4 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold text-app-text-muted shrink-0">Siswa:</span>
          <div className="flex gap-2">
            {murids.map((m) => {
              const isSelected = m.id === selectedMuridId;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMuridId(m.id)}
                  className={`px-4 py-1.5 rounded-[6px] text-xs font-semibold transition-all duration-300 active:scale-95 whitespace-nowrap border flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-app-primary text-app-white border-app-primary shadow-sm"
                      : "bg-app-white border-app-border text-app-text-mid hover:bg-app-surface"
                  }`}
                >
                  {m.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tools: search + category filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-app-white border border-app-border p-4 rounded-2xl shadow-sm">
        <div className="relative w-full sm:w-56">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full pl-4 pr-9 py-2.5 text-sm bg-app-white border border-app-border rounded-[6px] focus:outline-none focus:border-app-primary focus:ring-1 focus:ring-app-primary text-app-text appearance-none cursor-pointer"
            aria-label="Filter kategori program"
          >
            {CATEGORY_FILTERS.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.value === "semua" ? "Semua Kategori" : `Kategori: ${cat.label}`}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-3.5 text-app-text-muted" />
        </div>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Cari program belajar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-app-white border border-app-border rounded-[6px] focus:outline-none focus:border-app-primary focus:ring-1 focus:ring-app-primary text-app-text placeholder:text-app-text-muted/60"
          />
          <Search size={16} className="absolute left-3 top-3.5 text-app-text-muted" />
        </div>
      </div>

      {/* Program Grid */}
      {selectedMurid ? (
        filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => {
              const isRegistered = enrollments.some(
                (e) =>
                  e.muridId === selectedMuridId &&
                  e.programId === program.id &&
                  e.status === "active",
              );
              const isComingSoon = !program.active;

              return (
                <Link key={program.id} href={`/app/program/${program.slug}`} className="block h-full">
                  <div
                    className={`p-5 flex flex-col gap-4 h-full transition-all duration-300 rounded-2xl border border-app-border bg-app-white shadow-sm hover:shadow-md ${
                      isComingSoon ? "opacity-80" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 bg-app-primary/10 border border-app-primary/20 text-app-primary rounded-[4px] text-[10px] font-bold uppercase tracking-wide truncate">
                        {CATEGORY_LABELS[program.category] || program.category}
                      </span>
                      <span
                        className={`shrink-0 px-2.5 py-0.5 rounded-[4px] text-[10px] font-bold flex items-center gap-1 ${
                          isRegistered
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                            : isComingSoon
                              ? "bg-amber-50 text-amber-800 border border-amber-100"
                              : "bg-blue-50 text-blue-800 border border-blue-100"
                        }`}
                      >
                        {isRegistered && (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Terdaftar
                          </>
                        )}
                        {!isRegistered && !isComingSoon && "Tersedia"}
                        {isComingSoon && "Coming Soon"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 flex-1">
                      <h2 className="text-base font-bold text-app-text leading-snug">{program.name}</h2>
                      <p className="text-xs sm:text-sm text-app-text-muted line-clamp-2 leading-relaxed">
                        {program.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-app-border/40 pt-3 mt-auto">
                      <div className="text-xs text-app-text-muted">
                        {program.basePrice ? (
                          <>
                            <span>Mulai dari </span>
                            <span className="font-bold text-app-text">
                              Rp {program.basePrice.toLocaleString("id-ID")}/sesi
                            </span>
                          </>
                        ) : (
                          <span className="italic">Harga menyesuaikan</span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-app-primary">
                        {isRegistered ? "Buka Peta Jalan" : "Lihat Detail"}
                        <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-app-white border border-app-border rounded-2xl text-app-text-muted">
            Tidak ada program yang cocok dengan filter pencarian.
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-app-white border border-app-border rounded-2xl text-app-text-muted">
          Tidak ada data anak ditemukan. Hubungi admin untuk mendaftarkan anak Anda.
        </div>
      )}
    </div>
  );
}