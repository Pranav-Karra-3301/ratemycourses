"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { injected, metaMask } from "wagmi/connectors";
import { hardhat, sepolia } from "wagmi/chains";

const config = createConfig({
  chains: [hardhat, sepolia],
  connectors: [
    metaMask({
      dappMetadata: {
        name: "RateMyCourses",
        url: "https://ratemycourses.vercel.app"
      }
    }),
    injected({ target: "metaMask" })
  ],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"),
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com")
  },
  ssr: true
});

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
