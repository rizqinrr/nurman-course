import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import ContentShell from "@/components/content/ContentShell";
import LessonCatalogCard from "@/components/content/LessonCatalogCard";
import { getLessonCatalog } from "@/lib/content-api";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;
const topics = ["Lingkungan coding", "Tools", "HTML", "CSS", "JavaScript", "Web", "Project"];
const levels = ["Pemula", "Dasar", "Project"];

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function getMultipleParams(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function createPageHref(query: string, selectedTopics: string[], level: string, page: number) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  selectedTopics.forEach((topic) => params.append("topik", topic));
  if (level) params.set("level", level);
  if (page > 1) params.set("page", String(page));
  const value = params.toString();
  return value ? `/materi?${value}` : "/materi";
}

export default async function MaterialCatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = getSingleParam(params.q).trim();
  const requestedPage = Number.parseInt(getSingleParam(params.page), 10);
  const selectedTopics = getMultipleParams(params.topik).filter((topic) => topics.includes(topic));
  const requestedLevel = getSingleParam(params.level);
  const level = levels.includes(requestedLevel) ? requestedLevel : "";
  const response = await getLessonCatalog({
    page: Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1,
    limit: PAGE_SIZE,
    search: query || undefined,
    category: selectedTopics,
    level: level || undefined,
  });
  const lessons = response.data ?? [];
  const pagination = response.pagination;
  const totalPages = Math.max(pagination.totalPages, 1);
  const page = Math.min(Math.max(pagination.page, 1), totalPages);
  const hasFilters = Boolean(query || selectedTopics.length > 0 || level);

  return (
    <ContentShell>
      <main>
        <section className="pegboard-hero">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
            <div className="max-w-3xl">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#f9b36c]">Katalog materi</p>
              <h1 className="mt-4 font-display text-5xl font-extrabold leading-[0.94] tracking-[-0.055em] text-[#f5f0e7] sm:text-7xl">Belajar sesuai yang sedang kamu butuhkan.</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#d4e5d7] sm:text-lg">Cari lesson pendek tentang coding, tools, dan HTML. Tidak harus mengikuti urutan—pilih satu kartu, baca, lalu praktik.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/jalur-belajar" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#f0752d] px-5 text-sm font-extrabold text-white shadow-[0_3px_0_#833c21] transition-transform hover:-translate-y-0.5">Bingung mulai dari mana? Ikuti jalur <ArrowRight size={16} /></Link>
                <span className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#78a990] px-4 text-sm font-bold text-[#e5f2e7]"><BookOpen size={16} />{pagination.totalItems} lesson</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
          <div className="flex flex-col gap-3 border-b-2 border-[#cdd9cd] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] text-[#102d2b] sm:text-4xl">Pilih materi</h2>
              <p className="mt-2 text-sm leading-6 text-[#42615b]">Gunakan pencarian kalau kamu sudah tahu topiknya, atau jelajahi semua kartu.</p>
            </div>
            <span className="font-mono text-xs font-bold text-[#55716c]">{pagination.totalItems} hasil</span>
          </div>

          <form action="/materi" method="get" className="mt-6 rounded-2xl border-2 border-[#b7d2c4] bg-[#e0f0e7] p-4 sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Cari materi</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5c8675]" size={18} />
                <input name="q" defaultValue={query} type="search" placeholder="Cari judul, ringkasan, atau topik..." className="min-h-12 w-full rounded-xl border-2 border-[#b7d2c4] bg-[#fffdf8] pl-11 pr-4 text-sm font-semibold text-[#102d2b] outline-none placeholder:text-[#779187] focus:border-[#f0752d] focus:ring-2 focus:ring-[#f0752d]/20" />
              </label>
              <select name="level" defaultValue={level} aria-label="Filter level" className="min-h-12 rounded-xl border-2 border-[#b7d2c4] bg-[#fffdf8] px-3 text-sm font-bold text-[#102d2b] outline-none focus:border-[#f0752d] focus:ring-2 focus:ring-[#f0752d]/20">
                <option value="">Semua level</option>
                {levels.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0e4d45] px-5 text-sm font-extrabold text-white shadow-[0_3px_0_#082e2a] transition-transform hover:-translate-y-0.5"><SlidersHorizontal size={16} />Cari materi</button>
            </div>
            <fieldset className="mt-3 flex flex-wrap items-center gap-2">
              <legend className="sr-only">Pilih topik</legend>
              <span className="mr-1 text-xs font-bold text-[#42615b]">Topik:</span>
              {topics.map((topic) => (
                <label key={topic} className="cursor-pointer">
                  <input type="checkbox" name="topik" value={topic} defaultChecked={selectedTopics.includes(topic)} className="peer sr-only" />
                  <span className="inline-flex rounded-full border-2 border-[#acd0be] bg-[#fffdf8] px-3 py-1.5 text-xs font-extrabold text-[#0e4d45] transition-colors peer-checked:border-[#0e4d45] peer-checked:bg-[#0e4d45] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#f0752d] peer-focus-visible:ring-offset-2">{topic}</span>
                </label>
              ))}
            </fieldset>
            {hasFilters && <Link href="/materi" className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold text-[#0e4d45] underline decoration-[#f0752d] underline-offset-4"><RotateCcw size={13} />Reset filter</Link>}
          </form>

          {lessons.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {lessons.map((lesson) => <LessonCatalogCard key={lesson.slug} lesson={lesson} />)}
            </div>
          ) : (
            <div role="status" className="paper-card mt-8 p-10 text-center">
              <h3 className="font-display text-2xl font-extrabold text-[#102d2b]">Materi belum ditemukan.</h3>
              <p className="mt-2 text-sm leading-6 text-[#42615b]">Coba kata kunci atau kombinasi filter lain.</p>
              <Link href="/materi" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#f0752d] px-4 text-sm font-extrabold text-white">Reset semua filter</Link>
            </div>
          )}

          {pagination.totalPages > 1 && (
            <nav aria-label="Pagination katalog" className="mt-10 flex items-center justify-center gap-3">
              {page > 1 ? <Link href={createPageHref(query, selectedTopics, level, page - 1)} className="grid h-11 w-11 place-items-center rounded-xl border-2 border-[#b7d2c4] bg-[#fffdf8] text-[#0e4d45]"><span className="sr-only">Halaman sebelumnya</span><ChevronLeft size={18} /></Link> : <span className="grid h-11 w-11 place-items-center rounded-xl border-2 border-[#d7d3c5] bg-[#eee9df] text-[#9aa9a3]" aria-hidden="true"><ChevronLeft size={18} /></span>}
              <span className="font-mono text-xs font-bold text-[#55716c]">Halaman {page} dari {pagination.totalPages}</span>
              {page < pagination.totalPages ? <Link href={createPageHref(query, selectedTopics, level, page + 1)} className="grid h-11 w-11 place-items-center rounded-xl border-2 border-[#b7d2c4] bg-[#fffdf8] text-[#0e4d45]"><span className="sr-only">Halaman berikutnya</span><ChevronRight size={18} /></Link> : <span className="grid h-11 w-11 place-items-center rounded-xl border-2 border-[#d7d3c5] bg-[#eee9df] text-[#9aa9a3]" aria-hidden="true"><ChevronRight size={18} /></span>}
            </nav>
          )}
        </section>
      </main>
    </ContentShell>
  );
}
