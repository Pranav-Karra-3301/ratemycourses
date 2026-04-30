// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReputationToken} from "./ReputationToken.sol";

contract ReviewRegistry {
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

    ReputationToken public immutable reputationToken;
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
        reputationToken = ReputationToken(reputationTokenAddress);
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
        Review memory review = Review({
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

        reviews[reviewId] = review;
        courseReviewIds[_courseKey(courseId)].push(reviewId);
        authorReviewIds[msg.sender].push(reviewId);

        reputationToken.reward(msg.sender, reputationToken.REVIEW_REWARD());

        emit ReviewSubmitted(reviewId, msg.sender, courseId, semester, overallRating, contentHash);
    }

    /// @notice Return one review by its id.
    function getReview(uint256 reviewId) external view returns (Review memory) {
        require(reviewId > 0 && reviewId <= reviewCount, "review missing");
        return reviews[reviewId];
    }

    /// @notice Return all review ids for a course identifier.
    function getCourseReviewIds(string calldata courseId) external view returns (uint256[] memory) {
        return courseReviewIds[_courseKey(courseId)];
    }

    /// @notice Return all review ids submitted by an author.
    function getReviewsByAuthor(address author) external view returns (uint256[] memory) {
        return authorReviewIds[author];
    }

    /// @notice Compute a normalized storage key for a course identifier.
    function _courseKey(string calldata courseId) private pure returns (bytes32) {
        return keccak256(bytes(courseId));
    }
}
