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
