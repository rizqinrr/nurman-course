# Roadmap — LMS Sederhana (Nurman Course)

> Status: **draft roadmap** (dokumen only — belum implementasi kode LMS)  
> Dibuat: 2026-07-29  
> Master planning (manusia): vault `My Projects/nurman-course/03 - Roadmap LMS Sederhana.md`  
> Progress eksekusi: [`PROGRESS.md`](./PROGRESS.md) · Task: [`../tasks/todo.md`](../tasks/todo.md)

---

## 1. Problem statement

**How might we** memberi admin Nurman Course dan calon/peserta satu tempat untuk:

1. melihat **katalog & detail program** (teks + **roadmap alur belajar**),
2. melihat **jadwal sesi**,
3. mengakses **materi belajar (konten teks)**,
4. melacak **tagihan / status bayar**,

tanpa membangun LMS enterprise (video platform, multi-campus, dsb.)?

---

## 2. Kondisi sekarang (baseline)

| Aspek | Saat ini |
|-------|----------|
| Produk | Funnel marketing/pendaftaran: pilih program → config → **WhatsApp** |
| Deploy | Vercel (frontend-only) |
| Data | Statis `data/materials.ts` |
| Backend / auth / DB | Tidak ada |
| User | Publik (calon daftar) + admin terima lead via WA |

Funnel ini **tetap valuable** sebagai channel lead. LMS adalah **evolusi**, bukan pengganti instan tanpa keputusan arsitektur.

---

## 3. User target (MVP)

| Role | Siapa | Kebutuhan inti |
|------|--------|----------------|
| **Admin** | Kamu (single admin dulu) | Kelola program, roadmap, jadwal, materi teks, tagihan |
| **Peserta / pendaftar** | Yang mau daftar / sudah ikut | Lihat katalog, detail+roadmap, jadwal, materi, status bayar |

**Belum di MVP:** portal multi-tutor, orang tua multi-anak, role granuler.

---

## 4. Definisi “LMS sederhana” (MVP)

### In scope

| Fitur | Keterangan |
|-------|------------|
| Katalog & detail program | Deskripsi **teks**; cukup dalam untuk putuskan ikut |
| Roadmap / alur belajar | Urutan langkah per program/level (bukan cuma list flat) |
| Jadwal sesi | Daftar/kalender sederhana pertemuan |
| Materi belajar | Konten **teks** (markdown/plain) per langkah roadmap atau sesi |
| Pembayaran / tagihan | Invoice + status (unpaid / waiting / paid); konfirmasi manual OK di awal |
| Funnel WA | Tetap ada sebagai channel lead sampai integrasi diputuskan |

### Out of scope (sengaja — Not Doing dulu)

- Video streaming / live class platform
- SCORM / xAPI
- Forum, chat in-app, gamifikasi berat
- Payment gateway full otomatis (bisa fase belakangan)
- Absensi advanced & nilai rapor lengkap
- Multi-tenant / multi-cabang
- Docker wajib (opsional belakangan jika self-host)

---

## 5. Dua opsi arsitektur: funnel ↔ LMS

**Belum diputuskan.** Setiap fase implementasi harus merujuk opsi yang aktif di `PROGRESS.md`.

### Opsi A — Dual surface (disarankan untuk Fase 0–1)

| | |
|--|--|
| Ide | `/course/*` tetap marketing + WA. LMS di area terpisah (`/app`, subdomain, atau project terpisah). |
| Plus | Funnel Vercel stabil; risiko LMS tidak merusak lead flow. |
| Minus | Dua “pintu”; sync katalog funnel vs LMS perlu disiplin. |
| Cocok jika | Lead WA masih utama; LMS dibangun bertahap. |

### Opsi B — Funnel = onboarding LMS

| | |
|--|--|
| Ide | Akhir flow daftar (config) masuk akun + dashboard; WA opsional/notifikasi. |
| Plus | Satu journey; data lead langsung ke sistem. |
| Minus | Auth+DB lebih awal; sentuh funnel existing. |
| Cocok jika | Siap fondasi backend & login. |

