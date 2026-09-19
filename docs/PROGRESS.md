### 2026-09-19 — Redesign funnel course “Peta Bercabang”

**Request:** redesign `/course/program` dan urutan halaman sesudahnya, mempertahankan warna utama landing, mobile-first, copy/data, route, serta CTA WhatsApp.

**Keputusan:** funnel memakai komposisi “Peta Bercabang” yang memperluas dunia visual Peta Belajar landing. Empat langkah `Arah → Fokus → Level → Jadwal` selalu terlihat; data tetap berasal dari `materials.ts`, pricing tetap di `CourseConfigClient`, dan nomor WhatsApp tetap dari constants.

**Dikerjakan:** shell `/course/*` memakai map ground landing; `CourseRouteHeader` menyediakan back action dan progress rail; program, materi, jenjang, calistung, detail level, chip, dan config memakai route node/panel baru; copy existing dipertahankan dan dikunci oleh test; `frontend/DESIGN.md`, sidecar Impeccable, dan surface brief ditambahkan.

**Verifikasi:** course-funnel/auth tests 9/9 lulus; frontend typecheck dan lint lulus; production build menghasilkan artifacts semua route funnel; Impeccable detector kosong; browser QA 390px dan 1440px tanpa horizontal overflow dan console error. Review lanjutan memperbaiki duplikasi copy harga, label input nama, `aria-pressed`/`aria-current`, validasi kategori URL, penolakan level coming-soon, dan gate jumlah hari tepat sesuai frekuensi. URL config yang dimanipulasi ditolak dan CTA WhatsApp tetap disabled saat hari belum lengkap. Runtime API backend tidak diperlukan untuk funnel statis ini.

**Residual dan batas bukti:** model tidak mendukung inspeksi piksel screenshot; visual diverifikasi melalui accessibility tree, geometry/overflow, computed state, screenshot capture, detector, dan browser interaction. Verifikasi lokal bukan bukti deployment production. Tidak ada DB mutation, commit, push, atau deploy.

### 2026-09-19 — Redesign landing, auth toggle, dan akun development dummy

**Request:** perbaiki landing page, gabungkan login/register tanpa reload, dan sediakan tombol akun dummy per role untuk development.

**Keputusan:** redesign memakai dunia visual “Peta Belajar”; biru utama dan logo dipertahankan. Login/register menjadi satu surface `/login` dengan toggle state client-side; `/signup` tetap redirect kompatibilitas ke `/login?mode=register`. Quick-fill hanya dirender saat `NODE_ENV=development`, mengisi form saja, dan tidak melakukan login otomatis.

**Dikerjakan:**

- `frontend/app/landing/page.tsx` dan `frontend/components/landing/*`: landing dirombak menjadi peta rute kebutuhan → tutor → jadwal → WhatsApp, dengan responsive sections dan CTA funnel tetap.
- `frontend/app/login/page.tsx`: auth surface baru, toggle Masuk/Daftar tanpa reload, signup member, login email/nomor WhatsApp, dan quick-fill Admin/Tentor/Wali/Member.
- `frontend/app/signup/page.tsx`: kompatibilitas route diarahkan ke tab Daftar.
- `frontend/app/globals.css`: material grid peta, auth grid, dan motion route dengan reduced-motion fallback.
- `backend/prisma/seed.ts`: fixture development `member@nurmancourse.com` ditambahkan; seed tidak dijalankan.
- `frontend/tests/auth-surface.test.mjs`: test kontrak toggle, production guard quick-fill, dan fixture Member.

**Verifikasi:**

- Auth surface test: **3/3 lulus**.
- Frontend TypeScript check: lulus.
- Frontend lint: lulus.
- Frontend production build: lulus.
- Browser QA lokal: landing desktop/mobile dan auth desktop/mobile termuat; toggle Daftar bekerja tanpa reload; quick-fill Member mengisi email/password; console tidak memiliki error/warning.
- Impeccable detector: hanya advisory grid background yang disengaja sebagai material peta; tidak ada error mekanis.
- Review lanjutan memperbaiki akses mode register untuk session aktif dan sign-out saat profile DB gagal.
- Tidak ada migration, seed, mutasi DB remote, commit, push, atau deploy.

**Residual dan batas bukti:**

- Browser QA membuktikan layout dan interaksi lokal, bukan auth/login remote atau deployment production.
- Akun Member fixture baru ada di source seed; seed belum dijalankan, sehingga tombol hanya akan login jika akun sudah tersedia di environment development.
- Working tree memiliki perubahan lain yang sudah ada sebelum sesi ini; tidak direvert.

