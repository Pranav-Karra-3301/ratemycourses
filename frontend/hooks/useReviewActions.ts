"use client";

import { useWriteContract } from "wagmi";
import { reviewRegistryAbi, votingContractAbi } from "@/lib/abi";
import { contractAddresses } from "@/lib/contracts";
import type { ReviewDraft } from "@/lib/types";
import { uploadReviewContent } from "@/lib/ipfs";
import { normalizeCourseCode } from "@/lib/courseCodes";

export function useReviewActions() {
  const { writeContractAsync, isPending, error, data } = useWriteContract();

  async function submitReview(draft: ReviewDraft) {
    if (!contractAddresses.reviewRegistry) {
      throw new Error("ReviewRegistry address is not configured.");
    }

    const courseCode = normalizeCourseCode(draft.courseId);
    if (!courseCode) {
      throw new Error("Use a course code like STAT 200 or MATH 230.");
    }

    const contentHash = await uploadReviewContent({
      title: draft.title,
      body: draft.body,
      tips: draft.tips
    });

    return writeContractAsync({
      address: contractAddresses.reviewRegistry,
      abi: reviewRegistryAbi,
      functionName: "submitReview",
      args: [
        courseCode.id,
        draft.semester,
        draft.professor,
        draft.overallRating,
        draft.difficultyRating,
        draft.workloadHours,
        contentHash
      ]
    });
  }

  async function vote(reviewId: bigint, isUpvote: boolean) {
    if (!contractAddresses.votingContract) {
      throw new Error("VotingContract address is not configured.");
    }
    return writeContractAsync({
      address: contractAddresses.votingContract,
      abi: votingContractAbi,
      functionName: "vote",
      args: [reviewId, isUpvote]
    });
  }

  async function flagReview(reviewId: bigint) {
    if (!contractAddresses.votingContract) {
      throw new Error("VotingContract address is not configured.");
    }
    return writeContractAsync({
      address: contractAddresses.votingContract,
      abi: votingContractAbi,
      functionName: "flagReview",
      args: [reviewId]
    });
  }

  return { submitReview, vote, flagReview, isPending, error, transactionHash: data };
}
