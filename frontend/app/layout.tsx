import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/AppProviders";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  metadataBase: new URL("https://ratemycourses.vercel.app"),
  title: "RateMyCourses",
  description:
    "A decentralized course review dApp. Connect a wallet, publish anonymous course reviews, and vote or flag reviews through Ethereum smart contracts.",
  keywords: [
    "course reviews",
    "dApp",
    "web3",
    "Ethereum",
    "smart contracts",
    "anonymous reviews"
  ],
  openGraph: {
    title: "RateMyCourses",
    description:
      "Publish and vote on anonymous course reviews on-chain. A decentralized course review dApp.",
    type: "website",
    url: "https://ratemycourses.vercel.app"
  },
  twitter: {
    card: "summary_large_image",
    title: "RateMyCourses",
    description:
      "Publish and vote on anonymous course reviews on-chain. A decentralized course review dApp."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <Header />
          <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
