# Rencana Implementasi: Redesign Mobile-First Portal Wali Murid

## Status Dokumen
- **Status:** Draft Siap Eksekusi
- **Inisiatif:** Transformasi Portal Wali Murid (`/app/*` wali group) menjadi murni **Mobile-First App** (Viewport Smartphone `max-w-md` terpusat di desktop), mengadopsi Design System Google Stitch **Warm Academic Portal** (`Playfair Display` + `DM Sans`, canvas `#F7F4EF`, card putih solid ber-shadow ambient).
- **Keputusan Scope:** Tampilan web desktop untuk wali **ditiadakan**. Pada layar lebar/desktop, antarmuka tetap berbentuk aplikasi mobile yang berada di tengah layar (`max-w-md mx-auto`), SideNavBar desktop dihilangkan, Bottom Navigation dan TopBar mobile menjadi navigasi universal.

---

## 🎯 Tujuan & Filosofi Desain
1. **True Mobile-First Experience**: Mengeliminasi dualitas layout (SideNav desktop vs BottomBar mobile). Wali murid diperlakukan 100% sebagai pengguna mobile/aplikasi saku.
2. **Adopsi Google Stitch Warm Academic Portal**:
   - Canvas dasar hangat: `#F7F4EF` (mengurangi silau dan memberi kesan editorial ramah).
   - Tipografi: **Playfair Display** untuk sapaan & heading utama; **DM Sans** untuk teks konten, tabel/list, dan angka metrik.
   - Kartu: Permukaan putih solid `#FFFFFF` dengan garis batas hangat `border-[#E5DDD0]` dan ambient shadow `0 1px 4px rgba(0, 0, 0, 0.08)`.
   - Warna Primer: Biru Akademik `#4A70A9`, Biru Lembut `#EAF0F8`, Aksen Emas/Pasir `#C8B99A`, Status Hijau `#16A34A`, Warning `#D97706`.

---

## 🏗️ Fase & Pembagian Task

### Fase 1: Shell & Fondasi Navigasi (`layout.tsx`)
Mengubah fondasi tata letak portal wali menjadi single-container mobile frame.

- [x] **Task 1.1: Refactor Layout Shell (`frontend/app/app/(wali)/layout.tsx`)**
  - [x] **Subtask 1.1.1:** Hapus SideNavBar desktop (`<nav className="hidden md:flex w-64 ...">`).
  - [x] **Subtask 1.1.2:** Ubah wrapper terluar menjadi full-height background canvas dengan centering:
    `min-h-screen bg-[#F0ECE1] flex justify-center selection:bg-[#4A70A9]/20`.
  - [x] **Subtask 1.1.3:** Bungkus konten dalam mobile frame:
    `<div className="w-full max-w-md min-h-screen bg-[#F7F4EF] flex flex-col relative shadow-2xl border-x border-[#E5DDD0]/60">`.
  - [x] **Subtask 1.1.4:** Buat TopBar universal (aktif di mobile maupun desktop) yang sticky di atas container: Avatar profil wali, sapaan/brand Nurman Course, notifikasi.
  - [x] **Subtask 1.1.5:** Buat BottomNavBar universal (aktif di mobile maupun desktop): Fixed di bagian bawah kontainer `max-w-md mx-auto` dengan shadow ambient `0 -4px 12px rgba(26,26,46,0.06)`, 5 menu (Program, Jadwal, Dashboard tengah raised, Laporan, Tagihan).

---

### Fase 2: Redesign Dashboard Wali (`dashboard/page.tsx`)
Menyesuaikan dashboard wali dengan referensi screen Stitch (`195d728dc55a4fd196ce1a81ca170a8c`).

- [x] **Task 2.1: Layout Stacked Mobile Dashboard**
  - [x] **Subtask 2.1.1:** Header sambutan personal: "Halo, [Nama Wali]" dengan font `Playfair Display` + subteks "Selamat datang kembali".
  - [x] **Subtask 2.1.2:** Child selector horizontal pills scrollable dengan dot status aksen emas.
  - [x] **Subtask 2.1.3:** Alert Tagihan Jatuh Tempo (banner amber `#FEF3C7` border `#D97706`, link "Bayar Sekarang →").
  - [x] **Subtask 2.1.4:** Card Program Aktif: Label "PROGRAM AKTIF", badge hijau "● Aktif", nama program Playfair, nama tentor, metrik grid 2 kolom (Paket Sesi & Progres Belajar).
  - [x] **Subtask 2.1.5:** Card Sesi Terdekat (highlight card `#EAF0F8` border `#B8CDE4`): Tanggal Playfair, jam `Clock`, lokasi `Home`, badge countdown ("Besok / Hari ini"), topik/pengajar.
  - [x] **Subtask 2.1.6:** Card Rapor Capaian Terakhir: Tanggal sesi terakhir, materi diajarkan, status kehadiran 100%, kutipan catatan guru, dan link "Lihat Semua Laporan →".
  - [x] **Subtask 2.1.7:** Card Konsultasi Akademik / WhatsApp Support di bagian bawah.

---

### Fase 3: Redesign Halaman Tagihan (`tagihan/page.tsx`)
Menghapus komponen view tabel desktop dan menyelaraskan dengan screen Stitch (`61df6c75df0f49d2898b3847048fdcb4`).

