"use client";

import { useState } from "react";
import type { Goal } from "@/app/types/goal";
import { daysRemaining, getUrgency, formatDaysRemaining } from "@/app/lib/dates";
import DeleteConfirm from "@/app/components/DeleteConfirm";

interface GoalCardProps {
  goal: Goal;
  onComplete?: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function GoalCard({ goal, onComplete, onDelete }: GoalCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const days = daysRemaining(goal.endDate);
  const urgency = getUrgency(days);

  return (
    <div
      className="relative flex items-start gap-3 rounded-lg border border-border bg-surface p-4 shadow-sm transition-colors data-[urgency=approaching]:border-warning data-[urgency=approaching]:bg-warning-light data-[urgency=due-today]:border-danger data-[urgency=due-today]:bg-danger-light data-[urgency=overdue]:border-danger data-[urgency=overdue]:bg-danger-light data-[urgency=overdue]:font-bold"
      data-urgency={goal.completed ? undefined : urgency}
    >
      {/* Checkbox / Checkmark */}
      <div className="flex-shrink-0 pt-0.5">
        {goal.completed ? (
          <span
            className="flex h-5 w-5 items-center justify-center rounded border border-success bg-success-light text-success text-xs"
            aria-label="Completed"
          >
            ✓
          </span>
        ) : (
          <input
            type="checkbox"
            className="h-5 w-5 cursor-pointer rounded border-border accent-primary"
            onChange={() => onComplete?.(goal.id)}
            aria-label={`Mark "${goal.title}" as complete`}
          />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-medium break-words ${
            goal.completed ? "text-text-muted line-through" : "text-text"
          }`}
        >
          {goal.title}
        </p>
        {!goal.completed && (
          <p className="mt-1 text-xs text-text-muted">
            {formatDaysRemaining(days)}
          </p>
        )}
      </div>

      {/* Delete button */}
      <button
        type="button"
        onClick={() => setShowDeleteConfirm(true)}
        className="flex-shrink-0 rounded p-1 text-text-muted transition-colors hover:bg-danger-light hover:text-danger"
        aria-label={`Delete "${goal.title}"`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path
            fillRule="evenodd"
            d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Inline Delete Confirmation */}
      {showDeleteConfirm && (
        <DeleteConfirm
          onConfirm={() => onDelete(goal.id)}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
