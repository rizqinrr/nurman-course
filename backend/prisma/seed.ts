import { PrismaClient } from '../src/generated/client';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const databaseUrl = process.env.DATABASE_URL ?? '';
const seedPassword = process.env.NC_SEED_PASSWORD ?? 'Password123!';
const allowReset = process.env.NC_SEED_ALLOW_REMOTE_RESET === 'true';

if (!supabaseUrl || !supabaseServiceKey) throw new Error('SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diisi.');
if (!databaseUrl.includes('localhost') && !databaseUrl.includes('127.0.0.1') && !allowReset) {
  throw new Error('Seed remote diblokir. Set NC_SEED_ALLOW_REMOTE_RESET=true setelah konfirmasi eksplisit.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { autoRefreshToken: false, persistSession: false } });

type SeedUser = { role: 'admin' | 'tentor' | 'wali'; name: string; email: string; phone: string };
const seedUsers: SeedUser[] = [
  { role: 'admin', name: 'Admin Nurman Course', email: 'admin@nurmancourse.com', phone: '081234567890' },
  ...Array.from({ length: 4 }, (_, index) => ({ role: 'tentor' as const, name: `Tentor Demo ${index + 1}`, email: `tentor${index + 1}@nurmancourse.com`, phone: `08133344455${index}` })),
  ...Array.from({ length: 8 }, (_, index) => ({ role: 'wali' as const, name: `Wali Demo ${index + 1}`, email: `wali${index + 1}@nurmancourse.com`, phone: `0898765432${String(index).padStart(2, '0')}` })),
];

async function clearAuthUsers() {
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (error) throw error;
    if (data.users.length === 0) break;
    for (const user of data.users) {
      const result = await supabase.auth.admin.deleteUser(user.id);
      if (result.error) throw result.error;
    }
  }
}

async function createAuthUser(seed: SeedUser) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: seed.email,
    password: seedPassword,
    email_confirm: true,
    user_metadata: { role: seed.role, name: seed.name, phone: seed.phone },
  });
  if (error || !data.user) throw error ?? new Error(`Gagal membuat ${seed.email}`);
  return data.user.id;
}

async function clearDatabase() {
  await prisma.trackingEvent.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.entitlement.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.section.deleteMany();
  await prisma.course.deleteMany();
  await prisma.dailyReport.deleteMany();
  await prisma.progressReport.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.prepayment.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.materialItem.deleteMany();
  await prisma.session.deleteMany();
  await prisma.roadmapStep.deleteMany();
  await prisma.program.deleteMany();
  await prisma.paymentAccount.deleteMany();
  await prisma.murid.deleteMany();
  await prisma.user.deleteMany();
}

const courseBlueprints = [
  ['lingkungan-coding', 'Lingkungan Coding untuk Pemula', 'Kenali editor, browser, terminal, dan folder project.', 'pemula', 'lingkungan-coding'],
  ['instal-tools-basic', 'Instalasi Tools Basic', 'Siapkan semua tools untuk mulai membuat web.', 'pemula', 'tools'],
  ['html-dari-nol', 'HTML dari Nol', 'Bangun struktur halaman web pertama.', 'pemula', 'html'],
  ['css-dasar', 'CSS Dasar', 'Buat halaman lebih rapi dengan CSS.', 'dasar', 'css'],
  ['javascript-pemula', 'JavaScript Pemula', 'Tambahkan interaksi sederhana ke halaman.', 'dasar', 'javascript'],
  ['git-dan-github', 'Git dan GitHub', 'Simpan riwayat perubahan project dengan aman.', 'dasar', 'tools'],
  ['responsive-web', 'Responsive Web', 'Buat tampilan yang nyaman di HP dan desktop.', 'dasar', 'web'],
  ['aksesibilitas-web', 'Aksesibilitas Web', 'Buat halaman yang mudah digunakan semua orang.', 'dasar', 'web'],
  ['project-landing-page', 'Project Landing Page', 'Gabungkan HTML dan CSS menjadi project nyata.', 'project', 'project'],
  ['project-kartu-profil', 'Project Kartu Profil', 'Latihan layout dan komponen UI sederhana.', 'project', 'project'],
  ['debugging-web', 'Debugging Web', 'Temukan dan perbaiki error dengan langkah terstruktur.', 'dasar', 'tools'],
  ['publikasi-web', 'Publikasi Web', 'Pahami langkah dasar sebelum membagikan project.', 'project', 'web'],
] as const;

const lessonTemplates = [
  ['Kenali konsep utama', 'Pahami istilah dan tujuan materi sebelum praktik.'],
  ['Siapkan project latihan', 'Buat folder dan file latihan dengan struktur sederhana.'],
  ['Ikuti langkah pertama', 'Kerjakan contoh kecil sambil memeriksa hasilnya.'],
  ['Perbaiki kesalahan umum', 'Kenali masalah yang sering terjadi dan cara mengeceknya.'],
  ['Project mini', 'Gabungkan materi menjadi latihan kecil yang bisa ditunjukkan.'],
] as const;

