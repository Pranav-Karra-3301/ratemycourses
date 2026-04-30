export const reviewRegistryAbi = [
  {
    type: "function",
    name: "submitReview",
    stateMutability: "nonpayable",
    inputs: [
      { name: "courseId", type: "string" },
      { name: "semester", type: "string" },
      { name: "professor", type: "string" },
      { name: "overallRating", type: "uint8" },
      { name: "difficultyRating", type: "uint8" },
      { name: "workloadHours", type: "uint8" },
      { name: "contentHash", type: "string" }
    ],
    outputs: [{ name: "reviewId", type: "uint256" }]
  },
  {
    type: "function",
    name: "getReview",
    stateMutability: "view",
    inputs: [{ name: "reviewId", type: "uint256" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "author", type: "address" },
          { name: "courseId", type: "string" },
          { name: "semester", type: "string" },
          { name: "professor", type: "string" },
          { name: "overallRating", type: "uint8" },
          { name: "difficultyRating", type: "uint8" },
          { name: "workloadHours", type: "uint8" },
          { name: "contentHash", type: "string" },
          { name: "createdAt", type: "uint256" }
        ]
      }
    ]
  },
  {
    type: "function",
    name: "getCourseReviewIds",
    stateMutability: "view",
    inputs: [{ name: "courseId", type: "string" }],
    outputs: [{ name: "ids", type: "uint256[]" }]
  },
  {
    type: "function",
    name: "getReviewsByAuthor",
    stateMutability: "view",
    inputs: [{ name: "author", type: "address" }],
    outputs: [{ name: "ids", type: "uint256[]" }]
  },
  {
    type: "function",
    name: "reviewCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  }
] as const;

export const votingContractAbi = [
  {
    type: "function",
    name: "vote",
    stateMutability: "nonpayable",
    inputs: [
      { name: "reviewId", type: "uint256" },
      { name: "isUpvote", type: "bool" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "flagReview",
    stateMutability: "nonpayable",
    inputs: [{ name: "reviewId", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "getVoteTotals",
    stateMutability: "view",
    inputs: [{ name: "reviewId", type: "uint256" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "upvotes", type: "uint256" },
          { name: "downvotes", type: "uint256" },
          { name: "flags", type: "uint256" },
          { name: "score", type: "int256" }
        ]
      }
    ]
  }
] as const;

export const reputationTokenAbi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }]
  }
] as const;
