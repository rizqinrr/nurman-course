import type { Response } from 'express';

export function sendValidationError(res: Response, message: string, details?: unknown): void {
  res.status(400).json({
    error: {
      code: 'VALIDATION_ERROR',
      message,
      ...(details === undefined ? {} : { details }),
    },
  });
}

export function sendNotFound(res: Response, message: string): void {
  res.status(404).json({ error: { code: 'NOT_FOUND', message } });
}

export function sendForbidden(res: Response, message = 'Anda tidak memiliki akses ke konten ini'): void {
  res.status(403).json({ error: { code: 'FORBIDDEN', message } });
}

export function sendConflict(res: Response, message: string): void {
  res.status(409).json({ error: { code: 'CONFLICT', message } });
}

export function sendInternalError(res: Response, context: string): void {
  console.error(context);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
}

export function isPrismaError(error: unknown, code: string): boolean {
  return Boolean(error && typeof error === 'object' && 'code' in error && error.code === code);
}
