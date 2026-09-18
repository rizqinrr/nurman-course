# System Map — Nurman Course

## Arsitektur

```text
Browser
  ├─ /course/*            Funnel WhatsApp, data statis
  ├─ /landing             Marketing
  └─ /app/*               Portal wali, tentor, admin
          │
          ▼
frontend/lib/api.ts       Bearer token, request/cache boundary
          │
          ▼
backend/src/index.ts      Express API
  ├─ middleware/auth.ts   Verified Supabase ID + role/active DB
  ├─ middleware/http-security.ts
  ├─ routes/content/*     Program/RoadmapStep/MaterialItem legacy
  ├─ routes/authoring/*   Course/Section/Lesson authoring
  ├─ lib/prisma.ts
  └─ lib/supabase-admin.ts
          │
          ▼
Prisma → PostgreSQL Supabase
```

Shared input contracts berada di `packages/shared/src/index.ts`.

## Folder

| Path | Tanggung jawab |
|---|---|
| `frontend/app/` | Next.js routes funnel, login, dan portal |
| `frontend/components/` | UI reusable dan section halaman |
| `frontend/data/` | Data funnel dan tipe view portal |
| `frontend/lib/` | API client, constants, utility |
| `backend/src/index.ts` | App Express dan domain operasional yang belum diekstrak |
| `backend/src/routes/content/` | Endpoint content legacy |
| `backend/src/routes/authoring/` | CRUD/reorder/publish Course, Section, Lesson |
| `backend/src/middleware/` | Auth dan HTTP security |
| `backend/src/lib/` | Prisma dan Supabase clients |
| `backend/prisma/schema.prisma` | Schema database |
| `backend/prisma/migrations/` | Migration history |
| `backend/prisma/backfill-content.ts` | Dry-run/apply backfill content dengan staging gate |
| `packages/shared/src/index.ts` | Zod schemas dan shared types |

## Domain utama

### Operasional les

```text
User ─ Murid ─ Enrollment ─ Program
                         ├─ Session
                         ├─ Invoice
                         └─ RoadmapStep ─ MaterialItem
```

`DailyReport`, `ProgressReport`, dan `Progress` tetap terkait layanan les/murid.

### Konten mandiri

```text
Program ─ optional bridge ─ Course ─ Section ─ Lesson
User ─ target Entitlement ─ Course
User ─ target LessonProgress ─ Lesson
```

`Course`, `Section`, dan `Lesson` sudah ada di schema/migration lokal. Entitlement dan LessonProgress masih target berikutnya.

### Public content

- `GET /api/catalog/courses`
- `GET /api/catalog/courses/:slug`
- `GET /api/catalog/lessons`
- `GET /api/catalog/paths`
- `GET /api/reader/lessons/:slug`

### Member content

- `GET /api/me/courses`
- `GET /api/me/entitlements`
- `GET /api/me/lesson-progress`
- `PATCH /api/me/lessons/:slug/progress`

### Tracking/admin

- `POST /api/track/login`
- `GET /api/admin/tracking`
- `DELETE /api/admin/tracking`



- `GET /api/health`
- `POST /api/auth/resolve-phone`
- `GET /api/users/me`
- `GET /api/programs`
- `GET /api/programs/:id`

### Portal operations

- `/api/me/*` untuk data role-bound
- `/api/admin/*` untuk administrasi
- `/api/daily-reports` dan `/api/progress-reports`

Sebagian domain operasional masih berada di `backend/src/index.ts`.

### Content legacy

- Program: `backend/src/routes/content/programs.ts`
- Roadmap: `backend/src/routes/content/roadmap.ts`
- Material: `backend/src/routes/content/materials.ts`

Endpoint `/api/programs*` belum aman untuk peluncuran katalog publik karena relasi roadmap dapat membawa `bodyText`.

### Content authoring

`/api/authoring/*` menyediakan:

- list/detail/create/update/delete Course;
- CRUD Section dan Lesson;
- reorder sibling transaksional;
- publish/draft action;
- admin-all dan tentor-own ownership;
- validasi link internal `/materi/*`;
- DTO response eksplisit.

Course hasil migrasi dengan `programId` tetap read-only melalui authoring API sampai cutover legacy.

## Auth boundary

1. Bearer token diverifikasi oleh Supabase Auth.
2. User aplikasi dicari berdasarkan verified ID.
3. Role dan active dibaca dari DB.
4. `requireRole` memeriksa wewenang route.
5. Handler memeriksa ownership object.

Frontend masih memakai metadata role untuk routing; backend tetap authority untuk API.

## Content migration

Migration lokal:

- additive `Course`, `Section`, `Lesson`;
- lineage ke `Program`, `RoadmapStep`, dan `MaterialItem`;
- unique slug/order;
- RLS default-deny untuk tabel baru.

Backfill:

- dry-run secara default;
- apply hanya untuk staging yang dikonfirmasi;
- atomic dan idempotent;
- berhenti jika ada ambiguous, conflict, atau orphan;
- tidak melakukan drop legacy.

## Funnel

```text
/course
  → /course/program
  → /course/materi|jenjang|calistung
  → /course/config
  → WhatsApp
```

- Data: `frontend/data/materials.ts`
- Pricing: `frontend/app/course/config/CourseConfigClient.tsx`
- WhatsApp number: `frontend/lib/constants.ts`

## Deployment boundary

- `backend/build.cjs` menjalankan Prisma generate, compile backend/shared, lalu menyalin generated client dan engine ke `backend/dist`.
- Artifact harus dibangun pada OS deployment.
- Schema/migration lokal bukan bukti sudah diterapkan ke Supabase.
- Tidak ada migration deploy, backfill live, atau production deploy tanpa izin eksplisit.

## Dokumen aktif

- `GOALS.md` — arah dan blocker
- `tasks/todo.md` — pekerjaan aktif
- `docs/PROGRESS.md` — keputusan dan milestone
- `AGENTS.md` — aturan kerja
