/** Urgency level derived from days remaining until a goal's end date. */
export type Urgency = "on-track" | "approaching" | "due-today" | "overdue";

/** A single user goal tracked by the application. */
export interface Goal {
  /** Unique identifier generated via crypto.randomUUID(). */
  id: string;
  /** Goal title, 1–200 characters, trimmed. */
  title: string;
  /** Target date in ISO 8601 format (YYYY-MM-DD). */
  endDate: string;
  /** One-way transition: false → true only (irreversible). */
  completed: boolean;
  /** ISO 8601 datetime set when completed becomes true; null otherwise. */
  completedAt: string | null;
  /** ISO 8601 datetime set at creation; immutable. */
  createdAt: string;
}

/** Persisted shape in localStorage under key "doit:goals". */
export interface GoalStore {
  /** Schema version for forward-compatible migration. */
  version: number;
  /** All goals (both active and completed). */
  goals: Goal[];
}
