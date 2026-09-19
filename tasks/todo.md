# Tasks — Backend Focus

> Checklist aktif. Arah dan prioritas: [GOALS.md](../GOALS.md). Keputusan dan bukti: [PROGRESS.md](../docs/PROGRESS.md).

## Aturan sesi

- Satu fokus utama per sesi.
- Backend dahulu; frontend hanya setelah gate backend dan task khusus.
- Tidak ada migration deploy, backfill live, seed, mutasi DB remote, commit, push, atau deploy tanpa izin eksplisit.
- Verifikasi wajib dicatat bersama batas buktinya.

## Sesi frontend 2026-09-19 — selesai lokal

- [x] Redesign landing “Peta Belajar” dengan biru/logo existing dan funnel `/course` tetap.
- [x] Gabungkan login/register pada `/login` tanpa full-page reload; `/signup` kompatibel melalui mode register.
- [x] Quick-fill dummy Admin, Tentor, Wali, Member hanya pada development dan hanya mengisi form.
- [x] Fixture seed Member ditambahkan tanpa menjalankan seed.
- [x] Test auth surface, frontend typecheck, lint, build, dan detector dijalankan.
- [x] Browser screenshot/console/accessibility QA.
- [x] Redesign funnel `/course/program` → materi/jenjang/calistung → level → config dengan komposisi Peta Belajar mobile-first; route, copy, pricing, data, dan WhatsApp authority tetap.
- [x] Verifikasi funnel redesign: 9/9 regression test auth/funnel, typecheck, lint, build, detector, browser QA, dan review fixes.


- [x] Dependency runtime backend dipatch dan diverifikasi.
- [x] Auth backend memakai verified Supabase ID serta role/active dari DB.
- [x] HTTP hardening, error boundary, limiter, dan parser boundary tersedia.
- [x] Backend artifact build dan lint scoped tersedia.
- [x] Router legacy content diekstrak tanpa mengubah kontrak lama.
- [x] Schema additive `Course`, `Section`, `Lesson` dan migration SQL offline dibuat.
- [x] API authoring admin/tentor, ownership, DTO, reorder, draft/publish dibuat.
- [x] Validasi link internal `/materi/*` dibuat tanpa fetch eksternal.
- [x] Backfill content dry-run dibuat: atomic, idempotent, fail-closed.

### Tracking dan seed development — fase aktif

- [x] Schema `Lesson.readCount` dan `TrackingEvent` (`login|lesson_read`) ditambahkan.
- [x] Migration history lokal di-squash menjadi `prisma/migrations/0_init` dari schema lengkap; RLS, REVOKE, dan CHECK domain ditambahkan.
- [x] Seed development besar ditulis dengan 13 user aplikasi, reset Auth, data portal, 12 Course, 180 Lesson, entitlement, progress, dan read count awal.
- [x] Guard seed remote ditambahkan: remote hanya boleh di-reset dengan `NC_SEED_ALLOW_REMOTE_RESET=true`.
- [x] Shared DTO catalog outline dan reader memuat `readCount`.
- [x] Reader sukses menaikkan `readCount` atomik dan menyimpan event `lesson_read`; request denied tidak dihitung.
- [x] Tracking login best-effort ditambahkan setelah Supabase login berhasil.
- [x] Endpoint admin tracking list/filter/delete ditambahkan; delete event tidak mereset read count.
- [x] Test route tracking, read count, catalog paths, dan lesson progress ditambahkan; test API lulus 180/180.
- [x] Jalankan migration tunggal, hapus Auth remote, seed remote, dan verifikasi count setelah konfirmasi eksplisit.
- [x] Rebrand wordmark materi `Belajar.dev` menjadi `ncourse`; audit backend/shared dan remote seed tidak menemukan nilai lama.
- [x] Tambahkan role `member`, phone nullable, signup publik email/password, verifikasi email, dan profile DB otomatis.
- [x] Batasi member ke content surface; endpoint operasional dan routing portal memakai role DB.
- [x] Terapkan migration `nc7_member_phone_nullable` ke remote development dan smoke-test signup/profile trigger.



> **Status: planning only.** Belum ada implementasi, migration deploy, atau perubahan DB. Eksekusi dimulai hanya setelah checklist dan keputusan MTR-0 disetujui user.
>
> Target produk: konten `Course → Section → Lesson` dengan tiga akses: **publik**, **login gratis**, dan **wajib beli**. Backend selalu menentukan apakah `bodyText` boleh dikirim.

