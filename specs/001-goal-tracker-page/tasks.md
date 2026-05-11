# Tasks: DoIt — Goal Tracker Page

**Input**: Design documents from `/specs/001-goal-tracker-page/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: None — prohibited by constitution Principle V (No Testing, NON-NEGOTIABLE). All test-related template sections are skipped.

**Organization**: Tasks are grouped by user story to enable independent implementation and verification of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Next.js App Router: `app/` at repository root
- Components: `app/components/`
- Hooks: `app/hooks/`
- Utilities: `app/lib/`
- Types: `app/types/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialisation — types, utilities, theme tokens, and root layout

- [x] T001 Define Goal interface, Urgency type, and GoalStore interface in app/types/goal.ts
- [x] T002 [P] Implement daysRemaining, getUrgency, and formatDaysRemaining pure functions in app/lib/dates.ts
- [x] T003 [P] Add pastel colour @theme tokens (background, surface, primary, success, warning, danger, text, border) in app/globals.css
- [x] T004 Complete root layout with Geist font, HTML shell, and "DoIt" metadata in app/layout.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core state management and reusable UI primitives that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Implement useGoals custom hook (useSyncExternalStore localStorage sync, addGoal, completeGoal, deleteGoal, storageAvailable, graceful degradation with try-catch) in app/hooks/useGoals.ts
- [x] T006 [P] Create EmptyState component (accepts message prop, pastel styling) in app/components/EmptyState.tsx

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 — View Current & Completed Goals (Priority: P1) 🎯 MVP

**Goal**: Display a two-column responsive layout with Current Goals (left) and Completed Goals (right), each showing goal cards with title and days remaining, using the pastel theme

**Independent Verification**: Open the app → see two labelled columns, goal cards with countdown text, pastel colours, responsive stacking at ≤ 768 px

### Implementation for User Story 1

- [x] T007 [P] [US1] Create GoalCard component (title, days-remaining text via formatDaysRemaining, data-urgency attribute for future highlighting, checkbox placeholder for active / static checkmark for completed, delete button placeholder) in app/components/GoalCard.tsx
- [x] T008 [US1] Create GoalBoard client component ("use client", calls useGoals, renders two-column CSS Grid layout with md:grid-cols-2, column headings "Current Goals" / "Completed Goals", maps activeGoals and completedGoals to GoalCard, renders EmptyState when columns are empty) in app/components/GoalBoard.tsx
- [x] T009 [US1] Update page.tsx to render page header with "DoIt" title and GoalBoard component in app/page.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional — two columns visible, goal cards display title + days remaining, empty states show, pastel theme applied, layout responsive

---

## Phase 4: User Story 2 — Add a New Goal (Priority: P2)

**Goal**: "Add Goal" button opens a native dialog modal with Title and End Date fields; submitting creates a goal that appears in the Current Goals column immediately

**Independent Verification**: Click "Add Goal" → fill Title + End Date → submit → goal appears in Current Goals column with correct countdown

### Implementation for User Story 2

- [x] T010 [US2] Create AddGoalModal component (native HTML dialog element with showModal/close via ref, Title text input with maxLength 200, End Date input type="date", inline validation messages for empty fields, onSubmit calls addGoal from useGoals, onCancel/Escape/backdrop-click closes without creating, aria-labelledby on dialog heading, body scroll lock via useEffect) in app/components/AddGoalModal.tsx
- [x] T011 [US2] Add "Add Goal" button to GoalBoard that opens AddGoalModal, wire addGoal callback, and add localStorage-unavailable banner (when storageAvailable is false) in app/components/GoalBoard.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work — users can add goals and see them rendered in the two-column layout

---

## Phase 5: User Story 3 — Complete a Goal (Priority: P3)

**Goal**: Checking a goal's checkbox in the Current Goals column moves it to the Completed Goals column with a static checkmark; days-remaining indicator is removed

**Independent Verification**: Check a goal's checkbox → it moves to Completed column with static checkmark, no countdown shown

### Implementation for User Story 3

- [x] T012 [US3] Wire checkbox onChange in GoalCard to call completeGoal(id) for active goals; render static checkmark (✓) for completed goals; hide days-remaining text for completed goals in app/components/GoalCard.tsx
- [x] T013 [US3] Pass completeGoal callback from GoalBoard to GoalCard for active goals in app/components/GoalBoard.tsx

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently — full add → view → complete loop

---

## Phase 6: User Story 4 — Delete a Goal (Priority: P4)

**Goal**: Delete button on any goal shows an inline confirmation prompt; confirming permanently removes the goal from both the UI and localStorage

**Independent Verification**: Click delete on any goal → confirmation appears → confirm → goal is permanently removed; cancel → goal remains

