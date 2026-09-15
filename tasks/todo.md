# Tasks — nurman-course

> Source of truth **checklist eksekusi**.  
> **Branch kerja aktif:** `be-restruktur` (restrukturisasi backend nCourse; base dari `dev`) — lihat blok **NC**. Branch `uiux`/WALI-MOB di-pause. Jangan commit ke `main` kecuali diminta user.  
> Roadmap: [`../docs/ROADMAP-LMS.md`](../docs/ROADMAP-LMS.md)  
> Progress log: [`../docs/PROGRESS.md`](../docs/PROGRESS.md)  
> Agent rules: [`../AGENTS.md`](../AGENTS.md)

**Cara pakai**
1. Pilih **satu** task `in_progress` per sesi (kecuali parallel eksplisit).
2. Selesai → `[x]` + tanggal; catat entri di `docs/PROGRESS.md`.
3. Task baru dari scope creep → tulis di sini dulu, **jangan** langsung coding.
4. Jangan loncat fase LMS (mis. Fase 4) jika Fase 1 belum fondasi — kecuali task funnel-only.

**Legend status di komentar baris:** `(pending | in_progress | done | blocked | cancelled)`

---

## Meta — dokumentasi & proses

- [ ] 2026-09-06 WALI-MOB: Redesign Mobile-First Portal Wali Murid (Adopsi Google Stitch Warm Academic Portal, hapus SideNavBar desktop, layout universal frame max-w-md, sinkronisasi tampilan Dashboard, Jadwal, Laporan, Tagihan, Program, Profile) — lihat detail di `tasks/plan-wali-mobile.md` (in_progress)
- [x] 2026-07-29 Tulis `docs/ROADMAP-LMS.md` (MVP, fase, opsi A/B)
- [x] 2026-07-29 Buat `docs/PROGRESS.md` + template log
- [x] 2026-07-29 Buat `tasks/todo.md` (file ini)
- [x] 2026-07-29 Update `AGENTS.md` berpatokan docs/tasks
- [x] 2026-07-29 Mirror vault (03 Roadmap, index, about, 02)
- [x] 2026-08-11 Perkuat disiplin dokumentasi: `AGENTS.md` Step 0 baca wajib + Definition of Done sync docs + peran vault; `docs/PROGRESS.md` tambah template entri & tabel Keputusan; vault disync (ADM-4.2 done) (docs only)
- [x] 2026-08-11 Fix tooling opencode: diagnosa Supabase MCP butuh auth (OAuth token expired) + register MCP codegraph di `D:/AI Agent/opencode-data/opencode.json` (config aktif); JSON VALID, restart opencode utk reload (Meta, di luar git repo)
- [x] 2026-08-11 Instal Agent Skills Supabase global (`npx skills add supabase/agent-skills`) + OAuth MCP Supabase sukses (`opencode mcp auth supabase` → "Authentication successful"); MCP config sudah ada (Meta, di luar git repo)
- [x] 2026-08-11 Migrasi DB Supabase → MySQL **dibatal & di-revert** ke HEAD `fb9bc7a` (targeted revert; per AGENTS larangan ganti stack diam-diam). Kode/migrasi kembali ke Supabase (schema.prisma `postgresql`, seed `getOrCreateSupabaseUser`, hapus `backend/src/auth.ts`, env restore, drop DB MySQL `nurman_course`, prune `bcryptjs`/`jose`). Catat entri di `docs/PROGRESS.md`. (Meta/undo, branch `main`)

---

## Hapus Demo Mode (Frontend Live-API Only)

- [x] 2026-08-05 DMO-1 Hapus demo mode total: `isDemoMode()` dari `lib/api.ts`, bypass demo di `middleware.ts`, banner/padding demo di 3 layout portal, cabang demo + resolver dummy di semua halaman wali/tentor/admin, guard `isDemoMode` + `demoAccounts/demoEnrollments/demoInvoices`, purge `dummy*` data & helper `data/lms.ts` (interface tetap), hapus `DEMO_MODE`/`NEXT_PUBLIC_DEMO_MODE` dari `.env.example` & `.env.local`
- [x] 2026-08-05 DMO-2 Hapus keterangan banner demo di `/app` (portal selector) dan implementasikan proteksi role-based sejati di `middleware.ts` (admin bypass, tentor ke `/app/tentor/*`, wali ke halaman dashboard wali)

---

## Terminology Migration

- [x] 2026-08-01 Rename penuh `pengajar` → `tentor`: shared role, Prisma field/column, Supabase metadata, API endpoint, frontend, docs, dan desain aktif.

---

## Admin Murid + Akun Wali

- [ ] 2026-08-01 M1 Schema Murid: address, registeredAt, photoPath, phone normalization/unique constraint.
- [ ] 2026-08-01 M2 Shared schema + helper normalize phone.
- [ ] 2026-08-01 M3 API create/update murid satu flow dengan create/reuse akun wali.
- [ ] 2026-08-01 M4 Supabase Storage foto murid + signed URL. (2026-08-23: on-hold — Opsi bucket publik ditolak user karena foto bisa diakses tanpa login; butuh keputusan privat bucket + signed URL. Foto tetap base64 di `photoPath`.)
- [ ] 2026-08-01 M5 UI admin murid: form murid + wali, upload foto, status, detail.
- [x] 2026-08-05 M6 Login email/nomor hape dengan password.
- [x] 2026-08-05 M6.1 Fix auto-generate email untuk wali tanpa email (login nomor WA).
- [x] 2026-08-05 M6.2 Fix Supabase Auth email null: tambah email_confirm:true & SQL update auth.users.
- [ ] 2026-08-01 M7 Seed/migrasi akun existing + verifikasi multi-murid per wali.
- [ ] 2026-08-01 M8 Build, lint, typecheck, live API/auth/storage test, update PROGRESS.

---

---

## Funnel polish (boleh paralel dengan planning LMS; tidak mengubah arah LMS)

