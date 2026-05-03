import type { Course, ReviewSummary } from "@/lib/types";
import { formatCourseCode, normalizeCourseCode, normalizeCourseId } from "@/lib/courseCodes";

export const courses: Course[] = [
  {
    id: "CMPSC-473",
    code: "CMPSC 473",
    title: "Operating Systems Design",
    department: "Computer Science",
    professor: "Dr. Ada Chen",
    credits: 3,
    averageRating: 4.6,
    difficulty: 4.1,
    reviewCount: 18,
    tags: ["systems", "project-heavy", "useful"]
  },
  {
    id: "MATH-230",
    code: "MATH 230",
    title: "Calculus and Vector Analysis",
    department: "Mathematics",
    professor: "Prof. Eli Grant",
    credits: 4,
    averageRating: 3.8,
    difficulty: 4.4,
    reviewCount: 32,
    tags: ["proofs", "weekly quizzes", "curved"]
  },
  {
    id: "ENGL-202C",
    code: "ENGL 202C",
    title: "Technical Writing",
    department: "English",
    professor: "Dr. Maya Singh",
    credits: 3,
    averageRating: 4.3,
    difficulty: 2.2,
    reviewCount: 21,
    tags: ["writing", "portfolio", "practical"]
  },
  {
    id: "IST-402",
    code: "IST 402",
    title: "Emerging Issues in Technology",
    department: "Information Sciences",
    professor: "Prof. Noor Patel",
    credits: 3,
    averageRating: 4.0,
    difficulty: 3.0,
    reviewCount: 15,
    tags: ["discussion", "ethics", "current events"]
  }
];

export const sampleReviews: ReviewSummary[] = [
  {
    id: 1n,
    courseId: "CMPSC-473",
    semester: "Fall 2026",
    professor: "Dr. Ada Chen",
    overallRating: 5,
    difficultyRating: 4,
    workloadHours: 10,
    title: "Hard but worth taking",
    body: "The projects are demanding, but they finally made threads, memory, and file systems feel concrete.",
    tips: "Start projects the day they open and go to office hours with specific failing tests.",
    author: "0x9d8a12340000000000000000000000000000aBcd",
    contentHash: "ipfs://mock/cmpsc473-1",
    createdAt: 1780444800,
    score: 14,
    upvotes: 16,
    downvotes: 2,
    flags: 0
  },
  {
    id: 2n,
    courseId: "MATH-230",
    semester: "Spring 2026",
    professor: "Prof. Eli Grant",
    overallRating: 4,
    difficultyRating: 5,
    workloadHours: 8,
    title: "Exams are the whole game",
    body: "Lectures are clear, but the exam problems move faster than the homework. The curve helped a lot.",
    tips: "Redo old exams under time pressure instead of only rereading notes.",
    author: "0x71F3000000000000000000000000000000009A10",
    contentHash: "ipfs://mock/math230-1",
    createdAt: 1767225600,
    score: 8,
    upvotes: 10,
    downvotes: 2,
    flags: 0
  },
  {
    id: 3n,
    courseId: "ENGL-202C",
    semester: "Fall 2026",
    professor: "Dr. Maya Singh",
    overallRating: 4,
    difficultyRating: 2,
    workloadHours: 4,
    title: "Useful for internship docs",
    body: "The assignments map well to real resumes, memos, and technical instructions. Feedback is detailed.",
    tips: "Pick a technical topic you already know so the writing work stays focused.",
    author: "0x55e1000000000000000000000000000000000C05",
    contentHash: "ipfs://mock/engl202c-1",
    createdAt: 1783036800,
    score: 11,
    upvotes: 12,
    downvotes: 1,
    flags: 0
  }
];

export function getCourse(courseId: string) {
  const normalizedId = normalizeCourseId(courseId);
  return courses.find((course) => course.id === normalizedId);
}

export function buildCourseDirectory(reviews: ReviewSummary[] = []) {
  const byId = new Map<string, Course>(courses.map((course) => [course.id, course]));
  const groupedReviews = new Map<string, ReviewSummary[]>();

  reviews.forEach((review) => {
    const courseId = normalizeCourseId(review.courseId);
    groupedReviews.set(courseId, [...(groupedReviews.get(courseId) ?? []), review]);
  });

  groupedReviews.forEach((courseReviews, courseId) => {
    const seededCourse = byId.get(courseId);
    const reviewCount = courseReviews.length;
    const averageRating = average(courseReviews.map((review) => review.overallRating));
    const difficulty = average(courseReviews.map((review) => review.difficultyRating));
    const latestReview = [...courseReviews].sort((a, b) => b.createdAt - a.createdAt)[0];
    const normalized = normalizeCourseCode(courseId);

    byId.set(courseId, {
      id: courseId,
      code: seededCourse?.code ?? normalized?.code ?? formatCourseCode(courseId),
      title: seededCourse?.title ?? "Student-added course",
      department: seededCourse?.department ?? normalized?.department ?? "Custom",
      professor: professorFromReview(latestReview) ?? seededCourse?.professor ?? "Not listed",
      credits: seededCourse?.credits ?? 0,
      averageRating,
      difficulty,
      reviewCount,
      tags: seededCourse?.tags ?? ["on-chain", "student-added"]
    });
  });

  return [...byId.values()].sort((a, b) => {
    if (b.reviewCount !== a.reviewCount) {
      return b.reviewCount - a.reviewCount;
    }
    return a.code.localeCompare(b.code);
  });
}

export function reviewsForCourse(reviews: ReviewSummary[], courseId: string) {
  const normalizedId = normalizeCourseId(courseId);
  return reviews.filter((review) => normalizeCourseId(review.courseId) === normalizedId);
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function professorFromReview(review?: ReviewSummary) {
  if (!review || review.professor === "Not listed") {
    return undefined;
  }
  return review.professor;
}
