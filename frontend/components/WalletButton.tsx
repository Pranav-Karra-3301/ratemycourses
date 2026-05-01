"use client";

import { LogOut, Wallet } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { sepolia } from "wagmi/chains";
import { shortAddress } from "@/lib/utils";

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const metaMaskConnector =
    connectors.find((connector) => connector.name.toLowerCase().includes("metamask")) ?? connectors[0];

  if (isConnected) {
    return (
      <button
        type="button"
        onClick={() => disconnect()}
        className="inline-flex h-10 items-center gap-2 border border-line px-3 font-mono text-xs text-paper transition hover:border-accent hover:text-accent"
        title="Disconnect wallet"
      >
        <LogOut size={16} />
        {shortAddress(address)}
      </button>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1 sm:items-end">
      <button
        type="button"
        onClick={() => metaMaskConnector && connect({ connector: metaMaskConnector, chainId: sepolia.id })}
        disabled={!metaMaskConnector || isPending}
        className="inline-flex h-10 items-center gap-2 border border-accent px-3 font-mono text-xs text-accent transition hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
        title="Connect MetaMask wallet"
      >
        <Wallet size={16} />
        {isPending ? "Connecting" : "Connect"}
      </button>
      {error && <span className="max-w-48 font-mono text-[10px] uppercase leading-4 text-muted">{error.message}</span>}
    </div>
  );
}
