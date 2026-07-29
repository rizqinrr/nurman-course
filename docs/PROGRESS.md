# Progress Log — nurman-course

> Update **setiap sesi kerja** yang menghasilkan perubahan berarti (docs atau kode).  
> Task checklist: [`../tasks/todo.md`](../tasks/todo.md)  
> Roadmap LMS: [`ROADMAP-LMS.md`](./ROADMAP-LMS.md)

**Aturan:**  
1. Tambah entri baru di **atas** (terbaru dulu).  
2. Setelah entri, sync status fase/task di `tasks/todo.md`.  
3. Keputusan penting → tabel **Keputusan** di bawah.

---

## Keputusan

| Tanggal | Keputusan | Alasan | Status |
|---------|-----------|--------|--------|
| 2026-07-29 | **L3 Vibe**: modul fleksibel (tak terbatas); setup AI pro dulu; Filament; deploy dinamis Railway/Render; payment/email opsional | User: sesi tak terbatas + AI dari awal | aktif |
| 2026-07-29 | **L2 Vibe**: Laravel CRUD localhost + Git/GitHub; deploy = **statis Vercel** (landing/portofolio); app dinamis production → L3 | User: deploy web statis Vercel dulu | aktif |
| 2026-07-29 | **L1 Vibe** full localhost (VSCode+Laragon); no deploy/Git di L1; sesi 11 bridge DB; sesi 12 review+polish | User: dari setup dulu, deploy nanti | aktif |
| 2026-07-29 | Coding funnel → **Kelas Vibe Coding** (`vibe-coding`); L1–L3 open 40/45/50k; syarat laptop + internet; paket masih TBD | Align vault + user | aktif (materi live; paket TBD) |
| 2026-07-29 | Planning LMS di vault + mirror `docs/` di repo | Manusia baca vault; AI/clone baca repo | aktif |
| 2026-07-29 | Progress & task di repo (`PROGRESS.md`, `tasks/todo.md`) | Setiap eksekusi berpatokan dokumen yang sama | aktif |
| 2026-07-29 | Funnel Vercel tetap; LMS belum di-coding | Roadmap dulu; Opsi A/B belum final | aktif |
| 2026-07-29 | Opsi arsitektur funnel↔LMS: **catat A & B**, favor A untuk fondasi | User minta 2 opsi di dokumen | terbuka |

---

## Log sesi

### 2026-07-29 — Revisi silabus L3 Vibe (modul fleksibel + AI pro)

**Fase:** funnel-polish  
**Status sesi:** selesai

**Dikerjakan:**
- L3: modul A–K (setup AI/rules → Filament → fitur → PaaS deploy → portofolio); sesi tak terbatas
- Teaser funnel + subtitle: “Production · modul fleksibel”
- Vault Struktur + plan integrasi + harga L3 “Fleksibel” sync

**File:** `data/materials.ts`, vault Kelas Vibe Coding

---

### 2026-07-29 — Revisi silabus L2 Vibe (Laravel + Vercel statis)

**Fase:** funnel-polish  
**Status sesi:** selesai

**Dikerjakan:**
- L2 12 sesi: konsep/MVC → Laravel CRUD + auth local → GitHub → deploy **statis Vercel** → proyek + presentasi
- Teaser funnel + subtitle: “Laravel + Git + Vercel — 12 sesi”
- Vault Struktur + plan integrasi sync

**File:** `data/materials.ts`, vault Kelas Vibe Coding

---

### 2026-07-29 — Revisi silabus L1 Vibe (localhost)

**Fase:** funnel-polish  
**Status sesi:** selesai

**Dikerjakan:**
- L1 12 sesi: setup VSCode/Laragon → HTML/CSS/JS → AI + prompting → 2 proyek local → debug → bridge DB → review (tanpa deploy/Git)
- Funnel teaser + subtitle L1: “Localhost dulu — 12 sesi”
- Vault `Struktur Kelas 3 Level` + plan integrasi sync

**File:** `data/materials.ts`, vault Kelas Vibe Coding

---

### 2026-07-29 — Implement Kelas Vibe Coding di funnel

**Fase:** funnel-polish  
**Status sesi:** selesai (paket masih TBD)

**Dikerjakan:**
- Hapus `coding-dasar` + `coding-lanjutan` → `vibe-coding` (L1 40k / L2 45k / L3 50k, semua open)
- Syarat di detail: laptop sendiri + internet lancar
- Landing copy; select UI enhanced seperti KD
- Vault plan di-update

**File:** `data/materials.ts`, `data/landing.ts`, `app/course/materi/[id]/page.tsx`

