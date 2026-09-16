# Rencana Perbaikan: Dependency Security, Lint Frontend, dan Role dari DB

## 1. Status dan batas persetujuan

- **Tanggal:** 2026-09-16.
- **Status:** Tahap A/B selesai dan dipush pada 2026-09-16 setelah user "push aja dulu": `164337f` (dependency), `9655324` (lint/tests). Dokumentasi penutupan di commit terpisah. Tahap C belum dimulai; keputusan akses akun tetap terbuka.
- **Izin Git terbaru:** user mengizinkan commit/push hasil A/B dan docs ke `be-restruktur`; menggantikan batas larangan Git sesi sebelumnya di bawah. Tidak ada izin deploy, Playwright lanjutan, mutasi DB, atau implementasi NC-1.4.
- **Request user:** awalnya docs-only, dilanjutkan "oke letsgo kerjakan pake todo yg rinci" dan "lanjut". Instruksi terakhir: "kenapa malah sampe frontend sih, ga usah pake playwright, cukup testing backend aja, kelarin".
- **Branch konteks:** `be-restruktur`; baseline terakhir `104f426`, implementasi harness NC-1.6 pada `849d7bc`. Dokumen rencana sebelumnya belum committed dan tetap dipertahankan.
- **Penutupan sesuai instruksi terbaru:** tidak melanjutkan Playwright, fixture browser, atau perubahan frontend tambahan. Perbaikan yang sudah dibuat tidak di-revert tanpa permintaan. Verifikasi final hanya backend: 4 node:test + 24 Vitest, typecheck BE/test, compile ke temp semuanya lulus. Proses test browser/server milik sesi dihentikan.
- **Bukti sebelum pembatasan terbaru:** Next/config16.3.5, clean install terisolasi, audit9 (0critical), lint frontend0/0, frontend build35/35 dan typecheck lolos; 12 regression test Node frontend lolos. Browser publik dan beberapa komponen fixture sempat diperiksa, bukan QA lengkap portal tiga role.
- **Override gate dokumen ini:** kewajiban browser lanjutan di A3/B/checkpoint/matriks di bawah tidak dijalankan untuk penutupan sesi ini, sesuai user. Sisa QA visual, lifecycle seluruh portal dan login tiga role dicatat sebagai residual, bukan dianggap pass oleh test backend.
- **Tetap tidak dijalankan:** query/mutasi staging, migration, perubahan environment/MCP, login akun nyata, commit/push, atau deploy. Keputusan terbuka tahap C tetap memerlukan persetujuan eksplisit.
- Perintah/checklist di bawah adalah target pekerjaan; bukti hasil aktual dicatat di todo/progress, bukan diasumsikan sudah dilakukan.
- Checklist pelaksanaan tetap di [todo.md](./todo.md); bukti sesi di [PROGRESS.md](../docs/PROGRESS.md). Rencana NC-1.6 dan portal admin lama disimpan sebagai arsip di bagian bawah dan tidak menjadi izin kerja baru.

## 2. Tujuan, urutan, dan non-goals

### Urutan yang diusulkan

1. **NC-1.6h — Dependency security:** tutup dua advisory critical Next.js lebih dahulu; review temuan dependency lain secara terpisah.
2. **NC-1.2g — Lint frontend:** rapikan tipe, lifecycle/state, waktu, gambar, dan simbol unused secara bertahap.
3. **NC-1.4 — Role dari DB:** audit mapping akun, kunci kontrak penolakan akses, lalu implementasi middleware dan regression test; keputusan routing frontend wajib eksplisit.

Ini tiga pekerjaan dengan checkpoint terpisah, bukan satu refactor besar. Security patch tidak perlu menunggu seluruh lint bersih. Lint bukan prasyarat teknis mutlak role DB, tetapi urutan ini memudahkan isolasi regresi. NC-1.6 yang sudah selesai menjadi fondasi test untuk semua tahap.

### Non-goals

- Tidak redesign portal wali/admin/tentor, landing, atau alur funnel `/course/*`; perubahan gambar mempertahankan visual dan akses.
- Tidak mengubah pricing, tagihan, aturan jadwal, payload bisnis, format data foto/bukti, atau domain email placeholder.
- Tidak menambah Course/Section/Lesson, signup member, entitlement, atau fitur LMS lain.
- Tidak mengganti ORM/database, merombak monolit Express, memigrasikan CommonJS, atau menambah frontend test framework baru.
- Tidak menjalankan global `npm audit fix --force`, mematikan aturan ESLint, menyembunyikan temuan melalui ignore folder, atau membuat cast palsu.
- Helmet/rate-limit/CORS/body limit (NC-1.5), RLS/index, legacy migration ordering, dan backup tetap task terpisah.
- Tidak mengubah data akun, password, metadata, schema, atau grants sebagai efek samping audit auth.
- Izin push sebelumnya hanya untuk NC-1.6; rencana ini tidak mewarisi izin commit/push/deploy.

## 3. Baseline yang sudah diketahui

### Dependency dan test

| Area | Baseline |
|---|---|
| Next.js / eslint-config-next | `16.2.4` / `16.2.4` |
| React / React DOM | `19.2.4` / `19.2.4` |
| Lingkungan verifikasi NC-1.6 | Node `24.18.0`, npm `12.0.1`, Windows |
| Backend | Express 4, TypeScript CommonJS, Prisma 5.22.0 |
| Test existing | 4 node:test client regression + 24 Vitest auth/API; seluruhnya lolos pada NC-1.6 |
| Build existing | Typecheck BE/FE/test dan build frontend 35 static pages lolos pada NC-1.6 |
| Audit terakhir | 12 findings: 1 low, 5 moderate, 5 high, 1 critical; bukan berarti 12 kerentanan independen |

