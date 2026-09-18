"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, LockKeyhole } from "lucide-react";
import type { CatalogCourseDetailDto, CatalogLessonOutlineDto } from "@nurman-course/shared";
import ContentShell from "@/components/content/ContentShell";
import { AccessBadge } from "@/components/content/CourseCard";
import { formatCoursePrice, getCourseDetail } from "@/lib/content-api";

export default function CourseDetail({ slug }: { slug: string }) {
  const [course, setCourse] = useState<CatalogCourseDetailDto | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    let active = true;
    getCourseDetail(slug)
      .then((response) => { if (active) { setCourse(response.data); setState("ready"); } })
      .catch(() => { if (active) setState("missing"); });
    return () => { active = false; };
  }, [slug]);

  if (state === "loading") return <ContentShell><main className="mx-auto max-w-5xl px-4 py-16" aria-busy="true"><div className="h-6 w-32 animate-pulse rounded bg-[#dce3eb]" /><div className="mt-10 h-14 w-3/4 animate-pulse rounded bg-[#e4ded4]" /><div className="mt-6 h-4 max-w-xl animate-pulse rounded bg-[#ebe6de]" /></main></ContentShell>;
  if (!course) return <ContentShell><main className="mx-auto max-w-3xl px-4 py-20 text-center"><h1 className="font-playfair text-4xl text-[#17283e]">Kelas tidak ditemukan</h1><p className="mt-3 text-sm text-[#66716b]">Kelas ini belum dipublikasikan atau alamatnya sudah berubah.</p><Link href="/materi" className="mt-6 inline-flex items-center gap-2 font-bold text-[#294d7e]"><ArrowLeft size={16} /> Kembali ke materi</Link></main></ContentShell>;

  return <ContentShell><main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8"><Link href="/materi" className="inline-flex items-center gap-2 text-sm font-bold text-[#294d7e]"><ArrowLeft size={16} /> Semua materi</Link><header className="mt-10 max-w-3xl border-b border-[#d8d0c3] pb-10"><div className="flex flex-wrap items-center gap-3"><AccessBadge access={course.accessTier === "paid" ? "purchase" : "login"} />{course.category && <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#6c746b]">{course.category}</span>}</div><h1 className="mt-5 font-playfair text-4xl leading-tight tracking-[-0.03em] text-[#17283e] sm:text-6xl">{course.title}</h1><p className="mt-5 text-base leading-7 text-[#55605a]">{course.description}</p><div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-[#66716b]"><span className="inline-flex items-center gap-2"><BookOpen size={16} />{course.lessonCount} lesson</span>{course.price !== null && <span className="text-[#294d7e]">{formatCoursePrice(course.price)}</span>}</div></header><section className="mt-10"><h2 className="font-playfair text-3xl text-[#17283e]">Silabus kelas</h2><p className="mt-2 text-sm text-[#66716b]">Pilih lesson untuk membaca atau melihat akses yang dibutuhkan.</p><div className="mt-8 space-y-8">{course.sections.map((section) => <section key={`${section.order}-${section.title}`}><div className="mb-3 border-b border-[#d8d0c3] pb-3"><h3 className="text-lg font-bold text-[#294d7e]">{section.title}</h3>{section.summary && <p className="mt-1 text-sm text-[#66716b]">{section.summary}</p>}</div><ol className="divide-y divide-[#e6e0d7]">{section.lessons.map((lesson) => <LessonRow key={lesson.slug} lesson={lesson} />)}</ol></section>)}</div></section></main></ContentShell>;
}

function LessonRow({ lesson }: { lesson: CatalogLessonOutlineDto }) {
  const label = lesson.accessRequirement === "public" ? "Baca" : lesson.accessRequirement === "login" ? "Login gratis" : "Perlu akses";
  return <li><Link href={`/materi/${encodeURIComponent(lesson.slug)}`} className="flex min-h-16 items-center justify-between gap-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a70a9]"><span className="flex min-w-0 items-center gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e9eef5] text-xs font-bold text-[#294d7e]">{lesson.order + 1}</span><span className="min-w-0"><strong className="block truncate text-sm text-[#1a1a18]">{lesson.title}</strong>{lesson.summary && <span className="mt-1 block truncate text-xs text-[#6c746b]">{lesson.summary}</span>}</span></span><span className="flex shrink-0 items-center gap-2 text-xs font-bold text-[#294d7e]">{lesson.accessRequirement !== "public" && <LockKeyhole size={15} aria-hidden="true" />}{label}<ArrowRight size={15} aria-hidden="true" /></span></Link></li>;
}
