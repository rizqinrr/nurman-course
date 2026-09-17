# Rencana Kerja — nurman-course

> Dokumen ini menyimpan scope, desain, langkah, risiko, approval gates, dan acceptance criteria; **bukan status eksekusi atau log hasil**. Status/tanggal task hanya di [todo.md](./todo.md), keputusan dan bukti di [PROGRESS.md](../docs/PROGRESS.md).
> Patokan awal: [AGENTS.md](../AGENTS.md), [SYSTEM_MAP.md](../SYSTEM_MAP.md), [README.md](../README.md), [design.md](../design.md). Klaim root yang bertentangan perlu rekonsiliasi DOC-ROOT, bukan disalin sebagai fakta runtime.

<a id="backend-restructure"></a>
## Rencana utama — restrukturisasi backend-only

Acuan keputusan: [D1–D16](../docs/PROGRESS.md#keputusan-ncourse) dan [akun nonaktif / izin bertahap](../docs/PROGRESS.md#backend-part1-20260916). Rencana ini memperinci bagian backend dari task NC, bukan mengganti ID historis. Status hanya di todo; hasil hanya di progress. Arsip frontend dan DOC-SYNC di bawah tidak memberi scope eksekusi sekarang.

### Batas dan cara eksekusi

- Kerjakan satu bagian sampai checkpoint, laporkan, baru pilih bagian selanjutnya. Bagian pertama adalah **NC-SEC-BE**, subset runtime dari NC-SEC-FOLLOWUP; auth tidak diubah bersamaan.
- Boleh mengubah backend source/tests/config/Prisma serta shared contracts bila diperlukan oleh bagian aktif. Lockfile root hanya mengikuti dependency backend yang ditinjau.
- Tidak mengubah frontend, middleware redirect, funnel/pricing, UI, renderer Markdown React, atau menjalankan frontend build/lint/test/Playwright.
- Tetap Express 4, TypeScript CommonJS, Prisma/PostgreSQL Supabase; `Program` layanan les dipertahankan. Tidak menambah microservices, generic repository, atau memindahkan seluruh monolit sekaligus.
- Tidak mengulang baseline/client/harness yang sudah tercatat selesai. Tidak commit/push/deploy, menjalankan seed destruktif, atau operasi DB remote tanpa izin tersendiri.
- Setiap perubahan perilaku: test RED, implementasi minimal, GREEN, review. Dependency-only: baseline audit/regression, patch terarah, audit/regression sesudah patch.
- Boundary utama: HTTP/token → identitas DB → ownership resource; author → konten publik/privat; pembayaran → grant akses. Role tidak menggantikan ownership dan CORS bukan otorisasi.

### Bagian 1 — dependency runtime backend (NC-SEC-BE)

**Files:** `backend/package.json`, `package-lock.json`; regression test backend hanya jika diperlukan. Tidak mengubah route/auth/schema.

1. Rekam branch/diff awal; pisahkan perubahan docs existing. Audit workspace backend runtime dan full; identifikasi direct/transitive, advisory, reachability, Node requirement, integrity dan scripts kandidat.
2. Pilih patch Express 4/Morgan serta body-parser/qs yang kompatibel; tanpa override transitive atau audit fix global. Jangan mewariskan nomor versi kandidat tanpa verifikasi registry.
3. Pin dependency langsung yang disentuh; regenerasi lockfile melalui npm scoped dengan install scripts dimatikan. Review seluruh delta, termasuk perubahan transitive/hoisting yang tidak diminta.
4. Jalankan suite client/auth/API, typecheck backend/test dan compile. Audit ulang jalur runtime; probe dependency bila perlu untuk mengunci advisory target.
5. Review security/scope, sync docs, hentikan bagian ini sebelum NC-1.4.

**Acceptance criteria:** advisory target tidak lagi berlaku pada versi resolved; seluruh delta terkait backend dan dijelaskan; tidak ada perubahan frontend/schema/otorisasi; regression/compile lolos. Audit tanpa temuan hanya berarti scope/waktu pemeriksaan tersebut, bukan aplikasi aman atau siap deploy.
**Rollback:** pertahankan patch aman; jika kandidat tidak kompatibel, hentikan dan pilih forward fix/mitigasi yang disetujui, bukan downgrade diam-diam ke versi rentan.

### Bagian 2 — identitas, role DB, akun nonaktif (NC-1.4)

**Files:** `backend/src/middleware/auth.ts`, profil `/api/users/me` di `index.ts`, `backend/tests/auth.test.ts`, `api.test.ts`, `setup.ts`; pecah batch test/middleware/profil, bukan satu perubahan besar.

**Gate disepakati 2026-09-16:** user mengonfirmasi project `akjzhktsdkbykjknkwwo` sebagai staging/development dan mengizinkan audit akun agregat read-only. Token invalid 401; missing DB/invalid role 403; inactive 403 ACCOUNT_INACTIVE; gangguan DB/Auth 500 generik; profil verified-ID-only tanpa fallback email. Bentuk profil sukses dan error guard admin dipertahankan. Audit menemukan 5 akun Auth tanpa profil; user memilih selidiki dahulu. Implementasi lokal/test mock diizinkan melalui "oke gas pake todo", tetapi merge/rollout tetap tertahan sampai admin menentukan dampak/rekonsiliasi. Tidak ada izin mutasi data/schema, sesi test, frontend, commit/push/deploy. Gate ini memperbarui butir usulan C0/C3 historis di bawah; hasil audit ada di [progress](../docs/PROGRESS.md#backend-part2-20260916).

1. Konfirmasi environment/izin audit mapping read-only; catat count missing ID, role invalid, metadata mismatch dan inactive tanpa menyalin PII. Jangan auto-link email atau memperbaiki akun dalam audit.
2. Kontrak disepakati: token invalid 401; missing DB 403 PROFILE_NOT_FOUND, invalid role 403 INVALID_ROLE, inactive 403 ACCOUNT_INACTIVE, infra 500 generik. Pesan inactive mengarahkan daftar ulang atau hubungi admin; identitas email/nomor yang sama tidak boleh auto-reactivate tanpa admin.
3. RED untuk mismatch metadata/DB, perubahan role antar-request, missing/invalid/inactive DB user, exception, guard tiga role dan nol mutasi saat ditolak.
4. Verifikasi token memakai getUser, lookup User berdasarkan verified ID, role dari DB tanpa fallback metadata/wali/cache role lintas request. Tambahkan requireRole dan wrapper requireAdmin kompatibel.
5. Profil memakai verified ID yang sama tanpa fallback email sesuai kontrak disepakati; response sukses termasuk murids dipertahankan dan pembacaan profil divalidasi ulang. Tidak mengubah metadata, password atau mengaktifkan akun lewat request autentikasi.
6. GREEN/review; endpoint yang bergantung assignment/ownership tetap memiliki guard objek. `tentorId = null` tidak memberi akses bebas.

**Acceptance criteria:** user metadata admin/DB wali tidak memperoleh privilege admin; akun nonaktif ditolak dengan kode yang disepakati; semua role existing tetap sesuai matriks; tidak ada grant/relink otomatis. Smoke tiga role nyata hanya bila tersedia sesi test berizin.
**Batas rollout:** frontend redirect/cache role tidak diselaraskan dalam scope ini; backend tests bukan bukti login UI end-to-end. Audit/kontrak selesai, tetapi keputusan admin atas 5 Auth tanpa profil memblokir merge/rollout, bukan alasan fail-open atau auto-provision.

### Bagian 3 — hardening HTTP (NC-1.5)

**Gate 2026-09-16:** user menyetujui development http://localhost:3000 saja, direct Express tanpa reverse proxy, kuota umum 300 request/menit/IP dan resolve-phone 10 request/15menit/IP per proses, configurable. Production memerlukan origin eksplisit; tidak menebak domain/proxy atau menjanjikan kuota global. Ukuran file belum diketahui: pertahankan batas JSON existing 100kb; rencana 5mb belum disetujui. Kerjakan Helmet/CORS/limiter dan sanitasi error/log dahulu; penutupan penuh payload menunggu NC-1.5-PAYLOAD. Request tanpa Origin tetap dapat masuk sesuai auth/role existing; Origin tidak dikenal ditolak sebelum handler bisnis, bukan pengganti auth. Pengujian menyeluruh diminta ditunda ke bagian 10 pada rencana percakapan; regression keamanan terarah/typecheck tetap menyertai perubahan, tanpa browser atau remote DB.

**Files kandidat:** middleware keamanan/config backend, `index.ts`, manifest/lock, test HTTP. Tambahkan file hanya jika tanggung jawabnya jelas.

- Tetapkan origin CORS berizin, rate-limit window/kuota dan topologi proxy aktual. Jangan `trust proxy=true` tanpa bukti proxy menimpa forwarding headers; limiter memory tidak dijanjikan global untuk multi-instance.
- Terapkan Helmet, allowlist CORS, limiter umum dan endpoint sensitif, JSON limit rencana 5mb. Hitung overhead base64; label ukuran file UI bukan jaminan payload diterima. API limiter tidak melindungi login langsung ke Supabase.
- Uji preflight/origin ditolak/absent Origin, spoofed forwarding headers, malformed JSON 400, body terlalu besar 413, rate limit 429, response generik dan log tidak berisi credential/bukti.

**Acceptance criteria:** controls bekerja pada HTTP tests tanpa memperluas origin/privilege; default produksi tidak fail-open bila konfigurasi wajib hilang. Angka rate limit/origin dan perubahan header merupakan gate konfigurasi, bukan ditebak.

### Bagian 4 — artifact dan relasi materi-sesi (NC-1.7 / NC-1.8)

**4A NC-1.7:** audit tracked/ignored generated client dan temp; verifikasi generate → compile → start, resolusi shared source/CommonJS dan generated Prisma; smoke artifact terisolasi. Jangan hapus file user atau ubah ignore berdasarkan asumsi jumlah file. Definisikan lint backend scoped sebagai sub-batch konfigurasi; tidak menggunakan lint frontend sebagai pengganti.
**4B NC-1.8:** petakan caller/seed dan, dengan izin, data roadmap-only/session-only/keduanya/tanpa induk. Tentukan mapping konten. `sessionId` masih dipakai; penghapusan kolom hanya setelah backfill, konsumen dan rollback aman.
**Acceptance criteria:** artifact runtime terbukti berjalan sesuai batas smoke; seluruh kategori materi punya rencana tanpa kehilangan konten. Drop kolom bukan output wajib audit.

#### NC-1.8 — hasil audit source dan mapping (2026-09-16, read-only, belum ada mutasi)

Diperiksa hanya source repo; tidak ada koneksi DB. `MaterialItem.sessionId` **tidak punya konsumen runtime**: seluruh `sessionId` di `backend/src/index.ts` (baris 285–331) milik `DailyReport` (`daily_reports.session_id` unik), dan `createMaterialItemSchema` di shared hanya menerima `roadmapStepId`, sehingga API admin materi tidak pernah menulis/membaca kolom itu.

| Kategori | Bukti source | Rencana mapping |
|---|---|---|
| roadmap-only | `prisma/seed.ts` item "Materi Hijaiyah Alif - Ya" memakai `roadmapStepId` | tidak berubah |
| session-only | `prisma/seed.ts` item "Flashcard Angka 1-10" memakai `sessionId: sessionCalistung.id` (program Calistung) | backfill `roadmapStepId` dari `session.programId` → step program tsb |
| keduanya | tidak ada di seed; hanya mungkin dari data live | jangan dipetakan otomatis; wajib hitung + keputusan manual |
| tanpa induk | tidak ada di seed | sisakan `roadmapStepId NULL`, materi jadi orphan yang harus diputuskan pemiliknya |

Catatan tambahan dari lint: step khusus program Calistung ("Mengenal Angka 1-10") dibuat seed namun binding-nya tidak pernah dipakai, sejalan dengan dugaan bahwa item Flashcard dimaksudkan menempel ke step itu, bukan ke `Session`.

**Aturan backfill yang diusulkan (belum dieksekusi):**
1. Untuk baris `sessionId NOT NULL`: ambil `Session.programId`, lalu `RoadmapStep` milik program tersebut. Jika tepat satu step → map ke step itu. Jika lebih dari satu → jangan tebak, keluarkan sebagai daftar keputusan admin (order/level tidak menentukan konten).
2. Baris dengan `roadmapStepId` sudah terisi dibiarkan; konflik (keduanya terisi dan berbeda induk) tidak ditimpa.
3. Backfill dijalankan sebagai migrasi data terpisah dengan `roadmapStepId` tetap nullable; tidak menghapus konten dan tidak menyentuh `Session`/`DailyReport`.

**Syarat sebelum drop kolom (belum dipenuhi):** (a) hitung live `session-only`/`keduanya`/`tanpa induk` di staging dengan izin eksplisit; (b) backfill selesai dan diverifikasi jumlah serta isi `bodyText` utuh; (c) konsumen diperiksa ulang (`src/index.ts` nol konsumen, tetapi tipe `frontend/data/lms.ts` masih `roadmapStepId: string` non-nullable — inkonsistensi ini harus diputuskan sebelum kolom dibuang); (d) seed diperbarui agar tidak lagi memakai `sessionId`; (e) FK `material_items_session_id_fkey` dan `session_id` baru dihapus pada migrasi terpisah, dengan rollback = restore kolom + ulangi backfill dari backup.

**Usulan query hitung read-only (belum dijalankan, tanpa PII):**

```sql
select
  count(*) filter (where roadmap_step_id is not null and session_id is null)  as roadmap_only,
  count(*) filter (where roadmap_step_id is null and session_id is not null)  as session_only,
  count(*) filter (where roadmap_step_id is not null and session_id is not null) as both_parents,
  count(*) filter (where roadmap_step_id is null and session_id is null)      as no_parent
from material_items;
```

Eksekusi query di atas, mapping, dan drop kolom tetap menunggu izin DB; audit ini tidak mengubah schema, data, atau seed.

### Bagian 5 — modularisasi dan konten (backend NC-2)

**5A NC-2.3:** characterization URL/method/status/response/guard, pisahkan route dari startup bertahap. Domain konten baru memakai router sendiri, service untuk aturan bisnis/transaksi yang diperlukan. Singleton dan export existing tetap; domain operasional lain tidak di-refactor massal.
**5B NC-2.1/2.2:** Course/Section/Lesson additive, author/slug/order/draft/published/visibility dan Course.programId nullable. Pertahankan Program dan data operasional. Migrasikan RoadmapStep menjadi Section, bodyText menjadi Lesson pembuka, MaterialItem menjadi Lesson berikutnya.
**Gate migrasi:** author legacy, slug collision dan session-only material harus jelas; verifikasi counts/isi/relasi/idempotensi pada DB terisolasi. Tetapkan satu sumber write selama transisi; tidak membiarkan katalog lama/baru diedit independen. Contract/drop lama ditahan jika konsumen frontend belum siap; tidak mengerjakan UI untuk melewati gate.
**5C NC-2.5/2.6:** CRUD/reorder/publish authoring; admin semua, tentor hanya course milik sendiri. Validasi hubungan parent-child dan field author/status; slug unik dan validasi link internal tanpa mengambil URL arbitrer. List bounded/pagination dan DTO eksplisit untuk endpoint baru; envelope lama dipertahankan.
**Acceptance criteria:** tidak kehilangan bodyText, ownership tidak dapat dilewati dengan mengganti ID induk, reorder/transaksi/slug collision teruji, draft tidak terekspos. Renderer dan editor UI NC-2.4/2.7 ditunda.

#### Kontrak transisi NC-2.1 (disetujui 2026-09-17)

- Backend baru menjadi target kontrak; frontend menyesuaikan pada task frontend terpisah. Endpoint legacy tetap kompatibel selama frontend belum cutover.
- `Course.programId` hanya diisi oleh backfill untuk `Program.hasRoadmap=true`. Course yang terhubung Program bersifat read-only melalui `/api/authoring/*`; perubahan tetap lewat endpoint roadmap/material legacy sampai cutover. Course standalone memakai API authoring baru. Tidak ada dua writer independen untuk record yang sama.
- `Course.authorId` nullable untuk hasil migrasi. Admin dapat membaca konten legacy tanpa author; tentor hanya dapat membaca/mengubah course standalone dengan `authorId` miliknya. Author baru wajib User aktif dengan role admin/tentor.
- Course dan Lesson hasil migrasi selalu `draft`; Lesson default `visibility=entitled`. `accessTier` boleh null saat draft tetapi wajib `free|paid` sebelum publish; paid wajib harga positif, free tidak menyimpan harga.
- Slug Course dan Lesson unik global. Input authoring memakai lowercase ASCII kebab-case; backfill membentuk slug deterministik dari judul dan menambah suffix `-2`, `-3`, dst. berdasarkan urutan stabil bila collision. Re-run wajib menghasilkan mapping yang sama.
- `RoadmapStep.bodyText` menjadi Lesson pembuka order0; `MaterialItem` berikutnya menjadi Lesson order1+. Session-only/ambiguous tidak ditebak dan tetap masuk daftar keputusan NC-1.8.
- Reorder wajib menerima seluruh ID sibling tepat sekali; ID asing, duplikat, atau subset ditolak sebelum transaksi. Publish/draft memakai endpoint aksi tersendiri, bukan PATCH status bebas.
- Link internal Markdown yang dimulai `/materi/` divalidasi terhadap slug Lesson tanpa HTTP fetch. Link eksternal disimpan sebagai teks dan baru disanitasi renderer frontend NC-2.4.
- Seluruh schema/migration/backfill sesi ini offline. SQL migration boleh dibuat dan direview, tetapi `migrate deploy`, `db push`, query data live, backfill nyata, dan drop legacy memerlukan izin DB terpisah.

### Bagian 6 — member, entitlement, reading progress (backend NC-4)

**6A identitas member:** perluas shared role dan phone nullable khusus akun mandiri, pertahankan kewajiban phone pada admin create existing. Provisioning idempotent memakai verified ID/email; jalur identitas-only khusus untuk profil belum ada, endpoint lain tetap fail-closed. Tolak relink/overwrite legacy berdasarkan email dan reaktivasi otomatis inactive. Tidak membuat UI signup/redirect.
**6B akses:** entitlement melekat User/Course, sumber free/purchase/enrollment, revoke/expiry diverifikasi per request. Tentukan uniqueness/multiple sources agar pencabutan satu sumber tidak salah menghapus atau menghidupkan sumber lain. Free grant berupa operasi terautentikasi idempotent, bukan mutasi GET.
**Gate enrollment:** arti akhir blok, expiry/revocation/cancellation wajib diputuskan; schema sekarang tidak punya tanggal akhir yang bisa diasumsikan. Assignment null tidak membuka akses.
**6C progress:** User×Lesson unik/idempotent, user hanya membaca/mengubah milik sendiri setelah akses lesson lolos; jangan mengubah Progress murid/RoadmapStep atau laporan les.
**Acceptance criteria:** uji empat tier, revoked/expired, inactive, multi-source dan object authorization. DB integration terisolasi untuk constraint/transaksi; mock bukan penggantinya.

### Bagian 7 — API publik terlindungi (backend NC-3)

- Katalog/detail/lesson slug mengirim metadata/silabus melalui DTO allowlist; body privat hanya sesudah guard; draft/author preview tidak masuk hasil publik.
- Audit nested relations, legacy `/api/programs`, search/filter/related/prev-next sebagai jalur bypass. Metadata publik boleh disiapkan lebih awal, body berbayar tidak diluncurkan sebelum Bagian 6 siap.
- Search sederhana PostgreSQL; tidak menambah search engine. Private responses tidak boleh shared/public cache.
- Periksa grants/RLS Supabase Data API pada tabel baru agar guard Express tidak dapat dilewati lewat REST langsung; privileged key hanya server. Gunakan history Prisma existing, jangan membuat migration history kedua diam-diam.
- Perubahan response legacy membutuhkan gate kompatibilitas; jika frontend dibutuhkan untuk cutover aman, tahan rollout, bukan ubah frontend.

**Acceptance criteria:** negative tests membuktikan konten privat/draft tidak terkirim lewat endpoint langsung, nested/search/legacy atau Data API. Live grants/RLS hanya diverifikasi dengan izin, bukan diasumsikan dari mock.

### Bagian 8 — rating dan pembelian manual (backend NC-4.5 / NC-5)

**8A rating:** satu User×Course, score 1–5, entitlement aktif; peserta dihitung user unik berakses aktif (bukan jumlah grant). Kontrak menyembunyikan count <5; tanpa review teks.
**8B purchase:** rancang record course purchase terpisah dari Invoice les yang wajib Enrollment. Server menentukan buyer/course/harga; submit bukti → verifikasi admin → grant purchase. Tentukan state machine, minimum audit trail tanpa credential, pembatalan/refund/revoke dan multiple sources sebelum implementasi.
**Acceptance criteria:** approve+grant atomik/idempotent, concurrent approve dan retry aman, replay setelah revoke tidak mengaktifkan akses lama, buyer/price tidak bisa dipalsukan, bukti privat. Constraint/concurrency diuji DB terisolasi. Tidak gateway/subscription/bucket publik; mismatch pembayaran les DOC-PAYCHECK tetap task terpisah.

### Gate verifikasi per bagian

Perintah existing dari root saat perubahan relevan:

```powershell
npm run test --workspace=backend
npm run test:artifact --workspace=backend
npm run lint --workspace=backend
npm run typecheck --workspace=backend
npm run typecheck:test --workspace=backend
npm run build --workspace=backend
```

Compile/artifact tidak lagi masuk repo: `build.cjs` menulis ke `backend/dist` yang sudah di-ignore dan hanya bertukar setelah generate+compile sukses. Script lint backend sudah tersedia sejak sub-batch 4A (`eslint.config.mjs` scoped, non-type-checked); jangan menjalankan lint frontend/global diam-diam atau menyamakan hasilnya. Dependency audit dapat membutuhkan registry; suite runtime tetap mock/loopback-only. DB integration/migration replay/remote smoke memerlukan environment dan izin spesifik. `npm run build` memerlukan `DATABASE_URL` untuk Prisma generate dan hanya berlaku untuk OS tempat build dijalankan.

Setiap checkpoint: perubahan sempit, test/compile sesuai scope, review, todo/status dan progress/hasil sinkron. Jika check gagal/tidak tersedia, catat residual; jangan mengklaim backend-only membuktikan frontend/DB live. Commit/push/deploy selalu izin terpisah. Security rollback tidak mengaktifkan metadata privilege atau versi rentan; migrasi memakai expand/backfill/verify dahulu, contract/delete belakangan.

### Keputusan terbuka sebelum bagian terkait

- Bagian 2: keputusan admin atas 5 Auth tanpa profil dan izin smoke nyata masih terbuka; environment/izin audit agregat/kontrak ID-only dan 401/403/500 sudah disepakati. Daftar ulang identitas sama membutuhkan admin, bukan reaktivasi otomatis; flow signup belum ada dan tidak ditambah pada NC-1.4.
- Bagian 3: origin lokal/direct Express/kuota awal disetujui 2026-09-16; ukuran file/JSON masih pending (batas existing100kb). Production origin/TLS/topologi/kuota wajib diverifikasi sebelum rollout; jangan aktifkan DEBUG express-rate-limit untuk trafik sensitif karena debug internal dapat mencetak URL/IP. Full verification ditunda NC-BE-VERIFY, bukan dianggap selesai.
- Bagian 5: kontrak author legacy/slug/single-writer/cutover disepakati 2026-09-17 pada [kontrak transisi](#kontrak-transisi-nc-21-disetujui-2026-09-17). Schema+migration SQL dan dry-run backfill tersedia offline; eksekusi data, penanganan item ambigu, dan cutover frontend tetap menunggu izin/task terpisah.
- Bagian 6: provisioning tanpa privilege escalation, aturan akhir blok, expiry/revoke/multiple source.
- Bagian 8: model/state pembayaran course, nominal server-side, pembatalan/refund dan audit trail.

---

<a id="doc-sync-scope"></a>
## Scope dokumentasi — DOC-SYNC

- **Batas perubahan:** lima dokumen `docs/` (overview, flow, ERD, roadmap, progress) serta `tasks/todo.md` dan `tasks/plan.md`. Markdown root tidak diubah.
- **Langkah:** pisahkan task/status dari hasil; pindahkan hanya riwayat unik ke progress; pertahankan desain dan acceptance criteria yang belum dikerjakan; periksa tautan internal dan diff; lakukan review independen.
- **Acceptance criteria:** ID/status/tanggal todo terjaga; WALI-MOB tidak dianggap selesai; satu tabel D1–D16 di [keputusan nCourse](../docs/PROGRESS.md#keputusan-ncourse); tidak ada checkbox eksekusi di plan; hasil lama memiliki rujukan progress; validasi dan review dicatat pada [sesi DOC-SYNC](../docs/PROGRESS.md#doc-sync-20260916).
- **Larangan sesi:** tidak mengubah aplikasi/root docs, menjalankan test/lint/typecheck/build/browser/DB/install, atau melakukan Git writes/push. Izin sesi lama tidak diwarisi.

<a id="rencana-security-lint-auth"></a>
## Rencana bertahap — Dependency security, lint frontend, dan role DB

### 1. Cara membaca dan approval gates

- Rencana bertanggal **2026-09-16**, konteks branch `be-restruktur`; status NC-1.6h / NC-1.2g / NC-1.4 hanya di [checklist NC](./todo.md#nc--restrukturisasi-ncourse-coursesectionlesson--entitlement).
- Tahap A/B dipertahankan sebagai **arsip desain**; bukan instruksi mengulang patch/lint. Riwayat hasil dan pembatasan QA: [penutupan backend-only](../docs/PROGRESS.md#2026-09-16--patch-dependency-dan-lint-selesai-penutupan-backend-only); riwayat Git: [commit/push A/B](../docs/PROGRESS.md#2026-09-16--commit-dan-push-patch-dependency-serta-lint).
- Tahap C adalah rencana bersyarat. Audit staging, kontrak auth, routing frontend, akun test, dan rollout perlu persetujuan eksplisit masing-masing.
- Semua perintah/gate di bawah adalah **target untuk eksekusi yang disetujui nanti**, bukan izin sesi DOC-SYNC. Browser lanjutan tetap ditahan; NC-1.2g-QA memerlukan izin baru dan test backend tidak menggantikan bukti frontend.
- Arsip NC-1.6, portal admin, dan monorepo mempertahankan scope/acceptance criteria; status mengikuti ID pada todo, bukan bullet di plan.

## 2. Tujuan, urutan, dan non-goals

### Urutan yang diusulkan

1. **NC-1.6h — Dependency security:** tutup dua advisory critical Next.js lebih dahulu; review temuan dependency lain secara terpisah.
2. **NC-1.2g — Lint frontend:** rapikan tipe, lifecycle/state, waktu, gambar, dan simbol unused secara bertahap.
3. **NC-1.4 — Role dari DB:** audit mapping akun, kunci kontrak penolakan akses, lalu implementasi middleware dan regression test; keputusan routing frontend wajib eksplisit.

Ini tiga pekerjaan dengan checkpoint terpisah, bukan satu refactor besar. Security patch tidak perlu menunggu seluruh lint bersih. Lint bukan prasyarat teknis mutlak role DB, tetapi urutan ini memudahkan isolasi regresi. Harness NC-1.6 menjadi prasyarat test untuk semua tahap; status pelaksanaannya hanya di todo.

### Non-goals

- Tidak redesign portal wali/admin/tentor, landing, atau alur funnel `/course/*`; perubahan gambar mempertahankan visual dan akses.
- Tidak mengubah pricing, tagihan, aturan jadwal, payload bisnis, format data foto/bukti, atau domain email placeholder.
- Tidak menambah Course/Section/Lesson, signup member, entitlement, atau fitur LMS lain.
- Tidak mengganti ORM/database, merombak monolit Express, memigrasikan CommonJS, atau menambah frontend test framework baru.
- Tidak menjalankan global `npm audit fix --force`, mematikan aturan ESLint, menyembunyikan temuan melalui ignore folder, atau membuat cast palsu.
- Helmet/rate-limit/CORS/body limit (NC-1.5), RLS/index, legacy migration ordering, dan backup tetap task terpisah.
- Tidak mengubah data akun, password, metadata, schema, atau grants sebagai efek samping audit auth.
- Rencana ini tidak memberi atau mewarisi izin commit/push/deploy; persetujuan historis hanya berlaku pada sesi yang tercatat di progress.

## 3. Referensi baseline dan prasyarat

Angka hasil, versi awal, dan rincian rule/file dipindahkan ke [baseline historis](../docs/PROGRESS.md#arsip-plan-baseline-20260916). Versi kandidat dan nomor baris di arsip desain A/B merujuk baseline tersebut, bukan keadaan terkini atau target upgrade otomatis.

Sebelum implementasi lanjutan, verifikasi ulang source, advisory, release notes, registry, peer dependency, dan Node deployment. Ukur ulang lint setelah perubahan config dan jelaskan delta; jangan menganggap rule yang dilonggarkan sebagai source yang sudah diperbaiki.

## 4. Tahap A — NC-1.6h: Dependency security

### A1. Triage dan tetapkan target (read-only saat eksekusi nanti)

**Periksa:** manifest/lockfile, Node deployment aktual, dependency paths, advisory dan reachability. Aset utama yang dilindungi adalah server runtime, credential server, dan data pengguna. Input gambar/HTTP melewati boundary Next.js; audit package bukan bukti telah terjadi kompromi.

Advisory target:
- [GHSA-p293-qw3h-jr36](https://github.com/advisories/GHSA-p293-qw3h-jr36): RCE pada aplikasi yang di-host dengan Windows filesystem; lini Next 16 terdampak sebelum `16.3.3`. OS lokal Windows bukan bukti deployment produksi Windows.
- [GHSA-2xp9-vwfh-vxw4](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4): RCE pada optimasi AVIF melalui dependency image processing; patch lini 16 mulai `16.3.3`. Periksa dampak perubahan penanganan AVIF pada gambar existing.

**Acceptance criteria:** versi terpasang/versi patched diketahui, target upgrade dan compatibility tercatat, lingkungan produksi tidak diasumsikan, temuan lain dipisahkan runtime versus tooling dengan alasan reachability.

### A2. Upgrade terarah

**Files:** `frontend/package.json`, `package-lock.json`. `next.config.*` hanya jika ada incompatibility konkret yang dibuktikan; bukan file yang otomatis diubah.

- Ubah `next` dan `eslint-config-next` dari `16.2.4` ke versi patched yang sama; kandidat awal `16.3.5` dengan pin exact.
- Pertahankan React/React DOM `19.2.4` kecuali pemeriksaan compatibility/security menemukan kebutuhan patch tersendiri; jangan menaikkan major untuk merapikan lockfile.
- Review versi resolved `sharp`, `postcss`, optional native binaries, serta dependency transitif yang berubah.
- Hindari override dependency transitif tanpa memastikan parent menerima versi tersebut. Jangan menganggap Next patched otomatis menghilangkan semua advisory sharp/libvips/libheif.
- Review registry, integrity lockfile, dan lifecycle scripts. Jangan menyetujui seluruh install scripts global; native tooling yang diperlukan diperiksa satu per satu.
- Tidak menjalankan codemod massal atau rename `middleware.ts` menjadi `proxy.ts` hanya untuk warning deprecation.

**Acceptance criteria:** pasangan versi Next/config selaras, peer dependency valid, delta lockfile terkait kebutuhan patch dan setiap collateral update dijelaskan; tidak ada perubahan business logic.

### A3. Verifikasi dan checkpoint security

- Reproduksi instalasi dari lockfile pada lingkungan terisolasi yang disepakati, bukan menghapus environment kerja user tanpa persetujuan.
- Audit ulang workspace dan runtime dependency paths. Target dua advisory di atas tidak lagi berlaku pada versi resolved.
- Jalankan typecheck BE/FE/test, suite backend, frontend build, dan lint untuk baseline setelah upgrade.
- Browser smoke: `/landing`, `/course`, pemilihan program sampai config tanpa mengirim WhatsApp, `/login`, redirect tanpa sesi, gambar lokal/remote yang memang dipakai dan preview gambar existing.
- Login tiga role nyata hanya menggunakan akun test/sesi yang disetujui; jangan mengambil token browser atau membuat/reset akun demi pengujian.
- Catat temuan tersisa per advisory/path, severity, reachability, tindakan, pemilik tindak lanjut, dan tanggal review. Critical/high yang reachable harus ditangani atau diberi pembatasan akses sebelum release.

**Gate:** dua advisory target tertutup dan tidak ada regresi pada tes/build/smoke yang dijalankan. Lint legacy masih boleh menjadi residual pada checkpoint A, bukan disembunyikan. Tidak menyebut seluruh dependency aman jika audit masih memiliki temuan.

**Batas:** pembaruan Express/morgan/qs atau tooling lain dari audit tidak otomatis termasuk A2; buat slice terpisah dengan scope/version/verification yang disetujui setelah triage. Tidak deploy otomatis setelah patch.

## 5. Tahap B — NC-1.2g: Lint frontend

### B0. Rekam ulang baseline

- Gunakan ESLint config existing setelah tahap A, tanpa menurunkan severity, menghapus preset, atau memperluas ignores.
- Simpan ringkasan rule/file/count di progress; output mentah atau credential jangan dimasukkan ke repo.
- Gunakan model/DTO existing; shared type hanya diperluas untuk field yang benar-benar ada pada response backend.
- Target akhir **0 error/0 warning**. Jika suatu warning tidak bisa diperbaiki tanpa mengubah kontrak, berhenti dan catat kebutuhan keputusan; jangan mengecap task selesai.
- Test perilaku yang berpotensi berubah menggunakan tooling existing. Harness backend tidak dianggap mencakup regression frontend.

### B1. API/cache dan debugger (2–3 file)

**Files:** `frontend/lib/api.ts`, `frontend/components/ui/DebugBar.tsx`; `frontend/data/lms.ts` hanya bila tipe pendukung dibutuhkan.

**Rencana perubahan:**
- Cache `data: any` (`api.ts:30`) menjadi `unknown`, pertahankan generic boundary `apiFetch<T>` serta cache key/invalidation/error behavior existing.
- Tidak membuat class `ApiError` baru: baseline menggunakan `Error`, bukan class API error khusus.
- DebugBar (`:13`) membaca external store dengan subscription yang sesuai, kandidat `useSyncExternalStore`; snapshot immutable dan stabil sampai ada notifikasi, server snapshot deterministik.
- Operasi clear harus memicu notifikasi store; tidak sekadar mengubah array diam-diam atau menambah timer untuk melewati lint.

**Acceptance criteria / verifikasi:** targeted lint/typecheck lolos; cache HIT/MISS/invalidation/error tetap; widget hanya dev, tidak ada hydration warning, clear/copy/subscription bekerja dan listener dilepas saat unmount.

### B2. Roadmap dan drawer (3 file)

**Files:** `frontend/app/app/admin/roadmap/RoadmapClient.tsx`, `frontend/app/app/admin/layout.tsx`, `frontend/app/app/tentor/layout.tsx`.

**Rencana perubahan:**
- Pada loader roadmap (`:105–147`), pisahkan fetching dari reset state sinkron; initial loading melalui initializer, reset pilihan melalui event yang tepat.
- Hindari fetch program berulang hanya karena `selectedProgramId` berubah; functional update untuk pemilihan awal bila sesuai.
- Lindungi semua cabang success/error/finally dari response yang sudah usang atau komponen unmounted; berlaku juga untuk refresh setelah CRUD.
- Drawer menutup saat navigasi, termasuk Back/Forward. Pertimbangkan state terkait pathname atau komponen drawer kecil keyed pathname; **jangan remount seluruh portal** karena bisa menghapus state form.
- Pertahankan Escape, backdrop, toggle, label aksesibilitas, dan layout.

**Acceptance criteria / verifikasi:** targeted lint/typecheck; pindah program A→B dengan response terbalik tidak menampilkan A; CRUD refresh tetap konsisten; buka/tutup drawer, link, Back/Forward dan Escape bekerja tanpa kehilangan form unrelated.

### B3. Jadwal tiga role (3 file)

**Files:** `frontend/app/app/admin/jadwal/page.tsx`, `frontend/app/app/tentor/jadwal/page.tsx`, `frontend/app/app/(wali)/jadwal/page.tsx`.

**Rencana perubahan:**
- Tipekan session/enrollment relations dan mapper; gunakan field langsung alih-alih `as any`, sambil mempertahankan precedence fallback response existing.
- Perbaiki loader effect dengan prinsip latest request/unmount guard dari B2; jangan menambah library data fetching hanya untuk lint.
- Ganti pembacaan waktu saat render (`Date.now`) dengan clock terkontrol; candidate state awal deterministik dan pembaruan client lewat callback lifecycle yang sesuai.
- Tentukan kapan waktu diperbarui berdasarkan perilaku existing/batas sesi/focus; jangan membekukan waktu di module scope atau mengubah cadence menjadi fitur realtime baru tanpa kebutuhan.
- Pertahankan timezone tampilan, payload tanggal, kalender, status scheduled/completed/cancelled, dan aturan sesi lewat.

**Acceptance criteria / verifikasi:** targeted lint/typecheck; sesi sebelum/tepat/sesudah `endsAt`, pergantian hari, loading/error, filter dan response cepat berurutan teruji; tidak ada hydration mismatch atau perubahan payload save.

### B4. Dashboard dan profil tentor (3 file)

**Files:** `frontend/app/app/tentor/dashboard/page.tsx`, `frontend/app/app/(wali)/dashboard/page.tsx`, `frontend/app/app/tentor/profil/page.tsx`.

**Rencana perubahan:**
- Gunakan fallback Promise bertipe dan mapper DTO→view model eksplisit; hindari double assertion untuk memaksa hasil cocok.
- Profil sudah mempunyai tipe response `data`/`enrollments`; hapus cast redundant tanpa menambah union response spekulatif.
- Terapkan clock snapshot yang konsisten di dashboard; clock child tidak boleh dianggap otomatis memperbarui keputusan parent.
- Hapus binding unused yang terkonfirmasi, tetapi tidak otomatis menghapus request dari `Promise.all` atau mengubah loading semantics.

**Acceptance criteria / verifikasi:** targeted lint/typecheck; kartu sesi dan badge pending konsisten, relasi/null/response kosong ditangani, label hari ini/besok dan selector anak tetap benar.

### B5. Laporan tentor dan wali (3 file)

**Files:** `frontend/app/app/tentor/laporan-harian/LaporanHarianClient.tsx`, `frontend/app/app/tentor/laporan-perkembangan/LaporanPerkembanganClient.tsx`, `frontend/app/app/(wali)/laporan/page.tsx`.

**Rencana perubahan:**
- Tipekan mapper laporan/session/view model termasuk raw start/end, lokasi, alamat, relasi tentor, dan nomor WA yang memang dipakai.
- Pakai `Program.sessionsPerBlock` existing; tidak membuat tipe program duplikat dengan field lebih longgar.
- Pertahankan relasi `session.tentor` atau `tentor` setelah mapping agar link WA tidak kehilangan nomor.
- Escape tiga pasang tanda kutip JSX dengan entities atau ekspresi teks; tidak mengubah isi notes atau data tersimpan.

**Acceptance criteria / verifikasi:** targeted lint/typecheck; render/edit laporan existing, null relations, blok laporan perkembangan, print layout, nomor WA dan preview pesan sama; pengujian tidak mengirim pesan WA atau menyimpan data staging tanpa izin.

### B6. Foto/bukti pembayaran dan tipe admin tentor (5 file)

**Files:** `frontend/app/app/admin/tentor/page.tsx`, `frontend/app/app/admin/murid/page.tsx`, `frontend/app/app/admin/tagihan/page.tsx`, `frontend/app/app/admin/tagihan/[invoiceId]/page.tsx`, `frontend/components/ui/ProofModal.tsx`.

**Rencana perubahan:**
- Hapus cast redundant pada `address`/`photoPath` bila model existing sudah mendeklarasikannya.
- Ganti 11 penggunaan img yang dilaporkan dengan `next/image` hanya setelah memeriksa sumber/dimensi; gunakan width/height atau container `fill` berukuran stabil dengan sizes yang sesuai.
- Untuk base64/private proof gunakan `unoptimized` bila diperlukan sehingga tidak memperkenalkan proxy optimizer bagi data privat.
- Pertahankan fallback foto, alt text, aspect ratio, modal/fullscreen, orientasi portrait/landscape, dan cabang PDF.
- Tidak melonggarkan remotePatterns global untuk mengizinkan URL sembarang, tidak mengunggah ulang, tidak membuat bucket publik, tidak mengubah otorisasi proof.

**Acceptance criteria / verifikasi:** 11 warning gambar terselesaikan tanpa suppression; avatar/preview/fullscreen/PDF tetap berfungsi, ukuran/layout tidak bergeser, tidak ada request ke layanan eksternal baru untuk bukti privat.

### B7. Landing cleanup (5 file)

**Files:** `frontend/components/landing/LandingAbout.tsx`, `LandingCategories.tsx`, `LandingStats.tsx`, `LandingTestimonials.tsx`, `LandingTutors.tsx`.

**Rencana perubahan:**
- Hapus import GlassCard yang tidak digunakan pada empat section.
- Perbaiki dependency `useMemo` untuk import tutors statis; pakai kalkulasi sederhana atau dependency tepat, bukan dependency fiktif.
- Untuk binding reduced-motion unused, bedakan binding tak dipakai dari hook yang memiliki efek; jangan membatalkan dukungan reduced-motion yang sudah ada atau menambah animasi baru.

**Acceptance criteria / verifikasi:** targeted lint/typecheck; visual, carousel wrap/scroll dan perilaku reduced-motion existing tetap; funnel/pricing/CTA tidak berubah.

### B8. Sisa unused dan final sweep (maksimal 4 file per batch)

**Files utama:** `frontend/app/app/(wali)/profile/page.tsx`, `frontend/app/app/(wali)/tagihan/page.tsx`, dan revisit dashboard/laporan yang masih menyisakan warning.

- Hapus import/variabel benar-benar unused; jika hanya nilai state tak dibaca tetapi setter dipakai, evaluasi lifecycle sebelum menghapus state.
- Tidak menghapus request, validasi, side effects, atau fallback error hanya karena hasilnya tidak ditampilkan.
- Jalankan lint penuh dan bandingkan seluruh tujuh kelompok rule dengan baseline B0.

**Acceptance criteria / verifikasi:** 0 error/0 warning, typecheck/build/test tetap pass, selector anak/profil/tagihan tidak mengalami perubahan UX atau loading yang tidak disepakati.

### Target checkpoint lint

Setiap batch: targeted lint + typecheck dan smoke area yang benar-benar diubah. Setiap 2–3 batch: lint penuh serta build untuk menangkap interaksi lintas file. Akhir tahap B: semua rule aktif, full lint 0/0, suite backend pass, frontend build pass, browser smoke mobile/desktop relevan tanpa console error baru. Jangan menjalankan ulang suite unchanged tanpa alasan; lakukan ketika perubahan bisa memengaruhi hasil.

## 6. Tahap C — NC-1.4: Otorisasi role dari database

### C0. Keputusan kontrak dan gate rollout

[D5 (role dari DB)](../docs/PROGRESS.md#keputusan-ncourse) sudah terimplementasi lokal pada checkpoint NC-1.4, bukan bukti deploy. Kontrak berikut disepakati 2026-09-16; hasil audit/verifikasi di [progress](../docs/PROGRESS.md#backend-part2-20260916):

1. Verified user tanpa record aplikasi ditolak `403 PROFILE_NOT_FOUND`; role invalid `403 INVALID_ROLE`; perubahan missing profil dari 404 menjadi 403 disetujui. Error401/500 string lama dipertahankan; SDK status400/401/403 dianggap credential rejection, returned error lainnya/exception adalah 500 generik.
2. Akun `active=false`: diputuskan setelah draft ini, **403 ACCOUNT_INACTIVE**, arahan daftar ulang/hubungi admin; identitas sama tidak auto-reactivate tanpa admin. Rujuk [keputusan terbaru](../docs/PROGRESS.md#backend-part1-20260916); implementasi tetap NC-1.4.
3. Fallback email `/api/users/me` dihapus sesuai persetujuan; profil verified-ID-only, bentuk sukses tetap. Lima Auth tanpa profil tidak boleh direlink berdasarkan email; keputusan admin atas dampak akun ini tetap gate rollout.
4. Sinkronisasi role frontend: instruksi terbaru menetapkan **di luar scope backend-only**. C5 tetap ditunda; backend-only tidak menyelesaikan stale-role redirect end-to-end.
5. Sesi/akun test untuk smoke tiga role: siapa menyediakan dan environment mana yang boleh digunakan? Tanpa ini, test mock tidak dianggap bukti login staging.

### C1. Audit mapping akun read-only

**Dependency:** persetujuan audit staging/dev `akjzhktsdkbykjknkwwo` diberikan eksplisit dan audit agregat selesai. Izin ini bukan izin mutasi, login/sesi test atau deployment.

- Bandingkan auth user ID dengan user Prisma, missing mapping dua arah, duplikasi/ketidaksesuaian identitas, role null/unknown, status active, serta mismatch metadata↔DB.
- Catat count/anomali minimum yang diperlukan. Jangan menyimpan daftar email/nomor/token/full profile di Git atau log.
- Email boleh menjadi sinyal audit, bukan dasar auto-link. Tidak membuat/reset akun, menerbitkan sesi baru, memperbarui metadata/role, atau mengubah data.
- Jika mismatch menyebabkan user lama kehilangan akses setelah rollout, berhenti dan minta keputusan remediasi data terpisah.

**Acceptance criteria:** mapping dan risiko akses diketahui, akun terdampak punya rencana yang disetujui, tidak ada penulisan remote. Audit gagal/tidak lengkap memblokir rollout auth, bukan alasan fallback ke metadata.

### C2. Kontrak dan regression test RED (2–3 file)

**Files:** `backend/tests/auth.test.ts`, `backend/tests/api.test.ts`, `backend/tests/setup.ts`.

- Siapkan fixture identity Supabase terpisah dari role/user DB; mock lookup berdasarkan verified ID.
- Ubah test legacy fallbackwali menjadi test bahwa tidak ada grant role default; jangan menghapus pengaman lama yang masih relevan.
- Pertahankan fail-fast boundary, isolasi env, network guard, dan empat regression test client existing.
- Uji metadata `admin`/DB `wali`: `requireAuth` menerima identitas sebagai wali, tetapi guard endpoint admin menolak `403`; mismatch metadata sendiri bukan alasan menolak seluruh akses. Metadata `wali`/DB `admin` mendapat hak sesuai DB; metadata kosong/DB role valid diterima; DB missing/role invalid ditolak; DB throw tidak fail-open.
- Uji semua role, role berubah pada request berikutnya tanpa menunggu JWT refresh, header/token error tanpa query DB, dan nol operasi mutasi pada request ditolak.

**Acceptance criteria:** test baru gagal pada implementasi metadata existing karena alasan perilaku yang benar, bukan import/fixture rusak. Kontrak status/message final sudah disetujui di C0.

### C3. Middleware role DB dan kompatibilitas guard (1–2 file)

**Files utama:** `backend/src/middleware/auth.ts`; helper role di file yang sama kecuali kebutuhan modularisasi nyata ditemukan.

Alur target:
1. Validasi Bearer token menggunakan Supabase `getUser`; identitas berasal dari hasil verifikasi, bukan decode JWT tanpa verifikasi.
2. Lookup `prisma.user` berdasarkan verified ID melalui singleton NC-1.3; select hanya field yang diperlukan.
3. Validasi role terhadap enum/type existing (`admin`, `tentor`, `wali`); tidak memakai metadata untuk privilege.
4. Isi request user dengan identitas/role yang jelas, hapus `[key: string]: any` bila caller memang hanya membutuhkan field known; audit caller sebelum mempersempit.
5. Tambah `requireRole(...)` dan pertahankan requireAdmin sebagai wrapper kompatibel; jangan mengganti semua route sekaligus jika tidak perlu.

Kontrak disepakati di C0 (kode/body rinci pada Bagian2 dan progress):

| Kondisi | Respons/keputusan |
|---|---|
| Header/token invalid | `401`, tidak lookup DB |
| Identitas valid, user DB ada, role valid | Lanjut memakai role DB |
| User DB tidak ada / role null atau unknown | `403`, tanpa fallback wali atau auto-provision |
| Role tidak diizinkan endpoint | `403`, format error admin existing dipertahankan |
| DB/SDK unexpected exception | `500` generik, tidak bocorkan detail atau fail-open |
| Identitas sama, role DB berubah | Request baru mengikuti DB, tanpa role cache lintas request pada iterasi ini |

**Acceptance criteria / verifikasi:** C2 GREEN; middleware tidak mengimpor kembali entrypoint, tidak membuat Prisma client baru, tidak menambah role member, query ekstra per request bounded; no metadata escalation.

### C4. Konsistensi profil dan matriks endpoint (maksimal 3 file)

**Files:** `backend/src/index.ts` pada `/api/users/me`, `backend/tests/api.test.ts`, tipe terkait hanya jika kontrak memerlukannya.

- Audit fallback ID→email di `/api/users/me` (baseline sekitar baris 110) agar endpoint profil tidak memilih identitas berbeda dari middleware.
- Jangan memakai kesamaan email untuk memperluas hak akses; keputusan penghapusan fallback mengikuti hasil C1 dan C0.
- Pertahankan bentuk response profil dan relasi murids yang dibutuhkan frontend kecuali perubahan disetujui eksplisit.
- Hindari query/profile cache global yang dapat mempertahankan role lama. Evaluasi query profil kedua tanpa mengubah seluruh arsitektur.
- Verifikasi endpoint admin terlindungi, sesi/laporan per role tetap dibatasi, request nonadmin tidak melakukan mutasi.

**Acceptance criteria:** identitas profil konsisten dengan authenticated DB user, kontrak client lama tetap valid atau migrasinya jelas, tests/matriks akses tiga role lolos.

### C5. Routing frontend — subtask bersyarat, belum disetujui

**Alasan:** `frontend/middleware.ts:18` dan `:47` masih memakai metadata role/fallback wali; perubahan backend saja bisa menghasilkan portal salah atau redirect loop walaupun API sudah aman.

**Calon files:** `frontend/middleware.ts`, `frontend/lib/supabase/middleware.ts`, helper profil/API serta caller redirect login yang ditemukan saat Codegraph; daftar final ditentukan setelah approval scope, bukan menambah file spekulatif.

**Opsi yang direkomendasikan untuk dimintakan persetujuan:** sinkronisasi routing dengan profil DB-backed dari backend sebagai authority. Jangan mengakses DB dengan service-role key di frontend. Jika tidak masuk scope, catat keterbatasan backend-only dan jangan klaim D5 sudah konsisten seluruh aplikasi.

Jika disetujui:
- Rancang akses profil server-side yang tidak recurse kembali ke middleware; pertahankan refresh cookie Supabase.
- Profil privat tidak boleh masuk shared cache atau cache lintas user. Tentukan timeout dan perilaku ketika API tidak tersedia.
- Bedakan belum login dari user terverifikasi tetapi tidak punya akses, serta server error; jangan redirect 403/500 bolak-balik ke login yang otomatis mengembalikan ke portal.
- Tentukan invalidasi cache profil client saat role berubah agar keputusan server dan UI tidak divergen.
- Gunakan route yang sudah ada sejauh memadai; halaman error baru memerlukan scope eksplisit.

**Acceptance criteria / verifikasi:** login/logout dan redirect tiga role, role DB berubah sementara metadata lama, API unreachable/401/403/500, cookie refresh, dan Back/Forward tidak bocor antar-user atau loop. Frontend routing bukan pengganti guard backend.

### Target checkpoint auth

Audit mapping lolos, keputusan C0 selesai, RED→GREEN tercatat, test client/auth/API dan typecheck/build lolos. Lakukan smoke real tiga role hanya pada sesi yang disetujui; jika tidak tersedia, laporkan blocker/residual dan jangan klaim rollout aman. C5 yang belum disetujui tidak boleh diimplementasikan atau ditandai selesai.

## 7. Matriks verifikasi saat implementasi disetujui

Perintah dari root repo, kecuali disebut lain; **tidak dijalankan pada sesi penulisan rencana ini**.

| Gate | Perintah / cara | Kapan dan hasil yang diharapkan |
|---|---|---|
| Audit dependency | `npm audit --json` dan inspection dependency paths | Sebelum/sesudah patch; target advisory hilang, residual dijelaskan |
| Suite backend | `npm run test --workspace=backend` | Setelah perubahan relevan; empat test client tetap, auth/API sesuai kontrak terbaru |
| Test typecheck | `npm run typecheck:test --workspace=backend` | Setelah fixtures/test/helper berubah; exit0 |
| Backend typecheck | `node node_modules/typescript/bin/tsc --noEmit --project backend/tsconfig.json` | Setelah dependency/backend berubah; exit0 |
| Frontend typecheck | `node node_modules/typescript/bin/tsc --noEmit --project frontend/tsconfig.json` | Setelah batch frontend; exit0 |
| Lint penuh | `npm run lint` | Baseline tahap A dan checkpoint B; akhir B harus0/0 |
| Strict lint target | `npm run lint --workspace=frontend -- --max-warnings=0` | Acceptance akhir B; tanpa mengubah script permanen hanya untuk target ini |
| Frontend build | `npm run build --workspace=frontend` | Setelah dependency patch/checkpoint frontend; tidak ada error baru |
| Backend compile/smoke | Existing build atau output temp terisolasi; health dan endpoint proteksi | Saat backend/dependency berubah; bedakan stub smoke dari live DB |
| Browser | Playwright existing, akun/sesi test yang disetujui | Jadwal, drawer, roadmap, laporan/print, gambar/PDF, cache/debugger, login/redirect |
| Review | Diff scoped, tests first, security review auth/dependency | Tidak ada secret, permission widening, atau unrelated upgrade |

Targeted lint per batch memakai path file di quote (termasuk `(wali)` dan `[invoiceId]`), tanpa auto-fix massal. Pastikan executable lokal workspace ditemukan; jangan menginstal versi global sebagai fallback. Jangan menganggap build lulus sebagai bukti auth aman atau lint bersih.

## 8. Risiko dan mitigasi

| Risiko | Dampak | Mitigasi / stop condition |
|---|---|---|
| Upgrade minor Next mengubah runtime/gambar atau rule lint | Regresi navigasi/render/hasil lint | Review release notes, pin exact, baseline ulang, image+login smoke |
| Resolusi npm memengaruhi dependency shared frontend/backend | Scope membesar | Bandingkan seluruh delta existing lockfile, dokumentasikan alasan, pisahkan upgrade tak terkait |
| Cleanup effect memicu race/unmount update | Data program/sesi salah | Latest request guard seluruh success/error/finally; uji response terbalik dan Strict Mode |
| Clock/hydration berubah | Sesi salah dikategorikan | Snapshot awal deterministik, uji batas waktu dan kalender tanpa mengubah timezone |
| Refactor drawer remount seluruh portal | Form/reset data hilang | Isolasi state navigasi, jangan key root/children portal |
| Mengganti img membuka gambar privat | Kebocoran foto/bukti | Tetap base64/private, hindari proxy publik/allowlist lebar, cek network preview |
| Casting baru hanya menyamarkan tipe invalid | Runtime bug lolos compiler | DTO dari response nyata, narrowing, fixtures null/empty; tanpa double assertion |
| Mapping auth↔Prisma tidak cocok | Akun existing kehilangan akses | C1 read-only dan remediation approval sebelum rollout; tanpa auto-link email |
| Role backend dan redirect frontend berbeda | Portal salah/redirect loop | C5 scope eksplisit; tidak mengklaim end-to-end selesai jika backend-only |
| Akun nonaktif belum punya kebijakan jelas | Perubahan akses tak disadari | Putuskan C0 sebelum menambah check active |
| Audit/test real belum bisa dijalankan | Bukti verifikasi tidak lengkap | Laporkan blocker dan batas bukti, jangan ganti dengan klaim mock setara staging |

## 9. Rollout, rollback, dan dokumentasi

- Setelah izin eksekusi, tandai hanya satu task/batch utama `in_progress`; update todo dan progress sesudah tiap checkpoint, jangan centang berdasarkan rencana.
- Pisahkan commit dependency security, batch lint, dan role DB jika commit diizinkan. Rencana ini sendiri tidak memberi izin Git write atau deploy.
- Review source dan artifact yang benar-benar akan dijalankan. Native CommonJS/shared package packaging bukan dibuktikan hanya oleh mock tests.
- Rollback lint: revert batch minimal yang menyebabkan regresi sambil mempertahankan security patch; jangan menghapus perubahan user lain.
- Rollback dependency/auth: **jangan kembali ke versi rentan atau mengaktifkan kembali metadata privilege sebagai jalan pintas**. Gunakan forward fix, versi aman yang kompatibel, atau pembatasan akses sementara yang disetujui.
- Tidak ada rollback DB dalam rencana ini karena tidak ada mutasi database. Jika remediasi akun/migration diperlukan, buat rencana terpisah dengan backup dan approval.
- Penutupan wajib: file berubah, baseline/final count, command+hasil, browser coverage, review, advisory tersisa, keputusan auth/FE, serta residual dicatat. Vault tidak menggantikan dokumen repo.

## 10. Persetujuan yang dibutuhkan berikutnya

- Pilih satu follow-up berdasarkan status di todo (mis. NC-SEC-FOLLOWUP atau NC-1.4); jangan mengulang Tahap A/B hanya karena arsip desainnya masih ada.
- Sebelum tahap C: setujui audit staging read-only, kontrak 403/500/active/fallback profil, dan apakah C5 routing frontend masuk scope.
- Tentukan akun test, lingkungan, izin commit/push, dan release/deploy secara eksplisit ketika diperlukan.

---

<a id="nc-access-design"></a>
## Desain lanjutan NC — akses konten dan empat tier

> Target desain dari grilling **2026-09-15**, dipindahkan dari todo. **Belum menjadi klaim implementasi**. Task NC-2 sampai NC-6 dan checkpoint-nya tetap di [todo.md](./todo.md#nc--restrukturisasi-ncourse-coursesectionlesson--entitlement); keputusan D1–D16 di [PROGRESS.md](../docs/PROGRESS.md#keputusan-ncourse).

Satu pertanyaan akses: `lesson.visibility === "public"` **ATAU** user punya `Entitlement` aktif (`revokedAt` null **dan** (`expiresAt` null **atau** masa depan)) atas course yang memuat lesson ini. Backend menjadi penentu isi yang boleh dikirim (D6), bukan hanya penyembunyian UI.

| Tier | Mekanisme target |
|---|---|
| Publik (blog, tanpa login) | `visibility: public` — tanpa entitlement |
| Login + gratis | `accessTier: free` → entitlement `source: free` terbit otomatis |
| Bayar, akses selamanya | entitlement `source: purchase`, `expiresAt: null` |
| Bayar + dapat tentor | `Enrollment` aktif → entitlement `source: enrollment`, `expiresAt` = akhir blok |

**Acceptance criteria NC-4.C4:** keempat tier, revoked/expired entitlement, dan tiga role lama diuji; konten privat tidak terkirim kepada user tanpa akses. Role menentukan portal, entitlement menentukan konten; akses melekat ke User, bukan Murid. Formula ini bukan alasan mengabaikan draft/publish/ownership yang direncanakan di NC-2.6.

**Batas desain:** D11 (rename hierarki awal) **disupersede oleh D16 untuk pemisahan entitas**: `Program` tetap untuk layanan bertentor, `Course.programId` nullable menghubungkan konten mandiri. `MaterialItem.sessionId` masih ada dan seed menggunakannya menurut handoff source; NC-1.8 wajib audit sebelum penghapusan. D5 role dari DB adalah target NC-1.4, bukan fitur selesai.

**Risiko/dependency:** fondasi migration harus lebih dulu agar perubahan schema Tahap 2–4 tidak kehilangan data. NC-1.4 wajib audit mapping staging berizin sebelum merge. NC-2.2 harus memindahkan `RoadmapStep.bodyText` utuh ke `Lesson` urutan 0 serta MaterialItem dan menjaga slug global unik; verifikasi konten wali di `/app/program/[slug]`. Tahap 2 menyentuh UI wali/admin: koordinasikan dengan WALI-MOB dan mulai setelah stabil, bukan melanjutkan UI yang di-pause.

<a id="nc-deferred-design"></a>
## Desain NC — fitur ditunda dan pemicu

Dari **18 fitur usulan**, enam menjadi scope bertahap (#16, #14, #5, #18, #1, #9), dua belas ditunda dengan pemicu berikut. Hierarki tiga tingkat dan entitlement **direncanakan** untuk memberi ruang perluasan; belum terpasang dan bukan jaminan tidak akan perlu perubahan desain.

| Fitur usulan | Baru dipertimbangkan saat |
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

Pemicu bukan persetujuan otomatis: catat perubahan keputusan dan task terlebih dahulu. Payment gateway Midtrans/Xendit tetap keputusan terbuka NC-5.2; D7 tidak mengunci vendor. Rename NC-6 hanya display/brand; domain placeholder `@nurmancourse.local`, package `@nurman-course/shared`, nama package dan folder repo tidak ikut. Migrasi placeholder memerlukan rencana sendiri untuk `users.email` **dan** `auth.users` agar login tidak terputus.

<a id="fase-exit-design"></a>
## Acceptance criteria fase LMS — arsip rencana

Target di bawah dipindahkan dari todo, **bukan hasil atau bukti semua task fase selesai**. Status tiap F* hanya di todo. Referensi demo adalah konteks transisi lama, bukan konfigurasi untuk diaktifkan kembali setelah DMO-1/DMO-2.

| Fase | Exit / acceptance criteria |
|---|---|
| 0 | Entity jelas, ERD ada, kandidat stack tertulis, open questions tersisa ≤ 3. |
| 1 | Login berjalan, admin masuk shell, satu program ada di DB. |
| 1.5 | Workspaces aktif, frontend/backend/shared terintegrasi, build monorepo dan `/api/health` serta `/api/users/me` tervalidasi. |
| 2 | Data master lengkap terkelola; wali dapat melihat materi dan roadmap anaknya. |
| 3 | Tentor input laporan per sesi/per blok; wali memantau perubahan secara real-time sebagai target produk. |
| 4 | Status bayar terlihat admin/wali; konfirmasi manual berjalan lancar. |
| 5 | Lead flow dan LMS selaras dengan keputusan A/B; funnel production tidak putus selama cutover. |
| 3.6 | Target historis: portal tentor dapat beralih dummy/API; laporan benar-benar masuk PostgreSQL lewat Express, bukan hanya state UI. |
| 3.7 | Target historis: portal wali terhubung backend dengan toggle demo; build/lint tanpa error/warning. |
| 3.8 | Target historis: portal admin terhubung backend dengan toggle demo; build/lint tanpa error/warning. |

---

# Arsip Rencana: NC-1.6 Test Harness Backend

> Arsip desain NC-1.6; status/tanggal pada [todo.md](./todo.md), bukti pada [sesi harness](../docs/PROGRESS.md#2026-09-16--nc-16-test-harness-backend-terisolasi). Bukan instruksi mengulang implementasi atau izin push baru.

## Scope disetujui 2026-09-16

NC-1.6 mendahului NC-1.4. Batas rancangan: tidak mengubah role, schema, staging, frontend, atau funnel. Persetujuan pelaksanaan historis tercatat di progress; tidak diwarisi sesi berikutnya.

## Urutan dan acceptance criteria

1. **Dependency/config:** pin versi patched Vitest/supertest/types pada backend dan review lockfile. Vitest Node-only dengan discovery `.test.ts`; node:test `.cjs` tetap terpisah. `test` aggregate gagal bila salah satu suite gagal; typecheck tests/config tidak menghasilkan build artifact.
2. **Auth characterization:** gunakan middleware asli dan mock hanya dependency boundary. Test 401 header/token, tiga role, legacy fallback wali, 500 exception, 403/nonadmin, admin pass, isolasi identitas. Ini baseline, bukan pengesahan metadata sebagai otorisasi.
3. **HTTP slice:** RED untuk export app yang belum ada, lalu export minimal di index.ts tanpa memindah route/startup. Health200 tanpa DB, me401 tanpa DB, me200 profil fixture, admin-users403 dengan input valid/nonadmin dan400 input invalid/admin; tidak ada mutasi. Import app tidak menjalankan startup.
4. **Verification/review/ship:** empat client tests lama tetap utuh; test baru, typecheck BE/FE/test, compile dan smoke CommonJS, lint dan audit. Sync docs, review independen, cek staged diff/secrets, commit/push NC-1.6 saja dan cek HEAD remote.

## Files

- `backend/package.json`, `package-lock.json`: devDeps dan scripts.
- `backend/vitest.config.mts`, `backend/tsconfig.test.json`: konfigurasi test saja.
- `backend/tests/setup.ts`, helper bila diperlukan, `auth.test.ts`, `api.test.ts`: env palsu, mock/reset/fail-fast, pembatasan network, test kasus nyata.
- `backend/src/index.ts`: export app saja; guard `require.main === module` dan export prisma dipertahankan.
- `tasks/todo.md`: checklist/status; `docs/PROGRESS.md`: keputusan/hasil/verifikasi/residual. Rencana ini tidak menggantikan keduanya.

## Risiko dan gate

- Native CommonJS `require()` tidak otomatis terkena mock Vitest; uji source import Vitest serta subprocess CommonJS existing, tanpa migrasi module runtime.
- Mock default yang melempar dapat tertangkap dan terlihat sebagai 500 yang benar: track unexpected calls dan assert nol di teardown.
- Credential palsu tidak cukup: mock dotenv/SDK sebelum import dan blok outbound, hanya izinkan loopback/port server test. Tutup listener sesudah test.
- Pilih Vitest patched dan tinjau dependency transitif; advisory di luar scope harness harus menjadi follow-up terpisah, bukan global audit fix.
- Hasil lint/audit historis ada di progress. Harness bukan bukti query SQL, otorisasi DB NC-1.4, atau login staging tiga role.
- Rollback kode/config melalui revert commit NC-1.6; tidak ada rollback database karena tidak ada mutasi staging.

---

# Arsip Rencana Implementasi: Portal Admin Lengkap

## Konteks arsip
- Desain historis ADM; bukan spesifikasi runtime terkini atau izin eksekusi. Status setiap ADM-*.*/ADM-*.C* dan ADM-Q* hanya di [todo.md](./todo.md#plan-portal-admin-lengkap--adm-draft-siap-implementasi). Bullet berikut menyatakan scope/acceptance criteria, tidak menyatakan pekerjaan selesai.
- Referensi hasil: [perencanaan ADM](../docs/PROGRESS.md#2026-08-01--plan-lengkap-portal-admin) dan entri per domain di progress. Demo/fallback dalam arsip bukan instruksi mengaktifkan kembali demo yang dihapus DMO-1/DMO-2.
- Scope: melengkapi portal admin `/app/admin` dengan data live, CRUD, validasi, proteksi role, dan verifikasi end-to-end.
- Urutan implementasi wajib mengikuti dependensi data: fondasi API → Program → User/Murid → Enrollment → Roadmap/Materi → Session → Invoice → polish.
- Tidak mengubah funnel `/course/*` dan tidak membangun fitur di luar MVP LMS.

## Tujuan
Admin dapat mengelola seluruh data operasional Nurman Course dari satu portal: program, akun tentor/wali, murid, enrollment, roadmap, materi teks, jadwal sesi, dan invoice.

## Batas rancangan historis
- Pengembangan dirancang dari dashboard/pilot admin menuju CRUD lengkap atas User, Murid, Program, RoadmapStep, MaterialItem, Enrollment, Session, dan Invoice.
- Identitas Supabase diteruskan sebagai Bearer JWT ke API Express.
- Fallback dummy semula direncanakan hanya selama transisi slice; rujuk DMO-1/DMO-2 sebelum menafsirkan scope ADM-7.1. Jangan membuat demo mode baru dari arsip ini.

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
- Petakan route, layout, komponen UI, helper API, tipe frontend, dan endpoint yang sudah ada.
- Catat field Prisma yang benar-benar dipakai tiap domain.
- Definisikan status loading/error/empty dan pola form untuk semua halaman admin.
- Pastikan tidak ada task aktif lain yang konflik dengan portal admin.

**Acceptance criteria:** baseline file map dan dependency graph tercatat; tidak ada asumsi field yang bertentangan dengan Prisma.

#### ADM-0.2: Definisikan kontrak API dan schema validasi bersama
- Tambahkan enum/status type untuk role, program, enrollment, session, invoice.
- Tambahkan Zod schema create/update/list filter untuk domain yang akan dikerjakan.
- Tetapkan format error dan response list/mutation.
- Tambahkan tipe response frontend tanpa `any`.

**Acceptance criteria:** kontrak dapat dipakai backend dan frontend; input invalid menghasilkan error terstruktur.

#### ADM-0.3: Siapkan helper admin API dan query state
- Buat helper request admin atau perluas `apiFetch` dengan method/body/query params.
- Standarkan handling `401`, `403`, `404`, `409`, dan `422/400` di UI.
- Siapkan komponen/pola reusable untuk table, filter, form, confirm dialog, toast, dan pagination bila memang belum ada.

**Acceptance criteria:** domain berikutnya tidak mengulang helper fetch dan pola error secara manual.

### Target checkpoint 0 — Kontrak
- Backend tsc sukses.
- Frontend lint dan typecheck sukses.
- Endpoint contract dan status code terdokumentasi di source/type.

### Phase 1 — Program Catalog

#### ADM-1.1: API CRUD Program
- `GET /api/admin/programs` dengan search, category, active, page, limit.
- `POST /api/admin/programs` dengan validasi slug unik, name, description, category, basePrice, sessionsPerBlock, active.
- `GET /api/admin/programs/:id` dengan ringkasan roadmap/enrollment/session.
- `PATCH /api/admin/programs/:id` dengan validasi partial update.
- `DELETE` atau deactivate program sesuai relasi; cegah penghapusan yang merusak histori.
- Tambahkan admin role guard dan error conflict slug.

#### ADM-1.2: UI Program
- Tambahkan menu **Program** di desktop sidebar dan mobile nav.
- Buat list program live dengan search/filter status/kategori.
- Buat form create/edit dengan validasi field dan format harga.
- Tambahkan detail program dan ringkasan relasi.
- Tambahkan konfirmasi deactivate/delete dan feedback sukses/gagal.

#### ADM-1.3: Seed dan verifikasi Program
- Pastikan seed memiliki minimal dua program dengan kategori berbeda.
- Uji slug duplicate, angka negatif, sessionsPerBlock invalid, dan program nonaktif.
- Uji create → list → edit → deactivate melalui API dan UI.

**Acceptance criteria:** admin dapat membuat, melihat, mengubah, dan menonaktifkan program live tanpa merusak enrollment historis.

### Target checkpoint 1 — Program
- API integration test/manual curl untuk seluruh endpoint program.
- UI desktop dan mobile dapat dipakai.
- `npm run lint`, backend `tsc`, dan frontend `npm run build` sukses.

### Phase 2 — User, Wali, Tentor, dan Murid

#### ADM-2.1: API User Tentor dan Wali
- `GET /api/admin/users` dengan filter role/search/status bila status tersedia.
- `POST /api/admin/users` membuat user Supabase Auth terkonfirmasi dan row Prisma dalam transaction-safe flow.
- `PATCH /api/admin/users/:id` mengubah profil dan role hanya melalui aturan yang aman.
- Deactivate user tanpa menghapus histori session/enrollment.
- Jangan expose password; gunakan temporary password flow atau instruksi reset yang aman.
- Cegah admin menghapus/deactivate dirinya sendiri tanpa recovery flow.

#### ADM-2.2: UI User
- Tambahkan menu **Pengguna** atau submenu Tentor/Wali.
- Buat table dengan role badge, nama, email, phone, status, dan relasi ringkas.
- Buat form tambah/edit tentor dan wali.
- Tampilkan hasil pembuatan akun tanpa menampilkan secret.
- Tambahkan deactivate dan confirm dialog.

#### ADM-2.3: API Murid
- `GET /api/admin/murids` perluas dengan search, wali filter, pagination, dan relasi ringkas.
- `POST /api/admin/murids` dengan waliId valid dan field murid tervalidasi.
- `GET /api/admin/murids/:id` dengan enrollment, session, dan laporan ringkas.
- `PATCH /api/admin/murids/:id` untuk profil dan wali.
- Deactivate/delete mengikuti relasi historis dan cascade policy yang eksplisit.

#### ADM-2.4: UI Murid
- Tambahkan menu **Murid**.
- Buat list/search/filter wali.
- Buat form create/edit dan pemilihan wali dari data live.
- Buat detail murid dengan tab/ringkasan enrollment, sesi, dan laporan.

**Acceptance criteria:** admin dapat mengelola tentor, wali, dan murid; relasi wali-murid valid; secret auth tidak bocor; user non-admin tetap mendapat `403`.

### Target checkpoint 2 — User dan Murid
- Uji role guard admin/non-admin.
- Uji duplicate email dan waliId invalid.
- Uji deactivate user dengan histori.
- Build/lint backend dan frontend sukses.

### Phase 3 — Enrollment

#### ADM-3.1: API Enrollment
- `GET /api/admin/enrollments` dengan filter status, murid, program, pagination.
- `POST /api/admin/enrollments` memvalidasi murid dan program aktif.
- `PATCH /api/admin/enrollments/:id` untuk status dan tanggal mulai.
- Cegah enrollment duplicate aktif untuk pasangan murid-program bila aturan bisnis mengharuskan unik.
- Sediakan endpoint detail dengan invoice dan progress ringkas.

#### ADM-3.2: UI Enrollment
- Tambahkan menu **Enrollment**.
- Buat form pilih murid, program, status, dan startedAt.
- Buat list/filter status dan link ke detail murid/program.
- Tambahkan aksi cancel/complete dengan konfirmasi.

**Acceptance criteria:** admin dapat menghubungkan murid ke program secara live dan status enrollment konsisten dengan relasi database.

### Target checkpoint 3 — Enrollment
- Uji transaction dan duplicate active enrollment.
- Uji program nonaktif tidak dapat dipilih untuk enrollment baru.
- UI menampilkan state kosong/error/loading.

### Phase 4 — Roadmap dan Materi Teks

#### ADM-4.1: API RoadmapStep
- `GET /api/admin/programs/:programId/roadmap` terurut berdasarkan `order`.
- `POST /api/admin/programs/:programId/roadmap` dengan order/title/bodyText/level.
- `PATCH /api/admin/roadmap-steps/:id`.
- `DELETE /api/admin/roadmap-steps/:id` dengan aturan cascade material yang jelas.
- Tambahkan reorder endpoint atau strategi normalisasi order.

#### ADM-4.2: API MaterialItem
- `GET /api/admin/roadmap-steps/:stepId/materials`.
- `POST /api/admin/roadmap-steps/:stepId/materials`.
- `PATCH /api/admin/material-items/:id`.
- `DELETE /api/admin/material-items/:id`.
- Validasi bodyText, title, order, dan kepemilikan relasi.

#### ADM-4.3: UI Roadmap dan Materi
- Tambahkan menu **Roadmap & Materi**.
- Pilih program lalu tampilkan timeline langkah belajar.
- Form edit body teks/markdown sederhana.
- Kelola material per langkah dengan reorder.
- Preview konten sebagai teks/markdown aman; sanitasi bila renderer HTML dipakai.

**Acceptance criteria:** admin dapat membuat roadmap berurutan dan materi teks; wali dapat membaca hasilnya melalui endpoint existing tanpa data corrupt.

### Target checkpoint 4 — Roadmap
- Uji order/reorder dan delete cascade.
- Uji konten kosong/terlalu panjang dan input tidak valid.
- Verifikasi halaman wali tetap dapat membaca roadmap/materi.

### Phase 5 — Session dan Jadwal

#### ADM-5.1: API Session
- `GET /api/admin/sessions` dengan filter tanggal, status, tentor, murid, program.
- `POST /api/admin/sessions` validasi startsAt < endsAt dan relasi aktif.
- `GET /api/admin/sessions/:id`.
- `PATCH /api/admin/sessions/:id` untuk jadwal, assignment, lokasi, status.
- Cancel session tanpa menghapus laporan historis.
- Cegah konflik jadwal tentor/murid sesuai aturan bisnis yang disepakati.

#### ADM-5.2: UI Session
- Tambahkan menu **Jadwal Sesi**.
- Buat list hari/minggu dengan filter.
- Form assign program, tentor, murid, start/end, lokasi, status.
- Tambahkan detail sesi dan link laporan terkait.
- Tambahkan confirm cancel dan feedback konflik jadwal.

**Acceptance criteria:** admin dapat membuat dan mengubah sesi; tentor dan wali melihat perubahan live; sesi completed/cancelled menjaga histori laporan.

### Target checkpoint 5 — Session
- Uji waktu invalid, relasi invalid, dan overlap.
- Verifikasi endpoint tentor/wali setelah sesi dibuat/diubah.
- Build/lint sukses.

### Phase 6 — Invoice dan Status Pembayaran

#### ADM-6.1: API Invoice
- `GET /api/admin/invoices` dengan filter status, murid, program, dueAt, pagination.
- `POST /api/admin/invoices` terkait enrollment aktif.
- `GET /api/admin/invoices/:id`.
- `PATCH /api/admin/invoices/:id/status` dengan transition `unpaid → waiting → paid` dan aturan koreksi.
- Set/clear `paidAt` secara konsisten saat status berubah.
- Catat note admin tanpa menyimpan data pembayaran sensitif.

#### ADM-6.2: UI Invoice
- Tambahkan menu **Tagihan**.
- Buat table status, nominal, jatuh tempo, murid, program.
- Buat form terbitkan invoice dari enrollment.
- Tambahkan aksi ubah status dan detail invoice.
- Tampilkan konfirmasi status dan link instruksi WhatsApp wali bila sudah ada.

**Acceptance criteria:** admin dapat menerbitkan invoice dan mengelola status; wali membaca status yang sama; nilai dan tanggal tervalidasi.

### Target checkpoint 6 — Invoice
- Uji status transition dan paidAt.
- Uji nominal negatif/zero, enrollment invalid, dan duplicate request.
- Verifikasi halaman wali tagihan.

#### ADM-6.5: Data Master Rekening Bank (PaymentAccount)
- Model `PaymentAccount` + `prisma db push`/`generate`.
- CRUD admin `GET/POST/PATCH/DELETE /api/admin/payment-accounts` (auto-clear `isDefault`, tolak hapus rekening default).
- `GET /api/payment-accounts` (auth wali, filter `isActive`).
- UI admin `/app/admin/rekening`: list, form, set default, hapus.
- Halaman wali `/app/(wali)/tagihan` membaca rekening dari API (fallback bila kosong); hapus hardcode Mandiri.
- Seed PaymentAccount default Mandiri + BSI.

### Phase 7 — Integrasi Portal dan Polish

#### ADM-7.1: Sinkronisasi navigasi dan dashboard
- Tambahkan semua menu final ke desktop sidebar/mobile nav.
- Dashboard memakai endpoint list/stat yang stabil tanpa fetch duplikat berlebihan.
- Link antar detail domain konsisten.
- Banner demo hanya tampil saat demo mode aktif.

#### ADM-7.2: UX, aksesibilitas, dan security hardening
- Semua form punya label, keyboard navigation, focus state, dan error message.
- Semua mutasi punya disabled/loading state dan confirm untuk aksi destruktif.
- Tidak ada secret/token/password pada client response atau log.
- Rate/size limit dan validasi server untuk input teks panjang.
- Audit role guard seluruh endpoint admin.

#### ADM-7.3: Test dan dokumentasi
- Tambahkan test endpoint untuk auth, validation, relation, status transition, dan conflict.
- Tambahkan smoke test UI untuk navigasi dan happy path tiap domain.
- Jalankan backend tsc, frontend lint/build, dan test monorepo.
- Update `docs/PROGRESS.md`, `tasks/todo.md`, `SYSTEM_MAP.md`, dan API documentation jika endpoint bertambah.

**Acceptance criteria:** portal admin lengkap dan usable di desktop/mobile; seluruh domain live; regression tenant/wali tidak ditemukan; docs sinkron.

### Target checkpoint 7 — Definition of Done
- Semua task ADM-0 sampai ADM-7 selesai atau explicitly deferred.
- Tidak ada endpoint admin tanpa role guard.
- Tidak ada form admin tanpa loading/error/empty/validation state.
- Database migration, seed, API, UI, dan docs konsisten.
- Lint, typecheck, build, dan test sukses.
- Review security dan code quality selesai sebelum merge.

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

## Pertanyaan desain historis dan rujukan keputusan

Status keputusan mengikuti ADM-Q1–Q4 di [todo.md](./todo.md#keputusan-terbuka), bukan membuka ulang keputusan dari arsip ini.

- **ADM-Q1:** duplikasi enrollment aktif murid-program; acuan desain berikutnya memakai penolakan 409 — [keputusan 2026-08-01](../docs/PROGRESS.md#2026-08-01--adm-3-enrollment--adm-6-tagihan--adm-65-rekening-api--ui-live).
- **ADM-Q2:** konflik jadwal tentor/murid, hard reject versus warning — [keputusan 2026-08-24](../docs/PROGRESS.md#2026-08-24--penguatan-validasi-bisnis-backend-bentrok-murid-lock-role-relasi-dan-transisi-invoice).
- **ADM-Q3:** password sementara oleh admin versus reset/invite email; pertahankan kebutuhan keputusan sebelum mengubah flow.
- **ADM-Q4:** perubahan role existing versus role terkunci; rujuk batas relasi pada keputusan 2026-08-24 yang sama.

---

# Arsip: Rencana Restrukturisasi Monorepo

> Desain historis; status pelaksanaan hanya pada F1.5.1–F1.5.8 di [todo.md](./todo.md#fase-15--restrukturisasi-monorepo--express-api-selesai). Task bernomor di bawah adalah rincian desain, bukan checklist baru. Pemetaan: persiapan/workspace → F1.5.1–2; frontend → F1.5.3; shared → F1.5.4; backend/auth/route → F1.5.5–7; dokumentasi → F1.5.8.
> Langkah DB/Git/hosting di arsip memerlukan approval baru. Rujukan `db push` historis **tidak berlaku** untuk staging ter-baseline; aturan migration NC-1.2 di [Tabel Keputusan](../docs/PROGRESS.md#tabel-keputusan-arsitektur--stack--ab--aturan-penting) mendahuluinya.

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
- **Task 1.1: Arsipkan backend existing & hapus duplikat desain**
  - Membuat branch baru `restructure/monorepo` (opsional) atau memastikan perubahan di-commit di `dev`.
  - Mengarsipkan `backend/` lama (salin isi schema & seed ke folder backup temporer `archive/backend-v1` jika perlu, atau mengandalkan git history).
  - Menghapus folder duplikat `prompt-google-stitch/` (mempertahankan `desain-ui-frontend/`).
- **Task 1.2: Inisialisasi npm workspaces di root**
  - Mengubah `package.json` di root menjadi minimalis, bertindak sebagai workspace root.
  - Menambahkan workspaces: `["frontend", "backend", "packages/*"]`.
- **Task 1.3: Konfigurasi Turborepo**
  - Membuat file `turbo.json` di root untuk konfigurasi task pipeline (`build`, `dev`, `lint`).
  - Mengatur target dependencies (mis. `build` di frontend butuh shared package dibuild lebih dulu).
- **Task 1.4: Update `.gitignore`**
  - Memastikan ignore rules mencakup file-file temporer monorepo, build output `dist`, dll.

### Target checkpoint 1: Workspace & Workspace Manager
- Root dependencies terinstall dengan `npm install`.
- Perintah `npx turbo` dapat mendeteksi workspaces (akan dievaluasi setelah workspaces terisi package).

---

### Phase 2: Restrukturisasi & Migrasi Frontend
- **Task 2.1: Buat folder `frontend/` & pindahkan kode Next.js**
  - Membuat folder `frontend/`.
  - Memindahkan: `app/`, `components/`, `data/`, `lib/` (kecuali backend helper), `utils/`, `public/`, `middleware.ts`, `next-env.d.ts`.
  - Memindahkan file konfigurasi: `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts` (jika ada), dan `tsconfig.json`.
- **Task 2.2: Konfigurasi package & path di `frontend/`**
  - Memindahkan `package.json` dari root ke `frontend/package.json` dan menyesuaikan name menjadi `"frontend"` atau `"web"`.
  - Menyesuaikan `tsconfig.json` path alias `@/*` di `frontend/` agar merujuk ke `./*` relatif terhadap folder `frontend/`.
  - Pindahkan `.env.local` ke `frontend/.env.local`.
- **Task 2.3: Verifikasi Build Frontend**
  - Menjalankan `npm run build` di dalam folder `frontend/` atau via root `npx turbo build --filter=frontend` untuk memastikan tidak ada import path error.
  - Memastikan linter dan TypeScript typecheck bersih.

### Target checkpoint 2: Frontend Migrated
- Folder root bersih dari file runtime frontend.
- Frontend berhasil di-build tanpa error lint/typecheck.
- Vercel configuration siap (Root Directory diubah ke `frontend/`).

---

### Phase 3: Setup Shared Package
- **Task 3.1: Inisialisasi `packages/shared/`**
  - Membuat folder `packages/shared` dengan file minimal: `package.json`, `tsconfig.json`, dan file entry point `src/index.ts`.
- **Task 3.2: Definisikan tipe & schema validasi**
  - Menambahkan tipe user roles (`admin` | `tentor` | `wali`), status invoice (`unpaid`, `waiting`, `paid`), status sesi, dll.
  - Membuat Zod schema untuk input validation (mis. Laporan Harian, Laporan Perkembangan, data Murid).
- **Task 3.3: Hubungkan Shared Package ke Frontend & Backend**
  - Menambahkan dependency `@nurman-course/shared` (atau nama package workspace) ke `frontend/package.json` dan `backend/package.json`.

### Target checkpoint 3: Shared Package Linked
- Shared package ter-link otomatis lewat npm workspaces.
- Tipe dari shared package berhasil diimport di frontend.

---

### Phase 4: Upgrade Backend Express (model 3-role & API Server)
- **Task 4.1: Setup Express server boilerplate di `backend/`**
  - Inisialisasi Express server di `backend/src/index.ts`.
  - Install dev dependencies dan production dependencies baru (`express`, `cors`, `dotenv`, `@supabase/supabase-js`, `zod`, `morgan`, `@types/express`, `@types/cors`, dll.).
  - Setup routing dasar (health-check endpoint `/api/health`).
- **Task 4.2: Update Skema Prisma ke Model 3-role**
  - Membuka `backend/prisma/schema.prisma` dan memperbarui skema database sesuai dengan `docs/erd-lms.md` (menambahkan entitas `murids`, `daily_reports`, `progress_reports`, dan menyesuaikan relasi user roles).
- **Task 4.3: Perbarui Script Seeding & Migrasi DB**
  - Menyesuaikan `backend/prisma/seed.ts` untuk mengisi data dummy yang kompatibel dengan model 3-role baru.
  - Menjalankan migrasi database ke database Supabase (dev branch/project) via `npx prisma db push` atau migration.
- **Task 4.4: Implementasi Middleware Autentikasi JWT Supabase**
  - Membuat middleware Express `authMiddleware` untuk mengekstrak token Bearer JWT dari header Authorization.
  - Memverifikasi JWT menggunakan Supabase Admin Client (`supabase.auth.getUser(token)`) untuk mengidentifikasi ID dan role user.
- **Task 4.5: Buat Route Dasar & Integrasi API**
  - Membuat boilerplate routing untuk user profile `/api/users/me` guna memverifikasi auth middleware berfungsi penuh.

### Target checkpoint 4: Backend API Operational
- Database Supabase menggunakan schema 3-role baru.
- Script seeding berhasil dijalankan tanpa error.
- Express server API `/api/health` dan `/api/users/me` dapat diakses dan merespon dengan benar.

---

### Phase 5: Dokumentasi & Sync Project Rules
- **Task 5.1: Sinkronisasi aturan kerja & deskripsi file**
  - Mengubah panduan di `AGENTS.md` untuk merefleksikan arsitektur monorepo baru.
  - Memperbarui `SYSTEM_MAP.md` dengan peta routing/file monorepo baru (frontend/ & backend/).
  - Mengupdate `docs/PROGRESS.md` untuk mencatat log restrukturisasi ini.

### Target checkpoint 5: Project Synced
- Semua dokumentasi sinkron dengan struktur repositori.
- Linting & Typecheck di seluruh workspaces bersih.

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
