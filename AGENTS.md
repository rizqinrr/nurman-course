# 🧭 Project Overview

- Aplikasi frontend untuk alur pendaftaran les **Nurman Course** (funnel live).
- Tujuan saat ini: user pilih program → konfigurasi → WhatsApp dengan cepat.
- Arah masa depan: **LMS sederhana** (katalog + roadmap belajar + jadwal + materi teks + tagihan) — lihat docs, **jangan coding LMS tanpa task aktif**.
- Tech stack (sekarang): Next.js (App Router), React, Tailwind CSS.
- UI style: modern editorial, warm off-white canvas (AppVerse.id Design System).
- Backend saat ini: API Server Express dengan Prisma ORM & PostgreSQL Supabase.

---

# 📚 Document source of truth (WAJIB DIBACA AGENT)

Setiap sesi kerja **berpatokan dokumen ini**, bukan mengarang scope.

| Dokumen | Path | Fungsi |
|---------|------|--------|
| **Agent rules (file ini)** | `AGENTS.md` | Aturan funnel + cara kerja + larangan |
| **System map** | `SYSTEM_MAP.md` | Peta routing/file (bisa lag vs kode — cek kode jika bentrok) |
| **Roadmap LMS** | `docs/ROADMAP-LMS.md` | Visi LMS, MVP in/out, fase 0–5, opsi A/B |
| **Progress log** | `docs/PROGRESS.md` | Log sesi + keputusan + status fase |
| **Task list** | `tasks/todo.md` | Checklist eksekusi (centang di sini) |
| **Vault (manusia)** | `D:\04_Writing\My Vault\My Projects\nurman-course\` | Ringkasan harian/manusia; repo menang untuk task/progress |

**Peran vault:** dokumen di repo (tabel di atas) adalah **satu-satunya source of truth eksekusi** dan wajib dijaga opencode. Vault **hanya hasil akhir** — ringkasan harian/manusia, boleh tertinggal, sync cukup 1×/hari atau saat diminta user. Jangan over-sync vault dan jangan menganggap task selesai hanya karena vault di-update.

### Step 0 (WAJIB tiap sesi) — baca sebelum aksi apa pun

Baca dulu SETIAP sesi, berapa pun kecilnya tugas, SEBELUM coding/read/eksplorasi kode:

1. `tasks/todo.md` — task mana yang `in_progress` / dipilih (jangan kerjakan di luar task tanpa dicatat).
2. `docs/PROGRESS.md` — entri teratas + tabel **Keputusan**: keputusan terakhir, jangan ulangi kerja.
3. `docs/ROADMAP-LMS.md` — jika task LMS / fase.
4. `AGENTS.md` ini + **kode terkait** (lihat **Codegraph** di bawah).

> Tidak boleh coding/menambah task sebelum Step 0 selesai. Kalau task belum jelas → tanya user, bukan ngarang.

---

# 🔍 Codegraph (WAJIB untuk kode)

Repo ini di-index Codegraph (folder lokal `.codegraph/`, di-gitignore).

### Kapan WAJIB pakai dulu

Sebelum **Grep / Read berulang / edit** kode app, panggil **`codegraph_explore`** (MCP) untuk:

- “Bagaimana X bekerja?”, alur, bug, “di mana Y?”
- Edit multi-file / blast radius (siapa call, apa yang terdampak)
- Baca simbol/file bernama — hasil = source line-numbered (setara Read)

**Query:** nama simbol/file, atau pertanyaan singkat (contoh: `CourseConfigClient pricing`, `vibe-coding getLevelBasePrice`).

### Kapan BOLEH skip Codegraph

- Docs only (`docs/`, `tasks/`, vault, `AGENTS.md` copy)
- Config non-kode, commit/push git murni
- Tidak ada `.codegraph/` → skip (jangan `codegraph init` tanpa minta user)

### Aturan

1. **Jangan** Grep+Read loop dulu kalau Codegraph bisa jawab 1 call.  
2. Source dari Codegraph = sudah “dibaca” — **jangan** Read ulang file yang sama tanpa alasan.  
3. Setelah edit: perhatikan banner staleness; file stale → Read file itu saja.  
4. Codegraph **bukan** pengganti tsc/lint/test.  

### Definition of Done — sync docs (wajib tiap sesi yang mengubah repo)

Sesi yang mengubah repo (kode **atau** docs) **BELUM selesai** sampai seluruh langkah berikut tuntas. Verifikasi docs menjadi bagian dari "selesai", bukan opsional:

1. Update **`docs/PROGRESS.md`** — entri baru di **atas** mengikuti template di bagian atas file (Fase / Status sesi / Request user / Keputusan / Dikerjakan / Verifikasi / Residual).
2. Update **`tasks/todo.md`** — centang `[x]` + tanggal, atau pindah `in_progress`; task baru dari scope creep tulis di sini dulu.
3. Jika keputusan arsitektur → catat di tabel **Keputusan** di `PROGRESS.md`.
4. Jangan anggap selesai hanya karena kode jalan — **docs progress/task wajib sync** (jika langkah ini tak bisa dijalankan, sebutkan alasannya; vault tidak menghitung dan tidak menggantikan ini).

### Larangan scope

- ❌ Jangan implement fitur LMS (auth, DB, `/app`, invoice, dsb.) tanpa task Fase 1+ di `tasks/todo.md`.  
- ❌ Jangan rombak besar funnel `/course/*` kecuali task Funnel polish (P*) atau Fase 5.  
- ❌ Jangan lock stack/payment/Opsi A|B diam-diam — catat di `PROGRESS.md`.  
- ✅ Boleh kerjakan **Funnel polish (P1–P10)** kapan saja; tetap catat progress.

---

# 🚪 Entry Points (Quick Navigation)

- /course → Landing hero (start)
- /course/program → Pilih program utama
- /course/materi → List materi
- /course/jenjang → List jenjang
- /course/calistung → Program calistung
- /course/materi/[id] → Detail materi + level
- /course/config → Konfigurasi akhir + pricing (`CourseConfigClient.tsx`)

---

# 🔀 Routing Flow

/course  
→ Hero landing  
→ CTA ke /course/program

/course/program  
→ Pilih:

- materi
- jenjang
- calistung

/course/materi  
→ List materi  
→ klik → /course/materi/[id]

/course/materi/[id]  
→ Pilih level  
→ klik → /course/config

/course/jenjang  
→ List jenjang (SD 1–3, SD 4–6, SMP)  
→ klik → /course/config

/course/calistung  
→ List program calistung  
→ klik → /course/config

/course/config  
→ Pilih:

- durasi
- frekuensi
- peserta
- hari
- jam  
  → hitung harga  
  → kirim ke WhatsApp

---

# 🧠 State Management

- Semua state menggunakan local state (useState)
- Tidak ada global state (Redux/Zustand)
- Tidak ada persistence (refresh akan reset state)
- Data antar halaman dikirim melalui URL query params:
  - materi
  - level
  - program (optional)

---

# 📁 Folder Structure (Monorepo)

- `frontend/` → Aplikasi frontend Next.js App Router (funnel & LMS UI)
- `backend/` → API Server Express dengan Prisma ORM & PostgreSQL Supabase
- `packages/shared/` → Shared TypeScript types dan Zod schemas
- `docs/` → Spesifikasi, ERD, dan arah roadmap LMS (bukan runtime)
- `tasks/` → Checklist eksekusi tugas sesi (`todo.md` & `plan.md`)
- `desain-ui-frontend/` → Kumpulan rancangan prompt Google Stitch untuk desain UI (19 file)

---

# 📦 Folder Responsibilities

frontend/app/
- Semua routing berbasis Next.js App Router (funnel marketing `/course` & LMS UI `/app`)

frontend/components/ui/
- Komponen UI reusable bergaya glassmorphism (Button, GlassCard, dll)

frontend/components/course/
- Section dan motion helpers untuk landing page funnel

frontend/data/
- Data statis landing page & materials (funnel)

backend/src/
- Kode API Express: endpoint health check `/api/health`, profile `/api/users/me`, middleware verifikasi token JWT Supabase (`requireAuth`)

backend/prisma/
- Skema database Prisma model 3-role (`schema.prisma`) dan script `seed.ts`

packages/shared/src/
- Single source of truth untuk Zod schemas (validasi Laporan Harian, Laporan Perkembangan) dan enum status/roles.

docs/
- Roadmap, system flow, ERD skema database

tasks/
- Rencana eksekusi dan checklist tugas aktif (todo.md, plan.md)

---

# 🧩 Key Files Map

frontend/app/course/page.tsx
- Role: Hero landing
- Navigates to: /course/program

frontend/app/course/program/page.tsx
- Role: Pilih program utama
- Routes ke: materi / jenjang / calistung

frontend/app/course/materi/page.tsx
- Role: List materi
- Uses: getMaterialsByCategory("materi")
- Routes: /course/materi/[id]

frontend/app/course/materi/[id]/page.tsx
- Role: Detail materi + level
- Uses: getMaterialById
- Routes: /course/config

frontend/app/course/jenjang/page.tsx
- Role: List jenjang
- Uses: getMaterialsByCategory("jenjang")
- Routes: /course/config

frontend/app/course/calistung/page.tsx
- Role: Program calistung
- Uses: getMaterialsByCategory("calistung")
- Routes: /course/config

frontend/app/course/config/page.tsx
- Role: Wrapper Suspense untuk halaman config
- Renders: CourseConfigClient

frontend/app/course/config/CourseConfigClient.tsx
- Role: Konfigurasi + **pricing** + CTA WhatsApp
- Uses: getMaterialById, Chip/Button/GlassCard, WHATSAPP_NUMBER
- Output: WhatsApp URL

frontend/data/materials.ts
- Role: Data utama (materi, jenjang, calistung)
- Helper:
  - getMaterialById
  - getMaterialsByCategory

frontend/data/landing.ts
- Role: Social stats, featured programs, testimonials (landing `/course`)

frontend/components/course/*
- Role: Section landing + Reveal/CountUp (framer-motion)

frontend/utils/format.ts
- Role: Format harga (rb/jt)

frontend/lib/constants.ts
- Role: Konstanta global (WA number)

docs/ROADMAP-LMS.md · docs/PROGRESS.md · tasks/todo.md
- Role: Arah LMS + tracking eksekusi

---

# 🔗 Data Flow

materials.ts  
→ digunakan di halaman list/detail  
→ user memilih item + level  
→ dikirim via query params  
→ diterima di /course/config  
→ dihitung estimasi harga di **CourseConfigClient**  
→ diringkas  
→ dikirim ke WhatsApp

---

# 💰 Pricing Responsibility

- Base price: `data/materials.ts` — `Material.basePrice` (list “mulai dari”)
- Override per level (opsional): `MaterialLevel.basePrice`
- Unit price helper: `getLevelBasePrice(material, level)`
- Calculation: HANYA di `app/course/config/CourseConfigClient.tsx`

Multipliers (lihat kode untuk angka terkini):

- duration: 60 → ×1, 90 → ×1.3
- frequency (1 / 2 / 3)
- participants: 1 → ×1, 2 → ×0.8 (−20%), 3 → ×0.65 (−35%) + location fee

❌ Dilarang menghitung harga di halaman lain  
❌ Dilarang duplikasi logic pricing

---

# ⚠️ Special Cases

Calistung:

- Tidak ada pemilihan materi/level kompleks
- Langsung ke config
- Di config UI: label "Program" (bukan "Materi")
- Pesan WA: usahakan konsisten dengan label Program (lihat task P3)

Jenjang:

- Bukan mapel (bukan matematika)
- Representasi level pendidikan

---

# ⚠️ Important Rules

- Jangan hardcode data di page
- Selalu gunakan data/materials.ts
- Jangan duplikasi logic pricing
- Jangan ubah routing tanpa alasan kuat / task
- Gunakan komponen UI yang sudah ada
- **Patokan progress/task/roadmap** seperti di bagian Document source of truth

---

# ⚠️ Known Limitations

- Tidak ada backend
- Tidak ada database
- Tidak ada authentication
- Semua data statis
- State tidak persistent
- Tidak ada validasi server-side
- LMS: baru di dokumen (belum di kode)

---

# 🧠 Notes for Future Development

## Funnel (sekarang)

Tambah materi:  
→ edit data/materials.ts

Ubah pricing:  
→ edit app/course/config/CourseConfigClient.tsx

Ubah UI:  
→ edit components/ui/

Tambah program funnel:  
→ program page + materials.ts + routing

## LMS (nanti)

→ ikuti `docs/ROADMAP-LMS.md` fase 0→5  
→ kerjakan hanya task di `tasks/todo.md`  
→ setiap progres: `docs/PROGRESS.md`

Opsi integrasi funnel (belum final): **A** dual surface vs **B** funnel = onboarding — lihat roadmap.

---

# 🎯 Goal

**Sekarang:** flow funnel tetap cepat, sederhana, mudah dipahami user & AI.  
**Nanti:** LMS sederhana sesuai roadmap, tanpa merusak lead WA sebelum Fase 5 diputuskan.
