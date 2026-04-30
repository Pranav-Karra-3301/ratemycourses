import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const frontendGenerated = join(root, "..", "frontend", "generated");
const frontendDeployments = join(frontendGenerated, "deployments");
const frontendAbi = join(frontendGenerated, "abi");

mkdirSync(frontendDeployments, { recursive: true });
mkdirSync(frontendAbi, { recursive: true });

for (const name of ["ReputationToken", "ReviewRegistry", "VotingContract"]) {
  const artifactPath = join(root, "artifacts", "contracts", `${name}.sol`, `${name}.json`);
  const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
  writeFileSync(join(frontendAbi, `${name}.json`), JSON.stringify(artifact.abi, null, 2));
}

for (const network of ["localhost", "sepolia"]) {
  try {
    copyFileSync(join(root, "deployments", `${network}.json`), join(frontendDeployments, `${network}.json`));
  } catch {
    // Deployment files are optional until that network is deployed.
  }
}

console.log(`Exported contract ABIs to ${frontendGenerated}`);
