# ERD — LMS Nurman Course (Fase 0 - Revisi Role Model)

## 1. Entity & Relationships

### Core Tables

| Table | Fields | Notes |
|---|---|---|
| **`users`** | id, role, name, phone, email, created_at | role: `admin` \| `pengajar` \| `wali` |
| **`murids`** | id, wali_id, name, birth_date, school_level, created_at | wali_id refers to users.id (role=wali) |
| **`programs`** | id, slug, name, description, category, base_price, sessions_per_block, active | sessions_per_block (e.g. 12 or 10) |
| **`roadmap_steps`**| id, program_id, order, title, body_text, level | |
| **`sessions`** | id, program_id, pengajar_id, murid_id, starts_at, ends_at, location, status | status: `scheduled` \| `cancelled` \| `completed` |
| **`material_items`**| id, roadmap_step_id, session_id, title, body_text, order | |
| **`enrollments`** | id, murid_id, program_id, status, started_at | status: `active` \| `completed` \| `cancelled` |
| **`invoices`** | id, enrollment_id, amount, status, due_at, paid_at, note | status: `unpaid` \| `waiting` \| `paid` |
| **`daily_reports`** | id, session_id, murid_id, date, start_time, end_time, activity, notes | Diisi pengajar per sesi |
| **`progress_reports`**| id, murid_id, program_id, block_number, achievements, mastered_materials, weak_materials, notes, created_at | Diisi pengajar per blok (N sesi) |
| **`progresses`** | id, murid_id, roadmap_step_id, status, updated_at | Lacak langkah belajar murid |

### Relationships

- `users` (1) ↔ `murids` (1:N) (Hubungan Wali ke Murid/Anak)
- `users` (1) ↔ `sessions` (1:N) (Penugasan Pengajar ke Sesi)
- `murids` (1) ↔ `enrollments` (1:N)
- `murids` (1) ↔ `sessions` (1:N)
- `murids` (1) ↔ `daily_reports` (1:N)
- `murids` (1) ↔ `progress_reports` (1:N)
- `murids` (1) ↔ `progresses` (1:N)
- `programs` (1) ↔ `roadmap_steps` (1:N)
- `programs` (1) ↔ `sessions` (1:N)
- `programs` (1) ↔ `progress_reports` (1:N)
- `roadmap_steps` (1) ↔ `material_items` (1:N)
- `roadmap_steps` (1) ↔ `progresses` (1:N)
- `sessions` (1) ↔ `material_items` (1:N)
- `sessions` (1) ↔ `daily_reports` (1:1)
- `enrollments` (1) ↔ `invoices` (1:N)

---

## 2. Definisi Kolom Kustom Baru

### `daily_reports`
- **`activity`**: Text (Materi yang dibahas atau kegiatan yang dilakukan pada hari itu).
- **`notes`**: Text (Catatan khusus pengajar mengenai murid pada sesi tersebut).

### `progress_reports`
- **`block_number`**: Int (Nomor blok evaluasi belajar, mis. Blok 1 untuk sesi 1-12, Blok 2 untuk 13-24).
- **`achievements`**: Text (Capaian belajar/perkembangan anak selama 1 blok).
- **`mastered_materials`**: Text (Materi yang sudah dikuasai dengan baik).
- **`weak_materials`**: Text (Materi yang masih perlu pengulangan/belum dikuasai).
- **`notes`**: Text (Saran/catatan dari pengajar untuk wali murid).