### MTR-0 — Kunci kontrak produk dan akses (blocking)

- [x] **MTR-0.1** Course `free`: lesson `entitled` dapat dibaca langsung oleh user login yang valid; tidak membuat entitlement otomatis dari GET.
- [x] **MTR-0.2** Respons reader: anonymous/akses login diperlukan → `401 LOGIN_REQUIRED`; user login tanpa entitlement purchase → `403 PURCHASE_REQUIRED`; draft/inactive/tidak ada → `404`; respons gagal tidak membawa `bodyText`.
- [x] **MTR-0.3** Purchase default lifetime dengan `expiresAt=null`; dukungan expiry tetap disiapkan di schema untuk kebutuhan berikutnya.
- [x] **MTR-0.4** Entitlement memakai multi-baris per `(user, course, source)`; akses tetap aktif jika minimal satu source belum revoked dan belum expired.
- [x] **MTR-0.5** Fase operasional memakai role `admin`, `tentor`, dan `wali`; role `member` menjadi pembaca content-only melalui signup publik email/password terverifikasi.
- [x] **MTR-0.6** Namespace disetujui: `/api/catalog/*` untuk metadata publik, `/api/reader/*` untuk body terjaga, `/api/me/*` untuk library/progress.

**Gate MTR-0:** selesai 2026-09-18. Implementasi schema/API tetap mengikuti urutan MTR-1 dan checkpoint berikutnya.

### MTR-1 — Kontrak API dan threat model

- [x] **MTR-1.1** DTO allowlist katalog Course, outline Section/Lesson, reader success, login-required, dan purchase-required ditambahkan ke `packages/shared`; reader DTO success saja yang membawa `bodyText`.
- [x] **MTR-1.2** Zod query `page`, `limit`, `search`, `category`, `level`, dan `accessTier` ditambahkan; limit server-side maksimal 100.
- [x] **MTR-1.3** Kontrak optional-auth ditetapkan: anonymous boleh untuk catalog/public reader; malformed/invalid/expired bearer tidak boleh diam-diam dianggap anonymous.
- [x] **MTR-1.4** Threat model ditetapkan untuk catalog, detail, reader, nested relation, legacy `/api/programs*`, search/navigation, cache, dan Supabase Data API.
- [x] **MTR-1.5** Cache contract ditetapkan: metadata publik boleh public cache; reader authenticated/paid wajib private/no-store.

**Acceptance:** kontrak input/output/error tersedia di shared types; `bodyText` hanya boleh muncul pada `ReaderLessonDto` success.

### MTR-2 — Identity prerequisite pembaca

- [x] **MTR-2.1** Keputusan MTR-0.5 memilih role existing; audit role/auth middleware/caller dilakukan dan tidak ada role `member` baru.
- [x] **MTR-2.2** `User.phone` nullable untuk member; akun operasional existing tetap memakai nomor WhatsApp.
- [x] **MTR-2.3** Provisioning profile member otomatis melalui trigger `auth.users`; verified Supabase ID + profile DB tetap menjadi authority.
- [x] **MTR-2.4** Role DB tetap authority; `user_metadata` tidak dipakai untuk access decision.

**Gate MTR-2:** selesai 2026-09-18 tanpa schema/auth mutation. Optional-auth runtime dan access policy dikerjakan pada MTR-4.

### MTR-3 — Entitlement schema dan migration offline

- [x] **MTR-3.1** Model `Entitlement` additive: `userId`, `courseId`, `source`, `sourceRef`, `expiresAt`, `revokedAt`, timestamps, relasi, dan index akses.
- [x] **MTR-3.2** Constraint multi-source/idempotensi: `@@unique([userId, courseId, source, sourceRef])`; revoke satu source tidak menghapus source lain; `sourceRef` wajib stabil (`free` sentinel, purchase/enrollment reference).
- [x] **MTR-3.3** Enum/source `free|purchase|enrollment` ditambahkan setelah MTR-0.4 final.
- [x] **MTR-3.4** Migration SQL offline `nc4_entitlements` dibuat dengan RLS enabled default-deny; grants/policy Data API belum dilakukan.
- [x] **MTR-3.5** Prisma format/validate/generate dan review SQL migration berhasil offline; tidak `migrate deploy`, `db push`, atau query live.

**Acceptance:** schema mendukung entitlement aktif jika `revokedAt=null` dan `expiresAt=null|future`; source lain tetap berlaku saat satu source direvoke.

