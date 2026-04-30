"use client";

// Course detail page shows course metadata and review cards sorted by community score.
import Link from "next/link";
import { useParams } from "next/navigation";
import { ReviewCard } from "@/components/ReviewCard";
import { StatPill } from "@/components/StatPill";
import { getCourse } from "@/lib/courses";
import { useCourseReviews } from "@/hooks/useCourseReviews";

export default function CourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const course = getCourse(params.courseId);
  const reviews = useCourseReviews(params.courseId);

  if (!course) {
    return (
      <div className="border border-line bg-panel p-8">
        <h1 className="font-serif text-5xl text-paper">Course not found</h1>
        <Link href="/browse" className="mt-6 inline-block font-mono text-xs uppercase text-accent">
          Back to browse
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="border-b border-line pb-8">
        <p className="font-mono text-xs uppercase text-accent">{course.department}</p>
        <h1 className="mt-3 font-serif text-6xl leading-none text-paper">{course.code}</h1>
        <p className="mt-3 max-w-2xl text-muted">{course.title}</p>
        <div className="mt-6 grid gap-2 sm:grid-cols-4">
          <StatPill label="Average" value={course.averageRating.toFixed(1)} />
          <StatPill label="Difficulty" value={course.difficulty.toFixed(1)} />
          <StatPill label="Credits" value={course.credits} />
          <StatPill label="Professor" value={course.professor} />
        </div>
      </header>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase text-accent">Reviews</p>
          <h2 className="mt-2 font-serif text-4xl text-paper">Sorted by on-chain score</h2>
        </div>
        <Link
          href={`/submit?course=${course.id}`}
          className="border border-accent px-4 py-3 font-mono text-xs uppercase text-accent transition hover:bg-accent hover:text-ink"
        >
          Review this course
        </Link>
      </div>
      <section className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => <ReviewCard key={review.id.toString()} review={review} />)
        ) : (
          <div className="border border-line bg-panel p-6 text-sm text-muted">No reviews yet.</div>
        )}
      </section>
    </div>
  );
}
