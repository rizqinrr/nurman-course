import { Suspense } from "react";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import CourseConfigClient from "./CourseConfigClient";

function ConfigPageFallback() {
  return (
    <div className="space-y-5 pt-4 sm:space-y-6 sm:pt-8">
      <PageHeader
        title="Atur Jadwal"
        subtitle="Sesuaikan waktu dan kebutuhan belajar"
      />

      <GlassCard className="p-6 sm:p-8">
        <p className="text-sm text-gray-600 sm:text-base">
          Menyiapkan konfigurasi...
        </p>
      </GlassCard>
    </div>
  );
}

export default function CourseConfigPage() {
  return (
    <Suspense fallback={<ConfigPageFallback />}>
      <CourseConfigClient />
    </Suspense>
  );
}
