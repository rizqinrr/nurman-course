### 2026-08-06 — Landing `/landing`: nav Tentang Kami/Testimoni, hero benefits + harga pulse, section About & Testimoni

**Fase:** Funnel polish ad-hoc (branch `uiux`)
**Status sesi:** selesai — landing page dilengkapi menu nav baru (Tentang Kami, Testimoni), kartu kanan hero diganti daftar 5 keunggulan + badge harga mencolok beranimasi pulse (berjalan walau tidak disentuh), serta 2 section baru (Tentang Kami & Testimoni).

**Request user:** (1) tambah menu "About Us" dan menu lain yang pas di nav; (2) ganti isi kartu mock hero (Program/Calistung · Harga · Jadwal) menjadi 5 keunggulan (Laporan progres, Guru berpengalaman, Free konsultasi & trial, Jadwal fleksibel, Online & offline); (3) harga tetap ditampilkan, dibuat mencolok dengan efek berkedut walau tidak disentuh.

**Keputusan (klarifikasi):** (1) nav = Beranda · Tentang Kami · Program · Materi · Jenjang · Calistung · Testimoni (anchor untuk Tentang Kami & Testimoni, sisanya route funnel); (2) Tentang Kami dibuat sebagai section di landing (`#tentang`); (3) harga dipertahankan di kartu hero.

**Dikerjakan:**
- **Data** `frontend/data/landing.ts`: `heroBenefits` (5 keunggulan) + `AboutPoint`/`aboutPoints` (4 poin: progres, tentor, fleksibel, konsultasi — dengan key icon).
- **`LandingHero.tsx`:** kartu kanan — hapus 3 baris config mock (Program/Harga/Jadwal), ganti blok harga besar "15rb/sesi" + badge "Termurah di Cilacap" dengan `<span className="animate-ping">` (efek pulse terus-menerus, ikut `prefers-reduced-motion`), dan daftar 5 keunggulan dengan ikon `CircleCheck`.
- **Komponen baru** `components/landing/LandingAbout.tsx` (section `#tentang`, `scroll-mt-24`, 2 kolom: teks kiri + grid 4 poin kanan, ikon lucide) dan `LandingTestimonials.tsx` (section `#testimoni`, `scroll-mt-24`, grid 1/2/3 kolom, reuse data `testimonials`, rating 5 bintang).
- **`LandingNav.tsx`:** tambah `Tentang Kami` (`#tentang`) & `Testimoni` (`#testimoni`); gap desktop `gap-6 → gap-5` agar 7 item muat.
- **`app/landing/page.tsx`:** urutan Hero → Stats → About → Categories → Testimoni → CTA → Footer.
- **`globals.css`:** tambah `.animate-ping { animation: none }` di blok `prefers-reduced-motion`.
- **Verifikasi:** `tsc --noEmit` exit 0; `next build` sukses (`○ /landing`).

**Residual:** QA visual browser — cek 7 menu nav desktop tidak terlalu sempit di `max-w-6xl`, anchor scroll tidak ketutup nav, animasi ping tidak mengganggu saat scroll di mobile.

---

### 2026-08-06 — Landing page baru `/landing` (preview terpisah, template Dreams LMS + data statis)

**Fase:** Funnel polish ad-hoc (branch `uiux`)
**Status sesi:** selesai — halaman landing terpisah `/landing` dibuat dengan struktur template `landingpagedesign.md` (nav + hero + stats + kategori + CTA + footer), warna disesuaikan ke sistem glassmorphism light `#4a70a9`, semua konten dari data statis.

**Request user:** punya file `landingpagedesign.md` (template "Dreams LMS"); minta warnanya disesuaikan dengan sistem (glassmorphism light `#4a70a9`), desain keren untuk landing, dan bisa tampil dengan data statis dulu.

**Keputusan (klarifikasi):** (1) halaman baru terpisah (bukan rombak `/course`); (2) struktur template Dreams LMS + data statis.

**Dikerjakan:**
- **Data** `frontend/data/landing.ts`: tambah `LandingStat` + `landingStats` (4 kartu) dan `LandingCategory` + `landingCategories` (4 program: materi/jenjang/calistung/konsultasi dengan ikon, rute, countLabel).
- **Komponen baru** `frontend/components/landing/`: `LandingNav` (fixed glass nav, mobile menu, CTA → `/course/program`), `LandingHero` (badge + headline gradient + search form → `/course/program` + avatar stack + kartu konfigurasi mock + floating chips, framer-motion), `LandingStats` (4 kartu overlap hero, `CountUp`), `LandingCategories` (grid 4 kartu → route funnel), `LandingCta` (banner gradient CTA), `LandingFooter`.
- **Route baru** `frontend/app/landing/page.tsx`: metadata sendiri + rangkai section, background gradient `from-[#4a70a9]/40 via-white`.
- **Verifikasi:** `tsc --noEmit` frontend exit 0; `next build` 35 routes OK (termasuk `○ /landing` static). Middleware tidak menyentuh `/landing` (hanya `/app/*` & `/login`).

**Residual:** QA visual di browser — cek hero/stats/kategori di mobile (375px) & desktop; angka statistik statis (bukan realtime); search form hanya mengarah ke `/course/program` (belum filter data).

---

### 2026-08-06 — Preview markdown penuh di halaman admin Roadmap + komponen MarkdownContent bersama

**Fase:** ADM-4.3 polish (branch `uiux`)
**Status sesi:** selesai — konten langkah & materi di `/app/admin/roadmap` kini ditampilkan penuh sebagai markdown ter-render (bukan hanya baris pertama), dan renderer markdown di-extract jadi komponen bersama yang dipakai juga oleh halaman wali `[slug]`.

**Request user:** konten/deskripsi panjang yang diinput hanya tampil baris teratas di preview (langkah maupun materi); ingin format markdown supaya mudah.

**Root cause:** `RoadmapClient.tsx` memakai helper `previewText` (hanya mengambil baris pertama non-heading/bullet) + `line-clamp-2`/`line-clamp-1` → konten panjang terpotong jadi satu baris. Renderer markdown lengkap sebenarnya sudah ada di halaman wali `(wali)/program/[slug]/page.tsx` tapi masih lokal.

**Keputusan (klarifikasi):** (1) render penuh markdown tanpa potongan; (2) extract renderer jadi komponen bersama + refactor halaman wali.

**Dikerjakan:**
- **Komponen baru** `frontend/components/ui/MarkdownContent.tsx`: `{ text, className? }`, menampung logika `renderInlineStyles` (split `**` → bold) + render baris (`## ` → h4 indigo + border-b, `- ` → bullet, `# ` → skip, lain → paragraf); class wrapper identik dengan renderer lama; tanpa `"use client"` (murni presentasional).
- **`RoadmapClient.tsx`:** hapus `previewText`; import `MarkdownContent`; preview step card → `<MarkdownContent text={step.bodyText} />` dan materi item → `<MarkdownContent text={material.bodyText} />` (konten penuh); alignment aksi materi diubah `sm:items-start` agar tetap di atas saat konten tinggi.
- **`(wali)/program/[slug]/page.tsx`:** hapus `renderInlineStyles` + `renderMarkdownContent` lokal; import & pakai `<MarkdownContent text={step.bodyText} />` (konten expanded). Preview ringkas di card tertutup (`bodyText.split("\n")[1]`) dibiarkan — tampilan existing wali.
- **Verifikasi:** `tsc --noEmit` frontend exit 0; `next build` 34 routes OK. Tanpa perubahan backend → tidak restart.

