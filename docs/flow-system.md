# Flow Sistem — Nurman Course (LMS Area)

Dokumen ini menjelaskan alur navigasi dan interaksi pengguna berdasarkan 3 peran utama: **Wali Murid**, **Tentor (Tentor)**, dan **Admin**.

---

## 1. Alur Pembuatan Akun & Pendaftaran

1. **Pendaftaran Awal**: Calon wali murid melakukan pendaftaran les melalui funnel marketing `/course` (WhatsApp).
2. **Pembuatan Akun (Admin)**: Admin memproses data pendaftar dan membuatkan akun secara manual melalui panel admin:
   - Membuat akun **User** dengan role `wali`.
   - Membuat entitas **Murid** (anak) yang dihubungkan ke akun `wali` tersebut.
   - Menghubungkan murid ke program belajar (`Enrollment`).
   - Membuatkan akun tentor jika tentor tersebut baru (`User` dengan role `tentor`).
3. **Login Pertama**: Wali murid menerima kredensial akun dari admin, lalu melakukan login di `/login`.

---

## 2. Alur Pengguna: Wali Murid (Orang Tua)

Setelah login, wali murid dialihkan ke `/app/dashboard` (dashboard wali):

1. **Pilih Murid (Multi-Anak)**: Jika wali memiliki lebih dari 1 anak yang terdaftar, wali memilih anak mana yang ingin dipantau.
2. **Dashboard Anak**:
   - **Progress Peta Jalan**: Menampilkan langkah roadmap yang sedang ditempuh dan persentase penyelesaian modul (misal: "Iqra 2 - Langkah 2/6").
   - **Jadwal Belajar**: Kalender/daftar sesi privat yang akan datang di rumah siswa.
   - **Laporan Harian Terbaru**: Ringkasan laporan harian terakhir yang ditulis oleh tentor.
   - **Ringkasan Tagihan**: Status tagihan minggu ini (Belum Dibayar / Lunas / Menunggu Konfirmasi).
3. **Detail Laporan Harian**: Wali membuka tab "Laporan Sesi" untuk membaca rincian tanggal, jam belajar, materi yang dibahas, dan catatan pribadi tentor untuk setiap pertemuan.
4. **Detail Laporan Perkembangan**: Wali membuka tab "Laporan Perkembangan" untuk membaca laporan evaluasi berkala per blok pertemuan (setiap 10 atau 12 sesi).
5. **Konfirmasi Pembayaran**: Wali membuka tab "Tagihan", mengunggah bukti transfer bank, lalu menekan tombol "Konfirmasi WhatsApp" untuk mengirim pesan konfirmasi otomatis ke admin.

---

## 3. Alur Pengguna: Tentor (Tentor)

Setelah login, tentor dialihkan ke `/app/dashboard` (atau dashboard tentor):

1. **Agenda Sesi**: Tentor melihat daftar jadwal mengajar privat terdekat (nama murid, program, hari, tanggal, jam, alamat rumah siswa).
2. **Input Laporan Harian**:
   - Setelah selesai mengajar kelas privat, tentor membuka sesi tersebut lalu mengklik "Tulis Laporan Harian".
   - Mengisi data: Tanggal, Jam Mulai, Jam Selesai, Laporan Kegiatan/Materi yang Dibahas hari itu, dan Catatan Tentor (misalnya: tingkat fokus anak, halaman yang dicapai).
   - Menyimpan laporan (status sesi berubah menjadi `completed`).
3. **Input Laporan Perkembangan**:
   - Ketika murid menyelesaikan jumlah sesi tertentu sesuai konfigurasi program (misal 12x sesi `Ngaji`), sistem menampilkan tombol "+ Buat Laporan Perkembangan" pada dashboard tentor.
   - Tentor mengisi form evaluasi: Capaian Anak, Materi yang Sudah Dipelajari, Materi yang Masih Belum Dikuasai, dan Catatan/Saran Tentor.
   - Laporan ini langsung muncul di dashboard wali murid setelah disimpan.

---

## 4. Alur Pengguna: Admin

Setelah login, admin dialihkan ke `/app/admin` (portal admin):

1. **Dashboard Ringkasan**: Melihat jumlah murid aktif, tentor aktif, tagihan tertunda, dan jumlah pembayaran yang menunggu persetujuan.
2. **Kelola Pengguna**:
   - Membuat akun Tentor dan Wali Murid.
   - Membuat data Murid dan menghubungkannya dengan Wali Murid yang tepat.
   - Mengatur Enrollment murid ke Program belajar.
3. **Kelola Master Program & Roadmap**:
   - Mengatur parameter program les (termasuk batas sesi per blok `sessionsPerBlock`).
   - Menyusun modul roadmap dan materi teks.
4. **Kelola Jadwal & Penugasan**:
   - Membuat jadwal sesi baru dan menugaskan Tentor untuk mengajar Murid tertentu.
5. **Verifikasi Pembayaran**:
   - Memeriksa bukti transfer yang diunggah wali murid.
   - Menyetujui bukti transfer (mengubah status tagihan menjadi `paid`/Lunas).
