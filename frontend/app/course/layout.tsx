import type { ReactNode } from "react";
import CourseCornerLogo from "@/components/ui/CourseCornerLogo";

interface CourseLayoutProps {
  children: ReactNode;
}

export default function CourseLayout({ children }: CourseLayoutProps) {
  return (
    <main className="landing-map min-h-screen p-4 sm:p-6">
      <CourseCornerLogo />
      <div className="mx-auto max-w-2xl">{children}</div>
    </main>
  );
}
