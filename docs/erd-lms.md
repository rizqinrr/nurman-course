# ERD — LMS Nurman Course (Fase 0 Draft)

## Entity & Relationships

### Core Tables

| Table              | Fields                                      | Notes |
|--------------------|---------------------------------------------|-------|
| `users`            | id, role (admin|peserta), name, phone, email, created_at | |
| `programs`         | id, slug, name, description, category, base_price, active | |
| `roadmap_steps`    | id, program_id, order, title, body_text, level | |
| `sessions`         | id, program_id, starts_at, ends_at, location, capacity, status | |
| `material_items`   | id, roadmap_step_id, session_id, title, body_text, order | |
| `enrollments`      | id, user_id, program_id, status, started_at | |
| `invoices`         | id, enrollment_id, amount, status, due_at, paid_at, note | |

### Relationships

- `users` (1) ↔ `enrollments` (1:N)
- `programs` (1) ↔ `roadmap_steps` (1:N)
- `roadmap_steps` (1) ↔ `material_items` (1:N)
- `programs` (1) ↔ `sessions` (1:N)
- `enrollments` (1) ↔ `invoices` (1:N)

**Notes:**
- Semua field `body_text` disimpan sebagai `text` (Markdown plain).
- `status` enum: `unpaid | waiting | paid`.
- Funnel statis (`data/materials.ts`) **bukan** schema ini — digunakan hanya untuk lead.

**Next step:** Update `tasks/todo.md` dan `docs/PROGRESS.md` + seed data.