import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { UserRole } from '@nurman-course/shared';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'nurmancourse-dev-secret-key-fallback';
const JWT_EXPIRES_IN = '7d';

export interface TokenPayload {
  id: string;
  email?: string;
  role: UserRole;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    if (!decoded || typeof decoded.id !== 'string') return null;
    return decoded;
  } catch {
    return null;
  }
}