### MTR-4 — Access policy dan optional authentication

- [x] **MTR-4.1** Resolver optional-auth ditambahkan dengan verifikasi Supabase + lookup role/active DB jika token tersedia; malformed/invalid token ditolak, anonymous hanya tanpa header.
- [x] **MTR-4.2** `backend/src/content/access.ts` menjadi satu access-policy service untuk Course/Lesson dan entitlement.
- [x] **MTR-4.3** Policy mewajibkan Course active/published/publishedAt dan Lesson published/publishedAt sebelum content dibaca.
- [x] **MTR-4.4** Policy mengevaluasi public/login-free/paid dan entitlement aktif; author/admin preview tetap bukan bypass reader.
- [x] **MTR-4.5** Free access tidak melakukan auto-grant atau mutasi dari GET; paid hanya memakai entitlement aktif.

**Acceptance:** policy fail-closed dan siap dipakai MTR-5/MTR-6; belum ada route publik yang terpasang pada checkpoint ini.

### MTR-5 — API katalog materi

- [x] **MTR-5.1** `GET /api/catalog/courses`: hanya Course active+published; pagination, search, category, level, accessTier, ordering stabil.
- [x] **MTR-5.2** DTO list hanya metadata: slug, title, description ringkas, category, level, accessTier, price, author publik minimum, dan count; tanpa body/draft/internal lineage.
- [x] **MTR-5.3** `GET /api/catalog/courses/:slug`: metadata Course + outline Section/Lesson terurut; setiap lesson membawa access hint, bukan `bodyText`.
- [x] **MTR-5.4** Outline tidak memasukkan draft lesson/section kosong yang tidak layak tampil dan tidak membocorkan authorId internal bila tidak diperlukan.

**Acceptance:** anonymous dapat menjelajah katalog dan silabus tanpa menerima satu pun body lesson entitled.

### MTR-6 — API reader lesson

- [x] **MTR-6.1** `GET /api/reader/lessons/:slug` menggunakan optional-auth + access-policy service.
- [x] **MTR-6.2** Success DTO memuat metadata reader, `bodyText`, breadcrumb Course/Section, serta prev/next yang juga aman.
- [x] **MTR-6.3** `401 LOGIN_REQUIRED` dan `403 PURCHASE_REQUIRED` hanya mengirim metadata paywall yang diizinkan; tidak ada body, excerpt sensitif, atau nested relation bocor.
- [x] **MTR-6.4** Draft/inactive/unknown selalu `404` pada surface publik untuk menghindari enumerasi status internal.
- [x] **MTR-6.5** Header cache membedakan public reader dan authenticated/paid reader.

**Acceptance:** publik terbaca anonymous; login-free gagal anonymous dan berhasil user aktif; paid gagal tanpa grant dan berhasil hanya dengan entitlement aktif.

### MTR-7 — Library dan reading progress

- [x] **MTR-7.1** `GET /api/me/entitlements`: hanya entitlement user sendiri, status aktif dihitung server-side, DTO tanpa data user lain.
- [x] **MTR-7.2** Definisikan `LessonProgress` sebagai `User × Lesson`, terpisah dari `Progress` Murid × RoadmapStep.
- [x] **MTR-7.3** Endpoint library `/api/me/courses` hanya menampilkan Course yang saat ini dapat diakses beserta progress ringkas.
- [x] **MTR-7.4** Endpoint update progress idempotent dan hanya setelah access policy lesson lolos.
- [x] **MTR-7.5** Revoke/expiry segera memengaruhi reader dan library; progress tidak memberi hak akses.

### MTR-8 — Tutup jalur legacy dan Data API (release blocker)

- [x] **MTR-8.1** `/api/programs*` memakai compatibility guard: anonymous hanya metadata; body legacy hanya untuk user aktif yang punya relasi Program, sehingga consumer wali existing tetap berjalan.
- [x] **MTR-8.2** Audit nested include/select selesai; body baru dipilih eksplisit setelah access policy, legacy admin tetap protected.
- [x] **MTR-8.3** Migration offline `nc6_content_data_api_lockdown` mengaktifkan RLS dan mencabut grant `PUBLIC`/`anon`/`authenticated` untuk content legacy/new, entitlement, dan progress; belum dijalankan live.
- [x] **MTR-8.4** Audit source menunjukkan direct browser query content tidak ada; service-role hanya backend/server env.

