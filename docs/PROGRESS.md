### 2026-10-24 — Penyeragaman Menyeluruh Style Navbar Semua Halaman Luar (Patokan: /materi)

**Request:**
1. Menyeragamkan ukuran kontainer navbar di semua halaman luar (`/`, `/materi`, `/cek-rute`, `/jangkauan`) dengan patokan ukuran landing page utama (`max-w-[1140px]`).
2. Menghapus teks badge "Belajar Mandiri" di samping logo nCourse pada halaman materi.
3. Menghapus tombol teks "Beranda" terpisah; klik logo nCourse menjadi akses utama kembali ke beranda.
4. Menyeragamkan style tombol kanan navbar (`Masuk` & `Mulai Belajar`) agar 100% identik dengan tombol `Koleksi saya` (border card) dan `Portal Siswa` (navy pill solid).

**Keputusan & Perubahan:**
1. **[`ContentShell.tsx`](file:///d:/01_Coding\www\nurman-course\frontend\components\content\ContentShell.tsx):**
   - Menghapus teks badge `"Belajar Mandiri"`.
   - Menghapus tombol teks `"Beranda"` terpisah (klik logo nCourse langsung kembali ke `/`).
   - Ukuran kontainer navbar diatur ke `max-w-[1140px] mx-auto px-4 sm:px-6 h-16`.
2. **[`Landing2Nav.tsx`](file:///d:/01_Coding\www\nurman-course\frontend\components\landing2\Landing2Nav.tsx) (dipakai di `/`, `/cek-rute`, `/jangkauan`):**
   - Mengubah tombol **Masuk** menjadi gaya border button:
     `inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-[#d9d2c2] bg-[#fffdf9] px-2.5 sm:px-3 text-xs sm:text-sm font-bold text-[#14233a] shadow-xs hover:border-[#4a70a9] hover:bg-[#f7f5ef]`.
   - Mengubah tombol **Mulai Belajar** menjadi gaya solid navy button:
     `inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-[#2e4b7a] px-3 sm:px-3.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#22395e]`.
   - Ukuran kontainer konsisten `max-w-[1140px] mx-auto px-4 sm:px-6 h-16`.

**Verifikasi:**
- `npm run lint --workspace=frontend`: Lolos (0 error, 0 warning).
- `npx tsc --project frontend/tsconfig.json --noEmit`: Lolos (0 error).
- `node --test frontend/tests/dashboard-surface.test.mjs frontend/tests/auth-surface.test.mjs frontend/tests/course-funnel.test.mjs`: Lolos (14/14 tests pass).

### 2026-10-24 — Penyelarasan Style Navbar /materi (Belajar Mandiri) dengan Halaman Utama

**Request:**
Memberikan akses ke halaman utama (`/`) dari halaman `http://localhost:3000/materi`, menyamakan style navigasi dengan navbar halaman utama (Warm Paper `#fffdf9` dengan border `#d9d2c2`), namun tetap mempertahankan tautan `Katalog`, `Jalur belajar`, `Koleksi saya`, dan `Portal Siswa`.

**Keputusan & Perubahan:**
1. **Shell Materi (`frontend/components/content/ContentShell.tsx`):**
   - Mengubah background dan border header dari style abu-abu lama (`#f1f5f8` / `#c7d4e2`) menjadi style Warm Paper yang seragam dengan halaman utama (`bg-[#fffdf9] border-b border-[#d9d2c2]`).
   - Logo nCourse kini mengarah ke Halaman Utama (`/`).
   - Menambahkan navigasi penghubung ke halaman utama:
     - Tautan langsung **Beranda** (`/`).
     - Dropdown **Program Lain** (Kelas Bimbingan & Les Privat guru ke rumah).
     - Dropdown **Layanan & Area** (Peta Jangkauan & Cek Rute).
   - Mempertahankan tautan inti materi:
     - **Katalog** (`/materi`)
     - **Jalur belajar** (`/jalur-belajar`)
     - **Koleksi saya** (`/app/materi`)
     - **Portal Siswa** (`/app/dashboard`)
   - Drawer mobile responsif untuk layar HP yang memuat seluruh menu materi dan navigasi program nCourse.
   - Menambahkan tautan "Halaman Utama" di bagian footer `ContentShell`.

**Verifikasi:**
- `npm run lint --workspace=frontend`: Lolos (0 error, 0 warning).
- `npx tsc --project frontend/tsconfig.json --noEmit`: Lolos (0 error).
- `node --test frontend/tests/dashboard-surface.test.mjs frontend/tests/auth-surface.test.mjs frontend/tests/course-funnel.test.mjs`: Lolos (14/14 tests pass).

### 2026-10-24 — Penyeragaman Navbar di /cek-rute dan /jangkauan dengan Halaman Utama

**Request:**
Menyeragamkan navbar pada halaman `http://localhost:3000/cek-rute` dan `http://localhost:3000/jangkauan` agar menggunakan navbar yang sama persis seperti halaman utama (`/`).

**Keputusan & Perubahan:**
1. **Halaman Cek Rute (`frontend/app/cek-rute/page.tsx`):**
   - Mengganti komponen `CekRuteNav` dengan `Landing2Nav`.
   - Navbar di halaman peta interaktif rute kini konsisten menampilkan logo nCourse, dropdown "Program Belajar", dropdown "Layanan & Area", link FAQ, tombol Masuk, serta tombol Mulai Belajar.
2. **Halaman Peta Jangkauan (`frontend/app/jangkauan/page.tsx`):**
   - Mengganti komponen `CoverageNav` dengan `Landing2Nav`.
   - Navigasi atas seragam dengan halaman utama baik di desktop maupun mobile drawer akordeon.

**Verifikasi:**
- `npm run lint --workspace=frontend`: Lolos (0 error, 0 warning).
- `npx tsc --project frontend/tsconfig.json --noEmit`: Lolos (0 error).
- `node --test frontend/tests/dashboard-surface.test.mjs frontend/tests/auth-surface.test.mjs frontend/tests/course-funnel.test.mjs`: Lolos (14/14 tests pass).

### 2026-10-24 — Perampingan Navbar Landing Page Utama dengan 2 Menu Dropdown

**Request:**
Menggabungkan deretan link navbar di `http://localhost:3000/` agar lebih ramping dan bersih dengan interaksi klik/hover memunculkan dropdown.

**Keputusan & Perubahan:**
1. **Pemisahan 2 Menu Dropdown ([`Landing2Nav.tsx`](file:///d:/01_Coding/www/nurman-course/frontend/components/landing2/Landing2Nav.tsx)):**
   - **Dropdown "Program Belajar"**: Menampung 3 Jalur Belajar nCourse lengkap dengan ikon dan deskripsi singkat:
     - *Belajar Mandiri* (`/materi`)
     - *Kelas Bimbingan* (`/course/materi`)
     - *Les Privat Guru ke Rumah* (`/course/program`)
   - **Dropdown "Layanan & Area"**: Menampung fitur navigasi dan estimasi:
     - *Peta Jangkauan Les* (`/jangkauan`)
     - *Cek Rute & Biaya Transport* (`/cek-rute`)
   - Link langsung **Tanya Jawab (FAQ)** (`#faq`).
2. **Interaktivitas & UX Desktop:**
   - Mendukung **Hover** sekaligus **Klik** tombol dropdown.
   - Dilengkapi *click outside listener* (`navRef`) untuk menutup dropdown saat user mengklik di luar area menu.
   - Desain kartu dropdown mengikuti tema Warm Paper (`#fffdf9`, border `#d9d2c2`, shadow halus).
3. **Mobile Drawer Akordeon:**
   - Di layar mobile/HP, dropdown disajikan sebagai menu lipat (akordeon) yang rapi dan mudah dijangkau dengan jempol.

**Verifikasi:**
- `npm run lint --workspace=frontend`: Lolos (0 error, 0 warning).
- `npx tsc --project frontend/tsconfig.json --noEmit`: Lolos (0 error).
- `node --test frontend/tests/dashboard-surface.test.mjs frontend/tests/auth-surface.test.mjs frontend/tests/course-funnel.test.mjs`: Lolos (14/14 tests pass).

### 2026-10-24 — Landing Page Opsi 2 (3 Jalur Belajar) Menjadi Landing Utama (/)

**Request:**
Menjadikan halaman landing yang sebelumnya berada di `/landing2` sebagai halaman landing page utama aplikasi di root (`/`), sehingga pengguna langsung melihat landing page interaktif lengkap tanpa perlu mengakses `/landing2`.

**Keputusan & Perubahan:**
1. **Root Page (`frontend/app/page.tsx`):**
   - Menghapus redirect lama ke `/landing`.
   - Mengubah `frontend/app/page.tsx` menjadi halaman landing utama yang menyajikan komponen interaktif lengkap: `Landing2Nav`, `Landing2Hero`, `Landing2Facts`, `Landing2PathChoice`, `CourseCatalogInteractive`, `PrivateTutoringSection`, `VennBridgeSection`, `FaqInteractiveSection`, `Landing2Cta`, dan `Landing2Footer`.
   - Menyalin file style interaktif ke `frontend/app/landing-interactive.css`.
2. **Backward Compatibility & Redirects:**
   - `frontend/app/landing2/page.tsx`: Dikonversi menjadi redirect instan ke `/`.
   - `frontend/app/landing/page.tsx`: Dikonversi menjadi redirect instan ke `/`.
3. **Penyelarasan Tautan Navigasi & Footer:**
   - Mengubah href logo brand dan link "Beranda" dari `/landing2` / `/landing` menjadi `/` di `Landing2Nav.tsx`, `Landing2Footer.tsx`, `CekRuteNav.tsx`, `CoverageNav.tsx`, dan `frontend/app/login/page.tsx`.
   - Di `Landing2Footer.tsx`, menghapus switcher lama ("Versi Landing 1" vs "Landing 2 Eksperimen") dan menggantinya dengan tautan standar yang rapi ("Beranda", "Belajar Mandiri", "Les Privat").

**Verifikasi & Batas Bukti:**
- `npm run lint --workspace=frontend`: Lolos (0 error, 0 warning).
- `npx tsc --project frontend/tsconfig.json --noEmit`: Lolos (0 error).
- `node --test frontend/tests/dashboard-surface.test.mjs frontend/tests/auth-surface.test.mjs frontend/tests/course-funnel.test.mjs`: Lolos (14/14 tests pass).
- *Batas bukti*: Verifikasi dijalankan di workspace frontend lokal.

### 2026-10-24 — Restrukturisasi Alur Siswa, 3 Jalur Belajar, & Portal Tentor Mobile-First + Direct Chat WA

**Request:**
Merestrukturisasi alur aplikasi **nCourse** menjadi 3 peran terpadu (`Admin`, `Tentor`, `Siswa` dengan konsep `1 Akun = 1 Siswa`), menampilkan 3 jalur belajar jelas di Landing Page (`Belajar Mandiri`, `Kelas Bimbingan`, `Les Privat`), menyatukan Ruang Materi Mandiri dan Portal Wali menjadi **Portal Siswa** (termasuk memperbaiki tombol Logout yang sebelumnya tersembunyi di `/app/materi`), serta merombak **Portal Tentor** menjadi *Warm Paper Mobile-First* dengan fitur **Direct Chat WA / Kabari via WA** untuk komunikasi laporan ke siswa/orang tua.

**Keputusan & Perubahan:**
- **Fase 1 — Mockup A: Portal Siswa Mobile-First (`SWA-1.1` s/d `SWA-1.5`):**
  - `frontend/lib/navigation.ts` & `frontend/middleware.ts`: Mendukung role `siswa`, `wali`, dan `member` menuju `/app/dashboard` (Portal Siswa) dan `/app/materi`.
  - `frontend/app/app/(wali)/layout.tsx`: Header identitas **Portal Siswa**, pintasan **"Baca Materi"**, link Profil, dan tombol **Keluar (Logout)** merah yang jelas di mobile top bar.
  - `frontend/app/app/(wali)/dashboard/page.tsx`: Beranda Siswa terpadu yang menggabungkan kartu **Belajar Mandiri** (`getLibrary({ limit: 5 })` + pintasan `/app/materi` & `/app/program`), **Kelas Bimbingan / Les Privat Aktif**, **Sesi Belajar Berikutnya**, **Laporan Sesi Terakhir**, dan **Tagihan Menunggu Pembayaran**.
  - `frontend/app/app/materi/page.tsx` & `frontend/components/content/ContentShell.tsx`: Menambahkan tombol **"Beranda Siswa"** dan tombol merah **"Keluar"** langsung di header atas `/app/materi` sehingga user tidak lagi kesulitan mencari tombol logout.
  - `frontend/app/app/(wali)/jadwal/page.tsx`, `laporan/page.tsx`, `program/page.tsx`, `profile/page.tsx`, dan `frontend/app/app/page.tsx`: Penyesuaian sudut pandang **Siswa** (termasuk informasi Kontak Orang Tua/Wali pada profil siswa).
- **Fase 2 — Mockup B: Portal Tentor Mobile-First & Direct Chat WA (`SWA-2.1` s/d `SWA-2.5`):**
  - `frontend/app/app/tentor/layout.tsx`: Redesign dari tema biru glassmorphism `#6d8fc4` menjadi tema kontras tinggi **Warm Paper (`#F7F4EF`)** dengan border `#E5DDD0`, mobile top bar + tombol Logout, dan bottom bar 5 menu.
  - `frontend/app/app/tentor/dashboard/page.tsx` & `jadwal/page.tsx`: Kartu sesi dengan tombol **Direct Chat WA** (`bg-[#15803d]`) ke nomor WhatsApp siswa/orang tua dan tombol **Maps** untuk alamat rumah.
  - `frontend/app/app/tentor/laporan-harian/LaporanHarianClient.tsx` & `laporan-perkembangan/LaporanPerkembanganClient.tsx`: Tema Warm Paper Mobile-First serta tombol **"Kabari WA" / "Kabari via WA"** dengan pesan otomatis sekali klik setelah laporan disimpan di aplikasi.
  - `frontend/app/app/tentor/profil/page.tsx`: Tema Warm Paper dan daftar **Siswa Ditugaskan**.
- **Fase 3 — Mockup C: Landing Page 3 Jalur, Funnel Kelas Bimbingan, & Login 3 Peran (`SWA-3.1` s/d `SWA-3.4`):**
  - `frontend/components/landing2/Landing2PathChoice.tsx`, `Landing2Nav.tsx`, `Landing2Hero.tsx`: Menampilkan 3 kartu jalur belajar utama (**Belajar Mandiri**, **Kelas Bimbingan** Privat/Grup Kecil, **Les Privat** tentor ke rumah).
  - `frontend/app/course/program/page.tsx` & `frontend/app/course/config/CourseConfigClient.tsx`: Penyesuaian istilah **Kelas Bimbingan Materi & Proyek**, **Les Privat**, serta opsi peserta `1 orang (Privat)`, `2 orang (Grup Kecil)` (`Hemat 20% / siswa`), dan `3 orang (Grup Kecil)` (`Hemat 35% / siswa`) dengan tetap menjaga otoritas rumus harga tunggal di `CourseConfigClient.tsx`.
  - `frontend/app/login/page.tsx`: Quick-fill development disederhanakan untuk **Siswa**, **Tentor**, dan **Admin**.
- **Fase 4 — Backend & Shared Schema Role `siswa` (`SWA-4.1` s/d `SWA-4.5`):**
  - `packages/shared/src/index.ts` & `backend/src/middleware/auth.ts`: Menambahkan role `"siswa"` pada `UserRole`, `userRoleSchema`, `manageableRoleSchema`, dan `requireOperational`.
  - `backend/prisma/schema.prisma`: Menambahkan field opsional `parentName` dan `parentPhone` pada model `Murid`.
  - `backend/src/index.ts`: Seluruh endpoint `/api/me/*` (`sessions`, `daily-reports`, `progress-reports`, `enrollments`, `invoices`, `prepayments`, `notifications`, `progresses`) melayani role `siswa` setara `wali`.

**Verifikasi & Batas Bukti:**
- `npm run lint --workspace=frontend`: lolos 0 error, 0 warning.
- `npx tsc --project frontend/tsconfig.json --noEmit`: lolos 0 error.
- `node --test frontend/tests/dashboard-surface.test.mjs frontend/tests/auth-surface.test.mjs frontend/tests/course-funnel.test.mjs`: lolos 14/14 test.
- `npm run typecheck --workspace=backend` & `npm run lint --workspace=backend`: lolos 0 error.
- `impeccable detect`: 0 error, 0 warning (seluruh temuan `side-tab` dan `backdrop-blur` telah dibersihkan).
- *Batas bukti*: Perubahan schema Prisma (`parentName`, `parentPhone`) bersifat additive dan belum dijalankan `prisma migrate` maupun backfill mutasi data pada DB lokal `nurmancourse` tanpa instruksi eksplisit.

### 2026-10-24 — Rebrand Menyeluruh Menjadi "nCourse"

**Request:** 
Mengubah branding dari "Nurman Course" menjadi "nCourse" (format camelCase dengan penekanan huruf C pada Course) secara menyeluruh di seluruh antarmuka web, metadata, navigasi, footer, halaman peta/jangkauan, portal operasional, dan template chat WhatsApp.

**Keputusan & Perubahan:**
- **Format Brand**: `nCourse` (dengan wordmark logo `n`<span className="text-[#4a70a9]">Course</span> pada navbar utama dan aksen gold `n`<span className="text-[#f2c14e]">Course</span> pada dashboard admin/footer gelap).
- **Metadata Root & Halaman**:
  - `frontend/app/layout.tsx`: `title.default: "nCourse - Les Privat & Belajar Web"`, `title.template: "%s | nCourse"`.
  - `frontend/app/landing2/page.tsx`: `title: "nCourse — Belajar Mandiri Bikin Web & Les Privat"`.
  - `frontend/app/landing/page.tsx`: `title: "nCourse | Les Privat SD–SMP"`.
- **Navigasi & Header/Footer**:
  - `Landing2Nav.tsx`, `Landing2Footer.tsx`, `LandingNav.tsx`, `LandingFooter.tsx`, `CoverageNav.tsx`, `CekRuteNav.tsx`, `ContentShell.tsx` diubah seragam menampilkan `nCourse`.
- **Komponen Publik & Landing**:
  - `Landing2Cta.tsx`, `FaqInteractiveSection.tsx`, `FourStepsInteractive.tsx`, `PromoStage.tsx`.
  - `LandingAbout.tsx`, `LandingHero.tsx`, `LandingStats.tsx`, `LandingTestimonials.tsx`, `LandingTutors.tsx`.
  - `FeaturedPrograms.tsx`, `SocialProof.tsx`, `Testimonials.tsx`, `TutorCarousel.tsx`.
  - `CourseCornerLogo.tsx` dan `DebugBar.tsx`.
- **Data & Kalkulator Rute / Jangkauan**:
  - `frontend/data/coverage.ts`: `nCourse Hub (Pusat)`.
  - `frontend/lib/rute-biaya.ts`: `NAMA_TEMPAT: "nCourse"`.
  - `CoverageLocationChecker.tsx`, `CoverageFaq.tsx`, `CekRuteKartuHasil.tsx`: template pesan WhatsApp "Halo *nCourse* 👋" dan Hub nCourse.
  - `frontend/app/jangkauan/page.tsx`: link WA resmi nCourse.
- **Funnel & Portal Operasional**:
  - `CourseConfigClient.tsx` & `frontend/app/course/page.tsx`: template WA pendaftaran "Halo *nCourse* 👋", alt logo, dan title hero.
  - `frontend/app/app/page.tsx`: `nCourse / Portal`.
  - `(wali)/layout.tsx`: `nCourse`, `(wali)/dashboard/page.tsx`, `jadwal`, `laporan`, `program/[slug]`.
  - `admin/layout.tsx`: `nCourse`, `admin/rekening/page.tsx`: placeholder akun `nCourse`.
  - `tentor/layout.tsx`: `nCourse`, rapor cetak `LaporanHarianClient.tsx` & `LaporanPerkembanganClient.tsx`.
  - `login/page.tsx`: brand logo dan copy `nCourse`.
  - `useLogout.tsx`: pesan dialog portal `nCourse`.
  - `backend/src/index.ts`: pesan error resolver nomor WhatsApp `nCourse`.
  - `cek-jarak-biaya/`: update `NAMA_TEMPAT`, `index.html`, dan README.
  - `frontend/PRODUCT.md` & `DESIGN.md`: dokumentasi brand nCourse.

**Verifikasi:**
- `npm run lint --workspace=frontend`: lolos 0 error, 0 warning.
- `npx tsc --project frontend/tsconfig.json --noEmit`: lolos 0 error.
- `npm run typecheck --workspace=backend`: lolos 0 error.
- `npm run lint --workspace=backend`: lolos 0 error (14 pre-existing warnings).
- `npm run build --workspace=frontend`: lolos 44/44 static pages & dynamic routes.

### 2026-10-20 — Integrasi Halaman "Cek Rute & Biaya Transport" (/cek-rute & /cekrute) ke Monorepo

**Request:** 
Integrasi fitur cek rute jalan & estimasi biaya transport dari proyek mandiri ke dalam Next.js monorepo Nurman Course (`/cek-rute` dan alias `/cekrute`) dengan penyesuaian gaya visual (warm paper `#f7f5ef`, navy `#2e4b7a`, gold `#f2c14e`), proxy backend aman untuk API key ORS, dan integrasi CTA WhatsApp resmi.

**Keputusan & Implementasi:**
- **Secure Route Handlers (Proxy Next.js):**
  - `frontend/app/api/ors/directions/route.ts`: Server-side POST proxy ke ORS `v2/directions/driving-car`, membaca API Key via `process.env.ORS_API_KEY` (rahasia di server), mengonversi urutan koordinat `[lng, lat]` $\leftrightarrow$ `[lat, lng]` Leaflet, dan mengembalikan `jarakMeter`, `jarakKm`, `durasiDetik`, serta `koordinatRute`.
  - `frontend/app/api/ors/geocode/route.ts`: Server-side GET proxy ke ORS `geocode/search` dengan pembatasan negara Indonesia (`boundary.country=IDN`) dan maksimal 5 hasil terfilter.
- **Konfigurasi & Helper Domain (`frontend/lib/rute-biaya.ts`):**
  - Hub Utama: Titik les Nurman Course (Jl. Kolonel Sugiono No. 24, Cilacap: `[-7.728283, 109.014261]`).
  - Tarif: Rp 3.000 / km, Biaya minimum: Rp 10.000, Batas jangkauan: 15.0 km.
  - Formula: `max(BIAYA_MINIMUM, jarak_km * TARIF_PER_KM)` dibulatkan ke kelipatan Rp 1.000 terdekat.
  - Ditambahkan transparansi rincian kalkulasi (`getRincianBiaya`) agar wali murid memahami perhitungan riil dan logika minimum/kelipatan.
- **Klien API Fetcher (`frontend/lib/ors-client.ts`):**
  - Wrapper aman memanggil endpoint proxy internal `/api/ors/*` dari browser.
- **Komponen UI Berdesain Warm Paper (`frontend/components/cek-rute/`):**
  - `CekRuteNav.tsx`: Navbar responsif bergaya warm paper dengan logo ncourse, badge akurasi ORS, link navigasi, dan CTA konsultasi WhatsApp.
  - `CekRuteMap.tsx` & `CekRuteMapInner.tsx`: Leaflet canvas SSR-safe (`next/dynamic` dengan `ssr: false`), custom DOM marker (Hub navy-emas berdenyut dan pin rumah draggable dengan bayangan 2.5D), polyline rute indigo, dan auto `fitBounds` dinamis.
  - `CekRutePanelLokasi.tsx`: Bottom sheet mobile / side panel desktop dengan tombol GPS lazy-request, auto-search alamat debounced 500ms, dan mode klik di peta.
  - `CekRuteKartuHasil.tsx`: Kartu ringkasan jarak (km), estimasi durasi, breakdown tarif per kunjungan transparan, status jangkauan (peringatan jika >15 km), tombol "Ubah Lokasi", tombol "Reset", serta direct CTA WhatsApp pendaftaran les dengan template teks otomatis.
- **Halaman & Routing:**
  - `frontend/app/cek-rute/page.tsx`: Halaman utama full-screen responsive 4 tahap alur.
  - `frontend/app/cekrute/page.tsx`: Alias redirect 307 ke `/cek-rute`.
  - Tautan "Cek Rute" ditambahkan pada `Landing2Nav.tsx` dan `CoverageNav.tsx`.
  - Tile provider peta beralih dari CartoDB ke server resmi OpenStreetMap (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`) pada `CekRuteMapInner.tsx` dan `CoverageMapInner.tsx` agar 100% bebas dari batasan watermark/API key CartoDB.

**Verifikasi:**
- Next.js Production Build (`npm run build --workspace=frontend`): sukses 44/44 static pages, termasuk `/cek-rute`, `/cekrute`, dan kedua route handler `api/ors/*`.
- ESLint (`npm run lint --workspace=frontend`): lolos 0 error, 0 warning.
- TypeScript check (`npx tsc --project frontend/tsconfig.json --noEmit`): lolos 0 error.
- HTTP Endpoint Testing:
  - `GET http://localhost:3000/cek-rute`: HTTP 200 OK.
  - `GET http://localhost:3000/cekrute`: HTTP 307 Redirect ke `/cek-rute`.
  - `POST http://localhost:3000/api/ors/directions`: Berhasil mengembalikan koordinat rute, jarak (2.1 km), dan durasi (177.3s).
  - `GET http://localhost:3000/api/ors/geocode?q=Alun-alun+Cilacap`: Berhasil mengembalikan 5 saran geocoding akurat di Cilacap & sekitarnya.

### 2026-10-20 — Pembuatan Website "Cek Jarak & Biaya" (React + Vite + Leaflet + OpenRouteService)

**Request:** 
Membuat proyek website standalone "Cek Jarak & Biaya" menggunakan React (Vite), Leaflet (react-leaflet), dan OpenRouteService API, dengan bahasa Indonesia untuk seluruh UI dan komentar kode.

**Keputusan & Implementasi:**
- Dibuat pada direktori mandiri `cek-jarak-biaya/` dengan Vite + React 18 + Tailwind CSS.
- Konfigurasi terpusat di `src/config.js` (`NAMA_TEMPAT`, `TITIK_UTAMA`, `TARIF_PER_KM`, `BIAYA_MINIMUM`, `JARAK_MAKSIMAL_KM`, `ORS_API_KEY`).
- Perhitungan tarif dan format Rupiah di `src/utils/biaya.js` sesuai rumus `max(BIAYA_MINIMUM, jarak_km * TARIF_PER_KM)` dibulatkan ke kelipatan Rp 1.000 terdekat.
- Layanan OpenRouteService di `src/services/ors.js`:
  - Directions endpoint (`driving-car`) dengan konversi koordinat ORS `[lng, lat]` ke Leaflet `[lat, lng]`.
  - Geocoding search endpoint (`geocode/search`) dibatasi `boundary.country=IDN`, maksimal 5 saran, dengan debounce 500ms.
- Komponen terpisah:
  - `src/components/Map/MapComponent.jsx`: Leaflet Map full screen dengan perbaikan asset icon Vite di `leafletFix.js`, marker titik utama, marker user draggable, polyline rute, serta auto-fitBounds.
  - `src/components/PanelLokasi/PanelLokasi.jsx`: Bottom sheet mobile / side panel desktop dengan auto-request GPS, input ketik alamat, dan mode pilih di peta.
  - `src/components/KartuHasil/KartuHasil.jsx`: Menampilkan jarak jalan, durasi tempuh, estimasi biaya, penanganan batas >15 km (sembunyikan biaya dan beri peringatan), tombol ubah lokasi, dan tombol reset.
- Dokumentasi lengkap di `cek-jarak-biaya/README.md` dan `.env.example`.

**Verifikasi:**
- `npm install` di `cek-jarak-biaya`: sukses 134 packages.
- `npm run build`: sukses dalam 11.05s (0 error).
- Server dev berjalan di `http://localhost:5173`: HTTP 200 OK.

### 2026-10-19 — Peta Interaktif Jangkauan Layanan Les Privat (/jangkauan & /peta)

**Request:** 
Membuat halaman map interaktif untuk menampilkan peta geografis jangkauan les privat Nurman Course (area layanan, radius tentor datang ke rumah, dan cek lokasi wali murid).

**Keputusan:**
- Membuat route dedicated `/jangkauan` dan alias redirect `/peta`.
- Menggunakan Leaflet dengan OpenStreetMap / CartoDB Voyager tiles, dikemas dalam Next.js Client Component dengan dynamic import (`ssr: false`) dan fallback skeleton radar agar 100% bebas dari kendala SSR `window is not defined`.
- Menyusun data jangkauan di `frontend/data/coverage.ts`:
  - Hub Pusat: Jl. Kolonel Sugiono No. 24, Cilacap Kota.
  - Posko Tentor: Area Gumilir / Tritih Kulon, Cilacap Utara.
  - Zona 1 (Bebas Biaya Transport): Cilacap Tengah, Cilacap Selatan, Cilacap Utara (radius 3.5 - 4.2 km).
  - Zona 2 (Jangkauan Reguler): Kesugihan, Jeruklegi, Maos, Adipala, Kroya, Sampang (transport Rp 10.000 - Rp 15.000).
  - Zona 3 (Online): Sesi 1-on-1 interaktif via Google Meet / Zoom untuk seluruh Indonesia.
  - Marker Tentor: Kak Kiki, Kak Aisyah, Kak Nadine dengan spesialisasi program dan status aktif.
- Menyediakan "Cek Jangkauan Mandiri" (`CoverageLocationChecker.tsx`):
  - Pencarian dropdown kecamatan & kelurahan.
  - Tombol deteksi GPS otomatis (`navigator.geolocation`) dengan kalkulasi jarak otomatis ke Hub Pusat via rumus Haversine.
  - Penghitungan instan: status zona, jarak (km), estimasi waktu tiba tentor, biaya transport, serta daftar tentor yang standby.
  - Tombol aksi WhatsApp dengan pesan pendaftaran terisi otomatis sesuai titik lokasi yang dipilih.
- Marker & Interaktivitas Peta:
  - Custom DOM markers (`L.divIcon`): pin Hub Pusat (navy & emas), pin avatar tentor, pin area, dan pin "Rumah Anda".
  - Area coverage circles (`L.circle`) translusen dengan styling border putus-putus.
  - Interaksi klik: klik area/marker memusatkan kamera dan menyorot detail; klik sembarang titik pada peta meletakkan pin "Rumah Anda" dan langsung menghitung jarak.
- Integrasi Navigasi:
  - Header khusus `CoverageNav.tsx`.
  - Link "Peta Jangkauan" ditambahkan ke `Landing2Nav.tsx`, `LandingNav.tsx`, dan `PrivateTutoringSection.tsx`.

**Verifikasi:**
- Next.js Production Build (`npm run build --workspace=frontend`): sukses 40/40 static pages termasuk `/jangkauan` dan `/peta`.
- ESLint (`npm run lint --workspace=frontend`): lolos 0 error, 0 warning.
- TypeScript check (`npx tsc --project frontend/tsconfig.json --noEmit`): lolos 0 error.
- HTTP Check lokal:
  - `http://localhost:3000/jangkauan`: HTTP 200 OK.
  - `http://localhost:3000/peta`: HTTP 307 Redirect ke `/jangkauan`.

### 2026-10-19 — Landing2: Implementasi Opsi 2 (Auto-Teaser Motion & Staggered Hero Entrance)

**Request:** 
Implementasi "Opsi 2" untuk animasi awal kemunculan halaman `http://localhost:3000/landing2`.

**Keputusan:**
- Mengadopsi **Opsi 2: Auto-Teaser Motion**:
  1. Bagian kiri hero (badge, headline H1, sub-lead, CTA buttons, trust badges, mode switcher) muncul bertahap dengan staggered entrance (`animate-hero-fade-up` dengan delay terukur 0ms–500ms).
  2. Frame video panggung 9:16 di sisi kanan masuk halus (`animate-hero-scale-in` delay 150ms) dan langsung berputar otomatis saat halaman terbuka dalam mode muted (tanpa dead/static cover poster).
  3. Floating badge berdenyut (`🔊 Nyalakan suara`) disematkan di pojok panggung. Sekali klik pada badge atau panggung, audio synthesizer Web Audio API langsung aktif dan tersinkronisasi tepat dengan detik berjalan.
  4. Video berputar terus menerus (auto-looping teaser) setiap siklus 32s selesai, menjaga hero selalu dinamis.

**Dikerjakan:**
- `frontend/app/globals.css`: Penambahan `@keyframes heroFadeUp`, `@keyframes heroScaleIn`, serta utility `.animate-hero-fade-up` dan `.animate-hero-scale-in`.
- `frontend/components/landing2/Landing2Hero.tsx`: Penerapan animasi staggered fade-up pada seluruh hierarchy hero kiri dan scale-in pada visual kanan.
- `frontend/components/landing2/PromoStage.tsx`:
  - Lifecycle autoplay on mount dengan `mute = true`.
  - Looping otomatis kembali ke Scene 0 pada detik ke-32.
  - Floating badge pill `.fl-mute` dengan efek glowing pulse indicator (amber ketika muted, emerald ketika aktif).
  - Sinkronisasi instan Web Audio API synth (`audio(elapsed)`) saat pengguna mengklik panggung atau tombol audio.
- Sinkronisasi tema hangat paper palette (`#f7f5ef`, `#14233a`, `#4a70a9`, `#f2c14e`, `#d9d2c2`) dan komponen `FourStepsInteractive.tsx` pada alur 4 langkah pendaftaran les.
- Perbaikan Hydration Mismatch (`styled-jsx` vs Turbopack SSR):
  - Komponen `FourStepsInteractive.tsx` dan `PromoStage.tsx` sebelumnya memuat tag `<style jsx global>`. Pada Next.js Turbopack, tag tersebut menyisipkan class acak scoped (`jsx-a6224bafe2c98563`) pada server HTML sedangkan client merender class murni, memicu *hydration mismatch*.
- Penyelarasan Logo Shell Materi (`/materi`, `/materi/[slug]`, `/app/materi`):
  - Mengganti icon generic `<Grid3X3 />` di `ContentShell.tsx` dengan SVG logo resmi Nurman Course (badge biru `#2e4b7a`, toga emas `#f2c14e`, inisial N putih `#fffdf9`).
  - Mempertahankan nama sub-brand `ncourse Learning desk` dengan aksen warna brand `text-[#4a70a9]`.

**Verifikasi:**
- TypeScript typecheck (`npx tsc --project frontend/tsconfig.json --noEmit`): lolos 0 error.
- HTTP check `http://localhost:3000/landing2`: HTTP 200 OK.
- Verifikasi HTML output server: tidak ada lagi class `jsx-*` (`-match 'jsx-'` -> False). Hydration mismatch teratasi sempurna.
- Autoplay teaser berputar otomatis dan audio synthesizer Web Audio API sinkron saat unmuted.

### 2026-10-18 — Landing Page Opsi 2 Hybrid & Exploratory Landing2 (Interactive Video & 2.5D Hero)

**Request:** 
1. Eksplorasi tema/style halaman materi untuk landing page (Opsi 2 Hybrid: warm paper card, dot-grid, Bricolage Grotesque, Public Sans, JetBrains Mono).
2. Membuat halaman eksplorasi `/landing2` berdasarkan file referensi:
   - `Video promo Nurman Course.html`: stage 9:16 vertikal dengan Web Audio API synth, teks ketik interaktif, live preview, progress bar animasi, dan jalur belajar.
   - `nCourse_ belajar mandiri dan les privat.html`: dual-track platform (kelas mandiri bikin web/app dari nol vs les privat Calistung, Ngaji, Komputer dengan laporan harian orang tua), floating stack 2.5D tilt, facts bar, interactive course filtering, roadmap timeline, Venn diagram parallax, dan FAQ accordion.
3. Responsiveness: ukuran panggung video pas 1 layar hero tanpa terpotong (viewport-aware `min(calc(100vw - 32px), calc((100dvh - 190px) * 0.5625), 365px)`).
4. Menghilangkan semua emoji pada UI ke bawah dan menggantinya dengan icon Lucide.

**Keputusan:**
- Menjaga keaslian konten dan alur video promo (100% identik dengan alur asli `Video promo Nurman Course.html`).
- Menyediakan mode switcher di hero `/landing2` ("Video Promo (9:16)" vs "Kartu 2.5D") untuk perbandingan interaktif.
- Semua emoji digantikan icon Lucide (`Layout`, `Code2`, `Monitor`, `Calculator`, `BookOpen`, `Compass`).

**Dikerjakan:**
- Update `frontend/app/globals.css` dengan utility animation keyframes (`animate-fade-in`, `animate-slide-up`, `animate-scale-in`).
- Implementasi `frontend/app/landing2/page.tsx` dengan font Google `Host_Grotesk`.
- Komponen `frontend/components/landing2/*`:
  - `PromoStage.tsx`: stage 9:16 asli dengan Web Audio API synth & kontrol.
  - `FloatingHeroStack.tsx`: kartu 2.5D tilt dengan interaksi progres & laporan harian.
  - `Landing2Hero.tsx`: layout responsif fit 1 viewport hero.
  - `Landing2Nav.tsx`, `Landing2Facts.tsx`, `Landing2PathChoice.tsx`.
  - `CourseCatalogInteractive.tsx`: filter topik dengan icon Lucide & roadmap interaktif.
  - `PrivateTutoringSection.tsx`: program les privat & simulasi rapor murid untuk orang tua.
  - `VennBridgeSection.tsx`: diagram lingkaran beririsan dengan scroll parallax.
  - `FaqInteractiveSection.tsx`, `Landing2Cta.tsx`, `Landing2Footer.tsx`.

**Verifikasi:**
- TypeScript typecheck (`npx tsc --project frontend/tsconfig.json --noEmit`): lulus 0 error.
- HTTP status check `/landing2`: HTTP 200 OK.
- Visual inspection & responsive viewport check: frame HP tampil penuh di hero tanpa terpotong.

### 2026-10-18 — Migrasi ke PostgreSQL Lokal (Laragon) dan Native JWT Auth

**Request:** beralih dari Supabase Cloud (error P1001 paused) ke database PostgreSQL lokal Laragon dan menggunakan native auth.

**Keputusan:**
- Menggunakan database PostgreSQL lokal Laragon (`localhost:5432`, DB `nurmancourse`).
- Menggantikan Supabase Auth dengan native password hashing (`bcryptjs`) dan JWT signing/verification (`jsonwebtoken`).
- Menambahkan field `passwordHash` pada model `User` di `schema.prisma`.
- Endpoint baru di backend: `POST /api/auth/login`, `POST /api/auth/signup`, dan `PATCH /api/users/me/password`.
- Frontend mengelola token JWT via Cookie `access_token` (dan localStorage) sehingga middleware Next.js dan `apiFetch` langsung mengirim Bearer token secara native tanpa dependensi Supabase client.
- Seed script dimodifikasi untuk membuat data awal dan meng-hash password `Password123!` langsung ke database lokal.

**Dikerjakan:**
- Database `nurmancourse` dibuat di PostgreSQL Laragon.
- `schema.prisma` diperbarui dengan `passwordHash String? @map("password_hash")` dan disinkronkan via `npx prisma db push`.
- `backend/.env` diarahkan ke `postgresql://postgres:@localhost:5432/nurmancourse` dengan `JWT_SECRET`.
- Service `backend/src/lib/auth-service.ts` dibuat untuk bcrypt dan JWT.
- Middleware `backend/src/middleware/auth.ts` diperbarui untuk memverifikasi JWT token lokal.
- Endpoint `backend/src/index.ts` menambahkan native login/signup dan patch password.
- `backend/prisma/seed.ts` diperbarui dan dijalankan: 14 user, 12 course, 180 lesson berhasil diisi.
- `frontend/lib/auth.ts` dibuat untuk helper cookie/storage token.
- `frontend/lib/api.ts`, `frontend/middleware.ts`, `frontend/app/login/page.tsx`, `frontend/lib/useLogout.tsx`, dan halaman profil tentor/wali diperbarui menggunakan native auth.

**Verifikasi:**
- Uji koneksi dan database creation ke PostgreSQL Laragon: berhasil.
- `npx prisma db push` & client generation: berhasil (v5.22.0).
- Seed local PostgreSQL: berhasil (14 user, 12 course, 180 lesson).
- Uji API login `POST /api/auth/login` (admin@nurmancourse.com): status 200, JWT token dihasilkan, validasi password bcrypt sukses.
- Backend typecheck (`tsc --project tsconfig.json --noEmit`): lulus 0 error.
- Frontend typecheck (`tsc --noEmit`): lulus 0 error.

### 2026-09-20 — Sembunyikan scrollbar mobile portal wali

**Request:** hilangkan indikator scrollbar vertikal di sisi kanan pada mobile tanpa menjalankan test suite.

**Dikerjakan:** shell wali memakai scroll container viewport khusus mobile; scrollbar disembunyikan melalui CSS Firefox, Chromium/WebKit, dan legacy Edge. Scroll touch/keyboard tetap aktif, sedangkan desktop tetap memakai scrollbar normal.

**Verifikasi:** frontend lint dan `npx tsc --noEmit` lulus. Test dan Playwright tidak dijalankan sesuai instruksi user.

### 2026-09-20 — Penyederhanaan bottom navigation wali

**Request:** ringkas bottom bar portal orang tua/wali tanpa Playwright; profil tetap diakses melalui avatar kanan atas.

**Keputusan:** bottom bar hanya memuat empat tujuan utama yang sering dipakai: `Beranda`, `Jadwal`, `Laporan`, dan `Tagihan`. `Program` dan `Materi` tetap dapat diakses melalui CTA pada Beranda, sedangkan `Profil` melalui tombol avatar di top bar.

**Dikerjakan:** `frontend/app/app/(wali)/layout.tsx` menghapus Program dan Materi dari bottom navigation serta mempertahankan badge tagihan. `frontend/app/app/(wali)/dashboard/page.tsx` menambahkan CTA ringkas menuju Program aktif dan Materi belajar. Regression contract ditambahkan ke `frontend/tests/dashboard-surface.test.mjs`.

**Verifikasi:** dashboard surface tests **5/5 lulus**, frontend lint lulus, dan `npx tsc --noEmit` lulus. Tidak memakai Playwright; verifikasi visual/interaksi browser tidak dijalankan.

### 2026-09-20 — Perbaikan mobile drawer admin

**Request:** perbaiki tombol burger pada halaman admin mobile yang tidak menampilkan sidebar; tanpa Playwright.

**Akar masalah:** effect pada `frontend/app/app/admin/layout.tsx` bergantung pada `mobileNavOpen`, sehingga state langsung dikembalikan ke `false` setelah tombol membuka drawer.

**Dikerjakan:** effect auto-close dihapus; drawer ditutup eksplisit melalui overlay, tombol tutup, atau klik link navigasi. Regression contract ditambahkan ke `frontend/tests/dashboard-surface.test.mjs`.

**Verifikasi:** dashboard surface tests **4/4 lulus**, frontend lint lulus, dan `npx tsc --noEmit` lulus. Tidak memakai Playwright; verifikasi browser visual/interaksi tidak dijalankan.

### 2026-09-20 — Redesign dashboard admin dan member

**Request:** redesign dashboard admin dan member; admin lebih kaya dengan command center, data-heavy workspace, dan navigasi operasional. Eksekusi tanpa Playwright.

**Keputusan:** tetap memakai visual direction `dashboard-command-center`: admin sebagai mission-control dengan blue-black surface, crisp rules, grouped dense navigation, dan gold untuk urgency; member sebagai learning desk dengan fokus overview progress dan lanjut belajar. Endpoint existing dipakai; tidak ada schema/migration/DB mutation baru.

**Dikerjakan:**

- `frontend/app/app/admin/page.tsx`: menambah agenda operasional, prioritas kerja, akses cepat, materi paling dibaca dari `/api/catalog/lessons`, dan aktivitas terbaru dari `/api/admin/tracking`, dengan fallback per-panel.
- `frontend/app/app/admin/layout.tsx`: grouped navigation, active state, mobile drawer, profile initial dari `/api/users/me`, dan topbar command surface.
- `frontend/app/app/admin/{murid,tentor,program,enrollment,tagihan,jadwal,rekening,roadmap}`: container diseragamkan agar workspace data-heavy menggunakan lebar command center.
- `frontend/components/ui/GlassCard.tsx` dan `PageHeader.tsx`: glassmorphism dekoratif diganti surface putih dengan border/rule dan shadow ringan.
- `frontend/app/app/materi/page.tsx`: profil member, overview jumlah kelas/rata-rata progress/kelas selesai, CTA `Lanjut belajar`, koleksi, empty/error/loading state, dan logout confirmation.
- `frontend/tests/dashboard-surface.test.mjs`: kontrak statis untuk admin command center, member overview/continue, dan shared admin shell.
- `frontend/.impeccable/surfaces/dashboard-command-center.md` serta `tasks/plan.md` dicatat sebagai arah dan rencana sesi.

**Verifikasi:**

- Dashboard/auth/course contract tests: **12/12 lulus**.
- Backend tracking test: **7/7 lulus**; backend typecheck, test typecheck, lint: lulus (14 warning `any` baseline, 0 error).
- Frontend typecheck, lint, production build: lulus.
- Prisma generate, validate dengan placeholder env, format check: lulus.
- Impeccable detector: advisory font-size literal di luar ramp; tidak ada error mekanis.
- Tidak memakai Playwright, tidak ada migration deploy, DB mutation, commit, atau push.

**Residual dan batas bukti:**

- Full `node --test frontend/tests/*.mjs` masih gagal pada 2 test pre-existing `frontend/tests/api.test.mjs` terkait cache/log snapshot (`2 !== 1` dan cache value `2` vs `1`); file tersebut tidak disentuh pada sesi ini.
- Browser runtime/visual pixel QA tidak dijalankan sesuai instruksi user; verifikasi terbatas pada static contract, typecheck, lint, build, detector.
- Migration/schema click-tracking sempat dibuat sebagai eksperimen lalu dibersihkan; tidak ada perubahan schema atau migration tersisa.



**Request:** redesign `/course/program` dan urutan halaman sesudahnya, mempertahankan warna utama landing, mobile-first, copy/data, route, serta CTA WhatsApp.

**Keputusan:** funnel memakai komposisi “Peta Bercabang” yang memperluas dunia visual Peta Belajar landing. Empat langkah `Arah → Fokus → Level → Jadwal` selalu terlihat; data tetap berasal dari `materials.ts`, pricing tetap di `CourseConfigClient`, dan nomor WhatsApp tetap dari constants.

**Dikerjakan:** shell `/course/*` memakai map ground landing; `CourseRouteHeader` menyediakan back action dan progress rail; program, materi, jenjang, calistung, detail level, chip, dan config memakai route node/panel baru; copy existing dipertahankan dan dikunci oleh test; `frontend/DESIGN.md`, sidecar Impeccable, dan surface brief ditambahkan.

**Verifikasi:** course-funnel/auth tests 9/9 lulus; frontend typecheck dan lint lulus; production build menghasilkan artifacts semua route funnel; Impeccable detector kosong; browser QA 390px dan 1440px tanpa horizontal overflow dan console error. Review lanjutan memperbaiki duplikasi copy harga, label input nama, `aria-pressed`/`aria-current`, validasi kategori URL, penolakan level coming-soon, dan gate jumlah hari tepat sesuai frekuensi. URL config yang dimanipulasi ditolak dan CTA WhatsApp tetap disabled saat hari belum lengkap. Runtime API backend tidak diperlukan untuk funnel statis ini.

**Residual dan batas bukti:** model tidak mendukung inspeksi piksel screenshot; visual diverifikasi melalui accessibility tree, geometry/overflow, computed state, screenshot capture, detector, dan browser interaction. Verifikasi lokal bukan bukti deployment production. Tidak ada DB mutation, commit, push, atau deploy.

### 2026-09-19 — Redesign landing, auth toggle, dan akun development dummy

**Request:** perbaiki landing page, gabungkan login/register tanpa reload, dan sediakan tombol akun dummy per role untuk development.

**Keputusan:** redesign memakai dunia visual “Peta Belajar”; biru utama dan logo dipertahankan. Login/register menjadi satu surface `/login` dengan toggle state client-side; `/signup` tetap redirect kompatibilitas ke `/login?mode=register`. Quick-fill hanya dirender saat `NODE_ENV=development`, mengisi form saja, dan tidak melakukan login otomatis.

**Dikerjakan:**

- `frontend/app/landing/page.tsx` dan `frontend/components/landing/*`: landing dirombak menjadi peta rute kebutuhan → tutor → jadwal → WhatsApp, dengan responsive sections dan CTA funnel tetap.
- `frontend/app/login/page.tsx`: auth surface baru, toggle Masuk/Daftar tanpa reload, signup member, login email/nomor WhatsApp, dan quick-fill Admin/Tentor/Wali/Member.
- `frontend/app/signup/page.tsx`: kompatibilitas route diarahkan ke tab Daftar.
- `frontend/app/globals.css`: material grid peta, auth grid, dan motion route dengan reduced-motion fallback.
- `backend/prisma/seed.ts`: fixture development `member@nurmancourse.com` ditambahkan; seed tidak dijalankan.
- `frontend/tests/auth-surface.test.mjs`: test kontrak toggle, production guard quick-fill, dan fixture Member.

**Verifikasi:**

- Auth surface test: **3/3 lulus**.
- Frontend TypeScript check: lulus.
- Frontend lint: lulus.
- Frontend production build: lulus.
- Browser QA lokal: landing desktop/mobile dan auth desktop/mobile termuat; toggle Daftar bekerja tanpa reload; quick-fill Member mengisi email/password; console tidak memiliki error/warning.
- Impeccable detector: hanya advisory grid background yang disengaja sebagai material peta; tidak ada error mekanis.
- Review lanjutan memperbaiki akses mode register untuk session aktif dan sign-out saat profile DB gagal.
- Tidak ada migration, seed, mutasi DB remote, commit, push, atau deploy.

**Residual dan batas bukti:**

- Browser QA membuktikan layout dan interaksi lokal, bukan auth/login remote atau deployment production.
- Akun Member fixture baru ada di source seed; seed belum dijalankan, sehingga tombol hanya akan login jika akun sudah tersedia di environment development.
- Working tree memiliki perubahan lain yang sudah ada sebelum sesi ini; tidak direvert.

### 2026-09-18 — Role `member` dan signup publik content-only

**Request:** aktifkan role member.

**Keputusan:** signup publik memakai email/password, email wajib diverifikasi, nomor WhatsApp opsional, dan member hanya memiliki akses content surface. Role operasional tetap `admin|tentor|wali`; member tidak boleh masuk portal operasional.

**Dikerjakan:**

- `packages/shared/src/index.ts`: `UserRole`/`userRoleSchema` menambahkan `member`; `User.phone` nullable; kontrak `memberSignupSchema` password minimal 8 karakter.
- `backend/prisma/schema.prisma`: `User.phone` menjadi nullable.
- `backend/prisma/migrations/nc7_member_phone_nullable/migration.sql`: nullable phone, CHECK role, dan trigger private `auth.users → public.users` yang membuat profile `member` hanya untuk signup tanpa role metadata. Function tidak executable oleh `PUBLIC`.
- `backend/src/index.ts`: `POST /api/auth/signup` memakai Supabase `auth.signUp`, validasi shared schema, neutral duplicate response, dan tidak memakai service-role key.
- `backend/src/middleware/auth.ts`: `requireOperational` membatasi endpoint operasional ke `admin|tentor|wali`; member tidak jatuh ke cabang admin.
- `backend/src/middleware/http-security.ts`: signup mendapat rate limit auth.
- `frontend/app/signup/page.tsx`: form signup dan state konfirmasi email.
- `frontend/middleware.ts` dan `frontend/app/login/page.tsx`: routing memakai role dari `/api/users/me` (DB authority), bukan `user_metadata`; member diarahkan ke `/app/materi`.
- `backend/prisma/seed.ts`: user seed memakai upsert agar kompatibel dengan trigger profile.

**Verifikasi:**

- Backend API: **188/188 lulus**; typecheck source/test lulus; lint 0 error dengan 14 warning `any` baseline.
- Frontend typecheck, lint, dan production build lulus.
- Prisma validate lulus dengan env dummy.
- Remote `prisma migrate deploy` berhasil menerapkan `nc7_member_phone_nullable`.
- Remote: role CHECK aktif, phone nullable, trigger member aktif, 13 Auth = 13 profile, 0 member/0 nullable phone existing, semua role valid.
- Smoke signup Supabase berhasil dengan `session=false` (email verification wajib), trigger membuat profile `member`, lalu akun/profile smoke dibersihkan.
- Tidak ada literal frontend/backend `user_metadata?.role` yang dipakai untuk routing/guard; metadata role tetap hanya dikirim oleh provisioning staff legacy dan fixture tests.

**Residual dan batas bukti:**

- Email delivery/klik verifikasi belum diuji di browser; hanya signup API/Supabase dan session absence diverifikasi.
- Migration sudah diterapkan pada remote development, bukan production.
- Tidak ada commit, push, atau deploy.

### 2026-09-18 — Rebrand materi `Belajar.dev` menjadi `ncourse`

**Request:** ganti brand `Belajar.dev` ke `ncourse` pada frontend/backend string literals dan data development.

**Dikerjakan:**

- `frontend/components/content/ContentShell.tsx`: wordmark header materi diubah menjadi `ncourse`.
- Audit repository tidak menemukan literal `Belajar.dev`, `belajar.dev`, atau `belajar-dev` lain pada backend/shared maupun konfigurasi yang perlu diubah.
- Audit remote development tidak menemukan nilai `belajar.dev` pada tabel seed; tidak ada migration atau update data remote yang diperlukan.

**Verifikasi:**

- Search source terarah untuk seluruh variasi wordmark lama: tidak ada hasil.
- Perubahan hanya menyentuh UI content shell; route, domain, email, dan brand `Nurman Course` pada funnel/portal tidak diubah.

**Residual dan batas bukti:**

- Browser visual QA belum dijalankan.

### 2026-09-18 — Remote reset, migration `0_init`, dan seed besar terverifikasi

**Request:** reset schema remote development, terapkan migration tunggal, hapus Auth lama, jalankan seed besar, dan verifikasi hasilnya.

**Dikerjakan:**

- Koneksi Prisma pulih tanpa perubahan source; DNS lookup dan PostgreSQL SSL probe ke seluruh IP pooler berhasil, lalu `prisma migrate status` dapat terhubung ke session pooler port 5432.
- State awal berisi 10 akun Auth, tabel aplikasi kosong, dan history `0_init` lama yang tidak mencerminkan migration hasil squash saat ini.
- `npx prisma migrate reset --force --skip-seed --schema prisma/schema.prisma` berhasil mereset schema `public` dan menerapkan current `0_init` tepat sekali.
- Seed pertama melewati timeout shell setelah membuat data parsial; seed dijalankan ulang dengan guard `NC_SEED_ALLOW_REMOTE_RESET=true`. Karena seed selalu membersihkan Auth dan database terlebih dahulu, rerun selesai dari state bersih.
- 10 akun Auth lama dihapus dan diganti 13 akun seed development dengan password demo yang telah disepakati.

**Verifikasi remote:**

- Prisma migration: hanya `0_init`, `finished_at` terisi, tidak rollback, dan `prisma migrate status` melaporkan schema up to date.
- Auth/aplikasi: 13 Auth user sama dengan 13 profile; seluruh email confirmed dan profile aktif, terdiri dari 1 admin, 4 tentor, dan 8 wali.
- Smoke login Supabase berhasil untuk `admin@nurmancourse.com`, `tentor1@nurmancourse.com`, dan `wali1@nurmancourse.com`.
- Fixture: 16 murid, 5 Program, 5 roadmap step, 5 material item, 5 session, 5 enrollment, 5 invoice, 2 payment account, 2 daily report, 5 progress report, 5 progress, 12 Course, 36 Section, 180 Lesson, 6 entitlement, dan 30 lesson progress.
- `prepayments=0` dan `tracking_events=0` sesuai seed; tracking baru terisi oleh aktivitas runtime.
- Keempat CHECK constraint domain tersedia. RLS aktif default-deny pada sembilan tabel content/tracking dan tidak ada grant tabel kepada `PUBLIC`, `anon`, atau `authenticated` pada tabel yang diverifikasi.

**Residual dan batas bukti:**

- Security advisor melaporkan sembilan tabel RLS aktif tanpa policy; ini sesuai desain default-deny karena akses melalui Express/Prisma. Operational tables masih tanpa RLS tetapi tidak memiliki grant Data API pada pemeriksaan ini.
- Supabase Auth leaked-password protection masih disabled.
- Password database dan service-role key yang pernah tampil harus dirotasi melalui Supabase Dashboard, lalu `backend/.env` diperbarui; rotasi belum dapat dilakukan melalui tool sesi ini.
- Verifikasi membuktikan remote development database/Auth saat ini, bukan deployment production atau browser QA. Tidak ada commit, push, atau deploy.

### 2026-09-18 — MTR-14 backend-backed content cutover siap lokal

**Request:** lanjut backend, siapkan seed besar, tracking user/login/read lesson, read count, dan pastikan halaman materi benar-benar siap memakai backend.

**Dikerjakan:**

- `backend/prisma/schema.prisma`: menambah `Lesson.readCount`, `TrackingEvent`, enum `TrackingEventType`, relasi/index, dan constraint domain.
- Migration lama di-squash secara lokal menjadi `backend/prisma/migrations/0_init/migration.sql`; SQL menambahkan CHECK, RLS, dan REVOKE. Migration remote belum dijalankan.
- `backend/prisma/seed.ts`: seed development guard, reset Auth, 13 user aplikasi, 16 murid, 5 Program operational, 12 Course, 180 Lesson, access tier/visibility/status, entitlement aktif/expired/revoked/multi-source, progress, sesi, invoice, laporan, dan read count awal. Seed remote mensyaratkan `NC_SEED_ALLOW_REMOTE_RESET=true`.
- `backend/src/routes/tracking/tracking.ts`: POST login tracking, GET admin tracking pagination/filter, DELETE admin tracking tanpa reset counter; IP/User-Agent dibatasi panjangnya.
- `backend/src/routes/reader/reader.ts`: successful allowed reader menaikkan read count atomik dan mencatat `lesson_read`; denied/unknown tidak dihitung; response memuat `readCount` dan `completed`.
- `backend/src/routes/catalog/`: `GET /api/catalog/lessons` flat catalog, `GET /api/catalog/paths`, DTO/search/filter/pagination.
- `backend/src/routes/me/membership.ts`: `GET /api/me/lesson-progress` completed slug user sendiri.
- Frontend `/materi`, `/kelas/[slug]`, `/materi/[slug]`, `/jalur-belajar` sekarang memakai API backend; runtime dataset dummy dan local progress fallback dihapus. Login tracking best-effort tetap tidak menggagalkan login.
- Legacy content tests diperbarui mengikuti DTO allowlist `select` yang sudah dipakai route.

**Verifikasi:**

- Backend API suite: **180/180 lulus**.
- Backend typecheck, test typecheck, lint, artifact build: lulus; lint memiliki 14 warning `any` baseline, 0 error.
- Frontend lint, typecheck, dan build: lulus.
- Migration Prisma format/validate/generate: lulus lokal.
- `git diff --check`: lulus; warning LF→CRLF normal.

**Residual dan batas bukti:**

- Belum ada migration deploy, reset schema, penghapusan Auth, atau seed remote; semua operasi destructive tetap menunggu konfirmasi eksplisit terakhir.
- Belum ada runtime DB terisolasi/live verification, RLS/Data API verification, login live, atau browser QA sesuai instruksi user.
- `readCount` menghitung setiap successful reader request, termasuk anonymous; event menyimpan IP/User-Agent sesuai keputusan dev.
- Test client standalone pernah timeout karena batas waktu subprocess; test API dan build tetap lulus.
- Percobaan reset remote 2026-09-18 berhenti sebelum mutasi: Prisma gagal konek ke Supabase pooler (`P1001`) pada port 5432/6543. Supabase MCP dapat query database, tetapi schema/Auth/seed remote belum diubah.
- Supabase advisor mendeteksi RLS disabled pada 14 tabel existing; remediation belum dijalankan karena policy existing belum dipetakan.

# Progress — Nurman Course

> Ledger aktif keputusan, milestone, verifikasi, dan residual. Checklist ada di [tasks/todo.md](../tasks/todo.md); arah backend ada di [GOALS.md](../GOALS.md).

## Status saat ini — 2026-09-17

**Fokus:** backend-first, branch `be-restruktur`.

**Milestone terakhir:** Bagian 5 backend NC-2 selesai untuk scope offline.

Selesai lokal:

- backend dependency/runtime patch, auth DB-backed, HTTP hardening, artifact build, dan lint scoped;
- ekstraksi router legacy content;
- schema additive `Course`, `Section`, `Lesson` dan migration SQL offline;
- API authoring admin/tentor dengan ownership, DTO, reorder, draft/publish;
- validasi link internal `/materi/*`;
- backfill content dry-run yang atomic, idempotent, dan fail-closed.

Belum dilakukan atau belum disetujui:

- migration deploy dan backfill ke DB live;
- audit count content live dan QA DB terisolasi;
- keputusan item `MaterialItem` ambiguous/conflict/orphan;
- drop `MaterialItem.sessionId`/FK legacy;
- frontend writer/reader cutover;
- entitlement, katalog publik, dan deployment.

## Keputusan aktif

| Area | Keputusan |
|---|---|
| Arah | Backend-first; frontend dikerjakan setelah contract dan migration gate siap |
| Entitas | `Program` untuk layanan les; `Course` untuk konten mandiri; tidak digabung |
| Akses | Role menentukan operasi; entitlement menentukan akses content |
| Identitas | Verified Supabase user ID; role dan active berasal dari DB |
| Author | Admin semua content; tentor hanya `authorId` miliknya |
| Transisi | Satu writer authoritative; legacy tetap kompatibel sampai frontend cutover |
| Content | `Course → Section → Lesson`; Markdown; slug lesson global |
| Migration | Expand → backfill → verify → contract; tidak drop legacy lebih awal |
| Pembayaran | Manual one-time; payment gateway/subscription belum diputuskan |
| MTR-0 akses | Public tanpa login; Course free wajib login tanpa auto-grant; Course paid wajib entitlement aktif; purchase lifetime |
| MTR-0 entitlement | Multi-baris per User-Course-Source; satu source aktif cukup memberi akses |
| MTR-0 pembaca/API | Role existing dahulu; reader 401/403/404 tanpa body leak; namespace catalog/reader/me |
| Infra | Tidak menambah infra baru tanpa keputusan terpisah |

## Milestone sebelumnya

- **Bagian 1:** dependency runtime backend selesai.
- **Bagian 2:** role DB/inactive lokal selesai; rollout tertahan lima Auth tanpa profil.
- **Bagian 3:** Helmet, CORS, limiter, parser/error boundary selesai; payload masih 100 KB.
- **Bagian 4:** artifact build, lint backend, audit `MaterialItem.sessionId`, dan mapping plan selesai offline.
- **Bagian 5:** modularisasi content, schema/migration, authoring API, link validation, dan backfill dry-run selesai offline.

## Verifikasi terakhir

- `npm run typecheck --workspace=backend` — exit 0.
- `npm run typecheck:test --workspace=backend` — exit 0.
- `npm run lint --workspace=backend` — exit 0; 14 warning `any` baseline (0 error).
- `git diff --check` — lulus; warning LF→CRLF hanya normalisasi line-ending.
- Prisma format/validate/generate dan migration diff — berhasil offline.
- Test backend terakhir 173/173 lulus sebelum user menghentikan penambahan test baru.

Verifikasi lokal tidak membuktikan DB live, auth staging, browser, deployment, atau engine OS target lain.

## Blocker dan residual

1. Lima akun Supabase Auth belum memiliki profil aplikasi; rollout auth ditahan.
2. Parser JSON masih 100 KB; ukuran payload belum diputuskan.
3. Migration/backfill live belum mendapat izin dan belum dijalankan.
4. Mapping `MaterialItem.sessionId` masih membutuhkan hitungan data dan keputusan untuk ambiguous/conflict/orphan.
5. Endpoint legacy `/api/programs*` masih dapat membawa `RoadmapStep.bodyText`; NC-3.4 adalah release blocker sebelum katalog publik.
6. Frontend masih memakai metadata role.
7. Payload pembayaran UI/API mismatch: `paymentProof`/`paymentProofName` versus `proofBase64`/`proofName`.
8. API authoring belum memiliki frontend writer.

## Approval gates

- DB audit, migration deploy, backfill, seed, dan schema contract memerlukan izin DB eksplisit.
- Browser, login nyata, dan QA frontend memerlukan task serta izin terpisah.
- Commit, push, merge, dan deploy memerlukan permintaan eksplisit.
- Setiap checkpoint berikutnya wajib memperbarui `tasks/todo.md` dan file ini.

## Catatan sesi

### 2026-09-18 — Katalog bebas lesson dan jalur belajar terpandu

**Request:** ubah `/materi` menjadi katalog bergaya shopping card untuk semua lesson; dukung search setelah tombol, topik, level, jumlah dibaca, pagination, dan halaman jalur terurut.

**Dikerjakan:**

- `frontend/data/belajar-dasar.ts`: metadata topic, level `Pemula|Dasar|Project`, seeded read count stabil, flatten helper semua lesson, dan format angka dibaca.
- `frontend/components/content/LessonCatalogCard.tsx`: card lesson dengan topik, level, durasi, jumlah dibaca, status gratis, dan status sudah dibaca lokal.
- `frontend/lib/learning-progress.ts`: snapshot progress lokal bersama untuk reader dan katalog.
- `frontend/app/materi/page.tsx`: katalog bebas 12 card/page, search via submit, topik multi-select, level single-select, query URL, relevansi sederhana, pagination, empty/reset state.
- `frontend/app/jalur-belajar/page.tsx`: jalur tiga tahap dengan urutan lesson, progress lokal, CTA lesson berikutnya, serta link kembali ke katalog bebas.
- `frontend/components/content/ContentShell.tsx`: navigasi header menambahkan Jalur Belajar.
- `frontend/components/content/LessonReader.tsx`: progress reader dipindahkan ke helper shared.

**Verifikasi:**

- `npx tsc --project frontend/tsconfig.json --noEmit` — exit 0.
- `npm run lint --workspace=frontend` — exit 0.
- `npm run build --workspace=frontend` — exit 0; route `/materi` dan `/jalur-belajar` terdeteksi.
- Impeccable detector — hanya warning divider `border-b-2` pada surface rounded yang sudah menjadi grammar worksheet.
- `git diff --check` — lulus; warning line-ending LF→CRLF normal.

**Residual dan batas bukti:** browser screenshot/runtime QA belum dijalankan. Read count masih seeded dummy dan progress masih local-only; integrasi analytics/backend tetap pekerjaan terpisah.


**Request:** buat tampilan materi gratis dan katalog lengkap yang mudah dibaca user pemula, mobile-friendly, memakai data dummy: lingkungan coding, instalasi tools basic, dan belajar HTML.

**Dikerjakan:**

- `frontend/data/belajar-dasar.ts`: tiga jalur belajar dengan 13 lesson, tujuan per jalur, durasi, level, latihan, dan project profil HTML.
- `frontend/components/content/CourseCard.tsx`: kartu katalog menampilkan langkah, jumlah lesson, total durasi, status gratis, dan CTA yang konsisten.
- `frontend/components/content/CourseDetail.tsx`: detail kelas dummy dengan tujuan belajar, durasi, urutan lesson, dan CTA mulai.
- `frontend/components/content/LessonReader.tsx`: reader gratis berbasis data lokal, daftar isi desktop, prev/next, progress `localStorage`, dan navigasi mobile.
- `frontend/components/content/SafeMarkdown.tsx`: typography reader diselaraskan dengan dunia visual “meja praktik”, code block, checklist, link, dan blockquote lebih mudah dibaca.
- `frontend/app/materi/[slug]/page.tsx`: `key` slug ditambahkan agar state progress berganti stabil saat navigasi client-side.

**Verifikasi:**

- `npx tsc --project frontend/tsconfig.json --noEmit` — exit 0.
- `npm run lint --workspace=frontend` — exit 0.
- `npm run build --workspace=frontend` — exit 0.
- Impeccable detector — 4 warning divider `border-b-2` pada surface rounded, tanpa error; dipertahankan sebagai bagian grammar worksheet.
- `git diff --check` — lulus dengan warning line-ending LF→CRLF normal.

**Residual dan batas bukti:** browser screenshot/runtime QA tidak dijalankan. Data dummy belum menjadi source production API; saat backend live diaktifkan, client API perlu diintegrasikan kembali tanpa mengubah kontrak visual dan struktur konten.


**Request:** lanjut langsung ke MTR berikutnya tanpa menunggu runtime/DB gate; browser test kemudian dibatalkan user.

**Dikerjakan:**

- `/materi`: katalog Course dengan search, category/level/access filter, pagination, loading/error/empty state, dan badge akses.
- `/kelas/[slug]`: detail Course dan outline terurut; semua lesson mengarah ke reader untuk state public/login/purchase.
- `/materi/[slug]`: reader body hasil guarded API, breadcrumb, heading hierarchy, daftar isi, prev/next, login-required, purchase-required, dan update progress.
- `/app/materi`: library private/no-cache dengan progress ringkas; link ditambahkan ke navigasi wali dan route diizinkan untuk tentor login.
- Login return memakai `next` relative-path tervalidasi anti-open-redirect; `redirectedFrom` lama tetap didukung.
- `frontend/lib/api.ts`: GET sensitif (`/api/me`, `/api/users/me`, `/api/reader`, `/api/programs`) tidak disimpan pada cache global; error menjaga HTTP status dan code.
- Markdown memakai `react-markdown`, `remark-gfm`, dan `rehype-sanitize`; raw HTML tidak diaktifkan dan gambar Markdown diblok.

**Verifikasi:** frontend TypeScript, ESLint, dan production build berhasil; route `/materi`, `/materi/[slug]`, `/kelas/[slug]`, dan `/app/materi` terdeteksi pada output build. Impeccable detector tidak menemukan pelanggaran mekanis. Backend source/test typecheck tetap lulus setelah integrasi contract.

**Residual dan batas bukti:** browser/runtime QA tidak dijalankan atas instruksi user. DB/RLS/auth live, migration deploy, backend runtime suite, entitlement issuance, dan purchase flow belum diverifikasi. `npm audit --omit=dev` frontend masih melaporkan satu moderate advisory transitive `baseline-browser-mapping`.

### 2026-09-18 — MTR-5 sampai MTR-9 selesai lokal dengan residual verifikasi

**Request:** lanjut MTR-5–MTR-9.

**Dikerjakan:**

- `backend/src/routes/catalog/`: katalog Course published/active dengan pagination bounded, search/filter, ordering stabil, DTO metadata allowlist, author publik minimum, count published lesson, dan outline tanpa body.
- `backend/src/routes/reader/`: reader lesson dengan optional-auth, access policy terpusat, 401/403/404 contract, body hanya setelah access allowed, breadcrumb, prev/next yang hanya menunjuk lesson accessible, dan cache public wajib revalidate/private no-store.
- Review adversarial memperbaiki navigasi paywall, tier-null library mismatch, entitlement history exposure, legacy Data API grants, dan explicit legacy DTO.
- `backend/prisma/schema.prisma` + `nc5_lesson_progress`: `LessonProgress` terpisah dari progress Murid/RoadmapStep, unique User-Lesson, dan index user/update.
- `backend/src/routes/me/membership.ts`: entitlement milik user sendiri, library Course yang free/entitled aktif, progress ringkas, dan update progress idempotent setelah access policy.
- `backend/src/routes/content/programs-public.ts`: compatibility guard legacy `/api/programs*`; anonymous tidak menerima `RoadmapStep.bodyText`, user aktif hanya menerima body untuk Program dengan enrollment aktif/role admin; DTO legacy eksplisit.
- `backend/prisma/migrations/nc6_content_data_api_lockdown/migration.sql`: RLS + revoke `PUBLIC`/`anon`/`authenticated` untuk content legacy (`programs`, `roadmap_steps`, `material_items`) dan content baru (`courses`, `sections`, `lessons`), entitlement, dan progress; tetap offline.
- `packages/shared/src/index.ts`: author, entitlement, library, progress DTO dan schema progress.
- `frontend/.env.example` diaudit: service-role tidak memakai prefix public; tidak diubah.

**Verifikasi:**

- `npm run typecheck --workspace=backend` — exit 0.
- `npm run typecheck:test --workspace=backend` — exit 0.
- `npm run lint --workspace=backend` — exit 0; 14 warning `any` baseline, 0 error.
- Prisma format/validate/generate — berhasil dengan URL dummy lokal.
- `git diff --check` — lulus; warning LF→CRLF hanya normalisasi line-ending.
- Static audit route/DTO menemukan `bodyText` hanya di reader success dan legacy/admin protected paths.

**Residual dan batas bukti:**

- Backend runtime suite, artifact test, dan build tidak dijalankan pada sesi ini; contract runtime MTR-9 belum terbukti penuh.
- Migration `nc5`/`nc6`, migration content sebelumnya, RLS, grants, Data API, DB terisolasi, auth live, dan deployment belum dijalankan.
- Legacy `/api/programs*` masih mempertahankan body untuk enrolled wali/tentor/admin demi compatibility; release gate tetap memerlukan frontend cutover sebelum surface itu dapat dihapus total.
- Tidak ada frontend reader, browser QA, purchase writer, entitlement issuance, atau commit/push.



**Request:** lanjut MTR-3 dan MTR-4 memakai todo, kemudian push.

**Dikerjakan:**

- `backend/prisma/schema.prisma`: enum `EntitlementSource`, model `Entitlement`, relasi User/Course, unique per source, index active lookup.
- `backend/prisma/migrations/nc4_entitlements/migration.sql`: migration additive offline, FK cascade, index, RLS enabled default-deny.
- `packages/shared/src/index.ts`: enum source entitlement.
- `backend/src/middleware/auth.ts`: resolver optional-auth terpusat; anonymous hanya tanpa Authorization, token malformed/invalid/expired ditolak, role/active tetap dari DB; `requireAuth` mempertahankan response legacy.
- `backend/src/content/access.ts`: policy Course/Lesson terpusat untuk public, login-free, paid-entitlement, expiry, revoke, published/active gate; tidak auto-grant.
- `backend/tests/setup.ts`: boundary stub entitlement untuk policy berikutnya.

**Verifikasi:** Prisma format/validate/generate berhasil offline dengan env dummy; backend typecheck dan test typecheck exit 0; backend lint exit 0 dengan 14 warning baseline; `git diff --check` lulus. Tidak ada `migrate deploy`, `db push`, query live, seed, frontend, atau endpoint publik baru.

**Review adversarial:** menemukan dan memperbaiki future `publishedAt`, identity stale pada optional-auth, test boundary entitlement yang belum terpasang, `sourceRef` kosong, dan default timestamp `updatedAt`. RLS `FORCE` tidak dipakai karena Prisma server adalah privileged boundary; migration mencabut grant `anon`/`authenticated` sampai audit MTR-8.

**Residual:** policy belum dipasang ke MTR-5/MTR-6 route; migration belum live; RLS policy Data API menunggu MTR-8; test langsung MTR-3/MTR-4 belum ditambahkan sesuai instruksi sesi sebelumnya untuk menunda test baru.

### 2026-09-18 — MTR-1 dan MTR-2 selesai: kontrak API dan identity boundary

**Request:** lanjut MTR-1 dan MTR-2.

**Keputusan:** optional-auth menerima anonymous hanya bila Authorization tidak dikirim; bearer malformed/invalid/expired ditolak 401. Metadata publik boleh public cache, sedangkan reader authenticated/paid private/no-store. Pembaca fase awal tetap role admin/tentor/wali; tidak menambah `member`, phone nullable, provisioning, atau migration identity.

**Dikerjakan:**

- `packages/shared/src/index.ts`: menambah schema query katalog dengan pagination bounded, DTO allowlist katalog/detail/outline, discriminated reader success/error contract, breadcrumb, prev/next, dan access requirement.
- `tasks/todo.md`: MTR-1.1–1.5 dan MTR-2.1–2.4 ditutup; checkpoint C1 selesai.
- Threat model menetapkan `bodyText` sebagai aset utama; jalur risiko meliputi nested relation, legacy endpoint, search/navigation, cache lintas user, dan Data API. Mitigasi berikutnya diwajibkan melalui DTO allowlist, satu access policy, private caching, RLS default-deny, dan negative checks.

**Verifikasi:** shared/backend typecheck dan backend lint dijalankan setelah perubahan. Tidak ada endpoint, optional-auth middleware runtime, schema Prisma, migration, database, atau frontend yang diubah.

**Referensi resmi:** Supabase merekomendasikan verifikasi user server-side dan melarang `user_metadata` sebagai authority; changelog 2026-04-28 juga menegaskan exposure Data API tabel baru berubah dan tetap perlu audit grants/RLS. Express Router mendukung middleware namespace/route; implementasi runtime ditunda ke MTR-4.

**Residual:** MTR-3 Entitlement schema dan MTR-4 access policy/optional-auth runtime masih pending. Legacy `/api/programs*` tetap release blocker.

### 2026-09-18 — MTR-0 kontrak akses materi/blog selesai

**Request:** kerjakan MTR-0 saja terlebih dahulu.

**Keputusan:** Course free memakai cek login langsung tanpa auto-grant; paywall memakai 401/403/404 tanpa `bodyText`; purchase default lifetime; entitlement multi-baris per source; pembaca fase awal memakai role existing; namespace API `/api/catalog/*`, `/api/reader/*`, `/api/me/*`.

**Dikerjakan:** MTR-0.1–MTR-0.6 ditandai selesai di `tasks/todo.md`; keputusan diringkas di `GOALS.md` dan tabel keputusan file ini.

**Verifikasi:** seluruh enam keputusan memiliki nilai final dan tidak saling bertentangan: free tidak membutuhkan row entitlement, paid membutuhkan minimal satu source aktif, revoke satu source tidak mematikan source lain. Tidak ada perubahan source, schema, migration, dependency, database, atau frontend.

**Residual:** MTR-1 kontrak API/threat model masih pending. Schema/API belum boleh diimplementasikan sampai MTR-1 dan checkpoint kontrak selesai.

### 2026-09-18 — Checklist lengkap materi/blog ditambahkan, belum dieksekusi

**Request:** buat todo lengkap untuk materi yang dapat diakses publik, wajib login, atau wajib beli; jangan eksekusi sebelum task lengkap.

**Keputusan:** sesi ini planning-only. Tidak ada keputusan final tentang free auto-grant, masa akses purchase, multiple entitlement source, role `member`, atau response paywall; seluruhnya menjadi gate MTR-0.

**Dikerjakan:** `tasks/todo.md` ditambah MTR-0–MTR-12: kontrak akses, threat model/API, identity prerequisite, Entitlement, access policy, katalog, reader, library/progress, penutupan legacy/Data API, verifikasi backend, halaman reader, authoring UI, dan purchase flow.

**Verifikasi:** checklist memisahkan checkpoint contract, backend foundation, read API, frontend reader, serta authoring/purchase; seluruh checkbox baru tetap pending. Tidak ada source, schema, migration, dependency, database, atau frontend yang diubah.

**Residual:** user perlu menyetujui MTR-0.1–MTR-0.6 sebelum implementasi dimulai. `frontend/PRODUCT.md` merupakan file untracked hasil init Impeccable dari perintah sebelumnya dan tidak diubah pada sesi checklist ini.

### 2026-09-17 — Dokumentasi dipadatkan ke backend-first

**Request:** hapus Markdown yang sudah tidak relevan dan buat fokus utama backend.

**Dikerjakan:**

- Menambahkan `GOALS.md` sebagai pusat arah, urutan goal, blocker, dan gate.
- Memadatkan `AGENTS.md`, `README.md`, dan `SYSTEM_MAP.md` agar sesuai monorepo/backend aktual.
- Memadatkan `tasks/todo.md` menjadi checklist backend aktif.
- Memadatkan progress menjadi keputusan dan residual aktif.
- Menghapus roadmap/plan/design lama setelah informasi aktif dipindahkan ke dokumen inti.

**Verifikasi:**

- Referensi ke tujuh dokumen yang dihapus tidak tersisa pada Markdown aktif.
- `git diff --check` lulus; warning LF→CRLF hanya normalisasi line-ending.
- `npm run lint --workspace=backend` exit 0 dengan 14 warning `any` baseline dan tanpa error.
- `npm run typecheck --workspace=backend` serta `npm run typecheck:test --workspace=backend` exit 0.

**Residual:**

- Histori detail lama tidak lagi berada di file aktif; dapat dipulihkan dari Git bila diperlukan.
- Tidak ada perubahan kode aplikasi, schema, data, migration deployment, atau frontend.
