# Progress Log — nurman-course

> Log sesi kerja, keputusan, dan status fase. Satu-satunya log progres yang dijaga opencode.
> Task checklist: [`../tasks/todo.md`](../tasks/todo.md) · Roadmap: [`ROADMAP-LMS.md`](./ROADMAP-LMS.md) · Aturan: [`../AGENTS.md`](../AGENTS.md)

## Cara pakai

- **Entri baru** selalu ditaruh **paling atas** (di bawah blok ini), menggantikan posisi entri yang paling lama di bawah.
- Satu entri = satu sesi kerja yang mengubah repo (kode **atau** docs). Sesi tidak dianggap selesai sebelum entri ini ditulis (lihat Definition of Done di `AGENTS.md`).
- Vault (`D:\04_Writing\My Vault\My Projects\nurman-course\`) **bukan** pengganti file ini — cukup sync ringkas 1×/hari atau saat diminta user.

## Template entri (copy-paste, isi sesuai sesi)

```markdown
### YYYY-MM-DD — Ringkasan singkat (berapa kata)

**Fase:** <fase / task, e.g. ADM-5 (Uiux)>
**Status sesi:** <selesai / sebagian selesai / blocked> — <1–2 kalimat hasil>

**Request user:** <permintaan asli user; "—" jika inisiatif sendiri>

**Keputusan (klarifikasi):** <(1) ...; (2) ...> — tulis hanya yang benar-benar diputuskan.

**Dikerjakan:**
- **<Area>** `<path/file>`: <perubahan inti, singkat & terukur>.

**Verifikasi:** <command + hasil, e.g. `tsc --noEmit` exit 0, `next build` N routes OK; backend restart bila ada>

**Residual:** <QA manual / task follow-up / risiko tersisa>
```

## Tabel Keputusan (arsitektur / stack / A|B / aturan penting)

| Tanggal | Keputusan | Alasan |
|---------|-----------|--------|
| 2026-08-20 | Implementasi NC Debugger Widget (Dev Mode) | Mempermudah penelusuran request API, cache hit/miss/invalidated, dan SQL Query timing layaknya Laravel Debugbar. |
| 2026-08-20 | Implementasi In-Memory Cache di `apiFetch` | Mengurangi request berulang & loading screen berputar saat navigasi antar menu portal. |
| YYYY-MM-DD | <keputusan> | <alasan> |

---

### 2026-08-24 — Redesign besar landing page /landing dengan AppVerse.id Design System & Integrasi Tutor Carousel

**Fase:** UI/UX / Funnel polish (branch `dev`)
**Status sesi:** selesai — halaman `/landing` beserta semua komponennya diredesign total mengikuti AppVerse.id Design System (Playfair Display + DM Sans, warm background `#f7f4ef`, border `#c8b99a`, text `#1a1a18`, card/surface `#edeae3`, rounded-[6px] buttons, rounded-2xl cards) dengan tetap mempertahankan warna utama `#4a70a9` (biru). Komponen `LandingTutors` ditambahkan sebagai carousel dengan style terbaru.

**Request user:**
1. "yg landing aja dulu, aku mau redesign besar2an bisa dibuat kaya gini ga? # Design System Inspired by AppVerse.id ... warna utamanya samain kayak saat ini, sisanya seuaikan kyk yg aku kasih"
2. "dibagian course adasection tentor, itukan semacam carousel, aku mau biar ada di halaman landing, dengan style terbaru"

**Keputusan (klarifikasi):**
1. Warna utama sistem tetap **`#4a70a9`** (biru medium) dan sekunder tetap **`#3a5a99`** untuk branding.
2. Canvas berganti dari gradasi biru-putih ke warm off-white (`#f7f4ef`).
3. Card/surface berganti dari glassmorphism ke solid warm grey (`#edeae3`) dengan outline tan (`#c8b99a`).
4. Font diubah: Heading memakai **Playfair Display** (weight 400), Body memakai **DM Sans** (weight 400/500/600), di-load via `next/font/google` di `RootLayout`.
5. Data tutors disentralisasi ke `frontend/data/landing.ts` (menyelesaikan task P5).

**Dikerjakan:**
- **Layout** `frontend/app/layout.tsx`: import `Playfair_Display` dan `DM_Sans` dari `next/font/google`, declare css variables `--font-playfair` & `--font-dm-sans`, pasang di root html.
- **Global Theme** `frontend/app/globals.css`: configure Tailwind v4 custom theme tokens (`--color-app-*`, `--font-playfair`, `--font-dm`) sinkron dengan palette AppVerse.id.
- **Landing Page** `frontend/app/landing/page.tsx`: ganti background gradient class ke `bg-app-bg font-dm text-app-text-mid antialiased`, import & render `<LandingTutors />` di antara program dan testimoni.
- **Navigasi** `frontend/components/landing/LandingNav.tsx`: update warna background header, border tan, rounded-[6px] button, dan Playfair font untuk nama brand.
- **Hero** `frontend/components/landing/LandingHero.tsx`: hapus gradient blobs latar belakang, set heading Playfair Display (normal, 400), search bar & button rounded-[6px], update style card kanan menjadi flat warm card dengan rounded-2xl, update border floating chips.
- **Stats** `frontend/components/landing/LandingStats.tsx`: ganti GlassCard dengan warm card border tan, ubah overlap `-mt-10` menjadi layout normal dengan padding `py-8`, warna angka tetap `#4a70a9` (warna utama).
- **About** `frontend/components/landing/LandingAbout.tsx`: h2 Playfair Display, info banner & Discord button rounded-[6px], point card diubah ke warm card border tan. Fix duplicate `);` syntax error di akhir file.
- **Categories** `frontend/components/landing/LandingCategories.tsx` & **Testimonials** `frontend/components/landing/LandingTestimonials.tsx`: h2/h3 Playfair, card diubah dari GlassCard ke solid warm grey card.
- **Tutor Carousel (Landing)** `frontend/components/landing/LandingTutors.tsx`: buat komponen carousel baru yang diredesign mengikuti AppVerse.id style (Playfair heading, rounded-[6px] buttons & dot indicators, rounded-2xl warm cards).
- **Tutor Data (P5)** `frontend/data/landing.ts`: sentralisasi data array `tutors` untuk dipakai bersama di `/course` dan `/landing`.
- **Course Page** `frontend/app/course/page.tsx`: ubah import tutors lokal ke `@/data/landing`.
- **CTA** `frontend/components/landing/LandingCta.tsx`: ganti gradasi biru ke solid warm surface card, text primary, h2 Playfair, button rounded-[6px] (pilih program bg-primary, tanya admin border-tan bg-white).
- **Footer** `frontend/components/landing/LandingFooter.tsx`: border-top tan, bg-app-surface, text muted.

**Verifikasi:**
- Perbaikan syntax error pada `LandingAbout.tsx` (line 112 duplicate `);`).
- `npm run build --workspace=frontend` exit 0, compile sukses, 35 routes berhasil digenerate, tsc pass 0 error.

**Residual:**
- Halaman funnel `/course/*` (landing funnel, program, materi, config) belum diredesign ke style ini — masih memakai glassmorphism asli. Perubahan ini dibatasi hanya untuk `/landing` saja sesuai instruksi.

---

### 2026-08-23 — Sinkronisasi SYSTEM_MAP.md dengan kode (P1 sebagian)

**Fase:** Meta / dokumentasi (P1) (branch `dev`)
**Status sesi:** selesai — `SYSTEM_MAP.md` ditulis ulang agar sinkron dengan kondisi kode aktual (routing, folder, key files, data flow). `AGENTS.md` menyusul (P1 belum tuntas penuh).

**Request user:** "malem ini cukup perbaiki system_map aja dulu, biar sinkron nnti kalo mau update" (setelah membatalkan rencana M4 Supabase Storage karena foto publik tanpa login dianggap tidak cocok).

**Keputusan (klarifikasi):**
1. Migrasi foto murid ke Supabase Storage **dibatalkan** — Opsi A (bucket publik) berarti foto bisa diakses tanpa login; user menolak. Foto tetap base64 di kolom `photoPath`. Task M4 statusnya efektif blocked/on-hold menunggu keputusan privat+signed URL.
2. Rule bisnis **1 wali = 1 murid dipertahankan** (blok 409 di POST /api/admin/murids tidak dihapus) — selector multi-murid wali tetap ada sebagai future-proofing.
3. Scope malam ini docs-only: SYSTEM_MAP.md saja, AGENTS.md menyusul.

**Dikerjakan:**
- `SYSTEM_MAP.md`: rewrite penuh — overview stack (Next 16/Turbopack, React 19, Tailwind v4, Express+Prisma+Supabase, workspaces, NC Debugger); routing lengkap 35 route (`/landing`, `/app/profile`, `/app/materi`, `/app/tentor/profil`, admin `jadwal`/`roadmap`/`tagihan/[invoiceId]`, deskripsi laporan-harian baru tabel+modal); folder structure sinkron (`(wali)` group, components/landing, lib/api.ts, middleware.ts, data/lms.ts); key files map tambah api.ts (cache+debugger), DebugBar.tsx, middleware.ts, lms.ts, seed.ts (+warning jangan seed prod), deskripsi index.ts per kelompok endpoint, 13 model Prisma; data flow portal (apiFetch cache → JWT → Prisma → invalidasi); rules tambah (wajib apiFetch, Zod dari shared).

**Verifikasi:** Daftar model & route diverifikasi langsung dari kode (`rg "^model"` schema.prisma = 13 model; listing folder frontend/app/app + build output 35 routes). Docs-only, tidak ada perubahan kode.

**Residual:** P1 belum tuntas — `AGENTS.md` masih perlu disinkronkan (bagian Key Files Map & routing-nya juga stale). Folder kosong terdeteksi: `frontend/app/app/dashboard/` dan `frontend/app/app/admin/pengguna/` (tanpa file) — kandidat dibersihkan di sesi lain.

---

### 2026-08-21 — Bugfix laporan harian menimpa laporan lama + tabel laporan & modal detail

**Fase:** TENTOR (laporan-harian + dashboard) (branch `dev`)
**Status sesi:** selesai — bug "tulis laporan malah update laporan lama" diperbaiki di akar penyebabnya; daftar laporan diubah menjadi tabel dengan modal detail; dashboard tentor kini menghitung laporan pending berdasarkan waktu sesi.

**Request user:** "kalo tentor nulis laporan, malah update data laporan yg ada, bukan nambah data ... jadi bisa tulis laporan sesuai jadwal, bisa tulis laporan baru, bisa edit laporan yg udh ada. dan aku mau halaman laporan dibuat jadi tabel aja, ada tombol detail, nanti muncul modal detailnya, tapi kalo di dashboard laporannya tetep muncul detail kaya sekarang"

**Keputusan (klarifikasi):**
1. Akar bug: tombol "Tulis Laporan" memakai fallback `sessions[0]` saat semua sesi sudah dilaporkan → form kosong terbuka untuk sesi yang sudah berlaporkan → POST `/api/daily-reports` melakukan upsert dan MENIMPA laporan lama. Fallback dihapus total.
2. Kriteria sesi pending = sesi apa pun `status !== "cancelled"` yang belum punya laporan (bukan hanya `status === "completed"`, karena status completed baru ter-set setelah laporan ditulis).
3. Auto-redirect `sessionId` → `editSessionId` jika sesi sudah berlaporkan, sebagai pengaman kedua.
4. Halaman laporan jadi tabel + tombol Detail (modal); tampilan detail card di dashboard dipertahankan.

**Dikerjakan:**
- **Frontend** `frontend/app/app/tentor/laporan-harian/LaporanHarianClient.tsx`: (1) hapus fallback `sessions[0]`, ganti `handleWriteReport` dengan kriteria pending benar + toast peringatan; (2) tambah `useEffect` auto-redirect ke mode edit bila `sessionId` sudah berlaporkan; (3) ganti daftar card menjadi tabel (No/Siswa/Tanggal/Jam/Program/Aksi) responsif; (4) tambah state `detailReport` + modal detail glassmorphism dengan tombol Edit & Tutup.
- **Frontend** `frontend/app/app/tentor/dashboard/page.tsx`: (1) simpan `rawEndsAt` ISO asli di mapping session; (2) hitung ulang `pendingCount` = sesi lewat waktu (`endsAt <= now`) && tidak dibatalkan && belum berlaporkan (sebelumnya selalu 0 karena bergantung `status === "completed"`); (3) `getSessionStatusInfo` kini menerima `rawEndsAt` dan menandai sesi lewat waktu sebagai "Butuh Laporan"/"Selesai"; (4) kondisi render tombol aksi diganti dari `status === "completed"` ke `statusInfo.label !== "Terjadwal"`.
- **Frontend** `frontend/components/ui/DebugBar.tsx`: root container `select-none` → `select-text` agar log bisa diseleksi mouse; tambah tombol Copy Logs (ikon Copy/Check) di header yang menyalin semua log ke clipboard via `navigator.clipboard.writeText` dengan format `[timestamp] METHOD path - Status: X, Cache: Y, Duration: Zms` + feedback "Copied!" hijau 1.5 detik.
- **Frontend** `LaporanHarianClient.tsx` (revisi user): hapus badge umur `{muridAge} Th` di kolom Siswa tabel (nama tampak menempel umur); umur tetap tampil di modal Detail & print A4.

**Verifikasi:** `npx tsc --noEmit` frontend exit 0; `npm run build` frontend sukses (35 routes).

**Residual:** QA manual alur: tulis laporan baru via tombol (harus pilih sesi pending), edit laporan via tabel & modal, cek badge "Butuh Laporan" di dashboard untuk sesi hari ini yang sudah lewat jamnya. Backend tidak diubah — endpoint upsert tetap, tapi kini tak bisa lagi terpicu fallback salah dari UI.

---

### 2026-08-20 — Dev-tooling: Kustom Debugger Widget (NC Debugger) & Prisma SQL Logging

**Fase:** Tooling / DX (Developer Experience) (branch `dev`)
**Status sesi:** selesai — debugger widget kustom (seperti Laravel Debugbar) melayang di kanan bawah layar untuk menampilkan riwayat request API, cache status, status code, dan latency secara real-time. Console backend juga menampilkan query SQL Prisma beserta durasinya.

**Request user:** "adakah semacma library untuk membantu proses development, kalo dilaravel ada library / apa itu aku lupa, nampilinnya di bagian bawah halaman, jadi ada querynya, ada keterangan timestamp nya, brp lamabisa uambil data itu dll"

**Keputusan (klarifikasi):**
1. Membuat widget kustom murni (tanpa dependency besar) di frontend untuk menampilkan metrik request `apiFetch`.
2. Mengintegrasikan SQL logging di backend Express melalui event `query` milik PrismaClient agar query database tampil di terminal server beserta timing (ms).

**Dikerjakan:**
- `frontend/lib/api.ts`: tambah array `fetchLogs`, event listener `addLogListener`/`notifyLogListeners`, serta perekaman durasi latency, status code, dan metadata cache (`HIT`, `MISS`, `INVALIDATED`) di dalam `apiFetch`.
- `frontend/components/ui/DebugBar.tsx`: widget debugger melayang yang responsif, collapsible, hydration-safe, dan hanya aktif pada mode development (`NODE_ENV === 'development'`).
- `frontend/app/layout.tsx`: daftarkan komponen `<DebugBar />` di dalam root body layout.
- `backend/src/index.ts`: konfigurasikan `new PrismaClient` agar memancarkan event `query` jika bukan mode produksi, lalu cetak SQL query berwarna cyan beserta timing (ms) di console terminal server.

**Verifikasi:** `npx tsc --noEmit` frontend + `npm run build` backend & frontend sukses.

**Residual:** QA manual widget dengan berganti halaman dan melihat pembaruan request di panel debugger.

---

### 2026-08-20 — Portal: In-Memory Client-Side Cache (1 Jam) dengan Smart Invalidation

**Fase:** Optimasi Performa / UIUX (branch `dev`)
**Status sesi:** selesai — navigasi menu di portal wali/tentor/admin kini instan tanpa delay loading screen berkat memory caching.

**Request user:** "apakah bisa pake cache? biar mengurangi loading? yg paling tepat gimana deh"

**Keputusan (klarifikasi):**
1. Menggunakan **Opsi 1 (In-Memory Cache)** global pada utility `apiFetch` agar berimbas ke seluruh portal secara otomatis.
2. TTL diatur **1 jam** agar menghemat loading screen saat navigasi.
3. Menggunakan **Smart Invalidation per Tipe Data**: Jika ada request mutasi (`POST`/`PUT`/`DELETE`), sistem hanya menghapus kategori cache yang bersangkutan saja (invoices, reports, sessions, users/profile) alih-alih menghapus semua secara agresif.

**Dikerjakan:**
- `frontend/lib/api.ts`: tambah interface `CacheEntry`, variabel `getCache` Map, `CACHE_TTL` (1 jam), fungsi pintar `invalidateCache(path)`, perbarui signature `apiFetch` dengan opsi `bypassCache` (di-destructure agar tidak bocor ke request fetch). Jika request `GET` dan bukan `bypassCache`, layani via memory cache. Jika request mutasi, lakukan invalidasi selektif.

**Verifikasi:** `npx tsc --noEmit` frontend exit 0; `npm run build` sukses.

**Residual:** QA manual browser (navigasi Dashboard ➔ Jadwal ➔ Laporan instan; setelah simpan form/mutasi, data ter-refresh otomatis).

---

### 2026-08-20 — Portal wali: selector murid (multi-anak) di Dashboard/Jadwal/Laporan/Tagihan + Ubah Kata Sandi di Profil Wali

**Fase:** UIUX / portal wali (branch `dev`)
**Status sesi:** selesai — wali dengan >1 anak kini bisa berganti anak di semua halaman portal; profil wali dapat mengubah kata sandi sendiri (paritas fitur dengan portal tentor).

**Request user:** "kita fokus ke halaman wali dulu ya"; multi-murid di profil **tidak perlu** (tetap tampilkan murid pertama saja); setelah selesai push ke branch `dev`.

**Keputusan (klarifikasi):** profil wali tidak diubah jadi daftar semua anak — tetap menampilkan `profile.murids[0]`; yang ditambah hanya fitur Ubah Kata Sandi.

**Dikerjakan:**
- `(wali)/dashboard/page.tsx`, `(wali)/jadwal/page.tsx`, `(wali)/laporan/page.tsx`, `(wali)/tagihan/page.tsx`: sisipkan **selector murid** (tab pill glassmorphism, hanya tampil jika `murids.length > 1`, pola sama dengan katalog program) di bawah header — mengubah `selectedMuridId`; data sudah difilter client-side per murid, jadi tanpa perubahan backend.
- `(wali)/profile/page.tsx`: tambah section **Ubah Kata Sandi** (form Password Baru + Konfirmasi, toggle show/hide `Eye`/`EyeOff`, validasi min 6 & konfirmasi cocok, `supabase.auth.updateUser({password})` client-side, busy state, notifikasi sukses/error) — pola sama persis dengan `tentor/profil/page.tsx`; import `createClient` + ikon `KeyRound/Eye/EyeOff/CheckCircle2/AlertCircle`.

**Verifikasi:** `npx tsc --noEmit` frontend exit 0; `npm run build` sukses. Backend tak diubah.

**Residual:** QA manual browser (role wali dengan 2+ murid): ganti tab siswa di 4 halaman → data ikut berubah; ubah kata sandi di profil → berhasil + notifikasi; belum di-commit/push.

---

### 2026-08-20 — Katalog program wali: filter kategori + kartu informatif ringkas; detail program split Terdaftar vs Belum Terdaftar

**Fase:** UIUX / portal wali (branch `dev`)
**Status sesi:** selesai — `/app/program` jadi katalog bersih dengan tab filter kategori (Semua/Materi/Jenjang/Calistung), search, dan kartu informatif ringkas yang semuanya mengarah ke halaman detail; `/app/program/[slug]` kini membedakan status pendaftaran — belum terdaftar = info program + outline silabus + CTA daftar WA; sudah terdaftar = peta jalan interaktif yang sudah ada.

**Request user:** "jadi semacam catalog itu, card2 ga usah terlalu rinci, yg penting informatif, kalo di klik masuk ke halaman detail program, nanti bisa daftar lewat situ; di halaman catalog program ada filter kategori juga".

**Keputusan (klarifikasi):** kartu katalog tidak memuat tombol WA langsung — semua kartu link ke `/app/program/[slug]`; halaman detail jadi pusat info + aksi pendaftaran. Status pendaftaran dideteksi dari enrollment `active` murid terpilih.

**Dikerjakan:**
- `frontend/app/app/(wali)/program/page.tsx`: tambah tab filter kategori (state `activeCategory`, `CATEGORY_FILTERS`), selector murid jika >1 anak, kartu ringkas (ikon kategori `getCategoryIcon`, badge status Terdaftar/Tersedia/Coming Soon, nama, deskripsi `line-clamp-2`, investasi/sesi, CTA "Lihat Detail"/"Buka Peta Jalan"), seluruh kartu = `<Link>` ke detail; hapus aksi WA langsung dari kartu.
- `frontend/app/app/(wali)/program/[slug]/page.tsx`: hitung `isEnrolled` (enrollment `active` murid terpilih); jika belum terdaftar → header "Detail Program", kartu info (kategori, deskripsi penuh, investasi/sesi, jumlah sesi/blok, peserta, status), section "Materi yang Akan Dipelajari" (outline roadmap non-expandable), sticky CTA "Daftar Sekarang via WhatsApp" (disabled jika tak ada murid / program nonaktif); jika terdaftar → peta jalan interaktif existing (progress, expand langkah, Tanya Guru, bottom bar sesi selesai).
- **Penyesuaian lanjutan (req user):** label "Investasi" → "Mulai dari" (katalog + detail + CTA); CTA "Daftar Sekarang" tidak lagi `fixed` — jadi kartu menonjol di alur halaman (border hijau `#25D366` + logo SVG WhatsApp hijau + shadow emerald); bar "Sesi Selesai / Lihat Laporan Riwayat Sesi" juga tidak lagi `fixed` — jadi GlassCard statis di bawah peta jalan; padding bawah container dikurangi (`pb-44 md:pb-28` → `pb-12`).
- **Modal detail materi (req user):** outline "Materi yang Akan Dipelajari" (belum terdaftar) kini bisa diklik (`cursor-pointer` + chevron kanan) → membuka modal backdrop-blur berisi header langkah/level, deskripsi lengkap via `MarkdownContent`, tombol hijau WhatsApp "Tanya Materi Ini" (auto-fill pesan: nama anak + judul langkah + nama program) dan tombol Tutup.
- **Revisi (req user):** filter kategori di katalog jadi **dropdown** (bukan tombol sebaris); header card program tanpa ikon logo — cukup kategori (kiri) + status (kanan); modal materi disederhanakan — hapus badge langkah/level, hapus tombol "Tanya Materi Ini" & "Tutup", hanya tombol close `X` kanan atas; tombol CTA diperkecil & sebaris — teks cukup **"Daftar Sekarang"** + logo WA hijau.

**Verifikasi:** `npx tsc --noEmit` frontend exit 0; `npm run build` sukses — semua route OK (termasuk `/app/program` statik & `/app/program/[slug]` dinamis). Backend tak diubah.

**Residual:** QA manual browser (role wali): filter kategori + search di katalog, klik kartu → detail; belum terdaftar → info + outline + CTA WA; pilih murid lain → status berubah; sudah terdaftar → peta jalan normal. Belum di-commit ke `dev`.

---

### 2026-08-12 — Jadwal wali (dashboard + /app/jadwal): filter waktu + hapus dummy "Kak Kiki"

**Fase:** AD-HOC / portal (branch `main`)
**Status sesi:** selesai — kartu "Sesi Terdekat" di dashboard wali kini memakai sesi scheduled yang benar-benar belum lewat (paling dekat) dengan nama tentor **real**; halaman `/app/jadwal` wali memisahkan Sesi Mendatang vs Riwayat berbasis waktu (scheduled yang lewat pindah ke Riwayat), konsisten dengan perbaikan tentor/admin.

**Request user:** "perbaiki juga jadwal sesi untuk wali" (dari `/app/dashboard`).

**Keputusan:** terapkan keputusan ke **dashboard + `/app/jadwal` wali** (user pilih "keduanya"). Nama mentor diambil dari `tentor` yang sudah ada di respon `/api/me/sessions` (bukan hardcode).

**Dikerjakan:**
- `frontend/app/app/(wali)/dashboard/page.tsx`: `DbSession` tambah `tentor?: {id,name}`; `getUpcomingSessionWali()` filter `scheduled` & `endsAt > Date.now()` sort asc ambil [0], `tutorName` = `tentor?.name || "Kak Tentor"` (hapus hardcode "Kak Kiki").
- `frontend/app/app/(wali)/jadwal/page.tsx`: `passedIds` dari `new Date(s.endsAt).getTime() <= Date.now()`; `upcomingSessions` = scheduled belum lewat sort asc; `pastSessions` = `completed || cancelled` + scheduled lewat sort desc; render badge status-aware (Dibatalkan / Hadir-Selesai / Menunggu Laporan).

**Verifikasi:** `npx tsc --noEmit` (frontend) exit 0; `npx next build` compiled successful + 35 routes OK.

**Residual:** QA `/app/dashboard` & `/app/jadwal` (role wali): sesi lewat pindah Riwayat, "Sesi Terdekat" nama tentor real, tak ada "Kak Kiki"; badge Riwayat benar untuk cancelled/selesai/lewat. Backend tak diubah.

---

### 2026-08-12 — Jadwal tentor & admin: modal konfirmasi aksi + filternya polarisasi sesi (Sesi Mendatang ≠ lewat)

**Fase:** AD-HOC / portal (branch `main`)
**Status sesi:** selesai — aksi Batalkan & Hapus di kartu sesi kini pakai `ConfirmDialog` (Batalkan amber info, Hapus merah `danger`), menggantikan `native confirm()`. Filter jadwal diperbaiki: "Sesi Mendatang" hanya menampilkan sesi scheduled yang **belum lewat** waktunya; sesi scheduled yang `endsAt`-nya sudah lewat otomatis pindah ke **Riwayat**.

**Request user:** tombol Hapus dibuat merah (beri modal konfirmasi); bug — sesi yang tanggal/jamnya sudah lewat masih tampil di "Sesi Mendatang" padahal harus masuk Riwayat; sesi Mendatang hanya sesi hari ini/terdekat yang belum lewat.

**Keputusan:** pakai komponen `ConfirmDialog` yang sudah ada (tentor & admin, pola di `admin/roadmap`). `passedIds` dihitung dari `sessionsDataRaw` (timestamp ISO asli) dengan `new Date(s.endsAt).getTime() <= Date.now()`; polarisasi `upcomingSessions`/`pastSessions` memakai set itu. Action handler diubah jadi `setCancelTarget`/`setDeleteTarget` + `confirmCancel`/`confirmDelete` (dengan `confirmBusy`). Batalkan = non-danger `Ban` amber; Hapus = `danger` merah ikon `Trash2`.

**Dikerjakan** (2 file identik → `frontend/app/app/tentor/jadwal/page.tsx` & `frontend/app/app/admin/jadwal/page.tsx`); admin penulisannya perlu hati-hati karena `AdminSession` beda field:
- Import `ConfirmDialog` + ikon `Ban`.
- State `cancelTarget`/`deleteTarget` (`SessionWithRelations`/`AdminSession`) + `confirmBusy`.
- Filter `upcomingSessions`/`pastSessions` berbasis `passedIds`.
- Handler `confirmCancel`/`confirmDelete` (PATCH status cancelled / DELETE), hapus `handleCancel`/`handleDelete`.
- Tombol kartu: "Batalkan" `border-amber-200 text-amber-700` → `setCancelTarget`; "Hapus" `text-red-500` → `setDeleteTarget`.
- Render 2 `ConfirmDialog` (Batalkan non-danger, Hapus `danger`) sebelum penutup root.

**Verifikasi:** `npx tsc --noEmit` (frontend) exit 0; `npx next build` compiled successful + 35 routes OK. Grep `handleCancel`/`handleDelete` di app tidak ada sisa (kecuali file lain yang memang beda fitur).

**Residual:** QA `/app/tentor/jadwal` & `/app/admin/jadwal`: buat sesi dengan waktu lewat → masuk Riwayat (badge amber "Butuh Laporan"); sesi belum lewat → di Mendatang; klik Batalkan → popup info → pindah Riwayat sebagai "Dibatalkan"; klik Hapus → popup merah → hilang permanen. Catatan: `passedIds` memakai waktu mesin lokal browser (WIB developer); bila ada sesi lintas zona tetap berfungsi karena `Date` dibandingkan absolut. Backend tak diubah.

---

### 2026-08-12 — Form jadwal (tentor & admin): "Jam Selesai" auto-fill +1 jam dari "Jam Mulai"

**Fase:** AD-HOC / portal (branch `main`)
**Status sesi:** selesai — saat user memilih/ubah "Jam Mulai" di form Buat/Edit jadwal, "Jam Selesai" otomatis terisi = Jam Mulai + 1 jam (default, tetap bisa diedit manual; hanya ter-set ulang saat Jam Mulai berubah).

**Request user:** "ketika bikin jadwal, setelah milih jam mulai, otomatis jam selesainya berjarak 1 jam, bisa dirubah, hanya default saja" — berlaku di tentor & admin (user: "sekalian").

**Keputusan:** helper `addOneHour` di `frontend/utils/format.ts` (parse `HH:MM`, +1 jam, wrap `%24`, padStart). onChange "Jam Mulai" memakai state updater untuk set `endTime = v ? addOneHour(v) : f.endTime`. Default form (`emptyForm` + `openCreate`) disinkron ke 15:00→16:00.

**Dikerjakan:**
- `frontend/utils/format.ts`: tambah export `addOneHour(time)`.
- `frontend/app/app/tentor/jadwal/page.tsx`: import `addOneHour`; onChange "Jam Mulai"; default `emptyForm`/`openCreate` endTime `16:00`.
- `frontend/app/app/admin/jadwal/page.tsx`: identik.

**Verifikasi:** `npx tsc --noEmit` (frontend) exit 0; `npx next build` compiled successful + 35 routes OK.

**Residual:** QA di `/app/tentor/jadwal` & `/app/admin/jadwal`: pilih jam mulai → selesai ikut +1 jam; ubah selesai manual tetap; openEdit tetap memakai jam asli sesi (tak diubah — benar). Backend tak perlu restart (murni FE).

---

### 2026-08-12 — Dashboard tentor: bagian "Evaluasi Perkembangan Belajar" kini live (hapus dummy Budi Santoso)

**Fase:** AD-HOC / portal tentor (branch `main`)
**Status sesi:** selesai — section yang tadinya hardcode dummy kini didorong dari data live; tak ada string `Budi Santoso`/`Ngaji Iqra`/`murid-budi`/`prog-ngaji` lagi.

**Request user:** bagian "Evaluasi Perkembangan Belajar" di `/app/tentor/dashboard` masih data dummy → jadikan live, hilang jika tak ada, deteksi dari sesi & laporan perkembangan.

**Keputusan:** skema deteksi = murid dengan sesi `completed` mencapai ambang `program.sessionsPerBlock` per pasangan murid+program, tapi belum ada `ProgressReport` terbit untuk blok tersebut → munculkan alert amber + CTA menuju `laporan-perkembangan` memakai ID asli (`murid.id`, `program.id`, `block`). Section disembunyikan total bila tak ada yang memenuhi.

**Dikerjakan** (semua di `frontend/app/app/tentor/dashboard/page.tsx`):
- Tambah import `ProgressReport`; state `progressReports` & `completedBlocksPending`.
- `loadData()` kini fetch `/api/me/progress-reports` (`.catch` aman) di `Promise.all`.
- Helper baru `detectCompletedBlocksPending(sessions, reports)`: grup sesi `completed` per `(muridId, programId)`, hitung blok tuntas (`floor(len/sessionsPerBlock)`), cek ketiadaan rapor via Set `${muridId}|${programId}|${blockNumber}` → kembali daftar `{murid, program, blockNumber}`.
- Render section: hanya tampil bila `completedBlocksPending.length > 0`; kartu amber per entri memakai nama/program live; Link CTA pakai ID asli. Empty-state tidak dirender (section hilang).

**Verifikasi:** `npx tsc --noEmit` (frontend) exit 0; `npx next build` compiled successful + 35 routes OK (2 dari JSON output).

**Residual:** QA di `/app/tentor/dashboard` dengan data seed (Budi Santoso, program Ngaji) — harus muncul alert dengan ID asli yang membuka form `laporan-perkembangan`; bila sudah terbit rapor untuk blok-nya maka section hilang. Backend tak diubah; tak perlu restart.

---

### 2026-08-12 — Portal tentor mobile: sidebar drawer + logo pembuka; update password; dashboard ringkas

**Fase:** AD-HOC / portal polish (branch `main`)
**Status sesi:** selesai — nav mobile tentor kini pakai sidebar drawer (logo sebagai tombol pembuka, teks brand dihapus dari top bar, bottom bar tak disentuh); profil dapat fitur ubah kata sandi; dashboard lebih ringkas.

**Request user:** "fokus ke tentor, terutama mobile view" → tambah sidebar "menu lebih lengkap dan jelas", logo diperbesar & klik → buka sidebar (logo ikut geser), teks 'Nurman Course' di top bar dibuang; tambah fitur update password di `/app/tentor/profil`; dashboard dibuat informatif tapi ringkas, tombol 'Buat Jadwal' & 'Lihat Semua' dihapus; bottom bar jangan disentuh.

**Keputusan (klarifikasi):** logo top bar mobile = tombol pembuka drawer (diperbesar `h-11 w-11`, `translate-x` saat terbuka); drawer menu lengkap 5 menu (pola `admin/layout.tsx`) + Keluar; update password via Supabase client `auth.updateUser({password})` (tanpa endpoint backend baru); bottom bar 5 ikon tetap.

**Dikerjakan:**
- **`frontend/app/app/tentor/layout.tsx`**: import `useEffect/useState`; state `mobileNavOpen` + tutup saat route change & via `Escape`; top bar mobile: hapus teks brand, logo sebagai `<button>` pembuka `aria-expanded` + `translate-x-3` saat terbuka; tambah **sidebar drawer** (backdrop blur + panel `w-72 max-w-[85vw]`, 5 menu desktop + Keluar, `role=dialog / aria-modal`, `max-w`, scroll); bottom bar (`mobileNavLinks` + center Dashboard 3D) **tidak diubah**.
- **`frontend/app/app/tentor/profil/page.tsx`**: status `newPassword/confirmPassword/showPw/updating/pwError/pwSuccess`; handler `handleUpdatePassword` (min 6, cocok konfirmasi, `createClient().auth.updateUser({password})`); section "Ubah Kata Sandi" (2 input + toggle lihat/sembunyikan, notice sukses emerald / error red, tombol Simpan Kata Sandi).
- **`frontend/app/app/tentor/dashboard/page.tsx`**: header "Agenda Mengajar Privat" — hapus aksi kanan (Link "Buat Jadwal" dan "Lihat Semua"); struktur `border-b` sederhana.

**Verifikasi:** `npx tsc --noEmit` (frontend) exit 0; `npx next build` compiled successful + 35 routes OK.

**Residual:** QA visual browser mobile (`/app/tentor/*`): hamburger/logo buka drawer, logo geser, tab menu highlight, Keluar konfirmasi; ubah kata sandi perlu tes live dengan session tentor aktif (keharusan login ulang di sesi Supabase berikut); dashboard tampilan tanpa 2 tombol header terlihat rapi di mobile/desktop.

---

### 2026-08-12 — Login page pakai logo Nurman Course (lingkaran gelap, non-klik)

**Fase:** AD-HOC / portal polish (branch `main`)
**Status sesi:** selesai — brand header di `/login` (sebelumnya kotak `GraduationCap`) diganti logo lingkaran ala landing, non-klik.

**Request user:** "halaman login juga, kasih logo kita, dan dibuat ga bisa di klik kayak di /landing."

**Keputusan (klarifikasi):** varian **Nav (gelap)** — lingkaran `bg-[#2e4b7a]` + `border-2 border-white/80` + shadow biru, konsisten dgn logo header tentor/wali; non-klik (div dekoratif, tanpa link).

**Dikerjakan:**
- **Frontend** `frontend/app/login/page.tsx`: tambah `import Image from "next/image"`; hapus `GraduationCap` dari import lucide (tak terpakai lagi); brand header baris ~118-120 → `div` `pointer-events-none aria-hidden h-16 w-16 rounded-full border-2 border-white/80 bg-[#2e4b7a] shadow-[0_8px_18px_rgba(74,112,169,0.5)]` berisi `Image /Nlogo.png h-14 w-14 rounded-full object-cover`; judul "Selamat Datang Kembali" + deskripsi tetap.

**Verifikasi:** `npx tsc --noEmit` frontend 0 error; (visual /login perlu cek manual).

**Residual:** QA visual manual `/login` — logo rapi, tidak ada aksi klik/navigasi.

---

### 2026-08-12 — Header tentor & wali pakai logo Nurman Course gaya landing (lingkaran gelap, diperkecil)

**Fase:** AD-HOC / portal polish (branch `main`)
**Status sesi:** selesai — brand di header portal tentor dan wali ("Parent Portal") kini logo lingkaran ala landing, diperkecil, + teks.

**Request user:** "logo Nurman Course udh punya, tolong dipake di header tentor dan murid" → lanjutan: "logonya dibuat kayak di halaman /landing, tapi diperkecil."

**Keputusan (klarifikasi):** (1) gaya **Logo + teks**; (2) varian **Nav (gelap)** — lingkaran `bg-[#2e4b7a]` + `border-2 border-white/80` + shadow biru (`LandingNav.tsx`), diperkecil untuk header portal.

**Dikerjakan:**
- **Tentor** `frontend/app/app/tentor/layout.tsx`: tambah import `Image`; sidebar desktop → `flex items-center gap-3` wrapper lingkaran `h-11 w-11` (`Image h-10 w-10 rounded-full`) + `<h1>` teks; mobile top bar box `GraduationCap` diganti `span` lingkaran `h-8 w-8` (`Image h-7 w-7`) + teks, badge "Tentor" tetap; hapus import `GraduationCap`.
- **Wali/murid** `frontend/app/app/(wali)/layout.tsx`: tambah import `Image`; sidebar desktop → wrapper lingkaran `h-11 w-11` + `<h1>`; mobile top bar (sebelumnya teks-saja) → `span` lingkaran `h-8 w-8` + teks; `GraduationCap` tetap (nav "Program Anak").

**Verifikasi:** `npx tsc --noEmit` frontend 0 error; (visual desktop+mobile perlu cek manual).

**Residual:** QA visual manual `/app/tentor/jadwal` & `/app` memastikan lingkaran gelap rapi di sidebar & mobile bar.

---

### 2026-08-12 — Admin: hapus permanent Enrollment + tombol Hapus di `/app/admin/enrollment`

**Fase:** AD-HOC / admin polish (branch `main`)
**Status sesi:** selesai — admin sekarang bisa menghapus enrollment beserta tagihan terkait secara permanen.

**Request user:** "admin juga bisa hapus enrollment" (dengan gambar; konfirmasi = **hapus permanen**, bukan sekadar set status Dibatalkan).

**Keputusan (klarifikasi):** hapus permanen (kontra hapus-lunak): `DELETE /api/admin/enrollments/:id` menghapus enrollment + cascade Invoice terkait; Session tidak terpengaruh karena di schema tidak berelasi ke Enrollment (hanya ke murid+program).

**Dikerjakan:**
- **Backend** `backend/src/index.ts`: tambah `app.delete('/api/admin/enrollments/:id', requireAuth, requireAdmin, ...)` setelah blok PATCH enrollment — cek keberadaan (404 bila null), `prisma.enrollment.delete`, respon `{ data:{id}, deleted:true, cascaded:{ invoices } }`; tangani P2025 → 404.
- **Frontend** `frontend/app/app/admin/enrollment/page.tsx`: import `Trash2` + `ConfirmDialog`; state `deleteTarget`/`deleting`; handler `confirmDelete()` (`DELETE /api/admin/enrollments/${id}` → notice "berhasil dihapus permanen" + reload); tombol merah **Hapus** di tiap kartu; baris aksi `flex-shrink-0 gap-2` → ditambah `flex-wrap` (anti-overflow mobile, lanjut pola sesi 11-08); `ConfirmDialog` peringatan jumlah tagihan (`_count.invoices`) yang ikut terhapus.

**Verifikasi:** `npx tsc --noEmit` backend & frontend exit 0; backend direstart (PID baru port 5000); smoke test `DELETE /api/admin/enrollments/test-123` → 401 (auth required, rute terdaftar, bukan 404).

**Residual:** belum test end-to-end hapus enrollment nyata via browser (perlu login admin + data uji); hapus enrollment tidak menghapus Session/laporan (by-design, karena tak terhubung di schema).

---

### 2026-08-11 — Admin murid mobile rapi (fix overflow) + fitur Reset PW akun Wali

**Fase:** AD-HOC / admin polish (branch `main`)
**Status sesi:** selesai — memperbaiki layout mobile `/app/admin/murid` yang overflow horizontal, dan menambah reset password akun Wali untuk murid (mengikuti pola tentor).

**Request user:** "tampilan mobile jadi keluar halaman, dirapihin; kalo bisa ada fitur reset password juga kayak tentor."

**Akar masalah overflow:** baris tombol aksi di `admin/murid/page.tsx` sebelumnya `flex shrink-0 gap-2` dengan 4 tombol (Detail, Edit, Nonaktifkan, Hapus) → lebih lebar dari kartu di layar sempit → halaman overflow. Halaman tentor sudah aman (`flex-wrap`).

**Dikerjakan (hanya `frontend/app/app/admin/murid/page.tsx`):**
- Ubah baris aksi → `flex flex-wrap gap-2` (tombol membungkus di mobile), konsisten dgn tentor.
- **Reset Password akun Wali** (murid login sbg parent): `handleResetPassword` (prompt default `12345678`, `POST /api/admin/users/${murid.wali.id}/reset-password`, guard bila wali kosong), state `lastTempPassword`/`copied`, `handleCopy`, tombol **"Reset PW"** (amber `KeyRound`) di tiap kartu, banner sky berisi password temp + tombol **Salin** (Copy/Check). Import `KeyRound`/`Copy`/`Check`.

**Verifikasi:** `npx tsc --noEmit` frontend 0 error; `npx next build` compiled.

**Residual:** reset PW memakai endpoint generik yang sudah ada (tak nilai baru di backend); jika satu Wali memiliki >1 murid, reset PW mempengaruhi akun Wali tsb (shared); hanya halaman `admin/murid` yang diubah.

---

### 2026-08-11 — Admin: hapus permanen Murid & Tentor + modal konfirmasi (soft vs hard)

**Fase:** AD-HOC / admin management (branch `main`)
**Status sesi:** selesai — admin kini bisa **menghapus permanen** data Murid & Tentor (bukan hanya nonaktifkan), lengkap dengan **modal konfirmasi**.

**Request user:** "admin bisa hapus data murid dan mentor, walau bisa nonaktifin, admin juga bisa hapus data apapun, dengan modal konfirmasi." Keputusan lanjutan user: **hapus permanen (cascade)** + **hapus juga user Supabase Auth** agar tak bisa login. Scope ronde ini: **Murid + Tentor** (modul lain task terpisah).

**Keputusan:** pisahkan 2 perilaku via query param `?force=1`:
- tanpa `force` → **soft** (deactivate `active:false`).
- `?force=1` → **hard delete** `prisma.<model>.delete` (cascade).

**Backend — `backend/src/index.ts`:**
- `DELETE /api/admin/murids/:id` → soft selalu (perbaiki perilaku lama yg menghapus bila tak ada relasi); `?force=1` → `prisma.murid.delete` cascade.
- `DELETE /api/admin/users/:id` → soft (deactivate); `?force=1` → `prisma.user.delete` cascade + **`supabaseAdmin.auth.admin.deleteUser(id)`** agar akun login mati. Guard tetap: tidak bisa hapus/nonaktif diri sendiri atau akun admin (`403`). Id pola `Prisma.user.id` = Supabase auth id.

**Frontend:**
- `ConfirmDialog.tsx`: tambah props opsional `icon?: ReactNode` (default LogOut) — backward-compatible; modal hapus pakai ikon `Trash2`.
- `admin/murid/page.tsx`: ganti `window.confirm` → `ConfirmDialog`; tombol **"Nonaktifkan"** (orange, soft) + tombol **"Hapus"** (Trash2, merah → `DELETE ?force=1`) dengan modal warning jumlah `_count.enrollments`/`_count.sessions` yg ikut cascade.
- `admin/tentor/page.tsx`: sama — tombol **"Nonaktif"** + **"Hapus"** (warning `_count.sessions` ikut hapus + akun Supabase dihapus).

**Verifikasi:** `npx tsc --noEmit` backend & frontend 0 error; `npx next build` compiled; tidak ada sisa `window.confirm` di kedua halaman.

**Residual:** cascade permanen menghapus riwayat berelasi (sudah disetujui user); tidak ada backend server aktif saat verifikasi live (restart `npm run dev --workspace=backend` dibutuhkan setelah edit); modul admin lain (program/enrollment/sesi/tagihan) belum di-coverage hapus permanen.

---

### 2026-08-11 — Admin portal mobile: ganti bottom bar → sidebar drawer (hamburger menu)

**Fase:** AD-HOC / UIUX polish (branch `main`)
**Status sesi:** selesai — navigasi mobile portal admin yang mula-mula penuh (8 item + Portal + Keluar di bottom bar) diganti **sidebar drawer** yang buka/tutup via **hamburger menu**.

**Request user:** "untuk halaman milik admin yg mobile, ubah ga usah ada bottom bar karena terlalu penuh, dibikin sidebar biasa pake burger menu yg bisa nutup dan buka. Apakah mempengaruhi role lain?" — Jawaban: **tidak**, tiap role punya layout terpisah (`admin/layout.tsx`, `tentor/layout.tsx`, `(wali)/layout.tsx`), berubah hanya `/app/admin/*`.

**Dikerjakan (hanya `frontend/app/app/admin/layout.tsx`):**
- Tambah state `mobileNavOpen` + efek tutup saat `pathname` berubah + penutupan via `Escape` (keydown listener saat terbuka).
- Top bar mobile sticky (`md:hidden`): tombol hamburger (`Menu`, `aria-label`/`aria-expanded`) + brand "Nurman Course" + badge "Admin".
- Replace Mobile BottomNavBar (baris lama 203–242) dengan **drawer drawer**: backdrop gelap (klik → tutup) + panel slide dari kiri (`translate-x` transition) berisi seluruh 9 nav (termasuk *Roadmap* yang sebelumnya tak ada di nav mobile) + badge `waitingCount` di Tagihan + "Pilih Portal" + "Keluar" (`askLogout`).
- Ikon lucide `Menu`, `X` ditambah; `mobileNavLinks` di-isi lengkap 9 item.
- Padding konten: `pb-24` → `pb-6` (tidak ada lagi bottom bar yang menutupi konten).
- Aksesibilitas: `role="dialog"`/`aria-modal`, `aria-label` buka/tutup; backdrop & Escape menutup; `print:hidden`.

**Verifikasi:** `npx tsc --noEmit` frontend 0 error; konten tak tertutup bar; drawer tidak overflow (scrollable `overflow-y-auto`); halaman tentor/wali mobile tidak tersentuh.

**Residual:** penutupan saat navigasi substring (`pathname.startsWith`) — admin memakai exact match (`pathname === href`) jadi aman; tidak ada uji visual browser otomatis (manual via `localhost:3000/app/admin`).

---

### 2026-08-11 — Redesign halaman login `/login` (visual + interaktif, tanpa ubah logic)

**Fase:** AD-HOC / UIUX polish (branch `main`)
**Status sesi:** selesai — tampilan halaman login dipercantik supaya lebih clean & interaktif; **logika auth diam (identik)**.

**Request user:** "perbaiki design login page biar lebih clean dan interaktif ... tanpa ngubah logic". Diproses via skill `ui-ux-pro-max`.

**Design system (skill):** Minimal Single Column + Trust & Authority; warna brand `#4a70a9`/`#3a5a99` dipertahankan; aksesibilitas 4.5:1, focus ring, loading feedback.

**Dikerjakan (semua visual-only, logic `handleAuth`/`resolve-phone`/signUp/signIn identik):**
- Header brand (logo GraduationCap dalam gradient + judul/tagline) menggantikan `PageHeader` yang bernada in-app.
- Latar gradien lembut + 3 blobs blur dekoratif (`login-orb` drift) — `motion-reduce`-safe.
- Entrance halus pada kartu (`login-entrance` fade-up) — `motion-reduce`-safe.
- Input: ikon lucide (Mail/User/Phone/Lock), label dengan `htmlFor`, focus ring `ring-4 ring-[#4a70a9]/15`, `autoComplete` benar.
- Password: toggle **tampil/sembunyikan** (Eye/EyeOff) + `aria-label`.
- Alert error/sukses pakai ikon (AlertCircle/CheckCircle2) + `role` semantik.
- Tombol: spinner `Loader2 animate-spin` saat loading, panah `ArrowRight` bergeser saat hover (`group-hover`).
- Footer trust note (ShieldCheck) + link toggle Masuk/Daftar.
- Helper dinamis email/WA (tindak lanjut request user): guide di bawah input login berubah sesuai isi — kosong (tidak ada teks), diawali angka → "Format: 62xxxxxxxxxxx ... bukan 08...", selain itu → "Gunakan format email yang valid"; presentasi saja, logic `handleAuth`/`resolve-phone` tetap identik.

**Perbaikan komponen:** `components/ui/Button.tsx` baseStyles + `inline-flex items-center justify-center gap-2` (agar ikon+teks di tombol rata tengah — dulu `justify-center/gap-2` tak berefek, lihat catatan TENTOR-12). Berlaku global, aman.

**Verifikasi:** `npx tsc --noEmit` frontend 0 error; `npx next build` compiled (0 error) — terminal port `localhost:3000/login`.

**Residual:** tidak ada perubahan behavior/state; eslint/prettier tidak dijalankan (kemungkinan indentation beda di `prettier`).

**Tindak lanjut (final, 2026-08-11 — request user "kamu nulisnya di password" + "gas"):**
- **Fix posisi**: helper dinamis sempat nyasar ke blok Password (redesign awal); dipindah ke blok Email, Password kembali ke catatan "Password default 12345678".
- **Login-only**: halaman daftar dihapus total — buang state `isSignUp`/`name`/`phone`, cabang `signUp` di `handleAuth`, field Nama & Nomor WhatsApp, toggle footer Masuk/Daftar, `successMsg` (tak terpakai), import `User`/`Phone`/`ShieldCheck`. `handleAuth` kini alur login murni (resolve-phone → `signInWithPassword` → redirect role-aware), identik dengan cabang login sebelumnya.
- **Placeholder email dikosongkan**; **subtitle hitam** (`text-black`); **footer kredit resmi** "© {tahun} Nurman Course" (`new Date().getFullYear()`) menggantikan trust-note.
- **Verifikasi final:** `npx tsc --noEmit` frontend 0 error; dev `localhost:3000/login`.

**Keputusan:** akun baru dibuat via Admin Portal (bukan self-register) — selaras alur funnel & migrasi role yang sudah ada; tidak ada halaman daftar publik.

---

### 2026-08-11 — Fix Prisma client stale pasca-revert (backend dev kembali berjalan)

**Fase:** AD-HOC / pasca-revert (branch `main`)
**Status sesi:** selesai — setelah revert migrasi, `npm run dev --workspace=backend` gagal (`ts-node src/index.ts`) karena error tipe Prisma.

**Request user:** "update todo" + gas perbaikan setelah diagnosa (plan mode) menemukan akar masalah.

**Akar masalah:** `git restore` mengembalikan `schema.prisma` + source tapi **tidak** me-regenerate Prisma client. Client yang terpasang di `node_modules` masih dari sesi migrasi (field `ProgressReport.achievements/masteredMaterials/weakMaterials` bertipe `String[]` di skema hasil revert, tapi client lama `string`; `StringFilter.mode` juga tak eksis di client usang). Error: `string[] not assignable to string` di `index.ts:486–488` & `seed.ts:309–313`, plus `mode` di `index.ts:948`.

**Dikerjakan:**
- `npx prisma generate` (backend) → client v5.22.0 dihasilkan dari skema hasil revert.
- Verifikasi `npx tsc --noEmit` backend = **0 error**; frontend = **0 error**.
- Boot `npm run dev --workspace=backend` → log: "Successfully connected to database via Prisma." + "Express API Server is running on port 5000" (backend hidup di port 5000).
- Sync docs: entri PROGRESS ini + 1 baris Meta di `tasks/todo.md`.

**Verifikasi:** tsc backend & frontend exit 0; log boot backend konfirmasi koneksi DB Prisma + server port 5000.

**Residual:** proses `next dev` user (PID 32836/17928) & codegraph MCP (PID 31336) dibiarkan (milik user). Tidak ada perubahan schema/data; tidak perlu `prisma db push` (DB sudah sesuai commit HEAD).

---

### 2026-08-11 — Migrasi Supabase → MySQL dibatalkan, di-revert ke kondisi sebelum migrasi

**Fase:** AD-HOC / undo (branch `main`)
**Status sesi:** selesai — keputusan migrasi database Supabase → MySQL + auth self-hosted **dibatalkan oleh user**. Semua perubahan migrasi yang belum dikomit di-revert (targeted), working tree kembali ke kondisi sebelum sesi migrasi.

**Request user:** "balik lagi ke awal, ambil commit main yg terakhir, karena ga jadi pindah ke mysql, salah langkah."

**Keputusan (klarifikasi):** (1) revert **targeted** — membatalkan migrasi saja tanpa menghapus kerja uncommitted yang lebih dulu (disiplin dok `AGENTS.md` & `docs/PROGRESS.md` 07-29→08-11); BUKAN `git reset --hard`. (2) Commit target = `fb9bc7a` (HEAD main sudah di sana; pertluasan migrasi semua belum dikomit).

**Dikerjakan:**
- **`git restore`** (ke HEAD `fb9bc7a`) file migrasi: `backend/.env.example`, `backend/package.json`, `backend/prisma/schema.prisma` (balik `provider="postgresql"` + tipe asli), `backend/prisma/seed.ts` (balik `getOrCreateSupabaseUser`), `backend/src/index.ts` (balik verifikasi JWT Supabase), `backend/src/middleware/auth.ts`, `package-lock.json`, `tasks/plan.md` (kembali ADM Plan).
- **Hapus** file baru `backend/src/auth.ts`.
- **Pulihkan manual** file gitignored ke nilai Supabase asli: `backend/.env` (`DATABASE_URL`/`DIRECT_URL` + `SUPABASE_*`), `frontend/.env.local` (`NEXT_PUBLIC_SUPABASE_*` + `SUPABASE_SERVICE_ROLE_KEY`), `frontend/.env.example`.
- **`tasks/todo.md`** kembali ke pra-migrasi dengan re-add 3 baris Meta 08-11.
- **Drop DB MySQL** `nurman_course` (dibuat sementara di Laragon) + `npm install` (prune `bcryptjs`/`jose` dari `node_modules`).

**Verifikasi:** `git diff HEAD --stat` = hanya `AGENTS.md`, `docs/PROGRESS.md`, `tasks/todo.md` (perubahan pra-migrasi yang dipertahankan, ±0 untuk kode); grep backend bebas `bcryptjs/jose/passwordHash/JWT_SECRET/mysql`; `schema.prisma` = `provider "postgresql"`.

**Residual:** tidak ada untuk migrasi (batal). Arsitektur tetap **Supabase (Postgres + Auth)** seperti semula; jika suatu saat mau pindah DB, sebaiknya bikin task + branch terpisah dan komit baseline dulu.

---

### 2026-08-11 — Install Agent Skills Supabase (global) + OAuth MCP Supabase sukses

**Fase:** Meta / tooling (di luar git repo — skill ~/.agents, token ~/.local/share/opencode)
**Status sesi:** selesai — skill resmi Supabase terpasang ke global `~/.agents/skills`, dan OAuth MCP Supabase berhasil diautentikasi (login browser).

**Request user:** jalankan instruksi config MCP Supabase: (1) set MCP, (2) `npx skills add supabase/agent-skills`, (3) `opencode mcp auth supabase`.

**Keputusan (klarifikasi):** MCP supabase (remote `mcp.supabase.com`) sudah ada di config aktif sejak sesi sebelumnya → tidak perlu ubah config; cukup instal skill + login OAuth.

**Dikerjakan:**
- **Agent Skills** `npx skills add supabase/agent-skills --global --yes`: terpasang `~\.agents\skills\supabase` & `~\.agents\skills\supabase-postgres-best-practices` (universal: OpenCode, dll; symlink ke Claude Code/Hermes). "Failed 2" hanya untuk target PromptScript (tidak dukung global) — bukan kegagalan.
- **OAuth** `opencode mcp auth supabase`: browser authorize sukses → output "Authentication successful!". Token akses di-refresh; `refreshToken` di `mcp-auth.json` long-lived (auto-refresh saat connect). Catatan: file `mcp-auth.json`/SQLite `.local/share/opencode` tidak berubah LastWrite di run ini — token persisten biasanya ditulis saat next connect MCP; tidak ada aksi tambahan.

**Verifikasi:** browser OAuth sukses; skill terlihat sebagai `supabase` & `supabase-postgres-best-practices` di available skills.

**Residual:** restart/start ulang opencode agar MCP supabase (dan codegraph dari sesi sebelumnya) termuat; jika masih prompt auth di sesi baru, refresh otomatis via refreshToken/hanya login 1× lagi.

---

### 2026-08-11 — Fix tooling opencode: register MCP codegraph di config aktif + diagnosa auth Supabase MCP

**Fase:** Meta / tooling (di luar git repo — `D:\AI Agent\opencode-data\opencode.json`)
**Status sesi:** selesai — MCP codegraph ter-register di config aktif; penyebab "supabase butuh auth" dijelaskan (OAuth token expired) tanpa ubah file.

**Request user:** (1) cari tahu kenapa Supabase MCP butuh auth; (2) MCP codegraph sudah tidak ada di session.

**Keputusan (klarifikasi):** (1) Supabase MCP = hosted remote (`mcp.supabase.com`) yang butuh OAuth akun Supabase (Management API) → login ulang via browser saat connect; (2) tambah `mcp.codegraph` (local) ke config aktif.

**Dikerjakan:**
- **Diagnosa** `D:\AI Agent\opencode-data\opencode.json` (aktif via `OPENCODE_CONFIG`): blok `mcp` berisi `supabase` (remote, OAuth) + `stitch` — **tanpa codegraph**. Config `C:\Users\Kiki\.config\opencode\opencode.jsonc` yang punya codegraph bukan yang dimuat → tool `codegraph_explore` tak ter-register.
- **Supabase auth:** token OAuth di `mcp-auth.json` expired (`expiresAt 2026-08-11 13:51 UTC`, sekarang 14:35) → opencode minta authorize lagi. Tanpa perubahan file.
- **`opencode.json`:** tambah blok `mcp.codegraph` (`type: local`, `command: ["codegraph","serve","--mcp"]`, `enabled: true` → didapati `codegraph.cmd` terpasang & `.codegraph/` ada).

**Verifikasi:** `ConvertFrom-Json` config sukses (JSON VALID) → `mcp keys: supabase, stitch, codegraph`.

**Residual:** perlu restart/start ulang opencode agar MCP codegraph termuat; login OAuth Supabase dilakukan user via browser sekali. `opencode.jsonc` duplikat (Kiki) yang berisi codegraph dibiarkan (tidak dihapus) — bisa dirapikan lain waktu.

---

### 2026-08-11 — Perkuat disiplin dokumentasi: Step 0 wajib baca docs + template PROGRESS + peran vault

**Fase:** Meta / dokumentasi & proses (docs only)
**Status sesi:** selesai — disiplin baca & update docs dipertegas di `AGENTS.md`, template log ditambahkan di `docs/PROGRESS.md`, dan peran vault diperjelas (hasil akhir, bukan realtime). Vault disync agar ADM-4.2 ditandai done.

**Request user:** (1) opencode di proyek ini wajib baca dokumentasi dan membuat/menjaga dokumentasi agar tetap ter-tracking; (2) vault hanya hasil akhir/ringkasan harian, dokumen yang benar ada di proyek ini.

**Keputusan (klarifikasi):** (1) enforcement lewat perkuat aturan di `AGENTS.md`/`PROGRESS.md` (bukan command baru / subagent / file baru); (2) cukup pakai dokumen yang sudah ada (tidak buat API_MAP/CHANGELOG baru); (3) vault dianggap hasil akhir — boleh tertinggal, sync 1×/hari atau saat diminta.

**Dikerjakan:**
- **`AGENTS.md`:** ganti "Urutan baca sebelum eksekusi non-trivial" → **"Step 0 (WAJIB tiap sesi)"** — membaca `tasks/todo.md`, `docs/PROGRESS.md` (entri teratas + tabel Keputusan), `docs/ROADMAP-LMS.md`, dan `AGENTS.md` + kode terkait sebelum aksi apa pun; tegas "tidak boleh coding sebelum Step 0 selesai".
- **`AGENTS.md`:** "Setelah setiap sesi" → **"Definition of Done — sync docs"** — sesi yang mengubah repo belum selesai sampai PROGRESS (entri di atas, ikut template), todo (centang/tanggal/in_progress), dan Keputusan (bila arsitektur) diperbarui; verifikasi docs bagian dari selesai.
- **`AGENTS.md`:** tambah blok **peran vault** — vault hanya hasil akhir/ringkasan harian, boleh tertinggal, jangan over-sync, tidak menggantikan repo sebagai source of truth eksekusi.
- **`docs/PROGRESS.md`:** tambah blok atas — header `# Progress Log`, **cara pakai**, **template entri kosong** (Fase/Status/Request/Keputusan/Dikerjakan/Verifikasi/Residual), dan tabel **Keputusan** kosong (rujukan AGENTS "template ada di file" jadi nyata).
- **Vault** `00 - Index.md`, `02 - Rencana Perbaikan.md`, `03 - Roadmap LMS Sederhana.md`: tandai ADM-4.2 = Done; In progress vault dialihkan ke ADM-5.

**Verifikasi:** docs only — tidak ada kode/build/test. Edit dicek langsung dari hasil tool.

**Residual:** tidak ada untuk sesi ini; mulai sesi berikutnya, Step 0 & Definition of Done di `AGENTS.md` berlaku sebagai aturan wajib.

---

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