**Gate release:** route baru sudah hardened lokal, tetapi katalog/reader frontend dan legacy body belum boleh diluncurkan/dipotong sebelum verifikasi DB Data API dan frontend cache/cutover.


### MTR-9 — Verifikasi backend

- [x] **MTR-9.1** Contract/negative behavior dipetakan melalui optional-auth/access policy dan fail-closed route branches; runtime suite belum dijalankan pada sesi ini.
- [x] **MTR-9.2** Static audit memastikan body hanya dipilih pada reader success setelah policy; catalog/paywall/error tidak memilih body. Legacy anonymous body disembunyikan.
- [x] **MTR-9.3** Pagination max 100, stable ordering, dan index published lookup tersedia.
- [x] **MTR-9.4** Lint, source/test typecheck, Prisma format/validate/generate berhasil; backend suite/artifact/build belum dijalankan.
- [x] **MTR-9.5** QA DB terisolasi, RLS/Data API, dan live auth belum dijalankan karena tidak ada izin DB/live.

### MTR-10 — Halaman public reader

- [x] **MTR-10.1** `/materi`: katalog search/filter/pagination, badge `Publik|Login gratis|Berbayar`, loading/error/empty state, mobile-first.
- [x] **MTR-10.2** `/kelas/[slug]`: deskripsi Course, outline Section/Lesson, status akses, CTA baca/login/beli.
- [x] **MTR-10.3** `/materi/[slug]`: reader Markdown aman, hierarchy baca jelas, daftar isi, prev/next, state login-required dan purchase-required.
- [x] **MTR-10.4** `/login?next=...`: kembali ke lesson tujuan setelah login dengan validasi relative-path anti-open-redirect; `redirectedFrom` lama tetap kompatibel.
- [x] **MTR-10.5** `/app/materi`: library course yang dapat diakses dan progress membaca.
- [x] **MTR-10.6** Markdown dirender dengan `react-markdown` + `remark-gfm` + `rehype-sanitize`, `skipHtml`, dan URL transform aman; raw HTML tidak diaktifkan.
- [x] **MTR-10.7** Katalog, detail, dan reader dummy dipakai sebagai prototipe visual; data production tidak lagi bergantung pada dataset tersebut setelah cutover MTR-14.
- [x] **MTR-10.8** Reader dummy gratis mendukung daftar isi desktop, navigasi lesson, progress lokal sebagai prototipe, dan layout mobile-first.
- [x] **MTR-10.9** `/materi` menjadi katalog bebas per lesson dengan card grid, search submit, filter topik multi-select, level single-select, URL state, dan pagination 12 item.
- [x] **MTR-10.10** `/jalur-belajar` memisahkan alur terpandu dari katalog bebas; header menyediakan navigasi Katalog dan Jalur Belajar.

### MTR-14 — Backend-backed content cutover

- [x] **MTR-14.1** `GET /api/catalog/lessons` menyediakan flat lesson catalog published dengan pagination, search, category multi-value, level, access hint, dan read count.
- [x] **MTR-14.2** `GET /api/catalog/paths` menyediakan outline Course/Section/Lesson untuk jalur terpandu tanpa body.
- [x] **MTR-14.3** `GET /api/me/lesson-progress` menyediakan completed lesson slugs milik user terautentikasi.
- [x] **MTR-14.4** `/materi`, `/kelas/[slug]`, `/materi/[slug]`, dan `/jalur-belajar` sudah memakai API backend; dataset dummy runtime dan local progress fallback dihapus.
- [x] **MTR-14.5** Reader success mengirim `readCount`/`completed`, update progress memakai endpoint server, dan anonymous diarahkan login untuk menyimpan progress.
- [x] **MTR-14.6** Legacy program tests disinkronkan dengan DTO allowlist `select`; API suite lulus 180/180.
- [x] **MTR-14.7** Migration tunggal diterapkan ke remote development; Auth lama dihapus, seed besar dijalankan, dan count/migration/login/RLS diverifikasi.


**Acceptance:** selesai lokal 2026-09-18; responsive/browser QA tidak dijalankan atas instruksi user. Body hanya berasal dari reader API yang lolos guard backend.

### MTR-11 — Authoring UI (setelah reader contract stabil)

- [ ] **MTR-11.1** `/app/admin/content` dan `/app/tentor/content`: list/filter Course sesuai ownership.
- [ ] **MTR-11.2** `/app/admin/content/[courseId]` dan route tentor ekuivalen: kelola metadata, Section, Lesson, reorder, visibility, draft/publish.
- [ ] **MTR-11.3** Editor Markdown + preview tersanitasi, validasi link internal, dirty-state guard, autosave hanya jika disepakati.
- [ ] **MTR-11.4** Course migrasi dengan `programId` tampil read-only sampai cutover single-writer selesai.

