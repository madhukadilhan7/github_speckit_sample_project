# Quickstart: DoIt — Goal Tracker Page

**Branch**: `001-goal-tracker-page` | **Date**: 2026-02-27

## Prerequisites

- **Node.js** ≥ 18 (LTS)
- **npm** ≥ 9

## Setup

```bash
# Clone and switch to the feature branch
git clone <repo-url>
cd my-next-app
git checkout 001-goal-tracker-page

# Install dependencies
npm install
```

## Run

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Verify

1. The page loads with the title "DoIt" and two columns: "Current Goals" (left) and "Completed Goals" (right).
2. Both columns show an empty-state message.
3. Click **"Add Goal"** → a modal opens with Title and End Date fields.
4. Enter a title and a date 2 days from now → submit → the goal appears in the Current Goals column with "2 days left" and a warning highlight.
5. Check the goal's checkbox → it moves to the Completed Goals column with a static checkmark.
6. Click the delete icon on the completed goal → confirm → the goal is permanently removed.
7. Refresh the page → goals persist (unless step 6 already deleted them — add another to test persistence).
8. Resize the browser to ≤ 768 px → columns stack vertically.

## Lint

```bash
npm run lint
```

Must pass with zero errors and zero warnings.

## Build

```bash
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to verify the production build.

## Key Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Main page (server component shell) |
| `app/components/GoalBoard.tsx` | Client component: two-column layout + state management |
| `app/components/GoalCard.tsx` | Individual goal card (title, countdown, actions) |
| `app/components/AddGoalModal.tsx` | Native `<dialog>` modal with form |
| `app/components/DeleteConfirm.tsx` | Inline delete confirmation prompt |
| `app/components/EmptyState.tsx` | Empty-column placeholder |
| `app/hooks/useGoals.ts` | Goal CRUD + localStorage persistence |
| `app/lib/dates.ts` | Date utility functions (days remaining, urgency) |
| `app/types/goal.ts` | TypeScript interfaces and enums |
| `app/globals.css` | Tailwind import + `@theme` pastel colour tokens |
