import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/AppProviders";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "RateMyCourses",
  description: "Anonymous decentralized course reviews"
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