**Verifikasi:** `/course/materi` + `/course/materi/vibe-coding`

---

### 2026-07-29 — Plan Kelas Vibe Coding (Obsidian)

**Fase:** funnel-planning  
**Status sesi:** dilanjut implement

---

### 2026-07-29 — Nama peserta dinamis (1–3 input)

**Fase:** funnel-fix  
**Status sesi:** selesai

**Dikerjakan:**
- Input nama = jumlah peserta; kurangi peserta → potong input terbawah
- Label: 1 orang “Nama Lengkap”; 2+ “Nama 1/2/3”
- WA: bullet per nama

**File:** `app/course/config/CourseConfigClient.tsx`

---

### 2026-07-29 — Config calistung tanpa tampilan Level

**Fase:** funnel-fix  
**Status sesi:** selesai

**Dikerjakan:**
- `program=calistung`: sembunyikan Level di kartu, footer, dan pesan WA
- Query `level=1` tetap untuk pricing

**File:** `app/course/config/CourseConfigClient.tsx`

---

### 2026-07-29 — Calistung: Ngaji 15k + combo 30k

**Fase:** funnel-fix  
**Status sesi:** selesai

**Dikerjakan:**
- 2 program: `ngaji` 15k, `calistung-ngaji` 30k
- Config Program value = `material.name` (bukan hardcode)

**File:** `data/materials.ts`, `CourseConfigClient.tsx`, `calistung/page.tsx`, `landing.ts`

---

### 2026-07-29 — Select level UI (komputer-dasar only)

**Fase:** funnel-fix  
**Status sesi:** selesai

**Dikerjakan:**
- Hanya `komputer-dasar`: border 2px, bg biru, scale ringan, badge **Terpilih**
- Materi lain: select style lama (tanpa badge)

**File:** `app/course/materi/[id]/page.tsx`

---

### 2026-07-29 — Input Nama Lengkap → WA

**Fase:** funnel-fix  
**Status sesi:** selesai

**Dikerjakan:**
- Field Nama Lengkap (wajib) di config setelah Pilih Jam
- Pesan WA rapi: section bold, bullet, salam + penutup

**File:** `app/course/config/CourseConfigClient.tsx`

---

### 2026-07-29 — Keterangan peserta + diskon 3 anak 35%

**Fase:** funnel-fix  
**Status sesi:** selesai

**Dikerjakan:**
- Copy: 1 kelas, harga per anak; badge kanan atas (penuh / 20% / 35%)
- Chip peserta clean (tanpa hint di tombol)
- Multiplier 3 orang: 0.7 → **0.65**

**File:** `CourseConfigClient.tsx`, `AGENTS.md`

---

### 2026-07-29 — Config defaults + chip hijau/biru

**Fase:** funnel-fix  
**Status sesi:** selesai

**Dikerjakan:**
- Default: 90 menit, 3x/minggu, 1 orang, rumah siswa
- Frekuensi 4x; 2 jam & tempat tentor Coming Soon
- Hari semua bisa; jam 13–19 tiap jam, 16:00 Full
- Chip: default aktif **hijau + pulse**; non-default **biru + bayangan**

**File:**
- `app/course/config/CourseConfigClient.tsx`
- `components/ui/Chip.tsx`
- `app/globals.css`

---

### 2026-07-29 — Pricing per level KD + durasi 90 ×1.3

**Fase:** funnel-fix  
**Status sesi:** selesai

**Dikerjakan:**
- KD L1 35k, L2 40k (`MaterialLevel.basePrice` + `getLevelBasePrice`)
- Durasi 90 menit: multiplier 1.5 → **1.3**
- Config & kartu level tampil harga level

**File:**
- `data/materials.ts`
- `app/course/config/CourseConfigClient.tsx`
- `app/course/materi/[id]/page.tsx`
- `AGENTS.md`

**Verifikasi:** config level 1/2 + toggle 90 menit

---

### 2026-07-29 — Komputer Dasar silabus vault + Level 3 Coming Soon

**Fase:** funnel-fix  
**Status sesi:** selesai

**Dikerjakan:**
- L1/L2 features dari vault Les Privat Komputer Dasar
- `comingSoon?: boolean` di MaterialLevel; L3 flag true
- UI materi detail: badge Coming Soon, tidak selectable

**File:**
- `data/materials.ts`
- `app/course/materi/[id]/page.tsx`

**Verifikasi:** `/course/materi/komputer-dasar`

---

### 2026-07-29 — Ganti mentor Kak Fikri → Kak Kiki

**Fase:** funnel-fix  
**Status sesi:** selesai

