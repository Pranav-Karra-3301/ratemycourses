"use client";

// Browse page lets users filter the seeded course directory by query and department.
import { useMemo, useState } from "react";
import { CourseCard } from "@/components/CourseCard";
import { courses } from "@/lib/courses";

export default function BrowsePage() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const departments = ["All", ...Array.from(new Set(courses.map((course) => course.department)))];

  const filteredCourses = useMemo(() => {
    const normalized = query.toLowerCase();
    return courses.filter((course) => {
      const matchesQuery = `${course.code} ${course.title} ${course.professor}`.toLowerCase().includes(normalized);
      const matchesDepartment = department === "All" || course.department === department;
      return matchesQuery && matchesDepartment;
    });
  }, [department, query]);

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