### 2026-09-18 — Role `member` dan signup publik content-only

**Request:** aktifkan role member.

**Keputusan:** signup publik memakai email/password, email wajib diverifikasi, nomor WhatsApp opsional, dan member hanya memiliki akses content surface. Role operasional tetap `admin|tentor|wali`; member tidak boleh masuk portal operasional.

**Dikerjakan:**

- `packages/shared/src/index.ts`: `UserRole`/`userRoleSchema` menambahkan `member`; `User.phone` nullable; kontrak `memberSignupSchema` password minimal 8 karakter.
- `backend/prisma/schema.prisma`: `User.phone` menjadi nullable.
- `backend/prisma/migrations/nc7_member_phone_nullable/migration.sql`: nullable phone, CHECK role, dan trigger private `auth.users → public.users` yang membuat profile `member` hanya untuk signup tanpa role metadata. Function tidak executable oleh `PUBLIC`.
- `backend/src/index.ts`: `POST /api/auth/signup` memakai Supabase `auth.signUp`, validasi shared schema, neutral duplicate response, dan tidak memakai service-role key.
- `backend/src/middleware/auth.ts`: `requireOperational` membatasi endpoint operasional ke `admin|tentor|wali`; member tidak jatuh ke cabang admin.
- `backend/src/middleware/http-security.ts`: signup mendapat rate limit auth.
- `frontend/app/signup/page.tsx`: form signup dan state konfirmasi email.
- `frontend/middleware.ts` dan `frontend/app/login/page.tsx`: routing memakai role dari `/api/users/me` (DB authority), bukan `user_metadata`; member diarahkan ke `/app/materi`.
- `backend/prisma/seed.ts`: user seed memakai upsert agar kompatibel dengan trigger profile.

**Verifikasi:**

- Backend API: **188/188 lulus**; typecheck source/test lulus; lint 0 error dengan 14 warning `any` baseline.
- Frontend typecheck, lint, dan production build lulus.
- Prisma validate lulus dengan env dummy.
- Remote `prisma migrate deploy` berhasil menerapkan `nc7_member_phone_nullable`.
- Remote: role CHECK aktif, phone nullable, trigger member aktif, 13 Auth = 13 profile, 0 member/0 nullable phone existing, semua role valid.
- Smoke signup Supabase berhasil dengan `session=false` (email verification wajib), trigger membuat profile `member`, lalu akun/profile smoke dibersihkan.
- Tidak ada literal frontend/backend `user_metadata?.role` yang dipakai untuk routing/guard; metadata role tetap hanya dikirim oleh provisioning staff legacy dan fixture tests.

**Residual dan batas bukti:**

- Email delivery/klik verifikasi belum diuji di browser; hanya signup API/Supabase dan session absence diverifikasi.
- Migration sudah diterapkan pada remote development, bukan production.
- Tidak ada commit, push, atau deploy.

### 2026-09-18 — Rebrand materi `Belajar.dev` menjadi `ncourse`

**Request:** ganti brand `Belajar.dev` ke `ncourse` pada frontend/backend string literals dan data development.

**Dikerjakan:**

- `frontend/components/content/ContentShell.tsx`: wordmark header materi diubah menjadi `ncourse`.
- Audit repository tidak menemukan literal `Belajar.dev`, `belajar.dev`, atau `belajar-dev` lain pada backend/shared maupun konfigurasi yang perlu diubah.
- Audit remote development tidak menemukan nilai `belajar.dev` pada tabel seed; tidak ada migration atau update data remote yang diperlukan.

**Verifikasi:**

- Search source terarah untuk seluruh variasi wordmark lama: tidak ada hasil.
- Perubahan hanya menyentuh UI content shell; route, domain, email, dan brand `Nurman Course` pada funnel/portal tidak diubah.

**Residual dan batas bukti:**

- Browser visual QA belum dijalankan.

### 2026-09-18 — Remote reset, migration `0_init`, dan seed besar terverifikasi

**Request:** reset schema remote development, terapkan migration tunggal, hapus Auth lama, jalankan seed besar, dan verifikasi hasilnya.

**Dikerjakan:**

