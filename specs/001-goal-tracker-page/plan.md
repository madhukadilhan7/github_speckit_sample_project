# Implementation Plan: DoIt — Goal Tracker Page

**Branch**: `001-goal-tracker-page` | **Date**: 2026-02-27 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-goal-tracker-page/spec.md`

## Summary

Build the initial DoIt goal-tracking page as a client-side Next.js application. The page features a responsive two-column layout (Current Goals / Completed Goals), an "Add Goal" modal with title and end-date fields, checkbox-based completion (one-way), delete with confirmation, deadline highlighting (≤3 days / overdue), and localStorage persistence. The UI uses a modern light theme with pastel colours. Built entirely with the existing stack: Next.js 16.1.6 (App Router), React 19.2.3, Tailwind CSS 4, TypeScript 5. No new dependencies. No automated tests (per constitution).

## Technical Context

**Language/Version**: TypeScript 5 (strict mode)
**Primary Dependencies**: Next.js 16.1.6 (App Router), React 19.2.3, Tailwind CSS 4 (PostCSS)
**Storage**: Browser localStorage (JSON-serialised goal array)
**Testing**: None — prohibited by constitution (Principle V)
**Target Platform**: Modern browsers (desktop + mobile), viewports 320 px–2560 px
**Project Type**: Web application (single-page, client-side state)
**Performance Goals**: Instant UI updates; no network latency (all client-side)
**Constraints**: Zero new npm dependencies; WCAG AA text contrast for pastel palette; 44 px minimum touch targets on mobile
**Scale/Scope**: Single page, single user, ~100 goals maximum practical use

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Notes |
|---|-----------|--------|-------|
| I | Clean Code | ✅ PASS | Single-responsibility components, descriptive names, strict TS, ESLint zero-error target |
| II | Simple UX | ✅ PASS | Two-column layout understandable in <5 s; flat navigation; modal is justified (single-step form); immediate visual feedback on complete/delete |
| III | Responsive Design | ✅ PASS | Mobile-first Tailwind breakpoints; stacked columns on small viewports; 44 px touch targets; no horizontal scroll |
| IV | Minimal Dependencies | ✅ PASS | Zero new packages — uses only Next.js, React, Tailwind, TypeScript already in package.json |
| V | No Testing | ✅ PASS | No test files, no test frameworks, no test directories. Quality via linting + TS strict mode + manual verification |

**Gate result**: ALL PASS — proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-goal-tracker-page/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A — no external API)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
app/
├── globals.css          # Tailwind import + custom pastel theme tokens
├── layout.tsx           # Root layout: Geist font, metadata, HTML shell
├── page.tsx             # Main DoIt page (server component shell)
├── components/
│   ├── GoalBoard.tsx    # Client component: two-column layout + state
│   ├── GoalCard.tsx     # Single goal card (title, days left, checkbox/checkmark, delete)
│   ├── AddGoalModal.tsx # Modal overlay with form (title + end date)
│   ├── DeleteConfirm.tsx# Inline delete-confirmation prompt
│   └── EmptyState.tsx   # Empty-column placeholder message
├── hooks/
│   └── useGoals.ts      # Custom hook: goal CRUD + localStorage sync
├── lib/
│   └── dates.ts         # Pure functions: daysRemaining, urgency level
└── types/
    └── goal.ts          # Goal interface + urgency enum
```

**Structure Decision**: Next.js App Router with a single `app/` directory. No separate `src/` folder — follows the scaffolded structure already in the repo. Components, hooks, lib, and types are co-located under `app/` for simplicity. No `tests/` directory (constitution Principle V).

## Complexity Tracking

> No constitution violations — this section is intentionally empty.
