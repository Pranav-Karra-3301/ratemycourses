"use client";

import { useMemo } from "react";
import { sampleReviews } from "@/lib/courses";
import type { ReviewSummary } from "@/lib/types";

export function useCourseReviews(courseId?: string) {
  return useMemo<ReviewSummary[]>(() => {
    const reviews = courseId ? sampleReviews.filter((review) => review.courseId === courseId) : sampleReviews;
    return [...reviews].sort((a, b) => b.score - a.score);
  }, [courseId]);
}
