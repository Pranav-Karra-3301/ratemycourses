"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "@/components/WalletButton";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/submit", label: "Submit" },
  { href: "/profile", label: "Profile" },
  { href: "/about", label: "About" }
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link href="/" className="font-serif text-3xl leading-none tracking-normal text-paper">
          RateMyCourses
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <nav className="flex flex-wrap items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 font-mono text-xs uppercase text-muted transition hover:text-paper",
                  pathname === link.href && "text-accent"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
