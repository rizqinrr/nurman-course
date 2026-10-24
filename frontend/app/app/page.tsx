"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, ShieldCheck } from "lucide-react";

const portals = [
  {
    title: "Portal Siswa",
    label: "SISWA",
    description:
      "Satu pintu terpadu untuk Belajar Mandiri (modul & materi), pantau jadwal Kelas Bimbingan & Les Privat, baca Laporan Harian, Rapor Perkembangan, hingga Tagihan.",
    href: "/app/dashboard",
    secondaryHref: "/app/materi",
    secondaryLabel: "Langsung ke Ruang Materi",
    icon: BookOpen,
    tone: "blue",
  },
  {
    title: "Portal Tentor",
    label: "TENTOR",
    description:
      "Pantau jadwal mengajar harian, isi Laporan Harian & Rapor Perkembangan per blok, serta hubungi siswa/orang tua langsung via 1-klik Direct Chat WhatsApp.",
    href: "/app/tentor/dashboard",
    icon: GraduationCap,
    tone: "light",
  },
  {
    title: "Portal Admin",
    label: "ADMIN",
    description:
      "Kelola layanan, akun siswa & tentor, jadwal sesi, enrollment, kurikulum materi, dan verifikasi pembayaran dalam satu ruang kerja.",
    href: "/app/admin",
    icon: ShieldCheck,
    tone: "dark",
  },
];

export default function AppIndexPage() {
  return (
    <main className="min-h-screen bg-[#eef3f8] px-4 py-8 text-[#14233a] sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col justify-between gap-6 border-b border-[#c7d4e2] pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3">
              <span className="inline-block rounded-full border border-[#c7d4e2] bg-white px-3 py-1 text-xs font-bold text-[#284970]">
                nCourse · 3 Peran Terpadu
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-[-0.05em] sm:text-5xl">
              Pilih ruang kerja.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#536781]">
              Masuk ke portal yang sesuai dengan peranmu hari ini: Siswa, Tentor, atau Admin.
            </p>
          </div>
          <Link
            href="/course"
            className="text-sm font-bold text-[#284970] underline decoration-[#9cb0c4] underline-offset-4 hover:text-[#4a70a9]"
          >
            Kembali ke halaman pendaftaran
          </Link>
        </header>

        <section aria-label="Pilihan portal" className="mt-8 grid gap-4 lg:grid-cols-3">
          {portals.map((portal) => {
            const Icon = portal.icon;
            const dark = portal.tone === "dark";
            return (
              <article
                key={portal.title}
                className={`flex min-h-[21rem] flex-col justify-between rounded-xl border p-6 ${
                  dark
                    ? "border-[#14233a] bg-[#14233a] text-white"
                    : portal.tone === "blue"
                      ? "border-[#9ab6d3] bg-[#e5eef7]"
                      : "border-[#c7d4e2] bg-white"
                }`}
              >
                <div>
                  <div className={`flex items-center justify-between ${dark ? "text-[#f2c14e]" : "text-[#284970]"}`}>
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-current/10">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs font-bold tracking-[0.14em]">{portal.label}</span>
                  </div>
                  <h2 className="mt-8 text-xl font-black tracking-[-0.03em]">{portal.title}</h2>
                  <p className={`mt-3 text-sm leading-6 ${dark ? "text-[#cbd5e1]" : "text-[#536781]"}`}>
                    {portal.description}
                  </p>
                </div>
                <div className="mt-8 space-y-2.5">
                  <Link
                    href={portal.href}
                    className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      dark
                        ? "bg-[#f2c14e] text-[#14233a] hover:bg-[#f6d67f] focus-visible:ring-[#f2c14e]"
                        : "bg-[#284970] text-white hover:bg-[#1d395a] focus-visible:ring-[#4a70a9]"
                    }`}
                  >
                    Masuk ke {portal.title} <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                  {portal.secondaryHref && (
                    <Link
                      href={portal.secondaryHref}
                      className="inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-[#9ab6d3] bg-white px-3 text-xs font-bold text-[#284970] transition-colors hover:bg-[#f1f5f8]"
                    >
                      {portal.secondaryLabel} <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
