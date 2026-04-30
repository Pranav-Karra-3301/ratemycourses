# Frontend

The frontend is a Next.js App Router dApp. It uses wagmi and viem for wallet connection, contract reads, and contract writes.

## Commands

```bash
pnpm install
pnpm --filter frontend dev
pnpm --filter frontend lint
pnpm --filter frontend build
```

## Environment

Copy `.env.example` to `.env.local` and set the contract addresses after deployment:

```bash
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_REVIEW_REGISTRY_ADDRESS=
NEXT_PUBLIC_REPUTATION_TOKEN_ADDRESS=
NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=
```