Ad-hoc:
- [x] 2026-08-24 UIUX: Peningkatan kontras visual portal wali murid (`/app/program` & `/app/program/[slug]`). Card utama diganti dari bg-app-surface ke bg-app-white, warna teks muted digelapkan dari #6b7b6c ke #556656. Verifikasi build compile OK.
- [x] 2026-08-24 UIUX: Redesign besar `/landing` dengan AppVerse.id Design System (tambah LandingTutors carousel) — warna utama tetap `#4a70a9` (biru), canvas `#f7f4ef` (warm bg), border `#c8b99a`, text `#1a1a18`, card/surface `#edeae3` (solid), rounded-[6px] buttons, rounded-2xl cards, font Playfair Display (heading) + DM Sans (body) via next/font/google di layout.tsx; build test 35 routes OK.
- [x] 2026-08-11 UIUX: Admin portal mobile — ganti bottom bar (penuh) jadi **sidebar drawer** via hamburger menu: top bar mobile (Menu + brand + badge Admin), backdrop + panel slide kiri berisi 9 nav (termasuk Roadmap yg sebelumnya tak ada) + Portal + Keluar, badge waitingCount di Tagihan, tutup saat klik link/backdrop/Escape/perubahan route, `role="dialog"`/`aria-modal`; `main` pb-24→pb-6; hanya `admin/layout.tsx` (role lain tak terpengaruh, layout terpisah); tsc 0
- [x] 2026-08-11 ADMIN: Murid page mobile rapi — fix overflow horizontal (baris aksi `flex shrink-0` → `flex flex-wrap`) + **Reset PW akun Wali** (murid login sbg parent): `POST /api/admin/users/:waliId/reset-password` (default 12345678), tombol "Reset PW" amber per kartu, banner sky password + tombol Salin (Copy/Check), state `lastTempPassword`/`copied`; hanya `admin/murid`, tsc 0, next build OK
- [x] 2026-08-11 ADMIN: Hapus permanen Murid & Tentor — BE `DELETE /api/admin/murids/:id` & `/users/:id` soft (deactivate) vs `?force=1` hard (`prisma.delete` cascade); hard user juga `supabaseAdmin.auth.admin.deleteUser` (akun tak bisa login); guard tak bisa hapus self/admin; FE `ConfirmDialog` + props `icon` (Trash2), tombol "Nonaktifkan"+"Hapus" (modal warning jumlah cascade) di `admin/murid` & `admin/tentor`, ganti `window.confirm` → modal; tsc BE+FE 0, next build OK
- [x] 2026-08-11 UIUX: Redesign halaman login `/login` (clean + interaktif, logic identik): header brand + orbs blur latar + entrance fade-up (keduanya `motion-reduce`-safe), ikon input lucide + focus ring + `autoComplete`, toggle tampil/sembunyikan password, alert pakai ikon + role semantik, tombol spinner & panah hover, trust note; **helper email/WA dinamis** (kosong→tanpa teks, diawali angka→"Format 62... bukan 08...", selain itu→"format email valid"); `Button.tsx` + `inline-flex items-center justify-center gap-2`; via skill `ui-ux-pro-max`; tsc 0, next build OK. **Susulan:** jadikan **login-only** (hapus mode Daftar: state `isSignUp`/nama/WA, cabang signUp di `handleAuth`, field & toggle footer, `successMsg`, import User/Phone/ShieldCheck), placeholder email dikosongkan, subtitle dibuat hitam (`text-black`), footer jadi kredit resmi "© {tahun} Nurman Course"; tsc 0.
- [x] 2026-08-06 UIUX: Landing `/landing` lanjutan — nav tambah Tentang Kami & Testimoni; kartu hero ganti 5 keunggulan (`heroBenefits`); harga 15rb/sesi mencolok + badge pulse (`animate-ping`, reduced-motion safe); section `#tentang` (`LandingAbout`, `aboutPoints`) & `#testimoni` (`LandingTestimonials`); tsc 0, next build OK
- [x] 2026-08-06 UIUX: Landing page baru `/landing` (terpisah dari `/course`): struktur template `landingpagedesign.md` (nav + hero + stats + kategori + CTA + footer), warna glassmorphism light `#4a70a9`, data statis di `data/landing.ts` (`landingStats`, `landingCategories`), komponen `components/landing/*`, route `app/landing/page.tsx`; tsc 0, next build 35 routes OK
- [x] 2026-08-05 UIUX: Polish portal wali murid mobile-first (layout 5-item nav + top bar Portal/Keluar, header GlassCard seragam, tab laporan 2 kolom, fix sticky bar [slug], riwayat tagihan kartu mobile) — tanpa ubah logic/primary color
- [x] 2026-08-05 UIUX: Polish navigasi bottom bar wali murid mobile (Dashboard di tengah, icons-only, raised 3D effect)
- [x] 2026-08-05 UIUX: Fitur foto profil murid (avatar) pada Dashboard & Profil, serta fitur pembayaran mandiri/prabayar pada Tagihan Saya ketika semua tagihan lunas.
- [x] 2026-07-29 Marquee landing: tambah "Laporan progres belajar anak"
- [x] 2026-07-29 P12 Landing: social proof + program favorit + testimoni + framer-motion
- [x] 2026-07-29 Fix hydration error PageHeader (tombol back className)
- [x] 2026-07-29 P13 Tutor carousel infinite loop
- [x] 2026-07-29 Ganti mentor Kak Fikri → Kak Kiki (D3 Informatika, Politeknik Negeri Cilacap)
- [x] 2026-07-29 Komputer Dasar: silabus L1/L2 dari vault + L3 Coming Soon (`comingSoon`)
- [x] 2026-07-29 Pricing KD: L1 35k / L2 40k; durasi 90 menit ×1.3; `getLevelBasePrice`
- [x] 2026-07-29 Config: defaults 90/3x/siswa; frekuensi 4x; jam 13–19; chip hijau pulse; tentor & 2 jam CS
- [x] 2026-07-29 Jumlah peserta: copy kelas + harga per anak; diskon 2=20% / 3=35% (×0.65)
- [x] 2026-07-29 Config: input Nama Lengkap wajib → baris `Nama:` di WA
- [x] 2026-07-29 Format pesan WA: bold/section/bullet
- [x] 2026-07-29 Materi komputer-dasar: efek level terpilih + badge Terpilih
- [x] 2026-07-29 Calistung: paket Ngaji 15k + Calistung & Ngaji 30k
- [x] 2026-07-29 Config calistung: hide Level di UI + WA
- [x] 2026-07-29 Config: input nama dinamis 1–3 sesuai jumlah peserta
- [x] 2026-07-29 Plan + implement Kelas Vibe Coding (`vibe-coding` L1–L3 40/45/50k; syarat laptop+internet)
- [ ] Paket 12 sesi / all-in Vibe Coding (masih diskusi)

Prioritas tinggi:
- [~] 2026-08-23 P1 Sync `AGENTS.md` / `SYSTEM_MAP.md` dengan kode (branch `dev`) — **SYSTEM_MAP.md selesai** (rewrite penuh: routing 35 route, folder structure, key files api.ts/DebugBar/middleware/lms.ts/seed.ts, data flow portal, 13 model Prisma); **AGENTS.md menyusul**. Keputusan: migrasi foto murid ke Supabase Storage dibatalkan (bucket publik = foto bisa diakses tanpa login, user menolak; M4 on-hold); rule 1 wali = 1 murid dipertahankan (blok 409 tidak dihapus)
- [ ] P2 Metadata + README (bukan boilerplate create-next-app)
- [ ] P3 Label WA calistung: pesan WA pakai "Program" jika `program=calistung`

Prioritas sedang:
- [ ] P4 `/course/program` dari data/`getCategories`, bukan hardcode 3 route
- [x] 2026-08-24 P5 Tutor data pindah ke `data/` (tutors array disentralisasi di data/landing.ts)
- [ ] P6 UX query config invalid (sudah ada partial — review)

Prioritas rendah:
- [ ] P7 State persistence (opsional)
- [ ] P8 Sesi online real
- [ ] P9 Test suite (pricing + smoke flow)
- [ ] P10 Hari full dinamis

---

## Fase 0 — Spec & model data (docs only)

- [x] 2026-07-31 F0.1 Finalisasi daftar entity + field (User, Program, RoadmapStep, Session, MaterialItem, Enrollment, Invoice, DailyReport, ProgressReport)
- [x] 2026-08-01 F0.2 ERD kasar (docs/erd-lms.md)
- [ ] F0.3 Mapping kasar `materials.ts` → Program/RoadmapStep (untuk migrasi nanti)
- [x] 2026-08-01 F0.4 Shortlist stack (Postgres + Supabase Auth)
- [x] 2026-08-01 F0.5 Catat keputusan open: Opsi A, akun wali dibuat admin, wali lihat harian+perkembangan — di `PROGRESS.md`

**Exit Fase 0:** entity jelas, ERD ada, stack kandidat tertulis, open questions tersisa ≤ 3.

---

## Fase 1 — Fondasi

- [x] 2026-08-01 F1.1 Pilih & setup DB + env (tanpa commit secret)
- [x] 2026-08-01 F1.2 Auth admin + tentor + wali (minimal)
- [ ] F1.3 Shell app terautentikasi (`/app` atau setara) + layout
- [x] 2026-08-01 F1.4 Seed 1 program dummy + 1 admin
- [x] 2026-08-01 F1.5 Proteksi route (admin vs tentor vs wali)

**Exit Fase 1:** login jalan; admin masuk shell; 1 program di DB.

---

## Fase 1.5 — Restrukturisasi Monorepo & Express API (Selesai)

- [x] 2026-08-01 F1.5.1 Arsipkan backend existing & hapus duplikat desain `prompt-google-stitch/` (menahan `desain-ui-frontend/`)
- [x] 2026-08-01 F1.5.2 Setup npm workspaces & Turborepo di root package
- [x] 2026-08-01 F1.5.3 Pindahkan frontend Next.js ke subfolder `frontend/` (config tsconfig, next.config, env, alias path `@/`)
- [x] 2026-08-01 F1.5.4 Inisialisasi packages/shared untuk shared types & zod schemas
- [x] 2026-08-01 F1.5.5 Upgrade `backend/` ke Express API Server (Express + Prisma 3-role model sesuai `docs/erd-lms.md`)
- [x] 2026-08-01 F1.5.6 Implementasi middleware auth verifikasi JWT Supabase di Express
- [x] 2026-08-01 F1.5.7 Buat route profil minimal `/api/users/me` & health-check di backend Express
- [x] 2026-08-01 F1.5.8 Sinkronisasi docs (`AGENTS.md`, `SYSTEM_MAP.md`, `PROGRESS.md`, `tasks/todo.md`)

**Exit Fase 1.5:** workspaces aktif; frontend di `frontend/` & backend Express di `backend/` terintegrasi shared package; build monorepo sukses; API `/api/health` & `/api/users/me` jalan.

---

## Fase 2 — Katalog, Murid & Tentor (Aktif - Demo UI Offline)

- [ ] F2.1 Admin CRUD Program (termasuk `sessionsPerBlock`)
- [ ] F2.2 Admin CRUD User Tentor & Wali Murid
- [ ] F2.3 Admin CRUD Murid & Enrollment (menghubungkan murid ke wali & program)
- [ ] F2.4 Admin CRUD RoadmapStep & MaterialItem
- [x] 2026-08-01 F2.5 Wali: lihat katalog & roadmap belajar anak (Implementasi UI Demo dengan Data Dummy)
- [x] 2026-08-01 F2.6 Wali: baca materi belajar anak (Implementasi UI Demo dengan Data Dummy)
- [x] 2026-08-01 F2.7 Wali: lihat jadwal sesi & histori laporan harian (Implementasi UI Demo dengan Data Dummy)
- [x] 2026-08-01 F2.8 Wali: lihat tagihan & konfirmasi pembayaran via WhatsApp (Implementasi UI Demo dengan Data Dummy)

**Exit Fase 2:** data master lengkap terkelola, wali bisa lihat materi & roadmap anaknya.

---

## Fase 3 — Jadwal & Laporan Sesi (Aktif - Demo UI Offline)

