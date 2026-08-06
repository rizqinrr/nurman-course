# Rencana Implementasi: Portal Admin Lengkap

## Status Dokumen
- Status: **draft siap implementasi**
- Scope: melengkapi portal admin `/app/admin` dengan data live, CRUD, validasi, proteksi role, dan verifikasi end-to-end.
- Urutan implementasi wajib mengikuti dependensi data: fondasi API → Program → User/Murid → Enrollment → Roadmap/Materi → Session → Invoice → polish.
- Tidak mengubah funnel `/course/*` dan tidak membangun fitur di luar MVP LMS.

## Tujuan
Admin dapat mengelola seluruh data operasional Nurman Course dari satu portal: program, akun tentor/wali, murid, enrollment, roadmap, materi teks, jadwal sesi, dan invoice.

## Kondisi Awal
- Portal admin saat ini hanya memiliki Dashboard.
- Endpoint admin yang sudah ada: `GET /api/admin/murids` dan `GET /api/admin/tentors`.
- Auth memakai Supabase; backend Express memverifikasi Bearer JWT.
- Prisma schema sudah memiliki model `User`, `Murid`, `Program`, `RoadmapStep`, `MaterialItem`, `Enrollment`, `Session`, dan `Invoice`.
- Mode live memakai `NEXT_PUBLIC_DEMO_MODE="false"`; fallback dummy tetap dipertahankan hanya selama transisi tiap slice.

## Keputusan Arsitektur
1. **API-first dan role guard di backend.** Semua operasi mutasi admin wajib melalui endpoint Express dengan `requireAuth` dan pemeriksaan role `admin`; UI bukan boundary keamanan.
2. **Vertical slice per domain.** Setiap domain diselesaikan dari schema/validasi, endpoint, API client usage, UI, sampai verifikasi sebelum pindah ke domain berikutnya.
3. **Soft operational status, hard delete terbatas.** Program, user, enrollment, session, dan invoice menggunakan status/nonaktif bila relasi historis membuat delete berisiko. Delete keras hanya untuk data yang aman dan akan ditentukan per endpoint.
4. **Supabase Auth tetap sumber identitas.** Pembuatan akun tentor/wali menggunakan Supabase Admin API di backend; password tidak pernah dikirim atau disimpan oleh frontend admin.
5. **Pagination dan filter sejak list pertama.** Semua list admin harus memiliki loading, error, empty state, search/filter yang relevan, dan batas jumlah data agar tidak mengambil seluruh tabel tanpa kontrol.
6. **Transaksi untuk operasi relasional.** Pembuatan enrollment + invoice awal, assignment session, dan perubahan status yang memengaruhi relasi dilakukan atomik menggunakan Prisma transaction.
7. **Audit minimum melalui metadata respons/log.** Setiap mutasi mengembalikan record terbaru; logging server tidak boleh mencatat password, token, atau secret.

## Kontrak Umum Endpoint Admin
- Prefix: `/api/admin`.
- Auth: `Authorization: Bearer <supabase_access_token>`.
- Unauthorized: `401`; bukan admin: `403`; input invalid: `400`; resource tidak ditemukan: `404`; konflik unik/relasi: `409`; error tak terduga: `500`.
- Semua request body divalidasi memakai Zod dari `packages/shared` atau schema backend yang konsisten.
- Response sukses berbentuk `{ data: ... }`; list memakai `{ data: [...], meta?: { total, page, limit } }`.
- Mutasi tidak menerima `id`, `createdAt`, atau field relasi yang seharusnya ditentukan server.

## Daftar Task dan Subtask

### Phase 0 — Persiapan dan Kontrak

#### ADM-0.1: Audit dan baseline portal admin
- [x] Petakan route, layout, komponen UI, helper API, tipe frontend, dan endpoint yang sudah ada.
- [x] Catat field Prisma yang benar-benar dipakai tiap domain.
- [x] Definisikan status loading/error/empty dan pola form untuk semua halaman admin.
- [x] Pastikan tidak ada task aktif lain yang konflik dengan portal admin.

**Acceptance criteria:** baseline file map dan dependency graph tercatat; tidak ada asumsi field yang bertentangan dengan Prisma.

