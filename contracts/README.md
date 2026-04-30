# Contracts

The Solidity backend contains three contracts:

- `ReviewRegistry` stores immutable review metadata and IPFS content hashes.
- `ReputationToken` rewards review and voting participation.
- `VotingContract` handles weighted upvotes, downvotes, and spam flags.

## Commands

```bash
pnpm install
pnpm --filter contracts test
pnpm --filter contracts node
pnpm --filter contracts deploy:local
pnpm --filter contracts export:frontend
```

For Sepolia, copy `.env.example` to `.env` and set `SEPOLIA_RPC_URL` plus `DEPLOYER_PRIVATE_KEY`.