- [ ] F3.1 Admin CRUD Session (assign program, tentor, murid, tanggal, jam)
- [x] 2026-08-01 F3.2 Tentor: lihat jadwal sesi mengajar (Implementasi UI Demo dengan Data Dummy)
- [x] 2026-08-01 F3.3 Tentor: input Laporan Harian (DailyReport) (Implementasi UI Demo dengan Data Dummy)
- [x] 2026-08-01 F3.4 Tentor: input Laporan Perkembangan (ProgressReport) setelah N sesi selesai (Implementasi UI Demo dengan Data Dummy)
- [x] 2026-08-01 F3.5 Wali: lihat Jadwal, Laporan Harian, & Laporan Perkembangan anak (Selesai di Fase 2 & Diselaraskan)

**Exit Fase 3:** tentor bisa input laporan per sesi & per blok, wali murid bisa pantau secara real-time.

---

## Fase 4 — Tagihan / pembayaran

- [ ] F4.1 Model Invoice (unpaid/waiting/paid) terhubung ke Enrollment murid
- [ ] F4.2 Admin terbitkan invoice & kelola status
- [ ] F4.3 Wali: lihat tagihan & petunjuk transfer
- [ ] F4.4 Wali: upload bukti transfer & kirim konfirmasi WhatsApp

**Exit Fase 4:** status bayar terlihat admin & wali, konfirmasi manual berjalan lancar.

---

## Fase 5 — Integrasi funnel

- [ ] F5.1 Putuskan final **Opsi A** atau **Opsi B** (catat di PROGRESS)
- [ ] F5.2 Implement integrasi sesuai opsi
- [ ] F5.3 Rencana deprecation/mapping `materials.ts` jika diganti DB
- [ ] F5.4 Jaga funnel production tidak putus selama cutover

**Exit Fase 5:** lead flow & LMS selaras dengan keputusan A/B.

---

## Fase 3.6 — Integrasi Frontend ↔ Backend API (Pilot Tentor) (Selesai)

**A. Fondasi koneksi & model data**
- [x] 2026-08-01 F3.6.A1 Rekonsiliasi identitas: ubah `backend/prisma/seed.ts` untuk buat user Supabase Auth via Admin API, samakan id dengan user Prisma, tambahkan email fallback di `/api/users/me`
- [x] 2026-08-01 F3.6.A2 API client frontend: buat `frontend/lib/api.ts` (Bearer JWT, `isDemoMode()`), buat `frontend/.env.example`
- [x] 2026-08-01 F3.6.A3 Selaraskan model data: migrasi `ProgressReport` ke `String[]` di DB + shared zod, tambah `Murid.avatarUrl` nullable di DB, jalankan Prisma migration + seed ulang

**B. Endpoint backend (pilot tentor)**
- [x] 2026-08-01 F3.6.B1 Endpoint `GET /api/programs` & `GET /api/programs/:id`
- [x] 2026-08-01 F3.6.B2 Endpoint `GET /api/me/sessions` (sesi tentor login, include murid & program)
- [x] 2026-08-01 F3.6.B3 Endpoint `GET /api/me/daily-reports` & `POST /api/daily-reports` (validation Zod, upsert by sessionId)
- [x] 2026-08-01 F3.6.B4 Endpoint `GET /api/me/progress-reports` & `POST /api/progress-reports` (validation Zod)

**C. Frontend pilot — halaman tentor pindah ke API (dengan support DEMO_MODE toggle)**
- [x] 2026-08-01 F3.6.C1 Jadwal tentor (`jadwal/page.tsx`): fetch API + status handling + fallback dummy
- [x] 2026-08-01 F3.6.C2 Dashboard tentor: sesi hari ini + stat via API + fallback dummy
- [x] 2026-08-01 F3.6.C3 Laporan Harian (`LaporanHarianClient.tsx`): list + form submit/edit via API
- [x] 2026-08-01 F3.6.C4 Laporan Perkembangan: list + form submit via API

**D. Verifikasi & docs**
- [x] 2026-08-01 F3.6.D1 Uji koneksi & verifikasi input data masuk database
- [x] 2026-08-01 F3.6.D2 Jalankan linting dan build monorepo
- [x] 2026-08-01 F3.6.D3 Update PROGRESS.md

**Exit Fase 3.6:** Portal tentor dapat beralih antara data dummy offline dan API nyata dari backend, data laporan terbukti ter-insert ke database PostgreSQL Supabase via Express API.

---

## Fase 3.7 — Integrasi Frontend ↔ Backend API (Portal Wali Murid) (Selesai)

**A. Endpoint backend**
- [x] 2026-08-01 F3.7.A1 Endpoint `GET /api/me/enrollments` (role-aware wali)
- [x] 2026-08-01 F3.7.A2 Endpoint `GET /api/me/invoices` (role-aware wali)
- [x] 2026-08-01 F3.7.A3 Endpoint `GET /api/me/progresses` (role-aware wali)

**B. UI Portal Wali Murid pindah ke API (dengan support DEMO_MODE toggle)**
- [x] 2026-08-01 F3.7.B1 Dashboard wali (`dashboard/page.tsx`): data anak + program aktif + status rekap
- [x] 2026-08-01 F3.7.B2 Program katalog (`program/page.tsx`): daftar program + badge terdaftar
- [x] 2026-08-01 F3.7.B3 Roadmap belajar (`program/[slug]/page.tsx`): timeline + status steps
- [x] 2026-08-01 F3.7.B4 Jadwal belajar (`jadwal/page.tsx`): sesi mendatang + riwayat
- [x] 2026-08-01 F3.7.B5 Laporan belajar (`laporan/page.tsx`): tab laporan harian & perkembangan
- [x] 2026-08-01 F3.7.B6 Tagihan saya (`tagihan/page.tsx`): unpaid invoice & riwayat tabel, breakdown mapped

**C. Verifikasi & docs**
- [x] 2026-08-01 F3.7.C1 Jalankan linting dan build monorepo
- [x] 2026-08-01 F3.7.C2 Update PROGRESS.md

**Exit Fase 3.7:** Seluruh portal Wali Murid terhubung ke API backend dengan support DEMO_MODE toggle, build & lint berjalan sukses tanpa warning/error.

---

## Fase 3.8 — Integrasi Frontend ↔ Backend API (Portal Admin) (Selesai)

**A. API Endpoints baru (admin-only)**
- [x] 2026-08-01 F3.8.A1 Buat endpoint `GET /api/admin/murids` (list murid + wali)
- [x] 2026-08-01 F3.8.A2 Buat endpoint `GET /api/admin/tentors` (list user role tentor)

**B. UI Portal Admin pindah ke API (dengan support DEMO_MODE toggle)**
- [x] 2026-08-01 F3.8.B1 Dashboard admin (`admin/page.tsx`): metric stats + sesi hari ini
- [x] 2026-08-01 F3.8.B2 Layout admin (`admin/layout.tsx`): banner "Mode Demo" conditional rendering

**C. Verifikasi & docs**
- [x] 2026-08-01 F3.8.C1 Jalankan linting dan build monorepo (0 error/warning)
- [x] 2026-08-01 F3.8.C2 Update PROGRESS.md & todo.md

**Exit Fase 3.8:** Seluruh portal Admin terhubung ke API backend dengan support DEMO_MODE toggle, build & lint berjalan sukses tanpa warning/error.

---

## Plan Portal Admin Lengkap — ADM (Draft Siap Implementasi)

> Detail acceptance criteria, dependency graph, risiko, dan open questions ada di [`tasks/plan.md`](./plan.md).
> Fokus aktif maksimal satu task utama; jangan menandai task domain selesai sebelum API, UI, dan verifikasi domain tersebut selesai.

### Phase 0 — Persiapan dan Kontrak
- [x] 2026-08-01 ADM-0.1 Audit baseline portal admin, route, endpoint, Prisma field, dan dependency graph
- [x] 2026-08-01 ADM-0.2 Definisikan contract API, status, response, dan Zod schema bersama
- [x] 2026-08-01 ADM-0.3 Siapkan helper admin API, query params, error handling, dan pola UI reusable
- [x] 2026-08-01 ADM-0.C0 Checkpoint kontrak: backend tsc, frontend lint/typecheck, contract konsisten

### Phase 1 — Program Catalog
- [x] 2026-08-01 ADM-1.1 API CRUD Program: list/filter, detail, create, update, deactivate, role guard
- [x] 2026-08-01 ADM-1.2 UI Program: menu, list, filter, form create/edit, deactivate
- [ ] ADM-1.3 Seed dan verifikasi Program: duplicate slug, validasi, live CRUD flow
- [ ] ADM-1.C1 Checkpoint Program: integration test/manual API, responsive UI, build/lint

