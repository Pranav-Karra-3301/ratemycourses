"use client";

// Home page introduces the dApp and routes users into course discovery or review submission.
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CourseCard } from "@/components/CourseCard";
import { ReviewCard } from "@/components/ReviewCard";
import { courses, sampleReviews } from "@/lib/courses";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => {
    const normalized = query.toLowerCase();
    return courses
      .filter((course) => `${course.code} ${course.title} ${course.department}`.toLowerCase().includes(normalized))
      .slice(0, 2);
  }, [query]);

  return (
    <div className="space-y-12">
      <section className="grid gap-8 border-b border-line pb-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase text-accent">Anonymous / On-chain / Student-owned</p>
          <h1 className="mt-5 max-w-4xl font-serif text-6xl leading-none text-paper sm:text-7xl">
            Course reviews that cannot quietly disappear.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted">
            RateMyCourses lets students publish candid feedback, keep review metadata on-chain, and use community voting to surface what future students should know.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/browse"
              className="inline-flex h-11 items-center gap-2 border border-accent px-4 font-mono text-xs uppercase text-accent transition hover:bg-accent hover:text-ink"
            >
              Browse courses
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/submit"
              className="inline-flex h-11 items-center gap-2 border border-line px-4 font-mono text-xs uppercase text-paper transition hover:border-accent hover:text-accent"
            >
              Submit review
            </Link>
          </div>
        </div>
        <div className="border border-line bg-panel p-4">
          <label className="flex items-center gap-3 border border-line bg-ink px-3 py-3">
            <Search size={18} className="text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search course, professor, department"
              className="w-full bg-transparent font-mono text-sm text-paper outline-none placeholder:text-muted"
            />
          </label>
          <div className="mt-4 space-y-3">
            {matches.map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`} className="block border border-line p-3 transition hover:border-accent">
                <p className="font-mono text-xs text-accent">{course.code}</p>
                <p className="mt-1 text-sm text-paper">{course.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase text-accent">Featured</p>
            <h2 className="mt-2 font-serif text-4xl text-paper">Courses getting attention</h2>
          </div>
          <Link href="/browse" className="font-mono text-xs uppercase text-muted hover:text-accent">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {courses.slice(0, 2).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section>
        <p className="font-mono text-xs uppercase text-accent">Recent review</p>
        <div className="mt-4">
          <ReviewCard review={sampleReviews[0]} />
        </div>
      </section>
    </div>
  );
}