#### ADM-0.2: Definisikan kontrak API dan schema validasi bersama
- [x] Tambahkan enum/status type untuk role, program, enrollment, session, invoice.
- [x] Tambahkan Zod schema create/update/list filter untuk domain yang akan dikerjakan.
- [x] Tetapkan format error dan response list/mutation.
- [x] Tambahkan tipe response frontend tanpa `any`.

**Acceptance criteria:** kontrak dapat dipakai backend dan frontend; input invalid menghasilkan error terstruktur.

#### ADM-0.3: Siapkan helper admin API dan query state
- [x] Buat helper request admin atau perluas `apiFetch` dengan method/body/query params.
- [x] Standarkan handling `401`, `403`, `404`, `409`, dan `422/400` di UI.
- [x] Siapkan komponen/pola reusable untuk table, filter, form, confirm dialog, toast, dan pagination bila memang belum ada.

**Acceptance criteria:** domain berikutnya tidak mengulang helper fetch dan pola error secara manual.

### Checkpoint 0 — Kontrak
- [x] Backend tsc sukses.
- [x] Frontend lint dan typecheck sukses.
- [x] Endpoint contract dan status code terdokumentasi di source/type.

### Phase 1 — Program Catalog

#### ADM-1.1: API CRUD Program
- [x] `GET /api/admin/programs` dengan search, category, active, page, limit.
- [x] `POST /api/admin/programs` dengan validasi slug unik, name, description, category, basePrice, sessionsPerBlock, active.
- [x] `GET /api/admin/programs/:id` dengan ringkasan roadmap/enrollment/session.
- [x] `PATCH /api/admin/programs/:id` dengan validasi partial update.
- [x] `DELETE` atau deactivate program sesuai relasi; cegah penghapusan yang merusak histori.
- [x] Tambahkan admin role guard dan error conflict slug.

#### ADM-1.2: UI Program
- [x] Tambahkan menu **Program** di desktop sidebar dan mobile nav.
- [x] Buat list program live dengan search/filter status/kategori.
- [x] Buat form create/edit dengan validasi field dan format harga.
- [x] Tambahkan detail program dan ringkasan relasi.
- [x] Tambahkan konfirmasi deactivate/delete dan feedback sukses/gagal.

#### ADM-1.3: Seed dan verifikasi Program
- [ ] Pastikan seed memiliki minimal dua program dengan kategori berbeda.
- [ ] Uji slug duplicate, angka negatif, sessionsPerBlock invalid, dan program nonaktif.
- [ ] Uji create → list → edit → deactivate melalui API dan UI.

**Acceptance criteria:** admin dapat membuat, melihat, mengubah, dan menonaktifkan program live tanpa merusak enrollment historis.

### Checkpoint 1 — Program
- [ ] API integration test/manual curl untuk seluruh endpoint program.
- [ ] UI desktop dan mobile dapat dipakai.
- [ ] `npm run lint`, backend `tsc`, dan frontend `npm run build` sukses.

### Phase 2 — User, Wali, Tentor, dan Murid

#### ADM-2.1: API User Tentor dan Wali
- [x] `GET /api/admin/users` dengan filter role/search/status bila status tersedia.
- [x] `POST /api/admin/users` membuat user Supabase Auth terkonfirmasi dan row Prisma dalam transaction-safe flow.
- [x] `PATCH /api/admin/users/:id` mengubah profil dan role hanya melalui aturan yang aman.
- [x] Deactivate user tanpa menghapus histori session/enrollment.
- [x] Jangan expose password; gunakan temporary password flow atau instruksi reset yang aman.
- [x] Cegah admin menghapus/deactivate dirinya sendiri tanpa recovery flow.

#### ADM-2.2: UI User
- [x] Tambahkan menu **Pengguna** atau submenu Tentor/Wali.
- [x] Buat table dengan role badge, nama, email, phone, status, dan relasi ringkas.
- [x] Buat form tambah/edit tentor dan wali.
- [x] Tampilkan hasil pembuatan akun tanpa menampilkan secret.
- [x] Tambahkan deactivate dan confirm dialog.

