import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clean existing data
  await prisma.progress.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.materialItem.deleteMany();
  await prisma.session.deleteMany();
  await prisma.roadmapStep.deleteMany();
  await prisma.program.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  await prisma.user.create({
    data: {
      role: 'admin',
      name: 'Admin Nurman Course',
      phone: '081234567890',
      email: 'admin@nurmancourse.com',
    },
  });

  const student1 = await prisma.user.create({
    data: {
      role: 'peserta',
      name: 'Budi Santoso',
      phone: '089876543210',
      email: 'budi@gmail.com',
    },
  });

  await prisma.user.create({
    data: {
      role: 'peserta',
      name: 'Ahmad Fauzi',
      phone: '087766554433',
      email: 'ahmad@gmail.com',
    },
  });

  console.log('Users seeded.');

  // 3. Create Programs (Ngaji & Calistung)
  const programNgaji = await prisma.program.create({
    data: {
      slug: 'ngaji',
      name: 'Kelas Ngaji Al-Qur\'an',
      description: 'Program belajar membaca Al-Qur\'an dari dasar hingga mahir tajwid.',
      category: 'calistung',
      basePrice: 15000,
      active: true,
    },
  });

  const programCalistung = await prisma.program.create({
    data: {
      slug: 'calistung',
      name: 'Kelas Calistung Anak',
      description: 'Program membaca, menulis, dan berhitung cepat untuk anak usia dini.',
      category: 'calistung',
      basePrice: 30000,
      active: true,
    },
  });

  console.log('Programs seeded.');

  // 4. Create Roadmap Steps
  const stepNgaji1 = await prisma.roadmapStep.create({
    data: {
      programId: programNgaji.id,
      order: 1,
      title: 'Pengenalan Huruf Hijaiyah',
      bodyText: 'Langkah pertama belajar melafalkan huruf hijaiyah tunggal dengan benar.',
      level: 'Iqra 1',
    },
  });

  await prisma.roadmapStep.create({
    data: {
      programId: programNgaji.id,
      order: 2,
      title: 'Harakat Sederhana dan Huruf Sambung',
      bodyText: 'Belajar membaca harakat fathah, kasrah, dhommah, dan cara menyambung huruf.',
      level: 'Iqra 2',
    },
  });

  await prisma.roadmapStep.create({
    data: {
      programId: programCalistung.id,
      order: 1,
      title: 'Mengenal Angka 1-10',
      bodyText: 'Mengenal simbol angka 1 sampai 10 dan menghitung benda konkret.',
      level: 'Level 1',
    },
  });

  await prisma.roadmapStep.create({
    data: {
      programId: programCalistung.id,
      order: 2,
      title: 'Membaca Suku Kata Terbuka',
      bodyText: 'Membaca gabungan suku kata sederhana seperti ba-ca, bu-ku, ma-ma.',
      level: 'Level 2',
    },
  });

  console.log('Roadmap steps seeded.');

  // 5. Create Sessions
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);

  await prisma.session.create({
    data: {
      programId: programNgaji.id,
      startsAt: new Date(tomorrow.setHours(14, 0, 0, 0)),
      endsAt: new Date(tomorrow.setHours(15, 30, 0, 0)),
      location: 'Online via Zoom',
      capacity: 10,
      status: 'scheduled',
    },
  });

  const sessionCalistung = await prisma.session.create({
    data: {
      programId: programCalistung.id,
      startsAt: new Date(nextWeek.setHours(16, 0, 0, 0)),
      endsAt: new Date(nextWeek.setHours(17, 30, 0, 0)),
      location: 'Offline - Ruang Kelas Utama',
      capacity: 5,
      status: 'scheduled',
    },
  });

  console.log('Sessions seeded.');

  // 6. Create Material Items for Sessions/Steps
  await prisma.materialItem.create({
    data: {
      roadmapStepId: stepNgaji1.id,
      title: 'Materi Hijaiyah Alif - Ya',
      bodyText: '# Panduan Hijaiyah\nBerikut pelafalan huruf hijaiyah dari Alif sampai Ya.',
      order: 1,
    },
  });

  await prisma.materialItem.create({
    data: {
      sessionId: sessionCalistung.id,
      title: 'Flashcard Angka 1-10',
      bodyText: '# Flashcards\nGunakan gambar flashcard ini untuk membantu anak menghafal angka.',
      order: 1,
    },
  });

  // 7. Create Enrollment & Invoice for Students
  const enrollment = await prisma.enrollment.create({
    data: {
      userId: student1.id,
      programId: programCalistung.id,
      status: 'active',
    },
  });

  await prisma.invoice.create({
    data: {
      enrollmentId: enrollment.id,
      amount: 30000,
      status: 'unpaid',
      dueAt: new Date(tomorrow),
      note: 'Biaya pendaftaran awal Kelas Calistung',
    },
  });

  console.log('Enrollments and Invoices seeded.');
  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