function markdownBody(courseTitle: string, lessonTitle: string, index: number) {
  return `# ${lessonTitle}\n\nLesson ini membahas **${lessonTitle.toLowerCase()}** dalam jalur ${courseTitle}.\n\n## Tujuan belajar\n\n- Memahami konsep utama dengan bahasa sederhana.\n- Mencoba contoh di folder project.\n- Menyelesaikan satu latihan kecil.\n\n## Praktik\n\nBuka code editor, buat file latihan, lalu tulis ulang contoh berikut:\n\n\`\`\`html\n<h1>Latihan lesson ${index + 1}</h1>\n<p>Saya sedang belajar membuat web.</p>\n\`\`\`\n\n## Checklist\n\n- [ ] Saya memahami istilah baru.\n- [ ] Saya mencoba contoh sendiri.\n- [ ] Saya melihat hasilnya di browser.\n\nJangan takut mengulang. Kemampuan coding tumbuh dari latihan kecil yang konsisten.`;
}

async function buildUserMap() {
  const ids = new Map<string, string>();
  for (const seed of seedUsers) {
    const id = await createAuthUser(seed);
    ids.set(seed.email, id);
    await prisma.user.create({ data: { id, role: seed.role, name: seed.name, phone: seed.phone, email: seed.email, active: true } });
  }
  return ids;
}


async function seedOperations(ids: Map<string, string>) {
  const adminId = ids.get(seedUsers[0].email)!;
  const tentorIds = seedUsers.filter((user) => user.role === 'tentor').map((user) => ids.get(user.email)!);
  const waliIds = seedUsers.filter((user) => user.role === 'wali').map((user) => ids.get(user.email)!);
  const murids = [];
  for (let index = 0; index < 16; index += 1) {
    const waliId = waliIds[index % waliIds.length];
    murids.push(await prisma.murid.create({ data: { waliId, name: `Murid Demo ${index + 1}`, birthDate: new Date(2015 + (index % 8), index % 12, 1 + (index % 20)), schoolLevel: index % 2 ? 'SD' : 'SMP', active: true } }));
  }
  const programs = [];
  for (const [slug, name, description, category] of [['komputer-dasar', 'Komputer Dasar', 'Keterampilan komputer untuk pemula.', 'materi'], ['vibe-coding', 'Vibe Coding', 'Belajar coding dengan project nyata.', 'materi'], ['calistung', 'Calistung Anak', 'Membaca, menulis, dan berhitung.', 'calistung'], ['ngaji', 'Ngaji Dasar', 'Membaca Al-Quran dari dasar.', 'calistung'], ['sd-1-3', 'Pendampingan SD 1-3', 'Pendampingan belajar kelas awal.', 'jenjang']]) {
    programs.push(await prisma.program.create({ data: { slug, name, description, category, basePrice: 15000 + programs.length * 5000, sessionsPerBlock: 12, active: true, hasRoadmap: true } }));
  }
  await prisma.paymentAccount.createMany({ data: [
    { bankName: 'Bank Mandiri', accountNumber: '1390022345678', accountName: 'Nurman Course', isActive: true, isDefault: true, note: 'Demo development' },
    { bankName: 'Bank BSI', accountNumber: '7151234567', accountName: 'Nurman Course', isActive: true, isDefault: false, note: 'Demo development' },
  ] });
  for (let index = 0; index < programs.length; index += 1) {
    const program = programs[index];
    const murid = murids[index % murids.length];
    const tentorId = tentorIds[index % tentorIds.length];
    const step = await prisma.roadmapStep.create({ data: { programId: program.id, order: 1, title: `Dasar ${program.name}`, bodyText: `Materi dasar ${program.name}.`, level: 'Pemula' } });
    await prisma.materialItem.create({ data: { roadmapStepId: step.id, title: `Latihan ${program.name}`, bodyText: `Latihan untuk ${program.name}.`, order: 1 } });
    const enrollment = await prisma.enrollment.create({ data: { muridId: murid.id, programId: program.id, tentorId, status: 'active', startedAt: new Date(Date.now() - index * 86400000) } });
    const session = await prisma.session.create({ data: { programId: program.id, tentorId, muridId: murid.id, startsAt: new Date(Date.now() + (index + 1) * 86400000), endsAt: new Date(Date.now() + (index + 1) * 86400000 + 3600000), location: 'Online / Rumah siswa', status: index % 3 === 0 ? 'completed' : 'scheduled' } });
    await prisma.invoice.create({ data: { enrollmentId: enrollment.id, amount: (program.basePrice ?? 15000) * program.sessionsPerBlock, status: index % 3 === 0 ? 'paid' : 'unpaid', dueAt: new Date(Date.now() + 7 * 86400000), paidAt: index % 3 === 0 ? new Date() : null, note: `Invoice demo ${program.name}` } });
    if (session.status === 'completed') await prisma.dailyReport.create({ data: { sessionId: session.id, muridId: murid.id, date: new Date(), startTime: '16:00', endTime: '17:00', activity: `Latihan ${program.name}`, notes: 'Fixture laporan development.' } });
    await prisma.progressReport.create({ data: { muridId: murid.id, programId: program.id, blockNumber: 1, achievements: ['Mengikuti latihan dengan baik'], masteredMaterials: ['Konsep dasar'], weakMaterials: ['Perlu latihan lanjutan'], notes: 'Fixture report development.' } });
    await prisma.progress.create({ data: { muridId: murid.id, roadmapStepId: step.id, status: index % 2 ? 'in_progress' : 'completed' } });
  }
  return { adminId, tentorIds, waliIds, murids, programs };
}

