import express from 'express';
import type { Prisma } from '../../generated/client';
import { prisma } from '../../lib/prisma';
import { requireAuth, requireAdmin, type AuthenticatedRequest } from '../../middleware/auth';

export const trackingRouter = express.Router();

const MAX_USER_AGENT = 512;
const MAX_IP = 45;

function clientIp(req: AuthenticatedRequest): string | null {
  const ip = req.ip ?? req.socket?.remoteAddress ?? null;
  return typeof ip === 'string' && ip.length <= MAX_IP ? ip : null;
}

function safeUserAgent(req: AuthenticatedRequest): string | null {
  const raw = req.headers['user-agent'];
  if (typeof raw !== 'string') return null;
  const trimmed = raw.slice(0, MAX_USER_AGENT).trim();
  return trimmed.length > 0 ? trimmed : null;
}

trackingRouter.post('/api/track/login', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Token valid tidak memuat profil.' } });
    return;
  }

  try {
    const event = await prisma.trackingEvent.create({
      data: {
        eventType: 'login',
        userId: req.user.id,
        ipAddress: clientIp(req),
        userAgent: safeUserAgent(req),
      },
      select: { id: true },
    });
    res.status(201).json({ data: { id: event.id } });
  } catch {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Gagal mencatat login.' } });
  }
});

trackingRouter.get('/api/admin/tracking', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const pageRaw = Number(req.query.page);
    const limitRaw = Number(req.query.limit);
    const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;
    const limit = Number.isFinite(limitRaw) && limitRaw >= 1 && limitRaw <= 200 ? Math.floor(limitRaw) : 50;
    const typeParam = typeof req.query.type === 'string' ? req.query.type : null;
    const type = typeParam === 'login' || typeParam === 'lesson_read' ? typeParam : null;

    const where: Prisma.TrackingEventWhereInput = type ? { eventType: type } : {};
    const [total, events] = await prisma.$transaction([
      prisma.trackingEvent.count({ where }),
      prisma.trackingEvent.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          eventType: true,
          userId: true,
          lessonId: true,
          ipAddress: true,
          userAgent: true,
          createdAt: true,
          user: { select: { id: true, name: true, role: true } },
          lesson: { select: { slug: true, title: true } },
        },
      }),
    ]);

    res.json({
      data: {
        events,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Gagal memuat tracking.' } });
  }
});

trackingRouter.delete('/api/admin/tracking', requireAuth, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { count } = await prisma.trackingEvent.deleteMany({});
    res.json({ data: { deleted: count } });
  } catch {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Gagal menghapus tracking.' } });
  }
});
