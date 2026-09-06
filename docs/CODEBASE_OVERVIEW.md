# 📊 Codebase Overview & System Audit — Nurman Course

Dokumen ini berisi analisis lengkap dan mendalam mengenai arsitektur, tech stack, fitur yang telah diimplementasikan, struktur proyek, pemetaan rute, fitur parsial, serta fitur yang belum tersedia pada sistem **Nurman Course**.

---

## 1. Tech Stack

Nurman Course dikembangkan dengan arsitektur **Monorepo** berbasis **npm workspaces** dan **Turborepo** (`turbo.json`) yang terdiri dari 3 paket utama:

### Frontend (`frontend/`)
- **Framework:** Next.js `16.2.4` (App Router, Turbopack)
- **Library UI:** React `19.2.4`, Tailwind CSS `v4.x` (menggunakan `@tailwindcss/postcss`), Lucide React `^1.11.0`, Framer Motion `^12.43.0`
- **Design System & Typography:**
  - AppVerse.id Design System: Warm off-white canvas (`#f7f4ef`), border tan (`#c8b99a`), primary deep blue (`#4a70a9`), solid warm cards (`#edeae3` / `#fdfcfa`)
  - Typography: Heading menggunakan `Playfair Display` dan body menggunakan `DM Sans` via `next/font/google` di `frontend/app/layout.tsx`
- **Auth & Client API:** `@supabase/ssr` (`^0.12.4`), `@supabase/supabase-js` (`^2.45.0`), kustom `apiFetch` client dengan in-memory cache (TTL 1 jam) dan selective cache invalidation (`frontend/lib/api.ts`)
- **Developer Experience (DX):** NC Debugger Widget (`frontend/components/ui/DebugBar.tsx`, dev-only) untuk inspect request timing, cache hit/miss, dan response code secara real-time.

### Backend (`backend/`)
- **Server:** Express `^4.19.2` (TypeScript `^5.3.3` + `ts-node`)
- **ORM & Database:** Prisma ORM `^5.18.0` / `5.22.0` terhubung ke PostgreSQL Supabase (Connection Pooling + Direct URL)
- **Auth & Security:** Supabase Auth (JWT Bearer token verification via `@supabase/supabase-js` di `backend/src/middleware/auth.ts`)
- **Logging:** Morgan (`^1.10.0`) + Prisma SQL Query timing logger (cyan console output)

### Shared Package (`packages/shared/`)
- **Validation & Types:** Single source of truth untuk tipe TypeScript dan Zod schemas `^3.23.8` (validasi sesi, user, murid, invoice, prepayment, daily report, progress report, serta helper `normalizePhone`).

### Deployment Infra
- **Server:** VPS Ubuntu (`43.156.207.5`)
- **CI/CD:** GitHub Actions (`.github/workflows/deploy.yml`) melakukan build dan `rsync` ke `/home/ubuntu/MyProject/nurman-course/` lalu mengeksekusi script deployment `/opt/nurman-deploy/deploy.sh` (PM2 + Nginx).

---

## 2. Features Already Implemented (Fitur Berjalan)

### A. Marketing & Conversion Funnel (WhatsApp Flow)
- **Landing Page Modern (`/landing`):** Navigasi, hero, statistik, benefit, kurikulum kategori, testimoni, dan Infinite Tutor Carousel (`LandingTutors.tsx`).
- **Funnel Pendaftaran (`/course` → `/course/program` → `/course/materi` → `/course/config`):**
  - Pemilihan program, materi, dan level.
  - Konfigurasi durasi (60/90 menit), frekuensi (1-4x seminggu), peserta (1-3 siswa dengan diskon otomatis), hari, dan jam les.
  - Perhitungan estimasi harga otomatis dan generate pesan WhatsApp terstruktur (`CourseConfigClient.tsx`).

### B. Autentikasi Multi-Metode
- Login di `/login` mendukung **Email** atau **Nomor WhatsApp** + Password (auto-resolve nomor via `/api/auth/resolve-phone` dengan placeholder domain `@nurmancourse.local`).
- Proteksi route berbasis peran (Role-Based Access Control) di `frontend/middleware.ts` untuk 3 peran: Admin, Tentor, dan Wali Murid.

