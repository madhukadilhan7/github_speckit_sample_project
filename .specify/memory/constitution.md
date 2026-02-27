<!--
  Sync Impact Report
  ===================
  Version change: 0.0.0 → 1.0.0 (initial ratification)
  Modified principles: N/A (first version)
  Added sections:
    - Core Principles (5 principles)
    - Technology Stack
    - Development Workflow
    - Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md        ✅ no changes needed (Constitution Check is dynamic)
    - .specify/templates/spec-template.md         ✅ no changes needed (template is generic scaffold)
    - .specify/templates/tasks-template.md        ✅ no changes needed (already marks tests as OPTIONAL)
    - .specify/templates/checklist-template.md    ✅ no changes needed (generic scaffold)
  Follow-up TODOs: none
-->

# my-next-app Constitution

## Core Principles

### I. Clean Code

- All source code MUST be readable, well-structured, and
  self-documenting.
- Functions and components MUST have a single, clear
  responsibility.
- File and variable names MUST convey intent without requiring
  additional comments.
- Dead code, unused imports, and commented-out blocks MUST be
  removed before merging.
- ESLint rules defined in the repository MUST pass with zero
  warnings and zero errors.
- TypeScript strict mode MUST remain enabled; `any` types are
  prohibited unless explicitly justified inline.

### II. Simple UX

- Every user-facing screen MUST be understandable within five
  seconds of first viewing.
- Navigation MUST be flat and predictable — no hidden menus,
  nested modals, or multi-step wizards unless the task
  inherently requires them.
- Interactive elements MUST provide immediate visual feedback
  (loading states, hover cues, disabled states).
- Copy and labels MUST use plain language; technical jargon
  MUST NOT appear in the UI.
- Feature additions MUST NOT increase cognitive load on
  existing screens — prefer progressive disclosure.

### III. Responsive Design

- All pages and components MUST render correctly on viewports
  from 320 px (mobile) to 2560 px (ultra-wide desktop).
- Layout MUST use Tailwind CSS utility classes with a
  mobile-first breakpoint strategy (`sm`, `md`, `lg`, `xl`,
  `2xl`).
- Touch targets MUST be at least 44 × 44 px on mobile
  viewports.
- Images and media MUST use responsive sizing (`next/image`
  or equivalent) to avoid layout shift and unnecessary
  bandwidth.
- No horizontal scrollbars MUST appear at any supported
  viewport width.

### IV. Minimal Dependencies

- The project MUST NOT add npm packages beyond those already
  declared in `package.json` without explicit justification
  and approval.
- The approved runtime dependency set is limited to:
  - **Next.js** 16.1.6
  - **React** 19.2.3
  - **react-dom** 19.2.3
- The approved dev-dependency set is limited to:
  - **tailwindcss** ^4
  - **@tailwindcss/postcss** ^4
  - **typescript** ^5
  - **eslint** ^9 and **eslint-config-next** 16.1.6
  - **@types/node** ^20, **@types/react** ^19,
    **@types/react-dom** ^19
- Before proposing a new dependency, the contributor MUST
  demonstrate that the functionality cannot be achieved with
  the existing stack or a small amount of custom code.

### V. No Testing (NON-NEGOTIABLE)

- This project MUST NOT contain any automated tests of any
  kind — no unit tests, no integration tests, no end-to-end
  tests, no snapshot tests, no contract tests.
- No test runner, test framework, or test utility (e.g., Jest,
  Vitest, Playwright, Cypress, Testing Library) MUST be
  installed as a dependency.
- No `tests/`, `__tests__/`, `*.test.*`, or `*.spec.*` files
  or directories MUST exist in the repository.
- This principle **supersedes** all other guidance, templates,
  and external best-practice recommendations. Any template
  section referencing tests MUST be skipped or removed when
  generating artifacts for this project.
- Rationale: the project owner has explicitly opted out of
  automated testing for this codebase. Quality is maintained
  through clean code, linting, TypeScript strict mode, and
  manual verification.

## Technology Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 4 (via PostCSS)
- **Language**: TypeScript 5 (strict mode)
- **Linting**: ESLint 9 with eslint-config-next
- **Font**: Geist (loaded via `next/font`)
- **Package Manager**: npm (lockfile MUST be committed)
- All code MUST target the versions listed above. Version
  upgrades require a constitution amendment.

## Development Workflow

- Development server is started with `npm run dev`.
- Production builds are created with `npm run build` and
  served with `npm run start`.
- `npm run lint` MUST pass with zero errors before any code
  is considered complete.
- Commits MUST use concise, descriptive messages following
  conventional commit format (e.g., `feat:`, `fix:`,
  `docs:`, `chore:`).
- Feature work SHOULD be done on short-lived branches and
  merged via pull request.

## Governance

- This constitution is the highest-authority document for
  the project. It supersedes all other practices, templates,
  and external recommendations.
- Amendments require:
  1. A written proposal describing the change and its
     rationale.
  2. An updated constitution version following semantic
     versioning (MAJOR for principle removals/redefinitions,
     MINOR for additions/expansions, PATCH for clarifications).
  3. Updated `Last Amended` date.
- All generated plans, specs, and task lists MUST be validated
  against the active constitution before finalization.
- Complexity MUST be justified; prefer the simplest solution
  that satisfies requirements.

**Version**: 1.0.0 | **Ratified**: 2026-02-27 | **Last Amended**: 2026-02-27
