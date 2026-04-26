"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function CourseCornerLogo() {
  const pathname = usePathname();

  if (pathname === "/course") {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-0 top-0 z-40"
    >
      <Image
        src="/Nlogo.png"
        alt="Logo Nurman Course"
        width={150}
        height={150}
        priority
        className="h-32 w-32 opacity-90 sm:h-28 sm:w-28"
      />
    </div>
  );
}
