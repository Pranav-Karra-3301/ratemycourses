"use client";

// Browse page lets users filter seeded courses plus course IDs discovered from on-chain reviews.
import { useMemo, useState } from "react";
import { CourseCard } from "@/components/CourseCard";
import { buildCourseDirectory } from "@/lib/courses";
import { useAllReviews } from "@/hooks/useAllReviews";

export default function BrowsePage() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const liveReviews = useAllReviews();
  const courseDirectory = useMemo(() => buildCourseDirectory(liveReviews), [liveReviews]);
  const departments = ["All", ...Array.from(new Set(courseDirectory.map((course) => course.department)))];

  const filteredCourses = useMemo(() => {
    const normalized = query.toLowerCase();
    return courseDirectory.filter((course) => {
      const matchesQuery = `${course.code} ${course.title} ${course.professor} ${course.department} ${course.tags.join(" ")}`
        .toLowerCase()
        .includes(normalized);
      const matchesDepartment = department === "All" || course.department === department;
      return matchesQuery && matchesDepartment;
    });
  }, [courseDirectory, department, query]);

  return (
    <div className="space-y-8">
      <header className="border-b border-line pb-6">
        <p className="font-mono text-xs uppercase text-accent">Browse Courses</p>
        <h1 className="mt-3 font-serif text-5xl text-paper">Find the course before it finds you.</h1>
      </header>
      <section className="grid gap-3 border border-line bg-panel p-4 md:grid-cols-[1fr_260px]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by course, title, or professor"
          className="border border-line bg-ink px-3 py-3 font-mono text-sm text-paper outline-none"
        />
        <select
          value={department}
          onChange={(event) => setDepartment(event.target.value)}
          className="border border-line bg-ink px-3 py-3 font-mono text-sm text-paper"
        >
          {departments.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </section>
    </div>
  );
}
