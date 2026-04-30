export type Course = {
  id: string;
  code: string;
  title: string;
  department: string;
  professor: string;
  credits: number;
  averageRating: number;
  difficulty: number;
  reviewCount: number;
  tags: string[];
};

export type ReviewContent = {
  title: string;
  body: string;
  tips: string;
};

export type ReviewDraft = ReviewContent & {
  courseId: string;
  semester: string;
  professor: string;
  overallRating: number;
  difficultyRating: number;
  workloadHours: number;
};

export type ReviewSummary = ReviewDraft & {
  id: bigint;
  author: string;
  contentHash: string;
  createdAt: number;
  score: number;
  upvotes: number;
  downvotes: number;
  flags: number;
};
