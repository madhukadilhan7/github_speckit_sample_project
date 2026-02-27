# Data Model: DoIt — Goal Tracker Page

**Branch**: `001-goal-tracker-page` | **Date**: 2026-02-27

## Entities

### Goal

Represents a single user objective tracked by the application.

| Field | Type | Required | Default | Constraints |
|-------|------|----------|---------|-------------|
| `id` | string (UUID-like) | Yes | Auto-generated | Unique identifier; generated via `crypto.randomUUID()` |
| `title` | string | Yes | — | 1–200 characters; trimmed of leading/trailing whitespace |
| `endDate` | string (ISO 8601 date, `YYYY-MM-DD`) | Yes | — | Valid calendar date; stored without time component |
| `completed` | boolean | Yes | `false` | One-way transition: `false` → `true` only (irreversible) |
| `completedAt` | string (ISO 8601 datetime) \| null | No | `null` | Set to current ISO datetime when `completed` becomes `true`; used for sort order in Completed column |
| `createdAt` | string (ISO 8601 datetime) | Yes | Auto-generated | Set at creation time; immutable |

### Persisted Store

The entire goal collection is serialized to localStorage as a single JSON object.

| Field | Type | Description |
|-------|------|-------------|
| `version` | number | Schema version for forward-compatible migration (starts at `1`) |
| `goals` | Goal[] | Array of all goals (both active and completed) |

**localStorage key**: `doit:goals`

## Derived/Computed Values (not stored)

| Value | Derivation | Used By |
|-------|-----------|---------|
| `daysRemaining` | Calendar-day difference between `endDate` and today (local timezone). Positive = days left, 0 = due today, negative = overdue. | GoalCard display text |
| `urgency` | Enum derived from `daysRemaining`: `on-track` (>3 days), `approaching` (1–3 days), `due-today` (0 days), `overdue` (<0 days) | GoalCard highlighting via `data-urgency` attribute |

## State Transitions

```text
            ┌───────────┐
  create →  │  Active    │  ── check checkbox ──→  ┌────────────┐
            │ completed  │                          │  Completed  │
            │ = false    │                          │ completed   │
            └─────┬──────┘                          │ = true      │
                  │                                 │ completedAt │
                  │ delete                          │ = <now>     │
                  ▼                                 └──────┬──────┘
            ┌───────────┐                                  │
            │  Removed   │  ◄── delete ────────────────────┘
            │ (from      │
            │  storage)  │
            └───────────┘
```

- **Create**: New Goal added with `completed: false`, `completedAt: null`.
- **Complete**: `completed` set to `true`, `completedAt` set to current datetime. One-way; cannot revert.
- **Delete**: Goal permanently removed from the `goals` array (from either Active or Completed state).

## Validation Rules

| Rule | Field(s) | Description |
|------|----------|-------------|
| Title required | `title` | Must be a non-empty string after trimming whitespace |
| Title max length | `title` | Must be ≤ 200 characters |
| End date required | `endDate` | Must be a valid ISO date string (`YYYY-MM-DD`) |
| End date parseable | `endDate` | Must parse to a valid `Date` — no `NaN` result |
| Unique ID | `id` | Must not collide with any existing goal ID |

## Sort Order

| Column | Sort Key | Direction | Rationale |
|--------|----------|-----------|-----------|
| Current Goals | `endDate` | Ascending (soonest first) | Most urgent goals at top |
| Completed Goals | `completedAt` | Descending (newest first) | Most recently completed at top |