- Koneksi Prisma pulih tanpa perubahan source; DNS lookup dan PostgreSQL SSL probe ke seluruh IP pooler berhasil, lalu `prisma migrate status` dapat terhubung ke session pooler port 5432.
- State awal berisi 10 akun Auth, tabel aplikasi kosong, dan history `0_init` lama yang tidak mencerminkan migration hasil squash saat ini.
- `npx prisma migrate reset --force --skip-seed --schema prisma/schema.prisma` berhasil mereset schema `public` dan menerapkan current `0_init` tepat sekali.
- Seed pertama melewati timeout shell setelah membuat data parsial; seed dijalankan ulang dengan guard `NC_SEED_ALLOW_REMOTE_RESET=true`. Karena seed selalu membersihkan Auth dan database terlebih dahulu, rerun selesai dari state bersih.
- 10 akun Auth lama dihapus dan diganti 13 akun seed development dengan password demo yang telah disepakati.

**Verifikasi remote:**

- Prisma migration: hanya `0_init`, `finished_at` terisi, tidak rollback, dan `prisma migrate status` melaporkan schema up to date.
- Auth/aplikasi: 13 Auth user sama dengan 13 profile; seluruh email confirmed dan profile aktif, terdiri dari 1 admin, 4 tentor, dan 8 wali.
- Smoke login Supabase berhasil untuk `admin@nurmancourse.com`, `tentor1@nurmancourse.com`, dan `wali1@nurmancourse.com`.
- Fixture: 16 murid, 5 Program, 5 roadmap step, 5 material item, 5 session, 5 enrollment, 5 invoice, 2 payment account, 2 daily report, 5 progress report, 5 progress, 12 Course, 36 Section, 180 Lesson, 6 entitlement, dan 30 lesson progress.
- `prepayments=0` dan `tracking_events=0` sesuai seed; tracking baru terisi oleh aktivitas runtime.
- Keempat CHECK constraint domain tersedia. RLS aktif default-deny pada sembilan tabel content/tracking dan tidak ada grant tabel kepada `PUBLIC`, `anon`, atau `authenticated` pada tabel yang diverifikasi.

**Residual dan batas bukti:**

- Security advisor melaporkan sembilan tabel RLS aktif tanpa policy; ini sesuai desain default-deny karena akses melalui Express/Prisma. Operational tables masih tanpa RLS tetapi tidak memiliki grant Data API pada pemeriksaan ini.
- Supabase Auth leaked-password protection masih disabled.
- Password database dan service-role key yang pernah tampil harus dirotasi melalui Supabase Dashboard, lalu `backend/.env` diperbarui; rotasi belum dapat dilakukan melalui tool sesi ini.
- Verifikasi membuktikan remote development database/Auth saat ini, bukan deployment production atau browser QA. Tidak ada commit, push, atau deploy.

### 2026-09-18 — MTR-14 backend-backed content cutover siap lokal

**Request:** lanjut backend, siapkan seed besar, tracking user/login/read lesson, read count, dan pastikan halaman materi benar-benar siap memakai backend.

**Dikerjakan:**

- `backend/prisma/schema.prisma`: menambah `Lesson.readCount`, `TrackingEvent`, enum `TrackingEventType`, relasi/index, dan constraint domain.
- Migration lama di-squash secara lokal menjadi `backend/prisma/migrations/0_init/migration.sql`; SQL menambahkan CHECK, RLS, dan REVOKE. Migration remote belum dijalankan.
- `backend/prisma/seed.ts`: seed development guard, reset Auth, 13 user aplikasi, 16 murid, 5 Program operational, 12 Course, 180 Lesson, access tier/visibility/status, entitlement aktif/expired/revoked/multi-source, progress, sesi, invoice, laporan, dan read count awal. Seed remote mensyaratkan `NC_SEED_ALLOW_REMOTE_RESET=true`.
- `backend/src/routes/tracking/tracking.ts`: POST login tracking, GET admin tracking pagination/filter, DELETE admin tracking tanpa reset counter; IP/User-Agent dibatasi panjangnya.
- `backend/src/routes/reader/reader.ts`: successful allowed reader menaikkan read count atomik dan mencatat `lesson_read`; denied/unknown tidak dihitung; response memuat `readCount` dan `completed`.
- `backend/src/routes/catalog/`: `GET /api/catalog/lessons` flat catalog, `GET /api/catalog/paths`, DTO/search/filter/pagination.
- `backend/src/routes/me/membership.ts`: `GET /api/me/lesson-progress` completed slug user sendiri.
- Frontend `/materi`, `/kelas/[slug]`, `/materi/[slug]`, `/jalur-belajar` sekarang memakai API backend; runtime dataset dummy dan local progress fallback dihapus. Login tracking best-effort tetap tidak menggagalkan login.
- Legacy content tests diperbarui mengikuti DTO allowlist `select` yang sudah dipakai route.

**Verifikasi:**

