# RateMyCourses 3-Minute Presentation Script

## 0:00-0:30 - Intro

RateMyCourses is a decentralized, anonymous course review platform. The goal is to let students post honest feedback about courses and professors without a central admin being able to quietly remove or manipulate reviews.

## 0:30-1:10 - Frontend and UX

The frontend is a dark, high-contrast Next.js app with six pages: Home, Browse Courses, Course Detail, Submit Review, Profile, and About. The main flow is simple: browse a course, inspect reviews, connect a wallet, then publish a review. The interface keeps course stats, rating metadata, and vote controls visible so students can scan quickly.

## 1:10-2:10 - Blockchain Backend

The backend has three Solidity contracts. `ReviewRegistry` stores immutable review metadata, including course id, semester, ratings, timestamp, author wallet, and an IPFS-style content hash. `ReputationToken` is an ERC-20 token that rewards users for submitting reviews and participating in useful voting. `VotingContract` handles upvotes, downvotes, and flags, with voting weight based on reputation.

The app has at least two blockchain writes: submitting reviews and voting or flagging. It also has multiple reads: review metadata, vote totals, and reputation token balance.

## 2:10-2:40 - IPFS and Decentralization

Long review text is kept out of the contract to avoid high gas costs. The current build uses an IPFS-ready adapter that produces deterministic `ipfs://mock/...` hashes and stores the JSON locally for the demo. That adapter can be swapped for Pinata or web3.storage without changing the contract interface.

## 2:40-3:00 - Demo Close

For the demo, I run a local Hardhat chain, deploy the contracts, connect a browser wallet, submit a review, and then vote on it. The important design choice is that once metadata is on-chain, the platform cannot secretly edit or delete the historical review record.
