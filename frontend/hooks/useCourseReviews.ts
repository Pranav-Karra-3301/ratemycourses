"use client";

import { useMemo } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { reviewRegistryAbi, votingContractAbi } from "@/lib/abi";
import { contractAddresses, contractsConfigured } from "@/lib/contracts";
import { sampleReviews } from "@/lib/courses";
import { resolveReviewContent } from "@/lib/ipfs";
import type { ReviewSummary } from "@/lib/types";
import type { Address } from "viem";

type ContractReview = {
  id: bigint;
  author: Address;
  courseId: string;
  semester: string;
  professor: string;
  overallRating: number;
  difficultyRating: number;
  workloadHours: number;
  contentHash: string;
  createdAt: bigint;
};

type ContractVoteTotals = {
  upvotes: bigint;
  downvotes: bigint;
  flags: bigint;
  score: bigint;
};

export function useCourseReviews(courseId?: string) {
  const { data: reviewIds } = useReadContract({
    address: contractAddresses.reviewRegistry,
    abi: reviewRegistryAbi,
    functionName: "getCourseReviewIds",
    args: courseId ? [courseId] : undefined,
    query: {
      enabled: Boolean(courseId && contractsConfigured)
    }
  });

  const ids = useMemo(() => [...(reviewIds ?? [])], [reviewIds]);

  const reviewCalls = useMemo(
    () =>
      ids.map((id) => ({
        address: contractAddresses.reviewRegistry,
        abi: reviewRegistryAbi,
        functionName: "getReview",
        args: [id]
      })),
    [ids]
  );

  const voteCalls = useMemo(
    () =>
      ids.map((id) => ({
        address: contractAddresses.votingContract,
        abi: votingContractAbi,
        functionName: "getVoteTotals",
        args: [id]
      })),
    [ids]
  );

  const { data: reviewResults } = useReadContracts({
    contracts: reviewCalls,
    query: {
      enabled: reviewCalls.length > 0
    }
  });

  const { data: voteResults } = useReadContracts({
    contracts: voteCalls,
    query: {
      enabled: voteCalls.length > 0
    }
  });

  return useMemo<ReviewSummary[]>(() => {
    const liveReviews: ReviewSummary[] = [];

    reviewResults?.forEach((item, index) => {
      if (item.status !== "success") {
        return;
      }

      const review = item.result as ContractReview;
      const content = resolveReviewContent(review.contentHash);
      const voteResult = voteResults?.[index];
      const totals =
        voteResult?.status === "success"
          ? (voteResult.result as ContractVoteTotals)
          : {
              upvotes: 0n,
              downvotes: 0n,
              flags: 0n,
              score: 0n
            };

      liveReviews.push({
        id: review.id,
        author: review.author,
        courseId: review.courseId,
        semester: review.semester,
        professor: review.professor,
        overallRating: review.overallRating,
        difficultyRating: review.difficultyRating,
        workloadHours: review.workloadHours,
        contentHash: review.contentHash,
        createdAt: Number(review.createdAt),
        title: content?.title ?? `On-chain review #${review.id.toString()}`,
        body: content?.body ?? `Review content is stored at ${review.contentHash}.`,
        tips: content?.tips ?? "This browser has not cached the IPFS mock content for this review.",
        score: Number(totals.score),
        upvotes: Number(totals.upvotes),
        downvotes: Number(totals.downvotes),
        flags: Number(totals.flags)
      });
    });

    const reviews =
      liveReviews.length > 0 ? liveReviews : courseId ? sampleReviews.filter((review) => review.courseId === courseId) : sampleReviews;

    return [...reviews].sort((a, b) => b.score - a.score);
  }, [courseId, reviewResults, voteResults]);
}