async function seedContent(ids: Map<string, string>) {
  const adminId = ids.get(seedUsers[0].email)!;
  const tentorIds = seedUsers.filter((user) => user.role === 'tentor').map((user) => ids.get(user.email)!);
  const courses = [];
  for (let courseIndex = 0; courseIndex < courseBlueprints.length; courseIndex += 1) {
    const [slug, title, description, level, category] = courseBlueprints[courseIndex];
    const published = courseIndex < 10;
    const paid = courseIndex % 4 === 3;
    const course = await prisma.course.create({ data: { slug, title, description, level, category, accessTier: paid ? 'paid' : 'free', price: paid ? 49000 + courseIndex * 5000 : null, status: published ? 'published' : 'draft', publishedAt: published ? new Date(Date.now() - courseIndex * 86400000) : null, authorId: courseIndex % 3 === 0 ? adminId : tentorIds[courseIndex % tentorIds.length], active: courseIndex !== courseBlueprints.length - 1 } });
    courses.push(course);
    for (let sectionIndex = 0; sectionIndex < 3; sectionIndex += 1) {
      const section = await prisma.section.create({ data: { courseId: course.id, order: sectionIndex + 1, title: `Bagian ${sectionIndex + 1}: ${title}`, level, summary: `Bagian ${sectionIndex + 1} dari ${title}.` } });
      for (let lessonIndex = 0; lessonIndex < lessonTemplates.length; lessonIndex += 1) {
        const [suffix, summary] = lessonTemplates[lessonIndex];
        const visible = lessonIndex === 0 || courseIndex % 3 !== 2;
        const lessonPublished = published && !(courseIndex === 8 && lessonIndex === 4);
        await prisma.lesson.create({ data: { sectionId: section.id, slug: `${slug}-${sectionIndex + 1}-${lessonIndex + 1}`, title: `${suffix} — ${title}`, summary, bodyText: markdownBody(title, suffix, lessonIndex), visibility: visible ? 'public' : 'entitled', status: lessonPublished ? 'published' : 'draft', publishedAt: lessonPublished ? new Date(Date.now() - (courseIndex + sectionIndex + lessonIndex) * 3600000) : null, order: lessonIndex + 1, estimatedMinutes: 8 + lessonIndex * 4, readCount: (courseIndex + 1) * 17 + sectionIndex * 9 + lessonIndex * 3 } });
      }
    }
  }
  return courses;
}

async function seedAccess(ids: Map<string, string>, courses: { id: string; slug: string; accessTier: 'free' | 'paid' | null }[]) {
  const waliIds = seedUsers.filter((user) => user.role === 'wali').map((user) => ids.get(user.email)!);
  const paidCourses = courses.filter((course) => course.accessTier === 'paid');
  for (let index = 0; index < paidCourses.length; index += 1) {
    const course = paidCourses[index];
    const userId = waliIds[index % waliIds.length];
    await prisma.entitlement.create({ data: { userId, courseId: course.id, source: 'purchase', sourceRef: `seed-purchase-${index}`, expiresAt: null } });
    if (index === 0) await prisma.entitlement.create({ data: { userId, courseId: course.id, source: 'enrollment', sourceRef: `seed-enrollment-${index}`, expiresAt: null } });
    if (index === 1) await prisma.entitlement.create({ data: { userId, courseId: course.id, source: 'purchase', sourceRef: `seed-expired-${index}`, expiresAt: new Date(Date.now() - 86400000) } });
    if (index === 2) await prisma.entitlement.create({ data: { userId, courseId: course.id, source: 'purchase', sourceRef: `seed-revoked-${index}`, revokedAt: new Date() } });
  }
  const lessons = await prisma.lesson.findMany({ where: { status: 'published' }, select: { id: true } });
  for (let index = 0; index < Math.min(lessons.length, 30); index += 1) {
    await prisma.lessonProgress.create({ data: { userId: waliIds[index % waliIds.length], lessonId: lessons[index].id, completed: index % 3 !== 0 } });
  }
}

async function main() {
  console.log('Resetting development seed data.');
  await clearAuthUsers();
  await clearDatabase();
  const ids = await buildUserMap();
  await seedOperations(ids);
  const courses = await seedContent(ids);
  await seedAccess(ids, courses);
  console.log(`Seed complete: ${seedUsers.length} users, ${courses.length} courses, ${courses.length * 15} lessons.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => { await prisma.$disconnect(); });
