# 🧭 Project Overview

- Monorepo aplikasi Nurman Course: **funnel pendaftaran** (`/course`, output WhatsApp) + **portal LMS** (`/app`: wali, tentor, admin).
- Tech stack frontend: Next.js 16 App Router + Turbopack, React 19, Tailwind CSS v4.
- Backend: Express 4 (TypeScript) + Prisma ORM 5 → PostgreSQL Supabase.
- Auth: Supabase Auth (JWT diverifikasi middleware Express; login email/nomor WA).
- Shared: `packages/shared` — Zod schemas & tipe TypeScript dipakai FE dan BE.
- Dev tooling: NC Debugger widget (`components/ui/DebugBar.tsx`, dev-only) — log request API, cache status, latency.
- Gaya UI: glassmorphism ringan, mobile-first; funnel berujung ke WhatsApp.
- Arah LMS: `docs/ROADMAP-LMS.md` · progress: `docs/PROGRESS.md` · tasks: `tasks/todo.md` · agent: `AGENTS.md`.

---

# 🔀 Routing Flow

## Landing Marketing & Funnel Pendaftaran
/landing
→ Landing page marketing terpisah (hero, stats, kategori, tentang kami, testimoni).

/course
→ Landing hero funnel. CTA ke /course/program.

/course/program
→ Pilih jenis program (materi, jenjang, calistung).

/course/materi
→ List materi kategori materi dari data statis.

/course/jenjang
→ List jenjang pendidikan (SD 1-3, SD 4-6, SMP) dari data statis.

/course/calistung
→ List program calistung dari data statis.

/course/materi/[id]
→ Detail materi, pilih level, lanjut ke config.

/course/config
→ Konfigurasi durasi/frekuensi/peserta/hari/jam, hitung estimasi, kirim ke WhatsApp.

/course/config → WhatsApp
→ Data pilihan di-encode ke URL wa.me menggunakan nomor dari constants.

## Auth
/login
→ Login multi-metode (email atau nomor WhatsApp + password); resolve nomor WA via `/api/auth/resolve-phone`.

/app
→ Portal selector; middleware proteksi role-based (admin/tentor/wali).

### Area Wali Murid — route group `(wali)`
/app/dashboard
→ Ringkasan murid terpilih: profil + foto, program aktif + progress bar, laporan harian & perkembangan terakhir, sesi terdekat, tagihan H-1. Selector multi-murid bila > 1 anak.

/app/program
→ Katalog program (tab filter kategori + search + status Terdaftar/Tersedia/Coming Soon).

/app/program/[slug]
→ Detail program: belum terdaftar = outline silabus + CTA daftar via WA; sudah terdaftar = roadmap belajar interaktif. Modal detail materi.

/app/laporan
→ Tab laporan harian & laporan perkembangan anak, tombol diskusi WA per laporan.

/app/jadwal
→ Jadwal les anak (mendatang + riwayat), badge status-aware.

/app/tagihan
→ Invoice + prabayar: upload bukti bayar (foto/PDF), riwayat pembayaran, tombol konfirmasi WA.

/app/profile
→ Profil wali: data akun, daftar murid, ubah kata sandi.

/app/materi
→ Halaman katalog materi pelajaran (mandiri, di luar route group wali).

### Area Tentor `/app/tentor`
/app/tentor/dashboard
→ Agenda mengajar hari ini, stat ringkas, evaluasi perkembangan belajar (murid siap rapor), badge laporan pending berbasis waktu sesi.

/app/tentor/jadwal
→ CRUD jadwal mengajar (buat/edit/batalkan/hapus sesi via ConfirmDialog, polarisasi mendatang vs riwayat).

/app/tentor/laporan-harian
→ Tabel laporan harian + tombol Detail (modal), form tulis/edit laporan per sesi pending, print A4 per blok. Sesi yang sudah berlaporkan otomatis mode edit.

/app/tentor/laporan-perkembangan
→ Form input/evaluasi laporan perkembangan berkala (per blok sesi).

/app/tentor/profil
→ Profil tentor + update password.

### Area Admin `/app/admin`
/app/admin
→ Dashboard statistik operasional (murid/tentor/program aktif, tagihan waiting, sesi hari ini) via endpoint khusus.

/app/admin/murid
→ Manajemen murid + akun wali (create/reuse akun, foto base64, reset password wali, nonaktifkan/hapus permanen).

/app/admin/tentor
→ Manajemen data tentor aktif/nonaktif.

/app/admin/pengguna
→ Manajemen akun pengguna (folder ada; cek isi aktual sebelum andalkan).

/app/admin/program
→ CRUD master program (slug, harga, sessionsPerBlock, status).

/app/admin/enrollment
→ Pendaftaran murid ke program + assign tentor.

/app/admin/jadwal
→ CRUD sesi semua murid (mirror kemampuan jadwal tentor).

/app/admin/roadmap
→ Roadmap langkah belajar + material item per program.

/app/admin/tagihan
→ Invoice + prabayar: verifikasi bukti bayar (modal/foto fullscreen), lunas/batalkan, terbitkan invoice.

/app/admin/tagihan/[invoiceId]
→ Detail bukti pembayaran fullscreen (foto/PDF).

/app/admin/rekening
→ Setup rekening tujuan pembayaran.

---

# 📁 Folder Structure (Monorepo)

- `frontend/` → Aplikasi Next.js (funnel & portal LMS)
  - `app/` → Routing: `/landing`, `/course/*` (funnel), `/login`, `/app/*` (portal; wali dalam route group `(wali)`)
  - `components/ui/` → Atom UI glassmorphism (Button, GlassCard, ConfirmDialog, ProofModal, DebugBar, dll.)
  - `components/course/` → Section landing funnel (SocialProof, Testimonials, TutorCarousel, Reveal/CountUp)
  - `components/landing/` → Section landing `/landing`
  - `data/` → `materials.ts` (funnel statis), `landing.ts` (landing statis), `lms.ts` (tipe data portal)
  - `lib/` → `api.ts` (apiFetch + cache + log debugger), `constants.ts`, `format.ts`, `useLogout.tsx`
  - `middleware.ts` → Proteksi route role-based
- `backend/` → API Express
  - `src/index.ts` → Seluruh endpoint API
  - `src/middleware/auth.ts` → Verifikasi JWT Supabase (`requireAuth`, `requireAdmin`)
  - `prisma/schema.prisma` + `prisma/seed.ts` → Skema & seed DB
  - `src/generated/client` → Build artifact Prisma (jangan edit)
- `packages/shared/src/index.ts` → Zod schemas + helper (`normalizePhone`) + tipe, dipakai FE & BE
- `docs/` → Spesifikasi, ERD, roadmap LMS (bukan runtime)
- `tasks/` → Checklist eksekusi (`todo.md`, `plan.md`)
- `desain-ui-frontend/` → Rancangan prompt Google Stitch (19 file)

---

# 🧩 Key Files Map

## Core & Shared
frontend/lib/api.ts
- Role: `apiFetch` — Bearer JWT, memory cache GET 1 jam, smart invalidation per kategori saat mutasi, `fetchLogs` + listener untuk NC Debugger.

frontend/components/ui/DebugBar.tsx
- Role: Widget debugger melayang (dev-only): riwayat request, status code, cache HIT/MISS/INVALIDATED, durasi; tombol Copy Logs ke clipboard.

frontend/middleware.ts
- Role: Proteksi route portal berdasarkan role hasil session Supabase.

frontend/data/materials.ts
- Role: Sumber data funnel (materi/jenjang/calistung) + helper getMaterialById/getMaterialsByCategory.

frontend/data/lms.ts
- Role: Tipe data portal (DbMurid, DailyReport, ProgressReport, DbInvoice, dll.).

frontend/lib/constants.ts
- Role: Konstanta global, termasuk WHATSAPP_NUMBER.

packages/shared/src/index.ts
- Role: Zod schemas semua domain (murid, user, program, enrollment, session, invoice, prepayment, laporan, roadmap, material) + normalizePhone + tipe infer.

backend/prisma/schema.prisma
- Role: 13 model — User (3 role), Murid, Program, RoadmapStep, Session, MaterialItem, Enrollment, Invoice, Prepayment, PaymentAccount, DailyReport, ProgressReport, Progress.

backend/prisma/seed.ts
- Role: Seed akun via Supabase Admin API (getOrCreateSupabaseUser) + data dummy dev. ⚠️ Menjalankan deleteMany — JANGAN di DB production.

backend/src/index.ts
- Role: Seluruh endpoint Express, dikelompokkan:
  - Auth: `POST /api/auth/resolve-phone`, health check
  - Profil: `GET /api/users/me` (+ murids)
  - Wali: `/api/me/{enrollments,sessions,daily-reports,progress-reports,invoices,prepayments,notifications}`, payment & prabayar
  - Tentor: `POST /api/daily-reports` (upsert per sessionId), `POST /api/progress-reports`, CRUD `/api/me/sessions`
  - Admin: CRUD `murids|users|programs|enrollments|sessions|invoices|prepayments|roadmap-steps|material-items|payment-accounts`, notifications, dashboard stats, reset-password

backend/src/middleware/auth.ts
- Role: `requireAuth` (verifikasi JWT Supabase), `requireAdmin`.

## Flow Funnel Pendaftaran
frontend/app/course/page.tsx
- Role: Hero landing funnel. Navigates to: /course/program.

frontend/app/course/program/page.tsx
- Role: Pilihan program utama. Routes to: materi / jenjang / calistung.

frontend/app/course/materi/page.tsx · jenjang · calistung
- Role: List per kategori via getMaterialsByCategory. Routes to: /course/materi/[id] atau langsung /course/config.

frontend/app/course/materi/[id]/page.tsx
- Role: Detail materi + pemilihan level. Routes to: /course/config?materi={id}&level={n}.

frontend/app/course/config/CourseConfigClient.tsx
- Role: Konfigurasi akhir + pricing (satu-satunya tempat hitung harga) + CTA WhatsApp (wa.me).

## Portal (contoh kunci)
frontend/app/login/page.tsx
- Role: Login email/nomor WA + resolve phone.

frontend/app/app/(wali)/dashboard/page.tsx
- Role: Dashboard wali — agregat 5 endpoint (/api/me/*) + selector multi-murid.

frontend/app/app/tentor/laporan-harian/LaporanHarianClient.tsx
- Role: Tabel laporan + modal detail + form tulis/edit (auto-redirect sessionId→editSessionId bila sudah berlaporkan).

frontend/app/app/admin/murid/page.tsx
- Role: CRUD murid + akun wali (foto resize canvas → base64 → POST/PATCH admin murids).

---

# 🔗 Data Flow

## Funnel
materials.ts
→ dipakai di halaman list/detail (materi, jenjang, calistung)
→ user memilih item + level
→ parameter dikirim via URL query ke /course/config
→ config hitung estimasi harga dinamis
→ ringkasan dikirim ke WhatsApp.

## Portal LMS
Portal pages
→ `apiFetch` (cek memory cache 1 jam; miss → fetch dengan Bearer JWT)
→ Express API (requireAuth/requireAdmin → verifikasi JWT Supabase)
→ Prisma → PostgreSQL Supabase
→ mutasi (POST/PATCH/DELETE) → invalidasi cache kategori terkait (reports/sessions/invoices/users/...)
→ NC Debugger merekam tiap request (dev only).

---

# ⚠️ Important Rules

- Funnel: jangan hardcode daftar materi di page, selalu ambil dari data/materials.ts.
- Pricing HANYA di app/course/config/CourseConfigClient.tsx — jangan duplikasi.
- Nomor WhatsApp gunakan lib/constants.ts, jangan duplikasi angka di file lain.
- Portal: semua request lewat `apiFetch` (bukan fetch langsung) agar cache + debugger bekerja.
- Validasi input pakai Zod schema dari packages/shared — jangan definisikan ulang di FE/BE.

---

# 🧠 Notes for Future Development

- Tambah/ubah materi funnel: edit data/materials.ts.
- Ubah perhitungan harga: edit app/course/config/CourseConfigClient.tsx.
- Ubah UI global: edit components/ui/.
- Tambah endpoint baru: backend/src/index.ts + schema Zod di packages/shared + konsumsi via apiFetch.
- Arah LMS / progress: docs/ROADMAP-LMS.md, docs/PROGRESS.md, tasks/todo.md.
- Jika menambah program funnel baru, update:
  - app/course/program/page.tsx (entry pilihan)
  - data/materials.ts (data kategori)
  - page turunan program sesuai kebutuhan.