### Phase 2 — User, Wali, Tentor, dan Murid
- [x] 2026-08-01 ADM-2.1 API user Tentor/Wali: create auth + profile, update, deactivate, secret safety
- [x] 2026-08-01 ADM-2.2 UI Tutor: list/filter, form data tutor, detail, edit, deactivate
- [x] 2026-08-01 ADM-2.3 API Murid: list/filter, detail, create, update, wali relation, safe deactivate
- [x] 2026-08-01 ADM-2.4 UI Murid: list, form, detail, enrollment/session/report summary
- [x] 2026-08-01 ADM-2.C2 Checkpoint user/murid: role guard, duplicate email, invalid relation, build/lint

### Phase 3 — Enrollment
- [x] 2026-08-01 ADM-3.1 API Enrollment: list/filter, create, update status, detail, duplicate prevention
- [x] 2026-08-01 ADM-3.2 UI Enrollment: menu, list/filter, form, detail, cancel/complete
- [x] 2026-08-01 ADM-3.C3 Checkpoint enrollment: transaction, program inactive, empty/error/loading state
- [x] 2026-08-12 ADM-3.4 Hapus permanen enrollment: BE `DELETE /api/admin/enrollments/:id` (cascade invoice, 404 bila tak ada) + FE tombol Hapus merah + `ConfirmDialog` peringatan tagihan + baris aksi `flex-wrap`; tsc BE+FE 0, backend restart, smoke 401 rute terdaftar (branch `main`)
- [x] 2026-08-12 TENTOR/WALI-1 Header pakai logo Nurman Course gaya landing (lingkaran gelap `#2e4b7a` + border putih + shadow, diperkecil `h-11 w-11` sidebar / `h-8 w-8` mobile) + teks di layout tentor (desktop + mobile, hapus `GraduationCap`) & layout wali/murid (desktop + mobile); tsc FE 0 (branch `main`)
- [x] 2026-08-12 LOGIN-1 `/login` pakai logo Nurman Course gaya landing (lingkaran gelap `h-16 w-16`, `Image h-14 w-14 rounded-full`, `pointer-events-none aria-hidden` non-klik) menggantikan kotak `GraduationCap`; import `Image` + hapus `GraduationCap`; tsc FE 0 (branch `main`)
### Phase 4 — Roadmap dan Materi Teks
- [x] 2026-08-01 ADM-4.1 API RoadmapStep: list, create, update, delete, reorder, cascade policy
- [x] 2026-08-06 ADM-4.2 API MaterialItem: list, create, update, delete, order dan body validation
- [x] 2026-08-06 ADM-4.3 UI Roadmap/Materi: program selector, timeline, editor teks, material reorder/preview
- [x] 2026-08-06 ADM-4.C4 Checkpoint roadmap: order, cascade, invalid content, wali read regression

### Phase 5 — Session dan Jadwal
- [x] 2026-08-24 ADM-5.1 API Session: list/filter, detail, create, update, cancel, relation/time/conflict validation (termasuk bentrok murid & tentor)
- [x] 2026-08-06 ADM-5.2 UI Jadwal Sesi: calendar/list, filters, assignment form, detail, cancel
- [x] 2026-08-24 ADM-5.C5 Checkpoint session: invalid time, overlap murid/tentor, tentor/wali consumer regression, build/lint

### Phase 6 — Invoice dan Status Pembayaran
- [x] 2026-08-01 ADM-6.1 API Invoice: list/filter, detail, create, status transition, paidAt consistency
- [x] 2026-08-01 ADM-6.2 UI Tagihan: list, status filter, issue invoice, detail, status action
- [x] 2026-08-01 ADM-6.C6 Checkpoint invoice: transition, amount validation, duplicate request, wali regression
- [x] 2026-08-01 ADM-6.5 Data master rekening bank (PaymentAccount): CRUD admin + GET publik wali, hapus hardcode di halaman wali

### Phase 7 — Integrasi dan Polish
- [ ] ADM-7.1 Sinkronisasi semua menu, dashboard, link detail, dan demo mode
- [ ] ADM-7.2 UX/accessibility/security hardening seluruh portal admin
- [ ] ADM-7.3 Test endpoint/UI, build/lint, update docs dan system map
- [ ] ADM-7.C7 Definition of Done: semua domain live, role guard lengkap, regression bersih, review selesai

### Keputusan Terbuka
- [x] 2026-08-01 ADM-Q1 Putuskan aturan duplicate enrollment aktif untuk murid-program → ditolak `409`
- [x] 2026-08-24 ADM-Q2 Putuskan konflik jadwal: hard reject 409 (baik untuk tentor maupun murid)
- [ ] ADM-Q3 Putuskan flow password akun baru: temporary password atau invite/reset email
- [x] 2026-08-24 ADM-Q4 Putuskan apakah role akun existing boleh diubah admin: dibatasi, dilarang ubah role bila ada relasi murid/sesi aktif

### Admin Tentor Polish (request user 2026-08-05)

