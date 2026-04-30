import type { ReviewContent } from "@/lib/types";

const storageKey = "ratemycourses:ipfs";

function readStore(): Record<string, ReviewContent> {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    return JSON.parse(window.localStorage.getItem(storageKey) || "{}") as Record<string, ReviewContent>;
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, ReviewContent>) {
  window.localStorage.setItem(storageKey, JSON.stringify(store));
}

export async function uploadReviewContent(content: ReviewContent) {
  const payload = JSON.stringify(content);
  const bytes = new TextEncoder().encode(payload);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const hash = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  const uri = `ipfs://mock/${hash}`;
  const store = readStore();
  store[uri] = content;
  writeStore(store);
  return uri;
}

export function resolveReviewContent(uri: string): ReviewContent | undefined {
  return readStore()[uri];
}
