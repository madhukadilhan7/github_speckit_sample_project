# Feature Specification: DoIt — Goal Tracker Page

**Feature Branch**: `001-goal-tracker-page`  
**Created**: 2026-02-27  
**Status**: Draft  
**Input**: User description: "initial page setup - this application should be goal tracking web app called 'doit'. There should be two columns - a left one where current goals are shown, along with how many days left the user has to achieve the goal, and a right one where completed goals are. Each goal can be 'checked' using a check box, and then either moved to the completed column or permanently deleted. To add new goals, a user can click on a button to open a new goal form in a modal (Title and end date fields). Goals reaching their end date (within 3 days) are highlighted. Lets use a modern light theme with fun pastel colours."

## User Scenarios *(mandatory)*

### User Story 1 — View Current & Completed Goals (Priority: P1)

A user opens the DoIt app and immediately sees a two-column layout. The left column ("Current Goals") lists every active goal with its title and the number of days remaining until its end date. The right column ("Completed Goals") lists goals that have been checked off. The layout uses a modern light theme with pastel accent colours.

**Why this priority**: Without the ability to view goals in the two-column layout, no other feature has a surface to operate on. This is the foundational viewport for the entire app.

**Independent Verification**: Open the app with a mix of active and completed goals already present. Confirm the two columns render correctly, each goal shows the right data, and the pastel theme is visible.

**Acceptance Scenarios**:

1. **Given** the app has three active goals and two completed goals, **When** the user opens the page, **Then** the left column shows three goals each displaying title and days remaining, and the right column shows two completed goals.
2. **Given** an active goal has an end date of tomorrow, **When** the page renders, **Then** that goal displays "1 day left".
3. **Given** the user views the page on a 375 px mobile viewport, **When** the page loads, **Then** the two columns stack vertically and remain fully usable without horizontal scrolling.
4. **Given** the page loads, **When** the user inspects the UI, **Then** the background, cards, and accents use a light theme with pastel colour palette.

---

### User Story 2 — Add a New Goal (Priority: P2)

A user clicks an "Add Goal" button visible on the page. A modal appears containing a form with two fields: Title and End Date. After filling in both fields and submitting, the modal closes and the new goal immediately appears in the Current Goals column with the correct days-remaining count.

**Why this priority**: Users cannot track anything until they can create goals. This is the primary write operation and the gateway to all other interactions.

**Independent Verification**: Click the "Add Goal" button, fill in a title and an end date, submit, and confirm the goal appears in the Current Goals column with the correct countdown.

**Acceptance Scenarios**:

1. **Given** the user is on the main page, **When** they click "Add Goal", **Then** a modal opens with Title (text) and End Date (date picker) fields and a Submit button.
2. **Given** the modal is open, **When** the user submits without a title, **Then** the form shows a validation message and does not close.
3. **Given** the modal is open, **When** the user submits without an end date, **Then** the form shows a validation message and does not close.
4. **Given** the modal is open with valid data, **When** the user submits, **Then** the modal closes and the new goal appears at the top of the Current Goals column with the correct days-remaining value.
5. **Given** the modal is open, **When** the user clicks outside the modal or presses Escape, **Then** the modal closes without creating a goal.

---

### User Story 3 — Complete a Goal (Priority: P3)

A user checks the checkbox next to an active goal. The goal moves from the Current Goals column to the Completed Goals column. The days-remaining indicator is no longer shown for that goal.

**Why this priority**: Completing goals is the core value loop — without this, the tracker is just a static list. It depends on goals existing (US1/US2).

**Independent Verification**: With at least one active goal visible, check its checkbox and confirm it moves to the Completed Goals column.

**Acceptance Scenarios**:

1. **Given** an active goal exists in the Current Goals column, **When** the user checks its checkbox, **Then** the goal moves to the Completed Goals column.
2. **Given** a goal has just been completed, **When** it appears in the Completed Goals column, **Then** it no longer displays a days-remaining count.
3. **Given** only one active goal exists, **When** the user completes it, **Then** the Current Goals column shows an appropriate empty-state message (e.g., "No active goals — add one!").

---

### User Story 4 — Delete a Goal (Priority: P4)

A user can permanently delete a goal from either the Current Goals or Completed Goals column. After deletion, the goal is removed from view and cannot be recovered.

**Why this priority**: Deletion is a secondary action that keeps lists tidy. It's important but not essential for the core view → create → complete loop.

**Independent Verification**: Locate a goal in either column, trigger deletion, and confirm the goal disappears permanently.

**Acceptance Scenarios**:

1. **Given** an active goal exists, **When** the user clicks the delete action on that goal, **Then** a confirmation prompt appears asking "Delete this goal permanently?".
2. **Given** the confirmation prompt is showing, **When** the user confirms, **Then** the goal is removed from the list and does not reappear.
3. **Given** the confirmation prompt is showing, **When** the user cancels, **Then** the goal remains in its current column.
4. **Given** a completed goal exists, **When** the user clicks delete on it, **Then** the same confirmation and removal flow applies.

---

### User Story 5 — Deadline Highlighting (Priority: P5)