#### ADM-2.3: API Murid
- [x] `GET /api/admin/murids` perluas dengan search, wali filter, pagination, dan relasi ringkas.
- [x] `POST /api/admin/murids` dengan waliId valid dan field murid tervalidasi.
- [x] `GET /api/admin/murids/:id` dengan enrollment, session, dan laporan ringkas.
- [x] `PATCH /api/admin/murids/:id` untuk profil dan wali.
- [x] Deactivate/delete mengikuti relasi historis dan cascade policy yang eksplisit.

#### ADM-2.4: UI Murid
- [x] Tambahkan menu **Murid**.
- [x] Buat list/search/filter wali.
- [x] Buat form create/edit dan pemilihan wali dari data live.
- [x] Buat detail murid dengan tab/ringkasan enrollment, sesi, dan laporan.

**Acceptance criteria:** admin dapat mengelola tentor, wali, dan murid; relasi wali-murid valid; secret auth tidak bocor; user non-admin tetap mendapat `403`.

### Checkpoint 2 — User dan Murid
- [x] Uji role guard admin/non-admin.
- [x] Uji duplicate email dan waliId invalid.
- [x] Uji deactivate user dengan histori.
- [x] Build/lint backend dan frontend sukses.

### Phase 3 — Enrollment

#### ADM-3.1: API Enrollment
- [x] `GET /api/admin/enrollments` dengan filter status, murid, program, pagination.
- [x] `POST /api/admin/enrollments` memvalidasi murid dan program aktif.
- [x] `PATCH /api/admin/enrollments/:id` untuk status dan tanggal mulai.
- [x] Cegah enrollment duplicate aktif untuk pasangan murid-program bila aturan bisnis mengharuskan unik.
- [x] Sediakan endpoint detail dengan invoice dan progress ringkas.

#### ADM-3.2: UI Enrollment
- [x] Tambahkan menu **Enrollment**.
- [x] Buat form pilih murid, program, status, dan startedAt.
- [x] Buat list/filter status dan link ke detail murid/program.
- [x] Tambahkan aksi cancel/complete dengan konfirmasi.

**Acceptance criteria:** admin dapat menghubungkan murid ke program secara live dan status enrollment konsisten dengan relasi database.

### Checkpoint 3 — Enrollment
- [x] Uji transaction dan duplicate active enrollment.
- [x] Uji program nonaktif tidak dapat dipilih untuk enrollment baru.
- [x] UI menampilkan state kosong/error/loading.

### Phase 4 — Roadmap dan Materi Teks

#### ADM-4.1: API RoadmapStep
- [x] `GET /api/admin/programs/:programId/roadmap` terurut berdasarkan `order`.
- [x] `POST /api/admin/programs/:programId/roadmap` dengan order/title/bodyText/level.
- [x] `PATCH /api/admin/roadmap-steps/:id`.
- [x] `DELETE /api/admin/roadmap-steps/:id` dengan aturan cascade material yang jelas.
- [x] Tambahkan reorder endpoint atau strategi normalisasi order.

#### ADM-4.2: API MaterialItem
- [ ] `GET /api/admin/roadmap-steps/:stepId/materials`.
- [ ] `POST /api/admin/roadmap-steps/:stepId/materials`.
- [ ] `PATCH /api/admin/material-items/:id`.
- [ ] `DELETE /api/admin/material-items/:id`.
- [ ] Validasi bodyText, title, order, dan kepemilikan relasi.

#### ADM-4.3: UI Roadmap dan Materi
- [ ] Tambahkan menu **Roadmap & Materi**.
- [ ] Pilih program lalu tampilkan timeline langkah belajar.
- [ ] Form edit body teks/markdown sederhana.
- [ ] Kelola material per langkah dengan reorder.
- [ ] Preview konten sebagai teks/markdown aman; sanitasi bila renderer HTML dipakai.

**Acceptance criteria:** admin dapat membuat roadmap berurutan dan materi teks; wali dapat membaca hasilnya melalui endpoint existing tanpa data corrupt.

### Checkpoint 4 — Roadmap
- [ ] Uji order/reorder dan delete cascade.
- [ ] Uji konten kosong/terlalu panjang dan input tidak valid.
- [ ] Verifikasi halaman wali tetap dapat membaca roadmap/materi.

### Phase 5 — Session dan Jadwal

