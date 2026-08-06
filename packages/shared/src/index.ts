import { z } from "zod";

// --- User & Role Types ---
export type UserRole = "admin" | "tentor" | "wali";

export interface User {
  id: string;
  role: UserRole;
  name: string;
  phone: string;
  email?: string | null;
  createdAt: Date;
}

// --- Invoice Status ---
export type InvoiceStatus = "unpaid" | "waiting" | "paid";

// --- Session Status ---
export type SessionStatus = "scheduled" | "cancelled" | "completed";

export type ProgramCategory = "materi" | "jenjang" | "calistung";
export type EnrollmentStatus = "active" | "completed" | "cancelled";

export interface AdminListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ApiErrorPayload {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export const userRoleSchema = z.enum(["admin", "tentor", "wali"]);

const manageableRoleSchema = z.enum(["tentor", "wali"]);

export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return `62${digits}`;
}

const phoneSchema = z
  .string()
  .trim()
  .transform((val) => normalizePhone(val))
  .refine((val) => /^628\d{7,13}$/.test(val), {
    message: "Nomor hape harus berformat nomor Indonesia yang valid (contoh: 0812... atau 62812...)",
  });

export const createUserSchema = z.object({
  role: manageableRoleSchema,
  name: z.string().trim().min(1, "Nama wajib diisi").max(150),
  phone: phoneSchema,
  email: z.string().trim().email("Email tidak valid").max(200).optional().nullable(),
  address: z.string().trim().max(500).optional().nullable(),
  photoPath: z.string().trim().max(2_000_000).optional().nullable(),
  password: z.string().min(6, "Password minimal 6 karakter").max(200).optional(),
});

export const updateUserSchema = z
  .object({
    role: manageableRoleSchema,
    name: z.string().trim().min(1, "Nama wajib diisi").max(150),
    phone: phoneSchema,
    email: z.string().trim().email("Email tidak valid").max(200).optional().nullable(),
    address: z.string().trim().max(500).optional().nullable(),
    photoPath: z.string().trim().max(2_000_000).optional().nullable(),
  })
  .partial();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const createMuridSchema = z.object({
  name: z.string().trim().min(1, "Nama murid wajib diisi").max(150),
  birthDate: z.string().trim().optional().nullable(),
  schoolLevel: z.string().trim().min(1, "Kelas wajib diisi").max(100),
  address: z.string().trim().min(1, "Alamat wajib diisi").max(500),
  registeredAt: z.string().trim().min(1, "Tanggal daftar wajib diisi"),
  active: z.boolean().default(true),
  waliName: z.string().trim().min(1, "Nama wali wajib diisi").max(150),
  waliPhone: phoneSchema,
  waliEmail: z.string().trim().email("Email wali tidak valid").max(200).optional().nullable(),
  photoPath: z.string().trim().max(2_000_000).optional().nullable(),
});

export const updateMuridSchema = z.object({
  name: z.string().trim().min(1, "Nama murid wajib diisi").max(150),
  birthDate: z.string().trim().optional().nullable(),
  schoolLevel: z.string().trim().min(1, "Kelas wajib diisi").max(100),
  address: z.string().trim().min(1, "Alamat wajib diisi").max(500),
  registeredAt: z.string().trim().min(1, "Tanggal daftar wajib diisi"),
  active: z.boolean(),
  waliName: z.string().trim().min(1, "Nama wali wajib diisi").max(150),
  waliPhone: phoneSchema,
  waliEmail: z.string().trim().email("Email wali tidak valid").max(200).optional().nullable(),
  photoPath: z.string().trim().max(2_000_000).optional().nullable(),
}).partial();

export type CreateMuridInput = z.infer<typeof createMuridSchema>;
export type UpdateMuridInput = z.infer<typeof updateMuridSchema>;

export const enrollmentStatusSchema = z.enum(["active", "completed", "cancelled"]);

export const createEnrollmentSchema = z.object({
  muridId: z.string().trim().min(1, "Murid wajib dipilih"),
  programId: z.string().trim().min(1, "Program wajib dipilih"),
  startedAt: z.string().trim().optional().nullable(),
  tentorId: z.string().trim().optional().nullable(),
});