**Residual:** QA visual: halaman admin roadmap (isi langkah/materi panjang tampil penuh, markdown bold/##/bullet benar) + halaman wali `/app/program/[slug]` (konten expanded tetap tampil sama).

---

### 2026-08-06 — ADM-4.2 + ADM-4.3 selesai: API & UI Roadmap + Materi Teks (kelola peta jalan belajar)

**Fase:** ADM Phase 4 (branch `uiux`)
**Status sesi:** selesai — admin kini bisa menyusun peta jalan belajar bertingkat per program ber-roadmap dan mengelola materi teks tiap langkah, lengkap dengan reorder step & materi, editor teks, preview, dan delete dengan konfirmasi.

**Konteks keputusan:** roadmap & materi **hanya untuk program ber-level** (komputer & vibe coding). Penanda = `Program.hasRoadmap` (boolean), bukan turunan kategori. Materi menempel di `RoadmapStep.level` (tanpa kolom level terpisah di `MaterialItem`). Keputusan UI (klarifikasi user): halaman baru + sidebar; tambah endpoint reorder materi; reorder pakai tombol atas/bawah (bukan drag).

**Dikerjakan sesi ini (ADM-4.2 lanjutan + ADM-4.3):**
- **Backend** `backend/src/index.ts`: tambah `POST /api/admin/roadmap-steps/:stepId/materials/reorder` (body `{materialIds}`, validasi array + cek step via `assertRoadmapStepHasRoadmap` + semua ID milik step tsb, `$transaction` update order, return `{data}`).
- **Frontend tipe** `frontend/data/lms.ts`: tambah interface `MaterialItem {id, roadmapStepId, order, title, bodyText}`.
- **Halaman baru** `frontend/app/app/admin/roadmap/page.tsx` (server wrapper + Suspense) & `RoadmapClient.tsx` (client):
  - Program selector dropdown (hanya program `hasRoadmap`, dari `/api/admin/programs`, support pre-select `?program=<id>`).
  - Timeline step (gaya halaman wali `[slug]`): nomor urut, judul, badge level, preview bodyText, aksi ↑/↓/Edit/Hapus + toggle "Materi (N)".
  - Panel materi per step (lazy-load saat expand): list materi (judul + preview + ↑/↓/Edit/Hapus) + tombol "Tambah Materi".
  - Form step (judul, level opsional, konten) & form materi (judul, konten) = modal overlay glassmorphism; validasi via schema shared (`createRoadmapStepSchema`/`updateRoadmapStepSchema`, `createMaterialItemSchema`/`updateMaterialItemSchema`).
  - Reorder step → `POST .../roadmap/reorder`; reorder materi → endpoint baru. Hapus → `ConfirmDialog` (existing).
  - Empty/loading/error state konsisten pola admin (program page).
- **Layout admin** `frontend/app/app/admin/layout.tsx`: pisah `desktopNavLinks` (sidebar, tambah item "Roadmap" icon `Map`) vs `mobileNavLinks` (bottom nav tetap 8 item — tidak padat).
- **Halaman Program** `frontend/app/app/admin/program/page.tsx`: tombol "Roadmap" (link `/app/admin/roadmap?program=<id>`) hanya untuk program `hasRoadmap`.
- **Verifikasi:** `tsc --noEmit` backend exit 0; `tsc --noEmit` frontend exit 0; `next build` sukses 34 routes (termasuk `/app/admin/roadmap`).

**Residual:** backend perlu restart (`npm run dev --workspace=backend`) agar endpoint reorder materi aktif. QA manual: pilih program → tambah/edit/hapus/reorder langkah → expand → tambah/edit/hapus/reorder materi → cek tampilan di portal wali `/app/program/[slug]` (program ber-roadmap). ADM-4.C4 dianggap terpenuhi (order, cascade delete step, validasi konten zod, wali read regression OK).

**Fix 2026-08-06 (ditemukan saat QA):** halaman tidak bisa menyimpan langkah/materi baru karena validasi client memakai `createRoadmapStepSchema`/`createMaterialItemSchema` yang mewajibkan `programId`/`roadmapStepId` (padahal field tsb diisi server via `req.params`, bukan body). Solusi: validasi create memakai `.omit({ programId: true })` / `.omit({ roadmapStepId: true })` di `RoadmapClient.tsx` (`handleSaveStep`/`handleSaveMaterial`). Edit (update) tidak terdampak. `tsc --noEmit` frontend exit 0.

---

### 2026-08-06 — Riwayat admin gabung (tagihan+prabayar) + detail semua status + modal konfirmasi terbitkan tagihan

**Fase:** UIUX (branch `uiux`)
**Status sesi:** selesai — halaman admin Tagihan kini satu daftar riwayat gabungan (invoice + prabayar) dengan sortir 1 tombol Terbaru/Terlama dan filter status; tombol "Detail" tersedia untuk semua status (bukan hanya waiting); menerbitkan tagihan wajib modal konfirmasi (pola ConfirmDialog logout). Wali juga bisa buka detail dari baris riwayat (modal-only, `hideLink`).

**Request user:** (1) "disini juga ga perlu dipisahkan riwayat pembayaran antara yang tagihan dan prabayar, jadiin 1 aja, ada filter terbaru dan terlama, cukup 1 tombol, tergantung terakhir nampilin dari yang terbaru atau yang terlama"; (2) "untuk tiap menerbitkan tagihan, harus ada modal konfirmasi kayak pas mau logout". Ditambah pelengkap dari request sebelumnya yang belum dieksekusi: admin & wali bisa buka detail (bukti) dari semua baris riwayat.

**Dikerjakan:**
- **`components/ui/ProofModal.tsx`:** prop baru `hideLink?: boolean` — menyembunyikan navigasi foto & tombol bawah "Detail Invoice"/"Lihat Bukti" (PDF tetap bisa dibuka via blob URL), tombol Tutup menjadi `flex-1`. Admin tetap memakai `detailHref`.
- **`app/app/admin/tagihan/page.tsx`:**
  - Hapus section terpisah "Pembayaran Prabayar" (beserta header HandCoins).
  - Satu daftar `historyItems` gabungan invoice+prepayment: `getTxDate` (invoice: paidAt??submittedAt??dueAt; prepayment: paidAt??submittedAt??createdAt), filter status client-side (`matchesStatus` — opsi Semua/Belum Dibayar/Verifikasi/Lunas/Dibatalkan) + search nama murid (`matchesSearch`), sortir `historySort`.
  - Sortir **1 tombol toggle** Terbaru/Terlama (ikon `ArrowDownWideNarrow`/`ArrowUpNarrowWide`) — sekali klik membalik urutan.
  - `loadInvoices` kini tanpa `status` di query server (filter pindah client-side), dependensi `[search]`.
  - Tombol "Detail" (Eye) muncul di **semua status** invoice & prepayment (sebelumnya hanya waiting). Invoice tetap `proofDetailHref` → `/app/admin/tagihan/[id]`; prepayment modal-only.
  - Terbitkan tagihan: `handleSubmit` hanya validasi + buka `ConfirmDialog` (`confirmPublishOpen`); aksi terbit sebenarnya di `publishInvoice` (membaca form terakhir).
- **`app/app/(wali)/tagihan/page.tsx`:** tombol "Detail" (Eye) di setiap baris riwayat — mobile card (invoice & prepayment) dan desktop table (kolom Aksi baru) → `openWaliInvoiceDetail` (note=paymentNote) / `openWaliPrepaymentDetail` (program "Prabayar", murid=selectedMurid) → state `proofWali` → `<ProofModal hideLink>`.
- **Verifikasi:** `tsc --noEmit` frontend exit 0; `next build` 33 routes OK. Tanpa perubahan backend → tidak restart.

**Residual:** QA visual: admin Tagihan (daftar gabungan, toggle urut, filter status, Detail semua status, modal konfirmasi terbit); wali Tagihan → Lihat Semua Riwayat (Detail per baris, modal tanpa link navigasi). Prepayment detail tetap modal-only (tidak ada route `[invoiceId]` khusus).

---

### 2026-08-06 — Dashboard wali: sesi terdekat ke atas + riwayat tagihan gabung prabayar

**Fase:** UIUX (branch `uiux`)
**Status sesi:** selesai — sesi terdekat langsung terlihat di dashboard wali, riwayat pembayaran wali digabung (invoice + prabayar) dalam satu tempat yang hanya tampil saat tombol "Lihat Semua Riwayat" diklik, plus filter urut Terbaru/Terlama.

**Request user:** (1) "sesi terdekat, atau jadwal, harusnya berada di bagian yang bisa langsung terlihat saat membuka dashboard"; (2) "riwayat pembayaran walau pun prabayar tetap dijadiin satu tempat, hanya muncul jika tombol lihat semua riwayat di klik". Keputusan (klarifikasi): dashboard pindahkan Sesi Terdekat + Tagihan Ringkas ke atas, tetapi Tagihan Ringkas hanya tampil di atas jika ada tagihan jatuh tempo H-1 (≤ 24 jam); jika tidak ada, tagihan ringkas tetap di bawah. Sortir riwayat = "Terbaru/Terlama" berdasarkan tanggal transaksi (paidAt ?? submittedAt ?? createdAt/dueAt).

**Dikerjakan:**
- **`(wali)/dashboard/page.tsx`:**
  - Tambah `isUrgentInvoice` (unpaid & dueAt ≤ now + 24h) & `hasUrgentInvoice`.
  - Ekstrak kartu `sessionCard` & `invoiceCard` jadi variabel JSX (tulis sekali).
  - Sisipkan Top Block (grid 2 kolom) setelah header: `sessionCard` selalu + `invoiceCard` hanya jika `hasUrgentInvoice`.
  - Blok bawah: `invoiceCard` hanya jika `!hasUrgentInvoice` (tidak dobel).
- **`(wali)/tagihan/page.tsx`:**
  - Hapus blok "Riwayat Prabayar" dari kartu Prabayar (sebelumnya selalu tampil, slice 5).
  - `getTxDate(item)` (invoice: paidAt??submittedAt??dueAt; prepayment: paidAt??submittedAt??createdAt) + `historyItems` (gabungan, sortir `historySort`).
  - Section "Riwayat Pembayaran": tambah kontrol sortir Terbaru/Terlama; render `historyItems` (mobile card + desktop table) dengan baris prabayar ber-badge "Prabayar" (indigo), program "Prabayar (tanpa tagihan)" + catatan, status Lunas/Menunggu/Dibatalkan, tanggal kirim/dibayar.
- **Verifikasi:** `tsc --noEmit` frontend exit 0, `next build` 33 routes OK. Tanpa perubahan backend → tidak restart.

**Residual:** QA visual: dashboard wali (sesi di atas, tagihan H-1 kondisional), tagihan → Lihat Semua Riwayat (gabungan + sortir). Definisi H-1 = 24 jam ke depan (hardcode di dashboard).

---

### 2026-08-06 — Fix kolom Program kosong di detail prepayment admin

**Fase:** TENTOR-14 follow-up (branch `uiux`)
**Status sesi:** selesai — kolom Program di modal detail prepayment kini menampilkan program aktif murid.

**Temuan:** detail yang tampil dengan Program "-" bukan invoice reguler tapi **Prepayment** (bayar sebelum tagihan). Schema `Prepayment` hanya punya `muridId`, tanpa relasi program → `ProofModal` baca `enrollment?.program?.name` yang undefined → "-".

**Dikerjakan:**
- BE `GET /api/admin/prepayments` (`backend/src/index.ts`): include `murid.enrollments` (status `active`, `take 1`, `orderBy startedAt desc`) + `program {id,name}`.
- FE `admin/tagihan/page.tsx`: `AdminPrepayment.murid.enrollments?`; `openPrepaymentProof` isi `enrollment.program` dari enrollment aktif pertama (fallback `-`).
- **Verifikasi:** `tsc` BE exit 0, `next build` 33 routes OK, backend restart (port 5000, health OK), data DB Jono = enrollment aktif "Kelas Ngaji Al-Qur'an".

**Residual:** tidak ada untuk issue ini.

---

### 2026-08-06 — Dashboard admin real + prabayar + jadwal admin + proof detail

**Fase:** TENTOR-14 (branch `uiux`)
**Status sesi:** selesai — dashboard admin menampilkan data nyata dari endpoint baru, wali bisa kirim pembayaran prabayar (nominal + bukti + catatan) yang muncul di section admin Tagihan, admin bisa kelola jadwal seluruh murid, bukti transfer dilihat lewat modal generik + halaman foto-fullscreen.

**Request user:** (1) dashboard admin menampilkan angka 0 semua (data tidak muncul); (2) "prabayar gimana, harusnya bisa upload foto dan kasih note?"; (3) admin bisa buat jadwal dengan memilih enrollment; (4) tombol Detail bukti → buka modal (default buka di tab sama, foto buram), klik foto buka halaman baru hanya foto. Keputusan: istilah route "invoice" (`/app/admin/tagihan/[invoiceId]`) asal konsisten; prabayar jadi **section** di dalam halaman admin Tagihan (bukan halaman terpisah); kolom catatan berlaku untuk **prabayar & pembayaran invoice reguler** (`Invoice.paymentNote`), field `note` admin tetap label periode.

**Temuan (root cause dashboard 0):** `frontend/app/app/admin/page.tsx` membaca shape yang salah: `/api/admin/murids` mengembalikan `{data}` tapi kode baca `.murids`; `/api/admin/tentors` baca `.tentors`; invoice diambil dari endpoint wali `/api/me/invoices`; `todaySessions` difilter dengan perbandingan string tanggal yang tidak pernah cocok → semua variabel `undefined` → stats 0. Solusi: endpoint baru `GET /api/admin/dashboard` (Opsi A, hitung di server), bukan patch frontend-only.

**Dikerjakan:**
- **Dashboard admin:**
  - BE `GET /api/admin/dashboard` (requireAdmin) → `{data:{programsActive,muridsActive,tentorsActive,invoicesPending,sessionsToday}}`; `sessionsToday` dihitung dengan batas hari Asia/Jakarta (offset +7h) status scheduled.
  - FE `admin/page.tsx`: baca hanya `.data` dari `/api/admin/dashboard`, `useState<AdminDashboardData|null>`, stats "aktif belajar / terdaftar aktif / belum lunas / menunggu".
- **Prabayar wali (bayar sebelum tagihan):**
  - Prisma `Prepayment` (`muridId,amount,status(waiting|paid|cancelled),note,paymentProof,paymentProofName,submittedAt,paidAt` + relasi `Murid.prepayments`); `Invoice.paymentNote String?`. `prisma db push` + `generate` sukses (BE sempat di-stop untuk generate).
  - Shared `createPrepaymentSchema` (muridId, amount, proofBase64, proofName default "", note 0–500).
  - BE: `GET/POST /api/me/prepayments` (wali, guard kepemilikan murid, create waiting + simpan bukti/note/submittedAt); `GET /api/admin/prepayments`; `PATCH /api/admin/prepayments/:id/status` (paid→paidAt, cancelled, waiting); `POST /api/me/invoices/:id/payment` kini persist `paymentNote: note||null`; `GET /api/admin/notifications` → `{waitingInvoices,waitingPrepayments}`.
  - FE wali `(wali)/tagihan/page.tsx`: state `prepayments` + `paymentNote`; note textarea di kartu invoice aktif; kartu prabayar tombol utama "Kirim Data Pembayaran" (submit real), WA jadi sekunder; riwayat prabayar chips Lunas/Menunggu/Dibatalkan.
  - FE admin `admin/tagihan/page.tsx`: section "Pembayaran Prabayar" (list nominal + murid/wali + catatan + status chip + bukti modal + tombol Lunas/Batalkan); tampilkan `paymentNote` di kartu waiting; modal kini generic (`proofData` + `detailHref`).
  - Badge admin layout = `waitingInvoices + waitingPrepayments`.
- **Jadwal admin:**
  - BE mirror tentor: `GET/POST /api/admin/sessions` (createTentorSessionSchema, enrollment wajib `active`, overlap 409, tentorId dari enrollment), `PATCH/DELETE /api/admin/sessions/:id` (recompute WIB, guard laporan/completed).
  - FE baru `admin/jadwal/page.tsx` (copy `tentor/jadwal`, endpoint `/api/admin/sessions` + `/api/admin/enrollments?status=active`, tanpa laporan, tampil tentor) + nav "Jadwal" di layout admin.
- **Proof detail:**
  - Route `admin/tagihan/[invoiceId]/page.tsx`: halaman foto-only dark slate full-screen, PDF buka via blob; tombol "Detail Invoice".
  - `components/ui/ProofModal.tsx` generic: `isPrepayment?`, `note?`, `murid` top-level, `detailHref?`; klik foto → halaman baru; tombol header switch "Lihat Bukti"/"Detail Invoice".
- **Verifikasi:** `tsc --noEmit` backend exit 0; `next build` sukses 32 routes (termasuk `/app/admin/jadwal`); backend di-restart (`ts-node`, port 5000, health OK).

**Residual:** QA manual: wali kirim prabayar (nominal+bukti+catatan) → muncul section Prabayar admin → Lunas/Batalkan; wali bayar invoice reguler dengan catatan → catatan tampil di kartu admin; admin buat jadwal dari enrollment → muncul di wali & tentor; dashboard angka tidak 0 lagi. Belum ada route `[invoiceId]` khusus untuk prepayment (modal-only + detailHref kosong). Backend berjalan (port 5000) saat sesi ditutup.

---

### 2026-08-06 — Flow pembayaran invoice real + badge notif (wali & admin)

**Fase:** TENTOR-13 (branch `uiux`)
**Status sesi:** selesai — wali bisa kirim bukti pembayaran ke sistem (muncul di admin), badge angka merah di bottombar/sidebar wali (tagihan unpaid) & admin (pembayaran menunggu verifikasi).

**Request user:** "kalo wali mau bayar, flow sistemnya gimana? harusnya ada tombol kirim data pembayaran sebagai trigger biar muncul di admin; kalau admin kirim tagihan ada badge merah kecil di logo card bottombar wali; kalau wali bayar ada badge merah kecil di menu pembayaran admin." Keputusan: prabayar dilewati (WA-only), badge = angka, tombol WA sekunder = logo WA hijau + teks "Konfirmasi Pembayaran", tombol Keluar dibuat rata tengah.

**Temuan:** flow pembayaran sebelumnya **mock** — upload bukti hanya menyimpan nama file di state React, tombol "Konfirmasi via WhatsApp" hanya buka wa.me (data tidak masuk sistem), admin tidak pernah melihat bukti; tidak ada badge notif.

**Dikerjakan:**
- **Schema** `backend/prisma/schema.prisma`: Invoice + `paymentProof` (base64), `paymentProofName`, `paidAmount`, `submittedAt`. `prisma db push` sukses; `prisma generate` sempat `EPERM` (DLL terkunci backend jalan) → stop BE → generate OK.
- **Shared** `packages/shared`: `submitPaymentSchema` (amount opsional, proofBase64 wajib, proofName, note).
- **Backend** `backend/src/index.ts`:
  - `POST /api/me/invoices/:id/payment` (wali): guard punya invoice (via enrollment.murid.waliId) + status harus `unpaid` (409 jika bukan) → set `waiting` + simpan bukti/nominal/submittedAt.
  - `GET /api/me/notifications` → `{ unpaidInvoices }` (count wali).
  - `GET /api/admin/notifications` → `{ waitingInvoices }` (count admin).
- **Frontend wali** `(wali)/tagihan/page.tsx`: upload bukti real (resize canvas 400px JPEG 80% pola foto tentor/murid, PDF raw max ~3MB, preview gambar), tombol utama "Kirim Data Pembayaran" (submit ke BE), setelah submit status jadi "Menunggu Verifikasi" + box info Dibayar/Terkirim/File (tanpa re-upload); tombol WA sekunder `bg-[#25D366]` + logo WhatsApp SVG + teks "Konfirmasi Pembayaran"; tombol prabayar disamakan (logo WA hijau). Bagian "Tagihan Belum Dibayar" → "Tagihan Aktif" (unpaid + waiting).
- **Badge layout:**
  - `(wali)/layout.tsx`: badge angka merah di item Tagihan (sidebar + bottombar) = count unpaid, refetch tiap `pathname` berubah.
  - `admin/layout.tsx`: badge angka merah di item Tagihan (sidebar + bottombar) = count waiting, refetch tiap `pathname`.
- **Admin tagihan** `admin/tagihan/page.tsx`: kartu status "waiting" menampilkan thumbnail bukti (klik buka full / buka PDF) + nominal dibayar + waktu terkirim + nama file.
- **Rata tengah "Keluar":** `tentor/profil/page.tsx` & `(wali)/profile/page.tsx` wrapper jadi `flex justify-center` (tombol tetap compact).
- **Verifikasi:** `tsc --noEmit` backend exit 0, `next build` sukses 32 routes. Backend di-restart saat verifikasi, lalu dimatikan atas permintaan user (user tes sendiri).
- **Catatan:** user memutuskan tes backend secara mandiri.

**Residual:** QA manual: wali upload+kirim → muncul "Menunggu Verifikasi" + badge admin; admin lihat bukti & tandai Lunas → badge hilang. Prabayar tetap WA-only (task follow-up bila mau diwire).

---

### 2026-08-06 — Profil & konfirmasi logout semua role (duplikat badge, tombol compact, popup)

**Fase:** TENTOR-12 (branch `uiux`)
**Status sesi:** selesai — badge "Tentor" dobel dihapus, tombol "Keluar" profil jadi compact & sejajar, semua tombol logout (semua role) kini memakai popup konfirmasi.

**Request user:** "dihalaman profil tentor ada 2 tulisan tentor dibawah foto (tampilan mobile), tombol keluarnya ga sejajar dalamnya (logo keluar dengan tulisan keluar ga sejajar), tombolnya dikecilin aja, disesuaikan sama ukuran font dan logo, kalo di klik ada pop up konfirmasi dulu, begitu pula untuk semua role" + "ya samakan" (profil wali ikut disamakan).

**Temuan:**
- `tentor/profil/page.tsx:97-100`: 2 badge role di bawah nama — `<Shield>{profile.role}</Shield>` + badge abu-abu hardcode `Tentor` → tampil dobel di mobile.
- `tentor/profil/page.tsx:142-144`: `<Button className="w-full h-11 justify-center ... gap-2">` — komponen `Button` (components/ui/Button.tsx) **tidak punya `flex` bawaan**, jadi `justify-center`/`gap-2` tidak berefek dan ikon+teks tidak sejajar; tombol juga kebesaran (`w-full h-11`).
- Belum ada konfirmasi logout di role mana pun.

**Dikerjakan:**
- **Baru `components/ui/ConfirmDialog.tsx`:** modal konfirmasi glassmorphism (overlay `bg-black/30 backdrop-blur-sm`, kartu `bg-white/85 rounded-3xl`, ikon LogOut lingkaran merah, tombol "Ya, Keluar" merah / "Batal" ghost, tutup via X / klik overlay). Pola meniru modal `course/page.tsx`.
- **Baru `lib/useLogout.tsx`:** hook wrap `supabase.auth.signOut()` + `router.push("/login")` + `router.refresh()`, kembalikan `{ askLogout, logoutDialog }`. (Sempat `.ts` → gagal build karena JSX → rename `.tsx`.)
- **`tentor/profil/page.tsx`:** hapus badge abu-abu `Tentor` (sisakan badge role Shield); tombol Keluar jadi compact `inline-flex items-center gap-2 rounded-xl bg-red-500 ... px-4 py-2 text-sm` + `<LogOut size={16} />`; pakai `useLogout` (hapus `handleLogout`/`createClient`/`useRouter`).
- **`tentor/layout.tsx`:** tombol "Keluar" sidebar → `askLogout`, render dialog.
- **`admin/layout.tsx`:** tombol "Keluar" sidebar desktop + bottom-nav mobile → `askLogout`, render dialog.
- **`(wali)/profile/page.tsx`:** tombol "Keluar dari Akun" disamakan compact + konfirmasi (user setuju "samakan").
- **Verifikasi:** `next build` sukses 32 routes, TypeScript pass. Tanpa perubahan backend → tidak perlu restart BE.

**Residual:** QA manual visual: profil tentor mobile (satu badge saja), klik Keluar tiap role → popup konfirmasi → "Ya, Keluar" logout ke `/login`. Tombol cetak mobile harian/perkembangan masih open task (bila mau dikerjakan).

---

### 2026-08-05 — Tentor: hapus akses portal (Pilih Portal dead-end)

**Fase:** TENTOR-10 (branch `uiux`)
**Status sesi:** selesai — tombol "Pilih Portal" milik tentor dihapus dari UI.

**Request user:** "seharusnya tentor ga bisa akses portal" (saat QA tombol cetak laporan harian mobile).

**Temuan:** `frontend/middleware.ts:35-40` sudah memblokir role `tentor` dari `/app` (portal selector), `/app/admin/*`, dan halaman wali — redirect ke `/app/tentor/dashboard`. Jadi tombol "Pilih Portal" tentor adalah dead-end, hanya membersihkan UI.

**Dikerjakan:**
- `frontend/app/app/tentor/layout.tsx`: hapus `Link href="/app"` "Pilih Portal" (sidebar desktop), sisakan "Keluar"; hapus import `UserCheck` yang jadi tak terpakai.
- `frontend/app/app/tentor/profil/page.tsx`: hapus tombol "Pilih Portal" (`Button variant="ghost"`), grid `grid-cols-2` → `grid-cols-1` tombol "Keluar" full-width. `Link`/`Button` tetap dipakai di tempat lain (back arrow, error state).
- Admin tetap punya "Pilih Portal" (`admin/layout.tsx`) — middleware mengecualikan admin. Wali tidak pernah punya tombol ini.
- **Verifikasi:** `next build` sukses 32 routes, TypeScript pass (tidak ada unused import `UserCheck`).

**Residual:** tidak ada. (Catatan: tombol cetak mobile yang sempat tidak muncul masih open — task terpisah bila dikerjakan.)

---

### 2026-08-05 — Tombol WhatsApp wali `/app/laporan` ikon-only hijau + nomor mentor

**Fase:** TENTOR-11 (branch `uiux`)
**Status sesi:** selesai — semua tombol WA di halaman wali jadi logo WhatsApp hijau `#25D366` tanpa teks; tombol per-kartu menuju nomor mentor, empty-state tetap ke admin.

**Request user:** "tidak perlu ada tulisan pada tombol diskusi atau konsultasi, cukup pake logo whatsapp saja, warnannya sesuai whatsapp, dan nomor yang dituju nomor mentor" + "ada juga tombol diskusi via whatsapp itu, dihapus juga tulisannya, pakai logo wa aja".

**Dikerjakan:**
- **Backend `GET /api/me/progress-reports`** (`backend/src/index.ts`): untuk role `wali`, tiap `ProgressReport` di-enrich `tentor { id, name, phone }` dari `Enrollment` (cocokkan `muridId`+`programId`, prefer status `active`, fallback enrollment pertama). `ProgressReport` tidak punya relasi tentor, jadi mapping lewat enrollment. Branch tentor/admin tidak berubah.
- **Frontend `(wali)/laporan/page.tsx`:**
  - Tambah komponen SVG `WhatsAppIcon` (path logo WhatsApp resmi, viewBox 0 0 24 24) — lucide tidak punya brand icon.
  - Tipe lokal `DbDailyReport.session.tentor` tambah `phone?`; `DbProgressReport` tambah `tentor?: { id; name; phone? } | null`.
  - `handleContactTutorWA`: nomor tujuan `session.tentor.phone || WHATSAPP_NUMBER`.
  - `handleContactAdminProgressWA`: nomor tujuan `tentor.phone || WHATSAPP_NUMBER`; greeting jadi `Halo {mentor?.name || "Admin Nurman Course"}`.
  - 4 tombol WA jadi `button`/`a` lingkaran `w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#1fb858]` + logo putih: per-kartu "Diskusi via WhatsApp" & "Konsultasi Perkembangan Anak" (ke mentor), empty-state "Hubungi Admin" 2× (ke admin). Teks dihapus, pakai `title`/`aria-label` untuk aksesibilitas.
  - Hapus import `Button` dan `MessageSquare` yang tak terpakai lagi.
- **Verifikasi:** `tsc --noEmit` backend exit 0, `next build` sukses 32 routes. Backend di-restart (PID lama 22416 → 3384) agar route progress-reports aktif.
- **Catatan:** User memutuskan test backend secara mandiri.

**Residual:** perlu QA manual wali `/app/laporan` (klik ikon WA per-kartu → terbuka ke nomor mentor yang sesuai). Tombol cetak mobile harian/perkembangan masih open task bila mau dikerjakan.

---

### 2026-08-05 — Tentor Jadwal Manual + Cetak PDF Rapi (Harian & Perkembangan) — Profil Sejajar

**Fase:** ADM-5 / TENTOR-8 & 9 (branch `uiux`)
**Status sesi:** selesai — fix 404 Buat Jadwal, cetak rapi window.print tabel terstruktur, tombol mobile, alamat Kalisabuk, nama tentor dinamis.

**Request user:**
- `POST /api/me/sessions` 404 padahal payload benar → perlu restart BE.
- Tambah fitur cetak PDF laporan harian & perkembangan, window.print saja yg penting rapi, ada tabel inti terstruktur, alamat Jalan Kalisabuk, tombol cetak harus ada di mobile.

**Root cause 404:**
- Backend PID 13232 versi lama tanpa `POST /api/me/sessions` (enrollmentId/date/startTime/endTime). Kill & restart `npm run dev --workspace=backend` → route baru aktif.

**Dikerjakan:**
- **Profil sejajar:** `frontend/app/app/tentor/profil/page.tsx:141` `grid grid-cols-2 gap-3` + `h-11 rounded-xl` both tombol `Pilih Portal | Keluar`.
- **Backend jadwal tentor:** `backend/src/index.ts` `POST /api/me/sessions` enrollment check tentorId=me, overlap 409, location default `murid.address`, `PATCH` reschedule/batal guard laporan, `DELETE` guard laporan; `GET /api/me/sessions` include `tentor {id,name}` untuk wali. Shared `createTentorSessionSchema/updateTentorSessionSchema` validasi date `YYYY-MM-DD`, time `HH:mm`, end>start.
- **Laporan Harian print:** `LaporanHarianClient.tsx` rewrite: `tentorName` dari `/api/users/me` (ganti hardcode `Kak Kiki`), const `NURMAN_ADDR=Jalan Kalisabuk`, `handlePrint` set `document.title` blok, tombol cetak desktop `Cetak PDF` + sticky mobile bottom `Cetak Hasil Belajar Terbaru (Blok N)` di `bottom-[72px]`, print template `@page A4 12mm`, kop `NURMAN COURSE` + alamat Kalisabuk, info box 2-col border-black, tabel 5 col `No|Hari & Tanggal|Jam|Materi/Aktivitas|Catatan Evaluasi` dengan `break-inside: avoid`, ringkasan blok, ttd Wali/Tentor dynamic + alamat.
- **Laporan Perkembangan print:** `LaporanPerkembanganClient.tsx` sama: `tentorName` dynamic, alamat Kalisabuk, tombol cetak desktop+sticky mobile `Cetak Rapor Blok N`, print template: kop sama, info box, tabel `Pencapaian Utama No|Poin`, grid 2 tabel `Materi Dikuasai` & `Butuh Pengulangan` masing-masing bordered, box `Catatan & Saran`, ttd dynamic.
- **Jadwal UI:** `jadwal/page.tsx` cleanup debug `console.log` → error handling clean fallback `Backend belum restart...`, enrollment dropdown, edit/batal/hapus.
- **Wali jadwal:** `frontend/app/app/(wali)/jadwal` pakai `tentor.name` dinamis + WA reschedule `Halo {tentorName}`.
- **Verifikasi:** `tsc` BE 0 FE 0, `next build` 28 routes OK, grep `Kak Kiki`/`Cempaka` kosong, `Kalisabuk` ada di 2 file print.

**Flow:** Enrollment active (admin) → Tentor `/jadwal` Buat Jadwal manual date+jam+lokasi → muncul dashboard tentor upcoming + wali jadwal (jam+n tentor) → selesai → Tulis Laporan Harian → completed → setelah N sesi → Buat Rapor Perkembangan → Cetak PDF rapi window.print.

**Residual:** Restart BE wajib setelah edit shared/index.ts karena ts-node cache; endpoint `POST /api/me/sessions` butuh BE running `npm run dev --workspace=backend`.

---

### 2026-08-05 — Admin Tentor Lengkap: alamat, foto, email opsional (login WA)

**Fase:** ADM-2 / TENTOR-1..5 (branch `uiux`)
**Status sesi:** selesai — index & input tentor dilengkapi sesuai request `/app/admin/tentor`.

**Request user:**
- Bagian input dan index data tentor dilengkapi: input alamat, upload foto, email opsional (login bisa via nomor WA), serta keterangan aturan penulisan.

**Dikerjakan:**
- **Schema DB:** `backend/prisma/schema.prisma` `User` tambah `address String?` + `photoPath String? @map("photo_path")` (mirip `Murid`). `prisma db push` sukses (pooler 5432→Postgres), sempat lock `query_engine-windows.dll.node` → kill pid 13424 (port 5000) + `prisma generate` sukses v5.22.0.
- **Shared schema:** `packages/shared/src/index.ts`: `normalizePhone` dipindah ke atas (fix TS2448 used-before-declare), `phoneSchema` reuse untuk tentor, `createUserSchema`/`updateUserSchema`: `email` → `.optional().nullable()`, tambah `address max 500` + `photoPath max 2_000_000` (base64). `tsc --noEmit` shared ok.
- **Backend:** `backend/src/index.ts`:
  - Helper `generateWaliEmail` dipertahankan + alias `generatePlaceholderEmail`.
  - `POST /api/admin/users`: `phone` sudah normalized via zod `phoneSchema`, `emailInput` nullable → jika kosong fallback `phone@nurmancourse.local`, simpan `address`/`photoPath`, sync Supabase Auth `email_confirm:true`, `temporaryPassword` tetap tampil.
  - `PATCH /api/admin/users/:id`: load existing email/phone, bangun `updatePayload` include `address`/`photoPath` (nullify jika kosong), jika email kosong → regenerate placeholder dari phone baru / existing, sync ke `supabaseAdmin.auth.admin.updateUserById` dengan payload `email` + `user_metadata {role,name,phone}`. Error `P2002` → `Email / nomor hape sudah terdaftar`. `tsc --noEmit` backend ok.
  - Catatan: backend dev server di port 5000 dimatikan untuk `prisma generate`; **restart diperlukan** agar field baru `address`/`photoPath` terbaca.
- **Frontend `lms.ts`:** `User` tambah `address?` + `photoPath?` untuk tipe `AdminTutor`.
- **UI `/app/admin/tentor` (`frontend/app/app/admin/tentor/page.tsx`) rewrite lengkap:**
  - Form: `TutorForm` {name, phone, email, address, photoPath, password} + `emptyForm`.
  - Foto: section top `flex-col items-center` — lingkaran 80px preview, Camera icon, `fileInputRef`, `accept="image/*"`, `handleFileChange` resize canvas MAX 400×400 JPEG 0.8 (copy pola `admin/murid`), hint `Format JPEG/PNG, Max 1MB — otomatis resize 400x400`.
  - Field dengan keterangan: Nama — `Tulis nama lengkap sesuai KTP. Min 1 maks 150.`; WA — `Format Indonesia. Contoh valid: 0812... atau 62812... Sistem normalisasi otomatis ke 62... Dapat digunakan untuk login.`; Email opsional — `Opsional. Jika dikosongkan, sistem buat {nomor}@nurmancourse.local. Login dapat pakai nomor WA via /api/auth/resolve-phone. Harus format email valid maks 200.`; Alamat — `Opsional. Tulis alamat lengkap untuk memudahkan penugasan area. Maks 500.`; Password — `Min 6. Jika kosong generate otomatis dan tampilkan sekali.`
  - Box biru `Ketentuan penulisan`: nomor WA unik, email unik jika diisi, foto base64 resize, Supabase Auth email selalu ada placeholder dengan `email_confirm:true`.
  - Index list (`tutors.map`): tampil `photoPath` (img rounded-full) atau fallback `UserRound`, badge `Tentor` + status, email disembunyikan jika placeholder (`@nurmancourse.local`), tampil alamat truncate `📍 ...` + counter murid/sesi. Search placeholder tambah `atau alamat...`
  - Detail modal: avatar 56px, email placeholder note `Login via nomor WA (placeholder email)`, tampil alamat full di grid `col-span-2`.
  - `toForm` baca `address`/`photoPath` dari `(tutor as any)` agar aman backward compat.
  - Validasi payload sebelum kirim via `createUserSchema.safeParse` (include null handling).
- **Verifikasi:**
  - `frontend tsc --noEmit` → exit 0.
  - `backend tsc --noEmit` → exit 0.
  - `next build` earlier session 32 routes sukses (saat ini wrapper swallow log — tapi tsc pass, tipe aman).
  - `tasks/todo.md` TENTOR-1..5 dicentang 2026-08-05.

**Follow-up same day — Fix password login tentor:**
- **Problem lapor user:** Bikin akun tentor tanpa password → login pakai `62835454454` + `ncourse@123` invalid. Root cause: `POST /api/admin/users` generate random `Nurman-xxxx` bukan `ncourse@123`, `temporaryPassword` hanya tampil sekali (hilang jika refresh). Harapan admin: default diketahui.
- **Fix 2026-08-05 sore (request: ubah jadi 12345678):**
  - `backend/src/index.ts`: tambah const `DEFAULT_NEW_USER_PASSWORD = "12345678"`, `POST /api/admin/users` → `password || DEFAULT`. `POST /api/admin/murids` (wali) samakan `password: 'ncourse@123'` → const (wali & tentor sekarang sama).
  - Endpoint baru `POST /api/admin/users/:id/reset-password` admin-only: body `{password/newPassword}` optional → default 12345678, validasi min 6, `auth.admin.updateUserById(id, {password})`, return `temporaryPassword`. Untuk memperbaiki akun existing random password (mis. tentor 628...).
  - UI `admin/tentor`: tombol Reset PW per row → prompt default 12345678 → call endpoint → notice + banner copy-able (icon Copy/Check), banner update wording `Password: ... default 12345678 — login No WA + password di /login`.
  - Form: placeholder `Kosongkan → 12345678`, keterangan `Jika kosong default 12345678. Login /login pakai No WA + password ini (resolve-phone → placeholder email → signInWithPassword)`.
  - Box ketentuan tambah poin password default + login flow.
  - `login/page.tsx`: hint bawah input `Tentor/Wali bisa login pakai No WA, password default 12345678 jika belum diubah`.
  - `tsc` backend & frontend exit 0.

**Follow-up clean login page (request: clean, hint format 62..., password default di bawah input):**
- `frontend/app/login/page.tsx` rewrite clean: hapus panel "Akun Testing" (Key/Copy/Check UI top-right), hapus impor lucide `Key,X,Copy,Check` + state `showTestAccounts/copiedText/TEST_ACCOUNTS`.
- Hint bawah input Email/No WA: `Email bisa, atau No WA format 62... (contoh 6281234567890), bukan 08...` — memenuhi request `62..., jadi user tau klo mau login bukan pake 08... tentunya klo email juga bisa ya`.
- Hint bawah Password: `Password default 12345678` — sesuai request.
- Redirect fix: role `admin→/app/admin`, `tentor→/app/tentor`, `wali→/app/dashboard` (sebelumnya tentor salah ke wali dashboard).
- IsSignUp Phone field hint `Format: 62xxxxxxxxxxx (contoh 62812...), bukan 08...`
- `tsc` frontend+backend exit 0.

**Cara login tentor tanpa email (jawab pertanyaan user):** Buka `/login` → field `Email atau Nomor WhatsApp` isi `62835454454` (wajib 62..., bukan 08...) → password `12345678` → backend `POST /api/auth/resolve-phone` normalize phone + cari prisma user by phone → return placeholder email `628...@nurmancourse.local` → `supabase.auth.signInWithPassword`. Jadi tidak perlu email asli. Akun existing yang masih random password harus di-reset via Admin `/app/admin/tentor` tombol Reset PW → 12345678.

**Residual — WAJIB eksekusi manual (PowerShell ini blocking, tidak auto):**
1. Restart backend: `npm run dev --workspace=backend` di terminal terpisah (port 5000). Saat ini tidak listening (pid 15212 killed).
2. Reset PW akun 62835454454: login admin → `/app/admin/tentor` → cari 62835... → Reset PW → 12345678 → notice copy.
3. Alternatif curl admin token: `POST http://localhost:5000/api/admin/users/:id/reset-password {password:"12345678"}` dengan Bearer admin.
4. Test login: `/login` → 62835454454 + 12345678 → harus masuk `/app/tentor`.

---

### 2026-08-05 — Wali Portal Avatar & Prepayment Feature

**Fase:** UIUX (branch `uiux`)
**Status sesi:** selesai — memunculkan foto murid (avatar) di portal wali, menyempurnakan informasi profil, dan menambahkan fitur pembayaran mandiri/prabayar.

**Dikerjakan:**
- **Foto Profil Murid (Avatar) & Restrukturisasi Halaman Profil:**
  - Memindahkan bagian Informasi Profil Anak ke bagian paling atas Halaman Profil (`/app/profile`).
  - Mengganti lingkaran avatar utama di Profil dengan foto asli anak (`photoPath` atau `avatarUrl`) dan nama anak, alih-alih wali.
  - Memindahkan rincian Informasi Wali ke bagian bawah.
  - Menampilkan foto asli murid sebagai avatar pada Halaman Dashboard (`/app/dashboard`) menggantikan icon default `GraduationCap`.
- **Fitur Pembayaran Mandiri / Prabayar:**
  - Di halaman Tagihan (`/app/tagihan`), jika semua tagihan lunas/tidak ada tagihan aktif, sistem kini tetap menampilkan Card baru **"Pembayaran Mandiri / Prabayar"**.
  - Menyediakan input nominal kustom (`customAmount`), detail info rekening tujuan transfer, serta tombol Konfirmasi WhatsApp dinamis dengan pesan terformat otomatis sesuai jumlah bayar.

**Verifikasi:**
- build dan tsc check sukses di frontend.

---

### 2026-08-05 — Fix Supabase Auth Email Null (email_confirm: true)

**Fase:** Auth & Security (branch `uiux`)
**Status sesi:** selesai — memperbaiki email di `auth.users` Supabase yang bernilai `null` meskipun di-pass saat registrasi wali tanpa email.

**Masalah:**
- Setelah generate email placeholder, login wali dengan nomor handphone masih mengembalikan "invalid login credentials".
- Penyebab: Saat membuat user di Supabase Auth via Admin API (`auth.admin.createUser`), email di-set tetapi `email_confirm` tidak di-set `true`. Supabase memproses pendaftaran dengan phone provider sehingga kolom `email` di `auth.users` dibiarkan `null` (karena belum terverifikasi).
- Karena email di `auth.users` adalah `null`, password sign-in dengan email placeholder gagal.

**Solusi:**
- Menambahkan parameter `email_confirm: true` di payload `auth.admin.createUser` backend agar Supabase langsung memverifikasi email placeholder yang di-generate.
- Menjalankan manual SQL update di schema `auth.users` untuk memperbaiki user existing (Pak Bayu) yang email-nya terlanjur `null`.

**Dikerjakan:**
- `backend/src/index.ts`: Tambah parameter `email_confirm: true` pada `createUser` (line 1320).
- **SQL Migration (auth schema):**
  ```sql
  UPDATE auth.users 
  SET email = '628495400544@nurmancourse.local', 
      email_confirmed_at = NOW() 
  WHERE id = 'ef71d7b5-b68f-45fb-8c56-83e144aff9db';
  ```

**Verifikasi:**
- Database SQL: `SELECT email FROM auth.users WHERE phone = '628495400544'` mengembalikan `628495400544@nurmancourse.local`.
- Backend typecheck: `tsc --noEmit` sukses (exit code 0).

---

### 2026-08-05 — Refaktor UX Portal Wali Murid (Single Student, Header/Footer Polish, Profil Page)

**Fase:** UIUX (branch `uiux`)
**Status sesi:** selesai — mempermudah alur wali murid menjadi single-student model, merapikan header/footer mobile layout, serta menambahkan halaman profil mandiri.

**Dikerjakan:**
- **Single-Student Model:** Menghapus UI Child Selector (`Pilih Anak`) di halaman Dashboard, Program, Jadwal, Laporan, dan Tagihan. Data secara otomatis di-resolve untuk anak pertama (`murids[0]`).
- **Header & Sidebar Clean-up:**
  - Hapus tombol "Portal" dan "Keluar" dari Mobile TopBar, ganti dengan avatar profil bulat di pojok kanan atas yang mengarah ke `/app/profile`.
  - Hapus tombol logout/portal di bawah Desktop SideNavBar, ganti dengan link navigasi "Profil Saya" yang bersih.
- **Halaman Profil Wali (`/app/profile`):**
  - Membuat route baru di `frontend/app/app/(wali)/profile/page.tsx`.
  - Menampilkan ringkasan data read-only (nama wali, no. WA, email, nama anak, kelas/jenjang) dari `/api/users/me` dengan styling input disabled.
  - Menyediakan tombol "Keluar dari Akun" (logout) yang terintegrasi Supabase Auth di dalam halaman profil.
- **Polish Bottom Nav Mobile:**
  - Memendekkan tinggi bottom nav mobile dari `h-16` ke `h-[52px]` ditambah bottom safe area inset.
  - Memperbesar ukuran ikon navigasi non-center dari `22` ke `25` untuk kenyamanan visual mobile.

**Verifikasi:**
- `npx tsc --noEmit` (frontend): sukses bersih (exit code 0).
- `npm run build` (frontend): sukses kompilasi (exit code 0) — halaman `/app/profile` ter-generate statis.
- `npm run lint` (frontend): sukses bersih dari warning baru di layout.

---

### 2026-08-05 — Fix Koneksi Database P1017 (Supabase Transaction Pooler)

**Fase:** Auth & Security (branch `uiux`)
**Status sesi:** selesai — memperbaiki error P1017 "Server has closed the connection" saat login nomor WA.

**Masalah:**
- Endpoint `/api/auth/resolve-phone` gagal dengan `PrismaClientKnownRequestError` code `P1017` dan waktu respons ~21 detik.
- P1017 = koneksi ke database tertutup/terputus oleh server.
- Penyebab: `DATABASE_URL` memakai port **5432** (`pooler.supabase.com`) = **session pooler**, yang tidak cocok untuk Prisma dan bisa menutup koneksi idle.

**Solusi:**
- Ganti `DATABASE_URL` ke port **6543** (transaction pooler, cocok untuk Prisma) + `pgbouncer=true` + `connection_limit=5`.
- `DIRECT_URL` tetap ke session pooler port 5432 (untuk migrasi Prisma CLI; host direct `db.*.supabase.co` hanya IPv6 dan tidak reachable dari network lokal).

**Verifikasi:**
- Runtime `DATABASE_URL` (6543): query `user.findMany` sukses (rows: 1).
- Port 6543 pooler: reachable.
- DIRECT_URL (5432): reachable untuk migrasi.

**File:**
- `backend/.env`

---

### 2026-08-05 — Fix Login Nomor WhatsApp Tanpa Email (Auto-generate Email)

**Fase:** Auth & Security (branch `uiux`)
**Status sesi:** selesai — memperbaiki bug login nomor WhatsApp yang tidak terdaftar saat wali tidak memiliki email.

**Masalah:**
- Endpoint `/api/auth/resolve-phone` mengembalikan 404 "Nomor WhatsApp tidak terdaftar" untuk user yang dibuat tanpa email.
- Penyebab: saat membuat murid via admin, field `waliEmail` opsional. Jika kosong, user dibuat dengan `email: null` di Prisma dan Supabase Auth.
- Login flow: frontend memanggil resolve-phone → dapat email → login pakai email. Jika email null, login gagal.

**Solusi:**
- Menambahkan helper `generateWaliEmail(phone)` yang menghasilkan email placeholder `{phone}@nurmancourse.local`.
- Modifikasi `POST /api/admin/murids`: jika `waliEmail` tidak diisi, otomatis generate email dari nomor WA.
- Modifikasi `PATCH /api/admin/murids/:id`: saat update phone tanpa email, gunakan email existing atau generate baru jika kosong.

**Dikerjakan:**
- `backend/src/index.ts`:
  - Tambah helper `generateWaliEmail(phone)` (line 43-46)
  - Fix `POST /api/admin/murids`: `resolvedWaliEmail = waliEmail || generateWaliEmail(normalizedPhone)`
  - Fix `PATCH /api/admin/murids/:id`: ambil email existing, generate jika kosong

**Verifikasi:**
- `npx tsc --noEmit` (backend): exit code 0 — bersih.
- `npx tsc --noEmit` (frontend): exit code 0 — bersih.
- `npm run lint` (frontend): 0 error, 3 warning (pre-existing `<img>` di admin/murid).
- **Migrasi database:** UPDATE users SET email = phone || '@nurmancourse.local' WHERE email IS NULL AND role = 'wali' — sukses.
  - Pak Bayu (628495400544) sekarang punya email: `628495400544@nurmancourse.local`
  - Supardi Santoso (089876543210) tetap pakai email: `supardi@gmail.com`

**Catatan Migrasi:**
- User existing dengan `email: null` (seperti nomor 628495400544) perlu di-update manual atau seed ulang agar bisa login.
- SQL migration: `UPDATE users SET email = phone || '@nurmancourse.local' WHERE email IS NULL AND role = 'wali';`

---

### 2026-08-05 — Implementasi Login Menggunakan Nomor WhatsApp (Phone)

**Fase:** Auth & Security (branch `uiux`)
**Status sesi:** selesai — memecahkan limitasi Supabase Phone Provider (disabled) dengan melakukan resolve/lookup nomor WhatsApp ke email yang terdaftar di database aplikasi, lalu login otomatis menggunakan email tersebut.

**Dikerjakan:**
- `backend/src/index.ts`: Menambahkan endpoint publik `POST /api/auth/resolve-phone` untuk menormalisasi nomor WhatsApp input dan mencari user yang terasosiasi di database Prisma untuk mengembalikan email-nya secara aman.
- `frontend/app/login/page.tsx`: Jika input email berupa nomor handphone (tidak mengandung `@`), halaman login akan memanggil endpoint `/api/auth/resolve-phone` terlebih dahulu, mendapatkan email aslinya, lalu login ke Supabase menggunakan email tersebut dan password yang diinputkan.

**Verifikasi:**
- `npm run lint` (frontend): sukses — 0 error.
- `npm run build` (frontend): sukses — build berhasil dan file statis ter-generate sempurna.

---

### 2026-08-05 — Polish Navigasi Bottom Bar Wali Murid Mobile (Icons Only & Raised Dashboard)

**Fase:** Funnel polish / UIUX (branch `uiux`)
**Status sesi:** selesai — memodifikasi navigasi bottom bar untuk tampilan mobile agar lebih bersih dengan ikon saja (no label), serta menonjolkan tombol Dashboard di tengah dengan efek timbul 3D dan warna senada yang lebih terang.

**Dikerjakan:**
- `frontend/app/app/(wali)/layout.tsx`:
  - Menghapus label di bottom bar mobile (icons-only) untuk tampilan yang bersih dan lapang.
  - Memposisikan "Dashboard" di bagian tengah (index ke-3 dari 5 item: Program, Jadwal, Dashboard, Laporan, Tagihan).
  - Mendesain tombol Dashboard tengah agar agak timbul (`-translate-y-4` dengan rounded-full), border 3D senada yang agak terang (`bg-[#e8f0fe]` / `bg-[#4a70a9]`), serta efek bayangan/glossy reflection layer (`drop-shadow`).

**Verifikasi:**
- `npm run lint` (frontend): sukses — 0 error.
- `npm run build` (frontend): sukses — build berhasil dan semua rute statis/statis dinamis terkompilasi.

---

### 2026-08-05 — Hapus Keterangan Banner Demo dan Perketat Proteksi Role-Based Middleware

**Fase:** LMS Security & Routing Polish (branch `uiux`)
**Status sesi:** selesai — keterangan banner demo di portal selector dihilangkan, proteksi rute di Next.js middleware diperketat menggunakan role metadata JWT.

**Dikerjakan:**
- `frontend/app/app/page.tsx`: Hapus elemen div "Demo Banner" beserta import `AlertTriangle` dan sesuaikan padding layout wrapper utama.
- `frontend/middleware.ts`: Implementasi logic pemisahan role/proteksi rute yang benar. User role `wali` dibatasi hanya untuk halaman wali, user role `tentor` dibatasi hanya untuk `/app/tentor/*`. User role `admin` dibebaskan/bypass untuk mengakses semua portal demi kebutuhan testing.

**Verifikasi:**
- `npm run build` (frontend): sukses — seluruh route terkompilasi normal.
- `npm run lint` (frontend): sukses — 0 error.

---

### 2026-08-05 — Hapus Demo Mode Total (Frontend Live-API Only)

**Fase:** LMS frontend cleanup (branch `uiux`)
**Status sesi:** selesai — semua portal (wali/tentor/admin) live-API only, tidak ada dummy/demo tersisa

**Dikerjakan:**
- `lib/api.ts`: hapus `isDemoMode()`; `middleware.ts`: hapus bypass demo, proteksi session + role selalu aktif.
- Layout `(wali)`, `tentor`, `admin`: banner amber demo + conditional padding dihapus.
- Wali portal (7 file): hapus cabang demo di `loadData`, 6 resolver dummy, ternaries date/status demo.
- Tentor portal (4 file): hapus cabang demo di dashboard/jadwal, blok submit demo (~120 baris) di `LaporanHarianClient`, fallback `getMuridById`/`getProgramById` diganti relasi `session.murid`/`session.program`; "Buat Rapor" di `LaporanPerkembanganClient` kini derive dari live `murids`/`sessions`/`programs`.
- Admin portal (9 file): hapus cabang demo, guard `isDemoMode`, `demoAccounts`/`demoEnrollments`/`demoInvoices`, footer note demo.
- `data/lms.ts`: purge semua `dummy*` data & helper (`getMuridById`, `getProgramById`, `getRoadmapSteps`, `getSessionsFor*`, `getDailyReportsFor*`, `getProgressReportsFor*`, `getLatest*`, `getTentorById`, `getPendingDailyReportsCount`); **interface tetap** (termasuk `DailyReportDetailed`, `ProgressReportDetailed`, `DailyReportForTentorDetailed`, `ProgressReportForTentorDetailed`).
- `.env.example` & `.env.local`: hapus `DEMO_MODE` / `NEXT_PUBLIC_DEMO_MODE`.

**Fix build (ditemukan saat typecheck):**
- `LaporanHarianClient.tsx`: fallback murid `{ name, schoolLevel }` ditambah `birthDate: undefined` agar union type konsisten.
- `LaporanPerkembanganClient.tsx`: tambah state `sessions` (di-set dari `/api/me/sessions`) karena tombol "Buat Rapor" membutuhkannya.

**Verifikasi:**
- `npm run lint` (frontend): 0 error (3 warning pre-existing di admin/murid, tidak terkait).
- `npm run build` (frontend): sukses — semua route ter-generate, TS bersih.

**Keputusan:**
- Demo mode tidak lagi dipakai; mode live (Supabase + API Express) adalah satu-satunya jalur.
- Login page test-account panel dibiarkan (bukan bagian data demo).

---

### 2026-08-05 — Polish UI/UX Portal Wali Murid (mobile-first)

**Fase:** Funnel polish / UIUX (branch `uiux`)
**Status sesi:** selesai — perapian tampilan portal wali, fokus mobile, tanpa ubah logic & warna primary `#4a70a9`

**Dikerjakan:**
- `(wali)/layout.tsx`: bottom nav mobile dikurangi dari 7 → 5 item utama; tombol **Portal & Keluar** dipindah ke top bar sticky mobile (brand + aksi di kanan atas, `min-h-44px` untuk touch target).
- `(wali)/jadwal/page.tsx`, `laporan`, `program`, `tagihan`: header halaman diseragamkan jadi GlassCard (rounded-2xl + backdrop-blur + p-6) mengikuti pola dashboard.
- `(wali)/laporan/page.tsx`: tab Harian/Perkembangan jadi **2 kolom sejajar di semua ukuran**, deskripsi di-hide di mobile (`hidden sm:block`) agar tombol tidak tinggi.
- `(wali)/program/[slug]/page.tsx`: **fix bug sticky bar tertutup bottom nav mobile** (`bottom-0` → `bottom-24 md:bottom-0`) + tambah `pb-44` di mobile agar konten tidak tertutup.
- `(wali)/tagihan/page.tsx`: riwayat pembayaran **kartu di mobile** (`md:hidden`) + **tabel di desktop** (`hidden md:block`); helper `renderStatusBadge` & `renderInvoiceDate` dipakai bersama (logic tetap sama).

**Verifikasi:**
- `npm run lint` (frontend): 0 error (3 warning pre-existing di admin/murid, tidak terkait).
- `npm run build` (frontend): sukses, semua route wali ter-generate.

---

### 2026-08-05 — Setup Branch `uiux` untuk Revisi Tampilan

**Fase:** Meta / git workflow
**Status sesi:** selesai — branch `uiux` dibuat dari `dev` dan di-push ke origin

**Dikerjakan:**
- Update `.gitignore`: tambahkan `.opencode/`, `backend/src/generated/`, `tasks/screenshots/` agar tidak ikut commit.
- Commit besar ke `dev` (`35f707a`): admin tentor management, murid/rekening polish, desain docs sync (37 file).
- Buat branch `uiux` dari `dev`, push ke `origin/uiux` sebagai basis kerja revisi tampilan.
- Update `tasks/todo.md` header branch kerja aktif → `uiux`.

**Keputusan:**
- Revisi tampilan dikerjakan di branch `uiux`, tidak langsung di `dev`.
- `.opencode/skills/` (workflow pack lokal) tidak di-commit ke repo.

---

### 2026-08-01 — Sinkronisasi Data Murid (Alamat, Tanggal Lahir & Daftar)

**Fase:** ADM-2.3 (API Murid)
**Status sesi:** selesai — sinkronisasi penuh field Murid (alamat, tanggal lahir, tanggal daftar, foto base64) live

**Dikerjakan:**
- **Prisma Client:** Menjalankan `npx prisma generate` di backend untuk menyinkronkan client runtime dengan kolom `address` di database PostgreSQL.
- **Phone Validation:** Memperbaiki regex & validasi `phoneSchema` di Zod Shared Schema agar secara otomatis menormalisasi format nomor handphone (`08...` / `+628...` -> `628...`) dan toleran terhadap input panjang 10 digit (menggunakan regex `^628\d{7,13}$`).
- **Error Handling:** Meningkatkan parser error `apiFetch` di frontend agar mendeteksi detail field error validasi dari backend dan menggabungkannya ke dalam alert message.
- **Usia Display:** Membatasi tampilan usia murid agar tidak menampilkan angka negatif (`Math.max(0, age)`).
- **Shared Schemas:** menambahkan `birthDate` ke `createMuridSchema` dan `updateMuridSchema`, serta memperbesar batas string `photoPath` menjadi 2MB agar aman menyimpan base64.
- **Backend API:** memproses `birthDate` ke database pada endpoint POST & PATCH murid, menyinkronkan response GET murid menjadi `{ data }`, dan mengaktifkan filter search name/wali.
- **Frontend App:** menyertakan `birthDate` pada payload submit form murid.

**Verifikasi:**
- Backend & frontend `tsc --noEmit` sukses bersih.
- Frontend lint sukses bersih.

---

### 2026-08-01 — Standarisasi Tombol Tambah Admin

**Fase:** ADM-7.2 (UX, aksesibilitas, dan security hardening)
**Status sesi:** selesai — label tombol tambah diseragamkan dan ikon plus disejajarkan

**Dikerjakan:**
- Mengganti label create admin seperti `Buat Murid`, `Buat Tutor`, `Buat Program`, `Buat Enrollment`, dan `Terbitkan Tagihan` menjadi `Tambah`.
- Menambahkan alignment `inline-flex items-center gap-2` pada tombol submit agar ikon `+` sejajar dengan teks.
- Mengubah copy empty state program menjadi `Tambah program pertama`.

**Verifikasi:**
- Frontend `tsc --noEmit` sukses.
- Frontend lint sukses tanpa error; tersisa 3 warning `<img>` existing di halaman Murid.

---

### 2026-08-01 — Hapus Route Legacy Admin Pengguna

**Fase:** ADM-2.2 (User, Wali, Tentor, dan Murid)
**Status sesi:** selesai — route `/app/admin/pengguna` dihapus total

**Dikerjakan:**
- Menghapus halaman legacy `/app/admin/pengguna` agar tidak tersedia lagi.
- Menu admin tetap menggunakan `/app/admin/tentor` sebagai satu-satunya halaman pengelolaan Tutor.
- Validasi ulang build dan typecheck frontend setelah route dihapus.

**Verifikasi:**
- Frontend `next build` sukses.
- Frontend `tsc --noEmit` sukses.

---

### 2026-08-01 — Admin Tutor: Menu dan CRUD UI Terfokus

**Fase:** ADM-2.2 (User, Wali, Tentor, dan Murid)
**Status sesi:** selesai — menu Pengguna diganti Tutor, data wali/admin tidak tampil, route legacy tetap aman

**Dikerjakan:**
- Menambahkan halaman `/app/admin/tentor` dengan tampilan card dan form yang mengikuti pola halaman Murid.
- Menampilkan hanya role internal `tentor`, dengan label UI `Tutor`.
- Menyediakan search, filter status, detail, edit, pembuatan akun, dan nonaktifkan tutor.
- Mengganti menu admin **Pengguna** menjadi **Tutor** di desktop dan mobile navigation.
- Mengarahkan `/app/admin/pengguna` ke `/app/admin/tentor` untuk kompatibilitas URL lama.

**Verifikasi:**
- Frontend `tsc --noEmit` sukses.
- Frontend lint sukses tanpa error; tersisa 3 warning `<img>` existing di halaman Murid.

---

### 2026-08-01 — Refaktor & Integrasi Form Murid-Wali + Login Multi-Metode

**Fase:** ADM-2 (Katalog, Murid & Tentor)
**Status sesi:** selesai — Form Murid-Wali menyatu, upload foto base64 dengan canvas auto-resize, login via email/phone, rule 1-nomor-hape-1-murid tervalidasi

**Dikerjakan:**
- **Penyatuan Form Murid & Wali:** menghilangkan dropdown pilih wali di form murid baru, menggantinya dengan input data wali langsung (Nama, No WhatsApp, Email opsional) dalam satu flow.
- **Upload Foto & Auto-Resize:** mengganti field `Avatar URL` dengan input file foto murid, di-resize client-side via canvas menjadi JPEG base64 (max 400x400px) sebelum dikirim ke backend via `photoPath`.
- **Integrasi Backend POST & PATCH:** otomatis membuat user wali baru di database & Supabase Auth dengan password default `ncourse@123` saat create murid baru, serta menyinkronkan pembaruan data wali/murid ke Supabase Auth.
- **Aturan 1 Hape 1 Murid:** menambahkan validasi unik di backend untuk mencegah pendaftaran/pembaruan no hape wali yang sudah digunakan oleh murid lain.
- **Login Multi-Metode:** memperbarui form login frontend agar mendeteksi input email atau nomor WhatsApp secara dinamis dan melakukan sign-in Supabase Auth yang sesuai.
- **Verifikasi:**
  - Backend `tsc --noEmit` & frontend `tsc --noEmit` sukses bersih 100%;
  - Frontend ESLint sukses bersih 100%.

**Langkah berikutnya:**
- Melanjutkan task aktif `ADM-4.2` API MaterialItem.

---

### 2026-08-01 — ADM-4.1 API RoadmapStep (CRUD + Reorder + Cascade Delete)

**Fase:** ADM-4.1 (Roadmap & Materi Teks)
**Status sesi:** selesai — API CRUD & Reorder RoadmapStep live, verifikasi database & model relasi sukses

**Dikerjakan:**
- **Shared schemas** (`packages/shared/src/index.ts`): `createRoadmapStepSchema`, `updateRoadmapStepSchema` dengan validasi parameter `order` opsional.
- **API admin roadmap steps** (`backend/src/index.ts`):
  - `GET /api/admin/programs/:programId/roadmap` — list roadmap step terurut berdasarkan `order` ascending;
  - `POST /api/admin/programs/:programId/roadmap` — validasi programId, auto order calculation jika `order` undefined (max order + 1);
  - `PATCH /api/admin/roadmap-steps/:id` — update partial data roadmap step;
  - `DELETE /api/admin/roadmap-steps/:id` — delete roadmap step, relasi cascade terbukti menghapus `MaterialItem` & `Progress` terkait;
  - `POST /api/admin/programs/:programId/roadmap/reorder` — reorder roadmap steps secara aman di dalam database transaction.
- **Prisma Client Output Tuning:** mengubah target generator client Prisma ke subfolder lokal `backend/src/generated/client` untuk menghindari EPERM file locking pada runtime OpenCode CLI.
- **Verifikasi:**
  - Backend `tsc --noEmit` & frontend `tsc --noEmit` sukses bersih;
  - Frontend ESLint sukses bersih;
  - Integrasi manual via programmatic test script `backend/src/test-roadmap.ts` berhasil memverifikasi pembuatan, pengurutan otomatis, reorder transaksional, dan cascade delete.

**Langkah berikutnya:**
- `ADM-4.2` — API MaterialItem: `GET`, `POST`, `PATCH`, `DELETE` untuk roadmap-steps material items.
- `ADM-4.3` — UI Roadmap dan Materi: program selector, timeline, editor teks, material reorder/preview.

---

### 2026-08-01 — Rename Pengajar Menjadi Tentor

**Fase:** Terminologi dan kontrak role
**Status sesi:** selesai — migrasi data/auth, runtime, dokumentasi, dan verifikasi selesai

**Dikerjakan:**
- Mengganti role shared dari `pengajar` menjadi `tentor`.
- Rename kolom database `sessions.pengajar_id` menjadi `sessions.tentor_id` menggunakan `ALTER TABLE` agar data sesi tetap tersimpan.
- Migrasi seluruh `users.role` existing dari `pengajar` ke `tentor`.
- Memperbarui `user_metadata.role` akun Supabase Kak Kiki menjadi `tentor`.
- Rename field Prisma/response `pengajarId`/`pengajar` menjadi `tentorId`/`tentor`.
- Rename endpoint admin `/api/admin/pengajars` menjadi `/api/admin/tentors` dengan response key `tentors`.
- Memperbarui seed, data dummy, helper frontend, halaman admin/tentor/wali, serta seluruh dokumentasi aktif.
- Rename file desain `13-dashboard-pengajar.md` → `13-dashboard-tentor.md` dan `16-kelola-pengajar-wali.md` → `16-kelola-tentor-wali.md`.

**Verifikasi:**
- Backend dan frontend `tsc --noEmit` sukses.
- `next build` sukses.
- ESLint sukses tanpa error; tersisa 1 warning existing `no-img-element` di `frontend/app/app/admin/murid/page.tsx`.
- Login akun tentor sukses; `/api/me/sessions` mengembalikan `tentorId` dan 2 sesi existing.
- `/api/admin/tentors` mengembalikan Kak Kiki dengan role `tentor`.
- Tidak ada referensi aktif `pengajar` di runtime, docs, tasks, atau desain non-arsip.

---

### 2026-08-01 — ADM-3 Enrollment + ADM-6 Tagihan + ADM-6.5 Rekening (API & UI live)

**Fase:** ADM-3, ADM-6, ADM-6.5 (Plan Portal Admin)
**Status sesi:** selesai — API + UI live, test manual live sukses, build/lint bersih

**Dikerjakan:**
- **Shared schemas** (`packages/shared/src/index.ts`): `createEnrollmentSchema`, `updateEnrollmentSchema`, `enrollmentStatusSchema`, `createInvoiceSchema`, `updateInvoiceSchema`, `invoiceStatusSchema`, `createPaymentAccountSchema`, `updatePaymentAccountSchema`.
- **Schema DB:** model `PaymentAccount` (`@@map("payment_accounts")`) + `prisma db push` + `generate`.
- **API admin enrollments** (`backend/src/index.ts`):
  - `GET /api/admin/enrollments` — pagination, filter status/murid/program, search nama murid, include murid+program+`_count` invoice;
  - `POST /api/admin/enrollments` — validasi murid & program aktif, cegah duplicate `status:'active'` (`409`), create `active`;
  - `GET /api/admin/enrollments/:id` — detail + invoices (desc);
  - `PATCH /api/admin/enrollments/:id` — update murid/program/status/startedAt, duplicate-check saat jadi active.
- **API admin invoices:**
  - `GET /api/admin/invoices` — pagination, filter status/murid/program, search nama murid, include enrollment→murid+program;
  - `POST /api/admin/invoices` — validasi enrollment ada + `active`, amount > 0;
  - `GET /api/admin/invoices/:id` — detail;
  - `PATCH /api/admin/invoices/:id` — update amount/dueAt/note;
  - `PATCH /api/admin/invoices/:id/status` — validasi enum, set `paidAt: now` saat paid / `null` jika bukan paid (atomik).
- **API payment-accounts:** `GET/POST/PATCH/DELETE /api/admin/payment-accounts` (CRUD, auto-clear `isDefault` lain, tolak hapus rekening default) + `GET /api/payment-accounts` (auth wali, filter `isActive`).
- **Fix error TS:** `startedAt: null` invalid (field required) → omit bila kosong; campuran zod v4 (backend) & v3 (shared) pada `z.object` → parse langsung via `invoiceStatusSchema.safeParse`.
- **UI admin:** menu **Enrollment**, **Tagihan**, **Rekening** di layout; halaman `/app/admin/enrollment`, `/app/admin/tagihan` (form terbitkan invoice dengan auto-suggest nominal `sessionsPerBlock × basePrice` yang bisa diedit, aksi ubah status unpaid/waiting/paid), `/app/admin/rekening` (CRUD + set default + hapus dengan proteksi).
- **UI wali:** `/app/(wali)/tagihan` kini membaca rekening dari `GET /api/payment-accounts` (default → aktif pertama), fallback pesan bila belum ada; hapus hardcode Mandiri.
- **Seed:** tambah `PaymentAccount` default Mandiri + BSI.

**Verifikasi (live):**
- Backend `tsc --noEmit` & frontend `tsc --noEmit` bersih; frontend `next build` sukses (18s), `next lint` tanpa error.
- POST payment-account (Mandiri default) + set default flip `isDefault` akun lain + delete rekening non-default; GET publik tanpa auth → `401`.
- POST enrollment valid → sukses; duplicate enrollment aktif → `409 CONFLICT`.
- POST invoice valid → sukses; amount 0 → `400`; enrollment tidak ditemukan → `400`; status invalid → `400`; status `paid` → `paidAt` terisi, `unpaid`/`waiting` → `null`.
- Filter invoice `status=paid` & enrollment `search=budi` berfungsi.
- Wali (supardi@gmail.com) membaca `GET /api/payment-accounts` (2 akun) dan `GET /api/me/invoices` (2 invoice, 1 unpaid + 1 paid).

**Keputusan:**
- ADM-Q1 (duplicate enrollment aktif) → **ditolak dengan 409** (sudah diimplementasikan).
- Nominal invoice di UI admin auto-suggest `sessionsPerBlock × basePrice` tapi tetap bisa diedit admin.
- Rekening bank jadi data master (`PaymentAccount`), halaman wali tidak lagi hardcode.

**File:**
- `packages/shared/src/index.ts`
- `backend/prisma/schema.prisma`
- `backend/prisma/seed.ts`
- `backend/src/index.ts`
- `frontend/app/app/admin/layout.tsx`
- `frontend/app/app/admin/enrollment/page.tsx`
- `frontend/app/app/admin/tagihan/page.tsx`
- `frontend/app/app/admin/rekening/page.tsx`
- `frontend/app/app/(wali)/tagihan/page.tsx`
- `tasks/todo.md`, `docs/PROGRESS.md`

**Langkah berikutnya:**
- Menandai ADM-3.2/ADM-3.C3, ADM-6.2/ADM-6.C6, ADM-6.5 selesai di `tasks/todo.md`.
- Lanjut ADM-4 (Roadmap/Materi) atau tanya commit/push slice ini.

---

### 2026-08-01 — Checkpoint ADM-2 Selesai, Push Slice Admin

**Fase:** ADM-2.C2 (Plan Portal Admin)
**Status sesi:** selesai — seluruh slice ADM-1 + ADM-2 di-commit dan di-push ke branch `dev`

**Dikerjakan:**
- Verifikasi checkpoint ADM-2.C2 (live):
  - duplicate email → `409 CONFLICT` (diperbaiki dari sebelumnya `400 AUTH_CREATE_FAILED`);
  - waliId invalid & waliId bukan role wali → `400 VALIDATION_ERROR`;
  - create user valid → sukses (auth + Prisma), data test dibersihkan;
  - role guard non-admin → `403`, tanpa token → `401`.
- Update `tasks/todo.md`: tandai `ADM-2.C2` selesai; fokus berikutnya `ADM-3.1 API Enrollment`.
- Update `tasks/plan.md`: centang seluruh subtask ADM-2 (2.1–2.4) dan checkpoint 2.
- Commit seluruh perubahan slice admin (ADM-1 Program + ADM-2 User/Murid + schema `active` + docs) ke `dev` dan push ke origin.

**Keputusan:**
- Aturan duplicate enrollment aktif dan konflik jadwal tetap menjadi **open question** (ADM-Q1, ADM-Q2) yang harus diputuskan saat mengerjakan ADM-3.
- ADM-Q3 (flow password) sementara terpakai: temporary password opsional yang dikembalikan sekali.
- ADM-Q4 sementara: role existing bisa diubah antar tentor/wali, tapi tidak ke/dari admin.

**Langkah berikutnya (task siap):**
- `ADM-3.1` — API Enrollment: `GET/POST/PATCH /api/admin/enrollments`, detail dengan invoice/progress, validasi murid + program aktif, cegah duplicate aktif, transaction-safe.
- `ADM-3.2` — UI Enrollment: menu, list/filter status, form create (pilih murid + program live), detail, cancel/complete dengan konfirmasi.
- `ADM-3.C3` — Checkpoint: uji transaction, program nonaktif, duplicate aktif, state kosong/error/loading.

**File:**
- `backend/src/index.ts`
- `packages/shared/src/index.ts`
- `backend/prisma/schema.prisma`
- `frontend/app/app/admin/layout.tsx`
- `frontend/app/app/admin/pengguna/page.tsx`
- `frontend/app/app/admin/murid/page.tsx`
- `tasks/todo.md`
- `tasks/plan.md`
- `docs/PROGRESS.md`

---

### 2026-08-01 — ADM-2: API & UI User/Tentor/Wali dan Murid

**Fase:** ADM-2.1 sampai ADM-2.4 (Plan Portal Admin)
**Status sesi:** selesai — API + UI live, role guard diverifikasi; menunggu checkpoint final ADM-2.C2

**Dikerjakan:**
- **Fix role guard:** endpoint `GET /api/admin/murids` dan `GET /api/admin/tentors` kini memakai `requireAuth + requireAdmin` (sebelumnya hanya `requireAuth` + cek manual yang mudah terlewat).
- **Schema & contract di `packages/shared/src/index.ts`:**
  - `userRoleSchema`, `createUserSchema`, `updateUserSchema` (role dibatasi `tentor | wali` → mencegah privilege escalation membuat admin via API);
  - `createMuridSchema`, `updateMuridSchema`.
- **Schema DB:** tambah field `active` (soft-status) di model `User` dan `Murid`, diterapkan via `prisma db push` (tanpa menghapus histori).
- **API admin users:**
  - `GET /api/admin/users` — pagination, search (nama/email/phone), filter role & status, `_count` murid & sesi;
  - `POST /api/admin/users` — buat Supabase Auth user (`email_confirm`) + row Prisma; kompensasi hapus auth user bila Prisma gagal; password opsional (temporary password, otomatis jika kosong) dan hanya dikembalikan sekali di response;
  - `PATCH /api/admin/users/:id` — update profil/role, sinkronisasi `user_metadata` ke Supabase; mencegah admin ubah role sendiri;
  - `DELETE /api/admin/users/:id` — soft deactivate (`active=false`), mencegah deactivate diri sendiri dan akun admin lain.
- **API admin murids:**
  - `GET /api/admin/murids/:id` — detail lengkap: wali, enrollments, sessions, dailyReports, progressReports;
  - `POST /api/admin/murids` — validasi waliId harus role `wali`;
  - `PATCH /api/admin/murids/:id` — update profil & wali (validasi wali tetap);
  - `DELETE /api/admin/murids/:id` — hard delete bila belum punya enrollment/session, soft deactivate bila sudah punya riwayat.
- **UI admin:**
  - Menu **Pengguna** (`/app/admin/pengguna`) & **Murid** (`/app/admin/murid`) di layout admin;
  - Halaman Pengguna: list live + search + filter role/status + badge role/status + form create/edit + deactivate + tampilkan temporary password sekali;
  - Halaman Murid: list live + search + filter wali + form create/edit + pemilihan wali live + modal detail + deactivate.

**Belum selesai:**
- ADM-2.C2 checkpoint final: uji duplicate email (live), invalid relation, regression build/lint di satu sesi verifikasi (sebagian sudah diverifikasi manual).
- ADM-1.3 seed & verifikasi Program (masih pending dari sesi sebelumnya).

**Keputusan:**
- Role yang bisa dibuat/diubah admin dibatasi `tentor | wali` (admin dibuat via seed) — ini menjawab ADM-Q4 sementara: role existing **boleh diubah** antar tentor/wali, tapi **tidak** ke/dari admin.
- Deactivate user tidak menghapus histori (soft flag `active`); akses login dimatikan karena user Prisma tidak lagi ditandai aktif (token Supabase tetap ada — dicatat sebagai limitasi sementara).
- Password akun baru: temporary password (opsional diisi admin, otomatis jika kosong), dikembalikan sekali di response create.

**Verifikasi (live):**
- Backend `npm run build` sukses.
- `prisma db push` sukses (DB tersinkron + generate client).
- Endpoint `GET /api/admin/users` → 3 user (wali, tentor, admin) dengan `active=true`.
- `GET /api/admin/murids` → 1 murid (Budi, wali Supardi).
- Role guard: wali login → `403` di `/api/admin/users` & `/api/admin/murids`; tanpa token → `401`.
- Create tentor via API → user Prisma + auth Supabase terbuat (password temporary); create murid validasi wali → sukses.
- Deactivate user → `active=false`; deactivate murid tanpa relasi → 204 (hard delete); detail murid → relasi lengkap.
- Frontend `npm run lint` → 0 error (1 warning `no-img-element` legacy); `npm run build` sukses, route `/app/admin/murid` & `/app/admin/pengguna` ter-generate.

**File:**
- `packages/shared/src/index.ts`
- `backend/prisma/schema.prisma`
- `backend/src/index.ts`
- `backend/src/middleware/auth.ts`
- `frontend/lib/api.ts`
- `frontend/app/app/admin/layout.tsx`
- `frontend/app/app/admin/pengguna/page.tsx`
- `frontend/app/app/admin/murid/page.tsx`
- `frontend/data/lms.ts`
- `tasks/todo.md`
- `docs/PROGRESS.md`

---

### 2026-08-01 — Plan Lengkap Portal Admin

**Fase:** Perencanaan implementasi portal admin (ADM-0 sampai ADM-7)
**Status sesi:** selesai — plan siap direview sebelum coding

**Dikerjakan:**
- Menyusun `tasks/plan.md` baru untuk portal admin lengkap dengan:
  - tujuan dan kondisi awal;
  - keputusan arsitektur API-first, role guard, vertical slice, status/deactivate, transaction, pagination, dan security;
  - task dan subtask untuk Program, User/Wali/Tentor, Murid, Enrollment, Roadmap/Materi, Session, Invoice, serta polish;
  - acceptance criteria, checkpoint verifikasi, dependency graph, risiko/mitigasi, dan open questions.
- Menambahkan checklist `ADM-0` sampai `ADM-7` ke `tasks/todo.md` dengan satu fokus aktif `ADM-0.1`.
- Menjaga scope sesuai roadmap LMS dan tidak mengubah funnel `/course/*`.

**Keputusan / Open Questions:**
- Implementasi akan dimulai dari kontrak API dan helper admin, lalu dilanjutkan vertical slice per domain.
- Sebelum domain terkait diimplementasikan, perlu keputusan aturan duplicate enrollment, konflik jadwal, flow password akun baru, dan perubahan role existing.

**File:**
- `tasks/plan.md`
- `tasks/todo.md`
- `docs/PROGRESS.md`

---

### 2026-08-01 — Fondasi Admin dan Vertical Slice Program

**Fase:** ADM-0 sampai ADM-1.2
**Status sesi:** sebagian selesai — verifikasi live Program dilanjutkan di ADM-1.3

**Dikerjakan:**
- Menambahkan contract dan validasi admin di `packages/shared/src/index.ts`:
  - `ProgramCategory`, `EnrollmentStatus`, `AdminListParams`, `ApiErrorPayload`;
  - `createProgramSchema` dan `updateProgramSchema`.
- Memperluas `frontend/lib/api.ts` dengan parsing error terstruktur dan helper `buildQuery`.
- Menambahkan middleware `requireAdmin` untuk memastikan endpoint admin tidak hanya mengandalkan proteksi UI.
- Menambahkan API CRUD Program admin:
  - `GET /api/admin/programs` dengan search, category, active, pagination;
  - `GET /api/admin/programs/:id`;
  - `POST /api/admin/programs`;
  - `PATCH /api/admin/programs/:id`;
  - `DELETE /api/admin/programs/:id` dengan deactivation bila sudah memiliki enrollment/session.
- Menambahkan menu **Program** di layout admin dan halaman `/app/admin/program` dengan list live, search/filter, form create/edit, status, dan deactivate.

**Belum selesai:**
- Seed dan verifikasi live Program: duplicate slug, invalid input, role guard non-admin, serta happy path create/edit/deactivate.

**File:**
- `packages/shared/src/index.ts`
- `backend/src/middleware/auth.ts`
- `backend/src/index.ts`
- `frontend/lib/api.ts`
- `frontend/app/app/admin/layout.tsx`
- `frontend/app/app/admin/program/page.tsx`
- `tasks/todo.md`
- `docs/PROGRESS.md`

**Verifikasi:**
- Backend `npm run build` sukses.
- Frontend `npm run lint` sukses tanpa warning/error.
- Frontend `npm run build` sukses.
- `git diff --check` bersih.

---

### 2026-08-01 — Integrasi Frontend ↔ Backend API (Portal Admin)

**Fase:** 3.8 (Integrasi Admin)  
**Status sesi:** selesai

**Dikerjakan:**
- **Pembuatan Endpoint Backend (Portal Admin):**
  - `GET /api/admin/murids` — Mengambil seluruh data murid terdaftar beserta relasi wali murid (user) pendamping, khusus untuk role admin.
  - `GET /api/admin/tentors` — Mengambil seluruh data user dengan role `tentor` (tentor) untuk keperluan statistik admin.
- **Integrasi UI Portal Admin (Dashboard & Layout):**
  - **Dashboard Admin (`/app/app/admin/page.tsx`):** Menghubungkan seluruh metric utama (Program Aktif dari catalog API, Total Siswa dari admin-only murids API, Total Tentor dari admin-only tentors API, Tagihan Pending dari API invoices, dan Sesi Hari Ini dari API sessions) dari database dengan fallback data dummy.
  - **Layout Admin (`/app/app/admin/layout.tsx`):** Mengubah banner "Mode Demo" menjadi dinamis (conditional rendering) menggunakan `isDemoMode()` agar tersembunyi ketika masuk mode koneksi server live.
- **Pembersihan Tipe Data:**
  - Membuat interface `SessionWithRelations` and `InvoiceWithRelations` di halaman dashboard admin untuk mapping data dari backend tanpa menggunakan keyword `any`, menjamin 100% clean type-checking.
- **Bugfix Visibilitas Input (Dark Mode):**
  - Mengatasi teks input yang tidak terlihat saat mengetik dalam kondisi sistem/browser dark mode dengan menambahkan kelas warna teks eksplisit (`text-gray-900 placeholder:text-gray-400`) pada input halaman login, input laporan perkembangan tentor, dan input pencarian katalog program wali.
- **Implementasi Logout Terpadu:**
  - Menghubungkan tombol "Keluar" di portal Tentor dan Wali Murid secara riil menggunakan `supabase.auth.signOut()` yang otomatis menghapus session token di browser cookie, lalu me-redirect ke `/login`.
  - Menambahkan link navigasi portal silang ("Pilih Portal") dan tombol "Keluar" ke mobile bottom navbar di portal Tentor & Wali Murid agar selaras dengan portal Admin.
- **Tombol Kredensial Testing di Halaman Login:**
  - Menambahkan tombol "Akun Testing" di pojok kanan atas halaman `/login`.
  - Menampilkan panel dropdown glassmorphic yang mencantumkan akun testing (Admin, Tentor, Wali Murid) lengkap dengan tombol salin (copy) email & password secara mandiri.

**File:**
- `backend/src/index.ts`
- `frontend/app/app/admin/page.tsx`
- `frontend/app/app/admin/layout.tsx`
- `frontend/app/app/tentor/layout.tsx`
- `frontend/app/app/tentor/laporan-perkembangan/LaporanPerkembanganClient.tsx`
- `frontend/app/app/(wali)/layout.tsx`
- `frontend/app/app/(wali)/program/page.tsx`
- `frontend/app/login/page.tsx`
- `docs/PROGRESS.md`
- `tasks/todo.md`

**Verifikasi:**
- Backend compiler `tsc` sukses.
- Frontend Next.js build & type-checking sukses 100% (24 static pages generated).
- ESLint frontend bersih tanpa warning/error.

---

### 2026-08-01 — Integrasi Frontend ↔ Backend API (Portal Wali Murid)

**Fase:** 3.7 (Integrasi Wali Murid)  
**Status sesi:** selesai

**Dikerjakan:**
- **Pembuatan Endpoint Backend (Portal Wali):**
  - `GET /api/me/enrollments` — Mengambil data pendaftaran program (enrollment) untuk murid-murid milik wali murid yang login secara riil, lengkap dengan detail program dan murid.
  - `GET /api/me/invoices` — Mengambil data tagihan (invoices) untuk murid-murid dari wali murid yang login, lengkap dengan relasi program dan murid.
  - `GET /api/me/progresses` — Mengambil data progress roadmap step per murid dari wali yang login.
- **Implementasi Format Helpers Global:**
  - Membuat `frontend/lib/format.ts` berisi `formatSessionDateTime` (konversi ISO DateTime ke string ber-zona waktu Asia/Jakarta WIB) dan `calculateAge` (penghitung umur anak) secara terpusat untuk dipakai bersama.
- **Integrasi UI Portal Wali Murid (6 Halaman):**
  - **Dashboard Wali (`/app/app/(wali)/dashboard/page.tsx`):** Menghubungkan ringkasan murid, program aktif, laporan sesi harian terakhir, rapor perkembangan blok, sesi terdekat, dan tagihan terdekat dari database asli dengan fallback data dummy.
  - **Program Katalog (`/app/app/(wali)/program/page.tsx`):** Menghubungkan daftar katalog program dan mengecek status "Terdaftar" anak secara real-time via API.
  - **Roadmap Belajar (`/app/app/(wali)/program/[slug]/page.tsx`):** Membaca detail program roadmap dan menampilkan status langkah belajar (selesai, aktif, terkunci) berdasarkan progres murid di database.
  - **Jadwal Belajar (`/app/app/(wali)/jadwal/page.tsx`):** Membaca daftar sesi mendatang (scheduled) dan riwayat mengajar (completed) untuk anak terpilih langsung dari database.
  - **Laporan Belajar (`/app/app/(wali)/laporan/page.tsx`):** Menampilkan rekapitulasi laporan harian pertemuan dan laporan perkembangan blok berkala anak secara dinamis via API.
  - **Tagihan Saya (`/app/app/(wali)/tagihan/page.tsx`):** Menampilkan invoice terdekat belum terbayar beserta riwayat pembayaran, di-map period & breakdown-nya di frontend secara dinamis.
- **Pembersihan Tipe Data:**
  - Mengekspos interface `Enrollment` dan `Progress` di `frontend/data/lms.ts` serta menambahkan properti optional `note` pada `Invoice` untuk sinkronisasi tipe frontend.

**File:**
- `backend/src/index.ts`
- `frontend/data/lms.ts`
- `frontend/lib/format.ts` (baru)
- `frontend/app/app/(wali)/dashboard/page.tsx`
- `frontend/app/app/(wali)/program/page.tsx`
- `frontend/app/app/(wali)/program/[slug]/page.tsx`
- `frontend/app/app/(wali)/jadwal/page.tsx`
- `frontend/app/app/(wali)/laporan/page.tsx`
- `frontend/app/app/(wali)/tagihan/page.tsx`
- `docs/PROGRESS.md`
- `tasks/todo.md`

**Verifikasi:**
- Backend compiler `tsc` sukses.
- Frontend Next.js build & type-checking sukses 100% (24 static pages generated).
- ESLint frontend bersih tanpa warning/error.

---

### 2026-08-01 — Integrasi Frontend ↔ Backend API (Pilot Portal Tentor)

**Fase:** 3.6 (Integrasi Pilot)  
**Status sesi:** selesai

**Dikerjakan:**
- **Rekonsiliasi Identitas & Database Seed:** Menyempurnakan `backend/prisma/seed.ts` menggunakan Supabase Admin API (`auth.admin.createUser`) untuk mendaftarkan user simulasi (Admin, Tentor Kak Kiki, Wali Supardi) ke auth Supabase secara riil, lalu mereferensikan UUID auth tersebut ke database Postgres Prisma. Menambahkan fallback pencarian email di endpoint `/api/users/me` jika UUID tidak sinkron.
- **Penyelarasan Skema Rapor Perkembangan:** Mengubah tipe kolom `achievements`, `masteredMaterials`, dan `weakMaterials` pada model `ProgressReport` di database Postgres dari `String` menjadi array string `String[]` agar selaras dengan input dynamic list points di UI. Serta memperbarui zod validation schema di `packages/shared/src/index.ts`.
- **Ekspansi Model Murid:** Menambahkan kolom `avatarUrl` (nullable) di model `Murid` database.
- **Implementasi API Client Frontend:** Membuat helper client API `frontend/lib/api.ts` yang otomatis melampirkan Bearer JWT token dari browser session Supabase ke request header backend. Mendukung deteksi mode demo lewat `NEXT_PUBLIC_DEMO_MODE` untuk membagi pembacaan data dummy offline vs API live.
- **Pembuatan Endpoint Backend (Pilot Tentor):**
  - `GET /api/programs` & `GET /api/programs/:id` (data penunjang program).
  - `GET /api/me/sessions` (sesi mengajar tentor login, include program + murid).
  - `GET /api/me/daily-reports` & `POST /api/daily-reports` (validasi zod shared, upsert laporan harian, set status sesi completed).
  - `GET /api/me/progress-reports` & `POST /api/progress-reports` (validasi zod shared).
- **Integrasi UI Portal Tentor:**
  - **Dashboard Tentor (`/app/app/tentor/dashboard/page.tsx`):** Menghubungkan ringkasan statistik, agenda hari ini, status laporan pending, dan nama profil dengan data dari API nyata, dengan fallback ke mode demo jika diaktifkan.
  - **Jadwal Tentor (`/app/app/tentor/jadwal/page.tsx`):** Membaca daftar sesi mendatang dan riwayat mengajar secara real-time dari API.
  - **Laporan Harian (`LaporanHarianClient.tsx`):** Mendukung fetch daftar laporan harian, form submit tulisan/edit laporan langsung masuk ke database via endpoint API backend.
  - **Laporan Perkembangan (`LaporanPerkembanganClient.tsx`):** Mendukung penulisan rapor perkembangan berkala murid langsung masuk ke database via endpoint API backend.
  - Menghilangkan peringatan render melingkar React (`Avoid calling setState() directly within an effect`) pada effect inisialisasi dengan eksekusi asinkron.

**File:**
- `backend/prisma/schema.prisma`
- `backend/prisma/seed.ts`
- `backend/src/index.ts`
- `backend/.env.example`
- `packages/shared/src/index.ts`
- `frontend/lib/api.ts` (baru)
- `frontend/app/app/tentor/dashboard/page.tsx`
- `frontend/app/app/tentor/jadwal/page.tsx`
- `frontend/app/app/tentor/laporan-harian/LaporanHarianClient.tsx`
- `frontend/app/app/tentor/laporan-perkembangan/LaporanPerkembanganClient.tsx`
- `frontend/middleware.ts`
- `tasks/todo.md`

**Verifikasi:**
- Pushing schema & seeding database sukses.
- Backend Express TS build sukses.
- Frontend Next.js build & lint sukses 100% (24 static pages generated).

---

### 2026-08-01 — Implementasi Portal Tentor & Halaman Pemilih Portal (Fase 3 Demo)

**Fase:** 3 (Jadwal & Laporan Sesi)  
**Status sesi:** selesai

**Dikerjakan:**
- Membuat Halaman Pemilih Portal di `/app` dengan 3 kartu pemilih (Wali Murid, Tentor, Admin) yang bergaya glassmorphism sesuai `design.md`.
- Membuat Layout Portal Tentor (`/app/tentor/*`) lengkap dengan sidebar desktop, bottom nav mobile, banner mode demo, dan menu navigasi: Dashboard Sesi, Laporan Harian, Laporan Perkembangan.
- Mengimplementasikan Dashboard Tentor (`/app/tentor/dashboard`) yang berisi:
  - Ringkasan statistik (Sesi Mengajar, Total Murid, Laporan Pending) yang terhubung ke data dummy.
  - Agenda mengajar hari ini dengan status real-time ("Terjadwal" / "Butuh Laporan" / "Selesai") dan tombol aksi yang relevan.
  - Kartu notifikasi/alert evaluasi perkembangan blok selesai terdeteksi untuk membimbing tentor membuat laporan berkala.
  - **Terbaru:** Menambahkan widget waktu & tanggal real-time (`RealtimeClock`) ber-zona waktu Asia/Jakarta (WIB) pada header dashboard tentor, dengan penataan responsif (rata kiri di mobile, rata kanan di desktop) agar rapi.
  - **Terbaru:** Membatasi agenda mengajar di dashboard hanya menampilkan jadwal **hari ini** (Sabtu, 1 Agustus 2026 dalam simulasi, berisi 3 sesi). Menyesuaikan kartu stat "Sesi Hari Ini" dan menambahkan tautan "Lihat Semua Jadwal" ke halaman jadwal baru.
- Menyempurnakan Layout & Navigasi Portal Tentor (`/app/tentor/*`):
  - **Terbaru:** Menambahkan menu **Jadwal** dengan ikon `CalendarDays` ke dalam sidebar desktop dan bottom-nav mobile.
- Membuat Halaman Jadwal Tentor (`/app/tentor/jadwal`):
  - **Terbaru:** Halaman baru untuk menampilkan seluruh sesi mengajar tentor (scheduled & completed), mendukung filter murid ("Semua Siswa" + nama murid), serta pembagian daftar menjadi "Sesi Mengajar Mendatang" dan "Riwayat Mengajar & Laporan".
  - Terintegrasi tombol aksi untuk langsung menulis laporan harian (`/app/tentor/laporan-harian?sessionId=...`) jika ada sesi lampau yang belum dilaporkan ("Butuh Laporan").
- Menyempurnakan Dashboard Wali Murid (`/app/dashboard`):
  - **Terbaru:** Menambahkan widget waktu & tanggal real-time (`RealtimeClock`) ber-zona waktu Asia/Jakarta (WIB) pada header dashboard wali murid, dengan penataan responsif (rata kiri di mobile, rata kanan di desktop) agar rapi.
- Menyesuaikan keterbacaan judul halaman non-dashboard di portal Tentor dan Wali Murid:
  - **Terbaru:** Mengubah warna judul halaman dari biru `text-[#4a70a9]` menjadi hitam `text-gray-900` untuk meningkatkan kontras visual (berlaku di halaman: Laporan Harian, Laporan Perkembangan tentor; serta Laporan Belajar, Jadwal Belajar, Program Belajar, dan Tagihan Saya wali murid).
- Membuat Portal Admin (`/app/admin/*`) lengkap:
  - **Terbaru:** Membuat Layout Portal Admin (`/app/admin/layout.tsx`) dengan sidebar desktop, bottom nav mobile, banner mode demo, menu navigasi Dashboard, tombol "Pilih Portal", dan tombol Keluar (yang memicu `supabase.auth.signOut()` menuju `/login`).
  - **Terbaru:** Merombak Halaman Utama Admin (`/app/admin/page.tsx`) menjadi Dashboard Admin lengkap dengan `RealtimeClock` (waktu WIB, penataan responsif), ringkasan statistik (Program Aktif, Total Murid, Total Tentor, Tagihan Pending), overview status koneksi platform, dan daftar agenda sesi hari ini.
- Membuat halaman Laporan Harian Tentor (`/app/tentor/laporan-harian`) yang menampilkan daftar catatan harian, mendukung pengisian form baru, dan pengeditan laporan. Form terintegrasi dalam halaman yang sama sebagai sub-komponen untuk memelihara local state demo dengan toast sukses.
  - **Terbaru:** Menambahkan filter per murid ("Semua" dan nama-nama murid) serta pembagian rekap per blok (10/12 pertemuan) yang terintegrasi tombol "Cetak Rekap PDF" (dengan media query `@media print` sehingga otomatis menyembunyikan sidebar/navigasi dan menghasilkan printout PDF bersih dan rapi).
- Membuat halaman Laporan Perkembangan Tentor (`/app/tentor/laporan-perkembangan`) yang menampilkan daftar rapor per blok murid dan mendukung pembuatan rapor baru dengan form evaluasi lengkap (capaian, materi dikuasai, butuh pengulangan, saran).
  - **Terbaru:** Menambahkan filter per murid ("Semua" dan nama-nama murid) serta integrasi tombol "Cetak Rapor PDF" untuk mencetak rapor perkembangan blok terpilih dalam tata letak dokumen formal siap cetak.
  - **Terbaru:** Mengganti 3 kolom textarea lama (Capaian Anak, Materi Dikuasai, dan Butuh Pengulangan) menjadi **fitur input list poin dinamis** yang mempermudah tentor menambahkan dan menghapus baris poin evaluasi secara presisi. Model data `ProgressReport` ikut diadaptasi menjadi array (`masteredMaterials: string[]` & `weakMaterials: string[]`) dan seluruh tampilan list serta dashboard di portal wali diselaraskan.
- Menambahkan data sesi dummy dan utility helper di `frontend/data/lms.ts` untuk memproses relasi sesi dan laporan tentor (`getSessionsForTentor`, `getPendingDailyReportsCount`, dll).
- Menerapkan kepatuhan sistem desain Hallmark secara penuh (tanpa card-in-card, left-aligned empty states, ikon Lucide murni, stamp Hallmark, dan transisi properti spesifik).

**File:**
- `frontend/data/lms.ts`
- `frontend/app/app/page.tsx`
- `frontend/app/app/tentor/layout.tsx`
- `frontend/app/app/tentor/page.tsx`
- `frontend/app/app/tentor/dashboard/page.tsx`
- `frontend/app/app/tentor/laporan-harian/page.tsx`
- `frontend/app/app/tentor/laporan-harian/LaporanHarianClient.tsx`
- `frontend/app/app/tentor/laporan-perkembangan/page.tsx`
- `frontend/app/app/tentor/laporan-perkembangan/LaporanPerkembanganClient.tsx`
- `docs/PROGRESS.md`

**Verifikasi:**
- `npm run build` dan `npm run lint` sukses 100% di folder `frontend` (23 static pages generated).

---

### 2026-08-01 — Integrasi Hallmark & Redesain Bebas AI-Slop (Multi-page Redesign)

**Fase:** 2 (UI Demo)  
**Status sesi:** selesai

**Dikerjakan:**
- Membuat dan menyepakati spesifikasi sistem desain (`design.md` di root) dengan tetap mempertahankan gaya glassmorphism dan warna latar `#6d8fc4` sesuai preferensi pengguna.
- Menghapus pola visual bersarang (*card-in-card*) di halaman Dashboard, Laporan, dan Tagihan:
  - Di **Dashboard**: Mengeluarkan kartu profil, program aktif, dan laporan dari dalam pembungkus `GlassCard` utama, menjadikannya kartu `GlassCard` sejajar.
  - Di **Laporan**: Mengganti kotak catatan tutor, materi dikuasai/lemah, dan saran tentor dari kartu bersarang menjadi blok teks berbingkai garis kiri aksen (*blockquote style*).
  - Di **Tagihan**: Mengintegrasikan rincian harga (breakdown) dan info transfer bank tanpa menggunakan border dan background sub-card di dalam kartu utama.
- Merombak visual state kosong (*empty states*) di halaman Laporan dan Tagihan agar tidak simetris tengah (*centred everything*), diubah menjadi kotak notifikasi horizontal ber-bias kiri yang rapi dengan tombol aksi admin.
- Menghilangkan emoji avatar `🎓` pada profil murid di Dashboard dan menggantinya dengan ikon SVG `GraduationCap` dari Lucide.
- Mengganti penggunaan `transition-all` yang berlebihan pada hover link, navigasi layout, dan tombol selector anak menjadi transisi properti spesifik (`transition-colors` / `transition-shadow`) untuk performa rendering yang lebih baik.
- Menambahkan penanda metadata Hallmark (`/* Hallmark · genre: ... · designed-as-app */`) di bagian atas file-file halaman portal wali.

**File:**
- `design.md`
- `frontend/app/app/(wali)/layout.tsx`
- `frontend/app/app/(wali)/dashboard/page.tsx`
- `frontend/app/app/(wali)/tagihan/page.tsx`
- `frontend/app/app/(wali)/laporan/page.tsx`
- `frontend/app/app/(wali)/jadwal/page.tsx`
- `docs/PROGRESS.md`

**Verifikasi:**
- `npm run build` dan `npm run lint` sukses 100% di folder `frontend`.

---

### 2026-08-01 — Sinkronisasi Selector Anak (Hapus Emoticon & Tampilan Seragam)

**Fase:** 2 (UI Demo)  
**Status sesi:** selesai

**Dikerjakan:**
- Menghapus emoticon `👦` dan avatar circle abu-abu pada seluruh selector anak di 4 halaman portal wali (`/app/dashboard`, `/app/tagihan`, `/app/laporan`, `/app/jadwal`) agar hanya menyisakan teks nama anak saja.
- Menyeragamkan tampilan selector anak di halaman Tagihan, Laporan, dan Jadwal dengan gaya halaman Dashboard:
  - Menghapus pembungkus glass card (`bg-white/30 backdrop-blur-xl border border-white/60 p-4 rounded-2xl shadow-sm`) agar selector tampil bersih langsung di atas layout.
  - Mengubah label dari "Siswa:" menjadi "Pilih Anak:".
  - Mengubah ukuran tombol selector anak dari padding `px-5 py-2` menjadi `px-4 py-2`.

**File:**
- `frontend/app/app/(wali)/dashboard/page.tsx`
- `frontend/app/app/(wali)/tagihan/page.tsx`
- `frontend/app/app/(wali)/laporan/page.tsx`
- `frontend/app/app/(wali)/jadwal/page.tsx`
- `docs/PROGRESS.md`

**Verifikasi:**
- `npm run build` dan `npm run lint` sukses 100% di folder `frontend`.

---

### 2026-08-01 — Redesain Halaman Tagihan Wali (Kartu Detail Tunggal & Tabel Riwayat)

**Fase:** 2 (UI Demo)  
**Status sesi:** selesai

**Dikerjakan:**
- Merombak total layout halaman `/app/tagihan` dari grid 3-kolom menjadi 1-kolom terpusat.
- Membatasi visual detail tagihan (GlassCard dengan rincian transfer, upload bukti, dan WhatsApp) hanya untuk **satu tagihan terbaru yang belum dibayar** (`unpaidInvoices[0]`).
- Mengubah riwayat pembayaran dari model tumpukan kartu kecil menjadi **tabel interaktif** lengkap dengan kolom: Invoice ID, Program/Periode, Jumlah, Status badge (Lunas / Belum Dibayar / Verifikasi), dan Tanggal/Jatuh Tempo.
- Mengaktifkan tombol **"Lihat Semua Riwayat"** sebagai toggle interaktif untuk menampilkan/menyembunyikan tabel riwayat semua invoice.
- Menambahkan utility `getProgramNameFromEnrollment` agar resolusi nama program les di baris tabel dinamis berdasarkan data enrollment.

**File:**
- `frontend/app/app/(wali)/tagihan/page.tsx`
- `docs/PROGRESS.md`

**Verifikasi:**
- `npm run build` dan `npm run lint` sukses 100% di folder `frontend`.

---

### 2026-08-01 — Rombak Halaman Laporan (Sistem Tab Laporan Harian & Perkembangan)

**Fase:** 2 (UI Demo)  
**Status sesi:** selesai

**Dikerjakan:**
- Mengubah label menu navigasi dari "Laporan Harian" menjadi "Laporan" pada layout portal wali (`frontend/app/app/(wali)/layout.tsx`).
- Menambahkan sistem tab (toggle) interaktif pada halaman laporan (`/app/laporan`):
  - **Tab Laporan Harian**: per sesi pertemuan (diperbarui setiap sesi selesai).
  - **Tab Laporan Perkembangan**: per blok pertemuan (diperbarui setiap akhir siklus 10x atau 12x sesi).
- Menampilkan deskripsi kecil pada masing-masing tombol toggle untuk menginformasikan kapan laporan diperbarui.
- Membuat list detail Laporan Perkembangan menggunakan data dummy `dummyProgressReports` yang di-join dengan metadata program (`programName` dan `sessionsPerBlock`).
- Desain kartu perkembangan rapi dengan visual glassmorphism, memisahkan bagian Capaian Hasil Belajar (bullet list), Materi yang Dikuasai, Perlu Latihan Tambahan, dan Catatan & Saran Tentor, serta tombol WhatsApp Konsultasi.
- Menambahkan empty state dinamis pada tab laporan perkembangan lengkap dengan CTA WhatsApp Admin.

**File:**
- `frontend/data/lms.ts`
- `frontend/app/app/(wali)/layout.tsx`
- `frontend/app/app/(wali)/laporan/page.tsx`
- `docs/PROGRESS.md`

**Verifikasi:**
- `npm run build` dan `npm run lint` sukses 100% di folder `frontend`.

---

### 2026-08-01 — Optimalisasi Layout Jadwal (Redesain Tombol Reschedule)

**Fase:** 2 (UI Demo)  
**Status sesi:** selesai

**Dikerjakan:**
- Menghapus full-width sticky bottom bar pada halaman jadwal (`/app/jadwal`) agar tidak menutupi konten pada resolusi desktop.
- Mengubah tombol "Ajukan Perubahan Jadwal Sesi" menjadi Floating Action Button (FAB) mandiri yang melayang di pojok kanan bawah.
- Mengatur posisi FAB dinamis: di atas bottom-nav pada mobile (`bottom-24 right-4`) dan di pojok kanan bawah pada desktop (`bottom-6 right-6`).
- Mengoptimalkan teks tombol melayang agar lebih ringkas dan otomatis menyembunyikan teks di perangkat seluler (`hidden sm:inline`) untuk estetika tampilan yang lebih bersih.
- Menyesuaikan padding bawah container halaman jadwal dari `pb-28` menjadi `pb-8`.

**File:**
- `frontend/app/app/(wali)/jadwal/page.tsx`
- `docs/PROGRESS.md`

**Verifikasi:**
- `npm run build` dan `npm run lint` sukses 100% di folder `frontend`.

---

### 2026-08-01 — Implementasi Halaman Laporan Harian Wali Murid

**Fase:** 2 (UI Demo)  
**Status sesi:** selesai

**Dikerjakan:**
- Membuat halaman baru Laporan Harian (`/app/laporan`) untuk Wali Murid dengan styling glassmorphism yang rapi dan konsisten.
- Menambahkan child selector murid sehingga Wali Murid dapat melihat laporan harian secara terpisah per anak.
- Menambahkan helper baru `getDailyReportsForMuridDetailed` di `frontend/data/lms.ts` untuk memproses data laporan harian dan secara otomatis melampirkan (join) nama program dan nama tentor (tentor) berdasarkan session.
- Mengintegrasikan menu navigasi baru "Laporan Harian" dengan ikon `ClipboardList` di sidebar (desktop) dan bottom nav (mobile) pada `frontend/app/app/(wali)/layout.tsx`.
- Memperbaiki tombol redirect buntu "Lihat Detail Laporan" di halaman jadwal (`/app/jadwal`) agar mengarah ke halaman `/app/laporan` secara benar.
- Menambahkan tombol "Diskusi via WhatsApp" pada setiap kartu laporan harian untuk memudahkan Wali berkomunikasi dengan tentor.

**File:**
- `frontend/data/lms.ts`
- `frontend/app/app/(wali)/layout.tsx`
- `frontend/app/app/(wali)/jadwal/page.tsx`
- `frontend/app/app/(wali)/laporan/page.tsx`
- `docs/PROGRESS.md`

**Verifikasi:**
- `npm run build` sukses 100% di folder `frontend` dengan router `/app/laporan` ter-generate statis.
- `npm run lint` bersih tanpa warning atau error.

---

### 2026-08-01 — Perbaikan Struktur Repositori & Pembersihan Artefak Build

**Fase:** Pemeliharaan  
**Status sesi:** selesai

**Dikerjakan:**
- Mengeluarkan folder build dan cache Next.js `frontend/.next` dari git tracking (`git rm -r --cached`) karena sempat ter-commit secara tidak sengaja (menyumbang ~339 MB data tak perlu).
- Memperbarui file konfigurasi `.gitignore` di root untuk secara rekursif mengabaikan folder build Next.js di subdirektori workspace (`**/.next/` dan `**/out/`).
- Menghapus folder fisik sisa build lama `.next` yang berada di root direktori proyek.

**File:**
- `.gitignore`
- `docs/PROGRESS.md`

**Verifikasi:**
- File `frontend/.next` berhasil di-untrack dan dibersihkan dari commit git.
- Folder `.next` di root berhasil dihapus.
- `git status` bersih dari file build tak ter-ignore.

---

### 2026-08-01 — Implementasi UI LMS Area Wali Murid (Mode Demo Offline)

**Fase:** 2 (UI Demo)  
**Status sesi:** selesai

**Dikerjakan:**
- Membuat dummy data terpadu `frontend/data/lms.ts` meniru schema database monorepo 3-role untuk mensimulasikan data Wali Murid (Bapak Supardi Santoso), Murid (Budi, Ani, & murid baru Kesha Pratiwi), Program (Ngaji, Calistung, & Vibe Coding), Roadmap Steps, Sessions, Daily Reports, Progress Reports, Invoices, dan Riwayat Pembayaran.
- Mengaktifkan kelas Vibe Coding di area Wali dengan membuat `active: true` pada program vibe-coding, menyelaraskan deskripsinya dengan silabus funnel, serta membuat 3 langkah roadmap (L1 Dasar, L2 Web App, L3 Pro) yang dirender secara dinamis sebagai accordion dropdown saat diklik.
- Menambahkan data simulasi/pendukung minimal untuk murid Kesha (sesi vibe-coding, daily report, progress report, dan invoice) agar data tampil konsisten dan "hidup" di seluruh fitur (Dashboard, Jadwal, Tagihan, Program) saat Kesha dipilih.
- Memperbaiki helper `getInvoicesForMurid` dan menambahkan field `muridId` pada Invoice dummy untuk memfilter tagihan secara benar per murid (memperbaiki bug kebocoran data tagihan antar-anak).
- Mengonfigurasi middleware `frontend/middleware.ts` dengan bypass gate menggunakan env variable `DEMO_MODE=true` agar `/app/*` bisa diakses secara publik untuk kebutuhan demo/review UI tanpa membuang fungsionalitas auth nyata.
- Menambahkan `DEMO_MODE="true"` ke `frontend/.env.local`.
- Menghapus placeholder `frontend/app/app/dashboard/page.tsx` lama.
- Membuat segmen layout `frontend/app/app/(wali)/layout.tsx` yang membungkus seluruh halaman Wali dengan shell "Parent Portal": sidebar desktop (Dashboard, Program Anak, Jadwal, Tagihan), bottom nav mobile, ambient backgrounds, dan banner mode demo berwarna emas di atas.
- Mengimplementasikan 6 halaman LMS Wali Murid dengan styling glassmorphism yang konsisten menggunakan Tailwind v4, `@/components/ui/` (`GlassCard`, `Button`, `Chip`), dan `lucide-react` icons:
  1. **Dashboard Wali** (`/app/dashboard`) -> Menampilkan ringkasan info murid, materi terakhir, progres belajar, sesi terdekat, dan tagihan terdekat.
  2. **Katalog Program** (`/app/program`) -> Menampilkan list program dengan status pendaftaran murid, pencarian client-side, dan integrasi CTA pendaftaran WhatsApp.
  3. **Roadmap & Detail Program** (`/app/program/[slug]`) -> Menampilkan timeline vertikal langkah belajar (lunas/selesai, sedang ditempuh, terkunci) dengan fitur interaktif accordion/dropdown untuk menampilkan konten penjelasan materi langsung di dalam card tanpa berpindah halaman, dilengkapi CTA WhatsApp "Tanya Guru".
  4. **Jadwal Belajar** (`/app/jadwal`) -> Menampilkan sesi mendatang dengan kartu detail tutor/lokasi, riwayat pertemuan dengan status absensi kehadiran, dan CTA ajukan perubahan jadwal via WhatsApp.
  5. **Tagihan Saya** (`/app/tagihan`) -> Menampilkan invoice detail dengan breakdown harga, petunjuk transfer Mandiri, form unggah bukti pembayaran simulasi, dan tombol konfirmasi WhatsApp ke admin.
- Menghapus halaman detail materi terpisah (`/app/materi/[id]`) dan halaman redirect pendukungnya dengan menghapus folder `frontend/app/app/(wali)/materi` sepenuhnya untuk menyederhanakan alur navigasi (halaman roadmap menjadi terminal leaf).
- Mengubah seluruh background utama area LMS `/app` (layout Wali & halaman Admin) dari gradasi berbercak menjadi solid biru cerah `#6d8fc4` (tanpa gradasi, tanpa ambient blur) guna memaksimalkan kontras komponen glassmorphism di atasnya dan meminimalkan porsi background putih.
- Berhasil memverifikasi build Next.js dan lint di folder `frontend/` berjalan sukses 100% tanpa error.

**File:**
- `frontend/.env.local`
- `frontend/middleware.ts`
- `frontend/data/lms.ts`
- `frontend/app/app/page.tsx`
- `frontend/app/app/(wali)/layout.tsx`
- `frontend/app/app/(wali)/dashboard/page.tsx`
- `frontend/app/app/(wali)/program/page.tsx`
- `frontend/app/app/(wali)/program/[slug]/page.tsx`
- `frontend/app/app/(wali)/jadwal/page.tsx`
- `frontend/app/app/(wali)/tagihan/page.tsx`
- `tasks/todo.md`
- `docs/PROGRESS.md`

**Verifikasi:**
- `npm run build` sukses 100% di folder `frontend`.
- `npm run lint` bersih di folder `frontend`.

---

### 2026-08-01 — Restrukturisasi Monorepo & Setup Express API 3-Role

**Fase:** 1.5  
**Status sesi:** selesai

**Dikerjakan:**
- Membuat struktur workspace baru menggunakan npm workspaces & Turborepo.
- Memindahkan aplikasi Next.js (funnel marketing & frontend LMS) dari root ke subfolder `frontend/`.
- Memperbaiki prerender error di `frontend/app/login/page.tsx` dengan membungkus penggunaan `useSearchParams` menggunakan Suspense boundary.
- Membuat shared package `@nurman-course/shared` di `packages/shared/` berisi tipe TS & validasi schema Zod (Daily & Progress Report).
- Mengupgrade server backend `backend/` menjadi Express API Server lengkap dengan:
  - Skema Prisma 3-role ter-sinkronisasi dengan `docs/erd-lms.md` (users, murids, programs, roadmap_steps, sessions, daily_reports, progress_reports, dll).
  - Script seeding data dummy model 3-role.
  - Middleware autentikasi token JWT Supabase (`requireAuth`) untuk Express.
  - Endpoint profil `/api/users/me` (terproteksi) dan health-check `/api/health`.
- Menyelaraskan dokumentasi `AGENTS.md` dan `SYSTEM_MAP.md` ke format monorepo.
- Berhasil memverifikasi build frontend (Next.js) dan backend (Express + Prisma Client compiler) berjalan sukses tanpa error.

**File:**
- `package.json` (root & workspaces)
- `turbo.json` (root)
- `frontend/*` (Next.js app & config)
- `backend/*` (Express API, Prisma schema, seed)
- `packages/shared/*` (Zod schemas & types)
- `AGENTS.md`
- `SYSTEM_MAP.md`
- `docs/PROGRESS.md`

**Verifikasi:**
- `npm run build` di `frontend/` sukses.
- `npx tsc --noEmit` & `npm run build` di `backend/` sukses.
- database db push & seeding model 3-role baru di Supabase sukses.

---

### 2026-08-01 — Redesain Perencanaan LMS (Perubahan Role Model & Penambahan Laporan Sesi)

**Fase:** 0 (Revisi)  
**Status sesi:** selesai

**Dikerjakan:**
- Mengubah alur peran pengguna (user roles) dari `admin` + `peserta` menjadi 3 peran utama: `admin`, `tentor` (tentor), dan `wali` (orang tua murid).
- Menambahkan entitas **Murid** (anak) sebagai entitas data yang dikelola wali (satu wali bisa memiliki lebih dari satu murid). Akun wali dibuat manual oleh admin.
- Menambahkan fitur **Laporan Kegiatan Harian** per sesi (tanggal, jam mulai, jam selesai, materi dibahas, catatan tentor).
- Menambahkan fitur **Laporan Perkembangan** berkala per blok pertemuan (capaian anak, materi dikuasai, materi belum dikuasai, catatan/saran tentor). Batas blok dikonfigurasi per program (`sessionsPerBlock`).
- Menulis ulang seluruh prompt desain UI Google Stitch serta menambahkan prompt baru (total 18 file) untuk menyesuaikan dengan model 3-role (Wali Murid, Tentor, Admin), alur laporan, dan manajemen murid/tentor oleh Admin.
- Merevisi dokumen-dokumen perencanaan:
  - `docs/ROADMAP-LMS.md` (tabel peran, in-scope MVP, fase, model data).
  - `docs/flow-system.md` (alur pendaftaran, detail alur wali murid, tentor, admin).
  - `docs/erd-lms.md` (skema tabel baru `murids`, `daily_reports`, `progress_reports`, dan relasi terkait).
  - `tasks/todo.md` (penyesuaian daftar tugas per fase).

**File:**
- `docs/ROADMAP-LMS.md`
- `docs/flow-system.md`
- `docs/erd-lms.md`
- `tasks/todo.md`
- `prompt-google-stitch/*` (18 files)

**Verifikasi:**
- Dokumen markdown diperbarui dan di-commit ke Git.

---

### 2026-08-01 — Pembuatan Prompt Desain UI Google Stitch untuk Seluruh Halaman LMS

**Fase:** 1 (Persiapan Desain/Stitch)  
**Status sesi:** selesai

**Dikerjakan:**
- Menyusun panduan design system terperinci (warna `#4a70a9`, GlassCard, tombol, input, chip) berdasarkan kode funnel nyata.
- Membuat file `README.md` panduan penggunaan Google Stitch secara bertahap.
- Membuat 13 file prompt berformat Markdown (.md) yang *self-contained* untuk 7 halaman area peserta dan 6 halaman area admin.

**File:**
- `prompt-google-stitch/README.md`
- `prompt-google-stitch/00-login-register.md` s.d. `12-kelola-tagihan.md` (13 files)

**Verifikasi:**
- Semua berkas tersimpan rapi dan dicommit ke git.

---

### 2026-08-01 — Fase 1: Setup Supabase Auth, Middleware Proteksi Route, & Halaman Login/Register

**Fase:** 1  
**Status sesi:** selesai

**Dikerjakan:**
- Install dependensi frontend Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- Buat helper Supabase Client (`lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/middleware.ts`)
- Buat Next.js Middleware (`middleware.ts`) untuk proteksi route `/app/*` dan pembagian route berdasarkan role admin vs peserta
- Buat SQL Trigger di Supabase untuk sinkronisasi otomatis registrasi user (`auth.users` -> `public.users`)
- Buat halaman Auth (`app/login/page.tsx`) dengan UI Glassmorphism modern
- Buat halaman dashboard minimal peserta (`app/app/dashboard/page.tsx`) and admin (`app/app/admin/page.tsx`)
- Perbaikan semua lint errors dan warnings di seluruh codebase

**File:**
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/middleware.ts`
- `middleware.ts`
- `app/login/page.tsx`
- `app/app/dashboard/page.tsx`
- `app/app/admin/page.tsx`
- `backend/prisma/seed.ts`

**Verifikasi:**
- `npm run lint` & `npx tsc --noEmit` bersih tanpa error/warning.
- SQL trigger sukses terpasang di database Supabase.
- Seeding data berjalan lancar.

---

### 2026-08-01 — Fase 1: Setup Prisma, Database Supabase, dan Seeding Data

**Fase:** 1  
**Status sesi:** selesai

**Dikerjakan:**
- Setup backend environment (`package.json`, `tsconfig.json`, `.env`)
- Definisi skema database Prisma untuk LMS Sederhana (`User`, `Program`, `RoadmapStep`, `MaterialItem`, `Session`, `Progress`, `Enrollment`, `Invoice`)
- Integrasi koneksi ke database Supabase (Sydney `ap-southeast-2` dengan IPv4 connection pooling)
- Pembuatan script seeding data awal (`prisma/seed.ts`)
- Inisialisasi Prisma Client global (`src/index.ts`) dan setup folder (`controllers`, `models`)

**File:**
- `backend/package.json`
- `backend/tsconfig.json`
- `backend/prisma/schema.prisma`
- `backend/prisma/seed.ts`
- `backend/src/index.ts`
- `backend/src/controllers/.gitkeep`
- `backend/src/models/.gitkeep`

**Verifikasi:**
- `npx prisma db push` berhasil disinkronkan ke Supabase.
- `npx prisma db seed` sukses dijalankan dan mengisi data awal.

---

### 2026-07-31 — Fase 0: Flow Sistem & Model Data

**Fase:** 0  
**Status sesi:** selesai

**Dikerjakan:**
- Buat `docs/flow-system.md` (alur login, dashboard orang tua, materi detail)
- Update `tasks/todo.md` (F0.1 selesai)
- Catat keputusan di `PROGRESS.md`

**File:**
- `docs/flow-system.md`
- `tasks/todo.md`
- `docs/PROGRESS.md`

**Verifikasi:**
- Entity + flow jelas
- Siap untuk Fase 1 (DB + Auth)

**Next:**
- F0.2 ERD kasar (sudah ada di erd-lms.md)
- F0.3 Mapping kasar `materials.ts` → Program/RoadmapStep
- F0.4 Shortlist stack (DB + Auth)
- F0.5 Catat keputusan open di PROGRESS

**Keputusan:** 
- Admin = kamu sendiri (single admin)
- Kelas: Calistung + Ngaji dulu
- Roadmap = table `roadmap_steps` dengan body_text (Markdown)
- Konten = Markdown di DB
- Progres per hari = table terpisah
- Funnel tetap terpisah (Opsi A)
