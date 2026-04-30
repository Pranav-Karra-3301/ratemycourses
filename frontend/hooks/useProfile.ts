"use client";

import { useMemo } from "react";
import { useAccount, useReadContract } from "wagmi";
import { reputationTokenAbi } from "@/lib/abi";
import { contractAddresses } from "@/lib/contracts";
import { sampleReviews } from "@/lib/courses";

export function useProfile() {
  const { address } = useAccount();
  const { data: reputation } = useReadContract({
    address: contractAddresses.reputationToken,
    abi: reputationTokenAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address && contractAddresses.reputationToken)
    }
  });

  const authoredReviews = useMemo(() => {
    if (!address) {
      return [];
    }
    return sampleReviews.filter((review) => review.author.toLowerCase() === address.toLowerCase());
  }, [address]);

  return {
    address,
    reputation: reputation ? Number(reputation / 10n ** 18n) : 0,
    authoredReviews
  };
}
