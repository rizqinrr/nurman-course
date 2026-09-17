# Project Rules — Nurman Course

## Project

- Monorepo **Nurman Course**: funnel pendaftaran les (`/course`) dan portal operasional (`/app`).
- Fokus aktif: **backend-first** — auth/role DB, hardening, migration, `Course → Section → Lesson`, dan akses konten.
- Stack: Next.js, React, Tailwind CSS; Express, Prisma, PostgreSQL Supabase, dan Supabase Auth.
- Funnel WhatsApp dan portal existing harus tetap berjalan selama restrukturisasi backend.
- Jangan mengerjakan frontend LMS, deploy, atau mutasi DB remote tanpa task dan izin eksplisit.

## Source of truth

| Dokumen | Fungsi |
|---|---|
| `AGENTS.md` | Aturan kerja dan larangan scope |
| `GOALS.md` | Arah, urutan goal backend, blocker, dan approval gate |
| `SYSTEM_MAP.md` | Peta arsitektur, route, dan file penting |
| `docs/PROGRESS.md` | Keputusan, milestone terbaru, verifikasi, dan residual |
| `tasks/todo.md` | Checklist pekerjaan backend aktif |
| `README.md` | Cara menjalankan dan memverifikasi project |

Vault manusia bukan source of truth repo dan hanya disinkronkan saat diminta.

## Step 0 setiap sesi

Sebelum coding atau eksplorasi kode:

1. Baca `tasks/todo.md` untuk fokus aktif.
2. Baca `docs/PROGRESS.md` untuk status dan keputusan terakhir.
3. Baca `GOALS.md` untuk arah, blocker, dan gate.
4. Baca `AGENTS.md` dan kode terkait.

Jika task belum jelas atau di luar scope aktif, tanya user sebelum mengerjakannya.

## Codegraph

Repo di-index pada `.codegraph/`.

Gunakan `codegraph_explore` sebelum Grep/Read berulang untuk:

- memahami alur, bug, simbol, atau lokasi implementasi;
- menilai blast radius perubahan multi-file;
- membaca source file/simbol kode yang akan diubah.

Source dari Codegraph dianggap sudah dibaca. Gunakan Read hanya untuk detail yang tidak tercakup, file non-kode, atau file yang ditandai stale. Codegraph tidak menggantikan lint, typecheck, test, atau verifikasi runtime.

## Definition of Done

Sesi yang mengubah repo belum selesai sebelum:

1. `docs/PROGRESS.md` mencatat request, keputusan, perubahan, verifikasi, dan residual.
2. `tasks/todo.md` mencerminkan status aktif terbaru.
3. Keputusan arsitektur penting dicatat di `PROGRESS.md` dan diringkas di `GOALS.md` bila mengubah arah.
4. Lint dan typecheck yang relevan dijalankan; test dijalankan sesuai scope/izin sesi.
5. Batas bukti dinyatakan: verifikasi lokal bukan bukti DB, auth, atau deployment live.

## Scope guard

- Jangan mutasi DB remote, menjalankan backfill live, seed, migration deploy, atau drop schema tanpa izin eksplisit.
- Jangan commit, push, merge, atau deploy tanpa permintaan eksplisit.
- Jangan mengubah frontend saat task backend-only.
- Jangan membangun katalog publik sebelum kebocoran body legacy dan access guard selesai.
- Jangan menganggap role sama dengan entitlement.
- Jangan mengganti `Program` dengan `Course`; keduanya punya tanggung jawab berbeda.
- Jangan lock payment gateway, subscription, atau infra baru tanpa keputusan.
- Pertahankan perubahan user yang tidak terkait; jangan revert diam-diam.

## Arsitektur backend

- Entry point Express: `backend/src/index.ts`.
- Auth boundary: `backend/src/middleware/auth.ts`.
- HTTP hardening: `backend/src/middleware/http-security.ts`.
- Prisma singleton: `backend/src/lib/prisma.ts`.
- Supabase Admin singleton: `backend/src/lib/supabase-admin.ts`.
- Legacy content routers: `backend/src/routes/content/`.
- Authoring API: `backend/src/routes/authoring/`.
- Schema dan migration: `backend/prisma/`.
- Shared Zod contract: `packages/shared/src/index.ts`.

Aturan backend:

- Identitas berasal dari token Supabase terverifikasi.
- Role dan status active berasal dari DB, bukan metadata JWT.
- Ownership resource tetap diperiksa setelah role.
- Input menggunakan shared Zod schemas.
- Response baru memakai DTO allowlist.
- Error publik tidak boleh membocorkan credential, SQL, atau detail internal.
- Migration memakai expand → backfill → verify → contract; jangan drop legacy lebih awal.
- Selama cutover hanya boleh ada satu writer authoritative untuk record konten yang sama.

## Domain konten

- `Program`: layanan les bertentor, enrollment, session, laporan, dan invoice.
- `Course`: unit konten mandiri yang dapat gratis atau berbayar.
- `Section`: pengelompokan lesson dalam course.
- `Lesson`: body Markdown dengan slug global, status, visibility, dan urutan.
- `Entitlement`: target authority akses User ke Course; belum diimplementasikan.
- `LessonProgress`: target progress membaca User; berbeda dari progress Murid.

Course hasil migrasi yang terhubung Program tetap read-only melalui authoring API sampai frontend legacy cutover. Course standalone dapat ditulis melalui `/api/authoring/*` sesuai ownership.

## Funnel yang harus dipertahankan

Flow:

`/course → /course/program → materi|jenjang|calistung → /course/config → WhatsApp`

Aturan:

- Data funnel berasal dari `frontend/data/materials.ts`.
- Pricing hanya dihitung di `frontend/app/course/config/CourseConfigClient.tsx`.
- Nomor WhatsApp berasal dari `frontend/lib/constants.ts`.
- Jangan duplikasi data, pricing, atau nomor WhatsApp di page lain.
- Jangan merombak routing funnel dalam task backend.

## Verifikasi backend

Perintah yang tersedia:

```powershell
npm run typecheck --workspace=backend
npm run typecheck:test --workspace=backend
npm run lint --workspace=backend
npm run test --workspace=backend
npm run test:artifact --workspace=backend
npm run build --workspace=backend
```

Pilih perintah sesuai perubahan dan izin. Build Prisma harus dilakukan pada OS target deployment karena engine bersifat native.

## Known active constraints

- Migration `Course/Section/Lesson` dan backfill belum dijalankan ke DB live.
- Lima akun Supabase Auth belum memiliki profil aplikasi; rollout auth ditahan.
- Parser JSON masih 100 KB.
- Frontend masih memakai metadata role.
- Endpoint legacy `/api/programs*` masih menjadi release blocker karena body roadmap.
- `MaterialItem.sessionId` belum boleh dihapus sebelum audit/backfill live.
- Frontend authoring, entitlement, public catalog, dan deployment belum masuk scope aktif.