### Implementation for User Story 4

- [x] T014 [P] [US4] Create DeleteConfirm component (inline prompt with "Delete this goal permanently?" text, Confirm and Cancel buttons, pastel styling, keyboard accessible) in app/components/DeleteConfirm.tsx
- [x] T015 [US4] Add delete button to GoalCard, toggle DeleteConfirm visibility on click, wire Confirm to deleteGoal(id) and Cancel to dismiss in app/components/GoalCard.tsx
- [x] T016 [US4] Pass deleteGoal callback from GoalBoard to GoalCard for both active and completed goals in app/components/GoalBoard.tsx

**Checkpoint**: At this point, User Stories 1–4 should all work — full add → view → complete → delete loop

---

## Phase 7: User Story 5 — Deadline Highlighting (Priority: P5)

**Goal**: Active goals within 3 days of their end date are highlighted with a pastel warning colour; overdue goals get a stronger visual treatment

**Independent Verification**: Create goals with end dates of today, tomorrow, 3 days from now, 4 days from now, and yesterday → verify correct highlight levels

### Implementation for User Story 5

- [x] T017 [US5] Add Tailwind data-urgency variant styles to GoalCard (data-[urgency=approaching]: warning-light bg + warning border, data-[urgency=due-today]: danger-light bg + danger border, data-[urgency=overdue]: deeper danger bg + danger border + bold text, data-[urgency=on-track]: default surface styling) in app/components/GoalCard.tsx
- [x] T018 [US5] Ensure GoalCard computes urgency from daysRemaining via getUrgency and sets the data-urgency attribute on the card element in app/components/GoalCard.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final quality pass across all user stories

- [x] T019 [P] Run npm run lint and fix any ESLint errors or warnings across all files
- [x] T020 [P] Verify responsive layout at 320 px, 768 px, 1024 px, and 2560 px viewports — fix any horizontal scroll or touch-target issues
- [x] T021 Run npm run build and verify production build succeeds with zero errors
- [x] T022 Walk through quickstart.md verification steps 1–8 manually and fix any issues found

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (types + utilities must exist before useGoals hook)
- **User Stories (Phase 3–7)**: All depend on Phase 2 completion (useGoals hook must exist)
  - User stories can proceed sequentially in priority order (P1 → P2 → P3 → P4 → P5)
  - US3–US5 build on GoalCard from US1, so strict order is recommended
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 — no dependencies on other stories
- **User Story 2 (P2)**: Can start after Phase 2 — independent of US1, but best done after US1 so GoalBoard exists
- **User Story 3 (P3)**: Depends on GoalCard from US1 (adds checkbox behaviour to existing component)
- **User Story 4 (P4)**: Depends on GoalCard from US1 (adds delete button to existing component)
- **User Story 5 (P5)**: Depends on GoalCard from US1 (adds urgency data attribute styling)

### Within Each User Story

- Models/types before hooks
- Hooks before components
- Core components before integration
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1** (all [P] tasks can run in parallel):
- T001, T002, T003 can all run simultaneously (different files, no dependencies)
- T004 depends on T003 (layout imports globals.css)

**Phase 2**:
- T005 depends on T001 (needs Goal type) and T002 (needs date utilities)
- T006 is independent — can run in parallel with T005

**Within User Story 4**:
- T014 (DeleteConfirm component) can be built in parallel with other work since it's a standalone component

---

## Parallel Example: Phase 1 Setup

```text
# Launch these three simultaneously (different files, no dependencies):
T001: "Define Goal interface in app/types/goal.ts"
T002: "Implement date utilities in app/lib/dates.ts"
T003: "Add pastel @theme tokens in app/globals.css"

# Then sequentially:
T004: "Complete root layout in app/layout.tsx" (depends on T003)
```

## Parallel Example: User Story 1

```text
# After Phase 2 is complete:
T007: "Create GoalCard component in app/components/GoalCard.tsx" (standalone)

# Then sequentially:
T008: "Create GoalBoard client component in app/components/GoalBoard.tsx" (depends on T007)
T009: "Update page.tsx" (depends on T008)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VERIFY**: Open the app, confirm two columns render with pastel theme
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Verify independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Verify add-goal modal works → Deploy/Demo
4. Add User Story 3 → Verify complete-goal flow → Deploy/Demo
5. Add User Story 4 → Verify delete-goal flow → Deploy/Demo
6. Add User Story 5 → Verify deadline highlighting → Deploy/Demo
7. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and verifiable
- No automated tests — quality ensured via ESLint, TypeScript strict mode, and manual quickstart verification (per constitution Principle V)
- Commit after each task or logical group
- Stop at any checkpoint to verify story independently
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence
