### 2026-08-01 — Redesain Perencanaan LMS (Perubahan Role Model & Penambahan Laporan Sesi)

**Fase:** 0 (Revisi)  
**Status sesi:** selesai

**Dikerjakan:**
- Mengubah alur peran pengguna (user roles) dari `admin` + `peserta` menjadi 3 peran utama: `admin`, `pengajar` (tentor), dan `wali` (orang tua murid).
- Menambahkan entitas **Murid** (anak) sebagai entitas data yang dikelola wali (satu wali bisa memiliki lebih dari satu murid). Akun wali dibuat manual oleh admin.
- Menambahkan fitur **Laporan Kegiatan Harian** per sesi (tanggal, jam mulai, jam selesai, materi dibahas, catatan pengajar).
- Menambahkan fitur **Laporan Perkembangan** berkala per blok pertemuan (capaian anak, materi dikuasai, materi belum dikuasai, catatan/saran pengajar). Batas blok dikonfigurasi per program (`sessionsPerBlock`).
- Menulis ulang seluruh prompt desain UI Google Stitch (16 file) untuk menyesuaikan dengan model 3-role (Wali Murid, Pengajar, Admin) dan alur laporan baru.
- Merevisi dokumen-dokumen perencanaan:
  - `docs/ROADMAP-LMS.md` (tabel peran, in-scope MVP, fase, model data).
  - `docs/flow-system.md` (alur pendaftaran, detail alur wali murid, pengajar, admin).
  - `docs/erd-lms.md` (skema tabel baru `murids`, `daily_reports`, `progress_reports`, dan relasi terkait).
  - `tasks/todo.md` (penyesuaian daftar tugas per fase).

**File:**
- `docs/ROADMAP-LMS.md`
- `docs/flow-system.md`
- `docs/erd-lms.md`
- `tasks/todo.md`
- `prompt-google-stitch/*` (16 files)

**Verifikasi:**
- Dokumen markdown diperbarui dan di-commit ke Git.

---

### 2026-08-01 — Pembuatan Prompt Desain UI Google Stitch untuk Seluruh Halaman LMS

**Fase:** 1 (Persiapan Desain/Stitch)  
**Status sesi:** selesai

**Dikerjakan:**
- Menyusun panduan design system terperinci (warna `#4a70a9`, GlassCard, tombol, input, chip) berdasarkan kode funnel nyata.
- Membuat file `README.md` panduan penggunaan Google Stitch secara bertahap.
- Membuat 13 file prompt berformat Markdown (.md) yang *self-contained* untuk 7 halaman area peserta dan 6 halaman area admin.

**File:**
- `prompt-google-stitch/README.md`
- `prompt-google-stitch/00-login-register.md` s.d. `12-kelola-tagihan.md` (13 files)

**Verifikasi:**
- Semua berkas tersimpan rapi dan dicommit ke git.

---

### 2026-08-01 — Fase 1: Setup Supabase Auth, Middleware Proteksi Route, & Halaman Login/Register

**Fase:** 1  
**Status sesi:** selesai

**Dikerjakan:**
- Install dependensi frontend Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- Buat helper Supabase Client (`lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/middleware.ts`)
- Buat Next.js Middleware (`middleware.ts`) untuk proteksi route `/app/*` dan pembagian route berdasarkan role admin vs peserta
- Buat SQL Trigger di Supabase untuk sinkronisasi otomatis registrasi user (`auth.users` -> `public.users`)
- Buat halaman Auth (`app/login/page.tsx`) dengan UI Glassmorphism modern
- Buat halaman dashboard minimal peserta (`app/app/dashboard/page.tsx`) and admin (`app/app/admin/page.tsx`)
- Perbaikan semua lint errors dan warnings di seluruh codebase

**File:**
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/middleware.ts`
- `middleware.ts`
- `app/login/page.tsx`
- `app/app/dashboard/page.tsx`
- `app/app/admin/page.tsx`
- `backend/prisma/seed.ts`

**Verifikasi:**
- `npm run lint` & `npx tsc --noEmit` bersih tanpa error/warning.
- SQL trigger sukses terpasang di database Supabase.
- Seeding data berjalan lancar.

---

### 2026-08-01 — Fase 1: Setup Prisma, Database Supabase, dan Seeding Data

**Fase:** 1  
**Status sesi:** selesai

**Dikerjakan:**
- Setup backend environment (`package.json`, `tsconfig.json`, `.env`)
- Definisi skema database Prisma untuk LMS Sederhana (`User`, `Program`, `RoadmapStep`, `MaterialItem`, `Session`, `Progress`, `Enrollment`, `Invoice`)
- Integrasi koneksi ke database Supabase (Sydney `ap-southeast-2` dengan IPv4 connection pooling)
- Pembuatan script seeding data awal (`prisma/seed.ts`)
- Inisialisasi Prisma Client global (`src/index.ts`) dan setup folder (`controllers`, `models`)

**File:**
- `backend/package.json`
- `backend/tsconfig.json`
- `backend/prisma/schema.prisma`
- `backend/prisma/seed.ts`
- `backend/src/index.ts`
- `backend/src/controllers/.gitkeep`
- `backend/src/models/.gitkeep`

**Verifikasi:**
- `npx prisma db push` berhasil disinkronkan ke Supabase.
- `npx prisma db seed` sukses dijalankan dan mengisi data awal.

---

### 2026-07-31 — Fase 0: Flow Sistem & Model Data

**Fase:** 0  
**Status sesi:** selesai

**Dikerjakan:**
- Buat `docs/flow-system.md` (alur login, dashboard orang tua, materi detail)
- Update `tasks/todo.md` (F0.1 selesai)
- Catat keputusan di `PROGRESS.md`

**File:**
- `docs/flow-system.md`
- `tasks/todo.md`
- `docs/PROGRESS.md`

**Verifikasi:**
- Entity + flow jelas
- Siap untuk Fase 1 (DB + Auth)

**Next:**
- F0.2 ERD kasar (sudah ada di erd-lms.md)
- F0.3 Mapping kasar `materials.ts` → Program/RoadmapStep
- F0.4 Shortlist stack (DB + Auth)
- F0.5 Catat keputusan open di PROGRESS

**Keputusan:** 
- Admin = kamu sendiri (single admin)
- Kelas: Calistung + Ngaji dulu
- Roadmap = table `roadmap_steps` dengan body_text (Markdown)
- Konten = Markdown di DB
- Progres per hari = table terpisah
- Funnel tetap terpisah (Opsi A)