#### ADM-5.1: API Session
- [ ] `GET /api/admin/sessions` dengan filter tanggal, status, tentor, murid, program.
- [ ] `POST /api/admin/sessions` validasi startsAt < endsAt dan relasi aktif.
- [ ] `GET /api/admin/sessions/:id`.
- [ ] `PATCH /api/admin/sessions/:id` untuk jadwal, assignment, lokasi, status.
- [ ] Cancel session tanpa menghapus laporan historis.
- [ ] Cegah konflik jadwal tentor/murid sesuai aturan bisnis yang disepakati.

#### ADM-5.2: UI Session
- [ ] Tambahkan menu **Jadwal Sesi**.
- [ ] Buat list hari/minggu dengan filter.
- [ ] Form assign program, tentor, murid, start/end, lokasi, status.
- [ ] Tambahkan detail sesi dan link laporan terkait.
- [ ] Tambahkan confirm cancel dan feedback konflik jadwal.

**Acceptance criteria:** admin dapat membuat dan mengubah sesi; tentor dan wali melihat perubahan live; sesi completed/cancelled menjaga histori laporan.

### Checkpoint 5 — Session
- [ ] Uji waktu invalid, relasi invalid, dan overlap.
- [ ] Verifikasi endpoint tentor/wali setelah sesi dibuat/diubah.
- [ ] Build/lint sukses.

### Phase 6 — Invoice dan Status Pembayaran

#### ADM-6.1: API Invoice
- [x] `GET /api/admin/invoices` dengan filter status, murid, program, dueAt, pagination.
- [x] `POST /api/admin/invoices` terkait enrollment aktif.
- [x] `GET /api/admin/invoices/:id`.
- [x] `PATCH /api/admin/invoices/:id/status` dengan transition `unpaid → waiting → paid` dan aturan koreksi.
- [x] Set/clear `paidAt` secara konsisten saat status berubah.
- [x] Catat note admin tanpa menyimpan data pembayaran sensitif.

#### ADM-6.2: UI Invoice
- [x] Tambahkan menu **Tagihan**.
- [x] Buat table status, nominal, jatuh tempo, murid, program.
- [x] Buat form terbitkan invoice dari enrollment.
- [x] Tambahkan aksi ubah status dan detail invoice.
- [x] Tampilkan konfirmasi status dan link instruksi WhatsApp wali bila sudah ada.

**Acceptance criteria:** admin dapat menerbitkan invoice dan mengelola status; wali membaca status yang sama; nilai dan tanggal tervalidasi.

### Checkpoint 6 — Invoice
- [x] Uji status transition dan paidAt.
- [x] Uji nominal negatif/zero, enrollment invalid, dan duplicate request.
- [x] Verifikasi halaman wali tagihan.

#### ADM-6.5: Data Master Rekening Bank (PaymentAccount)
- [x] Model `PaymentAccount` + `prisma db push`/`generate`.
- [x] CRUD admin `GET/POST/PATCH/DELETE /api/admin/payment-accounts` (auto-clear `isDefault`, tolak hapus rekening default).
- [x] `GET /api/payment-accounts` (auth wali, filter `isActive`).
- [x] UI admin `/app/admin/rekening`: list, form, set default, hapus.
- [x] Halaman wali `/app/(wali)/tagihan` membaca rekening dari API (fallback bila kosong); hapus hardcode Mandiri.
- [x] Seed PaymentAccount default Mandiri + BSI.

### Phase 7 — Integrasi Portal dan Polish

#### ADM-7.1: Sinkronisasi navigasi dan dashboard
- [ ] Tambahkan semua menu final ke desktop sidebar/mobile nav.
- [ ] Dashboard memakai endpoint list/stat yang stabil tanpa fetch duplikat berlebihan.
- [ ] Link antar detail domain konsisten.
- [ ] Banner demo hanya tampil saat demo mode aktif.

#### ADM-7.2: UX, aksesibilitas, dan security hardening
- [ ] Semua form punya label, keyboard navigation, focus state, dan error message.
- [ ] Semua mutasi punya disabled/loading state dan confirm untuk aksi destruktif.
- [ ] Tidak ada secret/token/password pada client response atau log.
- [ ] Rate/size limit dan validasi server untuk input teks panjang.
- [ ] Audit role guard seluruh endpoint admin.

