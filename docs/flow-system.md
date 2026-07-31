# Flow Sistem — Nurman Course (Post-Funnel)

## 1. Alur Login & Pendaftaran

```
User daftar dari funnel (WA) → data nama, umur, jenis kelamin, nama orang tua, nomor hape
Admin/orang tua login (Supabase Auth)
→ Dashboard orang tua → "Kelas Saya"
```

**Detail fields:**
- Nama lengkap (siswa)
- Umur
- Jenis kelamin
- Nama orang tua (wali)
- Nomor hape (untuk notifikasi)

## 2. Dashboard Orang Tua

- **Progress Anak** (per kelas aktif)
- **Materi yang sedang dipelajari** (outline garis besar)
- **Jadwal** (jam mulai/selesai)
- **Status tagihan** (kalau sudah masuk Fase 4)

## 3. Halaman Materi Detail

**Kelas yang didukung sekarang:**
- **Calistung**
- **Ngaji**

**Materi per kelas contoh:**

**Kelas Ngaji:**
- Keterangan: IQRO berapa, halaman berapa
- Al-Quran: Surat + Ayat (misal: Al-Fatihah 1-7)
- Keterangan tambahan
- Jam mulai / selesai

**Kelas Calistung:**
- Outline garis besar (tanpa detail IQRO/Al-Quran)

**Roadmap saran saya:**
- Buat 1 table `roadmap_steps` dengan:
  - program_id
  - order
  - title
  - body_text (Markdown)
  - level (opsional)
  - duration_hours (untuk ngaji/calistung)

Contoh untuk Ngaji:
- Step 1: IQRO 1-2, halaman 1-15
- Step 2: Al-Quran Surah Al-Fatihah ayat 1-7, dll.

**Progres per hari:**
- Simpan di table `progress_tracking` (user_id, step_id, completed, date)

**Konten materi:**
- Simpan di table `material_items` (body_text = Markdown)
- Admin edit via /admin/dashboard

## 4. Admin Panel Sederhana

- CRUD Program (Ngaji, Calistung)
- CRUD Roadmap Step
- CRUD Material Items
- Lihat progres anak (per siswa)

## 5. Integrasi Funnel

- Tetap pakai query params `?materi=ngaji` atau `?program=calistung`
- Setelah daftar, orang tua bisa login langsung

**Next task:**
- Buat model data lengkap di `docs/erd-lms.md`
- Update seed data di Supabase
- Mulai Fase 1 (Auth + DB setup)