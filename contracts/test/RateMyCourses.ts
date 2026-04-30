import { expect } from "chai";
import { ethers } from "hardhat";

async function deployFixture() {
  const [owner, author, voter, flaggerOne, flaggerTwo, flaggerThree] = await ethers.getSigners();

  const ReputationToken = await ethers.getContractFactory("ReputationToken");
  const reputationToken = await ReputationToken.deploy(owner.address);

  const ReviewRegistry = await ethers.getContractFactory("ReviewRegistry");
  const reviewRegistry = await ReviewRegistry.deploy(await reputationToken.getAddress());

  const VotingContract = await ethers.getContractFactory("VotingContract");
  const votingContract = await VotingContract.deploy(
    await reviewRegistry.getAddress(),
    await reputationToken.getAddress()
  );

  const rewarderRole = await reputationToken.REWARDER_ROLE();
  await reputationToken.grantRole(rewarderRole, await reviewRegistry.getAddress());
  await reputationToken.grantRole(rewarderRole, await votingContract.getAddress());

  return { author, voter, flaggerOne, flaggerTwo, flaggerThree, reputationToken, reviewRegistry, votingContract };
}

describe("RateMyCourses contracts", function () {
  it("submits a review, stores metadata, and rewards reputation", async function () {
    const { author, reputationToken, reviewRegistry } = await deployFixture();

    await expect(
      reviewRegistry
        .connect(author)
        .submitReview("CMPSC-473", "Fall 2026", "Dr. Ada", 5, 3, 8, "ipfs://mock/review-1")
    )
      .to.emit(reviewRegistry, "ReviewSubmitted")
      .withArgs(1, author.address, "CMPSC-473", "Fall 2026", 5, "ipfs://mock/review-1");

    const review = await reviewRegistry.getReview(1);
    expect(review.courseId).to.equal("CMPSC-473");
    expect(review.professor).to.equal("Dr. Ada");
    expect(await reputationToken.balanceOf(author.address)).to.equal(await reputationToken.REVIEW_REWARD());
    expect(await reviewRegistry.getCourseReviewIds("CMPSC-473")).to.deep.equal([1n]);
    expect(await reviewRegistry.getReviewsByAuthor(author.address)).to.deep.equal([1n]);
  });

  it("rejects invalid ratings", async function () {
    const { author, reviewRegistry } = await deployFixture();

    await expect(
      reviewRegistry
        .connect(author)
        .submitReview("CMPSC-473", "Fall 2026", "Dr. Ada", 6, 3, 8, "ipfs://mock/review-1")
    ).to.be.revertedWith("overall 1-5");
  });

  it("supports weighted voting and vote changes", async function () {
    const { author, voter, reviewRegistry, votingContract } = await deployFixture();

    await reviewRegistry
      .connect(author)
      .submitReview("CMPSC-473", "Fall 2026", "Dr. Ada", 5, 3, 8, "ipfs://mock/review-1");

    await votingContract.connect(voter).vote(1, true);
    let totals = await votingContract.getVoteTotals(1);
    expect(totals.upvotes).to.equal(1n);
    expect(totals.score).to.equal(1n);

    await votingContract.connect(voter).vote(1, false);
    totals = await votingContract.getVoteTotals(1);
    expect(totals.upvotes).to.equal(0n);
    expect(totals.downvotes).to.equal(1n);
    expect(totals.score).to.equal(-1n);
  });

  it("rejects duplicate votes", async function () {
    const { author, voter, reviewRegistry, votingContract } = await deployFixture();

    await reviewRegistry
      .connect(author)
      .submitReview("CMPSC-473", "Fall 2026", "Dr. Ada", 5, 3, 8, "ipfs://mock/review-1");
    await votingContract.connect(voter).vote(1, true);

    await expect(votingContract.connect(voter).vote(1, true)).to.be.revertedWith("duplicate vote");
  });

  it("flags spam and applies one penalty at threshold", async function () {
    const { author, flaggerOne, flaggerTwo, flaggerThree, reputationToken, reviewRegistry, votingContract } =
      await deployFixture();

    await reviewRegistry
      .connect(author)
      .submitReview("CMPSC-473", "Fall 2026", "Dr. Ada", 5, 3, 8, "ipfs://mock/review-1");

    await votingContract.connect(flaggerOne).flagReview(1);
    await votingContract.connect(flaggerTwo).flagReview(1);
    await votingContract.connect(flaggerThree).flagReview(1);

    const expectedBalance = (await reputationToken.REVIEW_REWARD()) - (await reputationToken.SPAM_PENALTY());
    expect(await reputationToken.balanceOf(author.address)).to.equal(expectedBalance);
    expect((await votingContract.getVoteTotals(1)).flags).to.equal(3n);
  });
});
