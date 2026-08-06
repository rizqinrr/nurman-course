export interface User {
  id: string;
  role: "admin" | "tentor" | "wali";
  name: string;
  phone: string;
  email?: string;
  active?: boolean;
  address?: string | null;
  photoPath?: string | null;
}

export interface Murid {
  id: string;
  waliId: string;
  name: string;
  age: number;
  schoolLevel: string;
  avatarUrl?: string;
  active?: boolean;
}

export interface Program {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: "materi" | "jenjang" | "calistung";
  basePrice: number;
  sessionsPerBlock: number;
  active: boolean;
  hasRoadmap?: boolean;
}

export interface RoadmapStep {
  id: string;
  programId: string;
  order: number;
  title: string;
  bodyText: string;
  level: string;
}

export interface MaterialItem {
  id: string;
  roadmapStepId: string;
  order: number;
  title: string;
  bodyText: string;
}

export interface Session {
  id: string;
  programId: string;
  tentorId: string;
  muridId: string;
  startsAt: string;
  endsAt: string;
  location: string;
  status: "scheduled" | "cancelled" | "completed";
}

export interface Enrollment {
  id: string;
  muridId: string;
  programId: string;
  status: "active" | "completed" | "cancelled";
  startedAt: string;
}

export interface Progress {
  id: string;
  muridId: string;
  roadmapStepId: string;
  status: "in_progress" | "completed";
  updatedAt: string;
}

export interface Invoice {
  id: string;
  enrollmentId: string;
  muridId: string;
  amount: number;
  status: "unpaid" | "waiting" | "paid";
  period: string;
  dueAt: string;
  paidAt?: string;
  note?: string | null;
  breakdown: {
    label: string;
    amount: number;
  }[];
}

export interface DailyReport {
  id: string;
  sessionId: string;
  muridId: string;
  date: string;
  startTime: string;
  endTime: string;
  activity: string;
  notes: string;
}

export interface ProgressReport {
  id: string;
  muridId: string;
  programId: string;
  blockNumber: number;
  achievements: string[];
  masteredMaterials: string[];
  weakMaterials: string[];
  notes: string;
}

export interface DailyReportDetailed extends DailyReport {
  programName: string;
  tentorName: string;
}

export interface ProgressReportDetailed extends ProgressReport {
  programName: string;
  sessionsPerBlock: number;
}

export interface DailyReportForTentorDetailed extends DailyReport {
  programName: string;
  muridName: string;
  muridAge: number;
}

export interface ProgressReportForTentorDetailed extends ProgressReport {
  programName: string;
  muridName: string;
  muridAge: number;
  sessionsPerBlock: number;
}