export const updateEnrollmentSchema = z
  .object({
    muridId: z.string().trim().min(1, "Murid wajib dipilih"),
    programId: z.string().trim().min(1, "Program wajib dipilih"),
    status: enrollmentStatusSchema,
    startedAt: z.string().trim().optional().nullable(),
    tentorId: z.string().trim().optional().nullable(),
  })
  .partial();

export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;
export type UpdateEnrollmentInput = z.infer<typeof updateEnrollmentSchema>;

export const invoiceStatusSchema = z.enum(["unpaid", "waiting", "paid"]);

export const createInvoiceSchema = z.object({
  enrollmentId: z.string().trim().min(1, "Enrollment wajib dipilih"),
  amount: z.number().finite().positive("Nominal harus lebih dari 0"),
  dueAt: z.string().trim().min(1, "Jatuh tempo wajib diisi"),
  note: z.string().trim().max(1000, "Catatan maksimal 1000 karakter").optional().nullable(),
});

export const updateInvoiceSchema = z
  .object({
    amount: z.number().finite().positive("Nominal harus lebih dari 0"),
    dueAt: z.string().trim().min(1, "Jatuh tempo wajib diisi"),
    note: z.string().trim().max(1000, "Catatan maksimal 1000 karakter").optional().nullable(),
  })
  .partial();

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;

export const submitPaymentSchema = z.object({
  amount: z.number().finite().positive("Nominal pembayaran harus lebih dari 0").optional(),
  proofBase64: z.string().trim().min(1, "Bukti pembayaran wajib diunggah"),
  proofName: z.string().trim().max(255, "Nama file maksimal 255 karakter").optional().default(""),
  note: z.string().trim().max(500, "Catatan maksimal 500 karakter").optional().nullable(),
});

export type SubmitPaymentInput = z.infer<typeof submitPaymentSchema>;

export const createPrepaymentSchema = z.object({
  muridId: z.string().trim().min(1, "Murid wajib dipilih"),
  amount: z.number().finite().positive("Nominal pembayaran harus lebih dari 0"),
  proofBase64: z.string().trim().min(1, "Bukti pembayaran wajib diunggah"),
  proofName: z.string().trim().max(255, "Nama file maksimal 255 karakter").optional().default(""),
  note: z.string().trim().max(500, "Catatan maksimal 500 karakter").optional().nullable(),
});

export type CreatePrepaymentInput = z.infer<typeof createPrepaymentSchema>;

export const createPaymentAccountSchema = z.object({
  bankName: z.string().trim().min(1, "Nama bank wajib diisi").max(100),
  accountNumber: z.string().trim().min(3, "Nomor rekening minimal 3 karakter").max(50),
  accountName: z.string().trim().min(1, "Nama pemilik wajib diisi").max(150),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  note: z.string().trim().max(500, "Catatan maksimal 500 karakter").optional().nullable(),
});

export const updatePaymentAccountSchema = createPaymentAccountSchema.partial();

export type CreatePaymentAccountInput = z.infer<typeof createPaymentAccountSchema>;
export type UpdatePaymentAccountInput = z.infer<typeof updatePaymentAccountSchema>;

export const programCategorySchema = z.enum(["materi", "jenjang", "calistung"]);

export const createProgramSchema = z.object({
  slug: z.string().trim().min(1, "Slug wajib diisi").max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung"),
  name: z.string().trim().min(1, "Nama program wajib diisi").max(150),
  description: z.string().trim().min(1, "Deskripsi wajib diisi").max(5000),
  category: programCategorySchema,
  basePrice: z.number().finite().nonnegative().nullable().optional(),
  sessionsPerBlock: z.number().int().positive().max(100).default(12),
  active: z.boolean().default(true),
  hasRoadmap: z.boolean().default(false),
});

export const updateProgramSchema = createProgramSchema.partial();

export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;

