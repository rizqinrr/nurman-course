# Roadmap — Nurman Course menuju nCourse

Dokumen arah produk dan urutan pengembangan, bukan checklist eksekusi atau log progres. Funnel WhatsApp dan portal operasional les sudah tersedia; perluasan menjadi katalog konten mandiri masih merupakan rencana yang harus dipilih melalui task aktif.

## 1. Patokan dan pembagian dokumen

| Dokumen | Fungsi |
|---|---|
| [AGENTS.md](../AGENTS.md) | Aturan kerja, larangan scope, tanggung jawab pricing, dan disiplin dokumentasi. |
| [SYSTEM_MAP.md](../SYSTEM_MAP.md) | Peta sistem/routing sebagai patokan awal; cek source bila rincian tertinggal. |
| [README.md](../README.md) | Pintu masuk repo; bagian template tidak menjadi keputusan stack/deployment. |
| [design.md](../design.md) | Referensi desain root; konflik dengan keputusan visual berikutnya perlu rekonsiliasi, bukan redesign diam-diam. |
| [CODEBASE_OVERVIEW.md](./CODEBASE_OVERVIEW.md) | Arsitektur dan batas implementasi sekarang, termasuk konflik dokumentasi root. |
| [flow-system.md](./flow-system.md) / [erd-lms.md](./erd-lms.md) | Alur sistem dan model data sekarang; model rencana diberi label terpisah. |
| [tasks/todo.md](../tasks/todo.md) | Task, checkbox, tanggal selesai, status dan blocker singkat. |
| [tasks/plan.md](../tasks/plan.md) | Langkah implementasi, scope, dependency, acceptance criteria, dan approval gates. |
| [PROGRESS.md](./PROGRESS.md) | Keputusan bertanggal, perubahan yang benar-benar terjadi, hasil verifikasi, commit, dan residual. |

Markdown root tetap patokan awal. Klaim lama seperti “tidak ada backend”, “stack belum dipilih”, atau “semua data statis” tidak menggambarkan implementasi sekarang. Jangan menjadikan konflik itu alasan mengganti stack atau menjalankan rencana tanpa izin. Rincian konflik ada di overview; rekonsiliasi root merupakan task DOC-ROOT.

Vault hanya ringkasan manusia; status kerja ditentukan dokumen repo. Roadmap ini tidak menyatakan tanggal release, hasil test, atau keberhasilan deployment.

## 2. Masalah dan sasaran produk

Memberi pengelola les, tentor, wali, dan calon pembaca satu sistem yang mudah digunakan untuk:

- Menemukan program les dan menghubungi admin melalui WhatsApp.
- Mengelola murid, enrollment, jadwal, laporan belajar, dan pembayaran manual.
- Membaca materi teks secara mandiri melalui katalog konten publik/gratis/berbayar, tanpa membangun LMS enterprise atau platform video.

Pertahankan kecepatan funnel dan layanan les yang berjalan. Pengembangan konten mandiri tidak boleh merusak lead WhatsApp atau menghilangkan materi roadmap yang saat ini dibaca wali.

## 3. Titik awal dan model pengguna

### Implementasi yang menjadi titik awal

| Area | Bentuk sistem |
|---|---|
| Marketing | `/landing` dan funnel `/course/*` dengan katalog statis; kalkulasi harga hanya di `CourseConfigClient`. |
| Portal | `/app/*` untuk wali, `/app/tentor/*` untuk tentor, `/app/admin/*` untuk admin. |
| Backend | Express TypeScript, Prisma ORM, PostgreSQL Supabase; kontrak input dari shared Zod schemas. |
| Identitas | Supabase Auth, login email/nomor WhatsApp; backend NC-1.4 lokal memakai verified ID serta role/active DB tanpa fallback email/metadata/wali. Middleware frontend/login masih metadata; bukan bukti deployment atau role UI sudah diperbaiki. |
| Pembelajaran | `Program → RoadmapStep → MaterialItem`; sesi dan laporan terkait murid. |
| Pembayaran | Invoice dan prabayar manual; terdapat batas integrasi payload UI/API yang dijelaskan di flow/overview, bukan dianggap E2E selesai. |
| Konten mandiri baru | `Course`, `Section`, `Lesson`, `Entitlement`, `LessonProgress`, dan role `member` belum menjadi model runtime. |

Referensi versi dependency, route terperinci, dan deployment ada di overview. Pemeriksaan keberhasilan fitur dan status fase tidak diduplikasi di sini.

### Pengguna sekarang dan sasaran perluasan

