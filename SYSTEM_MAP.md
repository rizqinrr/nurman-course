# 🧭 Project Overview

- Aplikasi frontend untuk alur pendaftaran les Nurman Course.
- Tech stack: Next.js App Router (Next.js 14+), React, Tailwind CSS.
- Gaya UI: glassmorphism ringan, mobile-first, flow cepat ke WhatsApp.
- Database: PostgreSQL (Supabase) + Prisma ORM.
- Authentication: Supabase Auth dengan custom login & endpoint lookup phone.
- Arah LMS: `docs/ROADMAP-LMS.md` · progress: `docs/PROGRESS.md` · tasks: `tasks/todo.md` · agent: `AGENTS.md`.

---

# 🔀 Routing Flow

## Funnel Landing & Pendaftaran
/course  
→ Landing hero. CTA ke /course/program.

/course/program  
→ Pilih jenis program (materi, jenjang, calistung).

/course/materi  
→ List materi kategori materi dari data statis.

/course/jenjang  
→ List jenjang pendidikan (SD 1-3, SD 4-6, SMP) dari data statis.

/course/calistung  
→ List program calistung dari data statis.

/course/materi/[id]  
→ Detail materi, pilih level, lanjut ke config.

/course/config  
→ Konfigurasi durasi/frekuensi/peserta/hari/jam, hitung estimasi, kirim ke WhatsApp.

/course/config → WhatsApp  
→ Data pilihan di-encode ke URL wa.me menggunakan nomor dari constants.

## Portal & Dashboard Aplikasi (LMS UI)
/login  
→ Halaman login multi-metode (email atau nomor WhatsApp + password).

/app  
→ Main landing page portal (mengalihkan user sesuai dengan role).

### Area Wali Murid `/app/(wali)`
/app/dashboard  
→ Ringkasan program aktif murid, grafik progress mingguan, dan laporan terbaru.
/app/program  
→ List program/kelas aktif yang diikuti oleh murid.
/app/program/[slug]  
→ Detail pelajaran, modul belajar, daftar materi, dan riwayat presensi per program.
/app/laporan  
→ Tab laporan harian (progress lesson, performa, catatan tentor) & laporan perkembangan (tiap beberapa sesi).
/app/jadwal  
→ Jadwal les anak mingguan lengkap dengan detail tentor dan ruang/jam.
/app/tagihan  
→ Daftar invoice pembayaran bulanan beserta status, nomor rekening tujuan, dan bukti bayar.

### Area Tentor `/app/tentor`
/app/tentor/dashboard  
→ Overview tugas mengajar, list murid aktif, review cepat modul, and menu input.
/app/tentor/jadwal  
→ Agenda dan jadwal mengajar mingguan tentor.
/app/tentor/laporan-harian  
→ Form input jurnal mengajar harian murid (materi, absen, nilai, dan komentar).
/app/tentor/laporan-perkembangan  
→ Form input/evaluasi laporan perkembangan berkala.

### Area Admin `/app/admin`
/app/admin/dashboard / /app/admin/  
→ Overview statistik operasional bimbel, total murid, tentor, tagihan unpaid.
/app/admin/murid  
→ Manajemen data murid, alamat, foto, verifikasi ortu/wali, link wali akun.
/app/admin/tentor  
→ Manajemen data tentor/pengajar aktif.
/app/admin/program  
→ Manajemen master program belajar bimbel.
/app/admin/enrollment  
→ Pendaftaran murid ke program belajar tertentu beserta assign tentor.
/app/admin/tagihan  
→ Pembuatan invoice bulanan, tracking pembayaran, dan approval konfirmasi bayar.
/app/admin/rekening  
→ Setup bank account tujuan pembayaran.

---

# 📁 Folder Structure (Monorepo)

- `frontend/` → Aplikasi frontend Next.js App Router (funnel & LMS UI)
  - `app/` → Route layout dan page, terbagi atas `/course` (funnel), `/app` (portal), `/login`
  - `components/`
    - `ui/` → UI atom bergaya glassmorphism (Button, Chip, GlassCard, dll.)
    - `course/` → Section landing page funnel
  - `data/` → Data statis (materials.ts, landing.ts)
  - `lib/` → Global utils dan constants (constants.ts)
  - `utils/` → Text/currency helpers
- `backend/` → API Server Express
  - `src/` → Entrypoint index.ts, middleware (auth.ts), dan routes
  - `prisma/` → Skema database, migrasi SQL, dan seed script database
