import { hardhat, sepolia } from "wagmi/chains";
import type { Address } from "viem";

function addressFromEnv(value: string | undefined): Address | undefined {
  if (value && /^0x[a-fA-F0-9]{40}$/.test(value)) {
    return value as Address;
  }
  return undefined;
}

export const selectedChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || hardhat.id);

export const supportedChains = [hardhat, sepolia] as const;

export const contractAddresses = {
  reviewRegistry: addressFromEnv(process.env.NEXT_PUBLIC_REVIEW_REGISTRY_ADDRESS),
  reputationToken: addressFromEnv(process.env.NEXT_PUBLIC_REPUTATION_TOKEN_ADDRESS),
  votingContract: addressFromEnv(process.env.NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS)
};

export const contractsConfigured =
  Boolean(contractAddresses.reviewRegistry) &&
  Boolean(contractAddresses.reputationToken) &&
  Boolean(contractAddresses.votingContract);
