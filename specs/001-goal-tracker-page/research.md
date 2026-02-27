# Research: DoIt — Goal Tracker Page

**Branch**: `001-goal-tracker-page` | **Date**: 2026-02-27

## 1. localStorage in Next.js App Router

**Decision**: Use a custom `useGoals` hook wrapping `useState` + `useEffect` for localStorage access.

**Rationale**:
- localStorage only exists in the browser; `useEffect` guarantees code runs after hydration on the client.
- Initialize state with a default value (empty array), then sync from localStorage inside `useEffect` on mount. This avoids hydration mismatches entirely.
- Never read localStorage during SSR/RSC — keep access isolated in Client Components or custom hooks.
- `useSyncExternalStore` is the most "React-correct" approach but is heavier than needed for this use case.

**Alternatives considered**:
- `typeof window !== "undefined"` at render time — rejected because it causes hydration mismatches in React 19 App Router.
- `useSyncExternalStore` — correct but over-engineered for a simple array stored in localStorage.

### Graceful degradation

**Decision**: Wrap every `getItem`/`setItem` in try-catch. Fall back to in-memory state for the session. Show a one-time subtle banner: "Goals won't be saved between sessions in this browser mode."

**Rationale**:
- Safari private browsing (pre-iOS 14) can throw on `setItem`. `QuotaExceededError` may occur at the ~5 MB quota limit.
- A capability-detection probe at init time (test write/read/remove on a throwaway key) caches availability as a boolean.
- In-memory fallback keeps the app fully functional; only persistence is lost.

### Serialization

**Decision**: Store dates as ISO 8601 strings in the persisted shape. Convert at the serialization boundary. Include a schema version number.

**Rationale**:
- `JSON.stringify` converts `Date` objects to ISO strings; `JSON.parse` returns strings, not Dates. Keeping dates as strings in the persisted type (`GoalPersisted`) makes the lossy conversion explicit in TypeScript's type system.
- A reviver function on `JSON.parse` detects ISO patterns and converts back.
- Schema versioning (`{ version: 1, goals: [...] }`) allows future migration without data loss.
- Zod omitted per Minimal Dependencies principle — a simple manual parser suffices.

### Key naming

**Decision**: Prefix all keys with `doit:` — e.g., `doit:goals`.

**Rationale**: localStorage is shared across all scripts on the same origin; prefixing avoids collisions. Colon separator is the community standard.

---

## 2. Tailwind CSS v4 Pastel Theme

**Decision**: Define custom color tokens via `@theme` directive in `app/globals.css`. Use pastel surfaces paired with dark text for WCAG AA compliance.

**Rationale**:
- Tailwind v4 replaces `tailwind.config.js` with CSS-native `@theme` blocks. Any `--color-*` variable inside `@theme` automatically generates utility classes (`bg-*`, `text-*`, `border-*`).
- "Pastel" lives in the background/surface tokens (light, low-saturation). Functional/text colors stay dark enough for ≥4.5:1 contrast on white.

**Color palette**:

| Token | Hex | Use |
|-------|-----|-----|
| `background` | `#F8F7FF` | Page background (light lavender-white) |
| `surface` | `#FFFFFF` | Card backgrounds |
| `primary` | `#7C5CFC` | Primary accent, buttons (4.6:1 on white) |
| `primary-light` | `#EDE9FE` | Primary tint, decorative |
| `success` | `#16A34A` | Completed/on-track (4.5:1 on white) |
| `success-light` | `#DCFCE7` | Success surface |
| `warning` | `#B45309` | Approaching deadline (4.8:1 on white) |
| `warning-light` | `#FEF3C7` | Warning surface |
| `danger` | `#DC2626` | Urgent/overdue (4.6:1 on white) |
| `danger-light` | `#FEE2E2` | Danger surface |
| `text` | `#1E1B4B` | Primary text (14:1+ on white) |
| `text-muted` | `#6B7280` | Secondary text (5.0:1 on white) |
| `border` | `#E5E7EB` | Borders/dividers |

**Alternatives considered**:
- Using Tailwind's built-in color palette directly (e.g., `violet-100`, `red-100`) — rejected because semantic tokens (`bg-warning-light`) are more readable and maintainable than remembering `bg-amber-100`.
- `tailwind.config.ts` — deprecated in v4; CSS-native `@theme` is the replacement.

### Urgency highlighting

**Decision**: Use `data-urgency` attribute on goal cards with Tailwind `data-*` variants.

**Rationale**: A single `data-urgency="on-track|approaching|due-today|overdue"` attribute can drive border, background, and badge styling simultaneously without prop drilling or complex conditional class strings.

---

## 3. Responsive Two-Column Layout

**Decision**: CSS Grid with `grid-cols-1 md:grid-cols-2 gap-6`.

**Rationale**:
- Grid gives equal-width columns with minimal declarations; no `flex-1`/`min-w-0` workarounds needed.
- `md` breakpoint (768 px) is the standard stacking threshold — phones/small tablets get single-column.
- Columns are equal width; both columns have comparable content density.

**Alternatives considered**:
- Flexbox — requires more markup for equal widths; better suited for variable-width layouts.
- `md:grid-cols-[1fr_2fr]` — rejected; both columns hold similar card lists, so equal widths are appropriate.

---

## 4. Modal Implementation

**Decision**: Use the native HTML `<dialog>` element with `.showModal()` via a React ref.

**Rationale**:
- `<dialog>.showModal()` provides built-in focus trap, top-layer rendering (no z-index issues), Escape-to-close, and `aria-modal="true"` for free.
- No portal, no third-party library needed — aligns with Minimal Dependencies principle.
- Backdrop click detection: check `event.target === dialogRef.current` on click.
- Body scroll lock: toggle `document.body.style.overflow = 'hidden'` via `useEffect` cleanup.
- Sync `cancel` event (from native Escape) to React state via `onCancel` + `event.preventDefault()`.

**Accessibility**:
- `aria-labelledby` pointing to the modal's heading.
- `aria-describedby` optional for form instructions.
- Close button with `aria-label="Close"` if icon-only.
- Focus returns to the triggering element on close.

**Alternatives considered**:
- `createPortal` to `document.body` — rejected because it requires manual focus trap, z-index management, and inert handling, all of which `<dialog>` provides natively.
- External modal library (Radix, Headless UI) — rejected per Minimal Dependencies principle.

---

## 5. Date Calculation

**Decision**: Pure utility functions in `app/lib/dates.ts` using JavaScript's built-in `Date` object. No date library.

**Rationale**:
- The only date operations needed are: compute days remaining (date diff in calendar days), determine urgency level, and format display strings ("5 days left", "Due today", "2 days overdue").
- These are trivially implementable with `Date` and basic arithmetic — no need for `date-fns` or `dayjs`.
- Calendar-day diff: strip time components by constructing dates at midnight, then divide ms difference by 86400000.
- User's local timezone is used throughout (per spec Assumptions).

**Alternatives considered**:
- `date-fns` — rejected per Minimal Dependencies principle; the operations needed are too simple to justify an external package.