Goals whose end date is within 3 days (including today) are visually highlighted in the Current Goals column to draw the user's attention. Goals that are past their end date receive an even stronger visual warning.

**Why this priority**: Highlighting is a polish/awareness feature that depends on goals already being visible (US1). It enhances usability but is not blocking.

**Independent Verification**: Create goals with end dates of today, tomorrow, 3 days from now, 4 days from now, and yesterday. Confirm only the first three (and the overdue one) receive visual emphasis of the appropriate level.

**Acceptance Scenarios**:

1. **Given** an active goal has an end date exactly 3 days from today, **When** the page renders, **Then** the goal card is highlighted with a distinct pastel warning colour (e.g., soft amber/orange).
2. **Given** an active goal has an end date of today, **When** the page renders, **Then** the goal card is highlighted with an urgent colour (e.g., soft red/coral).
3. **Given** an active goal has an end date more than 3 days away, **When** the page renders, **Then** the goal card uses the default styling with no highlight.
4. **Given** an active goal is past its end date (overdue), **When** the page renders, **Then** the goal card is highlighted with the strongest warning (e.g., deeper red tint) and shows a negative days count like "1 day overdue".

---

### Edge Cases

- What happens when the user creates a goal with an end date in the past? The goal is accepted and immediately shown as overdue with the appropriate highlight colour.
- What happens when there are zero goals in either column? An empty-state message is displayed (e.g., "No active goals — add one!" or "No completed goals yet").
- What happens when the user creates a goal with today's date? It is treated as due today (0 days left) and receives the urgent highlight.
- What happens when the title is very long (200+ characters)? The title is truncated with an ellipsis in the card view; the full title is visible on hover or via a tooltip.
- What happens when the browser's date/timezone changes? Days remaining is calculated using the user's local date at the time of page render.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST display a page titled "DoIt" with two clearly labelled columns — "Current Goals" (left) and "Completed Goals" (right).
- **FR-002**: Each current goal card MUST display the goal title and the number of days remaining until the end date (e.g., "5 days left", "Due today", "2 days overdue").
- **FR-003**: The page MUST include an "Add Goal" button that opens a modal overlay.
- **FR-004**: The new-goal modal MUST contain a Title text field and an End Date date-picker field, both required, plus a Submit button.
- **FR-005**: Both fields MUST be validated before submission; appropriate inline error messages MUST appear if either is empty.
- **FR-006**: On successful submission, the modal MUST close and the new goal MUST appear in the Current Goals column immediately (no page reload).
- **FR-007**: The modal MUST close without creating a goal when the user clicks outside it or presses Escape.
- **FR-008**: Each goal in the Current Goals column MUST have a checkbox. Checking it MUST move the goal to the Completed Goals column.
- **FR-009**: Each goal in both columns MUST have a delete action. Clicking it MUST show a confirmation prompt before permanently removing the goal.
- **FR-010**: Active goals whose end date is within 3 calendar days (inclusive) of today MUST be visually highlighted with a warning colour.
- **FR-011**: Active goals that are past their end date MUST be visually highlighted with a stronger warning colour and display a negative days count (e.g., "2 days overdue").
- **FR-012**: The UI MUST use a modern light theme with a pastel colour palette for backgrounds, cards, and accent elements.
- **FR-013**: The layout MUST be responsive: two side-by-side columns on medium-and-above viewports, stacked vertically on small/mobile viewports.
- **FR-014**: Goal data MUST persist across page refreshes within the same browser session (client-side storage is acceptable for this initial version).
- **FR-015**: Empty columns MUST display a friendly empty-state message.

### Key Entities

- **Goal**: Represents a single objective. Attributes: unique identifier, title (string, required, max 200 characters), end date (date, required), completed status (boolean, default false), creation timestamp.

## Assumptions

- This is a single-user, client-side application. No authentication, multi-user support, or server-side persistence is needed for this initial feature.
- Data is stored in the browser (e.g., localStorage). Loss of data on clearing browser storage is acceptable.
- The pastel colour palette is at the discretion of the implementer as long as it meets basic contrast/readability standards (WCAG AA for text).
- "Days remaining" uses calendar days (not hours), based on the user's local timezone.
- Goal titles are capped at 200 characters; longer input is prevented at the form level.
- The delete confirmation is a simple in-app prompt (not a browser `confirm()` dialog) to maintain visual consistency.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can add a new goal, see it in the Current Goals column, complete it, and see it move to the Completed Goals column — all within 30 seconds on first use.
- **SC-002**: The two-column layout renders correctly and without horizontal scrollbars on viewports from 320 px to 2560 px wide.
- **SC-003**: 100 % of active goals within 3 days of their end date are visually distinguishable from non-urgent goals without reading the text.
- **SC-004**: Goal data survives a page refresh in the same browser with no data loss.
- **SC-005**: The "Add Goal" modal can be opened, filled, and submitted in under 10 seconds.
- **SC-006**: 90 % of first-time users can identify how to add, complete, and delete a goal without any external instructions (the UI is self-explanatory).
