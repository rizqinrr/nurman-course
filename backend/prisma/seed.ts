import { PrismaClient } from '../src/generated/client';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('WARNING: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined in backend .env');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function getOrCreateSupabaseUser(email: string, role: string, name: string, phone: string) {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn(`Skipping Supabase user creation for ${email} due to missing env keys. Generating random ID.`);
    return 'demo-' + Math.random().toString(36).substring(2, 11);
  }

  try {
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error('Error listing users:', listError);
    }
    const existingUser = users?.find(u => u.email === email);
    if (existingUser) {
      console.log(`User ${email} already exists in Supabase with id: ${existingUser.id}`);
      await supabase.auth.admin.updateUserById(existingUser.id, {
        user_metadata: { role, name, phone }
      });
      return existingUser.id;
    }

    const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: 'Password123!',
      email_confirm: true,
      user_metadata: { role, name, phone }
    });

    if (createError || !user) {
      throw new Error(`Failed to create Supabase user ${email}: ${createError?.message}`);
    }

    console.log(`Created Supabase user ${email} with id: ${user.id}`);
    return user.id;
  } catch (err) {
    console.error(`Error in getOrCreateSupabaseUser for ${email}:`, err);
    throw err;
  }
}

async function main() {
  console.log('Seeding database with 3-role model...');

  // 1. Clean existing data (urut sesuai dependensi FK)
  await prisma.dailyReport.deleteMany();
  await prisma.progressReport.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.paymentAccount.deleteMany();
  await prisma.materialItem.deleteMany();
  await prisma.session.deleteMany();
  await prisma.roadmapStep.deleteMany();
  await prisma.program.deleteMany();
  await prisma.murid.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleaned database.');

  // 2. Create Users (Admin, Tentor, Wali)
  const adminId = await getOrCreateSupabaseUser('admin@nurmancourse.com', 'admin', 'Admin Nurman Course', '081234567890');
  const admin = await prisma.user.create({
    data: {
      id: adminId,
      role: 'admin',
      name: 'Admin Nurman Course',
      phone: '081234567890',
      email: 'admin@nurmancourse.com',
    },
  });

  const tentorId = await getOrCreateSupabaseUser('kiki@nurmancourse.com', 'tentor', 'Kak Kiki', '081333444555');
  const tentor = await prisma.user.create({
    data: {
      id: tentorId,
      role: 'tentor',
      name: 'Kak Kiki',
      phone: '081333444555',
      email: 'kiki@nurmancourse.com',
    },
  });

  const waliId = await getOrCreateSupabaseUser('supardi@gmail.com', 'wali', 'Supardi Santoso', '089876543210');
  const wali = await prisma.user.create({
    data: {
      id: waliId,
      role: 'wali',
      name: 'Supardi Santoso',
      phone: '089876543210',
      email: 'supardi@gmail.com',
    },
  });

  console.log('Users seeded (Admin, Tentor, Wali).');

  // 3. Create Murid (Anak dari Wali)
  const murid = await prisma.murid.create({
    data: {
      waliId: wali.id,
      name: 'Budi Santoso',
      birthDate: new Date('2019-05-12'),
      schoolLevel: 'TK B',
      avatarUrl: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=150&h=150',
    },
  });

  console.log('Murids seeded.');

  // 4. Create Programs (Ngaji & Calistung)
  const programNgaji = await prisma.program.create({
    data: {
      slug: 'ngaji',
      name: 'Kelas Ngaji Al-Qur\'an',
      description: 'Program belajar membaca Al-Qur\'an dari dasar hingga mahir tajwid.',
      category: 'calistung',
      basePrice: 15000,
      sessionsPerBlock: 12,
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
      sessionsPerBlock: 10,
      active: true,
    },
  });

  console.log('Programs seeded.');

  // 4b. Create Payment Accounts (rekening tujuan transfer)
  await prisma.paymentAccount.create({
    data: {
      bankName: 'Bank Mandiri',
      accountNumber: '1390022345678',
      accountName: 'Nurman Course',
      isActive: true,
      isDefault: true,
      note: 'Tabungan',
    },
  });

  await prisma.paymentAccount.create({
    data: {
      bankName: 'Bank BSI',
      accountNumber: '7151234567',
      accountName: 'Nurman Course',
      isActive: true,
      isDefault: false,
      note: null,
    },
  });

  console.log('Payment accounts seeded.');

  // 5. Create Roadmap Steps
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

  const stepCalistung1 = await prisma.roadmapStep.create({
    data: {
      programId: programCalistung.id,
      order: 1,
      title: 'Mengenal Angka 1-10',
      bodyText: 'Mengenal simbol angka 1 sampai 10 dan menghitung benda konkret.',
      level: 'Level 1',
    },
  });

  console.log('Roadmap steps seeded.');

  // 6. Create Sessions
  const now = new Date();
  
  // Sesi Calistung besok (Scheduled)
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const sessionCalistung = await prisma.session.create({
    data: {
      programId: programCalistung.id,
       tentorId: tentor.id,
      muridId: murid.id,
      startsAt: new Date(tomorrow.setHours(14, 0, 0, 0)),
      endsAt: new Date(tomorrow.setHours(15, 30, 0, 0)),
      location: 'Rumah Siswa (Jalan Mawar No. 10)',
      status: 'scheduled',
    },
  });

  // Sesi Ngaji kemarin (Completed dengan Laporan Harian)
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const sessionNgaji = await prisma.session.create({
    data: {
      programId: programNgaji.id,
       tentorId: tentor.id,
      muridId: murid.id,
      startsAt: new Date(yesterday.setHours(16, 0, 0, 0)),
      endsAt: new Date(yesterday.setHours(17, 0, 0, 0)),
      location: 'Rumah Siswa (Jalan Mawar No. 10)',
      status: 'completed',
    },
  });

  console.log('Sessions seeded.');

  // 7. Create Material Items
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

  console.log('Material items seeded.');

  // 8. Create Enrollment & Invoice
  const enrollmentNgaji = await prisma.enrollment.create({
    data: {
      muridId: murid.id,
      programId: programNgaji.id,
      status: 'active',
    },
  });

  await prisma.invoice.create({
    data: {
      enrollmentId: enrollmentNgaji.id,
      amount: 180000, // 12 sesi * 15000
      status: 'unpaid',
      dueAt: new Date(tomorrow),
      note: 'Biaya Blok 1 Kelas Ngaji Al-Qur\'an',
    },
  });

  console.log('Enrollments and Invoices seeded.');

  // 9. Create DailyReport (untuk sesi yang completed)
  await prisma.dailyReport.create({
    data: {
      sessionId: sessionNgaji.id,
      muridId: murid.id,
      date: yesterday,
      startTime: '16:00',
      endTime: '17:00',
      activity: 'Belajar melafalkan huruf Alif sampai Kho di Iqra 1',
      notes: 'Budi sangat antusias, pengucapan makhraj huruf Kho perlu sedikit bimbingan tambahan.',
    },
  });

  // 10. Create ProgressReport
  await prisma.progressReport.create({
    data: {
      muridId: murid.id,
      programId: programNgaji.id,
      blockNumber: 1,
      achievements: ['Budi sudah menyelesaikan materi Iqra 1 dengan sangat baik dan lancar.'],
      masteredMaterials: ['Pengenalan seluruh huruf hijaiyah berharakat fathah.'],
      weakMaterials: ['Pelafalan huruf-huruf tebal (isti\'la) seperti Shod, Dhod, Tho.'],
      notes: 'Disarankan untuk banyak latihan di rumah 5-10 menit setelah maghrib bersama orang tua.',
    },
  });

  // 11. Create Progress tracking
  await prisma.progress.create({
    data: {
      muridId: murid.id,
      roadmapStepId: stepNgaji1.id,
      status: 'completed',
    },
  });

  console.log('Laporan Harian, Laporan Perkembangan, & Progress seeded.');
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
