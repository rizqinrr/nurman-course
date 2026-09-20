# Implementation Plan: Redesign Dashboard Admin & Member

## Overview
Memperkaya dashboard admin sebagai command center operasional dan member sebagai learning desk, memakai endpoint yang sudah ada. Tidak ada migration, skema baru, atau mutasi DB.

## Architecture Decisions
- Analytics admin memakai endpoint existing: `/api/admin/dashboard`, `/api/admin/tracking`, dan `/api/catalog/lessons` (read count).
- Member dashboard memakai `/api/me/courses` (library) dan `/api/users/me`.
- Tidak ada event tracking baru; tidak ada perubahan Prisma.
- Role/otorisasi tetap server-side; frontend tidak memakai metadata JWT.

## Task List

### Phase 1: Admin command center
- [ ] Perkaya `/app/admin`: measures, agenda hari ini, prioritas kerja, materi paling dibaca, aktivitas terbaru, akses cepat.
- [ ] Standardisasi container dan surface seluruh halaman admin.

### Checkpoint: Admin
- [ ] Typecheck + lint lulus.

### Phase 2: Member dashboard
- [ ] Overview progres + CTA lanjut belajar + kartu kelas.

### Phase 3: Test & verifikasi
- [ ] Test kontrak statis untuk kedua dashboard.
- [ ] Typecheck, lint, build, detector lulus.
- [ ] Sinkronkan `docs/PROGRESS.md` dan `tasks/todo.md`.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| Menambah beban fetch dashboard | Medium | Paralel dengan fallback per-panel; kegagalan satu panel tidak menjatuhkan halaman |
| Eyebrow/kicker di atas heading | Low | Hapus kicker; heading berdiri sendiri |
| Perubahan menyentuh working tree lama | Medium | Scope edit hanya file dashboard/komponen terkait |

## Open Questions
- Tidak ada.
