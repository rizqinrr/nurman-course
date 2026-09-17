# Tasks — nurman-course

> Source of truth **checklist eksekusi/status**, bukan log hasil. Scope/desain/acceptance criteria: [plan.md](./plan.md); keputusan/hasil/verifikasi/residual: [PROGRESS.md](../docs/PROGRESS.md).
> **Branch konteks:** `be-restruktur` (base `dev`). **Bagian 4 checkpoint 2026-09-16:** packaging `build.cjs`/artifact test, lint backend scoped, dan audit+mapping materi–sesi selesai lokal; verifikasi menyeluruh, hitung data DB, drop `sessionId`, dan ukuran payload tetap pending. Bagian3 NC-1.5 parsial: Helmet/CORS/limiter/error-log lokal tersedia. Bagian2 NC-1.4 tetap rollout blocked untuk 5 Auth tanpa profil; NC-SEC-BE selesai. WALI-MOB/branch `uiux` di-pause. Izin commit/push terdahulu sudah dipakai untuk checkpoint Bagian1/2; sesi Bagian3/4 tidak melakukan commit/push, merge/deploy, frontend/browser, login test, atau mutasi DB remote.
> Patokan awal root: [AGENTS.md](../AGENTS.md) · [SYSTEM_MAP.md](../SYSTEM_MAP.md) · [README.md](../README.md) · [design.md](../design.md). Konflik → DOC-ROOT, bukan asumsi runtime.
> Referensi: [roadmap](../docs/ROADMAP-LMS.md) · [overview](../docs/CODEBASE_OVERVIEW.md) · [flow](../docs/flow-system.md) · [ERD](../docs/erd-lms.md).
> ID, checkbox dan tanggal historis dipertahankan; label demo/fase lama bukan bukti runtime kini. Exit criteria fase ada di [plan](./plan.md#fase-exit-design); riwayat tambahan di [arsip progress](../docs/PROGRESS.md#arsip-todo-20260916).

**Cara pakai**
1. Pilih satu task `in_progress` per sesi, kecuali parallel eksplisit.
2. Selesai → `[x]` + tanggal; hasil/verifikasi di PROGRESS, bukan di baris task.
3. Scope baru dicatat sebelum coding; jangan loncat fase tanpa task/persetujuan.

**Legend:** `(pending | in_progress | done | blocked | cancelled)`; `[~]` mempertahankan status parsial lama.

---

## Meta — dokumentasi & proses

- [x] 2026-09-16 NC-GIT Commit/push dependency `2d5444e` dan auth/tests `0765024` ke origin/be-restruktur; sertakan sinkronisasi dokumentasi, tanpa merge/deploy — [sesi](../docs/PROGRESS.md#backend-push-20260916).

- [x] 2026-09-16 NC-BE-PLAN Simpan rencana backend-only dan keputusan akun nonaktif; rincian [plan](./plan.md#backend-restructure), [sesi](../docs/PROGRESS.md#backend-part1-20260916).

- [x] 2026-09-16 DOC-SYNC Sinkronkan lima dokumen `docs/` dengan patokan Markdown root; pisahkan checklist/rencana/hasil. — [scope](./plan.md#doc-sync-scope), [sesi](../docs/PROGRESS.md#doc-sync-20260916).
- [ ] DOC-ROOT Rekonsiliasi konflik root setelah verifikasi; follow-up P1/P2, bukan izin edit root sekarang. (pending) — [konteks](../docs/PROGRESS.md#doc-sync-20260916).
- [ ] DOC-PAYCHECK Verifikasi read-only mismatch field pembayaran frontend/shared/backend yang dilaporkan main dari source; belum diuji live, bukan izin bugfix. (pending) — [konteks](../docs/PROGRESS.md#doc-sync-20260916).
- [x] 2026-09-16 NC-PLAN Rencana dependency security, lint, dan role DB — [hasil](../docs/PROGRESS.md#2026-09-16--rencana-rinci-security-lint-dan-role-db).
- [ ] 2026-09-06 WALI-MOB Redesign Mobile-First Portal Wali (Warm Academic Portal, max-w-md; Dashboard/Jadwal/Laporan/Tagihan/Program/Profile) — **di-pause**, historis in_progress, belum selesai; [rencana](./plan-wali-mobile.md), [sesi aktif](../docs/PROGRESS.md#doc-sync-20260916).
- [x] 2026-07-29 Tulis `docs/ROADMAP-LMS.md` (MVP, fase, opsi A/B).
- [x] 2026-07-29 Buat `docs/PROGRESS.md` + template log.
- [x] 2026-07-29 Buat `tasks/todo.md`.
- [x] 2026-07-29 Update `AGENTS.md` berpatokan docs/tasks.
- [x] 2026-07-29 Mirror vault (03 Roadmap, index, about, 02).
- [x] 2026-08-11 Perkuat disiplin Step 0, sync docs dan peran vault — [hasil](../docs/PROGRESS.md#2026-08-11--perkuat-disiplin-dokumentasi-step-0-wajib-baca-docs--template-progress--peran-vault).
- [x] 2026-08-11 Fix tooling opencode: registrasi Codegraph dan diagnosis OAuth Supabase (di luar repo) — [hasil](../docs/PROGRESS.md#2026-08-11--fix-tooling-opencode-register-mcp-codegraph-di-config-aktif--diagnosa-auth-supabase-mcp).
- [x] 2026-08-11 Instal Agent Skills Supabase global dan OAuth MCP (di luar repo) — [hasil](../docs/PROGRESS.md#2026-08-11--install-agent-skills-supabase-global--oauth-mcp-supabase-sukses).
- [x] 2026-08-11 Migrasi Supabase → MySQL **dibatalkan**, targeted revert — [hasil undo](../docs/PROGRESS.md#2026-08-11--migrasi-supabase--mysql-dibatalkan-di-revert-ke-kondisi-sebelum-migrasi).

---

## Hapus Demo Mode (Frontend Live-API Only)

[Hasil DMO-1](../docs/PROGRESS.md#2026-08-05--hapus-demo-mode-total-frontend-live-api-only) · [hasil DMO-2](../docs/PROGRESS.md#2026-08-05--hapus-keterangan-banner-demo-dan-perketat-proteksi-role-based-middleware).

- [x] 2026-08-05 DMO-1 Hapus demo mode, bypass, banner, dummy/resolver dan env toggle; pertahankan interface portal.
- [x] 2026-08-05 DMO-2 Hapus banner demo `/app` dan terapkan proteksi route berbasis role.

## Terminology Migration

- [x] 2026-08-01 Rename penuh `pengajar` → `tentor` pada shared, Prisma, auth, API, frontend, docs dan desain aktif — [hasil](../docs/PROGRESS.md#2026-08-01--rename-pengajar-menjadi-tentor).

## Admin Murid + Akun Wali

- [ ] 2026-08-01 M1 Schema Murid: address, registeredAt, photoPath, phone normalization/unique constraint.
- [ ] 2026-08-01 M2 Shared schema + helper normalize phone.
- [ ] 2026-08-01 M3 API create/update murid satu flow dengan create/reuse akun wali.
- [ ] 2026-08-01 M4 Supabase Storage foto murid + signed URL. (2026-08-23: on-hold; bucket publik ditolak, menunggu privat + signed URL) — [keputusan](../docs/PROGRESS.md#2026-08-23--sinkronisasi-system_mapmd-dengan-kode-p1-sebagian).
- [ ] 2026-08-01 M5 UI admin murid: form murid + wali, upload foto, status, detail.
- [x] 2026-08-05 M6 Login email/nomor hape dengan password.
- [x] 2026-08-05 M6.1 Fix auto-generate email untuk wali tanpa email (login nomor WA).
- [x] 2026-08-05 M6.2 Fix Supabase Auth email null: email_confirm + rekonsiliasi akun — [hasil](../docs/PROGRESS.md#2026-08-05--fix-supabase-auth-email-null-email_confirm-true).
- [ ] 2026-08-01 M7 Seed/migrasi akun existing + verifikasi multi-murid per wali.
- [ ] 2026-08-01 M8 Build, lint, typecheck, live API/auth/storage test, update PROGRESS.

---

## Funnel polish (boleh paralel dengan planning LMS; tidak mengubah arah LMS)

Ad-hoc — hasil/verifikasi di log PROGRESS bertanggal; [indeks riwayat tambahan](../docs/PROGRESS.md#arsip-todo-20260916).

- [x] 2026-08-24 UIUX: Peningkatan kontras portal wali `/app/program` dan detail — [detail historis](../docs/PROGRESS.md#arsip-todo-20260916).
- [x] 2026-08-24 UIUX: Redesign `/landing` AppVerse.id + LandingTutors, pertahankan warna utama biru — [hasil](../docs/PROGRESS.md#2026-08-24--redesign-besar-landing-page-landing-dengan-appverseid-design-system--integrasi-tutor-carousel).
- [x] 2026-08-11 UIUX: Admin mobile bottom bar → sidebar drawer, navigasi dan aksesibilitas — [hasil](../docs/PROGRESS.md#2026-08-11--admin-portal-mobile-ganti-bottom-bar--sidebar-drawer-hamburger-menu).
- [x] 2026-08-11 ADMIN: Murid mobile tanpa overflow + Reset PW akun wali — [hasil](../docs/PROGRESS.md#2026-08-11--admin-murid-mobile-rapi-fix-overflow--fitur-reset-pw-akun-wali).
- [x] 2026-08-11 ADMIN: Nonaktifkan/hapus permanen Murid & Tentor + ConfirmDialog — [hasil](../docs/PROGRESS.md#2026-08-11--admin-hapus-permanen-murid--tentor--modal-konfirmasi-soft-vs-hard).
- [x] 2026-08-11 UIUX: Redesign login clean/interaktif, helper email/WA; susulan login-only — [hasil](../docs/PROGRESS.md#2026-08-11--redesign-halaman-login-login-visual--interaktif-tanpa-ubah-logic).
- [x] 2026-08-06 UIUX: Landing lanjutan — Tentang Kami/Testimoni, hero benefits, harga pulse — [hasil](../docs/PROGRESS.md#2026-08-06--landing-landing-nav-tentang-kamitestimoni-hero-benefits--harga-pulse-section-about--testimoni).
- [x] 2026-08-06 UIUX: Landing `/landing` terpisah dari `/course`, data dan section reusable — [hasil](../docs/PROGRESS.md#2026-08-06--landing-page-baru-landing-preview-terpisah-template-dreams-lms--data-statis).
- [x] 2026-08-05 UIUX: Polish wali mobile-first — nav/header, laporan, sticky bar, riwayat tagihan.
- [x] 2026-08-05 UIUX: Bottom bar wali icons-only, Dashboard tengah dengan raised effect.
- [x] 2026-08-05 UIUX: Foto profil murid dan pembayaran mandiri/prabayar — [hasil](../docs/PROGRESS.md#2026-08-05--wali-portal-avatar--prepayment-feature).
- [x] 2026-07-29 Marquee landing: tambah "Laporan progres belajar anak".
- [x] 2026-07-29 P12 Landing: social proof + program favorit + testimoni + framer-motion.
- [x] 2026-07-29 Fix hydration error PageHeader (tombol back className).
- [x] 2026-07-29 P13 Tutor carousel infinite loop.
- [x] 2026-07-29 Ganti mentor Kak Fikri → Kak Kiki (D3 Informatika, Politeknik Negeri Cilacap).
- [x] 2026-07-29 Komputer Dasar: silabus L1/L2 dari vault + L3 Coming Soon.
- [x] 2026-07-29 Pricing KD: L1 35k/L2 40k; 90 menit ×1.3; getLevelBasePrice.
- [x] 2026-07-29 Config defaults 90/3x/siswa; frekuensi 4x; jam 13–19; chip pulse; tentor & 2 jam CS.
- [x] 2026-07-29 Peserta: copy kelas + harga per anak; diskon 2=20% / 3=35%.
- [x] 2026-07-29 Config: Nama Lengkap wajib dan baris Nama di WA.
- [x] 2026-07-29 Format WA: bold/section/bullet.
- [x] 2026-07-29 Komputer-dasar: efek level terpilih + badge Terpilih.
- [x] 2026-07-29 Calistung: Ngaji 15k + Calistung & Ngaji 30k.
- [x] 2026-07-29 Config calistung: hide Level di UI + WA.
- [x] 2026-07-29 Config: nama dinamis 1–3 sesuai peserta.
- [x] 2026-07-29 Plan + implement Vibe Coding L1–L3 40/45/50k; laptop+internet.
- [ ] Paket 12 sesi / all-in Vibe Coding (masih diskusi).

Prioritas tinggi:
- [~] 2026-08-23 P1 Sync AGENTS/SYSTEM_MAP dengan kode — SYSTEM_MAP selesai pada checkpoint lama, AGENTS menyusul; follow-up DOC-ROOT — [hasil](../docs/PROGRESS.md#2026-08-23--sinkronisasi-system_mapmd-dengan-kode-p1-sebagian).
- [ ] P2 Metadata + README (bukan boilerplate create-next-app); terkait DOC-ROOT.
- [ ] P3 Label WA calistung pakai "Program" jika `program=calistung`.

Prioritas sedang:
- [ ] P4 `/course/program` dari data/getCategories, bukan hardcode 3 route.
- [x] 2026-08-24 P5 Tutor data pindah ke `data/landing.ts` — [hasil](../docs/PROGRESS.md#2026-08-24--redesign-besar-landing-page-landing-dengan-appverseid-design-system--integrasi-tutor-carousel).
- [ ] P6 UX query config invalid (partial — review).

Prioritas rendah:
- [ ] P7 State persistence (opsional).
- [ ] P8 Sesi online real.
- [ ] P9 Test suite (pricing + smoke flow).
- [ ] P10 Hari full dinamis.

---

## Fase 0 — Spec & model data (docs only)

- [x] 2026-07-31 F0.1 Finalisasi entity + field (User, Program, RoadmapStep, Session, MaterialItem, Enrollment, Invoice, DailyReport, ProgressReport).
- [x] 2026-08-01 F0.2 ERD kasar.
- [ ] F0.3 Mapping kasar materials.ts → Program/RoadmapStep (migrasi nanti).
- [x] 2026-08-01 F0.4 Shortlist stack (Postgres + Supabase Auth).
- [x] 2026-08-01 F0.5 Catat keputusan Opsi A, akun wali dibuat admin, akses laporan — PROGRESS.

## Fase 1 — Fondasi

- [x] 2026-08-01 F1.1 Pilih & setup DB + env (tanpa secret di Git).
- [x] 2026-08-01 F1.2 Auth admin + tentor + wali.
- [ ] F1.3 Shell app terautentikasi `/app` + layout.
- [x] 2026-08-01 F1.4 Seed 1 program dummy + 1 admin.
- [x] 2026-08-01 F1.5 Proteksi route admin/tentor/wali.

## Fase 1.5 — Restrukturisasi Monorepo & Express API (Selesai)

- [x] 2026-08-01 F1.5.1 Arsip backend existing & hapus duplikat prompt-google-stitch; pertahankan desain-ui-frontend.
- [x] 2026-08-01 F1.5.2 Setup npm workspaces & Turborepo.
- [x] 2026-08-01 F1.5.3 Pindahkan frontend ke frontend/ dan sesuaikan config/env/alias.
- [x] 2026-08-01 F1.5.4 Inisialisasi packages/shared untuk types dan Zod.
- [x] 2026-08-01 F1.5.5 Upgrade backend Express + Prisma model 3-role.
- [x] 2026-08-01 F1.5.6 Middleware verifikasi JWT Supabase di Express.
- [x] 2026-08-01 F1.5.7 Route `/api/users/me` & `/api/health`.
- [x] 2026-08-01 F1.5.8 Sinkronisasi AGENTS, SYSTEM_MAP, PROGRESS, todo.

## Fase 2 — Katalog, Murid & Tentor (Aktif - Demo UI Offline)

> Label fase/demo adalah konteks historis; jangan aktifkan kembali demo.

- [ ] F2.1 Admin CRUD Program (termasuk sessionsPerBlock).
- [ ] F2.2 Admin CRUD User Tentor & Wali Murid.
- [ ] F2.3 Admin CRUD Murid & Enrollment.
- [ ] F2.4 Admin CRUD RoadmapStep & MaterialItem.
- [x] 2026-08-01 F2.5 Wali: katalog & roadmap anak (UI demo historis).
- [x] 2026-08-01 F2.6 Wali: baca materi anak (UI demo historis).
- [x] 2026-08-01 F2.7 Wali: jadwal & histori laporan (UI demo historis).
- [x] 2026-08-01 F2.8 Wali: tagihan & konfirmasi WA (UI demo historis).

## Fase 3 — Jadwal & Laporan Sesi (Aktif - Demo UI Offline)

- [ ] F3.1 Admin CRUD Session (program, tentor, murid, tanggal, jam).
- [x] 2026-08-01 F3.2 Tentor: jadwal mengajar (UI demo historis).
- [x] 2026-08-01 F3.3 Tentor: Laporan Harian (UI demo historis).
- [x] 2026-08-01 F3.4 Tentor: Laporan Perkembangan setelah N sesi (UI demo historis).
- [x] 2026-08-01 F3.5 Wali: jadwal & laporan harian/perkembangan (diselaraskan dengan Fase 2).

## Fase 4 — Tagihan / pembayaran

- [ ] F4.1 Invoice unpaid/waiting/paid terhubung Enrollment.
- [ ] F4.2 Admin terbitkan invoice & kelola status.
- [ ] F4.3 Wali: tagihan & petunjuk transfer.
- [ ] F4.4 Wali: upload bukti & konfirmasi WhatsApp.

## Fase 5 — Integrasi funnel

- [ ] F5.1 Putuskan final Opsi A/B (status historis dipertahankan; lihat keputusan D1 untuk tindak lanjut).
- [ ] F5.2 Implement integrasi sesuai opsi.
- [ ] F5.3 Rencana deprecation/mapping materials.ts jika diganti DB.
- [ ] F5.4 Jaga funnel production selama cutover.

## Fase 3.6 — Integrasi Frontend ↔ Backend API (Pilot Tentor) (Selesai)

**A. Fondasi koneksi & model data**
- [x] 2026-08-01 F3.6.A1 Rekonsiliasi ID Supabase/Prisma pada seed + email fallback profil.
- [x] 2026-08-01 F3.6.A2 API client frontend Bearer JWT dan env example (demo historis).
- [x] 2026-08-01 F3.6.A3 ProgressReport String[], Murid.avatarUrl, migration + seed.

**B. Endpoint pilot tentor**
- [x] 2026-08-01 F3.6.B1 GET programs list/detail.
- [x] 2026-08-01 F3.6.B2 GET me/sessions dengan relasi murid/program.
- [x] 2026-08-01 F3.6.B3 GET me/daily-reports + POST daily-reports (Zod, upsert sessionId).
- [x] 2026-08-01 F3.6.B4 GET me/progress-reports + POST progress-reports (Zod).

**C. Frontend pilot (demo toggle historis)**
- [x] 2026-08-01 F3.6.C1 Jadwal tentor: API + status/fallback.
- [x] 2026-08-01 F3.6.C2 Dashboard tentor: sesi/stat API + fallback.
- [x] 2026-08-01 F3.6.C3 Laporan Harian: list/submit/edit API.
- [x] 2026-08-01 F3.6.C4 Laporan Perkembangan: list/submit API.

**D. Verifikasi & docs**
- [x] 2026-08-01 F3.6.D1 Uji koneksi & input database.
- [x] 2026-08-01 F3.6.D2 Lint/build monorepo.
- [x] 2026-08-01 F3.6.D3 Update PROGRESS.

## Fase 3.7 — Integrasi Frontend ↔ Backend API (Portal Wali Murid) (Selesai)

**A. Endpoint wali**
- [x] 2026-08-01 F3.7.A1 GET me/enrollments role-aware.
- [x] 2026-08-01 F3.7.A2 GET me/invoices role-aware.
- [x] 2026-08-01 F3.7.A3 GET me/progresses role-aware.

**B. Frontend wali (demo toggle historis)**
- [x] 2026-08-01 F3.7.B1 Dashboard: anak/program/rekap.
- [x] 2026-08-01 F3.7.B2 Katalog program + badge terdaftar.
- [x] 2026-08-01 F3.7.B3 Roadmap timeline/status.
- [x] 2026-08-01 F3.7.B4 Jadwal mendatang/riwayat.
- [x] 2026-08-01 F3.7.B5 Tab laporan harian/perkembangan.
- [x] 2026-08-01 F3.7.B6 Tagihan unpaid/riwayat/breakdown.
- [x] 2026-08-01 F3.7.C1 Lint/build monorepo.
- [x] 2026-08-01 F3.7.C2 Update PROGRESS.

## Fase 3.8 — Integrasi Frontend ↔ Backend API (Portal Admin) (Selesai)

- [x] 2026-08-01 F3.8.A1 GET admin/murids dengan wali.
- [x] 2026-08-01 F3.8.A2 GET admin/tentors.
- [x] 2026-08-01 F3.8.B1 Dashboard admin: metric/sesi.
- [x] 2026-08-01 F3.8.B2 Layout admin (banner demo historis).
- [x] 2026-08-01 F3.8.C1 Lint/build monorepo.
- [x] 2026-08-01 F3.8.C2 Update PROGRESS & todo.

---

## Plan Portal Admin Lengkap — ADM (Draft Siap Implementasi)

> [Arsip desain/acceptance criteria](./plan.md#arsip-rencana-implementasi-portal-admin-lengkap); status hanya di sini. Label draft adalah judul historis, bukan izin implementasi sekarang.

### Phase 0 — Persiapan dan Kontrak
- [x] 2026-08-01 ADM-0.1 Audit baseline portal, endpoint, Prisma, dependency.
- [x] 2026-08-01 ADM-0.2 Contract API/status/response + Zod bersama.
- [x] 2026-08-01 ADM-0.3 Helper admin API/query/error/UI reusable.
- [x] 2026-08-01 ADM-0.C0 Checkpoint kontrak: backend tsc, frontend lint/typecheck, konsistensi contract.

### Phase 1 — Program Catalog
- [x] 2026-08-01 ADM-1.1 API CRUD Program + filter/role guard.
- [x] 2026-08-01 ADM-1.2 UI Program list/filter/form/deactivate.
- [ ] ADM-1.3 Seed dan verifikasi Program: duplicate slug, validasi, live CRUD.
- [ ] ADM-1.C1 Checkpoint Program: integration/manual API, responsive UI, build/lint.

### Phase 2 — User, Wali, Tentor, dan Murid
- [x] 2026-08-01 ADM-2.1 API user Tentor/Wali: auth/profile/update/deactivate/secret safety.
- [x] 2026-08-01 ADM-2.2 UI Tutor list/filter/form/detail/edit/deactivate.
- [x] 2026-08-01 ADM-2.3 API Murid list/filter/detail/create/update/wali/deactivate.
- [x] 2026-08-01 ADM-2.4 UI Murid + ringkasan enrollment/session/report.
- [x] 2026-08-01 ADM-2.C2 Checkpoint guard/duplicate email/invalid relation/build/lint.

### Phase 3 — Enrollment
- [x] 2026-08-01 ADM-3.1 API Enrollment + status/detail/duplicate prevention.
- [x] 2026-08-01 ADM-3.2 UI Enrollment + filter/form/detail/cancel/complete.
- [x] 2026-08-01 ADM-3.C3 Checkpoint transaction/program inactive/empty/error/loading.
- [x] 2026-08-12 ADM-3.4 Hapus permanen enrollment + ConfirmDialog cascade invoice — [hasil](../docs/PROGRESS.md#2026-08-12--admin-hapus-permanent-enrollment--tombol-hapus-di-appadminenrollment).
- [x] 2026-08-12 TENTOR/WALI-1 Header logo Nurman Course gaya landing di kedua portal — [hasil](../docs/PROGRESS.md#2026-08-12--header-tentor--wali-pakai-logo-nurman-course-gaya-landing-lingkaran-gelap-diperkecil).
- [x] 2026-08-12 LOGIN-1 Logo Nurman Course gaya landing, non-klik — [hasil](../docs/PROGRESS.md#2026-08-12--login-page-pakai-logo-nurman-course-lingkaran-gelap-non-klik).

### Phase 4 — Roadmap dan Materi Teks
- [x] 2026-08-01 ADM-4.1 API RoadmapStep CRUD/reorder/cascade.
- [x] 2026-08-06 ADM-4.2 API MaterialItem CRUD/order/body validation.
- [x] 2026-08-06 ADM-4.3 UI Roadmap/Materi selector/timeline/editor/reorder/preview.
- [x] 2026-08-06 ADM-4.C4 Checkpoint order/cascade/invalid content/wali regression.

### Phase 5 — Session dan Jadwal
- [x] 2026-08-24 ADM-5.1 API Session CRUD/cancel/relasi/waktu/bentrok murid & tentor.
- [x] 2026-08-06 ADM-5.2 UI Jadwal calendar/list/filter/form/detail/cancel.
- [x] 2026-08-24 ADM-5.C5 Checkpoint invalid time/overlap/consumer regression/build/lint.

### Phase 6 — Invoice dan Status Pembayaran
- [x] 2026-08-01 ADM-6.1 API Invoice CRUD/status transition/paidAt.
- [x] 2026-08-01 ADM-6.2 UI Tagihan filter/terbit/detail/status.
- [x] 2026-08-01 ADM-6.C6 Checkpoint transition/amount/duplicate/wali regression.
- [x] 2026-08-01 ADM-6.5 PaymentAccount CRUD admin + pembacaan wali, hapus rekening hardcode.

### Phase 7 — Integrasi dan Polish
- [ ] ADM-7.1 Sinkronisasi menu/dashboard/link/detail dan rekonsiliasi scope demo lama dengan DMO-1/DMO-2.
- [ ] ADM-7.2 UX/accessibility/security hardening seluruh admin.
- [ ] ADM-7.3 Test endpoint/UI, build/lint, docs/system map.
- [ ] ADM-7.C7 DoD: semua domain live, role guard, regression bersih, review.

### Keputusan Terbuka
- [x] 2026-08-01 ADM-Q1 Putuskan duplicate enrollment aktif → ditolak 409.
- [x] 2026-08-24 ADM-Q2 Putuskan konflik jadwal → hard reject 409 untuk tentor/murid.
- [ ] ADM-Q3 Putuskan password akun baru: temporary password atau invite/reset email.
- [x] 2026-08-24 ADM-Q4 Putuskan perubahan role existing → dibatasi bila ada relasi murid/sesi aktif.

### Admin Tentor Polish (request user 2026-08-05)

[Riwayat TENTOR-1–9 dan follow-up](../docs/PROGRESS.md#arsip-todo-20260916); hasil lainnya pada entri bertanggal di PROGRESS.

- [x] 2026-08-05 TENTOR-1 Schema User address/photoPath.
- [x] 2026-08-05 TENTOR-2 Shared user schema email opsional/fallback WA/address/photoPath/normalizePhone.
- [x] 2026-08-05 TENTOR-3 API admin users alamat/foto/placeholder email + sync metadata.
- [x] 2026-08-05 TENTOR-4 UI admin tentor alamat/foto/email opsional, panduan input, search/detail.
- [x] 2026-08-05 TENTOR-5 Verifikasi awal typecheck/build — [hasil dan batas bukti](../docs/PROGRESS.md#2026-08-05--admin-tentor-lengkap-alamat-foto-email-opsional-login-wa).
- [x] 2026-08-05 TENTOR-6 Fix password default + endpoint Reset PW/admin UI dan panduan login WA.
- [x] 2026-08-05 TENTOR-7 Login clean: hapus panel akun testing, hint email/WA/password, redirect role-aware.
- [x] 2026-08-05 TENTOR-8 Profil tombol sejajar + jadwal tentor CRUD manual/overlap/guard laporan; wali pakai nama tentor dinamis.
- [x] 2026-08-05 TENTOR-9 Fix 404 jadwal + cetak PDF harian/perkembangan, A4 dan tombol mobile.
- [x] 2026-08-05 TENTOR-10 Hapus akses "Pilih Portal" tentor yang dead-end — [hasil](../docs/PROGRESS.md#2026-08-05--tentor-hapus-akses-portal-pilih-portal-dead-end).
- [x] 2026-08-06 TENTOR-13 Pembayaran invoice real, bukti/nominal/waktu + badge wali/admin — [hasil](../docs/PROGRESS.md#2026-08-06--flow-pembayaran-invoice-real--badge-notif-wali--admin).
- [x] 2026-08-06 TENTOR-12 Profil/logout semua role: tombol compact, ConfirmDialog, useLogout — [hasil](../docs/PROGRESS.md#2026-08-06--profil--konfirmasi-logout-semua-role-duplikat-badge-tombol-compact-popup).
- [x] 2026-08-05 TENTOR-11 WA laporan wali ikon-only ke nomor mentor, fallback admin — [hasil](../docs/PROGRESS.md#2026-08-05--tombol-whatsapp-wali-applaporan-ikon-only-hijau--nomor-mentor).
- [x] 2026-08-06 UIUX: Dashboard wali sesi terdekat di atas; riwayat tagihan + prabayar gabung/sortir — [hasil](../docs/PROGRESS.md#2026-08-06--dashboard-wali-sesi-terdekat-ke-atas--riwayat-tagihan-gabung-prabayar).
- [x] 2026-08-06 TENTOR-14 Dashboard admin real, prabayar, jadwal admin, proof detail; follow-up Program kosong — [hasil](../docs/PROGRESS.md#2026-08-06--dashboard-admin-real--prabayar--jadwal-admin--proof-detail), [follow-up](../docs/PROGRESS.md#2026-08-06--fix-kolom-program-kosong-di-detail-prepayment-admin).
- [x] 2026-08-06 UIUX: Riwayat admin gabung/tagihan detail semua status, konfirmasi terbitkan; detail wali modal-only — [hasil](../docs/PROGRESS.md#2026-08-06--riwayat-admin-gabung-tagihanprabayar--detail-semua-status--modal-konfirmasi-terbitkan-tagihan).

### Riwayat task portal (sebelumnya berjudul In Progress)

- [x] 2026-08-21 DX-1 lanjutan: DebugBar copy-paste; revisi badge umur tabel laporan — [hasil](../docs/PROGRESS.md#2026-08-21--bugfix-laporan-harian-menimpa-laporan-lama--tabel-laporan--modal-detail).
- [x] 2026-08-21 TENTOR-24 Fix laporan baru menimpa lama, redirect edit, tabel/modal, pending dashboard — [hasil](../docs/PROGRESS.md#2026-08-21--bugfix-laporan-harian-menimpa-laporan-lama--tabel-laporan--modal-detail).
- [x] 2026-08-20 DX-1 DebugBar request/status/latency/cache dev + Prisma SQL timing — [hasil](../docs/PROGRESS.md#2026-08-20--dev-tooling-kustom-debugger-widget-nc-debugger--prisma-sql-logging).
- [x] 2026-08-20 WALI-24 In-memory GET cache TTL 1 jam, bypassCache, invalidasi per kategori — [hasil](../docs/PROGRESS.md#2026-08-20--portal-in-memory-client-side-cache-1-jam-dengan-smart-invalidation).
- [x] 2026-08-20 WALI-23 Selector anak 4 halaman + ubah sandi wali, profil historis tetap murid pertama — [hasil](../docs/PROGRESS.md#2026-08-20--portal-wali-selector-murid-multi-anak-di-dashboardjadwallaporantagihan--ubah-kata-sandi-di-profil-wali).
- [x] 2026-08-20 WALI-22 Katalog/filter/search/detail sesuai enrollment, tuning CTA/outline/modal — [hasil](../docs/PROGRESS.md#2026-08-20--katalog-program-wali-filter-kategori--kartu-informatif-ringkas-detail-program-split-terdaftar-vs-belum-terdaftar).
- [x] 2026-08-12 TENTOR-15 Logo pembuka sidebar drawer mobile; bottom bar tidak diubah.
- [x] 2026-08-12 TENTOR-16 Profil tentor update password dan validasi konfirmasi.
- [x] 2026-08-12 TENTOR-17 Dashboard tentor ringkas, hapus CTA header agenda.
- [x] 2026-08-12 TENTOR-18 Evaluasi perkembangan belajar memakai sesi/rapor nyata, bukan dummy.
- [x] 2026-08-12 TENTOR-19 Auto-fill jam selesai +1 jam untuk tentor/admin, tetap dapat diedit.
- [x] 2026-08-12 TENTOR-20 ConfirmDialog jadwal + sesi lewat masuk riwayat/Butuh Laporan.
- [x] 2026-08-12 TENTOR-21 Jadwal wali filter scheduled belum lewat, nama tentor nyata, badge status-aware.

---

## NC — Restrukturisasi nCourse (Course/Section/Lesson + Entitlement)

> Branch konteks `be-restruktur`, desain grilling 2026-09-15. Backend dulu; satu tahap satu fokus. [D1–D16](../docs/PROGRESS.md#keputusan-ncourse) adalah keputusan/target, bukan checklist implementasi.
> [Aturan akses/empat tier dan risiko](./plan.md#nc-access-design) · [enam fitur bertahap, dua belas ditunda/pemicu](./plan.md#nc-deferred-design).

<a id="backend-parts"></a>
### Eksekusi backend-only per bagian

[Scope/acceptance/gates](./plan.md#backend-restructure). Subtask di bawah memperinci ID NC existing, bukan mengubah status fitur/frontend historis. Satu bagian per checkpoint; remote DB/commit/push/deploy tetap berizin terpisah.

**Bagian 1 — NC-SEC-BE (subset NC-SEC-FOLLOWUP)**
- [x] 2026-09-16 NC-SEC-BE.1 Preflight branch/diff, audit runtime/full workspace backend, dependency paths dan baseline suite.
- [x] 2026-09-16 NC-SEC-BE.2 Verifikasi kandidat patched, Node compatibility, advisory, integrity dan lifecycle scripts.
- [x] 2026-09-16 NC-SEC-BE.3 Pin Express/Morgan dan refresh transitive terkait; review seluruh delta lockfile.
- [x] 2026-09-16 NC-SEC-BE.4 Verifikasi suite backend, typecheck source/test, compile dan audit runtime sesudah patch; lint backend belum tersedia sesuai konfirmasi user.
- [x] 2026-09-16 NC-SEC-BE.5 Review security/scope, sinkronkan progress/checklist, berhenti sebelum auth. — [hasil](../docs/PROGRESS.md#backend-part1-20260916).

**Bagian 2 — NC-1.4 role DB/inactive**
- [x] 2026-09-16 NC-1.4a Staging/development akjzhktsdkbykjknkwwo dan audit read-only disetujui; kontrak 401/403/500 dan ID-only profil disepakati.
- [x] 2026-09-16 NC-1.4b Audit agregat mapping ID/role/inactive selesai; keputusan 5 akun Auth tanpa profil memblokir rollout, bukan dihapus/diaktifkan otomatis — [hasil](../docs/PROGRESS.md#backend-part2-20260916).
- [ ] NC-1.4-ROLLOUT Admin memastikan kegunaan 5 akun Auth tanpa profil dan menyetujui dampak/rekonsiliasi sebelum merge/deploy; smoke tiga role membutuhkan izin tersendiri. (blocked)
- [x] 2026-09-16 NC-1.4c RED: role metadata berbeda, role berubah, user hilang/invalid/inactive, DB/SDK gagal, guard dan nol mutasi; 62 gagal/13 lulus dengan boundary terisolasi.
- [x] 2026-09-16 NC-1.4d GREEN lokal: role DB, tanpa fallback wali, requireRole dan requireAdmin kompatibel; inactive 403 ACCOUNT_INACTIVE tanpa reaktivasi otomatis.
- [x] 2026-09-16 NC-1.4e Profil verified-ID-only, tanpa fallback email, response sukses/murids dipertahankan; validasi ulang akses pada pembacaan profil.
- [x] 2026-09-16 NC-1.4f Regression95/95, typecheck source/test, compile temp dan review security lulus; frontend/smoke nyata di luar scope. Merge/rollout tetap blocked — [checkpoint](../docs/PROGRESS.md#backend-part2-20260916).

**Bagian 3 — NC-1.5 keamanan HTTP**
- [~] NC-1.5a in_progress 2026-09-16: user menyetujui origin lokal http://localhost:3000, akses langsung Express (trust proxy false), limiter umum 300/menit/IP dan resolve-phone 10/15menit/IP per proses. Ukuran payload belum diketahui; batas existing dipertahankan, kenaikan 5mb belum disetujui.
- [ ] NC-1.5-PAYLOAD Konfirmasi ukuran file mentah/JSON sebelum menaikkan limit parser; bukan blocker Helmet/CORS/limiter, tetap blocker penutupan penuh Bagian 3.
- [ ] NC-BE-VERIFY Pengujian menyeluruh diminta user ditunda ke bagian 10 rencana percakapan; regression keamanan terarah/typecheck per perubahan tetap wajib. Tidak ada izin browser/frontend, akun nyata atau DB remote.
- [x] 2026-09-16 NC-1.5b Helmet + CORS allowlist dengan preflight dan absent/disallowed Origin, config production fail-closed — [checkpoint](../docs/PROGRESS.md#backend-part3-20260916).
- [x] 2026-09-16 NC-1.5c Limiter umum/resolve-phone, direct Express trust proxy=false, memory store per proses; forwarding spoof regression lulus.
- [~] 2026-09-16 NC-1.5d Parser existing100kb, JSON400/payload413/encoding415/URL400/rate429 dan error/log generik terimplementasi; regression HTTP/auth/API122/122 + typecheck dan review lulus. Final ukuran payload/full verification/lint tetap pending.

**Bagian 4 — NC-1.7 / NC-1.8**
- [x] 2026-09-16 NC-1.7a Audit tracked/ignored generated client dan temp: `backend/dist/` (backend/.gitignore) dan `backend/src/generated/` (root .gitignore) sudah ignored, tidak ada file generated/temp tracked dan tidak ada `.tmp`; ignore tidak diubah. Audit konfigurasi build/start/shared menunjukkan `build` lama (`tsc`) tidak memuat generated client/shared runtime — [checkpoint](../docs/PROGRESS.md#backend-part4-20260916).
- [x] 2026-09-16 NC-1.7b `backend/build.cjs` (Prisma generate → `tsc` → shared CommonJS → salin generated client + native engine) dan `npm run build`/`test:artifact` tersambung; artifact test 2/2 lulus pada fixture temp terisolasi (env palsu, network guard, startup smoke loopback health200/profil401 tanpa strip-types) plus build nyata ke `backend/dist` yang tetap ignored. Engine native = build per OS target; server artefak tidak dijalankan terhadap DB/Auth nyata.
- [x] 2026-09-16 NC-1.7c Lint backend scoped: `backend/eslint.config.mjs` (recommended JS + TypeScript non-type-checked, `no-explicit-any` warn, ignore dist/generated) dan dependency dev `eslint`/`@eslint/js`/`typescript-eslint`/`globals`; lint exit0 dengan 14 warning `any` (10 di antaranya pra-eksisting di `src/index.ts`), dua unused binding seed dihapus tanpa mengubah data yang di-seed, typecheck source/test exit0, lint frontend tidak dijalankan/disentuh.
- [~] NC-1.8a 2026-09-16 Audit source selesai: `MaterialItem.sessionId` tidak punya konsumen runtime (semua `sessionId` di `src/index.ts` milik `DailyReport`, dan `createMaterialItemSchema` hanya menerima `roadmapStepId`); pemakai tinggal `prisma/seed.ts`, schema, dan FK cascade. Distribusi data live belum dihitung karena butuh izin DB.
- [~] NC-1.8b 2026-09-16 Mapping source-based ditulis di [plan](../tasks/plan.md#bagian-4--artifact-dan-relasi-materi-sesi-nc-17--nc-18) (aturan backfill, syarat drop, rollback, query hitung usulan); eksekusi query/backfill/drop tetap menunggu izin DB dan keputusan tipe `roadmapStepId` frontend.
- [ ] NC-1.C1-BE Checkpoint fondasi backend; bukan pengganti smoke login UI pada task historis NC-1.C1.

**Bagian 5 — backend NC-2**
- [ ] NC-2.3a Characterization kontrak endpoint/export sebelum ekstraksi router/startup.
- [ ] NC-2.3b Pisahkan domain konten bertahap, singleton tetap, service hanya bila diperlukan.
- [ ] NC-2.1a Tetapkan kontrak schema/slug/author legacy/mapping material dan single-writer cutover.
- [ ] NC-2.1b Schema additive Course/Section/Lesson, Program tetap; generate/review migration lokal berizin.
- [ ] NC-2.2a Backfill RoadmapStep + bodyText + MaterialItem; uji count/isi/relasi/idempotensi/rollback pada DB terisolasi.
- [ ] NC-2.2b Gate legacy API/konsumen sebelum cutover/drop; tahan bila membutuhkan frontend.
- [ ] NC-2.6a CRUD authoring + ownership parent-child admin/tentor, validasi input dan pagination.
- [ ] NC-2.6b Reorder/publish/draft + transaksi/conflict tests.
- [ ] NC-2.5-BE Validasi slug/link internal tanpa remote URL fetch; checkpoint backend, tanpa renderer/editor UI.

**Bagian 6 — backend NC-4**
- [ ] NC-4.2-BE Shared role member + phone nullable untuk member, tanpa melonggarkan input admin existing.
- [ ] NC-4.3-BE Provisioning verified-ID/email idempotent; guard khusus profil belum ada, tanpa email relink/inactive bypass.
- [ ] NC-4.5-BE Desain constraint/sumber entitlement, revoke/expiry/multiple sources dan free grant non-GET.
- [ ] NC-4.6-BE Putuskan akhir blok/enrollment expiry/cancel sebelum integrasi grant.
- [ ] NC-4.7-BE Reading progress User×Lesson terpisah dari Progress murid, ownership dan constraint tests.
- [ ] NC-4.C4-BE Test empat tier/revoked/expired/inactive/multi-source; DB tests terisolasi berizin, tanpa signup/redirect UI.

**Bagian 7 — backend NC-3**
- [ ] NC-3.2-BE API katalog/detail metadata dan DTO allowlist/pagination.
- [ ] NC-3.3-BE Lesson slug dengan guard draft/body/paywall, private cache aman setelah Bagian 6.
- [ ] NC-3.4-BE Tutup bypass nested/legacy dan audit grants/RLS Data API; gate kompatibilitas sebelum rollout.
- [ ] NC-3.5-BE Search/filter PostgreSQL dengan visibility/akses yang sama.
- [ ] NC-3.6-BE Related/prev-next aman; negative access tests semua jalur, tanpa halaman publik frontend.

**Bagian 8 — backend rating/pembelian**
- [ ] NC-4.5.1-BE Rating User×Course unik 1–5 berentitlement aktif; hitung peserta user unik, count <5 disembunyikan.
- [ ] NC-5.1a-BE Putuskan model purchase terpisah Invoice les, state machine/refund/revoke/audit trail.
- [ ] NC-5.1b-BE Harga/buyer server-side dan bukti privat; validasi/ownership tests.
- [ ] NC-5.1c-BE Approval+grant atomik/idempotent; concurrency/retry/replay-after-revoke tests DB terisolasi.
- [ ] NC-5.C-BE Final backend checks/review/docs; bukan izin gateway, frontend, atau deploy.

### Tahap 1 — Fondasi (WAJIB, tidak boleh dilewati)

[Hasil baseline](../docs/PROGRESS.md#2026-09-15--nc-12-baseline-diresmikan-setelah-restore-dan-replay) · [hasil client](../docs/PROGRESS.md#2026-09-15--nc-13-ekstraksi-client-backend) · [hasil harness](../docs/PROGRESS.md#2026-09-16--nc-16-test-harness-backend-terisolasi) · [hasil A/B dan batas QA](../docs/PROGRESS.md#2026-09-16--patch-dependency-dan-lint-selesai-penutupan-backend-only) · [riwayat Git](../docs/PROGRESS.md#2026-09-16--commit-dan-push-patch-dependency-serta-lint).

- [x] 2026-09-15 NC-1.1 Simpan pekerjaan wali/rencana NC dan siapkan branch be-restruktur — [riwayat](../docs/PROGRESS.md#arsip-todo-20260916).
- [x] 2026-09-15 NC-1.2 Resmikan baseline 0_init setelah gate backup/restore/replay; pertahankan legacy applied.
  - [x] 2026-09-15 NC-1.2a Preflight branch/Prisma/schema/legacy/project ref tanpa mencetak credential.
  - [x] 2026-09-15 NC-1.2b Audit schema/ACL/RLS/objek public dan backup/restore terisolasi.
  - [x] 2026-09-15 NC-1.2c Promosikan SQL kandidat ke 0_init + lock provider/LF.
  - [x] 2026-09-15 NC-1.2d Replay seluruh history pada DB kosong dan ulang deploy untuk idempotensi.
  - [x] 2026-09-15 NC-1.2e Resolve baseline sekali setelah gate; periksa record/checksum/data.
  - [x] 2026-09-15 NC-1.2f Verifikasi schema/typecheck/backup/restore/replay/review dan docs.
  - [x] 2026-09-16 NC-1.2g Perbaikan lint frontend bertahap, tanpa suppression; penutupan backend-only sesuai user.
    - [x] 2026-09-16 B1 Cache unknown + stable DebugBar snapshot/subscription/clear notification + regression.
    - [x] 2026-09-16 B2 Roadmap latest-request/unmount dan serialisasi reorder; drawer reset pathname tanpa remount portal.
    - [x] 2026-09-16 B3/B4 Tipe jadwal/dashboard/profil, DbMurid, shared useClock dan cleanup.
    - [x] 2026-09-16 B5 Tipe laporan/relasi WA/fallback dan escape JSX.
    - [x] 2026-09-16 B6 Foto/proof Next Image unoptimized; natural dimensions; pertahankan PDF.
    - [x] 2026-09-16 B7/B8 Cleanup unused/deps tanpa menghapus request atau mengubah ESLint rules.
    - [x] 2026-09-16 B9 Verifikasi lint/typecheck/build/regression; final backend-only sesuai batas user.
    - [x] 2026-09-16 B10 Review reorder, sync docs dan cleanup proses sesi.
    - [ ] NC-1.2g-QA QA opsional berizin: visual tiga portal, print, kalender/timezone, drawer nyata, proof portrait/landscape/PDF. Jangan jalankan browser dalam DOC-SYNC.
  - [ ] NC-1.2h Sebelum migration users.email/phone/role, rekonsiliasi ordering legacy fix-null-email; jangan rename/edit applied tanpa strategi history dan replay penuh.
  - [ ] NC-1.2i Backup permanen aman + restore pada versi PostgreSQL sama; public-only bukan DR Auth/Storage/roles — [batas bukti](../docs/PROGRESS.md#2026-09-15--nc-12-baseline-diresmikan-setelah-restore-dan-replay).
  - [ ] NC-1.2j Evaluasi RLS defense-in-depth, leaked-password protection, dan covering index FK; terpisah dari baseline — [temuan historis](../docs/PROGRESS.md#2026-09-15--nc-12-baseline-diresmikan-setelah-restore-dan-replay).
- [x] 2026-09-15 NC-1.3 Ekstrak singleton prisma/supabaseAdmin, env-first/logging/nullable client/export kompatibel.
- [~] NC-1.4 Implementasi lokal role DB/inactive/requireRole dan profil ID-only terverifikasi 2026-09-16 (D5). Audit selesai; merge/rollout blocked NC-1.4-ROLLOUT untuk 5 Auth tanpa profil, frontend belum diselaraskan — [checkpoint](../docs/PROGRESS.md#backend-part2-20260916).
- [~] 2026-09-16 NC-1.5 Helmet/CORS allowlist/limiter/error-log lokal tersedia; parser100kb dipertahankan. Rencana kenaikan5mb belum disetujui karena ukuran file belum diketahui; NC-1.5-PAYLOAD dan verifikasi menyeluruh pending — [checkpoint](../docs/PROGRESS.md#backend-part3-20260916).
- [x] 2026-09-16 NC-1.6 Harness Vitest + supertest, Prisma mock; karakterisasi sebelum role DB.
  - [x] 2026-09-16 NC-1.6a Pin dependency test patched dan review lockfile/transitive.
  - [x] 2026-09-16 NC-1.6b Node-only discovery .test.ts, tsconfig terpisah, aggregate/node/Vitest/watch/typecheck scripts.
  - [x] 2026-09-16 NC-1.6c Env palsu, boundary mock/reset, unexpected-call ledger, network/listener guard.
  - [x] 2026-09-16 NC-1.6d Auth characterization untuk token/role/guard/fallback/exception/isolasi.
  - [x] 2026-09-16 NC-1.6e HTTP RED/GREEN export app minimal, health/profil/admin validation, nol mutasi.
  - [x] 2026-09-16 NC-1.6f Verifikasi suite/typecheck/compile/smoke/build/lint/audit/review — hasil dan keterbatasan di progress.
  - [x] 2026-09-16 NC-1.6g Docs dan staged review/penutupan Git sesuai izin sesi lama.
  - [x] 2026-09-16 NC-1.6h Patch Next/config terarah; residual bukan audit bersih atau approval deploy.
    - [x] 2026-09-16 A1 Baseline dependency/audit dan compatibility target.
    - [x] 2026-09-16 A2 Pin Next/config patched, review resolved/collateral dependencies.
    - [x] 2026-09-16 A3 Instalasi lockfile terisolasi, native image smoke dan audit paths.
    - [x] 2026-09-16 A4 Typecheck BE/FE/test, suite backend, frontend build, baseline lint.
    - [x] 2026-09-16 A5 Smoke publik sebelum pembatasan browser; coverage/batas bukti di progress.
    - [x] 2026-09-16 A6 Review security patch dan dokumentasi residual/cleanup.
    - [~] NC-SEC-FOLLOWUP Patch runtime backend melalui NC-SEC-BE selesai 2026-09-16; residual non-backend tetap pending: baseline-browser-mapping/brace-expansion/browserslist/js-yaml target review 2026-09-23, Babel 2026-09-30. Tanpa audit fix global; scope residual belum diizinkan — [hasil backend](../docs/PROGRESS.md#backend-part1-20260916), [advisory historis](../docs/PROGRESS.md#2026-09-16--patch-dependency-dan-lint-selesai-penutupan-backend-only).
- [~] NC-1.7 Verifikasi tracking/ignore backend/src/generated dan .tmp; jangan mengasumsikan lima file tracked. **Update 2026-09-16:** audit selesai (keduanya ignored, nol file generated/temp tracked) dan packaging `build.cjs`+artifact test lulus; detail di [checkpoint Bagian4](../docs/PROGRESS.md#backend-part4-20260916). — [koreksi klaim lama](../docs/PROGRESS.md#arsip-todo-20260916).
- [~] NC-1.8 Audit lalu rencanakan penghapusan MaterialItem.sessionId; masih ada dan dipakai seed, bukan field yang pasti tidak terpakai. **Update 2026-09-16:** audit source + mapping backfill/syarat drop ditulis di [plan](../tasks/plan.md#bagian-4--artifact-dan-relasi-materi-sesi-nc-17--nc-18); hitung data live, backfill, dan drop kolom belum dieksekusi. — [D16](../docs/PROGRESS.md#keputusan-ncourse).
- [ ] NC-1.C1 Checkpoint BE/FE typecheck, Vitest/build, smoke login tiga role untuk regresi NC-1.4. Semua eksekusi memerlukan izin baru, terutama browser/akun test.

### Tahap 2 — Course / Section / Lesson → fitur #16, #14

- [ ] NC-2.1 Schema Course (slug unik, title, description, level?, category?, accessTier free/paid, price?, status draft/published, publishedAt?, authorId, programId?, active), Section (courseId, order, title, summary?), Lesson (sectionId, slug global unik, title, summary?, bodyText, visibility public/entitled, status, publishedAt?, order, estimatedMinutes?).
- [ ] NC-2.2 Migrasi tiap Program.hasRoadmap → Course; RoadmapStep → Section; bodyText → Lesson urutan 0; MaterialItem → Lesson; slug dari judul dengan keunikan, tanpa kehilangan konten wali.
- [ ] NC-2.3 Strangler routes courses.ts/lessons.ts/admin/authoring.ts + routes/index.ts; pertahankan file lama selama transisi.
- [ ] NC-2.4 Renderer react-markdown + remark-gfm + rehype-sanitize menggantikan MarkdownContent buatan sendiri; dukung link dan markdown aman.
- [ ] NC-2.5 Validasi link internal /materi/slug saat simpan agar tidak ada tautan mati.
- [ ] NC-2.6 Draft/publish + ownership D9: admin semua, tentor hanya authorId sendiri.
- [ ] NC-2.7 UI authoring admin/tentor; migrasikan RoadmapClient ke Lesson, bukan dua model materi paralel.
- [ ] NC-2.C2 Verifikasi konten wali /app/program/[slug] utuh, typecheck/Vitest/build.

### Tahap 3 — Permukaan publik → fitur #5, #18

- [ ] NC-3.1 apiFetchServer dengan @supabase/ssr: sesi cookie → token Express.
- [ ] NC-3.2 /kelas dan /kelas/[slug]: silabus/rating/peserta/CTA, Server Component + generateMetadata.
- [ ] NC-3.3 /materi/[slug]: Server Component + ISR + generateMetadata; satu URL kanonik, backend menentukan body/paywall (D6).
- [ ] NC-3.4 Tutup kebocoran bodyText melalui /api/programs publik; audit akses dan response sebelum perubahan.
- [ ] NC-3.5 Search/filter Postgres tsvector: kategori/level/penulis, tanpa search engine baru (D15).
- [ ] NC-3.6 Related content: link internal, prev/next section, lesson sekelas.
- [ ] NC-3.7 Link /landing → /kelas; jangan sentuh funnel WA /course/* tanpa task khusus.
- [ ] NC-3.C3 Verifikasi HTML konten server-rendered, typecheck/Vitest/build.

### Tahap 4 — Member & Entitlement → fitur #1

- [ ] NC-4.1 Signup email/password/verifikasi Supabase; bangun flow terpisah dari login-only.
- [ ] NC-4.2 Role member pada shared userRoleSchema, middleware, seed, metadata Supabase; audit seluruh caller.
- [ ] NC-4.3 User.phone nullable untuk email-only, tetap atur uniqueness; sesuaikan createUserSchema/resolve-phone.
- [ ] NC-4.4 Landing setelah login member bukan /app/dashboard yang mengasumsikan murid.
- [ ] NC-4.5 Entitlement + auto-grant course free.
- [ ] NC-4.6 Enrollment aktif → entitlement source enrollment, satu jalur akses.
- [ ] NC-4.7 LessonProgress userId×lessonId, terpisah dari Progress muridId×roadmapStepId (D3).
- [ ] NC-4.C4 Guard empat tier, regression tiga role lama, typecheck/Vitest/build.

### Tahap 4.5 — Rating → fitur #9 (bintang saja)

- [ ] NC-4.5.1 Rating userId×courseId unik, score 1–5, hanya entitlement aktif.
- [ ] NC-4.5.2 Jumlah peserta dari entitlement aktif live, bukan counter; sembunyikan jika <5.
- [ ] NC-4.5.3 Rating/peserta di /kelas dan detail.

### Tahap 5 — Monetisasi (D7 masih terbuka)

- [ ] NC-5.1 Checkout one-time manual invoice/upload/verifikasi → entitlement purchase.
- [ ] NC-5.2 Putuskan gateway Midtrans/Xendit setelah volume transaksi diketahui, jangan lock sekarang.

### Tahap 6 — Rename brand nCourse

- [ ] NC-6.1 Rename display/brand: teks UI/title/metadata/logo/copy landing; audit daftar file sebelum eksekusi.
- [ ] NC-6.2 Jangan sentuh domain placeholder, shared package, nama package.json, folder repo (D8).
- [ ] NC-6.3 Migrasi domain placeholder terpisah, belum dijadwalkan; update users.email Prisma dan auth.users tanpa memutus login.

### Referensi scope lanjutan

[Fitur ditunda/pemicu](./plan.md#nc-deferred-design) · [risiko/dependency](./plan.md#nc-access-design). Pemicu bukan izin otomatis.

## Backlog ide (belum dijadwalkan)

- Payment gateway (Midtrans/Xendit).
- Multi-tutor.
- Absensi & nilai.
- Video/live.
- Docker production.
- App terpisah vs monorepo.

## In progress (maks 1 fokus utama)

- **NC-1.7 / NC-1.8 Bagian 4 checkpoint 2026-09-16:** packaging `build.cjs` + script `build`/`test:artifact` dan artifact test terisolasi lulus; lint backend scoped tersedia (lint exit0, 14 warning `any`), typecheck source/test exit0; audit source materi–sesi selesai dan mapping migrasi ditulis di plan. Sisa blocker: NC-1.5-PAYLOAD (batas parser tetap100kb), NC-1.4-ROLLOUT untuk 5 Auth tanpa profil, NC-BE-VERIFY (verifikasi menyeluruh ditunda bagian 10), hitung/petakan data DB dan drop `sessionId` (menunggu izin), inkonsistensi tipe `roadmapStepId` frontend. **WALI-MOB di-pause**; tanpa frontend/browser, akun nyata, DB remote, commit/push atau deploy pada sesi implementasi ini.