- [x] 2026-08-05 TENTOR-1 Schema: tambah `address` + `photoPath` di `User` (Prisma) + `db push` + `generate`
- [x] 2026-08-05 TENTOR-2 Shared: `createUserSchema`/`updateUserSchema` email opsional + fallback WA + `address`/`photoPath` (phoneSchema dipindah ke atas, normalizePhone konsisten)
- [x] 2026-08-05 TENTOR-3 Backend: POST/PATCH `/api/admin/users` handle alamat/foto/email placeholder `phone@nurmancourse.local`, sync auth metadata (role/name/phone + email jika berubah), `photoPath` & `address` di Prisma; tambah helper `generatePlaceholderEmail`
- [x] 2026-08-05 TENTOR-4 UI `/app/admin/tentor`: input alamat (textarea) + upload foto (lingkaran preview 80px + Camera icon + fileInputRef + resize canvas 400px JPEG 80% — pola `admin/murid`) + email opsional + keterangan aturan penulisan di tiap field + box ketentuan (uniq phone/email, foto base64, placeholder email, login WA via resolve-phone) + tampil alamat/foto di list (truncate) & detail modal (avatar besar + alamat) + filter search include alamat
- [x] 2026-08-05 TENTOR-5 Verifikasi awal: `tsc --noEmit` backend+frontend sukses (exit 0), `next build` 32 routes verified, restart backend required
- [x] 2026-08-05 TENTOR-6 Fix login tentor tanpa password: ubah random password → constant `12345678` (DEFAULT_NEW_USER_PASSWORD) di `backend/src/index.ts`; wali `POST /api/admin/murids` juga samakan `ncourse@123` → `12345678`; tambah endpoint `POST /api/admin/users/:id/reset-password` (admin-only, body password optional default 12345678, update via `auth.admin.updateUserById`); UI `admin/tentor`: tombol Reset PW, banner temp password + copy button, keterangan default password & flow login WA (`resolve-phone` → placeholder email → signInWithPassword) di form & box ketentuan; `login/page.tsx` hint "Tentor/Wali bisa login pakai No WA, default 12345678"; `tsc` backend+frontend exit 0; solves 62835xxxx invalid credential
- [x] 2026-08-05 TENTOR-7 Login page clean: hapus panel "Akun Testing" + ikon aneh, tambah keterangan di bawah input Email/No WA "Email bisa, atau No WA format 62... (contoh 6281234567890), bukan 08..." dan di bawah password "Password default 12345678"; fix redirect role-aware (admin→/app/admin, tentor→/app/tentor, wali→/app/dashboard); `tsc` ok; backend restart required + reset PW akun 62835454454 existing
- [x] 2026-08-05 TENTOR-8 Profil tentor tombol sejajar: `/app/tentor/profil` grid 2 col `Pilih Portal` + `Keluar` sama height `h-11 rounded-xl`; backend `GET /api/me/sessions` include tentor {id,name} untuk wali; jadwal tentor manual: shared `createTentorSessionSchema/updateTentorSessionSchema` + `POST /api/me/sessions` enrollment check + overlap 409 + location default alamat murid, `PATCH /api/me/sessions/:id` reschedule + cancel guard laporan, `DELETE /api/me/sessions/:id` guard laporan; UI `/app/tentor/jadwal` modal create/edit, enrollment dropdown, lapor bentrok, batalkan/hapus, filter murid, notice/error, dashboard CTA Buat Jadwal; wali jadwal `tentor.name` dinamis + WA reschedule pakai nama tentor; tsc BE+FE 0
- [x] 2026-08-05 TENTOR-9 Fix 404 Buat Jadwal + Cetak PDF rapi: kill PID 13232 lama, `npm run dev --workspace=backend` required, `LaporanHarianClient` & `LaporanPerkembanganClient` rewrite print rapi window.print, dynamic tentorName dari `/api/users/me`, alamat `Jalan Kalisabuk`, tabel terstruktur 5 col harian (No|Hari&Tanggal|Jam|Materi|Catatan) + 3 tabel rapor (Pencapaian|Dikuasai|Butuh Pengulangan), `@page A4`, `print:hidden` nav, `print-avoid-break`, tombol Cetak desktop `Cetak PDF` + sticky mobile `bottom-[72px]` `Cetak Hasil Belajar / Rapor Blok N`, document.title dinamis; grep Kak Kiki/Cempaka kosong, tsc 0, next build 28 routes OK
- [x] 2026-08-05 TENTOR-10 Hapus akses portal tentor (dead-end UI): `tentor/layout.tsx` hapus Link `/app` "Pilih Portal" di sidebar desktop + hapus import `UserCheck`; `tentor/profil/page.tsx` hapus tombol "Pilih Portal", grid jadi `grid-cols-1` tombol "Keluar" full-width; middleware sudah blokir tentor dari `/app` (redirect ke `/app/tentor/dashboard`); admin tetap punya Pilih Portal; `next build` 32 routes OK, tsc pass
- [x] 2026-08-06 TENTOR-13 Flow pembayaran invoice real + badge notif: schema Invoice + `paymentProof`(base64)/`paymentProofName`/`paidAmount`/`submittedAt` + `prisma db push` & `generate` (generate sempat EPERM → stop BE dulu); shared `submitPaymentSchema`; BE `POST /api/me/invoices/:id/payment` (wali, guard milik sendiri + status harus unpaid → waiting + simpan bukti/amount/submittedAt), `GET /api/me/notifications` → `{unpaidInvoices}`, `GET /api/admin/notifications` → `{waitingInvoices}`; FE wali `/app/tagihan`: upload bukti real (resize canvas 400px JPEG 80% pola foto, PDF raw max ~3MB, preview), tombol utama "Kirim Data Pembayaran", status jadi "Menunggu Verifikasi" + box info dibayar/terkirim/file, tombol WA sekunder logo WA hijau `#25D366` + teks "Konfirmasi Pembayaran" (begitu juga tombol prabayar); badge angka merah kecil di layout wali (item Tagihan sidebar+bottombar = count unpaid, refetch tiap ganti halaman) & admin (item Tagihan sidebar+bottombar = count waiting); admin tagihan: kartu waiting tampil thumbnail bukti (klik buka / PDF) + nominal dibayar + waktu terkirim; tombol "Keluar" profil tentor & wali dibuat rata tengah (`flex justify-center`); prabayar tetap WA-only (follow-up task); tsc BE 0, next build 32 routes OK
- [x] 2026-08-06 TENTOR-12 Profil & konfirmasi logout semua role: hapus badge "Tentor" dobel di bawah nama (`tentor/profil/page.tsx` — sisakan badge role Shield); tombol "Keluar" profil jadi compact `inline-flex items-center gap-2 px-4 py-2 text-sm` sejajar ikon-teks (Button tak punya `flex` bawaan → `justify-center`/`gap-2` sebelumnya tak berefek); baru `components/ui/ConfirmDialog.tsx` (modal glassmorphism, tombol Ya, Keluar merah / Batal) + `lib/useLogout.tsx` (wrap signOut+redirect → `askLogout`+`logoutDialog`; sempat `.ts` gagal build JSX → rename `.tsx`); pasang konfirmasi di semua tombol logout semua role — tentor (sidebar + profil), admin (sidebar + bottom-nav mobile), wali (profil, tombol disamakan compact); hapus `handleLogout`/`createClient`/`useRouter` duplikat di 4 file; next build 32 routes OK
- [x] 2026-08-05 TENTOR-11 Tombol WA halaman wali `/app/laporan` jadi ikon-only hijau WhatsApp `#25D366` (tanpa teks, logo SVG resmi): tombol per-kartu "Diskusi via WhatsApp" & "Konsultasi Perkembangan Anak" kini menuju nomor mentor (`daily-report.session.tentor.phone` untuk harian; progress-reports di-enrich `tentor {id,name,phone}` dari `Enrollment` muridId+programId prefer active untuk perkembangan), fallback `WHATSAPP_NUMBER`; empty-state "Hubungi Admin" (2×) juga ikon hijau tetap ke admin; hapus import `Button`/`MessageSquare` yang tak terpakai; tsc BE+FE 0, next build 32 routes OK
- [x] 2026-08-06 UIUX: Dashboard wali sesi terdekat ke atas + riwayat tagihan gabung prabayar: `(wali)/dashboard/page.tsx` tambah `isUrgentInvoice` (unpaid & dueAt ≤ now+24h) & `hasUrgentInvoice`, ekstrak `sessionCard`/`invoiceCard` jadi variabel, Top Block setelah header (sesi selalu + tagihan hanya jika H-1), tagihan ringkas tetap di bawah jika tidak ada H-1; `(wali)/tagihan/page.tsx` hapus blok "Riwayat Prabayar" dari kartu prabayar (sebelumnya selalu tampil), `getTxDate` + `historyItems` gabungan (invoice: paidAt??submittedAt??dueAt; prepayment: paidAt??submittedAt??createdAt), section Riwayat Pembayaran + kontrol sortir Terbaru/Terlama, baris prabayar badge indigo "Prabayar" (mobile card + desktop table); tsc FE 0, next build 33 routes OK
- [x] 2026-08-06 TENTOR-14 Dashboard admin real + prabayar + jadwal admin: (1) Dashboard: endpoint baru `GET /api/admin/dashboard` (admin guard) → `{data:{programsActive,muridsActive,tentorsActive,invoicesPending,sessionsToday}}` batas hari Asia/Jakarta; FE `/app/admin` hanya baca `.data` dari endpoint ini (perbaiki root cause — sebelumnya baca shape salah dari `/api/admin/murids` `.murids`, `/api/admin/tentors` `.tentors`, invoice dari `/api/me/invoices`, `todaySessions` string-compare → semua 0). (2) Prabayar wali: schema `Prepayment` Prisma (`muridId,amount,status(waiting|paid|cancelled),note,paymentProof,paymentProofName,submittedAt,paidAt`) + `Invoice.paymentNote String?` + `db push` + `generate`; shared `createPrepaymentSchema`; BE `GET/POST /api/me/prepayments` (wali, ownership guard), `GET /api/admin/prepayments`, `PATCH /api/admin/prepayments/:id/status`; `POST /api/me/invoices/:id/payment` persist `paymentNote`; `GET /api/admin/notifications` → `{waitingInvoices,waitingPrepayments}`; FE wali `/app/tagihan`: form prabayar (nominal + upload bukti + catatan) dengan tombol utama real "Kirim Data Pembayaran", WA jadi sekunder, riwayat prabayar chips status; FE admin tagihan: section "Pembayaran Prabayar" (list + bukti modal + Lunas/Batalkan), tampil `paymentNote` di kartu waiting; badge admin layout = waitingInvoices + waitingPrepayments. (3) Jadwal admin: BE `GET/POST /api/admin/sessions` (createTentorSessionSchema, enrollment harus active, overlap 409), `PATCH/DELETE /api/admin/sessions/:id` (mirror tentor) + `POST /api/me/sessions` tentor sama; FE `/app/admin/jadwal` (copy tentor/jadwal, endpoint admin, tanpa laporan) + nav Jadwal di layout admin. (4) Proof detail: route `/app/admin/tagihan/[invoiceId]` foto-fullscreen dark slate + PDF blob open; `ProofModal.tsx` generic (isPrepayment/note/murid/detailHref); tsc BE 0, next build 32 routes OK (termasuk `/app/admin/jadwal`); backend restart required. (5) 2026-08-06 Fix Program "-" di detail prepayment: `GET /api/admin/prepayments` include enrollment aktif murid (take 1 orderBy startedAt desc) + program; FE `openPrepaymentProof` isi `enrollment.program`; tsc BE 0, next build 33 routes OK.
- [x] 2026-08-06 UIUX: Riwayat admin gabung tagihan+prabayar satu list + detail semua status + modal konfirmasi terbitkan tagihan: `admin/tagihan/page.tsx` hapus section terpisah "Pembayaran Prabayar", daftar jadi `historyItems` gabungan (getTxDate invoice: paidAt??submittedAt??dueAt, prepayment: paidAt??submittedAt??createdAt; filter status client-side Semua/Verifikasi/Lunas/Dibatalkan + search nama murid; sortir 1 tombol toggle Terbaru/Terlama `ArrowDownWideNarrow`/`ArrowUpNarrowWide`); tombol "Detail" (Eye) kini semua status invoice & prepayment (bukan hanya waiting) → ProofModal (invoice tetap `detailHref` ke `/app/admin/tagihan/[id]`, prepayment modal-only); `ConfirmDialog` sebelum terbitkan tagihan (`confirmPublishOpen` + `publishInvoice`, handleSubmit hanya validasi + buka modal, terbitkan memakai form terakhir); wali `(wali)/tagihan/page.tsx` tambah tombol "Detail" di tiap baris riwayat (mobile card + desktop table, invoice & prepayment) → `proofWali` + `openWaliInvoiceDetail`/`openWaliPrepaymentDetail` + `<ProofModal hideLink>`; `ProofModal.tsx` tambah prop `hideLink` (sembunyikan navigasi foto/btn "Detail Invoice"/"Lihat Bukti", PDF tetap buka blob, tombol Tutup flex-1); tsc FE 0, next build 33 routes OK