#### ADM-7.3: Test dan dokumentasi
- [ ] Tambahkan test endpoint untuk auth, validation, relation, status transition, dan conflict.
- [ ] Tambahkan smoke test UI untuk navigasi dan happy path tiap domain.
- [ ] Jalankan backend tsc, frontend lint/build, dan test monorepo.
- [ ] Update `docs/PROGRESS.md`, `tasks/todo.md`, `SYSTEM_MAP.md`, dan API documentation jika endpoint bertambah.

**Acceptance criteria:** portal admin lengkap dan usable di desktop/mobile; seluruh domain live; regression tenant/wali tidak ditemukan; docs sinkron.

### Checkpoint 7 — Definition of Done
- [ ] Semua task ADM-0 sampai ADM-7 selesai atau explicitly deferred.
- [ ] Tidak ada endpoint admin tanpa role guard.
- [ ] Tidak ada form admin tanpa loading/error/empty/validation state.
- [ ] Database migration, seed, API, UI, dan docs konsisten.
- [ ] Lint, typecheck, build, dan test sukses.
- [ ] Review security dan code quality selesai sebelum merge.

## Dependency Graph
```text
ADM-0 contract/helper
  -> ADM-1 Program
  -> ADM-2 User + Murid
  -> ADM-3 Enrollment
  -> ADM-4 Roadmap + Materi
  -> ADM-5 Session
  -> ADM-6 Invoice
  -> ADM-7 Integration + Polish
```

## Risiko dan Mitigasi
| Risiko | Dampak | Mitigasi |
|---|---|---|
| Endpoint admin hanya dilindungi UI | Tinggi | Wajib `requireAuth` + role check di setiap endpoint; test non-admin `403`. |
| Pembuatan Auth user dan Prisma row tidak sinkron | Tinggi | Gunakan flow kompensasi/transaction boundary; jika row gagal, hapus Auth user yang baru dibuat atau tandai recovery. |
| Delete merusak histori laporan/tagihan | Tinggi | Prefer deactivate/cancel; cascade hanya untuk child yang memang aman. |
| Fetch list besar memperlambat admin | Sedang | Pagination, filter, select field minimal, dan index sesuai query. |
| UI admin live memecahkan portal wali/tentor | Tinggi | Verifikasi endpoint consumer existing setiap checkpoint; jangan ubah kontrak existing tanpa migration plan. |
| Konten materi mengandung HTML berbahaya | Sedang | Simpan plain/markdown; sanitasi sebelum render HTML. |
| Status invoice tidak konsisten dengan `paidAt` | Sedang | Satu endpoint status transition dengan aturan atomik dan test. |

## Open Questions Sebelum Implementasi Domain Terkait
- ~~Apakah satu murid boleh memiliki lebih dari satu enrollment aktif untuk program yang sama?~~ → **Ditolak 409** (ADM-3, keputusan 2026-08-01)
- Apakah konflik jadwal tentor/murid harus ditolak keras atau hanya diberi warning?
- Untuk pembuatan akun wali/tentor, apakah admin memasukkan password sementara atau sistem mengirim reset/invite email?
- Apakah admin boleh mengubah role akun existing, atau role dikunci setelah akun dibuat?

---

# Arsip: Rencana Restrukturisasi Monorepo


## Overview
Melakukan restrukturisasi arsitektur proyek dari satu repository monolithic Next.js menjadi arsitektur monorepo terpisah menggunakan **npm workspaces** dan **Turborepo**. Frontend Next.js akan dipindahkan ke folder `frontend/`, sedangkan backend API server Express akan tetap berada di folder `backend/` yang akan di-upgrade untuk mendukung model data 3-role (Admin, Tentor, Wali Murid) menggunakan Prisma & Supabase Auth. Paket bersama untuk validasi data & tipe data akan dibuat di `packages/shared`.

## Keputusan Arsitektur
1. **Tooling Monorepo:** npm workspaces di root + Turborepo untuk manajemen pipeline task (`build`, `dev`, `lint`).
2. **Lokasi Frontend:** Seluruh kode Next.js (app funnel + app LMS) dipindahkan dari root ke folder `frontend/`.
3. **Lokasi Backend:** Server Express & Prisma tetap di folder `backend/` (tanpa membuat folder `apps/api` baru).
4. **Shared Package:** Membuat folder `packages/shared/` berisi konstanta, tipe TypeScript, dan Zod schemas untuk validasi yang dipakai bersama oleh frontend & backend.
5. **Autentikasi:** Tetap menggunakan Supabase Auth. Login diakses via frontend client, token JWT dikirim ke backend API, dan Express backend memverifikasi token tersebut menggunakan middleware Supabase client / `@supabase/supabase-js`.
6. **Data Model:** Skema database Prisma di-upgrade ke model 3-role sesuai dokumen perencanaan `docs/erd-lms.md`.

