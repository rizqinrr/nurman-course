"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Search, SlidersHorizontal } from "lucide-react";
import type { CatalogCourseDto } from "@nurman-course/shared";
import ContentShell from "@/components/content/ContentShell";
import { CourseCard } from "@/components/content/CourseCard";
import { getCatalog } from "@/lib/content-api";

const accessOptions = [
  { value: "", label: "Semua akses" },
  { value: "free", label: "Login gratis" },
  { value: "paid", label: "Berbayar" },
] as const;

export default function MaterialCatalogPage() {
  const [courses, setCourses] = useState<CatalogCourseDto[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [accessTier, setAccessTier] = useState<"" | "free" | "paid">("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const result = await getCatalog({
          page,
          limit: 8,
          search: search.trim() || undefined,
          category: category.trim() || undefined,
          level: level.trim() || undefined,
          accessTier: accessTier || undefined,
        });
        if (!active) return;
        setCourses(result.data);
        setTotalPages(result.pagination.totalPages);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Katalog belum dapat dimuat.");
      } finally {
        if (active) setLoading(false);
      }
    }, 250);
    return () => { active = false; clearTimeout(timer); };
  }, [accessTier, category, level, page, search]);

  return (
    <ContentShell>
      <main>
        <section className="border-b border-[#d8d0c3] bg-[#e7edf5]">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_18rem] lg:px-8">
            <div>
              <h1 className="max-w-3xl font-playfair text-4xl leading-[1.05] tracking-[-0.03em] text-[#17283e] sm:text-6xl">Materi yang bisa dibaca sesuai ritmemu.</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#46576a] sm:text-lg">Jelajahi silabus, mulai dari lesson publik, lalu lanjutkan kelas gratis atau berbayar saat kamu siap.</p>
            </div>
            <div className="self-end border-t border-[#9fb1c7] pt-4 text-sm leading-6 text-[#46576a] lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
              <strong className="block text-[#17283e]">Baca dulu, putuskan kemudian.</strong>
              Outline selalu terbuka. Isi lesson hanya dikirim setelah backend memastikan aksesmu.
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-3 border-b border-[#d8d0c3] pb-6 sm:grid-cols-2 lg:grid-cols-[minmax(18rem,1fr)_11rem_11rem_11rem]">
            <label className="relative block">
              <span className="sr-only">Cari materi</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6c746b]" size={18} aria-hidden="true" />
              <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} type="search" placeholder="Cari topik atau judul kelas" className="min-h-12 w-full rounded-lg border border-[#cfc6b7] bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#4a70a9] focus:ring-2 focus:ring-[#4a70a9]/20" />
            </label>
            <label className="relative flex items-center">
              <SlidersHorizontal className="pointer-events-none absolute left-3 text-[#6c746b]" size={17} aria-hidden="true" />
              <span className="sr-only">Filter kategori</span>
              <input value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} placeholder="Kategori" className="min-h-12 w-full rounded-lg border border-[#cfc6b7] bg-white pl-10 pr-3 text-sm outline-none focus:border-[#4a70a9] focus:ring-2 focus:ring-[#4a70a9]/20" />
            </label>
            <label>
              <span className="sr-only">Filter level</span>
              <input value={level} onChange={(event) => { setLevel(event.target.value); setPage(1); }} placeholder="Level" className="min-h-12 w-full rounded-lg border border-[#cfc6b7] bg-white px-3 text-sm outline-none focus:border-[#4a70a9] focus:ring-2 focus:ring-[#4a70a9]/20" />
            </label>
            <label className="relative flex items-center">
              <span className="sr-only">Filter akses</span>
              <select value={accessTier} onChange={(event) => { setAccessTier(event.target.value as typeof accessTier); setPage(1); }} className="min-h-12 w-full appearance-none rounded-lg border border-[#cfc6b7] bg-white px-3 text-sm font-semibold outline-none focus:border-[#4a70a9] focus:ring-2 focus:ring-[#4a70a9]/20">
                {accessOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
          </div>

          <div aria-live="polite" aria-busy={loading}>
            {loading ? <CatalogSkeleton /> : error ? <CatalogState title="Katalog belum dapat dimuat" message={error} /> : courses.length === 0 ? <CatalogState title="Belum ada materi yang cocok" message="Coba kata kunci lain atau tampilkan semua akses." /> : <div>{courses.map((course) => <CourseCard key={course.slug} course={course} />)}</div>}
          </div>

          {!loading && !error && totalPages > 1 && <nav aria-label="Paginasi katalog" className="mt-8 flex items-center justify-between border-t border-[#d8d0c3] pt-5">
            <button disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-bold text-[#294d7e] disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft size={16} /> Sebelumnya</button>
            <span className="text-sm tabular-nums text-[#6c746b]">Halaman {page} dari {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-bold text-[#294d7e] disabled:cursor-not-allowed disabled:opacity-40">Berikutnya <ArrowRight size={16} /></button>
          </nav>}
        </section>
      </main>
    </ContentShell>
  );
}

function CatalogSkeleton() {
  return <div className="divide-y divide-[#d8d0c3]" aria-label="Memuat materi">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="py-7"><div className="h-5 w-28 animate-pulse rounded bg-[#dce3eb]" /><div className="mt-4 h-8 w-2/3 animate-pulse rounded bg-[#e4ded4]" /><div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-[#ebe6de]" /></div>)}</div>;
}

function CatalogState({ title, message }: { title: string; message: string }) {
  return <div role="status" className="py-16 text-center"><BookOpen className="mx-auto text-[#8090a2]" size={30} /><h2 className="mt-4 font-playfair text-2xl text-[#17283e]">{title}</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#66716b]">{message}</p><Link href="/materi" className="mt-5 inline-block text-sm font-bold text-[#294d7e] underline decoration-[#9fb1c7] underline-offset-4">Muat ulang katalog</Link></div>;
}
