import { Request, Response, NextFunction, type RequestHandler } from "express";
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

export type AuthenticatedUser = NonNullable<AuthenticatedRequest["user"]>;

type AuthenticationResult =
  | { ok: true; user: AuthenticatedUser | null }
  | { ok: false; status: 401 | 403 | 500; body: { error: string | { code: string; message: string } } };

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

async function resolveAuthentication(req: Request, allowAnonymous: boolean): Promise<AuthenticationResult> {
  const authorization = req.headers.authorization;
  if (authorization === undefined && allowAnonymous) return { ok: true, user: null };

  const token = /^Bearer ([^\s]+)$/.exec(authorization ?? "")?.[1];
  if (!token) {
    return {
      ok: false,
      status: 401,
      body: { error: "Unauthorized: Missing or invalid token format" },
    };
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error && ![400, 401, 403].includes(error.status ?? 0)) throw error;
    if (error || !user) {
      return {
        ok: false,
        status: 401,
        body: { error: "Unauthorized: Invalid or expired session token" },
      };
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, role: true, active: true },
    });
    const access = validateAccountAccess(dbUser);
    if (!access.ok) return { ok: false, status: 403, body: { error: access.error } };

    return {
      ok: true,
      user: { id: user.id, email: dbUser?.email || undefined, role: access.role },
    };
  } catch {
    console.error("Auth middleware error");
    return {
      ok: false,
      status: 500,
      body: { error: "Internal server error during authentication" },
    };
  }
}

export function resolveOptionalAuth(req: Request): Promise<AuthenticationResult> {
  return resolveAuthentication(req, true);
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const result = await resolveAuthentication(req, false);
  if (!result.ok) {
    res.status(result.status).json(result.body);
    return;
  }
  if (!result.user) {
    res.status(401).json({ error: "Unauthorized: Missing or invalid token format" });
    return;
  }
  req.user = result.user;
  next();
}

export const optionalAuth: RequestHandler = async (req, res, next) => {
  const authenticatedRequest = req as AuthenticatedRequest;
  delete authenticatedRequest.user;
  const result = await resolveOptionalAuth(req);
  if (!result.ok) {
    res.status(result.status).json(result.body);
    return;
  }
  if (result.user) (req as AuthenticatedRequest).user = result.user;
  next();
};

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