| Pengguna | Tanggung jawab sekarang / sasaran |
|---|---|
| Admin | Mengelola akun, murid, program, enrollment, jadwal, materi dan tagihan; sasaran berikutnya dapat mengelola seluruh course. |
| Tentor | Mengelola sesi dan laporan; sasaran authoring hanya course miliknya, bukan marketplace penulis terbuka. |
| Wali | Memantau anak dan mengirim bukti pembayaran; dalam rancangan NC dapat memperoleh akses course tanpa mengganti role wali. |
| Murid | Subjek layanan les/laporan, bukan akun login mandiri. |
| Member (rencana) | Akun pembaca mandiri dengan email terverifikasi; tidak diwajibkan memiliki Murid atau nomor telepon. |
| Publik | Pengunjung funnel dan, kelak, pembaca lesson yang memang dipublikasikan untuk akses publik. |

Schema memungkinkan satu wali mempunyai beberapa murid, tetapi handler create murid membatasi wali yang sudah memiliki murid apa pun. Selector multi-anak bukan bukti onboarding multi-anak tersedia. Roadmap tidak mengubah aturan ini; perubahan memerlukan task produk tersendiri.

## 4. Keputusan arah yang sudah dicatat

Sumber keputusan kanonik: [D1–D16 di PROGRESS](./PROGRESS.md#keputusan-ncourse). Ringkasan di bawah menjelaskan implikasi produk, bukan salinan riwayat atau status implementasi.

- **Opsi A — dual surface:** pertahankan funnel WhatsApp, portal operasional, dan permukaan konten publik yang berbeda.
- **Role berbeda dari akses konten:** role mengatur wewenang portal/operasi; entitlement mengatur hak membaca course/lesson. Otorisasi role DB (D5) sudah diterapkan lokal pada backend NC-1.4; frontend masih metadata, entitlement tetap target terpisah.
- **Akses konten melekat pada User:** `Murid` tetap untuk layanan bertentor; progress membaca mandiri berbeda dari progress belajar anak.
- **Program dan Course terpisah:** Program tetap produk layanan les dengan sesi/tagihan per blok; Course unit konten yang dapat dijual sekali, dengan `programId` opsional sebagai jembatan.
- **Hierarki Course → Section → Lesson:** migrasikan konten roadmap existing secara terencana. D16 memperjelas D11: bukan mengganti seluruh entitas Program dan relasi operasional dengan Course.
- **Backend menentukan konten yang boleh terkirim:** paywall di UI saja tidak cukup. Endpoint publik existing yang mengirim body roadmap perlu ditutup melalui task akses konten.
- **Penulis terbatas:** admin dan tentor yang didaftarkan admin; tentor hanya course dengan ownership sesuai.
- **Teks/Markdown terlebih dahulu:** bukan block editor atau video. Diskusi tetap WhatsApp; tanpa Q&A dan review teks.
- **Pembayaran manual/one-time:** pilihan payment gateway belum diputuskan. Tidak ada subscription di iterasi awal.
- **Skala awal kecil:** kurang dari 10 course, kurang dari 100 artikel, puluhan pembaca; belum memerlukan analytics besar atau mesin pencarian terpisah.
- **Tanpa infra baru:** verifikasi email melalui Supabase; cron, mail server sendiri, storage tambahan, dan search engine bukan scope otomatis.
- **Brand nCourse adalah rename display:** jangan mengubah domain email placeholder, package identifier, atau folder tanpa migrasi terpisah.

`MaterialItem.sessionId` masih berada dalam schema dan dipakai seed; rencana menghapusnya bukan perubahan yang sudah dilakukan.

## 5. Opsi integrasi funnel dan LMS

### Opsi A — arah yang dipilih

| Permukaan | Peran |
|---|---|
| `/landing` | Marketing dan entry navigasi; kelak menghubungkan ke katalog konten. |
| `/course/*` | Funnel layanan les, tetap berakhir pada pesan WhatsApp. |
| `/app/*` | Portal operasional wali/tentor/admin, bukan diganti oleh katalog publik. |
| `/kelas`, `/kelas/[slug]` (rencana) | Katalog course, silabus, informasi akses dan CTA. |
| `/materi/[slug]` (rencana) | URL lesson kanonik, bukan alias `/course/materi/[id]`. |

Pemisahan permukaan tidak berarti harus menambah subdomain, aplikasi, atau server baru. Kontrak data dan navigasi tetap harus konsisten dengan keputusan akses backend.

### Opsi B — alternatif historis, bukan pilihan aktif

Funnel sebagai onboarding/checkout langsung pernah dipertimbangkan. Opsi itu tidak boleh diterapkan diam-diam karena mengubah lead flow yang berjalan. Mengganti Opsi A membutuhkan keputusan produk baru di progress serta task/migration yang jelas; opsi B bukan fase yang wajib dieksekusi kemudian.

## 6. Batas produk iterasi nCourse

### Masuk arah pengembangan

- Katalog Course/Section/Lesson dengan slug, metadata, status draft/published, ownership, dan estimasi baca.
- Rendering Markdown yang mendukung link dengan sanitasi; validasi link internal saat authoring.
- Halaman konten server-rendered dengan metadata dan aturan akses pada backend.
- Akun member email/password dengan verifikasi email, tanpa mengasumsikan mempunyai anak.
- Entitlement gratis, pembelian lifetime, atau enrollment bertentor; reading progress per User/Lesson.
- Search/filter sederhana dan related content/prev-next.
- Rating bintang 1–5 oleh pemilik entitlement aktif; jumlah peserta dihitung live dan disembunyikan jika kurang dari lima.
- Checkout manual satu kali dan rename display nCourse setelah fondasi siap.

### Di luar iterasi awal

- Video streaming/live class, SCORM/xAPI, kuis/ujian kompleks, dan assignment enterprise.
- Forum, chat aplikasi, Q&A, review teks, gamifikasi besar, serta moderasi konten pengguna umum.
- Subscription, gateway dipilih tanpa data kebutuhan, analytics besar, atau event pipeline baru.
- Bookmark/highlight/inline notes yang membutuhkan anchor stabil di block editor.
- Reminder otomatis, sertifikat/download privat, gift course sebelum prasyarat infrastrukturnya disetujui.
- Multi-tenant/cabang, SSO perusahaan, Docker wajib, atau migrasi database/framework sebagai efek samping.

Pemicu untuk mengevaluasi fitur ditunda ada di [rancangan fitur ditunda](../tasks/plan.md#nc-deferred-design), bukan janji delivery.

## 7. Fase pengembangan NC

Tabel ini menyatakan urutan dan hasil yang dituju. Checkbox, tanggal, status selesai/blocked, serta bukti eksekusi hanya di todo/progress.

| Tahap | Fokus | Hasil yang dituju / prasyarat |
|---|---|---|
| NC-1 | Fondasi | Migration history yang bisa direplay, client backend terpisah, test harness, role DB, hardening, disiplin generated artifact dan evaluasi relasi materi-sesi. |
| NC-2 | Course / Section / Lesson | Schema dan migrasi konten tanpa kehilangan `RoadmapStep.bodyText`; authoring admin/tentor, Markdown, draft/publish dan ownership. Program operasional tetap hidup. |
| NC-3 | Permukaan publik | `/kelas` dan `/materi/[slug]`, metadata/server rendering, link dari landing, search/filter/related content dan pembatasan respons konten. |
| NC-4 | Member / Entitlement | Signup verifikasi email, role member dan phone nullable, tujuan login member, entitlement serta jembatan enrollment, reading progress terpisah. |
| NC-4.5 | Rating | Bintang dengan entitlement aktif dan jumlah peserta yang tidak memerlukan counter terpisah. |
| NC-5 | Monetisasi | Pembayaran manual satu kali menjadi entitlement purchase; gateway menunggu keputusan. |
| NC-6 | Rename display | Brand nCourse di UI/metadata tanpa migrasi identitas akun atau package. |

**Gate lintas tahap:** aturan draft/published dan akses harus dirancang sebelum body konten nonpublik diekspos. Tahap publik tidak boleh meluncurkan seluruh body sambil menunggu entitlement di tahap berikutnya. Mekanisme issuance/expiry/revocation dan rollout dipastikan pada rencana akses; jangan mengarang kebijakan akhir blok dari field yang belum ada.

Nomor tahap NC berbeda dari fase 0–5 pada roadmap awal. Tidak menyatakan semua pekerjaan fase lama selesai hanya karena portal sudah tersedia; gunakan ID task untuk melacak hasilnya.

### Fase awal 0–5 sebagai konteks historis

| Fase awal | Fokus desain |
|---|---|
| 0 | Spec, model data, dan pilihan stack. |
| 1 | Fondasi identitas, API/database, shell portal, seed. |
| 2 | Katalog operasional, murid/tentor/wali, enrollment, roadmap dan materi. |
| 3 | Jadwal dan laporan sesi/perkembangan. |
| 4 | Tagihan serta verifikasi pembayaran manual. |
| 5 | Integrasi funnel sesuai keputusan produk. |

Tabel historis bukan checklist baru. Tidak mewajibkan trigger sinkronisasi auth/DB hanya karena pernah tertulis sebagai kandidat fase awal.

## 8. Model konten dan akses yang direncanakan

[ERD](./erd-lms.md) mendokumentasikan schema sekarang. Diagram konseptual berikut belum menjadi schema database:

```text
Program (layanan les) ← optional programId — Course (unit konten/jual)
                                            └─ Section
                                               └─ Lesson (slug global)
User ─ Entitlement ─ Course
User ─ LessonProgress ─ Lesson
User ─ Rating ─ Course
Enrollment ─ jembatan akses bertentor ─ Entitlement
```

- Konten dari `RoadmapStep.bodyText` harus ikut dimigrasikan, bukan hanya `MaterialItem`.
- `LessonProgress` memakai User; `Progress` existing memakai Murid/RoadmapStep. Jangan menukar subjek saat migrasi.
- Publik, gratis setelah login, pembelian lifetime, dan enrollment adalah mekanisme akses berbeda; rumus entitlement dan empat tier ada di [plan akses](../tasks/plan.md#nc-access-design).
- Draft/published dan kepemilikan author adalah guard tambahan; `visibility: public` saja bukan izin menampilkan draft.
- Detail migrasi, foreign key, expiry enrollment dan routing member masih melalui plan/approval. Akun nonaktif sudah ditolak `403 ACCOUNT_INACTIVE` oleh backend NC-1.4 lokal; kontrak auth/profil ada di [flow](./flow-system.md#4-login-identitas-dan-otorisasi-aktual), bukan keputusan baru dari diagram konseptual.

## 9. Stack dan referensi inspirasi

Stack aplikasi yang sudah dipakai: Next.js/React/Tailwind, Express/TypeScript, Prisma/PostgreSQL Supabase, Supabase Auth, dan shared Zod. Tidak ada pemilihan database/auth provider baru pada roadmap ini. Target renderer Markdown adalah `react-markdown` + `remark-gfm` + `rehype-sanitize`; jangan mengklaim paket/renderer itu sudah diimplementasikan hanya karena tercantum di rencana.

[LearnHouse](https://github.com/learnhouse/learnhouse) / [dokumentasinya](https://docs.learnhouse.app) merupakan inspirasi historis, bukan keputusan memakai/fork produknya. Lisensi AGPL-3.0 dan stack Next/FastAPI/Postgres/Redis milik referensi tidak berpindah menjadi stack repo ini.

| Inspirasi | Penyesuaian untuk Nurman Course |
|---|---|
| Courses/detail/syllabus | Katalog teks dan hierarki tiga level dengan akses backend. |
| Groups/collections | Dievaluasi hanya jika kebutuhan pengelompokan nyata muncul. |
| Rich editor | Markdown dahulu; block editor menunggu kebutuhan penulis. |
| Session/calendar | Pertemuan les nyata, bukan video/live platform. |
| Payments | Transfer/manual approval dahulu. |
| Certificates/reminders/analytics | Ditunda sampai prasyarat dan volume penggunaan relevan. |

## 10. Aturan penggunaan roadmap

- Mulai dari Markdown root, lalu pilih task di todo dan baca plan terkait. Roadmap bukan izin implementasi seluruh fase.
- Jangan mencampur perubahan dependency, lint, auth, schema, dan UI dalam satu scope tanpa approval eksplisit.
- Fokus kerja berikutnya backend; instruksi terakhir menghentikan Playwright dan pekerjaan frontend lanjutan tetap berlaku sampai user mengubahnya.
- NC-1.4 **belum selesai seluruhnya**: implementasi backend lokal tersedia, tetapi merge/rollout **BLOCKED** sampai admin memastikan kegunaan lima Auth tanpa profil dan menyetujui dampak/rekonsiliasi. Penghapusan fallback email bukan rekonsiliasi data legacy. Audit staging/development, keputusan dan verifikasi terpusat di [PROGRESS](./PROGRESS.md#backend-part2-20260916); frontend/browser/login/session test, mutasi remote, commit/push/deploy tidak termasuk izin scope ini.
- Pertahankan funnel/pricing; jangan mengganti Program dengan Course atau memigrasikan domain email secara terselubung.
- Catat hasil dan keputusan di progress, status singkat di todo, serta langkah/kriteria yang belum dikerjakan di plan. Jangan menyimpan log verifikasi pada roadmap ini.