- Backend API suite: **180/180 lulus**.
- Backend typecheck, test typecheck, lint, artifact build: lulus; lint memiliki 14 warning `any` baseline, 0 error.
- Frontend lint, typecheck, dan build: lulus.
- Migration Prisma format/validate/generate: lulus lokal.
- `git diff --check`: lulus; warning LF→CRLF normal.

**Residual dan batas bukti:**

- Belum ada migration deploy, reset schema, penghapusan Auth, atau seed remote; semua operasi destructive tetap menunggu konfirmasi eksplisit terakhir.
- Belum ada runtime DB terisolasi/live verification, RLS/Data API verification, login live, atau browser QA sesuai instruksi user.
- `readCount` menghitung setiap successful reader request, termasuk anonymous; event menyimpan IP/User-Agent sesuai keputusan dev.
- Test client standalone pernah timeout karena batas waktu subprocess; test API dan build tetap lulus.
- Percobaan reset remote 2026-09-18 berhenti sebelum mutasi: Prisma gagal konek ke Supabase pooler (`P1001`) pada port 5432/6543. Supabase MCP dapat query database, tetapi schema/Auth/seed remote belum diubah.
- Supabase advisor mendeteksi RLS disabled pada 14 tabel existing; remediation belum dijalankan karena policy existing belum dipetakan.

# Progress — Nurman Course

> Ledger aktif keputusan, milestone, verifikasi, dan residual. Checklist ada di [tasks/todo.md](../tasks/todo.md); arah backend ada di [GOALS.md](../GOALS.md).

## Status saat ini — 2026-09-17

**Fokus:** backend-first, branch `be-restruktur`.

**Milestone terakhir:** Bagian 5 backend NC-2 selesai untuk scope offline.

Selesai lokal:

- backend dependency/runtime patch, auth DB-backed, HTTP hardening, artifact build, dan lint scoped;
- ekstraksi router legacy content;
- schema additive `Course`, `Section`, `Lesson` dan migration SQL offline;
- API authoring admin/tentor dengan ownership, DTO, reorder, draft/publish;
- validasi link internal `/materi/*`;
- backfill content dry-run yang atomic, idempotent, dan fail-closed.

Belum dilakukan atau belum disetujui:

- migration deploy dan backfill ke DB live;
- audit count content live dan QA DB terisolasi;
- keputusan item `MaterialItem` ambiguous/conflict/orphan;
- drop `MaterialItem.sessionId`/FK legacy;
- frontend writer/reader cutover;
- entitlement, katalog publik, dan deployment.

## Keputusan aktif

| Area | Keputusan |
|---|---|
| Arah | Backend-first; frontend dikerjakan setelah contract dan migration gate siap |
| Entitas | `Program` untuk layanan les; `Course` untuk konten mandiri; tidak digabung |
| Akses | Role menentukan operasi; entitlement menentukan akses content |
| Identitas | Verified Supabase user ID; role dan active berasal dari DB |
| Author | Admin semua content; tentor hanya `authorId` miliknya |
| Transisi | Satu writer authoritative; legacy tetap kompatibel sampai frontend cutover |
| Content | `Course → Section → Lesson`; Markdown; slug lesson global |
| Migration | Expand → backfill → verify → contract; tidak drop legacy lebih awal |
| Pembayaran | Manual one-time; payment gateway/subscription belum diputuskan |
| MTR-0 akses | Public tanpa login; Course free wajib login tanpa auto-grant; Course paid wajib entitlement aktif; purchase lifetime |
| MTR-0 entitlement | Multi-baris per User-Course-Source; satu source aktif cukup memberi akses |
| MTR-0 pembaca/API | Role existing dahulu; reader 401/403/404 tanpa body leak; namespace catalog/reader/me |
| Infra | Tidak menambah infra baru tanpa keputusan terpisah |

## Milestone sebelumnya

- **Bagian 1:** dependency runtime backend selesai.
- **Bagian 2:** role DB/inactive lokal selesai; rollout tertahan lima Auth tanpa profil.
- **Bagian 3:** Helmet, CORS, limiter, parser/error boundary selesai; payload masih 100 KB.
- **Bagian 4:** artifact build, lint backend, audit `MaterialItem.sessionId`, dan mapping plan selesai offline.
- **Bagian 5:** modularisasi content, schema/migration, authoring API, link validation, dan backfill dry-run selesai offline.

## Verifikasi terakhir

