# Goals — Nurman Course

## Arah utama

Fokus kerja saat ini adalah **backend-first**. Backend harus aman, konsisten, dan siap menjadi dasar konten mandiri sebelum frontend, katalog publik, atau monetisasi dilanjutkan.

Pertahankan selama proses:

- funnel `/course/*` dan lead WhatsApp;
- portal operasional `/app/*`;
- `Program` sebagai layanan les bertentor;
- `Course` sebagai konten mandiri;
- tidak ada mutasi DB remote, deploy, commit, atau push tanpa izin eksplisit.

## Scope aktif backend

1. Fondasi Express, Prisma, PostgreSQL Supabase, dan Supabase Auth.
2. Otorisasi berbasis verified user ID, role DB, dan status active.
3. HTTP hardening, error boundary, rate limit, dan artifact build.
4. Kesiapan migration dan backfill yang aman serta dapat diulang.
5. Konten `Course → Section → Lesson` dan API authoring.
6. Perlindungan endpoint publik dari draft, paywall, dan kebocoran body.
7. Entitlement dan reading progress setelah fondasi konten aman.

## Di luar scope sementara

- frontend writer/reader dan cutover;
- halaman publik `/kelas` dan `/materi/[slug]`;
- signup member dan perubahan routing frontend;
- payment gateway atau subscription;
- redesign UI, browser QA, dan deploy;
- migrasi/drop legacy tanpa verifikasi data dan izin DB.

## Keputusan arsitektur

- Opsi A dual surface: funnel, portal operasional, dan katalog konten terpisah.
- `Program` dan `Course` berbeda; `Course.programId` hanya jembatan migrasi opsional.
- Role menentukan wewenang operasional; entitlement menentukan akses konten.
- Akses konten melekat pada `User`, bukan `Murid`.
- Backend adalah authority tunggal untuk visibility dan body konten.
- Author hanya admin dan tentor terdaftar; tentor dibatasi `authorId`.
- Markdown dipakai sebelum block editor.
- Pembayaran course manual dan one-time; gateway belum diputuskan.
- Tidak menambah infrastruktur baru tanpa keputusan terpisah.

## Status backend lokal

Selesai lokal:

- patch dependency runtime dan HTTP hardening;
- role/active authorization berbasis DB;
- backend artifact build dan lint scoped;
- ekstraksi router legacy content;
- schema additive `Course`, `Section`, `Lesson`;
- migration SQL offline;
- API authoring admin/tentor;
- ownership, DTO, reorder, draft/publish;
- validasi link internal `/materi/*`;
- backfill content dry-run, fail-closed, atomic, dan idempotent;
- kontrak API katalog/reader dan identity boundary MTR-1/MTR-2;
- schema/migration Entitlement offline dengan multi-source;
- optional-auth dan centralized Lesson access policy MTR-4;
- API katalog, reader, library, progress, dan lockdown Data API offline MTR-5–MTR-9;
- frontend katalog `/materi`, detail `/kelas/[slug]`, reader `/materi/[slug]`, dan library `/app/materi` MTR-10.

Belum live atau belum disetujui:

- migration deploy dan backfill DB;
- hitungan data content live;
- keputusan item ambigu dan `MaterialItem.sessionId`;
- frontend cutover/single writer production;
- browser QA dan verifikasi runtime/live untuk katalog-reader;
- entitlement issuance/purchase flow;
- smoke login tiga role dan deployment.

## Keputusan materi/blog (MTR-0)

- Lesson publik hanya terbaca jika Course dan Lesson sama-sama `published` serta Course `active`.
- Lesson `entitled` pada Course `free` dapat dibaca langsung oleh user login existing; GET tidak membuat entitlement otomatis.
- Course `paid` memerlukan entitlement purchase aktif; purchase default lifetime (`expiresAt=null`).
- Entitlement mendukung beberapa source melalui beberapa baris per User-Course-Source; revoke satu source tidak mencabut source lain yang masih aktif.
- Fase awal memakai role existing `admin`, `tentor`, dan `wali`; role `member` serta signup ditunda.
- Reader memakai `401 LOGIN_REQUIRED`, `403 PURCHASE_REQUIRED`, dan `404` untuk konten draft/inactive/tidak ditemukan; response gagal tidak mengandung `bodyText`.
- Namespace API: `/api/catalog/*`, `/api/reader/*`, dan `/api/me/*`.
- MTR-0 selesai 2026-09-18; implementasi dimulai dari MTR-1 setelah kontrak API dan threat model siap.

## Urutan goals

### Goal 1 — Tutup fondasi backend

- Selesaikan keputusan lima akun Auth tanpa profil.
- Putuskan kebutuhan payload di atas 100 KB.
- Verifikasi konfigurasi origin, proxy, dan rate limit untuk target deployment.
- Pertahankan build Prisma native sesuai OS deployment.

### Goal 2 — Siapkan database content

- Jalankan audit read-only dan hitung kategori material di environment yang disetujui.
- Verifikasi backfill pada DB terisolasi.
- Pastikan jumlah, isi, relasi, slug, dan idempotensi.
- Putuskan nasib `MaterialItem.sessionId` sebelum drop kolom/FK.

### Goal 3 — Kunci content backend

- Pertahankan single writer selama transisi.
- Verifikasi migration `Course → Section → Lesson`.
- Pastikan ownership, parent-child authorization, reorder, dan publish tidak dapat dilewati.
- Jangan mengekspos draft atau body entitled melalui endpoint lama.

### Goal 4 — Tutup akses publik

- Tutup kebocoran `RoadmapStep.bodyText` dari `/api/programs*`.
- Gunakan DTO allowlist dan guard akses yang sama pada nested/search/related.
- Audit grants/RLS Data API sebelum surface publik diluncurkan.

### Goal 5 — Bangun akses member

- Definisikan entitlement free, purchase, dan enrollment.
- Tentukan expiry, revoke, multiple source, dan inactive behavior.
- Pisahkan reading progress `User × Lesson` dari progress murid.

### Goal 6 — Handoff frontend

Frontend baru dikerjakan setelah kontrak backend, migration, access guard, dan single-writer gate siap.

## Blocker aktif

- Lima akun Auth tidak memiliki profil aplikasi; rollout ditahan.
- Parser JSON masih 100 KB; ukuran payload belum diputuskan.
- Migration/backfill live memerlukan izin DB.
- Mapping `MaterialItem` session-only/ambiguous belum diverifikasi live.
- Endpoint legacy `/api/programs*` masih berpotensi mengirim `bodyText`; NC-3.4 adalah release blocker.
- Frontend masih memakai metadata role.
- Payload pembayaran UI/API masih mismatch (`paymentProof` vs `proofBase64`).

## Verification gate

- `npm run typecheck --workspace=backend`
- `npm run typecheck:test --workspace=backend`
- `npm run lint --workspace=backend`
- suite backend sesuai izin sesi
- `npm run build --workspace=backend`
- migration validation dan isolated DB verification
- negative authorization/access checks
- live smoke hanya dengan akun dan izin eksplisit

## Aturan selesai

Satu goal dianggap selesai jika scope, perubahan, verifikasi, batas bukti, residual, dan approval gate tercatat di `docs/PROGRESS.md` serta `tasks/todo.md`. Tidak boleh menyatakan DB, auth, atau deployment live aman hanya berdasarkan typecheck, mock, atau artifact lokal.
