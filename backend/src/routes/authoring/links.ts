import { prisma } from '../../lib/prisma';

const INTERNAL_PATTERNS = [
  /\]\(\s*(\/materi\/[a-z0-9]+(?:-[a-z0-9]+)*)(?:[?#][^)\s]*)?/g,
  /^\s*\[[^\]]+\]:\s*(\/materi\/[a-z0-9]+(?:-[a-z0-9]+)*)(?:[?#][^\s]*)?/gm,
  /<\s*(\/materi\/[a-z0-9]+(?:-[a-z0-9]+)*)(?:[?#][^>\s]*)?\s*>/g,
  /href\s*=\s*["']\s*(\/materi\/[a-z0-9]+(?:-[a-z0-9]+)*)(?:[?#][^"']*)?["']/gi,
];

export function extractInternalSlugs(bodyText: string, selfSlug?: string | null): Set<string> {
  const slugs = new Set<string>();
  for (const pattern of INTERNAL_PATTERNS) {
    pattern.lastIndex = 0;
    for (const match of bodyText.matchAll(pattern)) {
      const slug = match[1].slice('/materi/'.length);
      if (!selfSlug || slug !== selfSlug) slugs.add(slug);
    }
  }
  return slugs;
}

export async function validateInternalLinks(bodyText: string, selfSlug?: string | null): Promise<string | null> {
  const slugs = extractInternalSlugs(bodyText, selfSlug);
  if (slugs.size === 0) return null;
  const existing = await prisma.lesson.findMany({
    where: { slug: { in: [...slugs] } },
    select: { slug: true },
  });
  const missing = [...slugs].filter((slug) => !existing.some((row) => row.slug === slug));
  return missing.length === 0 ? null : `Link internal menuju lesson tidak ditemukan: ${missing.join(', ')}`;
}
