// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReputationToken} from "./ReputationToken.sol";
import {ReviewRegistry} from "./ReviewRegistry.sol";

contract VotingContract {
    struct VoteTotals {
        uint256 upvotes;
        uint256 downvotes;
        uint256 flags;
        int256 score;
    }

    enum VoteChoice {
        None,
        Up,
        Down
    }

    ReviewRegistry public immutable reviewRegistry;
    ReputationToken public immutable reputationToken;

    mapping(uint256 => VoteTotals) private totals;
    mapping(uint256 => mapping(address => VoteChoice)) public votes;
    mapping(uint256 => mapping(address => uint256)) public voteWeights;
    mapping(uint256 => mapping(address => bool)) public flags;
    mapping(uint256 => bool) public spamPenaltyApplied;

    event ReviewVoted(uint256 indexed reviewId, address indexed voter, bool isUpvote, uint256 weight);
    event ReviewFlagged(uint256 indexed reviewId, address indexed flagger, uint256 weight);

    constructor(address reviewRegistryAddress, address reputationTokenAddress) {
        reviewRegistry = ReviewRegistry(reviewRegistryAddress);
        reputationToken = ReputationToken(reputationTokenAddress);
    }

    /// @notice Vote on a review using a reputation-weighted score.
    function vote(uint256 reviewId, bool isUpvote) external {
        _requireReview(reviewId);
        VoteChoice previous = votes[reviewId][msg.sender];
        VoteChoice nextChoice = isUpvote ? VoteChoice.Up : VoteChoice.Down;
        require(previous != nextChoice, "duplicate vote");

        uint256 weight = votingWeight(msg.sender);
        uint256 previousWeight = voteWeights[reviewId][msg.sender];
        VoteTotals storage reviewTotals = totals[reviewId];

        if (previous == VoteChoice.Up) {
            reviewTotals.upvotes -= previousWeight;
            reviewTotals.score -= int256(previousWeight);
        } else if (previous == VoteChoice.Down) {
            reviewTotals.downvotes -= previousWeight;
            reviewTotals.score += int256(previousWeight);
        }

        if (nextChoice == VoteChoice.Up) {
            reviewTotals.upvotes += weight;
            reviewTotals.score += int256(weight);
            reputationToken.reward(msg.sender, reputationToken.HELPFUL_VOTE_REWARD());
        } else {
            reviewTotals.downvotes += weight;
            reviewTotals.score -= int256(weight);
        }

        votes[reviewId][msg.sender] = nextChoice;
        voteWeights[reviewId][msg.sender] = weight;
        emit ReviewVoted(reviewId, msg.sender, isUpvote, weight);
    }

    /// @notice Flag a review as spam or abusive once per wallet.
    function flagReview(uint256 reviewId) external {
        _requireReview(reviewId);
        require(!flags[reviewId][msg.sender], "already flagged");

        uint256 weight = votingWeight(msg.sender);
        flags[reviewId][msg.sender] = true;
        totals[reviewId].flags += weight;

        if (totals[reviewId].flags >= 3 && !spamPenaltyApplied[reviewId]) {
            spamPenaltyApplied[reviewId] = true;
            ReviewRegistry.Review memory review = reviewRegistry.getReview(reviewId);
            reputationToken.penalize(review.author, reputationToken.SPAM_PENALTY());
        }

        emit ReviewFlagged(reviewId, msg.sender, weight);
    }

    /// @notice Return the public voting totals for a review.
    function getVoteTotals(uint256 reviewId) external view returns (VoteTotals memory) {
        return totals[reviewId];
    }

    /// @notice Return a small capped vote weight from token reputation.
    function votingWeight(address voter) public view returns (uint256) {
        uint256 reputationUnits = reputationToken.balanceOf(voter) / 10 ether;
        if (reputationUnits > 5) {
            return 5;
        }
        return reputationUnits + 1;
    }

    /// @notice Confirm the review exists in the registry.
    function _requireReview(uint256 reviewId) private view {
        require(reviewId > 0 && reviewId <= reviewRegistry.reviewCount(), "review missing");
    }
}
