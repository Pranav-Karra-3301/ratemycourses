import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { ethers, network } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  const ReputationToken = await ethers.getContractFactory("ReputationToken");
  const reputationToken = await ReputationToken.deploy(deployer.address);
  await reputationToken.waitForDeployment();

  const ReviewRegistry = await ethers.getContractFactory("ReviewRegistry");
  const reviewRegistry = await ReviewRegistry.deploy(await reputationToken.getAddress());
  await reviewRegistry.waitForDeployment();

  const VotingContract = await ethers.getContractFactory("VotingContract");
  const votingContract = await VotingContract.deploy(
    await reviewRegistry.getAddress(),
    await reputationToken.getAddress()
  );
  await votingContract.waitForDeployment();

  const rewarderRole = await reputationToken.REWARDER_ROLE();
  await (await reputationToken.grantRole(rewarderRole, await reviewRegistry.getAddress())).wait();
  await (await reputationToken.grantRole(rewarderRole, await votingContract.getAddress())).wait();

  const deployment = {
    network: network.name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    deployer: deployer.address,
    contracts: {
      ReputationToken: await reputationToken.getAddress(),
      ReviewRegistry: await reviewRegistry.getAddress(),
      VotingContract: await votingContract.getAddress()
    }
  };

  mkdirSync("deployments", { recursive: true });
  writeFileSync(join("deployments", `${network.name}.json`), JSON.stringify(deployment, null, 2));

  console.log(JSON.stringify(deployment, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
