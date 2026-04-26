import type { ReactNode } from "react";

interface CourseLayoutProps {
  children: ReactNode;
}

export default function CourseLayout({ children }: CourseLayoutProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#4a70a9]/50 to-white p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">{children}</div>
    </main>
  );
}
