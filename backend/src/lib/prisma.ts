import dotenv from 'dotenv';
import { PrismaClient } from '../generated/client';

dotenv.config();

export const prisma = new PrismaClient(
  process.env.NODE_ENV !== 'production'
    ? { log: [{ level: 'query', emit: 'event' }] }
    : undefined
);

if (process.env.NODE_ENV !== 'production') {
  (prisma as any).$on('query', (e: any) => {
    console.log(`\x1b[36m[SQL]\x1b[0m ${e.query} \x1b[33m(${e.duration}ms)\x1b[0m`);
  });
}
