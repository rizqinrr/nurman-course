import { Suspense } from "react";
import RoadmapClient from "./RoadmapClient";

export default function AdminRoadmapPage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-indigo-50 font-semibold">
        Memuat halaman roadmap...
      </div>
    }>
      <RoadmapClient />
    </Suspense>
  );
}