- `packages/shared/` → Shared libraries antara frontend & backend
  - `src/` → Zod schemas (laporan harian/perkembangan), TypeScript types
- `docs/` → Spesifikasi, ERD, dan arah roadmap LMS (bukan runtime)
- `tasks/` → Checklist eksekusi tugas sesi (`todo.md` & `plan.md`)
- `desain-ui-frontend/` → Kumpulan rancangan prompt Google Stitch untuk desain UI (19 file)

---

# 🧩 Key Files Map

## Core & Shared
frontend/data/materials.ts
- Role: Sumber data materi/jenjang/calistung + helper getMaterialById/getMaterialsByCategory.

frontend/lib/constants.ts
- Role: Konstanta global, termasuk WHATSAPP_NUMBER.

packages/shared/src/index.ts
- Role: Defini tipe bersama & schema validasi data input.

backend/prisma/schema.prisma
- Role: Skema database relasional PostgreSQL (User, Wali, Murid, Tentor, Program, Enrollment, Laporan, Tagihan).

backend/src/index.ts
- Role: Main API backend server, routing authorization `/api/auth/resolve-phone`, `/api/health`, dll.

backend/src/middleware/auth.ts
- Role: Middleware auth JWT token verifier (`requireAuth`) menggunakan library Supabase Auth.

## Flow Funnel Pendaftaran
frontend/app/course/page.tsx
- Role: Hero landing khusus flow course.
- Navigates to: /course/program.

frontend/app/course/program/page.tsx
- Role: Pilihan program utama.
- Routes to: /course/materi, /course/jenjang, /course/calistung.

frontend/app/course/materi/page.tsx
- Role: List materi kategori materi.
- Uses: getMaterialsByCategory("materi"), formatPrice.
- Routes to: /course/materi/[id].

frontend/app/course/jenjang/page.tsx
- Role: List jenjang pendidikan.
- Uses: getMaterialsByCategory("jenjang"), formatPrice.
- Routes to: /course/config?materi={id}&level=1.

frontend/app/course/calistung/page.tsx
- Role: List program calistung.
- Uses: getMaterialsByCategory("calistung"), formatPrice.
- Routes to: /course/config?program=calistung&materi={id}&level=1.

frontend/app/course/materi/[id]/page.tsx
- Role: Detail materi + pemilihan level.
- Uses: getMaterialById(id), formatPrice.
- Routes to: /course/config?materi={id}&level={selectedLevel}.

frontend/app/course/config/page.tsx
- Role: Wrapper Suspense untuk config.
- Renders: CourseConfigClient.

frontend/app/course/config/CourseConfigClient.tsx
- Role: Konfigurasi akhir + pricing + CTA WhatsApp.
- Uses: getMaterialById, Chip/Button/GlassCard, WHATSAPP_NUMBER.
- Sends data to: URL WhatsApp (wa.me).

## Portal & Auth
frontend/app/login/page.tsx
- Role: Login page bypass/resolve nomor WhatsApp ke email terdaftar Supabase.

frontend/app/app/(wali)/dashboard/page.tsx
- Role: Dashboard index wali murid (ringkasan murid, menu cepat).

frontend/app/app/tentor/laporan-harian/LaporanHarianClient.tsx
- Role: Client interface pengisian laporan jurnal harian oleh tentor.

---

# 🔗 Data Flow

materials.ts  
→ dipakai di halaman list/detail (materi, jenjang, calistung)  
→ user memilih item + level  
→ parameter dikirim via URL query ke /course/config  
→ config hitung estimasi harga dinamis  
→ ringkasan dikirim ke WhatsApp.

---

# ⚠️ Important Rules

- Jangan hardcode daftar materi di page, selalu ambil dari data/materials.ts.
- Logika pricing utama tetap terpusat di app/course/config/CourseConfigClient.tsx.
- Routing flow harus konsisten: /course → /program → pilihan program → /config.
- Nomor WhatsApp gunakan lib/constants.ts, jangan duplikasi angka di file lain.

---

# 🧠 Notes for Future Development

- Tambah/ubah materi: edit data/materials.ts.
- Ubah perhitungan harga: edit app/course/config/CourseConfigClient.tsx.
- Arah LMS / progress: docs/ROADMAP-LMS.md, docs/PROGRESS.md, tasks/todo.md.
- Ubah tampilan tombol/chip/card global: edit components/ui/.
- Jika menambah program baru, update:
  - app/course/program/page.tsx (entry pilihan)
  - data/materials.ts (data kategori)
  - page turunan program sesuai kebutuhan.
