"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, CircleAlert, LibraryBig } from "lucide-react";
import type { LibraryCourseDto } from "@nurman-course/shared";
import ContentShell from "@/components/content/ContentShell";
import { AccessBadge } from "@/components/content/CourseCard";
import { getLibrary } from "@/lib/content-api";

export default function LibraryPage() {
  const [courses, setCourses] = useState<LibraryCourseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getLibrary({ limit: 100 }).then((result) => {
      if (active) setCourses(result.data);
    }).catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : "Koleksi belum dapat dimuat.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return <ContentShell><main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8"><header className="border-b border-[#d8d0c3] pb-8"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6c746b]">Ruang belajar</p><h1 className="mt-3 font-playfair text-4xl tracking-[-0.03em] text-[#17283e] sm:text-5xl">Koleksi saya</h1><p className="mt-4 max-w-2xl text-base leading-7 text-[#66716b]">Kelas gratis dan kelas yang sudah punya akses, tersusun di satu tempat. Progress hanya mencatat bacaan, bukan hak akses.</p></header><div className="mt-10">{loading ? <div className="space-y-5" aria-busy="true">{[1, 2].map((item) => <div key={item} className="h-36 animate-pulse rounded-lg bg-[#e7e1d8]" />)}</div> : error ? <div role="alert" className="border border-red-200 bg-red-50 p-5 text-sm text-red-800"><CircleAlert className="mb-3" size={22} />{error}</div> : courses.length === 0 ? <div className="py-16 text-center"><LibraryBig className="mx-auto text-[#8090a2]" size={32} /><h2 className="mt-4 font-playfair text-2xl text-[#17283e]">Koleksimu masih kosong</h2><p className="mt-2 text-sm text-[#66716b]">Mulai dari materi publik atau pilih kelas gratis.</p><Link href="/materi" className="mt-5 inline-flex items-center gap-2 font-bold text-[#294d7e]">Jelajahi materi <ArrowRight size={16} /></Link></div> : <div className="grid gap-5 md:grid-cols-2">{courses.map((course) => <LibraryCard key={course.slug} course={course} />)}</div>}</div></main></ContentShell>;
}

function LibraryCard({ course }: { course: LibraryCourseDto }) { return <article className="flex flex-col justify-between border border-[#d8d0c3] bg-white/55 p-5 shadow-sm"><div><div className="flex items-center justify-between gap-3"><AccessBadge access={course.accessTier === "paid" ? "purchase" : "login"} /><span className="text-xs font-semibold text-[#66716b]">{course.progress.percentage}% selesai</span></div><h2 className="mt-5 font-playfair text-2xl text-[#17283e]">{course.title}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-[#66716b]">{course.description}</p></div><div className="mt-6"><div className="h-2 overflow-hidden rounded-full bg-[#dce3eb]" role="progressbar" aria-label={`Progress ${course.title}`} aria-valuenow={course.progress.percentage} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-[#4a70a9]" style={{ width: `${course.progress.percentage}%` }} /></div><div className="mt-3 flex items-center justify-between text-xs font-semibold text-[#66716b]"><span className="inline-flex items-center gap-1.5"><BookOpen size={14} />{course.progress.completedLessons}/{course.progress.totalLessons} lesson</span><Link href={`/kelas/${encodeURIComponent(course.slug)}`} className="inline-flex items-center gap-1 font-bold text-[#294d7e]">Buka kelas <ArrowRight size={14} /></Link></div></div></article>; }
