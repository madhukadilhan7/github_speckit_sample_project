# Contracts: DoIt — Goal Tracker Page

**Branch**: `001-goal-tracker-page` | **Date**: 2026-02-27

## External Interfaces

**None.** This is a client-side-only application with no server API, no webhooks, no CLI, and no public library exports. All data stays in the browser's localStorage.

## Internal Component Contract: `useGoals` Hook

Although not an external interface, the `useGoals` hook is the central contract between the UI components and the data/persistence layer. Documenting it here for implementation clarity.

### Input (arguments)

None — the hook manages its own state internally.

### Output (return value)

| Property | Type | Description |
|----------|------|-------------|
| `activeGoals` | `Goal[]` | Goals where `completed === false`, sorted by `endDate` ascending |
| `completedGoals` | `Goal[]` | Goals where `completed === true`, sorted by `completedAt` descending |
| `addGoal` | `(title: string, endDate: string) => void` | Creates a new goal; validates inputs; persists to localStorage |
| `completeGoal` | `(id: string) => void` | Marks a goal as completed (sets `completed: true`, `completedAt: now`); persists |
| `deleteGoal` | `(id: string) => void` | Permanently removes a goal from storage |
| `storageAvailable` | `boolean` | Whether localStorage is usable; `false` triggers a degraded-mode banner |

### Invariants

- `addGoal` MUST reject empty titles and missing/invalid dates (throw or no-op + error state — TBD at implementation).
- `completeGoal` MUST be idempotent — calling it on an already-completed goal is a no-op.
- `deleteGoal` MUST be idempotent — calling it with a non-existent ID is a no-op.
- All mutations MUST synchronously update React state AND persist to localStorage (if available).

## Internal Component Contract: Date Utilities (`dates.ts`)

### `daysRemaining(endDate: string): number`

Returns the integer calendar-day difference between `endDate` and today (local timezone). Positive = future, 0 = today, negative = past/overdue.

### `getUrgency(daysRemaining: number): "on-track" | "approaching" | "due-today" | "overdue"`

Maps a days-remaining count to one of four urgency levels:

| daysRemaining | Urgency |
|---------------|---------|
| > 3 | `on-track` |
| 1–3 | `approaching` |
| 0 | `due-today` |
| < 0 | `overdue` |

### `formatDaysRemaining(days: number): string`

Returns a human-readable string: "5 days left", "1 day left", "Due today", "1 day overdue", "3 days overdue".
