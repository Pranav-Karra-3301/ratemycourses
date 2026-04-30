import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { StatPill } from "@/components/StatPill";
import type { Course } from "@/lib/types";

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="border border-line bg-panel p-5 transition hover:border-accent">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase text-accent">{course.department}</p>
          <h2 className="mt-2 font-serif text-3xl leading-tight text-paper">{course.code}</h2>
          <p className="mt-1 text-sm text-muted">{course.title}</p>
        </div>
        <Link
          href={`/courses/${course.id}`}
          className="inline-flex h-9 w-9 items-center justify-center border border-line text-muted transition hover:border-accent hover:text-accent"
          title={`Open ${course.code}`}
        >
          <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        <StatPill label="Rating" value={course.averageRating.toFixed(1)} />
        <StatPill label="Difficulty" value={course.difficulty.toFixed(1)} />
        <StatPill label="Reviews" value={course.reviewCount} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {course.tags.map((tag) => (
          <span key={tag} className="border border-line px-2 py-1 font-mono text-[10px] uppercase text-muted">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
