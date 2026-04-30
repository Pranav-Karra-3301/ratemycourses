// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title RateMyCoursesReputationToken
/// @notice Minimal ERC-20 style reputation token for CMPSC 263 RateMyCourses.
contract RateMyCoursesReputationToken {
    string public constant name = "RateMyCourses Reputation";
    string public constant symbol = "RMCREP";
    uint8 public constant decimals = 18;
    uint256 public constant REVIEW_REWARD = 10 ether;
    uint256 public constant HELPFUL_VOTE_REWARD = 1 ether;
    uint256 public constant SPAM_PENALTY = 5 ether;

    address public admin;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => bool) public rewarders;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event RewarderSet(address indexed rewarder, bool allowed);

    modifier onlyAdmin() {
        require(msg.sender == admin, "not admin");
        _;
    }

    modifier onlyRewarder() {
        require(rewarders[msg.sender], "not rewarder");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /// @notice Allow or remove a contract that can reward and penalize users.
    function setRewarder(address rewarder, bool allowed) external onlyAdmin {
        rewarders[rewarder] = allowed;
        emit RewarderSet(rewarder, allowed);
    }

    /// @notice Approve another address to transfer reputation from the sender.
    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    /// @notice Transfer reputation from the sender to another address.
    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    /// @notice Transfer reputation using an allowance.
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        require(allowed >= amount, "allowance low");
        allowance[from][msg.sender] = allowed - amount;
        _transfer(from, to, amount);
        return true;
    }

    /// @notice Mint reputation to a user after a useful platform action.
    function reward(address user, uint256 amount) external onlyRewarder {
        require(user != address(0), "zero user");
        totalSupply += amount;
        balanceOf[user] += amount;
        emit Transfer(address(0), user, amount);
    }

    /// @notice Burn reputation from a user after spam consensus.
    function penalize(address user, uint256 amount) external onlyRewarder {
        uint256 balance = balanceOf[user];
        uint256 burned = amount > balance ? balance : amount;
        balanceOf[user] = balance - burned;
        totalSupply -= burned;
        emit Transfer(user, address(0), burned);
    }

    /// @notice Move reputation between two addresses.
    function _transfer(address from, address to, uint256 amount) private {
        require(to != address(0), "zero to");
        require(balanceOf[from] >= amount, "balance low");
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
    }
}

/// @title RateMyCoursesReviewRegistry
/// @notice Stores immutable course review metadata and content hashes.
contract RateMyCoursesReviewRegistry {
    struct Review {
        uint256 id;
        address author;
        string courseId;
        string semester;
        string professor;
        uint8 overallRating;
        uint8 difficultyRating;
        uint8 workloadHours;
        string contentHash;
        uint256 createdAt;
    }

    RateMyCoursesReputationToken public immutable reputationToken;
    uint256 public reviewCount;

    mapping(uint256 => Review) private reviews;
    mapping(bytes32 => uint256[]) private courseReviewIds;
    mapping(address => uint256[]) private authorReviewIds;

    event ReviewSubmitted(
        uint256 indexed reviewId,
        address indexed author,
        string indexed courseId,
        string semester,
        uint8 overallRating,
        string contentHash
    );

    constructor(address reputationTokenAddress) {
        reputationToken = RateMyCoursesReputationToken(reputationTokenAddress);
    }

    /// @notice Submit a new immutable course review and receive reputation.
    function submitReview(
        string calldata courseId,
        string calldata semester,
        string calldata professor,
        uint8 overallRating,
        uint8 difficultyRating,
        uint8 workloadHours,
        string calldata contentHash
    ) external returns (uint256 reviewId) {
        require(bytes(courseId).length > 0, "course required");
        require(bytes(semester).length > 0, "semester required");
        require(bytes(contentHash).length > 0, "content required");
        require(overallRating >= 1 && overallRating <= 5, "overall 1-5");
        require(difficultyRating >= 1 && difficultyRating <= 5, "difficulty 1-5");
        require(workloadHours <= 40, "workload too high");

        reviewId = ++reviewCount;
        reviews[reviewId] = Review({
            id: reviewId,
            author: msg.sender,
            courseId: courseId,
            semester: semester,
            professor: professor,
            overallRating: overallRating,
            difficultyRating: difficultyRating,
            workloadHours: workloadHours,
            contentHash: contentHash,
            createdAt: block.timestamp
        });

        courseReviewIds[_courseKey(courseId)].push(reviewId);
        authorReviewIds[msg.sender].push(reviewId);
        reputationToken.reward(msg.sender, reputationToken.REVIEW_REWARD());

        emit ReviewSubmitted(reviewId, msg.sender, courseId, semester, overallRating, contentHash);
    }

    /// @notice Return one review by id.
    function getReview(uint256 reviewId) external view returns (Review memory) {
        require(reviewId > 0 && reviewId <= reviewCount, "review missing");
        return reviews[reviewId];
    }

    /// @notice Return all review ids for a course.
    function getCourseReviewIds(string calldata courseId) external view returns (uint256[] memory) {
        return courseReviewIds[_courseKey(courseId)];
    }

    /// @notice Return all review ids submitted by an author.
    function getReviewsByAuthor(address author) external view returns (uint256[] memory) {
        return authorReviewIds[author];
    }

    /// @notice Build a stable mapping key for a course id string.
    function _courseKey(string calldata courseId) private pure returns (bytes32) {
        return keccak256(bytes(courseId));
    }
}

/// @title RateMyCoursesVoting
/// @notice Handles reputation-weighted upvotes, downvotes, and flags.
contract RateMyCoursesVoting {
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

    RateMyCoursesReviewRegistry public immutable reviewRegistry;
    RateMyCoursesReputationToken public immutable reputationToken;

    mapping(uint256 => VoteTotals) private totals;
    mapping(uint256 => mapping(address => VoteChoice)) public votes;
    mapping(uint256 => mapping(address => uint256)) public voteWeights;
    mapping(uint256 => mapping(address => bool)) public flags;
    mapping(uint256 => bool) public spamPenaltyApplied;

    event ReviewVoted(uint256 indexed reviewId, address indexed voter, bool isUpvote, uint256 weight);
    event ReviewFlagged(uint256 indexed reviewId, address indexed flagger, uint256 weight);

    constructor(address reviewRegistryAddress, address reputationTokenAddress) {
        reviewRegistry = RateMyCoursesReviewRegistry(reviewRegistryAddress);
        reputationToken = RateMyCoursesReputationToken(reputationTokenAddress);
    }

    /// @notice Vote on a review using reputation-weighted score.
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
            RateMyCoursesReviewRegistry.Review memory review = reviewRegistry.getReview(reviewId);
            reputationToken.penalize(review.author, reputationToken.SPAM_PENALTY());
        }

        emit ReviewFlagged(reviewId, msg.sender, weight);
    }

    /// @notice Return public voting totals for a review.
    function getVoteTotals(uint256 reviewId) external view returns (VoteTotals memory) {
        return totals[reviewId];
    }

    /// @notice Return capped voting weight based on reputation.
    function votingWeight(address voter) public view returns (uint256) {
        uint256 reputationUnits = reputationToken.balanceOf(voter) / 10 ether;
        if (reputationUnits > 5) {
            return 5;
        }
        return reputationUnits + 1;
    }

    /// @notice Confirm that a review exists in the registry.
    function _requireReview(uint256 reviewId) private view {
        require(reviewId > 0 && reviewId <= reviewRegistry.reviewCount(), "review missing");
    }
}