### C. Portal Wali Murid (`/app/...`)
- **Dashboard Multi-Anak (`/app/dashboard`):** Selector anak (tab pill jika >1 murid), kartu program aktif, sesi terdekat, alert tagihan H-1, rekap rapor capaian terakhir.
- **Katalog & Detail Program (`/app/program` & `/app/program/[slug]`):** Filter kategori, outline silabus, modal materi Markdown, CTA WhatsApp. Jika anak sudah terdaftar, otomatis beralih ke *Interactive Learning Roadmap*.
- **Jadwal Belajar (`/app/jadwal`):** Kalender sesi mendatang vs riwayat belajar dengan badge status-aware.
- **Laporan Belajar (`/app/laporan`):** Tab Laporan Harian dan Laporan Perkembangan (rapor blok), tombol konsultasi langsung via WhatsApp tentor bersangkutan.
- **Tagihan & Pembayaran Mandiri (`/app/tagihan`):**
  - Tampil invoice unpaid.
  - Form upload bukti transfer (canvas compressor JPEG atau file PDF).
  - Form deposit pembayaran prabayar.
  - Pilihan rekening pembayaran dinamis dari database.
- **Profil & Ganti Sandi (`/app/profile`):** Data akun wali dan anak, serta form ubah kata sandi mandiri via Supabase Auth.

### D. Portal Tentor (`/app/tentor/...`)
- **Dashboard Tentor (`/app/tentor/dashboard`):** Agenda mengajar hari ini, status laporan pending otomatis berdasarkan jam selesai sesi, deteksi anak siap cetak rapor blok.
- **Jadwal Sesi (`/app/tentor/jadwal`):** CRUD jadwal sesi les, auto-fill jam selesai (+1 jam default), validasi bentrok jadwal tentor & murid, pembatalan/penghapusan sesi via modal `ConfirmDialog`.
- **Laporan Harian (`/app/tentor/laporan-harian`):** Tabel laporan sesi, input/edit laporan kegiatan belajar, modal detail, print A4 hasil belajar (`window.print`).
- **Laporan Perkembangan (`/app/tentor/laporan-perkembangan`):** Form evaluasi capaian per blok sesi (N sesi).
- **Profil (`/app/tentor/profil`):** Update password akun tentor.

### E. Portal Admin (`/app/admin/...`)
- **Dashboard Statistik (`/app/admin`):** Metrik program aktif, murid aktif, tentor aktif, tagihan waiting, dan sesi hari ini.
- **Manajemen Murid & Wali (`/app/admin/murid`):** CRUD murid, auto-create akun wali (default password `12345678`), upload foto base64, reset password akun wali, soft/hard delete cascade.
- **Manajemen Tentor (`/app/admin/tentor`):** CRUD tentor, reset password, deaktivasi, atau hard delete akun Supabase Auth.
- **Manajemen Program (`/app/admin/program`):** CRUD program kursus, harga dasar, kategori, dan batas sesi per blok.
- **Manajemen Roadmap & Materi (`/app/admin/roadmap`):** Manajemen langkah belajar bertingkat per program, editor teks/materi markdown, reorder langkah.
- **Manajemen Enrollment (`/app/admin/enrollment`):** Pendaftaran murid ke program dan penugasan tentor, tolak duplikasi enrollment aktif (`409 Conflict`), hapus enrollment cascade invoice.
- **Manajemen Jadwal (`/app/admin/jadwal`):** CRUD sesi master seluruh tentor & murid dengan validasi bentrok waktu ganda.
- **Manajemen Tagihan (`/app/admin/tagihan`):** Penerbitan invoice manual, verifikasi bukti transfer wali (modal preview gambar fullscreen / PDF blob), state machine perubahan status (Lunas / Verifikasi / Dibatalkan).
- **Master Rekening Bank (`/app/admin/rekening`):** CRUD rekening tujuan pembayaran (BSI, Mandiri, dll.), set rekening default.

---

## 3. Project Structure