// MaterialItem (materi teks per langkah roadmap)
export const createMaterialItemSchema = z.object({
  roadmapStepId: z.string().trim().min(1, "Roadmap step wajib dipilih"),
  order: z.number().int().nonnegative("Order harus bilangan non-negatif").optional(),
  title: z.string().trim().min(1, "Judul wajib diisi").max(150, "Judul maksimal 150 karakter"),
  bodyText: z.string().trim().min(1, "Konten wajib diisi").max(10000, "Konten maksimal 10000 karakter"),
});

export const updateMaterialItemSchema = createMaterialItemSchema.omit({ roadmapStepId: true }).partial();

export type CreateMaterialItemInput = z.infer<typeof createMaterialItemSchema>;
export type UpdateMaterialItemInput = z.infer<typeof updateMaterialItemSchema>;

// --- Zod Input Validation Schemas ---

// Laporan Harian (Daily Report)
export const dailyReportSchema = z.object({
  activity: z.string().min(3, "Materi/kegiatan minimal 3 karakter"),
  notes: z.string().optional().default(""),
});

export type DailyReportInput = z.infer<typeof dailyReportSchema>;

// Laporan Perkembangan (Progress Report)
export const progressReportSchema = z.object({
  achievements: z.array(z.string().min(3, "Capaian minimal 3 karakter")).min(1, "Minimal harus ada 1 capaian"),
  masteredMaterials: z.array(z.string().min(3, "Materi dikuasai minimal 3 karakter")).min(1, "Minimal harus ada 1 materi dikuasai"),
  weakMaterials: z.array(z.string().min(3, "Materi belum dikuasai minimal 3 karakter")).min(1, "Minimal harus ada 1 materi belum dikuasai"),
  notes: z.string().optional().default(""),
});

export type ProgressReportInput = z.infer<typeof progressReportSchema>;

export const createTentorSessionSchema = z.object({
  enrollmentId: z.string().trim().min(1, "Enrollment wajib dipilih"),
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal format YYYY-MM-DD"),
  startTime: z.string().trim().regex(/^\d{2}:\d{2}$/, "Jam mulai format HH:mm"),
  endTime: z.string().trim().regex(/^\d{2}:\d{2}$/, "Jam selesai format HH:mm"),
  location: z.string().trim().max(500, "Lokasi maksimal 500 karakter").optional().nullable(),
});

export const updateTentorSessionSchema = z.object({
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal format YYYY-MM-DD").optional(),
  startTime: z.string().trim().regex(/^\d{2}:\d{2}$/, "Jam mulai format HH:mm").optional(),
  endTime: z.string().trim().regex(/^\d{2}:\d{2}$/, "Jam selesai format HH:mm").optional(),
  location: z.string().trim().max(500, "Lokasi maksimal 500 karakter").optional().nullable(),
  status: z.enum(["scheduled", "cancelled", "completed"]).optional(),
}).refine((d) => {
  if (d.startTime && d.endTime && d.startTime >= d.endTime) return false;
  return true;
}, { message: "Jam selesai harus setelah jam mulai", path: ["endTime"] });

export type CreateTentorSessionInput = z.infer<typeof createTentorSessionSchema>;
export type UpdateTentorSessionInput = z.infer<typeof updateTentorSessionSchema>;

// RoadmapStep
export const createRoadmapStepSchema = z.object({
  programId: z.string().trim().min(1, "Program wajib dipilih"),
  order: z.number().int().nonnegative("Order harus bilangan non-negatif").optional(),
  title: z.string().trim().min(1, "Judul wajib diisi").max(150, "Judul maksimal 150 karakter"),
  bodyText: z.string().trim().min(1, "Konten wajib diisi").max(10000, "Konten maksimal 10000 karakter"),
  level: z.string().trim().max(100, "Level maksimal 100 karakter").optional().nullable(),
});

export const updateRoadmapStepSchema = createRoadmapStepSchema.omit({ programId: true }).partial();

export type CreateRoadmapStepInput = z.infer<typeof createRoadmapStepSchema>;
export type UpdateRoadmapStepInput = z.infer<typeof updateRoadmapStepSchema>;
