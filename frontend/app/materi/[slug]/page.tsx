import ContentShell from "@/components/content/ContentShell";
import LessonReader from "@/components/content/LessonReader";

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ContentShell><LessonReader slug={slug} /></ContentShell>;
}