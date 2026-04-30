"use client";

// Profile page shows the connected wallet, reputation score, and authored review list.
import { ReviewCard } from "@/components/ReviewCard";
import { StatPill } from "@/components/StatPill";
import { WalletButton } from "@/components/WalletButton";
import { useProfile } from "@/hooks/useProfile";
import { shortAddress } from "@/lib/utils";

export default function ProfilePage() {
  const { address, reputation, authoredReviews } = useProfile();

  return (
    <div className="space-y-8">
      <header className="border-b border-line pb-6">
        <p className="font-mono text-xs uppercase text-accent">Profile</p>
        <h1 className="mt-3 font-serif text-5xl text-paper">Wallet reputation and reviews.</h1>
      </header>
      <section className="border border-line bg-panel p-5">
        {address ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <StatPill label="Wallet" value={shortAddress(address)} />
            <StatPill label="Reputation" value={reputation} />
            <StatPill label="My reviews" value={authoredReviews.length} />
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted">Connect a wallet to read your reputation token balance.</p>
            <WalletButton />
          </div>
        )}
      </section>
      <section className="space-y-4">
        <h2 className="font-serif text-4xl text-paper">My Reviews</h2>
        {authoredReviews.length > 0 ? (
          authoredReviews.map((review) => <ReviewCard key={review.id.toString()} review={review} />)
        ) : (
          <div className="border border-line bg-panel p-6 text-sm text-muted">
            No local sample reviews match this wallet yet. Live authored reviews become available after contracts are deployed and indexed.
          </div>
        )}
      </section>
    </div>
  );
}
