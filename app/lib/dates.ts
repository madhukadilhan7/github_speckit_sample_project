import type { Urgency } from "@/app/types/goal";

/**
 * Returns the integer calendar-day difference between `endDate` and today.
 * Positive = future, 0 = today, negative = past/overdue.
 */
export function daysRemaining(endDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(endDate + "T00:00:00");
  target.setHours(0, 0, 0, 0);

  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

/**
 * Maps a days-remaining count to one of four urgency levels.
 *
 * | daysRemaining | Urgency       |
 * |---------------|---------------|
 * | > 3           | on-track      |
 * | 1–3           | approaching   |
 * | 0             | due-today     |
 * | < 0           | overdue       |
 */
export function getUrgency(days: number): Urgency {
  if (days > 3) return "on-track";
  if (days >= 1) return "approaching";
  if (days === 0) return "due-today";
  return "overdue";
}

/**
 * Returns a human-readable string for the days remaining.
 * Examples: "5 days left", "1 day left", "Due today", "1 day overdue", "3 days overdue".
 */
export function formatDaysRemaining(days: number): string {
  if (days === 0) return "Due today";
  if (days === 1) return "1 day left";
  if (days > 1) return `${days} days left`;
  if (days === -1) return "1 day overdue";
  return `${Math.abs(days)} days overdue`;
}
