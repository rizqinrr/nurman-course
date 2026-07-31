# 🧭 Project Overview

- Aplikasi frontend untuk alur pendaftaran les **Nurman Course** (funnel live).
- Tujuan saat ini: user pilih program → konfigurasi → WhatsApp dengan cepat.
- Arah masa depan: **LMS sederhana** (katalog + roadmap belajar + jadwal + materi teks + tagihan) — lihat docs, **jangan coding LMS tanpa task aktif**.
- Tech stack (sekarang): Next.js (App Router), React, Tailwind CSS.
- UI style: glassmorphism ringan, modern, mobile-first.
- Backend saat ini: **tidak ada** (data statis, output ke WhatsApp).

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
| **Vault (manusia)** | `D:\04_Writing\My Vault\My Projects\nurman-course\` | Mirror planning; repo menang untuk task/progress |

### Urutan baca sebelum eksekusi non-trivial

1. `tasks/todo.md` — task mana yang `in_progress` / dipilih  
2. `docs/ROADMAP-LMS.md` — jika task LMS / fase  
3. `docs/PROGRESS.md` — keputusan terakhir & jangan ulangi kerja  
4. File ini + **kode terkait** (lihat **Codegraph** di bawah)

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

### Setelah setiap sesi yang mengubah repo

1. Update **`docs/PROGRESS.md`** (entri baru di atas, template ada di file).  
2. Update **`tasks/todo.md`** (centang `[x]` + tanggal, atau pindah in_progress).  
3. Jika keputusan arsitektur → tabel **Keputusan** di `PROGRESS.md`.  
4. Jangan anggap selesai hanya karena kode jalan — **docs progress/task wajib sync**.

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

# 📁 Folder Structure (Clean)

/app → routing & halaman  
/components/ui → reusable UI (Button, Chip, GlassCard, …)  
/components/course → section domain funnel (landing: SocialProof, FeaturedPrograms, Testimonials, Reveal, CountUp)  
/data → data statis (materials, landing)  
/utils → helper functions  
/lib → konstanta global  
/docs → roadmap LMS, progress log  
/tasks → checklist eksekusi (`todo.md`)

---

# 📦 Folder Responsibilities

app/

- Semua routing berbasis App Router
- Entry point semua flow user (funnel)

components/ui/

- Komponen UI reusable
- Tidak mengandung logic bisnis

components/course/

- Section/domain funnel (landing social proof, program favorit, testimoni, motion helpers)
- Boleh pakai data/landing.ts + framer-motion

data/

- Single source of truth untuk materi/jenjang/calistung (funnel)
- Landing copy/stats: `data/landing.ts`

utils/

- Helper kecil (formatting, dll)

lib/

- Konstanta global (contoh: WHATSAPP_NUMBER)

docs/

- Roadmap & progress — **bukan** runtime app

tasks/

- Todo eksekusi untuk manusia & agent

---

# 🧩 Key Files Map

app/course/page.tsx

- Role: Hero landing
- Navigates to: /course/program

app/course/program/page.tsx

- Role: Pilih program utama
- Routes ke: materi / jenjang / calistung

app/course/materi/page.tsx

- Role: List materi
- Uses: getMaterialsByCategory("materi")
- Routes: /course/materi/[id]

app/course/materi/[id]/page.tsx

- Role: Detail materi + level
- Uses: getMaterialById
- Routes: /course/config

app/course/jenjang/page.tsx

- Role: List jenjang
- Uses: getMaterialsByCategory("jenjang")
- Routes: /course/config

app/course/calistung/page.tsx

- Role: Program calistung
- Uses: getMaterialsByCategory("calistung")
- Routes: /course/config

app/course/config/page.tsx

- Role: Wrapper Suspense untuk halaman config
- Renders: CourseConfigClient

app/course/config/CourseConfigClient.tsx

- Role: Konfigurasi + **pricing** + CTA WhatsApp
- Uses: getMaterialById, Chip/Button/GlassCard, WHATSAPP_NUMBER
- Output: WhatsApp URL

data/materials.ts

- Role: Data utama (materi, jenjang, calistung)
- Helper:
  - getMaterialById
  - getMaterialsByCategory

data/landing.ts

- Role: Social stats, featured programs, testimonials (landing `/course`)

components/course/*

- Role: Section landing + Reveal/CountUp (framer-motion)

utils/format.ts

- Role: Format harga (rb/jt)

lib/constants.ts

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