### MTR-12 — Purchase flow course berbayar (fase terpisah)

- [ ] **MTR-12.1** Rancang model purchase terpisah dari Invoice les yang wajib Enrollment.
- [ ] **MTR-12.2** Server menentukan buyer, Course, dan harga; bukti pembayaran privat; state machine submit/review/approve/reject/cancel.
- [ ] **MTR-12.3** Approval + entitlement `purchase` atomik dan idempotent; retry/concurrency/replay-after-revoke aman.
- [ ] **MTR-12.4** `/checkout/[courseSlug]` untuk pembeli dan `/app/admin/purchases` untuk review admin.
- [ ] **MTR-12.5** Payment gateway/subscription tetap di luar scope sampai keputusan baru.

### Checkpoint eksekusi

- [x] **C1 Contract approved:** MTR-0 selesai 2026-09-18 dan MTR-1 kontrak API/threat model selesai 2026-09-18; MTR-3+ dikerjakan setelah ini.
- [x] **C2 Backend foundation:** MTR-2–MTR-4 selesai lokal 2026-09-18; migration tetap offline dan route publik belum dipasang.
- [x] **C3 Read API:** MTR-5–MTR-9 selesai lokal dengan residual runtime/DB QA dan legacy cutover yang tercatat.
- [x] **C4 Frontend reader:** MTR-10 selesai lokal; browser QA dan live backend gate tetap residual.
- [ ] **C5 Authoring/purchase:** MTR-11 dan MTR-12 dikerjakan sebagai fase terpisah, bukan satu batch besar.

---

### 1. Database readiness — blocked by DB approval

- [ ] Audit read-only data `MaterialItem`: roadmap-only, session-only, both, orphan.
- [ ] Jalankan dry-run pada DB terisolasi yang disetujui.
- [ ] Verifikasi jumlah, body, relasi, slug, dan idempotensi.
- [ ] Putuskan mapping ambiguous/conflict/orphan.
- [ ] Putuskan `MaterialItem.sessionId`; jangan drop schema sebelum backfill, seed, consumer, dan rollback siap.

### 2. Auth and HTTP rollout — blocked by product/deployment decisions

- [ ] Admin menentukan kegunaan dan remediation lima Auth tanpa profil.
- [ ] Putuskan kebutuhan payload di atas 100 KB.
- [ ] Verifikasi origin, proxy, dan rate limit untuk target deployment.
- [ ] Verifikasi artifact pada OS deployment.

### 3. Content security — release blocker

- [ ] Tutup kebocoran `RoadmapStep.bodyText` dari `/api/programs*`.
- [ ] Audit nested, legacy, search, related, dan prev/next access paths.
- [ ] Audit grants/RLS Data API untuk tabel content.
- [ ] Pastikan draft dan lesson entitled tidak terkirim tanpa guard.

### 4. Entitlement and progress — after content security

- [ ] Definisikan source entitlement: free, purchase, enrollment.
- [ ] Putuskan expiry, revoke, inactive, dan multiple-source behavior.
- [ ] Implement `User × Lesson` reading progress terpisah dari progress murid.
- [ ] Verifikasi negative access dan ownership.

### 5. Frontend handoff — later

- [ ] Tetapkan kontrak reader/writer setelah backend gate.
- [ ] Cutover frontend tanpa dua writer untuk record yang sama.
- [ ] QA frontend/browser hanya dengan izin dan task terpisah.

## Blocker permanen sampai ada keputusan

- Frontend masih memakai metadata role.
- Migration/backfill NC-2 belum diterapkan ke DB live.
- Endpoint legacy `/api/programs*` masih release blocker karena `bodyText`.
- Payload pembayaran UI/API mismatch: `paymentProof` vs `proofBase64`.
- Frontend authoring dan public catalog belum masuk scope.

## Verification commands

```powershell
npm run typecheck --workspace=backend
npm run typecheck:test --workspace=backend
npm run lint --workspace=backend
npm run test --workspace=backend
npm run test:artifact --workspace=backend
npm run build --workspace=backend
```

Test dijalankan sesuai izin sesi. Typecheck dan lint tetap wajib untuk perubahan backend yang relevan.