- `npm run typecheck --workspace=backend` — exit 0.
- `npm run typecheck:test --workspace=backend` — exit 0.
- `npm run lint --workspace=backend` — exit 0; 14 warning `any` baseline (0 error).
- `git diff --check` — lulus; warning LF→CRLF hanya normalisasi line-ending.
- Prisma format/validate/generate dan migration diff — berhasil offline.
- Test backend terakhir 173/173 lulus sebelum user menghentikan penambahan test baru.

Verifikasi lokal tidak membuktikan DB live, auth staging, browser, deployment, atau engine OS target lain.

## Blocker dan residual

1. Lima akun Supabase Auth belum memiliki profil aplikasi; rollout auth ditahan.
2. Parser JSON masih 100 KB; ukuran payload belum diputuskan.
3. Migration/backfill live belum mendapat izin dan belum dijalankan.
4. Mapping `MaterialItem.sessionId` masih membutuhkan hitungan data dan keputusan untuk ambiguous/conflict/orphan.
5. Endpoint legacy `/api/programs*` masih dapat membawa `RoadmapStep.bodyText`; NC-3.4 adalah release blocker sebelum katalog publik.
6. Frontend masih memakai metadata role.
7. Payload pembayaran UI/API mismatch: `paymentProof`/`paymentProofName` versus `proofBase64`/`proofName`.
8. API authoring belum memiliki frontend writer.

## Approval gates

- DB audit, migration deploy, backfill, seed, dan schema contract memerlukan izin DB eksplisit.
- Browser, login nyata, dan QA frontend memerlukan task serta izin terpisah.
- Commit, push, merge, dan deploy memerlukan permintaan eksplisit.
- Setiap checkpoint berikutnya wajib memperbarui `tasks/todo.md` dan file ini.

## Catatan sesi

### 2026-09-18 — Katalog bebas lesson dan jalur belajar terpandu

**Request:** ubah `/materi` menjadi katalog bergaya shopping card untuk semua lesson; dukung search setelah tombol, topik, level, jumlah dibaca, pagination, dan halaman jalur terurut.

**Dikerjakan:**

- `frontend/data/belajar-dasar.ts`: metadata topic, level `Pemula|Dasar|Project`, seeded read count stabil, flatten helper semua lesson, dan format angka dibaca.
- `frontend/components/content/LessonCatalogCard.tsx`: card lesson dengan topik, level, durasi, jumlah dibaca, status gratis, dan status sudah dibaca lokal.
- `frontend/lib/learning-progress.ts`: snapshot progress lokal bersama untuk reader dan katalog.
- `frontend/app/materi/page.tsx`: katalog bebas 12 card/page, search via submit, topik multi-select, level single-select, query URL, relevansi sederhana, pagination, empty/reset state.
- `frontend/app/jalur-belajar/page.tsx`: jalur tiga tahap dengan urutan lesson, progress lokal, CTA lesson berikutnya, serta link kembali ke katalog bebas.
- `frontend/components/content/ContentShell.tsx`: navigasi header menambahkan Jalur Belajar.
- `frontend/components/content/LessonReader.tsx`: progress reader dipindahkan ke helper shared.

**Verifikasi:**

- `npx tsc --project frontend/tsconfig.json --noEmit` — exit 0.
- `npm run lint --workspace=frontend` — exit 0.
- `npm run build --workspace=frontend` — exit 0; route `/materi` dan `/jalur-belajar` terdeteksi.
- Impeccable detector — hanya warning divider `border-b-2` pada surface rounded yang sudah menjadi grammar worksheet.
- `git diff --check` — lulus; warning line-ending LF→CRLF normal.

**Residual dan batas bukti:** browser screenshot/runtime QA belum dijalankan. Read count masih seeded dummy dan progress masih local-only; integrasi analytics/backend tetap pekerjaan terpisah.


**Request:** buat tampilan materi gratis dan katalog lengkap yang mudah dibaca user pemula, mobile-friendly, memakai data dummy: lingkungan coding, instalasi tools basic, dan belajar HTML.

**Dikerjakan:**

- `frontend/data/belajar-dasar.ts`: tiga jalur belajar dengan 13 lesson, tujuan per jalur, durasi, level, latihan, dan project profil HTML.
- `frontend/components/content/CourseCard.tsx`: kartu katalog menampilkan langkah, jumlah lesson, total durasi, status gratis, dan CTA yang konsisten.
- `frontend/components/content/CourseDetail.tsx`: detail kelas dummy dengan tujuan belajar, durasi, urutan lesson, dan CTA mulai.
- `frontend/components/content/LessonReader.tsx`: reader gratis berbasis data lokal, daftar isi desktop, prev/next, progress `localStorage`, dan navigasi mobile.
- `frontend/components/content/SafeMarkdown.tsx`: typography reader diselaraskan dengan dunia visual “meja praktik”, code block, checklist, link, dan blockquote lebih mudah dibaca.
- `frontend/app/materi/[slug]/page.tsx`: `key` slug ditambahkan agar state progress berganti stabil saat navigasi client-side.

