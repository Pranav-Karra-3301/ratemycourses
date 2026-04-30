import { ReactNode } from "react";

export function StatPill({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="border border-line bg-panel px-3 py-2">
      <div className="font-mono text-[10px] uppercase text-muted">{label}</div>
      <div className="mt-1 font-mono text-sm text-paper">{value}</div>
    </div>
  );
}