### In Progress
- [x] 2026-08-21 DX-1 lanjutan: DebugBar bisa copy-paste (branch `dev`): root container `select-none` → `select-text`; tombol Copy Logs di header (ikon Copy/Check) → `navigator.clipboard.writeText` format `[timestamp] METHOD path - Status, Cache, Duration` + feedback "Copied!" 1.5s; revisi user: hapus badge umur "12 Th" di kolom Siswa tabel laporan (nama saja); tsc FE 0
- [x] 2026-08-21 TENTOR-24 Fix bug laporan harian menimpa laporan lama + tabel laporan & modal detail (branch `dev`): akar bug = tombol "Tulis Laporan" fallback `sessions[0]` saat semua sesi sudah berlaporkan → form kosong → POST upsert MENIMPA laporan lama; perbaikan: (1) `LaporanHarianClient.tsx` hapus fallback, kriteria pending = `status !== "cancelled" && !reports.some(...)` + toast "Semua sesi sudah dilaporkan..." bila habis; (2) auto-redirect `sessionId`→`editSessionId` bila sesi sudah berlaporkan (pengaman kedua); (3) daftar laporan card → tabel (No/Siswa/Tanggal/Jam/Program/Aksi) + tombol Detail (Eye) membuka modal detail glassmorphism dengan tombol Edit; (4) `dashboard/page.tsx`: simpan `rawEndsAt`, hitung ulang `pendingCount` = sesi lewat waktu && tidak dibatalkan && belum berlaporkan (sebelumnya selalu 0), `getSessionStatusInfo` tandai sesi lewat waktu sebagai Butuh/Selesai Laporan, render tombol aksi pakai `statusInfo.label !== "Terjadwal"`; tsc FE 0, next build 35 routes OK
- [x] 2026-08-20 DX-1 Dev Debugger Tool (branch `dev`): implementasi kustom DebugBar widget (`frontend/components/ui/DebugBar.tsx`) melayang di kanan bawah layar untuk pantau request log, status code, latency, dan cache hit/miss/invalidated secara real-time pada mode development; integrasikan Prisma SQL logging dengan timing duration di backend Express console; tsc FE+BE 0, build OK
- [x] 2026-08-20 WALI-24 Portal Client Cache (branch `dev`): implementasi in-memory cache (TTL 1 Jam) di `apiFetch` (`frontend/lib/api.ts`) untuk request `GET`, ditambah opsi `bypassCache`; implementasi **Smart Invalidation per Tipe Data** (menghapus cache kategori tertentu saja saat ada mutasi POST/PUT/DELETE); tsc FE 0, next build OK
- [x] 2026-08-20 WALI-23 Portal wali multi-anak + ubah sandi (branch `dev`): selector murid (tab pill, tampil jika >1 anak) di Dashboard/Jadwal/Laporan/Tagihan — data sudah difilter client-side per `selectedMuridId`; Profil Wali tambah fitur **Ubah Kata Sandi** (`supabase.auth.updateUser`, pola tentor/profil); multi-murid di profil tidak diubah (tetap murid pertama); tsc FE 0, next build OK
- [x] 2026-08-20 WALI-22 Katalog program jadi katalog bersih (branch `dev`): tab filter kategori (Semua/Materi/Jenjang/Calistung) + search + kartu informatif ringkas (ikon kategori, badge Terdaftar/Tersedia/Coming Soon, investasi/sesi) yang semuanya link ke `/app/program/[slug]`; detail program split status — belum terdaftar = info + outline silabus + CTA "Daftar Sekarang via WhatsApp" (disabled tanpa murid/program nonaktif), sudah terdaftar = peta jalan interaktif existing; selector murid jika >1 anak; tsc FE 0, next build OK; **tuning:** label "Investasi"→"Mulai dari", CTA daftar & bar riwayat sesi tidak lagi `fixed` (nempel di alur halaman), tombol daftar pakai logo WA hijau `#25D366`; **modal detail materi:** outline silabus bisa diklik → modal deskripsi lengkap (`MarkdownContent`) + tombol hijau WA "Tanya Materi Ini"; **revisi:** filter kategori → dropdown, header card tanpa ikon (kategori kiri + status kanan), modal materi bersih (tanpa badge langkah/tombol bawah, cuma close X), tombol CTA kecil sebaris "Daftar Sekarang" + logo WA
- [x] 2026-08-12 TENTOR-15 Portal tentor mobile: logo (diperbesar) jadi tombol pembuka **sidebar drawer** — top bar hapus teks "Nurman Course", logo ikut geser animasi pada open/close; drawer menu lebih lengkap (5 menu desktop + Keluar, pola `admin/layout.tsx`), tutup via link/backdrop/Escape/route change; bottom bar TIDAK disentuh; verifikasi tsc FE + next build (branch `main`)
- [x] 2026-08-12 TENTOR-16 Profil tentor: fitur **Update Password** — form Password Baru + konfirmasi di `tentor/profil`, `supabase.auth.updateUser({password})` (tanpa endpoint backend), validasi min 6, notice sukses/error; verifikasi tsc FE (branch `main`)
- [x] 2026-08-12 TENTOR-17 Dashboard tentor informatif ringkas: hapus tombol "Buat Jadwal" & "Lihat Semua" dari header Agenda, rapikan spacing/stat card mobile; verifikasi tsc FE (branch `main`)
- [x] 2026-08-12 TENTOR-18 Dashboard tentor — bagian "Evaluasi Perkembangan Belajar" live (hilangkan dummy Budi Santoso/murid-budi): deteksi dari `/api/me/sessions` + `/api/me/progress-reports` → murid dengan sesi `completed` ≥ `sessionsPerBlock` tapi belum ada rapor terbit; render CTA pakai ID asli; empty-state bila tak ada; verifikasi tsc FE + next build (branch `main`)
- [x] 2026-08-12 TENTOR-19 Auto-fill "Jam Selesai" = "Jam Mulai" + 1 jam (default, bisa diedit) di form jadwal tentor & admin: helper `addOneHour` di `utils/format.ts`; onChange Jam Mulai set endTime = addOneHour(v); sinkron default `emptyForm`/`openCreate` endTime 15:00→16:00; verifikasi tsc FE + next build (branch `main`)
- [x] 2026-08-12 TENTOR-20 Jadwal tentor & admin — (1) tombol aksi pakai modal `ConfirmDialog` (Batalkan amber + Hapus merah `danger`, ganti `native confirm()`, state `cancelTarget`/`deleteTarget`, busy state, Trash2/Ban ikon); (2) fix polarisasi sesi: `upcomingSessions` hanya scheduled yang belum lewat (`new Date(s.endsAt) <= now` dari `sessionsDataRaw` → `passedIds`), scheduled yang sudah lewat pindah ke `pastSessions` (Riwayat, badge "Butuh Laporan" otomatis); verifikasi tsc FE + next build (branch `main`)
- [x] 2026-08-12 TENTOR-21 Jadwal wali (dashboard + `/app/jadwal`): (1) `getUpcomingSessionWali` filter hanya scheduled belum lewat (`endsAt > now`) + ambil terdekat (sort asc), ganti dummy `tutorName:"Kak Kiki"` → `tentor?.name` real (fallback "Kak Tentor"), tambah `tentor` di `DbSession`; (2) `/app/jadwal` polarisasi sesi sama seperti tentor (`passedIds` dari `endsAt <= now` → scheduled lewat pindah ke Riwayat), render badge status-aware (Dibatalkan / Hadir-Selesai / Menunggu Laporan); verifikasi tsc FE + next build (branch `main`)

---

## NC — Restrukturisasi nCourse (Course/Section/Lesson + Entitlement)

> **Branch kerja:** `be-restruktur` (base dari `dev`). Hasil sesi grilling 2026-09-15.
> **Fokus:** backend dulu. Satu tahap = satu fokus; tahap boleh berhenti kapan saja tanpa meninggalkan barang setengah jadi.
> **Sumber:** 18 fitur usulan user (terinspirasi Udemy, konteks presentasi/blog tanpa video) → 6 dikerjakan, 12 ditunda dengan pemicu jelas (lihat bagian bawah).

### Keputusan terkunci (salin ke tabel Keputusan `docs/PROGRESS.md` saat sesi pertama)

