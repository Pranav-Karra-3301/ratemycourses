"use client";

import { Flag, ThumbsDown, ThumbsUp } from "lucide-react";
import { useAccount } from "wagmi";
import { StatPill } from "@/components/StatPill";
import { contractsConfigured } from "@/lib/contracts";
import type { ReviewSummary } from "@/lib/types";
import { shortAddress } from "@/lib/utils";
import { useReviewActions } from "@/hooks/useReviewActions";

export function ReviewCard({ review }: { review: ReviewSummary }) {
  const { isConnected } = useAccount();
  const { vote, flagReview, isPending } = useReviewActions();
  const canWrite = isConnected && contractsConfigured && !isPending;

  return (
    <article className="border border-line bg-panel p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase text-accent">{review.semester}</p>
          <h3 className="mt-2 font-serif text-3xl leading-tight text-paper">{review.title}</h3>
          <p className="mt-1 font-mono text-xs text-muted">
            {review.professor} / {shortAddress(review.author)}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:min-w-72">
          <StatPill label="Overall" value={review.overallRating} />
          <StatPill label="Difficulty" value={review.difficultyRating} />
          <StatPill label="Score" value={review.score} />
        </div>
      </div>
      <p className="mt-5 max-w-3xl text-sm leading-6 text-paper">{review.body}</p>
      <p className="mt-4 max-w-3xl border-l border-accent pl-3 font-mono text-xs leading-5 text-muted">{review.tips}</p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => vote(review.id, true)}
          disabled={!canWrite}
          className="inline-flex h-9 items-center gap-2 border border-line px-3 font-mono text-xs text-muted transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
          title="Upvote review"
        >
          <ThumbsUp size={15} />
          {review.upvotes}
        </button>
        <button
          type="button"
          onClick={() => vote(review.id, false)}
          disabled={!canWrite}
          className="inline-flex h-9 items-center gap-2 border border-line px-3 font-mono text-xs text-muted transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
          title="Downvote review"
        >
          <ThumbsDown size={15} />
          {review.downvotes}
        </button>
        <button
          type="button"
          onClick={() => flagReview(review.id)}
          disabled={!canWrite}
          className="inline-flex h-9 items-center gap-2 border border-line px-3 font-mono text-xs text-muted transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
          title="Flag review"
        >
          <Flag size={15} />
          {review.flags}
        </button>
        {!contractsConfigured && (
          <span className="font-mono text-[11px] uppercase text-muted">Demo mode: add contract addresses for writes</span>
        )}
      </div>
    </article>
  );
}
