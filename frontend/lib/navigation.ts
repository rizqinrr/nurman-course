export function safeReturnPath(value: string | null): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  try {
    const url = new URL(value, "https://nurmancourse.local");
    if (url.origin !== "https://nurmancourse.local") return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

export function isContentReturnPath(value: string): boolean {
  return value === "/materi"
    || value.startsWith("/materi/")
    || value.startsWith("/kelas/")
    || value === "/app/materi";
}

export function roleHomePath(role: string | null | undefined): string {
  if (role === "admin") return "/app/admin";
  if (role === "tentor") return "/app/tentor/dashboard";
  if (role === "wali") return "/app/dashboard";
  return "/app/materi";
}
