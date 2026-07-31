# Google Stitch UI Design Prompts - LMS Nurman Course

Folder ini berisi kumpulan prompt terstruktur yang dirancang khusus untuk membuat prototipe UI/UX LMS Sederhana Nurman Course menggunakan Google Stitch.

Setiap file prompt bersifat mandiri (self-contained), memuat deskripsi aplikasi, design system terperinci (warna, tombol, glassmorphism), dan instruksi tata letak halaman yang spesifik.

## Daftar File & Halaman

### Area Peserta
1. **`00-login-register.md`**: Halaman masuk dan pendaftaran akun.
2. **`01-dashboard-peserta.md`**: Dashboard utama siswa dengan status belajar, sesi terdekat, dan ringkasan tagihan.
3. **`02-katalog-program.md`**: Daftar seluruh program les yang ditawarkan.
4. **`03-detail-program-roadmap.md`**: Detail program beserta peta jalan (roadmap) langkah belajarnya.
5. **`04-materi-belajar.md`**: Halaman membaca materi teks per langkah roadmap atau sesi.
6. **`05-jadwal-sesi.md`**: Kalender atau daftar jadwal pertemuan belajar terstruktur.
7. **`06-tagihan-peserta.md`**: Halaman detail invoice, status pembayaran, dan instruksi transfer.

### Area Admin
8. **`07-dashboard-admin.md`**: Ringkasan pengelolaan LMS (jumlah peserta, program aktif, tagihan tertunda).
9. **`08-kelola-program.md`**: Panel manajemen/CRUD Program.
10. **`09-kelola-roadmap-step.md`**: Panel penyusunan modul/langkah belajar (RoadmapStep).
11. **`10-kelola-materi.md`**: Editor konten teks materi (MaterialItem).
12. **`11-kelola-jadwal.md`**: Panel CRUD jadwal sesi belajar.
13. **`12-kelola-tagihan.md`**: Panel pemantauan dan persetujuan manual tagihan (Invoice).

---

## Panduan Penggunaan di Google Stitch

1. **Gunakan Secara Bertahap**: Jangan masukkan semua file sekaligus. Buat project baru, lalu paste `00-login-register.md` untuk menghasilkan halaman pertama.
2. **Gunakan Fitur 'Add Screen'**: Setelah halaman pertama berhasil digenerate, tambahkan screen baru di Stitch, kemudian copy-paste file prompt berikutnya (misalnya `01-dashboard-peserta.md`).
3. **Detail Konsistensi**: Setiap prompt sudah menyertakan instruksi styling yang identik (seperti warna `#4a70a9` dan border `bg-white/50 border border-white/70`). Hal ini untuk memastikan Stitch menghasilkan desain yang konsisten di semua halaman.
4. **Iterasi Kecil**: Jika Stitch melewatkan komponen tertentu atau salah layout, gunakan instruksi koreksi kecil secara bertahap (misal: `"Pindahkan tombol Keluar ke pojok kanan atas sidebar"` atau `"Ubah warna badge menjadi hijau"`).
