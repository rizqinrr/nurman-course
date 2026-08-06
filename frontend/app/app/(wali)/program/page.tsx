"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Murid,
  Program,
  Enrollment
} from "@/data/lms";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { apiFetch } from "@/lib/api";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { 
  Search, 
  BookOpen, 
  MessageSquare,
  Lock,
  ArrowRight
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

export default function ProgramKatalogPage() {
  const [loading, setLoading] = useState(true);
  const [murids, setMurids] = useState<DbMurid[]>([]);
  const [selectedMuridId, setSelectedMuridId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [programs, setPrograms] = useState<Program[]>([]);
  const [enrollments, setEnrollments] = useState<DbEnrollment[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        // Live mode
        const meRes = await apiFetch<{ user: { name: string; murids: DbMurid[] } }>("/api/users/me");
        setMurids(meRes.user.murids || []);
        if (meRes.user.murids?.length > 0) {
          setSelectedMuridId(meRes.user.murids[0].id);
        }

        const [progRes, enrollRes] = await Promise.all([
          apiFetch<{ programs: Program[] }>("/api/programs"),
          apiFetch<{ enrollments: DbEnrollment[] }>("/api/me/enrollments")
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

  const handleRegisterWA = (programName: string) => {
    if (!selectedMurid) return;
    const text = encodeURIComponent(
      `Halo Admin Nurman Course, saya ingin mendaftarkan anak saya *${selectedMurid.name}* (${selectedMurid.schoolLevel || ""}) ke *${programName}*. Mohon informasi jadwal dan ketersediaan tutor. Terima kasih.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  // Filter program
  const filteredPrograms = programs.filter((p) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full flex-grow flex flex-col gap-6">
      
      {/* Page Header */}
      <header className="flex flex-col gap-1 bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm rounded-2xl p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight font-sans">
          Program Belajar Anak
        </h1>
        <p className="text-sm text-gray-600">
          Pilih dan daftar program bimbingan belajar terbaik untuk buah hati Anda.
        </p>
      </header>

      {/* Tools Section: Search Only */}
      <div className="flex justify-end items-center bg-white/30 backdrop-blur-xl border border-white/60 p-4 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Cari program belajar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white/70 border border-white/80 rounded-xl focus:outline-none focus:border-[#4a70a9] focus:ring-1 focus:ring-[#4a70a9] text-gray-900 placeholder:text-gray-400"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Program Grid */}
      {selectedMurid ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => {
            const isRegistered = enrollments.some(e => e.muridId === selectedMuridId && e.programId === program.id && e.status === "active");
              
            const isComingSoon = !program.active;

            return (
              <GlassCard
                key={program.id}
                className={`p-6 flex flex-col gap-4 justify-between h-full transition-all duration-300 hover:scale-[1.02] ${
                  isComingSoon ? "opacity-75" : ""
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-[#4a70a9] rounded-full text-[10px] font-bold uppercase tracking-wide">
                      {program.category}
                    </span>
                    
                    {isRegistered && (
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Terdaftar
                      </span>
                    )}

                    {!isRegistered && !isComingSoon && (
                      <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10px] font-bold">
                        Tersedia
                      </span>
                    )}

                    {isComingSoon && (
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-800 hover:text-[#4a70a9] transition-colors">
                      {program.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-3">
                      {program.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  {/* Meta Biaya / Sesi */}
                  {!isComingSoon && (
                    <div className="py-2 border-y border-gray-200/50 flex justify-between items-center text-xs text-gray-500">
                      {isRegistered ? (
                        <span className="flex items-center gap-1">
                          <BookOpen size={14} />
                          {program.sessionsPerBlock || 12} Sesi / Blok
                        </span>
                      ) : (
                        <>
                          <span>Investasi Sesi:</span>
                          <span className="font-bold text-gray-800">
                            Rp {program.basePrice ? program.basePrice.toLocaleString("id-ID") : "0"} / sesi
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  {isComingSoon && (
                    <div className="py-2 border-y border-gray-200/50 flex justify-center text-xs text-gray-400 italic">
                      Modul dalam persiapan
                    </div>
                  )}

                  {/* Actions */}
                  {isRegistered && (
                    <Link href={`/app/program/${program.slug}`} className="w-full">
                      <Button className="w-full text-xs justify-center py-2.5 shadow-md shadow-[#4a70a9]/20 flex items-center gap-1.5">
                        <span>Buka Peta Jalan Belajar</span>
                        <ArrowRight size={14} />
                      </Button>
                    </Link>
                  )}

                  {!isRegistered && !isComingSoon && (
                    <Button
                      variant="ghost"
                      onClick={() => handleRegisterWA(program.name)}
                      className="w-full text-xs justify-center py-2.5 border border-[#4a70a9]/40 text-[#4a70a9] hover:bg-[#4a70a9]/5 flex items-center gap-1.5"
                    >
                      <span>Daftar via WhatsApp</span>
                      <MessageSquare size={14} />
                    </Button>
                  )}

                  {isComingSoon && (
                    <Button
                      disabled
                      variant="secondary"
                      className="w-full text-xs justify-center py-2.5 opacity-50 cursor-not-allowed flex items-center gap-1.5"
                    >
                      <span>Segera Hadir</span>
                      <Lock size={14} />
                    </Button>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/40 border border-white/60 rounded-2xl text-gray-500">
          Tidak ada data anak ditemukan. Hubungi admin untuk mendaftarkan anak Anda.
        </div>
      )}
    </div>
  );
}
