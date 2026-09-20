"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, CircleAlert, LibraryBig, LogOut, Sparkles } from "lucide-react";
import type { LibraryCourseDto } from "@nurman-course/shared";
import ContentShell from "@/components/content/ContentShell";
import { AccessBadge } from "@/components/content/CourseCard";
import { getLibrary } from "@/lib/content-api";
import { apiFetch } from "@/lib/api";
import { useLogout } from "@/lib/useLogout";

interface MemberProfile {
  name: string;
  email?: string | null;
  phone?: string | null;
}

export default function LibraryPage() {
  const { askLogout, logoutDialog } = useLogout({ message: "Kamu akan keluar dari ruang belajar." });
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [courses, setCourses] = useState<LibraryCourseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      apiFetch<{ user: MemberProfile }>("/api/users/me"),
      getLibrary({ limit: 100 }),
    ]).then(([profileResult, libraryResult]) => {
      if (active) {
        setProfile(profileResult.user);
        setCourses(libraryResult.data);
      }
    }).catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : "Koleksi belum dapat dimuat.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const completedCourses = courses.filter((course) => course.progress.percentage >= 100).length;
  const averageProgress = courses.length > 0 ? Math.round(courses.reduce((total, course) => total + course.progress.percentage, 0) / courses.length) : 0;
  const nextCourse = courses.find((course) => course.progress.percentage < 100) || courses[0];

  return <ContentShell><main className="mx-auto w-full max-w-[90rem] px-4 py-7 sm:px-6 lg:px-10 lg:py-10">
    <header className="grid gap-6 border-b border-[#c7d4e2] pb-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
      <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6a7f98]">Profil member</p><h1 className="mt-2 font-display text-3xl font-black tracking-[-0.05em] text-[#14233a] sm:text-4xl">Lanjutkan belajar{profile?.name ? `, ${profile.name}` : "mu"}.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#657991]">Overview progres dan jalur cepat menuju lesson yang ingin kamu selesaikan berikutnya.</p></div>
      <div className="rounded-xl border border-[#c7d4e2] bg-[#14233a] p-4 text-white"><div className="flex items-center gap-2 text-[#f2c14e]"><Sparkles size={16} aria-hidden="true" /><span className="text-xs font-bold uppercase tracking-[0.12em]">Ritme hari ini</span></div><p className="mt-3 text-sm font-bold leading-5">Satu lesson kecil tetap berarti.</p><div className="mt-4 flex items-center justify-between gap-3"><Link href="/materi" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#dbe7f3] hover:text-white">Jelajahi katalog <ArrowRight size={14} aria-hidden="true" /></Link><button type="button" onClick={askLogout} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f1c3bd] hover:text-white"><LogOut size={13} aria-hidden="true" /> Keluar</button></div></div>
    </header>
    <div className="mt-6 grid grid-cols-3 divide-x divide-[#dce5ee] rounded-xl border border-[#c7d4e2] bg-white"><div className="p-4"><span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#71849a]">Kelas aktif</span><strong className="mt-1 block text-2xl font-black text-[#14233a]">{courses.length}</strong></div><div className="p-4"><span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#71849a]">Rata-rata progres</span><strong className="mt-1 block text-2xl font-black text-[#4a70a9]">{averageProgress}%</strong></div><div className="p-4"><span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#71849a]">Selesai</span><strong className="mt-1 block text-2xl font-black text-[#2c8150]">{completedCourses}</strong></div></div>
    <div className="mt-8">{loading ? <div className="grid gap-4 md:grid-cols-2" aria-busy="true" aria-label="Memuat koleksi"><div className="h-56 animate-pulse rounded-xl bg-[#dce5ee]" /><div className="h-56 animate-pulse rounded-xl bg-[#dce5ee]" /></div> : error ? <div role="alert" className="flex items-start gap-3 rounded-lg border border-[#e6b5b5] bg-[#fff5f5] p-5 text-sm font-semibold text-[#8d3d3d]"><CircleAlert size={20} aria-hidden="true" />{error}</div> : courses.length === 0 ? <div className="border border-dashed border-[#b7c8d9] px-5 py-16 text-center"><LibraryBig className="mx-auto text-[#8090a2]" size={32} /><h2 className="mt-4 font-display text-2xl font-black text-[#14233a]">Koleksimu masih kosong</h2><p className="mt-2 text-sm text-[#657991]">Mulai dari materi publik atau pilih kelas gratis.</p><Link href="/materi" className="mt-5 inline-flex items-center gap-2 font-bold text-[#284970]">Jelajahi materi <ArrowRight size={16} aria-hidden="true" /></Link></div> : <><section aria-labelledby="continue-title" className="mb-6 rounded-xl border border-[#284970] bg-[#e7eff7] p-5 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#4a70a9]">Berikutnya</p><h2 id="continue-title" className="mt-1 font-display text-2xl font-black tracking-[-0.04em] text-[#14233a]">{nextCourse?.title}</h2><p className="mt-1 text-sm text-[#536781]">{nextCourse?.progress.percentage || 0}% selesai · {nextCourse?.progress.completedLessons || 0} dari {nextCourse?.progress.totalLessons || 0} lesson</p></div><Link href={nextCourse ? `/kelas/${encodeURIComponent(nextCourse.slug)}` : "/materi"} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#4a70a9] px-4 text-sm font-bold text-white transition-colors hover:bg-[#385d91] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a70a9] focus-visible:ring-offset-2">Lanjut belajar <ArrowRight size={16} aria-hidden="true" /></Link></div></section><div className="grid gap-4 md:grid-cols-2">{courses.map((course) => <LibraryCard key={course.slug} course={course} />)}</div></>}</div>
  </main>{logoutDialog}</ContentShell>;
}

function LibraryCard({ course }: { course: LibraryCourseDto }) {
  return <article className="group flex flex-col justify-between rounded-xl border border-[#c7d4e2] bg-white p-5 transition-colors hover:border-[#8da9c4] sm:p-6"><div><div className="flex items-center justify-between gap-3"><AccessBadge access={course.accessTier === "paid" ? "purchase" : "login"} /><span className="text-xs font-bold tabular-nums text-[#657991]">{course.progress.percentage}% selesai</span></div><h2 className="mt-5 font-display text-2xl font-black tracking-[-0.04em] text-[#14233a]">{course.title}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-[#657991]">{course.description}</p></div><div className="mt-7"><div className="h-2 overflow-hidden rounded-full bg-[#e1e9f0]" role="progressbar" aria-label={`Progress ${course.title}`} aria-valuenow={course.progress.percentage} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-[#4a70a9] transition-[width]" style={{ width: `${course.progress.percentage}%` }} /></div><div className="mt-3 flex items-center justify-between gap-3 text-xs font-bold text-[#657991]"><span className="inline-flex items-center gap-1.5"><BookOpen size={14} aria-hidden="true" />{course.progress.completedLessons}/{course.progress.totalLessons} lesson</span><Link href={`/kelas/${encodeURIComponent(course.slug)}`} className="inline-flex items-center gap-1 text-[#284970] hover:text-[#4a70a9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a70a9]">Buka kelas <ArrowRight size={14} aria-hidden="true" /></Link></div></div></article>;
}
