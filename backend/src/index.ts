import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from './generated/client';
import { requireAuth, requireAdmin, AuthenticatedRequest } from './middleware/auth';
import {
  createEnrollmentSchema,
  createInvoiceSchema,
  createMuridSchema,
  createPaymentAccountSchema,
  createProgramSchema,
  createUserSchema,
  dailyReportSchema,
  invoiceStatusSchema,
  progressReportSchema,
  updateEnrollmentSchema,
  updateInvoiceSchema,
  updateMuridSchema,
  normalizePhone,
  updatePaymentAccountSchema,
  updateProgramSchema,
  updateUserSchema,
  createRoadmapStepSchema,
  updateRoadmapStepSchema,
  createMaterialItemSchema,
  updateMaterialItemSchema,
  createTentorSessionSchema,
  updateTentorSessionSchema,
  submitPaymentSchema,
  createPrepaymentSchema,
} from '@nurman-course/shared';

dotenv.config();

export const prisma = new PrismaClient();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

const app = express();

function generateWaliEmail(phone: string): string {
  return `${phone}@nurmancourse.local`;
}

function generatePlaceholderEmail(phone: string): string {
  return generateWaliEmail(phone);
}
const DEFAULT_NEW_USER_PASSWORD = "12345678";
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routing
// 1. Health-check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    service: 'nurman-course-api'
  });
});