- [x] **Task 3.1: Transformasi Murni Mobile Tagihan**
  - [x] **Subtask 3.1.1:** Hapus markup tabel desktop (`hidden md:block <table>`), beralih 100% ke mobile vertical cards.
  - [x] **Subtask 3.1.2:** Jadikan Card List riwayat pembayaran tersembunyi secara default (`showAllHistory = false`), hanya muncul bila wali menekan tombol "Lihat Riwayat".
  - [x] **Subtask 3.1.3:** Hero Card Tagihan Aktif: Badge status, rincian biaya paket & total tagihan Playfair/DM Sans, warning jatuh tempo, info transfer bank BCA dengan tombol Salin 1-klik (`content_copy`).
  - [x] **Subtask 3.1.4:** Area Upload Bukti Transfer & Form Prabayar collapsible dioptimalkan untuk mobile thumb-friendly.
  - [x] **Subtask 3.1.5:** Modal bukti pembayaran (`ProofModal`) disesuaikan agar proporsional di dalam batas frame `max-w-md`.
  - [x] **Subtask 3.1.6:** TopBar Mobile Stitch: Tombol back bulat ke dashboard, judul "Tagihan", subtitle "Kelola & Pembayaran Belajar", lonceng notifikasi, dan selector anak avatar inisial bulat.

---

### Fase 4: Redesign Halaman Jadwal Belajar (`jadwal/page.tsx`)
Menyelaraskan daftar jadwal dengan screen Stitch (`0530b9bdb32b49af82c66f8e0700c771`).

- [x] **Task 4.1: Penataan Sesi Mendatang & Riwayat Mobile**
  - [x] **Subtask 4.1.1:** Ubah tata letak Sesi Mendatang dari grid 2 kolom menjadi single-column vertical feed dengan badge counter sesi & action kalender.
  - [x] **Subtask 4.1.2:** Pertegas visual kartu sesi: Tag tanggal Playfair/DM Sans, badge status Terjadwal, detail waktu, nama tentor, dan tombol reschedule WA tentor full-width.
  - [x] **Subtask 4.1.3:** Susun Riwayat Pertemuan dengan status kehadiran (Hadir/Selesai, Menunggu Laporan, Dibatalkan), preview materi, dan tombol detail laporan.
  - [x] **Subtask 4.1.4:** Floating Action Button (FAB "Ajukan Perubahan Jadwal") diposisikan melayang tepat di atas Bottom Navigation di dalam kontainer mobile frame (`max-w-md mx-auto`).
  - [x] **Subtask 4.1.5:** TopBar Mobile Stitch: Tombol back bulat ke dashboard, judul "Jadwal Belajar", subtitle "Portal Wali Murid", tombol notifikasi bulat, dan selector anak avatar inisial bulat.

---

### Fase 5: Redesign Halaman Laporan Belajar (`laporan/page.tsx`)
Menyelaraskan laporan belajar harian dan perkembangan dengan screen Stitch (`cdfc63d3c41e49babdd9ef98acacea0e`).

- [x] **Task 5.1: Tab & Card Laporan Mobile**
  - [x] **Subtask 5.1.1:** Toggle Tab (Laporan Harian vs Laporan Perkembangan) dibuat seimbang dengan gaya segmented control Stitch (`bg-[#f0ebe3] p-1`).
  - [x] **Subtask 5.1.2:** Kartu Laporan Harian: Badge program ber-dot, grid waktu 2 kolom, avatar inisial tentor, quote box beraksen emas pasir `#c8b99a`, tombol WA hijau bulat di kanan atas, pagination "Tampilkan Lebih Banyak".
  - [x] **Subtask 5.1.3:** Kartu Laporan Perkembangan: Header Evaluasi Blok Pertemuan & arsip, badge sesi selesai, checklist capaian hijau, bento grid 2 kolom (Materi Dikuasai vs Perlu Latihan), quote box rekomendasi guru berborder emas, tombol utama Unduh Rapor PDF & konsultasi WA.
  - [x] **Subtask 5.1.4:** Header Mobile Stitch: Back button bulat, icon notifikasi dan filter, child selector avatar inisial bulat persis screen cdfc63d.

---

### Fase 6: Redesign Halaman Program & Profil (`program/page.tsx`, `profile/page.tsx`)
Menyesuaikan halaman sisa di portal wali agar konsisten dengan shell mobile.

- [ ] **Task 6.1: Program Anak & Profil Wali Mobile**
  - **Subtask 6.1.1:** Halaman Katalog & Detail Program Anak (`program/page.tsx`, `program/[slug]/page.tsx`): Card program berorientasi vertikal mobile.
  - **Subtask 6.1.2:** Halaman Profil Wali (`profile/page.tsx`): Form identitas, daftar anak, dan tombol keluar di dalam batas `max-w-md`.

---

### Fase 7: Verifikasi & Audit Kualitas
- [ ] **Task 7.1: Build, Typecheck & Visual Testing**
  - **Subtask 7.1.1:** Jalankan `npx next build` di workspace frontend untuk memastikan 0 compile/type error.
  - **Subtask 7.1.2:** Pastikan tidak ada horizontal scrollbar atau clipping di viewport 360px–430px maupun saat dibuka di layar monitor desktop (1920x1080).
  - **Subtask 7.1.3:** Sinkronisasi dokumentasi `docs/PROGRESS.md` dan checklist `tasks/todo.md`.