| # | Keputusan | Alasan |
|---|---|---|
| D1 | **Opsi A (dual surface) resmi dipilih** | Materi publik di root `/materi/*` & `/kelas/*` mensyaratkan permukaan di luar `/app`. Mengakhiri status "belum diputuskan" di `ROADMAP-LMS.md`. |
| D2 | **Role ≠ akses konten** | Role menentukan portal; `Entitlement` menentukan konten. Wali bisa beli course tanpa ganti role. |
| D3 | **Akses konten menempel ke `User`, bukan `Murid`** | Membaca materi tak butuh konsep murid. `Murid` tetap murni untuk program bertentor. |
| D4 | **`Course` adalah unit yang dijual** | Lesson tetap punya slug global & bisa ditautkan lintas course. |
| D5 | **Role diambil dari DB, bukan JWT `user_metadata`** | Menghapus kelas bug "role basi" + fallback diam-diam `\|\| "wali"` di `requireAuth`. |
| D6 | **Backend penentu tunggal akses** | API tak pernah mengirim `bodyText` yang tak berhak. Pola lama (kirim semua, sembunyikan di UI) adalah asal kebocoran `/api/programs`. |
| D7 | **Pembayaran tetap manual** | **KEPUTUSAN TERBUKA** — payment gateway ditunda sampai volume transaksi diketahui. |
| D8 | **Rename domain email `@nurmancourse.local` ditunda** | Menyentuh login semua akun tanpa email asli (`resolve-phone` → `dbUser.email` → `signInWithPassword`). Butuh task + script migrasi sendiri. |
| D9 | **Penulis konten = admin + tentor terdaftar** | Bukan marketplace terbuka. Guard: admin semua course, tentor hanya course miliknya (`authorId`). |
| D10 | **Skala kecil: <10 course, <100 artikel, puluhan pembaca (12 bulan)** | Analytics & engagement insight ditunda — di skala ini satu query sudah cukup. |
| D11 | **Hierarki `Course → Section → Lesson`** | Evolusi/rename `Program → RoadmapStep → MaterialItem` yang **sudah ada**, bukan tabel paralel baru. |
| D12 | **Markdown (`react-markdown`), bukan block editor** | Konsekuensi sadar: highlight & note inline ikut tertunda (anchor teks rapuh di markdown yang di-render ulang). |
| D13 | **Tanpa Q&A / review teks** | Diskusi tetap lewat WhatsApp yang sudah hidup di seluruh portal. Nol beban moderasi. Selaras `ROADMAP-LMS.md` baris 70 (forum = out of scope). |
| D14 | **Harga one-time saja, tanpa subscription** | Langganan + bayar manual = verifikasi bukti transfer tiap bulan per pelanggan (beban tumbuh linear). |
| D15 | **Tanpa infra baru** (tanpa cron/mail server/storage/search engine) | Verifikasi email tetap bisa karena ditangani Supabase sendiri. |
| D16 | **`Program` dan `Course` dua entitas terpisah**, terhubung `Course.programId` nullable | Siklus hidup beda: program dijual per blok 12 pertemuan (tagihan+tentor), course dijual sekali & dibaca selamanya. Menyatukannya = kolom nullable menumpuk (penyakit `MaterialItem.sessionId` yang baru dibuang). |

### Aturan akses — satu pertanyaan tunggal

> `lesson.visibility === "public"` **ATAU** user punya `Entitlement` aktif (`revokedAt` null **dan** (`expiresAt` null **atau** masa depan)) atas course yang memuat lesson ini.

Empat tier user jatuh ke rumus yang sama, hanya beda `source`:

| Tier | Mekanisme |
|---|---|
| Publik (blog, tanpa login) | `visibility: public` — tanpa entitlement |
| Login + gratis | `accessTier: free` → entitlement `source: free` terbit otomatis |
| Bayar, akses selamanya | entitlement `source: purchase`, `expiresAt: null` |
| Bayar + dapat tentor | `Enrollment` aktif → entitlement `source: enrollment`, `expiresAt` = akhir blok |

---

### Tahap 1 — Fondasi (WAJIB, tidak boleh dilewati)

> Alasan tak boleh dilewati: schema akan berubah berkali-kali di Tahap 2–4. Melakukan itu tanpa migration history di staging = cara tercepat kehilangan data.

- [x] 2026-09-15 NC-1.1 Simpan pekerjaan wali dan rencana NC: commit `97ee4bb` + `9d3879c` sudah di-push ke `dev`; branch `be-restruktur` dibuat, di-push, dan tracking `origin/be-restruktur` terverifikasi.
- [x] 2026-09-15 NC-1.2 Baseline `migrations/0_init/migration.sql` diresmikan dan `migrate resolve --applied 0_init` berhasil di staging setelah backup public, restore, audit, dan replay terisolasi lolos. Hanya metadata migration bertambah satu record; struktur dan fingerprint 13 tabel aplikasi tidak berubah. Legacy `fix-null-email` tetap utuh/applied. `migrate dev` hanya pada DB development terpisah; staging/production memakai `migrate deploy`. Jangan jalankan `db push`/reset untuk mengatasi drift.
  - [x] 2026-09-15 NC-1.2a Periksa branch bersih, Prisma lokal 5.22.0, schema 13 model, script legacy `fix-null-email`, serta kecocokan project ref pada konfigurasi API/DB/MCP (tanpa mencetak credential).
  - [x] 2026-09-15 NC-1.2b Schema aktual tanpa drift; `fix-null-email` applied dan checksum LF cocok. Tidak ditemukan trigger/policy/view/function custom/check constraint/sequence public. RLS nonaktif, grant tabel dan default kosong, schema public owner-only; anon/authenticated efektif 0 akses tabel. Backup custom-format schema+data `public` berhasil direstore ke PostgreSQL lokal terpisah: count/fingerprint 14 tabel identik dengan staging. Backup bukan full Supabase (auth/storage tidak dicakup).
  - [x] 2026-09-15 NC-1.2c Kandidat dipindah tanpa perubahan SQL ke `backend/prisma/migrations/0_init/migration.sql`: 13 tabel, 4 unique index, 18 FK. Tambah lock PostgreSQL dan `.gitattributes` LF untuk kestabilan checksum migration.
  - [x] 2026-09-15 NC-1.2d `migrate deploy` pada DB kosong `nc_replay` lokal berhasil menjalankan `0_init` + legacy; schema diff kosong, deploy kedua no-op. Backup direstore terpisah ke `nc_restore`; cluster PostgreSQL 18.6 di loopback, staging 17.6. UPDATE legacy hanya dijalankan pada DB replay kosong, tidak diulang pada staging.
  - [x] 2026-09-15 NC-1.2e `resolve --applied 0_init` sekali di staging: tepat dua migration applied, checksum baseline cocok, record/checksum legacy tetap. `migrate status` up-to-date, schema diff kosong, fingerprint/count 13 tabel aplikasi tetap.
  - [x] 2026-09-15 NC-1.2f Verifikasi schema, typecheck BE/FE, backup/restore/replay dan review independen lolos; dokumentasi disinkronkan. Lint existing masih gagal (NC-1.2g), tidak ada perubahan runtime aplikasi.
  - [ ] NC-1.2g Follow-up verifikasi: `npm run lint` gagal pada kode frontend existing (75 error, 28 warning); tangani pada task terpisah, bukan bagian baseline. Typecheck backend/frontend dan `prisma validate` lolos.
  - [ ] NC-1.2h Sebelum migration lanjutan yang mengubah `users.email/phone/role`, rekonsiliasi ordering legacy `fix-null-email` (nama alfabetis akan berada setelah migration timestamp pada fresh replay). Jangan rename/edit migration applied tanpa strategi history; selalu replay seluruh history.
  - [ ] NC-1.2i Backup jangka panjang dan restore pada versi PostgreSQL yang sama: bukti saat ini public-only di folder temp lokal ber-ACL user-only, direstore ke 18.6 dari staging 17.6, bukan backup penuh Auth/Storage/roles Supabase. Tidak cukup sebagai strategi disaster recovery.
  - [ ] NC-1.2j Follow-up hardening/performance terpisah: evaluasi RLS defense-in-depth (saat ini anon/authenticated tidak punya akses), leaked-password protection nonaktif, 17 FK tanpa covering index. Jangan ubah security/grant global lewat baseline.
- [x] 2026-09-15 NC-1.3 Ekstrak `prisma` dan `supabaseAdmin` ke `backend/src/lib/prisma.ts` dan `supabase-admin.ts`; `index.ts` import dan tetap export Prisma lama. Env dimuat sebelum konstruksi, singleton/logging development/nullable client dipertahankan. `node --test backend/tests/clients.test.cjs`: 4/4 lolos (RED → GREEN), typecheck BE/FE + compile BE lolos, smoke fresh API health200/token-absen401/programs200. Review approve; tidak mengubah endpoint/auth/schema/data/dependency. Lint existing 75 error/28 warning tetap (NC-1.2g); smoke autentikasi positif belum dijalankan karena tidak ada sesi test tersedia. NC-1.4/NC-1.6 belum dimulai.
- [ ] NC-1.4 `requireAuth` baca role dari DB (`prisma.user`), JWT hanya untuk identitas; hapus fallback `|| "wali"`; tambah helper `requireRole()` (D5) — **RISIKO: user Supabase tanpa baris Prisma sekarang diam-diam jadi `wali`, setelah ini ditolak → wajib cek staging dulu**
- [ ] NC-1.5 Hardening: `helmet`, `express-rate-limit`, `express.json({ limit: '5mb' })` (bukti bayar & foto base64 masuk lewat body), CORS allowlist (sekarang `cors()` terbuka penuh)
- [ ] NC-1.6 Test harness: Vitest + supertest, Prisma di-mock (fokus guard & validasi, bukan query)
- [ ] NC-1.7 `.gitignore` untuk `backend/src/generated/` — saat ini 5 file `query_engine-windows.dll.node` @~18MB ikut ter-commit, 4 di antaranya file sampah `.tmp*`
- [ ] NC-1.8 Buang `MaterialItem.sessionId` (FK nullable yang tak pernah diisi endpoint mana pun — fitur mati)
- [ ] NC-1.C1 Checkpoint: `tsc --noEmit` BE+FE, `vitest run`, `next build`, smoke Playwright login 3 role (pastikan NC-1.4 tidak memutus akses siapa pun)