```text
nurman-course/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # 13 Model (User, Murid, Program, Session, Invoice, dll.)
│   │   └── seed.ts             # Script seed data awal 3-role (Admin, Tentor, Wali)
│   ├── src/
│   │   ├── index.ts            # Entrypoint server Express & seluruh controller route API
│   │   └── middleware/auth.ts  # Middleware Express JWT Supabase (requireAuth, requireAdmin)
│   └── package.json
├── frontend/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/login/       # Halaman login multi-role
│   │   ├── app/                # Root portal LMS
│   │   │   ├── (wali)/         # Route group khusus portal Wali Murid
│   │   │   ├── tentor/         # Sub-portal Tentor
│   │   │   └── admin/          # Sub-portal Admin
│   │   ├── course/             # Funnel pendaftaran WhatsApp
│   │   └── landing/            # Landing page publik (AppVerse style)
│   ├── components/
│   │   ├── ui/                 # Reusable UI (Button, GlassCard, ConfirmDialog, ProofModal, DebugBar)
│   │   ├── course/             # Section landing funnel
│   │   └── landing/            # Section landing AppVerse (Nav, Hero, Stats, Tutors, dll.)
│   ├── data/                   # landing.ts, materials.ts, lms.ts
│   ├── lib/                    # api.ts (apiFetch + in-memory cache), constants.ts, format.ts
│   ├── middleware.ts           # Route guard edge Next.js (redirect role-based)
│   └── package.json
├── packages/
│   └── shared/                 # @nurman-course/shared (Zod schemas, types, phone helper)
├── docs/                       # Dokumentasi spesifikasi, ERD, roadmap LMS, & audit
└── tasks/                      # todo.md & plan.md (eksekusi roadmap)
```

---

## 4. Pages / Routes Map

Berdasarkan output build generator Next.js (`35 routes`):

### Publik / Marketing & Funnel
| Route | Tipe | Deskripsi |
|---|---|---|
| `/` | Statik | Redirect ke `/course` |
| `/landing` | Statik | Halaman landing marketing utama (AppVerse theme) |
| `/course` | Statik | Hero funnel lama |
| `/course/program` | Statik | Pemilihan jenis program (Materi / Jenjang / Calistung) |
| `/course/materi` | Statik | List materi reguler |
| `/course/materi/[id]` | Dinamik | Detail materi + pemilihan level |
| `/course/jenjang` | Statik | List jenjang pendidikan |
| `/course/calistung` | Statik | List program calistung |
| `/course/config` | Statik | Konfigurasi durasi/jam/peserta + kalkulasi harga + link WhatsApp |

### Autentikasi & Portal Gatekeeper
| Route | Tipe | Deskripsi |
|---|---|---|
| `/login` | Statik | Halaman login (Email / No. WA + Password) |
| `/app` | Statik | Root gatekeeper portal (auto-redirect oleh middleware sesuai role) |

### Portal Wali Murid (`(wali)`)
| Route | Tipe | Deskripsi |
|---|---|---|
| `/app/dashboard` | Statik | Dashboard rekap murid aktif |
| `/app/program` | Statik | Katalog program les & status terdaftar |
| `/app/program/[slug]` | Dinamik | Detail silabus & roadmap belajar interaktif |
| `/app/materi` | Statik | Katalog materi belajar |
| `/app/jadwal` | Statik | Kalender & riwayat sesi belajar anak |
| `/app/laporan` | Statik | Tab Laporan Harian & Rapor Perkembangan |
| `/app/tagihan` | Statik | Tagihan invoice, upload bukti transfer, form prabayar |
| `/app/profile` | Statik | Profil wali & form ganti password |

### Portal Tentor (`/app/tentor`)
| Route | Tipe | Deskripsi |
|---|---|---|
| `/app/tentor/dashboard` | Statik | Dashboard sesi hari ini & evaluasi rapor siap terbit |
| `/app/tentor/jadwal` | Statik | Manajemen jadwal sesi mengajar tentor |
| `/app/tentor/laporan-harian` | Statik | Tabel laporan sesi, input laporan, print format A4 |
| `/app/tentor/laporan-perkembangan` | Statik | Input evaluasi capaian belajar per blok |
| `/app/tentor/profil` | Statik | Profil tentor & form ganti password |