**Verifikasi:**

- `npx tsc --project frontend/tsconfig.json --noEmit` — exit 0.
- `npm run lint --workspace=frontend` — exit 0.
- `npm run build --workspace=frontend` — exit 0.
- Impeccable detector — 4 warning divider `border-b-2` pada surface rounded, tanpa error; dipertahankan sebagai bagian grammar worksheet.
- `git diff --check` — lulus dengan warning line-ending LF→CRLF normal.

**Residual dan batas bukti:** browser screenshot/runtime QA tidak dijalankan. Data dummy belum menjadi source production API; saat backend live diaktifkan, client API perlu diintegrasikan kembali tanpa mengubah kontrak visual dan struktur konten.


**Request:** lanjut langsung ke MTR berikutnya tanpa menunggu runtime/DB gate; browser test kemudian dibatalkan user.

**Dikerjakan:**

- `/materi`: katalog Course dengan search, category/level/access filter, pagination, loading/error/empty state, dan badge akses.
- `/kelas/[slug]`: detail Course dan outline terurut; semua lesson mengarah ke reader untuk state public/login/purchase.
- `/materi/[slug]`: reader body hasil guarded API, breadcrumb, heading hierarchy, daftar isi, prev/next, login-required, purchase-required, dan update progress.
- `/app/materi`: library private/no-cache dengan progress ringkas; link ditambahkan ke navigasi wali dan route diizinkan untuk tentor login.
- Login return memakai `next` relative-path tervalidasi anti-open-redirect; `redirectedFrom` lama tetap didukung.
- `frontend/lib/api.ts`: GET sensitif (`/api/me`, `/api/users/me`, `/api/reader`, `/api/programs`) tidak disimpan pada cache global; error menjaga HTTP status dan code.
- Markdown memakai `react-markdown`, `remark-gfm`, dan `rehype-sanitize`; raw HTML tidak diaktifkan dan gambar Markdown diblok.

**Verifikasi:** frontend TypeScript, ESLint, dan production build berhasil; route `/materi`, `/materi/[slug]`, `/kelas/[slug]`, dan `/app/materi` terdeteksi pada output build. Impeccable detector tidak menemukan pelanggaran mekanis. Backend source/test typecheck tetap lulus setelah integrasi contract.

**Residual dan batas bukti:** browser/runtime QA tidak dijalankan atas instruksi user. DB/RLS/auth live, migration deploy, backend runtime suite, entitlement issuance, dan purchase flow belum diverifikasi. `npm audit --omit=dev` frontend masih melaporkan satu moderate advisory transitive `baseline-browser-mapping`.

### 2026-09-18 — MTR-5 sampai MTR-9 selesai lokal dengan residual verifikasi

**Request:** lanjut MTR-5–MTR-9.

**Dikerjakan:**

- `backend/src/routes/catalog/`: katalog Course published/active dengan pagination bounded, search/filter, ordering stabil, DTO metadata allowlist, author publik minimum, count published lesson, dan outline tanpa body.
- `backend/src/routes/reader/`: reader lesson dengan optional-auth, access policy terpusat, 401/403/404 contract, body hanya setelah access allowed, breadcrumb, prev/next yang hanya menunjuk lesson accessible, dan cache public wajib revalidate/private no-store.
- Review adversarial memperbaiki navigasi paywall, tier-null library mismatch, entitlement history exposure, legacy Data API grants, dan explicit legacy DTO.
- `backend/prisma/schema.prisma` + `nc5_lesson_progress`: `LessonProgress` terpisah dari progress Murid/RoadmapStep, unique User-Lesson, dan index user/update.
- `backend/src/routes/me/membership.ts`: entitlement milik user sendiri, library Course yang free/entitled aktif, progress ringkas, dan update progress idempotent setelah access policy.
- `backend/src/routes/content/programs-public.ts`: compatibility guard legacy `/api/programs*`; anonymous tidak menerima `RoadmapStep.bodyText`, user aktif hanya menerima body untuk Program dengan enrollment aktif/role admin; DTO legacy eksplisit.
- `backend/prisma/migrations/nc6_content_data_api_lockdown/migration.sql`: RLS + revoke `PUBLIC`/`anon`/`authenticated` untuk content legacy (`programs`, `roadmap_steps`, `material_items`) dan content baru (`courses`, `sections`, `lessons`), entitlement, dan progress; tetap offline.
- `packages/shared/src/index.ts`: author, entitlement, library, progress DTO dan schema progress.
- `frontend/.env.example` diaudit: service-role tidak memakai prefix public; tidak diubah.

