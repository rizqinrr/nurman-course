# Google Stitch UI Design Prompts - LMS Nurman Course (3-Role Model)

Folder ini berisi kumpulan prompt terstruktur yang dirancang untuk membuat prototipe UI/UX LMS Sederhana Nurman Course menggunakan Google Stitch berdasarkan model 3 peran: **Wali Murid**, **Pengajar (Tentor)**, dan **Admin**.

Setiap file prompt bersifat mandiri (self-contained), memuat deskripsi aplikasi, design system terperinci (warna, tombol, glassmorphism), dan instruksi tata letak halaman yang spesifik.

## Daftar File & Halaman

### Area Wali Murid (Orang Tua)
1. **`00-login-register.md`**: Halaman masuk dan pendaftaran akun.
2. **`01-dashboard-wali.md`**: Dashboard utama orang tua dengan pilihan anak (jika >1), status belajar, sesi terdekat, dan ringkasan tagihan.
3. **`02-katalog-program.md`**: Daftar seluruh program les aktif yang diikuti anak.
4. **`03-detail-program-roadmap.md`**: Peta jalan (roadmap) langkah belajar anak dan status penyelesaian.
5. **`04-materi-belajar.md`**: Tampilan materi teks yang sedang dipelajari anak.
6. **`05-jadwal-sesi.md`**: Daftar jadwal pertemuan les anak di rumah siswa.
7. **`06-tagihan-wali.md`**: Halaman rincian invoice, status bayar, petunjuk transfer bank, dan upload bukti pembayaran.

### Area Admin (Pengelola)
8. **`07-dashboard-admin.md`**: Ringkasan pengelolaan LMS (jumlah peserta, pengajar, tagihan tertunda, dan verifikasi pembayaran).
9. **`08-kelola-program.md`**: Panel manajemen/CRUD Program les (termasuk batas sesi per blok `sessionsPerBlock`).
10. **`09-kelola-roadmap-step.md`**: Panel penyusunan modul/langkah belajar (RoadmapStep) per program.
11. **`10-kelola-materi.md`**: Editor konten teks materi (MaterialItem) per langkah belajar.
12. **`11-kelola-jadwal.md`**: Panel CRUD jadwal sesi belajar (assign program, pengajar, murid, tanggal, jam).
13. **`12-kelola-tagihan.md`**: Panel pemantauan dan persetujuan manual pembayaran tagihan (Invoice).

### Area Pengajar (Tentor)
14. **`13-dashboard-pengajar.md`**: Dashboard utama pengajar dengan agenda mengajar terdekat (sesi privat).
15. **`14-input-laporan-harian.md`**: Form pengisian laporan kegiatan harian setelah mengajar selesai (jam mulai/selesai, aktivitas, catatan).
16. **`15-laporan-perkembangan.md`**: Form evaluasi belajar anak per blok sesi (capaian, materi dikuasai/belum, saran).

---

## Panduan Penggunaan di Google Stitch

1. **Gunakan Secara Bertahap**: Jangan masukkan semua file sekaligus. Buat project baru, lalu paste `00-login-register.md` untuk menghasilkan halaman pertama.
2. **Gunakan Fitur 'Add Screen'**: Setelah halaman pertama berhasil digenerate, tambahkan screen baru di Stitch, kemudian copy-paste file prompt berikutnya secara berurutan.
3. **Detail Konsistensi**: Setiap prompt sudah menyertakan instruksi styling yang identik (seperti warna `#4a70a9` dan border `bg-white/50 border border-white/70`). Hal ini untuk memastikan Stitch menghasilkan desain yang konsisten di semua halaman.
4. **Iterasi Kecil**: Jika Stitch melewatkan komponen tertentu atau salah layout, gunakan instruksi koreksi kecil secara bertahap (misal: `"Pindahkan tombol Keluar ke pojok kanan atas sidebar"` atau `"Ubah warna badge menjadi hijau"`).