**Dikerjakan:**
- Mentor: Kak Kiki, D3 Informatika, Politeknik Negeri Cilacap (foto path tetap)

**File:**
- `app/course/page.tsx`

**Verifikasi:** `/course` carousel mentor

---

### 2026-07-29 — Tutor carousel infinite loop

**Fase:** funnel-fix  
**Status sesi:** selesai

**Dikerjakan:**
- Infinite scroll mentor: 3 set clone + jump ke set tengah
- Ekstrak `TutorCarousel.tsx` dari landing
- Prev/next & dots modulo-aware

**File:**
- `components/course/TutorCarousel.tsx`
- `app/course/page.tsx`
- `tasks/todo.md`

**Verifikasi:** `/course` — swipe melewati mentor terakhir → mentor pertama muncul lagi

**Next:** P1–P3 atau pindah tutors ke `data/landing.ts`

---

### 2026-07-29 — Hydration error fix

**Fase:** funnel-fix  
**Status sesi:** selesai

**Dikerjakan:**
- PageHeader className di tombol back (spasi/line break di template literal)
- Hydration mismatch di `/course/config` (PageHeader + CourseConfigClient)

**File:**
- `components/ui/PageHeader.tsx`
- `docs/PROGRESS.md`

**Verifikasi:**
- `npm run dev`
- Buka `/course/config?materi=komputer-dasar&level=1`
- Tidak ada warning React hydration

**Next:**
- Ganti testimoni dummy ke quote real
- Lanjut P12 (landing) atau P1–P3

---

### 2026-07-29 — Landing: social proof + favorit + testimoni + motion

**Fase:** funnel-fix  
**Status sesi:** selesai

**Dikerjakan:**
- Social proof (5 siswa, 30+ materi, 12 pertemuan/bulan) + count-up
- Program favorit (3 card → route existing)
- Testimoni dummy (3)
- Fade-in section (Reveal) + framer-motion
- Data di `data/landing.ts`

**File:**
- `data/landing.ts`
- `components/course/*` (Reveal, CountUp, SocialProof, FeaturedPrograms, Testimonials)
- `app/course/page.tsx`
- `package.json` (framer-motion)
- `AGENTS.md`, `SYSTEM_MAP.md`, `tasks/todo.md`

**Verifikasi:** `/course` — count-up + scroll reveal; klik program favorit

**Next:** ganti testimoni dummy ke quote real; P1–P3 polish

---

### 2026-07-29 — Marquee: laporan progres belajar anak

**Fase:** funnel-fix  
**Status sesi:** selesai

**Dikerjakan:**
- Tambah benefit marquee di landing `/course`: "Laporan progres belajar anak"

**File:**
- `app/course/page.tsx`
- `tasks/todo.md`

**Verifikasi:** cek visual marquee di http://localhost:3000/course

**Next:** funnel polish P1–P3 atau item marquee lain

---

### 2026-07-29 — Roadmap LMS + sistem progress/task

**Fase:** Docs (pre–Fase 0)  
**Status sesi:** selesai

**Dikerjakan:**
- Tulis roadmap LMS (MVP, fase 0–5, opsi A/B, model data draft)
- Buat `docs/PROGRESS.md` + `tasks/todo.md`
- Update `AGENTS.md`: patokan dokumen, aturan update progress
- Mirror vault: `03 - Roadmap LMS`, index, about, backlog

**File:**
- `docs/ROADMAP-LMS.md`
- `docs/PROGRESS.md`
- `tasks/todo.md`
- `AGENTS.md`
- vault `My Projects/nurman-course/*`

**Verifikasi:** dokumen saling link; funnel kode tidak diubah.

**Next:**
- Fase 0: perjelas entity/ERD + kandidat stack (masih docs)
- Atau backlog funnel kecil (P1–P3) jika prioritas polish Vercel

---

## Status fase (ringkas)

| Fase | Nama | Status |
|------|------|--------|
| — | Funnel production (`/course`) | **live** (Vercel) |
| Docs | Roadmap + progress system | **done** (2026-07-29) |
| 0 | Spec & model data | pending |
| 1 | Fondasi (auth, DB, /app) | pending |
| 2 | Katalog + roadmap + materi teks | pending |
| 3 | Jadwal sesi | pending |
| 4 | Tagihan | pending |
| 5 | Integrasi funnel (A atau B) | pending |

---

## Template entri log (copy)

```markdown
### YYYY-MM-DD — [judul singkat]

**Fase:** 0|1|2|3|4|5|funnel-fix|docs  
**Status sesi:** selesai | partial | blocked

**Dikerjakan:**
-

**File:**
-

**Verifikasi:**
-

**Next:**
-
```