**Verifikasi:**

- `npm run typecheck --workspace=backend` — exit 0.
- `npm run typecheck:test --workspace=backend` — exit 0.
- `npm run lint --workspace=backend` — exit 0; 14 warning `any` baseline, 0 error.
- Prisma format/validate/generate — berhasil dengan URL dummy lokal.
- `git diff --check` — lulus; warning LF→CRLF hanya normalisasi line-ending.
- Static audit route/DTO menemukan `bodyText` hanya di reader success dan legacy/admin protected paths.

**Residual dan batas bukti:**

- Backend runtime suite, artifact test, dan build tidak dijalankan pada sesi ini; contract runtime MTR-9 belum terbukti penuh.
- Migration `nc5`/`nc6`, migration content sebelumnya, RLS, grants, Data API, DB terisolasi, auth live, dan deployment belum dijalankan.
- Legacy `/api/programs*` masih mempertahankan body untuk enrolled wali/tentor/admin demi compatibility; release gate tetap memerlukan frontend cutover sebelum surface itu dapat dihapus total.
- Tidak ada frontend reader, browser QA, purchase writer, entitlement issuance, atau commit/push.



**Request:** lanjut MTR-3 dan MTR-4 memakai todo, kemudian push.

**Dikerjakan:**

- `backend/prisma/schema.prisma`: enum `EntitlementSource`, model `Entitlement`, relasi User/Course, unique per source, index active lookup.
- `backend/prisma/migrations/nc4_entitlements/migration.sql`: migration additive offline, FK cascade, index, RLS enabled default-deny.
- `packages/shared/src/index.ts`: enum source entitlement.
- `backend/src/middleware/auth.ts`: resolver optional-auth terpusat; anonymous hanya tanpa Authorization, token malformed/invalid/expired ditolak, role/active tetap dari DB; `requireAuth` mempertahankan response legacy.
- `backend/src/content/access.ts`: policy Course/Lesson terpusat untuk public, login-free, paid-entitlement, expiry, revoke, published/active gate; tidak auto-grant.
- `backend/tests/setup.ts`: boundary stub entitlement untuk policy berikutnya.

**Verifikasi:** Prisma format/validate/generate berhasil offline dengan env dummy; backend typecheck dan test typecheck exit 0; backend lint exit 0 dengan 14 warning baseline; `git diff --check` lulus. Tidak ada `migrate deploy`, `db push`, query live, seed, frontend, atau endpoint publik baru.

**Review adversarial:** menemukan dan memperbaiki future `publishedAt`, identity stale pada optional-auth, test boundary entitlement yang belum terpasang, `sourceRef` kosong, dan default timestamp `updatedAt`. RLS `FORCE` tidak dipakai karena Prisma server adalah privileged boundary; migration mencabut grant `anon`/`authenticated` sampai audit MTR-8.

**Residual:** policy belum dipasang ke MTR-5/MTR-6 route; migration belum live; RLS policy Data API menunggu MTR-8; test langsung MTR-3/MTR-4 belum ditambahkan sesuai instruksi sesi sebelumnya untuk menunda test baru.

### 2026-09-18 — MTR-1 dan MTR-2 selesai: kontrak API dan identity boundary

**Request:** lanjut MTR-1 dan MTR-2.

**Keputusan:** optional-auth menerima anonymous hanya bila Authorization tidak dikirim; bearer malformed/invalid/expired ditolak 401. Metadata publik boleh public cache, sedangkan reader authenticated/paid private/no-store. Pembaca fase awal tetap role admin/tentor/wali; tidak menambah `member`, phone nullable, provisioning, atau migration identity.

**Dikerjakan:**

- `packages/shared/src/index.ts`: menambah schema query katalog dengan pagination bounded, DTO allowlist katalog/detail/outline, discriminated reader success/error contract, breadcrumb, prev/next, dan access requirement.
- `tasks/todo.md`: MTR-1.1–1.5 dan MTR-2.1–2.4 ditutup; checkpoint C1 selesai.
- Threat model menetapkan `bodyText` sebagai aset utama; jalur risiko meliputi nested relation, legacy endpoint, search/navigation, cache lintas user, dan Data API. Mitigasi berikutnya diwajibkan melalui DTO allowlist, satu access policy, private caching, RLS default-deny, dan negative checks.

