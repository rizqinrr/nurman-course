# Tasks — nurman-course

> Source of truth **checklist eksekusi**.  
> Roadmap: [`../docs/ROADMAP-LMS.md`](../docs/ROADMAP-LMS.md)  
> Progress log: [`../docs/PROGRESS.md`](../docs/PROGRESS.md)  
> Agent rules: [`../AGENTS.md`](../AGENTS.md)

**Cara pakai**
1. Pilih **satu** task `in_progress` per sesi (kecuali parallel eksplisit).
2. Selesai → `[x]` + tanggal; catat entri di `docs/PROGRESS.md`.
3. Task baru dari scope creep → tulis di sini dulu, **jangan** langsung coding.
4. Jangan loncat fase LMS (mis. Fase 4) jika Fase 1 belum fondasi — kecuali task funnel-only.

**Legend status di komentar baris:** `(pending | in_progress | done | blocked | cancelled)`

---

## Meta — dokumentasi & proses

- [x] 2026-07-29 Tulis `docs/ROADMAP-LMS.md` (MVP, fase, opsi A/B)
- [x] 2026-07-29 Buat `docs/PROGRESS.md` + template log
- [x] 2026-07-29 Buat `tasks/todo.md` (file ini)
- [x] 2026-07-29 Update `AGENTS.md` berpatokan docs/tasks
- [x] 2026-07-29 Mirror vault (03 Roadmap, index, about, 02)

---

## Funnel polish (boleh paralel dengan planning LMS; tidak mengubah arah LMS)

Ad-hoc:
- [x] 2026-07-29 Marquee landing: tambah "Laporan progres belajar anak"
- [x] 2026-07-29 P12 Landing: social proof + program favorit + testimoni + framer-motion
- [x] 2026-07-29 Fix hydration error PageHeader (tombol back className)
- [x] 2026-07-29 P13 Tutor carousel infinite loop
- [x] 2026-07-29 Ganti mentor Kak Fikri → Kak Kiki (D3 Informatika, Politeknik Negeri Cilacap)
- [x] 2026-07-29 Komputer Dasar: silabus L1/L2 dari vault + L3 Coming Soon (`comingSoon`)
- [x] 2026-07-29 Pricing KD: L1 35k / L2 40k; durasi 90 menit ×1.3; `getLevelBasePrice`
- [x] 2026-07-29 Config: defaults 90/3x/siswa; frekuensi 4x; jam 13–19; chip hijau pulse; tentor & 2 jam CS
- [x] 2026-07-29 Jumlah peserta: copy kelas + harga per anak; diskon 2=20% / 3=35% (×0.65)
- [x] 2026-07-29 Config: input Nama Lengkap wajib → baris `Nama:` di WA
- [x] 2026-07-29 Format pesan WA: bold/section/bullet
- [x] 2026-07-29 Materi komputer-dasar: efek level terpilih + badge Terpilih
- [x] 2026-07-29 Calistung: paket Ngaji 15k + Calistung & Ngaji 30k
- [x] 2026-07-29 Config calistung: hide Level di UI + WA
- [x] 2026-07-29 Config: input nama dinamis 1–3 sesuai jumlah peserta
- [x] 2026-07-29 Plan + implement Kelas Vibe Coding (`vibe-coding` L1–L3 40/45/50k; syarat laptop+internet)
- [ ] Paket 12 sesi / all-in Vibe Coding (masih diskusi)

Prioritas tinggi:
- [ ] P1 Sync `AGENTS.md` / `SYSTEM_MAP.md` dengan kode (pricing path = `CourseConfigClient.tsx`; hapus legacy `components/course/`)
- [ ] P2 Metadata + README (bukan boilerplate create-next-app)
- [ ] P3 Label WA calistung: pesan WA pakai "Program" jika `program=calistung`

Prioritas sedang:
- [ ] P4 `/course/program` dari data/`getCategories`, bukan hardcode 3 route
- [ ] P5 Tutor data pindah ke `data/`
- [ ] P6 UX query config invalid (sudah ada partial — review)

Prioritas rendah:
- [ ] P7 State persistence (opsional)
- [ ] P8 Sesi online real
- [ ] P9 Test suite (pricing + smoke flow)
- [ ] P10 Hari full dinamis

---

## Fase 0 — Spec & model data (docs only)

- [ ] F0.1 Finalisasi daftar entity + field (User, Program, RoadmapStep, Session, MaterialItem, Enrollment, Invoice)
- [ ] F0.2 ERD kasar (vault Diagram/ atau `docs/erd-lms.md`)
- [ ] F0.3 Mapping kasar `materials.ts` → Program/RoadmapStep (untuk migrasi nanti)
- [ ] F0.4 Shortlist stack (DB + Auth) + kriteria; **belum wajib lock**
- [ ] F0.5 Catat keputusan open: Opsi A vs B, payment manual vs gateway — di `PROGRESS.md`

**Exit Fase 0:** entity jelas, ERD ada, stack kandidat tertulis, open questions tersisa ≤ 3.

---

## Fase 1 — Fondasi

- [ ] F1.1 Pilih & setup DB + env (tanpa commit secret)
- [ ] F1.2 Auth admin + peserta (minimal)
- [ ] F1.3 Shell app terautentikasi (`/app` atau setara) + layout
- [ ] F1.4 Seed 1 program dummy + 1 admin
- [ ] F1.5 Proteksi route (admin vs peserta)

**Exit Fase 1:** login jalan; admin masuk shell; 1 program di DB.

---

## Fase 2 — Katalog + roadmap + materi teks

- [ ] F2.1 Admin CRUD Program
- [ ] F2.2 Admin CRUD RoadmapStep (urutan alur belajar)
- [ ] F2.3 Admin CRUD MaterialItem (teks) terkait step
- [ ] F2.4 Peserta: list katalog + detail + roadmap read-only
- [ ] F2.5 Peserta: baca materi teks per step

**Exit Fase 2:** satu program end-to-end bisa diisi admin & dibaca peserta.

---

## Fase 3 — Jadwal sesi

- [ ] F3.1 Model + admin CRUD Session
- [ ] F3.2 Tampilan list/kalender sederhana untuk peserta
- [ ] F3.3 Hubungan Session ↔ Program (dan opsional Enrollment)

**Exit Fase 3:** peserta lihat jadwal program yang relevan.

---

## Fase 4 — Tagihan / pembayaran

- [ ] F4.1 Model Invoice + status unpaid/waiting/paid
- [ ] F4.2 Admin buat/ubah status tagihan
- [ ] F4.3 Peserta lihat tagihan + instruksi bayar (teks)
- [ ] F4.4 (Opsional) notifikasi WA salin/tautan — bukan gateway dulu

**Exit Fase 4:** status bayar terlihat admin & peserta.

---

## Fase 5 — Integrasi funnel

- [ ] F5.1 Putuskan final **Opsi A** atau **Opsi B** (catat di PROGRESS)
- [ ] F5.2 Implement integrasi sesuai opsi
- [ ] F5.3 Rencana deprecation/mapping `materials.ts` jika diganti DB
- [ ] F5.4 Jaga funnel production tidak putus selama cutover

**Exit Fase 5:** lead flow & LMS selaras dengan keputusan A/B.

---

## Backlog ide (belum dijadwalkan)

- Payment gateway (Midtrans/Xendit)
- Multi-tutor
- Absensi & nilai
- Video / live
- Docker production
- App terpisah vs monorepo

---

## In progress (maks 1 fokus utama)

_Tidak ada — sesi roadmap docs selesai. Pilih task berikutnya dari Funnel polish atau Fase 0._
