"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { courses } from "@/lib/courses";
import type { ReviewDraft } from "@/lib/types";
import { useReviewActions } from "@/hooks/useReviewActions";
import { contractsConfigured } from "@/lib/contracts";
import { useAccount } from "wagmi";

const initialDraft: ReviewDraft = {
  courseId: courses[0].id,
  semester: "Fall 2026",
  professor: courses[0].professor,
  overallRating: 5,
  difficultyRating: 3,
  workloadHours: 6,
  title: "",
  body: "",
  tips: ""
};

export function ReviewForm() {
  const [draft, setDraft] = useState<ReviewDraft>(initialDraft);
  const [status, setStatus] = useState("");
  const { isConnected } = useAccount();
  const { submitReview, isPending, error, transactionHash } = useReviewActions();

  function update<K extends keyof ReviewDraft>(key: K, value: ReviewDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("");
    try {
      await submitReview(draft);
      setStatus("Transaction submitted. Your review is being written on-chain.");
      setDraft(initialDraft);
    } catch (submitError) {
      setStatus(submitError instanceof Error ? submitError.message : "Unable to submit review.");
    }
  }

  const disabled = !isConnected || !contractsConfigured || isPending;

  return (
    <form onSubmit={onSubmit} className="space-y-5 border border-line bg-panel p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="font-mono text-xs uppercase text-muted">Course</span>
          <select
            value={draft.courseId}
            onChange={(event) => {
              const course = courses.find((item) => item.id === event.target.value);
              update("courseId", event.target.value);
              if (course) {
                update("professor", course.professor);
              }
            }}
            className="w-full border border-line bg-ink px-3 py-3 text-sm text-paper"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.title}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="font-mono text-xs uppercase text-muted">Professor</span>
          <input
            value={draft.professor}
            onChange={(event) => update("professor", event.target.value)}
            className="w-full border border-line bg-ink px-3 py-3 text-sm text-paper"
            required
          />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <label className="space-y-2">
          <span className="font-mono text-xs uppercase text-muted">Semester</span>
          <input
            value={draft.semester}
            onChange={(event) => update("semester", event.target.value)}
            className="w-full border border-line bg-ink px-3 py-3 text-sm text-paper"
            required
          />
        </label>
        <NumberField label="Overall" value={draft.overallRating} min={1} max={5} onChange={(value) => update("overallRating", value)} />
        <NumberField
          label="Difficulty"
          value={draft.difficultyRating}
          min={1}
          max={5}
          onChange={(value) => update("difficultyRating", value)}
        />
        <NumberField
          label="Hours/week"
          value={draft.workloadHours}
          min={0}
          max={40}
          onChange={(value) => update("workloadHours", value)}
        />
      </div>
      <label className="block space-y-2">
        <span className="font-mono text-xs uppercase text-muted">Review title</span>
        <input
          value={draft.title}
          onChange={(event) => update("title", event.target.value)}
          className="w-full border border-line bg-ink px-3 py-3 text-sm text-paper"
          required
        />
      </label>
      <label className="block space-y-2">
        <span className="font-mono text-xs uppercase text-muted">Review body</span>
        <textarea
          value={draft.body}
          onChange={(event) => update("body", event.target.value)}
          className="min-h-36 w-full border border-line bg-ink px-3 py-3 text-sm leading-6 text-paper"
          required
        />
      </label>
      <label className="block space-y-2">
        <span className="font-mono text-xs uppercase text-muted">Advice for future students</span>
        <textarea
          value={draft.tips}
          onChange={(event) => update("tips", event.target.value)}
          className="min-h-24 w-full border border-line bg-ink px-3 py-3 text-sm leading-6 text-paper"
          required
        />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex h-11 items-center gap-2 border border-accent px-4 font-mono text-xs uppercase text-accent transition hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={16} />
          {isPending ? "Submitting" : "Publish review"}
        </button>
        <p className="font-mono text-xs text-muted">
          {!isConnected
            ? "Connect a wallet to publish."
            : !contractsConfigured
              ? "Contract addresses are not configured yet."
              : status || error?.message || (transactionHash ? `Tx: ${transactionHash}` : "")}
        </p>
      </div>
    </form>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="font-mono text-xs uppercase text-muted">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full border border-line bg-ink px-3 py-3 text-sm text-paper"
      />
    </label>
  );
}
