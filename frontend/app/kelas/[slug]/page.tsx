import CourseDetail from "@/components/content/CourseDetail";

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CourseDetail slug={slug} />;
}