**Keputusan sementara di dokumen:** favor **A** untuk fondasi; evaluasi **B** saat auth + tagihan hidup (Fase 4–5). Final choice dicatat di Keputusan (`PROGRESS.md` + vault).

---

## 6. Fase roadmap

| Fase | Nama | Hasil “done” | Kode? |
|------|------|--------------|-------|
| **0** | Spec & model data | Entity + relasi di doc/ERD kasar; stack kandidat | Docs only |
| **1** | Fondasi | Auth admin+peserta, DB, shell `/app`, seed 1 program | Ya |
| **2** | Katalog + roadmap + materi teks | Admin CRUD; peserta read | Ya |
| **3** | Jadwal sesi | List/kalender; terhubung program | Ya |
| **4** | Tagihan | Invoice + status; konfirmasi manual; WA opsional bayar | Ya |
| **5** | Integrasi funnel | Implement Opsi A atau B yang dipilih | Ya |

Detail task per fase: [`../tasks/todo.md`](../tasks/todo.md).

---

## 7. Model data (draft — Fase 0)

Konseptual; nama final menyesuaikan ORM/DB.

```
User            id, role (admin|peserta), name, phone, email?, createdAt
Program         id, slug, name, description, category, basePrice?, active
RoadmapStep     id, programId, order, title, bodyText, level?
Session         id, programId, startsAt, endsAt, location?, capacity?, status
MaterialItem    id, roadmapStepId | sessionId, title, bodyText, order
Enrollment      id, userId, programId, status, startedAt
Invoice         id, enrollmentId, amount, status (unpaid|waiting|paid), dueAt, paidAt?, note?
```

Funnel statis hari ini (`materials.ts`) **bukan** schema LMS — migrasi/mapping diputus di Fase 5.

---

## 8. Stack kandidat (belum lock)

| Layer | Kandidat | Kriteria pilih |
|-------|----------|----------------|
| App | Next.js App Router (lanjut) | Satu codebase, Vercel-friendly |
| DB | Postgres (Supabase / Neon / Vercel Postgres) | Managed, auth optional bundled |
| Auth | Supabase Auth / NextAuth / Clerk | Simple admin+peserta |
| Konten | Markdown di DB atau MDX | Teks dulu |
| Bayar | Manual status → nanti Midtrans/Xendit | MVP tanpa gateway OK |

Lock stack = output **Fase 0** + catatan di `PROGRESS.md`.

---

## 9. Asumsi yang perlu divalidasi

- [ ] Single admin cukup untuk 3–6 bulan ke depan
- [ ] Materi teks/markdown cukup (tanpa video) untuk program inti
- [ ] Status bayar manual (transfer + konfirmasi) acceptable
- [ ] Funnel WA tetap channel lead utama sampai Fase 5
- [ ] Peserta mau login (bukan hanya chat WA)

---

## 10. Aturan kerja (wajib untuk agent & manusia)

1. **Jangan coding fitur LMS** sebelum task di `tasks/todo.md` untuk fase itu `in_progress` dan sejalan roadmap.
2. **Setiap progres** → update `docs/PROGRESS.md` + centang/ubah status di `tasks/todo.md`.
3. **Keputusan arsitektur** (A/B, stack, bayar) → catat di `PROGRESS.md` bagian Keputusan + mirror vault bila perlu.
4. **Funnel `/course/*`** jangan dirombak besar tanpa task eksplisit Fase 5 / Opsi B.
5. Patokan agent: **`AGENTS.md`** (source of truth operasional).

---

## 11. Success criteria roadmap dokumen ini

- [x] MVP in/out tertulis
- [x] User admin + peserta tertulis
- [x] Opsi A vs B tertulis (belum final pick)
- [x] Fase 0–5 tertulis
- [x] Link progress + tasks
- [ ] Fase 0 entity/ERD diperjelas (saat eksekusi Fase 0)
- [ ] Stack di-lock (saat eksekusi Fase 0)
