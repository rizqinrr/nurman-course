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