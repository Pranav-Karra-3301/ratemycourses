"use client";

import { LogOut, Wallet } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortAddress } from "@/lib/utils";

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const injectedConnector = connectors[0];

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
    <button
      type="button"
      onClick={() => injectedConnector && connect({ connector: injectedConnector })}
      disabled={!injectedConnector || isPending}
      className="inline-flex h-10 items-center gap-2 border border-accent px-3 font-mono text-xs text-accent transition hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
      title="Connect wallet"
    >
      <Wallet size={16} />
      {isPending ? "Connecting" : "Connect"}
    </button>
  );
}
