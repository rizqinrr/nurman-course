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

### 2026-09-18 — MTR-3 dan MTR-4 selesai lokal

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
