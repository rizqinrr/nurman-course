import Link from "next/link";
import { ArrowRight, BookOpen, LockKeyhole, Sparkles } from "lucide-react";
import { formatCoursePrice } from "@/lib/content-api";
import type { CatalogCourseDto } from "@nurman-course/shared";

const accessCopy = {
  public: { label: "Publik", className: "bg-emerald-50 text-emerald-800 border-emerald-200", icon: Sparkles },
  login: { label: "Login gratis", className: "bg-[#e9eef5] text-[#294d7e] border-[#c4d3e7]", icon: LockKeyhole },
  purchase: { label: "Berbayar", className: "bg-amber-50 text-amber-800 border-amber-200", icon: LockKeyhole },
} as const;

export function AccessBadge({ access }: { access: "public" | "login" | "purchase" }) {
  const item = accessCopy[access];
  const Icon = item.icon;
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${item.className}`}><Icon size={13} aria-hidden="true" />{item.label}</span>;
}

export function CourseCard({ course }: { course: CatalogCourseDto }) {
  const access = course.accessTier === "paid" ? "purchase" : "login";
  return (
    <article className="group flex min-h-64 flex-col justify-between border-b border-[#d8d0c3] py-6 sm:min-h-56 sm:py-7">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <AccessBadge access={access} />
          {course.category && <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6c746b]">{course.category}</span>}
        </div>
        <h2 className="font-playfair text-2xl leading-tight text-[#1a1a18] transition-colors group-hover:text-[#294d7e] sm:text-3xl">{course.title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#55605a]">{course.description}</p>
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#6c746b]"><BookOpen size={15} aria-hidden="true" />{course.lessonCount} lesson{course.lessonCount === 1 ? "" : "s"}{course.price !== null && <span className="text-[#294d7e]">· {formatCoursePrice(course.price)}</span>}</div>
        <Link href={`/kelas/${encodeURIComponent(course.slug)}`} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#294d7e] px-4 text-sm font-bold text-white transition-colors hover:bg-[#1f3c64] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#294d7e] focus-visible:ring-offset-2">Lihat kelas <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
    </article>
  );
}
