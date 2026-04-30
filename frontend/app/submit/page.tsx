"use client";

// Submit page collects review content, writes content to the IPFS adapter, and submits metadata on-chain.
import { ReviewForm } from "@/components/ReviewForm";

export default function SubmitPage() {
  return (
    <div className="space-y-8">
      <header className="border-b border-line pb-6">
        <p className="font-mono text-xs uppercase text-accent">Submit Review</p>
        <h1 className="mt-3 font-serif text-5xl text-paper">Publish once. Keep it verifiable.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
          Review text is prepared through the IPFS-ready adapter. Course metadata, ratings, and the content hash are written to the smart contract.
        </p>
      </header>
      <ReviewForm />
    </div>
  );
}
