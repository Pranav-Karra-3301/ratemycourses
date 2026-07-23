# RateMyCourses

CMPSC 263 Class Spring 26 project.

RateMyCourses is a decentralized course review dApp. Students connect a wallet, publish anonymous course reviews, and vote or flag reviews through smart contracts.

**Live demo:** [ratemycourses.vercel.app](https://ratemycourses.vercel.app) (public deployment runs in read-only demo mode unless Sepolia contract addresses are configured).

## Structure

- `frontend/` - Next.js App Router dApp with wagmi and viem.
- `contracts/` - Hardhat Solidity contracts, tests, and deployment scripts.
- `docs/` - class presentation notes.

## Smart Contract Submission File

Submit this single file if the class submission asks for one Solidity file:

```txt
contracts/contracts/RateMyCourses.sol
```

The Hardhat project also includes modular versions of the same contract system:

- `contracts/contracts/ReviewRegistry.sol`
- `contracts/contracts/ReputationToken.sol`
- `contracts/contracts/VotingContract.sol`

## Local Demo

```bash
pnpm install
pnpm --filter contracts test
pnpm --filter contracts node
pnpm --filter contracts deploy:local
pnpm --filter frontend dev
```

After deployment, copy the printed contract addresses into `frontend/.env.local` or run the export script if deployment data exists.

## Vercel Deployment Notes

The Vercel deployment is the public frontend demo. Without Sepolia contract addresses, it runs in read-only demo mode with seeded course/review data. Real wallet writes require either:

- Local Hardhat for a recorded demo, or
- Sepolia contract deployment plus `NEXT_PUBLIC_*` contract address environment variables on Vercel.

No database backend is required for the current deployed demo. A database would only be needed if the app should persist/search off-chain review content publicly without relying on a testnet deployment.

## Video Demo Flow

1. Open the Vercel site and show Home, Browse, Course Detail, Submit Review, Profile, and About.
2. Explain that the public deployment is read-only unless Sepolia contract addresses are configured.
3. For live blockchain writes, run the local Hardhat demo commands above.
4. In MetaMask, add network `Hardhat Local`, RPC `http://127.0.0.1:8545`, chain id `31337`.
5. Import Hardhat account private key `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`.
6. Submit a review, upvote/downvote it, then show the Profile reputation read.

## Verification

```bash
pnpm test
pnpm lint
pnpm build
```

---

Built by [Pranav Karra](https://pranavkarra.me) for CMPSC 263.