**Verifikasi:** shared/backend typecheck dan backend lint dijalankan setelah perubahan. Tidak ada endpoint, optional-auth middleware runtime, schema Prisma, migration, database, atau frontend yang diubah.

**Referensi resmi:** Supabase merekomendasikan verifikasi user server-side dan melarang `user_metadata` sebagai authority; changelog 2026-04-28 juga menegaskan exposure Data API tabel baru berubah dan tetap perlu audit grants/RLS. Express Router mendukung middleware namespace/route; implementasi runtime ditunda ke MTR-4.

**Residual:** MTR-3 Entitlement schema dan MTR-4 access policy/optional-auth runtime masih pending. Legacy `/api/programs*` tetap release blocker.

### 2026-09-18 — MTR-0 kontrak akses materi/blog selesai

**Request:** kerjakan MTR-0 saja terlebih dahulu.

**Keputusan:** Course free memakai cek login langsung tanpa auto-grant; paywall memakai 401/403/404 tanpa `bodyText`; purchase default lifetime; entitlement multi-baris per source; pembaca fase awal memakai role existing; namespace API `/api/catalog/*`, `/api/reader/*`, `/api/me/*`.

**Dikerjakan:** MTR-0.1–MTR-0.6 ditandai selesai di `tasks/todo.md`; keputusan diringkas di `GOALS.md` dan tabel keputusan file ini.

**Verifikasi:** seluruh enam keputusan memiliki nilai final dan tidak saling bertentangan: free tidak membutuhkan row entitlement, paid membutuhkan minimal satu source aktif, revoke satu source tidak mematikan source lain. Tidak ada perubahan source, schema, migration, dependency, database, atau frontend.

**Residual:** MTR-1 kontrak API/threat model masih pending. Schema/API belum boleh diimplementasikan sampai MTR-1 dan checkpoint kontrak selesai.

### 2026-09-18 — Checklist lengkap materi/blog ditambahkan, belum dieksekusi

**Request:** buat todo lengkap untuk materi yang dapat diakses publik, wajib login, atau wajib beli; jangan eksekusi sebelum task lengkap.

**Keputusan:** sesi ini planning-only. Tidak ada keputusan final tentang free auto-grant, masa akses purchase, multiple entitlement source, role `member`, atau response paywall; seluruhnya menjadi gate MTR-0.

**Dikerjakan:** `tasks/todo.md` ditambah MTR-0–MTR-12: kontrak akses, threat model/API, identity prerequisite, Entitlement, access policy, katalog, reader, library/progress, penutupan legacy/Data API, verifikasi backend, halaman reader, authoring UI, dan purchase flow.

**Verifikasi:** checklist memisahkan checkpoint contract, backend foundation, read API, frontend reader, serta authoring/purchase; seluruh checkbox baru tetap pending. Tidak ada source, schema, migration, dependency, database, atau frontend yang diubah.

**Residual:** user perlu menyetujui MTR-0.1–MTR-0.6 sebelum implementasi dimulai. `frontend/PRODUCT.md` merupakan file untracked hasil init Impeccable dari perintah sebelumnya dan tidak diubah pada sesi checklist ini.

### 2026-09-17 — Dokumentasi dipadatkan ke backend-first

**Request:** hapus Markdown yang sudah tidak relevan dan buat fokus utama backend.

**Dikerjakan:**

- Menambahkan `GOALS.md` sebagai pusat arah, urutan goal, blocker, dan gate.
- Memadatkan `AGENTS.md`, `README.md`, dan `SYSTEM_MAP.md` agar sesuai monorepo/backend aktual.
- Memadatkan `tasks/todo.md` menjadi checklist backend aktif.
- Memadatkan progress menjadi keputusan dan residual aktif.
- Menghapus roadmap/plan/design lama setelah informasi aktif dipindahkan ke dokumen inti.

**Verifikasi:**

- Referensi ke tujuh dokumen yang dihapus tidak tersisa pada Markdown aktif.
- `git diff --check` lulus; warning LF→CRLF hanya normalisasi line-ending.
- `npm run lint --workspace=backend` exit 0 dengan 14 warning `any` baseline dan tanpa error.
- `npm run typecheck --workspace=backend` serta `npm run typecheck:test --workspace=backend` exit 0.

**Residual:**

- Histori detail lama tidak lagi berada di file aktif; dapat dipulihkan dari Git bila diperlukan.
- Tidak ada perubahan kode aplikasi, schema, data, migration deployment, atau frontend.