---

## Daftar Tugas (Task List)

### Phase 1: Persiapan & Arsip (Setup Root Workspace)
- [ ] **Task 1.1: Arsipkan backend existing & hapus duplikat desain**
  - Membuat branch baru `restructure/monorepo` (opsional) atau memastikan perubahan di-commit di `dev`.
  - Mengarsipkan `backend/` lama (salin isi schema & seed ke folder backup temporer `archive/backend-v1` jika perlu, atau mengandalkan git history).
  - Menghapus folder duplikat `prompt-google-stitch/` (mempertahankan `desain-ui-frontend/`).
- [ ] **Task 1.2: Inisialisasi npm workspaces di root**
  - Mengubah `package.json` di root menjadi minimalis, bertindak sebagai workspace root.
  - Menambahkan workspaces: `["frontend", "backend", "packages/*"]`.
- [ ] **Task 1.3: Konfigurasi Turborepo**
  - Membuat file `turbo.json` di root untuk konfigurasi task pipeline (`build`, `dev`, `lint`).
  - Mengatur target dependencies (mis. `build` di frontend butuh shared package dibuild lebih dulu).
- [ ] **Task 1.4: Update `.gitignore`**
  - Memastikan ignore rules mencakup file-file temporer monorepo, build output `dist`, dll.

### Checkpoint 1: Workspace & Workspace Manager
- [ ] Root dependencies terinstall dengan `npm install`.
- [ ] Perintah `npx turbo` dapat mendeteksi workspaces (akan dievaluasi setelah workspaces terisi package).

---

### Phase 2: Restrukturisasi & Migrasi Frontend
- [ ] **Task 2.1: Buat folder `frontend/` & pindahkan kode Next.js**
  - Membuat folder `frontend/`.
  - Memindahkan: `app/`, `components/`, `data/`, `lib/` (kecuali backend helper), `utils/`, `public/`, `middleware.ts`, `next-env.d.ts`.
  - Memindahkan file konfigurasi: `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts` (jika ada), dan `tsconfig.json`.
- [ ] **Task 2.2: Konfigurasi package & path di `frontend/`**
  - Memindahkan `package.json` dari root ke `frontend/package.json` dan menyesuaikan name menjadi `"frontend"` atau `"web"`.
  - Menyesuaikan `tsconfig.json` path alias `@/*` di `frontend/` agar merujuk ke `./*` relatif terhadap folder `frontend/`.
  - Pindahkan `.env.local` ke `frontend/.env.local`.
- [ ] **Task 2.3: Verifikasi Build Frontend**
  - Menjalankan `npm run build` di dalam folder `frontend/` atau via root `npx turbo build --filter=frontend` untuk memastikan tidak ada import path error.
  - Memastikan linter dan TypeScript typecheck bersih.

### Checkpoint 2: Frontend Migrated
- [ ] Folder root bersih dari file runtime frontend.
- [ ] Frontend berhasil di-build tanpa error lint/typecheck.
- [ ] Vercel configuration siap (Root Directory diubah ke `frontend/`).

---

### Phase 3: Setup Shared Package
- [ ] **Task 3.1: Inisialisasi `packages/shared/`**
  - Membuat folder `packages/shared` dengan file minimal: `package.json`, `tsconfig.json`, dan file entry point `src/index.ts`.
- [ ] **Task 3.2: Definisikan tipe & schema validasi**
  - Menambahkan tipe user roles (`admin` | `tentor` | `wali`), status invoice (`unpaid`, `waiting`, `paid`), status sesi, dll.
  - Membuat Zod schema untuk input validation (mis. Laporan Harian, Laporan Perkembangan, data Murid).
- [ ] **Task 3.3: Hubungkan Shared Package ke Frontend & Backend**
  - Menambahkan dependency `@nurman-course/shared` (atau nama package workspace) ke `frontend/package.json` dan `backend/package.json`.