### Portal Admin (`/app/admin`)
| Route | Tipe | Deskripsi |
|---|---|---|
| `/app/admin` | Statik | Statistik dashboard operasional |
| `/app/admin/murid` | Statik | Manajemen murid & akun wali |
| `/app/admin/tentor` | Statik | Manajemen akun tentor |
| `/app/admin/program` | Statik | Master katalog program les |
| `/app/admin/roadmap` | Statik | Manajemen alur belajar & materi teks per program |
| `/app/admin/enrollment` | Statik | Pendaftaran murid ke program & assign tentor |
| `/app/admin/jadwal` | Statik | Jadwal sesi master seluruh tentor & murid |
| `/app/admin/tagihan` | Statik | Master invoice, verifikasi bukti bayar, prabayar |
| `/app/admin/tagihan/[invoiceId]` | Dinamik | Fullscreen viewer bukti pembayaran |
| `/app/admin/rekening` | Statik | Master rekening bank tujuan pembayaran |

---

## 5. In-Progress or Partial Features (Fitur Setengah Jadi / Tertunda)

1. **Upload Foto Murid (Task `M4`):**
   - *Status:* On-hold / parsial.
   - *Kondisi:* Foto murid disimpan sebagai data Base64 terkompresi di kolom `Murid.photoPath`. Migrasi ke Supabase Storage ditunda karena alasan privasi (menolak bucket publik, butuh arsitektur private bucket + signed URL token).
2. **Kategori Halaman `/course/program` (Task `P4`):**
   - Halaman `/course/program/page.tsx` masih menghardcode 3 kategori (Materi, Jenjang, Calistung), belum membaca helper dinamis `getCategories()` dari `frontend/data/materials.ts`.
3. **Format Label WhatsApp Calistung (Task `P3`):**
   - Format pesan WhatsApp di `CourseConfigClient.tsx` untuk program Calistung perlu diselaraskan agar menggunakan label "Program" bukan "Materi".
4. **Next.js 16 Deprecation Warning (`middleware` → `proxy`):**
   - Konvensi file `frontend/middleware.ts` memunculkan warning deprecation karena Next.js 16 menyarankan migrasi ke `proxy.ts`.
5. **Keselarasan Desain Funnel `/course/*`:**
   - Halaman `/landing` dan seluruh portal `/app/*` sudah mengadopsi AppVerse Design System (warm off-white, font serif/sans modern, solid buttons), tetapi funnel pendaftaran `/course/*` masih memakai styling glassmorphism lama dengan gradient biru.

---

## 6. What's Missing (Kekurangan Dibandingkan LMS Modern)

Berdasarkan batasan MVP pada `docs/ROADMAP-LMS.md` dan standar platform LMS umum:

1. **Portal Login Murid Mandiri:**
   - Murid (anak) tidak memiliki akun login sendiri. Seluruh aktivitas belajar dan pemantauan dilakukan melalui akun Wali Murid.
2. **Kuis, Ujian, & Tugas Online (Quizzes & Assignments):**
   - Belum ada modul evaluasi mandiri interaktif; evaluasi hasil belajar saat ini 100% kualitatif melalui Laporan Harian dan Laporan Perkembangan tentor.
3. **Materi Multimedia / Video Streaming:**
   - Konten materi pelajaran (`MaterialItem`) masih murni berbasis teks/Markdown sederhana; belum terintegrasi video player, audio embedding, atau PDF viewer in-app.
4. **Automated Payment Gateway:**
   - Pembayaran invoice masih manual (transfer bank lalu upload foto bukti transfer untuk diverifikasi manual oleh admin), belum terhubung ke Midtrans, Xendit, atau QRIS instan.
5. **Notifikasi Otomatis (WhatsApp Webhook / In-App Push):**
   - Pemberitahuan jadwal atau tagihan masih mengandalkan klik tombol WhatsApp manual (`wa.me`), belum ada integrasi webhook WhatsApp Gateway otomatis (Fonnte/Waba) atau email notification.
6. **Penerbitan Sertifikat Digital:**
   - Belum ada generator sertifikat digital otomatis (PDF certificate) saat murid menyelesaikan sebuah blok program.