### Tahap 2 — Course / Section / Lesson → fitur #16, #14

- [ ] NC-2.1 Schema: `Course` (slug unik, title, description, level?, category?, accessTier `free|paid`, price?, status `draft|published`, publishedAt?, authorId, programId? nullable, active), `Section` (courseId, order, title, summary?), `Lesson` (sectionId, slug unik **global**, title, summary?, bodyText, visibility `public|entitled`, status, publishedAt?, order, estimatedMinutes?)
- [ ] NC-2.2 Migrasi data: tiap `Program.hasRoadmap` → 1 `Course`; `RoadmapStep` → `Section`; **`RoadmapStep.bodyText` → `Lesson` urutan 0** (konten yang dibaca wali sekarang tidak boleh hilang); `MaterialItem` → `Lesson`; slug digenerate dari judul + jaga keunikan
- [ ] NC-2.3 Pecah route (pola strangler — file lama dibiarkan utuh): `backend/src/routes/courses.ts`, `lessons.ts`, `admin/authoring.ts` + `routes/index.ts`
- [ ] NC-2.4 Ganti renderer: `react-markdown` + `remark-gfm` + `rehype-sanitize` menggantikan `MarkdownContent.tsx` buatan sendiri (53 baris, cuma paham `##`, `-`, `**bold**`, **tidak bisa link sama sekali**)
- [ ] NC-2.5 Validasi link internal saat simpan: `[teks](/materi/slug)` dicek slug-nya ada → tidak ada tautan mati
- [ ] NC-2.6 Draft & publish workflow (#14) + ownership guard D9 (admin semua, tentor hanya `authorId` miliknya)
- [ ] NC-2.7 UI authoring admin + tentor; `frontend/app/app/admin/roadmap/RoadmapClient.tsx` ikut bermigrasi ke model Lesson (jangan biarkan dua model materi hidup berdampingan)
- [ ] NC-2.C2 Checkpoint: verifikasi manual `/app/program/[slug]` — konten roadmap yang dibaca wali harus tetap utuh pasca-migrasi; `tsc`, `vitest`, `next build`

### Tahap 3 — Permukaan publik → fitur #5, #18

- [ ] NC-3.1 Helper `apiFetchServer` (pakai `@supabase/ssr` yang sudah terpasang — baca sesi dari cookie, teruskan token ke Express)
- [ ] NC-3.2 `/kelas` (katalog) + `/kelas/[slug]` (silabus, rating, jumlah peserta, CTA) — **Server Component** + `generateMetadata`
- [ ] NC-3.3 `/materi/[slug]` Server Component + ISR + `generateMetadata` (satu URL kanonik, publik & ter-entitlement di route yang sama; backend yang menentukan isi terkirim atau paywall — D6)
- [ ] NC-3.4 **Tutup kebocoran `/api/programs`** — endpoint ini publik tanpa `requireAuth` dan sekarang membocorkan seluruh `bodyText` roadmap ke siapa pun
- [ ] NC-3.5 Search & filter (#18) via Postgres `tsvector` — kategori, level, penulis. Cukup sampai ribuan materi, tanpa search engine (D15)
- [ ] NC-3.6 Related content (#5): link internal + prev/next dalam section + lesson sekelas
- [ ] NC-3.7 Tautan dari `/landing` ke `/kelas`. **`/course/*` (funnel WA) TIDAK disentuh** — jalur lead hidup, dilarang AGENTS.md tanpa task khusus
- [ ] NC-3.C3 Checkpoint: cek HTML ter-render berisi konten (view-source, bukan cuma browser), `tsc`, `vitest`, `next build`

### Tahap 4 — Member & Entitlement → fitur #1

- [ ] NC-4.1 Signup mandiri: email + password + verifikasi email (ditangani Supabase, tanpa mail server sendiri). **Halaman `/login` saat ini login-only** — mode Daftar pernah dihapus, perlu dibangun ulang terpisah
- [ ] NC-4.2 Role `member`: tambah di `userRoleSchema` (shared), `middleware.ts`, `seed.ts`, `user_metadata` Supabase (4 tempat hardcode)
- [ ] NC-4.3 `User.phone` jadi nullable (sekarang `@unique` + wajib — mustahil untuk signup email-only); sesuaikan `createUserSchema` & alur `resolve-phone`
- [ ] NC-4.4 Halaman tujuan member sesudah login — **jangan** `/app/dashboard` (mengasumsikan punya murid)
- [ ] NC-4.5 Tabel `Entitlement` + auto-grant untuk course `accessTier: free`
- [ ] NC-4.6 Jembatan: `Enrollment` aktif → terbitkan entitlement `source: enrollment` (satu jalur akses, bukan dua)
- [ ] NC-4.7 Reading progress (#1): tabel `LessonProgress` (userId × lessonId) — **sengaja terpisah** dari `Progress` (muridId × roadmapStepId) yang sudah ada, karena beda subjek (D3)
- [ ] NC-4.C4 Checkpoint: test guard entitlement (4 tier), regression 3 role lama, `tsc`, `vitest`, `next build`

### Tahap 4.5 — Rating → fitur #9 (bintang saja)

- [ ] NC-4.5.1 Tabel `Rating` (userId × courseId, score 1–5, unique) — **hanya pemilik entitlement aktif** yang boleh menilai (anti-spam tanpa captcha/moderasi)
- [ ] NC-4.5.2 Jumlah peserta dihitung **live** dari entitlement aktif (bukan kolom counter), **disembunyikan bila < 5** agar bukti sosial tidak jadi bumerang
- [ ] NC-4.5.3 Tampilkan rating + jumlah peserta di `/kelas` & `/kelas/[slug]`

### Tahap 5 — Monetisasi (D7 masih terbuka)

- [ ] NC-5.1 Checkout one-time manual mengikuti pola invoice yang sudah ada (terbitkan → upload bukti → verifikasi admin) → entitlement `source: purchase`
- [ ] NC-5.2 **Keputusan terbuka:** payment gateway (Midtrans/Xendit) — jangan dikunci sebelum volume transaksi diketahui

### Tahap 6 — Rename brand nCourse

- [ ] NC-6.1 Rename **display/brand saja**: ~150 kemunculan di 52 file (teks UI, `<title>`, metadata, logo, copy landing)
- [ ] NC-6.2 **JANGAN** sentuh `@nurmancourse.local` (D8), `@nurman-course/shared`, nama package.json, nama folder repo
- [ ] NC-6.3 (Terpisah, belum dijadwalkan) Migrasi domain email placeholder + update baris `users.email` Prisma **dan** `auth.users` Supabase — berisiko memutus login semua akun tanpa email asli

### Fitur ditunda — beserta pemicunya

> Semua bisa menyusul **tanpa membongkar** apa pun, karena hierarki 3 level + entitlement sudah dipasang sejak awal.

| Fitur usulan | Baru dikerjakan saat |
|---|---|
| #2 Bookmark & highlight, #3 Note inline | Pindah ke block editor (membatalkan D12) — anchor teks stabil |
| #4 Q&A/diskusi, #15 Engagement insight | WhatsApp sudah kewalahan menampung pertanyaan |
| #6 Downloadable resources, #8 Sertifikat | Storage disetujui — bucket **privat + signed URL** (menjawab keberatan M4) |
| #7 Reminder & deadline | Cron + kanal notifikasi disetujui (membatalkan D15) |
| #10 Gift / share course | Checkout Tahap 5 sudah jadi |
| #11 Block editor | Menulis dengan markdown terasa menyiksa |
| #12 Quiz & assessment | Ada kebutuhan penilaian nyata (prasyarat #8) |
| #13 Course analytics | Skala melewati D10 (<10 course / <100 artikel) |
| #17 Subscription | Payment gateway ada (membatalkan D14) |

### Risiko yang perlu diawasi

1. **NC-1.4 (D5)** — user Supabase tanpa baris Prisma sekarang diam-diam dapat role `wali`; setelah perubahan akan ditolak. **Wajib cek staging sebelum merge.**
2. **NC-2.2** — `RoadmapStep.bodyText` yang dibaca wali hari ini harus terbawa utuh ke `Lesson`. Verifikasi manual di `/app/program/[slug]`.
3. **Tahap 2** menyentuh UI wali & admin yang baru saja dirapikan (WALI-MOB) — jadwalkan setelah WALI-MOB stabil.

---

## Backlog ide (belum dijadwalkan)

- Payment gateway (Midtrans/Xendit)
- Multi-tutor
- Absensi & nilai
- Video / live
- Docker production
- App terpisah vs monorepo

---

## In progress (maks 1 fokus utama)

- (none) — NC-1.3 selesai. Task berikutnya belum dimulai. **WALI-MOB di-pause** (per keputusan user 2026-09-15: fokus pindah ke backend).