### Checkpoint 3: Shared Package Linked
- [ ] Shared package ter-link otomatis lewat npm workspaces.
- [ ] Tipe dari shared package berhasil diimport di frontend.

---

### Phase 4: Upgrade Backend Express (model 3-role & API Server)
- [ ] **Task 4.1: Setup Express server boilerplate di `backend/`**
  - Inisialisasi Express server di `backend/src/index.ts`.
  - Install dev dependencies dan production dependencies baru (`express`, `cors`, `dotenv`, `@supabase/supabase-js`, `zod`, `morgan`, `@types/express`, `@types/cors`, dll.).
  - Setup routing dasar (health-check endpoint `/api/health`).
- [ ] **Task 4.2: Update Skema Prisma ke Model 3-role**
  - Membuka `backend/prisma/schema.prisma` dan memperbarui skema database sesuai dengan `docs/erd-lms.md` (menambahkan entitas `murids`, `daily_reports`, `progress_reports`, dan menyesuaikan relasi user roles).
- [ ] **Task 4.3: Perbarui Script Seeding & Migrasi DB**
  - Menyesuaikan `backend/prisma/seed.ts` untuk mengisi data dummy yang kompatibel dengan model 3-role baru.
  - Menjalankan migrasi database ke database Supabase (dev branch/project) via `npx prisma db push` atau migration.
- [ ] **Task 4.4: Implementasi Middleware Autentikasi JWT Supabase**
  - Membuat middleware Express `authMiddleware` untuk mengekstrak token Bearer JWT dari header Authorization.
  - Memverifikasi JWT menggunakan Supabase Admin Client (`supabase.auth.getUser(token)`) untuk mengidentifikasi ID dan role user.
- [ ] **Task 4.5: Buat Route Dasar & Integrasi API**
  - Membuat boilerplate routing untuk user profile `/api/users/me` guna memverifikasi auth middleware berfungsi penuh.

### Checkpoint 4: Backend API Operational
- [ ] Database Supabase menggunakan schema 3-role baru.
- [ ] Script seeding berhasil dijalankan tanpa error.
- [ ] Express server API `/api/health` dan `/api/users/me` dapat diakses dan merespon dengan benar.

---

### Phase 5: Dokumentasi & Sync Project Rules
- [ ] **Task 5.1: Sinkronisasi aturan kerja & deskripsi file**
  - Mengubah panduan di `AGENTS.md` untuk merefleksikan arsitektur monorepo baru.
  - Memperbarui `SYSTEM_MAP.md` dengan peta routing/file monorepo baru (frontend/ & backend/).
  - Mengupdate `docs/PROGRESS.md` untuk mencatat log restrukturisasi ini.

### Checkpoint 5: Project Synced
- [ ] Semua dokumentasi sinkron dengan struktur repositori.
- [ ] Linting & Typecheck di seluruh workspaces bersih.

---

## Risiko dan Mitigasi
| Risiko | Dampak | Mitigasi |
|---|---|---|
| Rusaknya alur pendaftaran funnel (`/course/*`) | Tinggi | Jangan mengubah file/logika routing `/course/*`. Perubahan hanya fokus pada isolasi folder frontend dan auth dashboard. |
| Import Path Error setelah migrasi folder | Sedang | Gunakan config `tsconfig.json` path mapping dengan benar. Lakukan test build turbo berkala. |
| Perbedaan behavior auth middleware Next.js vs Express | Sedang | Middleware Next.js hanya memeriksa session cookie Supabase di edge/serverless untuk redirect halaman. Express API memverifikasi token JWT Bearer yang dikirim frontend via API header Authorization. |
| Drift Schema Database di Supabase | Tinggi | Lakukan testing skema baru di database development branch terlebih dahulu sebelum commit perubahan schema. |

## Open Questions
- Apakah Vercel deployment saat ini menggunakan Github Integration? (Jika iya, kita perlu mengubah **Root Directory** ke `frontend` di dashboard Vercel setelah merge branch).
- Kredensial database Supabase API yang digunakan di Express backend akan disuplai dari config hosting atau menggunakan environment variables `.env` terpisah? (Iya, akan menggunakan environment variables `.env` terpisah di hosting backend).