// Auth Helper: Resolve phone number to email (Public)
app.post('/api/auth/resolve-phone', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      res.status(400).json({ error: 'Nomor telepon/WhatsApp wajib dikirim' });
      return;
    }

    const normalized = normalizePhone(phone);
    const dbUser = await prisma.user.findFirst({
      where: { phone: normalized }
    });

    if (!dbUser || !dbUser.email) {
      res.status(404).json({ error: 'Nomor WhatsApp tidak terdaftar di Nurman Course' });
      return;
    }

    res.json({ email: dbUser.email });
  } catch (error) {
    console.error('Error resolving phone number:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Profile (Terproteksi)
app.get('/api/users/me', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const authUser = req.user;
    if (!authUser) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Ambil data user dari database Prisma
    let dbUser = await prisma.user.findUnique({
      where: { id: authUser.id },
      include: {
        murids: true // wali murid data
      }
    });

    // Fallback: Jika tidak ketemu via ID, cari via email
    if (!dbUser && authUser.email) {
      dbUser = await prisma.user.findUnique({
        where: { email: authUser.email },
        include: {
          murids: true
        }
      });
      if (dbUser) {
        console.log(`Reconciled user ${authUser.email} via email (auth ID: ${authUser.id}, DB ID: ${dbUser.id})`);
      }
    }

    if (!dbUser) {
      res.status(404).json({ error: 'User not found in application database' });
      return;
    }

    res.json({
      user: dbUser
    });
  } catch (error) {
    console.error('Error fetching current user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Programs (Publik)
app.get('/api/programs', async (req, res) => {
  try {
    const programs = await prisma.program.findMany({
      where: { active: true },
      include: {
        roadmapSteps: {
          orderBy: { order: 'asc' }
        }
      }
    });
    res.json({ programs });
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/programs/:id', async (req, res) => {
  try {
    const program = await prisma.program.findUnique({
      where: { id: req.params.id },
      include: {
        roadmapSteps: {
          orderBy: { order: 'asc' }
        }
      }
    });
    if (!program) {
      res.status(404).json({ error: 'Program not found' });
      return;
    }
    res.json({ program });
  } catch (error) {
    console.error('Error fetching program detail:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. Sessions (Terproteksi - per Role)
app.get('/api/me/sessions', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    let sessions;
    if (user.role === 'tentor') {
      sessions = await prisma.session.findMany({
        where: { tentorId: user.id },
        include: {
          program: true,
          murid: true,
          dailyReport: true,
          tentor: { select: { id: true, name: true } },
        },
        orderBy: { startsAt: 'asc' },
      });
    } else if (user.role === 'wali') {
      sessions = await prisma.session.findMany({
        where: { murid: { waliId: user.id } },
        include: {
          program: true,
          murid: true,
          tentor: { select: { id: true, name: true } },
          dailyReport: true,
        },
        orderBy: { startsAt: 'asc' },
      });
    } else {
      sessions = await prisma.session.findMany({
        include: {
          program: true,
          murid: true,
          tentor: { select: { id: true, name: true } },
          dailyReport: true,
        },
        orderBy: { startsAt: 'asc' },
      });
    }

    res.json({ sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5. Daily Reports (Terproteksi - per Role)
app.get('/api/me/daily-reports', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    let reports;
    if (user.role === 'tentor') {
      reports = await prisma.dailyReport.findMany({
        where: { session: { tentorId: user.id } },
        include: {
          murid: true,
          session: {
            include: {
              program: true,
              tentor: true
            }
          }
        },
        orderBy: { date: 'desc' }
      });
    } else if (user.role === 'wali') {
      reports = await prisma.dailyReport.findMany({
        where: { murid: { waliId: user.id } },
        include: {
          murid: true,
          session: {
            include: {
              program: true,
              tentor: true
            }
          }
        },
        orderBy: { date: 'desc' }
      });
    } else {
      // admin
      reports = await prisma.dailyReport.findMany({
        include: {
          murid: true,
          session: {
            include: {
              program: true,
              tentor: true
            }
          }
        },
        orderBy: { date: 'desc' }
      });
    }

    res.json({ reports });
  } catch (error) {
    console.error('Error fetching daily reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/daily-reports', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    if (user?.role !== 'tentor') {
      res.status(403).json({ error: 'Forbidden: Only tentor can write reports' });
      return;
    }
    
    // Validasi input zod
    const result = dailyReportSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.errors[0].message });
      return;
    }
    
    const { activity, notes } = result.data;
    const { sessionId } = req.body;
    
    if (!sessionId) {
      res.status(400).json({ error: 'Session ID is required' });
      return;
    }
    
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });
    
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    
    if (session.tentorId !== user.id) {
      res.status(403).json({ error: 'Forbidden: You are not the tentor for this session' });
      return;
    }
    
    // Auto-generate start & end times formatted for ID locale
    const startStr = new Date(session.startsAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
    const endStr = new Date(session.endsAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');

    const dailyReport = await prisma.dailyReport.upsert({
      where: { sessionId },
      update: {
        activity,
        notes,
        date: session.startsAt,
      },
      create: {
        sessionId,
        muridId: session.muridId,
        date: session.startsAt,
        startTime: startStr,
        endTime: endStr,
        activity,
        notes,
      }
    });
    
    // Update status sesi menjadi completed jika belum
    if (session.status !== 'completed') {
      await prisma.session.update({
        where: { id: sessionId },
        data: { status: 'completed' }
      });
    }
    
    res.json({ success: true, dailyReport });
  } catch (error) {
    console.error('Error writing daily report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 6. Progress Reports (Terproteksi - per Role)
app.get('/api/me/progress-reports', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    let reports;
    if (user.role === 'tentor') {
      reports = await prisma.progressReport.findMany({
        where: {
          murid: {
            sessions: {
              some: { tentorId: user.id }
            }
          }
        },
        include: {
          murid: true,
          program: true,
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (user.role === 'wali') {
      reports = await prisma.progressReport.findMany({
        where: {
          murid: { waliId: user.id }
        },
        include: {
          murid: true,
          program: true,
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      // admin
      reports = await prisma.progressReport.findMany({
        include: {
          murid: true,
          program: true,
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    if (user.role === 'wali' && Array.isArray(reports)) {
      const enrollments = await prisma.enrollment.findMany({
        where: { murid: { waliId: user.id } },
        select: {
          muridId: true,
          programId: true,
          status: true,
          tentor: { select: { id: true, name: true, phone: true } },
        },
      });
      const bestByKey = new Map<string, { tentor: { id: string; name: string; phone: string | null } | null; status: string }>();
      enrollments.forEach((e) => {
        const key = `${e.muridId}:${e.programId}`;
        const entry = { tentor: e.tentor || null, status: e.status };
        const existing = bestByKey.get(key);
        if (!existing) { bestByKey.set(key, entry); return; }
        if (entry.tentor && !existing.tentor) { bestByKey.set(key, entry); return; }
        if (entry.status === 'active' && existing.status !== 'active') { bestByKey.set(key, entry); return; }
      });
      reports = reports.map((r: any) => ({ ...r, tentor: bestByKey.get(`${r.muridId}:${r.programId}`)?.tentor || null }));
    }

    res.json({ reports });
  } catch (error) {
    console.error('Error fetching progress reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/progress-reports', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    if (user?.role !== 'tentor') {
      res.status(403).json({ error: 'Forbidden: Only tentor can write reports' });
      return;
    }

    const validation = progressReportSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ error: validation.error.errors[0].message });
      return;
    }

    const { achievements, masteredMaterials, weakMaterials, notes } = validation.data;
    const { muridId, programId, blockNumber } = req.body;

    if (!muridId || !programId || !blockNumber) {
      res.status(400).json({ error: 'Murid ID, Program ID, and Block Number are required' });
      return;
    }

    const activeSessions = await prisma.session.findFirst({
      where: {
        muridId,
        programId,
        tentorId: user.id
      }
    });

    if (!activeSessions) {
      res.status(403).json({ error: 'Forbidden: You have no teaching session with this student in this program' });
      return;
    }

    const progressReport = await prisma.progressReport.create({
      data: {
        muridId,
        programId,
        blockNumber: Number(blockNumber),
        achievements,
        masteredMaterials,
        weakMaterials,
        notes,
      }
    });

    res.json({ success: true, progressReport });
  } catch (error) {
    console.error('Error writing progress report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 7. Enrollments (Terproteksi - per Role)
app.get('/api/me/enrollments', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    let enrollments: any[];
    if (user.role === 'wali') {
      enrollments = await prisma.enrollment.findMany({
        where: {
          murid: { waliId: user.id }
        },
        include: {
          program: true,
          murid: true,
          tentor: { select: { id: true, name: true } },
        },
        orderBy: { startedAt: 'desc' }
      });
    } else if (user.role === 'tentor') {
      // Tentor bisa melihat enrollment dari murid yang dipasangkan dengannya
      enrollments = await prisma.enrollment.findMany({
        where: {
          tentorId: user.id
        },
        include: {
          program: true,
          murid: true,
          tentor: { select: { id: true, name: true } },
        },
        orderBy: { startedAt: 'desc' }
      });
    } else {
      // admin
      enrollments = await prisma.enrollment.findMany({
        include: {
          program: true,
          murid: true,
          tentor: { select: { id: true, name: true } },
        },
        orderBy: { startedAt: 'desc' }
      });
    }

    res.json({ enrollments });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 8. Invoices (Terproteksi - per Role)
app.get('/api/me/invoices', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    let invoices: any[];
    if (user.role === 'wali') {
      invoices = await prisma.invoice.findMany({
        where: {
          enrollment: {
            murid: { waliId: user.id }
          }
        },
        include: {
          enrollment: {
            include: {
              program: true,
              murid: true
            }
          }
        },
        orderBy: { dueAt: 'desc' }
      });
    } else if (user.role === 'tentor') {
      // Tentor tidak ada urusan dengan tagihan
      invoices = [];
    } else {
      // admin
      invoices = await prisma.invoice.findMany({
        include: {
          enrollment: {
            include: {
              program: true,
              murid: true
            }
          }
        },
        orderBy: { dueAt: 'desc' }
      });
    }

    res.json({ invoices });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/me/invoices/:id/payment', requireAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = submitPaymentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Invalid payment data', details: parsed.error.flatten() },
    });
    return;
  }

  const { amount, proofBase64, proofName, note } = parsed.data;

  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (user.role !== 'wali') {
      res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Hanya wali yang dapat mengirim pembayaran' } });
      return;
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: { enrollment: { select: { murid: { select: { waliId: true } } } } },
    });
    if (!invoice) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Invoice tidak ditemukan' } });
      return;
    }
    if (invoice.enrollment.murid.waliId !== user.id) {
      res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Invoice bukan milik Anda' } });
      return;
    }
    if (invoice.status !== 'unpaid') {
      res.status(409).json({ error: { code: 'CONFLICT', message: 'Pembayaran hanya bisa dikirim untuk tagihan berstatus belum dibayar' } });
      return;
    }

    const updated = await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        status: 'waiting',
        paymentProof: proofBase64,
        paymentProofName: proofName || null,
        paidAmount: amount ?? invoice.amount,
        paymentNote: note || null,
        submittedAt: new Date(),
      },
    });

    res.json({ data: updated });
  } catch (error) {
    console.error('Error submitting invoice payment:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

// 8b. Prepayments (Pembayaran mandiri/prabayar sebelum ada tagihan)
app.get('/api/me/prepayments', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (user.role !== 'wali') {
      res.json({ data: [] });
      return;
    }
    const prepayments = await prisma.prepayment.findMany({
      where: { murid: { waliId: user.id } },
      include: { murid: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: prepayments });
  } catch (error) {
    console.error('Error fetching me prepayments:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.post('/api/me/prepayments', requireAuth, async (req: AuthenticatedRequest, res) => {
  const parsed = createPrepaymentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Data pembayaran tidak valid', details: parsed.error.flatten() },
    });
    return;
  }

  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (user.role !== 'wali') {
      res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Hanya wali yang dapat mengirim pembayaran' } });
      return;
    }

    const { muridId, amount, proofBase64, proofName, note } = parsed.data;
    const murid = await prisma.murid.findUnique({
      where: { id: muridId },
      select: { id: true, waliId: true },
    });
    if (!murid) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Murid tidak ditemukan' } });
      return;
    }
    if (murid.waliId !== user.id) {
      res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Murid bukan milik Anda' } });
      return;
    }

    const created = await prisma.prepayment.create({
      data: {
        muridId,
        amount,
        status: 'waiting',
        paymentProof: proofBase64,
        paymentProofName: proofName || null,
        note: note || null,
        submittedAt: new Date(),
      },
      include: { murid: { select: { id: true, name: true } } },
    });

    res.status(201).json({ data: created });
  } catch (error) {
    console.error('Error creating prepayment:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.get('/api/admin/prepayments', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const status = typeof req.query.status === 'string' && req.query.status !== ''
      ? req.query.status
      : undefined;
    const prepayments = await prisma.prepayment.findMany({
      where: status ? { status } : undefined,
      include: {
        murid: {
          select: {
            id: true,
            name: true,
            wali: { select: { id: true, name: true, phone: true } },
            enrollments: {
              where: { status: 'active' },
              take: 1,
              orderBy: { startedAt: 'desc' },
              select: {
                id: true,
                program: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: prepayments });
  } catch (error) {
    console.error('Error fetching admin prepayments:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.patch('/api/admin/prepayments/:id/status', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const parsed = z.enum(['waiting', 'paid', 'cancelled']).safeParse(req.body?.status);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Status tidak valid' } });
      return;
    }

    const existing = await prisma.prepayment.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Pembayaran tidak ditemukan' } });
      return;
    }

    const updated = await prisma.prepayment.update({
      where: { id: existing.id },
      data: {
        status: parsed.data,
        ...(parsed.data === 'paid' ? { paidAt: new Date() } : {}),
      },
      include: { murid: { select: { id: true, name: true } } },
    });

    res.json({ data: updated });
  } catch (error) {
    console.error('Error updating admin prepayment status:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.get('/api/me/notifications', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    let unpaidInvoices = 0;
    if (user.role === 'wali') {
      unpaidInvoices = await prisma.invoice.count({
        where: {
          status: 'unpaid',
          enrollment: { murid: { waliId: user.id } },
        },
      });
    }
    res.json({ unpaidInvoices });
  } catch (error) {
    console.error('Error fetching me notifications:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.get('/api/admin/notifications', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const [waitingInvoices, waitingPrepayments] = await prisma.$transaction([
      prisma.invoice.count({ where: { status: 'waiting' } }),
      prisma.prepayment.count({ where: { status: 'waiting' } }),
    ]);
    res.json({ waitingInvoices, waitingPrepayments });
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

// 8b. Admin Dashboard Stats (Terproteksi - Admin)
app.get('/api/admin/dashboard', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const now = new Date();
    const jakartaOffsetMs = 7 * 60 * 60 * 1000;
    const startOfToday = new Date(now.getTime() + jakartaOffsetMs);
    startOfToday.setUTCHours(0, 0, 0, 0);
    startOfToday.setTime(startOfToday.getTime() - jakartaOffsetMs);
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

    const [programsActive, muridsActive, tentorsActive, invoicesPending, sessionsToday] =
      await prisma.$transaction([
        prisma.program.count({ where: { active: true } }),
        prisma.murid.count({ where: { active: true } }),
        prisma.user.count({ where: { role: 'tentor', active: true } }),
        prisma.invoice.count({ where: { status: { in: ['unpaid', 'waiting'] } } }),
        prisma.session.findMany({
          where: { startsAt: { gte: startOfToday, lt: endOfToday } },
          select: {
            id: true,
            startsAt: true,
            endsAt: true,
            status: true,
            program: { select: { id: true, name: true } },
            murid: { select: { id: true, name: true } },
          },
          orderBy: { startsAt: 'asc' },
        }),
      ]);

    res.json({
      data: {
        programsActive,
        muridsActive,
        tentorsActive,
        invoicesPending,
        sessionsToday,
      },
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

// 9. Progress (Roadmap step progress, Terproteksi - per Role)
app.get('/api/me/progresses', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    let progresses: any[];
    if (user.role === 'wali') {
      progresses = await prisma.progress.findMany({
        where: {
          murid: { waliId: user.id }
        },
        include: {
          murid: true,
          roadmapStep: true
        },
        orderBy: { updatedAt: 'desc' }
      });
    } else if (user.role === 'tentor') {
      progresses = await prisma.progress.findMany({
        where: {
          murid: {
            sessions: {
              some: { tentorId: user.id }
            }
          }
        },
        include: {
          murid: true,
          roadmapStep: true
        },
        orderBy: { updatedAt: 'desc' }
      });
    } else {
      // admin
      progresses = await prisma.progress.findMany({
        include: {
          murid: true,
          roadmapStep: true
        },
        orderBy: { updatedAt: 'desc' }
      });
    }

    res.json({ progresses });
  } catch (error) {
    console.error('Error fetching progresses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 10. Admin-Only Murids List (Terproteksi - Admin)
app.get('/api/admin/murids', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const murids = await prisma.murid.findMany({
      where: search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { wali: { name: { contains: search, mode: 'insensitive' } } },
          { wali: { phone: { contains: search } } },
        ],
      } : undefined,
      include: {
        wali: true,
        _count: { select: { enrollments: true, sessions: true } },
      },
      orderBy: { name: 'asc' }
    });

    res.json({ data: murids });
  } catch (error) {
    console.error('Error fetching admin murids:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 11. Admin-Only Tentors List (Terproteksi - Admin) - konsisten shape { data: ... } seperti /api/admin/murids
app.get('/api/admin/tentors', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 200);

    const where = {
      role: 'tentor' as const,
      ...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {}),
    };

    const tentors = await prisma.user.findMany({
      where,
      orderBy: { name: 'asc' },
      take: limit,
      select: { id: true, name: true, email: true, phone: true, active: true },
    });

    res.json({ data: tentors });
  } catch (error) {
    console.error('Error fetching admin tentors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 12. Admin-Only Program Management
app.get('/api/admin/programs', requireAuth, requireAdmin, async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const active = req.query.active === undefined
      ? undefined
      : req.query.active === 'true';

    const where = {
      ...(search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { slug: { contains: search, mode: 'insensitive' as const } },
        ],
      } : {}),
      ...(category ? { category } : {}),
      ...(active === undefined ? {} : { active }),
    };

    const [programs, total] = await prisma.$transaction([
      prisma.program.findMany({
        where,
        include: {
          _count: {
            select: { roadmapSteps: true, enrollments: true, sessions: true },
          },
        },
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.program.count({ where }),
    ]);

    res.json({
      data: programs,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching admin programs:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.get('/api/admin/programs/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const program = await prisma.program.findUnique({
      where: { id: req.params.id },
      include: {
        roadmapSteps: { orderBy: { order: 'asc' } },
        _count: { select: { enrollments: true, sessions: true } },
      },
    });

    if (!program) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Program not found' } });
      return;
    }

    res.json({ data: program });
  } catch (error) {
    console.error('Error fetching admin program:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.post('/api/admin/programs', requireAuth, requireAdmin, async (req, res) => {
  const parsed = createProgramSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid program data',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  try {
    const program = await prisma.program.create({ data: parsed.data });
    res.status(201).json({ data: program });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      res.status(409).json({ error: { code: 'CONFLICT', message: 'Program slug already exists' } });
      return;
    }
    console.error('Error creating admin program:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.patch('/api/admin/programs/:id', requireAuth, requireAdmin, async (req, res) => {
  const parsed = updateProgramSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid program data',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  if (Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'At least one field is required' } });
    return;
  }

  try {
    const program = await prisma.program.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json({ data: program });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Program not found' } });
        return;
      }
      if (error.code === 'P2002') {
        res.status(409).json({ error: { code: 'CONFLICT', message: 'Program slug already exists' } });
        return;
      }
    }
    console.error('Error updating admin program:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.delete('/api/admin/programs/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const program = await prisma.program.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { enrollments: true, sessions: true } } },
    });

    if (!program) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Program not found' } });
      return;
    }

    if (program._count.enrollments > 0 || program._count.sessions > 0) {
      const updated = await prisma.program.update({
        where: { id: program.id },
        data: { active: false },
      });
      res.json({ data: updated, deactivated: true });
      return;
    }

    await prisma.program.delete({ where: { id: program.id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting admin program:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

// 12.5. Admin-Only RoadmapStep Management
app.get('/api/admin/programs/:programId/roadmap', requireAuth, requireAdmin, async (req, res) => {
  try {
    const program = await prisma.program.findUnique({
      where: { id: req.params.programId },
    });
    if (!program) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Program tidak ditemukan' } });
      return;
    }
    const steps = await prisma.roadmapStep.findMany({
      where: { programId: req.params.programId },
      orderBy: { order: 'asc' },
    });
    res.json({ data: steps });
  } catch (error) {
    console.error('Error fetching admin roadmap steps:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.post('/api/admin/programs/:programId/roadmap', requireAuth, requireAdmin, async (req, res) => {
  const parsed = createRoadmapStepSchema.safeParse({ ...req.body, programId: req.params.programId });
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid roadmap step data',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  const { programId, order, title, bodyText, level } = parsed.data;

  try {
    const program = await prisma.program.findUnique({
      where: { id: programId },
    });
    if (!program) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Program tidak ditemukan' } });
      return;
    }
    if (!program.hasRoadmap) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Program ini tidak menggunakan roadmap' } });
      return;
    }

    let targetOrder = order;
    if (targetOrder === undefined) {
      const maxStep = await prisma.roadmapStep.findFirst({
        where: { programId },
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      targetOrder = maxStep ? maxStep.order + 1 : 0;
    }

    const step = await prisma.roadmapStep.create({
      data: {
        programId,
        order: targetOrder,
        title,
        bodyText,
        level,
      },
    });
    res.status(201).json({ data: step });
  } catch (error) {
    console.error('Error creating admin roadmap step:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.post('/api/admin/programs/:programId/roadmap/reorder', requireAuth, requireAdmin, async (req, res) => {
  const { stepIds } = req.body;
  if (!Array.isArray(stepIds) || stepIds.some(id => typeof id !== 'string')) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'stepIds harus berupa array string ID' } });
    return;
  }

  try {
    const program = await prisma.program.findUnique({
      where: { id: req.params.programId },
      include: { roadmapSteps: { select: { id: true } } }
    });

    if (!program) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Program tidak ditemukan' } });
      return;
    }

    const existingStepIds = new Set(program.roadmapSteps.map(s => s.id));

    for (const id of stepIds) {
      if (!existingStepIds.has(id)) {
        res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: `Step ID ${id} tidak valid untuk program ini` } });
        return;
      }
    }

    await prisma.$transaction(
      stepIds.map((id, index) =>
        prisma.roadmapStep.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    const updatedSteps = await prisma.roadmapStep.findMany({
      where: { programId: req.params.programId },
      orderBy: { order: 'asc' },
    });

    res.json({ data: updatedSteps });
  } catch (error) {
    console.error('Error reordering roadmap steps:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.patch('/api/admin/roadmap-steps/:id', requireAuth, requireAdmin, async (req, res) => {
  const parsed = updateRoadmapStepSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid roadmap step data',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  if (Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'At least one field is required' } });
    return;
  }

  try {
    const existingStep = await prisma.roadmapStep.findUnique({
      where: { id: req.params.id },
      include: { program: { select: { hasRoadmap: true } } },
    });
    if (!existingStep) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Roadmap step tidak ditemukan' } });
      return;
    }
    if (!existingStep.program.hasRoadmap) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Program ini tidak menggunakan roadmap' } });
      return;
    }

    const updated = await prisma.roadmapStep.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json({ data: updated });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Roadmap step tidak ditemukan' } });
      return;
    }
    console.error('Error updating admin roadmap step:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.delete('/api/admin/roadmap-steps/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const existingStep = await prisma.roadmapStep.findUnique({
      where: { id: req.params.id },
      include: { program: { select: { hasRoadmap: true } } },
    });
    if (!existingStep) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Roadmap step tidak ditemukan' } });
      return;
    }
    if (!existingStep.program.hasRoadmap) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Program ini tidak menggunakan roadmap' } });
      return;
    }

    await prisma.roadmapStep.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Roadmap step tidak ditemukan' } });
      return;
    }
    console.error('Error deleting admin roadmap step:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

// 12.6. Admin-Only MaterialItem Management
async function assertRoadmapStepHasRoadmap(stepId: string) {
  const step = await prisma.roadmapStep.findUnique({
    where: { id: stepId },
    include: { program: { select: { hasRoadmap: true } } },
  });
  if (!step) {
    return { ok: false as const, status: 404, code: 'NOT_FOUND', message: 'Roadmap step tidak ditemukan' };
  }
  if (!step.program.hasRoadmap) {
    return { ok: false as const, status: 400, code: 'VALIDATION_ERROR', message: 'Program ini tidak menggunakan roadmap' };
  }
  return { ok: true as const, step };
}

app.get('/api/admin/roadmap-steps/:stepId/materials', requireAuth, requireAdmin, async (req, res) => {
  const result = await assertRoadmapStepHasRoadmap(req.params.stepId);
  if (!result.ok) {
    res.status(result.status).json({ error: { code: result.code, message: result.message } });
    return;
  }
  try {
    const materials = await prisma.materialItem.findMany({
      where: { roadmapStepId: req.params.stepId },
      orderBy: { order: 'asc' },
    });
    res.json({ data: materials });
  } catch (error) {
    console.error('Error fetching admin material items:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.post('/api/admin/roadmap-steps/:stepId/materials', requireAuth, requireAdmin, async (req, res) => {
  const parsed = createMaterialItemSchema.safeParse({ ...req.body, roadmapStepId: req.params.stepId });
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid material item data',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  const result = await assertRoadmapStepHasRoadmap(req.params.stepId);
  if (!result.ok) {
    res.status(result.status).json({ error: { code: result.code, message: result.message } });
    return;
  }

  const { roadmapStepId, order, title, bodyText } = parsed.data;

  try {
    let targetOrder = order;
    if (targetOrder === undefined) {
      const maxItem = await prisma.materialItem.findFirst({
        where: { roadmapStepId },
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      targetOrder = maxItem ? maxItem.order + 1 : 0;
    }

    const material = await prisma.materialItem.create({
      data: {
        roadmapStepId,
        order: targetOrder,
        title,
        bodyText,
      },
    });
    res.status(201).json({ data: material });
  } catch (error) {
    console.error('Error creating admin material item:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.patch('/api/admin/material-items/:id', requireAuth, requireAdmin, async (req, res) => {
  const parsed = updateMaterialItemSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid material item data',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  if (Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'At least one field is required' } });
    return;
  }

  try {
    const existing = await prisma.materialItem.findUnique({
      where: { id: req.params.id },
      include: { roadmapStep: { include: { program: { select: { hasRoadmap: true } } } } },
    });
    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Material item tidak ditemukan' } });
      return;
    }
    if (!existing.roadmapStep?.program.hasRoadmap) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Program ini tidak menggunakan roadmap' } });
      return;
    }

    const updated = await prisma.materialItem.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json({ data: updated });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Material item tidak ditemukan' } });
      return;
    }
    console.error('Error updating admin material item:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.delete('/api/admin/material-items/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const existing = await prisma.materialItem.findUnique({
      where: { id: req.params.id },
      include: { roadmapStep: { include: { program: { select: { hasRoadmap: true } } } } },
    });
    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Material item tidak ditemukan' } });
      return;
    }
    if (!existing.roadmapStep?.program.hasRoadmap) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Program ini tidak menggunakan roadmap' } });
      return;
    }

    await prisma.materialItem.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Material item tidak ditemukan' } });
      return;
    }
    console.error('Error deleting admin material item:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.post('/api/admin/roadmap-steps/:stepId/materials/reorder', requireAuth, requireAdmin, async (req, res) => {
  const { materialIds } = req.body;
  if (!Array.isArray(materialIds) || materialIds.some(id => typeof id !== 'string')) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'materialIds harus berupa array string ID' } });
    return;
  }

  const result = await assertRoadmapStepHasRoadmap(req.params.stepId);
  if (!result.ok) {
    res.status(result.status).json({ error: { code: result.code, message: result.message } });
    return;
  }

  try {
    const existingMaterials = await prisma.materialItem.findMany({
      where: { roadmapStepId: req.params.stepId },
      select: { id: true },
    });
    const existingIds = new Set(existingMaterials.map(m => m.id));

    for (const id of materialIds) {
      if (!existingIds.has(id)) {
        res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: `Material ID ${id} tidak valid untuk step ini` } });
        return;
      }
    }

    await prisma.$transaction(
      materialIds.map((id, index) =>
        prisma.materialItem.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    const updatedMaterials = await prisma.materialItem.findMany({
      where: { roadmapStepId: req.params.stepId },
      orderBy: { order: 'asc' },
    });

    res.json({ data: updatedMaterials });
  } catch (error) {
    console.error('Error reordering material items:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

// 13. Admin-Only Users Management
app.get('/api/admin/users', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const role = typeof req.query.role === 'string' && req.query.role !== ''
      ? req.query.role
      : undefined;
    const active = req.query.active === undefined
      ? undefined
      : req.query.active === 'true';

    const where = {
      ...(role ? { role } : {}),
      ...(active === undefined ? {} : { active }),
      ...(search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search, mode: 'insensitive' as const } },
        ],
      } : {}),
    };

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        include: {
          _count: {
            select: { murids: true, sessions: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      data: users,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.post('/api/admin/users', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid user data',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  if (!supabaseAdmin) {
    res.status(503).json({
      error: { code: 'AUTH_UNAVAILABLE', message: 'Supabase service key is not configured' },
    });
    return;
  }

  const { role, name, phone } = parsed.data;
  const emailInput = parsed.data.email ?? null;
  const address = parsed.data.address ?? null;
  const photoPath = parsed.data.photoPath ?? null;
  const normalizedPhone = phone;
  const resolvedEmail = emailInput && String(emailInput).trim() !== "" ? String(emailInput).trim() : generatePlaceholderEmail(normalizedPhone);
  const password = parsed.data.password || DEFAULT_NEW_USER_PASSWORD;

  try {
    const { data: createdAuth, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: resolvedEmail,
      password,
      email_confirm: true,
      user_metadata: { role, name, phone: normalizedPhone },
    });

    if (authError || !createdAuth.user) {
      const msg = (authError?.message || "").toLowerCase();
      if (msg.includes('already been registered') || msg.includes('already exists') || msg.includes('duplicate')) {
        res.status(409).json({
          error: { code: 'CONFLICT', message: 'Email / nomor hape sudah terdaftar' },
        });
        return;
      }
      res.status(400).json({
        error: { code: 'AUTH_CREATE_FAILED', message: authError?.message || 'Failed to create auth user' },
      });
      return;
    }

    try {
      const user = await prisma.user.create({
        data: {
          id: createdAuth.user.id,
          role,
          name,
          phone: normalizedPhone,
          email: resolvedEmail,
          address,
          photoPath,
        },
      });
      res.status(201).json({
        data: user,
        temporaryPassword: password,
      });
    } catch (error) {
      await supabaseAdmin.auth.admin.deleteUser(createdAuth.user.id).catch(() => {});
      throw error;
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      res.status(409).json({ error: { code: 'CONFLICT', message: 'Email / nomor hape sudah terdaftar' } });
      return;
    }
    console.error('Error creating admin user:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.patch('/api/admin/users/:id', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid user data',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  if (Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'At least one field is required' } });
    return;
  }

  const targetId = req.params.id;

  // Cegah admin mengubah role dirinya sendiri
  if (req.user?.id === targetId && parsed.data.role) {
    res.status(400).json({ error: { code: 'FORBIDDEN', message: 'Tidak dapat mengubah role akun sendiri' } });
    return;
  }

  try {
    const existing = await prisma.user.findUnique({ where: { id: targetId }, select: { email: true, phone: true } });
    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
      return;
    }

    const updatePayload: Record<string, unknown> = {};
    if (parsed.data.role !== undefined) updatePayload.role = parsed.data.role;
    if (parsed.data.name !== undefined) updatePayload.name = parsed.data.name;
    if (parsed.data.phone !== undefined) updatePayload.phone = parsed.data.phone;
    if (parsed.data.address !== undefined) updatePayload.address = parsed.data.address || null;
    if (parsed.data.photoPath !== undefined) updatePayload.photoPath = parsed.data.photoPath || null;
    if (parsed.data.email !== undefined) {
      const trimmed = parsed.data.email ? String(parsed.data.email).trim() : "";
      if (trimmed === "") {
        const phoneForEmail = (parsed.data.phone as string) || existing.phone || "";
        updatePayload.email = phoneForEmail ? generatePlaceholderEmail(phoneForEmail) : existing.email;
      } else {
        updatePayload.email = trimmed;
      }
    }

    const user = await prisma.user.update({
      where: { id: targetId },
      data: updatePayload,
    });

    if (supabaseAdmin) {
      const shouldSyncRole = parsed.data.role !== undefined || parsed.data.name !== undefined || parsed.data.phone !== undefined;
      const shouldSyncEmail = parsed.data.email !== undefined;
      if (shouldSyncRole || shouldSyncEmail) {
        const authUpdate: Record<string, unknown> = {};
        if (shouldSyncEmail) (authUpdate as any).email = user.email;
        if (shouldSyncRole) {
          (authUpdate as any).user_metadata = {
            role: user.role,
            name: user.name,
            phone: user.phone,
          };
        }
        await (supabaseAdmin.auth.admin.updateUserById as any)(targetId, authUpdate).catch((error: unknown) => {
          console.error('Error syncing tentor/wali to Supabase:', error);
        });
      }
    }

    res.json({ data: user });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
        return;
      }
      if (error.code === 'P2002') {
        res.status(409).json({ error: { code: 'CONFLICT', message: 'Email / nomor hape sudah terdaftar' } });
        return;
      }
    }
    console.error('Error updating admin user:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.post('/api/admin/users/:id/reset-password', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  const targetId = req.params.id;
  const raw = (req.body as any)?.password ?? (req.body as any)?.newPassword;
  const desired = typeof raw === 'string' && raw.trim() !== '' ? raw.trim() : DEFAULT_NEW_USER_PASSWORD;

  if (!supabaseAdmin) {
    res.status(503).json({ error: { code: 'AUTH_UNAVAILABLE', message: 'Supabase service key is not configured' } });
    return;
  }

  if (desired.length < 6) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Password minimal 6 karakter' } });
    return;
  }

  try {
    const existing = await prisma.user.findUnique({ where: { id: targetId }, select: { id: true, role: true } });
    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
      return;
    }

    const { error: authError } = await (supabaseAdmin.auth.admin.updateUserById as any)(targetId, { password: desired });
    if (authError) {
      res.status(400).json({ error: { code: 'AUTH_UPDATE_FAILED', message: authError.message || 'Gagal reset password' } });
      return;
    }

    res.json({ data: existing, temporaryPassword: desired, message: `Password direset ke ${desired}` });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.delete('/api/admin/users/:id', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  const targetId = req.params.id;

  // Cegah admin menonaktifkan dirinya sendiri
  if (req.user?.id === targetId) {
    res.status(400).json({ error: { code: 'FORBIDDEN', message: 'Tidak dapat menonaktifkan akun sendiri' } });
    return;
  }

  try {
    const target = await prisma.user.findUnique({
      where: { id: targetId },
      select: { id: true, role: true, active: true },
    });

    if (!target) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
      return;
    }

    if (target.role === 'admin') {
      res.status(400).json({ error: { code: 'FORBIDDEN', message: 'Tidak dapat menonaktifkan akun admin lain' } });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: targetId },
      data: { active: false },
    });

    res.json({ data: updated, deactivated: true });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
      return;
    }
    console.error('Error deactivating admin user:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

// 14. Admin-Only Murids Management
app.get('/api/admin/murids/:id', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const murid = await prisma.murid.findUnique({
      where: { id: req.params.id },
      include: {
        wali: { select: { id: true, name: true, email: true, phone: true } },
        enrollments: {
          include: { program: { select: { id: true, name: true, slug: true, active: true } } },
          orderBy: { startedAt: 'desc' },
        },
        sessions: {
          include: {
            program: { select: { id: true, name: true } },
            tentor: { select: { id: true, name: true } },
          },
          orderBy: { startsAt: 'desc' },
        },
        dailyReports: { orderBy: { date: 'desc' }, take: 5 },
        progressReports: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });

    if (!murid) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Murid not found' } });
      return;
    }

    res.json({ data: murid });
  } catch (error) {
    console.error('Error fetching admin murid:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.post('/api/admin/murids', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  const parsed = createMuridSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid murid data',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  const { name, birthDate, schoolLevel, address, registeredAt, active, waliName, waliPhone, waliEmail, photoPath } = parsed.data;
  const normalizedPhone = normalizePhone(waliPhone);

  try {
    let wali = await prisma.user.findUnique({
      where: { phone: normalizedPhone },
      select: { id: true, role: true, active: true, name: true, phone: true, email: true },
    });
    let createdAuthUserId: string | null = null;

    if (wali && wali.role !== 'wali') {
      res.status(409).json({ error: { code: 'CONFLICT', message: 'Nomor hape sudah digunakan akun non-wali' } });
      return;
    }

    if (wali) {
      const existingMurid = await prisma.murid.findFirst({
        where: { waliId: wali.id }
      });
      if (existingMurid) {
        res.status(409).json({ error: { code: 'CONFLICT', message: 'Nomor hape wali sudah terdaftar untuk murid lain' } });
        return;
      }
    }

    if (!wali) {
      if (!supabaseAdmin) {
        res.status(500).json({ error: { code: 'CONFIGURATION_ERROR', message: 'Supabase service role belum tersedia' } });
        return;
      }

      const resolvedWaliEmail = waliEmail || generateWaliEmail(normalizedPhone);

      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        phone: normalizedPhone,
        password: DEFAULT_NEW_USER_PASSWORD,
        phone_confirm: true,
        email_confirm: true,
        email: resolvedWaliEmail,
        user_metadata: { role: 'wali', name: waliName, phone: normalizedPhone },
      });
      if (authError || !authData.user) {
        res.status(400).json({ error: { code: 'AUTH_CREATE_FAILED', message: authError?.message || 'Gagal membuat akun wali' } });
        return;
      }
      createdAuthUserId = authData.user.id;

      try {
        wali = await prisma.user.create({
          data: {
            id: authData.user.id,
            role: 'wali',
            name: waliName,
            phone: normalizedPhone,
            email: resolvedWaliEmail,
          },
          select: { id: true, role: true, active: true, name: true, phone: true, email: true },
        });
      } catch (error) {
        await supabaseAdmin.auth.admin.deleteUser(createdAuthUserId);
        throw error;
      }
    }

    const murid = await prisma.murid.create({
      data: {
        waliId: wali.id,
         name,
         birthDate: birthDate ? new Date(birthDate) : null,
         schoolLevel,
         address,
        registeredAt: new Date(registeredAt),
        active,
        photoPath: photoPath || null,
      },
      include: { wali: { select: { id: true, name: true, phone: true, email: true } } },
    });

    res.status(201).json({ data: murid, waliCreated: Boolean(createdAuthUserId), defaultPassword: createdAuthUserId ? DEFAULT_NEW_USER_PASSWORD : undefined });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      res.status(409).json({ error: { code: 'CONFLICT', message: 'Nomor hape atau email wali sudah digunakan' } });
      return;
    }
    console.error('Error creating admin murid:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.patch('/api/admin/murids/:id', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  const parsed = updateMuridSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid murid data',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  if (Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'At least one field is required' } });
    return;
  }

  const { name, birthDate, schoolLevel, address, registeredAt, active, waliName, waliPhone, waliEmail, photoPath } = parsed.data;

  try {
    const murid = await prisma.murid.findUnique({ where: { id: req.params.id }, select: { id: true, waliId: true } });
    if (!murid) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Murid not found' } });
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (birthDate !== undefined) updateData.birthDate = birthDate ? new Date(birthDate) : null;
    if (schoolLevel !== undefined) updateData.schoolLevel = schoolLevel;
    if (address !== undefined) updateData.address = address;
    if (registeredAt !== undefined) updateData.registeredAt = new Date(registeredAt);
    if (active !== undefined) updateData.active = active;
    if (photoPath !== undefined) updateData.photoPath = photoPath || null;

    if (waliPhone !== undefined || waliName !== undefined || waliEmail !== undefined) {
      const existingWali = await prisma.user.findUnique({ where: { id: murid.waliId }, select: { id: true, role: true } });
      if (!existingWali || existingWali.role !== 'wali') {
        res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Wali tidak valid' } });
        return;
      }

      if (waliPhone !== undefined) {
        const normalizedWaliPhone = normalizePhone(waliPhone);
        const phoneOwner = await prisma.user.findFirst({
          where: {
            phone: normalizedWaliPhone,
            id: { not: murid.waliId }
          }
        });
        if (phoneOwner) {
          res.status(409).json({ error: { code: 'CONFLICT', message: 'Nomor hape wali sudah digunakan akun lain' } });
          return;
        }
      }

      // Ambil email existing wali untuk handle generate email jika kosong
      const currentWali = await prisma.user.findUnique({
        where: { id: murid.waliId },
        select: { email: true, phone: true },
      });

      const normalizedWaliPhone = waliPhone !== undefined ? normalizePhone(waliPhone) : currentWali?.phone;
      const resolvedWaliEmail = waliEmail !== undefined
        ? waliEmail
        : (currentWali?.email || generateWaliEmail(normalizedWaliPhone!));

      await prisma.user.update({
        where: { id: murid.waliId },
        data: {
          ...(waliName !== undefined ? { name: waliName } : {}),
          ...(waliPhone !== undefined ? { phone: normalizedWaliPhone } : {}),
          ...(waliEmail !== undefined || !currentWali?.email ? { email: resolvedWaliEmail } : {}),
        },
      });

      if (supabaseAdmin) {
        const updateAuthPayload: Record<string, any> = {};
        if (waliPhone !== undefined) updateAuthPayload.phone = normalizedWaliPhone;
        if (waliEmail !== undefined || !currentWali?.email) updateAuthPayload.email = resolvedWaliEmail;

        const metadata: Record<string, any> = {};
        if (waliName !== undefined) metadata.name = waliName;
        if (waliPhone !== undefined) metadata.phone = normalizedWaliPhone;

        if (Object.keys(metadata).length > 0) {
          updateAuthPayload.user_metadata = metadata;
        }

        if (Object.keys(updateAuthPayload).length > 0) {
          const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
            murid.waliId,
            updateAuthPayload
          );
          if (authError) {
            console.error('Failed to sync auth update to Supabase:', authError);
          }
        }
      }
    }

    const updated = await prisma.murid.update({
      where: { id: req.params.id },
      data: updateData,
      include: { wali: { select: { id: true, name: true, phone: true, email: true } } },
    });

    res.json({ data: updated });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Murid not found' } });
      return;
    }
    console.error('Error updating admin murid:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.delete('/api/admin/murids/:id', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const murid = await prisma.murid.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { enrollments: true, sessions: true } } },
    });

    if (!murid) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Murid not found' } });
      return;
    }

    if (murid._count.enrollments > 0 || murid._count.sessions > 0) {
      const updated = await prisma.murid.update({
        where: { id: murid.id },
        data: { active: false },
      });
      res.json({ data: updated, deactivated: true });
      return;
    }

    await prisma.murid.delete({ where: { id: murid.id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting admin murid:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

// 15. Admin-Only Enrollment Management
app.get('/api/admin/enrollments', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const status = typeof req.query.status === 'string' && req.query.status !== ''
      ? req.query.status
      : undefined;
    const muridId = typeof req.query.muridId === 'string' && req.query.muridId !== ''
      ? req.query.muridId
      : undefined;
    const programId = typeof req.query.programId === 'string' && req.query.programId !== ''
      ? req.query.programId
      : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';

    const where = {
      ...(status ? { status } : {}),
      ...(muridId ? { muridId } : {}),
      ...(programId ? { programId } : {}),
      ...(search ? {
        murid: { name: { contains: search, mode: 'insensitive' as const } },
      } : {}),
    };

    const [enrollments, total] = await prisma.$transaction([
      prisma.enrollment.findMany({
        where,
        include: {
          murid: { select: { id: true, name: true, active: true } },
          program: { select: { id: true, name: true, slug: true, active: true } },
          tentor: { select: { id: true, name: true } },
          _count: { select: { invoices: true } },
        },
        orderBy: { startedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.enrollment.count({ where }),
    ]);

    res.json({
      data: enrollments,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching admin enrollments:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.post('/api/admin/enrollments', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  const parsed = createEnrollmentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid enrollment data',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  const { muridId, programId, startedAt, tentorId } = parsed.data;

  try {
    const [murid, program] = await prisma.$transaction([
      prisma.murid.findUnique({ where: { id: muridId }, select: { id: true, active: true } }),
      prisma.program.findUnique({ where: { id: programId }, select: { id: true, active: true } }),
    ]);

    if (!murid) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Murid tidak ditemukan' } });
      return;
    }
    if (!murid.active) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Murid nonaktif tidak dapat di-enroll' } });
      return;
    }
    if (!program) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Program tidak ditemukan' } });
      return;
    }
    if (!program.active) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Program nonaktif tidak dapat dipilih' } });
      return;
    }

    if (tentorId) {
      const tentorUser = await prisma.user.findUnique({ where: { id: tentorId } });
      if (!tentorUser || tentorUser.role !== 'tentor') {
        res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Tentor tidak valid' } });
        return;
      }
    }

    const duplicate = await prisma.enrollment.findFirst({
      where: { muridId, programId, status: 'active' },
      select: { id: true },
    });
    if (duplicate) {
      res.status(409).json({
        error: { code: 'CONFLICT', message: 'Murid sudah memiliki enrollment aktif untuk program ini' },
      });
      return;
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        muridId,
        programId,
        status: 'active',
        startedAt: startedAt ? new Date(startedAt) : new Date(),
        tentorId: tentorId || null,
      },
      include: {
        murid: { select: { id: true, name: true } },
        program: { select: { id: true, name: true } },
        tentor: { select: { id: true, name: true } },
      },
    });

    res.status(201).json({ data: enrollment });
  } catch (error) {
    console.error('Error creating admin enrollment:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.get('/api/admin/enrollments/:id', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: req.params.id },
      include: {
        murid: { select: { id: true, name: true, schoolLevel: true, active: true } },
        program: { select: { id: true, name: true, slug: true, category: true, basePrice: true, sessionsPerBlock: true, active: true } },
        tentor: { select: { id: true, name: true, phone: true } },
        invoices: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!enrollment) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Enrollment not found' } });
      return;
    }

    res.json({ data: enrollment });
  } catch (error) {
    console.error('Error fetching admin enrollment:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.patch('/api/admin/enrollments/:id', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  const parsed = updateEnrollmentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid enrollment data',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  if (Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'At least one field is required' } });
    return;
  }

  const { muridId, programId, status, startedAt, tentorId } = parsed.data;

  try {
    const existing = await prisma.enrollment.findUnique({
      where: { id: req.params.id },
      select: { id: true },
    });
    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Enrollment not found' } });
      return;
    }

    if (tentorId) {
      const tentorUser = await prisma.user.findUnique({ where: { id: tentorId } });
      if (!tentorUser || tentorUser.role !== 'tentor') {
        res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Tentor tidak valid' } });
        return;
      }
    }

    if (status === 'active' && (muridId || programId)) {
      const targetMuridId = muridId || undefined;
      const targetProgramId = programId || undefined;
      const current = await prisma.enrollment.findUnique({
        where: { id: req.params.id },
        select: { muridId: true, programId: true },
      });
      const duplicate = await prisma.enrollment.findFirst({
        where: {
          id: { not: req.params.id },
          muridId: targetMuridId ?? current?.muridId,
          programId: targetProgramId ?? current?.programId,
          status: 'active',
        },
        select: { id: true },
      });
      if (duplicate) {
        res.status(409).json({
          error: { code: 'CONFLICT', message: 'Murid sudah memiliki enrollment aktif untuk program ini' },
        });
        return;
      }
    }

    const enrollment = await prisma.enrollment.update({
      where: { id: req.params.id },
      data: {
        ...(muridId !== undefined ? { muridId } : {}),
        ...(programId !== undefined ? { programId } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(startedAt !== undefined && startedAt ? { startedAt: new Date(startedAt) } : {}),
        ...(tentorId !== undefined ? { tentorId: tentorId || null } : {}),
      },
      include: {
        murid: { select: { id: true, name: true } },
        program: { select: { id: true, name: true } },
        tentor: { select: { id: true, name: true } },
      },
    });

    res.json({ data: enrollment });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Enrollment not found' } });
      return;
    }
    console.error('Error updating admin enrollment:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

// 16. Admin-Only Invoice Management
app.get('/api/admin/invoices', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const status = typeof req.query.status === 'string' && req.query.status !== ''
      ? req.query.status
      : undefined;
    const muridId = typeof req.query.muridId === 'string' && req.query.muridId !== ''
      ? req.query.muridId
      : undefined;
    const programId = typeof req.query.programId === 'string' && req.query.programId !== ''
      ? req.query.programId
      : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';

    const where = {
      ...(status ? { status } : {}),
      ...(muridId ? { enrollment: { muridId } } : {}),
      ...(programId ? { enrollment: { programId } } : {}),
      ...(search ? {
        enrollment: {
          murid: { name: { contains: search, mode: 'insensitive' as const } },
        },
      } : {}),
    };

    const [invoices, total] = await prisma.$transaction([
      prisma.invoice.findMany({
        where,
        include: {
          enrollment: {
            select: {
              id: true,
              status: true,
              murid: { select: { id: true, name: true } },
              program: { select: { id: true, name: true, slug: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    res.json({
      data: invoices,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching admin invoices:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.post('/api/admin/invoices', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  const parsed = createInvoiceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid invoice data',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  const { enrollmentId, amount, dueAt, note } = parsed.data;

  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      select: { id: true, status: true, muridId: true, programId: true },
    });
    if (!enrollment) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Enrollment tidak ditemukan' } });
      return;
    }
    if (enrollment.status !== 'active') {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invoice hanya bisa diterbitkan untuk enrollment aktif' } });
      return;
    }

    const invoice = await prisma.invoice.create({
      data: {
        enrollmentId,
        amount,
        status: 'unpaid',
        dueAt: new Date(dueAt),
        note: note || null,
      },
      include: {
        enrollment: {
          select: {
            id: true,
            murid: { select: { id: true, name: true } },
            program: { select: { id: true, name: true } },
          },
        },
      },
    });

    res.status(201).json({ data: invoice });
  } catch (error) {
    console.error('Error creating admin invoice:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.get('/api/admin/invoices/:id', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: {
        enrollment: {
          include: {
            murid: { select: { id: true, name: true, schoolLevel: true } },
            program: { select: { id: true, name: true, slug: true, category: true } },
          },
        },
      },
    });

    if (!invoice) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Invoice not found' } });
      return;
    }

    res.json({ data: invoice });
  } catch (error) {
    console.error('Error fetching admin invoice:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.patch('/api/admin/invoices/:id', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  const parsed = updateInvoiceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid invoice data',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  if (Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'At least one field is required' } });
    return;
  }

  const { amount, dueAt, note } = parsed.data;

  try {
    const existing = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      select: { id: true },
    });
    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Invoice not found' } });
      return;
    }

    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: {
        ...(amount !== undefined ? { amount } : {}),
        ...(dueAt !== undefined ? { dueAt: new Date(dueAt) } : {}),
        ...(note !== undefined ? { note: note || null } : {}),
      },
    });

    res.json({ data: invoice });
  } catch (error) {
    console.error('Error updating admin invoice:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.patch('/api/admin/invoices/:id/status', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  const parsed = invoiceStatusSchema.safeParse(req.body?.status);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid invoice status',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  const status = parsed.data;

  try {
    const existing = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      select: { id: true, status: true, paidAt: true },
    });
    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Invoice not found' } });
      return;
    }

    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: {
        status,
        paidAt: status === 'paid' ? new Date() : null,
      },
    });

    res.json({ data: invoice });
  } catch (error) {
    console.error('Error updating admin invoice status:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

// 17. Admin-Only Payment Accounts Management
app.get('/api/admin/payment-accounts', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const accounts = await prisma.paymentAccount.findMany({
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });
    res.json({ data: accounts });
  } catch (error) {
    console.error('Error fetching admin payment accounts:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.post('/api/admin/payment-accounts', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  const parsed = createPaymentAccountSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid payment account data',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  const { bankName, accountNumber, accountName, isActive, isDefault, note } = parsed.data;

  try {
    if (isDefault) {
      await prisma.paymentAccount.updateMany({ data: { isDefault: false } });
    }

    const account = await prisma.paymentAccount.create({
      data: {
        bankName,
        accountNumber,
        accountName,
        isActive,
        isDefault,
        note: note || null,
      },
    });

    res.status(201).json({ data: account });
  } catch (error) {
    console.error('Error creating admin payment account:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.patch('/api/admin/payment-accounts/:id', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  const parsed = updatePaymentAccountSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid payment account data',
        details: parsed.error.flatten(),
      },
    });
    return;
  }

  if (Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'At least one field is required' } });
    return;
  }

  const { bankName, accountNumber, accountName, isActive, isDefault, note } = parsed.data;

  try {
    const existing = await prisma.paymentAccount.findUnique({
      where: { id: req.params.id },
      select: { id: true },
    });
    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Payment account not found' } });
      return;
    }

    if (isDefault) {
      await prisma.paymentAccount.updateMany({
        where: { id: { not: req.params.id } },
        data: { isDefault: false },
      });
    }

    const account = await prisma.paymentAccount.update({
      where: { id: req.params.id },
      data: {
        ...(bankName !== undefined ? { bankName } : {}),
        ...(accountNumber !== undefined ? { accountNumber } : {}),
        ...(accountName !== undefined ? { accountName } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
        ...(isDefault !== undefined ? { isDefault } : {}),
        ...(note !== undefined ? { note: note || null } : {}),
      },
    });

    res.json({ data: account });
  } catch (error) {
    console.error('Error updating admin payment account:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.delete('/api/admin/payment-accounts/:id', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const existing = await prisma.paymentAccount.findUnique({
      where: { id: req.params.id },
      select: { id: true, isDefault: true },
    });
    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Payment account not found' } });
      return;
    }
    if (existing.isDefault) {
      res.status(400).json({ error: { code: 'FORBIDDEN', message: 'Rekening default tidak dapat dihapus. Ubah default dulu.' } });
      return;
    }

    await prisma.paymentAccount.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting admin payment account:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

// 17.5 Tentor Sessions CRUD (Terproteksi - Tentor manual per enrollment)
app.post('/api/me/sessions', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'tentor') {
      res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Hanya tentor yang bisa membuat jadwal' } });
      return;
    }

    const parsed = createTentorSessionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Data jadwal tidak valid', details: parsed.error.flatten() } });
      return;
    }

    const { enrollmentId, date, startTime, endTime, location } = parsed.data;

    if (startTime >= endTime) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Jam selesai harus setelah jam mulai' } });
      return;
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      select: { id: true, muridId: true, programId: true, tentorId: true, status: true, murid: { select: { id: true, name: true, address: true } } },
    });

    if (!enrollment) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Enrollment tidak ditemukan' } });
      return;
    }
    if (enrollment.tentorId !== user.id) {
      res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Kamu bukan tentor untuk murid ini' } });
      return;
    }
    if (enrollment.status !== 'active') {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Enrollment tidak aktif' } });
      return;
    }

    const startsAt = new Date(`${date}T${startTime}:00+07:00`);
    const endsAt = new Date(`${date}T${endTime}:00+07:00`);

    if (isNaN(startsAt.getTime()) || isNaN(endsAt.getTime())) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Format tanggal/jam tidak valid' } });
      return;
    }

    const overlapping = await prisma.session.findFirst({
      where: {
        tentorId: user.id,
        status: { not: 'cancelled' },
        OR: [
          { startsAt: { lt: endsAt }, endsAt: { gt: startsAt } },
        ],
      },
      select: { id: true },
    });
    if (overlapping) {
      res.status(409).json({ error: { code: 'CONFLICT', message: 'Jadwal bentrok dengan sesi lain pada jam yang sama' } });
      return;
    }

    const session = await prisma.session.create({
      data: {
        programId: enrollment.programId,
        tentorId: user.id,
        muridId: enrollment.muridId,
        startsAt,
        endsAt,
        location: location || enrollment.murid.address || null,
        status: 'scheduled',
      },
      include: { murid: true, program: true },
    });

    res.status(201).json({ data: session });
  } catch (error) {
    console.error('Error creating tentor session:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.patch('/api/me/sessions/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'tentor') {
      res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Hanya tentor yang bisa ubah jadwal' } });
      return;
    }

    const parsed = updateTentorSessionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Data jadwal tidak valid', details: parsed.error.flatten() } });
      return;
    }

    const existing = await prisma.session.findUnique({ where: { id: req.params.id! }, select: { id: true, tentorId: true, status: true, startsAt: true, endsAt: true } });
    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Sesi tidak ditemukan' } });
      return;
    }
    if (existing.tentorId !== user.id) {
      res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Bukan sesi kamu' } });
      return;
    }
    if (existing.status === 'completed') {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Sesi sudah selesai tidak bisa diubah' } });
      return;
    }

    const hasReport = await prisma.dailyReport.findUnique({ where: { sessionId: existing.id }, select: { id: true } });
    if (hasReport && parsed.data.status === 'cancelled') {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Sesi yang sudah ada laporan tidak bisa dibatalkan' } });
      return;
    }

    let newStartsAt: Date | undefined;
    let newEndsAt: Date | undefined;
    if (parsed.data.date || parsed.data.startTime || parsed.data.endTime) {
      const baseDate = parsed.data.date || existing.startsAt.toISOString().slice(0,10);
      const sTime = parsed.data.startTime || `${String(existing.startsAt.getHours()).padStart(2,'0')}:${String(existing.startsAt.getMinutes()).padStart(2,'0')}`;
      const eTime = parsed.data.endTime || `${String(existing.endsAt.getHours()).padStart(2,'0')}:${String(existing.endsAt.getMinutes()).padStart(2,'0')}`;
      const baseWib = new Date(`${baseDate}T${sTime}:00+07:00`);
      const baseWibEnd = new Date(`${baseDate}T${eTime}:00+07:00`);
      if (!isNaN(baseWib.getTime())) newStartsAt = baseWib;
      if (!isNaN(baseWibEnd.getTime())) newEndsAt = baseWibEnd;
    }

    if (newStartsAt && newEndsAt && newStartsAt >= newEndsAt) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Jam selesai harus setelah jam mulai' } });
      return;
    }

    if (newStartsAt || newEndsAt) {
      const sAt = newStartsAt || existing.startsAt;
      const eAt = newEndsAt || existing.endsAt;
      const overlapping = await prisma.session.findFirst({
        where: {
          id: { not: existing.id },
          tentorId: user.id,
          status: { not: 'cancelled' },
          startsAt: { lt: eAt },
          endsAt: { gt: sAt },
        },
        select: { id: true },
      });
      if (overlapping) {
        res.status(409).json({ error: { code: 'CONFLICT', message: 'Jadwal bentrok' } });
        return;
      }
    }

    const updated = await prisma.session.update({
      where: { id: existing.id },
      data: {
        ...(newStartsAt ? { startsAt: newStartsAt } : {}),
        ...(newEndsAt ? { endsAt: newEndsAt } : {}),
        ...(parsed.data.location !== undefined ? { location: parsed.data.location || null } : {}),
        ...(parsed.data.status !== undefined ? { status: parsed.data.status } : {}),
      },
      include: { murid: true, program: true },
    });

    res.json({ data: updated });
  } catch (error) {
    console.error('Error updating tentor session:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.delete('/api/me/sessions/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'tentor') {
      res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Hanya tentor' } });
      return;
    }
    const existing = await prisma.session.findUnique({ where: { id: req.params.id! }, select: { id: true, tentorId: true, status: true } });
    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Sesi tidak ditemukan' } });
      return;
    }
    if (existing.tentorId !== user.id) {
      res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Bukan sesi kamu' } });
      return;
    }
    const hasReport = await prisma.dailyReport.findUnique({ where: { sessionId: existing.id }, select: { id: true } });
    if (hasReport) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Sesi dengan laporan tidak bisa dihapus. Batalkan jika perlu.' } });
      return;
    }
    if (existing.status === 'completed') {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Sesi selesai tidak bisa dihapus' } });
      return;
    }
    await prisma.session.delete({ where: { id: existing.id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting tentor session:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

// 17.6 Admin Sessions (Terproteksi - Admin, pilih enrollment)
app.get('/api/admin/sessions', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        murid: true,
        program: true,
        tentor: { select: { id: true, name: true } },
        dailyReport: { select: { id: true } },
      },
      orderBy: { startsAt: 'asc' },
    });
    res.json({ data: sessions });
  } catch (error) {
    console.error('Error fetching admin sessions:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.post('/api/admin/sessions', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const parsed = createTentorSessionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Data jadwal tidak valid', details: parsed.error.flatten() } });
      return;
    }

    const { enrollmentId, date, startTime, endTime, location } = parsed.data;

    if (startTime >= endTime) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Jam selesai harus setelah jam mulai' } });
      return;
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      select: { id: true, muridId: true, programId: true, tentorId: true, status: true, murid: { select: { id: true, name: true, address: true } } },
    });

    if (!enrollment) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Enrollment tidak ditemukan' } });
      return;
    }
    if (enrollment.status !== 'active') {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Enrollment tidak aktif' } });
      return;
    }

    const startsAt = new Date(`${date}T${startTime}:00+07:00`);
    const endsAt = new Date(`${date}T${endTime}:00+07:00`);

    if (isNaN(startsAt.getTime()) || isNaN(endsAt.getTime())) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Format tanggal/jam tidak valid' } });
      return;
    }

    const overlapping = await prisma.session.findFirst({
      where: {
        tentorId: enrollment.tentorId!,
        status: { not: 'cancelled' },
        OR: [{ startsAt: { lt: endsAt }, endsAt: { gt: startsAt } }],
      },
      select: { id: true },
    });
    if (overlapping) {
      res.status(409).json({ error: { code: 'CONFLICT', message: 'Jadwal bentrok dengan sesi lain pada jam yang sama' } });
      return;
    }

    const session = await prisma.session.create({
      data: {
        programId: enrollment.programId,
        tentorId: enrollment.tentorId!,
        muridId: enrollment.muridId,
        startsAt,
        endsAt,
        location: location || enrollment.murid.address || null,
        status: 'scheduled',
      },
      include: { murid: true, program: true, tentor: { select: { id: true, name: true } } },
    });

    res.status(201).json({ data: session });
  } catch (error) {
    console.error('Error creating admin session:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.patch('/api/admin/sessions/:id', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const parsed = updateTentorSessionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Data jadwal tidak valid', details: parsed.error.flatten() } });
      return;
    }

    const existing = await prisma.session.findUnique({ where: { id: req.params.id! }, select: { id: true, tentorId: true, status: true, startsAt: true, endsAt: true } });
    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Sesi tidak ditemukan' } });
      return;
    }
    if (existing.status === 'completed') {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Sesi sudah selesai tidak bisa diubah' } });
      return;
    }

    const hasReport = await prisma.dailyReport.findUnique({ where: { sessionId: existing.id }, select: { id: true } });
    if (hasReport && parsed.data.status === 'cancelled') {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Sesi yang sudah ada laporan tidak bisa dibatalkan' } });
      return;
    }

    let newStartsAt: Date | undefined;
    let newEndsAt: Date | undefined;
    if (parsed.data.date || parsed.data.startTime || parsed.data.endTime) {
      const baseDate = parsed.data.date || existing.startsAt.toISOString().slice(0, 10);
      const sTime = parsed.data.startTime || `${String(existing.startsAt.getHours()).padStart(2, '0')}:${String(existing.startsAt.getMinutes()).padStart(2, '0')}`;
      const eTime = parsed.data.endTime || `${String(existing.endsAt.getHours()).padStart(2, '0')}:${String(existing.endsAt.getMinutes()).padStart(2, '0')}`;
      const baseWib = new Date(`${baseDate}T${sTime}:00+07:00`);
      const baseWibEnd = new Date(`${baseDate}T${eTime}:00+07:00`);
      if (!isNaN(baseWib.getTime())) newStartsAt = baseWib;
      if (!isNaN(baseWibEnd.getTime())) newEndsAt = baseWibEnd;
    }

    if (newStartsAt && newEndsAt && newStartsAt >= newEndsAt) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Jam selesai harus setelah jam mulai' } });
      return;
    }

    if (newStartsAt || newEndsAt) {
      const sAt = newStartsAt || existing.startsAt;
      const eAt = newEndsAt || existing.endsAt;
      const overlapping = await prisma.session.findFirst({
        where: {
          id: { not: existing.id },
          tentorId: existing.tentorId,
          status: { not: 'cancelled' },
          startsAt: { lt: eAt },
          endsAt: { gt: sAt },
        },
        select: { id: true },
      });
      if (overlapping) {
        res.status(409).json({ error: { code: 'CONFLICT', message: 'Jadwal bentrok' } });
        return;
      }
    }

    const updated = await prisma.session.update({
      where: { id: existing.id },
      data: {
        ...(newStartsAt ? { startsAt: newStartsAt } : {}),
        ...(newEndsAt ? { endsAt: newEndsAt } : {}),
        ...(parsed.data.location !== undefined ? { location: parsed.data.location || null } : {}),
        ...(parsed.data.status !== undefined ? { status: parsed.data.status } : {}),
      },
      include: { murid: true, program: true, tentor: { select: { id: true, name: true } } },
    });

    res.json({ data: updated });
  } catch (error) {
    console.error('Error updating admin session:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

app.delete('/api/admin/sessions/:id', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const existing = await prisma.session.findUnique({ where: { id: req.params.id! }, select: { id: true, status: true } });
    if (!existing) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Sesi tidak ditemukan' } });
      return;
    }
    const hasReport = await prisma.dailyReport.findUnique({ where: { sessionId: existing.id }, select: { id: true } });
    if (hasReport) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Sesi dengan laporan tidak bisa dihapus. Batalkan jika perlu.' } });
      return;
    }
    if (existing.status === 'completed') {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Sesi selesai tidak bisa dihapus' } });
      return;
    }
    await prisma.session.delete({ where: { id: existing.id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting admin session:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

// 18. Public Payment Accounts (terproteksi auth - dipakai wali)
app.get('/api/payment-accounts', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const accounts = await prisma.paymentAccount.findMany({
      where: { isActive: true },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });
    res.json({ data: accounts });
  } catch (error) {
    console.error('Error fetching payment accounts:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
});

// Start Server
async function startServer() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to database via Prisma.');
    
    app.listen(PORT, () => {
      console.log(`Express API Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

// Re-export types
export type {
  User,
  Murid,
  Program,
  RoadmapStep,
  Session,
  MaterialItem,
  Enrollment,
  Invoice,
  DailyReport,
  ProgressReport,
  Progress
} from '@prisma/client';
