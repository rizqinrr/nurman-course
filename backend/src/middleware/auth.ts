import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { userRoleSchema, type UserRole } from "@nurman-course/shared";
import { prisma } from "../lib/prisma";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("WARNING: SUPABASE_URL or SUPABASE_ANON_KEY is not defined in backend .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role: UserRole;
  };
}

export function validateAccountAccess(account: { role: unknown; active: boolean } | null):
  | { ok: true; role: UserRole }
  | { ok: false; error: { code: string; message: string } } {
  if (!account) {
    return { ok: false, error: { code: "PROFILE_NOT_FOUND", message: "Profil akun tidak ditemukan. Hubungi admin." } };
  }
  if (account.active !== true) {
    return {
      ok: false,
      error: {
        code: "ACCOUNT_INACTIVE",
        message: "Akun nonaktif. Silakan daftar ulang atau hubungi admin. Penggunaan email atau nomor yang sama memerlukan persetujuan admin.",
      },
    };
  }
  const role = userRoleSchema.safeParse(account.role);
  if (!role.success) {
    return { ok: false, error: { code: "INVALID_ROLE", message: "Role akun tidak valid. Hubungi admin." } };
  }
  return { ok: true, role: role.data };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = /^Bearer ([^\s]+)$/.exec(req.headers.authorization ?? "")?.[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized: Missing or invalid token format" });
    return;
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error && ![400, 401, 403].includes(error.status ?? 0)) {
      throw error;
    }
    if (error || !user) {
      res.status(401).json({ error: "Unauthorized: Invalid or expired session token" });
      return;
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, role: true, active: true },
    });
    const access = validateAccountAccess(dbUser);
    if (!access.ok) {
      res.status(403).json({ error: access.error });
      return;
    }

    req.user = {
      id: user.id,
      email: dbUser?.email || undefined,
      role: access.role,
    };
  } catch {
    console.error("Auth middleware error");
    res.status(500).json({ error: "Internal server error during authentication" });
    return;
  }

  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: roles.length === 1 && roles[0] === "admin"
            ? "Admin access is required"
            : "Access is not allowed for this role",
        },
      });
      return;
    }

    next();
  };
}

export const requireAdmin = requireRole("admin");
