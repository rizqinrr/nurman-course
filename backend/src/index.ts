import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Re-export model types for convenience
export type {
  User,
  Program,
  RoadmapStep,
  Session,
  MaterialItem,
  Enrollment,
  Invoice,
  Progress
} from '@prisma/client';

async function main() {
  try {
    await prisma.$connect();
    console.log('Prisma Client connected successfully.');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
}

if (require.main === module) {
  main();
}