Versi kandidat yang sudah diperiksa dalam diskusi: Next.js `16.3.5` tersedia, peer React 19 menerima versi existing, dan eslint-config-next `16.3.5` menerima ESLint 9. **Periksa ulang advisory, release notes, dan registry saat implementasi; ini bukan alasan mengunci versi yang ternyata sudah usang saat itu.**

### Baseline lint sebelum upgrade

Pemeriksaan read-only sebelumnya menghasilkan 75 error + 28 warning, tersebar pada 26 file.

| Rule | Severity | Jumlah |
|---|---|---:|
| `@typescript-eslint/no-explicit-any` | error | 58 |
| `react-hooks/set-state-in-effect` | error | 7 |
| `react-hooks/purity` | error | 4 |
| `react/no-unescaped-entities` | error | 6 |
| `@typescript-eslint/no-unused-vars` | warning | 16 |
| `@next/next/no-img-element` | warning | 11 |
| `react-hooks/exhaustive-deps` | warning | 1 |

Nomor baris referensi di bawah mengikuti baseline ini, bukan janji tetap sama sesudah edit. Gunakan Codegraph kembali sebelum implementasi. Setelah upgrade ESLint config, ukur ulang dan jelaskan delta; jangan mengklaim penurunan error akibat aturan berubah sebagai perbaikan source.

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

### Checkpoint lint

Setiap batch: targeted lint + typecheck dan smoke area yang benar-benar diubah. Setiap 2–3 batch: lint penuh serta build untuk menangkap interaksi lintas file. Akhir tahap B: semua rule aktif, full lint 0/0, suite backend pass, frontend build pass, browser smoke mobile/desktop relevan tanpa console error baru. Jangan menjalankan ulang suite unchanged tanpa alasan; lakukan ketika perubahan bisa memengaruhi hasil.

## 6. Tahap C — NC-1.4: Otorisasi role dari database

### C0. Keputusan terbuka sebelum implementasi

D5 (role dari DB) sudah diputuskan pada todo; detail berikut **masih usulan**, bukan keputusan final:

1. Status/body untuk verified user tanpa record aplikasi atau role invalid: usulan `403`; kontrak existing `/api/users/me` mengembalikan `404` bila profil tidak ada, sehingga perubahan harus disengaja.
2. Akun `active=false`: apakah harus ditolak secara global sekarang, atau mempertahankan behavior sambil task terpisah? Periksa aturan produk dan seluruh caller; jangan memasukkan deactivation policy diam-diam.
3. Fallback email `/api/users/me`: usulan tidak dipakai untuk menentukan identitas/role; audit mapping dulu sebelum menghapus atau membatasi fallback profil.
4. Sinkronisasi role frontend: apakah menjadi subtask eksplisit NC-1.4 atau task lanjutan? Backend-only tidak menyelesaikan stale-role redirect end-to-end.
5. Sesi/akun test untuk smoke tiga role: siapa menyediakan dan environment mana yang boleh digunakan? Tanpa ini, test mock tidak dianggap bukti login staging.

### C1. Audit mapping akun read-only

**Dependency:** persetujuan eksekusi audit pada staging yang teridentifikasi; bukan sekadar MCP sudah terkoneksi.

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

Kontrak usulan untuk dikunci di C0:

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

### Checkpoint auth

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

- Pilih izin eksekusi **tahap A saja** atau tahap berikutnya secara bertahap; rekomendasi mulai A, bukan menjalankan semua sekaligus.
- Sebelum tahap C: setujui audit staging read-only, kontrak 403/500/active/fallback profil, dan apakah C5 routing frontend masuk scope.
- Tentukan akun test, lingkungan, izin commit/push, dan release/deploy secara eksplisit ketika diperlukan.

---

# Arsip Rencana: NC-1.6 Test Harness Backend

> Selesai pada `849d7bc` + penutupan docs `104f426`. Isi di bawah adalah konteks historis; bukan instruksi mengulang implementasi.

## Scope disetujui 2026-09-16

User: "oke, siapkan todo yg rinci, dan eksekusi, sampai push" lalu "lanjut". Branch `be-restruktur`; NC-1.6 sebelum NC-1.4. Tidak mengubah role, schema, staging, frontend, atau funnel. Rencana portal admin lama dipertahankan di bawah sebagai arsip.

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
- `tasks/todo.md`, `docs/PROGRESS.md`: hasil dan residual; rencana ini tidak menggantikan checklist.

## Risiko dan gate

- Native CommonJS `require()` tidak otomatis terkena mock Vitest; uji source import Vitest serta subprocess CommonJS existing, tanpa migrasi module runtime.
- Mock default yang melempar dapat tertangkap dan terlihat sebagai 500 yang benar: track unexpected calls dan assert nol di teardown.
- Credential palsu tidak cukup: mock dotenv/SDK sebelum import dan blok outbound, hanya izinkan loopback/port server test. Tutup listener sesudah test.
- Versi awal Vitest 3.2.4 hasil instalasi memiliki advisory; ganti ke patched sebelum diterima. Audit existing Next.js critical menjadi follow-up terpisah.
- Lint frontend existing 75 error/28 warning belum diperbaiki. Harness bukan bukti query SQL, otorisasi DB NC-1.4, atau login staging tiga role.
- Rollback kode/config melalui revert commit NC-1.6; tidak ada rollback database karena tidak ada mutasi staging.

---

# Arsip Rencana Implementasi: Portal Admin Lengkap

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
